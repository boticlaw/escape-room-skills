#!/usr/bin/env python3
"""Search through real game examples and standalone puzzle catalog.

Supports: --theme, --mechanic, --difficulty, --type, --list-mechanics,
          --list-games, --game, --similar, --recent-mechanics.
          With --puzzles: restricts search to puzzle catalog only.
          Puzzle-only modes: --list-puzzles, --list-categories, --puzzle.
          With --include-discarded: include descartadas/ puzzles.

Zero external dependencies — stdlib only.
Output: JSON to stdout. Use --pretty for human-readable output.
"""

import argparse
import json
import os
import sys
from collections import Counter
from datetime import datetime
from pathlib import Path


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def script_dir():
    """Directory where this script lives."""
    return Path(__file__).resolve().parent


def default_base_dir():
    """Default base dir: examples/real-games/ relative to script location."""
    return script_dir().parent / "examples" / "real-games"


def default_puzzle_dir():
    """Default puzzle catalog dir: examples/puzzles/ relative to script."""
    return script_dir().parent / "examples" / "puzzles"


def normalize(text):
    """Lowercase, strip accents for fuzzy matching."""
    if not text:
        return ""
    text = text.lower()
    # Strip common Spanish accents
    replacements = {
        "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u",
        "ü": "u", "ñ": "n", "ç": "c",
    }
    for src, dst in replacements.items():
        text = text.replace(src, dst)
    return text


def load_json(path):
    """Load JSON file, return None on failure."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return None


# ---------------------------------------------------------------------------
# Game loading (examples/real-games/)
# ---------------------------------------------------------------------------

def find_games(base_dir):
    """Discover all games under base_dir.

    Strategy:
    1. Look for juego/juego.json inside each subdirectory (canonical path).
    2. Look for juego.json at the game root.
    3. Look for BRIEF.json at the game root.
    4. Look for any prueba-*.json files in juego/pruebas/ or pruebas/.

    Returns a list of game dicts.
    """
    base = Path(base_dir)
    games = []

    # Find candidate game directories (immediate children, skip files)
    for entry in sorted(base.iterdir()):
        if not entry.is_dir():
            continue
        name = entry.name
        if name.startswith("."):
            continue

        game = _load_game(entry, name)
        if game:
            games.append(game)

    return games


def _load_game(game_dir, game_name):
    """Load a single game's data from its directory."""
    game = {
        "name": game_name,
        "path": str(game_dir),
        "juego_json": None,
        "brief_json": None,
        "puzzles": [],
        "playtest": None,
    }

    # Load juego.json — try juego/juego.json first, then root juego.json
    juego_data = None
    juego_path = game_dir / "juego" / "juego.json"
    if juego_path.exists():
        juego_data = load_json(juego_path)
    if juego_data is None:
        juego_path = game_dir / "juego.json"
        if juego_path.exists():
            juego_data = load_json(juego_path)
    game["juego_json"] = juego_data

    # Load BRIEF.json
    brief_path = game_dir / "BRIEF.json"
    if brief_path.exists():
        game["brief_json"] = load_json(brief_path)

    # Load playtest report
    playtest_path = game_dir / "juego" / "pruebas" / "playtest-report.json"
    if not playtest_path.exists():
        playtest_path = game_dir / "pruebas" / "playtest-report.json"
    if playtest_path.exists():
        game["playtest"] = load_json(playtest_path)

    # Load puzzle files
    puzzles_dirs = [
        game_dir / "juego" / "pruebas",
        game_dir / "pruebas",
    ]
    seen_ids = set()
    for pdir in puzzles_dirs:
        if not pdir.is_dir():
            continue
        for pfile in sorted(pdir.iterdir()):
            if not pfile.is_file():
                continue
            if not pfile.name.startswith("prueba") or not pfile.suffix == ".json":
                continue
            # Skip playtest report
            if pfile.name == "playtest-report.json":
                continue
            data = load_json(pfile)
            if data and data.get("id") not in seen_ids:
                seen_ids.add(data.get("id"))
                game["puzzles"].append(data)

    # Determine if this is a usable game (must have at least some metadata)
    if juego_data is None and game["brief_json"] is None and not game["puzzles"]:
        return None

    return game


