---
name: pipeline-remix
description: "Trigger: remix escape room, variante juego, adaptar juego existente, modificar juego. Crea variante de juego existente sin empezar de cero. Preserva lo que funciona, modifica lo solicitado."
---

# Pipeline Remix — Game Variants

## Activation Contract

User requests modifying an existing game. Game must exist in `examples/real-games/`.

**NO use when**: game doesn't exist, changes are so large nothing remains (use full pipeline).

## Hard Rules

1. **Preserve first**: always prioritize keeping what worked (high playtest score).
2. **Eliminate by data**: remove puzzles based on playtest data, not assumptions.
3. **Preservation score < 0.4**: warn user — suggest full pipeline instead.
4. **Don't remove only cooperative puzzle** if game has just one.
5. **Narrative coherence**: after removing puzzles, adjust narrative to remove orphaned references.
6. **Materials updated**: list reflects only remix puzzles.
7. **Reference source**: `juego.json` includes `"remix_of": "base-game"`.

## Modification Impact Analysis

### Players change (e.g. 6→4)

| Impact | Changes |
|--------|---------|
| Cooperative puzzles | Adapt or replace if requires > new max |
| Role distribution | Reassign for fewer players |
| Search puzzles | Reduce area/elements |

Rule: puzzle requires `jugadores_min > nuevos_max` → incompatible → replace.

### Theme change

Mechanics preserved. Only "skin" changes: narrative, names, in-game docs, props.

### Difficulty change (e.g. 4→2)

Don't drop any single puzzle >2 points. Need >3 drop → replace mechanic.

### Duration change (e.g. 50→30min)

Reduce puzzles proportionally. Always eliminate worst playtest score FIRST. Never eliminate the best.

### Type change (e.g. hall→concurso)

Most destructive. Only preserve theme + research data.

### Add/remove puzzles

- **Add**: search unused mechanics with `search-games.py --list-mechanics`
- **Remove**: priority: (1) worst playtest, (2) repeated mechanic, (3) most frustration

## Execution Steps

### Step 1: Load base game

```bash
python3 scripts/search-games.py --game "{base_game}" --pretty
```

If not found → error + list available games.

Read ALL files: juego.json, puzzles, playtest-report, design, narrative, BRIEF.

### Step 2: Analyze modifications

For each requested change, determine impact using tables above.

### Step 3: Generate change plan

```json
{
  "base_game": "protocolo-alerta-verde",
  "modifications_requested": ["duración: 30min", "jugadores: 4"],
  "changes": [
    {"action": "keep", "puzzle": "P1", "reason": "Good playtest, proven mechanic"},
    {"action": "modify", "puzzle": "P2", "change": "Reduce dificultad 5→3"},
    {"action": "remove", "puzzle": "P4", "reason": "Worst playtest score"},
    {"action": "keep", "puzzle": "P6", "reason": "Final reward puzzle, good score"}
  ],
  "preservation_score": 0.65
}
```

### Step 4: Present plan to user

User can: accept, adjust, or cancel.

### Step 5: Execute changes

- **KEEP**: copy without changes
- **MODIFY**: adjust specific fields (difficulty, roles, duration)
- **REMOVE**: don't copy + redirect rewards + adjust hilo conductor + clean narrative
- **ADD**: search mechanic → design new puzzle → insert in sequence

### Step 6: Rebuild global files

Regenerate: juego.json, DISEÑO-JUEGO.md, NARRATIVA.md, lista-materiales.md.

### Step 7: Verify + Diff

Run `pipeline-verify`. Generate REMIX-DIFF.json. Schema in `references/report-schemas.md`.

### Step 8: Optional full validation

User can request playtest + judgment-day on remix.

## Output Contract

```
{output_dir}/{remix_name}/
├── juego.json
├── REMIX-DIFF.json
└── juego/
    ├── narrativa/NARRATIVA.md
    ├── diseño/DISEÑO-JUEGO.md
    ├── materiales/lista-materiales.md
    └── pruebas/*.json
```

## References

- `references/report-schemas.md` — Plan, REMIX-DIFF, and inventory schemas
