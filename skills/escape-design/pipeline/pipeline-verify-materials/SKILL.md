---
name: pipeline-verify-materials
description: "Trigger: verificar materiales, validar post-build, materials verification. Validates in-game documents exist, are solvable, and match source JSON."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# Pipeline Verify Materials (FASE 5b — Post-Build QA)

## Activation Contract

After BUILD generates HTML/PDF materials. Reads `prueba-*.json` + generated `materiales/` directory.

## Hard Rules

1. Every check MUST have `status` (`pass`/`warning`/`fail`) + `details`.
2. ANY `fail` → `verdict` = `"fail"`.
3. `warning` but no `fail` → `verdict` = `"pass_with_warnings"`.
4. All 12 checks are mandatory per puzzle.
5. Issues MUST be **actionable**: state what to fix, which file, and what to change.

## Decision Gates

| Condition | Verdict |
|-----------|---------|
| All 12 checks pass per puzzle | `"pass"` |
| Warnings but no fails | `"pass_with_warnings"` |
| Any check fails | `"fail"` → triggers `pipeline-fix` |

## Execution Steps

### Step 1: Load puzzle JSON

Read `prueba-XXX.json` per puzzle. Extract: `documentos_in_game`, `configuracion.elementos_necesarios`, `solucion`, `hilo_conductor`, `barrera_fisica`.

### Step 2: Load generated materials

Scan `materiales/` for files matching `{NN}-*.html` and `{NN}-*.pdf`.

### Step 3: Run 12 checks per puzzle

| # | Check | Fail condition |
|---|-------|---------------|
| 1 | Coverage: docs → materials | In-game doc has no generated file |
| 2 | Coverage: materials → docs | Unmapped file in materiales/ |
| 3 | No duplicates | Same content in two files |
| 4 | Solvability trace | Info gap in solution chain |
| 5 | Self-contained | Outside-box docs lack info to open box |
| 6 | Lock-code consistency | Code in materials ≠ `barrera_fisica.codigo` |
| 7 | Hilo conductor consistency | Letter in materials ≠ `hilo_conductor.letra` |
| 8 | No solution leakage | Pre-solve doc reveals answer |
| 9 | Text fidelity | HTML text ≠ JSON source |
| 10 | Classification correct | File prefix mismatches content role |
| 11 | Completeness | Empty/placeholder documents |
| 12 | Cross-puzzle consistency | Hilo rewards don't chain correctly |

Detailed check procedures: `references/checks-detail.md`.

### Step 4: Game-level summary

Total documents generated vs defined, total issues/warnings/fails, per-puzzle verdict, global verdict.

## Output Contract

Write `MATERIALS-VERIFY-REPORT.json` in game directory. Schema: `references/report-schema.md`.

## References

- `references/report-schema.md` — Full report JSON schema
- `references/checks-detail.md` — Detailed procedures for all 12 checks
- `references/trace-examples.md` — Example solvability traces
- `../pipeline-verify/SKILL.md` — Parent verify pipeline (27 checks)
- `../pipeline-verify/references/verify-report-schema.md` — Parent report schema
