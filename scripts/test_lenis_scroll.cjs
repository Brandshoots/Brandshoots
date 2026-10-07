const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });
  await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  const initialY = await page.evaluate(() => window.scrollY);
  console.log('Initial scrollY:', initialY);

  await page.evaluate(() => {
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo('#footer', { immediate: true });
    } else {
      window.scrollTo(0, document.body.scrollHeight);
    }
  });

  await new Promise(r => setTimeout(r, 1500));
  const scrolledY = await page.evaluate(() => window.scrollY);
  console.log('Scrolled scrollY:', scrolledY);

  const footerRect = await page.evaluate(() => {
    const f = document.getElementById('footer');
    const r = f.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, height: r.height };
  });
  console.log('Footer rect:', footerRect);

  await browser.close();
})();
