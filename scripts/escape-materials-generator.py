#!/usr/bin/env python3
"""
Escape Room Materials Generator
Reads game JSON files and generates styled HTML documents + PDFs for print-ready game materials.

Usage: python3 escape-materials-generator.py <game_dir>
  game_dir must contain juego/juego.json and juego/pruebas/*.json

Output: <game_dir>/materiales/ with HTML and PDF files per category + unified index.
"""

import json
import os
import re
import sys
import subprocess
from pathlib import Path
from collections import OrderedDict

PDF_GENERATOR = "/home/daniel/.openclaw/workspace/tools/pdf-generator.mjs"

# ─── Category ordering ────────────────────────────────────────────────────────
CATEGORY_ORDER = [
    ("diario",    "01-diario"),
    ("carta",     "02-carta"),
    ("tarjeta",   "03-tarjeta"),
    ("etiqueta",  "04-etiqueta"),
    ("tablero",   "05-tablero"),
    ("cartel",    "06-cartel"),
    ("fragmento", "07-fragmento"),
]

# ─── Classification ───────────────────────────────────────────────────────────
def classify_document(titulo):
    """Classify a document by its title into a category."""
    t = titulo.lower()

    # Specific patterns first (order matters)
    if "diario" in t:
        return "diario"
    if "carta rasgada" in t:
        return "fragmento"
    if "fragmento" in t and "carta" in t:
        return "fragmento"
    if "carta de navegación" in t:
        return "etiqueta"
    if "carta de despedida" in t:
        return "carta"
    if "carta" in t and "navegación" in t:
        return "etiqueta"
    if "carta" in t and "fragmento" in t:
        return "carta"
    if "carta" in t:
        return "carta"
    if "tarjeta" in t:
        return "tarjeta"
    if "certificado" in t:
        return "tarjeta"
    if "tablero" in t or "plantilla" in t or "restricciones" in t or "eventos" in t:
        return "tablero"
    if "cartel" in t:
        return "cartel"
    if "instrucción" in t:
        return "cartel"
    if "inscripción" in t or "etiqueta" in t:
        return "etiqueta"
    if "consejo" in t or "testimonio" in t:
        return "etiqueta"
    if "pistas de los huecos" in t or "pistas de los huecos" in t:
        return "etiqueta"
    if "mensaje de recompensa" in t or "recompensa final" in t:
        return "etiqueta"
    if "tarjetas-hoja" in t or "tarjetas hoja" in t:
        return "tarjeta"
    if "huecos" in t:
        return "etiqueta"
    if "paso" in t and "tarjeta" in t:
        return "tarjeta"

    return "etiqueta"


# ─── Text Processing ──────────────────────────────────────────────────────────
def escape_html(text):
    """Escape HTML special chars but preserve existing HTML tags."""
    # If text contains HTML tags, return as-is
    if re.search(r'<[a-zA-Z/]', text):
        return text
    # Otherwise escape
    return (text
            .replace('&', '&amp;')
            .replace('<', '&lt;')
            .replace('>', '&gt;')
            .replace('"', '&quot;'))


def format_text(text):
    """Format document text, preserving HTML if present, converting newlines otherwise."""
    text = text.strip()
    if re.search(r'<[a-zA-Z/]', text):
        # Already has HTML tags — return as-is
        return text
    # Convert plain text: paragraphs from double newlines, <br> from single
    paragraphs = re.split(r'\n\n+', text)
    html_parts = []
    for p in paragraphs:
        p = p.strip()
        if not p:
            continue
        # Escape HTML in plain text
        p = (p
             .replace('&', '&amp;')
             .replace('<', '&lt;')
             .replace('>', '&gt;'))
        # Convert single newlines to <br>
        p = p.replace('\n', '<br>\n')
        html_parts.append(f'<p>{p}</p>')
    return '\n'.join(html_parts)


def extract_date_from_diary_title(titulo):
    """Extract a date string from a diary page title."""
    m = re.search(r'\(([^)]+)\)', titulo)
    return m.group(1) if m else ""


