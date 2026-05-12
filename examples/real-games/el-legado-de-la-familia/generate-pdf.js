const puppeteer = require('puppeteer');
const path = require('path');

const htmlFile = process.argv[2] || 'EL-LEGADO-DE-LA-FAMILIA.html';
const htmlPath = path.resolve(__dirname, htmlFile);
const pdfPath = htmlPath.replace('.html', '.pdf');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    margin: { top: '12mm', bottom: '12mm', left: '10mm', right: '10mm' },
    printBackground: true,
    displayHeaderFooter: false
  });
  await browser.close();
  console.log(`PDF generado: ${pdfPath}`);
})();
