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
  await new Promise(r => setTimeout(r, 1500));

  await page.evaluate(() => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'instant' });
      if (window.__lenis) {
        window.__lenis.scrollTo(footer, { immediate: true });
      }
      if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    }
  });

  await new Promise(r => setTimeout(r, 2500));

  const info = await page.evaluate(() => {
    const logoWrap = document.querySelector('footer [role="button"]');
    const statementLine = document.querySelector('.statement-line');
    const clipRect = document.querySelector('#brandshootsFooterRevealClip rect');
    return {
      logoOpacity: logoWrap ? window.getComputedStyle(logoWrap).opacity : null,
      statementOpacity: statementLine ? window.getComputedStyle(statementLine).opacity : null,
      clipWidth: clipRect ? clipRect.getAttribute('width') : null
    };
  });

  console.log('TRIGGER RESULT:', info);
  await page.screenshot({ path: 'reports/debug_trigger_footer.png' });
  await browser.close();
})();