def extract_sender_from_letter(text):
    """Try to extract sender/date info from a letter's first lines."""
    lines = text.strip().split('\n')
    sender = ""
    date = ""
    for line in lines[:4]:
        line_s = line.strip()
        # Check for patterns like "Madrid, 1990" or "Querida mamá:"
        if re.match(r'^[A-Z][a-z]+,\s*\d{4}', line_s):
            date = line_s
        elif re.match(r'^(Querid[oa]|Mamá|Elena)', line_s, re.I):
            sender = line_s.rstrip(':')
    return sender, date


# ─── CSS Templates ────────────────────────────────────────────────────────────

GOOGLE_FONTS_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Georgia&family=Inter:wght@400;500;600;700&display=swap');"

COMMON_PRINT_CSS = """
@page {
  size: A4 portrait;
  margin: 0;
}
@media print {
  body { margin: 0; padding: 0; }
  .no-print { display: none; }
  .page-break { page-break-before: always; }
}
"""


def css_diario():
    return """
@page {
  size: A4 portrait;
  margin: 0;
}
body {
  width: 210mm;
  background-color: #f4e8c1;
  color: #3d2b1f;
  font-family: 'Caveat', cursive;
  font-size: 14pt;
  line-height: 1.8;
  padding: 0;
  margin: 0;
}
.diario-page {
  page-break-after: always;
  background-color: #f4e8c1;
  background-image:
    repeating-linear-gradient(
      transparent, transparent 31px, rgba(61,43,31,0.07) 31px, rgba(61,43,31,0.07) 32px
    );
  padding: 25mm 25mm 25mm 30mm;
  min-height: 297mm;
  margin: 0 auto;
  max-width: 180mm;
  box-shadow: 0 0 15px rgba(61,43,31,0.3), inset 0 0 30px rgba(139,115,85,0.15);
  clip-path: polygon(2% 1%, 98% 0%, 100% 98%, 1% 100%, 3% 50%);
  position: relative;
}
.diario-page + .diario-page {
  margin-top: 30px;
}
.diario-date {
  font-family: 'Caveat', cursive;
  font-size: 20pt;
  font-style: italic;
  color: #5c3d2e;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(93,61,46,0.3);
  padding-bottom: 10px;
}
.diario-text {
  text-align: justify;
  text-indent: 1.5em;
}
.diario-text p {
  margin-bottom: 10px;
  text-indent: 1.5em;
}
.diario-text p:first-child {
  text-indent: 0;
}
.diario-signature {
  text-align: right;
  font-style: italic;
  margin-top: 30px;
  color: #5c3d2e;
}
"""


def css_carta():
    return """
@page {
  size: A4 portrait;
  margin: 15mm;
}
body {
  background-color: #faf0e6;
  color: #4a3728;
  font-family: 'Georgia', serif;
  font-size: 12pt;
  line-height: 1.7;
  padding: 0;
  margin: 0;
}
.carta-page {
  background-color: #faf0e6;
  padding: 30px 40px;
  min-height: 85vh;
  margin: 0 auto 30px auto;
  max-width: 170mm;
  position: relative;
  border: 1px solid rgba(139,115,85,0.2);
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}
.carta-page.size-a5 {
  max-width: 140mm;
  min-height: 50vh;
  padding: 25px 30px;
}
/* Wax seal for Elena fragments */
.carta-page.has-seal::after {
  content: '';
  position: absolute;
  top: 15px;
  right: 20px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, #c0392b 0%, #922b21 60%, #641e16 100%);
  box-shadow: 2px 2px 5px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.2);
  opacity: 0.9;
}
.carta-header {
  text-align: right;
  margin-bottom: 20px;
  font-style: italic;
  color: #6b5344;
  font-size: 11pt;
}
.carta-body {
  text-align: justify;
}
.carta-body p {
  margin-bottom: 10px;
  text-indent: 1em;
}
.carta-body p:first-child {
  text-indent: 0;
}
.carta-farewell {
  margin-top: 25px;
  font-style: italic;
  text-align: right;
}
"""


