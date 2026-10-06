const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

async function testHeroColors() {
  const reportsDir = path.resolve(__dirname, '../reports');
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. Desktop Test
  const pageDesktop = await browser.newPage();
  await pageDesktop.setViewport({ width: 1920, height: 1080 });
  await pageDesktop.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  await pageDesktop.screenshot({ path: path.resolve(reportsDir, 'test_hero_desktop_colors.png') });
  console.log('Saved test_hero_desktop_colors.png');

  // 2. Mobile Test
  const pageMobile = await browser.newPage();
  await pageMobile.setViewport({ width: 390, height: 844 });
  await pageMobile.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  await pageMobile.screenshot({ path: path.resolve(reportsDir, 'test_hero_mobile_colors.png') });
  console.log('Saved test_hero_mobile_colors.png');

  await browser.close();
}

testHeroColors().catch(console.error);
