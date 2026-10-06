const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

async function runSnapSuite() {
  const reportsDir = path.resolve(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. DESKTOP TEST
  console.log('=== 1. TESTING DESKTOP (1920x1080) ===');
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // Initial Hero
  console.log('Hero initial scrollY:', await page.evaluate(() => window.scrollY));
  await page.screenshot({ path: path.resolve(reportsDir, 'snap_desktop_01_hero.png') });

  // Scroll with wheel flick towards What We Do
  console.log('Flicking wheel downwards from Hero...');
  await page.mouse.wheel({ deltaY: 500 });
  await new Promise(r => setTimeout(r, 2000)); // wait for inertia (800ms) + snap (800ms)
  const scrollAfterWWD = await page.evaluate(() => window.scrollY);
  console.log('Scroll after snap to What We Do:', scrollAfterWWD);
  await page.screenshot({ path: path.resolve(reportsDir, 'snap_desktop_02_what_we_do.png') });

  // Scroll with wheel flick towards Clients
  console.log('Flicking wheel downwards from What We Do...');
  await page.mouse.wheel({ deltaY: 600 });
  await new Promise(r => setTimeout(r, 2000));
  const scrollAfterClients = await page.evaluate(() => window.scrollY);
  console.log('Scroll after snap to Clients:', scrollAfterClients);
  await page.screenshot({ path: path.resolve(reportsDir, 'snap_desktop_03_clients.png') });

  // Scroll through client pin (~1.6 screens)
  console.log('Scrubbing client logos in pin...');
  await page.mouse.wheel({ deltaY: 1800 });
  await new Promise(r => setTimeout(r, 1200));

  // Scroll down to Leadership
  console.log('Flicking wheel downwards to Leadership...');
  await page.mouse.wheel({ deltaY: 800 });
  await new Promise(r => setTimeout(r, 2000));
  const scrollAfterLeadership = await page.evaluate(() => window.scrollY);
  console.log('Scroll after snap to Leadership:', scrollAfterLeadership);
  await page.screenshot({ path: path.resolve(reportsDir, 'snap_desktop_04_leadership.png') });

  // Scroll down to CTA
  console.log('Flicking wheel downwards to CTA...');
  await page.mouse.wheel({ deltaY: 800 });
  await new Promise(r => setTimeout(r, 2000));
  const scrollAfterCTA = await page.evaluate(() => window.scrollY);
  console.log('Scroll after snap to CTA:', scrollAfterCTA);
  await page.screenshot({ path: path.resolve(reportsDir, 'snap_desktop_05_cta.png') });

  // Scroll down to Footer
  console.log('Scrolling to Footer at bottom...');
  await page.mouse.wheel({ deltaY: 600 });
  await new Promise(r => setTimeout(r, 1800));
  const scrollAfterFooter = await page.evaluate(() => window.scrollY);
  console.log('Scroll at Footer:', scrollAfterFooter);
  await page.screenshot({ path: path.resolve(reportsDir, 'snap_desktop_06_footer.png') });

  await page.close();
  await browser.close();
  console.log('\n=== SNAP SUITE VERIFIED ===');
}

runSnapSuite().catch(console.error);
