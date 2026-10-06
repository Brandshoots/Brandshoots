const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');

async function testWhatWeDoEditorial() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. Desktop Test (1920x1080)
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    // Scroll to What We Do section
    const targetScrollY = await page.evaluate(() => {
      const el = document.getElementById('what-we-do');
      if (el) {
        return el.getBoundingClientRect().top + window.scrollY;
      }
      return 1080;
    });

    // Capture initial arrival at What We Do (transition from Hero)
    await page.evaluate((y) => window.scrollTo(0, y), targetScrollY);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.resolve(__dirname, '../reports/what_we_do_desktop_start.png') });
    console.log('Saved what_we_do_desktop_start.png');

    // Scroll partially through the pinned scrub (headline assembling)
    await page.evaluate((y) => window.scrollTo(0, y + 600), targetScrollY);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.resolve(__dirname, '../reports/what_we_do_desktop_mid_scrub.png') });
    console.log('Saved what_we_do_desktop_mid_scrub.png');

    // Scroll to fully assembled state
    await page.evaluate((y) => window.scrollTo(0, y + 1400), targetScrollY);
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.resolve(__dirname, '../reports/what_we_do_desktop_assembled.png') });
    console.log('Saved what_we_do_desktop_assembled.png');

    // Check overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Desktop 1920: clientWidth=${clientWidth}, scrollWidth=${scrollWidth}, hasOverflow=${scrollWidth > clientWidth}`);

    await page.close();
  }

  // 2. Tablet Test (820x1180)
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 820, height: 1180 });
    await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    const targetScrollY = await page.evaluate(() => {
      const el = document.getElementById('what-we-do');
      return el ? el.getBoundingClientRect().top + window.scrollY : 1180;
    });

    await page.evaluate((y) => window.scrollTo(0, y + 1200), targetScrollY);
    await new Promise(r => setTimeout(r, 800));

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Tablet 820: clientWidth=${clientWidth}, scrollWidth=${scrollWidth}, hasOverflow=${scrollWidth > clientWidth}`);

    await page.screenshot({ path: path.resolve(__dirname, '../reports/what_we_do_tablet_820.png') });
    console.log('Saved what_we_do_tablet_820.png');
    await page.close();
  }

  // 3. Mobile Test (390x844)
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844 });
    await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    const targetScrollY = await page.evaluate(() => {
      const el = document.getElementById('what-we-do');
      return el ? el.getBoundingClientRect().top + window.scrollY : 844;
    });

    await page.evaluate((y) => window.scrollTo(0, y + 1000), targetScrollY);
    await new Promise(r => setTimeout(r, 800));

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Mobile 390: clientWidth=${clientWidth}, scrollWidth=${scrollWidth}, hasOverflow=${scrollWidth > clientWidth}`);

    await page.screenshot({ path: path.resolve(__dirname, '../reports/what_we_do_mobile_390.png') });
    console.log('Saved what_we_do_mobile_390.png');

    await page.close();
  }

  // 4. Mobile SE (375x667)
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 375, height: 667 });
    await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    const targetScrollY = await page.evaluate(() => {
      const el = document.getElementById('what-we-do');
      return el ? el.getBoundingClientRect().top + window.scrollY : 667;
    });

    await page.evaluate((y) => window.scrollTo(0, y + 900), targetScrollY);
    await new Promise(r => setTimeout(r, 800));

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Mobile 375: clientWidth=${clientWidth}, scrollWidth=${scrollWidth}, hasOverflow=${scrollWidth > clientWidth}`);

    await page.screenshot({ path: path.resolve(__dirname, '../reports/what_we_do_mobile_375.png') });
    console.log('Saved what_we_do_mobile_375.png');

    await page.close();
  }

  await browser.close();
  console.log('Editorial What We Do tests completed successfully!');
}

testWhatWeDoEditorial().catch(console.error);
