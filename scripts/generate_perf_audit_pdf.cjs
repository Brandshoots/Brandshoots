const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const REPORTS_DIR = path.resolve(process.cwd(), 'reports');
const OUTPUT_PDF = path.join(REPORTS_DIR, 'BrandShoots_Global_Performance_Audit.pdf');

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function generatePdf(html) {
  const htmlPath = path.join(os.tmpdir(), `bs-perf-audit-${Date.now()}.html`);
  fs.writeFileSync(htmlPath, html, 'utf8');

  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bs-perf-pdf-'));
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=0',
    `--user-data-dir=${userDataDir}`,
    `file:///${htmlPath.replace(/\\/g, '/')}`,
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
  const ws = new WebSocket(target.webSocketDebuggerUrl);

  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });

  let seq = 0;
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++seq;
      const onMsg = (ev) => {
        const msg = JSON.parse(ev.data);
        if (msg.id === id) {
          ws.removeEventListener('message', onMsg);
          if (msg.error) reject(new Error(msg.error.message));
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', onMsg);
      ws.send(JSON.stringify({ id, method, params }));
    });

  await new Promise((r) => setTimeout(r, 1200));
  const { data } = await send('Page.printToPDF', {
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate:
      '<div style="width:100%;font-size:8px;font-family:monospace;color:#64748B;padding:0 14mm;display:flex;justify-content:space-between;"><span>BRANDSHOOTS // GLOBAL PERFORMANCE & FLUIDITY AUDIT</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>',
    marginTop: 0.55,
    marginBottom: 0.65,
    marginLeft: 0.45,
    marginRight: 0.45,
  });

  fs.writeFileSync(OUTPUT_PDF, Buffer.from(data, 'base64'));
  ws.close();
  try { chrome.kill(); } catch {}
  try { fs.unlinkSync(htmlPath); } catch {}
}

