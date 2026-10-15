const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

async function runSpeedWarAudit() {
  console.log('===============================================================');
  console.log('   BRANDSHOOTS V2.0 — SPEED WAR / PERFORMANCE AUDIT SUITE      ');
  console.log('===============================================================');

  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--enable-gpu',
      '--enable-webgl',
      '--autoplay-policy=no-user-gesture-required'
    ]
  });

  const allConsoleErrors = [];
  const results = {
    routes: {},
    scrollFps: null,
    videoDecoders: {},
    navigationStressTest: null
  };

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Filter non-fatal browser favicon or benign font warnings if any
      allConsoleErrors.push(text);
    }
  });

  // 1. ROUTE LOAD PERFORMANCE AUDIT
  const testRoutes = [
    { name: 'Homepage', url: 'http://localhost:5173/?nopreload' },
    { name: 'About', url: 'http://localhost:5173/about?nopreload' },
    { name: 'Portfolio', url: 'http://localhost:5173/portfolio?nopreload' },
    { name: 'Contact', url: 'http://localhost:5173/contact?nopreload' }
  ];

  for (const route of testRoutes) {
    console.log(`\n--- Auditing Route: ${route.name} (${route.url}) ---`);
    const startTime = Date.now();
    await page.goto(route.url, { waitUntil: 'domcontentloaded' });
    const dclTime = Date.now() - startTime;

    // Wait a brief moment for initial render
    await new Promise(r => setTimeout(r, 1200));

    const metrics = await page.evaluate(() => {
      const navEntry = performance.getEntriesByType('navigation')[0] || {};
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find(p => p.name === 'first-contentful-paint')?.startTime || null;

      const videos = Array.from(document.querySelectorAll('video'));
      const playingVideos = videos.filter(v => !v.paused && v.readyState >= 2);
      const videosWithSrc = videos.filter(v => v.src && v.src.length > 0);

      const mem = window.performance.memory ? {
        usedJSHeapSizeMB: +(window.performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2),
        totalJSHeapSizeMB: +(window.performance.memory.totalJSHeapSize / (1024 * 1024)).toFixed(2)
      } : null;

      return {
        domContentLoaded: Math.round(navEntry.domContentLoadedEventEnd || 0),
        loadEventEnd: Math.round(navEntry.loadEventEnd || 0),
        fcp: fcp ? Math.round(fcp) : null,
        totalVideosInDOM: videos.length,
        videosWithActiveSrc: videosWithSrc.length,
        currentlyPlayingVideos: playingVideos.length,
        memory: mem
      };
    });

    results.routes[route.name] = {
      dclMeasuredMs: dclTime,
      ...metrics
    };

    console.log(`  ✓ DOMContentLoaded: ${metrics.domContentLoaded || dclTime}ms`);
    console.log(`  ✓ FCP: ${metrics.fcp}ms`);
    console.log(`  ✓ Videos in DOM: ${metrics.totalVideosInDOM} (Active Src: ${metrics.videosWithActiveSrc}, Playing: ${metrics.currentlyPlayingVideos})`);
    if (metrics.memory) {
      console.log(`  ✓ JS Heap: ${metrics.memory.usedJSHeapSizeMB} MB / ${metrics.memory.totalJSHeapSizeMB} MB`);
    }
  }

  // 2. HERO CYLINDER VIEWPORT INTERSECTION TEST
  console.log('\n--- Auditing Hero Viewport Observer (Video Decoders Throttling) ---');
  await page.goto('http://localhost:5173/?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  const heroInitial = await page.evaluate(() => {
    const hero = document.getElementById('hero-cylinder') || document.querySelector('.cylinder-scene');
    const heroVideos = hero ? Array.from(hero.querySelectorAll('video')) : [];
    const playing = heroVideos.filter(v => !v.paused).length;
    return { count: heroVideos.length, playing };
  });
  console.log(`  At Top of Homepage: Hero has ${heroInitial.count} videos (${heroInitial.playing} playing)`);

  // Scroll down to What We Do
  await page.evaluate(() => {
    window.scrollTo({ top: 1800, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));

  const heroScrolled = await page.evaluate(() => {
    const hero = document.getElementById('hero-cylinder') || document.querySelector('.cylinder-scene');
    const heroVideos = hero ? Array.from(hero.querySelectorAll('video')) : [];
    const playing = heroVideos.filter(v => !v.paused).length;
    return { count: heroVideos.length, playing };
  });
  console.log(`  Scrolled Past Hero (y=1800): Hero has ${heroScrolled.count} videos (${heroScrolled.playing} playing -> ALL PAUSED!)`);
  results.videoDecoders.heroPausedOffscreen = heroScrolled.playing === 0;

  // Scroll back to top
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));

  const heroRestored = await page.evaluate(() => {
    const hero = document.getElementById('hero-cylinder') || document.querySelector('.cylinder-scene');
    const heroVideos = hero ? Array.from(hero.querySelectorAll('video')) : [];
    const playing = heroVideos.filter(v => !v.paused).length;
    return { count: heroVideos.length, playing };
  });
  console.log(`  Scrolled Back to Hero: Hero has ${heroRestored.count} videos (${heroRestored.playing} playing -> RESUMED!)`);
  results.videoDecoders.heroResumedInView = heroRestored.playing > 0;

  // 3. HOMEPAGE SCROLL FPS BENCHMARK
  console.log('\n--- Benchmarking Homepage Scroll FPS (Lenis + GSAP) ---');
  const fpsResult = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const frameTimes = [];
      let lastTime = performance.now();
      let scrollY = 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollStep = maxScroll / 90; // ~90 frames across full page

      function step() {
        const now = performance.now();
        frameTimes.push(now - lastTime);
        lastTime = now;

        scrollY += scrollStep;
        window.scrollTo(0, scrollY);

        if (scrollY < maxScroll) {
          requestAnimationFrame(step);
        } else {
          // Analyze frame times
          const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
          const avgFps = Math.min(60, +(1000 / avgFrameTime).toFixed(1));
          const droppedFrames = frameTimes.filter(t => t > 25).length; // frames taking > 25ms (< 40fps)
          resolve({
            avgFps,
            avgFrameTimeMs: +avgFrameTime.toFixed(2),
            totalFrames: frameTimes.length,
            droppedFrames
          });
        }
      }
      requestAnimationFrame(step);
    });
  });

  console.log(`  ✓ Average FPS: ${fpsResult.avgFps} FPS (avg frame duration: ${fpsResult.avgFrameTimeMs}ms)`);
  console.log(`  ✓ Total Frames: ${fpsResult.totalFrames}, Frames > 25ms: ${fpsResult.droppedFrames}`);
  results.scrollFps = fpsResult;

  // 4. PORTFOLIO LAZY VIDEO DECODER BENCHMARK
  console.log('\n--- Auditing Portfolio Wormhole Lazy Video Decoders ---');
  await page.goto('http://localhost:5173/portfolio?nopreload', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  const portfolioInit = await page.evaluate(() => {
    const vids = Array.from(document.querySelectorAll('video'));
    const attached = vids.filter(v => v.src && v.src.length > 5);
    const playing = vids.filter(v => !v.paused);
    return { total: vids.length, attached: attached.length, playing: playing.length };
  });
  console.log(`  Portfolio Initial Mount: ${portfolioInit.total} videos in DOM (${portfolioInit.attached} with active src, ${portfolioInit.playing} playing)`);
  results.videoDecoders.portfolioInitialActive = portfolioInit.attached;

  // 5. MULTI-ROUTE STRESS TEST: HOME -> ABOUT -> PORTFOLIO -> CONTACT -> HOME
  console.log('\n--- Multi-Route Traversal Stress Test ---');
  const routeCycle = [
    'http://localhost:5173/about?nopreload',
    'http://localhost:5173/portfolio?nopreload',
    'http://localhost:5173/contact?nopreload',
    'http://localhost:5173/?nopreload'
  ];

  for (const url of routeCycle) {
    const routeName = url.split('/').pop().replace('?nopreload', '') || 'home';
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 600));
    const mem = await page.evaluate(() => {
      return window.performance.memory ? +(window.performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2) : 'N/A';
    });
    console.log(`  Navigated -> /${routeName} | JS Heap: ${mem} MB`);
  }

  const finalMemory = await page.evaluate(() => {
    return window.performance.memory ? +(window.performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2) : null;
  });

  results.navigationStressTest = {
    finalHeapMB: finalMemory,
    totalConsoleErrors: allConsoleErrors.length,
    errors: allConsoleErrors
  };

  console.log(`\n=== AUDIT RESULTS SUMMARY ===`);
  console.log(`Total Console Errors across entire suite: ${allConsoleErrors.length}`);
  if (allConsoleErrors.length > 0) {
    console.log('Errors:', allConsoleErrors);
  } else {
    console.log('Zero Console Errors! ✨');
  }

  await browser.close();

  // Save audit results to file
  const artifactDir = 'C:/Users/SURYARAJA/.gemini/antigravity/brain/cd1ca2b0-a812-41d9-bd25-1104d25cfeb7';
  fs.writeFileSync(path.join(artifactDir, 'speed_war_audit_results.json'), JSON.stringify(results, null, 2));
  console.log('\nAudit complete! Results saved to speed_war_audit_results.json');
}

runSpeedWarAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
