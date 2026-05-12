#!/usr/bin/env python3
"""
LLM Adversarial Reviewer for escape room puzzle designs.

Uses an OpenAI-compatible API (Ollama preferred, fallback configurable) to
critically evaluate each puzzle JSON for design flaws.

Usage:
    python3 review-design.py <pruebas_dir>
    python3 review-design.py <pruebas_dir> --model llama3
    python3 review-design.py <pruebas_dir> --api-base http://host:port/v1 --api-key sk-xxx
    SKIP_REVIEW=1 python3 review-design.py ...  # no-op, exits 0

Exit codes:
    0  All puzzles OK (no CRITICAL)
    1  At least one CRITICAL finding
    2  LLM unavailable or usage error
"""

import json
import os
import sys
import glob
import subprocess
import urllib.request
import urllib.error
import urllib.parse
import re
from datetime import datetime, timezone

# ── Config ────────────────────────────────────────────────────────────────────

DEFAULT_MODEL = "llama3"
OLLAMA_BASE = "http://localhost:11434/v1"
DEFAULT_TIMEOUT = 30  # seconds per puzzle


GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/openai/"
GEMINI_MODEL = "gemini-2.5-flash"


def get_api_config():
    """Detect available API: Gemini → Ollama local → env vars → fail."""
    # Try Gemini
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if gemini_key:
        return GEMINI_BASE, gemini_key, GEMINI_MODEL

    # Try Ollama
    try:
        req = urllib.request.Request(f"{OLLAMA_BASE}/models", method="GET")
        with urllib.request.urlopen(req, timeout=5) as resp:
            if resp.status == 200:
                return OLLAMA_BASE, "ollama", DEFAULT_MODEL
    except Exception:
        pass

    # Try env vars
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
        "temperature": 0.3,
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


ADVERSARIAL_PROMPT = """Eres un diseñador experto de escape rooms con 15 años de experiencia. Tu trabajo es ser CRÍTICO y EXIGENTE con cada prueba que revisas.

Vas a recibir el JSON de una prueba de escape room educativo para jugadores de {edad_minima}-{edad_maxima} años.

Evalúa cada uno de estos puntos. Para cada uno responde OK, WARNING o CRITICAL con una explicación breve (1 frase):

1. **¿Se puede saltar el puzzle?** Un jugador astuto que lee las instrucciones, pistas y documentos, ¿puede deducir el código SIN resolver realmente el puzzle? Si puede, es CRITICAL.

2. **¿La solución es única?** ¿Hay otra respuesta que también tendría sentido? Si hay ambigüedad real, es CRITICAL.

3. **¿Las pistas progresan bien?** ¿Cada nivel de pista da un poco más sin revelar todo? ¿O el salto de nivel 1 a 2 es demasiado grande? ¿El nivel 3 elimina todo el reto?

4. **¿El flujo es intuitivo?** ¿Un jugador de {edad_minima} años entiende qué hacer sin ayuda del GM? ¿Los pasos son lógicos?

5. **¿Narrativa y mecánica están integradas?** ¿La historia justifica lo que hacen los jugadores? ¿O es un puzzle con disfraz temático?

6. **¿Hay momentos "aha!"?** ¿Hay un momento de satisfacción cuando algo encaja? ¿O es todo trabajo mecánico?

7. **¿Las instrucciones in-game son claras?** ¿Un jugador puede malinterpretar las instrucciones de forma que lo lleve a una solución incorrecta?

8. **¿La dificultad es apropiada?** ¿Para la edad indicada, el puzzle es ni muy fácil ni muy frustrante?

9. **¿El timing es realista?** Con {jugadores_min}-{jugadores_max} jugadores, ¿se completaría en {duracion_estimada_minutos} minutos?

10. **¿La recompensa conecta con el juego?** ¿La letra y la dirección al siguiente espacio tienen sentido narrativo?

Responde SIEMPRE en este formato JSON exacto:
{{"reviews":[{{"point":1,"status":"OK|WARNING|CRITICAL","detail":"explicación"}},...], "overall":"OK|WARNING|CRITICAL","summary":"1-2 frases de resumen"}}

IMPORTANTE: Responde SOLO con el objeto JSON. No incluyas texto antes ni después. No uses markdown ni backticks.

Aquí está el JSON de la prueba:

{puzzle_json}"""

