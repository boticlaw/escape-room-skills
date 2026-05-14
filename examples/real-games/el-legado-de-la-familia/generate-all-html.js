#!/usr/bin/env node
/**
 * Generate ALL HTML materials for "El Legado de la Familia" escape room.
 * Reads from juego/ JSON files and writes self-contained HTMLs to materiales/html/
 *
 * ZERO external dependencies: no @import, no Google Fonts CDN, no JS, no network.
 * Fonts: Georgia, serif fallback.
 */

const fs = require('fs');
const path = require('path');

const BASE = __dirname;
const HTML_DIR = path.join(BASE, 'materiales', 'html');

// ─── Shared CSS helpers ───

const FONT_TITLE = `Georgia, 'Times New Roman', serif`;
const FONT_BODY = `Georgia, 'Times New Roman', serif`;

const A4_CSS = `
@page { size: A4 portrait; margin: 0; }
* { margin: 0; padding: 0; box-sizing: border-box; }
`;

const COMMON_TITLE_FONT = `
h1, h2, h3, h4, .title, .titulo, .header-text, .section-title,
.block-title, .cert-title, .page-title, .foto-title, .sol-code,
.section-header, .char-gen-title, .puzzle-badge, .cover-title, .cover-subtitle {
  font-family: ${FONT_TITLE};
}
`;

// ─── Component CSS ───

const CARTEL_CSS = `
${A4_CSS}
${COMMON_TITLE_FONT}
body {
  font-family: ${FONT_BODY};
  background: #1a1a1a;
  color: #f5e6c8;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}
.cartel {
  width: 186mm; min-height: 267mm;
  background: #1a1a1a;
  color: #f5e6c8;
  padding: 15mm 18mm;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
}
.cartel-border {
  position: absolute;
  top: 8mm; left: 8mm; right: 8mm; bottom: 8mm;
  border: 2px solid #8b7355;
  pointer-events: none;
}
.cartel-border::before {
  content: '';
  position: absolute;
  top: 2mm; left: 2mm; right: 2mm; bottom: 2mm;
  border: 1px solid #8b7355;
  opacity: 0.4;
}
.cartel h1 {
  font-size: 18pt; font-weight: 700;
  letter-spacing: 3px; text-transform: uppercase;
  margin-bottom: 6mm; color: #f5e6c8;
}
.cartel .instruccion {
  font-size: 14pt; line-height: 1.65;
  margin: 4mm 0; color: #f5e6c8;
}
.cartel .nota {
  font-size: 10pt; font-style: italic;
  color: #8b7355; margin-top: 6mm;
  border-top: 1px solid #8b7355;
  padding-top: 4mm;
}
.cartel .hilo-accent {
  color: #8b4513; font-weight: 700;
}
.cartel .consejo {
  margin-top: 8mm;
  padding: 4mm;
  border: 1px solid #8b7355;
  background: rgba(139,115,85,0.1);
  font-size: 11pt;
  font-style: italic;
}
`;

const CARTA_CSS = `
${A4_CSS}
${COMMON_TITLE_FONT}
body {
  font-family: ${FONT_BODY};
  background: #faf0e6;
  width: 186mm;
  margin: 0; padding: 0;
}
.carta-page {
  width: 186mm; min-height: 267mm;
  background: linear-gradient(160deg, #faf5ee 0%, #f5eadb 40%, #f0e2cc 70%, #ece0c8 100%);
  padding: 20mm 25mm 20mm 28mm;
  font-size: 10.5pt; line-height: 1.6;
  color: #4a3728; position: relative;
}
.carta-page::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  box-shadow: inset 0 0 80px 25px rgba(139,115,85,0.18);
  pointer-events: none; z-index: 2;
}
.carta-page::after {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background:
    linear-gradient(180deg, rgba(245,230,210,0.15) 0%, transparent 30%),
    linear-gradient(0deg, rgba(230,215,195,0.10) 0%, transparent 25%);
  pointer-events: none; z-index: 1;
}
.carta-page h1 {
  font-size: 14pt; font-weight: 700;
  color: #3d2b1f; margin-bottom: 5mm;
  border-bottom: 1px solid #8b7355;
  padding-bottom: 2mm;
}
.carta-page h2 {
  font-size: 12pt; font-weight: 600;
  color: #3d2b1f; margin-bottom: 3mm; margin-top: 4mm;
}
.carta-page p {
  margin-bottom: 3mm; position: relative; z-index: 3;
}
.carta-page .fecha-lugar {
  font-style: italic; color: #8b7355;
  margin-bottom: 5mm; font-size: 9.5pt;
}
.carta-page .remitente {
  text-align: right; margin-top: 8mm;
  font-style: italic;
}
.carta-page .firma-bloque {
  margin-top: 12mm; text-align: right;
  padding-right: 5mm; position: relative; z-index: 3;
}
.carta-page .firma-linea {
  border-bottom: 1px solid #8b7355;
  width: 60mm; display: inline-block; margin-bottom: 2mm;
}
.carta-page .firma-nombre {
  font-style: italic; font-size: 12pt; color: #3d2b1f;
  display: block; margin-top: 2mm;
}
.carta-page .firma-fecha {
  font-size: 8pt; color: #8b7355; font-style: italic; margin-top: 1mm;
}
.carta-page .sello-cera {
  width: 18mm; height: 18mm;
  background: radial-gradient(circle at 35% 35%, #c62828 0%, #b22222 20%, #8b0000 50%, #5c0000 80%, #3a0000 100%);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: rgba(212,163,115,0.9);
  font-size: 11pt; font-weight: 700;
  box-shadow: 2px 2px 5px rgba(0,0,0,0.35), inset 0 0 8px rgba(0,0,0,0.25);
  transform: rotate(-8deg);
  position: absolute; bottom: 22mm; right: 22mm; z-index: 4;
}
.carta-page .drop-cap::first-letter {
  float: left; font-size: 24pt; line-height: 1;
  padding-right: 2mm; padding-top: 1mm; color: #8b4513;
}
.carta-page .destacado {
  color: #8b4513; font-weight: 600;
}
.carta-page .italica {
  font-style: italic;
}
`;

const DIARIO_CSS = `
${A4_CSS}
${COMMON_TITLE_FONT}
body {
  font-family: ${FONT_BODY};
  background: #faf0e6;
  width: 186mm;
  margin: 0; padding: 0;
}
.diario-page {
  width: 186mm; min-height: 267mm;
  background: linear-gradient(160deg, #faf5ee 0%, #f5eadb 40%, #f0e2cc 70%, #ece0c8 100%);
  padding: 18mm 22mm 20mm 24mm;
  font-size: 10.5pt; line-height: 1.7;
  color: #4a3728; position: relative;
}
.diario-page::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  box-shadow: inset 0 0 100px 30px rgba(139,115,85,0.22);
  pointer-events: none; z-index: 2;
}
/* Horizontal ruled lines */
.diario-page::after {
  content: '';
  position: absolute; top: 18mm; left: 20mm; right: 20mm; bottom: 15mm;
  background: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 8.5mm,
    rgba(139,115,85,0.08) 8.5mm,
    rgba(139,115,85,0.08) 8.6mm
  );
  pointer-events: none; z-index: 1;
}
.diario-page h1 {
  font-size: 14pt; font-weight: 700;
  color: #3d2b1f; margin-bottom: 6mm;
  border-bottom: 2px solid #8b7355;
  padding-bottom: 2mm;
  position: relative; z-index: 3;
}
.diario-page .entrada {
  margin-bottom: 8mm;
  position: relative; z-index: 3;
}
.diario-page .entrada .fecha {
  font-weight: 700; font-size: 11pt;
  color: #3d2b1f; margin-bottom: 2mm;
}
.diario-page .entrada .estrella {
  color: #8b7355;
}
.diario-page .entrada p {
  margin-bottom: 2mm;
}
.diario-page .entrada em {
  font-style: italic;
}
.diario-page . italica-especial {
  font-style: italic; color: #8b7355;
}
`;

