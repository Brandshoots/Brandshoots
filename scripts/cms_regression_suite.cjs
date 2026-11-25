const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const BASE_URL = 'http://localhost:3000';
const RTDB_URL = 'https://brandshoots-admin-default-rtdb.firebaseio.com';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const REPORTS_DIR = path.resolve(process.cwd(), 'reports');
fs.mkdirSync(REPORTS_DIR, { recursive: true });

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();
  }
  async connect() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });
    this.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method && this.listeners.has(msg.method)) {
        this.listeners.get(msg.method).forEach((fn) => fn(msg.params));
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  on(method, fn) {
    if (!this.listeners.has(method)) this.listeners.set(method, []);
    this.listeners.get(method).push(fn);
  }
  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression: `(async () => { return (${expression}); })()`,
      awaitPromise: true,
      returnByValue: true,
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || 'Evaluation error');
    }
    return res.result?.value;
  }
  async goto(url, settleMs = 2000) {
    await this.send('Page.navigate', { url });
    const start = Date.now();
    while (Date.now() - start < 12000) {
      await new Promise((r) => setTimeout(r, 300));
      try {
        const ready = await this.eval(`document.readyState === 'complete' && (document.getElementById('root')?.innerText?.trim()?.length || 0) > 0`);
        if (ready) break;
      } catch {}
    }
    await new Promise((r) => setTimeout(r, settleMs));
  }
  async setViewport(width, height) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
  }
  async screenshot(filePath) {
    const { data } = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
  }
  close() {
    try { this.ws.close(); } catch {}
  }
}

async function launchBrowser() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bs-audit-'));
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=0',
    `--user-data-dir=${userDataDir}`,
    'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });

  const wsUrl = await new Promise((resolve, reject) => {
    let stderr = '';
    const timer = setTimeout(() => reject(new Error('Chrome startup timeout: ' + stderr)), 15000);
    chrome.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[1]);
      }
    });
  });

  const portMatch = wsUrl.match(/:(\d+)\//);
  const port = portMatch[1];
  const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const target = pages.find((p) => p.type === 'page') || pages[0];
  const cdp = new CdpClient(target.webSocketDebuggerUrl);
  await cdp.connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');
  return { chrome, cdp, userDataDir };
}

const results = [];
function recordTest(id, module, feature, scenario, expected, actual, status, screenshot = '', issue = '') {
  results.push({ id, module, feature, scenario, expected, actual, status, screenshot, issue });
  console.log(`[${status}] ${id} | ${module} | ${feature} -> ${actual}`);
}