STRICT_RETRY_PROMPT_ES = """
INTENTO FINAL: Tu respuesta anterior no fue un JSON válido.

Debes responder EXCLUSIVAMENTE con un objeto JSON. Sin texto adicional, sin explicaciones, sin markdown, sin backticks.
El JSON debe empezar con {{ y terminar con }}.

Estructura requerida:
{{"reviews":[{{"point":1,"status":"OK","detail":"..."}},...]}}
"""


def _fix_trailing_commas(text):
    """Remove trailing commas before } or ]."""
    text = re.sub(r',\s*([}\]])', r'\1', text)
    return text


def _fix_single_quotes(text):
    """Replace single-quoted strings with double-quoted in JSON-like text."""
    result = []
    in_double = False
    i = 0
    while i < len(text):
        c = text[i]
        if c == '\\' and i + 1 < len(text):
            result.append(c)
            result.append(text[i + 1])
            i += 2
            continue
        if c == '"' and not in_double:
            in_double = True
            result.append(c)
        elif c == '"' and in_double:
            in_double = False
            result.append(c)
        elif c == "'" and not in_double:
            result.append('"')
        else:
            result.append(c)
        i += 1
    return ''.join(result)


def _try_parse_json(candidate):
    """Try parsing JSON with various fixes."""
    for fix_fn in [lambda x: x, _fix_trailing_commas, lambda x: _fix_trailing_commas(_fix_single_quotes(x))]:
        try:
            return json.loads(fix_fn(candidate))
        except (json.JSONDecodeError, ValueError):
            continue
    return None


def _try_close_json(text):
    """Try to close an incomplete/truncated JSON object."""
    opens = text.count('{') - text.count('}')
    if opens > 0:
        text = re.sub(r',\s*$",?$', '', text)
        text = re.sub(r',\s*$[}\]]?$', '', text)
        text += '}' * opens
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass
    return None


def extract_json(text):
    """Extract JSON from potentially messy LLM response."""
    if not text or not text.strip():
        raise ValueError("Empty response")
    # Strip markdown code blocks
    text = re.sub(r"```json?\s*", "", text).strip()
    text = re.sub(r"```", "", text).strip()

    # Strategy 1: Find the largest JSON object in the response
    # Use regex to find all top-level { ... } blocks
    candidates = []
    depth = 0
    start = None
    for i, c in enumerate(text):
        if c == '{':
            if depth == 0:
                start = i
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0 and start is not None:
                candidates.append(text[start:i + 1])
                start = None

    # Try each candidate, largest first
    candidates.sort(key=len, reverse=True)
    for candidate in candidates:
        result = _try_parse_json(candidate)
        if result:
            return result

    # Fallback: simple find
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end > start:
        candidate = text[start:end + 1]
        result = _try_parse_json(candidate)
        if result:
            return result
    elif start != -1:
        candidate = text[start:]
        result = _try_close_json(candidate)
        if result:
            return result
        result = _try_parse_json(candidate)
        if result:
            return result
    raise ValueError("No JSON object found in response")


def normalize_review(data):
    """Normalize review structure from various LLM output formats."""
    # If it has "reviews" key, use it directly
    if isinstance(data, dict) and "reviews" in data:
        return data

    # If it's a list of review items, wrap it
    if isinstance(data, list):
        overall = "OK"
        has_critical = any(r.get("status") == "CRITICAL" for r in data if isinstance(r, dict))
        has_warning = any(r.get("status") == "WARNING" for r in data if isinstance(r, dict))
        if has_critical:
            overall = "CRITICAL"
        elif has_warning:
            overall = "WARNING"
        return {"reviews": data, "overall": overall, "summary": ""}

    # If it's a dict without "reviews", try to find review-like keys
    if isinstance(data, dict):
        reviews = []
        for k, v in data.items():
            if isinstance(v, dict) and "status" in v:
                v.setdefault("point", k)
                reviews.append(v)
        if reviews:
            return {"reviews": reviews, "overall": data.get("overall", ""), "summary": data.get("summary", "")}

    return {"reviews": [], "overall": "CRITICAL", "summary": "Formato de respuesta inesperado"}