def extract_game_metadata(game):
    """Extract standardized metadata from a game dict."""
    meta = {
        "name": game["name"],
        "nombre": game["name"],
        "tipo": None,
        "dificultad": None,
        "tematica": None,
        "descripcion": None,
        "narrativa": None,
        "num_puzzles": len(game["puzzles"]),
        "mechanics": [],
        "playtest_score": None,
    }

    j = game["juego_json"]
    b = game["brief_json"]

    # From juego.json
    if j:
        meta["nombre"] = j.get("nombre", meta["name"])

        # Type
        meta["tipo"] = j.get("tipo") or j.get("type")

        # Difficulty
        diff = j.get("dificultad")
        if isinstance(diff, dict):
            meta["dificultad"] = diff.get("media") or diff.get("curva", [None])[0]
        elif isinstance(diff, (int, float)):
            meta["dificultad"] = diff

        # Theme / description from secciones
        secciones = j.get("secciones", [])
        for sec in secciones:
            titulo = sec.get("titulo", "").lower()
            if "sinopsis" in titulo or "narrativa" in titulo:
                content = sec.get("contenido_html") or sec.get("contenido") or ""
                meta["narrativa"] = content
                break

        # Description from subtitulo
        meta["descripcion"] = j.get("subtitulo")

        # Theme from hilo_conductor
        if j.get("hilo_conductor"):
            meta["tematica"] = j["hilo_conductor"]

    # From BRIEF.json
    if b:
        if not meta["nombre"] or meta["nombre"] == meta["name"]:
            meta["nombre"] = b.get("nombre") or meta["name"]
        if not meta["tipo"]:
            meta["tipo"] = b.get("tipo")
        if meta["dificultad"] is None:
            meta["dificultad"] = b.get("dificultad_objetivo")
        if not meta["narrativa"]:
            narr = b.get("narrativa", {})
            if isinstance(narr, dict):
                meta["narrativa"] = narr.get("sinopsis")
        if not meta["descripcion"]:
            meta["descripcion"] = b.get("descripcion_corta")
        if not meta["tematica"]:
            tags = b.get("tags", [])
            if tags:
                meta["tematica"] = " ".join(tags)

    # Extract mechanics from puzzles
    mechanics = set()
    for p in game["puzzles"]:
        sp = p.get("skill_primario")
        if sp:
            mechanics.add(sp)
        for ss in p.get("skills_secundarios", []):
            if ss:
                mechanics.add(ss)
    meta["mechanics"] = sorted(mechanics)

    # Playtest score
    pt = game["playtest"]
    if pt:
        equipo = pt.get("equipo", [])
        if equipo:
            avg_diversion = sum(
                e.get("diversion", 0) for e in equipo
            ) / len(equipo)
            meta["playtest_score"] = round(avg_diversion, 1)

    return meta


def keyword_overlap_score(text, query):
    """Simple keyword overlap scoring (no ML)."""
    text_norm = normalize(text)
    query_norm = normalize(query)
    query_words = set(query_norm.split())
    if not query_words:
        return 0
    text_words = set(text_norm.split())
    overlap = query_words & text_words
    if not overlap:
        return 0
    return len(overlap) / len(query_words)


def text_content(game_meta, game=None):
    """All searchable text for a game joined together."""
    parts = [
        game_meta.get("nombre", ""),
        game_meta.get("descripcion", ""),
        game_meta.get("narrativa", ""),
        game_meta.get("tematica", ""),
        game_meta.get("tipo", ""),
        " ".join(game_meta.get("mechanics", [])),
    ]
    # Include puzzle descriptions for richer matching
    if game:
        for p in game.get("puzzles", []):
            desc = p.get("descripcion", "")
            if desc:
                parts.append(desc)
            nombre = p.get("nombre", "")
            if nombre:
                parts.append(nombre)
    return " ".join(p for p in parts if p)


def mod_time(game):
    """Modification time of the game directory as a sortable value."""
    try:
        return os.path.getmtime(game["path"])
    except OSError:
        return 0


def parse_difficulty_range(spec):
    """Parse difficulty range like '3-5' or '4' into (min, max)."""
    if "-" in spec:
        parts = spec.split("-", 1)
        return float(parts[0]), float(parts[1])
    else:
        val = float(spec)
        return val, val


# ---------------------------------------------------------------------------
# Puzzle loading (examples/puzzles/)
# ---------------------------------------------------------------------------

def find_puzzles(puzzle_dir, include_discarded=False):
    """Load all puzzles from the catalog directory.

    Searches pruebas/, ideas/, and optionally descartadas/.
    Returns list of puzzle dicts with added _source and _subdir metadata.
    """
    base = Path(puzzle_dir)
    puzzles = []
    seen_ids = set()

    # Subdirectories to search (in order)
    subdirs = ["pruebas", "ideas"]
    if include_discarded:
        subdirs.append("descartadas")

    for subdir in subdirs:
        subdir_path = base / subdir
        if not subdir_path.is_dir():
            continue
        for f in sorted(subdir_path.iterdir()):
            if not f.is_file() or not f.suffix == ".json":
                continue
            if f.name == "review-tracker.json":
                continue
            data = load_json(f)
            if data and data.get("id") not in seen_ids:
                seen_ids.add(data.get("id"))
                data["_source"] = "puzzle-catalog"
                data["_subdir"] = subdir
                if subdir == "descartadas":
                    data["descartada"] = True
                puzzles.append(data)

    return puzzles


