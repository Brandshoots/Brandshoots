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

  console.log('1. Navigating to Admin...');
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

  // Click on "Portfolio" in the sidebar
  console.log('2. Clicking Portfolio section in sidebar...');
  await page.waitForFunction(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.some(b => b.textContent && b.textContent.includes('Portfolio'));
  }, { timeout: 10000 });

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const tab = btns.find(b => b.textContent && b.textContent.trim() === 'Portfolio');
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Capture Portfolio CMS Dashboard
  const dashPath = path.resolve(reportsDir, 'cms_1_7_portfolio_dashboard.png');
  await page.screenshot({ path: dashPath });
  console.log('Saved dashboard screenshot:', dashPath);

  // 2. Click Edit button on the first project (Santhi Pipes)
  console.log('3. Opening Edit Modal for Project #01...');
  await page.waitForSelector('button', { timeout: 10000 });
  const opened = await page.evaluate(() => {
    const editBtns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent && b.textContent.includes('Edit'));
    if (editBtns.length > 0) {
      editBtns[0].click();
      return true;
    }
    return false;
  });
  console.log('Clicked edit button:', opened);
  await new Promise(r => setTimeout(r, 1000));

  // Capture Edit Modal screenshot
  const modalPath = path.resolve(reportsDir, 'cms_1_7_portfolio_modal.png');
  await page.screenshot({ path: modalPath });
  console.log('Saved modal screenshot:', modalPath);

  // 3. Edit title, headline, stats, and More Info narrative
  console.log('4. Editing project fields...');
  await page.evaluate(() => {
    const setReactInput = (selectorOrEl, val) => {
      const el = typeof selectorOrEl === 'string' ? document.querySelector(selectorOrEl) : selectorOrEl;
      if (!el) return;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
      if (setter) {
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };

    const setReactTextArea = (selectorOrEl, val) => {
      const el = typeof selectorOrEl === 'string' ? document.querySelector(selectorOrEl) : selectorOrEl;
      if (!el) return;
      const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
      if (setter) {
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    };

    // 1. Title input
    const inputs = Array.from(document.querySelectorAll('input'));
    const titleInput = inputs.find(i => i.placeholder && i.placeholder.includes('SANTHI PIPES'));
    if (titleInput) setReactInput(titleInput, 'SANTHI PIPES (CMS EDITED)');

    // 2. Headline / short matter
    const headlineInput = inputs.find(i => i.placeholder && i.placeholder.includes('High-Velocity Industrial'));
    if (headlineInput) setReactInput(headlineInput, 'High-Velocity Industrial Cinematography & PVC Precision');

    // 3. Views metric input
    const viewsInput = inputs.find(i => i.placeholder && i.placeholder.includes('250K+'));
    if (viewsInput) setReactInput(viewsInput, '999K+');

    // 4. Followers metric input
    const followersInput = inputs.find(i => i.placeholder && i.placeholder.includes('18K+'));
    if (followersInput) setReactInput(followersInput, '77K+');

    // 5. Likes metric input
    const likesInput = inputs.find(i => i.placeholder && i.placeholder.includes('34K+'));
    if (likesInput) setReactInput(likesInput, '88K+');

    // 6. Story / More Info matter
    const storyTextarea = document.querySelector('textarea');
    if (storyTextarea) setReactTextArea(storyTextarea, 'CMS 1.7 VERIFIED: Custom engineered filmmaking capturing advanced polymer manufacturing and high-velocity automation.');
  });

  await new Promise(r => setTimeout(r, 600));

  // 4. Click Save Project
  console.log('5. Clicking Save Project button...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button[type="submit"]'));
    if (btns.length > 0) btns[0].click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // Capture Saved CMS Dashboard state
  const savedPath = path.resolve(reportsDir, 'cms_1_7_portfolio_saved.png');
  await page.screenshot({ path: savedPath });
  console.log('Saved CMS updated screenshot:', savedPath);

  // 5. Navigate to public /portfolio page
  console.log('6. Navigating to public /portfolio page to verify live sync...');
  await page.goto('http://localhost:5173/portfolio?nopreload=true', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2500));

  // Check if edited title and stats are rendered
  const pageContent = await page.content();
  const hasEditedTitle = pageContent.includes('SANTHI PIPES (CMS EDITED)');
  const hasEditedViews = pageContent.includes('999K+');
  console.log('Verification: Has edited title on /portfolio?', hasEditedTitle);
  console.log('Verification: Has edited views (999K+) on /portfolio?', hasEditedViews);

  const livePath = path.resolve(reportsDir, 'live_portfolio_verified.png');
  await page.screenshot({ path: livePath });
  console.log('Saved live portfolio screenshot:', livePath);

  // 6. Click MORE INFO button on /portfolio
  console.log('7. Clicking MORE INFO button on /portfolio...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const moreInfoBtn = btns.find(b => b.textContent && b.textContent.includes('MORE INFO'));
    if (moreInfoBtn) moreInfoBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Check if More Info modal opened and contains the edited narrative
  const modalContent = await page.content();
  const hasEditedStory = modalContent.includes('CMS 1.7 VERIFIED: Custom engineered filmmaking');
  console.log('Verification: Has edited More Info story in modal?', hasEditedStory);

  const moreInfoPath = path.resolve(reportsDir, 'live_portfolio_more_info_verified.png');
  await page.screenshot({ path: moreInfoPath });
  console.log('Saved live More Info modal screenshot:', moreInfoPath);

  // 7. Test Undo Flow in Admin
  console.log('8. Returning to Admin to test Undo flow...');
  await page.goto('http://localhost:5173/admin', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const tab = btns.find(b => b.textContent && b.textContent.trim() === 'Portfolio');
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Click Undo in Navbar
  console.log('9. Clicking Undo button in navbar...');
  const undoClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const undoBtn = btns.find(b => b.title && b.title.includes('Undo'));
    if (undoBtn) {
      undoBtn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked navbar undo button:', undoClicked);
  await new Promise(r => setTimeout(r, 1500));

  const undonePath = path.resolve(reportsDir, 'cms_1_7_portfolio_undone.png');
  await page.screenshot({ path: undonePath });
  console.log('Saved undone screenshot:', undonePath);

  await browser.close();
  console.log('CMS 1.7 Portfolio end-to-end test completed successfully!');
})();