def review_puzzle(base, key_or_type, model, filepath):
    """Review a single puzzle JSON. Returns (review_dict, error_str)."""
    with open(filepath, "r") as f:
        puzzle = json.load(f)

    edad_min = puzzle.get("edad_minima", 10)
    edad_max = puzzle.get("edad_maxima", edad_min + 10)
    jug_min = puzzle.get("jugadores_min", 2)
    jug_max = puzzle.get("jugadores_max", 6)
    duracion = puzzle.get("duracion_estimada_minutos", 10)

    prompt = ADVERSARIAL_PROMPT.format(
        edad_minima=edad_min,
        edad_maxima=edad_max,
        jugadores_min=jug_min,
        jugadores_max=jug_max,
        duracion_estimada_minutos=duracion,
        puzzle_json=json.dumps(puzzle, ensure_ascii=False, indent=2),
    )

    strict_prompt = prompt + STRICT_RETRY_PROMPT_ES

    errors = []

    # Try 1: json_mode
    try:
        raw = call_llm(base, key_or_type, model, prompt, json_mode=True)
        return normalize_review(extract_json(raw)), None
    except Exception as e:
        errors.append(str(e))

    # Try 2: without json_mode
    try:
        raw = call_llm(base, key_or_type, model, prompt, json_mode=False)
        return normalize_review(extract_json(raw)), None
    except Exception as e:
        errors.append(str(e))

    # Try 3: strict prompt in Spanish + json_mode
    try:
        raw = call_llm(base, key_or_type, model, strict_prompt, json_mode=True)
        return normalize_review(extract_json(raw)), None
    except Exception as e:
        errors.append(str(e))

    # Try 4: strict prompt without json_mode (last resort)
    try:
        raw = call_llm(base, key_or_type, model, strict_prompt, json_mode=False)
        return normalize_review(extract_json(raw)), None
    except Exception as e:
        errors.append(str(e))

    return None, "; ".join(errors)


STATUS_ICON = {"OK": "✅", "WARNING": "⚠️", "CRITICAL": "❌"}


def print_review(puzzle_name, review):
    print(f"\n{'─' * 60}")
    print(f"🔍 {puzzle_name}")
    print(f"{'─' * 60}")
    for r in review.get("reviews", []):
        icon = STATUS_ICON.get(r.get("status", "?"), "❓")
        print(f"  {icon} P{r.get('point', '?'):>2}: {r.get('detail', '')}")
    overall = review.get("overall", "?")
    icon = STATUS_ICON.get(overall, "❓")
    summary = review.get("summary", "")
    print(f"\n  {icon} Overall: {overall} — {summary}")


