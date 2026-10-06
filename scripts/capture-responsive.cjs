const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');

async function captureAll() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const viewports = [
    { name: 'desktop_1920', width: 1920, height: 1080 },
    { name: 'laptop_1440', width: 1440, height: 900 },
    { name: 'tablet_768', width: 768, height: 1024 },
    { name: 'mobile_390', width: 390, height: 844 }
  ];

  for (const vp of viewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2400));
    const outPath = path.resolve(__dirname, `../reports/hero_${vp.name}.png`);
    await page.screenshot({ path: outPath });
    console.log(`Saved ${vp.name} to ${outPath}`);

    if (vp.name === 'mobile_390') {
      // Test opening the hamburger menu
      const btn = await page.$('button[aria-label="Open Navigation Menu"]');
      if (btn) {
        await btn.click();
        await new Promise(r => setTimeout(r, 600));
        const menuOutPath = path.resolve(__dirname, '../reports/hero_mobile_menu_open.png');
        await page.screenshot({ path: menuOutPath });
        console.log(`Saved mobile menu open to ${menuOutPath}`);
      }
    }

    await page.close();
  }

  await browser.close();
}

captureAll().catch(err => {
  console.error(err);
  process.exit(1);
});
