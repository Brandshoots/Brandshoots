const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

async function runFinalQA() {
  const reportsDir = path.resolve(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const viewports = [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'tablet', width: 820, height: 1180 },
    { name: 'mobile', width: 390, height: 844 },
    { name: 'small_mobile', width: 360, height: 740 }
  ];

  console.log('=== BRANDSHOOTS PHASE 1 FINAL QA AUDIT ===');

  for (const vp of viewports) {
    console.log(`\n--- Testing Viewport: ${vp.name.toUpperCase()} (${vp.width}x${vp.height}) ---`);
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });

    const consoleErrors = [];
    const failedRequests = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('requestfailed', req => {
      failedRequests.push(`${req.method()} ${req.url()} (${req.failure()?.errorText})`);
    });

    await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    // Measure document and all sections
    const auditData = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('section, footer')).map((el, i) => {
        const rect = el.getBoundingClientRect();
        return {
          index: i,
          id: el.id || el.tagName.toLowerCase(),
          offsetTop: el.offsetTop,
          top: rect.top + window.scrollY,
          height: rect.height
        };
      });

      return {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        sections
      };
    });

    console.log(`Document Height: ${auditData.scrollHeight}px`);
    console.log(`Horizontal Overflow: ${auditData.hasHorizontalOverflow} (clientWidth=${auditData.clientWidth}, scrollWidth=${auditData.scrollWidth})`);
    console.log('Sections:', JSON.stringify(auditData.sections, null, 2));

    // Capture each section
    for (const sec of auditData.sections) {
      await page.evaluate((id, index) => {
        const el = id && id !== 'section' ? document.getElementById(id) : document.querySelectorAll('section, footer')[index];
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      }, sec.id, sec.index);
      await new Promise(r => setTimeout(r, 1200));
      const filename = `qa_${vp.name}_${sec.id}.png`;
      await page.screenshot({ path: path.resolve(reportsDir, filename) });
      console.log(`  Saved screenshot: ${filename}`);
    }

    // Also test clicking a client logo to make sure routing works
    if (vp.name === 'desktop') {
      const projectNavSuccess = await page.evaluate(() => {
        const tile = document.querySelector('#clients .group\\/tile');
        if (tile) {
          tile.click();
          return true;
        }
        return false;
      });
      console.log('Client tile clicked:', projectNavSuccess);
      await new Promise(r => setTimeout(r, 1000));
      console.log('URL after clicking tile:', page.url());
      await page.screenshot({ path: path.resolve(reportsDir, `qa_${vp.name}_portfolio_view.png`) });
    }

    console.log(`Console Errors (${consoleErrors.length}):`, consoleErrors);
    console.log(`Failed Requests (${failedRequests.length}):`, failedRequests);

    await page.close();
  }

  await browser.close();
  console.log('\n=== FINAL QA AUDIT COMPLETE ===');
}

runFinalQA().catch(console.error);
