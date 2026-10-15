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

  console.log('Navigating to http://localhost:5173/admin...');
  await page.goto('http://localhost:5173/admin', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  // Handle Login if present
  const isLoginPage = await page.$('input[type="password"]');
  if (isLoginPage) {
    await page.type('input[placeholder*="username" i], input[type="text"]', 'admin');
    await page.type('input[type="password"]', 'BD@admin2026');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 1500));
  }

  // Click on "What We Do" tab
  const whatWeDoSubtab = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent && b.textContent.includes('What We Do'));
  });
  if (whatWeDoSubtab) {
    await whatWeDoSubtab.click();
    await new Promise(r => setTimeout(r, 1000));
  }

  // Click edit button #01
  const editButtons = await page.$$('button[title*="Edit Section"]');
  if (editButtons.length > 0) {
    await editButtons[0].click();
    await new Promise(r => setTimeout(r, 800));

    // Fill Title Line 1
    const line1Input = await page.$('input[placeholder="e.g. VIDEO"]');
    if (line1Input) {
      await line1Input.click({ clickCount: 3 });
      await line1Input.press('Backspace');
      await line1Input.type('NEXT-GEN VIDEO');
    }

    // Save
    const saveBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent && b.textContent.includes('Save Section Changes'));
    });
    if (saveBtn) {
      await saveBtn.click();
      console.log('Saved changes in admin!');
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // Check what is in localStorage of admin page
  const localServices = await page.evaluate(() => {
    return localStorage.getItem('brandshoots_services');
  });
  console.log('Admin localStorage brandshoots_services:', localServices ? JSON.parse(localServices)[0] : null);

  // Now open live site in a second tab
  const livePage = await browser.newPage();
  await livePage.setViewport({ width: 1440, height: 900 });
  await livePage.goto('http://localhost:5173/?nopreload=true', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const liveRes = await livePage.evaluate(() => {
    const text = document.body.innerText;
    const storage = localStorage.getItem('brandshoots_services');
    return {
      hasText: text.includes('NEXT-GEN VIDEO'),
      storageFirst: storage ? JSON.parse(storage)[0] : null
    };
  });
  console.log('Live page check:', liveRes);

  await browser.close();
})();
