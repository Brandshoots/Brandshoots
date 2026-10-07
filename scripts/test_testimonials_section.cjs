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
  await page.setViewport({ width: 1440, height: 950 });

  const outDir = path.join(__dirname, '..', 'reports');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log('Navigating to http://localhost:5173/?nopreload...');
  await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  // Scroll to #testimonials
  console.log('Scrolling to #testimonials...');
  await page.evaluate(() => {
    const el = document.getElementById('testimonials');
    if (el) {
      el.scrollIntoView({ behavior: 'instant' });
    }
  });

  await new Promise(r => setTimeout(r, 1000));

  // Screenshot 1: Desktop Testimonials Section Overview
  console.log('Capturing Desktop Testimonials Section...');
  await page.screenshot({ path: path.join(outDir, 'testimonials_01_desktop.png') });
  console.log('Saved testimonials_01_desktop.png');

  // Trigger 3D Hover & Glare on active card
  console.log('Hovering over active card for 3D tilt...');
  const card = await page.$('#testimonials [style*="preserve-3d"]');
  if (card) {
    const box = await card.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.3);
      await new Promise(r => setTimeout(r, 300));
      await page.screenshot({ path: path.join(outDir, 'testimonials_02_3d_tilt_hover.png') });
      console.log('Saved testimonials_02_3d_tilt_hover.png');
    }
  }

  // Click Next Arrow to advance testimonial
  console.log('Clicking Next Arrow...');
  const nextBtn = await page.$('button[aria-label="Next Testimonial"]');
  if (nextBtn) {
    await nextBtn.click();
    await new Promise(r => setTimeout(r, 700));
    await page.screenshot({ path: path.join(outDir, 'testimonials_03_slide_next.png') });
    console.log('Saved testimonials_03_slide_next.png');
  }

  // Mobile Viewport Test (390x844)
  console.log('Testing Mobile Viewport...');
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  await page.evaluate(() => {
    const el = document.getElementById('testimonials');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(outDir, 'testimonials_04_mobile.png') });
  console.log('Saved testimonials_04_mobile.png');

  await browser.close();
  console.log('Testimonials test complete!');
})();
