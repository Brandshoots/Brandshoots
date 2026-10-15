const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  await page.goto('http://localhost:5173/admin', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('bs_admin_auth_fallback', JSON.stringify({
      user: { email: 'brandshoots.in@gmail.com', displayName: 'Administrator' },
      authenticatedAt: Date.now()
    }));
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  // Find replace buttons
  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button[title="Replace this reel"]')).length;
  });
  console.log('Replace buttons found:', buttons);

  // Click first button
  await page.click('button[title="Replace this reel"]');
  await new Promise(r => setTimeout(r, 500));

  // Check if modal opened
  const modalInfo = await page.evaluate(() => {
    const modal = document.querySelector('.fixed');
    if (!modal) return null;
    const inputs = Array.from(modal.querySelectorAll('input')).map(i => ({ type: i.type, ph: i.placeholder, val: i.value }));
    return { title: modal.querySelector('h3')?.textContent, inputs };
  });
  console.log('Modal info:', JSON.stringify(modalInfo));

  // Set new URL and submit
  await page.evaluate(() => {
    const textInputs = Array.from(document.querySelectorAll('.fixed input[type="text"]'));
    if (textInputs.length > 0) {
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeSetter.call(textInputs[0], '/reels/viswatuff.glass_rjy_1791174653_4000984496274606409_78432309239.mp4');
      textInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      textInputs[0].dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await new Promise(r => setTimeout(r, 300));

  // Click Done button
  const clickedDone = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.fixed button'));
    const done = btns.find(b => b.textContent && b.textContent.trim() === 'Done');
    if (done) {
      done.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Done?', clickedDone);
  await new Promise(r => setTimeout(r, 1000));

  // Check localStorage now!
  const savedLocal = await page.evaluate(() => {
    const raw = localStorage.getItem('brandshoots_hero_reels');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { len: parsed.length, firstSrc: parsed[0]?.src, firstTitle: parsed[0]?.title };
  });
  console.log('Saved Local:', JSON.stringify(savedLocal));

  // Now go to homepage
  await page.goto('http://localhost:5173/?nopreload=true', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  const homepageVids = await page.evaluate(() => {
    const vids = Array.from(document.querySelectorAll('.cylinder-scene video'));
    return { count: vids.length, firstSrc: vids[0]?.src };
  });
  console.log('Homepage Videos:', JSON.stringify(homepageVids));

  await browser.close();
})();
