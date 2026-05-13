---
name: pipeline-fix
description: "Trigger: corregir errores escape, aplicar fixes pipeline. Reads validation reports, fixes source JSONs, regenerates affected materials."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# Pipeline Fix — Auto-Repair (Post-Validation)

## Activation Contract

After any validation phase (MATERIALS-VERIFY, VERIFY, PLAYTEST, JUDGMENT) produces `fail` or `pass_with_warnings`. Reads the report, applies fixes, regenerates affected materials.

## Hard Rules

1. **Every fix MUST be traceable**: record what changed, which file, which line, which report issue it resolves.
2. **Fix the SOURCE, not the symptom**: fix the JSON `documentos_in_game` — then regenerate. Never edit HTMLs directly.
3. **Regenerate ALL affected materials** after any JSON change.
4. **Re-run the originating validation** after fixes. Max 2 fix cycles, then escalate.
5. **Never change `barrera_fisica.codigo`** without updating the candado config and ALL referencing documents.
6. **Never remove puzzle content** — only add, modify, or restructure. Major removal → escalate.
7. **Preserve narrative consistency**: text changes must respect tone, character voice, and timeline.

## Decision Gates

| Source Report | Fix Target | Scope |
|---------------|------------|-------|
| MATERIALS-VERIFY | `prueba-XXX.json` + regenerate HTML/PDF | Single puzzle |
| VERIFY (narrative/difficulty) | Puzzle JSON + narrative files | Single puzzle |
| VERIFY (mechanic variety) | Escalate — requires DESIGN changes | Escalate |
| PLAYTEST | Puzzle JSON (hints, constraints, complexity) | Single puzzle |
| JUDGMENT (both rejected) | Escalate — fundamental design problem | Escalate |
| JUDGMENT (approved + suggestions) | Apply non-breaking suggestions | Per suggestion |

Detailed issue-type → fix-target mapping: `references/fix-targets.md`.

## Execution Steps

### Step 1: Load report

Read failing report. Extract all items with `status: fail` or `status: warning`.

### Step 2: Classify fixes

Group by target: **A** JSON-level (modify `prueba-XXX.json`) · **B** Material-level (regenerate HTML/PDF) · **C** Escalate (requires DESIGN/CONCEIVE). If any Group C → stop, escalate.

### Step 3: Apply Group A fixes

For each issue: read JSON → identify field → apply fix → write JSON → record `{issue_id, file, field, old_value, new_value}`.

Common field paths: `documentos_in_game[N].texto`, `solucion.recompensa.letra`, `hilo_conductor.letra`, `configuracion.elementos_necesarios`, `dificultad`, `pistas[]`, `barrera_fisica.codigo`. See `references/fix-catalog.md` for full catalog.

### Step 4: Apply Group B fixes

Regenerate HTML from updated `documentos_in_game` → run `node generate-pdf.js` → verify PDF created.

### Step 5: Re-validate

Re-run the originating validation phase.

### Step 6: Report

Pass → `FIX-REPORT.json` with `verdict: fixed`. Fail → `verdict: needs_escalation` + remaining issues.

## Output Contract

Write `FIX-REPORT.json` in game directory. Schema: `references/fix-report-schema.md`.

## References

- `references/fix-report-schema.md` — Full report JSON schema
- `references/fix-catalog.md` — Catalog of common fixes with exact field paths
- `references/fix-targets.md` — Detailed issue-type → fix-target mapping
- `../pipeline-verify-materials/SKILL.md` — Materials validation (12 checks)
- `../pipeline-verify/SKILL.md` — Full validation (27 checks)
- `../pipeline-verify-materials/references/report-schema.md` — Materials report schema
- `../pipeline-verify/references/verify-report-schema.md` — Verify report schema
