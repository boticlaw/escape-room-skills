#!/usr/bin/env python3
"""Search through real game examples in examples/real-games/.

Supports: --theme, --mechanic, --difficulty, --type, --list-mechanics,
          --list-games, --game, --similar, --recent-mechanics.

Zero external dependencies — stdlib only.
Output: JSON to stdout. Use --pretty for human-readable output.
"""

import argparse
import json
import os
import re
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


def find_games(base_dir):
    """Discover all games under base_dir.

    Strategy:
    1. Look for juego/juego.json inside each subdirectory (canonical path).
    2. Look for juego.json at the game root (e.g. el-legado-de-la-familia/juego.json).
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


def text_content(game_meta):
    """All searchable text for a game joined together."""
    parts = [
        game_meta.get("nombre", ""),
        game_meta.get("descripcion", ""),
        game_meta.get("narrativa", ""),
        game_meta.get("tematica", ""),
        game_meta.get("tipo", ""),
        " ".join(game_meta.get("mechanics", [])),
    ]
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
# Search commands
# ---------------------------------------------------------------------------

def cmd_theme(games, theme_query, **_kw):
    """Search by theme/topic in names, descriptions, narratives."""
    results = []
    for g in games:
        meta = extract_game_metadata(g)
        txt = text_content(meta)
        score = keyword_overlap_score(txt, theme_query)
        if score > 0:
            results.append({"game": _summarize(meta, g), "score": round(score, 3)})
    results.sort(key=lambda r: r["score"], reverse=True)
    return {"mode": "theme", "query": theme_query, "results": results}


def cmd_mechanic(games, mechanic_query, **_kw):
    """Search by mechanic (matches skill_primario or skills_secundarios)."""
    results = []
    mech_norm = normalize(mechanic_query)
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
            })
    return {"mode": "mechanic", "query": mechanic_query, "results": results}


def cmd_difficulty(games, diff_spec, **_kw):
    """Search by difficulty range."""
    dmin, dmax = parse_difficulty_range(diff_spec)
    results = []
    for g in games:
        meta = extract_game_metadata(g)
        d = meta.get("dificultad")
        if d is not None and dmin <= d <= dmax:
            results.append({"game": _summarize(meta, g)})
    return {"mode": "difficulty", "range": diff_spec, "results": results}


def cmd_type(games, type_query, **_kw):
    """Search by game type."""
    type_norm = normalize(type_query)
    results = []
    for g in games:
        meta = extract_game_metadata(g)
        if meta.get("tipo") and type_norm in normalize(meta["tipo"]):
            results.append({"game": _summarize(meta, g)})
    return {"mode": "type", "query": type_query, "results": results}


def cmd_list_mechanics(games, **_kw):
    """List all mechanics with frequency and which games use them."""
    counter = Counter()
    mechanic_games = {}
    for g in games:
        meta = extract_game_metadata(g)
        for m in meta["mechanics"]:
            counter[m] += 1
            mechanic_games.setdefault(m, []).append(meta["nombre"])
    results = []
    for mech, count in counter.most_common():
        results.append({
            "mechanic": mech,
            "count": count,
            "games": mechanic_games[mech],
        })
    return {"mode": "list-mechanics", "total_mechanics": len(results), "results": results}


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


def cmd_similar(games, similar_query, **_kw):
    """Find games similar to a given theme (fuzzy keyword matching)."""
    results = []
    for g in games:
        meta = extract_game_metadata(g)
        txt = text_content(meta)
        score = keyword_overlap_score(txt, similar_query)
        # Also try partial word matching
        query_words = normalize(similar_query).split()
        text_norm = normalize(txt)
        for qw in query_words:
            if len(qw) >= 3 and qw in text_norm:
                score += 0.3
        if score > 0:
            results.append({"game": _summarize(meta, g), "score": round(score, 3)})
    results.sort(key=lambda r: r["score"], reverse=True)
    return {"mode": "similar", "query": similar_query, "results": results}


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


def format_pretty(data):
    """Format output for human readability."""
    lines = []
    mode = data.get("mode", "")

    if mode == "theme":
        lines.append(f"🎨 Theme search: {data['query']}")
        lines.append("=" * 60)
        for r in data["results"]:
            g = r["game"]
            lines.append(f"\n  {g.get('nombre', g['name'])} (score: {r['score']})")
            lines.append(f"    Tipo: {g.get('tipo', '?')} | Dificultad: {g.get('dificultad', '?')} | Puzzles: {g.get('num_puzzles', '?')}")
            if g.get("playtest_score"):
                lines.append(f"    Playtest: {g['playtest_score']}")
            lines.append(f"    Mecánicas: {', '.join(g.get('mechanics', []))}")
        if not data["results"]:
            lines.append("  No results found.")

    elif mode == "mechanic":
        lines.append(f"⚙️  Mechanic search: {data['query']}")
        lines.append("=" * 60)
        for r in data["results"]:
            g = r["game"]
            lines.append(f"\n  {g.get('nombre', g['name'])}")
            lines.append(f"    Matching: {', '.join(r['matching_mechanics'])}")
            lines.append(f"    Dificultad: {g.get('dificultad', '?')} | Puzzles: {g.get('num_puzzles', '?')}")
        if not data["results"]:
            lines.append("  No results found.")

    elif mode == "difficulty":
        lines.append(f"📊 Difficulty range: {data['range']}")
        lines.append("=" * 60)
        for r in data["results"]:
            g = r["game"]
            lines.append(f"\n  {g.get('nombre', g['name'])} (dif: {g.get('dificultad', '?')})")
            lines.append(f"    Tipo: {g.get('tipo', '?')} | Puzzles: {g.get('num_puzzles', '?')}")
        if not data["results"]:
            lines.append("  No results found.")

    elif mode == "type":
        lines.append(f"🏷️  Type search: {data['query']}")
        lines.append("=" * 60)
        for r in data["results"]:
            g = r["game"]
            lines.append(f"\n  {g.get('nombre', g['name'])}")
            lines.append(f"    Tipo: {g.get('tipo', '?')} | Dificultad: {g.get('dificultad', '?')} | Puzzles: {g.get('num_puzzles', '?')}")
        if not data["results"]:
            lines.append("  No results found.")

    elif mode == "list-mechanics":
        lines.append(f"⚙️  All mechanics ({data['total_mechanics']} unique)")
        lines.append("=" * 60)
        for r in data["results"]:
            games_str = ", ".join(r["games"])
            lines.append(f"\n  {r['mechanic']} ({r['count']} game(s))")
            lines.append(f"    Used in: {games_str}")

    elif mode == "list-games":
        lines.append(f"🎮 All games ({data['total_games']} total)")
        lines.append("=" * 60)
        for g in data["results"]:
            lines.append(f"\n  {g.get('nombre', g['name'])}")
            lines.append(f"    Slug: {g['name']}")
            lines.append(f"    Tipo: {g.get('tipo', '?')} | Dificultad: {g.get('dificultad', '?')} | Puzzles: {g.get('num_puzzles', '?')}")
            if g.get("playtest_score"):
                lines.append(f"    Playtest: {g['playtest_score']}")
            lines.append(f"    Mecánicas: {', '.join(g.get('mechanics', []))}")

    elif mode == "game":
        d = data.get("result")
        if not d:
            lines.append(f"❌ Game not found: {data['query']}")
        else:
            lines.append(f"🎮 {d.get('nombre', d['name'])}")
            lines.append("=" * 60)
            lines.append(f"  Slug: {d['name']}")
            lines.append(f"  Tipo: {d.get('tipo', '?')}")
            lines.append(f"  Dificultad: {d.get('dificultad', '?')}")
            lines.append(f"  Descripción: {d.get('descripcion', '?')}")
            lines.append(f"  Puzzles: {d.get('num_puzzles', '?')}")
            lines.append(f"  Mecánicas: {', '.join(d.get('mechanics', []))}")
            lines.append(f"  Playtest: {'Sí (' + str(d['playtest_score']) + ')' if d.get('playtest_score') else 'No'}")
            lines.append(f"  BRIEF: {'Sí' if d.get('has_brief') else 'No'}")
            lines.append(f"\n  Puzzles:")
            for p in d.get("puzzles", []):
                lines.append(f"    {p.get('id', '?')}: {p.get('nombre', '?')} (dif: {p.get('dificultad', '?')}, skill: {p.get('skill_primario', '?')})")

    elif mode == "similar":
        lines.append(f"🔍 Similar to: {data['query']}")
        lines.append("=" * 60)
        for r in data["results"]:
            g = r["game"]
            lines.append(f"\n  {g.get('nombre', g['name'])} (score: {r['score']})")
            lines.append(f"    Tipo: {g.get('tipo', '?')} | Dificultad: {g.get('dificultad', '?')} | Puzzles: {g.get('num_puzzles', '?')}")
            lines.append(f"    Mecánicas: {', '.join(g.get('mechanics', []))}")
        if not data["results"]:
            lines.append("  No similar games found.")

    elif mode == "recent-mechanics":
        lines.append("🕐 Recent mechanics (by modification date)")
        lines.append("=" * 60)
        for r in data["results"]:
            lines.append(f"\n  {r['game']} ({r['date']})")
            lines.append(f"    Mecánicas: {', '.join(r['mechanics'])}")

    else:
        lines.append(json.dumps(data, indent=2, ensure_ascii=False))

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Search real game examples for escape room design reference."
    )
    parser.add_argument(
        "--base-dir",
        default=None,
        help="Base directory containing game folders (default: examples/real-games/ relative to script)",
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
    group.add_argument("--similar", metavar="QUERY", help="Find games similar to a theme (fuzzy)")
    group.add_argument("--recent-mechanics", action="store_true", help="List mechanics sorted by recency")

    args = parser.parse_args()

    base_dir = args.base_dir or str(default_base_dir())
    games = find_games(base_dir)

    kw = {"games": games}

    if args.theme:
        result = cmd_theme(theme_query=args.theme, **kw)
    elif args.mechanic:
        result = cmd_mechanic(mechanic_query=args.mechanic, **kw)
    elif args.difficulty:
        result = cmd_difficulty(diff_spec=args.difficulty, **kw)
    elif args.type:
        result = cmd_type(type_query=args.type, **kw)
    elif args.list_mechanics:
        result = cmd_list_mechanics(**kw)
    elif args.list_games:
        result = cmd_list_games(**kw)
    elif args.game:
        result = cmd_game(game_name=args.game, **kw)
    elif args.similar:
        result = cmd_similar(similar_query=args.similar, **kw)
    elif args.recent_mechanics:
        result = cmd_recent_mechanics(**kw)
    else:
        parser.print_help()
        sys.exit(1)

    if args.pretty:
        print(format_pretty(result))
    else:
        print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
