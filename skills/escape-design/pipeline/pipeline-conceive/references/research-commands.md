# Research Commands for Conceive

## Puzzle Catalog (82+ puzzles — CONSULT BEFORE GENERATING)

```bash
# Search puzzles by theme
python3 scripts/search-games.py --puzzles --similar "{tema_del_brief}" --pretty

# Search by mechanic
python3 scripts/search-games.py --puzzles --mechanic "{mecanica_deseada}" --pretty

# Search by difficulty range
python3 scripts/search-games.py --puzzles --difficulty {dificultad_objetivo} --pretty

# List categories
python3 scripts/search-games.py --puzzles --list-categories --pretty

# View specific puzzle detail
python3 scripts/search-games.py --puzzles --puzzle "{puzzle_id}" --pretty

# Include discarded (to learn what NOT to do)
python3 scripts/search-games.py --puzzles --include-discarded --mechanic "{mecanica}" --pretty
```

Extract from catalog:
- **Available mechanics**: What skills exist and how many puzzles use them
- **Real difficulty range**: Per-mechanic difficulty levels
- **Estimated durations**: Typical times per puzzle type
- **Tested vs ideas**: Tested ones are more reliable
- **Discarded**: What mechanics did NOT work and why

## Real Games (consult AFTER catalog)

```bash
# Search games with similar theme
python3 scripts/search-games.py --similar "{tema_del_brief}" --pretty

# Search by game type
python3 scripts/search-games.py --type "{game_type}" --pretty

# List all mechanics
python3 scripts/search-games.py --list-mechanics --pretty

# View complete game detail
python3 scripts/search-games.py --game "legado-tinta-violeta" --pretty
```

Extract from each referenced game:
- **Narrative pattern**: Mystery type, story structure
- **Hook**: Initial hook and why it worked
- **Emotional arc**: What emotions and in what order
- **Playtest lessons**: What worked best/worst

## Inject into Judge Prompts

```
## Catálogo de pruebas individuales (82+ pruebas, datos reales)
{output del search-games.py --puzzles}

## Juegos reales de referencia (inspiración, NO copiar)
{output del search-games.py --similar}

Reglas:
- Inspirarse en PATRONES (tipo de arco, estructura, variedad)
- NO copiar narrativas ni mecánicas específicas
- Evitar patrones documentados como problemáticos en playtests
- Priorizar mecánicas con mejor recepción en playtests reales
```
