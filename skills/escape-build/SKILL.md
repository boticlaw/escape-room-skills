---
name: escape-build
description: "Trigger: build escape room documents, generate PDF, crear documentos escape. HTML→PDF generation with themed templates and materials output."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "2.0"
---

# Escape Room Build — Templates & Materials

## Activation Contract

Load when generating printable escape room documents from game JSON files. Produces Design Document, Tests Document, and in-game materials.

## Hard Rules

1. **Zero dependencies.** All HTML uses only bundled `escape-base.css`. No external fonts, JavaScript, or network requests. Must render as local file and print to A4.
2. **A4 format.** Margins: 12mm top/bottom, 10mm left/right. `printBackground: true`.
3. **STYLE.json required.** Derive all colors/fonts from `juego/STYLE.json`. Never hardcode. If missing → ask user for preferences.
4. **Print-first design.** Follow `references/print-design-guide.md`. Min body text: 10pt. Min contrast: 60% luminosity diff. No text below 8pt.
5. **Props, not documents.** Every material must look like a physical prop. Apply treatments from `STYLE.json.tratamientos_visuales`. If it looks like an email or spreadsheet → it's not done.
6. **Correct material classification.** Every material gets the right prefix: `reco-` (reward in locked box), `deco-` (pure flavor, zero puzzle info), or no prefix (solving material). Test: "If a player never sees this, can they still solve?" If NO → no prefix, not `deco-`. See `references/document-checklists.md` for full classification rules.

## Decision Gates

| Condition | Action |
|-----------|--------|
| `STYLE.json` exists in `juego/` | Use it → continue |
| User provides style reference | Generate `STYLE.json` from description → continue |
| No style preference | Ask user → auto-generate from genre preset → continue |

## Execution Steps

### Step 0: Load Style Guide

Read `juego/STYLE.json`. Derive CSS variables, fonts, components, textures, layout from the style guide. If missing → resolve via Decision Gate above.

### Step 1: Generate Game Guide

Build `00-guia-completa-juego.html` (A4, themed CSS). Sections: Cover → Ficha Técnica → Personajes → Flujo del Juego → Hilo Conductor → Pruebas (1 page each with detailed mechanics) → Candados y Códigos → Inventario.

Each puzzle page MUST have enough mechanical detail to understand HOW the puzzle works without seeing materials.

### Step 2: Generate Tests Document

Build `game-tests.html`: Test Cover, Walkthrough, Hint Escalation, Anti-Cheat, Duration, Flow, Accessibility.

### Step 3: Generate In-Game Materials

Create documents from `prueba.documentos_in_game`. Types: `diario`, `carta`, `tarjeta`, `etiqueta`, `tablero`, `cartel`, `fragmento`.

**Visual Treatment Pipeline (MANDATORY):** For EVERY material: read `STYLE.json.tratamientos_visuales` → identify material type → apply matching treatments → verify prop quality. See `references/visual-treatment-pipeline.md` for the full treatment table and intensity rules.

### Step 4: Render to PDF

```bash
node scripts/build-pdf.mjs build/game-design.html --output output/game-design.pdf
node scripts/build-pdf.mjs build/game-tests.html --output output/game-tests.pdf
```

**Page break rules:** Never break inside `.proof-card`, `.materials-table`, `.gm-sheet`. Force break before `h2`.

## Output Contract

- `output/game-design.pdf` — Design Document
- `output/game-tests.pdf` — Tests Document
- In-game materials: HTML snippets per puzzle document in `materiales/`

## References

- `references/css-variables.md` — Dynamic CSS variables from STYLE.json
- `references/style-schema.md` — STYLE.json schema and genre presets
- `references/component-classes.md` — All CSS component classes
- `references/materials-templates.md` — 7 material types with templates
- `references/document-checklists.md` — Full checklists, page break rules
- `references/print-design-guide.md` — Print design principles and textures
- `references/visual-treatment-pipeline.md` — Treatment table per material type + intensity rules
