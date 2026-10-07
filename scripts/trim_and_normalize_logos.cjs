const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

const clientFiles = [
  'Shanti Pipes.png',
  'Bags World Logo.PNG',
  'Aabharan Logo.png',
  'Fresh and Fresh Logo.png',
  'IMG_4537.PNG',
  'Dayanidhi Logo.png',
  'Jain Beauty Logo.png',
  'Rk home.png',
  'SB Ventures Logo.png',
  'KC Overseas Logo.PNG',
  'SRK Doors World Logo.png',
  'Jain Enterprises Logo.png',
  'Nirmala logo.png',
  'Rudra logo.png',
  'Sahana Logo.PNG',
  'T3 Logo.png'
];

const outDir = path.resolve('public/clients/trimmed');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function trimAll() {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  for (const file of clientFiles) {
    const srcPath = path.resolve('public/clients', file);
    if (!fs.existsSync(srcPath)) {
      console.log('Skipping missing:', file);
      continue;
    }

    const buffer = fs.readFileSync(srcPath);
    const dataUrl = 'data:image/png;base64,' + buffer.toString('base64');

    const result = await page.evaluate(async (dataUrl, fileName) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          const width = canvas.width;
          const height = canvas.height;
          const imgData = ctx.getImageData(0, 0, width, height);
          const data = imgData.data;

          // Special case: SRK Doors World is already full bleed square artwork
          if (fileName.includes('SRK Doors')) {
            resolve({ dataUrl, w: width, h: height, cropped: false });
            return;
          }

          let minX = width, minY = height, maxX = 0, maxY = 0;
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const idx = (y * width + x) * 4;
              const r = data[idx];
              const g = data[idx + 1];
              const b = data[idx + 2];
              const a = data[idx + 3];

              // Check if pixel is meaningful (not transparent and not pure white)
              const isWhite = r > 242 && g > 242 && b > 242;
              const isTransparent = a < 25;

              if (!isWhite && !isTransparent) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
              }
            }
          }

          if (maxX < minX || maxY < minY) {
            // Fallback if blank
            resolve({ dataUrl, w: width, h: height, cropped: false });
            return;
          }

          const contentW = maxX - minX + 1;
          const contentH = maxY - minY + 1;

          // Add a balanced 4% padding around the cropped bounds
          const pad = Math.max(8, Math.round(Math.max(contentW, contentH) * 0.04));
          const cropX = Math.max(0, minX - pad);
          const cropY = Math.max(0, minY - pad);
          const cropW = Math.min(width - cropX, contentW + pad * 2);
          const cropH = Math.min(height - cropY, contentH + pad * 2);

          const outCanvas = document.createElement('canvas');
          outCanvas.width = cropW;
          outCanvas.height = cropH;
          const outCtx = outCanvas.getContext('2d');

          // Draw the cropped region
          outCtx.drawImage(
            canvas,
            cropX, cropY, cropW, cropH,
            0, 0, cropW, cropH
          );

          resolve({
            dataUrl: outCanvas.toDataURL('image/png'),
            w: cropW,
            h: cropH,
            origW: width,
            origH: height,
            cropped: true
          });
        };
        img.src = dataUrl;
      });
    }, dataUrl, file);

    const base64Data = result.dataUrl.replace(/^data:image\/png;base64,/, '');
    const destPath = path.resolve(outDir, file);
    fs.writeFileSync(destPath, Buffer.from(base64Data, 'base64'));

    console.log(`Trimmed ${file}: [${result.origW || result.w}x${result.origH || result.h}] -> [${result.w}x${result.h}]`);
  }

  await browser.close();
  console.log('All logos trimmed successfully to public/clients/trimmed/');
}

trimAll().catch(console.error);
