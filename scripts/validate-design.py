#!/usr/bin/env python3
"""Validador de diseño de pruebas de escape room.

Ejecuta 12 checks mecánicos sobre JSONs de pruebas para detectar
problemas de diseño: seguridad, consistencia, progresión, etc.

Uso:
    python3 validate-design.py <directorio_o_archivo> [directorio_o_archivo ...]
    python3 validate-design.py pruebas/  # todos los .json del dir
    python3 validate-design.py prueba-001.json prueba-002.json

Salida:
    - Código 0: sin CRITICAL
    - Código 1: al menos un CRITICAL (bloquea PDF en build.sh)
"""

import json
import os
import re
import sys
from pathlib import Path

# ── Palabras comunes del español (top ~1000) ──────────────────────────────────
# Lista compacta de las más frecuentes para detectar códigos débiles.
PALABRAS_COMUNES_ES = {
    "que", "de", "no", "la", "el", "en", "y", "a", "los", "se", "del", "las",
    "por", "un", "para", "con", "una", "su", "al", "lo", "como", "más", "pero",
    "sus", "le", "ya", "o", "este", "sí", "porque", "esta", "entre", "cuando",
    "muy", "sin", "sobre", "también", "me", "hasta", "hay", "donde", "han",
    "quien", "ser", "tiene", "está", "podrá", "todo", "nos", "ni", "uno",
    "les", "ese", "eso", "fue", "cada", "dos", "puede", "solo", "más", "ya",
    "hace", "nos", "tiempo", "sido", "tiene", "otro", "va", "año", "bien",
    "mundo", "vida", "forma", "país", "hombre", "mujer", "agua", "casa",
    "tierra", "día", "mano", "parte", "nombre", "hijo", "madre", "padre",
    "obra", "cabeza", "palabra", "tiempo", "vez", "fin", "guerra", "lugar",
    "nuevo", "gran", "general", "nosotros", "pueblo", "muerte", "ley", "gobierno",
    "cosa", "todo", "hombre", "bien", "año", "dar", "cuerpo", "ser", "hacer",
    "decir", "ver", "poder", "ir", "gran", "hombre", "mujer", "tiempo", "año",
    "forma", "casa", "noche", "amor", "vida", "hijo", "ciudad", "libro", "obra",
    "arte", "amor", "ley", "palabra", "fin", "guerra", "luz", "sol", "mar",
    "cielo", "piedra", "fuego", "aire", "pan", "vino", "camino", "puerta",
    "ventana", "mesa", "silla", "cama", "jardín", "flor", "árbol", "rio",
    "perro", "gato", "caballo", "toro", "león", "loro", "pez", "pájaro",
    "abrir", "cerrar", "entrar", "salir", "subir", "bajar", "andar", "correr",
    "saltar", "comer", "beber", "dormir", "vivir", "morir", "nacer", "crecer",
    "saber", "querer", "pensar", "sentir", "creer", "hablar", "escuchar", "ver",
    "leer", "escribir", "jugar", "trabajar", "estudiar", "aprender", "enseñar",
    "rojo", "azul", "verde", "blanco", "negro", "amarillo", "gris", "morado",
    "fraude", "perfil", "clave", "datos", "paz", "verdad", "mentira", "libre",
    "secreto", "mensaje", "prueba", "juego", "historia", "cuento", "musica",
    "numero", "letra", "papel", "carta", "llave", "puerta", "codigo",
    "shadow", "light", "dark", "fire", "ice", "storm", "magic", "sword",
    "king", "queen", "love", "hate", "life", "death", "hope", "fear",
    "open", "close", "lock", "key", "door", "code", "pass", "word",
    "hola", "adios", "siempre", "nunca", "tarde", "temprano", "ahora",
    "antes", "despues", "aqui", "alla", "arriba", "abajo", "dentro", "fuera",
    "cien", "mil", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete",
    "ocho", "nueve", "diez", "cero", "primero", "ultimo", "norte", "sur",
    "este", "oeste", "isla", "playa", "monte", "valle", "lago", "bosque",
    "tren", "avion", "barco", "coche", "autobus", "bici", "mapa", "ruta",
    "foto", "video", "pelicula", "radio", "tele", "web", "app", "bot",
    "test", "check", "stop", "go", "ok", "yes", "no", "hi", "bye",
    "super", "mega", "ultra", "mini", "micro", "max", "top", "best",
    "time", "date", "year", "month", "week", "day", "hour", "min",
    "play", "win", "lose", "draw", "team", "game", "point", "goal",
}


