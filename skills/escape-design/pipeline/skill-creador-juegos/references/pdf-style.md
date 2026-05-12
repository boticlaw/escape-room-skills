# PDF Style Rules

## Generation

Uses Puppeteer to convert HTML+CSS inline to PDF A4.

```javascript
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve('GAME.html'), { waitUntil: 'networkidle0' });
  await page.pdf({
    path: path.resolve('GAME.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '2cm', bottom: '2cm', left: '2.2cm', right: '2.2cm' },
    displayHeaderFooter: true,
    footerTemplate: '<div style="font-size:8px; color:#bbb; width:100%; text-align:center;"><span class="pageNumber"></span></div>'
  });
  await browser.close();
})();
```

## Content Sections

1. **Cover** — Title, metadata (players, duration, difficulty, age)
2. **Synopsis & Story** — Premise, characters
3. **Game Structure** — Spaces, difficulty curve, closure types
4. **Puzzle Flow** — Visual diagram
5. **Individual puzzle cards** — Name, character, difficulty, code, narrative, step-by-step, reward, materials
6. **Ending** — How it ends, prizes
7. **Codes & materials summary** — Table

## CSS Rules (PDF-safe)

| Element | Rule |
|---------|------|
| **Emojis** | FORBIDDEN. Use CSS badges (`<span class="sym">TEXT</span>`) |
| **HTML entities** | Direct Unicode (→ ▼ ·) instead of `&#8594;` |
| **Codes** | White bg `!important`, dark text `#2d0a3e !important`, 18pt bold, border 3px |
| **Fonts** | Google Fonts (Playfair Display + Source Sans 3) with fallback |
| **CSS** | All inline in `<style>`, no external files |

Reference: `LEGADO-EN-TINTA-VIOLETA.html` as proven template.
