export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 获取环境变量
  const WEBHOOK_URL = process.env.WECHAT_WEBHOOK_URL;
  
  // 调试信息
  console.log('Environment check:', {
    hasWebhookUrl: !!WEBHOOK_URL,
    webhookUrlLength: WEBHOOK_URL ? WEBHOOK_URL.length : 0,
    webhookUrlPrefix: WEBHOOK_URL ? WEBHOOK_URL.substring(0, 50) + '...' : 'undefined'
  });
  
  if (!WEBHOOK_URL) {
    console.error('WECHAT_WEBHOOK_URL not found in environment variables');
    return res.status(500).json({ 
      error: 'Webhook URL not configured',
      debug: 'Environment variable WECHAT_WEBHOOK_URL is missing'
    });
  }

  try {
    const { action, userInfo, fileInfo, deviceInfo } = req.body;
    
    // 获取用户信息
    const userIP = req.headers['x-forwarded-for'] || 
                   req.headers['x-real-ip'] || 
                   req.connection.remoteAddress || 
                   'unknown';
    
    const timestamp = new Date().toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    // 构建消息内容
    let message = '';
    
    if (action === 'upload') {
      message = `🔔 **用户上传文件通知**

📅 **时间：** ${timestamp}
👤 **用户IP：** ${userIP}
📊 **文件信息：**
   • 节点数：${fileInfo.nodeCount || 0}
   • 边数：${fileInfo.linkCount || 0}
   • 数据行数：${fileInfo.dataRows || 0}
   • 文件名：${fileInfo.fileName || '未知'}

🌐 **网站：** https://semnetworkgraph.store

---
*语义网络图生成器使用通知*`;

    } else if (action === 'download') {
      message = `🖼️ **用户下载图片通知**

📅 **时间：** ${timestamp}
👤 **用户IP：** ${userIP}
📊 **图表信息：**
   • 节点数：${fileInfo.nodeCount || 0}
   • 边数：${fileInfo.linkCount || 0}

🌐 **网站：** https://semnetworkgraph.store

---
*用户完成了完整使用流程*`;

    } else if (action === 'page_visit') {
      message = `👀 **用户访问通知**

📅 **时间：** ${timestamp}
👤 **用户IP：** ${userIP}
🌐 **网站：** https://semnetworkgraph.store

---
*新用户访问*`;

    } else if (action === 'template_download') {
      message = `📥 **用户下载模版通知**

📅 **时间：** ${timestamp}
👤 **用户IP：** ${userIP}
📋 **操作：** 下载数据模版

🌐 **网站：** https://semnetworkgraph.store

---
*用户正在学习使用方法*`;
    }

    // 准备发送的数据
    const payload = {
      msgtype: 'markdown',
      markdown: {
        content: message
      }
    };

    console.log('Sending notification:', {
      action,
      webhookUrl: WEBHOOK_URL.substring(0, 50) + '...',
      messageLength: message.length,
      payload: JSON.stringify(payload).substring(0, 200) + '...'
    });

    // 发送到企业微信
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    
    console.log('WeChat API Response:', {
      status: response.status,
      statusText: response.statusText,
      response: responseText
    });

    if (response.ok) {
      const responseData = JSON.parse(responseText);
      if (responseData.errcode === 0) {
        console.log('Notification sent successfully');
        return res.status(200).json({ 
          success: true, 
          message: 'Notification sent successfully' 
        });
      } else {
        console.error('WeChat API Error:', responseData);
        return res.status(500).json({ 
          error: 'WeChat API Error', 
          details: responseData 
        });
      }
    } else {
      console.error('HTTP Error:', response.status, responseText);
      return res.status(500).json({ 
        error: 'HTTP Error', 
        status: response.status,
        details: responseText 
      });
    }
  } catch (error) {
    console.error('Notification error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}