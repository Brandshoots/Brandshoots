const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CDP_PORT = 9228;
const PREVIEW_PORT = 4188;
const USER_DATA = path.join(process.env.TEMP || 'C:\\Temp', 'chrome_test_' + Date.now());

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class CdpClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { res, rej } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) rej(msg.error);
          else res(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = this.id++;
      this.callbacks.set(msgId, { res: resolve, rej: reject });
      this.ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  close() {
    if (this.ws) {
      try { this.ws.close(); } catch (e) {}
    }
  }
}

async function main() {
  console.log("Starting static preview server on port", PREVIEW_PORT);
  const viteBin = 'C:\\Users\\SURYARAJA\\Desktop\\Web & App\\BrandShoots\\node_modules\\vite\\bin\\vite.js';
  const previewProc = spawn('node', [
    viteBin,
    'preview',
    'C:\\Users\\SURYARAJA\\Desktop\\Web & App\\BrandShoots',
    '--port', String(PREVIEW_PORT),
    '--strictPort'
  ]);

  previewProc.stdout.on('data', d => console.log('[Vite Preview]:', d.toString().trim()));
  previewProc.stderr.on('data', d => console.error('[Vite Preview Error]:', d.toString().trim()));

  // Wait for preview server to be responsive
  let serverReady = false;
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      await new Promise((res, rej) => {
        http.get(`http://localhost:${PREVIEW_PORT}/`, r => res(r.statusCode)).on('error', rej);
      });
      serverReady = true;
      break;
    } catch (e) {}
  }

  if (!serverReady) {
    console.error("Preview server failed to start on port", PREVIEW_PORT);
    previewProc.kill();
    return;
  }
  console.log("Preview server is ready!");

  // Launch Chrome
  console.log("Launching headless Chrome on port", CDP_PORT);
  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${USER_DATA}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--ignore-certificate-errors',
    '--hide-scrollbars',
    '--disable-dev-shm-usage',
    'about:blank'
  ]);

  let targets = null;
  for (let i = 0; i < 25; i++) {
    await sleep(400);
    try {
      targets = await getJson(`http://127.0.0.1:${CDP_PORT}/json/list`);
      if (targets && targets.length > 0) break;
    } catch (e) {}
  }

  if (!targets || targets.length === 0) {
    console.error("Failed to connect to Chrome on port", CDP_PORT);
    chromeProc.kill();
    previewProc.kill();
    return;
  }

  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const client = new CdpClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();

  await client.send('Page.enable');
  await client.send('DOM.enable');
  await client.send('Runtime.enable');

  const reportDirs = [
    'C:/Users/SURYARAJA/Desktop/Web & App/BrandShoots/reports/rea/withmedia-tools',
    'C:/Users/SURYARAJA/Desktop/Brandshoots Websites/reports/rea/withmedia-tools'
  ];

  async function captureAndSave(name, width, height) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: width < 768
    });
    await sleep(600);

    const { data } = await client.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(data, 'base64');
    for (const d of reportDirs) {
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
      fs.writeFileSync(path.join(d, name), buffer);
    }
    console.log(`Saved screenshot: ${name} (${buffer.length} bytes)`);
  }

  // 1. Navigate to /reference-lab/withmedia
  const targetUrl = `http://localhost:${PREVIEW_PORT}/reference-lab/withmedia`;
  console.log("Navigating to", targetUrl);
  await client.send('Page.navigate', { url: targetUrl });
  await sleep(3500);

  // Desktop (1440 x 900)
  console.log("Capturing Desktop 1440 views...");
  await captureAndSave('brandshoots-withmedia-lab-desktop-1440-hero.png', 1440, 900);

  // Scroll to Services
  await client.send('Runtime.evaluate', {
    expression: 'document.getElementById("services") ? document.getElementById("services").scrollIntoView({behavior: "instant", block: "start"}) : window.scrollTo(0, 900);'
  });
  await sleep(800);
  await captureAndSave('brandshoots-withmedia-lab-desktop-1440-services.png', 1440, 900);

  // Scroll to Studio Systems (Internal Tools)
  await client.send('Runtime.evaluate', {
    expression: 'document.getElementById("systems") ? document.getElementById("systems").scrollIntoView({behavior: "instant", block: "start"}) : window.scrollTo(0, 1800);'
  });
  await sleep(800);
  await captureAndSave('brandshoots-withmedia-lab-desktop-1440-systems.png', 1440, 900);

  // Scroll to Portfolio
  await client.send('Runtime.evaluate', {
    expression: 'document.getElementById("portfolio") ? document.getElementById("portfolio").scrollIntoView({behavior: "instant", block: "start"}) : window.scrollTo(0, 3200);'
  });
  await sleep(800);
  await captureAndSave('brandshoots-withmedia-lab-desktop-1440-portfolio.png', 1440, 900);

  // Scroll to Clientele
  await client.send('Runtime.evaluate', {
    expression: 'document.getElementById("clientele") ? document.getElementById("clientele").scrollIntoView({behavior: "instant", block: "start"}) : window.scrollTo(0, 4400);'
  });
  await sleep(800);
  await captureAndSave('brandshoots-withmedia-lab-desktop-1440-clientele.png', 1440, 900);

  // Scroll to About
  await client.send('Runtime.evaluate', {
    expression: 'document.getElementById("about") ? document.getElementById("about").scrollIntoView({behavior: "instant", block: "start"}) : window.scrollTo(0, 5200);'
  });
  await sleep(800);
  await captureAndSave('brandshoots-withmedia-lab-desktop-1440-about.png', 1440, 900);

  // Scroll to Contact
  await client.send('Runtime.evaluate', {
    expression: 'document.getElementById("contact") ? document.getElementById("contact").scrollIntoView({behavior: "instant", block: "start"}) : window.scrollTo(0, 6000);'
  });
  await sleep(800);
  await captureAndSave('brandshoots-withmedia-lab-desktop-1440-contact.png', 1440, 900);

  // Interactive Test: Open Recce Modal
  console.log("Testing Recce Modal trigger...");
  await client.send('Runtime.evaluate', {
    expression: 'const btn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("Recce")); if (btn) btn.click();'
  });
  await sleep(800);
  await captureAndSave('brandshoots-withmedia-lab-desktop-1440-recce-modal.png', 1440, 900);

  // Close modal
  await client.send('Runtime.evaluate', {
    expression: 'const closeBtn = document.querySelector(".fixed button"); if (closeBtn) closeBtn.click();'
  });
  await sleep(500);

  // Interactive Test: Click on First Case Study to open Case Drawer
  console.log("Testing Case Study Drawer trigger...");
  await client.send('Runtime.evaluate', {
    expression: 'const caseCard = document.querySelector("#portfolio article"); if (caseCard) caseCard.click();'
  });
  await sleep(1000);
  await captureAndSave('brandshoots-withmedia-lab-desktop-1440-case-drawer.png', 1440, 900);

  // Close Case Drawer
  await client.send('Runtime.evaluate', {
    expression: 'const closeBtn = document.querySelector(".fixed button[aria-label=\'Close modal\']"); if (closeBtn) closeBtn.click();'
  });
  await sleep(500);

  // Tablet View (820 x 1180)
  console.log("Capturing Tablet 820 views...");
  await client.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
  await sleep(500);
  await captureAndSave('brandshoots-withmedia-lab-tablet-820.png', 820, 1180);

  // Mobile View (390 x 844)
  console.log("Capturing Mobile 390 views...");
  await client.send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0);' });
  await sleep(500);
  await captureAndSave('brandshoots-withmedia-lab-mobile-390-hero.png', 390, 844);

  // Scroll to systems on mobile
  await client.send('Runtime.evaluate', {
    expression: 'document.getElementById("systems") ? document.getElementById("systems").scrollIntoView({behavior: "instant", block: "start"}) : window.scrollTo(0, 1400);'
  });
  await sleep(800);
  await captureAndSave('brandshoots-withmedia-lab-mobile-390-systems.png', 390, 844);

  // Test Mobile Navigation Drawer
  console.log("Testing mobile drawer menu open...");
  await client.send('Runtime.evaluate', {
    expression: 'const burger = document.querySelector("button[aria-label=\'Toggle mobile menu\']"); if (burger) burger.click();'
  });
  await sleep(800);
  await captureAndSave('brandshoots-withmedia-lab-mobile-390-menu-open.png', 390, 844);

  // Cleanup
  console.log("Test suite completed! Cleaning up...");
  client.close();
  chromeProc.kill();
  previewProc.kill();
  console.log("Done!");
}

main().catch(err => {
  console.error("Test error:", err);
  process.exit(1);
});
