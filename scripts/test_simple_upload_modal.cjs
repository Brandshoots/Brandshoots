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
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  const isLoginPage = await page.$('input[type="password"]');
  if (isLoginPage) {
    await page.type('input[placeholder*="username" i], input[type="text"]', 'admin');
    await page.type('input[type="password"]', 'BD@admin2026');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 1500));
  }

  // Click Replace on Reel #1
  const replaceButtons = await page.$$('button[title="Replace this reel"]');
  console.log('Replace buttons found:', replaceButtons.length);
  if (replaceButtons.length > 0) {
    await replaceButtons[0].click();
    await new Promise(r => setTimeout(r, 500));

    // Clear video URL and type a new one
    const urlInput = await page.$('input[placeholder*="Paste video link"]');
    if (urlInput) {
      await urlInput.click({ clickCount: 3 });
      await urlInput.press('Backspace');
      await urlInput.type('/reels/santhipipes.official/santhipipes.official_2025-10-18_17-48-18_3746103437505307409_47715699929.mp4');
      await new Promise(r => setTimeout(r, 800));
    }

    // Capture the modal with the live video preview loaded
    await page.screenshot({ path: path.resolve(__dirname, '../reports/simple_modal_preview_active.png') });
    console.log('Saved reports/simple_modal_preview_active.png');

    // Click "Done" button
    const doneBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent && b.textContent.trim() === 'Done');
    });
    if (doneBtn) {
      await doneBtn.click();
      console.log('Clicked Done button');
      await new Promise(r => setTimeout(r, 1200));
      await page.screenshot({ path: path.resolve(__dirname, '../reports/after_done_clicked.png') });
      console.log('Saved reports/after_done_clicked.png');
    }
  }

  // Test opening Add Reel modal too
  const addReelBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.includes('Add Reel'));
  });
  if (addReelBtn) {
    await addReelBtn.click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.resolve(__dirname, '../reports/simple_modal_add_reel.png') });
    console.log('Saved reports/simple_modal_add_reel.png');
  }

  await browser.close();
})();
