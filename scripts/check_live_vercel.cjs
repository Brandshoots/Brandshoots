const https = require('https');

const agent = new https.Agent({ rejectUnauthorized: false });

const options = {
  hostname: 'brandshoots-2026.vercel.app',
  path: '/?v=' + Date.now(),
  agent,
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    console.log('x-vercel-id:', res.headers['x-vercel-id'] || 'None');
    console.log('Age:', res.headers['age'] || 'None');
    console.log('Cache-Control:', res.headers['cache-control'] || 'None');
    console.log('Includes async font comment:', data.includes('Zero Render-Blocking Asynchronous Delivery'));
    
    const jsMatch = data.match(/\/assets\/index-[a-zA-Z0-9_\-]+\.js/);
    console.log('Live Entry Script:', jsMatch ? jsMatch[0] : 'None found');

    const cssMatch = data.match(/\/assets\/index-[a-zA-Z0-9_\-]+\.css/);
    console.log('Live Entry CSS:', cssMatch ? cssMatch[0] : 'None found');
  });
}).on('error', (err) => {
  console.error('Request error:', err.message);
});