def css_tarjeta():
    return """
@page {
  size: A4 portrait;
  margin: 10mm;
}
body {
  background-color: #fff;
  color: #333;
  font-family: 'Georgia', serif;
  font-size: 11pt;
  line-height: 1.5;
  padding: 0;
  margin: 0;
}
.tarjeta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 10px;
}
.tarjeta {
  background: #fdf5e6;
  border: 3px double #8b7355;
  border-radius: 4px;
  padding: 18px 15px;
  min-height: 7cm;
  max-height: 10cm;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}
.tarjeta-text {
  flex: 1;
  font-size: 10pt;
  color: #4a3728;
  text-align: center;
}
.tarjeta-text p {
  margin-bottom: 5px;
}
/* Scratchable stamp area */
.scratch-stamp {
  display: inline-block;
  background: linear-gradient(135deg, #d0d0d0 0%, #c0c0c0 40%, #b0b0b0 100%);
  color: #fff;
  font-weight: bold;
  font-size: 10pt;
  padding: 4px 12px;
  border: 1px solid #999;
  border-radius: 2px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 8px;
}
"""


def css_etiqueta():
    return """
@page {
  size: A4 portrait;
  margin: 8mm;
}
body {
  background-color: #fff;
  color: #333;
  font-family: 'Georgia', serif;
  font-size: 10pt;
  line-height: 1.4;
  padding: 0;
  margin: 0;
}
.etiqueta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 5px;
}
.etiqueta {
  background: #f5e6c8;
  border: 1px solid #c4a97d;
  border-radius: 3px;
  padding: 12px 10px;
  min-height: 5cm;
  max-height: 7.5cm;
  overflow: hidden;
  position: relative;
}
.etiqueta-text {
  font-size: 9pt;
  color: #4a3728;
}
.etiqueta-text p {
  margin-bottom: 4px;
}
"""


def css_tablero():
    return """
@page {
  size: A3 landscape;
  margin: 15mm;
}
body {
  background-color: #fefefe;
  color: #2c3e50;
  font-family: 'Inter', sans-serif;
  font-size: 12pt;
  line-height: 1.6;
  padding: 0;
  margin: 0;
}
.tablero-page {
  padding: 20px;
  margin-bottom: 30px;
}
.tablero-content {
  margin: 15px 0;
}
.tablero-content p {
  margin-bottom: 8px;
}
.tablero-table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
}
.tablero-table th, .tablero-table td {
  border: 2px solid #2c3e50;
  padding: 10px 14px;
  text-align: center;
  font-size: 14pt;
}
.tablero-table th {
  background: #2c3e50;
  color: white;
  font-size: 12pt;
}
.tablero-table td {
  font-size: 16pt;
  font-weight: 600;
}
"""


def css_cartel():
    return """
@page {
  size: A4 portrait;
  margin: 15mm;
}
body {
  background-color: #2c1810;
  color: #f5e6c8;
  font-family: 'Georgia', serif;
  font-size: 14pt;
  line-height: 1.6;
  padding: 0;
  margin: 0;
}
.cartel-page {
  background: linear-gradient(135deg, #2c1810 0%, #3d2b1f 100%);
  padding: 40px;
  min-height: 85vh;
  margin: 0 auto 30px auto;
  max-width: 180mm;
  border: 4px double #8b7355;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.cartel-text {
  font-size: 13pt;
  color: #e8d5b7;
  text-align: center;
  max-width: 90%;
}
.cartel-text p {
  margin-bottom: 12px;
}
.cartel-text strong {
  color: #f4e8c1;
}
"""


