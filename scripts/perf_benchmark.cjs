const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const BASE_URL = 'http://localhost:3000';
const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const REPORTS_DIR = path.resolve(process.cwd(), 'reports');
fs.mkdirSync(REPORTS_DIR, { recursive: true });

class CdpClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
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
  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression: `(async () => { return (${expression}); })()`,
      awaitPromise: true,
      returnByValue: true,
    });
    if (res.exceptionDetails) throw new Error(res.exceptionDetails.text || 'Eval error');
    return res.result?.value;
  }
  close() {
    try { this.ws.close(); } catch {}
  }
}

async function launchBrowser() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bs-perf-'));
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
      const m = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (m) {
        clearTimeout(timer);
        resolve(m[1]);
      }
    });
  });
  const port = wsUrl.match(/:(\d+)\//)[1];
  const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const target = pages.find((p) => p.type === 'page') || pages[0];
  const cdp = new CdpClient(target.webSocketDebuggerUrl);
  await cdp.connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Performance.enable');
  return { chrome, cdp };
}

async function measureRoute(cdp, routePath, viewport) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.mobile ? 2 : 1,
    mobile: viewport.mobile,
  });

  await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      window.__perf = { lcp: 0, cls: 0, longTasks: 0, maxLongTask: 0, fcp: 0 };
      try {
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) {
            if (e.name === 'first-contentful-paint') window.__perf.fcp = Math.round(e.startTime);
          }
        }).observe({ type: 'paint', buffered: true });
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries[entries.length - 1];
          if (last) window.__perf.lcp = Math.round(last.startTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) {
            if (!e.hadRecentInput) window.__perf.cls = +(window.__perf.cls + e.value).toFixed(4);
          }
        }).observe({ type: 'layout-shift', buffered: true });
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) {
            window.__perf.longTasks++;
            if (e.duration > window.__perf.maxLongTask) window.__perf.maxLongTask = Math.round(e.duration);
          }
        }).observe({ type: 'longtask', buffered: true });
      } catch {}
    `,
  });

  await cdp.send('Page.navigate', { url: `${BASE_URL}${routePath}` });
  const start = Date.now();
  while (Date.now() - start < 15000) {
    await new Promise((r) => setTimeout(r, 350));
    try {
      const ready = await cdp.eval(`document.readyState === 'complete' && (document.getElementById('root')?.innerText?.trim()?.length || 0) > 0`);
      if (ready) break;
    } catch {}
  }
  await new Promise((r) => setTimeout(r, 2500));

  const perf = await cdp.eval(`(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    return {
      ttfbMs: nav ? Math.round(nav.responseStart - nav.requestStart) : 0,
      domInteractiveMs: nav ? Math.round(nav.domInteractive) : 0,
      loadEventMs: nav ? Math.round(nav.loadEventEnd) : 0,
      fcpMs: window.__perf?.fcp || 0,
      lcpMs: window.__perf?.lcp || 0,
      cls: window.__perf?.cls || 0,
      longTasks: window.__perf?.longTasks || 0,
      maxLongTaskMs: window.__perf?.maxLongTask || 0,
      domNodes: document.querySelectorAll('*').length,
      videoCount: document.querySelectorAll('video').length,
      activePlayingVideos: Array.from(document.querySelectorAll('video')).filter((v) => !v.paused).length,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  })()`);

  const cdpMetrics = await cdp.send('Performance.getMetrics');
  const heapUsed = cdpMetrics.metrics.find((m) => m.name === 'JSHeapUsedSize')?.value || 0;

  return {
    route: routePath,
    viewport: viewport.name,
    ...perf,
    jsHeapMB: +(heapUsed / (1024 * 1024)).toFixed(2),
  };
}

async function main() {
  const outName = process.argv[2] || 'perf_baseline.json';
  const { chrome, cdp } = await launchBrowser();
  const measurements = [];

  try {
    const routes = ['/', '/portfolio', '/results', '/packages', '/about', '/contact', '/admin'];
    const viewports = [
      { name: 'desktop-1440', width: 1440, height: 900, mobile: false },
      { name: 'mobile-375', width: 375, height: 812, mobile: true },
    ];

    for (const vp of viewports) {
      for (const route of routes) {
        const res = await measureRoute(cdp, route, vp);
        measurements.push(res);
        console.log(`${vp.name} | ${route} -> FCP=${res.fcpMs}ms LCP=${res.lcpMs}ms CLS=${res.cls} LongTasks=${res.longTasks}(max ${res.maxLongTaskMs}ms) Heap=${res.jsHeapMB}MB`);
      }
    }

    fs.writeFileSync(
      path.join(REPORTS_DIR, outName),
      JSON.stringify({ timestamp: new Date().toISOString(), measurements }, null, 2)
    );
  } finally {
    cdp.close();
    try { chrome.kill(); } catch {}
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
