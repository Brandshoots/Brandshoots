const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

async function testFeatures() {
  const reportsDir = path.resolve(__dirname, '../reports');
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Testing preloader logo duration...');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

  // Check logo at 4.8s (should still be proudly displayed)
  await new Promise(r => setTimeout(r, 4800));
  await page.screenshot({ path: path.resolve(reportsDir, 'test_preloader_logo_held_longer.png') });
  console.log('Saved test_preloader_logo_held_longer.png');

  // Wait for preloader to fully finish and enter home
  await new Promise(r => setTimeout(r, 3000));

  console.log('Testing Our Clients section autocarousel and larger logos...');
  await page.evaluate(() => {
    document.getElementById('clients').scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 1000));

  // Screenshot 1: initial position of clients
  await page.screenshot({ path: path.resolve(reportsDir, 'test_clients_large_logo_pos1.png') });
  console.log('Saved test_clients_large_logo_pos1.png');

  // Wait 2 seconds for continuous auto-play sliding
  await new Promise(r => setTimeout(r, 2000));

  // Screenshot 2: position after auto-play slide
  await page.screenshot({ path: path.resolve(reportsDir, 'test_clients_large_logo_pos2.png') });
  console.log('Saved test_clients_large_logo_pos2.png');

  await browser.close();
  console.log('Done testFeatures!');
}

testFeatures().catch(console.error);
