export default async function handler(req, res) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const WEBHOOK_URL = process.env.WECHAT_WEBHOOK_URL;
  
  console.log('=== 测试API调用 ===');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('WEBHOOK_URL exists:', !!WEBHOOK_URL);
  console.log('WEBHOOK_URL length:', WEBHOOK_URL ? WEBHOOK_URL.length : 0);
  
  if (!WEBHOOK_URL) {
    return res.status(500).json({
      error: 'WECHAT_WEBHOOK_URL not found',
      env: Object.keys(process.env).filter(key => key.includes('WECHAT'))
    });
  }

  try {
    const message = `🧪 **线上测试通知**

📅 **时间：** ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
🔧 **来源：** Vercel Serverless Function
✅ **状态：** API调用成功
🌐 **网站：** https://semnetworkgraph.store

---
*如果收到此消息，说明线上API工作正常*`;

    const payload = {
      msgtype: 'markdown',
      markdown: {
        content: message
      }
    };

    console.log('发送payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    console.log('微信API响应:', {
      status: response.status,
      statusText: response.statusText,
      body: responseText
    });

    return res.status(200).json({
      success: response.ok,
      status: response.status,
      response: responseText,
      webhookUrl: WEBHOOK_URL.substring(0, 50) + '...',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('测试API错误:', error);
    return res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
} 