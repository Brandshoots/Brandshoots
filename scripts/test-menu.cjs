const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');

async function testMenu() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const btn = await page.$('button[aria-label="Open Navigation Menu"]');
  if (btn) {
    await btn.click();
    await new Promise(r => setTimeout(r, 600));
    const outPath = path.resolve(__dirname, '../reports/mobile_menu_open.png');
    await page.screenshot({ path: outPath });
    console.log(`Saved ${outPath}`);
  } else {
    console.log('Button not found');
  }

  await browser.close();
}

testMenu().catch(console.error);
