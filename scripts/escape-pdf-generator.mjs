#!/usr/bin/env node
/**
 * escape-pdf-generator.mjs — Generates escape room PDFs from JSON game data
 *
 * Usage:
 *   node escape-pdf-generator.mjs <game.json> [--type pruebas|diseno] [--output path.pdf]
 *
 * The JSON game file should contain:
 *   nombre, subtitulo, version, fecha, tipo (paleta de colores),
 *   meta (jugadores, equipos, duracion, dificultad, edad, presupuesto),
 *   secciones: [ { titulo, contenido_html } ],
 *   pruebas: [ { nombre, simbolo, ubicacion, planta, mecanica, dificultad, tiempo,
 *                codigo, narrativa_html, pasos_html, documentos_html, recompensa_html,
 *                pistas: [{ nivel, timing, texto }],
 *                materiales_html, ingame_docs: [{ titulo, texto, cantidad, gm_notas }] } ]
 *
 * Output is HTML → processed by tools/pdf-generator.mjs → PDF
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { resolve, basename, dirname, join } from 'path';
import { execSync } from 'child_process';

// ─── Color Palettes ───────────────────────────────────────────────────────────
const PALETTES = {
  verde:  { primary: '#1a7a3a', dark: '#0a3d1a', light: '#d4f0d8', secondary: '#5aad6e', secondaryLight: '#f0f9f1', bgAlt: '#f4faf5', border: '#b8e0c0' },
  rojo:   { primary: '#c0392b', dark: '#7b241c', light: '#f5b7b1', secondary: '#e74c3c', secondaryLight: '#fdedec', bgAlt: '#fdf2f0', border: '#f5b7b1' },
  azul:   { primary: '#2874a6', dark: '#1a5276', light: '#aed6f1', secondary: '#3498db', secondaryLight: '#eaf2f8', bgAlt: '#ebf5fb', border: '#aed6f1' },
  violeta:{ primary: '#6c3483', dark: '#4a235a', light: '#d7bde2', secondary: '#8e44ad', secondaryLight: '#f4ecf7', bgAlt: '#f9f0fc', border: '#d7bde2' },
  naranja:{ primary: '#ca6f1e', dark: '#7e5109', light: '#f5cba7', secondary: '#e67e22', secondaryLight: '#fef5e7', bgAlt: '#fef9f0', border: '#f5cba7' },
  oscuro: { primary: '#2c3e50', dark: '#1a252f', light: '#aeb6bf', secondary: '#5d6d7e', secondaryLight: '#eaecee', bgAlt: '#f2f3f4', border: '#aeb6bf' },
};

// ─── CLI Args ─────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`Usage: node escape-pdf-generator.mjs <game.json> [--type pruebas|diseno] [--output path.pdf]

Types:
  pruebas  — Proof Book / Libro de Pruebas (default)
  diseno   — Design Document / Documento de Diseño

Examples:
  node escape-pdf-generator.mjs game.json
  node escape-pdf-generator.mjs game.json --type diseno
  node escape-pdf-generator.mjs game.json --output ./output.pdf
  node escape-pdf-generator.mjs game.json --skip-sync`);
  process.exit(0);
}

const jsonPath = resolve(args[0]);
const typeIdx = args.indexOf('--type');
const docType = typeIdx !== -1 && args[typeIdx + 1] ? args[typeIdx + 1] : 'pruebas';
const outIdx = args.indexOf('--output');
let outputPath = outIdx !== -1 ? resolve(args[outIdx + 1]) : null;

const skipSync = args.includes('--skip-sync');

if (!existsSync(jsonPath)) {
  console.error(`Error: ${jsonPath} not found`);
  process.exit(1);
}

// ─── Validate sync before generating ──────────────────────────────────────
if (!skipSync) {
  const gameDir = dirname(jsonPath);
  const scriptsDir = dirname(new URL(import.meta.url).pathname);
  const validatorScript = join(scriptsDir, 'validar-sincronizacion.sh');
  if (existsSync(validatorScript)) {
    console.log('🔍 Validando sincronización...');
    try {
      execSync(`bash "${validatorScript}"`, { cwd: gameDir, stdio: 'pipe' });
      console.log('✅ Sincronización OK');
    } catch (err) {
      console.error('❌ ERROR DE SINCRONIZACIÓN — Ejecuta manualmente para ver detalles:');
      console.error(`   bash "${validatorScript}"`);
      process.exit(1);
    }
  }

  // ─── Validate JSON schema ──────────────────────────────────────────────
  const schemaValidator = join(scriptsDir, 'validate-schema.sh');
  if (existsSync(schemaValidator)) {
    console.log('📋 Validando schemas JSON...');
    try {
      execSync(`bash "${schemaValidator}" "${jsonPath}"`, { stdio: 'pipe' });
      console.log('✅ Schema OK');
    } catch (err) {
      console.error('❌ ERROR DE SCHEMA — Ejecuta manualmente para ver detalles:');
      console.error(`   bash "${schemaValidator}" "${jsonPath}"`);
      process.exit(1);
    }
  }
}

// ─── Load Game Data ───────────────────────────────────────────────────────────
const game = JSON.parse(readFileSync(jsonPath, 'utf-8'));
const pal = PALETTES[game.tipo || 'verde'] || PALETTES.verde;

// ─── Load Individual Prueba JSONs (fuente de verdad) ────────────────────────
const pruebasDir = resolve(dirname(jsonPath), 'juego', 'pruebas');
const pruebasData = []; // full prueba objects from individual JSONs

if (existsSync(pruebasDir)) {
  for (const ref of (game.pruebas || [])) {
    const filePath = join(pruebasDir, ref.archivo);
    if (existsSync(filePath)) {
      try {
        const data = JSON.parse(readFileSync(filePath, 'utf-8'));
        if (data.documentos_in_game && (!data.ingame_docs || data.ingame_docs.length === 0)) {
          data.ingame_docs = data.documentos_in_game;
        }
        pruebasData.push({ data, filePath });
      } catch (e) {
        console.error(`⚠️  Error loading ${ref.archivo}: ${e.message}`);
      }
    } else {
      console.error(`⚠️  File not found: ${filePath}`);
    }
  }
  console.log(`📂 Loaded ${pruebasData.length} prueba JSONs (fuente de verdad)`);

  // ─── Auto-bump versions of pruebas on every PDF generation ──────────────
  let bumped = 0;
  for (const { data, filePath: fp } of pruebasData) {
    const v = parseInt(data.version) || 1;
    data.version = v + 1;
    writeFileSync(fp, JSON.stringify(data, null, 2) + '\n');
    bumped++;
  }
  if (bumped > 0) {
    console.log(`🔢 Auto-bumped version on ${bumped} prueba(s)`);
  }
} else {
  console.error(`⚠️  Pruebas directory not found: ${pruebasDir}`);
}

// Override game.pruebas with full data from individual JSONs
game.pruebas = pruebasData.map(p => p.data);

// ─── Build Cover Meta ─────────────────────────────────────────────────────────
function buildCoverMeta(meta) {
  if (!meta || !Array.isArray(meta)) {
    // Build from common fields
    const items = [];
    if (game.jugadores) items.push({ label: 'Jugadores', value: game.jugadores });
    if (game.equipos) items.push({ label: 'Equipos', value: game.equipos });
    if (game.duracion) items.push({ label: 'Duracion', value: game.duracion });
    if (game.dificultad) items.push({ label: 'Dificultad', value: game.dificultad });
    if (game.edad) items.push({ label: 'Edad', value: game.edad });
    if (game.presupuesto) items.push({ label: 'Presupuesto', value: game.presupuesto });
    meta = items;
  }
  return meta.map(m => `    <div class="cover-meta-item">
      <div class="label">${m.label}</div>
      <div class="value">${m.value}</div>
    </div>`).join('\n');
}

// ─── Build TOC ────────────────────────────────────────────────────────────────
function buildTOC(secciones) {
  const items = secciones.map(s => `<li>${s.titulo}</li>`).join('\n  ');
  return `<h2>Indice</h2>
<ul class="toc">
  ${items}
</ul>`;
}

// ─── Sanitize Doc Text ────────────────────────────────────────────────────────
const BOX_DRAWING_RE = /[╔╗╚╝║═╠╣╦╩╬─│┌┐└┘├┤┬┴┼]/;
const SEPARATOR_RE = /^[╠╬╬├┼]+[═─]+[╠╬╬┼├]+/;
const TOP_BOTTOM_RE = /^[╔╦╗╤┬┐]+[═─]+[╤╦╗┬┐]+/;

function boxDrawingToHtml(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const dataRows = lines.filter(l => !SEPARATOR_RE.test(l) && !TOP_BOTTOM_RE.test(l));
  if (dataRows.length === 0) return text;

  const tableRows = dataRows.map(l => {
    // Split by ║ or │, trim, remove leading/trailing box chars
    let cells = l.split(/[║│]/).map(c => c.trim().replace(/^[═╬╠╣╦╩─│┌┐└┘├┤┬┴┼]+|[═╬╠╣╦╩─│┌┐└┘├┤┬┴┼]+$/g, '').trim()).filter(c => c);
    return cells;
  });

  if (tableRows.length === 0) return text;
  const colCount = Math.max(...tableRows.map(r => r.length));
  if (colCount < 2) return text;

  let html = '<table>';
  tableRows.forEach((row, i) => {
    const tag = i === 0 ? 'th' : 'td';
    html += '<tr>' + row.map(c => `<${tag}>${c}</${tag}>`).join('') + '</tr>';
  });
  html += '</table>';
  return html;
}

function jsonArrayToHtml(text) {
  try {
    const arr = JSON.parse(text.trim());
    if (!Array.isArray(arr) || arr.length === 0 || typeof arr[0] !== 'object') return text;
    const keys = Object.keys(arr[0]);
    let html = '<table><tr>' + keys.map(k => `<th>${k}</th>`).join('') + '</tr>';
    for (const row of arr) {
      html += '<tr>' + keys.map(k => `<td>${row[k] ?? ''}</td>`).join('') + '</tr>';
    }
    html += '</table>';
    return html;
  } catch { return text; }
}

function sanitizeDocText(text) {
  if (!text || typeof text !== 'string') return text;
  // Already valid HTML with <table>? Leave alone
  if (/<table[\s>]/i.test(text) && /<\/table>/i.test(text)) return text;
  // Box-drawing detected → convert to HTML table
  if (BOX_DRAWING_RE.test(text)) return boxDrawingToHtml(text);
  // Embedded JSON array
  const trimmed = text.trim();
  if (/^\s*\[\s*\{/.test(trimmed)) return jsonArrayToHtml(trimmed);
  // Clean up extra whitespace
  return text.replace(/\s{3,}/g, ' ').trim();
}

// ─── Build Proof Card (Libro de Pruebas) ──────────────────────────────────────
function buildProofCard(prueba, idx) {
  const pistasHtml = prueba.pistas && prueba.pistas.length > 0 ? `
    <div class="proof-section">
      <div class="proof-section-title">Pistas del GM</div>
      ${prueba.pistas.map(p => `<div class="hint-box"><span class="hint-level l${p.nivel}">${p.nivel}</span><span class="hint-timing">${p.timing}</span><div class="hint-text">${p.texto}</div></div>`).join('\n')}
    </div>` : '';

  const materialesHtml = prueba.materiales_html ? `
    <div class="proof-section">
      <div class="proof-section-title">Materiales principales</div>
      <ul class="materials-list">
        ${prueba.materiales_html.split('\n').filter(Boolean).map(m => `<li>${m.trim()}</li>`).join('\n')}
      </ul>
    </div>` : '';

  // In-game docs now INSIDE the proof-card (no separate block)
  const ingameDocsHtml = prueba.ingame_docs && prueba.ingame_docs.length > 0 ? `
    <div class="proof-section">
      <div class="proof-section-title">Documentos In-Game</div>
      ${prueba.ingame_docs.map(doc => `
      <div class="ingame-doc">
        <div class="ingame-doc-header">
          <span>DOCUMENTO IN-GAME</span>
          ${doc.cantidad ? `<span class="doc-qty">x${doc.cantidad}</span>` : ''}
        </div>
        <div class="ingame-doc-body">
          <div class="doc-title">${doc.titulo}</div>
          <div class="doc-text">${sanitizeDocText(doc.texto)}</div>
          ${doc.gm_notas ? `<div class="doc-meta"><div class="gm-only">GM: ${doc.gm_notas}</div></div>` : ''}
        </div>
      </div>`).join('\n')}
    </div>` : '';

  return `
<div class="proof-card">
  <div class="proof-header">
    <h3>${idx + 1}. ${prueba.nombre}</h3>
    <div>
      <span class="proof-badge">DIFICULTAD ${prueba.dificultad || '?'}/10</span>
      <span class="proof-badge">~${prueba.tiempo || '?'} MIN</span>
      ${prueba.tipo_cierre ? `<span class="proof-badge">${prueba.tipo_cierre.toUpperCase()}</span>` : ''}
    </div>
  </div>
  <div class="proof-body">
    <div class="proof-meta">
      ${prueba.simbolo ? `<div class="proof-meta-item"><span class="sym">${String(idx + 1).padStart(2, '0')}</span> ${prueba.ubicacion || ''}</div>` : ''}
      ${prueba.planta ? `<div class="proof-meta-item">${prueba.planta}</div>` : ''}
      ${prueba.mecanica ? `<div class="proof-meta-item">${prueba.mecanica}</div>` : ''}
      ${prueba.codigo ? `<div class="proof-meta-item">Codigo: <span class="code-box">${prueba.codigo}</span></div>` : ''}
      ${prueba.sala ? `<div class="proof-meta-item">${prueba.sala}</div>` : ''}
      ${prueba.tema_educativo ? `<div class="proof-meta-item">${prueba.tema_educativo}</div>` : ''}
      ${prueba.duracion_estimada_minutos ? `<div class="proof-meta-item">${prueba.jugadores_min || ''}-${prueba.jugadores_max || ''} jugadores | ~${prueba.duracion_estimada_minutos} min</div>` : ''}
      ${prueba.cooperacion_obligatoria ? `<div class="proof-meta-item">Cooperacion obligatoria</div>` : ''}
    </div>

    ${prueba.narrativa_html ? `<div class="proof-section">
      <div class="proof-section-title">Narrativa</div>
      ${prueba.narrativa_html}
    </div>` : ''}

    ${prueba.descripcion ? `<div class="proof-section">
      <div class="proof-section-title">Descripcion</div>
      <p>${prueba.descripcion}</p>
    </div>` : ''}

    ${prueba.pasos_html ? `<div class="proof-section">
      <div class="proof-section-title">Mecanica — Paso a paso</div>
      ${prueba.pasos_html}
    </div>` : ''}

    ${buildConfiguracionHtml(prueba.configuracion)}
    ${buildRolesHtml(prueba.configuracion?.distribucion_roles)}
    ${buildControlMovimientoHtml(prueba.control_movimiento)}
    ${buildHiloConductorHtml(prueba.hilo_conductor)}
    ${buildBarreraHtml(prueba.barrera_fisica)}
    ${buildSolucionHtml(prueba.solucion)}
    ${buildMaterialesFisicosHtml(prueba, idx + 1)}

    ${prueba.documentos_html ? `<div class="proof-section">
      <div class="proof-section-title">Documentos del juego</div>
      ${prueba.documentos_html}
    </div>` : ''}

    ${prueba.recompensa_html ? `<div class="proof-section">
      <div class="proof-section-title">Recompensa</div>
      <div class="reward-box">
        ${prueba.recompensa_html}
      </div>
    </div>` : ''}

    ${pistasHtml}
    ${materialesHtml}
    ${ingameDocsHtml}
  </div>
</div>`;
}

// ─── Extra Detail Renderers ──────────────────────────────────────────────────

function buildConfiguracionHtml(config) {
  if (!config) return '';
  let html = '';
  if (config.mecanica_principal) {
    html += `<div class="proof-section"><div class="proof-section-title">Mecanica principal</div><p>${config.mecanica_principal}</p></div>`;
  }
  if (config.mecanismo_barrera) {
    html += `<div class="proof-section"><div class="proof-section-title">Mecanismo de barrera</div><p>${config.mecanismo_barrera}</p></div>`;
  }
  // Render phases (generic — no game-specific table columns)
  const phases = Object.keys(config).filter(k => k.startsWith('fase_'));
  for (const phaseKey of phases) {
    const phase = config[phaseKey];
    const phaseTitle = phaseKey.replace(/_/g, ' ').replace(/^fase /, 'Fase ');
    let phaseHtml = `<div class="proof-section"><div class="proof-section-title">${phaseTitle}</div>`;
    if (typeof phase === 'string') {
      phaseHtml += `<p>${phase}</p>`;
    } else {
      if (phase.descripcion) phaseHtml += `<p>${phase.descripcion}</p>`;
      if (phase.duracion_minutos) phaseHtml += `<p><em>Duracion: ~${phase.duracion_minutos} min</em></p>`;
      // Generic table renderer for arrays of objects
      if (phase.candidatos?.length) {
        phaseHtml += buildGenericTable(phase.candidatos);
      }
      if (phase.criterios?.length) {
        phaseHtml += buildGenericTable(phase.criterios);
      }
      if (phase.codigo_candado) {
        phaseHtml += `<p>Codigo candado: <span class="code-box code-box-sm">${phase.codigo_candado}</span></p>`;
      }
      if (phase.mecanismo_codigo) {
        phaseHtml += `<div class="setup-box"><div class="setup-box-title">Mecanismo del codigo</div>${phase.mecanismo_codigo}</div>`;
      }
      // Render any other sub-fields as key-value pairs
      const skipKeys = new Set(['descripcion', 'duracion_minutos', 'candidatos', 'criterios', 'codigo_candado', 'mecanismo_codigo']);
      for (const [key, val] of Object.entries(phase)) {
        if (skipKeys.has(key)) continue;
        if (Array.isArray(val) && val.length && typeof val[0] === 'object') {
          phaseHtml += buildGenericTable(val, key.replace(/_/g, ' '));
        } else if (Array.isArray(val)) {
          phaseHtml += `<ul class="materials-list">${val.map(v => `<li>${v}</li>`).join('')}</ul>`;
        } else if (typeof val === 'object' && val !== null) {
          phaseHtml += buildGenericTable([val], key.replace(/_/g, ' '));
        } else if (typeof val === 'string' && val) {
          phaseHtml += `<p><strong>${key.replace(/_/g, ' ')}:</strong> ${val}</p>`;
        }
      }
    }
    phaseHtml += `</div>`;
    html += phaseHtml;
  }
  return html;
}

// Generic table renderer — auto-detects columns from array of objects
function buildGenericTable(rows, caption) {
  if (!rows?.length) return '';
  const allKeys = new Set();
  for (const r of rows) Object.keys(r).forEach(k => allKeys.add(k));
  const cols = [...allKeys];
  let html = `<table>`;
  if (caption) html += `<caption><strong>${caption}</strong></caption>`;
  html += `<tr>${cols.map(c => `<th>${c.replace(/_/g, ' ')}</th>`).join('')}</tr>`;
  for (const row of rows) {
    html += `<tr>${cols.map(c => {
      const val = row[c];
      if (val === undefined || val === null) return '<td>—</td>';
      if (typeof val === 'object') return `<td>${JSON.stringify(val)}</td>`;
      return `<td>${val}</td>`;
    }).join('')}</tr>`;
  }
  html += `</table>`;
  return html;
}

function buildRolesHtml(roles) {
  if (!roles || typeof roles !== 'object') return '';
  let html = `<div class="proof-section"><div class="proof-section-title">Distribucion de roles</div><table><tr><th>Rol</th><th>Descripcion</th></tr>`;
  for (const [role, desc] of Object.entries(roles)) {
    html += `<tr><td><strong>${role.replace(/_/g, ' ')}</strong></td><td>${desc}</td></tr>`;
  }
  html += `</table></div>`;
  return html;
}

function buildControlMovimientoHtml(ctrl) {
  if (!ctrl) return '';
  let html = `<div class="proof-section"><div class="proof-section-title">Control de movimiento</div>`;
  if (typeof ctrl === 'string') {
    html += `<p>${ctrl}</p>`;
  } else if (typeof ctrl === 'object') {
    if (ctrl.descripcion) html += `<p>${ctrl.descripcion}</p>`;
    for (const [key, val] of Object.entries(ctrl)) {
      if (key === 'descripcion') continue;
      html += `<p><strong>${key.replace(/_/g, ' ')}:</strong> ${typeof val === 'object' ? JSON.stringify(val) : val}</p>`;
    }
  }
  html += `</div>`;
  return html;
}

function buildHiloConductorHtml(hilo) {
  if (!hilo) return '';
  let html = `<div class="proof-section"><div class="proof-section-title">Hilo conductor</div>`;
  html += `<table><tr><th>Letra</th><th>Significado</th><th>Posicion</th></tr>`;
  html += `<tr><td><span class="code-box code-box-sm">${hilo.letra || '?'}</span></td><td>${hilo.significado || ''}</td><td>${hilo.posicion || ''}</td></tr>`;
  html += `</table></div>`;
  return html;
}

function buildBarreraHtml(barrera) {
  if (!barrera) return '';
  let html = `<div class="proof-section"><div class="proof-section-title">Barrera fisica</div>`;
  html += `<table>`;
  const fields = { tipo: 'Tipo', ubicacion: 'Ubicacion', codigo: 'Codigo', origen_codigo: 'Origen del codigo', montaje_minutos: 'Montaje (min)' };
  for (const [key, label] of Object.entries(fields)) {
    if (barrera[key] !== undefined) {
      const val = key === 'codigo' ? `<span class="code-box code-box-sm">${barrera[key]}</span>` : barrera[key];
      html += `<tr><td>${label}</td><td>${val}</td></tr>`;
    }
  }
  html += `</table></div>`;
  return html;
}

function buildSolucionHtml(sol) {
  if (!sol) return '';
  let html = `<div class="proof-section"><div class="proof-section-title">Solucion completa</div>`;
  html += `<div class="solution-box"><div class="sol-label">Verificacion</div>${sol.verificacion || ''}</div>`;
  if (sol.descripcion) html += `<p>${sol.descripcion}</p>`;
  if (sol.pasos_detallados?.length) {
    html += `<ol class="step-list">`;
    for (const paso of sol.pasos_detallados) html += `<li>${paso}</li>`;
    html += `</ol>`;
  }
  if (sol.recompensa) {
    html += `<div class="reward-box"><strong>Recompensa:</strong> ${sol.recompensa.carta || ''}`;
    if (sol.recompensa.letra) html += ` — Letra <strong>${sol.recompensa.letra}</strong>`;
    if (sol.recompensa.nota_posicional) html += `<br><em>${sol.recompensa.nota_posicional}</em>`;
    if (sol.recompensa.siguiente_espacio) html += `<br><em>Siguiente: ${sol.recompensa.siguiente_espacio}</em>`;
    html += `</div>`;
  }
  html += `</div>`;
  return html;
}

function buildMaterialesFisicosHtml(detail, num) {
  if (!detail) return '';
  const mat = detail.materiales;
  if (!mat || typeof mat !== 'object') return '';

  // Check if there's anything to render
  const hasContent = mat.impresion?.length || mat.mobiliario?.length || mat.extras?.length || detail.barrera_fisica?.tipo;
  if (!hasContent) return '';

  let html = `<div class="proof-section"><div class="proof-section-title">Materiales a Crear</div>`;

  // --- IMPRESION ---
  if (mat.impresion?.length) {
    html += `<h4>A Imprimir</h4><div class="materials-detail-box">`;
    for (const item of mat.impresion) html += `<br>${item}`;
    html += `</div>`;
  }

  // --- MOBILIARIO ---
  if (mat.mobiliario?.length) {
    html += `<h4>Mobiliario</h4><ul class="materials-list">`;
    for (const item of mat.mobiliario) html += `<li>${item}</li>`;
    html += `</ul>`;
  }

  // --- EXTRAS (electronica, cerraduras, etc) ---
  const extraItems = mat.extras?.length ? [...mat.extras] : [];
  if (detail.barrera_fisica?.tipo) {
    extraItems.unshift(`${detail.barrera_fisica.tipo} (código: ${detail.barrera_fisica.codigo || '—'})`);
  }
  if (extraItems.length) {
    html += `<h4>Electrónica / Cerraduras / Extras</h4><ul class="materials-list">`;
    for (const item of extraItems) html += `<li>${item}</li>`;
    html += `</ul>`;
  }

  html += `</div>`;
  return html;
}

function buildMaterialesDetalleHtml(mat) {
  if (!mat) return '';
  let html = `<div class="proof-section"><div class="proof-section-title">Materiales detalle</div>`;
  const categories = { impresion: 'Impresion', mobiliario: 'Mobiliario', extras: 'Extras' };
  for (const [key, label] of Object.entries(categories)) {
    if (mat[key]?.length) {
      html += `<h4>${label}</h4><ul class="materials-list">`;
      for (const item of mat[key]) html += `<li>${item}</li>`;
      html += `</ul>`;
    }
  }
  html += `</div>`;
  return html;
}

function buildGlobalMaterialsSummary(pruebas) {
  if (!pruebas?.length) return '';
  const cats = { imprimir: [], mobiliario: [], electronica: [], cerraduras: [], extras: [], senalizacion: [] };
  const seen = new Set();

  for (const p of pruebas) {
    const d = p;
    if (!d) continue;
    const mat = d.materiales;
    const prefix = `P${pruebas.indexOf(p)+1}`;

    // Impresion
    if (mat?.impresion?.length) {
      for (const item of mat.impresion) {
        const key = item.toLowerCase();
        if (!seen.has(key)) { seen.add(key); cats.imprimir.push({ item, prueba: prefix }); }
      }
    }
    // Mobiliario
    if (mat?.mobiliario?.length) {
      for (const item of mat.mobiliario) {
        const key = item.toLowerCase();
        if (!seen.has(key)) { seen.add(key); cats.mobiliario.push({ item, prueba: prefix }); }
      }
    }
    // Barrera fisica (electronica/cerraduras)
    if (d.barrera_fisica?.tipo) {
      const b = d.barrera_fisica;
      const desc = `${b.tipo}${b.codigo && b.codigo !== '—' ? ` (código: ${b.codigo})` : ''}`;
      const key = desc.toLowerCase();
      if (!seen.has(key)) { seen.add(key); cats.cerraduras.push({ item: desc, prueba: prefix }); }
    }
    // Extras
    if (mat?.extras?.length) {
      for (const item of mat.extras) {
        const key = item.toLowerCase();
        // Separate tablets into electronica
        if (key.includes('tablet')) {
          if (!seen.has(key)) { seen.add(key); cats.electronica.push({ item, prueba: prefix }); }
        } else {
          if (!seen.has(key)) { seen.add(key); cats.extras.push({ item, prueba: prefix }); }
        }
      }
    }
  }

  // Remove empty categories
  for (const [k, v] of Object.entries(cats)) { if (v.length === 0) delete cats[k]; }

  const catLabels = {
    imprimir: 'A Imprimir', mobiliario: 'Mobiliario', electronica: 'Electrónica',
    cerraduras: 'Cerraduras y Códigos', extras: 'Otros Materiales', senalizacion: 'Señalización'
  };

  let html = '<table><tr><th>Categoría</th><th>Material</th><th>Prueba</th><th>Listo</th></tr>';
  for (const [cat, items] of Object.entries(cats)) {
    items.forEach((entry, i) => {
      const catCell = i === 0 ? `<td rowspan="${items.length}"><strong>${catLabels[cat] || cat}</strong></td>` : '';
      html += `<tr>${catCell}<td>${entry.item}</td><td>${entry.prueba}</td><td>☐</td></tr>`;
    });
  }
  html += '</table>';

  // Codigos resumen
  const codigos = pruebas.filter(p => p.barrera_fisica?.codigo && p.barrera_fisica.codigo !== '—')
    .map((p, i) => `P${i+1}: ${p.barrera_fisica.codigo}`);
  if (codigos.length) {
    html += `<div class="setup-box"><div class="setup-box-title">Resumen de Códigos</div>${codigos.join(' &nbsp;|&nbsp; ')}</div>`;
  }

  return html;
}

// ─── Build Content ────────────────────────────────────────────────────────────
function buildContent(game, docType) {
  let html = '';

  // Extra sections (intro, sinopsis, etc.)
  if (game.secciones) {
    html += game.secciones.map(s => {
      const content = s.contenido_html || s.contenido || '';
      return `<h2>${s.titulo}</h2>\n${content}`;
    }).join('\n\n');
  }

  // Proof cards (only for "pruebas" type)
  if (docType === 'pruebas' && game.pruebas && game.pruebas.length > 0) {
    html += `<h2>Pruebas</h2>\n`;
    html += game.pruebas.map((p, i) => buildProofCard(p, i)).join('\n');
  }

  // Checklist (only for "pruebas" type)
  if (docType === 'pruebas') {
    const checklistHtml = game.checklist_html || (game.pruebas ? buildChecklist(game.pruebas) : null);
    if (checklistHtml) {
      html += `<h2 class="page-break">Checklist de Impresion</h2>\n${checklistHtml}`;
    }

    // Global materials summary
    const globalSummaryHtml = buildGlobalMaterialsSummary(game.pruebas);
    if (globalSummaryHtml) {
      html += `<h2 style="margin-top:2em">Lista de Compras y Montaje Global</h2>\n${globalSummaryHtml}`;
    }
  }

  // Extra trailing sections
  if (game.secciones_final) {
    html += game.secciones_final.map(s => {
      const content = s.contenido_html || s.contenido || '';
      return `<h2 class="page-break">${s.titulo}</h2>\n${content}`;
    }).join('\n\n');
  }

  return html;
}

// ─── Auto Checklist Builder ──────────────────────────────────────────────────
const CATEGORIAS = [
  { nombre: 'Cierres', keywords: ['cryptex', 'candado', 'llave', 'cerradura'] },
  { nombre: 'Tablets/Electronica', keywords: ['tablet', 'app', 'soporte'] },
  { nombre: 'Cajas/Contenedores', keywords: ['caja', 'carpeta', 'sobre', 'contenedor'] },
  { nombre: 'Paneles', keywords: ['panel', 'pizarra', 'mural'] },
  { nombre: 'Tarjetas/Fichas', keywords: ['tarjeta', 'ficha', 'carta'] },
  { nombre: 'Documentos impresos', keywords: ['documento', 'nota', 'instructivo', 'formulario', 'expediente'] },
  { nombre: 'Impresos gran formato', keywords: ['mapa', 'poster', 'póster', 'A2', 'A3', 'enciclopedia'] },
  { nombre: 'Varios', keywords: ['hilo', 'chincheta', 'boligrafo', 'lacar', 'lacre'] },
];

function classifyMaterial(text) {
  const lower = text.toLowerCase();
  for (const cat of CATEGORIAS) {
    if (cat.keywords.some(kw => lower.includes(kw))) return cat.nombre;
  }
  return 'Varios';
}

function buildChecklist(pruebas) {
  const counts = new Map(); // material -> count

  for (const p of pruebas) {
    if (!p.materiales_html) continue;
    // Split by bullet chars, newlines, or · separator
    const items = p.materiales_html.split(/[·•\n\r]+/).map(s => s.replace(/^\s*[\-•·]\s*/, '').trim()).filter(Boolean);
    for (const item of items) {
      // Remove leading quantity like "x2 " or "2x " or "2 "
      const cleaned = item.replace(/^\d+\s*x\s*/i, '').replace(/^x\d+\s*/i, '').trim();
      if (cleaned) counts.set(cleaned, (counts.get(cleaned) || 0) + 1);
    }
  }

  if (counts.size === 0) return null;

  // Group by category
  const groups = new Map();
  for (const cat of CATEGORIAS) groups.set(cat.nombre, []);
  for (const [material, qty] of counts) {
    const cat = classifyMaterial(material);
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat).push({ material, qty });
  }

  // Build HTML table
  let rows = '<tr><th style="text-align:left">Categoria</th><th>Material</th><th>Cant.</th><th>Listo</th></tr>';
  for (const [cat, items] of groups) {
    if (items.length === 0) continue;
    rows += `\n<tr><td rowspan="${items.length}"><strong>${cat}</strong></td><td>${items[0].material}</td><td>${items[0].qty}</td><td>☐</td></tr>`;
    for (let i = 1; i < items.length; i++) {
      rows += `\n<tr><td>${items[i].material}</td><td>${items[i].qty}</td><td>☐</td></tr>`;
    }
  }

  return `<table>${rows}\n</table>`;
}

