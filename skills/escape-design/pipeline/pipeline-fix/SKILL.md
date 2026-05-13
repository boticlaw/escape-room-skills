---
name: pipeline-fix
description: "Trigger: corregir errores escape room, aplicar fixes pipeline, solucionar issues detectados. Lee reportes de verify-materials, verify, playtest o judgment, aplica fixes en JSONs de pruebas, y regenera materiales afectados."
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

# Pipeline Fix — Auto-Repair (Post-Validation)

## Activation Contract

After any validation phase (MATERIALS-VERIFY, VERIFY, PLAYTEST, JUDGMENT) produces `fail` or `pass_with_warnings`. Reads the report, applies fixes, regenerates affected materials.

## Hard Rules

1. **Every fix MUST be traceable**: record what changed, which file, which line, and which report issue it resolves.
2. **Fix the SOURCE, not the symptom**: if a material has wrong text, fix the JSON `documentos_in_game` — then regenerate. Never edit HTMLs directly.
3. **Regenerate ALL affected materials** after any JSON change. Run `node generate-pdf.js` for each modified HTML.
4. **Re-run the originating validation** after fixes. If it still fails, escalate (max 2 fix cycles).
5. **Never change `barrera_fisica.codigo`** without also updating the candado configuration and ALL documents referencing it.
6. **Never remove puzzle content** — only add, modify, or restructure. If a fix requires removing a major element, escalate.
7. **Preserve narrative consistency**: any text change in a documento_in_game must respect tone, character voice, and story timeline.

## Decision Gates

### Which layer to fix?

| Source Report | Issue Type | Fix Target | Scope |
|---------------|-----------|------------|-------|
| MATERIALS-VERIFY | Coverage gap (missing doc) | Add to `documentos_in_game` + generate HTML | Single puzzle JSON |
| MATERIALS-VERIFY | Solvability gap (missing info) | Modify documento text in JSON to add the info | Single puzzle JSON |
| MATERIALS-VERIFY | Circular dependency | Restructure which docs are inside/outside box in JSON | Single puzzle JSON |
| MATERIALS-VERIFY | Code/letter mismatch | Fix `hilo_conductor` or `barrera_fisica` in JSON | Single puzzle JSON |
| MATERIALS-VERIFY | Duplicate content | Remove duplicate from JSON, delete orphan HTML/PDF | Single puzzle JSON |
| MATERIALS-VERIFY | Text divergence | Regenerate HTML from current JSON (JSON is truth) | Single material |
| MATERIALS-VERIFY | Wrong classification | Rename file (prefix) + update JSON metadata | Single material |
| VERIFY | Narrative coherence | Fix `documentos_in_game` texts + `NARRATIVA.md` | Puzzle JSON + narrative |
| VERIFY | Difficulty curve | Adjust `dificultad` + modify puzzle constraints | Single puzzle JSON |
| VERIFY | Mechanic variety | Escalate — requires DESIGN level changes | Escalate |
| PLAYTEST | Player confusion | Add hint level, clarify instructions in JSON | Single puzzle JSON |
| PLAYTEST | Too easy/hard | Adjust constraints, add/remove complexity | Single puzzle JSON |
| JUDGMENT | Rejected by both judges | Escalate — fundamental design problem | Escalate |
| JUDGMENT | Approved with suggestions | Apply non-breaking suggestions, regenerate | Per suggestion |

## Execution Steps

### Step 1: Load report

Read the failing report (`MATERIALS-VERIFY-REPORT.json`, `VERIFY-REPORT.json`, `PLAYTEST-REPORT.json`, or `JUDGMENT-REPORT.json`).

Extract all items with `status: fail` or `status: warning`.

### Step 2: Classify fixes

Group issues by fix target:
- **Group A**: JSON-level fixes (modify `prueba-XXX.json`)
- **Group B**: Material-level fixes (regenerate HTML/PDF)
- **Group C**: Escalate (requires DESIGN or CONCEIVE)

If any issue is Group C → stop, escalate to orchestrator with the full report.

### Step 3: Apply Group A fixes (JSON modifications)

For each issue in Group A, modify the source `prueba-XXX.json`:

1. Read current JSON
2. Identify the exact field to change
3. Apply the fix preserving JSON structure
4. Write modified JSON
5. Record in fix log: `{issue_id, file, field, old_value, new_value}`

Common fixes with exact field paths:

| Fix | Field Path | Example |
|-----|-----------|---------|
| Add info to documento | `documentos_in_game[N].texto` | Add "nacido entre Carmen y Miguel" to Testimonio 4 |
| Fix reward letter | `solucion.recompensa.letra` | "E" → "L" |
| Fix hilo conductor | `hilo_conductor.letra` | "E" → "L" |
| Change doc location | `configuracion.elementos_necesarios` | Move item from "DENTRO" to "FUERA" |
| Adjust difficulty | `dificultad` | 4 → 5 |
| Add hint level | `pistas[]` | Add new hint object |
| Fix code reference | `barrera_fisica.codigo` + all references | Coordinate across multiple fields |
| Remove duplicate doc | `documentos_in_game[N]` | Remove entry + delete HTML/PDF |

### Step 4: Apply Group B fixes (regenerate materials)

For each puzzle JSON that was modified:

1. Regenerate HTML from the updated `documentos_in_game`
2. Run `node generate-pdf.js materiales/{NN}-{name}.html` for each affected material
3. Verify PDF was created (`ls -la`)
4. Record in fix log: `{file_regenerated, pdf_output_path}`

### Step 5: Re-validate

Re-run the originating validation phase that produced the report:
- MATERIALS-VERIFY → re-run `pipeline-verify-materials`
- VERIFY → re-run `pipeline-verify`
- PLAYTEST → re-run `pipeline-playtest` (full simulation)

### Step 6: Report

If re-validation passes → `FIX-REPORT.json` with `verdict: fixed`.
If re-validation fails → `FIX-REPORT.json` with `verdict: needs_escalation` + remaining issues.

## Output Contract

Write `FIX-REPORT.json` in the game directory.

Schema in `references/fix-report-schema.md`.

## References

- `references/fix-report-schema.md` — Full report JSON schema
- `references/fix-catalog.md` — Catalog of common fixes with exact field paths
- `../pipeline-verify-materials/SKILL.md` — Materials validation (12 checks)
- `../pipeline-verify/SKILL.md` — Full validation (27 checks)
- `../pipeline-verify-materials/references/report-schema.md` — Materials report schema
- `../pipeline-verify/references/verify-report-schema.md` — Verify report schema