def css_fragmento():
    return """
@page {
  size: A4 portrait;
  margin: 10mm;
}
body {
  background-color: #f5f0e8;
  color: #3d2b1f;
  font-family: 'Caveat', cursive;
  font-size: 13pt;
  line-height: 1.5;
  padding: 0;
  margin: 0;
}
.fragmento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 15px;
}
.fragmento {
  background: #f4e8c1;
  padding: 15px 12px;
  min-height: 6cm;
  max-height: 8cm;
  overflow: hidden;
  position: relative;
  font-family: 'Caveat', cursive;
  color: #3d2b1f;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.15);
}
.fragmento-text {
  font-size: 12pt;
  font-style: italic;
}
"""


CSS_MAP = {
    "diario":    css_diario,
    "carta":     css_carta,
    "tarjeta":   css_tarjeta,
    "etiqueta":  css_etiqueta,
    "tablero":   css_tablero,
    "cartel":    css_cartel,
    "fragmento": css_fragmento,
}

# ─── Clip-path variations for fragments ───────────────────────────────────────
FRAGMENT_CLIP_PATHS = [
    "polygon(0% 2%, 97% 0%, 100% 95%, 3% 100%, 1% 50%)",
    "polygon(2% 0%, 100% 3%, 98% 100%, 0% 97%, 4% 40%)",
    "polygon(1% 1%, 98% 2%, 99% 98%, 2% 99%, 0% 45%)",
    "polygon(3% 0%, 99% 1%, 100% 97%, 1% 100%, 5% 55%)",
    "polygon(0% 3%, 96% 0%, 100% 96%, 4% 100%, 2% 48%)",
    "polygon(1% 0%, 100% 4%, 97% 100%, 0% 96%, 3% 42%)",
    "polygon(2% 1%, 99% 0%, 100% 98%, 1% 99%, 4% 52%)",
    "polygon(0% 0%, 97% 2%, 100% 97%, 3% 100%, 1% 47%)",
    "polygon(3% 2%, 100% 0%, 98% 99%, 0% 98%, 5% 50%)",
    "polygon(1% 3%, 98% 1%, 99% 97%, 2% 100%, 0% 45%)",
    "polygon(2% 0%, 99% 3%, 97% 100%, 0% 97%, 4% 53%)",
    "polygon(0% 1%, 96% 2%, 100% 98%, 3% 99%, 1% 46%)",
]

FRAGMENT_ROTATIONS = [-2, 1, -1, 2, -1.5, 0.5, 1.5, -0.5, -1, 2, -2, 0.5]


# ─── HTML Renderers per Category ─────────────────────────────────────────────

def is_diegectic_title(titulo):
    """Check if the document title should be shown to players (diegetic) or is just metadata."""
    # These are internal labels, not part of the game world
    non_diegetic = [
        'Instrucción', 'Carta de Navegación', 'Plantilla de Tabla',
        'Tarjeta de Pasos', 'Tarjeta de Instrucciones', 'Instrucción Final',
        'Pistas de los Huecos', 'Mensaje de Recompensa', 'Restricciones',
        'Consejo Familiar', 'Eventos del Tablero', 'Instrucción del Tablero',
    ]
    for nd in non_diegetic:
        if nd in titulo:
            return False
    # Diario pages: show date but not full title
    if 'Diario' in titulo:
        return False
    # Navigation cards: don't show title
    if 'Navegación' in titulo:
        return False
    # Fragment titles are metadata
    if 'Fragmento' in titulo and 'Carta' in titulo:
        return False
    # Tarjetas-Hoja, Tarjetas Momento/Recuerdo: titles are metadata
    if 'Tarjetas' in titulo and ('Momento' in titulo or 'Recuerdo' in titulo or 'Hoja' in titulo):
        return False
    # Certificado: YES show (it's an actual document)
    if 'Certificado' in titulo:
        return True
    # Cartas familiares: sender/date comes from text, not title
    if titulo.lower().startswith('carta') and any(y in titulo for y in ['1990','1992','1995','1996','1998','2000','2003','2005']):
        return False
    # Carta Rasgada: title is metadata
    if 'Rasgada' in titulo:
        return False
    # Default: show if it looks like a real in-game label
    return True


