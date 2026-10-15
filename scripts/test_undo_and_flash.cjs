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

  // 1. Initial screenshot with Undo button in navbar
  await page.screenshot({ path: path.resolve(__dirname, '../reports/undo_nav_initial.png') });
  console.log('Saved reports/undo_nav_initial.png');

  // 2. Click Replace on Reel #2
  const replaceButtons = await page.$$('button[title="Replace this reel"]');
  if (replaceButtons.length >= 2) {
    await replaceButtons[1].click();
    await new Promise(r => setTimeout(r, 500));

    // Change title in modal
    const titleInput = await page.$('input[placeholder*="Brand Commercial"]');
    if (titleInput) {
      await titleInput.click({ clickCount: 3 });
      await titleInput.press('Backspace');
      await titleInput.type('TEMPORARY TEST REEL');
    }

    // Click "Done"
    const doneBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent && b.textContent.trim() === 'Done');
    });
    if (doneBtn) {
      await doneBtn.click();
      console.log('Clicked Done button');
      await new Promise(r => setTimeout(r, 500));

      // 3. Capture screenshot of the navbar FLASH notification active!
      await page.screenshot({ path: path.resolve(__dirname, '../reports/navbar_flash_change.png') });
      console.log('Saved reports/navbar_flash_change.png');
    }
  }

  // 4. Click Undo button on the navbar
  const undoBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.trim() === 'Undo');
  });
  if (undoBtn) {
    await undoBtn.click();
    console.log('Clicked Undo button on navbar');
    await new Promise(r => setTimeout(r, 500));

    // 5. Capture screenshot of the navbar FLASH notification for RESTORE!
    await page.screenshot({ path: path.resolve(__dirname, '../reports/navbar_flash_undo_restored.png') });
    console.log('Saved reports/navbar_flash_undo_restored.png');
  }

  // 6. Wait 4 seconds and capture screenshot showing the flash text is now GONE!
  console.log('Waiting 4s for flash to fade away...');
  await new Promise(r => setTimeout(r, 4200));
  await page.screenshot({ path: path.resolve(__dirname, '../reports/navbar_flash_gone.png') });
  console.log('Saved reports/navbar_flash_gone.png');

  await browser.close();
})();