const TABLERO_CSS = `
${A4_CSS}
${COMMON_TITLE_FONT}
body {
  font-family: ${FONT_BODY};
  background: #faf0e6;
  width: 186mm;
  margin: 0; padding: 0;
}
.tablero-page {
  width: 186mm; min-height: 267mm;
  background: linear-gradient(160deg, #faf5ee 0%, #f5eadb 40%, #f0e2cc 70%, #ece0c8 100%);
  padding: 15mm 15mm 15mm 15mm;
  font-size: 10.5pt; line-height: 1.5;
  color: #4a3728; position: relative;
}
.tablero-page::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  box-shadow: inset 0 0 60px 15px rgba(139,115,85,0.12);
  pointer-events: none; z-index: 2;
}
.tablero-page h1 {
  font-size: 15pt; font-weight: 700;
  color: #3d2b1f; margin-bottom: 5mm;
  text-align: center;
}
.tablero-page h2 {
  font-size: 12pt; font-weight: 600;
  color: #3d2b1f; margin-bottom: 3mm; margin-top: 5mm;
}
.tablero-page p {
  margin-bottom: 2mm; position: relative; z-index: 3;
}
table.data {
  width: 100%; border-collapse: collapse;
  font-size: 10pt; margin: 5mm 0;
  position: relative; z-index: 3;
}
table.data th, table.data td {
  border: 1px solid #8b7355;
  padding: 2.5mm 3mm; text-align: left; vertical-align: top;
}
table.data th {
  background: #8b7355; color: #faf0e6;
  font-weight: 600; font-size: 9.5pt; letter-spacing: 0.5px;
}
table.data td { background: #fdf5e6; }
table.data tr:nth-child(even) td { background: #f5e6c8; }
.tablero-page .destacado {
  color: #8b4513; font-weight: 600;
}
`;

const TARJETA_CSS = `
${A4_CSS}
${COMMON_TITLE_FONT}
body {
  font-family: ${FONT_BODY};
  background: #faf0e6;
  width: 186mm;
  margin: 0; padding: 0;
}
.tarjeta-page {
  width: 186mm; min-height: 267mm;
  background: linear-gradient(160deg, #faf5ee 0%, #f5eadb 40%, #f0e2cc 70%, #ece0c8 100%);
  padding: 12mm 12mm 12mm 12mm;
  font-size: 10.5pt; line-height: 1.55;
  color: #4a3728; position: relative;
}
.tarjeta-page::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  box-shadow: inset 0 0 60px 15px rgba(139,115,85,0.12);
  pointer-events: none; z-index: 2;
}
.tarjeta-page h1 {
  font-size: 14pt; font-weight: 700;
  color: #3d2b1f; margin-bottom: 5mm;
  text-align: center;
  border-bottom: 1px solid #8b7355;
  padding-bottom: 2mm;
}
.tarjeta {
  background: #fdf5e6;
  border: 2px solid #8b7355;
  padding: 5mm 6mm;
  margin-bottom: 4mm;
  position: relative; z-index: 3;
  page-break-inside: avoid;
}
.tarjeta .tarjeta-num {
  position: absolute; top: 2mm; right: 3mm;
  font-size: 9pt; color: #8b7355; font-weight: 700;
}
.tarjeta .tarjeta-titulo {
  font-size: 11pt; font-weight: 700;
  color: #3d2b1f; margin-bottom: 2mm;
}
.tarjeta .tarjeta-texto {
  font-size: 10.5pt; line-height: 1.5;
}
.tarjeta .destacado {
  color: #8b4513; font-weight: 600;
}
.tarjeta .sello-raspable {
  display: inline-block;
  background: linear-gradient(135deg, #c0c0c0, #e8e8e8, #c0c0c0);
  color: #333;
  padding: 1mm 3mm;
  font-size: 8pt;
  font-weight: 700;
  letter-spacing: 1px;
  border: 1px solid #999;
  margin-top: 2mm;
}
.tarjeta .sello-contenido {
  color: #8b4513; font-weight: 700; font-size: 11pt;
  margin-top: 1mm;
}
`;

const FRAGMENTO_CSS = `
${A4_CSS}
${COMMON_TITLE_FONT}
body {
  font-family: ${FONT_BODY};
  background: #faf0e6;
  width: 186mm;
  margin: 0; padding: 0;
}
.fragmento-page {
  width: 186mm; min-height: 267mm;
  background: linear-gradient(160deg, #faf5ee 0%, #f5eadb 40%, #f0e2cc 70%, #ece0c8 100%);
  padding: 15mm 15mm 15mm 15mm;
  font-size: 10.5pt; line-height: 1.6;
  color: #4a3728; position: relative;
}
.fragmento-page::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  box-shadow: inset 0 0 80px 25px rgba(139,115,85,0.18);
  pointer-events: none; z-index: 2;
}
.fragmento-page h1 {
  font-size: 14pt; font-weight: 700;
  color: #3d2b1f; margin-bottom: 5mm;
  text-align: center;
}
.fragmento {
  background: #fdf5e6;
  border: 1px solid #8b7355;
  padding: 5mm 7mm;
  margin-bottom: 5mm;
  position: relative; z-index: 3;
  page-break-inside: avoid;
}
.fragmento .frag-num {
  font-size: 8pt; color: #8b7355; font-weight: 700;
  margin-bottom: 2mm;
}
.fragmento .frag-texto {
  font-size: 12pt; font-style: italic;
  color: #4a3728; line-height: 1.6;
}
`;

const ETIQUETA_CSS = `
${A4_CSS}
${COMMON_TITLE_FONT}
body {
  font-family: ${FONT_BODY};
  background: #faf0e6;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 186mm;
  margin: 0; padding: 0;
}
.etiqueta-page {
  width: 130mm; min-height: 80mm;
  background: #fdf5e6;
  border: 2px dashed #8b7355;
  padding: 8mm 10mm;
  font-size: 10pt; line-height: 1.5;
  color: #4a3728;
  position: relative;
  margin: auto;
  margin-top: 50mm;
}
.etiqueta-page h1 {
  font-size: 12pt; font-weight: 700;
  color: #3d2b1f; margin-bottom: 3mm;
  text-align: center;
}
.etiqueta-page p {
  margin-bottom: 2mm;
}
.etiqueta-page .destacado {
  color: #8b4513; font-weight: 600;
}
`;

// ─── HTML wrappers ───

function wrapHTML(title, css, body) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
${css}
</style>
</head>
<body>
${body}
</body>
</html>`;
}

// ─── Text to HTML paragraphs ───
function textToHTML(text) {
  if (!text) return '';
  // If already contains HTML tags, return as-is
  if (text.includes('<p>') || text.includes('<br>')) return text;
  // Otherwise, convert newlines to paragraphs
  return text.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('\n');
}

function textToLines(text) {
  return text.split('\n').filter(l => l.trim());
}

// ─── Load JSONs ───
const juego = JSON.parse(fs.readFileSync(path.join(BASE, 'juego', 'juego.json'), 'utf8'));
const style = JSON.parse(fs.readFileSync(path.join(BASE, 'juego', 'STYLE.json'), 'utf8'));
const pruebas = [];
for (let i = 1; i <= 6; i++) {
  const files = fs.readdirSync(path.join(BASE, 'juego', 'pruebas')).filter(f => f.startsWith(`prueba-00${i}`));
  if (files.length) {
    pruebas.push(JSON.parse(fs.readFileSync(path.join(BASE, 'juego', 'pruebas', files[0]), 'utf8')));
  }
}

// ─── Collect all in-game docs from both arrays, deduplicated by titulo ───
function collectDocs(prueba) {
  const seen = new Map();
  const docs1 = prueba.documentos_in_game || [];
  const docs2 = prueba.ingame_docs || [];
  // Prefer ingame_docs (more recent) over documentos_in_game
  for (const d of [...docs1, ...docs2]) {
    if (!seen.has(d.titulo)) {
      seen.set(d.titulo, d);
    }
  }
  return Array.from(seen.values());
}

// ─── Write helper ───
function writeHTML(filename, content) {
  const p = path.join(HTML_DIR, filename);
  fs.writeFileSync(p, content, 'utf8');
  console.log(`  ✓ ${filename}`);
}

// ═══════════════════════════════════════════════════════════════════
// 00-guia-completa-juego.html — Full game guide
// ═══════════════════════════════════════════════════════════════════
function generateGuia() {
  const css = `
