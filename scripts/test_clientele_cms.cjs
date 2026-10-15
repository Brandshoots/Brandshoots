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

  // Click on "Clientele Section" subtab
  console.log('2. Clicking Clientele Section tab...');
  await page.waitForFunction(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.some(b => b.textContent && b.textContent.includes('Clientele'));
  }, { timeout: 10000 });

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const tab = btns.find(b => b.textContent && b.textContent.includes('Clientele'));
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Capture Clientele CMS Grid Dashboard
  const dashPath = path.resolve(reportsDir, 'cms_1_3_clientele_dashboard.png');
  await page.screenshot({ path: dashPath });
  console.log('Saved dashboard screenshot:', dashPath);

  // 2. Click Edit button on Client #01
  console.log('3. Opening Edit Modal for Client #01...');
  await page.waitForSelector('button[title*="Edit"]', { timeout: 10000 });
  const editButtons = await page.$$('button[title*="Edit"]');
  console.log(`Found ${editButtons.length} edit buttons`);

  if (editButtons.length > 0) {
    await editButtons[0].click();
    await page.waitForSelector('input[placeholder*="Santhi Pipes"]', { timeout: 5000 });
    await new Promise(r => setTimeout(r, 600));

    // Capture Modal screenshot
    const modalPath = path.resolve(reportsDir, 'cms_1_3_clientele_modal.png');
    await page.screenshot({ path: modalPath });
    console.log('Saved modal screenshot:', modalPath);

    // Edit Client Brand Name
    const nameInput = await page.$('input[placeholder*="Santhi Pipes"]');
    if (nameInput) {
      await nameInput.click({ clickCount: 3 });
      await nameInput.press('Backspace');
      await nameInput.type('Santhi Pipes Global Infrastructure');
    }

    // Click "Save Client Logo"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const saveBtn = btns.find(b => b.textContent && b.textContent.includes('Save Client Logo'));
      if (saveBtn) saveBtn.click();
    });
    console.log('Clicked Save Client Logo button');
    await new Promise(r => setTimeout(r, 1200));

    // Capture saved dashboard with navbar flash marquee
    const savedPath = path.resolve(reportsDir, 'cms_1_3_clientele_saved.png');
    await page.screenshot({ path: savedPath });
    console.log('Saved updated dashboard screenshot with flash ticker:', savedPath);
  }

  // 3. Open Live Homepage in a second page to verify live reflection
  console.log('4. Opening live homepage to verify reflection...');
  const livePage = await browser.newPage();
  await livePage.setViewport({ width: 1440, height: 900 });
  await livePage.goto('http://localhost:5173/?nopreload=true', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const liveData = await livePage.evaluate(() => {
    const sec = document.getElementById('clients');
    if (!sec) return { found: false };
    const text = sec.innerText || sec.textContent || '';
    const imgs = Array.from(sec.querySelectorAll('img')).map(img => img.alt || img.src);
    return {
      found: true,
      hasUpdatedName: text.includes('Santhi Pipes Global Infrastructure'),
      clientImagesCount: imgs.length
    };
  });
  console.log('Live Clientele Verification Results:\n', JSON.stringify(liveData, null, 2));

  // Scroll to clients section on live page and take screenshot
  await livePage.evaluate(() => {
    const sec = document.getElementById('clients');
    if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1000));

  const livePath = path.resolve(reportsDir, 'live_clientele_verified.png');
  await livePage.screenshot({ path: livePath });
  console.log('Saved live clientele screenshot:', livePath);

  // 4. Test Navbar Undo
  console.log('5. Testing Undo in Admin...');
  await page.bringToFront();
  const undoBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.includes('Undo') && !b.disabled);
  });

  if (undoBtn) {
    await undoBtn.click();
    console.log('Clicked navbar Undo button');
    await new Promise(r => setTimeout(r, 1000));

    const undoPath = path.resolve(reportsDir, 'cms_1_3_clientele_undone.png');
    await page.screenshot({ path: undoPath });
    console.log('Saved undone screenshot with restored marquee:', undoPath);
  }

  await browser.close();
  console.log('CMS 1.3 Clientele verification finished successfully!');
})();
