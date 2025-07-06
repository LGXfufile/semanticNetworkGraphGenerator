export default async function handler(req, res) {
  // 设置CORS头，允许跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const WEBHOOK_URL = process.env.WECHAT_WEBHOOK_URL;
  
  if (!WEBHOOK_URL) {
    return res.status(500).json({ error: 'Webhook URL not configured' });
  }

  try {
    const { action, userInfo, fileInfo, deviceInfo } = req.body;
    
    // 获取用户信息
    const userIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    const referer = req.headers['referer'] || '';
    const timestamp = new Date().toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // 解析设备信息
    const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
    const deviceType = isMobile ? '📱 移动设备' : '💻 桌面设备';
    
    // 解析浏览器信息
    let browser = '未知浏览器';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    // 解析操作系统
    let os = '未知系统';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    let message = '';
    
    if (action === 'upload') {
      // 分析数据特征
      const dataAnalysis = analyzeData(fileInfo);
      
      message = `🔔 **用户上传文件通知**

📅 **时间信息**
   • 操作时间：${timestamp}
   • 时区：北京时间 (UTC+8)

👤 **用户信息**
   • IP地址：${userIP}
   • ${deviceType}
   • 浏览器：${browser}
   • 操作系统：${os}

📊 **文件详情**
   • 📁 文件大小：${fileInfo.fileSize || '未知'}
   • 📋 数据行数：${fileInfo.dataRows || 0} 行
   • 🔗 节点总数：${fileInfo.nodeCount || 0} 个
   • 📈 关系总数：${fileInfo.linkCount || 0} 条
   • 📝 文件名：${fileInfo.fileName || '未知'}

🎯 **数据分析**
   • 节点类型：${dataAnalysis.nodeTypes}
   • 关系类型：${dataAnalysis.relationTypes}
   • 数据质量：${dataAnalysis.dataQuality}
   • 网络密度：${dataAnalysis.networkDensity}

🌐 **访问来源**
   • 网站：https://semnetworkgraph.store
   • 来源页面：${referer || '直接访问'}

---
💡 *用户正在使用语义网络图生成器*`;

    } else if (action === 'download') {
      message = `🖼️ **用户下载图片通知**

📅 **时间信息**
   • 下载时间：${timestamp}
   • 时区：北京时间 (UTC+8)

👤 **用户信息**
   • IP地址：${userIP}
   • ${deviceType}
   • 浏览器：${browser}
   • 操作系统：${os}

📊 **图表信息**
   • 🔗 节点数量：${fileInfo.nodeCount || 0} 个
   • 📈 关系数量：${fileInfo.linkCount || 0} 条
   • 🎨 图片格式：PNG
   • 📐 图片尺寸：${fileInfo.imageSize || '未知'}
   • 💾 预估大小：${estimateImageSize(fileInfo)} KB

🎯 **使用统计**
   • 从上传到下载：${fileInfo.usageTime || '未知'}
   • 操作流程：完整 ✅

🌐 **访问信息**
   • 网站：https://semnetworkgraph.store
   • 来源页面：${referer || '直接访问'}

---
🎉 *用户成功完成了完整的使用流程*`;

    } else if (action === 'template_download') {
      message = `📥 **用户下载模版通知**

📅 **时间信息**
   • 下载时间：${timestamp}

👤 **用户信息**
   • IP地址：${userIP}
   • ${deviceType}
   • 浏览器：${browser}

📋 **模版信息**
   • 📁 模版类型：Excel数据模版
   • 📊 包含示例：6行示例数据
   • 💡 用户状态：新用户/学习阶段

🌐 **网站：** https://semnetworkgraph.store

---
🆕 *可能是新用户，正在了解使用方法*`;

    } else if (action === 'page_visit') {
      message = `👀 **用户访问页面通知**

📅 **访问时间：** ${timestamp}
👤 **用户信息：** ${userIP} (${deviceType})
🌐 **访问页面：** https://semnetworkgraph.store
📱 **设备信息：** ${browser} on ${os}

---
🔍 *用户正在浏览网站*`;
    }

    // 发送到企业微信
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        msgtype: 'markdown',
        markdown: {
          content: message
        }
      })
    });

    if (response.ok) {
      res.status(200).json({ success: true, message: 'Notification sent' });
    } else {
      const errorText = await response.text();
      console.error('WeChat API Error:', errorText);
      res.status(500).json({ error: 'Failed to send notification' });
    }
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// 数据分析函数
function analyzeData(fileInfo) {
  const nodeCount = fileInfo.nodeCount || 0;
  const linkCount = fileInfo.linkCount || 0;
  const dataRows = fileInfo.dataRows || 0;
  
  // 计算网络密度
  const maxPossibleLinks = nodeCount * (nodeCount - 1) / 2;
  const networkDensity = maxPossibleLinks > 0 ? 
    ((linkCount / maxPossibleLinks) * 100).toFixed(1) + '%' : '0%';
  
  // 节点类型分析
  const nodeTypes = fileInfo.nodeTypes ? 
    Object.keys(fileInfo.nodeTypes).join(', ') : '未分析';
  
  // 关系类型分析
  const relationTypes = fileInfo.relationTypes ? 
    Object.keys(fileInfo.relationTypes).join(', ') : '未分析';
  
  // 数据质量评估
  let dataQuality = '优秀';
  if (nodeCount < 5) dataQuality = '较少';
  else if (nodeCount < 20) dataQuality = '适中';
  else if (nodeCount < 100) dataQuality = '丰富';
  else dataQuality = '超大规模';
  
  return {
    nodeTypes,
    relationTypes,
    dataQuality,
    networkDensity
  };
}

// 估算图片大小
function estimateImageSize(fileInfo) {
  const nodeCount = fileInfo.nodeCount || 0;
  const linkCount = fileInfo.linkCount || 0;
  // 简单估算：基础大小 + 节点数 * 2 + 边数 * 1
  const estimatedSize = 50 + nodeCount * 2 + linkCount * 1;
  return Math.max(estimatedSize, 30);
} 