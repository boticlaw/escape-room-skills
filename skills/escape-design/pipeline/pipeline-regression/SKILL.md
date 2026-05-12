---
name: pipeline-regression
description: "Trigger: regresión escape room, modificar juego existente, FASE 0.5. Compara baseline anterior vs estado actual, detecta regresiones de score, verifica integridad de cadena de pruebas, ejecuta solo re-verificaciones necesarias."
---

# Pipeline Regression Testing

## Activation Contract

At pipeline start if BASELINE exists (modification, not new game). No baseline → skip (`verdict: "skip"`).

## Hard Rules

1. **Efficiency**: only re-run affected phases.
2. **Chain integrity is hard fail**: broken reward chain = always `fail`.
3. **Score tracking**: from existing reports, don't re-evaluate.
4. **No duplication**: pass findings as context to Verify.
5. **Baseline versioning**: update BASELINE after each full pipeline pass.

## Execution Steps

### Step 1: Baseline Capture (on first pass)

Save snapshot after Verify/Judgment:

```json
{
  "game_ref": "{slug}",
  "version": "v1.0",
  "verify_report": {...},
  "judgment_report": {...},
  "puzzle_summary": [
    {"prueba": "P1", "type": "cipher", "difficulty": 3, "connections": ["P2"]}
  ]
}
```

Save to: `{output_dir}/BASELINE-{version}.json`

### Step 2: Diff Analysis

Load latest baseline, compare with current:

Per puzzle:
- **Eliminated** → verify chain integrity
- **Type changed** → flag for Verify re-check
- **Difficulty changed** → flag for Difficulty Calibration
- **Connection changed** → flag for full flow check
- **Added** → verify integration with existing

Score deltas: -1 → WARNING, -2 → CRITICAL, + → improvement.

### Step 3: Chain Integrity

- Each puzzle receives ≥1 input (except P1)
- Each puzzle delivers ≥1 output (except last)
- No "islands" (disconnected puzzles)
- No broken links (delivers to non-existent puzzle)

### Step 4: Selective Re-verification

| Change Type | Re-verifications |
|-------------|-----------------|
| Narrative changed | Narrative Consistency + JudgeStory |
| Puzzle type/mechanic changed | Verify + JudgeLogic + Playtest |
| Difficulty changed | Difficulty Calibration |
| Connections changed | Verify + Playtest |
| Everything | Full pipeline |

### Step 5: Cross-Game Regression

```bash
python3 scripts/search-games.py --similar "[tema]" --pretty
python3 scripts/search-games.py --difficulty [min]-[max] --pretty
```

Compare against real games: difficulty curve, mechanic variety, time distribution, playtest scores, proven design patterns. Details in `references/cross-game-rules.md`.

## Output Contract

`REGRESSION-REPORT.json` — Schema in `references/report-schema.md`.

## Verdict Rules

| Condition | Verdict |
|-----------|---------|
| No regressions, chain intact | ✅ `pass` |
| ≤1 minor regression (delta ≤1.0), chain intact | ⚠️ `pass_with_concerns` |
| Chain broken OR ≥1 major (delta >1.0) | ❌ `fail` |

Pipeline: `fail` → stop, escalate to user. `pass_with_concerns` → continue with indicated re-verifications.

## References

- `references/report-schema.md` — Full report + baseline schemas
- `references/cross-game-rules.md` — Cross-game comparison rules and patterns
