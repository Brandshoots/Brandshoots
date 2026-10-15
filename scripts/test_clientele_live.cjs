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
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('1. Navigating to /portfolio?nopreload=true...');
  await page.goto('http://localhost:5173/portfolio?nopreload=true', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  // Find the clientele section and scroll using window.__lenis if available or window.scrollTo
  console.log('2. Scrolling to Clientele section on /portfolio...');
  await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent && h.textContent.includes('CLIENTELE'));
    const section = heading ? heading.closest('section') : null;
    if (section) {
      const top = section.getBoundingClientRect().top + window.scrollY;
      if (window.__lenis) {
        window.__lenis.scrollTo(top, { immediate: true });
      } else {
        window.scrollTo(0, top);
      }
    }
  });

  await new Promise(r => setTimeout(r, 2000));

  const screenshotPath = path.resolve(reportsDir, 'live_clientele_filled_verified.png');
  await page.screenshot({ path: screenshotPath });
  console.log('Saved live clientele screenshot:', screenshotPath);

  // Also take a screenshot of just the cards area if desired
  const cardsElement = await page.$('section.border-t');
  if (cardsElement) {
    const sectionScreenshotPath = path.resolve(reportsDir, 'live_clientele_section_only.png');
    await cardsElement.screenshot({ path: sectionScreenshotPath });
    console.log('Saved live clientele section screenshot:', sectionScreenshotPath);
  }

  // Also check homepage / our clients
  console.log('3. Navigating to homepage...');
  await page.goto('http://localhost:5173/?nopreload=true', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2, span')).find(h => h.textContent && (h.textContent.includes('CLIENTELE') || h.textContent.includes('OUR CLIENTS') || h.textContent.includes('TRUSTED BY')));
    const section = heading ? heading.closest('section') : null;
    if (section) {
      const top = section.getBoundingClientRect().top + window.scrollY;
      if (window.__lenis) {
        window.__lenis.scrollTo(top, { immediate: true });
      } else {
        window.scrollTo(0, top);
      }
    }
  });
  await new Promise(r => setTimeout(r, 2000));

  const homeScreenshotPath = path.resolve(reportsDir, 'home_clientele_filled_verified.png');
  await page.screenshot({ path: homeScreenshotPath });
  console.log('Saved home clientele screenshot:', homeScreenshotPath);

  await browser.close();
  console.log('Done!');
})();