def load_json(filepath):
    """Carga un JSON y devuelve (data, error_msg)."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f), None
    except (json.JSONDecodeError, OSError) as e:
        return None, str(e)


def get_code(data):
    """Extrae el código de la prueba desde barrera_fisica.codigo o campos similares."""
    sources = []
    if "barrera_fisica" in data:
        bf = data["barrera_fisica"]
        if "codigo" in bf:
            sources.append(bf["codigo"])
    if "codigo" in data:
        sources.append(data["codigo"])
    if "configuracion" in data:
        cfg = data["configuracion"]
        if "codigo_candado" in cfg:
            sources.append(cfg["codigo_candado"])
        # Buscar en fases
        for key in cfg:
            if key.startswith("fase_") and isinstance(cfg[key], dict):
                if "codigo_candado" in cfg[key]:
                    sources.append(cfg[key]["codigo_candado"])
    return sources[0] if sources else None


def get_all_text_fields(data):
    """Recopila todos los textos donde buscar códigos visibles."""
    texts = []

    # Pistas (solo nivel 1 y 2 — nivel 3 es el último recurso por diseño)
    for pista in data.get("pistas", []):
        if "texto" in pista and pista.get("nivel", 3) < 3:
            texts.append((f"pista nivel {pista.get('nivel', '?')}", pista["texto"]))

    # Configuracion.mecanica_principal (excluir — es doc del GM)
    # cfg = data.get("configuracion", {})
    # if "mecanica_principal" in cfg:
    #     texts.append(("configuracion.mecanica_principal", cfg["mecanica_principal"]))

    # Solucion (excluir — es doc del GM, no visible por jugadores)
    # sol = data.get("solucion", {})
    # if "descripcion" in sol:
    #     texts.append(("solucion.descripcion", sol["descripcion"]))
    # for paso in sol.get("pasos_detallados", []):
    #     texts.append(("solucion.pasos_detallados", paso))

    # Documentos in-game (SI son visibles por jugadores)
    for doc in data.get("ingame_docs", []) + data.get("documentos_in_game", []):
        if "texto" in doc:
            texts.append((f"documento '{doc.get('titulo', '?')}'", doc["texto"]))

    # Narrativa HTML / pasos HTML (excluir — son docs del GM)
    # for key in ("narrativa_html", "pasos_html"):
    #     if key in data:
    #         clean = re.sub(r"<[^>]+>", " ", data[key])
    #         texts.append((key, clean))

    return texts


def get_fases(data):
    """Extrae fases del JSON. Busca en configuracion y en nivel raíz."""
    fases = []
    cfg = data.get("configuracion", {})
    for key in sorted(cfg.keys()):
        if key.startswith("fase_") and isinstance(cfg[key], dict):
            fases.append((key, cfg[key]))
    return fases


# ── CHECKS ────────────────────────────────────────────────────────────────────

def check_1_fuerza_bruta(data, code):
    """
    CHECK 1 — Fuerza bruta de código
    - Numérico 4 dígitos: si pistas reducen espacio a <100 → WARNING
    - Palabra: si está en top 1000 español → WARNING
    - Palabra <5 letras → WARNING
    """
    if not code:
        return "SKIP", "Sin código definido"

    # Numérico
    if code.isdigit():
        digits = len(code)
        total = 10 ** digits
        if digits == 4:
            return "OK", f"{total:,} combinaciones, >30 min probando a 5/s"
        elif digits <= 3:
            return "INFO", f"Solo {total:,} combinaciones ({digits} dígitos), vulnerable a fuerza bruta"
        else:
            return "OK", f"{total:,} combinaciones ({digits} dígitos)"

    # Alfabético
    word = code.upper()
    if len(word) < 5:
        return "INFO", f"Palabra corta ({len(word)} letras), fácil de adivinar"
    if word.lower() in PALABRAS_COMUNES_ES:
        return "INFO", f"'{word}' está en las palabras más comunes del español"
    return "OK", f"Palabra de {len(word)} letras, no en top común"


def check_2_codigo_visible(data, code):
    """
    CHECK 2 — Código visible en textos
    Busca el código exacto y variaciones en pistas, documentos, descripciones.
    CRITICAL si aparece en pistas nivel 1 o 2.
    """
    if not code:
        return "SKIP", "Sin código definido"

    texts = get_all_text_fields(data)
    if not texts:
        return "SKIP", "Sin textos para buscar"

    # Generar variaciones
    variations = [code, code.upper(), code.lower()]
    if len(code) >= 2:
        # Separar con guiones y espacios: "3621" → "3-6-2-1", "3 6 2 1"
        variations.append("-".join(code))
        variations.append(" ".join(code))
        # Pares: "36-21"
        if len(code) >= 4:
            mid = len(code) // 2
            variations.append(f"{code[:mid]}-{code[mid:]}")
            variations.append(f"{code[:mid]} {code[mid:]}")

    found = []
    for location, text in texts:
        for var in variations:
            if var in text:
                level_match = re.search(r"nivel (\d+)", location)
                level = int(level_match.group(1)) if level_match else None
                if level and level <= 2:
                    found.append(("CRITICAL", location, var))
                else:
                    found.append(("WARNING", location, var))
                break  # una coincidencia por location es suficiente

    if not found:
        return "OK", "Código no encontrado en textos"

    worst = min(found, key=lambda x: 0 if x[0] == "CRITICAL" else 1)
    details = "; ".join(f"'{v}' en {l}" for s, l, v in found)
    return worst[0], f"Código visible: {details}"


def check_3_unicidad(data, code):
    """
    CHECK 3 — Unicidad de solución
    Para clasificación: verificar que las letras "basura" no forman otra palabra válida.
    Para numéricos: heurística básica.
    """
    if not code:
        return "SKIP", "Sin código definido"

    cfg = data.get("configuracion", {})
    skill = data.get("skill_primario", "")

    if "clasificacion" in skill:
        # Buscar letras basura en la configuración
        all_letters = set()
        for key in cfg:
            if isinstance(cfg[key], dict) and "tarjetas" in cfg[key]:
                for t in cfg[key]["tarjetas"]:
                    if isinstance(t, dict) and "letra" in t:
                        all_letters.add(t["letra"].upper())
            if isinstance(cfg[key], dict) and "fotos" in cfg[key]:
                for t in cfg[key]["fotos"]:
                    if isinstance(t, dict) and "letra" in t:
                        all_letters.add(t["letra"].upper())

        if all_letters:
            code_letters = set(code.upper())
            basura = all_letters - code_letters
            if basura and len(basura) >= len(code_letters):
                # Podrían formar otra palabra de la misma longitud
                return "WARNING", f"{len(basura)} letras basura podrían formar alternativa"
            return "OK", f"Letras basura ({len(basura)}) insuficientes para alternativa"

    # Numérico: WARNING genérico si no hay pistas que reduzcan espacio
    if code.isdigit() and len(code) == 4:
        return "OK", "10,000 combinaciones, ambigüedad baja sin pistas"

    return "OK", "Sin ambigüedad obvia detectada"


def check_4_consistencia_codigo(data, code):
    """
    CHECK 4 — Consistencia de código
    barrera_fisica.codigo vs configuracion.codigo_candado vs solucion.verificacion
    """
    if not code:
        return "SKIP", "Sin código definido"

    codes = {"barrera_fisica.codigo": None, "configuracion.codigo_candado": None}

    if "barrera_fisica" in data and "codigo" in data["barrera_fisica"]:
        codes["barrera_fisica.codigo"] = data["barrera_fisica"]["codigo"]

    cfg = data.get("configuracion", {})
    if "codigo_candado" in cfg:
        codes["configuracion.codigo_candado"] = cfg["codigo_candado"]
    # Buscar en fases
    for key in cfg:
        if key.startswith("fase_") and isinstance(cfg[key], dict):
            if "codigo_candado" in cfg[key]:
                codes[f"configuracion.{key}.codigo_candado"] = cfg[key]["codigo_candado"]

    # Raíz
    if "codigo" in data:
        codes["codigo (raíz)"] = data["codigo"]

    # Verificación en solución
    sol = data.get("solucion", {})
    if "verificacion" in sol:
        codes["solucion.verificacion"] = sol["verificacion"]

    # Normalizar: extraer códigos de textos
    extracted = {}
    for name, val in codes.items():
        if val is None:
            continue
        # Si es texto, buscar el código o palabra clave
        if code.upper() in str(val).upper():
            extracted[name] = code
        else:
            extracted[name] = val

    # Verificar consistencia
    values = set()
    for name, val in extracted.items():
        # Normalizar para comparación
        normalized = val.upper().strip() if isinstance(val, str) else val
        if normalized == code.upper():
            continue  # coincide con el código principal
        if normalized not in values:
            values.add((name, normalized))

    if not values:
        return "OK", "Todos los campos de código coinciden"

    # Filter out non-code values (descriptions, instructions)
    code_values = [(n, v) for n, v in values if len(str(v)) <= 20 and any(c.isdigit() or c.isalpha() for c in str(v) if c != ' ')]
    if not code_values:
        return "OK", "Todos los campos de código coinciden"
    discrepancies = [f"{n}='{v}'" for n, v in code_values]
    return "CRITICAL", f"Discrepancias: {', '.join(discrepancies)}"


def check_5_pistas_nivel3(data, code):
    """
    CHECK 5 — Pistas nivel 3 revelan demasiado
    Nivel 3 debería dar casi la solución, no LA solución.
    """
    pistas = data.get("pistas", [])
    nivel3 = [p for p in pistas if p.get("nivel") == 3]
    if not nivel3:
        return "SKIP", "No hay pistas nivel 3"

    if not code:
        return "SKIP", "Sin código definido"

    for p in nivel3:
        texto = p.get("texto", "")
        # Si el código aparece literalmente en la pista nivel 3
        if code.upper() in texto.upper():
            return "INFO", "Pista nivel 3 contiene el código directamente (esperado — último recurso)"

        # Heurística: si la pista describe el paso exacto sin deducción
        words_lower = texto.lower()
        direct_phrases = ["código es", "password es", "la respuesta es", "introducid", "escribid"]
        for phrase in direct_phrases:
            if phrase in words_lower:
                return "INFO", f"Pista nivel 3 contiene instrucción directa ('{phrase}') (esperado — último recurso)"

    return "OK", "Pista nivel 3 no revela directamente la solución"


def check_6_pistas_progresion(data, code):
    """
    CHECK 6 — Pistas progresión
    - Al menos 2 niveles de pistas
    - Sin duplicados en el mismo nivel
    """
    pistas = data.get("pistas", [])
    if not pistas:
        return "WARNING", "No hay pistas definidas"

    niveles = set(p.get("nivel") for p in pistas)
    if len(niveles) < 2:
        return "WARNING", f"Solo {len(niveles)} nivel(es) de pistas, se recomienda ≥2"

    # Duplicados
    for nivel in niveles:
        textos_nivel = [p.get("texto", "") for p in pistas if p.get("nivel") == nivel]
        seen = set()
        for t in textos_nivel:
            if t in seen:
                return "WARNING", f"Texto duplicado en nivel {nivel}"
            seen.add(t)

    return "OK", f"{len(niveles)} niveles de pistas, sin duplicados"


def check_7_fases(data, code):
    """
    CHECK 7 — Fases vacías o redundantes
    - Fases con duración < 1 min → WARNING
    - Fases sin descripción → WARNING
    """
    fases = get_fases(data)
    if not fases:
        return "SKIP", "No se encontraron fases"

    issues = []
    for name, fase in fases:
        dur = fase.get("duracion_minutos")
        if dur is not None and dur < 1:
            issues.append(f"{name}: duración {dur} min")

        desc = fase.get("descripcion", "")
        if not desc or len(desc.strip()) < 10:
            issues.append(f"{name}: sin descripción significativa")

    if issues:
        return "WARNING", "; ".join(issues)

    return "OK", f"{len(fases)} fases con duración y descripción adecuadas"


def check_8_tiempo_fases(data, code):
    """
    CHECK 8 — Tiempo total vs suma de fases
    Si difiere >50% → WARNING
    """
    total = data.get("duracion_estimada_minutos")
    if total is None:
        total = data.get("tiempo")
    if total is None:
        return "SKIP", "No hay duración_estimada_minutos"

    fases = get_fases(data)
    if not fases:
        return "SKIP", "No hay fases para comparar"

    suma_fases = sum(f.get("duracion_minutos", 0) for _, f in fases)
    if suma_fases == 0:
        return "SKIP", "Fases sin duración definida"

    diff_pct = abs(total - suma_fases) / max(total, suma_fases) * 100
    if diff_pct > 50:
        return "WARNING", f"Total={total} min, suma fases={suma_fases} min (diferencia {diff_pct:.0f}%)"

    return "OK", f"Total={total} min, suma fases={suma_fases} min (diferencia {diff_pct:.0f}%)"


def check_9_elementos_materiales(data, code):
    """
    CHECK 9 — Elementos necesarios vs materiales
    Verifica que todo en elementos_necesarios aparece en materiales.
    """
    cfg = data.get("configuracion", {})
    elementos = cfg.get("elementos_necesarios", [])
    if not elementos:
        return "SKIP", "No hay elementos_necesarios"

    mats = data.get("materiales", {})
    material_texts = []
    for item in mats.get("impresion", []):
        material_texts.append(item.lower())
    for item in mats.get("extras", []):
        material_texts.append(item.lower())
    for item in mats.get("mobiliario", []):
        material_texts.append(item.lower())

    if not material_texts:
        return "SKIP", "No hay materiales definidos"

    all_materials = " ".join(material_texts)

    missing = []
    for elem in elementos:
        # Extraer palabras clave del elemento (ignorar cantidades)
        elem_lower = elem.lower()
        # Buscar al menos el concepto principal
        # Tomar palabras de >3 letras como keywords
        keywords = [w for w in re.findall(r"[a-záéíóúñü]+", elem_lower) if len(w) > 3]
        if not keywords:
            keywords = [elem_lower.strip()]

        found_any = False
        for kw in keywords:
            if kw in all_materials:
                found_any = True
                break
        if not found_any:
            missing.append(elem.strip()[:60])

    if missing:
        return "WARNING", f"Sin cobertura en materiales: {'; '.join(missing[:3])}"

    return "OK", f"{len(elementos)} elementos cubiertos en materiales"


def check_10_dificultad_complejidad(data, code):
    """
    CHECK 10 — Dificultad vs complejidad
    - Dificultad < 3 pero deducción compleja → WARNING
    - Dificultad > 7 pero puzzle trivial → WARNING
    """
    diff = data.get("dificultad")
    if diff is None:
        return "SKIP", "No hay dificultad definida"

    if not code:
        return "SKIP", "Sin código definido"

    # Heurísticas de complejidad
    is_complex = False
    is_trivial = False

    # Complejo: palabra larga + clasificación + ordenamiento
    if len(code) >= 5 and "clasificacion" in data.get("skill_primario", ""):
        is_complex = True

    # Complejo: código numérico que requiere deducción multi-paso
    if code.isdigit() and len(code) >= 4:
        pistas = data.get("pistas", [])
        niveles = set(p.get("nivel") for p in pistas)
        if len(niveles) >= 3:
            is_complex = True

    # Trivial: código de 1-3 letras/dígitos
    if len(code) <= 3:
        is_trivial = True

    if diff < 3 and is_complex:
        return "WARNING", f"Dificultad {diff} pero puzzle requiere deducción compleja"
    if diff > 7 and is_trivial:
        return "WARNING", f"Dificultad {diff} pero puzzle es trivial"

    return "OK", f"Dificultad {diff} coherente con la complejidad del puzzle"


def check_11_hilo_conductor(data, code):
    """
    CHECK 11 — Consistencia hilo conductor
    - hilo_conductor.posición debe ser consecutiva
    - solucion.recompensa.letra debe coincidir con hilo_conductor.letra
    """
    hc = data.get("hilo_conductor")
    if not hc:
        return "SKIP", "No hay hilo_conductor"

    issues = []

    # Letra recompensa vs hilo conductor
    sol = data.get("solucion", {})
    rec = sol.get("recompensa", {})
    rec_letra = rec.get("letra")
    hc_letra = hc.get("letra")

    if rec_letra and hc_letra:
        if rec_letra.upper() != hc_letra.upper():
            issues.append(f"recompensa.letra='{rec_letra}' ≠ hilo_conductor.letra='{hc_letra}'")

    # Posición (no podemos verificar consecutividad sin ver todas las pruebas)
    pos = hc.get("posicion")
    if pos is not None:
        if pos < 1:
            issues.append(f"posición {pos} inválida (debe ser ≥1)")

    if issues:
        return "WARNING", "; ".join(issues)

    return "OK", f"Hilo conductor: letra={hc_letra}, posición={pos}"


def check_12_documentos_citados(data, code):
    """
    CHECK 12 — Documentos in-game citados en mecánica
    Si mecánica menciona documento/hoja/tabla, verificar que existen.
    """
    cfg = data.get("configuracion", {})
    mecanica = cfg.get("mecanica_principal", "")
    if not mecanica:
        return "SKIP", "No hay mecánica_principal"

    # Buscar menciones a documentos
    doc_keywords = ["documento", "hoja", "tabla", "panel", "póster", "poster", "cartel", "instrucciones"]
    menciones = [kw for kw in doc_keywords if kw.lower() in mecanica.lower()]

    if not menciones:
        return "OK", "Mecánica no menciona documentos explícitos"

    # Verificar que existen en materiales o documentos in-game
    mats = data.get("materiales", {})
    mat_texts = " ".join(mats.get("impresion", []))
    mat_texts += " " + " ".join(mats.get("extras", []))

    docs = data.get("ingame_docs", [])
    doc_titles = " ".join(d.get("titulo", "") for d in docs)

    all_available = (mat_texts + " " + doc_titles).lower()

    missing = []
    for kw in menciones:
        if kw not in all_available:
            missing.append(f"'{kw}'")

    if missing:
        return "WARNING", f"Mencionados en mecánica pero no encontrados en materiales/docs: {', '.join(missing)}"

    return "OK", f"Menciones ({', '.join(menciones)}) cubiertas en materiales/docs"


# ── MAIN ──────────────────────────────────────────────────────────────────────

CHECKS = [
    (1, "Fuerza bruta", "ℹ️", check_1_fuerza_bruta),
    (2, "Código visible", "🔴", check_2_codigo_visible),
    (3, "Unicidad", "🔴", check_3_unicidad),
    (4, "Consistencia código", "🔴", check_4_consistencia_codigo),
    (5, "Pistas nivel 3", "ℹ️", check_5_pistas_nivel3),
    (6, "Pistas progresión", "🟡", check_6_pistas_progresion),
    (7, "Fases", "🟡", check_7_fases),
    (8, "Tiempo vs fases", "🟡", check_8_tiempo_fases),
    (9, "Elementos vs materiales", "🟡", check_9_elementos_materiales),
    (10, "Dificultad vs complejidad", "🟢", check_10_dificultad_complejidad),
    (11, "Hilo conductor", "🟢", check_11_hilo_conductor),
    (12, "Documentos citados", "🟢", check_12_documentos_citados),
]


def validate_file(filepath):
    """Valida un único JSON y devuelve (results, has_critical)."""
    data, err = load_json(filepath)
    if err:
        return [(None, None, "ERROR", f"No se pudo cargar: {err}")], False

    code = get_code(data)
    results = []

    for num, name, icon, check_fn in CHECKS:
        try:
            status, detail = check_fn(data, code)
        except Exception as e:
            status, detail = "ERROR", f"Excepción: {e}"
        results.append((num, name, icon, status, detail))

    has_critical = any(r[3] == "CRITICAL" for r in results)
    return results, has_critical


def print_results(filepath, results, has_critical):
    """Imprime los resultados de un archivo."""
    print(f"\n{'='*60}")
    print(f"Prueba: {os.path.basename(filepath)}")
    print(f"{'='*60}")

    for num, name, icon, status, detail in results:
        icon_map = {"OK": "✅", "WARNING": "⚠️", "INFO": "ℹ️", "CRITICAL": "🔴", "SKIP": "⏭️", "ERROR": "❌"}
        prefix = icon_map.get(status, "❓")
        print(f"{prefix} CHECK {num}: {name} — {status}")
        if detail:
            print(f"   {detail}")


def main():
    if len(sys.argv) < 2:
        print("Uso: validate-design.py <directorio_o_archivo> [...]")
        sys.exit(2)

    paths = []
    for arg in sys.argv[1:]:
        p = Path(arg)
        if p.is_dir():
            paths.extend(sorted(p.glob("*.json")))
            paths = [p for p in paths if p.name != "review-results.json"]
        elif p.is_file():
            paths.append(p)
        else:
            print(f"❌ No encontrado: {arg}", file=sys.stderr)
            sys.exit(1)

    if not paths:
        print("❌ No se encontraron JSONs", file=sys.stderr)
        sys.exit(1)

    print("╔══════════════════════════════════════════════════════╗")
    print("║  VALIDADOR DE DISEÑO — Escape Room                  ║")
    print("╚══════════════════════════════════════════════════════╝")

    total_critical = 0
    total_warning = 0
    total_ok = 0
    total_skip = 0
    total_error = 0
    any_critical = False

    for filepath in paths:
        results, has_critical = validate_file(filepath)
        print_results(filepath, results, has_critical)

        counts = {"OK": 0, "WARNING": 0, "INFO": 0, "CRITICAL": 0, "SKIP": 0, "ERROR": 0}
        for r in results:
            counts[r[3]] = counts.get(r[3], 0) + 1

        total_critical += counts["CRITICAL"]
        total_warning += counts["WARNING"]
        total_ok += counts["OK"]
        total_skip += counts["SKIP"]
        total_error += counts["ERROR"]

        if has_critical:
            any_critical = True

        print(f"\n   Resumen: {counts['CRITICAL']} CRITICAL, {counts['WARNING']} WARNING, {counts['OK']} OK, {counts['SKIP']} SKIP")

    print(f"\n{'='*60}")
    print(f"TOTAL: {total_critical} CRITICAL, {total_warning} WARNING, {total_ok} OK, {total_skip} SKIP")
    print(f"{'='*60}")

    if any_critical:
        print("🔴 HAY ERRORES CRÍTICOS — corregir antes de generar PDF")
        sys.exit(1)
    elif total_warning > 0:
        print("⚠️  Hay warnings — revisar recomendado pero no bloquea PDF")
        sys.exit(0)
    else:
        print("✅ Todos los checks pasaron")
        sys.exit(0)


if __name__ == "__main__":
    main()