def extract_puzzle_meta(puzzle):
    """Extract standardized metadata from a puzzle dict."""
    cfg = puzzle.get("configuracion", {})
    meta_raw = puzzle.get("metadata", {})

    mechanics = set()
    sp = puzzle.get("skill_primario")
    if sp:
        mechanics.add(sp)
    for s in puzzle.get("skills_secundarios", []):
        if s:
            mechanics.add(s)

    return {
        "source": puzzle.get("_source", "puzzle-catalog"),
        "subdir": puzzle.get("_subdir", "pruebas"),
        "id": puzzle.get("id", ""),
        "nombre": puzzle.get("nombre", ""),
        "descripcion": puzzle.get("descripcion", ""),
        "skill_primario": sp,
        "skills_secundarios": puzzle.get("skills_secundarios", []),
        "dificultad": puzzle.get("dificultad"),
        "duracion_estimada_minutos": puzzle.get("duracion_estimada_minutos"),
        "categoria": cfg.get("categoria"),
        "tipo_prueba": cfg.get("tipo_prueba"),
        "coste_estimado": cfg.get("coste_estimado"),
        "testeado": meta_raw.get("testeado", False),
        "tipo": meta_raw.get("tipo", "unknown"),
        "tags": meta_raw.get("tags", []),
        "descartada": puzzle.get("descartada", False),
        "estado": puzzle.get("estado"),
        "mechanics": sorted(mechanics),
    }


def text_content_puzzle(meta, puzzle):
    """All searchable text for a puzzle joined together."""
    parts = [
        meta.get("nombre", ""),
        meta.get("descripcion", ""),
        meta.get("skill_primario") or "",
        " ".join(meta.get("skills_secundarios", [])),
        " ".join(meta.get("tags", [])),
        meta.get("categoria") or "",
    ]
    # Include pista text for richer matching
    for pista in puzzle.get("pistas", []):
        if isinstance(pista, dict):
            parts.append(pista.get("texto", ""))
    return " ".join(p for p in parts if p)


# ---------------------------------------------------------------------------
# Search commands — Games only (unchanged behavior)
# ---------------------------------------------------------------------------

def cmd_type(games, type_query, **_kw):
    """Search by game type."""
    type_norm = normalize(type_query)
    results = []
    for g in games:
        meta = extract_game_metadata(g)
        if meta.get("tipo") and type_norm in normalize(meta["tipo"]):
            results.append({"game": _summarize(meta, g)})
    return {"mode": "type", "query": type_query, "results": results}


def cmd_list_games(games, **_kw):
    """List all games with summary."""
    results = []
    for g in games:
        meta = extract_game_metadata(g)
        results.append(_summarize(meta, g))
    return {"mode": "list-games", "total_games": len(results), "results": results}


def cmd_game(games, game_name, **_kw):
    """Get full details of a specific game."""
    for g in games:
        if g["name"] == game_name or normalize(g["name"]) == normalize(game_name):
            meta = extract_game_metadata(g)
            detail = _detail(meta, g)
            return {"mode": "game", "query": game_name, "result": detail}
    return {"mode": "game", "query": game_name, "result": None, "error": f"Game '{game_name}' not found"}


def cmd_recent_mechanics(games, **_kw):
    """List mechanics sorted by recency (folder modification time)."""
    # Sort games by modification time (newest first)
    sorted_games = sorted(games, key=mod_time, reverse=True)
    results = []
    for g in sorted_games:
        meta = extract_game_metadata(g)
        try:
            mtime = os.path.getmtime(g["path"])
            date_str = datetime.fromtimestamp(mtime).strftime("%Y-%m-%d")
        except OSError:
            date_str = "unknown"
        results.append({
            "game": meta["nombre"],
            "date": date_str,
            "mechanics": meta["mechanics"],
        })
    return {"mode": "recent-mechanics", "results": results}


# ---------------------------------------------------------------------------
# Search commands — Unified (games + puzzles) / Puzzle-only
# ---------------------------------------------------------------------------

def cmd_theme(games, theme_query, puzzles=None, puzzles_only=False, **_kw):
    """Search by theme/topic in names, descriptions, narratives."""
    results = []

    if not puzzles_only:
        for g in games:
            meta = extract_game_metadata(g)
            txt = text_content(meta, g)
            score = keyword_overlap_score(txt, theme_query)
            if score > 0:
                results.append({
                    "game": _summarize(meta, g),
                    "score": round(score, 3),
                    "source": "real-games",
                })

    if puzzles is not None:
        for p in puzzles:
            meta = extract_puzzle_meta(p)
            txt = text_content_puzzle(meta, p)
            score = keyword_overlap_score(txt, theme_query)
            if score > 0:
                results.append({
                    "puzzle": _summarize_puzzle(meta),
                    "score": round(score, 3),
                    "source": "puzzle-catalog",
                })

    results.sort(key=lambda r: r["score"], reverse=True)
    return {"mode": "theme", "query": theme_query, "results": results}


def cmd_mechanic(games, mechanic_query, puzzles=None, puzzles_only=False, **_kw):
    """Search by mechanic (matches skill_primario or skills_secundarios)."""
    results = []
    mech_norm = normalize(mechanic_query)

    if not puzzles_only:
        for g in games:
            meta = extract_game_metadata(g)
            matching = []
            for m in meta["mechanics"]:
                if mech_norm in normalize(m):
                    matching.append(m)
            if matching:
                results.append({
                    "game": _summarize(meta, g),
                    "matching_mechanics": matching,
                    "source": "real-games",
                })

    if puzzles is not None:
        for p in puzzles:
            meta = extract_puzzle_meta(p)
            matching = []
            for m in meta["mechanics"]:
                if mech_norm in normalize(m):
                    matching.append(m)
            if matching:
                results.append({
                    "puzzle": _summarize_puzzle(meta),
                    "matching_mechanics": matching,
                    "source": "puzzle-catalog",
                })

    return {"mode": "mechanic", "query": mechanic_query, "results": results}


