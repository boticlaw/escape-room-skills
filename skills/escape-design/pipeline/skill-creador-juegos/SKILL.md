---
name: skill-creador-juegos
description: "Trigger: crear juego escape room completo, diseñar juego desde cero, juego nuevo. Diseña juegos completos: narrativa, pruebas y flujo coherente. Genera PDF de presentación."
---

# Creador de Juegos de Escape

## Activation Contract

User requests creating a complete escape room game (new, expand, reorganize, or validate).

## Flow

```
1. Gather context → 2. Find skills → 3. Find reusable puzzles → 4. Propose combination → 5. Narrative + flow → 6. New puzzle cards → 7. Validate → 8. Generate PDF
```

## Step 1: Gather Context

Confirm before designing. Ask if missing:

| Variable | Values | Default |
|----------|--------|---------|
| `tipo` | hall_escape / street_escape / investigacion | — |
| `tematica` | medieval, futurista, mitologia, crimen, terror... | — |
| `jugadores` | min-max | 2-6 |
| `duracion_minutos` | 30-90 | 60 |
| `dificultad` | 1-10 | 5 |
| `objetivo` | escapar / investigar / recuperar / resolver | escapar |

### Mandatory physical space questions

1. **Available space?** (rooms, floors, outdoors, approximate area)
2. **Special structures?** (fish tanks, glass walls, lockable doors, stairs)
3. **Can groups see/hear each other?** (affects cooperative vs competitive)
4. **Available materials?** (tablets, microscopes, locks, boxes, lights)

### Format: Cooperative vs Competitive

| Format | When | Advantage |
|--------|------|-----------|
| **Cooperative** | Small groups, limited space | All collaborate, less tension |
| **Competitive** | 2 groups, can see/hear, user wants excitement | More tension, replayability |

## Step 2: Find Skills

Search `.agents/skills/` for `prueba-*` patterns. Categories:

- **Physical**: prueba-punteria-derribo, prueba-panel-electrico
- **Digital**: prueba-tablet-cooperativo, prueba-laberinto-digital
- **Logic**: prueba-logica-posiciones, prueba-logica-secuencial
- **Communication**: prueba-comunicacion-mensajes
- **Exploration**: prueba-exploracion-visual, prueba-ubicacion-qr, prueba-gps-navegacion
- **Memory**: prueba-emparejamiento-memoria
- **Investigation**: prueba-investigacion-texto, prueba-acrostico-ubicacion

**Rule**: Max 2 of same skill type per game.

## Step 3: Find Reusable Puzzles

Check `pruebas/*.json`. Verify: theme compatible, skill matches, reward code changeable.

**Priority**: Reuse > Adapt > Create new.

## Step 4: Propose Combination

### Recommended puzzle count

| Duration | Puzzles |
|----------|---------|
| 30 min | 3-4 |
| 45 min | 4-6 |
| 60 min | 5-8 |
| 90 min | 7-10 |

### Mandatory variety

- ≥1 physical/manipulative
- ≥1 logic/deduction
- ≥1 cooperative (if >2 players)
- 1 final puzzle integrating previous elements

### Difficulty progression

```
P1-2: Easy (2-3) → Introduction
P3-4: Medium (4-5) → Development
P5-6: High (6-7) → Climax
P7+:  Variable → Closing
```

## Step 5: Narrative + Flow

### Required narrative elements

1. **Hook** — Why they're there, what to do
2. **Conflict** — What went wrong
3. **Clear objective** — What to achieve to win
4. **Conclusion** — What happens when they succeed

Flow patterns: see `references/flow-patterns.md`.

## Step 6: Write Narrative Document

`{nombre_juego}.md` with: Config, Narrative (Intro, Conflict, Objective), Puzzle Flow, GM Hints, Physical Elements.

Template in `references/narrative-template.md`.

## Step 7: Create New Puzzle Cards

For each new puzzle: identify skill_primario → read its SKILL.md → create `pruebas/prueba_{juego}_{tipo}_001.json` with 3+ hint levels + documented solution.

## Step 8: Generate PDF (MANDATORY)

```bash
python3 scripts/generate-pdf-html.py "{game_dir}/" "{game_dir}/{game}.pdf"
```

Uses Puppeteer (HTML+CSS → PDF A4). PDF must include: cover, synopsis, structure, puzzle flow, individual puzzle cards, codes summary. Style rules in `references/pdf-style.md`.

## Validation Checklist

Quick: [ ] Narrative connects all puzzles [ ] Skill variety (max 2 same) [ ] Difficulty progression [ ] Time coherent [ ] Every puzzle has documented solution.

Full checklist: `references/checklist-validacion.md`.

Common errors: see `references/common-errors.md`.

## References

- `references/flow-patterns.md` — Game flow patterns (linear, branching, etc.)
- `references/narrative-template.md` — Full narrative document template
- `references/pdf-style.md` — PDF generation style rules (no emojis, CSS inline, etc.)
- `references/checklist-validacion.md` — Complete validation checklist
- `references/common-errors.md` — Common design errors and fixes
- `references/creative-materials.md` — Creative use of available materials
