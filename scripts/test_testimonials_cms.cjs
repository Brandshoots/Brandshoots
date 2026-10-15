const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
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
  await page.setViewport({ width: 1440, height: 900 });

  console.log('1. Navigating to Admin...');
  await page.goto('http://localhost:5173/admin', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  // Handle Login if present
  const isLoginPage = await page.$('input[type="password"]');
  if (isLoginPage) {
    console.log('Logging in...');
    await page.type('input[placeholder*="username" i], input[type="text"]', 'admin');
    await page.type('input[type="password"]', 'BD@admin2026');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 1500));
  }

  // Click on "Testimonials Section" subtab
  console.log('2. Clicking Testimonials Section tab...');
  await page.waitForFunction(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.some(b => b.textContent && b.textContent.includes('Testimonials'));
  }, { timeout: 10000 });

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const tab = btns.find(b => b.textContent && b.textContent.includes('Testimonials'));
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Capture Testimonials CMS Grid Dashboard
  const dashPath = path.resolve(reportsDir, 'cms_1_5_testimonials_dashboard.png');
  await page.screenshot({ path: dashPath });
  console.log('Saved dashboard screenshot:', dashPath);

  // 2. Click Edit button on Testimonial #01
  console.log('3. Opening Edit Modal for Review #01...');
  await page.waitForSelector('button[title*="Edit"]', { timeout: 10000 });
  const editButtons = await page.$$('button[title*="Edit"]');
  console.log(`Found ${editButtons.length} edit buttons`);

  if (editButtons.length > 0) {
    await editButtons[0].click();
    await page.waitForSelector('input[placeholder*="Bags World"]', { timeout: 5000 });
    await new Promise(r => setTimeout(r, 600));

    // Capture Modal screenshot (includes Live Card Preview)
    const modalPath = path.resolve(reportsDir, 'cms_1_5_testimonials_modal.png');
    await page.screenshot({ path: modalPath });
    console.log('Saved modal screenshot:', modalPath);

    // Edit Author Name & Quote Matter
    const authorInput = await page.$('input[placeholder*="Rajesh Jain"]');
    if (authorInput) {
      await authorInput.click({ clickCount: 3 });
      await authorInput.press('Backspace');
      await authorInput.type('Rajesh Jain — Group Chairman');
    }

    const quoteInput = await page.$('textarea');
    if (quoteInput) {
      await quoteInput.click({ clickCount: 3 });
      await quoteInput.press('Backspace');
      await quoteInput.type('The visual momentum and cinematic authority BrandShoots delivered for our national campaigns drove exponential luxury market engagement. An unmatched creative powerhouse.');
    }

    await new Promise(r => setTimeout(r, 500));

    // Click "Save Review"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const saveBtn = btns.find(b => b.textContent && b.textContent.includes('Save Review'));
      if (saveBtn) saveBtn.click();
    });
    console.log('Clicked Save Review button');
    await new Promise(r => setTimeout(r, 1200));

    // Capture saved dashboard with navbar flash ticker
    const savedPath = path.resolve(reportsDir, 'cms_1_5_testimonials_saved.png');
    await page.screenshot({ path: savedPath });
    console.log('Saved updated dashboard screenshot with flash ticker:', savedPath);
  }

  // 3. Open Live Homepage in a second page to verify live reflection
  console.log('4. Opening live homepage to verify reflection...');
  const livePage = await browser.newPage();
  await livePage.setViewport({ width: 1440, height: 900 });
  await livePage.goto('http://localhost:5173/?nopreload=true', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // Scroll to #testimonials section
  await livePage.evaluate(() => {
    const sec = document.getElementById('testimonials');
    if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1500));

  const liveData = await livePage.evaluate(() => {
    const sec = document.getElementById('testimonials');
    return {
      found: !!sec,
      text: sec ? sec.innerText : '',
    };
  });
  console.log('Live Testimonials Verified:', {
    found: liveData.found,
    containsUpdatedAuthor: liveData.text.includes('Rajesh Jain — Group Chairman'),
  });

  const livePath = path.resolve(reportsDir, 'live_testimonials_verified.png');
  await livePage.screenshot({ path: livePath });
  console.log('Saved live site screenshot:', livePath);
  await livePage.close();

  // 4. Test Navbar Undo Button
  console.log('5. Testing Navbar Undo Button in Admin...');
  await page.bringToFront();
  await page.waitForFunction(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const undoBtn = btns.find(b => b.textContent && b.textContent.includes('Undo'));
    return undoBtn && !undoBtn.disabled;
  }, { timeout: 5000 });

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const undoBtn = btns.find(b => b.textContent && b.textContent.includes('Undo'));
    if (undoBtn) undoBtn.click();
  });
  console.log('Clicked Undo button');
  await new Promise(r => setTimeout(r, 1500));

  const undonePath = path.resolve(reportsDir, 'cms_1_5_testimonials_undone.png');
  await page.screenshot({ path: undonePath });
  console.log('Saved undone dashboard screenshot:', undonePath);

  await browser.close();
  console.log('CMS 1.5 Testimonials verification script completed successfully.');
})();
