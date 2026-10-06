const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  const outPath = path.resolve(__dirname, '../reports/hero_live_screenshot.png');
  await page.screenshot({ path: outPath });
  console.log('Saved to', outPath);
  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
