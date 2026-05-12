# Puzzle Catalog Lookup (build phase only)

When phase = `build`, also search relevant puzzles in existing catalog.

## Catalog Location

`escape-material/pruebas/`

## Search Process

1. Read `escape-material/pruebas/review-tracker.json`
2. Filter `ideas` with `"estado": "validada"`
3. Cross-reference with game design:
   - `skill_primario` matching design needs
   - `dificultad` within target range
   - `coste` within budget
   - `edad_recomendada` matching audience
4. Include matching puzzle paths:

```
PUZZLE_CATALOG:
- escape-material/pruebas/prueba-laberinto-hilos.json
- escape-material/pruebas/prueba-cifrado-simbolos-001.json
```

## Search Commands

```bash
# Filter validated from review-tracker.json
jq '[.ideas[] | select(.estado == "validada") | .archivo]' review-tracker.json
```

## Rules

- Build agent MUST review catalog puzzles BEFORE creating new ones
- Prefer existing puzzles, adapt to context
- Only create new if catalog doesn't cover needs
- Document which catalog puzzles used vs new
