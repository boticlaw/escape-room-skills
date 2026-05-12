#!/usr/bin/env python3
"""
escape-compact-pdf.py — Genera PDF compacto de un juego de escape room.
Uso: python3 escape-compact-pdf.py <game_dir>

Lee juego/juego.json + juego/pruebas/*.json y genera <game_dir>/game-compact.pdf
"""
import json, glob, os, subprocess, sys, re

def main():
    if len(sys.argv) < 2:
        print("Uso: python3 escape-compact-pdf.py <game_dir>")
        sys.exit(1)

    game_dir = os.path.abspath(sys.argv[1])
    pruebas_dir = os.path.join(game_dir, 'juego', 'pruebas')
    juego_path = os.path.join(game_dir, 'juego', 'juego.json')

    # Also accept game.json at root level
    if not os.path.exists(juego_path):
        juego_path = os.path.join(game_dir, 'game.json')
    if not os.path.exists(juego_path):
        print(f"Error: no encuentro juego.json en {game_dir}")
        sys.exit(1)

    juego = json.load(open(juego_path))

    # Load prueba JSONs
    pruebas = []
    for ref in juego.get('pruebas', []):
        fp = os.path.join(pruebas_dir, ref['archivo'])
        if os.path.exists(fp):
            pruebas.append(json.load(open(fp)))

    pal = {
        'primary': '#6c3483', 'dark': '#4a235a', 'light': '#d7bde2',
        'secondary': '#8e44ad', 'border': '#d7bde2', 'bgAlt': '#f9f0fc',
        'secondaryLight': '#f4ecf7'
    }
    # Override palette from game type if available
    tipo = juego.get('tipo', 'violeta')
    PALETTES = {
        'verde':  {'primary':'#1a7a3a','dark':'#0a3d1a','light':'#d4f0d8','secondary':'#5aad6e','border':'#b8e0c0','bgAlt':'#f4faf5','secondaryLight':'#f0f9f1'},
        'rojo':   {'primary':'#c0392b','dark':'#7b241c','light':'#f5b7b1','secondary':'#e74c3c','border':'#f5b7b1','bgAlt':'#fdf2f0','secondaryLight':'#fdedec'},
        'azul':   {'primary':'#2874a6','dark':'#1a5276','light':'#aed6f1','secondary':'#3498db','border':'#aed6f1','bgAlt':'#ebf5fb','secondaryLight':'#eaf2f8'},
        'violeta':{'primary':'#6c3483','dark':'#4a235a','light':'#d7bde2','secondary':'#8e44ad','border':'#d7bde2','bgAlt':'#f9f0fc','secondaryLight':'#f4ecf7'},
        'naranja':{'primary':'#ca6f1e','dark':'#7e5109','light':'#f5cba7','secondary':'#e67e22','border':'#f5cba7','bgAlt':'#fef9f0','secondaryLight':'#fef5e7'},
        'oscuro': {'primary':'#2c3e50','dark':'#1a252f','light':'#aeb6bf','secondary':'#5d6d7e','border':'#aeb6bf','bgAlt':'#f2f3f4','secondaryLight':'#eaecee'},
    }
    if tipo in PALETTES:
        pal = PALETTES[tipo]

    def esc(text):
        if not text: return ''
        return text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

    def solucion_compact(sol):
        if not sol: return ''
        html = '<div class="solution-box">'
        if sol.get('verificacion'):
            html += f'<p><strong>✅ Verificación:</strong> {sol["verificacion"]}</p>'
        if sol.get('pasos_detallados'):
            html += '<ol class="step-list">'
            for paso in sol['pasos_detallados']:
                html += f'<li>{paso}</li>'
            html += '</ol>'
        if sol.get('recompensa'):
            r = sol['recompensa']
            html += '<div class="reward-box">'
            parts = []
            if r.get('carta'): parts.append(r['carta'])
            if r.get('letra'): parts.append(f'Letra <strong>{r["letra"]}</strong>')
            html += ' — '.join(parts)
            if r.get('siguiente_espacio'):
                html += f'<br><em>Siguiente: {r["siguiente_espacio"]}</em>'
            html += '</div>'
        html += '</div>'
        return html

    def materiales_compact(prueba):
        mat = prueba.get('materiales', {})
        if not mat: return ''
        items = []
        if mat.get('impresion'):
            for m in mat['impresion']: items.append(('🖨️', m))
        if mat.get('mobiliario'):
            for m in mat['mobiliario']: items.append(('🪑', m))
        if mat.get('extras'):
            for m in mat['extras']: items.append(('🔧', m))
        b = prueba.get('barrera_fisica', {})
        if b.get('tipo'):
            items.append(('🔒', f'{b["tipo"]} — código: {b.get("codigo", "—")}'))
        if not items: return ''
        html = '<table class="mat-table"><tr><th></th><th>Material</th></tr>'
        for icon, item in items:
            html += f'<tr><td>{icon}</td><td>{item}</td></tr>'
        html += '</table>'
        return html

    def pistas_compact(pistas):
        if not pistas: return ''
        return ''.join(
            f'<div class="hint-box"><span class="hint-level l{p["nivel"]}">{p["nivel"]}</span>'
            f'<span class="hint-timing">{p["timing"]}</span>'
            f'<div class="hint-text">{p["texto"]}</div></div>'
            for p in pistas
        )

    def build_prueba_card(prueba, idx):
        num = idx + 1
        conf = prueba.get('configuracion', {})
        barrera = prueba.get('barrera_fisica', {})
        solucion = prueba.get('solucion', {})
        hilo = prueba.get('hilo_conductor', {})
        letter = hilo.get('letra', '?')
        meaning = hilo.get('significado', '')

        html = f'''<div class="proof-card">
    <div class="proof-header">
        <h3>P{num}. {prueba["nombre"]}</h3>
        <div>
            <span class="proof-badge">DIF {prueba.get("dificultad", "?")}/10</span>
            <span class="proof-badge">~{prueba.get("tiempo") or prueba.get("duracion_estimada_minutos", "?")} MIN</span>
            <span class="proof-badge letter-badge">{letter} = {meaning}</span>
        </div>
    </div>
    <div class="proof-body">'''

        meta_parts = []
        if prueba.get('ubicacion'): meta_parts.append(f'📍 {prueba["ubicacion"]}')
        if prueba.get('sala'): meta_parts.append(f'🏠 {prueba["sala"]}')
        if prueba.get('cooperacion_obligatoria'): meta_parts.append('🤝 Cooperación obligatoria')
        if meta_parts:
            html += f'<div class="meta-line">{" &nbsp;|&nbsp; ".join(meta_parts)}</div>'

        if barrera:
            html += '<div class="barrier-box">'
            html += f'<strong>🔒 Barrera:</strong> {barrera.get("tipo", "")}'
            if barrera.get('codigo'):
                html += f' &nbsp;→&nbsp; <span class="code-box">{barrera["codigo"]}</span>'
            if barrera.get('origen_codigo'):
                html += f'<br><em>Origen: {barrera["origen_codigo"]}</em>'
            html += '</div>'

        mecanica = conf.get('mecanica_principal', '')
        if mecanica:
            html += f'<div class="mech-box"><strong>⚙️ Mecánica:</strong> {mecanica}</div>'

        if solucion:
            html += solucion_compact(solucion)

        roles = conf.get('distribucion_roles', {})
        if roles:
            role_strs = [f'{r.replace("_", " ")}: {d}' for r, d in roles.items()]
            html += f'<div class="roles-box"><strong>👥 Roles:</strong> {" | ".join(role_strs)}</div>'

        ctrl = prueba.get('control_movimiento', {})
        if ctrl:
            sol_tipo = ctrl.get('tipo_solucion', '')
            problema = ctrl.get('problema_potencial', ctrl.get('descripcion', ''))
            if problema:
                short = problema.split('.')[0] + '.' if '.' in problema else problema[:150]
                html += f'<div class="anti-cheat"><strong>🛡️ Anti-trampa:</strong> {short}'
                if sol_tipo: html += f' <em>({sol_tipo})</em>'
                html += '</div>'

        pista_html = pistas_compact(prueba.get('pistas', []))
        if pista_html:
            html += f'<div class="hints-section"><strong>💡 Pistas</strong>{pista_html}</div>'

        mat_html = materiales_compact(prueba)
        if mat_html:
            html += f'<div class="mat-section"><strong>📦 Materiales</strong>{mat_html}</div>'

        html += '</div></div>'
        return html

    # ─── Build HTML ─────────────────────────────────────
    nombre = juego.get('nombre', 'Escape Room')
    subtitulo = juego.get('subtitulo', '')

    # Meta for cover
    meta = juego.get('meta', [])
    if not meta:
        meta = [
            {'label': 'Jugadores', 'value': f'{juego.get("jugadores_min", 2)}-{juego.get("jugadores_max", 6)}'},
            {'label': 'Duración', 'value': juego.get('duracion', '50 min')},
            {'label': 'Dificultad', 'value': juego.get('dificultad', 'Media')},
            {'label': 'Edad', 'value': juego.get('edad', '12+')},
            {'label': 'Presupuesto', 'value': juego.get('presupuesto', '~130€')},
        ]

    meta_html = '\n'.join(
        f'<div class="item"><div class="label">{m["label"]}</div><div class="value">{m["value"]}</div></div>'
        for m in meta
    )

    sinopsis = juego.get('sinopsis', juego.get('descripcion', ''))

    # Flow diagram
    flow_html = ''
    for i, p in enumerate(pruebas):
        hilo = p.get('hilo_conductor', {})
        letter = hilo.get('letra', '?')
        meaning = hilo.get('significado', '')
        flow_html += f'<div class="flow-step">P{i+1}<br><strong>{letter}</strong>={meaning}</div>'
        if i < len(pruebas) - 1:
            flow_html += '<span class="flow-arrow">→</span>'

    # Prueba cards
    pruebas_html = ''.join(build_prueba_card(p, i) for i, p in enumerate(pruebas))

    # Global materials table
    mat_rows = ''
    for i, p in enumerate(pruebas):
        b = p.get('barrera_fisica', {})
        mat = p.get('materiales', {})
        mat_key = ''
        if mat.get('mobiliario') and len(mat['mobiliario']) == 1:
            mat_key = mat['mobiliario'][0]
        elif mat.get('mobiliario'):
            mat_key = f'{len(mat["mobiliario"])} muebles'
        elif mat.get('extras') and len(mat['extras']) == 1:
            mat_key = mat['extras'][0]
        elif mat.get('extras'):
            mat_key = f'{len(mat["extras"])} extras'
        mat_rows += f'<tr><td><strong>P{i+1}</strong></td><td>{b.get("tipo","—")}</td><td><span class="code-box code-box-sm">{b.get("codigo","—")}</span></td><td>{mat_key}</td></tr>'

    # Documents section
    docs_html = ''
    for i, p in enumerate(pruebas):
        docs = p.get('documentos_in_game', [])
        if docs:
            docs_html += f'<h3 class="docs-group-title">P{i+1}. {p.get("nombre", "")} ({len(docs)} docs)</h3>'
            for doc in docs:
                gm = f'<div class="gm-note">GM: {doc["gm_notas"]}</div>' if doc.get('gm_notas') else ''
                qty = f' (x{doc["cantidad"]})' if doc.get('cantidad') else ''
                text = doc.get('texto', '')
                is_long = len(text) > 400
                icon = '📖' if is_long else '📋'
                if is_long:
                    short = re.sub(r'<[^>]+>', ' ', text[:200]).strip()
                    if len(text) > 200: short += '...'
                    docs_html += f'<div class="doc-card"><div class="doc-header">{icon} {doc["titulo"]}{qty} <span class="doc-length">({len(text)} chars)</span></div><div class="doc-body"><em>Texto largo de ambientación.</em> {short}</div>{gm}</div>'
                else:
                    docs_html += f'<div class="doc-card"><div class="doc-header">{icon} {doc["titulo"]}{qty}</div><div class="doc-body">{text}</div>{gm}</div>'

    html = f'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>{esc(nombre)} — Libro Compacto</title>