def cmd_difficulty(games, diff_spec, puzzles=None, puzzles_only=False, **_kw):
    """Search by difficulty range."""
    dmin, dmax = parse_difficulty_range(diff_spec)
    results = []

    if not puzzles_only:
        for g in games:
            meta = extract_game_metadata(g)
            d = meta.get("dificultad")
            if d is not None and dmin <= d <= dmax:
                results.append({
                    "game": _summarize(meta, g),
                    "source": "real-games",
                })

    if puzzles is not None:
        for p in puzzles:
            meta = extract_puzzle_meta(p)
            d = meta.get("dificultad")
            if d is not None and dmin <= d <= dmax:
                results.append({
                    "puzzle": _summarize_puzzle(meta),
                    "source": "puzzle-catalog",
                })

    return {"mode": "difficulty", "range": diff_spec, "results": results}


def cmd_similar(games, similar_query, puzzles=None, puzzles_only=False, **_kw):
    """Find items similar to a given theme (fuzzy keyword matching)."""
    results = []

    if not puzzles_only:
        for g in games:
            meta = extract_game_metadata(g)
            txt = text_content(meta, g)
            score = keyword_overlap_score(txt, similar_query)
            # Also try partial word matching
            query_words = normalize(similar_query).split()
            text_norm = normalize(txt)
            for qw in query_words:
                if len(qw) >= 3 and qw in text_norm:
                    score += 0.3
            if score > 0:
                results.append({
                    "game": _summarize(meta, g),
                    "score": round(score, 3),
                    "source": "real-games",
                })

    if puzzles is not None:
        for p in puzzles:
            meta = extract_puzzle_meta(p)
            txt = text_content_puzzle(meta, p)
            score = keyword_overlap_score(txt, similar_query)
            # Also try partial word matching
            query_words = normalize(similar_query).split()
            text_norm = normalize(txt)
            for qw in query_words:
                if len(qw) >= 3 and qw in text_norm:
                    score += 0.3
            if score > 0:
                results.append({
                    "puzzle": _summarize_puzzle(meta),
                    "score": round(score, 3),
                    "source": "puzzle-catalog",
                })

    results.sort(key=lambda r: r["score"], reverse=True)
    return {"mode": "similar", "query": similar_query, "results": results}


def cmd_list_mechanics(games, puzzles=None, puzzles_only=False, **_kw):
    """List all mechanics with frequency and source information."""
    counter = Counter()
    mechanic_games = {}
    mechanic_puzzles = {}

    if not puzzles_only:
        for g in games:
            meta = extract_game_metadata(g)
            for m in meta["mechanics"]:
                counter[m] += 1
                mechanic_games.setdefault(m, []).append(meta["nombre"])

    if puzzles is not None:
        for p in puzzles:
            meta = extract_puzzle_meta(p)
            for m in meta["mechanics"]:
                counter[m] += 1
                mechanic_puzzles.setdefault(m, []).append(meta.get("id", ""))

    results = []
    for mech, count in counter.most_common():
        entry = {
            "mechanic": mech,
            "count": count,
            "games": mechanic_games.get(mech, []),
        }
        if puzzles is not None:
            entry["puzzles"] = mechanic_puzzles.get(mech, [])
        results.append(entry)
    return {"mode": "list-mechanics", "total_mechanics": len(results), "results": results}


# ---------------------------------------------------------------------------
# Search commands — Puzzle catalog only
# ---------------------------------------------------------------------------

def cmd_list_puzzles(puzzles, **_kw):
    """List all puzzles with summary."""
    results = []
    for p in puzzles:
        meta = extract_puzzle_meta(p)
        results.append(_summarize_puzzle(meta))
    return {"mode": "list-puzzles", "total_puzzles": len(results), "results": results}


def cmd_list_categories(puzzles, **_kw):
    """List all puzzle categories with counts."""
    counter = Counter()
    cat_puzzles = {}
    for p in puzzles:
        meta = extract_puzzle_meta(p)
        cat = meta.get("categoria") or "sin_categoria"
        counter[cat] += 1
        cat_puzzles.setdefault(cat, []).append(meta.get("id", ""))
    results = []
    for cat, count in counter.most_common():
        results.append({
            "category": cat,
            "count": count,
            "puzzles": cat_puzzles[cat],
        })
    return {"mode": "list-categories", "total_categories": len(results), "results": results}


def cmd_puzzle_detail(puzzles, puzzle_id, **_kw):
    """Get full details of a specific puzzle."""
    for p in puzzles:
        pid = p.get("id", "")
        if pid == puzzle_id or normalize(pid) == normalize(puzzle_id):
            detail = _detail_puzzle(p)
            return {"mode": "puzzle", "query": puzzle_id, "result": detail}
    return {"mode": "puzzle", "query": puzzle_id, "result": None, "error": f"Puzzle '{puzzle_id}' not found"}


