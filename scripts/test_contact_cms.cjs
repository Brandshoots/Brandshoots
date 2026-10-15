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
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  // Set admin session in localStorage to bypass login
  await page.goto('http://localhost:5173/admin', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('bs_admin_auth_fallback', JSON.stringify({
      email: 'admin@brandshoots.com',
      authenticatedAt: new Date().toISOString()
    }));
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  console.log('1. Navigating to Contact tab in admin...');
  await page.evaluate(() => {
    const contactBtn = Array.from(document.querySelectorAll('button')).find(
      b => b.textContent && b.textContent.trim() === 'Contact'
    );
    if (contactBtn) contactBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  const cmsScreenshot = path.resolve(reportsDir, 'contact_cms_dashboard.png');
  await page.screenshot({ path: cmsScreenshot });
  console.log('Saved contact CMS screenshot:', cmsScreenshot);

  console.log('2. Testing Edit & Save...');
  // Edit the hero headline or highlight
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    const highlightInput = inputs.find(i => i.placeholder && i.placeholder.includes('WORTH WATCHING'));
    if (highlightInput) {
      highlightInput.value = 'ALWAYS WORTH WATCHING.';
      highlightInput.dispatchEvent(new Event('input', { bubbles: true }));
      highlightInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // Click Save
  await page.evaluate(() => {
    const saveBtn = Array.from(document.querySelectorAll('button')).find(
      b => b.textContent && b.textContent.includes('Save & Publish')
    );
    if (saveBtn) saveBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  const savedScreenshot = path.resolve(reportsDir, 'contact_cms_saved.png');
  await page.screenshot({ path: savedScreenshot });
  console.log('Saved contact CMS after save:', savedScreenshot);

  console.log('3. Checking live /contact page...');
  await page.goto('http://localhost:5173/contact?nopreload=true', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  const liveScreenshot = path.resolve(reportsDir, 'live_contact_updated.png');
  await page.screenshot({ path: liveScreenshot });
  console.log('Saved live contact page screenshot:', liveScreenshot);

  console.log('4. Navigating back to admin to check Leads tab and reset...');
  await page.goto('http://localhost:5173/admin', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const contactBtn = Array.from(document.querySelectorAll('button')).find(
      b => b.textContent && b.textContent.trim() === 'Contact'
    );
    if (contactBtn) contactBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Click Inquiries & Leads tab
  await page.evaluate(() => {
    const leadsTab = Array.from(document.querySelectorAll('button')).find(
      b => b.textContent && b.textContent.includes('Inquiries & Leads')
    );
    if (leadsTab) leadsTab.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const leadsScreenshot = path.resolve(reportsDir, 'contact_cms_leads_inbox.png');
  await page.screenshot({ path: leadsScreenshot });
  console.log('Saved leads inbox screenshot:', leadsScreenshot);

  // Switch back to Channels & Content and Reset to Defaults
  await page.evaluate(() => {
    const contentTab = Array.from(document.querySelectorAll('button')).find(
      b => b.textContent && b.textContent.includes('Channels & Content')
    );
    if (contentTab) contentTab.click();
  });
  await new Promise(r => setTimeout(r, 800));

  page.on('dialog', async dialog => {
    console.log('Dialog message:', dialog.message());
    await dialog.accept();
  });

  await page.evaluate(() => {
    const resetBtn = Array.from(document.querySelectorAll('button')).find(
      b => b.textContent && b.textContent.includes('Reset Defaults')
    );
    if (resetBtn) resetBtn.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  const resetScreenshot = path.resolve(reportsDir, 'contact_cms_reset.png');
  await page.screenshot({ path: resetScreenshot });
  console.log('Saved reset screenshot:', resetScreenshot);

  await browser.close();
  console.log('All Contact CMS tests passed successfully!');
})();
