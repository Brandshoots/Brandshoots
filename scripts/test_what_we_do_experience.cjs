const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const outDir = path.join(__dirname, '..', 'reports', 'what_we_do_blast');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const steps = [
    { name: '00_opening_statement', progress: 0.04 },
    { name: '01_brand_creative', progress: 0.14 },
    { name: '02_video_production', progress: 0.26 },
    { name: '03_short_form', progress: 0.37 },
    { name: '04_editing_post', progress: 0.48 },
    { name: '05_social_content', progress: 0.60 },
    { name: '06_digital_growth', progress: 0.71 },
    { name: '07_final_manifesto', progress: 0.88 },
    { name: '08_unpin_into_clients', progress: 1.03 },
  ];

  async function testViewport(name, width, height, isMobileDevice = false) {
    console.log(`\n========================================`);
    console.log(`TESTING VIEWPORT: ${name} (${width}x${height})`);
    console.log(`========================================`);
    const page = await browser.newPage();
    await page.setViewport({ width, height, isMobile: isMobileDevice });

    await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    const metrics = await page.evaluate(() => {
      const section = document.getElementById('what-we-do');
      const rect = section ? section.getBoundingClientRect() : { top: 0, height: 0 };
      return {
        sectionTop: rect.top + window.scrollY,
        sectionHeight: section ? section.offsetHeight : 0,
        viewportHeight: window.innerHeight,
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    });
    console.log(`[${name}] Metrics:`, metrics);

    const pinDistance = 4200; // GSAP end: '+=4200'

    for (const step of steps) {
      const targetScroll = metrics.sectionTop + (pinDistance * step.progress);
      await page.evaluate((y) => {
        window.scrollTo(0, y);
        if (window.__lenis) {
          window.__lenis.scrollTo(y, { immediate: true });
        }
      }, targetScroll);
      await new Promise(r => setTimeout(r, 600));

      const screenshotName = `${name}_${step.name}.png`;
      await page.screenshot({ path: path.join(outDir, screenshotName) });
      console.log(`Saved ${screenshotName}`);
    }

    // Reverse scroll back to Chapter 01
    const reverseTarget = metrics.sectionTop + (pinDistance * 0.15);
    await page.evaluate((y) => {
      window.scrollTo(0, y);
      if (window.__lenis) {
        window.__lenis.scrollTo(y, { immediate: true });
      }
    }, reverseTarget);
    await new Promise(r => setTimeout(r, 600));
    const reverseScreenshot = `${name}_reverse_to_01.png`;
    await page.screenshot({ path: path.join(outDir, reverseScreenshot) });
    console.log(`Saved ${reverseScreenshot}`);

    if (!isMobileDevice) {
      console.log(`[${name}] Testing pointer parallax...`);
      await page.mouse.move(width * 0.8, height * 0.4);
      await new Promise(r => setTimeout(r, 300));
      await page.screenshot({ path: path.join(outDir, `${name}_parallax.png`) });
      console.log(`Saved ${name}_parallax.png`);
    }

    await page.close();
  }

  await testViewport('desktop_1440', 1440, 900);
  await testViewport('mobile_390', 390, 844, true);

  await browser.close();
  console.log('\nAll matrix tests finished successfully!');
})();
