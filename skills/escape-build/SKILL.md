---
name: escape-build
description: "Trigger: build escape room documents, generate PDF, crear documentos escape. HTML→PDF generation with themed templates and materials output."
---

# Escape Room Build — Templates & Materials

## Activation Contract

Load when generating printable escape room documents from game JSON files. Produces Design Document, Tests Document, and in-game materials.

## Hard Rules

1. **Zero dependencies.** All HTML uses only bundled `escape-base.css`. No external fonts, no JavaScript, no network requests. Must render correctly as local file and print to A4 from any browser or Puppeteer.
2. **A4 format.** Margins: 12mm top/bottom, 10mm left/right. `printBackground: true`.

## Execution Steps

### Build Command

```bash
node scripts/build-pdf.mjs <input.html> [--output <output.pdf>]
```

Uses Puppeteer to render HTML→PDF.

### Step 1: Generate Design Document

Build `game-design.html` with: Cover, Synopsis, Game Structure table, Flow Diagram, Proof Cards (one per puzzle), GM Sheet, Materials List.

### Step 2: Generate Tests Document

Build `game-tests.html` with: Test Cover, Walkthrough Test (one section per puzzle), Hint Escalation Test, Anti-Cheat Test, Duration Test, Flow Test, Accessibility Test.

### Step 3: Generate In-Game Materials

Create documents from `prueba.documentos_in_game`. Seven types: `diario`, `carta`, `tarjeta`, `etiqueta`, `tablero`, `cartel`, `fragmento`. Each generates HTML snippet + print-ready CSS + cut/fold guides.

### Step 4: Render to PDF

```bash
node scripts/build-pdf.mjs build/game-design.html --output output/game-design.pdf
node scripts/build-pdf.mjs build/game-tests.html --output output/game-tests.pdf
```

### Page Break Rules

Never break inside `.proof-card`, `.materials-table`, `.gm-sheet`. Force break before `h2`. Keep `h3`/`h4` with their content.

## Output Contract

- Design Document PDF: `output/game-design.pdf`
- Tests Document PDF: `output/game-tests.pdf`
- In-game materials: HTML snippets per puzzle document

## References

- `references/css-variables.md` — 8 color variables, 6 theme presets
- `references/component-classes.md` — All CSS component classes
- `references/materials-templates.md` — 7 material types with templates
- `references/document-checklists.md` — Full checklists, page break rules, game type adaptations
