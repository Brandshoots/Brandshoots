const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

async function captureScreenshots() {
  const artifactDir = 'C:/Users/SURYARAJA/.gemini/antigravity/brain/cd1ca2b0-a812-41d9-bd25-1104d25cfeb7';

  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const captures = [
    { name: 'speed_war_homepage_live.png', url: 'http://localhost:5173/?nopreload', wait: 2000 },
    { name: 'speed_war_portfolio_live.png', url: 'http://localhost:5173/portfolio?nopreload', wait: 2500 },
    { name: 'speed_war_about_live.png', url: 'http://localhost:5173/about?nopreload', wait: 2000 },
    { name: 'speed_war_contact_live.png', url: 'http://localhost:5173/contact?nopreload', wait: 2000 }
  ];

  for (const c of captures) {
    console.log(`Navigating to ${c.url}...`);
    await page.goto(c.url, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, c.wait));
    const outPath = path.join(artifactDir, c.name);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Saved screenshot: ${c.name}`);
  }

  await browser.close();
  console.log('Visual integrity verification complete!');
}

captureScreenshots().catch(console.error);
