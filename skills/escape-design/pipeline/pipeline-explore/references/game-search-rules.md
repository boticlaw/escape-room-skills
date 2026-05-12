# Game Search Rules

## Search Commands

```bash
python3 scripts/search-games.py --theme "[tema]" --pretty
python3 scripts/search-games.py --mechanic "prueba-XXX" --pretty
python3 scripts/search-games.py --list-mechanics --pretty
python3 scripts/search-games.py --recent-mechanics --pretty
python3 scripts/search-games.py --similar "[tema]" --pretty
python3 scripts/search-games.py --list-games --pretty
```

## Extraction Rules

1. **Inspiration**: For each similar game, extract mechanics that worked, difficulty curve, playtest lessons, narrative patterns.
2. **No repeat**: If mechanic appeared in last 2-3 games, prioritize alternatives.
3. **Calibration**: Compare target difficulty against existing games at that level.
4. **Variety rule**: If >50% of existing games use same primary mechanic, prioritize less-used ones.
5. **Existing candidates**: List puzzles as reference (not direct reuse).

## Research Tools

| Tool | Use | Availability |
|------|-----|-------------|
| `services/scripts/searxng-search.py` | Raw multi-engine search | Requires SearXNG (localhost:8888) |
| `services/scripts/perplexica-search.py` | AI search with citations | Requires Perplexica (localhost:3100) |
| `curl r.jina.ai/URL` | Extract URL content | No install needed |
| `webfetch` | Direct web search | Fallback |
| `scripts/search-games.py` | Search real games | Always available |

## Referenced Files

| File | Purpose |
|------|---------|
| `game-types/*/GAMETYPE.md` | Game type definitions |
| `schemas/skill-registry.json` | Available skills registry |
| `research-frameworks/*.md` | Research frameworks |
| `SEARCH-SETUP.md` | Search stack installation |
