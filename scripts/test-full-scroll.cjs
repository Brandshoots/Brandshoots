const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

async function testFullScroll() {
  const reportsDir = path.resolve(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  console.log('--- TESTING FULL SCROLL & SECTION TRANSITIONS ---');

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // Get positions of all sections
  const sections = await page.evaluate(() => {
    const list = [];
    document.querySelectorAll('section').forEach((sec, i) => {
      const rect = sec.getBoundingClientRect();
      list.push({
        index: i,
        id: sec.id || `section-${i}`,
        className: sec.className,
        top: rect.top + window.scrollY,
        height: rect.height,
        bottom: rect.top + window.scrollY + rect.height
      });
    });
    return list;
  });
  console.log('Sections found:', JSON.stringify(sections, null, 2));

  // Test scrolling in increments of 800px from top to bottom
  const totalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log('Total document height:', totalHeight);

  // 1. Screenshot at #clients
  const clientsSec = sections.find(s => s.id === 'clients');
  if (clientsSec) {
    await page.evaluate(y => window.scrollTo(0, y), clientsSec.top);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.resolve(reportsDir, 'scroll_at_clients.png') });
    console.log('Captured scroll_at_clients.png at Y =', clientsSec.top);
  }

  // 2. Screenshot at middle of #clients pinning
  if (clientsSec) {
    await page.evaluate(y => window.scrollTo(0, y + 1000), clientsSec.top);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.resolve(reportsDir, 'scroll_during_clients_pin.png') });
    console.log('Captured scroll_during_clients_pin.png');
  }

  // 3. Screenshot when transitioning to #leadership
  const leadershipSec = sections.find(s => s.id === 'leadership');
  if (leadershipSec) {
    // Scroll right where leadership is entering
    await page.evaluate(y => window.scrollTo(0, y - 500), leadershipSec.top);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.resolve(reportsDir, 'scroll_approaching_leadership.png') });
    console.log('Captured scroll_approaching_leadership.png');

    // Scroll to #leadership top
    await page.evaluate(y => window.scrollTo(0, y), leadershipSec.top);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.resolve(reportsDir, 'scroll_at_leadership.png') });
    console.log('Captured scroll_at_leadership.png at Y =', leadershipSec.top);

    // Scroll scrub inside leadership
    await page.evaluate(y => window.scrollTo(0, y + 800), leadershipSec.top);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.resolve(reportsDir, 'scroll_during_leadership.png') });
    console.log('Captured scroll_during_leadership.png');
  }

  // 4. Screenshot at #cta
  const ctaSec = sections.find(s => s.id === 'cta');
  if (ctaSec) {
    await page.evaluate(y => window.scrollTo(0, y), ctaSec.top);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.resolve(reportsDir, 'scroll_at_cta.png') });
    console.log('Captured scroll_at_cta.png');
  }

  await browser.close();
  console.log('--- ALL FULL SCROLL TESTS COMPLETE ---');
}

testFullScroll().catch(console.error);