def save_results(pruebas_dir, run_data):
    """Append run results to review-results.json."""
    results_path = os.path.join(pruebas_dir, "review-results.json")
    if os.path.exists(results_path):
        with open(results_path, "r") as f:
            data = json.load(f)
        if "runs" not in data:
            data = {"runs": []}
    else:
        data = {"runs": []}

    data["runs"].append(run_data)
    with open(results_path, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return results_path


def print_executive_summary(results):
    """Print executive summary with actionable suggestions."""
    print(f"\n{'═' * 60}")
    print("📊 RESUMEN EJECUTIVO")
    print(f"{'═' * 60}")

    critical_tests = []

    for name, review, error in results:
        if error:
            print(f"  ⚠️  {name}: ERROR ({error[:60]})")
            continue

        overall = review.get("overall", "?")
        icon = STATUS_ICON.get(overall, "❓")
        print(f"  {icon} {name}: {overall}")

        if overall == "CRITICAL":
            crit_points = [
                r.get('point') for r in review.get("reviews", [])
                if r.get("status") == "CRITICAL"
            ]
            critical_tests.append((name, crit_points))

    # Show critical details
    if critical_tests:
        print(f"\n{'─' * 60}")
        print("🚨 Puntos críticos por prueba:")
        for name, points in critical_tests:
            pts_str = ", ".join(f"P{p}" for p in points)
            print(f"  ❌ {name}: {pts_str}")

            # Show detail for each critical point
            if not hasattr(print_executive_summary, '_review_lookup'):
                break  # We don't have the review data here directly
            for r in results:
                if r[0] == name and r[1]:
                    for rev in r[1].get("reviews", []):
                        if rev.get("status") == "CRITICAL":
                            print(f"      P{rev.get('point')}: {rev.get('detail', '')}")
                    break

        # Action suggestion
        print(f"\n💡 Sugerencia de acción:")
        parts = []
        for name, points in critical_tests:
            parts.append(f"{name} (puntos {', '.join(str(p) for p in points)})")
        print(f"   Revisar: {'; '.join(parts)}")

    print()


def main():
    if os.environ.get("SKIP_REVIEW") == "1":
        print("⏭️  LLM review skipped (SKIP_REVIEW=1)")
        sys.exit(0)

    if len(sys.argv) < 2:
        print("Usage: python3 review-design.py <pruebas_dir>")
        sys.exit(2)

    pruebas_dir = sys.argv[1]
    if not os.path.isdir(pruebas_dir):
        print(f"❌ Directory not found: {pruebas_dir}")
        sys.exit(2)

    # Parse optional CLI flags
    model = DEFAULT_MODEL
    api_base = None
    api_key = None
    args = sys.argv[2:]
    i = 0
    while i < len(args):
        if args[i] == "--model" and i + 1 < len(args):
            model = args[i + 1]; i += 2
        elif args[i] == "--api-base" and i + 1 < len(args):
            api_base = args[i + 1]; i += 2
        elif args[i] == "--api-key" and i + 1 < len(args):
            api_key = args[i + 1]; i += 2
        else:
            i += 1

    # Detect API
    if not api_base:
        api_base, detected_key, detected_model = get_api_config()
        if not api_base:
            print("⚠️  No se encontró API disponible. Opciones:")
            print("   1. export GEMINI_API_KEY=tu-key  (recomendado)")
            print("   2. ollama serve && ollama pull llama3")
            print("   3. export OPENAI_API_KEY=tu-key && export OPENAI_BASE_URL=http://...")
            sys.exit(2)
        api_key = detected_key
        model = detected_model

    print(f"🧠 LLM Adversarial Review")
    print(f"   API: {api_base} | Model: {model}")
    print()

    # Find puzzle JSONs
    files = sorted(glob.glob(os.path.join(pruebas_dir, "prueba-*.json")))
    if not files:
        print(f"❌ No prueba-*.json files in {pruebas_dir}")
        sys.exit(2)

    print(f"📄 Found {len(files)} puzzles to review\n")

    has_critical = False
    results = []
    run_pruebas = []
    run_timestamp = datetime.now(timezone.utc).isoformat()

    for fpath in files:
        name = os.path.basename(fpath)
        review, error = review_puzzle(api_base, api_key, model, fpath)
        if error:
            print(f"\n⚠️  {name}: LLM error — {error}")
            results.append((name, None, error))
            run_pruebas.append({"nombre": name, "error": error[:200]})
        else:
            print_review(name, review)
            results.append((name, review, None))
            run_pruebas.append({"nombre": name, "review": review})
            if review.get("overall") == "CRITICAL":
                has_critical = True

    # Executive summary
    print_executive_summary(results)

    # Save results
    run_data = {
        "timestamp": run_timestamp,
        "model": model,
        "pruebas": run_pruebas,
    }
    results_path = save_results(pruebas_dir, run_data)
    print(f"💾 Resultados guardados en: {results_path}")

    if has_critical:
        print(f"\n❌ BUILD STOPPED — CRITICAL issues found. Fix and re-run.")
        sys.exit(1)
    else:
        print(f"\n✅ All puzzles passed adversarial review.")
        sys.exit(0)


if __name__ == "__main__":
    main()