// ─── Generate HTML ────────────────────────────────────────────────────────────
const templatePath = resolve(dirname(new URL(import.meta.url).pathname), '..', 'templates', 'escape-room-template.html');
let template;
try {
  template = readFileSync(templatePath, 'utf-8');
} catch {
  // Fallback: try workspace-relative path
  template = readFileSync(resolve(dirname(jsonPath), '../../agents/escapeitor/templates/escape-room-template.html'), 'utf-8');
}

const tipoLabel = docType === 'diseno' ? 'Documento de Diseno' : 'Libro de Pruebas';
const coverMetaHtml = buildCoverMeta(game.meta);
const secciones = [
  ...(game.secciones || []).map(s => s.titulo),
  ...(docType === 'pruebas' && game.pruebas ? game.pruebas.map((p, i) => `${i + 1}. ${p.nombre}`) : []),
];

// Template variable replacer — handles {{VAR}} and {{VAR|#default}} syntax
function replaceVar(template, name, value) {
  return template.replace(new RegExp(`\\{\\{${name}(?:\\|[^}]*)?\\}\\}`, 'g'), value);
}

let html = template;
html = replaceVar(html, 'NOMBRE', game.nombre || 'Escape Room');
html = replaceVar(html, 'SUBTITULO', game.subtitulo || '');
html = replaceVar(html, 'TIPO_DOCUMENTO', tipoLabel);
html = replaceVar(html, 'VERSION', game.version || '1.0');
html = replaceVar(html, 'FECHA', game.fecha || new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }));
html = replaceVar(html, 'COLOR_PRIMARIO', pal.primary);
html = replaceVar(html, 'COLOR_PRIMARIO_OSCURO', pal.dark);
html = replaceVar(html, 'COLOR_PRIMARIO_CLARO', pal.light);
html = replaceVar(html, 'COLOR_SECUNDARIO', pal.secondary);
html = replaceVar(html, 'COLOR_SECUNDARIO_CLARO', pal.secondaryLight);
html = replaceVar(html, 'COLOR_FONDO', pal.bgAlt);
html = replaceVar(html, 'COLOR_BORDE', pal.border);
html = replaceVar(html, 'COVER_META', coverMetaHtml);
html = replaceVar(html, 'TOC_SECTION', buildTOC(secciones));
html = replaceVar(html, 'CONTENT', buildContent(game, docType));

