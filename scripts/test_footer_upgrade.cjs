const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const outDir = path.join(__dirname, '..', 'reports');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // 1. Desktop Test
  console.log('--- TESTING DESKTOP (1440x950) ---');
  const desktopPage = await browser.newPage();
  await desktopPage.setViewport({ width: 1440, height: 950 });

  console.log('Navigating to http://localhost:5173/?nopreload...');
  await desktopPage.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  console.log('Scrolling down directly to footer...');
  await desktopPage.evaluate(() => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'instant' });
      if (window.__lenis) {
        window.__lenis.scrollTo('#footer', { immediate: true });
      }
    }
  });

  // Give GSAP plenty of time to play through the 1.6s entrance timeline
  await new Promise(r => setTimeout(r, 2800));

  const footerElement = await desktopPage.$('#footer');
  if (footerElement) {
    console.log('Capturing Desktop Footer Section...');
    await footerElement.screenshot({ path: path.join(outDir, 'footer_01_desktop.png') });
    console.log('Saved footer_01_desktop.png');

    console.log('Hovering over large BrandShoots logo for living interaction...');
    const logoBtn = await desktopPage.$('footer [aria-label="BrandShoots — Back to Top"]');
    if (logoBtn) {
      const box = await logoBtn.boundingBox();
      if (box) {
        // Move mouse to induce 3D tilt and light sweep
        await desktopPage.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.3);
        await new Promise(r => setTimeout(r, 500));
        await footerElement.screenshot({ path: path.join(outDir, 'footer_02_logo_hover_parallax.png') });
        console.log('Saved footer_02_logo_hover_parallax.png');
      }
    }

    console.log('Hovering over ABOUT editorial link...');
    const aboutLink = await desktopPage.$('footer a[href="/about"]');
    if (aboutLink) {
      await aboutLink.hover();
      await new Promise(r => setTimeout(r, 350));
      await footerElement.screenshot({ path: path.join(outDir, 'footer_03_nav_hover.png') });
      console.log('Saved footer_03_nav_hover.png');
    }
  }
  await desktopPage.close();

  // 2. Mobile Test
  console.log('--- TESTING MOBILE (390x844) ---');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 390, height: 844 });

  await mobilePage.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  await mobilePage.evaluate(() => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'instant' });
      if (window.__lenis) {
        window.__lenis.scrollTo('#footer', { immediate: true });
      }
    }
  });

  await new Promise(r => setTimeout(r, 2800));

  const mobileFooter = await mobilePage.$('#footer');
  if (mobileFooter) {
    await mobileFooter.screenshot({ path: path.join(outDir, 'footer_04_mobile.png') });
    console.log('Saved footer_04_mobile.png');
  }
  await mobilePage.close();

  await browser.close();
  console.log('All footer upgrade tests completed successfully!');
})();
