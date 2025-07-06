export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const WEBHOOK_URL = process.env.WECHAT_WEBHOOK_URL;
  
  if (!WEBHOOK_URL) {
    return res.status(500).json({ error: 'Webhook URL not configured' });
  }
  
  try {
    // 获取今日统计数据
    const statsResponse = await fetch(`${req.headers.origin}/api/stats`);
    const stats = await statsResponse.json();
    
    const today = new Date().toLocaleDateString('zh-CN');
    
    const message = `📊 **每日使用统计报告**

📅 **日期：** ${today}

📈 **今日数据**
   • 👀 页面访问：${stats.visits} 次
   • 📁 文件上传：${stats.uploads} 次
   • 🖼️ 图片下载：${stats.downloads} 次
   • 📊 转化率：${stats.visits > 0 ? ((stats.downloads / stats.visits) * 100).toFixed(1) : 0}%

🎯 **使用分析**
   • 完整流程用户：${stats.downloads} 人
   • 仅浏览用户：${stats.visits - stats.uploads} 人
   • 上传成功率：${stats.uploads > 0 ? ((stats.downloads / stats.uploads) * 100).toFixed(1) : 0}%

🌐 **网站：** https://semnetworkgraph.store

---
📋 *每日自动统计报告*`;

    await fetch(WEBHOOK_URL, {
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
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Daily report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 