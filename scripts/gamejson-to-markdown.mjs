#!/usr/bin/env node
// gamejson-to-markdown.mjs — Genera markdowns de diseño desde game.json
// <!-- AUTOGENERADO desde game.json — NO EDITAR MANUALMENTE -->

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';

const AUTO_HEADER = '<!-- AUTOGENERADO desde game.json — NO EDITAR MANUALMENTE -->\n\n';
const AUTO_PATTERN = /^<!-- AUTOGENERADO desde game\.json — NO EDITAR MANUALMENTE -->\n*/;

function parseArgs() {
  const args = process.argv.slice(2);
  let gamePath = null, outputDir = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output-dir' && args[i + 1]) outputDir = args[++i];
    else if (!args[i].startsWith('-')) gamePath = args[i];
  }
  if (!gamePath) { console.error('Uso: gamejson-to-markdown.mjs <game.json> [--output-dir dir]'); process.exit(1); }
  return { gamePath, outputDir };
}

function loadJSON(path) {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function stripHtml(html) {
  return html?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() || '';
}

function getMetaValue(meta, label) {
  return meta.find(m => m.label === label)?.value || '—';
}

function metaLine(meta) {
  const vals = meta.map(m => `${m.label}: ${m.value}`);
  return `- ${vals.join(' | ')}`;
}

// ── DISEÑO-JUEGO.md ──
function genDisenoJuego(game) {
  const { nombre, subtitulo, meta, pruebas } = game;
  const lines = [];
  lines.push(`# DISEÑO DEL JUEGO — ${nombre}`);
  lines.push(`*${subtitulo}*`);
  lines.push('');
  lines.push('## Meta');
  lines.push(metaLine(meta));
  lines.push('');

  // Tabla maestra
  lines.push('## Tabla Maestra');
  lines.push('| # | Prueba | Sala | Mecánica | Dificultad | Código | Cierre |');
  lines.push('|---|--------|------|----------|------------|--------|-------|');
  pruebas.forEach((p, i) => {
    lines.push(`| ${i + 1} | ${p.simbolo} ${p.nombre} | ${p.ubicacion} | ${p.mecanica} | ${p.dificultad}/10 | \`${p.codigo}\` | ${p.tipo_cierre} |`);
  });
  lines.push('');

  // Curva de dificultad
  lines.push('## Curva de Dificultad');
  lines.push(pruebas.map(p => `${p.dificultad}/10`).join(' → '));
  lines.push('');

  // Tiempos
  lines.push('## Distribución de Tiempos');
  lines.push('| # | Prueba | Tiempo estimado |');
  lines.push('|---|--------|----------------|');
  pruebas.forEach((p, i) => {
    lines.push(`| ${i + 1} | ${p.simbolo} ${p.nombre} | ~${p.tiempo} min |`);
  });
  const totalTiempo = pruebas.reduce((s, p) => s + p.tiempo, 0);
  lines.push(`| | **Total** | **~${totalTiempo} min** |`);
  lines.push('');

  // Distribución de cierres
  lines.push('## Distribución de Cierres');
  lines.push('| Prueba | Mecanismo | Código |');
  lines.push('|--------|-----------|--------|');
  pruebas.forEach(p => {
    lines.push(`| ${p.simbolo} ${p.nombre} | ${p.tipo_cierre} | \`${p.codigo}\` |`);
  });
  lines.push('');

  // Detalle por prueba
  lines.push('## Detalle por Prueba');
  pruebas.forEach((p, i) => {
    lines.push(`### ${i + 1}. ${p.simbolo} ${p.nombre}`);
    lines.push(`- **Ubicación:** ${p.ubicacion}`);
    lines.push(`- **Mecánica:** ${p.mecanica}`);
    lines.push(`- **Dificultad:** ${p.dificultad}/10 | **Tiempo:** ~${p.tiempo} min`);
    lines.push(`- **Cierre:** ${p.tipo_cierre} → \`${p.codigo}\``);
    lines.push(`- **Recompensa:** ${stripHtml(p.recompensa_html)}`);
    if (p.pistas?.length) {
      lines.push(`- **Pistas:** ${p.pistas.length} niveles (${p.pistas.map(x => `N${x.nivel}@${x.timing}`).join(', ')})`);
    }
    lines.push('');
  });

  return AUTO_HEADER + lines.join('\n');
}

// ── NARRATIVA.md ──
function genNarrativa(game) {
  const { nombre, subtitulo, secciones, pruebas } = game;
  const lines = [];
  lines.push(`# NARRATIVA — ${nombre}`);
  lines.push(`*${subtitulo}*`);
  lines.push('');

  // Secciones del game.json (sinopsis, personajes, flujo, código)
  secciones.forEach(s => {
    lines.push(`## ${s.titulo}`);
    lines.push(stripHtml(s.contenido_html));
    lines.push('');
  });

  // Narrativa por prueba
  lines.push('## Narrativa por Prueba');
  pruebas.forEach((p, i) => {
    lines.push(`### ${i + 1}. ${p.simbolo} ${p.nombre}`);
    lines.push(stripHtml(p.narrativa_html));
    lines.push('');
    if (p.ingame_docs?.length) {
      lines.push('**Documentos in-game:**');
      p.ingame_docs.forEach(doc => {
        lines.push(`- **${doc.titulo}** — ${doc.texto.split('\n')[0]}`);
      });
      lines.push('');
    }
  });

  // Hilo conductor
  lines.push('## Hilo Conductor');
  lines.push('Las 6 letras del código de apagado representan valores humanos que la IA no posee:');
  pruebas.forEach(p => {
    const match = stripHtml(p.recompensa_html).match(/Letra\s+\*?\*?([A-Z])/);
    const letra = match ? match[1] : '?';
    const concepto = stripHtml(p.recompensa_html).match(/\(([^)]+)\)/)?.[1] || '';
    lines.push(`- **${letra}** — ${concepto} (${p.nombre})`);
  });

  return AUTO_HEADER + lines.join('\n');
}

