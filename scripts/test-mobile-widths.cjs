const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');

async function testMobileWidths() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const targets = [
    { name: 'mobile_375', width: 375, height: 667 }, // iPhone SE
    { name: 'mobile_390', width: 390, height: 844 }, // iPhone 14
    { name: 'mobile_430', width: 430, height: 932 }, // iPhone 15 Pro Max
    { name: 'desktop_1920', width: 1920, height: 1080 } // Desktop verification
  ];

  for (const t of targets) {
    const page = await browser.newPage();
    await page.setViewport({ width: t.width, height: t.height });
    await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2600));

    // Check for any horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`${t.name}: clientWidth=${clientWidth}, scrollWidth=${scrollWidth}, hasOverflow=${scrollWidth > clientWidth}`);

    const outPath = path.resolve(__dirname, `../reports/${t.name}_new_hero.png`);
    await page.screenshot({ path: outPath });
    console.log(`Saved ${outPath}`);
    await page.close();
  }

  await browser.close();
}

testMobileWidths().catch(err => {
  console.error(err);
  process.exit(1);
});
