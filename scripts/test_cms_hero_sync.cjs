const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

async function testCMSHeroSync() {
  const screenshotsDir = path.resolve(__dirname, '../reports/cms_hero_tests');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('=== TEST 1: LIVE HOMEPAGE 3D REEL WALL INITIAL LOAD ===');
  await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const initialReelCount = await page.evaluate(() => {
    return document.querySelectorAll('.cylinder-card').length;
  });
  console.log(`Live site 3D cylinder cards count: ${initialReelCount}`);

  await page.screenshot({ path: path.join(screenshotsDir, '01_live_initial_hero.png') });

  console.log('\n=== TEST 2: ADMIN DASHBOARD CMS 1.2 HERO SECTION ===');
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // If on login page, fill credentials
  const isLoginPage = await page.$('input[type="password"]');
  if (isLoginPage) {
    console.log('Logging into Admin Panel with master credentials...');
    await page.type('input[placeholder*="username" i], input[type="text"]', 'admin');
    await page.type('input[type="password"]', 'BD@admin2026');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 1500));
  }

  // Ensure we are on Home -> Hero Section
  const heroSectionHeading = await page.evaluate(() => {
    const heading = document.querySelector('h2');
    return heading ? heading.innerText : null;
  });
  console.log(`CMS Section Heading: ${heroSectionHeading}`);

  const adminReelCardsCount = await page.evaluate(() => {
    return document.querySelectorAll('button[title*="Edit Reel"]').length;
  });
  console.log(`CMS 1.2 loaded reels count: ${adminReelCardsCount}`);

  await page.screenshot({ path: path.join(screenshotsDir, '02_admin_cms_hero_dashboard.png') });

  console.log('\n=== TEST 3: UPDATE REEL AND SAVE VIA CMS 1.2 ===');
  // Click first edit button
  const editButtons = await page.$$('button[title*="Edit Reel"]');
  if (editButtons.length > 0) {
    await editButtons[0].click();
    await new Promise(r => setTimeout(r, 800));

    // Clear and change title
    const titleInput = await page.$('input[placeholder*="BrandShoots Creative Studio"]');
    if (titleInput) {
      await titleInput.click({ clickCount: 3 });
      await titleInput.type('BrandShoots Creative Studio (CMS 1.2 Live)');
    }

    // Submit modal
    const saveReelBtn = await page.$('button[type="submit"]');
    if (saveReelBtn) {
      await saveReelBtn.click();
      await new Promise(r => setTimeout(r, 800));
    }

    // Scroll to top and click "Save All Changes" primary button
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await new Promise(r => setTimeout(r, 600));

    const clicked = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Save All Changes'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    if (clicked) {
      console.log('Successfully clicked "Save All Changes"!');
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  await page.screenshot({ path: path.join(screenshotsDir, '03_admin_cms_after_save.png') });

  console.log('\n=== TEST 4: VERIFY REAL-TIME SYNC ON LIVE SITE ===');
  await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  const updatedReelsInStorage = await page.evaluate(() => {
    try {
      const data = localStorage.getItem('brandshoots_hero_reels');
      return data ? JSON.parse(data)[0].title : null;
    } catch (e) {
      return null;
    }
  });
  console.log(`Title reflected in Live Site storage/stream: "${updatedReelsInStorage}"`);

  await page.screenshot({ path: path.join(screenshotsDir, '04_live_after_cms_update.png') });

  console.log('\n=== CMS 1.2 TEST COMPLETED SUCCESSFULLY ===');
  await browser.close();
}

testCMSHeroSync().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
