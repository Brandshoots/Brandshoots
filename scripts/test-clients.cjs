const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

async function testClientsSection() {
  const reportsDir = path.resolve(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  console.log('--- TESTING OUR CLIENTS SECTION ---');

  // 1. Desktop Test (1920x1080)
  {
    console.log('Running Desktop 1920x1080 Test...');
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    // Scroll to #clients section
    const targetScrollY = await page.evaluate(() => {
      const el = document.getElementById('clients');
      return el ? el.getBoundingClientRect().top + window.scrollY : 2500;
    });

    console.log('Scrolling to #clients at Y =', targetScrollY);
    await page.evaluate((y) => window.scrollTo(0, y), targetScrollY);
    await new Promise(r => setTimeout(r, 1200));

    // Capture initial arrival at Our Clients
    await page.screenshot({ path: path.resolve(reportsDir, 'clients_desktop_initial.png') });
    console.log('Saved clients_desktop_initial.png');

    // Scroll into the pinned scrub (advancing clients)
    await page.evaluate((y) => window.scrollTo(0, y + 800), targetScrollY);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.resolve(reportsDir, 'clients_desktop_scrubbed.png') });
    console.log('Saved clients_desktop_scrubbed.png');

    // Check overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Desktop 1920: clientWidth=${clientWidth}, scrollWidth=${scrollWidth}, hasOverflow=${scrollWidth > clientWidth}`);

    // Direct Project View Test on Desktop
    console.log('Testing direct desktop project page view...');
    await page.goto('http://localhost:5173/portfolio/santhi-pipes', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.resolve(reportsDir, 'client_project_view_desktop.png') });
    console.log('Saved client_project_view_desktop.png');

    // Click "Back to Clients" button
    const backBtnFound = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Back to Clients'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });
    console.log('Back to clients button clicked:', backBtnFound);
    await new Promise(r => setTimeout(r, 1200));
    console.log('Page URL after returning:', page.url());

    await page.close();
  }

  // 2. Tablet Test (820x1180)
  {
    console.log('Running Tablet 820x1180 Test...');
    const page = await browser.newPage();
    await page.setViewport({ width: 820, height: 1180 });
    await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    const targetScrollY = await page.evaluate(() => {
      const el = document.getElementById('clients');
      return el ? el.getBoundingClientRect().top + window.scrollY : 2500;
    });

    await page.evaluate((y) => window.scrollTo(0, y), targetScrollY);
    await new Promise(r => setTimeout(r, 1200));

    await page.screenshot({ path: path.resolve(reportsDir, 'clients_tablet.png') });
    console.log('Saved clients_tablet.png');

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Tablet 820: clientWidth=${clientWidth}, scrollWidth=${scrollWidth}, hasOverflow=${scrollWidth > clientWidth}`);

    await page.close();
  }

  // 3. Mobile Test (390x844 - iPhone 14 / modern flagship)
  {
    console.log('Running Mobile 390x844 Test...');
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    const targetScrollY = await page.evaluate(() => {
      const el = document.getElementById('clients');
      return el ? el.getBoundingClientRect().top + window.scrollY : 2500;
    });

    await page.evaluate((y) => window.scrollTo(0, y), targetScrollY);
    await new Promise(r => setTimeout(r, 1200));

    await page.screenshot({ path: path.resolve(reportsDir, 'clients_mobile_initial.png') });
    console.log('Saved clients_mobile_initial.png');

    // Drag / swipe interaction on mobile
    console.log('Testing mobile touch swipe on carousel...');
    const trackBox = await page.evaluate(() => {
      const el = document.getElementById('clients');
      if (el) {
        const rect = el.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      }
      return null;
    });

    if (trackBox) {
      await page.mouse.move(trackBox.x + 100, trackBox.y);
      await page.mouse.down();
      await page.mouse.move(trackBox.x - 150, trackBox.y, { steps: 10 });
      await page.mouse.up();
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.resolve(reportsDir, 'clients_mobile_dragged.png') });
      console.log('Saved clients_mobile_dragged.png');
    }

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Mobile 390: clientWidth=${clientWidth}, scrollWidth=${scrollWidth}, hasOverflow=${scrollWidth > clientWidth}`);

    // Direct Project View Test on Mobile
    console.log('Testing direct mobile project page view...');
    await page.goto('http://localhost:5173/portfolio/viswatuff-glass', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: path.resolve(reportsDir, 'client_project_view_mobile.png') });
    console.log('Saved client_project_view_mobile.png');

    const projScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const projClientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Mobile Project: clientWidth=${projClientWidth}, scrollWidth=${projScrollWidth}, hasOverflow=${projScrollWidth > projClientWidth}`);

    await page.close();
  }

  await browser.close();
  console.log('--- ALL CLIENTS TESTS COMPLETE ---');
}

testClientsSection().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
