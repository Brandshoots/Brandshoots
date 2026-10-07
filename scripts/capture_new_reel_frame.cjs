const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Desktop Chapter 0 View
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/portfolio?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2200));
  await page.screenshot({ path: path.resolve(__dirname, '../scratch_new_reel_frame_desktop.png') });
  console.log('Saved scratch_new_reel_frame_desktop.png');

  // Zoomed-in crop on the reel frame (like user's second screenshot)
  const reelBox = await page.evaluate(() => {
    // Return approximate bounding box of the 3D reel area on left
    return { x: 120, y: 150, width: 440, height: 680 };
  });
  await page.screenshot({
    path: path.resolve(__dirname, '../scratch_new_reel_frame_zoomed.png'),
    clip: reelBox
  });
  console.log('Saved scratch_new_reel_frame_zoomed.png');

  // Test clicking "WATCH FULLSCREEN REEL" button to verify modal opens
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const watchBtn = buttons.find(b => b.textContent && b.textContent.includes('WATCH FULLSCREEN'));
    if (watchBtn) watchBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.resolve(__dirname, '../scratch_new_reel_modal.png') });
  console.log('Saved scratch_new_reel_modal.png');

  await browser.close();
  console.log('Done captures!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
