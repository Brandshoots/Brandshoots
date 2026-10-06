const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

async function runSnapSuite() {
  const reportsDir = path.resolve(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  // 1. DESKTOP TEST
  console.log('=== 1. TESTING DESKTOP (1920x1080) ===');
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // Initial Hero
  console.log('Hero initial scrollY:', await page.evaluate(() => window.scrollY));
  await page.screenshot({ path: path.resolve(reportsDir, 'snap_desktop_01_hero.png') });

  // Scroll with wheel flick towards What We Do
  console.log('Flicking wheel downwards from Hero...');
  await page.mouse.wheel({ deltaY: 500 });
  await new Promise(r => setTimeout(r, 1200));
  const scrollAfterWWD = await page.evaluate(() => window.scrollY);
  console.log('Scroll after wheel to What We Do:', scrollAfterWWD);
  await page.screenshot({ path: path.resolve(reportsDir, 'snap_desktop_02_what_we_do.png') });

  // Scroll with wheel flick towards Clients
  console.log('Flicking wheel downwards from What We Do...');
  await page.mouse.wheel({ deltaY: 600 });
  await new Promise(r => setTimeout(r, 1200));
  const scrollAfterClients = await page.evaluate(() => window.scrollY);
  console.log('Scroll after wheel to Clients:', scrollAfterClients);
  await page.screenshot({ path: path.resolve(reportsDir, 'snap_desktop_03_clients.png') });

  // Scroll through client pin
  console.log('Scrubbing client logos in pin...');
  await page.mouse.wheel({ deltaY: 1800 });
  await new Promise(r => setTimeout(r, 1000));

  // Scroll down to Leadership
  console.log('Flicking wheel downwards to Leadership...');
  await page.mouse.wheel({ deltaY: 800 });
  await new Promise(r => setTimeout(r, 1200));
  const scrollAfterLeadership = await page.evaluate(() => window.scrollY);
  console.log('Scroll after wheel to Leadership:', scrollAfterLeadership);
  await page.screenshot({ path: path.resolve(reportsDir, 'snap_desktop_04_leadership.png') });

  // Scroll down to CTA
  console.log('Flicking wheel downwards to CTA...');
  await page.mouse.wheel({ deltaY: 800 });
  await new Promise(r => setTimeout(r, 1200));
  const scrollAfterCTA = await page.evaluate(() => window.scrollY);
  console.log('Scroll after wheel to CTA:', scrollAfterCTA);
  await page.screenshot({ path: path.resolve(reportsDir, 'snap_desktop_05_cta.png') });

  // Scroll down to Footer
  console.log('Scrolling to Footer at bottom...');
  await page.mouse.wheel({ deltaY: 600 });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.resolve(reportsDir, 'snap_desktop_06_footer.png') });

  await page.close();

  // 2. MOBILE TEST (390x844)
  console.log('\n=== 2. TESTING MOBILE (390x844) ===');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844 });

  await mobilePage.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // Inspect section heights on mobile
  const mobileSections = await mobilePage.evaluate(() => {
    return Array.from(document.querySelectorAll('section, footer')).map((el, i) => {
      const rect = el.getBoundingClientRect();
      return {
        id: el.id || el.tagName.toLowerCase(),
        height: rect.height,
        windowHeight: window.innerHeight,
        is100vh: Math.abs(rect.height - window.innerHeight) <= 2
      };
    });
  });
  console.log('Mobile section heights:', JSON.stringify(mobileSections, null, 2));

  // Capture each mobile section by locking to each
  const sectionIds = ['hero', 'what-we-do', 'clients', 'leadership', 'cta', 'footer'];
  for (const id of sectionIds) {
    await mobilePage.evaluate((secId) => {
      const el = document.getElementById(secId);
      if (el) {
        if (window.__lenis) {
          window.__lenis.scrollTo(el, { immediate: true });
        } else {
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      }
    }, id);
    await new Promise(r => setTimeout(r, 1000));
    await mobilePage.screenshot({ path: path.resolve(reportsDir, `snap_mobile_${id}.png`) });
    console.log(`Captured mobile screenshot: snap_mobile_${id}.png`);
  }

  await mobilePage.close();
  await browser.close();
  console.log('\n=== SNAP SUITE COMPLETE ===');
}

runSnapSuite().catch(console.error);
