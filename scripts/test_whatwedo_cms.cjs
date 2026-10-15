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
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:5173/admin...');
  await page.goto('http://localhost:5173/admin', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  // Handle Login if present
  const isLoginPage = await page.$('input[type="password"]');
  if (isLoginPage) {
    console.log('Logging in...');
    await page.type('input[placeholder*="username" i], input[type="text"]', 'admin');
    await page.type('input[type="password"]', 'BD@admin2026');
    await page.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 1500));
  }

  // Click on "What We Do" tab
  console.log('Navigating to What We Do subtab...');
  const whatWeDoSubtab = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(b => b.textContent && b.textContent.includes('What We Do'));
  });

  if (whatWeDoSubtab) {
    await whatWeDoSubtab.click();
    await new Promise(r => setTimeout(r, 1200));
  }

  // 1. Capture CMS 1.3 What We Do Section Dashboard
  const dashPath = path.resolve(reportsDir, 'cms_1_3_whatwedo_dashboard.png');
  await page.screenshot({ path: dashPath });
  console.log('Saved dashboard screenshot:', dashPath);

  // 2. Click "Edit Section" button on Mini-Section #01
  console.log('Opening Edit Modal for Section #01...');
  const editButtons = await page.$$('button[title*="Edit Section"]');
  console.log(`Found ${editButtons.length} edit buttons`);

  if (editButtons.length > 0) {
    await editButtons[0].click();
    await new Promise(r => setTimeout(r, 800));

    // Capture Modal screenshot
    const modalPath = path.resolve(reportsDir, 'cms_1_3_whatwedo_modal.png');
    await page.screenshot({ path: modalPath });
    console.log('Saved modal screenshot:', modalPath);

    // Edit fields:
    // Title Line 1
    const line1Input = await page.$('input[placeholder="e.g. VIDEO"]');
    if (line1Input) {
      await line1Input.click({ clickCount: 3 });
      await line1Input.press('Backspace');
      await line1Input.type('NEXT-GEN VIDEO');
    }

    // Category
    const catInput = await page.$('input[placeholder="e.g. 01 / VISUAL CRAFT"]');
    if (catInput) {
      await catInput.click({ clickCount: 3 });
      await catInput.press('Backspace');
      await catInput.type('01 / CINEMATIC EXPERIENCES');
    }

    // Tag
    const tagInput = await page.$('input[placeholder="e.g. MASTER CRAFT"]');
    if (tagInput) {
      await tagInput.click({ clickCount: 3 });
      await tagInput.press('Backspace');
      await tagInput.type('PREMIUM GRADE');
    }

    // Matter
    const matterInput = await page.$('textarea');
    if (matterInput) {
      await matterInput.click({ clickCount: 3 });
      await matterInput.press('Backspace');
      await matterInput.type('Transforming ambitious ideas into spellbinding visual masterpieces with cutting-edge cinematic tech.');
    }

    // Click "Save Section Changes"
    const saveBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent && b.textContent.includes('Save Section Changes'));
    });

    if (saveBtn) {
      await saveBtn.click();
      console.log('Clicked Save Section Changes');
      await new Promise(r => setTimeout(r, 600));

      // Capture saved state & navbar flash
      const savedPath = path.resolve(reportsDir, 'cms_1_3_whatwedo_saved.png');
      await page.screenshot({ path: savedPath });
      console.log('Saved updated dashboard screenshot with flash ticker:', savedPath);
    }
  }

  // 3. Open Live Homepage in a new page to verify What We Do live reflection
  console.log('Opening live homepage to verify reflection...');
  const livePage = await browser.newPage();
  await livePage.setViewport({ width: 1440, height: 900 });
  await livePage.goto('http://localhost:5173/?nopreload=true', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // Scroll to services section (#services)
  await livePage.evaluate(() => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  });
  await new Promise(r => setTimeout(r, 1500));

  const livePath = path.resolve(reportsDir, 'cms_1_3_live_homepage_whatwedo.png');
  await livePage.screenshot({ path: livePath });
  console.log('Saved live homepage screenshot:', livePath);

  // Check if live page has the new text
  const liveContent = await livePage.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasLine1: text.includes('NEXT-GEN VIDEO'),
      hasTag: text.includes('PREMIUM GRADE') || text.includes('CINEMATIC EXPERIENCES'),
      hasMatter: text.includes('Transforming ambitious ideas into spellbinding visual masterpieces')
    };
  });
  console.log('Live content verification:', liveContent);

  // 4. Test Navbar Undo
  console.log('Testing Undo in Admin...');
  await page.bringToFront();
  const undoBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.includes('Undo') && !b.disabled);
  });

  if (undoBtn) {
    await undoBtn.click();
    console.log('Clicked navbar Undo button');
    await new Promise(r => setTimeout(r, 1000));

    const undoPath = path.resolve(reportsDir, 'cms_1_3_whatwedo_undone.png');
    await page.screenshot({ path: undoPath });
    console.log('Saved undone screenshot:', undoPath);
  }

  await browser.close();
  console.log('CMS 1.3 verification finished successfully!');
})();
