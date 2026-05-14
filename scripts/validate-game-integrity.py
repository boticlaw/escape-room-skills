#!/usr/bin/env python3
"""Validador de integridad de juego a nivel GAME.

Valida consistencia cross-file entre juego.json y todos los JSON de prueba.
Detecta errores que los validadores por archivo individual no pueden ver:
desajustes de recompensas, gaps de navegación, resúmenes desactualizados,
y errores de copy-paste por reordenación.

Uso:
    python3 validate-game-integrity.py <juego.json>
    python3 validate-game-integrity.py <directorio>  # busca juego.json

Salida:
    - Código 0: sin CRITICAL
    - Código 1: al menos un CRITICAL
"""

import glob as glob_mod
import json
import math
import os
import re
import sys
from pathlib import Path


def load_json(filepath):
    """Carga un JSON y devuelve (data, error_msg)."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f), None
    except (json.JSONDecodeError, OSError) as e:
        return None, str(e)


def find_prueba_file(archivo, juego_dir):
    """Busca el archivo de prueba en ubicaciones estándar."""
    candidates = [
        juego_dir / "pruebas" / archivo,
        juego_dir / archivo,
        juego_dir / "juego" / "pruebas" / archivo,
        juego_dir / "juego" / archivo,
    ]
    for c in candidates:
        if c.is_file():
            return c
    return None


def strip_accents(text):
    """Elimina tildes para comparación flexible (á→a, é→e, etc.)."""
    replacements = "áàéèíìóòúùüñ"
    targets =     "aaeeiioouuun"
    for r, t in zip(replacements, targets):
        text = text.replace(r, t).replace(r.upper(), t.upper())
    return text


def extract_code_from_text(text):
    """Extrae secuencias de dígitos de un texto, devuelve lista de strings."""
    if not text:
        return []
    return re.findall(r'\b(\d{2,})\b', text)


def extract_word_from_hilo(hilo_text):
    """Extrae la palabra objetivo del hilo_conductor de juego.json.

    Busca la primera palabra mayúscula antes de un separador (— o -).
    Ejemplo: 'LEGADO — cada letra...' → 'LEGADO'
    """
    if not hilo_text:
        return None
    match = re.match(r'^\s*([A-ZÁÉÍÓÚÑ]{3,})\s*[—\-]', hilo_text)
    if match:
        return match.group(1)
    words = re.findall(r'\b([A-ZÁÉÍÓÚÑ]{3,})\b', hilo_text)
    return words[0] if words else None


def normalize_text_for_compare(text):
    """Normaliza texto para comparación: lowercase, collapse whitespace."""
    if not text:
        return ""
    text = text.lower().strip()
    text = re.sub(r'\s+', ' ', text)
    text = text.strip('"\'""''')
    return text


def text_word_set(text):
    """Devuelve set de palabras normalizadas para comparación."""
    normalized = normalize_text_for_compare(text)
    words = re.findall(r'[a-záéíóúñü]+', normalized)
    return set(words)


def truncate(text, max_len=80):
    """Trunca texto a max_len caracteres con elipsis."""
    if not text:
        return ""
    if len(text) <= max_len:
        return text
    return text[:max_len - 3] + "..."


def get_prueba_display_id(prueba, idx):
    """Get a display-friendly ID for a prueba (prefers id, falls back to index)."""
    return prueba.get("id", f"P{idx + 1}")


def detect_game_type(game_data):
    """Detect game type from juego.json tipo field."""
    tipo = game_data.get("tipo", "").lower().replace("game-type-", "")
    type_map = {
        "hall-escape": "hall-escape",
        "street-escape": "street-escape",
        "investigation": "investigation",
        "concurso": "concurso",
        "violeta": "investigation",
    }
    return type_map.get(tipo, "hall-escape")


def _load_concurso_questions(juego_dir):
    """Load all question files for concurso games. Returns list of (filename, questions_list) or None."""
    patterns = [
        str(juego_dir / "preguntas.json"),
        str(juego_dir / "preguntas-*.json"),
    ]
    files = []
    for pat in patterns:
        files.extend(glob_mod.glob(pat))
    files = sorted(set(files))
    if not files:
        return None
    all_questions = []
    for fpath in files:
        data, err = load_json(fpath)
        if err or not isinstance(data, list):
            continue
        all_questions.extend(data)
    return all_questions if all_questions else None


def _load_concurso_minijuegos(juego_dir):
    """Load minijuegos.json for concurso games. Returns list or None."""
    path = juego_dir / "minijuegos.json"
    if not path.is_file():
        return None
    data, err = load_json(path)
    if err or not isinstance(data, list):
        return None
    return data


# ── CHECKS ────────────────────────────────────────────────────────────────────

def check_1_reward_letter_consistency(game_data, pruebas_data):
    """
    CHECK 1 — Consistencia letra recompensa
    Verifica que solucion.recompensa.letra coincide con hilo_conductor.letra.
    Acepta excepción cuando recompensa.es_final=true (prueba final que entrega
    la palabra completa en lugar de una sola letra).
    """
    issues = []

    for i, prueba in enumerate(pruebas_data):
        pid = get_prueba_display_id(prueba, i)
        hc = prueba.get("hilo_conductor", {})
        sol = prueba.get("solucion", {})
        rec = sol.get("recompensa", {})

        hc_letra = hc.get("letra")
        rec_letra = rec.get("letra")

        if not hc_letra or not rec_letra:
            continue

        # Accept mismatch when es_final=true (final ceremony delivers full word)
        if rec.get("es_final") and rec_letra.upper() != hc_letra.upper():
            continue

        if rec_letra.upper() != hc_letra.upper():
            issues.append(("CRITICAL", f"[{pid}] recompensa.letra='{rec_letra}' ≠ "
                           f"hilo_conductor.letra='{hc_letra}'"))

    if not issues:
        return "OK", "Todas las recompensas coinciden con su hilo conductor"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = "; ".join(i[1] for i in issues)
    return worst, details


def check_2_hilo_conductor_completeness(game_data, pruebas_data):
    """
    CHECK 2 — Completitud hilo conductor
    - Posiciones consecutivas sin gaps
    - Letras forman la palabra esperada
    - Verificar que cada recompensa otorga la letra individual esperada
    """
    issues = []

    # Collect hilo_conductor data from all pruebas
    positions = {}
    for i, prueba in enumerate(pruebas_data):
        pid = get_prueba_display_id(prueba, i)
        hc = prueba.get("hilo_conductor", {})
        if not hc:
            continue
        pos = hc.get("posicion")
        letra = hc.get("letra")
        if pos is not None and letra:
            positions[pos] = (letra.upper(), pid)

    if not positions:
        return "SKIP", "No hay datos de hilo_conductor"

    # Check positions are consecutive (1, 2, 3, ...)
    max_pos = max(positions.keys())
    for i in range(1, max_pos + 1):
        if i not in positions:
            issues.append(("CRITICAL", f"Posición {i} no reclamada por ninguna prueba "
                           f"(gap en secuencia)"))

    # Check for duplicate positions
    all_pos = []
    for i, prueba in enumerate(pruebas_data):
        hc = prueba.get("hilo_conductor", {})
        pos = hc.get("posicion")
        if pos is not None:
            all_pos.append((pos, get_prueba_display_id(prueba, i)))
    pos_count = {}
    for pos, _ in all_pos:
        pos_count[pos] = pos_count.get(pos, 0) + 1
    for pos, count in pos_count.items():
        if count > 1:
            issues.append(("CRITICAL", f"Posición {pos} reclamada por múltiples pruebas"))

    # Try to extract expected word from juego.json
    hilo_text = game_data.get("hilo_conductor", "")
    expected_word = extract_word_from_hilo(hilo_text)

    if expected_word and positions:
        sorted_positions = sorted(positions.keys())
        actual_word = "".join(positions[p][0] for p in sorted_positions)

        if actual_word != expected_word.upper():
            issues.append(("CRITICAL",
                           f"Letras '{actual_word}' no forman la palabra esperada "
                           f"'{expected_word}' (orden por posición)"))

    # Check that each letter in the expected word is individually earned
    # (a recompensa like "LEGADO completo" instead of "O" means the letter
    # wasn't individually earned — likely a copy-paste/design oversight)
    if expected_word:
        earned_single = set()
        for i, prueba in enumerate(pruebas_data):
            hc = prueba.get("hilo_conductor", {})
            sol = prueba.get("solucion", {})
            rec = sol.get("recompensa", {})
            hc_letra = hc.get("letra", "")
            rec_letra = rec.get("letra", "")
            if hc_letra and rec_letra and rec_letra.upper() == hc_letra.upper() and len(rec_letra.strip()) <= 2:
                earned_single.add(hc_letra.upper())

        expected_set = set(expected_word.upper())
        not_individually_earned = expected_set - earned_single
        if not_individually_earned:
            for letra in sorted(not_individually_earned):
                issues.append(("WARNING",
                               f"Letra '{letra}' del hilo conductor no se otorga "
                               f"individualmente como recompensa (¿omitida en diseño?)"))

    if not issues:
        sorted_positions = sorted(positions.keys())
        word = "".join(positions[p][0] for p in sorted_positions)
        return "OK", f"Posiciones {sorted_positions} forman '{word}', sin gaps"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = "; ".join(i[1] for i in issues)
    return worst, details


def check_3_navigation_continuity(game_data, pruebas_data):
    """
    CHECK 3 — Continuidad de navegación
    - Cada prueba (excepto la última) debe tener carta_navegacion
    - La primera prueba debe tener punto de entrada
    """
    issues = []

    if not pruebas_data:
        return "SKIP", "No hay pruebas para validar"

    # Check each non-last prueba has navigation text
    for i, prueba in enumerate(pruebas_data):
        pid = get_prueba_display_id(prueba, i)
        nombre = prueba.get("nombre", "?")
        sol = prueba.get("solucion", {})
        rec = sol.get("recompensa", {})
        carta_nav = rec.get("carta_navegacion", "")

        is_last = (i == len(pruebas_data) - 1)

        if not is_last:
            if not carta_nav or len(carta_nav.strip()) < 10:
                issues.append(("CRITICAL",
                               f"[{pid}] Sin carta_navegacion tras resolver "
                               f"'{truncate(nombre)}' — los jugadores se quedan atascados"))

    # Check first prueba has an entry point
    first = pruebas_data[0]
    first_pid = get_prueba_display_id(first, 0)
    has_entry = False

    # Check juego.json sections for initial briefing
    for section in game_data.get("secciones", []):
        content = section.get("contenido_html", "").lower()
        if "briefing" in content or "sobre lacrado" in content:
            has_entry = True
            break

    # Check first prueba's ingame docs
    if not has_entry:
        for doc in first.get("ingame_docs", []) + first.get("documentos_in_game", []):
            title = doc.get("titulo", "").lower()
            if "navegación" in title or "navegacion" in title or "instrucción" in title:
                has_entry = True
                break

    # Check if first prueba's description mentions how to start
    if not has_entry:
        desc = first.get("descripcion", "").lower()
        if "encuentran" in desc or "sobre lacrado" in desc or "testamento" in desc:
            has_entry = True

    if not has_entry:
        issues.append(("WARNING",
                       f"[{first_pid}] No se detecta punto de entrada inicial "
                       f"(briefing, sobre inicial, o documento de inicio)"))

    if not issues:
        nav_count = sum(1 for p in pruebas_data[:-1]
                        if p.get("solucion", {}).get("recompensa", {}).get("carta_navegacion"))
        return "OK", f"{nav_count} cartas de navegación presentes, punto de entrada detectado"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = "; ".join(i[1] for i in issues)
    return worst, details


def check_4_navigation_text_consistency(game_data, pruebas_data):
    """
    CHECK 4 — Consistencia textos de navegación
    Compara carta_navegacion con documentos in-game de navegación.
    """
    issues = []

    for i, prueba in enumerate(pruebas_data):
        pid = get_prueba_display_id(prueba, i)

        # Get carta_navegacion from solucion.recompensa
        sol = prueba.get("solucion", {})
        rec = sol.get("recompensa", {})
        carta_nav = rec.get("carta_navegacion", "")

        if not carta_nav:
            continue

        # Find ingame docs with "Navegación" in title (deduplicated)
        nav_docs = {}
        for doc in prueba.get("ingame_docs", []):
            title = doc.get("titulo", "")
            if "navegación" in title.lower() or "navegacion" in title.lower():
                nav_docs[title] = doc
        for doc in prueba.get("documentos_in_game", []):
            title = doc.get("titulo", "")
            if "navegación" in title.lower() or "navegacion" in title.lower():
                nav_docs[title] = doc  # deduplicate by title

        if not nav_docs:
            continue

        # Compare texts
        nav_words = text_word_set(carta_nav)

        for title, doc in nav_docs.items():
            doc_text = doc.get("texto", "")
            doc_words = text_word_set(doc_text)

            if not doc_words or not nav_words:
                continue

            # Calculate word overlap
            common = nav_words & doc_words
            if not common:
                overlap_pct = 0
            else:
                overlap_pct = len(common) / max(len(nav_words), len(doc_words))

            # If overlap is less than 50%, texts differ significantly
            if overlap_pct < 0.5:
                issues.append(("WARNING",
                               f"[{pid}] Textos de navegación divergen "
                               f"(solapamiento {overlap_pct:.0%}):\n"
                               f"   carta_navegacion: '{truncate(carta_nav, 75)}'\n"
                               f"   doc '{truncate(title, 40)}': "
                               f"'{truncate(doc_text, 75)}'"))

    if not issues:
        return "OK", "Todos los textos de navegación son consistentes"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = ";\n   ".join(i[1] for i in issues)
    return worst, details


def check_5a_lock_code_mismatch(game_data, pruebas_data):
    """
    CHECK 5a — Código de candado desactualizado en juego.json
    Si juego.json menciona un código en pruebas[].mecanica, verificar
    que coincide con barrera_fisica.codigo del archivo real.

    Matching: by index position in the pruebas array.
    """
    issues = []

    game_pruebas = game_data.get("pruebas", [])

    for idx, gp in enumerate(game_pruebas):
        gid = gp.get("id", f"P{idx + 1}")
        mecanica = gp.get("mecanica", "")

        if not mecanica:
            continue

        # Extract digit codes from mecanica text
        mecanica_codes = extract_code_from_text(mecanica)

        if not mecanica_codes:
            continue

        # Match by index position
        if idx >= len(pruebas_data):
            continue

        matching = pruebas_data[idx]

        # Get actual code from prueba
        bf = matching.get("barrera_fisica", {})
        if not bf:
            continue
        actual_code = bf.get("codigo", "")

        if not actual_code:
            continue

        # Compare: check if any code from mecanica differs from actual
        actual_clean = actual_code.replace("-", "").replace(" ", "")
        for mc in mecanica_codes:
            if mc != actual_clean:
                issues.append(("CRITICAL",
                               f"[{gid}] juego.json mecanica menciona código '{mc}' "
                               f"pero barrera_fisica.codigo='{actual_code}'"))

    if not issues:
        return "OK", "Todos los códigos en juego.json coinciden con pruebas"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = "; ".join(i[1] for i in issues)
    return worst, details


def check_5b_label_mismatch(game_data, pruebas_data):
    """
    CHECK 5b — Etiquetas de materiales desactualizadas
    Si materiales.desglose tiene claves como "P1_Retrato", verificar
    que P1 realmente IS la prueba Retrato.

    Matching: by index position in the pruebas array.
    """
    issues = []

    desglose = game_data.get("materiales", {}).get("desglose", {})
    if not desglose:
        return "SKIP", "No hay materiales.desglose en juego.json"

    game_pruebas = game_data.get("pruebas", [])

    for key, value in desglose.items():
        # Parse "P1_Retrato" → position 1, expected label "Retrato"
        match = re.match(r'P(\d+)_(.+)', key)
        if not match:
            continue

        pos = int(match.group(1))
        expected_label = match.group(2).lower()

        # Find the prueba at this position (index = pos - 1)
        idx = pos - 1
        if idx < 0 or idx >= len(game_pruebas):
            continue

        gp = game_pruebas[idx]

        # Match by index to actual prueba data
        if idx >= len(pruebas_data):
            continue

        matching = pruebas_data[idx]
        nombre = matching.get("nombre", "")

        # Check if expected_label appears in nombre (accent-insensitive)
        if strip_accents(expected_label) not in strip_accents(nombre.lower()):
            issues.append(("WARNING",
                           f"{key}: etiqueta dice '{expected_label}' pero "
                           f"prueba es '{matching.get('nombre', '?')}' "
                           f"(posible swap por reordenación)"))

    if not issues:
        return "OK", "Etiquetas de materiales coinciden con pruebas"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = "; ".join(i[1] for i in issues)
    return worst, details


def check_5c_difficulty_curve_mismatch(game_data, pruebas_data):
    """
    CHECK 5c — Curva de dificultad desactualizada
    Si juego.json tiene dificultad.curva, verificar que cada valor
    coincide con la dificultad de la prueba correspondiente.

    Matching: by index position in the pruebas array.
    """
    curva = game_data.get("dificultad", {}).get("curva", [])
    if not curva:
        return "SKIP", "No hay dificultad.curva en juego.json"

    game_pruebas = game_data.get("pruebas", [])
    if not game_pruebas:
        return "SKIP", "No hay pruebas en juego.json"
    issues = []

    for i, expected_diff in enumerate(curva):
        if i >= len(game_pruebas) or i >= len(pruebas_data):
            break

        gid = game_pruebas[i].get("id", f"P{i + 1}")
        matching = pruebas_data[i]

        actual_diff = matching.get("dificultad")
        if actual_diff is not None and actual_diff != expected_diff:
            issues.append(("WARNING",
                           f"[{gid}] curva[{i}]={expected_diff} pero "
                           f"dificultad={actual_diff}"))

    if not issues:
        return "OK", f"Curva de dificultad coincide ({len(curva)} valores)"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = "; ".join(i[1] for i in issues)
    return worst, details


def check_5d_duration_mismatch(game_data, pruebas_data):
    """
    CHECK 5d — Duración total desactualizada
    Verificar que la suma de duracion_estimada_minutos está dentro de ±20%
    de juego.json duracion_minutos.
    """
    total = game_data.get("duracion_minutos")
    if total is None:
        return "SKIP", "No hay duracion_minutos en juego.json"

    suma = sum(p.get("duracion_estimada_minutos", 0) for p in pruebas_data)
    if suma == 0:
        return "SKIP", "Las pruebas no tienen duracion_estimada_minutos"

    diff_pct = abs(total - suma) / total * 100
    if diff_pct > 20:
        return "WARNING", (f"Suma de pruebas={suma} min, juego.json={total} min "
                           f"(desviación {diff_pct:.0f}%, fuera de ±20%)")

    return "OK", f"Suma={suma} min vs total={total} min (desviación {diff_pct:.0f}%)"


def check_6a_wrong_letter_ubicacion(game_data, pruebas_data):
    """
    CHECK 6a — Letra incorrecta en ubicación (copy-paste)
    Si barrera_fisica.ubicacion menciona "letra X" pero hilo_conductor.letra es Y.
    """
    issues = []

    for i, prueba in enumerate(pruebas_data):
        pid = get_prueba_display_id(prueba, i)
        hc = prueba.get("hilo_conductor", {})
        bf = prueba.get("barrera_fisica", {})

        hc_letra = hc.get("letra", "")
        ubicacion = bf.get("ubicacion", "")

        if not hc_letra or not ubicacion:
            continue

        # Find "letra X" patterns in ubicacion
        matches = re.findall(r'letra\s+([A-ZÁÉÍÓÚÑa-záéíóúñ])', ubicacion, re.IGNORECASE)
        for mentioned_letter in matches:
            if mentioned_letter.upper() != hc_letra.upper():
                issues.append(("WARNING",
                               f"[{pid}] barrera_fisica.ubicacion menciona 'letra "
                               f"{mentioned_letter}' pero hilo_conductor.letra='{hc_letra}' "
                               f"(¿copy-paste de otra prueba?)"))

    if not issues:
        return "OK", "Letras en ubicaciones correctas"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = "; ".join(i[1] for i in issues)
    return worst, details


def check_6b_wrong_prueba_reference(game_data, pruebas_data):
    """
    CHECK 6b — Referencia a prueba equivocada (copy-paste)
    Si elementos_necesarios menciona "Sobre P1" o "Prueba 1" pero la prueba
    actual es P2+.
    """
    issues = []

    for i, prueba in enumerate(pruebas_data):
        pid = get_prueba_display_id(prueba, i)
        hc = prueba.get("hilo_conductor", {})
        pos = hc.get("posicion", i + 1)
        cfg = prueba.get("configuracion", {})
        elementos = cfg.get("elementos_necesarios", [])

        if not elementos:
            continue

        for elem in elementos:
            # Check for "Sobre P{N}" references
            sobre_matches = re.findall(r'Sobre\s+P(\d+)', elem, re.IGNORECASE)
            for ref_pos_str in sobre_matches:
                ref_pos = int(ref_pos_str)
                # "Sobre P1" in P2+ is a copy-paste artifact
                if ref_pos < pos:
                    issues.append(("WARNING",
                                   f"[{pid}] elementos_necesarios menciona "
                                   f"'Sobre P{ref_pos}' pero esta es "
                                   f"P{pos} (¿copy-paste de P{ref_pos}?)"))

            # Check for "Prueba N" references
            prueba_matches = re.findall(r'Prueba\s+(\d+)', elem, re.IGNORECASE)
            for ref_pos_str in prueba_matches:
                ref_pos = int(ref_pos_str)
                if ref_pos != pos:
                    issues.append(("WARNING",
                                   f"[{pid}] elementos_necesarios menciona "
                                   f"'Prueba {ref_pos}' pero esta es "
                                   f"P{pos} (¿copy-paste?)"))

    if not issues:
        return "OK", "Referencias a pruebas correctas"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = "; ".join(i[1] for i in issues)
    return worst, details


def check_6c_wrong_letter_elementos(game_data, pruebas_data):
    """
    CHECK 6c — Letra incorrecta en elementos_necesarios (copy-paste)
    Si menciona "Letra física X" pero hilo_conductor.letra es Y.
    """
    issues = []

    for i, prueba in enumerate(pruebas_data):
        pid = get_prueba_display_id(prueba, i)
        hc = prueba.get("hilo_conductor", {})
        cfg = prueba.get("configuracion", {})
        elementos = cfg.get("elementos_necesarios", [])

        hc_letra = hc.get("letra", "")
        if not hc_letra or not elementos:
            continue

        for elem in elementos:
            # Find "Letra física X" references
            matches = re.findall(
                r'[Ll]etra\s+f[ií]si(?:ca|co)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ])',
                elem, re.IGNORECASE
            )
            for mentioned_letter in matches:
                if mentioned_letter.upper() != hc_letra.upper():
                    issues.append(("WARNING",
                                   f"[{pid}] elementos_necesarios menciona "
                                   f"'Letra física {mentioned_letter}' pero "
                                   f"hilo_conductor.letra='{hc_letra}' "
                                   f"(¿copy-paste?)"))

    if not issues:
        return "OK", "Letras en elementos_necesarios correctas"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = "; ".join(i[1] for i in issues)
    return worst, details


def _extract_all_text(data, prefix=""):
    results = []
    if isinstance(data, dict):
        for k, v in data.items():
            path = f"{prefix}.{k}" if prefix else k
            if isinstance(v, str) and len(v) > 10:
                results.append((path, v))
            else:
                results.extend(_extract_all_text(v, path))
    elif isinstance(data, list):
        for idx, item in enumerate(data):
            path = f"{prefix}[{idx}]" if prefix else f"[{idx}]"
            if isinstance(item, str) and len(item) > 10:
                results.append((path, item))
            else:
                results.extend(_extract_all_text(item, path))
    return results


def _collect_all_game_texts(game_data, pruebas_data):
    texts = []

    for sec in game_data.get("secciones", []):
        html = sec.get("contenido_html", "")
        if html and len(html) > 10:
            clean = re.sub(r'<[^>]+>', ' ', html)
            texts.append(("juego.json", f"secciones[{sec.get('titulo', '?')}]", clean))

    hilo = game_data.get("hilo_conductor", "")
    if hilo and len(hilo) > 10:
        texts.append(("juego.json", "hilo_conductor", hilo))

    for i, prueba in enumerate(pruebas_data):
        pid = get_prueba_display_id(prueba, i)
        src = f"prueba[{pid}]"

        for field in ("descripcion", "narrativa"):
            val = prueba.get(field, "")
            if val and len(val) > 10:
                clean = re.sub(r'<[^>]+>', ' ', val)
                texts.append((src, field, clean))

        gm_notas = prueba.get("gm_notas", "")
        if gm_notas and len(gm_notas) > 10:
            clean = re.sub(r'<[^>]+>', ' ', gm_notas)
            texts.append((src, "gm_notas", clean))

        for j, doc in enumerate(prueba.get("documentos_in_game", [])):
            doc_text = doc.get("texto", "")
            if doc_text and len(doc_text) > 10:
                clean = re.sub(r'<[^>]+>', ' ', doc_text)
                texts.append((src, f"documentos_in_game[{j}].texto", clean))

        all_fields = _extract_all_text(prueba, "")
        for path, val in all_fields:
            clean = re.sub(r'<[^>]+>', ' ', val)
            texts.append((src, path, clean))

    return texts


def check_7_timeline_math(game_data, pruebas_data):
    issues = []
    all_texts = _collect_all_game_texts(game_data, pruebas_data)

    character_names = set()
    for sec in game_data.get("secciones", []):
        html = sec.get("contenido_html", "")
        for m in re.finditer(r'<strong>([^<]+)</strong>', html):
            name = m.group(1).strip()
            skip_prefixes = ("GENERACIÓN", "FASE", "Pregunta", "CONSEJO", "Última", "Prueba")
            if any(name.startswith(p) for p in skip_prefixes):
                continue
            if len(name) > 2 and not name[0].isdigit():
                character_names.add(name)

    for pj in game_data.get("personajes", []):
        if isinstance(pj, dict):
            n = pj.get("nombre", "")
            if n:
                character_names.add(n)

    if not character_names:
        return "SKIP", "No se detectaron nombres de personajes"

    year_map = {}
    for name in character_names:
        name_l = name.lower()
        escaped = re.escape(name_l)
        year_map[name_l] = {}

        for src, field, text in all_texts:
            text_l = text.lower()
            for m in re.finditer(escaped, text_l):
                start = max(0, m.start() - 200)
                end = min(len(text_l), m.end() + 200)
                window = text_l[start:end]

                for ym in re.finditer(r'((?:19|20)\d{2})', window):
                    year = ym.group(1)
                    ctx_start = max(0, ym.start() - 40)
                    ctx_end = min(len(window), ym.end() + 40)
                    ctx = window[ctx_start:ctx_end]
                    year_map[name_l].setdefault(year, []).append((src, field, ctx))

    birth_patterns = [
        r'nac(?:ió|ido|er|imiento)\s+(?:en\s+)?(\d{4})',
        r'adopc(?:ión|tado|ada)\s+(?:en\s+)?(\d{4})',
        r'(\d{4})\s*(?:nacimiento|adopción)',
    ]

    for name_l, years_info in year_map.items():
        if len(years_info) <= 1:
            continue

        birth_years = {}
        for year, occurrences in years_info.items():
            for src, field, ctx in occurrences:
                for pat in birth_patterns:
                    if re.search(pat, ctx, re.IGNORECASE):
                        birth_years.setdefault(year, []).append((src, field, ctx))
                        break

        if len(birth_years) < 2:
            continue

        year_ints = sorted(int(y) for y in birth_years)
        if abs(year_ints[-1] - year_ints[0]) > 2:
            details = []
            for y, occs in sorted(birth_years.items()):
                sources = "; ".join(f"{s} ({truncate(ctx.strip(), 40)})" for s, f, ctx in occs[:2])
                details.append(f"  {y}: {sources}")
            issues.append(("CRITICAL",
                           f"Personaje '{name_l}' tiene años de nacimiento/adopción contradictorios:\n"
                           + "\n".join(details)))

    if not issues:
        return "OK", f"Revisados {len(character_names)} personajes sin contradicciones temporales"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = ";\n   ".join(i[1] for i in issues)
    return worst, details


def check_8_personajes_sync(game_data, pruebas_data):
    personajes = game_data.get("personajes")
    if not personajes or not isinstance(personajes, list):
        return "SKIP", "No hay array personajes en juego.json"

    issues = []
    birth_fields = ("ano_nacimiento", "nacimiento", "birth_year", "fecha_nacimiento")

    all_texts = _collect_all_game_texts(game_data, pruebas_data)

    birth_patterns = [
        r'nac(?:ió|ido|er|imiento)\s+(?:en\s+)?(\d{4})',
        r'adopc(?:ión|tado|ada)\s+(?:en\s+)?(\d{4})',
        r'(\d{4})\s*(?:nacimiento|adopción)',
    ]

    for pj in personajes:
        if not isinstance(pj, dict):
            continue
        nombre = pj.get("nombre", "")
        if not nombre:
            continue

        pj_year = None
        for bf in birth_fields:
            val = pj.get(bf)
            if val:
                m = re.search(r'(\d{4})', str(val))
                if m:
                    pj_year = m.group(1)
                    break

        if not pj_year:
            continue

        nombre_l = nombre.lower()
        escaped = re.escape(nombre_l)

        for src, field, text in all_texts:
            text_l = text.lower()
            if not re.search(escaped, text_l):
                continue

            for m in re.finditer(escaped, text_l):
                start = max(0, m.start() - 200)
                end = min(len(text_l), m.end() + 200)
                window = text_l[start:end]

                for pat in birth_patterns:
                    pm = re.search(pat, window, re.IGNORECASE)
                    if pm:
                        found_year = pm.group(1)
                        if found_year != pj_year:
                            issues.append(("CRITICAL",
                                           f"Personaje '{nombre}': personajes dice {pj_year} "
                                           f"pero {src}.{field} sugiere {found_year}"))

    if not issues:
        return "OK", f"Revisados {len(personajes)} personajes, datos sincronizados"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = "; ".join(i[1] for i in issues)
    return worst, details


def check_9_code_guessability(game_data, pruebas_data):
    issues = []

    codes = []
    for i, prueba in enumerate(pruebas_data):
        pid = get_prueba_display_id(prueba, i)
        bf = prueba.get("barrera_fisica", {})
        for field in ("codigo", "codigo_candado"):
            code = bf.get(field, "")
            if code and str(code).strip():
                codes.append((pid, str(code).strip(), prueba))

    if not codes:
        return "SKIP", "No hay códigos de candado para verificar"

    narrative_texts = []
    for sec in game_data.get("secciones", []):
        html = sec.get("contenido_html", "")
        if html and len(html) > 10:
            clean = re.sub(r'<[^>]+>', ' ', html)
            narrative_texts.append(("juego.json", f"secciones[{sec.get('titulo', '?')}]", clean))

    hilo = game_data.get("hilo_conductor", "")
    if hilo and len(hilo) > 10:
        narrative_texts.append(("juego.json", "hilo_conductor", hilo))

    for i, prueba in enumerate(pruebas_data):
        pid = get_prueba_display_id(prueba, i)
        src = f"prueba[{pid}]"

        for field in ("descripcion", "narrativa"):
            val = prueba.get(field, "")
            if val and len(val) > 10:
                clean = re.sub(r'<[^>]+>', ' ', val)
                narrative_texts.append((src, field, clean))

        for j, doc in enumerate(prueba.get("documentos_in_game", [])):
            title = doc.get("titulo", "").lower()
            if "navegación" in title or "navegacion" in title:
                continue
            doc_text = doc.get("texto", "")
            if doc_text and len(doc_text) > 10:
                clean = re.sub(r'<[^>]+>', ' ', doc_text)
                narrative_texts.append((src, f"documentos_in_game[{j}].texto", clean))

    for pid, code, code_prueba in codes:
        code_clean = code.replace("-", "").replace(" ", "")
        is_numeric = code_clean.isdigit()

        for src, field, text in narrative_texts:
            if src == f"prueba[{pid}]" and field == "descripcion":
                continue

            if is_numeric:
                if re.search(r'\b' + re.escape(code_clean) + r'\b', text):
                    issues.append(("WARNING",
                                   f"Código '{code}' de [{pid}] aparece en texto narrativo "
                                   f"de {src}.{field}"))
            else:
                if code_clean.lower() in text.lower():
                    issues.append(("WARNING",
                                   f"Código '{code}' de [{pid}] aparece en texto narrativo "
                                   f"de {src}.{field}"))

    if not issues:
        return "OK", f"Revisados {len(codes)} códigos, ninguno filtrado en narrativa"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = ";\n   ".join(i[1] for i in issues)
    return worst, details


def check_10_anti_brute_force(game_data, pruebas_data):
    COMMON_PINS = {
        "1234", "4321", "1111", "2222", "3333", "4444", "5555", "6666",
        "7777", "8888", "9999", "0000", "1235", "1357", "2468", "0123",
        "9876", "1212", "1122", "1313", "1004", "2000",
    }

    issues = []

    codes = []
    for i, prueba in enumerate(pruebas_data):
        pid = get_prueba_display_id(prueba, i)
        bf = prueba.get("barrera_fisica", {})
        for field in ("codigo", "codigo_candado"):
            code = bf.get(field, "")
            if code and str(code).strip():
                codes.append((pid, str(code).strip()))

    if not codes:
        return "SKIP", "No hay códigos de candado para verificar"

    juego_html = ""
    for sec in game_data.get("secciones", []):
        html = sec.get("contenido_html", "")
        if html:
            juego_html += " " + html
    juego_html_clean = re.sub(r'<[^>]+>', ' ', juego_html).lower()

    game_name = game_data.get("nombre", "").lower()
    game_name_words = set(re.findall(r'[a-záéíóúñü]+', game_name))

    for pid, code in codes:
        code_clean = code.replace("-", "").replace(" ", "")

        if code_clean in COMMON_PINS:
            issues.append(("CRITICAL",
                           f"[{pid}] Código '{code}' es un PIN común ({code_clean})"))
            continue

        if code_clean.isdigit():
            digits = code_clean
            if len(set(digits)) == 1:
                issues.append(("WARNING",
                               f"[{pid}] Código '{code}' es un dígito repetido"))
                continue

            if len(digits) >= 4:
                sequential = True
                for j in range(1, len(digits)):
                    diff = abs(int(digits[j]) - int(digits[j - 1]))
                    if diff != 1:
                        sequential = False
                        break
                if sequential:
                    issues.append(("WARNING",
                                   f"[{pid}] Código '{code}' es secuencial"))
                    continue

            if len(digits) == 4:
                year_int = int(digits)
                if 1900 <= year_int <= 2099:
                    if digits in juego_html_clean:
                        issues.append(("WARNING",
                                       f"[{pid}] Código '{code}' es un año ({year_int}) "
                                       f"visible en narrativa de juego.json"))

        if code_clean.isalpha() and code_clean.lower() in game_name_words:
            issues.append(("WARNING",
                           f"[{pid}] Código '{code}' aparece en el nombre del juego "
                           f"'{game_name}'"))

    if not issues:
        return "OK", f"Revisados {len(codes)} códigos, ninguno vulnerable a fuerza bruta"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = "; ".join(i[1] for i in issues)
    return worst, details


def check_concurso_1_questions_unique_answers(game_data, pruebas_data):
    """CHECK C1 — Preguntas con respuesta única (concurso only)."""
    juego_dir = game_data.get("_juego_dir")
    if not juego_dir:
        return "SKIP", "No se puede determinar el directorio del juego"

    questions = _load_concurso_questions(juego_dir)
    if questions is None:
        return "SKIP", "No se encontraron archivos de preguntas (preguntas.json)"

    issues = []
    INDEX_MAP = {"a": 0, "b": 1, "c": 2, "d": 3}

    for i, q in enumerate(enumerate(questions), 1):
        q_idx, q_data = q
        qid = q_data.get("id", f"Q{i}")
        pregunta_text = q_data.get("pregunta", "")

        opciones = q_data.get("opciones", [])
        if not opciones or len(opciones) < 2:
            issues.append(("WARNING",
                           f"[{qid}] Sin opciones (necesita ≥2)"))

        correcta = q_data.get("correcta", "")
        if not correcta:
            issues.append(("CRITICAL",
                           f"[{qid}] Sin campo 'correcta'"))
        elif opciones:
            idx = INDEX_MAP.get(correcta.lower())
            if idx is None or idx >= len(opciones):
                issues.append(("CRITICAL",
                               f"[{qid}] correcta='{correcta}' fuera de rango de opciones"))
            correct_count = sum(
                1 for j, _ in enumerate(opciones) if j == idx
            )
            if correct_count > 1:
                issues.append(("CRITICAL",
                               f"[{qid}] Múltiples opciones marcadas como correctas"))

        if not q_data.get("dificultad"):
            issues.append(("WARNING",
                           f"[{qid}] Sin campo 'dificultad'"))

        if not q_data.get("dato") and not q_data.get("explicacion"):
            issues.append(("WARNING",
                           f"[{qid}] Sin 'dato' ni 'explicacion' (valor educativo)"))

    seen = {}
    for q_data in questions:
        text = normalize_text_for_compare(q_data.get("pregunta", ""))
        if text in seen:
            issues.append(("WARNING",
                           f"Pregunta duplicada: '{truncate(q_data.get('pregunta', ''), 60)}' "
                           f"(también en {seen[text]})"))
        else:
            seen[text] = q_data.get("id", "?")

    if not issues:
        return "OK", f"{len(questions)} preguntas válidas con respuesta única"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = "; ".join(i[1] for i in issues)
    return worst, details


def check_concurso_2_difficulty_progression(game_data, pruebas_data):
    """CHECK C2 — Progresión de dificultad en preguntas (concurso only)."""
    juego_dir = game_data.get("_juego_dir")
    if not juego_dir:
        return "SKIP", "No se puede determinar el directorio del juego"

    questions = _load_concurso_questions(juego_dir)
    if questions is None:
        return "SKIP", "No se encontraron archivos de preguntas"

    issues = []

    for q_data in questions:
        diff = q_data.get("dificultad")
        if diff is not None and isinstance(diff, (int, float)) and diff > 8:
            qid = q_data.get("id", "?")
            issues.append(("WARNING",
                           f"[{qid}] dificultad={diff} > 8 (demasiado difícil para quiz)"))

    by_pct = {}
    by_ronda = {}
    for q_data in questions:
        pct = q_data.get("pct")
        ronda = q_data.get("ronda")
        diff = q_data.get("dificultad")
        if diff is None:
            continue
        if pct is not None:
            by_pct.setdefault(pct, []).append(diff)
        if ronda is not None:
            by_ronda.setdefault(ronda, []).append(diff)

    if by_pct:
        sorted_pcts = sorted(by_pct.keys(), reverse=True)
        for i in range(len(sorted_pcts) - 1):
            avg_curr = sum(by_pct[sorted_pcts[i]]) / len(by_pct[sorted_pcts[i]])
            avg_next = sum(by_pct[sorted_pcts[i + 1]]) / len(by_pct[sorted_pcts[i + 1]])
            if avg_curr > avg_next:
                issues.append(("WARNING",
                               f"pct={sorted_pcts[i]} (diff media {avg_curr:.1f}) es más difícil "
                               f"que pct={sorted_pcts[i + 1]} (diff media {avg_next:.1f}) "
                               f"— debería ir de fácil a difícil"))

    if by_ronda:
        sorted_rondas = sorted(by_ronda.keys())
        for i in range(len(sorted_rondas) - 1):
            avg_curr = sum(by_ronda[sorted_rondas[i]]) / len(by_ronda[sorted_rondas[i]])
            avg_next = sum(by_ronda[sorted_rondas[i + 1]]) / len(by_ronda[sorted_rondas[i + 1]])
            if avg_curr > avg_next:
                issues.append(("WARNING",
                               f"Ronda {sorted_rondas[i]} (diff media {avg_curr:.1f}) más difícil "
                               f"que Ronda {sorted_rondas[i + 1]} (diff media {avg_next:.1f}) "
                               f"— la dificultad debería crecer o mantenerse"))

    if not issues:
        return "OK", f"Progresión de dificultad correcta en {len(questions)} preguntas"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = "; ".join(i[1] for i in issues)
    return worst, details


def check_concurso_3_minijuegos_balance(game_data, pruebas_data):
    """CHECK C3 — Balance de minijuegos (concurso only)."""
    juego_dir = game_data.get("_juego_dir")
    if not juego_dir:
        return "SKIP", "No se puede determinar el directorio del juego"

    minijuegos = _load_concurso_minijuegos(juego_dir)
    if minijuegos is None:
        return "SKIP", "No se encontró minijuegos.json"

    issues = []
    categories = set()

    for i, mj in enumerate(minijuegos):
        mid = mj.get("id", f"MJ{i + 1}")

        if not mj.get("material"):
            issues.append(("WARNING",
                           f"[{mid}] Sin lista 'material'"))

        tiempo = mj.get("tiempo")
        if tiempo is not None:
            try:
                t = float(tiempo)
                if t > 120:
                    issues.append(("WARNING",
                                   f"[{mid}] tiempo={tiempo}s > 120s (demasiado largo)"))
            except (ValueError, TypeError):
                pass

        if not mj.get("dificultad"):
            issues.append(("WARNING",
                           f"[{mid}] Sin campo 'dificultad'"))

        if not mj.get("participantes"):
            issues.append(("WARNING",
                           f"[{mid}] Sin campo 'participantes'"))

        cat = mj.get("categoria", mj.get("tipo", ""))
        if cat:
            categories.add(cat)

        material = mj.get("material", [])
        if isinstance(material, list):
            for item in material:
                if isinstance(item, dict):
                    precio = item.get("precio", item.get("coste", 0))
                    try:
                        if float(precio) > 50:
                            issues.append(("WARNING",
                                           f"[{mid}] Material '{item.get('nombre', '?')}' "
                                           f"cuesta {precio}€ (>50€)"))
                    except (ValueError, TypeError):
                        pass
                elif isinstance(item, str):
                    price_match = re.search(r'(\d+(?:\.\d+)?)\s*€', item)
                    if price_match:
                        try:
                            if float(price_match.group(1)) > 50:
                                issues.append(("WARNING",
                                               f"[{mid}] Material con precio >50€: '{truncate(item, 50)}'"))
                        except ValueError:
                            pass

    if len(categories) < 3:
        issues.append(("WARNING",
                       f"Solo {len(categories)} categorías de minijuegos "
                       f"(recomendado ≥3 para variedad)"))

    if not issues:
        return "OK", f"{len(minijuegos)} minijuegos equilibrados, {len(categories)} categorías"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = "; ".join(i[1] for i in issues)
    return worst, details


def check_street_1_gps_coordinates(game_data, pruebas_data):
    """CHECK S1 — Coordenadas GPS válidas (street-escape only)."""
    issues = []

    for i, prueba in enumerate(pruebas_data):
        pid = get_prueba_display_id(prueba, i)
        cfg = prueba.get("configuracion", {})

        lat = cfg.get("latitud_objetivo")
        lon = cfg.get("longitud_objetivo")

        if lat is None and lon is None:
            continue

        if lat is None or lon is None:
            issues.append(("CRITICAL",
                           f"[{pid}] GPS incompleto: lat={lat}, lon={lon}"))
            continue

        if isinstance(lat, str) and ("todo" in lat.lower() or lat.strip() == ""):
            issues.append(("CRITICAL",
                           f"[{pid}] latitud_objetivo='TODO' o vacío"))
            continue

        if isinstance(lon, str) and ("todo" in lon.lower() or lon.strip() == ""):
            issues.append(("CRITICAL",
                           f"[{pid}] longitud_objetivo='TODO' o vacío"))
            continue

        try:
            lat_f = float(lat)
            lon_f = float(lon)
        except (ValueError, TypeError):
            issues.append(("CRITICAL",
                           f"[{pid}] Coordenadas no numéricas: lat={lat}, lon={lon}"))
            continue

        if not (-90 <= lat_f <= 90):
            issues.append(("CRITICAL",
                           f"[{pid}] latitud={lat_f} fuera de rango [-90, 90]"))

        if not (-180 <= lon_f <= 180):
            issues.append(("CRITICAL",
                           f"[{pid}] longitud={lon_f} fuera de rango [-180, 180]"))

        radio = cfg.get("radio_verificacion")
        if radio is None:
            issues.append(("WARNING",
                           f"[{pid}] Sin radio_verificacion"))
        else:
            try:
                if float(radio) <= 0:
                    issues.append(("WARNING",
                                   f"[{pid}] radio_verificacion={radio} ≤ 0"))
            except (ValueError, TypeError):
                issues.append(("WARNING",
                               f"[{pid}] radio_verificacion no numérico: {radio}"))

    if not issues:
        gps_pruebas = sum(
            1 for p in pruebas_data
            if p.get("configuracion", {}).get("latitud_objetivo") is not None
        )
        if gps_pruebas == 0:
            return "SKIP", "No hay pruebas con coordenadas GPS"
        return "OK", f"{gps_pruebas} coordenadas GPS válidas"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = "; ".join(i[1] for i in issues)
    return worst, details


def check_street_2_walking_distances(game_data, pruebas_data):
    """CHECK S2 — Distancias caminables entre pruebas GPS (street-escape only)."""
    gps_points = []

    for i, prueba in enumerate(pruebas_data):
        pid = get_prueba_display_id(prueba, i)
        cfg = prueba.get("configuracion", {})
        lat = cfg.get("latitud_objetivo")
        lon = cfg.get("longitud_objetivo")
        if lat is not None and lon is not None:
            try:
                gps_points.append((pid, float(lat), float(lon)))
            except (ValueError, TypeError):
                continue

    if len(gps_points) <= 1:
        return "SKIP", f"Solo {len(gps_points)} punto(s) GPS — no se puede calcular distancias"

    issues = []
    R = 6371

    for j in range(len(gps_points) - 1):
        pid1, lat1, lon1 = gps_points[j]
        pid2, lat2, lon2 = gps_points[j + 1]

        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (math.sin(dlat / 2) ** 2
             + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2))
             * math.sin(dlon / 2) ** 2)
        c = 2 * math.asin(math.sqrt(a))
        distance_km = R * c
        walk_min = distance_km / 5 * 60

        if walk_min > 10:
            issues.append(("CRITICAL",
                           f"[{pid1}→{pid2}] {walk_min:.0f} min caminando "
                           f"({distance_km:.2f} km) — demasiado lejos"))
        elif walk_min > 5:
            issues.append(("WARNING",
                           f"[{pid1}→{pid2}] {walk_min:.0f} min caminando "
                           f"({distance_km:.2f} km) — lejos"))

    if not issues:
        max_walk = 0
        for j in range(len(gps_points) - 1):
            _, lat1, lon1 = gps_points[j]
            _, lat2, lon2 = gps_points[j + 1]
            dlat = math.radians(lat2 - lat1)
            dlon = math.radians(lon2 - lon1)
            a = (math.sin(dlat / 2) ** 2
                 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2))
                 * math.sin(dlon / 2) ** 2)
            c = 2 * math.asin(math.sqrt(a))
            max_walk = max(max_walk, R * c / 5 * 60)
        return "OK", f"Distancias caminables OK (máx {max_walk:.0f} min)"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = "; ".join(i[1] for i in issues)
    return worst, details


def check_hall_1_team_separation(game_data, pruebas_data):
    """CHECK H1 — Separación de equipos (hall-escape only)."""
    max_players = None
    jugadores = game_data.get("jugadores")
    if jugadores is not None:
        try:
            max_players = int(jugadores)
        except (ValueError, TypeError):
            pass

    if max_players is None:
        jmin = game_data.get("jugadores_min")
        jmax = game_data.get("jugadores_max")
        if jmax is not None:
            try:
                max_players = int(jmax)
            except (ValueError, TypeError):
                pass

    if max_players is None or max_players <= 8:
        return "SKIP", f"Equipo único ({max_players or '?'} jugadores ≤8)"

    issues = []
    found_separation = False
    found_anticheat = False

    cfg = game_data.get("configuracion", {})
    elementos = cfg.get("elementos_necesarios", [])
    separation_kw = ("separación", "separacion", "divisor", "pantalla", "barandilla",
                     "boundari", "separat", "mampara", "biombo")
    anticheat_kw = ("anti-cheat", "anticheat", "soplar", "escuchar", "oír",
                    "oir", "overhear", "confidencial")

    for elem in elementos:
        elem_l = elem.lower() if isinstance(elem, str) else ""
        if any(kw in elem_l for kw in separation_kw):
            found_separation = True
        if any(kw in elem_l for kw in anticheat_kw):
            found_anticheat = True

    for sec in game_data.get("secciones", []):
        html = sec.get("contenido_html", "").lower()
        if any(kw in html for kw in separation_kw):
            found_separation = True
        if any(kw in html for kw in anticheat_kw):
            found_anticheat = True

    if not found_separation:
        issues.append(("WARNING",
                       f"{max_players} jugadores (multi-equipo) sin elementos de separación "
                       f"entre equipos"))

    if not found_anticheat:
        issues.append(("WARNING",
                       f"Sin medidas anti-cheat entre equipos "
                       f"(jugadores pueden escuchar respuestas ajenas)"))

    if not issues:
        return "OK", f"Separación de equipos cubierta para {max_players} jugadores"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = "; ".join(i[1] for i in issues)
    return worst, details


def check_investigation_1_evidence_chain(game_data, pruebas_data):
    """CHECK I1 — Cadena de evidencia coherente (investigation only)."""
    if not pruebas_data:
        return "SKIP", "No hay pruebas para validar cadena de evidencia"

    issues = []
    all_docs_text = []
    prueba_docs = []

    for i, prueba in enumerate(pruebas_data):
        pid = get_prueba_display_id(prueba, i)
        docs = prueba.get("documentos_in_game", []) + prueba.get("ingame_docs", [])
        doc_texts = []
        for doc in docs:
            text = doc.get("texto", "")
            if text:
                clean = re.sub(r'<[^>]+>', ' ', text)
                doc_texts.append((doc.get("titulo", f"doc_{pid}"), clean))
                all_docs_text.append((pid, doc.get("titulo", ""), clean))
        prueba_docs.append((pid, doc_texts, prueba))

    if not all_docs_text:
        return "SKIP", "No hay documentos in-game para validar evidencia"

    for i, (pid, doc_texts, prueba) in enumerate(prueba_docs):
        sol = prueba.get("solucion", {})
        solucion_text = ""
        for field in ("respuesta", "codigo", "solucion"):
            val = sol.get(field, "")
            if val:
                solucion_text += " " + str(val)
        solucion_text += " " + str(sol.get("explicacion", ""))

        if not solucion_text.strip():
            continue

        own_doc_words = set()
        for _, doc_text in doc_texts:
            own_doc_words |= text_word_set(doc_text)

        sol_words = text_word_set(solucion_text)
        key_sol_words = sol_words - text_word_set(prueba.get("descripcion", ""))
        key_sol_words = {w for w in key_sol_words if len(w) > 3}

        if own_doc_words and key_sol_words:
            overlap = key_sol_words & own_doc_words
            if len(overlap) < len(key_sol_words) * 0.2:
                issues.append(("WARNING",
                               f"[{pid}] Solución puede resolverse sin documentos propios "
                               f"(solapamiento {len(overlap)}/{len(key_sol_words)} "
                               f"palabras clave)"))

        if i > 0:
            prev_docs_text = " ".join(
                t for prev_pid, _, t in all_docs_text
                if prev_pid in [p[0] for p in prueba_docs[:i]]
            )
            prev_words = text_word_set(prev_docs_text)
            desc_words = text_word_set(prueba.get("descripcion", ""))
            if desc_words and prev_words:
                ref_overlap = desc_words & prev_words
                if len(ref_overlap) < 3 and i > 1:
                    issues.append(("WARNING",
                                   f"[{pid}] Prueba tardía sin referencias a "
                                   f"evidencia descubierta anteriormente"))

    if not issues:
        return "OK", f"Cadena de evidencia coherente en {len(pruebas_data)} pruebas"

    worst = "CRITICAL" if any(i[0] == "CRITICAL" for i in issues) else "WARNING"
    details = "; ".join(i[1] for i in issues)
    return worst, details


# ── MAIN ──────────────────────────────────────────────────────────────────────

def get_checks_for_type(game_type):
    """Return the check list appropriate for the game type."""
    base_checks = [
        (1, "Consistencia letra recompensa", "🔴", check_1_reward_letter_consistency),
        (2, "Completitud hilo conductor", "🔴", check_2_hilo_conductor_completeness),
        (3, "Continuidad navegación", "🔴", check_3_navigation_continuity),
        (4, "Consistencia textos navegación", "🟡", check_4_navigation_text_consistency),
        ("5a", "Código candado en juego.json", "🔴", check_5a_lock_code_mismatch),
        ("5b", "Etiquetas materiales", "🟡", check_5b_label_mismatch),
        ("5c", "Curva dificultad", "🟡", check_5c_difficulty_curve_mismatch),
        ("5d", "Duración total", "🟡", check_5d_duration_mismatch),
        ("6a", "Letra en ubicación", "🟡", check_6a_wrong_letter_ubicacion),
        ("6b", "Referencia prueba", "🟡", check_6b_wrong_prueba_reference),
        ("6c", "Letra en elementos", "🟡", check_6c_wrong_letter_elementos),
        (7, "Timeline matemático", "🔴", check_7_timeline_math),
        (8, "Sincronización personajes", "🔴", check_8_personajes_sync),
        (9, "Código adivinable", "🔴", check_9_code_guessability),
        (10, "Anti fuerza bruta", "🟡", check_10_anti_brute_force),
    ]

    type_checks = {
        "concurso": [
            ("C1", "Preguntas respuesta única", "🔴", check_concurso_1_questions_unique_answers),
            ("C2", "Progresión dificultad preguntas", "🟡", check_concurso_2_difficulty_progression),
            ("C3", "Balance minijuegos", "🟡", check_concurso_3_minijuegos_balance),
        ],
        "street-escape": [
            ("S1", "Coordenadas GPS válidas", "🔴", check_street_1_gps_coordinates),
            ("S2", "Distancias caminables", "🟡", check_street_2_walking_distances),
        ],
        "hall-escape": [
            ("H1", "Separación equipos", "🟡", check_hall_1_team_separation),
        ],
        "investigation": [
            ("I1", "Cadena de evidencia", "🟡", check_investigation_1_evidence_chain),
        ],
    }

    return base_checks + type_checks.get(game_type, [])


def main():
    if len(sys.argv) < 2:
        print("Uso: validate-game-integrity.py <juego.json|directorio>")
        sys.exit(2)

    arg = Path(sys.argv[1])

    # Resolve juego.json path
    if arg.is_dir():
        candidates = [
            arg / "juego.json",
            arg / "juego" / "juego.json",
        ]
        juego_path = None
        for c in candidates:
            if c.is_file():
                juego_path = c
                break
        if not juego_path:
            print(f"❌ No se encontró juego.json en {arg}", file=sys.stderr)
            sys.exit(1)
    elif arg.is_file():
        juego_path = arg
    else:
        print(f"❌ No encontrado: {arg}", file=sys.stderr)
        sys.exit(1)

    # Load juego.json
    game_data, err = load_json(juego_path)
    if err:
        print(f"❌ Error cargando {juego_path}: {err}", file=sys.stderr)
        sys.exit(1)

    juego_dir = juego_path.parent
    game_data["_juego_dir"] = juego_dir

    game_type = detect_game_type(game_data)

    # Load all referenced prueba files (by index order)
    game_pruebas = game_data.get("pruebas", [])
    pruebas_data = []
    load_errors = []

    for gp in game_pruebas:
        archivo = gp.get("archivo", "")
        gid = gp.get("id", "?")

        if not archivo:
            load_errors.append(f"[{gid}] Sin campo 'archivo'")
            continue

        filepath = find_prueba_file(archivo, juego_dir)
        if not filepath:
            load_errors.append(f"[{gid}] Archivo no encontrado: {archivo}")
            continue

        data, err = load_json(filepath)
        if err:
            load_errors.append(f"[{gid}] Error cargando {filepath}: {err}")
            continue

        pruebas_data.append(data)

    # Print header
    print("╔══════════════════════════════════════════════════════╗")
    print("║  VALIDADOR DE INTEGRIDAD DE JUEGO — Escape Room     ║")
    print("╚══════════════════════════════════════════════════════╝")
    print(f"\nJuego: {game_data.get('nombre', '?')}")
    print(f"Tipo: {game_type}")
    print(f"Archivo: {juego_path}")
    print(f"Pruebas en juego.json: {len(game_pruebas)}")
    print(f"Pruebas cargadas: {len(pruebas_data)}")

    if load_errors:
        print(f"\n⚠️  Errores de carga:")
        for e in load_errors:
            print(f"   {e}")

    # Run checks
    print(f"\n{'='*60}")
    print(f"CHECKS DE INTEGRIDAD")
    print(f"{'='*60}")

    icon_map = {
        "OK": "✅", "WARNING": "⚠️", "INFO": "ℹ️",
        "CRITICAL": "🔴", "SKIP": "⏭️", "ERROR": "❌"
    }

    counts = {"OK": 0, "WARNING": 0, "INFO": 0, "CRITICAL": 0, "SKIP": 0, "ERROR": 0}
    all_results = []
    any_critical = False

    checks = get_checks_for_type(game_type)
    for num, name, default_icon, check_fn in checks:
        try:
            status, detail = check_fn(game_data, pruebas_data)
        except Exception as e:
            status, detail = "ERROR", f"Excepción: {e}"

        prefix = icon_map.get(status, "❓")
        print(f"\n{prefix} CHECK {num}: {name} — {status}")
        if detail:
            for line in detail.split("\n"):
                print(f"   {line}")

        counts[status] = counts.get(status, 0) + 1
        all_results.append((num, name, status, detail))

        if status == "CRITICAL":
            any_critical = True

    # Summary
    print(f"\n{'='*60}")
    print(f"RESUMEN")
    print(f"{'='*60}")
    print(f"🔴 CRITICAL: {counts['CRITICAL']}")
    print(f"⚠️  WARNING:  {counts['WARNING']}")
    print(f"✅ OK:       {counts['OK']}")
    print(f"⏭️  SKIP:     {counts['SKIP']}")

    if any_critical:
        crits = [(n, nm, d) for n, nm, s, d in all_results if s == "CRITICAL"]
        print(f"\n🔴 ERRORES CRÍTICOS ({len(crits)}):")
        for n, nm, d in crits:
            print(f"   CHECK {n} ({nm}): {truncate(d, 100)}")
        print(f"\n🔴 HAY ERRORES CRÍTICOS — corregir antes de jugar")
        sys.exit(1)
    elif counts["WARNING"] > 0:
        warns = [(n, nm, d) for n, nm, s, d in all_results if s == "WARNING"]
        print(f"\n⚠️  WARNINGS ({len(warns)}):")
        for n, nm, d in warns:
            print(f"   CHECK {n} ({nm}): {truncate(d, 100)}")
        print(f"\n⚠️  Hay warnings — revisar recomendado")
        sys.exit(0)
    else:
        print(f"\n✅ Todos los checks pasaron")
        sys.exit(0)


if __name__ == "__main__":
    main()
