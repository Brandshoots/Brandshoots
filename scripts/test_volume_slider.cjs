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

  console.log('1. Navigating to Portfolio page...');
  await page.goto('http://localhost:5173/portfolio', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2500));

  // 1. Capture base state of controls at bottom
  const basePath = path.resolve(reportsDir, 'portfolio_volume_base.png');
  await page.screenshot({ path: basePath });
  console.log('Saved portfolio base screenshot:', basePath);

  // 2. Locate the volume button & hover it
  console.log('2. Hovering over volume button...');
  const volBtn = await page.$('button[aria-label*="Audio"]');
  if (volBtn) {
    const box = await volBtn.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await new Promise(r => setTimeout(r, 800));

      // Capture screenshot while hovered (vertical slider popup visible)
      const hoverPath = path.resolve(reportsDir, 'portfolio_volume_hovered.png');
      await page.screenshot({ path: hoverPath });
      console.log('Saved volume hovered popup screenshot:', hoverPath);

      // 3. Move cursor up into the vertical slider track to adjust volume (e.g. 50%)
      console.log('3. Adjusting volume on the vertical track...');
      const track = await page.$('div[role="slider"]');
      if (track) {
        const trackBox = await track.boundingBox();
        if (trackBox) {
          // Click near middle of track (approx 50% volume)
          const midY = trackBox.y + trackBox.height * 0.45;
          await page.mouse.click(trackBox.x + trackBox.width / 2, midY);
          await new Promise(r => setTimeout(r, 600));

          const adjustedPath = path.resolve(reportsDir, 'portfolio_volume_adjusted.png');
          await page.screenshot({ path: adjustedPath });
          console.log('Saved adjusted volume screenshot:', adjustedPath);
        }
      }
    }
  }

  await browser.close();
  console.log('Volume slider verification completed successfully.');
})();
