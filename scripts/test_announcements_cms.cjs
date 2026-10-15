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

  // Click on "Announcements Section" subtab
  console.log('2. Clicking Announcements Section tab...');
  await page.waitForFunction(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.some(b => b.textContent && b.textContent.includes('Announcements'));
  }, { timeout: 10000 });

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const tab = btns.find(b => b.textContent && b.textContent.includes('Announcements'));
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Capture Announcements CMS Dashboard
  const dashPath = path.resolve(reportsDir, 'cms_1_3_announcements_dashboard.png');
  await page.screenshot({ path: dashPath });
  console.log('Saved dashboard screenshot:', dashPath);

  // 2. Click Edit button on Announcement #01
  console.log('3. Opening Edit Modal for Announcement #01...');
  await page.waitForSelector('button[title*="Edit Announcement"]', { timeout: 10000 });
  const editButtons = await page.$$('button[title*="Edit Announcement"]');
  console.log(`Found ${editButtons.length} edit buttons`);

  if (editButtons.length > 0) {
    await editButtons[0].click();
    await page.waitForSelector('input[placeholder*="We Are Hiring"]', { timeout: 5000 });
    await new Promise(r => setTimeout(r, 600));

    // Capture Modal screenshot
    const modalPath = path.resolve(reportsDir, 'cms_1_3_announcements_modal.png');
    await page.screenshot({ path: modalPath });
    console.log('Saved modal screenshot:', modalPath);

    // Edit Title
    const titleInput = await page.$('input[placeholder*="We Are Hiring"]');
    if (titleInput) {
      await titleInput.click({ clickCount: 3 });
      await titleInput.press('Backspace');
      await titleInput.type('WE ARE HIRING: LEAD DIRECTOR & CINEMATOGRAPHER');
    }

    // Edit Matter
    const matterInput = await page.$('textarea');
    if (matterInput) {
      await matterInput.click({ clickCount: 3 });
      await matterInput.press('Backspace');
      await matterInput.type('Expanding our core directing roster for high-budget commercial campaigns, luxury fashion films, and automotive shoots.');
    }

    // Edit Destination URL
    const urlInput = await page.$('input[placeholder*="/contact"]');
    if (urlInput) {
      await urlInput.click({ clickCount: 3 });
      await urlInput.press('Backspace');
      await urlInput.type('https://brandshoots.com/careers');
    }

    // Click "Save Announcement"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const saveBtn = btns.find(b => b.textContent && b.textContent.includes('Save Announcement'));
      if (saveBtn) saveBtn.click();
    });
    console.log('Clicked Save Announcement button');
    await new Promise(r => setTimeout(r, 1200));

    // Capture saved dashboard with navbar flash marquee
    const savedPath = path.resolve(reportsDir, 'cms_1_3_announcements_saved.png');
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
    const sec = document.getElementById('announcements');
    if (!sec) return { found: false };
    const h3s = Array.from(sec.querySelectorAll('h3')).map(h => h.textContent.trim());
    const ps = Array.from(sec.querySelectorAll('p')).map(p => p.textContent.trim());
    const links = Array.from(sec.querySelectorAll('a')).map(a => a.href);
    return {
      found: true,
      h3s: h3s.slice(0, 8),
      hasUpdatedTitle: h3s.some(h => h.includes('WE ARE HIRING: LEAD DIRECTOR & CINEMATOGRAPHER')),
      hasCustomMatter: ps.some(p => p.includes('Expanding our core directing roster')),
      hasCareerUrl: links.some(l => l.includes('careers'))
    };
  });
  console.log('Live Announcement Verification Results:\n', JSON.stringify(liveData, null, 2));

  // Scroll to announcements section on live page and take screenshot
  await livePage.evaluate(() => {
    const sec = document.getElementById('announcements');
    if (sec) sec.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await new Promise(r => setTimeout(r, 1000));

  const livePath = path.resolve(reportsDir, 'live_announcements_verified.png');
  await livePage.screenshot({ path: livePath });
  console.log('Saved live announcements screenshot:', livePath);

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

    const undoPath = path.resolve(reportsDir, 'cms_1_3_announcements_undone.png');
    await page.screenshot({ path: undoPath });
    console.log('Saved undone screenshot with restored marquee:', undoPath);
  }

  await browser.close();
  console.log('CMS 1.3 Announcements verification finished successfully!');
})();
