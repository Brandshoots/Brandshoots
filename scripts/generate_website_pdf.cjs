const fs = require('fs');
const path = require('path');
const puppeteer = require('C:/Users/SURYARAJA/Desktop/Web/Aranea Den/node_modules/puppeteer-core');

function getBase64Image(filePath) {
  try {
    const fullPath = path.resolve(filePath);
    if (!fs.existsSync(fullPath)) {
      console.warn('File not found:', fullPath);
      return '';
    }
    const ext = path.extname(fullPath).slice(1);
    const data = fs.readFileSync(fullPath).toString('base64');
    return `data:image/${ext};base64,${data}`;
  } catch (e) {
    console.error('Error reading image', filePath, e);
    return '';
  }
}

(async () => {
  console.log('Loading template...');
  const templatePath = path.resolve('scripts/document_template.html');
  let html = fs.readFileSync(templatePath, 'utf8');

  console.log('Encoding screenshots to base64...');
  html = html.replace('{{IMAGE_HERO}}', getBase64Image('reports/snap_desktop_01_hero.png'));
  html = html.replace('{{IMAGE_WHAT_WE_DO}}', getBase64Image('reports/snap_desktop_02_what_we_do.png'));
  html = html.replace('{{IMAGE_CLIENTS}}', getBase64Image('reports/snap_desktop_03_clients.png'));
  html = html.replace('{{IMAGE_LEADERSHIP_HOME}}', getBase64Image('reports/snap_desktop_04_leadership.png'));
  html = html.replace('{{IMAGE_TESTIMONIALS}}', getBase64Image('reports/testimonials_01_desktop.png'));
  html = html.replace('{{IMAGE_FOOTER_HOME}}', getBase64Image('reports/qa_homepage_footer.png'));
  html = html.replace('{{IMAGE_MANIFESTO}}', getBase64Image('reports/qa_phase2_desktop_create.png'));
  html = html.replace('{{IMAGE_CORE_INTRO}}', getBase64Image('reports/qa_phase2_desktop_core_intro.png'));
  html = html.replace('{{IMAGE_CORE_CH1}}', getBase64Image('reports/qa_phase2_desktop_core_ch1.png'));
  html = html.replace('{{IMAGE_CORE_CH4}}', getBase64Image('reports/qa_desktop_ch4_verified.png'));
  html = html.replace('{{IMAGE_PORTFOLIO_WORMHOLE}}', getBase64Image('reports/qa_portfolio_wormhole.png'));
  html = html.replace('{{IMAGE_CONTACT_PAGE}}', getBase64Image('reports/qa_contact_page.png'));

  const outputPath = path.resolve('c:/Users/SURYARAJA/Desktop/BrandShoots/BRANDSHOOTS_Complete_Website_Visual_Architecture_Guide.pdf');
  console.log('Launching browser to render PDF:', outputPath);

  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load', timeout: 45000 });
  await new Promise(r => setTimeout(r, 2500)); // Let fonts and base64 images render

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="width: 100%; font-size: 7.5pt; font-family: 'Courier New', monospace; color: #64748B; padding: 0 14mm; display: flex; justify-content: space-between; align-items: center;">
        <span>BRANDSHOOTS // COMPLETE VISUAL & ARCHITECTURAL SPECIFICATION</span>
        <span>PAGE <span class="pageNumber"></span> OF <span class="totalPages"></span></span>
      </div>
    `,
    margin: {
      top: '14mm',
      bottom: '16mm',
      left: '12mm',
      right: '12mm'
    }
  });

  await browser.close();
  console.log('PDF generated successfully!');
  const stats = fs.statSync(outputPath);
  console.log('File size:', (stats.size / 1024 / 1024).toFixed(2), 'MB');
})();
