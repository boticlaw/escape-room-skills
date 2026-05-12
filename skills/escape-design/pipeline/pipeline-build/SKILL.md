---
name: pipeline-build
description: "Trigger: construir juego escape room, generar archivos juego, FASE 4 pipeline. Genera estructura, pruebas, narrativa, diseño, materiales y PDF final desde DESIGN.json."
---

# Pipeline Build (FASE 4)

## Activation Contract

After DESIGN + DIFFICULTY-REPORT pass. DESIGN.json, CONCEPT.json, BRIEF.json available.

## Hard Rules

1. Every new puzzle validates against `schemas/prueba.schema.json`.
2. Minimum 3 hint levels per new puzzle (5 recommended).
3. IDs: `prueba_{mecanica}_{slug}_{001}`.
4. **No placeholders** — all files complete, no TODO text.
5. Narrative covers intro, all acts, climax, resolution.
6. Design doc includes ordered puzzle list, flow, times, GM hints.

## Execution Steps

### Step 1: Initialize structure

```bash
python3 scripts/init-juego.py "{juego-id}" "{output_dir}"
```

### Step 2: Write `juego.json`

Map from BRIEF + CONCEPT + DESIGN. Schema in `references/schemas.md`.

Data sources:
- `nombre`, `tipo`, `jugadores_*`, `duracion_minutos`, `dificultad`, `tags` → BRIEF.json
- `subtitulo` → CONCEPT.json.tagline
- `descripcion` → CONCEPT.json.premisa
- `color_*` → derive from theme
- `fecha_creacion` → current ISO-8601

### Step 3: Copy existing puzzles

If DESIGN references existing puzzles:
```bash
cp escape-material/pruebas/*.json juegos/{juego-id}/juego/pruebas/
```

### Step 4: Generate new puzzles

For each new puzzle in `DESIGN.json.pruebas_nuevas_requeridas`:

**4a.** Consult catalog for reference format:
```bash
python3 scripts/search-games.py --puzzles --mechanic "{skill_primario}" --pretty
```

**4b.** Read the skill's SKILL.md + `schemas/prueba.schema.json`.

**4c.** Generate full JSON with: id, nombre, skill_primario, metadata_contextual, descripcion, dificultad, duracion_estimada_minutos, configuracion, materiales, pistas (3-5 levels), solucion, feedback_exito, feedback_fallo.

**4d.** Save to `juegos/{juego-id}/juego/pruebas/`.

### Step 5: Write narrative, design, materials

| File | Source | Template |
|------|--------|----------|
| `juego/narrativa/NARRATIVA.md` | CONCEPT.json | `references/templates.md` |
| `juego/diseño/DISEÑO-JUEGO.md` | DESIGN.json | `references/templates.md` |
| `juego/materiales/lista-materiales.md` | DESIGN.materiales_requeridos | `references/templates.md` |

### Step 6: Generate PDF

```bash
python3 scripts/generate-pdf-html.py "{output_dir}/{juego-id}/" "{output_dir}/{juego-id}/{juego-id}.pdf"
```

Optional explicit colors as 3rd/4th args: `"#5C4033" "#D4AF37"`.

Uses: `templates/escape-room-template.html` (HTML+CSS), Puppeteer engine.

## Output Contract

```
{output_dir}/{juego-id}/
├── juego.json
├── {juego-id}.pdf
└── juego/
    ├── narrativa/NARRATIVA.md
    ├── diseño/DISEÑO-JUEGO.md
    ├── materiales/lista-materiales.md
    └── pruebas/*.json
```

## References

- `references/schemas.md` — juego.json + prueba JSON schemas
- `references/templates.md` — NARRATIVA, DISEÑO-JUEGO, lista-materiales templates