def render_diario(doc, idx):
    date = extract_date_from_diary_title(doc['titulo'])
    html = f'<div class="diario-page">\n'
    if date:
        html += f'  <div class="diario-date">{escape_html(date)}</div>\n'
    html += f'  <div class="diario-text">{format_text(doc["texto"])}< /div>\n'
    html += f'</div>\n'
    return html


def render_carta(doc, idx):
    is_fragmento_elena = "fragmento" in doc['titulo'].lower() and "elena" in doc['titulo'].lower()
    is_long = "despedida" in doc['titulo'].lower()
    is_letter = doc['titulo'].lower().startswith("carta")

    extra_class = ""
    if is_fragmento_elena:
        extra_class = " has-seal"
    if not is_long and is_letter:
        extra_class += " size-a5"

    sender, date_str = extract_sender_from_letter(doc['texto'])

    html = f'<div class="carta-page{extra_class}">\n'
    if sender or date_str:
        html += f'  <div class="carta-header">\n'
        if date_str:
            html += f'    {escape_html(date_str)}<br>\n'
        if sender:
            html += f'    {escape_html(sender)}\n'
        html += f'  </div>\n'
    html += f'  <div class="carta-body">{format_text(doc["texto"])}</div>\n'
    html += f'</div>\n'
    return html


def render_tarjeta(doc, idx):
    text_html = format_text(doc['texto'])

    # Check for scratchable stamps
    if "[SELLO RASPABLE" in doc['texto'] or "SELLO RASPABLE" in doc['texto']:
        # Split the text at stamp markers
        parts = re.split(r'\[SELLO RASPABLE[^:\]]*:\s*\d+\]', text_html)
        stamp_matches = re.findall(r'\[SELLO RASPABLE[^:\]]*:\s*(\d+)\]', doc['texto'])
        text_html = ""
        for i, part in enumerate(parts):
            text_html += part
            if i < len(stamp_matches):
                text_html += f'<div class="scratch-stamp">RASCAR</div>'

    html = f'<div class="tarjeta">\n'
    html += f'  <div class="tarjeta-text">{text_html}</div>\n'
    html += f'</div>\n'
    return html


def render_etiqueta(doc, idx):
    html = f'<div class="etiqueta">\n'
    html += f'  <div class="etiqueta-text">{format_text(doc["texto"])}</div>\n'
    html += f'</div>\n'
    return html


def render_tablero(doc, idx):
    # For the restriction table template, generate an actual table
    text_html = format_text(doc['texto'])

    html = f'<div class="tablero-page">\n'
    html += f'  <div class="tablero-content">{text_html}</div>\n'
    html += f'</div>\n'
    return html


def render_cartel(doc, idx):
    html = f'<div class="cartel-page">\n'
    html += f'  <div class="cartel-text">{format_text(doc["texto"])}</div>\n'
    html += f'</div>\n'
    return html


def render_fragmento(doc, idx):
    clip = FRAGMENT_CLIP_PATHS[idx % len(FRAGMENT_CLIP_PATHS)]
    rotation = FRAGMENT_ROTATIONS[idx % len(FRAGMENT_ROTATIONS)]

    html = f'<div class="fragmento" style="clip-path: {clip}; transform: rotate({rotation}deg);">\n'
    html += f'  <div class="fragmento-text">{format_text(doc["texto"])}</div>\n'
    html += f'</div>\n'
    return html


RENDER_MAP = {
    "diario":    render_diario,
    "carta":     render_carta,
    "tarjeta":   render_tarjeta,
    "etiqueta":  render_etiqueta,
    "tablero":   render_tablero,
    "cartel":    render_cartel,
    "fragmento": render_fragmento,
}

# Grid wrappers per category
GRID_WRAP = {
    "tarjeta":   ("tarjeta-grid", 2),    # 2 cols
    "etiqueta":  ("etiqueta-grid", 2),   # 2 cols
    "fragmento": ("fragmento-grid", 3),  # 3 cols
}


