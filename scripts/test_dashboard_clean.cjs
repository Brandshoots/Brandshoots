const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  const artifactsDir = 'C:/Users/SURYARAJA/.gemini/antigravity/brain/cd1ca2b0-a812-41d9-bd25-1104d25cfeb7';

  console.log('Navigating to Admin Dashboard...');
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

  // Click on What We Do or Clientele to see the clean header
  await new Promise(r => setTimeout(r, 1000));
  const dashboardScreenshotPath = path.join(artifactsDir, 'clean_admin_dashboard_no_tags.png');
  await page.screenshot({ path: dashboardScreenshotPath, fullPage: false });
  console.log('Saved clean dashboard screenshot:', dashboardScreenshotPath);

  await browser.close();
  console.log('Done!');
})();
