---
name: pipeline-explore
description: "Trigger: crear escape room nuevo, iniciar pipeline, FASE 1. Parsea petición, selecciona game type, busca pruebas existentes, genera BRIEF.json con research automático."
metadata:
  version: "2.0"
  scope: [escape-design]
  pipeline_phase: 1
---

# Pipeline Explore (FASE 1)

## Activation Contract

User requests creating an escape room. This is always the first phase.

## Hard Rules

1. **Datos obligatorios** → Missing = stop with `datos_pendientes`. Never assume values for required fields.
2. **Game type** → MUST be one of: `game-type-hall-escape`, `game-type-street-escape`, `game-type-investigation`.
3. **Skills** → ONLY IDs from `skill-registry.json`. Minimum 3 recommended.
4. **Candidates** → Max 10, classified by relevance.
5. **Evitar repetición** → Always check history, exclude recent puzzles.

## Decision Gates

### Project detection

If user doesn't specify project → ask. Known projects in `references/project-specs.md`.

If project → read PROJECT-SPECS.md, overrides defaults.

## Execution Steps

### Step 1: Parse user request

Extract: temática, jugadores, duración, dificultad, objetivo, notas.

| Field | Required | Default |
|-------|----------|---------|
| Temática | ✅ | — |
| Jugadores (min/max) | ✅ | 2-6 |
| Duración (minutos) | ✅ | 60 |
| Dificultad (1-5) | ✅ | 3 |
| Objetivo | ✅ | — |
| Proyecto | ✖ | null |

Missing required → fill `datos_pendientes` with questions and STOP.

### Step 2: Determine game type

Read 3 GAMETYPE.md files. Compare with user request. Select best fit, justify.

### Step 3: Search real games (MANDATORY)

```bash
python3 scripts/search-games.py --similar "{tema}" --pretty
python3 scripts/search-games.py --mechanic "prueba-XXX" --pretty
python3 scripts/search-games.py --recent-mechanics --pretty
```

Extract: what worked, playtest lessons, avoid recent mechanics. Rules in `references/game-search-rules.md`.

### Step 4: Thematic research (if needed)

If theme needs real data (historical, scientific, geographical):

```bash
python3 services/scripts/searxng-search.py "[tema] escape room facts" 10
python3 services/scripts/perplexica-search.py "Research [tema] for escape room" webSearch
```

Fallback: `webfetch` if search stack unavailable.

### Step 5: Historical context

Check generated game history → identify recent puzzles → add to `puzzles_recientes_evitar`.

### Step 6: Select frameworks + skills

Frameworks: match theme + game type. Skills: min 3 from registry.

### Step 7: Generate BRIEF.json

Compose and save to `{output_dir}/BRIEF.json`. Schema in `references/brief-schema.md`.

## Output Contract

`BRIEF.json` in `{output_dir}/BRIEF.json`. Schema: `references/brief-schema.md`.

## References

- `references/brief-schema.md` — Full BRIEF.json schema
- `references/project-specs.md` — Known project defaults
- `references/game-search-rules.md` — Game search rules and variety constraints
- `references/research-tools.md` — Search stack tools and fallbacks
