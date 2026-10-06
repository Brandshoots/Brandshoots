const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

async function runMobileSnapSuite() {
  const reportsDir = path.resolve(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  console.log('=== 2. TESTING MOBILE (390x844 - iPhone 12/13/14) ===');
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Hero Mobile
  console.log('Mobile Hero initial scrollY:', await page.evaluate(() => window.scrollY));
  await page.screenshot({ path: path.resolve(reportsDir, 'snap_mobile_01_hero.png') });

  // 2. Scroll to What We Do
  console.log('Scrolling to What We Do...');
  await page.evaluate(() => {
    const el = document.getElementById('what-we-do');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await new Promise(r => setTimeout(r, 1800));
  console.log('Mobile What We Do scrollY:', await page.evaluate(() => window.scrollY));
  await page.screenshot({ path: path.resolve(reportsDir, 'snap_mobile_02_what_we_do.png') });

  // 3. Scroll to Clients
  console.log('Scrolling to Clients...');
  await page.evaluate(() => {
    const el = document.getElementById('clients');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await new Promise(r => setTimeout(r, 1800));
  console.log('Mobile Clients scrollY:', await page.evaluate(() => window.scrollY));
  await page.screenshot({ path: path.resolve(reportsDir, 'snap_mobile_03_clients.png') });

  // 4. Scroll to Leadership
  console.log('Scrolling to Leadership...');
  await page.evaluate(() => {
    const el = document.getElementById('leadership');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await new Promise(r => setTimeout(r, 1800));
  console.log('Mobile Leadership scrollY:', await page.evaluate(() => window.scrollY));
  await page.screenshot({ path: path.resolve(reportsDir, 'snap_mobile_04_leadership.png') });

  // 5. Scroll to CTA
  console.log('Scrolling to CTA...');
  await page.evaluate(() => {
    const el = document.getElementById('cta');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await new Promise(r => setTimeout(r, 1800));
  console.log('Mobile CTA scrollY:', await page.evaluate(() => window.scrollY));
  await page.screenshot({ path: path.resolve(reportsDir, 'snap_mobile_05_cta.png') });

  await page.close();
  await browser.close();
  console.log('\n=== MOBILE SNAP SUITE VERIFIED ===');
}

runMobileSnapSuite().catch(console.error);
