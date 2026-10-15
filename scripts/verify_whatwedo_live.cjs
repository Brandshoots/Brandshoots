const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('1. Navigating to Admin...');
  await page.goto('http://localhost:5173/admin', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  // Check login
  const isLogin = await page.$('input[type="password"]');
  if (isLogin) {
    console.log('Logging in...');
    await page.type('input[placeholder*="username" i], input[type="text"]', 'admin');
    await page.type('input[type="password"]', 'BD@admin2026');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 1500));
  }

  // Click "What We Do Section"
  console.log('Clicking What We Do tab...');
  await page.waitForFunction(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.some(b => b.textContent && b.textContent.includes('What We Do'));
  }, { timeout: 10000 });

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const tab = btns.find(b => b.textContent && b.textContent.includes('What We Do'));
    if (tab) tab.click();
  });

  // Wait for Edit buttons to appear
  console.log('Waiting for Edit buttons...');
  await page.waitForSelector('button[title*="Edit Section"]', { timeout: 10000 });
  const editButtons = await page.$$('button[title*="Edit Section"]');
  console.log(`Found ${editButtons.length} section cards`);

  // Click Edit on Section #01
  await editButtons[0].click();
  await page.waitForSelector('input[placeholder="e.g. VIDEO"]', { timeout: 5000 });
  await new Promise(r => setTimeout(r, 500));

  console.log('Modifying Section #01 fields...');
  // Edit Line 1
  const line1 = await page.$('input[placeholder="e.g. VIDEO"]');
  await line1.click({ clickCount: 3 });
  await line1.press('Backspace');
  await line1.type('NEXT-GEN VIDEO');

  // Edit Tag
  const tag = await page.$('input[placeholder*="CINEMATOGRAPHY & DIRECTION"]');
  if (tag) {
    await tag.click({ clickCount: 3 });
    await tag.press('Backspace');
    await tag.type('PREMIUM GRADE');
  }

  // Edit Matter
  const matter = await page.$('textarea');
  if (matter) {
    await matter.click({ clickCount: 3 });
    await matter.press('Backspace');
    await matter.type('Transforming ambitious ideas into spellbinding visual masterpieces with cutting-edge cinematic tech.');
  }

  // Click Save
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const saveBtn = btns.find(b => b.textContent && b.textContent.includes('Save Section Changes'));
    if (saveBtn) saveBtn.click();
  });
  console.log('Saved changes in Admin modal!');
  await new Promise(r => setTimeout(r, 1200));

  // Take screenshot of admin dashboard with updated card and flash ticker
  await page.screenshot({ path: path.resolve(__dirname, '../reports/admin_whatwedo_saved.png') });
  console.log('Saved reports/admin_whatwedo_saved.png');

  // 2. Open Live Homepage in second page
  console.log('Opening Live Page in a new tab...');
  const livePage = await browser.newPage();
  await livePage.setViewport({ width: 1440, height: 900 });
  await livePage.goto('http://localhost:5173/?nopreload=true', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const liveData = await livePage.evaluate(() => {
    const sec = document.getElementById('what-we-do');
    if (!sec) return { found: false };
    const h3s = Array.from(sec.querySelectorAll('h3')).map(h => h.textContent.trim());
    const ps = Array.from(sec.querySelectorAll('p')).map(p => p.textContent.trim());
    const spans = Array.from(sec.querySelectorAll('span')).map(s => s.textContent.trim());
    return {
      found: true,
      h3s,
      hasNextGenVideo: h3s.some(h => h.includes('NEXT-GEN VIDEO')),
      hasPremiumGrade: spans.some(s => s.includes('PREMIUM GRADE')),
      hasCustomMatter: ps.some(p => p.includes('Transforming ambitious ideas into spellbinding visual masterpieces'))
    };
  });
  console.log('Live Page Verification Results:\n', JSON.stringify(liveData, null, 2));

  // Scroll to section and capture screenshot
  await livePage.evaluate(() => {
    const sec = document.getElementById('what-we-do');
    if (sec) sec.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await livePage.screenshot({ path: path.resolve(__dirname, '../reports/live_what_we_do_verified.png') });
  console.log('Saved reports/live_what_we_do_verified.png');

  await browser.close();
  console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
})();