# ─── Main Logic ───────────────────────────────────────────────────────────────

def load_game(game_dir):
    """Load juego.json and all prueba JSON files."""
    juego_path = os.path.join(game_dir, "juego", "juego.json")
    pruebas_dir = os.path.join(game_dir, "juego", "pruebas")

    with open(juego_path, 'r', encoding='utf-8') as f:
        juego = json.load(f)

    pruebas = []
    if os.path.isdir(pruebas_dir):
        for fname in sorted(os.listdir(pruebas_dir)):
            if fname.endswith('.json'):
                with open(os.path.join(pruebas_dir, fname), 'r', encoding='utf-8') as f:
                    pruebas.append(json.load(f))

    return juego, pruebas


def collect_documents(juego, pruebas):
    """Collect all documentos_in_game from all pruebas, classify them."""
    docs = []
    seen_titles = set()

    for prueba in pruebas:
        source_docs = prueba.get("documentos_in_game", []) or prueba.get("ingame_docs", [])
        prueba_id = prueba.get("id", "unknown")
        prueba_nombre = prueba.get("nombre", "Unknown")

        for doc in source_docs:
            titulo = doc.get("titulo", "Sin título")
            if titulo in seen_titles:
                continue
            seen_titles.add(titulo)

            cat = classify_document(titulo)
            docs.append({
                "titulo": titulo,
                "texto": doc.get("texto", ""),
                "cantidad": doc.get("cantidad", 1),
                "categoria": cat,
                "prueba_id": prueba_id,
                "prueba_nombre": prueba_nombre,
            })

    return docs


def generate_category_html(category, cat_slug, docs, juego_nombre):
    """Generate a complete HTML file for one category."""
    css_fn = CSS_MAP.get(category, css_etiqueta)
    render_fn = RENDER_MAP.get(category, render_etiqueta)

    grid_info = GRID_WRAP.get(category)
    use_grid = grid_info is not None
    grid_class = grid_info[0] if grid_info else None
    grid_cols = grid_info[1] if grid_info else 1

    # Expand by cantidad
    expanded = []
    for doc in docs:
        count = doc.get("cantidad", 1)
        # For fragments with carta rasgada, generate individual fragments
        if category == "fragmento" and "fragmento" in doc["titulo"].lower() and count > 1:
            for i in range(count):
                frag_doc = dict(doc)
                frag_doc["titulo"] = f"Fragmento {i+1}"
                # Extract the partial text for this fragment
                frag_texts = re.findall(r"Fragmento\s+\d+:\s*'([^']*)'", doc["texto"])
                if frag_texts and i < len(frag_texts):
                    frag_doc["texto"] = frag_texts[i]
                else:
                    frag_doc["texto"] = doc["texto"]
                frag_doc["cantidad"] = 1
                expanded.append(frag_doc)
        else:
            for _ in range(count):
                expanded.append(doc)

    # Build HTML
    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>{category.title()}</title>
<style>
{GOOGLE_FONTS_IMPORT}

