# Document Checklists & Page Break Rules

## Naming Convention for Materials

All generated material files follow this naming: `{NN}-{prefix}{name}.html/pdf`

### Prefixes

| Prefix | Meaning | When to use | Example |
|--------|---------|-------------|---------|
| `reco-` | **Reward** — found inside a locked box after solving | Items the player EARNS by solving (letters, navigation cards, certificates, revealed secrets) | `01-reco-fragmento-carta-elena.html` |
| `deco-` | **Decorative** — pure narrative flavor, ZERO puzzle info | Items that add atmosphere but contain NO dates, names, codes, clues, or solving information. If a player never reads this, they can still solve every puzzle. | Would be valid for a family photo with no text |
| *(none)* | **Solving material** — on the table, needed to solve | Items players must read/use to derive the solution. Boards, testimonies, instructions, cards with clues, letters with relevant info. | `01-tablero.html`, `01-testimonios.html` |

### Classification Test

Before assigning a prefix, ask: **"If a player never sees this document, can they still solve the puzzle?"**

- **YES** → `deco-` (pure flavor)
- **NO** → no prefix (solving material)
- **It's inside a locked box** → `reco-` (reward)

### Common Mistakes

❌ Marking a letter as `deco-` because "it's narrative" — if it contains names, dates, birth order, or clues, it's NOT decorative.
❌ Marking a diary as `deco-` because "it's flavor text" — if entries reference puzzle-relevant facts, it's solving material.
✅ Only use `deco-` for documents where removing them changes NOTHING about solvability.

## Design Document Checklist (Game Guide)

- [ ] Cover with game title, subtitle, event, version
- [ ] Ficha técnica (players, duration, difficulty, age, type) + sinopsis
- [ ] Characters grouped by generation
- [ ] Game flow with phases, timing, room symbols
- [ ] Hilo conductor table (letters, values, puzzles)
- [ ] One proof page per puzzle with:
  - [ ] Metadata (room, difficulty, duration, hilo letter)
  - [ ] DETAILED mechanics (what players find, step-by-step solution, anti-cheat)
  - [ ] Reward section (hilo letter, documents, navigation cards, physical items obtained)
  - [ ] Solution box (code highlighted)
  - [ ] Materials file list
- [ ] Summary table of all locks and codes
- [ ] Complete materials inventory (all generated files by puzzle)
- [ ] NO budget section (separate document)
- [ ] NO debriefing section (separate document)

## Tests Document Checklist

- [ ] Test cover page
- [ ] Walkthrough test protocol (one section per puzzle)
- [ ] Hint test protocol
- [ ] Anti-cheat test protocol
- [ ] Duration tracking sheet
- [ ] Flow transition checklist
- [ ] Accessibility audit template
- [ ] Sign-off section for tester approval

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

## Game Type Adaptations

| Game Type | Document Differences |
|-----------|---------------------|
| **Hall Escape** | GM Sheet with room setup, station maps, projector cues. Flow diagram with multi-linear branches. Anti-cheat section for team isolation. |
| **Street Escape** | GPS coordinates per puzzle. Route map section. Weather contingency notes. No anti-cheat (outdoor = can't isolate teams). |
| **Investigation** | Evidence board layout. Character relationship diagram. Timeline visualization. Accusation protocol section. |
| **Concurso** | Presenter script instead of GM Sheet. Scoring rubric per round. Mini-game material checklist. Question cards as primary output instead of proof cards. |
