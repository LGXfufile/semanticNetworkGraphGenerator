export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // 只接受POST请求
  if (req.method !== 'POST') {
    console.log('❌ 收到非POST请求:', req.method);
    return res.status(405).json({ 
      error: 'Method not allowed', 
      method: req.method,
      allowed: ['POST', 'OPTIONS'] 
    });
  }

  // 获取环境变量
  const WEBHOOK_URL = process.env.WECHAT_WEBHOOK_URL;
  
  // 记录调试信息
  console.log('=== 通知API调用 ===');
  console.log('时间:', new Date().toISOString());
  console.log('请求头:', req.headers);
  console.log('请求体:', req.body);
  console.log('环境变量配置:', !!WEBHOOK_URL);
  
  if (!WEBHOOK_URL) {
    console.error('❌ 环境变量WECHAT_WEBHOOK_URL未配置');
    return res.status(500).json({ 
      error: 'Webhook URL not configured',
      message: '请在Vercel中配置WECHAT_WEBHOOK_URL环境变量'
    });
  }

  try {
    const { action, fileInfo = {} } = req.body || {};
    
    if (!action) {
      return res.status(400).json({ 
        error: 'Missing action parameter',
        message: '请求体中缺少action参数'
      });
    }
    
    // 获取客户端信息
    const clientIP = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.connection?.remoteAddress ||
                     'unknown';
    
    const userAgent = req.headers['user-agent'] || 'unknown';
    const timestamp = new Date().toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai'
    });

    // 根据操作类型构建消息
    let message = '';
    
    switch(action) {
      case 'upload':
        message = `📁 **文件上传通知**

⏰ 时间: ${timestamp}
🌐 IP: ${clientIP}
📊 数据: ${fileInfo.nodeCount || 0}个节点, ${fileInfo.linkCount || 0}条边
📝 文件: ${fileInfo.fileName || '未知'}
📋 数据行: ${fileInfo.dataRows || 0}行

🔗 https://semnetworkgraph.store`;
        break;
        
      case 'download':
        message = `🖼️ **图片下载通知**

⏰ 时间: ${timestamp}
🌐 IP: ${clientIP}
📊 图表: ${fileInfo.nodeCount || 0}个节点, ${fileInfo.linkCount || 0}条边
📝 文件: ${fileInfo.fileName || '未知'}

🔗 https://semnetworkgraph.store`;
        break;
        
      case 'template_download':
        message = `📥 **模版下载通知**

⏰ 时间: ${timestamp}
🌐 IP: ${clientIP}
📋 操作: 下载数据模版

🔗 https://semnetworkgraph.store`;
        break;
        
      case 'page_visit':
        message = `👀 **页面访问通知**

⏰ 时间: ${timestamp}
🌐 IP: ${clientIP}
🔧 浏览器: ${userAgent}

🔗 https://semnetworkgraph.store`;
        break;
        
      default:
        message = `❓ **未知操作通知**

⏰ 时间: ${timestamp}
🌐 IP: ${clientIP}
🔧 操作: ${action}

🔗 https://semnetworkgraph.store`;
    }

    // 准备发送数据
    const payload = {
      msgtype: 'text',
      text: {
        content: message
      }
    };

    console.log('📤 发送消息:', message);
    console.log('📡 发送到:', WEBHOOK_URL.substring(0, 50) + '...');

    // 发送到企业微信
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    
    console.log('📨 微信响应:', {
      status: response.status,
      statusText: response.statusText,
      body: responseText
    });

    if (response.ok) {
      try {
        const result = JSON.parse(responseText);
        if (result.errcode === 0) {
          console.log('✅ 通知发送成功');
          return res.status(200).json({ 
            success: true, 
            message: 'Notification sent successfully',
            timestamp: timestamp
          });
        } else {
          console.error('❌ 微信API错误:', result);
          return res.status(500).json({ 
            error: 'WeChat API Error', 
            details: result,
            message: `微信API返回错误: ${result.errmsg || '未知错误'}`
          });
        }
      } catch (parseError) {
        console.error('❌ 解析微信响应失败:', parseError);
        return res.status(500).json({ 
          error: 'Failed to parse WeChat response', 
          details: responseText 
        });
      }
    } else {
      console.error('❌ HTTP错误:', response.status, responseText);
      return res.status(500).json({ 
        error: 'HTTP Error', 
        status: response.status,
        statusText: response.statusText,
        details: responseText 
      });
    }

  } catch (error) {
    console.error('🚨 通知发送异常:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
} 