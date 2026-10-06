const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const fs = require('fs');

async function analyze() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  const imgBase64 = fs.readFileSync('C:/Users/SURYARAJA/.gemini/antigravity/brain/db24e697-956e-4f2a-9a9c-85b0b59d8617/.user_uploaded/media_1791273188168.png').toString('base64');
  
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));

  await page.setContent(`
    <html><body>
      <canvas id="c" width="1024" height="552"></canvas>
      <script>
        const img = new Image();
        img.src = "data:image/png;base64,${imgBase64}";
        img.onload = () => {
          const canvas = document.getElementById("c");
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          // Find Title position (around center horizontally, y from 50 to 250)
          let titleTop = null, titleBtm = null;
          for (let y = 50; y < 260; y++) {
            const p = ctx.getImageData(512, y, 1, 1).data;
            if (p[0] > 100 || p[1] > 100) {
              if (titleTop === null) titleTop = y;
              titleBtm = y;
            }
          }
          console.log("TITLE Y:", titleTop, titleBtm, "h=" + (titleBtm - titleTop));

          // Scan panels and rails at multiple X points
          // xs across width
          const xs = [20, 50, 100, 180, 280, 400, 512, 624, 744, 844, 924, 974, 1004];
          const results = [];
          for (let x of xs) {
            let topEdge = null;
            let btmEdge = null;
            for (let y = 160; y < 480; y++) {
              const p = ctx.getImageData(x, y, 1, 1).data;
              const brightness = (p[0] + p[1] + p[2]) / 3;
              if (brightness > 20) {
                if (topEdge === null) topEdge = y;
                btmEdge = y;
              }
            }
            results.push({ x, topEdge, btmEdge, h: btmEdge ? btmEdge - topEdge : 0 });
          }
          console.log("CURVE DATA:", JSON.stringify(results));

          // Find the 7 panel boundaries across X around y = 300
          // horizontal scan across y = 300
          const horiz = [];
          for (let x = 0; x < 1024; x++) {
            const p = ctx.getImageData(x, 300, 1, 1).data;
            const b = (p[0] + p[1] + p[2]) / 3;
            horiz.push(b > 15 ? 1 : 0);
          }
          // find gaps
          let inPanel = false;
          const panels = [];
          let start = 0;
          for (let x = 0; x < 1024; x++) {
            if (!inPanel && horiz[x] === 1) {
              inPanel = true;
              start = x;
            } else if (inPanel && horiz[x] === 0) {
              inPanel = false;
              panels.push({ start, end: x - 1, w: x - start });
            }
          }
          if (inPanel) panels.push({ start, end: 1023, w: 1024 - start });
          console.log("PANELS AT Y=300:", JSON.stringify(panels));
        };
      </script>
    </body></html>
  `);

  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
}

analyze().catch(console.error);