// Write HTML (for preview or direct use)
const htmlDir = dirname(jsonPath);
const htmlName = basename(jsonPath, '.json') + (docType === 'diseno' ? '-diseno' : '-pruebas') + '.html';
const htmlPath = outputPath ? outputPath.replace(/\.pdf$/, '.html') : resolve(htmlDir, htmlName);
writeFileSync(htmlPath, html, 'utf-8');
console.log(`HTML generated: ${htmlPath}`);

// Generate PDF via pdf-generator.mjs
const pdfGenPath = resolve(dirname(new URL(import.meta.url).pathname), '..', '..', '..', 'tools', 'pdf-generator.mjs');
const finalPdfPath = outputPath || resolve(htmlDir, htmlName.replace('.html', '.pdf'));

try {
  execSync(`node "${pdfGenPath}" "${htmlPath}" -o "${finalPdfPath}"`, { stdio: 'inherit' });
  console.log(`PDF generated: ${finalPdfPath}`);
} catch (err) {
  console.error(`PDF generation failed (HTML is ready at ${htmlPath}):`, err.message);
  process.exit(1);
}

// ─── Generate Compact PDF ────────────────────────────────────────────────────
const compactScript = resolve(dirname(new URL(import.meta.url).pathname), 'escape-compact-pdf.py');
if (existsSync(compactScript)) {
  console.log('\n📄 Generando PDF compacto...');
  try {
    execSync(`python3 "${compactScript}" "${htmlDir}"`, { stdio: 'inherit' });
  } catch (err) {
    console.error('⚠️  Error generando PDF compacto:', err.message);
  }
}