async function main() {
  const before = JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, 'perf_baseline.json'), 'utf8'));
  const after = JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, 'perf_after.json'), 'utf8'));

  let lhSummary = 'Not available';
  const lhPath = path.join(REPORTS_DIR, 'lighthouse_home.json');
  if (fs.existsSync(lhPath)) {
    try {
      const lh = JSON.parse(fs.readFileSync(lhPath, 'utf8'));
      const score = Math.round((lh.categories?.performance?.score || 0) * 100);
      const audits = lh.audits || {};
      lhSummary = `Performance Score: <strong>${score}/100</strong> &bull; FCP: <strong>${escapeHtml(audits['first-contentful-paint']?.displayValue)}</strong> &bull; LCP: <strong>${escapeHtml(audits['largest-contentful-paint']?.displayValue)}</strong> &bull; TBT: <strong>${escapeHtml(audits['total-blocking-time']?.displayValue)}</strong> &bull; CLS: <strong>${escapeHtml(audits['cumulative-layout-shift']?.displayValue)}</strong>`;
    } catch {}
  }

  const compareRows = after.measurements
    .map((a) => {
      const b = before.measurements.find((x) => x.route === a.route && x.viewport === a.viewport) || {};
      const clsImproved = (b.cls || 0) > a.cls ? 'good' : '';
      return `
      <tr>
        <td><code>${escapeHtml(a.viewport)}</code></td>
        <td><code>${escapeHtml(a.route)}</code></td>
        <td>${b.fcpMs ?? '—'}ms &rarr; <strong>${a.fcpMs}ms</strong></td>
        <td>${b.lcpMs ?? '—'}ms &rarr; <strong>${a.lcpMs}ms</strong></td>
        <td class="${clsImproved}">${b.cls ?? '—'} &rarr; <strong>${a.cls}</strong></td>
        <td>${b.longTasks ?? '—'} (${b.maxLongTaskMs ?? '—'}ms) &rarr; <strong>${a.longTasks} (${a.maxLongTaskMs}ms)</strong></td>
        <td>${b.jsHeapMB ?? '—'}MB &rarr; <strong>${a.jsHeapMB}MB</strong></td>
        <td>${a.overflow ? '<span class="bad">Overflow</span>' : '<span class="good">Pass</span>'}</td>
      </tr>`;
    })
    .join('');

  const html = `<!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>BrandShoots Global Performance Audit</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: 'Segoe UI', Inter, Arial, sans-serif; color: #0F172A; margin: 0; font-size: 10pt; line-height: 1.48; }
      .cover { background: linear-gradient(135deg, #05070B 0%, #091628 100%); color: #F8FAFC; padding: 30px; border-radius: 12px; margin-bottom: 18px; }
      .eyebrow { color: #38BDF8; font-family: monospace; font-size: 8.5pt; letter-spacing: 2px; text-transform: uppercase; }
      .cover h1 { margin: 8px 0 6px; font-size: 21pt; }
      .cover p { margin: 0; color: #CBD5E1; font-size: 9.5pt; }
      h2 { font-size: 13pt; border-bottom: 2px solid #008CFF; padding-bottom: 4px; margin: 18px 0 8px; page-break-after: avoid; }
      p, li { color: #334155; }
      ul { margin: 6px 0 12px 18px; padding: 0; }
      li { margin-bottom: 4px; }
      table { width: 100%; border-collapse: collapse; margin: 10px 0 16px; font-size: 8.2pt; }
      th, td { border: 1px solid #CBD5E1; padding: 6px 7px; text-align: left; }
      th { background: #0F172A; color: #FFFFFF; font-family: monospace; font-size: 7.8pt; text-transform: uppercase; }
      tr:nth-child(even) td { background: #F8FAFC; }
      code { font-family: Consolas, monospace; font-size: 8pt; background: #E2E8F0; padding: 1px 4px; border-radius: 4px; }
      .callout { border-left: 4px solid #008CFF; background: #EFF6FF; padding: 10px 14px; border-radius: 6px; margin: 10px 0; }
      .good { color: #166534; font-weight: 700; }
      .bad { color: #991B1B; font-weight: 700; }
    </style>
  </head>
  <body>
    <div class="cover">
      <div class="eyebrow">BrandShoots // Performance &amp; Fluidity Engineering Report</div>
      <h1>Global Website Performance &amp; Fluidity Audit</h1>
      <p>Baseline: ${escapeHtml(before.timestamp)} &bull; Post-Optimization: ${escapeHtml(after.timestamp)} &bull; Target: <code>localhost:3000</code></p>
    </div>

    <div class="callout">
      <strong>Lighthouse Homepage Audit:</strong> ${lhSummary}
    </div>

    <h2>1. Initial Performance Baseline &amp; Bottlenecks Discovered</h2>
    <ul>
      <li><strong>Results Page CLS Spike:</strong> <code>/results</code> measured <code>CLS = 0.1842</code> on desktop and <code>1.145</code> on mobile because the loading state rendered a compact <code>py-20</code> box that collapsed before <code>ResultCard</code> mounted.</li>
      <li><strong>Ungated 2D Canvas Loop (<code>SpaceMeshCanvas.tsx</code>):</strong> Ran an infinite 60fps <code>requestAnimationFrame</code> loop with 32&times;28 trigonometric calculations and 224 arc draws even when scrolled offscreen or in a background tab, plus forced layout reflow via <code>getBoundingClientRect()</code> on every <code>mousemove</code>.</li>
      <li><strong>Ungated 3D WebGL Loop (<code>BrandShootsLogo3D.tsx</code>):</strong> Rendered continuously at up to 2&times; DPR even when offscreen or tab-hidden, contributing to <code>6</code> long tasks and <code>37.95 MB</code> JS heap on <code>/contact</code>.</li>
      <li><strong>Frame-Level Layout Reads (<code>PortfolioWormhole3D.tsx</code>):</strong> Read <code>containerEl.offsetTop + containerEl.offsetHeight</code> inside <code>animate()</code> on every animation frame.</li>
    </ul>

    <h2>2. Optimizations Implemented &amp; Files Modified</h2>
    <ul>
      <li><code>src/pages/ResultsPage.tsx</code>: Replaced compact loading text with a height-matched skeleton grid (<code>min-h-[640px]</code> + <code>aspect-[4/5]</code> placeholders), reducing CLS to <code>0.0054</code> desktop and <code>0</code> mobile.</li>
      <li><code>src/components/what-we-do/SpaceMeshCanvas.tsx</code>: Added <code>IntersectionObserver</code> + <code>visibilitychange</code> gating, cached bounding rect on resize/intersection instead of <code>mousemove</code>, and honored <code>prefers-reduced-motion</code>.</li>
      <li><code>src/components/contact/BrandShootsLogo3D.tsx</code>: Added <code>IntersectionObserver</code> + <code>visibilitychange</code> gating, capped DPR at <code>1.5</code> (mobile) / <code>1.75</code> (desktop), and ensured clean listener/RAF disposal.</li>
      <li><code>src/components/portfolio/PortfolioWormhole3D.tsx</code>: Replaced per-frame <code>offsetTop</code>/<code>offsetHeight</code> layout reads with <code>IntersectionObserver</code> visibility state.</li>
      <li><code>src/components/hero/ReelWall3D.tsx</code> &amp; <code>src/config/heroReels.ts</code>: Dynamic cylinder slot scaling with only 1 active center <code>&lt;video&gt;</code> decoded at a time and metadata-only warmup on the first reel.</li>
    </ul>

    <h2>3. Before &amp; After Core Web Vitals (Desktop 1440px &amp; Mobile 375px)</h2>
    <table>
      <thead>
        <tr>
          <th>Viewport</th>
          <th>Route</th>
          <th>FCP (Before &rarr; After)</th>
          <th>LCP (Before &rarr; After)</th>
          <th>CLS (Before &rarr; After)</th>
          <th>Long Tasks (Before &rarr; After)</th>
          <th>JS Heap (Before &rarr; After)</th>
          <th>Layout</th>
        </tr>
      </thead>
      <tbody>${compareRows}</tbody>
    </table>

    <h2>4. Animation, Rendering &amp; Remaining Performance Notes</h2>
    <ul>
      <li><strong>Core Web Vitals Compliance:</strong> Every audited route on both desktop (<code>1440&times;900</code>) and mobile (<code>375&times;812</code>) meets <code>LCP &le; 2.5s</code> and <code>CLS &le; 0.1</code> after optimization, with <code>0</code> horizontal overflow.</li>
      <li><strong>Remaining Heavy Initialization:</strong> <code>/portfolio</code> (<code>maxLongTask = 523ms</code>) and <code>/about</code> (<code>maxLongTask = 167ms</code>–<code>233ms</code>) still incur initial Three.js WebGL shader compilation and geometry setup on first mount; this is isolated to those 3D showcase routes and does not block other pages.</li>
      <li><strong>Bundle Note:</strong> Production build (<code>npm run build</code>) splits Three.js (<code>vendor-three</code>, <code>143.07 kB</code> gzip), GSAP (<code>vendor-gsap</code>, <code>27.81 kB</code> gzip), Lenis (<code>5.64 kB</code> gzip), and route chunks cleanly.</li>
    </ul>
  </body>
  </html>`;

  await generatePdf(html);
  const stat = fs.statSync(OUTPUT_PDF);
  console.log(`Generated ${OUTPUT_PDF} (${(stat.size / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
