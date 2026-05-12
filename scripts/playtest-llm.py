#!/usr/bin/env python3
"""
Playtest LLM híbrido para escape rooms.

Simula jugadores reales con Gemini/Ollama para evaluar pruebas de escape room.
Complementa el playtest determinista (playtest-simulado.py).

Usage:
    python3 playtest-llm.py <game.json>
    python3 playtest-llm.py <game.json> --no-cache
    python3 playtest-llm.py <game.json> --output report.json

Exit codes:
    0  OK
    1  Problemas significativos detectados
    2  LLM unavailable or usage error
"""

import json
import os
import sys
import hashlib
import urllib.request
import urllib.error
import re
from datetime import datetime, timezone

# ── API Config (reused from review-design.py) ──────────────────────────────

DEFAULT_MODEL = "llama3"
OLLAMA_BASE = "http://localhost:11434/v1"
DEFAULT_TIMEOUT = 30

GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/openai/"
GEMINI_MODEL = "gemini-2.5-flash"


def get_api_config():
    """Detect available API: Gemini → Ollama local → env vars → fail."""
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if gemini_key:
        return GEMINI_BASE, gemini_key, GEMINI_MODEL

    try:
        req = urllib.request.Request(f"{OLLAMA_BASE}/models", method="GET")
        with urllib.request.urlopen(req, timeout=5) as resp:
            if resp.status == 200:
                return OLLAMA_BASE, "ollama", DEFAULT_MODEL
    except Exception:
        pass

    base = os.environ.get("OPENAI_BASE_URL") or os.environ.get("OPENAI_API_BASE") or ""
    key = os.environ.get("OPENAI_API_KEY") or os.environ.get("OPENCODE_API_KEY") or ""
    if base and key:
        model = os.environ.get("REVIEW_MODEL", "gpt-4o-mini")
        return base, key, model

    return None, None, None


def call_llm(base, key_or_type, model, prompt, timeout=DEFAULT_TIMEOUT, json_mode=False):
    """Call OpenAI-compatible chat completions API."""
    url = f"{base.rstrip('/')}/chat/completions"
    body = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 8000,
    }
    if json_mode:
        body["response_format"] = {"type": "json_object"}
    payload = json.dumps(body).encode()

    headers = {"Content-Type": "application/json"}
    if key_or_type != "ollama":
        headers["Authorization"] = f"Bearer {key_or_type}"

    req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = json.loads(resp.read())
            return data["choices"][0]["message"]["content"]
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")[:200]
        raise RuntimeError(f"API error {e.code}: {body}")
    except Exception as e:
        raise RuntimeError(f"API call failed: {e}")


# ── JSON extraction (reused from review-design.py) ────────────────────────

def _fix_trailing_commas(text):
    return re.sub(r',\s*([}\]])', r'\1', text)


def _fix_single_quotes(text):
    result, in_d, i = [], False, 0
    while i < len(text):
        c = text[i]
        if c == '\\' and i + 1 < len(text):
            result.extend([c, text[i + 1]]); i += 2; continue
        if c == '"': in_d = not in_d; result.append(c)
        elif c == "'" and not in_d: result.append('"')
        else: result.append(c)
        i += 1
    return ''.join(result)


def _try_parse_json(text):
    for fn in [lambda x: x, _fix_trailing_commas, lambda x: _fix_trailing_commas(_fix_single_quotes(x))]:
        try: return json.loads(fn(text))
        except (json.JSONDecodeError, ValueError): continue
    return None


def extract_json(text):
    """Extract JSON from potentially messy LLM response."""
    if not text or not text.strip():
        raise ValueError("Empty response")
    text = re.sub(r"```json?\s*", "", text).strip()
    text = re.sub(r"```", "", text).strip()

    # Find largest { ... } block
    candidates, depth, start = [], 0, None
    for i, c in enumerate(text):
        if c == '{':
            if depth == 0: start = i
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0 and start is not None:
                candidates.append(text[start:i + 1]); start = None

    for candidate in sorted(candidates, key=len, reverse=True):
        result = _try_parse_json(candidate)
        if result: return result

    s, e = text.find("{"), text.rfind("}")
    if s != -1 and e > s:
        result = _try_parse_json(text[s:e + 1])
        if result: return result
    raise ValueError("No JSON object found in response")


