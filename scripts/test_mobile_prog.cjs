const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto('http://localhost:5173/?nopreload');
  await new Promise(r => setTimeout(r, 2000));
  
  for (const prog of [0.14, 0.28, 0.42, 0.56, 0.70, 0.85]) {
    const y = 844 + (5064 * prog);
    await page.evaluate((scrollPos) => {
      window.scrollTo(0, scrollPos);
      if (window.__lenis) {
        window.__lenis.scrollTo(scrollPos, { immediate: true });
      }
    }, y);
    await new Promise(r => setTimeout(r, 600));
    const status = await page.evaluate(() => {
      const bottomText = document.querySelector('#what-we-do .md\\:hidden')?.innerText;
      return {
        scrollY: window.scrollY,
        bottomText,
      };
    });
    console.log(`prog: ${prog}, y: ${Math.round(y)} ->`, status);
  }
  await browser.close();
})();
