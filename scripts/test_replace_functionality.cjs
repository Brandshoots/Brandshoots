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

  // Click Replace on reel #1
  const replaceBtns = await page.$$('button[title="Replace this reel"]');
  console.log('Found replace buttons:', replaceBtns.length);
  if (replaceBtns.length > 0) {
    await replaceBtns[0].click();
    await new Promise(r => setTimeout(r, 600));

    // Fill in a replacement title in the modal
    const titleInput = await page.$('input[placeholder="e.g. Viswatuff Commercial"]');
    if (titleInput) {
      await titleInput.click({ clickCount: 3 });
      await titleInput.press('Backspace');
      await titleInput.type('Special Edition Studio Reel');
    }

    // Scroll to bottom of modal
    await page.evaluate(() => {
      const modal = document.querySelector('.max-h-\\[90vh\\]');
      if (modal) modal.scrollTop = modal.scrollHeight;
    });
    await new Promise(r => setTimeout(r, 300));

    // Click submit "Replace Reel" button
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      console.log('Clicked Replace Reel submit button');
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  // Verify toast appears or title is updated in the first card
  const firstCardTitle = await page.evaluate(() => {
    const titleEl = document.querySelector('h3.font-sans');
    return titleEl ? titleEl.textContent : null;
  });
  console.log('First card title after replace:', firstCardTitle);

  // Take screenshot of admin with success toast
  await page.screenshot({ path: path.resolve(__dirname, '../reports/cms_hero_after_replace.png') });
  console.log('Saved reports/cms_hero_after_replace.png');

  // Also check live site homepage to ensure reel #1 title or content synced
  const homePage = await browser.newPage();
  await homePage.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  const homeReelsData = await homePage.evaluate(() => {
    const cached = localStorage.getItem('brandshoots_hero_reels');
    if (cached) {
      const parsed = JSON.parse(cached);
      return parsed[0];
    }
    return null;
  });
  console.log('Homepage first reel synced in localStorage/RTDB:', homeReelsData ? homeReelsData.title : 'null');

  await browser.close();
})();