{css_fn()}
{COMMON_PRINT_CSS}
</style>
</head>
<body>
"""

    if use_grid:
        html += f'<div class="{grid_class}">\n'

    for idx, doc in enumerate(expanded):
        if category == "fragmento" and doc.get("cantidad", 1) <= 1 and "carta rasgada" in doc["titulo"].lower():
            # Already expanded above
            pass
        html += render_fn(doc, idx)

    if use_grid:
        html += '</div>\n'

    html += '</body>\n</html>\n'
    return html


def generate_index_html(juego_nombre, all_docs, categories_used):
    """Generate the index HTML with a summary of all documents."""
    html = f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>{escape_html(juego_nombre)} — Índice de Materiales</title>
{GOOGLE_FONTS_IMPORT}
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@page {{
  size: A4 portrait;
  margin: 15mm;
}}
body {{
  font-family: 'Inter', sans-serif;
  font-size: 11pt;
  line-height: 1.6;
  color: #2c3e50;
  padding: 20px;
  max-width: 180mm;
  margin: 0 auto;
}}
h1 {{
  font-size: 22pt;
  text-align: center;
  border-bottom: 3px solid #2c3e50;
  padding-bottom: 10px;
  margin-bottom: 5px;
}}
h2 {{
  font-size: 14pt;
  color: #2c3e50;
  margin-top: 25px;
  border-left: 4px solid #3498db;
  padding-left: 10px;
}}
.subtitle {{
  text-align: center;
  color: #7f8c8d;
  font-size: 13pt;
  margin-bottom: 30px;
}}
table {{
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0 20px 0;
  font-size: 10pt;
}}
th {{
  background: #2c3e50;
  color: white;
  padding: 8px 10px;
  text-align: left;
  font-size: 10pt;
}}
td {{
  padding: 6px 10px;
  border-bottom: 1px solid #e0e0e0;
}}
tr:nth-child(even) {{
  background: #f8f9fa;
}}
.cat-badge {{
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 9pt;
  font-weight: 600;
  text-transform: uppercase;
}}
.cat-diario    {{ background: #f4e8c1; color: #3d2b1f; }}
.cat-carta     {{ background: #faf0e6; color: #4a3728; }}
.cat-tarjeta   {{ background: #fdf5e6; color: #8b7355; }}
.cat-etiqueta  {{ background: #f5e6c8; color: #6b5344; }}
.cat-tablero   {{ background: #eaf2f8; color: #2c3e50; }}
.cat-cartel    {{ background: #2c1810; color: #f5e6c8; }}
.cat-fragmento {{ background: #f4e8c1; color: #3d2b1f; }}
.total {{
  text-align: center;
  font-size: 14pt;
  font-weight: bold;
  margin: 20px 0;
  padding: 15px;
  background: #eaf2f8;
  border: 2px solid #3498db;
  border-radius: 5px;
}}
</style>
</head>
<body>
<h1>{escape_html(juego_nombre)}</h1>
<p class="subtitle">Índice de Materiales para Impresión</p>
"""

    # Summary stats
    total_docs = sum(d.get("cantidad", 1) for d in all_docs)
    html += f'<div class="total">{len(all_docs)} documentos únicos · {total_docs} copias para imprimir · {len(categories_used)} categorías</div>\n'

    # Per-category sections
    for cat, cat_slug in CATEGORY_ORDER:
        cat_docs = [d for d in all_docs if d["categoria"] == cat]
        if not cat_docs:
            continue
        html += f'<h2>{cat.title()} ({len(cat_docs)} documentos)</h2>\n'
        html += f'<table>\n'
        html += f'<tr><th>Documento</th><th>Prueba</th><th>Copias</th></tr>\n'
        for doc in cat_docs:
            html += f'<tr><td>{escape_html(doc["titulo"])}</td>'
            html += f'<td>{escape_html(doc["prueba_nombre"])}</td>'
            html += f'<td style="text-align:center;">{doc.get("cantidad", 1)}</td></tr>\n'
        html += f'</table>\n'

    # Full listing
    html += '<h2>Listado Completo</h2>\n'
    html += '<table>\n'
    html += '<tr><th>#</th><th>Documento</th><th>Categoría</th><th>Prueba</th><th>Copias</th></tr>\n'
    for i, doc in enumerate(all_docs, 1):
        cat = doc["categoria"]
        html += f'<tr>'
        html += f'<td style="text-align:center;">{i}</td>'
        html += f'<td>{escape_html(doc["titulo"])}</td>'
        html += f'<td><span class="cat-badge cat-{cat}">{cat}</span></td>'
        html += f'<td>{escape_html(doc["prueba_nombre"])}</td>'
        html += f'<td style="text-align:center;">{doc.get("cantidad", 1)}</td>'
        html += f'</tr>\n'
    html += '</table>\n'

    html += '</body>\n</html>\n'
    return html


