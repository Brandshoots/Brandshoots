const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  
  await page.waitForFunction(() => {
    const imgs = Array.from(document.querySelectorAll('#clients img'));
    return imgs.length > 0 && imgs.every(img => img.complete && img.naturalHeight > 0);
  }, { timeout: 15000 });

  await page.evaluate(() => {
    const clients = document.getElementById('clients');
    if (clients) clients.scrollIntoView({ behavior: 'instant' });
  });

  // Let it scroll for 8 seconds to capture the other half of the clients
  await new Promise(r => setTimeout(r, 8000));

  const outPath = path.resolve(__dirname, '../reports/clients_section_live_scroll.png');
  const clientsEl = await page.$('#clients');
  if (clientsEl) {
    await clientsEl.screenshot({ path: outPath });
  }
  console.log('Saved scroll screenshot to', outPath);
  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