# ── Player profiles ────────────────────────────────────────────────────────

PERFILES = [
    {
        "nombre": "Estudiante",
        "emoji": "🧑‍🎓",
        "descripcion": "Estudiante de 14 años, nivel normal — ni muy listo ni muy lento. Va con 3 amigos del instituto.",
    },
    {
        "nombre": "Experimentado",
        "emoji": "🏆",
        "descripcion": "Jugador experimentado que ha hecho 5+ escape rooms. Conoce los trucos típicos. Va con su grupo habitual de 4.",
    },
    {
        "nombre": "Novato",
        "emoji": "🐣",
        "descripcion": "Primera vez en un escape room. Se distrae fácilmente con los decorados. Va con 3 amigos que tampoco han ido antes.",
    },
]

PLAYER_PROMPT = """Eres {descripcion}

Vas a recibir la descripción completa de una prueba de escape room. Simula tu experiencia paso a paso:
1. ¿Entiendes qué tienes que hacer al leer las instrucciones?
2. ¿Qué pasos seguirías? ¿En qué orden?
3. ¿Te atascarías en algún punto? ¿Dónde?
4. ¿Pedirías pista? ¿En qué momento?
5. ¿Te divertiría? ¿Qué te gustaría más?

Sé realista. Si no entiendes algo, dilo. Si te frustras, dilo. Si te aburres, dilo.

Responde en JSON con esta estructura exacta:
{{"entiende": true, "confusiones": ["..."], "pasos_seguidos": ["..."], "atasque_en": "punto X" o null, "pidio_pista": true, "nivel_pista": 1, "frustracion": 5, "diversion": 7, "tiempo_estimado_minutos": 5, "comentario": "frase corta como jugador real"}}

IMPORTANTE: Responde SOLO con el objeto JSON. Sin texto antes ni después. Sin markdown ni backticks.

Aquí está la prueba:

{puzzle_json}"""

STRICT_RETRY = """

Tu respuesta anterior no fue JSON válido. Responde EXCLUSIVAMENTE con el objeto JSON. Sin texto, sin markdown, sin backticks. Debe empezar con {{ y terminar con }}."""


# ── Cache ──────────────────────────────────────────────────────────────────

def load_cache(cache_path):
    if os.path.exists(cache_path):
        with open(cache_path, "r") as f:
            return json.load(f)
    return {}


def save_cache(cache_path, cache):
    os.makedirs(os.path.dirname(cache_path) or ".", exist_ok=True)
    with open(cache_path, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)


def puzzle_hash(puzzle_data):
    return hashlib.md5(json.dumps(puzzle_data, sort_keys=True, ensure_ascii=False).encode()).hexdigest()


# ── Core ───────────────────────────────────────────────────────────────────