# ---------------------------------------------------------------------------
# Formatters
# ---------------------------------------------------------------------------

def _summarize(meta, game):
    """Short summary of a game."""
    return {
        "name": game["name"],
        "nombre": meta.get("nombre"),
        "tipo": meta.get("tipo"),
        "dificultad": meta.get("dificultad"),
        "num_puzzles": meta.get("num_puzzles"),
        "mechanics": meta.get("mechanics"),
        "playtest_score": meta.get("playtest_score"),
    }


def _summarize_puzzle(meta):
    """Short summary of a puzzle."""
    return {
        "id": meta.get("id"),
        "nombre": meta.get("nombre"),
        "skill_primario": meta.get("skill_primario"),
        "dificultad": meta.get("dificultad"),
        "duracion_estimada_minutos": meta.get("duracion_estimada_minutos"),
        "categoria": meta.get("categoria"),
        "testeado": meta.get("testeado"),
        "tipo": meta.get("tipo"),
        "coste_estimado": meta.get("coste_estimado"),
        "mechanics": meta.get("mechanics"),
        "descartada": meta.get("descartada", False),
        "estado": meta.get("estado"),
    }


def _detail(meta, game):
    """Full detail of a game."""
    puzzle_summaries = []
    for p in game["puzzles"]:
        puzzle_summaries.append({
            "id": p.get("id"),
            "nombre": p.get("nombre"),
            "skill_primario": p.get("skill_primario"),
            "skills_secundarios": p.get("skills_secundarios", []),
            "dificultad": p.get("dificultad"),
            "mecanica_principal": (p.get("configuracion") or {}).get("mecanica_principal"),
            "mecanismo_barrera": (p.get("configuracion") or {}).get("mecanismo_barrera"),
        })
    return {
        "name": game["name"],
        "nombre": meta.get("nombre"),
        "tipo": meta.get("tipo"),
        "dificultad": meta.get("dificultad"),
        "descripcion": meta.get("descripcion"),
        "tematica": meta.get("tematica"),
        "num_puzzles": meta.get("num_puzzles"),
        "mechanics": meta.get("mechanics"),
        "playtest_score": meta.get("playtest_score"),
        "puzzles": puzzle_summaries,
        "has_playtest": game["playtest"] is not None,
        "has_brief": game["brief_json"] is not None,
    }


def _detail_puzzle(puzzle):
    """Full detail of a puzzle."""
    meta = extract_puzzle_meta(puzzle)
    result = _summarize_puzzle(meta)
    result["descripcion"] = puzzle.get("descripcion")
    result["skills_secundarios"] = puzzle.get("skills_secundarios", [])
    result["configuracion"] = puzzle.get("configuracion", {})
    result["pistas"] = puzzle.get("pistas", [])
    result["solucion"] = puzzle.get("solucion", {})
    result["adaptaciones"] = puzzle.get("adaptaciones", {})
    result["tags"] = meta.get("tags", [])
    return result


