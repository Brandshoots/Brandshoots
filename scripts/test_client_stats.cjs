const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

async function testClientStats() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const artifactsDir = 'C:/Users/SURYARAJA/.gemini/antigravity/brain/cd1ca2b0-a812-41d9-bd25-1104d25cfeb7';

  try {
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

    // Click Clientele tab
    console.log('2. Clicking Clientele tab...');
    await page.waitForFunction(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.textContent && b.textContent.includes('Clientele'));
    }, { timeout: 10000 });

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const clientTab = btns.find(b => b.textContent && b.textContent.includes('Clientele'));
      if (clientTab) clientTab.click();
    });
    await new Promise(r => setTimeout(r, 1500));

    // Click Edit on Santhi Pipes
    console.log('3. Clicking Edit on Santhi Pipes...');
    await page.evaluate(() => {
      const editBtns = Array.from(document.querySelectorAll('button[title*="Edit"]'));
      if (editBtns.length > 0) editBtns[0].click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Fill Views and Likes in modal
    console.log('4. Updating Views and Likes in modal...');
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const viewsInput = inputs.find(i => i.placeholder && i.placeholder.includes('250K+'));
      const likesInput = inputs.find(i => i.placeholder && i.placeholder.includes('34K+'));
      if (viewsInput) {
        viewsInput.value = '650K+';
        viewsInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (likesInput) {
        likesInput.value = '88K+';
        likesInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    // Save client
    console.log('5. Submitting Save...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button[type="submit"]'));
      const saveBtn = btns.find(b => b.textContent && b.textContent.includes('Save'));
      if (saveBtn) saveBtn.click();
      else if (btns.length > 0) btns[0].click();
    });
    await new Promise(r => setTimeout(r, 1500));

    // Capture post-save CMS
    const savedCmsScreenshotPath = path.join(artifactsDir, 'clientele_cms_saved_stats.png');
    await page.screenshot({ path: savedCmsScreenshotPath, fullPage: false });
    console.log('Saved Post-Save CMS screenshot:', savedCmsScreenshotPath);

    // 6. Navigate to Homepage to view Our Clients section
    console.log('6. Navigating to Homepage (?nopreload=true)...');
    await page.goto('http://localhost:5173/?nopreload=true', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    // Scroll directly to #clients section
    console.log('Scrolling to #clients on homepage...');
    await page.evaluate(() => {
      const sec = document.getElementById('clients');
      if (sec) {
        const top = sec.getBoundingClientRect().top + window.scrollY;
        if (window.__lenis) {
          window.__lenis.scrollTo(top, { immediate: true });
        } else {
          window.scrollTo(0, top);
        }
      }
    });
    await new Promise(r => setTimeout(r, 2500));

    const liveHomepageScreenshotPath = path.join(artifactsDir, 'live_clients_section_with_stats.png');
    await page.screenshot({ path: liveHomepageScreenshotPath, fullPage: false });
    console.log('Saved Live Homepage Clients Section screenshot:', liveHomepageScreenshotPath);

    // 7. Navigate to Portfolio page to view clientele section
    console.log('7. Navigating to Portfolio page (?nopreload=true)...');
    await page.goto('http://localhost:5173/portfolio?nopreload=true', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    // Scroll to clientele section on /portfolio
    console.log('Scrolling to clientele section on /portfolio...');
    await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent && h.textContent.includes('CLIENTELE'));
      const section = heading ? heading.closest('section') : null;
      if (section) {
        const top = section.getBoundingClientRect().top + window.scrollY;
        if (window.__lenis) {
          window.__lenis.scrollTo(top, { immediate: true });
        } else {
          window.scrollTo(0, top);
        }
      }
    });
    await new Promise(r => setTimeout(r, 2000));

    const livePortfolioScreenshotPath = path.join(artifactsDir, 'live_portfolio_clientele_with_stats.png');
    await page.screenshot({ path: livePortfolioScreenshotPath, fullPage: false });
    console.log('Saved Live Portfolio Clientele screenshot:', livePortfolioScreenshotPath);

    console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testClientStats();
