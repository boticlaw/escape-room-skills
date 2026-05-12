#!/usr/bin/env node

/**
 * build-pdf.mjs — Generate PDF from HTML using Puppeteer
 *
 * Usage:
 *   node build-pdf.mjs <input.html> [--output <output.pdf>]
 *
 * Requirements:
 *   npm install puppeteer
 */

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log('Usage: node build-pdf.mjs <input.html> [--output <output.pdf>]');
  console.log('');
  console.log('Options:');
  console.log('  --output <path>  Output PDF path (default: <input>.pdf)');
  console.log('  --help           Show this help');
  process.exit(0);
}

const inputPath = path.resolve(args[0]);

if (!fs.existsSync(inputPath)) {
  console.error(`Error: Input file not found: ${inputPath}`);
  process.exit(1);
}

const outputIdx = args.indexOf('--output');
const outputPath = outputIdx !== -1 && args[outputIdx + 1]
  ? path.resolve(args[outputIdx + 1])
  : inputPath.replace(/\.html?$/i, '.pdf');

async function generatePDF() {
  let browser;
  try {
    const puppeteer = await import('puppeteer');
    browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Load HTML file
    const htmlContent = fs.readFileSync(inputPath, 'utf-8');
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });

    // Resolve CSS path relative to HTML file
    const htmlDir = path.dirname(inputPath);
    const cssPath = path.join(htmlDir, 'escape-base.css');
    if (fs.existsSync(cssPath)) {
      await page.addStyleTag({ path: cssPath });
    }

    // Generate PDF
    await page.pdf({
      path: outputPath,
      format: 'A4',
      margin: {
        top: '12mm',
        bottom: '12mm',
        left: '10mm',
        right: '10mm'
      },
      printBackground: true,
      displayHeaderFooter: false
    });

    console.log(`PDF generated: ${outputPath}`);
  } catch (err) {
    if (err.code === 'ERR_MODULE_NOT_FOUND' || err.message.includes('puppeteer')) {
      console.error('Error: Puppeteer not found. Install it with:');
      console.error('  npm install puppeteer');
      process.exit(1);
    }
    throw err;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

generatePDF().catch(err => {
  console.error('Error generating PDF:', err.message);
  process.exit(1);
});
