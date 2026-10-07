const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

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

  const debugInfo = await page.evaluate(() => {
    const footer = document.getElementById('footer');
    const logoSvg = footer ? footer.querySelector('svg') : null;
    const logoWrap = footer ? footer.querySelector('[role="button"]') : null;
    const rect = footer ? footer.getBoundingClientRect() : null;
    const scrollTriggers = window.ScrollTrigger ? window.ScrollTrigger.getAll().length : 0;
    
    const statementLine = document.querySelector('.statement-line');
    const statementLineStyle = statementLine ? window.getComputedStyle(statementLine) : null;
    
    const logoWrapStyle = logoWrap ? window.getComputedStyle(logoWrap) : null;
    const rectAttr = document.querySelector('#brandshootsFooterRevealClip rect');

    return {
      footerRect: rect,
      scrollY: window.scrollY,
      logoWrapOpacity: logoWrapStyle ? logoWrapStyle.opacity : null,
      logoWrapTransform: logoWrapStyle ? logoWrapStyle.transform : null,
      statementLineOpacity: statementLineStyle ? statementLineStyle.opacity : null,
      statementLineTransform: statementLineStyle ? statementLineStyle.transform : null,
      clipRectWidth: rectAttr ? rectAttr.getAttribute('width') : null,
      svgDisplay: logoSvg ? window.getComputedStyle(logoSvg).display : null,
      svgBBox: logoSvg ? logoSvg.getBoundingClientRect() : null,
    };
  });

  console.log('DEBUG INFO:', JSON.stringify(debugInfo, null, 2));
  await browser.close();
})();
