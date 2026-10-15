const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1200 });

  const logos = [
    { name: 'Jain Beauty Studio', src: 'http://localhost:5173/clients/Jain%20Beauty%20Logo.png' },
    { name: 'RK Home Living', src: 'http://localhost:5173/clients/Rk%20home.png' },
    { name: 'SB Ventures', src: 'http://localhost:5173/clients/SB%20Ventures%20Logo.png' },
    { name: 'Santhi Pipes', src: 'http://localhost:5173/clients/Shanti%20Pipes.png' },
    { name: 'Viswatuff Glass', src: 'http://localhost:5173/clients/IMG_4537.PNG' },
    { name: 'SRK Doors World', src: 'http://localhost:5173/clients/SRK%20Doors%20World%20Logo.png' },
    { name: 'T3 Studio', src: 'http://localhost:5173/clients/T3%20Logo.png' },
    { name: 'KC Overseas', src: 'http://localhost:5173/clients/KC%20Overseas%20Logo.PNG' },
    { name: 'Bags World', src: 'http://localhost:5173/clients/Bags%20World%20Logo.PNG' },
    { name: 'Fresh & Fresh', src: 'http://localhost:5173/clients/Fresh%20and%20Fresh%20Logo.png' },
    { name: 'Aabharan Jewellers', src: 'http://localhost:5173/clients/Aabharan%20Logo.png' },
    { name: 'Dayanidhi Creations', src: 'http://localhost:5173/clients/Dayanidhi%20Logo.png' },
    { name: 'Jain Enterprises', src: 'http://localhost:5173/clients/Jain%20Enterprises%20Logo.png' },
    { name: 'Nirmala', src: 'http://localhost:5173/clients/Nirmala%20logo.png' },
    { name: 'Rudra', src: 'http://localhost:5173/clients/Rudra%20logo.png' },
    { name: 'Sahana', src: 'http://localhost:5173/clients/Sahana%20Logo.PNG' },
  ];

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { background: #020306; color: white; font-family: sans-serif; padding: 30px; margin: 0; }
      h2 { font-size: 18px; margin: 20px 0 10px 0; color: #008CFF; }
      .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 30px; }
      .card {
        width: 100%; height: 165px; padding: 12px; border-radius: 16px;
        background: #090E17; border: 1px solid rgba(255,255,255,0.15);
        display: flex; flex-direction: column; justify-content: space-between;
      }
      .white-box {
        width: 100%; flex: 1; border-radius: 12px; background: white;
        display: flex; align-items: center; justify-content: center;
        overflow: hidden; padding: 6px; position: relative;
      }
      .logo-filled {
        width: 100%; height: 100%; object-fit: contain;
      }
      .title { font-size: 11px; font-weight: bold; text-align: center; margin-top: 8px; letter-spacing: 0.1em; color: #eee; }
    </style>
  </head>
  <body>
    <h2>ALL 16 LOGOS FILLED IN WHITE TILE (w-full h-full object-fit: contain, padding: 6px)</h2>
    <div class="grid">
      ${logos.map(l => `
        <div class="card">
          <div class="white-box">
            <img class="logo-filled" src="${l.src}" />
          </div>
          <div class="title">${l.name}</div>
        </div>
      `).join('')}
    </div>
  </body>
  </html>
  `;

  await page.setContent(html);
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'reports/all_16_logos_filled.png', fullPage: true });
  await browser.close();
  console.log('Saved reports/all_16_logos_filled.png');
})();
