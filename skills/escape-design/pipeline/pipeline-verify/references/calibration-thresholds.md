# Calibration Thresholds (from real playtests)

Source: playtest-report.json from existing games.

| Threshold | Source | Reference Value |
|-----------|--------|----------------|
| Max acceptable frustration | `playtest-report.json` → max `frustracion_final` | ~5 (of 100) in successful games |
| Min acceptable fun | `playtest-report.json` → min `diversion` | ~80 (of 100) |
| Max hints per player | `playtest-report.json` → max `pistas_pedidas` | ~4 with GM present |
| Min final energy | `playtest-report.json` → min `energia_final` | ~50 (of 100) in 50-min games |
| Puzzle/transition ratio | Puzzle JSON times vs playtest | ~70/30 in successful games |

If new game breaks a real threshold → CRITICAL in Verify.

## Research Frameworks

- `research-frameworks/08-testing.md` — QA checklists
- `research-frameworks/01-game-design.md` — Balance and difficulty curves
- `research-frameworks/09-estilo-juegos.md` — Proven design patterns

## Procedure Order

```
1. Read CONCEPT.json + DESIGN.json
2. Run validate_game.py → schema_compliance
3. Read all puzzles → solvability + dead_ends
4. Analyze difficulties → difficulty_curve
5. Sum times → times
6. Count mechanics → mechanic_variety
7. Read NARRATIVA.md + DISEÑO-JUEGO.md → narrative_coherence
8. Review hints per puzzle → hints_sufficient
9. Cross materials → materials_viable
10. Verify code consistency (code-box vs lock type vs solution) → code_consistency
11-27. Remaining checks in order
28. Generate VERIFY-REPORT.json
```
