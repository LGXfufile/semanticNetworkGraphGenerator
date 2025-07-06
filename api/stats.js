// 简单的访问统计API
let dailyStats = {
  visits: 0,
  uploads: 0,
  downloads: 0,
  lastReset: new Date().toDateString()
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const today = new Date().toDateString();
  
  // 如果是新的一天，重置统计
  if (dailyStats.lastReset !== today) {
    dailyStats = {
      visits: 0,
      uploads: 0,
      downloads: 0,
      lastReset: today
    };
  }
  
  if (req.method === 'POST') {
    const { action } = req.body;
    
    switch(action) {
      case 'visit':
        dailyStats.visits++;
        break;
      case 'upload':
        dailyStats.uploads++;
        break;
      case 'download':
        dailyStats.downloads++;
        break;
    }
    
    return res.status(200).json({ success: true, stats: dailyStats });
  }
  
  if (req.method === 'GET') {
    return res.status(200).json(dailyStats);
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
} 