def playtest_puzzle(base, key_or_type, model, puzzle_data, puzzle_id, use_cache=True, cache_path=None):
    """Playtest a single puzzle with all profiles. Returns (results_list, errors)."""
    current_hash = puzzle_hash(puzzle_data)

    # Check cache
    if use_cache and cache_path:
        cache = load_cache(cache_path)
        cached = cache.get(puzzle_id)
        if cached and cached.get("hash") == current_hash:
            return cached["resultados"], []

    puzzle_json = json.dumps(puzzle_data, ensure_ascii=False, indent=2)
    results = []
    errors = []

    for perfil in PERFILES:
        prompt = PLAYER_PROMPT.format(
            descripcion=perfil["descripcion"],
            puzzle_json=puzzle_json,
        )

        raw = None
        for attempt in range(3):
            try:
                raw = call_llm(base, key_or_type, model, prompt,
                               json_mode=(attempt < 2),
                               timeout=DEFAULT_TIMEOUT)
                result = extract_json(raw)
                # Normalize fields
                result.setdefault("entiende", True)
                result.setdefault("confusiones", [])
                result.setdefault("pasos_seguidos", [])
                result.setdefault("atasque_en", None)
                result.setdefault("pidio_pista", False)
                result.setdefault("nivel_pista", None)
                result.setdefault("frustracion", 5)
                result.setdefault("diversion", 5)
                result.setdefault("tiempo_estimado_minutos", 5)
                result.setdefault("comentario", "")
                result["_perfil"] = perfil["nombre"]
                result["_emoji"] = perfil["emoji"]
                results.append(result)
                break
            except Exception as e:
                if attempt < 2:
                    prompt = prompt + STRICT_RETRY
                else:
                    errors.append(f"{perfil['nombre']}: {e}")
                    results.append({
                        "_perfil": perfil["nombre"],
                        "_emoji": perfil["emoji"],
                        "entiende": None, "error": str(e),
                        "frustracion": 0, "diversion": 0,
                        "tiempo_estimado_minutos": 0, "comentario": "Error: no se pudo obtener respuesta",
                    })

    # Save to cache
    if use_cache and cache_path:
        cache = load_cache(cache_path)
        cache[puzzle_id] = {"hash": current_hash, "resultados": results}
        save_cache(cache_path, cache)

    return results, errors


def print_report(game_name, all_results):
    """Print formatted playtest report."""
    print()
    print(f"🧠 PLAYTEST LLM — {game_name}")
    print("━" * 50)

    total_comp, total_div, total_frust, count = 0, 0, 0, 0
    problemas = []

    for puzzle_name, results in all_results:
        print()
        print(f"P{len(problemas) + 1}: {puzzle_name}")

        for r in results:
            perfil = r.get("_perfil", "?")
            emoji = r.get("_emoji", "👤")
            error = r.get("error")

            if error:
                print(f"  {emoji} {perfil}: ❌ {error}")
                continue

            entiende = r.get("entiende")
            if entiende is True:
                ent_str = "✅ Entiende"
            elif entiende is False:
                ent_str = "❌ No entiende"
                problemas.append(f"{puzzle_name}: {perfil} no entiende la prueba")
            else:
                ent_str = "⚠️ No entiende del todo"
                problemas.append(f"{puzzle_name}: {perfil} no entiende bien")

            tiempo = r.get("tiempo_estimado_minutos", 0)
            divers = r.get("diversion", 0)
            frust = r.get("frustracion", 0)

            print(f"  {emoji} {perfil}: {ent_str} | ⏱️ {tiempo} min | 🎉 diversión: {divers}/10 | 😤 frustración: {frust}/10")

            comentario = r.get("comentario", "")
            if comentario:
                print(f'     "{comentario}"')

            confusiones = r.get("confusiones", [])
            for c in confusiones[:2]:
                print(f"     ⚠️ Confusión: {c}")

            atasque = r.get("atasque_en")
            if atasque:
                print(f"     🚧 Atasco en: {atasque}")
                problemas.append(f"{puzzle_name}: {perfil} se atasca en '{atasque}'")

            # Stats
            count += 1
            total_comp += 1 if entiende else 0
            total_div += divers
            total_frust += frust

        # Per-puzzle issues
        tiempos = [r.get("tiempo_estimado_minutos", 0) for r in results if not r.get("error")]
        if tiempos:
            max_t = max(tiempos)
            if max_t >= 10:
                problemas.append(f"{puzzle_name}: tiempo máximo {max_t} min (posible cuello de botella)")
            if max_t <= 2 and len(tiempos) > 1:
                problemas.append(f"{puzzle_name}: demasiado fácil ({max_t} min para el más rápido)")

    # Summary
    print()
    print("━" * 50)
    print("📊 RESUMEN")

    if count > 0:
        comp_pct = total_comp / count * 100
        avg_div = total_div / count
        avg_frust = total_frust / count
        print(f"  Comprensión media: {comp_pct:.0f}%")
        print(f"  Diversión media: {avg_div:.1f}/10")
        print(f"  Frustración media: {avg_frust:.1f}/10")
    else:
        print("  No hay datos suficientes")
        return []

    if problemas:
        print()
        print("⚠️ PROBLEMAS:")
        for i, p in enumerate(problemas, 1):
            print(f"  {i}. {p}")

    print()
    return problemas