def format_pretty(data):
    """Format output for human readability."""
    lines = []
    mode = data.get("mode", "")

    if mode == "theme":
        lines.append(f"\U0001f3a8 Theme search: {data['query']}")
        lines.append("=" * 60)
        for r in data["results"]:
            src = r.get("source", "real-games")
            if "game" in r:
                g = r["game"]
                lines.append(f"\n  {g.get('nombre', g['name'])} (score: {r['score']}) [{src}]")
                lines.append(f"    Tipo: {g.get('tipo', '?')} | Dificultad: {g.get('dificultad', '?')} | Puzzles: {g.get('num_puzzles', '?')}")
                if g.get("playtest_score"):
                    lines.append(f"    Playtest: {g['playtest_score']}")
                lines.append(f"    Mec\u00e1nicas: {', '.join(g.get('mechanics', []))}")
            elif "puzzle" in r:
                p = r["puzzle"]
                lines.append(f"\n  {p.get('nombre', '?')} (score: {r['score']}) [{src}]")
                lines.append(f"    Skill: {p.get('skill_primario', '?')} | Dificultad: {p.get('dificultad', '?')} | Dur: {p.get('duracion_estimada_minutos', '?')}min")
                lines.append(f"    Categor\u00eda: {p.get('categoria', '?')} | Testeado: {'S\u00ed' if p.get('testeado') else 'No'} | Tipo: {p.get('tipo', '?')}")
                if p.get("descartada"):
                    lines.append(f"    \u26a0 DESCARTADA")
        if not data["results"]:
            lines.append("  No results found.")

    elif mode == "mechanic":
        lines.append(f"\u2699\ufe0f  Mechanic search: {data['query']}")
        lines.append("=" * 60)
        for r in data["results"]:
            src = r.get("source", "real-games")
            if "game" in r:
                g = r["game"]
                lines.append(f"\n  {g.get('nombre', g['name'])} [{src}]")
                lines.append(f"    Matching: {', '.join(r['matching_mechanics'])}")
                lines.append(f"    Dificultad: {g.get('dificultad', '?')} | Puzzles: {g.get('num_puzzles', '?')}")
            elif "puzzle" in r:
                p = r["puzzle"]
                lines.append(f"\n  {p.get('nombre', '?')} [{src}]")
                lines.append(f"    Matching: {', '.join(r['matching_mechanics'])}")
                lines.append(f"    Skill: {p.get('skill_primario', '?')} | Dificultad: {p.get('dificultad', '?')}")
                if p.get("descartada"):
                    lines.append(f"    \u26a0 DESCARTADA")
        if not data["results"]:
            lines.append("  No results found.")

    elif mode == "difficulty":
        lines.append(f"\U0001f4ca Difficulty range: {data['range']}")
        lines.append("=" * 60)
        for r in data["results"]:
            src = r.get("source", "real-games")
            if "game" in r:
                g = r["game"]
                lines.append(f"\n  {g.get('nombre', g['name'])} (dif: {g.get('dificultad', '?')}) [{src}]")
                lines.append(f"    Tipo: {g.get('tipo', '?')} | Puzzles: {g.get('num_puzzles', '?')}")
            elif "puzzle" in r:
                p = r["puzzle"]
                lines.append(f"\n  {p.get('nombre', '?')} (dif: {p.get('dificultad', '?')}) [{src}]")
                lines.append(f"    Skill: {p.get('skill_primario', '?')} | Dur: {p.get('duracion_estimada_minutos', '?')}min | Categor\u00eda: {p.get('categoria', '?')}")
                if p.get("descartada"):
                    lines.append(f"    \u26a0 DESCARTADA")
        if not data["results"]:
            lines.append("  No results found.")

    elif mode == "type":
        lines.append(f"\U0001f3f7\ufe0f  Type search: {data['query']}")
        lines.append("=" * 60)
        for r in data["results"]:
            g = r["game"]
            lines.append(f"\n  {g.get('nombre', g['name'])}")
            lines.append(f"    Tipo: {g.get('tipo', '?')} | Dificultad: {g.get('dificultad', '?')} | Puzzles: {g.get('num_puzzles', '?')}")
        if not data["results"]:
            lines.append("  No results found.")

    elif mode == "list-mechanics":
        lines.append(f"\u2699\ufe0f  All mechanics ({data['total_mechanics']} unique)")
        lines.append("=" * 60)
        for r in data["results"]:
            games_str = ", ".join(r["games"])
            line = f"\n  {r['mechanic']} ({r['count']}"
            parts = []
            if r["games"]:
                parts.append(f"{len(r['games'])} game(s)")
            if r.get("puzzles"):
                parts.append(f"{len(r['puzzles'])} puzzle(s)")
            line += f" — {' + '.join(parts)})"
            lines.append(line)
            if r["games"]:
                lines.append(f"    Games: {games_str}")
            if r.get("puzzles"):
                pz_str = ", ".join(r["puzzles"][:5])
                if len(r["puzzles"]) > 5:
                    pz_str += f" ... (+{len(r['puzzles'])-5} more)"
                lines.append(f"    Puzzles: {pz_str}")

    elif mode == "list-games":
        lines.append(f"\U0001f3ae All games ({data['total_games']} total)")
        lines.append("=" * 60)
        for g in data["results"]:
            lines.append(f"\n  {g.get('nombre', g['name'])}")
            lines.append(f"    Slug: {g['name']}")
            lines.append(f"    Tipo: {g.get('tipo', '?')} | Dificultad: {g.get('dificultad', '?')} | Puzzles: {g.get('num_puzzles', '?')}")
            if g.get("playtest_score"):
                lines.append(f"    Playtest: {g['playtest_score']}")
            lines.append(f"    Mec\u00e1nicas: {', '.join(g.get('mechanics', []))}")

    elif mode == "game":
        d = data.get("result")
        if not d:
            lines.append(f"\u274c Game not found: {data['query']}")
        else:
            lines.append(f"\U0001f3ae {d.get('nombre', d['name'])}")
            lines.append("=" * 60)
            lines.append(f"  Slug: {d['name']}")
            lines.append(f"  Tipo: {d.get('tipo', '?')}")
            lines.append(f"  Dificultad: {d.get('dificultad', '?')}")
            lines.append(f"  Descripci\u00f3n: {d.get('descripcion', '?')}")
            lines.append(f"  Puzzles: {d.get('num_puzzles', '?')}")
            lines.append(f"  Mec\u00e1nicas: {', '.join(d.get('mechanics', []))}")
            lines.append(f"  Playtest: {'S\u00ed (' + str(d['playtest_score']) + ')' if d.get('playtest_score') else 'No'}")
            lines.append(f"  BRIEF: {'S\u00ed' if d.get('has_brief') else 'No'}")
            lines.append(f"\n  Puzzles:")
            for p in d.get("puzzles", []):
                lines.append(f"    {p.get('id', '?')}: {p.get('nombre', '?')} (dif: {p.get('dificultad', '?')}, skill: {p.get('skill_primario', '?')})")

    elif mode == "similar":
        lines.append(f"\U0001f50d Similar to: {data['query']}")
        lines.append("=" * 60)
        for r in data["results"]:
            src = r.get("source", "real-games")
            if "game" in r:
                g = r["game"]
                lines.append(f"\n  {g.get('nombre', g['name'])} (score: {r['score']}) [{src}]")
                lines.append(f"    Tipo: {g.get('tipo', '?')} | Dificultad: {g.get('dificultad', '?')} | Puzzles: {g.get('num_puzzles', '?')}")
                lines.append(f"    Mec\u00e1nicas: {', '.join(g.get('mechanics', []))}")
            elif "puzzle" in r:
                p = r["puzzle"]
                lines.append(f"\n  {p.get('nombre', '?')} (score: {r['score']}) [{src}]")
                lines.append(f"    Skill: {p.get('skill_primario', '?')} | Dificultad: {p.get('dificultad', '?')} | Dur: {p.get('duracion_estimada_minutos', '?')}min")
                lines.append(f"    Categor\u00eda: {p.get('categoria', '?')} | Tipo: {p.get('tipo', '?')}")
                if p.get("descartada"):
                    lines.append(f"    \u26a0 DESCARTADA")
        if not data["results"]:
            lines.append("  No similar items found.")

    elif mode == "recent-mechanics":
        lines.append("\U0001f550 Recent mechanics (by modification date)")
        lines.append("=" * 60)
        for r in data["results"]:
            lines.append(f"\n  {r['game']} ({r['date']})")
            lines.append(f"    Mec\u00e1nicas: {', '.join(r['mechanics'])}")

    elif mode == "list-puzzles":
        lines.append(f"\U0001f9e9 All puzzles ({data['total_puzzles']} total)")
        lines.append("=" * 60)
        for p in data["results"]:
            tipo_marker = ""
            if p.get("descartada"):
                tipo_marker = " \u26a0 DESCARTADA"
            elif p.get("tipo") == "idea":
                tipo_marker = " \U0001f4a1 IDEA"
            elif p.get("testeado"):
                tipo_marker = " \u2705 TESTED"
            lines.append(f"\n  {p.get('nombre', '?')} (id: {p.get('id', '?')}){tipo_marker}")
            lines.append(f"    Skill: {p.get('skill_primario', '?')} | Dificultad: {p.get('dificultad', '?')} | Dur: {p.get('duracion_estimada_minutos', '?')}min")
            lines.append(f"    Categor\u00eda: {p.get('categoria', '?')} | Coste: {p.get('coste_estimado', '?')}")
            if p.get("mechanics"):
                lines.append(f"    Mec\u00e1nicas: {', '.join(p['mechanics'])}")

    elif mode == "list-categories":
        lines.append(f"\U0001f4da Puzzle categories ({data['total_categories']} total)")
        lines.append("=" * 60)
        for r in data["results"]:
            lines.append(f"\n  {r['category']} ({r['count']} puzzle(s))")
            pz_str = ", ".join(r["puzzles"][:5])
            if len(r["puzzles"]) > 5:
                pz_str += f" ... (+{len(r['puzzles'])-5} more)"
            lines.append(f"    Puzzles: {pz_str}")

    elif mode == "puzzle":
        d = data.get("result")
        if not d:
            lines.append(f"\u274c Puzzle not found: {data['query']}")
            if data.get("error"):
                lines.append(f"  {data['error']}")
        else:
            tipo_marker = ""
            if d.get("descartada"):
                tipo_marker = " \u26a0 DESCARTADA"
            elif d.get("tipo") == "idea":
                tipo_marker = " \U0001f4a1 IDEA"
            elif d.get("testeado"):
                tipo_marker = " \u2705 TESTED"
            lines.append(f"\U0001f9e9 {d.get('nombre', '?')}{tipo_marker}")
            lines.append("=" * 60)
            lines.append(f"  ID: {d.get('id', '?')}")
            lines.append(f"  Descripci\u00f3n: {d.get('descripcion', '?')}")
            lines.append(f"  Skill primario: {d.get('skill_primario', '?')}")
            lines.append(f"  Skills secundarios: {', '.join(d.get('skills_secundarios', []))}")
            lines.append(f"  Dificultad: {d.get('dificultad', '?')}")
            lines.append(f"  Duraci\u00f3n estimada: {d.get('duracion_estimada_minutos', '?')} min")
            lines.append(f"  Categor\u00eda: {d.get('categoria', '?')}")
            lines.append(f"  Coste: {d.get('coste_estimado', '?')}")
            lines.append(f"  Testeado: {'S\u00ed' if d.get('testeado') else 'No'}")
            lines.append(f"  Tipo: {d.get('tipo', '?')}")
            lines.append(f"  Estado: {d.get('estado', '?')}")
            if d.get("tags"):
                lines.append(f"  Tags: {', '.join(d['tags'])}")
            if d.get("configuracion"):
                lines.append(f"\n  Configuraci\u00f3n:")
                for k, v in d["configuracion"].items():
                    if k not in ("categoria", "tipo_prueba", "coste_estimado"):
                        lines.append(f"    {k}: {v}")
            if d.get("pistas"):
                lines.append(f"\n  Pistas ({len(d['pistas'])} niveles):")
                for pista in d["pistas"]:
                    if isinstance(pista, dict):
                        lines.append(f"    Nivel {pista.get('nivel', '?')}: {pista.get('texto', '')}")
            if d.get("solucion"):
                sol = d["solucion"]
                if isinstance(sol, dict):
                    lines.append(f"\n  Soluci\u00f3n:")
                    lines.append(f"    Mec\u00e1nica: {sol.get('mecanica', '?')}")
                    lines.append(f"    Descripci\u00f3n: {sol.get('descripcion', '?')}")
                    lines.append(f"    Resultado: {sol.get('resultado', '?')}")
            if d.get("adaptaciones"):
                lines.append(f"\n  Adaptaciones:")
                ad = d["adaptaciones"]
                lines.append(f"    Edad: {ad.get('edad_recomendada', '?')} | Espacio: {ad.get('espacio', '?')}")
                lines.append(f"    Jugadores: {ad.get('jugadores_minimos', '?')}-{ad.get('jugadores_maximos', '?')}")

    else:
        lines.append(json.dumps(data, indent=2, ensure_ascii=False))

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Search real game examples and puzzle catalog for escape room design reference."
    )
    parser.add_argument(
        "--base-dir",
        default=None,
        help="Base directory containing game folders (default: examples/real-games/ relative to script)",
    )
    parser.add_argument(
        "--puzzle-dir",
        default=None,
        help="Puzzle catalog directory (default: examples/puzzles/ relative to script)",
    )
    parser.add_argument(
        "--puzzles",
        action="store_true",
        help="Restrict search to the standalone puzzle catalog only",
    )
    parser.add_argument(
        "--include-discarded",
        action="store_true",
        help="Include discarded puzzles (descartadas/) in search results",
    )
    parser.add_argument(
        "--pretty",
        action="store_true",
        help="Human-readable output instead of JSON",
    )

    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--theme", metavar="QUERY", help="Search by theme/topic")
    group.add_argument("--mechanic", metavar="QUERY", help="Search by mechanic (skill ID)")
    group.add_argument("--difficulty", metavar="RANGE", help="Search by difficulty (e.g. 3-5 or 4)")
    group.add_argument("--type", metavar="TYPE", help="Search by game type")
    group.add_argument("--list-mechanics", action="store_true", help="List all mechanics with frequency")
    group.add_argument("--list-games", action="store_true", help="List all games with summary")
    group.add_argument("--game", metavar="SLUG", help="Get full details of a specific game")
    group.add_argument("--similar", metavar="QUERY", help="Find items similar to a theme (fuzzy)")
    group.add_argument("--recent-mechanics", action="store_true", help="List mechanics sorted by recency")
    group.add_argument("--list-puzzles", action="store_true", help="List all puzzles in catalog")
    group.add_argument("--list-categories", action="store_true", help="List all puzzle categories")
    group.add_argument("--puzzle", metavar="ID", help="Get full details of a specific puzzle")

    args = parser.parse_args()

    # Determine data sources to load
    base_dir = args.base_dir or str(default_base_dir())
    pz_dir = args.puzzle_dir or str(default_puzzle_dir())

    # Games: load unless --puzzles restricts to catalog only
    load_games = not args.puzzles
    games = find_games(base_dir) if load_games else []

    # Puzzles: always load (unified search includes catalog by default)
    # Skip loading puzzles for game-only modes that don't use them
    game_only_modes = {args.list_games, args.game is not None, args.recent_mechanics, args.type is not None}
    needs_puzzles = not any(game_only_modes) or args.puzzles
    puzzles = find_puzzles(pz_dir, include_discarded=args.include_discarded) if needs_puzzles else None

    # When --puzzles is set and we have no games, pass empty list + puzzles
    puzzles_only = args.puzzles

    kw = {"games": games, "puzzles": puzzles, "puzzles_only": puzzles_only}

    if args.theme:
        result = cmd_theme(theme_query=args.theme, **kw)
    elif args.mechanic:
        result = cmd_mechanic(mechanic_query=args.mechanic, **kw)
    elif args.difficulty:
        result = cmd_difficulty(diff_spec=args.difficulty, **kw)
    elif args.type:
        result = cmd_type(type_query=args.type, games=games)
    elif args.list_mechanics:
        result = cmd_list_mechanics(**kw)
    elif args.list_games:
        result = cmd_list_games(games=games)
    elif args.game:
        result = cmd_game(game_name=args.game, games=games)
    elif args.similar:
        result = cmd_similar(similar_query=args.similar, **kw)
    elif args.recent_mechanics:
        result = cmd_recent_mechanics(games=games)
    elif args.list_puzzles:
        result = cmd_list_puzzles(puzzles=puzzles or [])
    elif args.list_categories:
        result = cmd_list_categories(puzzles=puzzles or [])
    elif args.puzzle:
        result = cmd_puzzle_detail(puzzles=puzzles or [], puzzle_id=args.puzzle)
    else:
        parser.print_help()
        sys.exit(1)

    if args.pretty:
        print(format_pretty(result))
    else:
        print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