// ── PISTAS-GM.md ──
function genPistasGM(game) {
  const { nombre, pruebas } = game;
  const lines = [];
  lines.push(`# PISTAS PARA EL GM — ${nombre}`);
  lines.push('');
  lines.push('## Resumen de Pistas');
  lines.push('| Prueba | Niveles | Timing |');
  lines.push('|--------|---------|--------|');
  pruebas.forEach(p => {
    lines.push(`| ${p.simbolo} ${p.nombre} | ${p.pistas?.length || 0} | ${p.pistas?.map(x => `N${x.nivel}:${x.timing}`).join(', ') || '—'} |`);
  });
  lines.push('');

  lines.push('## Pistas Detalladas');
  pruebas.forEach((p, i) => {
    lines.push(`### ${i + 1}. ${p.simbolo} ${p.nombre}`);
    if (!p.pistas?.length) {
      lines.push('_Sin pistas definidas_');
    } else {
      p.pistas.forEach(pista => {
        lines.push(`#### Nivel ${pista.nivel} — ${pista.timing}`);
        lines.push(`> ${pista.texto}`);
        lines.push('');
      });
    }
    lines.push('');
  });

  return AUTO_HEADER + lines.join('\n');
}

// ── LOGISTICA.md ──
function genLogistica(game) {
  const { nombre, meta, pruebas } = game;
  const lines = [];
  lines.push(`# LOGÍSTICA — ${nombre}`);
  lines.push('');
  lines.push(metaLine(meta));
  lines.push('');

  // Materiales por sala
  lines.push('## Materiales por Prueba');
  pruebas.forEach((p, i) => {
    lines.push(`### ${i + 1}. ${p.simbolo} ${p.nombre} — ${p.ubicacion}`);
    lines.push(`- **Materiales:** ${stripHtml(p.materiales_html)}`);
    lines.push(`- **Documentos:** ${stripHtml(p.documentos_html)}`);
    lines.push('');
  });

  // Checklist de materiales
  lines.push('## Checklist de Materiales');
  lines.push(stripHtml(game.checklist_html));
  lines.push('');

  // Distribución de espacios
  lines.push('## Distribución de Espacios');
  const salas = [...new Set(pruebas.map(p => p.planta))];
  salas.forEach(sala => {
    const enSala = pruebas.filter(p => p.planta === sala);
    lines.push(`### ${sala}`);
    enSala.forEach(p => lines.push(`- ${p.simbolo} ${p.nombre} (${p.tipo_cierre})`));
    lines.push('');
  });

  return AUTO_HEADER + lines.join('\n');
}

