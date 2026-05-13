---
name: pipeline-verify-materials
description: "Trigger: verificar materiales escape room, chequear documentos generados, validación post-build, materiales vs JSON. Valida que cada documento in-game necesario existe, no hay duplicados, y toda la info para resolver está disponible."
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

## Execution Steps

### Step 1: Load puzzle JSON

Read the `prueba-XXX.json` for each puzzle. Extract:
- `documentos_in_game` (or `ingame_docs`) — every document the puzzle defines
- `configuracion.elementos_necesarios` — all physical items
- `solucion` — complete solution chain including code derivation
- `hilo_conductor` — accumulated reward (letter, value)
- `barrera_fisica` — lock type, code, code origin

### Step 2: Load generated materials

Scan `materiales/` directory for all files matching the puzzle number pattern `{NN}-*.html` and `{NN}-*.pdf`.

### Step 3: Run 12 checks per puzzle

#### Check 1: Coverage — Every in-game document has a generated material

For each entry in `documentos_in_game`, verify a corresponding HTML/PDF exists in `materiales/`. Missing document → `fail`.

#### Check 2: Coverage — Every generated material maps to an in-game document or known category

Each file in `materiales/{NN}-*` must map to either:
- An entry in `documentos_in_game`
- A known category: `tablero`, `cartel-instruccion`, `testimonios`, `fichas`, `plantilla`

Unmapped file → `warning` (orphan material, may confuse during setup).

#### Check 3: No duplicates — Same content in two files

Compare document titles/texts across generated materials. Identical or near-identical content in two files → `fail`. Exception: explicit print-copies (e.g., "imprimir 2 copias").

#### Check 4: Solvability trace — Every fact needed for the code exists in accessible documents

Trace the solution chain step by step. For each deduction step:
1. Identify WHAT information the player needs
2. Identify WHERE that information comes from (which specific document, which line)
3. Verify that document is ACCESSIBLE at that point (not locked inside the box being opened)

Any information gap → `fail` with the specific missing fact and where it should appear.

#### Check 5: Self-contained — Documents outside the box have all info needed to open the box

List all documents marked as "FUERA de la caja" / "sobre la mesa" / "KIT DE RESOLUCIÓN". Verify these alone contain enough information to derive the code. Documents "DENTRO de la caja" must NOT be required for the code.

If inside-box documents are needed to open the box → `fail` (circular dependency).

#### Check 6: Lock-code consistency — Generated materials match `barrera_fisica.codigo`

If any generated document contains a code, verify it matches `barrera_fisica.codigo`. Mismatch → `fail`.

#### Check 7: Hilo conductor consistency — Letter in generated materials matches `hilo_conductor.letra`

If any generated document mentions the reward letter or value, verify it matches `hilo_conductor.letra` and `hilo_conductor.significado`. Mismatch → `fail`.

#### Check 8: No solution leakage — No generated document reveals the answer prematurely

Documents accessible BEFORE solving must NOT contain:
- The code explicitly
- A direct statement of the solution without deduction
- Information that belongs to a LATER puzzle

Premature reveal → `fail`.

#### Check 9: Text fidelity — Generated document text matches JSON source

Compare the text content in each generated HTML against the `texto` field in `documentos_in_game`. Any divergence (missing sentences, changed words, wrong names) → `fail`.

#### Check 10: Classification correct — File naming matches actual content role

Verify file prefixes:
- `reco-` files contain ONLY recompensa content (reward for solving, opened after code)
- `deco-` files contain ONLY decorative/narrative content (not needed to solve)
- Files without prefix are solving materials (needed to derive the code)

Misclassified file → `warning` (wrong category won't break the game but confuses setup).

#### Check 11: Completeness — No empty/placeholder documents

Every generated HTML/PDF must have actual content. Files with only headers, empty sections, or "TODO" placeholders → `fail`.

#### Check 12: Cross-puzzle consistency — Accumulated rewards carry forward correctly

For puzzle N, verify that the hilo conductor reward matches what puzzle N+1 expects as incoming. If P1 gives letter "L" and P2's JSON references P1's letter as "L" → pass. Mismatch in the chain → `fail`.

### Step 4: Game-level summary

After all puzzles checked, produce a game-level summary:
- Total documents generated vs total documents defined
- Total issues/warnings/fails
- Per-puzzle verdict
- Global verdict

## Output Contract

Write `MATERIALS-VERIFY-REPORT.json` in the game directory.

Schema in `references/report-schema.md`.

## References

- `references/report-schema.md` — Full report JSON schema
- `references/trace-examples.md` — Example solvability traces with pass/fail
- `../pipeline-verify/SKILL.md` — Parent verify pipeline (27 checks)
- `../pipeline-verify/references/verify-report-schema.md` — Parent report schema
