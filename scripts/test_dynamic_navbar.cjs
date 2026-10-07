const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const outDir = path.join(__dirname, '..', 'reports');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('Navigating to http://localhost:5173/?nopreload...');
  await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Screenshot State 1: Top of page - Main Navbar
  console.log('Capturing State 1: Main Navbar (top of page)...');
  await page.screenshot({ path: path.join(outDir, 'navbar_01_main_top.png') });
  console.log('Saved navbar_01_main_top.png');

  // 2. Scroll down 750px to test Collapsed Dynamic Island Notch
  console.log('Scrolling down to trigger Dynamic Island...');
  await page.evaluate(() => {
    window.scrollTo({ top: 750, behavior: 'instant' });
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(750, { immediate: true });
  });

  await new Promise(r => setTimeout(r, 800));

  console.log('Capturing State 2: Collapsed Dynamic Island (detached notch)...');
  await page.screenshot({ path: path.join(outDir, 'navbar_02_dynamic_island.png') });
  console.log('Saved navbar_02_dynamic_island.png');

  // 3. Click the Hamburger MENU button inside Dynamic Island to open blurred overlay menu
  console.log('Clicking Hamburger Menu button inside Dynamic Island...');
  const menuBtn = await page.$('button[aria-label="Open Full Navigation Menu"]');
  if (menuBtn) {
    await menuBtn.click();
    await new Promise(r => setTimeout(r, 800));
    console.log('Capturing State 3: Blurred Overlay Menu with bottom social links...');
    await page.screenshot({ path: path.join(outDir, 'navbar_03_blurred_menu_overlay.png') });
    console.log('Saved navbar_03_blurred_menu_overlay.png');
  } else {
    console.warn('Could not find Open Full Navigation Menu button');
  }

  // 4. Test Mobile viewport
  console.log('Testing Mobile Viewport (390x844)...');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  // Mobile Top
  await page.screenshot({ path: path.join(outDir, 'navbar_04_mobile_top.png') });
  console.log('Saved navbar_04_mobile_top.png');

  // Mobile Scrolled
  await page.evaluate(() => {
    window.scrollTo({ top: 600, behavior: 'instant' });
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(600, { immediate: true });
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(outDir, 'navbar_05_mobile_dynamic_island.png') });
  console.log('Saved navbar_05_mobile_dynamic_island.png');

  // Mobile Menu Click
  const mobileMenuBtn = await page.$('button[aria-label="Open Full Navigation Menu"]');
  if (mobileMenuBtn) {
    await mobileMenuBtn.click();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(outDir, 'navbar_06_mobile_menu_overlay.png') });
    console.log('Saved navbar_06_mobile_menu_overlay.png');
  }

  await browser.close();
  console.log('All tests completed successfully!');
})();
