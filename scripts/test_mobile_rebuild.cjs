const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');

async function testMobileSuite() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const targetViewports = [
    { name: '390x844_iPhone12_13_14', width: 390, height: 844 },
    { name: '375x812_iPhoneX_11Pro', width: 375, height: 812 },
    { name: '360x800_Galaxy_S20', width: 360, height: 800 },
    { name: '393x852_iPhone15_16', width: 393, height: 852 },
    { name: '412x915_Pixel7_8', width: 412, height: 915 },
  ];

  console.log('Testing Mobile Breakpoints & Section Quality...');

  for (const vp of targetViewports) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
    await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2200));

    // Check horizontal overflow
    const overflowCheck = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    console.log(`[${vp.name}] Overflow Check:`, overflowCheck);

    // Capture Hero
    const heroPath = path.resolve(__dirname, `../reports/rebuild_${vp.name}_01_hero.png`);
    await page.screenshot({ path: heroPath });

    if (vp.name.startsWith('390x844')) {
      // Test mobile menu open
      const menuBtn = await page.$('button[aria-label="Open Navigation Menu"]');
      if (menuBtn) {
        await menuBtn.click();
        await new Promise(r => setTimeout(r, 600));
        await page.screenshot({ path: path.resolve(__dirname, '../reports/rebuild_02_menu_open.png') });
        console.log('Saved Menu Open Screenshot');

        // Close menu
        const closeBtn = await page.$('button[aria-label="Close Navigation Menu"]');
        if (closeBtn) await closeBtn.click();
        await new Promise(r => setTimeout(r, 400));
      }

      // Scroll to What We Do
      await page.evaluate(() => {
        const el = document.getElementById('what-we-do');
        if (el) el.scrollIntoView();
      });
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.resolve(__dirname, '../reports/rebuild_03_what_we_do.png') });

      // Scroll further down in What We Do
      await page.evaluate(() => window.scrollBy(0, 500));
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.resolve(__dirname, '../reports/rebuild_03b_what_we_do_card.png') });

      // Scroll to Clients
      await page.evaluate(() => {
        const el = document.getElementById('clients');
        if (el) el.scrollIntoView();
      });
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.resolve(__dirname, '../reports/rebuild_04_clients.png') });

      // Scroll to Leadership
      await page.evaluate(() => {
        const el = document.getElementById('leadership');
        if (el) el.scrollIntoView();
      });
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.resolve(__dirname, '../reports/rebuild_05_leadership.png') });

      // Scroll to Testimonials
      await page.evaluate(() => {
        const el = document.getElementById('testimonials');
        if (el) el.scrollIntoView();
      });
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.resolve(__dirname, '../reports/rebuild_06_testimonials.png') });

      // Scroll to CTA
      await page.evaluate(() => {
        const el = document.getElementById('cta');
        if (el) el.scrollIntoView();
      });
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.resolve(__dirname, '../reports/rebuild_07_cta.png') });

      // Scroll to Footer
      await page.evaluate(() => {
        const el = document.getElementById('footer');
        if (el) el.scrollIntoView();
      });
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.resolve(__dirname, '../reports/rebuild_08_footer.png') });
    }

    await page.close();
  }

  await browser.close();
  console.log('Mobile QA Suite Complete.');
}

testMobileSuite().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
