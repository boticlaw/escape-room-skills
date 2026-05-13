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
3. **STYLE.json required.** All materials must read visual identity from `juego/STYLE.json`. Never hardcode colors or fonts — derive CSS from the style guide. If `STYLE.json` is missing, ask the user for style preferences before generating.
4. **Print-first design.** All materials follow `references/print-design-guide.md`. Minimum body text: 10pt. Minimum contrast: 60% luminosity difference. No text below 8pt. Dark backgrounds only for short signs/posters — never for long documents.
5. **Props, not documents.** Every material must look like a physical prop when printed. Tables get ornamental borders. Photos get Polaroid frames. Letters get signature lines and wax seals. Diaries get notebook lines. Cards get textured backgrounds. Scratch-off seals get silver gradients. Apply treatments from `STYLE.json.tratamientos_visuales` and `references/print-design-guide.md` recipes. If a material looks like it could be an email or spreadsheet, it's not done.

## Execution Steps

### Step 0: Load Style Guide

Read `juego/STYLE.json`. If missing:

1. **Ask the user:** "No tengo guía de estilo para este juego. ¿Tenés un estilo definido (cartel, moodboard, colores) o querés que diseñe uno basado en la temática?"
2. If user provides reference → generate `STYLE.json` from their description
3. If user wants auto-design → select preset from `references/style-schema.md` based on game genre
4. Write `STYLE.json` to `juego/STYLE.json`
5. Continue with material generation using the new style

From `STYLE.json`, derive:
- `:root` CSS variables from `paleta.*`
- Font stacks from `tipografia.*`
- Component styles from `componentes.*`
- Texture effects from `texturas.*`
- Page layout from `formato.*`

### Build Command

```bash
node scripts/build-pdf.mjs <input.html> [--output <output.pdf>]
```

Uses Puppeteer to render HTML→PDF.

### Step 1: Generate Game Guide (Design Document)

Build `00-guia-completa-juego.html` (A4, themed CSS from `STYLE.json`). Standard page structure:

1. **Cover** — Title, subtitle, event, version
2. **Ficha Técnica + Sinopsis** — Metadata grid (players, duration, difficulty, age, type) + narrative synopsis + central symbol
3. **Personajes** — Characters grouped by generation with role descriptions
4. **Flujo del Juego** — Phase cards with timing, room symbols
5. **Hilo Conductor** — Connection thread table (letters/values/puzzles)
6. **Pruebas (1 page each)** — For each puzzle:
   - Metadata (room badge, difficulty, duration, hilo letter)
   - **Mecánica** (DETAILED: what players find, step-by-step solution path, anti-cheat design)
   - **Recompensa** (what players obtain: hilo letter, documents, navigation cards, physical items)
   - Solution box (code highlighted in dark box)
   - Materials list
7. **Resumen de Candados y Códigos** — All locks/codes table
8. **Inventario de Materiales** — All generated files organized by puzzle

**NOT included:** Budget, debriefing, setup/reset instructions (those belong in separate documents).

**Mechanics requirement:** Each puzzle's mechanics section must contain enough detail for a reader to understand HOW the puzzle works without seeing the materials — what players find, what they do step by step, how the code/solution is derived, and the anti-cheat design.

### Step 2: Generate Tests Document

Build `game-tests.html` with: Test Cover, Walkthrough Test (one section per puzzle), Hint Escalation Test, Anti-Cheat Test, Duration Test, Flow Test, Accessibility Test.

### Step 3: Generate In-Game Materials

Create documents from `prueba.documentos_in_game`. Seven types: `diario`, `carta`, `tarjeta`, `etiqueta`, `tablero`, `cartel`, `fragmento`. Each generates HTML snippet + print-ready CSS + cut/fold guides. All materials derive their visual style from `STYLE.json`.

#### Visual Treatment Pipeline (MANDATORY)

For EVERY material generated, follow this pipeline:

1. **Read `STYLE.json.tratamientos_visuales`** — this defines which decorative treatments apply to which material types
2. **Identify material type** — determine if this document is a cartel, carta, diario, tablero, tarjeta, fragmento, etiqueta, foto, or certificado
3. **Apply matching treatments** — for each treatment in `tratamientos_visuales` where the material type appears in `aplica_a`, include the corresponding CSS from the recipes in `references/print-design-guide.md`
4. **Verify prop quality** — if the material looks like it could be an email, spreadsheet, or Word document, it fails Hard Rule #5

#### Treatment Application by Material Type

| Material Type | Required Treatments |
|---------------|-------------------|
| **cartel** (sign/poster) | Dark background + ornamental border + marionetta/stage motif + inner glow |
| **carta** (letter/note) | Sepia paper + aging shadow + coffee stains + fold creases + signature block + drop-cap |
| **diario** (diary/journal) | Notebook lines + red margin + aging + coffee stains + page numbers + tape marks |
| **tablero** (board/display) | Ornamental border + decorative title underline + alternating rows + subtle aging |
| **tarjeta** (card) | Card-textured background + inner shadow + numbered badge + scratch-off seals (if applicable) |
| **fragmento** (torn piece) | Irregular clip-path edges + heavy aging + coffee stains + fold creases + faint numbering |
| **etiqueta** (label/tag) | Card-textured background + small decorative border + optional wax seal |
| **foto** (photo) | Polaroid frame (white border, extra bottom) + drop shadow + slight rotation + date caption + scratch-off seal |
| **certificado** (certificate) | Formal ornamental border + parchment background + wax seal + signature lines + official stamp |

#### Treatment Intensity

Not every document needs every treatment. Use judgment:
- **Light treatment**: cartas de navegación, etiquetas simples → aging + subtle shadow
- **Medium treatment**: cartas de Elena, tarjetas, tableros → aging + stains + decorative borders
- **Heavy treatment**: diario, fragmentos, certificados, carta de despedida → full treatment with all effects
- **Special treatment**: carteles de instrucción → dark bg + ornamental (different from sepia docs)

The `STYLE.json.tratamientos_visuales.envejecimiento` section specifies which aging effects are active for which document types.

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

- `references/css-variables.md` — Dynamic CSS variables from STYLE.json, theme presets
- `references/style-schema.md` — STYLE.json schema, generation rules, genre presets
- `references/component-classes.md` — All CSS component classes
- `references/materials-templates.md` — 7 material types with templates
- `references/document-checklists.md` — Full checklists, page break rules, game type adaptations
- `references/print-design-guide.md` — Print design principles, typography, color, composition, textures for escape room materials
