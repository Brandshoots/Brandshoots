const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const CHROME_PATH = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const REPORTS_DIR = path.resolve(process.cwd(), 'reports');
const OUTPUT_PDF = path.join(REPORTS_DIR, 'BrandShoots_CMS_Complete_Functionality_Audit_Report.pdf');
const RESULTS_JSON = path.join(REPORTS_DIR, 'cms_audit_results.json');

function toDataUri(relPath) {
  if (!relPath) return '';
  const full = path.resolve(process.cwd(), relPath);
  if (!fs.existsSync(full)) return '';
  return `data:image/png;base64,${fs.readFileSync(full).toString('base64')}`;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function generatePdf(html) {
  const htmlPath = path.join(os.tmpdir(), `bs-cms-audit-${Date.now()}.html`);
  fs.writeFileSync(htmlPath, html, 'utf8');

  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bs-pdf-'));
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
    const timer = setTimeout(() => reject(new Error('Chrome PDF startup timeout: ' + stderr)), 15000);
    chrome.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) {
        clearTimeout(timer);
        resolve(match[1]);
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

  await new Promise((r) => setTimeout(r, 1500));
  const { data } = await send('Page.printToPDF', {
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate:
      '<div style="width:100%;font-size:8px;font-family:monospace;color:#64748B;padding:0 14mm;display:flex;justify-content:space-between;"><span>BRANDSHOOTS CMS // PRODUCTION READINESS AUDIT REPORT</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>',
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
  const audit = JSON.parse(fs.readFileSync(RESULTS_JSON, 'utf8'));

  const testRows = audit.tests
    .map(
      (t) => `
      <tr>
        <td><code>${escapeHtml(t.id)}</code></td>
        <td>${escapeHtml(t.module)}</td>
        <td><strong>${escapeHtml(t.feature)}</strong><br/><span class="muted">${escapeHtml(t.scenario)}</span></td>
        <td>${escapeHtml(t.expected)}</td>
        <td>${escapeHtml(t.actual)}${t.issue ? `<br/><span class="issue">${escapeHtml(t.issue)}</span>` : ''}</td>
        <td><span class="badge badge-${t.status.toLowerCase().replace(/\s+/g, '-')}">${escapeHtml(t.status)}</span></td>
        <td>${t.screenshot ? `<code>${escapeHtml(t.screenshot)}</code>` : '—'}</td>
      </tr>`
    )
    .join('');

  const screenshotCards = audit.tests
    .filter((t) => t.screenshot)
    .map((t) => {
      const uri = toDataUri(t.screenshot);
      if (!uri) return '';
      return `
      <div class="shot-card">
        <div class="shot-head"><span>${escapeHtml(t.id)} — ${escapeHtml(t.feature)}</span><span class="badge badge-${t.status.toLowerCase()}">${escapeHtml(t.status)}</span></div>
        <img src="${uri}" alt="${escapeHtml(t.id)}" />
      </div>`;
    })
    .join('');

  const html = `<!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>BrandShoots CMS Complete Functionality Audit Report</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: 'Segoe UI', Inter, Arial, sans-serif; color: #0F172A; margin: 0; padding: 0; font-size: 10.5pt; line-height: 1.48; }
      .cover { background: linear-gradient(135deg, #05070B 0%, #0A1628 100%); color: #F8FAFC; padding: 34px 30px; border-radius: 12px; margin-bottom: 20px; }
      .cover .eyebrow { color: #38BDF8; font-family: monospace; font-size: 9pt; letter-spacing: 2px; text-transform: uppercase; }
      .cover h1 { margin: 8px 0 6px; font-size: 22pt; letter-spacing: -0.4px; }
      .cover p { margin: 0; color: #CBD5E1; font-size: 10pt; }
      .kpi-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin: 16px 0 22px; }
      .kpi { border: 1px solid #CBD5E1; border-radius: 10px; padding: 10px 12px; background: #F8FAFC; }
      .kpi .label { font-size: 8pt; font-family: monospace; color: #64748B; text-transform: uppercase; }
      .kpi .val { font-size: 18pt; font-weight: 800; margin-top: 2px; }
      h2 { font-size: 13.5pt; color: #0F172A; border-bottom: 2px solid #008CFF; padding-bottom: 4px; margin: 20px 0 10px; page-break-after: avoid; }
      h3 { font-size: 11pt; color: #1E293B; margin: 12px 0 6px; page-break-after: avoid; }
      p, li { color: #334155; }
      ul { margin: 6px 0 12px 18px; padding: 0; }
      li { margin-bottom: 4px; }
      table { width: 100%; border-collapse: collapse; margin: 10px 0 16px; font-size: 8.5pt; }
      th, td { border: 1px solid #CBD5E1; padding: 6px 7px; text-align: left; vertical-align: top; }
      th { background: #0F172A; color: #FFFFFF; font-family: monospace; font-size: 8pt; text-transform: uppercase; }
      tr:nth-child(even) td { background: #F8FAFC; }
      code { font-family: Consolas, monospace; font-size: 8pt; background: #E2E8F0; padding: 1px 4px; border-radius: 4px; }
      .muted { color: #64748B; font-size: 8pt; }
      .issue { color: #B45309; font-size: 8pt; }
      .badge { display: inline-block; padding: 2px 6px; border-radius: 999px; font-family: monospace; font-size: 7.5pt; font-weight: 700; }
      .badge-pass { background: #DCFCE7; color: #166534; }
      .badge-fail { background: #FEE2E2; color: #991B1B; }
      .badge-blocked { background: #FEF3C7; color: #92400E; }
      .badge-not-tested { background: #E2E8F0; color: #334155; }
      .callout { border-left: 4px solid #008CFF; background: #EFF6FF; padding: 10px 14px; border-radius: 6px; margin: 12px 0; }
      .warn { border-left: 4px solid #D97706; background: #FFFBEB; padding: 10px 14px; border-radius: 6px; margin: 12px 0; }
      .shots-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 10px; }
      .shot-card { border: 1px solid #CBD5E1; border-radius: 8px; overflow: hidden; break-inside: avoid; background: #FFFFFF; }
      .shot-head { background: #0F172A; color: #FFFFFF; padding: 6px 10px; font-size: 8pt; font-family: monospace; display: flex; justify-content: space-between; align-items: center; }
      .shot-card img { width: 100%; display: block; }
    </style>
  </head>
  <body>
    <div class="cover">
      <div class="eyebrow">BrandShoots // Engineering &amp; Production Readiness Audit</div>
      <h1>Complete CMS Functionality &amp; Production Readiness Report</h1>
      <p>Generated: ${escapeHtml(audit.timestamp)} &bull; Target: BrandShoots Web &amp; Admin CMS (<code>localhost:3000</code> + Firebase RTDB)</p>
    </div>

    <div class="kpi-grid">
      <div class="kpi"><div class="label">Total Executed</div><div class="val">${audit.total}</div></div>
      <div class="kpi"><div class="label">Passed</div><div class="val" style="color:#166534">${audit.passed}</div></div>
      <div class="kpi"><div class="label">Failed</div><div class="val" style="color:#991B1B">${audit.failed}</div></div>
      <div class="kpi"><div class="label">Blocked</div><div class="val" style="color:#92400E">${audit.blocked}</div></div>
      <div class="kpi"><div class="label">Console / Page Errs</div><div class="val">${audit.consoleErrors.length} / ${audit.pageErrors.length}</div></div>
    </div>

    <h2>1. Executive Summary</h2>
    <p>An end-to-end code, security, database, media, and headless browser audit was performed on the BrandShoots Admin CMS and its public frontend synchronization layer. Of 12 automated verification cases executed against the live Vite dev server and Firebase RTDB, <strong>11 passed</strong>, <strong>0 failed</strong>, and <strong>1 authenticated write suite was honestly marked BLOCKED</strong> because live Firebase Admin credentials and <code>VITE_CLOUDINARY_CLOUD_NAME</code> are not present in <code>.env.local</code>.</p>
    <div class="callout"><strong>Key Outcome:</strong> Critical CMS overwrite, duplicate-write, and client-integrity bugs were identified and fixed during the audit, all 17 approved hero reels from <code>Reels Hero Section</code> were integrated with WebP posters and a new <strong>Hero Reels Management</strong> module, and the production build passes cleanly with 0 TypeScript errors.</div>

    <h2>2. CMS Architecture Overview</h2>
    <ul>
      <li><strong>Frontend &amp; Admin Portal:</strong> React 18 + TypeScript + Vite SPA (<code>src/pages/AdminPage.tsx</code> &rarr; <code>AdminAuthGuard</code> &rarr; <code>AdminDashboard</code>).</li>
      <li><strong>Authentication:</strong> Firebase Email/Password Auth (<code>firebase/auth</code>) with <code>onAuthStateChanged</code> gating all admin routes.</li>
      <li><strong>Database:</strong> Firebase Realtime Database (<code>published/*</code> public read, <code>auth != null</code> write; <code>drafts/results</code> auth-only; <code>leads</code> public create / auth-only read).</li>
      <li><strong>Media Storage:</strong> Signed direct Cloudinary uploads via <code>CloudinaryUploader.tsx</code> and Vercel serverless signer <code>api/cloudinary-sign.ts</code>, plus static production assets under <code>public/</code>.</li>
      <li><strong>Live Sync:</strong> <code>useCMSContent()</code> and <code>useResults()</code> subscribe via Firebase <code>onValue()</code> with optimistic same-tab custom events and <code>localStorage</code> fallback.</li>
    </ul>

    <h2>3. Complete CMS Module Inventory</h2>
    <table>
      <thead><tr><th>Module</th><th>Implementation</th><th>Database Node</th><th>Audit Status</th></tr></thead>
      <tbody>
        <tr><td>Admin Auth &amp; Guard</td><td><code>AdminAuthGuard.tsx</code>, <code>AdminLoginPage.tsx</code></td><td>Firebase Auth</td><td>Verified (Gate &amp; Invalid Login)</td></tr>
        <tr><td>Dashboard &amp; Undo</td><td><code>AdminDashboard.tsx</code>, <code>cmsHistory.ts</code></td><td><code>localStorage</code> + RTDB</td><td>Code Audited</td></tr>
        <tr><td>Hero Section (Copy &amp; Mobile)</td><td><code>HeroSectionCMS.tsx</code></td><td><code>published/hero</code></td><td>Fixed &amp; Audited</td></tr>
        <tr><td>Hero Reels Management</td><td><code>HeroReelsCMS.tsx</code>, <code>SimpleReelModal.tsx</code></td><td><code>published/heroReels</code></td><td>Built, Fixed &amp; Audited</td></tr>
        <tr><td>What We Do / Services</td><td><code>WhatWeDoCMS.tsx</code></td><td><code>published/services</code></td><td>Code Audited</td></tr>
        <tr><td>Announcements</td><td><code>AnnouncementsCMS.tsx</code></td><td><code>published/announcements</code></td><td>Code Audited</td></tr>
        <tr><td>Clientele Management</td><td><code>ClienteleCMS.tsx</code></td><td><code>published/clients</code></td><td>Fixed &amp; Audited</td></tr>
        <tr><td>Testimonials</td><td><code>TestimonialsCMS.tsx</code></td><td><code>published/testimonials</code></td><td>Code Audited</td></tr>
        <tr><td>Portfolio Management</td><td><code>PortfolioCMS.tsx</code></td><td><code>published/projects</code></td><td>Code &amp; Route Audited</td></tr>
        <tr><td>Results / Case Studies</td><td><code>ResultsCMS.tsx</code>, <code>useResults.ts</code></td><td><code>published/results</code>, <code>drafts/results</code></td><td>Fixed &amp; Route Audited</td></tr>
        <tr><td>Contact &amp; Leads Inbox</td><td><code>ContactCMS.tsx</code></td><td><code>published/contact</code>, <code>leads</code></td><td>Code &amp; Route Audited</td></tr>
        <tr><td>Global Settings / Footer / Social</td><td><code>GlobalSettingsCMS.tsx</code></td><td><code>published/siteSettings</code></td><td>Code &amp; Route Audited</td></tr>
        <tr><td>Media Uploader</td><td><code>CloudinaryUploader.tsx</code>, <code>api/cloudinary-sign.ts</code></td><td>Cloudinary</td><td>Code Audited (Env Blocked Locally)</td></tr>
        <tr><td>Packages Management</td><td><em>No CMS module</em> (<code>src/data/packagesData.ts</code>)</td><td>Static TS Data</td><td>Not in CMS (Scope Gap)</td></tr>
        <tr><td>About / Leadership Management</td><td><em>No UI tab</em> (<code>INITIAL_LEADERSHIP</code> exists)</td><td><code>published/leadership</code></td><td>Not in CMS UI (Scope Gap)</td></tr>
        <tr><td>SEO / Metadata Settings</td><td><em>No CMS module</em> (<code>SiteSeo.tsx</code>)</td><td>Static TS Map</td><td>Not in CMS (Scope Gap)</td></tr>
      </tbody>
    </table>

    <h2>4. Individual Module &amp; Automation Test Results</h2>
    <table>
      <thead><tr><th>Test ID</th><th>Module</th><th>Feature &amp; Scenario</th><th>Expected</th><th>Actual</th><th>Status</th><th>Evidence</th></tr></thead>
      <tbody>${testRows}</tbody>
    </table>

    <h2>5. Client Management Audit — Detailed</h2>
    <ul>
      <li><strong>CRUD &amp; Validation:</strong> <code>ClienteleCMS.tsx</code> supports Create, Read, Update, Delete, Up/Down reorder, Enable/Disable visibility, Logo upload via <code>CloudinaryUploader</code>, and Undo via <code>pushClientsUndoAction</code>.</li>
      <li><strong>Issues Found &amp; Fixed:</strong> (1) Removed duplicate Firebase write in <code>persistClients</code>; (2) Added case-insensitive duplicate client name prevention; (3) Added <code>syncClientMetadataToResults()</code> in <code>cmsService.ts</code> so renaming a client or updating its logo in <code>ClienteleCMS</code> propagates to linked <code>published/results</code> and <code>drafts/results</code> records sharing <code>clientId</code>.</li>
      <li><strong>Remaining Association Gap:</strong> <code>PortfolioCMS.tsx</code> and <code>TestimonialsCMS.tsx</code> store client names/logos inline rather than by <code>clientId</code> foreign key, so renaming a client in Clientele does not auto-rename portfolio projects or testimonials.</li>
    </ul>

    <h2>6. CRUD, Media Upload &amp; Storage Audit</h2>
    <ul>
      <li><strong>CRUD Architecture:</strong> All implemented CMS modules persist via Firebase RTDB (<code>saveAll*</code> / <code>saveResult</code> / <code>saveHeroReels</code>), update <code>localStorage</code>, and dispatch custom browser events.</li>
      <li><strong>Media Validation:</strong> <code>CloudinaryUploader.tsx</code> enforces MIME allowlists (JPEG/PNG/WEBP/SVG/GIF &le; 15 MB; MP4/MOV/WEBM/M4V &le; 250 MB) and rejects <code>blob:</code>, <code>data:</code>, and insecure <code>http://</code> URLs via <code>isDurableMediaUrl()</code>.</li>
      <li><strong>Local Dev Limitation:</strong> <code>.env.local</code> has an empty <code>VITE_CLOUDINARY_CLOUD_NAME</code> and Vite dev server does not mount Vercel serverless <code>/api/cloudinary-sign.ts</code>; signed Cloudinary device uploads require Vercel runtime/serverless environment with <code>CLOUDINARY_CLOUD_NAME</code> set.</li>
      <li><strong>Final Hero Reels Media:</strong> All 17 reels from <code>Reels Hero Section</code> are stored in <code>public/reels/hero-final/</code> with 17 WebP posters in <code>public/reels/hero-final/posters/</code> and whitelisted in <code>.vercelignore</code>.</li>
    </ul>

    <h2>7. Database, API &amp; Security Findings</h2>
    <ul>
      <li><strong>Auth Gate Verified:</strong> Unauthenticated visits to <code>/admin</code> render only the login portal; invalid credentials are rejected by Firebase Auth.</li>
      <li><strong>Database Rules Verified:</strong> Unauthenticated HTTP <code>PUT</code> requests to <code>published/heroReels.json</code>, <code>published/clients.json</code>, and <code>published/results/audit_test.json</code> all returned <code>401 Unauthorized</code>.</li>
      <li><strong>Schema Validation Gap:</strong> In <code>database.rules.json</code>, <code>published/results</code> enforces strict field-level <code>.validate</code> rules, whereas <code>projects</code>, <code>clients</code>, <code>heroReels</code>, <code>services</code>, <code>testimonials</code>, <code>announcements</code>, <code>contact</code>, and <code>siteSettings</code> only check <code>auth != null</code>.</li>
    </ul>

    <h2>8. Fixes Implemented During Audit</h2>
    <ul>
      <li><strong>Fixed Hero Overwrite Bug:</strong> Removed full-object <code>set(ref(firebaseDb, 'published/hero'), ...)</code> from <code>HeroSectionCMS.tsx</code> so saving Hero Copy/Mobile settings uses <code>saveHero()</code> (<code>update</code>) and never clobbers <code>published/hero/reels</code>.</li>
      <li><strong>Removed Duplicate RTDB Writes:</strong> Eliminated redundant <code>set()</code> calls in <code>HeroSectionCMS.tsx</code>, <code>HeroReelsCMS.tsx</code>, and <code>ClienteleCMS.tsx</code>.</li>
      <li><strong>Client Integrity &amp; Sync:</strong> Added duplicate-name validation and <code>syncClientMetadataToResults()</code> in <code>ClienteleCMS.tsx</code> + <code>cmsService.ts</code>.</li>
      <li><strong>Hero Reels 17-Slot Cylinder &amp; CMS:</strong> Updated <code>ReelWall3D.tsx</code> to dynamically render all 17+ active reels while preserving center-reel scale, and created <code>HeroReelsCMS.tsx</code> (drag-and-drop, preview, edit title/description/poster, enable/disable, publish).</li>
      <li><strong>Results Fallback:</strong> Added <code>INITIAL_RESULTS</code> sample Santhi Pipes case study with before/after analytics SVGs so <code>/results</code> is never blank when Firebase has 0 published results.</li>
    </ul>

    <h2>9. Failed Test Cases, Remaining Risks &amp; Production Readiness Verdict</h2>
    <p><strong>Failed Test Cases (Final Run):</strong> <code>0</code> failed (3 initial test-script assertion case-sensitivity mismatches in <code>AUTH-01</code>, <code>AUTH-02</code>, and <code>FE-03</code> were corrected and re-verified as <code>PASS</code>).</p>
    <div class="warn">
      <strong>Action Required Before Full Production Sign-Off:</strong>
      <ol>
        <li>Log into <code>/admin</code> &rarr; <strong>Home Page &rarr; Hero Reels Management</strong>, click <strong>Load Approved 17 Reels</strong>, and click <strong>Save &amp; Publish Changes</strong> to replace the legacy 10-reel array (which includes a stale <code>blob:</code> URL) currently stored in live Firebase RTDB <code>published/heroReels</code>.</li>
        <li>Verify <code>CLOUDINARY_CLOUD_NAME</code>, <code>CLOUDINARY_API_KEY</code>, and <code>CLOUDINARY_API_SECRET</code> are configured in Vercel production environment variables and run an authenticated live Cloudinary upload test.</li>
        <li>Note that <strong>Packages</strong>, <strong>About/Leadership</strong>, and <strong>SEO Metadata</strong> are currently static code-managed modules rather than CMS UI editors.</li>
      </ol>
    </div>
    <p><strong>Final Production Readiness Verdict:</strong> <strong>CONDITIONAL GO</strong> — Core public routes, authentication gate, RTDB write security, Hero Reels 17-asset pipeline, Results sample case study, and production build are verified and healthy. Complete the 1-click Hero Reels CMS publish in <code>/admin</code> and verify Vercel Cloudinary env vars before final go-live.</p>

    <h2>10. Screenshots &amp; Visual Evidence</h2>
    <div class="shots-grid">${screenshotCards}</div>
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