<style>
  @page {{ size: A4; margin: 1.5cm 1.8cm; }}
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body {{
    font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-size: 9.5pt; line-height: 1.45; color: #2c2c2c;
  }}
  .cover {{
    page-break-after: always; height: 100vh;
    display: flex; flex-direction: column;
    justify-content: center; align-items: center; text-align: center;
    background: linear-gradient(160deg, {pal['light']} 0%, {pal['bgAlt']} 100%);
    padding: 2cm;
  }}
  .cover h1 {{ font-family: Georgia, serif; font-size: 28pt; color: {pal['dark']}; margin-bottom: 8px; }}
  .cover .subtitle {{ font-size: 13pt; font-style: italic; color: {pal['primary']}; margin-bottom: 24px; }}
  .cover-meta {{ display: grid; grid-template-columns: repeat(4, auto); gap: 12px 24px; justify-content: center; }}
  .cover-meta .item {{ text-align: center; }}
  .cover-meta .label {{ font-size: 7.5pt; text-transform: uppercase; letter-spacing: 1.2px; color: {pal['secondary']}; font-weight: 600; }}
  .cover-meta .value {{ font-size: 12pt; font-weight: 700; color: {pal['dark']}; margin-top: 2px; }}
  h2 {{
    font-family: Georgia, serif; font-size: 15pt; color: {pal['dark']};
    margin-top: 16px; margin-bottom: 8px; padding-bottom: 4px;
    border-bottom: 2px solid {pal['border']};
  }}
  h3 {{ font-size: 12pt; color: {pal['primary']}; margin: 0; }}
  .proof-header h3 {{ color: #fff; font-size: 13pt; }}
  .proof-card {{
    border: 1px solid {pal['border']}; border-radius: 6px;
    margin: 14px 0; page-break-inside: auto; overflow: hidden;
  }}
  .proof-header {{
    background: linear-gradient(135deg, {pal['primary']}, {pal['dark']});
    color: #fff; padding: 8px 14px;
    display: flex; justify-content: space-between; align-items: center;
  }}
  .proof-badge {{
    display: inline-block; background: rgba(255,255,255,0.2);
    padding: 2px 8px; border-radius: 10px; font-size: 7.5pt; font-weight: 600;
  }}
  .letter-badge {{ background: rgba(255,255,255,0.35); font-weight: 800; font-size: 8pt; }}
  .proof-body {{ padding: 10px 14px; }}
  .meta-line {{ font-size: 8.5pt; color: #666; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px dashed {pal['border']}; }}
  .barrier-box {{ background: #f0f4ff; border-left: 3px solid #4a6fa5; padding: 6px 10px; margin: 6px 0; font-size: 9pt; }}
  .mech-box {{ background: {pal['bgAlt']}; border-left: 3px solid {pal['primary']}; padding: 6px 10px; margin: 6px 0; font-size: 9pt; }}
  .roles-box {{ font-size: 8.5pt; color: #555; margin: 6px 0; padding: 4px 8px; background: #fafafa; border-radius: 4px; }}
  .anti-cheat {{ font-size: 8.5pt; color: #888; margin: 4px 0; }}
  .code-box {{
    display: inline-block; background: #fff; color: #1a0a24;
    border: 2px solid #000; padding: 2px 10px; border-radius: 4px;
    font-weight: 900; font-size: 12pt; letter-spacing: 2px;
  }}
  .code-box-sm {{ font-size: 10pt; padding: 1px 6px; letter-spacing: 1px; }}
  .solution-box {{ background: #e8f5e9; border: 1px solid #a5d6a7; padding: 8px 12px; margin: 6px 0; border-radius: 4px; }}
  .sol-label {{ font-size: 7.5pt; text-transform: uppercase; letter-spacing: 1px; color: #2e7d32; font-weight: 700; margin-bottom: 4px; }}
  ol.step-list {{ margin: 4px 0 4px 20px; font-size: 8.5pt; }}
  ol.step-list li {{ margin-bottom: 2px; page-break-inside: avoid; }}
  .reward-box {{ background: #fff3e0; border: 1px solid #ffcc80; padding: 4px 10px; margin: 6px 0; border-radius: 4px; font-size: 8.5pt; }}
  .hints-section {{ margin: 6px 0; }}
  .hint-box {{ background: #fff3f0; border: 1px solid #deb0a8; padding: 4px 10px; margin: 3px 0; border-radius: 4px; font-size: 8.5pt; }}
  .hint-level {{
    display: inline-block; background: #c0392b; color: #fff;
    width: 16px; height: 16px; border-radius: 50%; text-align: center;
    font-size: 8pt; font-weight: 700; line-height: 16px; margin-right: 4px;
  }}
  .hint-timing {{ font-size: 7.5pt; color: #999; font-style: italic; margin-left: 4px; }}
  .mat-section {{ margin: 6px 0; }}
  .mat-table {{ width: 100%; border-collapse: collapse; font-size: 8.5pt; margin-top: 4px; }}
  .mat-table th {{ background: {pal['primary']}; color: #fff; padding: 4px 8px; text-align: left; font-size: 7.5pt; text-transform: uppercase; }}
  .mat-table td {{ padding: 3px 8px; border-bottom: 1px solid #eee; }}
  .global-mat, .global-docs {{ width: 100%; border-collapse: collapse; font-size: 8.5pt; margin-top: 6px; }}
  .global-mat th, .global-docs th {{ background: {pal['primary']}; color: #fff; padding: 5px 8px; text-align: left; font-size: 7.5pt; text-transform: uppercase; }}
  .global-mat td, .global-docs td {{ padding: 4px 8px; border-bottom: 1px solid #eee; vertical-align: top; }}
  .gm-col {{ font-size: 7.5pt; color: #888; font-style: italic; max-width: 250px; }}
  .page-break {{ page-break-before: always; }}
  .docs-group-title {{
    font-size: 11pt; color: {pal['dark']}; margin-top: 14px; margin-bottom: 4px;
    padding-bottom: 2px; border-bottom: 1px solid {pal['border']};
  }}
  .doc-intro {{ font-size: 8pt; color: #888; margin-bottom: 8px; }}
  .doc-card {{ border: 1px solid #e0d8a0; margin: 4px 0; border-radius: 4px; overflow: hidden; }}
  .doc-header {{ background: #fffde6; padding: 3px 8px; font-size: 8pt; font-weight: 600; color: #6a5e10; }}
  .doc-body {{ padding: 4px 8px; font-size: 8pt; line-height: 1.4; }}
  .doc-body p {{ margin-bottom: 3px; }}
  .doc-length {{ font-size: 7pt; color: #aaa; font-weight: normal; }}
  .gm-note {{ background: #f5f5f5; padding: 2px 8px; font-size: 7.5pt; color: #888; font-style: italic; }}
  .compact-note {{ font-size: 7.5pt; color: #aaa; text-align: center; margin-top: 20px; }}
  .flow {{ display: flex; align-items: center; justify-content: center; gap: 6px; flex-wrap: wrap; margin: 8px 0; }}
  .flow-step {{
    background: {pal['bgAlt']}; border: 1px solid {pal['border']};
    padding: 4px 10px; border-radius: 12px; font-size: 8pt; font-weight: 600; text-align: center;
  }}
  .flow-arrow {{ color: {pal['primary']}; font-weight: 700; }}
</style>
</head>
<body>
<div class="cover">
  <h1>{esc(nombre)}</h1>
  <div class="subtitle">{esc(subtitulo)}</div>
  <div class="cover-meta">{meta_html}</div>
</div>

<h2>Sinopsis</h2><p>{esc(sinopsis)}</p>

<h2>Flujo del Juego</h2><div class="flow">{flow_html}</div>

<h2>Pruebas</h2>
{pruebas_html}

<div class="page-break"></div>
<h2>Lista de Compras Global</h2>
<table class="global-mat"><tr><th>P</th><th>Cerradura</th><th>Código</th><th>Material clave</th></tr>
{mat_rows}
</table>

<div class="page-break"></div>
<h2>Documentos In-Game (para imprimir)</h2>
<p class="doc-intro">📋 = texto completo &nbsp;|&nbsp; 📖 = ambientación (resumen)</p>
{docs_html}

<div class="compact-note">Versión compacta — información esencial sin repetición</div>
</body></html>'''

    # Write HTML
    html_path = os.path.join(game_dir, 'game-compact.html')
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'HTML compacto: {html_path}')

    # Generate PDF
    pdf_path = os.path.join(game_dir, 'game-compact.pdf')
    pdf_gen = os.path.expanduser('~/.openclaw/workspace/tools/pdf-generator.mjs')
    try:
        subprocess.run(['node', pdf_gen, html_path, '-o', pdf_path], check=True, capture_output=True, text=True)
        size = os.path.getsize(pdf_path)
        print(f'PDF compacto: {pdf_path} ({size/1024:.0f} KB)')
        return pdf_path
    except Exception as e:
        print(f'Error PDF compacto: {e}')
        return None

if __name__ == '__main__':
    main()
