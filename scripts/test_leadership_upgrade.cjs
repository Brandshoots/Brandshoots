const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const outDir = path.join(__dirname, '..', 'reports', 'leadership_upgrade');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // 1. DESKTOP TEST
  console.log('\n--- TESTING DESKTOP (1440x900) ---');
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // Scroll to leadership section to trigger GSAP entry animation
  await page.evaluate(() => {
    const el = document.getElementById('leadership');
    if (window.__lenis) {
      window.__lenis.scrollTo(el, { immediate: true });
    } else if (el) {
      el.scrollIntoView({ behavior: 'auto' });
    }
  });
  await new Promise(r => setTimeout(r, 1600));

  const desktopSettled = path.join(outDir, 'desktop_leadership_settled.png');
  await page.screenshot({ path: desktopSettled });
  console.log('Saved', desktopSettled);

  // Test Mouse Float Parallax
  console.log('Testing mouse parallax...');
  await page.mouse.move(1100, 450);
  await new Promise(r => setTimeout(r, 400));
  const desktopMouse = path.join(outDir, 'desktop_leadership_mouse_parallax.png');
  await page.screenshot({ path: desktopMouse });
  console.log('Saved', desktopMouse);

  // Test Pill Hover Interaction
  console.log('Testing pill hover interaction...');
  const pillHandles = await page.$$('#leadership [ref], #leadership span.cursor-pointer');
  const pill2 = await page.evaluateHandle(() => {
    const pills = document.querySelectorAll('#leadership span.cursor-pointer');
    return pills[1]; // SHOOT WITH PURPOSE or second pill
  });
  if (pill2) {
    const box = await pill2.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await new Promise(r => setTimeout(r, 400));
      const pillHover = path.join(outDir, 'desktop_leadership_pill_hover.png');
      await page.screenshot({ path: pillHover });
      console.log('Saved', pillHover);
    }
  }

  // Test Scroll Scrub
  console.log('Testing scroll scrub...');
  await page.evaluate(() => {
    window.scrollBy(0, 150);
    if (window.__lenis) {
      window.__lenis.scrollTo(window.scrollY + 150, { immediate: true });
    }
  });
  await new Promise(r => setTimeout(r, 500));
  const desktopScrub = path.join(outDir, 'desktop_leadership_scroll_scrub.png');
  await page.screenshot({ path: desktopScrub });
  console.log('Saved', desktopScrub);

  await page.close();

  // 2. MOBILE TEST
  console.log('\n--- TESTING MOBILE (390x844) ---');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844, isMobile: true });
  await mobilePage.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  await mobilePage.evaluate(() => {
    const el = document.getElementById('leadership');
    if (el) {
      el.scrollIntoView({ behavior: 'auto' });
    }
  });
  await new Promise(r => setTimeout(r, 1200));

  const mobileMetrics = await mobilePage.evaluate(() => {
    const el = document.getElementById('leadership');
    const rect = el ? el.getBoundingClientRect() : { top: 0, height: 0 };
    return {
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      sectionHeight: rect.height,
      viewportHeight: window.innerHeight,
    };
  });
  console.log('Mobile Metrics:', mobileMetrics);

  const mobileSettled = path.join(outDir, 'mobile_leadership_settled.png');
  await mobilePage.screenshot({ path: mobileSettled });
  console.log('Saved', mobileSettled);

  await mobilePage.close();
  await browser.close();
  console.log('\nAll leadership upgrade tests completed successfully!');
})();