async function run() {
  const { chrome, cdp } = await launchBrowser();
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];

  cdp.on('Runtime.consoleAPICalled', (p) => {
    if (p.type === 'error') {
      consoleErrors.push(p.args.map((a) => a.value || a.description || '').join(' '));
    }
  });
  cdp.on('Runtime.exceptionThrown', (p) => {
    pageErrors.push(p.exceptionDetails?.text || 'Uncaught exception');
  });
  cdp.on('Network.loadingFailed', (p) => {
    failedRequests.push(`${p.type} (${p.errorText})`);
  });

  try {
    // 1. AUTH-01: Unauthenticated /admin shows login gate
    await cdp.setViewport(1440, 900);
    await cdp.goto(`${BASE_URL}/admin`, 2500);
    const hasLoginHeading = await cdp.eval(`/administrator portal/i.test(document.body.innerText)`);
    const hasDashboardLeak = await cdp.eval(`/hero reels management/i.test(document.body.innerText)`);
    await cdp.screenshot(path.join(REPORTS_DIR, 'audit_01_admin_login.png'));
    recordTest(
      'AUTH-01',
      'Authentication & Permissions',
      'Admin Route Auth Gate',
      'Navigate to /admin without an active Firebase session',
      'Login form rendered; CMS dashboard and client records hidden',
      hasLoginHeading && !hasDashboardLeak ? 'Login form rendered; no CMS workspace exposed' : 'Unexpected admin state',
      hasLoginHeading && !hasDashboardLeak ? 'PASS' : 'FAIL',
      'reports/audit_01_admin_login.png'
    );

    // 2. AUTH-02: Invalid login rejected cleanly
    const formFound = await cdp.eval(`(() => {
      const email = document.querySelector('input[type="email"]');
      const pass = document.querySelector('input[type="password"]');
      const btn = document.querySelector('button[type="submit"]');
      if (!email || !pass || !btn) return false;
      const setVal = (el, val) => {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      setVal(email, 'invalid-audit@brandshoots.in');
      setVal(pass, 'WrongPassword123!');
      btn.click();
      return true;
    })()`);
    await new Promise((r) => setTimeout(r, 3000));
    const authErrorShown = await cdp.eval(`/invalid|failed|no administrator|verify your/i.test(document.body.innerText)`);
    const stillOnLogin = await cdp.eval(`/administrator portal/i.test(document.body.innerText)`);
    await cdp.screenshot(path.join(REPORTS_DIR, 'audit_02_admin_invalid_login.png'));
    recordTest(
      'AUTH-02',
      'Authentication & Permissions',
      'Invalid Credentials Rejection',
      'Submit invalid email/password on Admin Login form',
      'Firebase Auth rejects login and displays user-friendly error',
      formFound && authErrorShown && stillOnLogin ? 'Rejected with error message; remained on login screen' : `formFound=${formFound}, authErrorShown=${authErrorShown}`,
      formFound && authErrorShown && stillOnLogin ? 'PASS' : 'FAIL',
      'reports/audit_02_admin_invalid_login.png'
    );

    // 3. DB-SEC-01: Unauthenticated RTDB write blocked
    const writePaths = ['published/heroReels.json', 'published/clients.json', 'published/results/audit_test.json'];
    let allWritesBlocked = true;
    const statuses = [];
    for (const p of writePaths) {
      const resp = await fetch(`${RTDB_URL}/${p}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditTest: true }),
      });
      statuses.push(`${p}:${resp.status}`);
      if (resp.status !== 401 && resp.status !== 403) allWritesBlocked = false;
    }
    recordTest(
      'DB-SEC-01',
      'Database & Security',
      'Unauthenticated Write Protection',
      'Attempt unauthenticated HTTP PUT to published/heroReels, published/clients, published/results',
      'Firebase RTDB rules reject all writes with 401/403',
      `HTTP responses: ${statuses.join(', ')}`,
      allWritesBlocked ? 'PASS' : 'FAIL'
    );

    // 4. FE-01: Homepage Desktop (1440x900)
    await cdp.setViewport(1440, 900);
    await cdp.goto(`${BASE_URL}/?nopreload`, 3000);
    const homeMetrics = await cdp.eval(`(() => {
      const cards = document.querySelectorAll('.cylinder-card').length;
      const imgs = Array.from(document.querySelectorAll('img'));
      const brokenImgs = imgs.filter((img) => img.complete && img.naturalWidth === 0).map((i) => i.src);
      const overflow = document.documentElement.scrollWidth > window.innerWidth;
      return { cards, imgCount: imgs.length, brokenImgs, overflow };
    })()`);
    await cdp.screenshot(path.join(REPORTS_DIR, 'audit_03_home_desktop.png'));
    recordTest(
      'FE-01',
      'Homepage & Hero Reels',
      'Desktop 3D Hero Carousel & Assets',
      'Load /?nopreload at 1440x900 and verify cylinder cards, images, and horizontal overflow',
      'Cylinder cards >= 14, 0 broken images, 0 horizontal overflow',
      `Cards: ${homeMetrics.cards}, Images: ${homeMetrics.imgCount}, Broken: ${homeMetrics.brokenImgs.length}, Overflow: ${homeMetrics.overflow}`,
      homeMetrics.cards >= 14 && homeMetrics.brokenImgs.length === 0 && !homeMetrics.overflow ? 'PASS' : 'FAIL',
      'reports/audit_03_home_desktop.png',
      homeMetrics.brokenImgs.join(', ')
    );

    // 5. FE-02: Homepage Mobile (375x812)
    await cdp.setViewport(375, 812);
    await new Promise((r) => setTimeout(r, 1000));
    const mobileOverflow = await cdp.eval(`document.documentElement.scrollWidth > window.innerWidth`);
    await cdp.screenshot(path.join(REPORTS_DIR, 'audit_04_home_mobile.png'));
    recordTest(
      'FE-02',
      'Homepage & Hero Reels',
      'Mobile Hero Responsiveness',
      'Verify homepage hero at 375x812 mobile viewport',
      'Zero horizontal overflow and single focal reel rendered',
      `Horizontal overflow: ${mobileOverflow}`,
      !mobileOverflow ? 'PASS' : 'FAIL',
      'reports/audit_04_home_mobile.png'
    );

    // 6. FE-03: Results Page & Sample Case Study
    await cdp.setViewport(1440, 900);
    await cdp.goto(`${BASE_URL}/results`, 2500);
    const resultsCheck = await cdp.eval(`(() => {
      const text = document.body.innerText;
      const hasSanthi = /santhi pipes/i.test(text);
      const hasEmpty = /no published results yet/i.test(text);
      const imgs = Array.from(document.querySelectorAll('img'));
      const brokenImgs = imgs.filter((img) => img.complete && img.naturalWidth === 0).map((i) => i.src);
      return { hasSanthi, hasEmpty, brokenImgs };
    })()`);
    await cdp.screenshot(path.join(REPORTS_DIR, 'audit_05_results_page.png'));
    recordTest(
      'FE-03',
      'Results / Case Studies',
      'Results Page Sample & Media',
      'Navigate to /results and verify sample result and before/after analytics assets render',
      'Santhi Pipes sample result visible, no empty placeholder, 0 broken images',
      `Has Santhi Pipes: ${resultsCheck.hasSanthi}, Empty: ${resultsCheck.hasEmpty}, Broken imgs: ${resultsCheck.brokenImgs.length}`,
      resultsCheck.hasSanthi && !resultsCheck.hasEmpty && resultsCheck.brokenImgs.length === 0 ? 'PASS' : 'FAIL',
      'reports/audit_05_results_page.png'
    );

    // 7. FE-04..FE-07: Portfolio, Packages, About, Contact
    const routes = [
      { path: '/portfolio', id: 'FE-04', mod: 'Portfolio', expectText: 'SANTHI PIPES', shot: 'audit_06_portfolio.png' },
      { path: '/packages', id: 'FE-05', mod: 'Packages', expectText: 'MONTHLY CONTENT', shot: 'audit_07_packages.png' },
      { path: '/about', id: 'FE-06', mod: 'About Page', expectText: 'BRANDSHOOTS', shot: 'audit_08_about.png' },
      { path: '/contact', id: 'FE-07', mod: 'Contact & Footer', expectText: 'brandshoots.in@gmail.com', shot: 'audit_09_contact.png' },
    ];
    for (const r of routes) {
      await cdp.goto(`${BASE_URL}${r.path}`, 2200);
      const check = await cdp.eval(`(() => ({
        hasText: document.body.innerText.toLowerCase().includes(${JSON.stringify(r.expectText.toLowerCase())}),
        overflow: document.documentElement.scrollWidth > window.innerWidth,
      }))()`);
      await cdp.screenshot(path.join(REPORTS_DIR, r.shot));
      recordTest(
        r.id,
        r.mod,
        `${r.mod} Route & Sync`,
        `Navigate to ${r.path} and verify content and layout`,
        `Contains "${r.expectText}" with no horizontal overflow`,
        `Found text: ${check.hasText}, Overflow: ${check.overflow}`,
        check.hasText && !check.overflow ? 'PASS' : 'FAIL',
        `reports/${r.shot}`
      );
    }

    // 8. MEDIA-01: Verify all 17 final reels & posters exist
    const heroFinalDir = path.resolve(process.cwd(), 'public/reels/hero-final');
    const postersDir = path.join(heroFinalDir, 'posters');
    const mp4Count = fs.readdirSync(heroFinalDir).filter((f) => f.endsWith('.mp4')).length;
    const webpCount = fs.readdirSync(postersDir).filter((f) => f.endsWith('.webp')).length;
    recordTest(
      'MEDIA-01',
      'Hero Reels Assets',
      'Final 17 Reels & Posters Integrity',
      'Verify all 17 reels from Reels Hero Section and matching WebP posters exist in public/reels/hero-final',
      '17 MP4 reels and 17 WebP posters present',
      `MP4s: ${mp4Count}, WebP posters: ${webpCount}`,
      mp4Count === 17 && webpCount === 17 ? 'PASS' : 'FAIL'
    );

    // 9. BLOCKED: Live authenticated CMS UI write tests
    recordTest(
      'CMS-AUTH-WRITE',
      'CMS Authenticated CRUD',
      'Live Browser CMS Write & Sync Verification',
      'Log into /admin with Firebase Admin credentials to run live UI CRUD, drag-and-drop publish, and Cloudinary upload tests',
      'Authenticated admin session executes live CRUD & Cloudinary upload',
      'Blocked in automated headless run: no Firebase Admin password or VITE_CLOUDINARY_CLOUD_NAME configured in .env.local',
      'BLOCKED',
      '',
      'Requires live Firebase Admin credentials and Cloudinary cloud name in environment'
    );

    const summary = {
      timestamp: new Date().toISOString(),
      total: results.length,
      passed: results.filter((r) => r.status === 'PASS').length,
      failed: results.filter((r) => r.status === 'FAIL').length,
      blocked: results.filter((r) => r.status === 'BLOCKED').length,
      notTested: results.filter((r) => r.status === 'NOT TESTED').length,
      consoleErrors,
      pageErrors,
      failedRequests,
      tests: results,
    };

    fs.writeFileSync(path.join(REPORTS_DIR, 'cms_audit_results.json'), JSON.stringify(summary, null, 2));
    console.log('\n=== SUMMARY ===', JSON.stringify({
      total: summary.total,
      passed: summary.passed,
      failed: summary.failed,
      blocked: summary.blocked,
      consoleErrors: consoleErrors.length,
      pageErrors: pageErrors.length,
    }));
  } finally {
    cdp.close();
    try { chrome.kill(); } catch {}
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
