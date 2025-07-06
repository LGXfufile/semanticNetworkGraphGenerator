export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 企业微信群机器人Webhook URL
  const WEBHOOK_URL = process.env.WECHAT_WEBHOOK_URL;
  
  if (!WEBHOOK_URL) {
    return res.status(500).json({ error: 'Webhook URL not configured' });
  }

  try {
    const { action, userInfo, fileInfo } = req.body;
    
    // 获取用户IP和时间
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const timestamp = new Date().toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai'
    });

    let message = '';
    
    if (action === 'upload') {
      message = `🔔 **用户上传文件通知**
      
📅 时间：${timestamp}
🌐 IP地址：${userIP}
📁 操作：上传Excel文件
📊 文件信息：
   - 节点数：${fileInfo.nodeCount || '未知'}
   - 边数：${fileInfo.linkCount || '未知'}
   - 数据行数：${fileInfo.dataRows || '未知'}
🔗 网站：https://semnetworkgraph.store`;
    } else if (action === 'download') {
      message = `🔔 **用户下载图片通知**
      
📅 时间：${timestamp}
🌐 IP地址：${userIP}
🖼️ 操作：下载网络图片
📊 图表信息：
   - 节点数：${fileInfo.nodeCount || '未知'}
   - 边数：${fileInfo.linkCount || '未知'}
🔗 网站：https://semnetworkgraph.store`;
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
      res.status(500).json({ error: 'Failed to send notification' });
    }
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 