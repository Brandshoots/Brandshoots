const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const outDir = path.join(__dirname, '..', 'reports', 'testimonials_rebuild');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // 1. DESKTOP TEST
  console.log('\n--- TESTING DESKTOP (1440x900) ---');
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // Scroll to testimonials section
  await page.evaluate(() => {
    const el = document.getElementById('testimonials');
    if (window.__lenis) {
      window.__lenis.scrollTo(el, { immediate: true });
    } else if (el) {
      el.scrollIntoView({ behavior: 'auto' });
    }
  });
  await new Promise(r => setTimeout(r, 1500));

  const desktopSettled = path.join(outDir, 'desktop_testimonials_settled.png');
  await page.screenshot({ path: desktopSettled });
  console.log('Saved', desktopSettled);

  // Click on 02 button
  console.log('Clicking on indicator 02...');
  const clicked02 = await page.evaluate(() => {
    const btns = document.querySelectorAll('.testimonial-nav-btn');
    if (btns && btns[1]) {
      btns[1].click();
      return true;
    }
    return false;
  });
  console.log('Clicked button 02:', clicked02);
  await new Promise(r => setTimeout(r, 1400));

  const desktop02 = path.join(outDir, 'desktop_testimonials_02.png');
  await page.screenshot({ path: desktop02 });
  console.log('Saved', desktop02);

  // Test Keyboard Right Arrow Navigation
  console.log('Testing Keyboard Right Arrow...');
  await page.keyboard.press('ArrowRight');
  await new Promise(r => setTimeout(r, 1400));

  const desktopKeyboard03 = path.join(outDir, 'desktop_testimonials_keyboard_03.png');
  await page.screenshot({ path: desktopKeyboard03 });
  console.log('Saved', desktopKeyboard03);

  // 2. MOBILE TEST (390x844 iPhone 14)
  console.log('\n--- TESTING MOBILE (390x844) ---');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await mobilePage.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  await mobilePage.evaluate(() => {
    const el = document.getElementById('testimonials');
    if (window.__lenis) {
      window.__lenis.scrollTo(el, { immediate: true });
    } else if (el) {
      el.scrollIntoView({ behavior: 'auto' });
    }
  });
  await new Promise(r => setTimeout(r, 1500));

  // Check overflow
  const overflowCheck = await mobilePage.evaluate(() => {
    return {
      bodyScrollWidth: document.body.scrollWidth,
      windowInnerWidth: window.innerWidth,
      hasHorizontalOverflow: document.body.scrollWidth > window.innerWidth,
    };
  });
  console.log('Mobile overflow check:', overflowCheck);

  const mobileSettled = path.join(outDir, 'mobile_testimonials_settled.png');
  await mobilePage.screenshot({ path: mobileSettled });
  console.log('Saved', mobileSettled);

  // Mobile Tap on 04
  console.log('Tapping on indicator 04 on mobile...');
  await mobilePage.evaluate(() => {
    const btns = document.querySelectorAll('.testimonial-nav-btn');
    if (btns && btns[3]) {
      btns[3].click();
    }
  });
  await new Promise(r => setTimeout(r, 1400));

  const mobile04 = path.join(outDir, 'mobile_testimonials_04.png');
  await mobilePage.screenshot({ path: mobile04 });
  console.log('Saved', mobile04);

  await browser.close();
  console.log('\nAll tests completed successfully!');
})();
