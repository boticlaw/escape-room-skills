---
name: escape-build
description: Build escape room documents — HTML→PDF generation with themed templates, CSS variables, and materials output. Produces Design Document and Tests Document.
triggers:
  - build escape room documents
  - generate escape room PDF
  - crear documentos escape
  - escape room materials
  - print escape room
---

# Escape Room Build — Templates & Materials

## Overview

Generates two printable documents from game JSON files:
1. **Design Document** — complete game design for the creator
2. **Tests Document** — playtest protocol for quality assurance

Also generates in-game materials (documents players find during the game).

## Output Documents

### 1. Design Document

| Section | Content |
|---|---|
| Cover | Game name, type, version, date |
| Synopsis | Theme, objective, player config, flow |
| Game Structure | Puzzle overview table |
| Flow Diagram | ASCII/text representation of puzzle sequence |
| Proof Cards | One per puzzle: mechanic, difficulty, solution, hints |
| GM Sheet | Setup instructions, reset checklist (even for ZERO GM games) |
| Materials List | Everything needed to build the game |

### 2. Tests Document

| Section | Content |
|---|---|
| Test Cover | Game name, test date, tester name |
| Walkthrough Test | Step-by-step verification of each puzzle |
| Hint Escalation Test | Verify each hint level is functional |
| Anti-Cheat Test | Attempt to brute-force or shortcut each puzzle |
| Duration Test | Time each puzzle; compare to estimates |
| Flow Test | Verify transitions between puzzles |
| Accessibility Test | Check for barriers (visual, physical, cognitive) |

## HTML→PDF Generation

### Build Script

```bash
node scripts/build-pdf.mjs <input.html> [--output <output.pdf>]
```

Uses Puppeteer to render HTML to PDF with these settings:
- Format: A4
- Margins: 12mm top/bottom, 10mm left/right
- `printBackground: true` (CSS backgrounds render)
- Zero external dependencies in the HTML

### Usage

```bash
# Generate design document PDF
node scripts/build-pdf.mjs build/game-design.html --output output/game-design.pdf

# Generate tests document PDF
node scripts/build-pdf.mjs build/game-tests.html --output output/game-tests.pdf
```

## CSS Variables System

Each game theme defines 8 color variables in `:root`:

```css
:root {
  --color-primary: #1a1a2e;     /* Main background/brand */
  --color-secondary: #16213e;   /* Secondary panels */
  --color-accent: #e94560;      /* Highlights, CTAs */
  --color-text: #eaeaea;        /* Body text */
  --color-text-muted: #a0a0a0;  /* Secondary text */
  --color-proof-bg: #0f3460;    /* Proof card background */
  --color-proof-header: #e94560;/* Proof card header bar */
  --color-border: #2a2a4a;      /* Borders and dividers */
}
```

### Theme Presets

| Theme | Primary | Secondary | Accent |
|---|---|---|---|
| Museum Heist | #1a1a2e | #16213e | #e94560 |
| Jungle Temple | #1b4332 | #2d6a4f | #d4a373 |
| Space Station | #0b0c10 | #1f2833 | #66fcf1 |
| Pirate Ship | #3e1f00 | #6b3a00 | #f4d35e |
| Haunted Manor | #1a1a1a | #2d2d2d | #6b2d5b |
| Spy Mission | #0d1b2a | #1b263b | #e07000 |

## Component Classes

| Class | Purpose |
|---|---|
| `.cover` | Full-page cover with game title and metadata |
| `.synopsis` | Game overview section |
| `.proof-card` | Individual puzzle card with header and body |
| `.proof-header` | Colored header bar with puzzle name and difficulty |
| `.proof-body` | Card content area with puzzle details |
| `.proof-section` | Subsection within a proof card |
| `.flow-diagram` | ASCII/text flow chart container |
| `.materials-table` | Materials list table |
| `.gm-sheet` | Game master setup instructions |
| `.hint-item` | Individual hint with level indicator |
| `.difficulty-bar` | Visual difficulty meter (1–10) |
| `.page-break` | Forces a page break before this element |
| `.document-footer` | Page footer with game name and page number |

## Materials Generator

Creates in-game documents from `prueba.documentos_in_game`. Seven categories:

| Type | Description | Template |
|---|---|---|
| `diario` | Diary/journal page | Aged paper, handwritten font, dated entries |
| `carta` | Letter/note | Stationery style, signature block |
| `tarjeta` | Card/ticket | Compact, bordered, single-purpose |
| `etiqueta` | Label/tag | Small, punch-hole, string attachment |
| `tablero` | Board/display | Large format, grid or image area |
| `cartel` | Poster/sign | Bold text, visual hierarchy |
| `fragmento` | Torn fragment | Irregular edges, partial content |

### Materials Output

Each material generates:
1. HTML snippet (insertable into documents)
2. Print-ready CSS (correct sizing, margins)
3. Cut/fold guides for physical assembly

## Page Break Rules

```css
/* Never break inside these elements */
.proof-card, .materials-table, .gm-sheet { break-inside: avoid; }

/* Force break before new major sections */
h2 { break-before: always; }
h2:first-of-type { break-before: auto; }

/* Keep headers with their content */
h3, h4 { break-after: avoid; }
```

## Document Checklist

### Design Document
- [ ] Cover with complete game metadata
- [ ] Synopsis matching game.json
- [ ] Game structure table with all puzzles
- [ ] Flow diagram showing puzzle sequence
- [ ] One proof card per puzzle with complete info
- [ ] GM sheet with setup and reset instructions
- [ ] Materials summary table

### Tests Document
- [ ] Test cover page
- [ ] Walkthrough test protocol (one section per puzzle)
- [ ] Hint test protocol
- [ ] Anti-cheat test protocol
- [ ] Duration tracking sheet
- [ ] Flow transition checklist
- [ ] Accessibility audit template
- [ ] Sign-off section for tester approval

## Zero Dependencies Rule

All generated HTML must:
- Use only the bundled `escape-base.css`
- Contain no external font references (system fonts only)
- Have no JavaScript dependencies
- Render correctly when opened as a local file
- Print correctly to A4 from any browser or Puppeteer
