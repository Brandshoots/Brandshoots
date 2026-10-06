const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

async function testPreloaderAndMobile() {
  const reportsDir = path.resolve(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });

  console.log('Testing mobile preloader (390x844)...');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });

  // 1. Capture early streaming tiles (0.6s)
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.resolve(reportsDir, 'test_preloader_mobile_early.png') });
  console.log('Saved: test_preloader_mobile_early.png');

  // 2. Capture mid streaming tiles (1.8s)
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.resolve(reportsDir, 'test_preloader_mobile_mid.png') });
  console.log('Saved: test_preloader_mobile_mid.png');

  // 3. Capture logo reveal with blur (3.5s)
  await new Promise(r => setTimeout(r, 1700));
  await page.screenshot({ path: path.resolve(reportsDir, 'test_preloader_mobile_logo.png') });
  console.log('Saved: test_preloader_mobile_logo.png');

  // Wait for preloader sequence to finish and homepage to mount
  await new Promise(r => setTimeout(r, 2500));

  console.log('Preloader finished. Now testing mobile sections spacing...');

  // Scroll through each section on mobile and capture screenshots
  const sectionIds = ['hero', 'what-we-do', 'clients', 'leadership', 'cta', 'footer'];
  for (const id of sectionIds) {
    await page.evaluate((secId) => {
      const el = document.getElementById(secId) || document.querySelector(secId);
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    }, id);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.resolve(reportsDir, `test_mobile_flow_${id}.png`) });
    console.log(`Saved: test_mobile_flow_${id}.png`);
  }

  await browser.close();
  console.log('Done!');
}

testPreloaderAndMobile().catch(console.error);