${A4_CSS}
${COMMON_TITLE_FONT}
body {
  font-family: ${FONT_BODY};
  background: #faf0e6;
  color: #4a3728;
  font-size: 10.5pt;
  line-height: 1.55;
}
.page {
  page-break-before: always;
  padding: 2mm 0;
  position: relative;
}
.page:first-child { page-break-before: avoid; }
/* Cover */
.cover {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  min-height: 257mm; text-align: center; position: relative;
}
.cover-border {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  border: 2px solid #8b7355; pointer-events: none;
}
.cover-border::before {
  content: ''; position: absolute;
  top: 4mm; left: 4mm; right: 4mm; bottom: 4mm;
  border: 1px solid #8b7355; opacity: 0.5;
}
.cover-motif { font-size: 10pt; color: #8b7355; letter-spacing: 6px; opacity: 0.35; margin: 4mm 0; }
.cover-title { font-size: 28pt; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: #3d2b1f; margin: 10mm 0 4mm 0; line-height: 1.15; }
.cover-subtitle { font-size: 14pt; font-weight: 500; color: #8b7355; margin-bottom: 3mm; letter-spacing: 1px; }
.cover-event { font-size: 11pt; font-style: italic; color: #8b7355; margin-bottom: 6mm; }
.cover-puppet { margin: 6mm 0; font-size: 36pt; opacity: 0.12; color: #4a3728; }
.cover-strings { margin: 3mm 0; color: #8b7355; font-size: 7.5pt; letter-spacing: 3px; opacity: 0.3; line-height: 1.8; }
.cover-version { font-size: 8.5pt; color: #8b7355; margin-top: 8mm; letter-spacing: 1px; }
/* Section headers */
.section-header { background: #1a1a1a; color: #f5e6c8; padding: 5mm 6mm; margin-bottom: 6mm; text-align: center; }
.section-header h2 { font-size: 15pt; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; margin: 0; }
.section-header .section-sub { font-size: 9pt; font-style: italic; opacity: 0.7; margin-top: 1mm; }
/* Blocks */
.block { margin-bottom: 5mm; }
.block-title { font-size: 11pt; font-weight: 700; color: #3d2b1f; border-bottom: 1px solid #8b7355; padding-bottom: 1.5mm; margin-bottom: 3mm; letter-spacing: 1px; text-transform: uppercase; }
.block-title-sm { font-size: 10pt; font-weight: 600; color: #8b7355; margin-bottom: 2mm; }
p { margin-bottom: 2.5mm; }
ul, ol { margin-left: 5mm; margin-bottom: 3mm; }
li { margin-bottom: 1.5mm; }
/* Tables */
table.data { width: 100%; border-collapse: collapse; font-size: 9.5pt; margin-bottom: 5mm; }
table.data th, table.data td { border: 1px solid #8b7355; padding: 2mm 3mm; text-align: left; vertical-align: top; }
table.data th { background: #8b7355; color: #faf0e6; font-weight: 600; font-size: 9pt; }
table.data td { background: #fdf5e6; }
table.data tr:nth-child(even) td { background: #f5e6c8; }
/* Ficha */
.ficha-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2mm 5mm; font-size: 10pt; margin-bottom: 4mm; }
.ficha-item { padding: 1.5mm 0; border-bottom: 1px dotted #c4a97d; }
.ficha-label { font-weight: 700; color: #8b7355; font-size: 9pt; text-transform: uppercase; letter-spacing: 0.5px; }
.ficha-value { font-size: 10.5pt; }
/* Characters */
.char-gen { margin-bottom: 4mm; }
.char-gen-title { font-size: 10.5pt; font-weight: 700; color: #faf0e6; background: #1a1a1a; padding: 2mm 4mm; margin-bottom: 2mm; letter-spacing: 1px; }
.char-card { display: flex; gap: 3mm; padding: 2mm 3mm; margin-bottom: 1.5mm; background: #fdf5e6; border-left: 3px solid #8b7355; }
.char-card .char-name { font-weight: 700; min-width: 28mm; color: #3d2b1f; font-size: 9.5pt; }
.char-card .char-desc { font-size: 9.5pt; line-height: 1.45; }
/* Puzzle */
.puzzle-badge { display: inline-block; background: #1a1a1a; color: #f5e6c8; padding: 1mm 3mm; font-size: 8.5pt; font-weight: 600; letter-spacing: 1px; margin-right: 2mm; }
.puzzle-meta { display: flex; flex-wrap: wrap; gap: 3mm 5mm; margin: 3mm 0; font-size: 9pt; color: #8b7355; }
.puzzle-meta span { padding: 1mm 0; }
.solution-box { background: #1a1a1a; color: #f5e6c8; padding: 3mm 5mm; text-align: center; margin: 3mm 0; border: 2px solid #8b7355; }
.solution-box .sol-label { font-size: 8pt; letter-spacing: 2px; text-transform: uppercase; opacity: 0.7; }
.solution-box .sol-code { font-size: 18pt; font-weight: 700; letter-spacing: 4px; margin: 1mm 0; }
.materials-list { font-size: 9pt; columns: 2; column-gap: 5mm; }
.materials-list li { break-inside: avoid; }
/* Phases */
.phase-card { background: #fdf5e6; border-left: 4px solid #8b7355; padding: 3mm 4mm; margin-bottom: 3mm; }
.phase-card .phase-title { font-weight: 700; font-size: 10pt; color: #3d2b1f; margin-bottom: 1.5mm; }
.phase-card .phase-time { font-size: 8.5pt; color: #8b7355; font-style: italic; }
.phase-card p { font-size: 9.5pt; }
.door-symbols { display: flex; justify-content: space-around; margin-top: 4mm; font-size: 10pt; }
.door-symbols .door-item { text-align: center; background: #fdf5e6; border: 1px solid #8b7355; padding: 3mm 5mm; }
.door-symbols .door-icon { font-size: 16pt; display: block; margin-bottom: 1mm; }
/* Highlight */
.hl { color: #8b4513; font-weight: 600; }
.sm { font-size: 9pt; }
.dark-box { background: #1a1a1a; color: #f5e6c8; padding: 3mm 5mm; margin: 3mm 0; }
.reward-box { background: #fdf5e6; border: 2px solid #8b7355; padding: 3mm 5mm; margin: 3mm 0; }
.reward-box .reward-label { font-size: 8pt; letter-spacing: 2px; text-transform: uppercase; color: #8b7355; font-weight: 700; margin-bottom: 1.5mm; }
.reward-box .reward-content { font-size: 10pt; line-height: 1.5; }
.reward-box .reward-content strong { color: #8b4513; }
`;

  const letterData = [
    { letter: 'L', value: 'Lealtad', prueba: 'P1', nombre: pruebas[0]?.nombre || 'El Tablero de las Presencias' },
    { letter: 'E', value: 'Empatía', prueba: 'P2', nombre: pruebas[1]?.nombre || 'El Retrato que Miente' },
    { letter: 'G', value: 'Generosidad', prueba: 'P3', nombre: pruebas[2]?.nombre || 'Las Voces que No se Muestran' },
    { letter: 'A', value: 'Amor', prueba: 'P4', nombre: pruebas[3]?.nombre || 'El Árbol que Faltaba' },
    { letter: 'D', value: 'Dignidad', prueba: 'P5', nombre: pruebas[4]?.nombre || 'El Mensaje Rasgado' },
    { letter: 'O', value: 'Orgullo', prueba: 'P6', nombre: pruebas[5]?.nombre || 'El Cofre del Legado' },
  ];

  const lockData = [
    { prueba: 'P1', tipo: 'Candado 4 dígitos', code: '3154', origen: 'Posiciones de 4 hijos en orden de nacimiento' },
    { prueba: 'P2', tipo: 'Candado combinación 3 dígitos', code: '528', origen: '15 imanes detectados en 3 columnas' },
    { prueba: 'P3', tipo: 'Candado 4 dígitos', code: '7391', origen: '4 dígitos raspados ordenados por fecha' },
    { prueba: 'P4', tipo: 'Cryptex 6 letras', code: 'ALVARO', origen: '6 letras de huecos ordenadas por Lunas ①-⑥' },
    { prueba: 'P5', tipo: 'Ubicación física', code: 'N/A', origen: 'Reconstruir carta → bajo 3.ª tabla' },
    { prueba: 'P6', tipo: 'Candado combinación 4 dígitos', code: '1983', origen: 'Cifrado: valores ★ → frases → números ocultos' },
  ];

  const puzzleSections = pruebas.map((p, i) => {
    const meta = juego.pruebas[i];
    const lock = lockData[i];
    const reward = p.solucion?.recompensa || {};
    const docs = collectDocs(p);
    const materialFiles = docs.map(d => {
      // Map doc titulos to filenames
      return `• ${d.titulo}`;
    });
    return `
<div class="page">
  <div class="section-header">
    <h2>Prueba ${i+1} — ${p.nombre}</h2>
  </div>
  <div class="puzzle-meta">
    <span><span class="puzzle-badge">${p.sala?.toUpperCase() || ''}</span></span>
    <span>Dificultad: <strong>${p.dificultad}/10</strong></span>
    <span>Duración: <strong>${p.duracion_estimada_minutos} min</strong></span>
    <span>Hilo: <strong>${reward.letra || '?'} = ${reward.valor || '?'}</strong></span>
  </div>
  <div class="block">
    <div class="block-title-sm">Descripción</div>
    <p>${p.descripcion || ''}</p>
  </div>
  <div class="block">
    <div class="block-title-sm">Solución</div>
    <p>${p.solucion?.descripcion || ''}</p>
  </div>
  <div class="solution-box">
    <div class="sol-label">Solución — ${lock.tipo}</div>
    <div class="sol-code">${lock.code}</div>
  </div>
  <div class="reward-box">
    <div class="reward-label">Recompensa</div>
    <div class="reward-content">
      ${reward.letra ? `<strong>Letra ${reward.letra} (${reward.valor})</strong><br>` : ''}
      ${reward.carta_navegacion ? `<strong>Navegación:</strong> ${reward.carta_navegacion}<br>` : ''}
      ${reward.revelacion_narrativa ? `<em>${reward.revelacion_narrativa}</em>` : ''}
    </div>
  </div>
</div>`;
  }).join('\n');

  const body = `
<!-- COVER -->
<div class="page cover">
  <div class="cover-border"></div>
  <div class="cover-motif">─ ─ │ │ ─ ─ │ │ ─ ─ │ │ ─ ─</div>
  <div class="cover-puppet">&#9731;</div>
  <div class="cover-title">El Legado<br>de la Familia</div>
  <div class="cover-subtitle">Guía Completa del Juego</div>
  <div class="cover-event">Viernes de Escape — ${juego.fecha}</div>
  <div class="cover-strings">
    │&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;│<br>
    ┊&nbsp;&nbsp;&nbsp;┊&nbsp;&nbsp;&nbsp;┊&nbsp;&nbsp;&nbsp;┊&nbsp;&nbsp;&nbsp;┊&nbsp;&nbsp;&nbsp;┊<br>
    ╰─╯╰─╯╰─╯╰─╯╰─╯╰─╯
  </div>
  <div class="cover-version">Versión ${juego.version}</div>
  <div class="cover-motif">─ ─ │ │ ─ ─ │ │ ─ ─ │ │ ─ ─</div>
</div>

<!-- FICHA TÉCNICA + SINOPSIS -->
<div class="page">
  <div class="section-header">
    <h2>Ficha Técnica &amp; Sinopsis</h2>
  </div>
  <div class="block">
    <div class="block-title">Datos del Juego</div>
    <div class="ficha-grid">
      ${juego.meta.map(m => `<div class="ficha-item"><span class="ficha-label">${m.label}</span><br><span class="ficha-value">${m.value}</span></div>`).join('\n      ')}
    </div>
  </div>
  <div class="block">
    <div class="block-title">Sinopsis</div>
    ${juego.secciones[0]?.contenido_html || ''}
  </div>
  <div class="dark-box">
    <div style="font-size:10pt; font-weight:700; letter-spacing:1px; margin-bottom:2mm;">SÍMBOLO CENTRAL: LAS MARIONETAS</div>
    <p style="font-size:9.5pt; margin:0;">Una mano invisible ha movido los hilos de esta familia durante décadas. El abuelo Rodrigo, como patriarca fundador, tomó decisiones que alteraron el destino de todos.</p>
  </div>
</div>

<!-- PERSONAJES -->
<div class="page">
  <div class="section-header">
    <h2>Personajes</h2>
    <div class="section-sub">Tres generaciones, un secreto compartido</div>
  </div>
  <div class="char-gen">
    <div class="char-gen-title">Generación 1 — Los Fundadores</div>
    <div class="char-card"><div class="char-name">Abuelo Rodrigo</div><div class="char-desc">Patriarca fundador. El que movía los hilos. Tomó la decisión de dar al cuarto hijo en adopción.</div></div>
    <div class="char-card"><div class="char-name">Abuela Elena</div><div class="char-desc">Matriarca fallecida. Ocultó la existencia de un cuarto hijo durante décadas para protegerlo.</div></div>
  </div>
  <div class="char-gen">
    <div class="char-gen-title">Generación 2 — Los Herederos</div>
    <div class="char-card"><div class="char-name">Padre Marcos</div><div class="char-desc">Hijo mayor. Médico en Madrid. Heredero del legado y de los secretos.</div></div>
    <div class="char-card"><div class="char-name">Madre Lucía</div><div class="char-desc">Esposa de Marcos. Sofisticada, tranquila. Protege a sus hijos.</div></div>
    <div class="char-card"><div class="char-name">Tía Carmen</div><div class="char-desc">Hija mediana, profesora en Sevilla. Siempre quiso descubrir la verdad.</div></div>
    <div class="char-card"><div class="char-name">Tío Luis</div><div class="char-desc">Hijo menor. Arquitecto en Barcelona. El que se marchó.</div></div>
  </div>
  <div class="char-gen">
    <div class="char-gen-title">Generación 3 — Los Nietos (JUGADORES)</div>
    <div class="char-card"><div class="char-name">Sebastián, Olivia, Leo, Sofía</div><div class="char-desc">Los nietos de Elena. Protagonistas de la historia.</div></div>
    <div class="char-card" style="border-left-color:#8b4513; background:#f5e6c8;"><div class="char-name" style="color:#8b4513;">Miguel</div><div class="char-desc">El cuarto hijo, dado en adopción en 1983. El secreto que Elena protegió toda su vida. Criado por Álvaro, hermano de Elena.</div></div>
  </div>
</div>

<!-- FLUJO DEL JUEGO -->
<div class="page">
  <div class="section-header">
    <h2>Flujo del Juego</h2>
    <div class="section-sub">${juego.duracion_minutos} minutos · 4 fases · 3 estancias</div>
  </div>
  ${juego.secciones[2]?.contenido_html ? juego.secciones[2].contenido_html.split('</p>').filter(s => s.trim()).map((s, idx) => {
    const phaseNames = [
      'Fase 1: Briefing Self-Service (3 min)',
      'Fase 2: El Despacho — Pruebas 1 & 2 (17 min)',
      'Fase 3: El Salón — Pruebas 3 & 4 (16 min)',
      'Fase 4: El Desván — Pruebas 5 & 6 (14 min)'
    ];
    const clean = s.replace(/<\/?strong>/g, '').replace(/<p>/g, '').replace(/<em>/g, '<em>').trim();
    if (!clean) return '';
    return `<div class="phase-card"><div class="phase-title">${phaseNames[idx] || ''}</div><p>${clean}</p></div>`;
  }).join('\n') : ''}
  <div class="block" style="margin-top:5mm;">
    <div class="block-title-sm">Símbolos de Puertas</div>
    <div class="door-symbols">
      <div class="door-item"><span class="door-icon">&#129522;</span><strong>HILO ROJO</strong><br><span class="sm">Despacho</span></div>
      <div class="door-item"><span class="door-icon">&#127917;</span><strong>MARIONETA</strong><br><span class="sm">Salón</span></div>
      <div class="door-item"><span class="door-icon">&#9986;&#65039;</span><strong>TIJERAS</strong><br><span class="sm">Desván</span></div>
    </div>
  </div>
</div>

<!-- HILO CONDUCTOR -->
<div class="page">
  <div class="section-header">
    <h2>Hilo Conductor</h2>
    <div class="section-sub">LEGADO — Seis valores, seis hilos</div>
  </div>
  <table class="data">
    <thead><tr><th>Letra</th><th>Valor</th><th>Prueba</th><th>Nombre</th></tr></thead>
    <tbody>
      ${letterData.map(l => `<tr><td style="text-align:center;font-size:14pt;font-weight:700;">${l.letter}</td><td>${l.value}</td><td>${l.prueba}</td><td>${l.nombre}</td></tr>`).join('\n      ')}
    </tbody>
  </table>
  <div class="dark-box">
    <p style="font-size:9.5pt; margin:0;">Los hilos representan cómo el Abuelo Rodrigo manipuló el destino de la familia. Al completar cada prueba, los jugadores <strong>«cortan»</strong> un hilo de la marioneta. Al final, todos los hilos están rotos y la verdad queda al descubierto.</p>
  </div>
</div>

<!-- PRUEBAS -->
${puzzleSections}

<!-- CANDADOS Y CÓDIGOS -->
<div class="page">
  <div class="section-header">
    <h2>Resumen de Candados y Códigos</h2>
  </div>
  <table class="data">
    <thead><tr><th>Prueba</th><th>Tipo de Candado</th><th>Código</th><th>Origen</th></tr></thead>
    <tbody>
      ${lockData.map(l => `<tr><td><strong>${l.prueba}</strong></td><td>${l.tipo}</td><td style="text-align:center;font-weight:700;font-size:12pt;">${l.code}</td><td>${l.origen}</td></tr>`).join('\n      ')}
    </tbody>
  </table>
  <div class="dark-box">
    <p style="font-size:9.5pt; margin:0;"><strong>Nota para el GM:</strong> Los códigos nunca aparecen de forma directa. Siempre requieren un paso de deducción (ordenar, contar, mapear). Toda la información está en los materiales del juego.</p>
  </div>
</div>

<!-- DEBRIEFING -->
<div class="page">
  <div class="section-header">
    <h2>Debriefing</h2>
  </div>
  ${juego.secciones_final?.[0]?.contenido_html || ''}
</div>
`;

  writeHTML('00-guia-completa-juego.html', wrapHTML('El Legado de la Familia — Guía Completa', css, body));
}

// ═══════════════════════════════════════════════════════════════════
// PRUEBA 1 — El Tablero de las Presencias
// ═══════════════════════════════════════════════════════════════════
function generatePrueba1() {
  const p = pruebas[0];
  const docs = collectDocs(p);

  // 01-cartel-instruccion.html
  const instruccion = docs.find(d => d.titulo.includes('Instrucción del Tablero'));
  writeHTML('01-cartel-instruccion.html', wrapHTML('Prueba 1 — Instrucción del Tablero', CARTEL_CSS, `
<div class="cartel">
  <div class="cartel-border"></div>
  <h1>Prueba 1<br>El Tablero de las Presencias</h1>
  <div class="instruccion">${instruccion ? instruccion.texto.split('\n').map(l => l.trim() ? `<p>${l}</p>` : '').join('\n') : ''}</div>
</div>
`));

  // 01-tablero.html — Eventos del tablero
  const eventos = docs.find(d => d.titulo.includes('Eventos del Tablero'));
  const events = eventos ? eventos.texto.split('\n').filter(l => l.trim()) : [];
  writeHTML('01-tablero.html', wrapHTML('Prueba 1 — Eventos del Tablero', TABLERO_CSS, `
<div class="tablero-page">
  <h1>Eventos del Tablero</h1>
  <p>Cada casilla representa un evento familiar. Colocad cada personaje en su evento correcto cruzando los testimonios.</p>
  <table class="data">
    <thead><tr><th>Casilla</th><th>Evento</th><th>Personaje</th></tr></thead>
    <tbody>
      ${events.map((e, i) => {
        const match = e.match(/^(\d+)\.\s*(.+)/);
        const num = match ? match[1] : (i+1);
        const name = match ? match[2] : e;
        return `<tr><td style="text-align:center;font-weight:700;font-size:14pt;">${num}</td><td>${name}</td><td style="color:#8b7355;">—</td></tr>`;
      }).join('\n      ')}
    </tbody>
  </table>
  <h2>Solución</h2>
  <table class="data">
    <thead><tr><th>Casilla</th><th>Evento</th><th>Personaje Correcto</th></tr></thead>
    <tbody>
      <tr><td style="text-align:center;font-weight:700;">1</td><td>La tarde de la tormenta</td><td><span class="destacado">Carmen</span></td></tr>
      <tr><td style="text-align:center;font-weight:700;">2</td><td>La visita al médico</td><td>Elena</td></tr>
      <tr><td style="text-align:center;font-weight:700;">3</td><td>La firma ante el notario</td><td><span class="destacado">Marcos</span></td></tr>
      <tr><td style="text-align:center;font-weight:700;">4</td><td>La foto sin rostro</td><td><span class="destacado">Miguel</span></td></tr>
      <tr><td style="text-align:center;font-weight:700;">5</td><td>El cumpleaños aplazado</td><td><span class="destacado">Luis</span></td></tr>
      <tr><td style="text-align:center;font-weight:700;">6</td><td>La despedida en la estación</td><td>M. Á.</td></tr>
    </tbody>
  </table>
  <p style="margin-top:5mm;">Código del candado: posiciones de los <span class="destacado">4 hijos</span> en orden de edad (mayor a menor): <span class="destacado">Marcos(3), Carmen(1), Luis(5), Miguel(4) → 3154</span></p>
</div>
`));

  // 01-testimonios.html
  const testimonios = docs.find(d => d.titulo.includes('Restricciones'));
  const tLines = testimonios ? testimonios.texto.split('\n\n').filter(l => l.trim()) : [];
  writeHTML('01-testimonios.html', wrapHTML('Prueba 1 — Testimonios', TARJETA_CSS, `
<div class="tarjeta-page">
  <h1>Restricciones de los Testimonios</h1>
  <p style="margin-bottom:5mm;text-align:center;font-style:italic;color:#8b7355;">Cada jugador lee su testimonio en voz alta. Compartid toda la información.</p>
  ${tLines.map((t, i) => {
    const m = t.match(/Testimonio (\d+):\s*(.*)/s);
    const num = m ? m[1] : (i+1);
    const text = m ? m[2] : t;
    return `<div class="tarjeta">
    <div class="tarjeta-num">Testimonio ${num}</div>
    <div class="tarjeta-texto">${text.trim()}</div>
  </div>`;
  }).join('\n  ')}
</div>
`));

  // 01-cartas-familiares.html — 8 cartas
  const cartasDocs = docs.filter(d => d.titulo.includes('Carta') && d.titulo.includes('Documento in-game'));
  writeHTML('01-cartas-familiares.html', wrapHTML('Prueba 1 — Cartas Familiares', CARTA_CSS, `
<div class="carta-page">
  <h1>Cartas Familiares</h1>
  <p style="margin-bottom:5mm;font-style:italic;color:#8b7355;">Documentos in-game complementarios. Contexto narrativo, no son la prueba principal.</p>
  ${cartasDocs.map((c, i) => `
  <div style="border-bottom: 1px solid #8b7355; padding-bottom: 5mm; margin-bottom: 6mm; position: relative; z-index: 3;">
    <h2>${c.titulo.replace(' (Documento in-game complementario)', '')}</h2>
    ${c.texto}
  </div>`).join('')}
</div>
`));

  // 01-reco-carta-navegacion.html
  const navP1 = docs.find(d => d.titulo.includes('Carta de Navegación') && d.titulo.includes('P1'));
  writeHTML('01-reco-carta-navegacion.html', wrapHTML('Carta de Navegación P1→P2', CARTA_CSS, `
<div class="carta-page">
  <h1>Carta de Navegación</h1>
  <p class="fecha-lugar">Prueba 1 → Prueba 2</p>
  <p style="font-style:italic;font-size:11pt;line-height:1.7;">${navP1 ? navP1.texto : ''}</p>
  <div class="firma-bloque">
    <span class="firma-linea"></span>
    <span class="firma-nombre">Abuela Elena</span>
  </div>
  <div class="sello-cera">E</div>
</div>
`));

  // 01-reco-fragmento-carta-elena.html
  const fragP1 = docs.find(d => d.titulo.includes('Fragmento de Carta de Elena') && d.titulo.includes('P1'));
  writeHTML('01-reco-fragmento-carta-elena.html', wrapHTML('Fragmento de Carta de Elena (P1)', CARTA_CSS, `
<div class="carta-page">
  <h1>Fragmento de Carta de Elena</h1>
  <p class="fecha-lugar">Prueba 1 — Lealtad</p>
  ${fragP1 ? textToHTML(fragP1.texto) : ''}
  <div class="firma-bloque">
    <span class="firma-linea"></span>
    <span class="firma-nombre">Abuela Elena</span>
  </div>
  <div class="sello-cera">L</div>
</div>
`));
}

// ═══════════════════════════════════════════════════════════════════
// PRUEBA 2 — El Retrato que Miente
// ═══════════════════════════════════════════════════════════════════
function generatePrueba2() {
  const p = pruebas[1];
  const docs = collectDocs(p);

  // 02-cartel-instruccion.html — Etiqueta de la carpeta de restauración
  const etiqueta = docs.find(d => d.titulo.includes('Etiqueta de la Carpeta'));
  writeHTML('02-cartel-instruccion.html', wrapHTML('Prueba 2 — Etiqueta Carpeta de Restauración', ETIQUETA_CSS, `
<div class="etiqueta-page">
  <h1>Carpeta de Restauración</h1>
  ${etiqueta ? etiqueta.texto.split('\n\n').map(p => `<p>${p}</p>`).join('\n') : ''}
</div>
`));

  // 02-inscripcion-reverso.html
  const inscripcion = docs.find(d => d.titulo.includes('Inscripción en el Reverso'));
  writeHTML('02-inscripcion-reverso.html', wrapHTML('Inscripción en el Reverso del Retrato', CARTA_CSS, `
<div class="carta-page">
  <h1>Inscripción en el Reverso del Retrato</h1>
  ${inscripcion ? inscripcion.texto.split('\n\n').map(p => `<p>${p}</p>`).join('\n') : ''}
  <div class="firma-bloque">
    <span class="firma-linea"></span>
    <span class="firma-nombre">Elena</span>
  </div>
</div>
`));

  // 02-diario-elena.html — 3 páginas
  const diarioPages = docs.filter(d => d.titulo.includes('Diario de la Abuela Elena'));
  writeHTML('02-diario-elena.html', wrapHTML('Diario de la Abuela Elena', DIARIO_CSS, `
<div class="diario-page">
  <h1>Diario de la Abuela Elena</h1>
  ${diarioPages.map((dp, i) => `
  <div class="entrada">
    ${dp.texto}
  </div>
  ${i < diarioPages.length - 1 ? '<hr style="border:none;border-top:1px solid #8b7355;margin:6mm 0;">' : ''}
  `).join('\n')}
</div>
`));

  // 02-reco-carta-navegacion.html
  const navP2 = docs.find(d => d.titulo.includes('Carta de Navegación') && d.titulo.includes('P2'));
  writeHTML('02-reco-carta-navegacion.html', wrapHTML('Carta de Navegación P2→P3', CARTA_CSS, `
<div class="carta-page">
  <h1>Carta de Navegación</h1>
  <p class="fecha-lugar">Prueba 2 → Prueba 3</p>
  <p style="font-style:italic;font-size:11pt;line-height:1.7;">${navP2 ? navP2.texto : ''}</p>
  <div class="firma-bloque">
    <span class="firma-linea"></span>
    <span class="firma-nombre">Abuela Elena</span>
  </div>
  <div class="sello-cera">E</div>
</div>
`));

  // 02-reco-fragmento-carta-elena.html
  const fragP2 = docs.find(d => d.titulo.includes('Fragmento de Carta de Elena') && d.titulo.includes('P2'));
  writeHTML('02-reco-fragmento-carta-elena.html', wrapHTML('Fragmento de Carta de Elena (P2)', CARTA_CSS, `
<div class="carta-page">
  <h1>Fragmento de Carta de Elena</h1>
  <p class="fecha-lugar">Prueba 2 — Empatía</p>
  ${fragP2 ? textToHTML(fragP2.texto) : ''}
  <div class="firma-bloque">
    <span class="firma-linea"></span>
    <span class="firma-nombre">Abuela Elena</span>
  </div>
  <div class="sello-cera">E</div>
</div>
`));
}

// ═══════════════════════════════════════════════════════════════════
// PRUEBA 3 — Las Voces que No se Muestran
// ═══════════════════════════════════════════════════════════════════
function generatePrueba3() {
  const p = pruebas[2];
  const docs = collectDocs(p);

  // 03-cartel-instruccion.html
  const instruccion = docs.find(d => d.titulo.includes('Instrucción del Álbum'));
  writeHTML('03-cartel-instruccion.html', wrapHTML('Prueba 3 — Instrucción del Álbum', CARTEL_CSS, `
<div class="cartel">
  <div class="cartel-border"></div>
  <h1>Prueba 3<br>Las Voces que No se Muestran</h1>
  <div class="instruccion">${instruccion ? instruccion.texto.split('\n').map(l => l.trim() ? `<p>${l}</p>` : '').join('\n') : ''}</div>
</div>
`));

  // 03-fotos-album.html — 6 fotos
  const fotos = docs.find(d => d.titulo.includes('Fotografías del Álbum'));
  const fotoLines = fotos ? fotos.texto.split('\n\n').filter(l => l.trim()) : [];
  writeHTML('03-fotos-album.html', wrapHTML('Prueba 3 — Fotografías del Álbum', TARJETA_CSS, `
<div class="tarjeta-page">
  <h1>Fotografías del Álbum</h1>
  <p style="margin-bottom:5mm;text-align:center;font-style:italic;color:#8b7355;">Cada foto tiene un sello plateado raspable. No raspéis hasta confirmar la pareja.</p>
  ${fotoLines.map((f, i) => {
    const isDistractor = f.includes('HOJA');
    const hasDigit = f.match(/DÍGITO (\d)/);
    const digit = hasDigit ? hasDigit[1] : '';
    const clean = f.replace(/\[FECHA: \d+\]/g, '').replace(/\[SELLO RASPABLE:.*?\]/g, '').trim();
    const yearMatch = f.match(/FECHA: (\d+)/);
    const year = yearMatch ? yearMatch[1] : '';
    return `<div class="tarjeta"${isDistractor ? ' style="border-style:dashed;"' : ''}>
    <div class="tarjeta-num">${year}</div>
    <div class="tarjeta-texto">${clean}</div>
    ${isDistractor ? '<div class="sello-raspable">SELLO RASPABLE → HOJA «Sigue buscando»</div>' : `<div class="sello-raspable">SELLO RASPABLE → DÍGITO <span class="sello-contenido">${digit}</span></div>`}
  </div>`;
  }).join('\n  ')}
</div>
`));

  // 03-tarjetas-recuerdo.html — 4 tarjetas
  const recuerdos = docs.find(d => d.titulo.includes('Tarjetas Recuerdo'));
  const recuerdoLines = recuerdos ? recuerdos.texto.split('\n\n').filter(l => l.trim()) : [];
  writeHTML('03-tarjetas-recuerdo.html', wrapHTML('Prueba 3 — Tarjetas de Recuerdo', TARJETA_CSS, `
<div class="tarjeta-page">
  <h1>Tarjetas de Recuerdo</h1>
  <p style="margin-bottom:5mm;text-align:center;font-style:italic;color:#8b7355;">Lo que Elena recordó — Iniciales: M-R-A-O (AMOR)</p>
  ${recuerdoLines.map((r, i) => {
    const m = r.match(/^(\w) — (.*)/s);
    const initial = m ? m[1] : '';
    const text = m ? m[2] : r;
    return `<div class="tarjeta">
    <div class="tarjeta-num">${initial}</div>
    <div class="tarjeta-texto">${text.trim()}</div>
  </div>`;
  }).join('\n  ')}
</div>
`));

  // 03-reco-carta-navegacion.html
  const navP3 = docs.find(d => d.titulo.includes('Carta de Navegación') && d.titulo.includes('P3'));
  writeHTML('03-reco-carta-navegacion.html', wrapHTML('Carta de Navegación P3→P4', CARTA_CSS, `
<div class="carta-page">
  <h1>Carta de Navegación</h1>
  <p class="fecha-lugar">Prueba 3 → Prueba 4</p>
  <p style="font-style:italic;font-size:11pt;line-height:1.7;">${navP3 ? navP3.texto : ''}</p>
  <div class="firma-bloque">
    <span class="firma-linea"></span>
    <span class="firma-nombre">Abuela Elena</span>
  </div>
  <div class="sello-cera">E</div>
</div>
`));

  // 03-reco-fragmento-carta-elena.html
  const fragP3 = docs.find(d => d.titulo.includes('Fragmento de Carta de Elena') && d.titulo.includes('P3'));
  writeHTML('03-reco-fragmento-carta-elena.html', wrapHTML('Fragmento de Carta de Elena (P3)', CARTA_CSS, `
<div class="carta-page">
  <h1>Fragmento de Carta de Elena</h1>
  <p class="fecha-lugar">Prueba 3 — Generosidad</p>
  ${fragP3 ? textToHTML(fragP3.texto) : ''}
  <div class="firma-bloque">
    <span class="firma-linea"></span>
    <span class="firma-nombre">Abuela Elena</span>
  </div>
  <div class="sello-cera">E</div>
</div>
`));
}

// ═══════════════════════════════════════════════════════════════════
// PRUEBA 4 — El Árbol que Faltaba
// ═══════════════════════════════════════════════════════════════════
function generatePrueba4() {
  const p = pruebas[3];
  const docs = collectDocs(p);

  // 04-cartel-instruccion.html
  const instruccion = docs.find(d => d.titulo.includes('Instrucción del Póster'));
  writeHTML('04-cartel-instruccion.html', wrapHTML('Prueba 4 — Instrucción del Árbol', CARTEL_CSS, `
<div class="cartel">
  <div class="cartel-border"></div>
  <h1>Prueba 4<br>El Árbol que Faltaba</h1>
  <div class="instruccion">${instruccion ? instruccion.texto.split('\n').map(l => l.trim() ? `<p>${l}</p>` : '').join('\n') : ''}</div>
</div>
`));

  // 04-tablero.html — Huecos del árbol genealógico
  const huecos = docs.find(d => d.titulo.includes('Pistas de los Huecos'));
  const huecoLines = huecos ? huecos.texto.split('\n\n').filter(l => l.trim()) : [];
  writeHTML('04-tablero.html', wrapHTML('Prueba 4 — Árbol Genealógico', TABLERO_CSS, `
<div class="tablero-page">
  <h1>Árbol Genealógico — Huecos</h1>
  <p>Cada hueco tiene una pista y muestra una LETRA con Luna (①-⑥) o una HOJA. Las letras en orden de Luna forman el código.</p>
  <table class="data">
    <thead><tr><th>Hueco</th><th>Pista</th><th>Contenido</th></tr></thead>
    <tbody>
      ${huecoLines.map((h, i) => {
        const m = h.match(/^Hueco (\d+)(\s*\(★\))?:\s*(.*?)\s*\[(.*?)\]/s);
        if (!m) return '';
        const num = m[1];
        const star = m[2] ? ' ★' : '';
        const pista = m[3];
        const content = m[4];
        const isLetter = content.match(/[①-⑥]/);
        return `<tr${star ? ' style="background:#f5e6c8;"' : ''}>
          <td style="text-align:center;font-weight:700;">${num}${star}</td>
          <td>${pista}</td>
          <td style="font-weight:700;${isLetter ? 'color:#8b4513;' : 'color:#8b7355;'}">${content}</td>
        </tr>`;
      }).filter(Boolean).join('\n      ')}
    </tbody>
  </table>
  <p style="margin-top:5mm;">Las 6 letras en orden de Luna: <span class="destacado">①A ②L ③V ④A ⑤R ⑥O = ALVARO</span></p>
</div>
`));

  // 04-tarjetas-hojas-arbol.html — 10 tarjetas sin nombres
  const tarjetas = docs.find(d => d.titulo.includes('Tarjetas-Hoja'));
  const tarjLines = tarjetas ? tarjetas.texto.split('\n\n').filter(l => l.trim()) : [];
  writeHTML('04-tarjetas-hojas-arbol.html', wrapHTML('Prueba 4 — Tarjetas del Árbol', TARJETA_CSS, `
<div class="tarjeta-page">
  <h1>Tarjetas del Árbol Genealógico</h1>
  <p style="margin-bottom:5mm;text-align:center;font-style:italic;color:#8b7355;">SIN NOMBRES — Solo descripciones. Emparejad con los huecos del póster.</p>
  ${tarjLines.map((t, i) => {
    const m = t.match(/^Tarjeta (\d+)(\s*\(★\))?:\s*(.*)/s);
    if (!m) return '';
    const num = m[1];
    const star = m[2] ? ' ★' : '';
    const text = m[3];
    return `<div class="tarjeta"${star ? ' style="border-color:#8b4513;"' : ''}>
    <div class="tarjeta-num">T${num}${star}</div>
    <div class="tarjeta-texto">${text.trim()}</div>
  </div>`;
  }).filter(Boolean).join('\n  ')}
</div>
`));

  // 04-reco-certificado-adopcion.html
  const certificado = docs.find(d => d.titulo.includes('Certificado de Adopción'));
  writeHTML('04-reco-certificado-adopcion.html', wrapHTML('Certificado de Adopción', CARTA_CSS, `
<div class="carta-page">
  <h1>Certificado de Adopción</h1>
  <p class="fecha-lugar">Documento reservado — Dentro del cryptex</p>
  ${certificado ? certificado.texto.split('\n\n').map(p => `<p>${p}</p>`).join('\n') : ''}
</div>
`));

  // 04-reco-carta-navegacion.html
  const navP4 = docs.find(d => d.titulo.includes('Carta de Navegación') && d.titulo.includes('P4'));
  writeHTML('04-reco-carta-navegacion.html', wrapHTML('Carta de Navegación P4→P5', CARTA_CSS, `
<div class="carta-page">
  <h1>Nota Urgente</h1>
  <p class="fecha-lugar">Prueba 4 → Prueba 5 — Desván</p>
  ${navP4 ? textToHTML(navP4.texto) : ''}
  <div class="firma-bloque">
    <span class="firma-linea"></span>
    <span class="firma-nombre">Abuela Elena</span>
  </div>
</div>
`));

  // 04-reco-fragmento-carta-elena.html
  const fragP4 = docs.find(d => d.titulo.includes('Fragmento de Carta de Elena') && d.titulo.includes('P4'));
  writeHTML('04-reco-fragmento-carta-elena.html', wrapHTML('Fragmento de Carta de Elena (P4)', CARTA_CSS, `
<div class="carta-page">
  <h1>Fragmento de Carta de Elena</h1>
  <p class="fecha-lugar">Prueba 4 — Amor</p>
  ${fragP4 ? textToHTML(fragP4.texto) : ''}
  <div class="firma-bloque">
    <span class="firma-linea"></span>
    <span class="firma-nombre">Abuela Elena</span>
  </div>
  <div class="sello-cera">E</div>
</div>
`));
}

// ═══════════════════════════════════════════════════════════════════
// PRUEBA 5 — El Mensaje Rasgado
// ═══════════════════════════════════════════════════════════════════
function generatePrueba5() {
  const p = pruebas[4];
  const docs = collectDocs(p);

  // 05-cartel-instruccion.html
  const instruccion = docs.find(d => d.titulo.includes('Tarjeta de Instrucciones'));
  writeHTML('05-cartel-instruccion.html', wrapHTML('Prueba 5 — Instrucción', CARTEL_CSS, `
<div class="cartel">
  <div class="cartel-border"></div>
  <h1>Prueba 5<br>El Mensaje Rasgado</h1>
  <div class="instruccion">${instruccion ? instruccion.texto.split('\n').map(l => l.trim() ? `<p>${l}</p>` : '').join('\n') : ''}</div>
</div>
`));

  // 05-fragmentos-carta-elena.html — 12 fragmentos
  const cartaRasgada = docs.find(d => d.titulo.includes('Carta Rasgada'));
  const fragLines = cartaRasgada ? cartaRasgada.texto.split('\n').filter(l => l.trim()) : [];
  writeHTML('05-fragmentos-carta-elena.html', wrapHTML('Prueba 5 — Fragmentos de Carta Rasgada', FRAGMENTO_CSS, `
<div class="fragmento-page">
  <h1>Fragmentos de Carta Rasgada</h1>
  <p style="margin-bottom:5mm;text-align:center;font-style:italic;color:#8b7355;">12 fragmentos con bordes irregulares. Encajad los bordes para reconstruir la carta.</p>
  ${fragLines.map((f, i) => {
    const m = f.match(/^Fragmento (\d+):\s*'(.*)'/);
    if (!m) return '';
    const num = m[1];
    const text = m[2];
    return `<div class="fragmento">
    <div class="frag-num">Fragmento ${num}</div>
    <div class="frag-texto">'${text}'</div>
  </div>`;
  }).filter(Boolean).join('\n  ')}
  <div style="margin-top:8mm; padding:4mm; border-top:2px solid #8b7355; position:relative; z-index:3;">
    <p style="font-size:9pt; color:#8b7355; font-style:italic;">Texto reconstruido: «Buscad bajo la tercera tabla del suelo del desván, contando desde la puerta de entrada. La que tiene una marca de cera roja en la esquina. Allí dejé lo que Rodrigo quiso destruir pero yo lo guardé para vosotros.»</p>
  </div>
</div>
`));
}

// ═══════════════════════════════════════════════════════════════════
// PRUEBA 6 — El Cofre del Legado
// ═══════════════════════════════════════════════════════════════════
function generatePrueba6() {
  const p = pruebas[5];
  const docs = collectDocs(p);

  // 06-cartel-instruccion.html — Cartel de Valores
  const valores = docs.find(d => d.titulo.includes('Cartel de Valores'));
  writeHTML('06-cartel-instruccion.html', wrapHTML('Prueba 6 — Cartel de Valores', CARTEL_CSS, `
<div class="cartel">
  <div class="cartel-border"></div>
  <h1>Prueba 6<br>El Cofre del Legado</h1>
  <div class="instruccion">
    ${valores ? valores.texto.split('\n').map(l => {
      if (l.includes('★')) return `<p><span class="hilo-accent">&#9733; ${l.replace('★', '').trim()}</span></p>`;
      if (l.trim()) return `<p>${l}</p>`;
      return '';
    }).join('\n') : ''}
  </div>
</div>
`));

  // 06-confesiones-elena.html
  const confesiones = docs.find(d => d.titulo.includes('Confesiones de Elena'));
  const confLines = confesiones ? confesiones.texto.split('\n\n').filter(l => l.trim()) : [];
  writeHTML('06-confesiones-elena.html', wrapHTML('Prueba 6 — Confesiones de Elena', CARTA_CSS, `
<div class="carta-page">
  <h1>Confesiones de Elena</h1>
  <p class="fecha-lugar">Seis frases numeradas I-VI — Junto al Cofre del Legado</p>
  ${confLines.map(c => {
    const m = c.match(/^([IVX]+)\.\s*(.*)/s);
    if (!m) return `<p>${c}</p>`;
    const roman = m[1];
    const text = m[2];
    const hasNumber = text.match(/^(Un|Dos|Tres|Cuatro|Cinco|Seis|Siete|Ocho|Nueve|Diez)/i);
    return `<div style="border-bottom: 1px dotted #8b7355; padding: 3mm 0; margin-bottom: 3mm; position: relative; z-index: 3;">
    <p style="font-weight:700; color:#3d2b1f;">${roman}.</p>
    <p${hasNumber ? ' style="color:#8b4513;font-weight:600;"' : ''}>${text}</p>
  </div>`;
  }).join('\n  ')}
</div>
`));

  // 06-instruccion-final.html
  const instFinal = docs.find(d => d.titulo === 'Instrucción Final');
  writeHTML('06-instruccion-final.html', wrapHTML('Prueba 6 — Instrucción Final', ETIQUETA_CSS, `
<div class="etiqueta-page">
  <h1>Instrucción Final</h1>
  ${instFinal ? instFinal.texto.split('\n').map(l => l.trim() ? `<p>${l}</p>` : '<br>').join('\n') : ''}
</div>
`));

  // 06-carta-despedida.html — Carta completa de Elena
  const cartaDespedida = docs.find(d => d.titulo.includes('Carta de Despedida'));
  writeHTML('06-carta-despedida.html', wrapHTML('Carta de Despedida de la Abuela Elena', CARTA_CSS, `
<div class="carta-page">
  <div class="mancha-cafe-1" style="position:absolute;top:25mm;right:18mm;width:16mm;height:13mm;background:radial-gradient(ellipse,rgba(139,90,43,0.10) 0%,rgba(139,90,43,0.05) 40%,transparent 78%);border-radius:50%;pointer-events:none;z-index:1;"></div>
  <div class="doblece-h" style="position:absolute;top:50%;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent 5%,rgba(139,115,85,0.15) 20%,rgba(139,115,85,0.18) 50%,rgba(139,115,85,0.15) 80%,transparent 95%);pointer-events:none;z-index:2;"></div>
  <div class="doblece-v" style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:linear-gradient(180deg,transparent 5%,rgba(139,115,85,0.12) 20%,rgba(139,115,85,0.15) 50%,rgba(139,115,85,0.12) 80%,transparent 95%);pointer-events:none;z-index:2;"></div>
  ${cartaDespedida ? cartaDespedida.texto : '<p>Mis queridos nietos:</p><p>Si estáis leyendo esta carta, significa que habéis seguido todos los hilos que dejé para vosotros.</p>'}
  <div class="firma-bloque">
    <span class="firma-linea"></span>
    <span class="firma-nombre">Abuela Elena</span>
    <span class="firma-fecha">Invierno de 2019</span>
  </div>
  <div class="sello-cera">E</div>
</div>
`));

  // 06-reco-mensaje-final.html
  const msgFinal = docs.find(d => d.titulo.includes('Mensaje de Recompensa Final'));
  writeHTML('06-reco-mensaje-final.html', wrapHTML('Mensaje de Recompensa Final', CARTA_CSS, `
<div class="carta-page">
  <h1>Mensaje Final</h1>
  <p style="font-size:12pt; font-style:italic; text-align:center; line-height:1.8; margin-top:15mm; position:relative; z-index:3;">
    ${msgFinal ? msgFinal.texto : ''}
  </p>
  <div class="sello-cera" style="position:absolute;bottom:30mm;right:50%;transform:translateX(50%) rotate(-8deg);">&#9731;</div>
</div>
`));
}

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════

console.log('\n🏛️  Generando materiales HTML para "El Legado de la Familia"\n');

console.log('📄 00-guia-completa-juego.html');
generateGuia();

console.log('\n📦 Prueba 1 — El Tablero de las Presencias');
generatePrueba1();

console.log('\n🖼️ Prueba 2 — El Retrato que Miente');
generatePrueba2();

console.log('\n📸 Prueba 3 — Las Voces que No se Muestran');
generatePrueba3();

console.log('\n🌳 Prueba 4 — El Árbol que Faltaba');
generatePrueba4();

console.log('\n✉️  Prueba 5 — El Mensaje Rasgado');
generatePrueba5();

console.log('\n🏆 Prueba 6 — El Cofre del Legado');
generatePrueba6();

// Count output files
const files = fs.readdirSync(HTML_DIR).filter(f => f.endsWith('.html'));
console.log(`\n✅ Generados ${files.length} archivos HTML en ${HTML_DIR}`);
console.log(`   Archivos: ${files.sort().join(', ')}\n`);