# ── Main ───────────────────────────────────────────────────────────────────

def main():
    import argparse

    parser = argparse.ArgumentParser(description="Playtest LLM híbrido para escape rooms")
    parser.add_argument("game_json", help="Ruta al game.json")
    parser.add_argument("--no-cache", action="store_true", help="Ignorar cache")
    parser.add_argument("--output", "-o", help="Ruta para guardar reporte JSON")
    args = parser.parse_args()

    if not os.path.exists(args.game_json):
        print(f"❌ No encontrado: {args.game_json}")
        sys.exit(2)

    # Detect API
    api_base, api_key, model = get_api_config()
    if not api_base:
        print("⚠️  No se encontró API disponible. Opciones:")
        print("   1. export GEMINI_API_KEY=tu-key  (recomendado)")
        print("   2. ollama serve && ollama pull llama3")
        print("   3. export OPENAI_API_KEY=tu-key && export OPENAI_BASE_URL=http://...")
        print("\n⚠️  Soft fail: playtest LLM no disponible, usa playtest-simulado.py")
        sys.exit(2)

    print(f"🧠 Playtest LLM")
    print(f"   API: {api_base} | Model: {model}")

    # Load game
    game_dir = os.path.dirname(os.path.abspath(args.game_json))
    with open(args.game_json) as f:
        game = json.load(f)

    game_name = game.get("nombre", os.path.basename(game_dir))
    cache_path = os.path.join(game_dir, "juego", "pruebas", "playtest-llm-cache.json")
    if args.no_cache:
        cache_path = None

    # Load puzzles
    pruebas = []
    for p in game.get("pruebas", []):
        path = os.path.join(game_dir, "juego", "pruebas", p["archivo"])
        if os.path.exists(path):
            with open(path) as f:
                data = json.load(f)
            pruebas.append((data.get("nombre", p["archivo"]), data))

    if not pruebas:
        print("❌ No se encontraron pruebas en el game.json")
        sys.exit(2)

    print(f"   Pruebas: {len(pruebas)} | Perfiles: {len(PERFILES)} | Cache: {'OFF' if not cache_path else 'ON'}")

    # Run playtests
    all_results = []
    report_data = []
    for nombre, data in pruebas:
        pid = data.get("id", nombre)
        print(f"\n⏳ Evaluando: {nombre}...", end="", flush=True)
        results, errors = playtest_puzzle(api_base, api_key, model, data, pid,
                                           use_cache=(cache_path is not None),
                                           cache_path=cache_path)
        cached = " (cached)" if cache_path and not errors and load_cache(cache_path).get(pid, {}).get("hash") == puzzle_hash(data) else ""
        print(f" done{cached}")
        all_results.append((nombre, results))
        report_data.append({"nombre": nombre, "id": pid, "resultados": results, "errores": errors})

    # Print report
    problemas = print_report(game_name, all_results)

    # Save report
    output_path = args.output or os.path.join(game_dir, "juego", "pruebas", "playtest-llm-report.json")
    report = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "juego": game_name,
        "model": model,
        "pruebas": report_data,
        "problemas": problemas,
    }
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print(f"📄 Reporte guardado en: {output_path}")

    # Exit code
    if len(problemas) >= 3:
        print(f"❌ {len(problemas)} problemas detectados")
        sys.exit(1)
    elif problemas:
        print(f"⚠️  {len(problemas)} problemas menores")
        sys.exit(0)
    else:
        print("✅ Playtest LLM OK — sin problemas significativos")
        sys.exit(0)


if __name__ == "__main__":
    main()
