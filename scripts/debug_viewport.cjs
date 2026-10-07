const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });
  await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  await page.evaluate(() => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'instant' });
      if (window.__lenis) window.__lenis.scrollTo(footer, { immediate: true });
    }
  });

  await new Promise(r => setTimeout(r, 3000));

  // Inspect HTML of footer
  const html = await page.evaluate(() => {
    const f = document.getElementById('footer');
    return f ? f.outerHTML.substring(0, 1000) : 'NO FOOTER';
  });
  console.log('FOOTER HTML SAMPLE:', html);

  // Take screenshot of the whole page at current scroll
  await page.screenshot({ path: 'reports/debug_viewport.png' });
  console.log('Saved debug_viewport.png');

  await browser.close();
})();
