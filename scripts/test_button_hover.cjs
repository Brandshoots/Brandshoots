const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  const isLoginPage = await page.$('input[type="password"]');
  if (isLoginPage) {
    await page.type('input[placeholder*="username" i], input[type="text"]', 'admin');
    await page.type('input[type="password"]', 'BD@admin2026');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 1500));
  }

  // 1. Normal screenshot of card 3
  await page.screenshot({ path: path.resolve(__dirname, '../reports/buttons_normal.png') });
  console.log('Saved reports/buttons_normal.png');

  // 2. Hover over the Replace button on Card #3
  const replaceButtons = await page.$$('button[title="Replace this reel"]');
  if (replaceButtons.length >= 3) {
    await replaceButtons[2].hover();
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.resolve(__dirname, '../reports/buttons_replace_hovered.png') });
    console.log('Saved reports/buttons_replace_hovered.png');
  }

  // 3. Hover over the Remove button on Card #3
  const removeButtons = await page.$$('button[title="Remove reel"]');
  if (removeButtons.length >= 3) {
    await removeButtons[2].hover();
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.resolve(__dirname, '../reports/buttons_remove_hovered.png') });
    console.log('Saved reports/buttons_remove_hovered.png');
  }

  await browser.close();
})();
