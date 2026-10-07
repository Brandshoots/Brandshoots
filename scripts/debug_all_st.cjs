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

  const stDetails = await page.evaluate(() => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const all = ScrollTrigger ? ScrollTrigger.getAll() : [];
    return all.map((st, i) => ({
      index: i,
      trigger: st.trigger ? st.trigger.id || st.trigger.tagName : 'none',
      start: st.start,
      end: st.end,
      isActive: st.isActive,
      progress: st.progress
    }));
  });

  console.log('ALL SCROLLTRIGGERS:', stDetails);
  await browser.close();
})();
