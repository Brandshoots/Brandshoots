const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Visit homepage first to capture restored 3D cylinder carousel look
  await page.goto('http://localhost:5173/?nopreload=true', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.resolve(__dirname, '../reports/restored_3d_carousel_hero.png') });
  console.log('Saved reports/restored_3d_carousel_hero.png');

  // 2. Count videos playing in cylinder
  const initialVids = await page.evaluate(() => {
    const vids = Array.from(document.querySelectorAll('.cylinder-scene video'));
    return vids.map(v => v.currentSrc || v.src);
  });
  console.log('Initial Cylinder Videos Count:', initialVids.length);
  console.log('First video:', initialVids[0]);

  // 3. Go to /admin and replace Slot #1 with a new reel
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.setItem('bs_admin_auth_fallback', JSON.stringify({
      user: { email: 'brandshoots.in@gmail.com', displayName: 'Administrator' },
      authenticatedAt: Date.now()
    }));
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  // Click Replace on first reel
  const replaceBtns = await page.$$('button[title="Replace this reel"]');
  if (replaceBtns.length > 0) {
    await replaceBtns[0].click();
    await new Promise(r => setTimeout(r, 600));

    // Fill new video URL in the modal input
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const urlInp = inputs.find((inp) => inp.placeholder && inp.placeholder.includes('/reels/'));
      if (urlInp) {
        // Use native value setter so React state updates
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(urlInp, '/reels/viswatuff.glass_rjy_1791174653_4000984496274606409_78432309239.mp4');
        urlInp.dispatchEvent(new Event('input', { bubbles: true }));
        urlInp.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    // Click Done
    const doneBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent && b.textContent.trim() === 'Done');
    });
    if (doneBtn) {
      await doneBtn.click();
      console.log('Clicked Done button in Replace Modal');
      await new Promise(r => setTimeout(r, 800));
    }
  }

  // 4. Return to homepage and verify the replaced reel is now reflecting in the 3D cylinder!
  await page.goto('http://localhost:5173/?nopreload=true', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.resolve(__dirname, '../reports/hero_reflecting_uploaded_reel.png') });
  console.log('Saved reports/hero_reflecting_uploaded_reel.png');

  const afterVids = await page.evaluate(() => {
    const vids = Array.from(document.querySelectorAll('.cylinder-scene video'));
    return vids.map(v => v.currentSrc || v.src);
  });
  console.log('After Replace Cylinder Videos Count:', afterVids.length);
  console.log('First video src in cylinder:', afterVids[0]);

  await browser.close();
})();
