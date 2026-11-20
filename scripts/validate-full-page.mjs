import { spawn } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9334;
const profile = await mkdtemp(join(tmpdir(), 'brandshoots-cdp-'));
const chrome = spawn(chromePath, [
  '--headless',
  '--no-sandbox',
  '--disable-gpu',
  '--disable-extensions',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  'about:blank',
], { stdio: 'ignore' });

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
for (let attempt = 0; attempt < 40; attempt += 1) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/json/version`);
    if (response.ok) break;
  } catch {}
  await sleep(250);
}

const targetResponse = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent('http://localhost:4173/?nopreload')}`, { method: 'PUT' });
const target = await targetResponse.json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let requestId = 0;
const pending = new Map();
const runtimeErrors = [];
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  }
  if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params);
});

const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++requestId;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

try {
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://localhost:4173/?nopreload' });
  await sleep(2500);

  const evaluation = await send('Runtime.evaluate', {
    awaitPromise: true,
    returnByValue: true,
    expression: `(async () => {
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      let y = 0;
      let stablePasses = 0;
      let previousHeight = 0;
      while (stablePasses < 3 && y < 30000) {
        const height = document.documentElement.scrollHeight;
        if (height === previousHeight && y >= height - innerHeight) stablePasses += 1;
        else stablePasses = 0;
        previousHeight = height;
        y = Math.min(y + 700, Math.max(0, height - innerHeight));
        if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true });
        else window.scrollTo(0, y);
        await wait(180);
      }
      await wait(500);
      const requiredIds = ['hero','announcements','metrics','what-we-do','packages','leadership','clients','testimonials','cta','footer'];
      const images = [...document.images];
      return {
        sections: Object.fromEntries(requiredIds.map((id) => [id, Boolean(document.getElementById(id))])),
        brokenImages: images.filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
        clientRasterSources: images.filter((image) => image.currentSrc.includes('/clients/')).map((image) => image.currentSrc),
        horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
        scrollHeight: document.documentElement.scrollHeight,
      };
    })()`,
  });

  const result = evaluation.result.value;
  const allSections = Object.values(result.sections).every(Boolean);
  const allClientLogosOptimized = result.clientRasterSources.length > 0 && result.clientRasterSources.every((url) => url.includes('/clients/optimized/') && url.endsWith('.webp'));
  console.log(JSON.stringify({ ...result, allSections, allClientLogosOptimized, runtimeErrors: runtimeErrors.length }, null, 2));
  if (!allSections || !allClientLogosOptimized || result.brokenImages.length > 0 || result.horizontalOverflow > 2 || runtimeErrors.length > 0) process.exitCode = 1;
} finally {
  socket.close();
  chrome.kill();
}
