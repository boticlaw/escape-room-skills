# Document Checklists & Page Break Rules

## Design Document Checklist

- [ ] Cover with complete game metadata
- [ ] Synopsis matching game.json
- [ ] Game structure table with all puzzles
- [ ] Flow diagram showing puzzle sequence
- [ ] One proof card per puzzle with complete info
- [ ] GM sheet with setup and reset instructions
- [ ] Materials summary table

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