// ── VALIDACION.md ──
function genValidacion(game) {
  const { nombre, pruebas } = game;
  const lines = [];
  lines.push(`# VALIDACIÓN — ${nombre}`);
  lines.push('');
  lines.push('## Checklist por Prueba');
  lines.push('');

  pruebas.forEach((p, i) => {
    lines.push(`### ${i + 1}. ${p.simbolo} ${p.nombre}`);
    lines.push('| Criterio | ✅ | Notas |');
    lines.push('|----------|---|-------|');
    lines.push(`| Código tiene origen lógico (no aleatorio) | ☐ | Código: \`${p.codigo}\` |`);
    lines.push(`| Doble descubrimiento: código + concepto educativo | ☐ | ${stripHtml(p.recompensa_html)} |`);
    lines.push(`| Pistas escalonadas (3 niveles) | ☐ | ${p.pistas?.length || 0} niveles definidos |`);
    lines.push(`| Tiempo estimado razonable (~${p.tiempo} min) | ☐ | |`);
    lines.push(`| Mecánica coherente con temática | ☐ | ${p.mecanica} |`);
    lines.push(`| Cierre físico claro | ☐ | ${p.tipo_cierre} |`);
    lines.push(`| Materiales listados | ☐ | |`);
    lines.push(`| Narrativa in-game consistente | ☐ | ${p.ingame_docs?.length || 0} documentos |`);
    lines.push('');
  });

  // Validación global
  lines.push('## Validación Global');
  lines.push('| Criterio | ✅ | Notas |');
  lines.push('|----------|---|-------|');
  const difficulties = pruebas.map(p => p.dificultad);
  const maxDiff = Math.max(...difficulties);
  const maxIdx = difficulties.indexOf(maxDiff);
  lines.push(`| Dificultad máxima al final (clímax) | ☐ | Máx: ${maxDiff}/10 en "${pruebas[maxIdx]?.nombre}" |`);
  lines.push(`| Curva progresiva (sin caídas bruscas) | ☐ | ${difficulties.join(' → ')} |`);
  lines.push(`| Tiempo total ≤ duración meta | ☐ | ~${pruebas.reduce((s, p) => s + p.tiempo, 0)} min |`);
  lines.push(`| Todas las pruebas tienen pistas | ☐ | ${pruebas.filter(p => p.pistas?.length).length}/${pruebas.length} |`);
  lines.push(`| Código final coherente con narrativa | ☐ | T·U·R·I·N·G |`);
  lines.push('| No hay pruebas relleno | ☐ | |');

  return AUTO_HEADER + lines.join('\n');
}

// ── GUIA-JUGADORES.md ──
function genGuiaJugadores(game) {
  const { nombre, subtitulo, meta, secciones, pruebas } = game;
  const lines = [];
  lines.push(`# GUÍA DE JUGADORES — ${nombre}`);
  lines.push(`*${subtitulo}*`);
  lines.push('');
  lines.push(metaLine(meta));
  lines.push('');

  // Sinopsis (sin spoilers)
  lines.push('## ¿Qué es esto?');
  const sinopsis = secciones.find(s => s.titulo.includes('Sinopsis'));
  if (sinopsis) lines.push(stripHtml(sinopsis.contenido_html));
  lines.push('');

  lines.push('## Vuestra Misión');
  lines.push('Superar **6 retos** para obtener las **6 letras del código de apagado** antes de que se acabe el tiempo. Cada reto os enseñará algo sobre los peligros y límites de la Inteligencia Artificial.');
  lines.push('');

  lines.push('## Salas');
  pruebas.forEach((p, i) => {
    lines.push(`### ${i + 1}. ${p.simbolo} ${p.nombre}`);
    lines.push(`- **Lugar:** ${p.ubicacion}`);
    lines.push(`- **Mecánica:** ${p.mecanica}`);
    lines.push(`- **Dificultad:** ${p.dificultad}/10`);
    // No mostrar código ni pasos detallados
  });
  lines.push('');

  lines.push('## Consejos');
  lines.push('- 🔍 **Leed todo** — Cada documento tiene información útil');
  lines.push('- 🤝 **Comunicad** — Compartid lo que encontráis con el equipo');
  lines.push('- ⏰ **Gestionad el tiempo** — No os quedéis atascados demasiado en una prueba');
  lines.push('- 💡 **Pedid pistas** — El GM os puede ayudar si estáis bloqueados');
  lines.push('- 🧠 **Pensad críticamente** — No todo lo que parece correcto lo es');

  return AUTO_HEADER + lines.join('\n');
}

// ── Main ──
function main() {
  const { gamePath, outputDir } = parseArgs();
  const absGamePath = resolve(gamePath);
  const game = loadJSON(absGamePath);

  const outDir = outputDir
    ? resolve(outputDir)
    : join(dirname(absGamePath), 'juego', 'diseño');

  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const generators = [
    ['DISEÑO-JUEGO.md', genDisenoJuego],
    ['NARRATIVA.md', genNarrativa],
    ['PISTAS-GM.md', genPistasGM],
    ['LOGISTICA.md', genLogistica],
    ['VALIDACION.md', genValidacion],
    ['GUIA-JUGADORES.md', genGuiaJugadores],
  ];

  for (const [filename, gen] of generators) {
    const filePath = join(outDir, filename);
    const content = gen(game);

    if (existsSync(filePath)) {
      const existing = readFileSync(filePath, 'utf-8');
      if (AUTO_PATTERN.test(existing)) {
        writeFileSync(filePath, content);
        console.log(`  ✅ ${filename} (sobrescrito)`);
      } else {
        console.log(`  ⏭️  ${filename} (tiene contenido manual, no sobrescrito)`);
      }
    } else {
      writeFileSync(filePath, content);
      console.log(`  🆕 ${filename} (creado)`);
    }
  }

  console.log(`\n✨ ${generators.length} markdowns generados en ${outDir}`);
}

main();
