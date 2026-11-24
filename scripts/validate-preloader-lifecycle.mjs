import { spawn } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const debugPort = 9341;
const profile = await mkdtemp(join(tmpdir(), 'brandshoots-preloader-'));
const chrome = spawn(chromePath, [
  '--headless',
  '--no-sandbox',
  '--disable-gpu',
  '--disable-extensions',
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${profile}`,
  'about:blank',
], { stdio: 'ignore' });

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
for (let attempt = 0; attempt < 40; attempt += 1) {
  try {
    if ((await fetch(`http://127.0.0.1:${debugPort}/json/version`)).ok) break;
  } catch {}
  await sleep(250);
}

const target = await (await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: 'PUT' })).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

let id = 0;
const pending = new Map();
const runtimeErrors = [];
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const callback = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) callback.reject(new Error(message.error.message));
    else callback.resolve(message.result);
  }
  if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params);
});

const send = (method, params = {}) => new Promise((resolve, reject) => {
  const requestId = ++id;
  pending.set(requestId, { resolve, reject });
  socket.send(JSON.stringify({ id: requestId, method, params }));
});

const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  return result.result.value;
};

const loaderState = () => evaluate(`(() => ({
  full: Boolean(document.querySelector('[aria-label="Loading BrandShoots homepage"]')),
  route: Boolean(document.querySelector('[aria-label="Loading BrandShoots page"]')),
  fallback: Boolean(document.querySelector('[aria-label="Loading BrandShoots page"]')),
  hero: Boolean(document.querySelector('#hero')),
  title: document.title,
  path: location.pathname,
  bodyOverflow: getComputedStyle(document.body).overflow,
  background: getComputedStyle(document.body).backgroundColor
}))()`);

const waitForLoaderToStart = async (kind, maximumMs = 5000) => {
  const started = Date.now();
  while (Date.now() - started < maximumMs) {
    const state = await loaderState();
    if (state?.[kind]) return Date.now();
    await sleep(40);
  }
  throw new Error(`${kind} loader did not appear within ${maximumMs}ms`);
};

const waitForLoaderToFinish = async (kind, maximumMs = 9000) => {
  const started = Date.now();
  while (Date.now() - started < maximumMs) {
    const state = await loaderState();
    if (state && !state[kind]) return Date.now() - started;
    await sleep(80);
  }
  throw new Error(`${kind} loader did not finish within ${maximumMs}ms`);
};

const navigateAndCheckInitial = async (url, kind, minimumVisibleMs) => {
  const started = Date.now();
  await send('Page.navigate', { url });
  const appearedAt = await waitForLoaderToStart(kind);
  const early = await loaderState();
  if (!early[kind]) throw new Error(`${kind} loader missing on ${url}`);
  await sleep(Math.max(0, minimumVisibleMs - (Date.now() - appearedAt)));
  const minimum = await loaderState();
  if (!minimum[kind]) throw new Error(`${kind} loader exited before ${minimumVisibleMs}ms on ${url}`);
  await waitForLoaderToFinish(kind);
  return Date.now() - started;
};

try {
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });

  const firstHomeMs = await navigateAndCheckInitial('http://localhost:3002/', 'full', 1950);
  const refreshHomeMs = await navigateAndCheckInitial(`http://localhost:3002/?refresh=${Date.now()}`, 'full', 1950);

  await evaluate(`document.querySelector('a[href="/about"]')?.click()`);
  await sleep(80);
  const aboutEarly = await loaderState();
  if (!aboutEarly.route) throw new Error('Route loader missing when navigating Home → About');
  const aboutMs = await waitForLoaderToFinish('route');
  const aboutDone = await loaderState();
  if (aboutDone.path !== '/about') throw new Error('About route did not commit');

  await evaluate(`document.querySelector('a[href="/packages"]')?.click()`);
  await sleep(80);
  const packagesEarly = await loaderState();
  if (!packagesEarly.route) throw new Error('Route loader missing when navigating About → Packages');
  const packagesMs = await waitForLoaderToFinish('route');
  const packagesDone = await loaderState();
  if (packagesDone.path !== '/packages') throw new Error('Packages route did not commit');

  await evaluate('history.back()');
  await sleep(80);
  const backEarly = await loaderState();
  if (!backEarly.route) throw new Error('Route loader missing on browser Back');
  const backMs = await waitForLoaderToFinish('route');
  if ((await loaderState()).path !== '/about') throw new Error('Browser Back did not restore About');

  await evaluate('history.forward()');
  await sleep(80);
  const forwardEarly = await loaderState();
  if (!forwardEarly.route) throw new Error('Route loader missing on browser Forward');
  const forwardMs = await waitForLoaderToFinish('route');
  if ((await loaderState()).path !== '/packages') throw new Error('Browser Forward did not restore Packages');

  const directContactMs = await navigateAndCheckInitial('http://localhost:3002/contact', 'route', 900);

  await send('Network.clearBrowserCache');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 450,
    downloadThroughput: 70000,
    uploadThroughput: 40000,
    connectionType: 'cellular3g',
  });
  const slowHomeMs = await navigateAndCheckInitial(`http://localhost:3002/?slow=${Date.now()}`, 'full', 1950);
  if (slowHomeMs > 9000) throw new Error(`Slow-network preloader exceeded fail-safe: ${slowHomeMs}ms`);

  await send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 0,
    downloadThroughput: -1,
    uploadThroughput: -1,
    connectionType: 'none',
  });
  await send('Network.setCacheDisabled', { cacheDisabled: false });
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  const mobileHomeMs = await navigateAndCheckInitial(`http://localhost:3002/?mobile=${Date.now()}`, 'full', 1950);

  console.log(JSON.stringify({
    firstHomeMs,
    refreshHomeMs,
    aboutMs,
    packagesMs,
    backMs,
    forwardMs,
    directContactMs,
    slowHomeMs,
    mobileHomeMs,
    runtimeErrors: runtimeErrors.length,
  }, null, 2));
  if (runtimeErrors.length > 0) process.exitCode = 1;
} finally {
  socket.close();
  chrome.kill();
}
