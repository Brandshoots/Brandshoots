const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');

async function testScrollThrough() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  console.log('1. Page loaded. Initial scrollY:', await page.evaluate(() => window.scrollY));

  // Scroll to what-we-do
  await page.evaluate(() => {
    const el = document.getElementById('what-we-do');
    el?.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));
  console.log('2. Scrolled to what-we-do, scrollY:', await page.evaluate(() => window.scrollY));

  // Scroll to clients
  await page.evaluate(() => {
    const el = document.getElementById('clients');
    el?.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 1000));
  console.log('3. Scrolled to clients, scrollY:', await page.evaluate(() => window.scrollY));

  // Scroll through clients pin (which is ~1.6 screens, around 1728px)
  await page.mouse.wheel({ deltaY: 2000 });
  await new Promise(r => setTimeout(r, 1500));
  console.log('4. Scrolled through clients pin, scrollY:', await page.evaluate(() => window.scrollY));

  // Now scroll to leadership
  await page.mouse.wheel({ deltaY: 1000 });
  await new Promise(r => setTimeout(r, 2000));
  console.log('5. Scrolled towards leadership, scrollY:', await page.evaluate(() => window.scrollY));
  await page.screenshot({ path: 'reports/test_snap_leadership.png' });

  // Now scroll to CTA
  await page.mouse.wheel({ deltaY: 1200 });
  await new Promise(r => setTimeout(r, 2000));
  console.log('6. Scrolled towards CTA, scrollY:', await page.evaluate(() => window.scrollY));
  await page.screenshot({ path: 'reports/test_snap_cta.png' });

  await browser.close();
  console.log('Done.');
}

testScrollThrough().catch(console.error);