def html_to_pdf(html_path, pdf_path, extra_args=None):
    """Convert HTML to PDF using the pdf-generator tool."""
    cmd = ["node", PDF_GENERATOR, html_path, "-o", pdf_path]
    if extra_args:
        cmd.extend(extra_args)
    print(f"  Converting: {os.path.basename(html_path)} → {os.path.basename(pdf_path)}")
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    except subprocess.TimeoutExpired:
        print(f"  ⚠ Timeout converting {html_path}")
        return False
    if result.returncode != 0:
        print(f"  ⚠ Error converting {html_path}:")
        print(f"    {result.stderr[:500]}")
    return result.returncode == 0


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 escape-materials-generator.py <game_dir>")
        print("  game_dir must contain juego/juego.json and juego/pruebas/*.json")
        sys.exit(1)

    game_dir = os.path.abspath(sys.argv[1])
    if not os.path.isdir(game_dir):
        print(f"Error: {game_dir} is not a directory")
        sys.exit(1)

    output_dir = os.path.join(game_dir, "materiales")
    os.makedirs(output_dir, exist_ok=True)

    print(f"🎮 Escape Room Materials Generator")
    print(f"   Game dir: {game_dir}")
    print(f"   Output:   {output_dir}")
    print()

    # Load data
    juego, pruebas = load_game(game_dir)
    juego_nombre = juego.get("nombre", "Escape Room")
    print(f"📖 Loaded: {juego_nombre}")
    print(f"   {len(pruebas)} pruebas found")

    # Collect and classify documents
    all_docs = collect_documents(juego, pruebas)
    print(f"📄 {len(all_docs)} unique documents collected")

    # Show classification summary
    categories_used = OrderedDict()
    for cat, _ in CATEGORY_ORDER:
        cat_docs = [d for d in all_docs if d["categoria"] == cat]
        if cat_docs:
            categories_used[cat] = cat_docs

    for cat, docs in categories_used.items():
        total_copies = sum(d.get("cantidad", 1) for d in docs)
        print(f"   {cat:12s}: {len(docs):3d} docs, {total_copies:3d} copies")

    print()

    # Generate category HTMLs and PDFs
    generated_files = []
    for cat, cat_slug in CATEGORY_ORDER:
        if cat not in categories_used:
            continue

        cat_docs = categories_used[cat]
        html_filename = f"materiales-{cat_slug}.html"
        pdf_filename = f"materiales-{cat_slug}.pdf"
        html_path = os.path.join(output_dir, html_filename)
        pdf_path = os.path.join(output_dir, pdf_filename)

        print(f"📝 Generating {cat}...")
        html_content = generate_category_html(cat, cat_slug, cat_docs, juego_nombre)

        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f"  HTML: {html_path}")

        # Convert to PDF
        extra = []
        if cat == "tablero":
            extra.append("--landscape")
        success = html_to_pdf(html_path, pdf_path, extra)
        if success:
            generated_files.append(pdf_path)

    # Generate index
    print(f"\n📋 Generating index...")
    index_html = generate_index_html(juego_nombre, all_docs, categories_used)
    index_html_path = os.path.join(output_dir, "materiales-00-indice.html")
    index_pdf_path = os.path.join(output_dir, "materiales-00-indice.pdf")

    with open(index_html_path, 'w', encoding='utf-8') as f:
        f.write(index_html)
    print(f"  HTML: {index_html_path}")

    html_to_pdf(index_html_path, index_pdf_path)
    generated_files.insert(0, index_pdf_path)

    print(f"\n✅ Done! Generated {len(generated_files)} PDF files in {output_dir}/")
    for f in generated_files:
        size = os.path.getsize(f) if os.path.exists(f) else 0
        print(f"   {os.path.basename(f)} ({size:,} bytes)")


if __name__ == "__main__":
    main()
