# Materials Verification — 12 Checks Detail

## Check 1: Coverage — Every in-game document has a generated material

For each entry in `documentos_in_game`, verify a corresponding HTML/PDF exists in `materiales/`. Missing document → `fail`.

## Check 2: Coverage — Every generated material maps to an in-game document or known category

Each file in `materiales/{NN}-*` must map to either:
- An entry in `documentos_in_game`
- A known category: `tablero`, `cartel-instruccion`, `testimonios`, `fichas`, `plantilla`

Unmapped file → `warning` (orphan material, may confuse during setup).

## Check 3: No duplicates — Same content in two files

Compare document titles/texts across generated materials. Identical or near-identical content in two files → `fail`. Exception: explicit print-copies (e.g., "imprimir 2 copias").

## Check 4: Solvability trace — Every fact needed for the code exists in accessible documents

Trace the solution chain step by step. For each deduction step:
1. Identify WHAT information the player needs
2. Identify WHERE that information comes from (which specific document, which line)
3. Verify that document is ACCESSIBLE at that point (not locked inside the box being opened)

**Mandatory sub-checks:**

### 4a. Candidate exclusion test
For any puzzle that requires selecting X items from a larger set of N candidates (N > X):
1. List ALL N candidates the player encounters
2. For EACH candidate that must be EXCLUDED, identify the specific document + text that excludes it
3. If any candidate cannot be excluded by available information → `fail`

Example: Board has 6 names. Code requires 4. The 2 non-candidates (Elena, M. Á.) must each have an explicit exclusion:
- Elena → excluded by instruction text ("hijos de Rodrigo **y Elena**")
- M. Á. → excluded by Testimonio 7 ("M. Á. no lleva la sangre de Rodrigo")
If M. Á. had no exclusion → `fail` with "players cannot determine which 4 of 5 remaining names are children"

### 4b. Deduction chain test
For puzzles with multi-step logical deduction:
1. Map every step: Input fact → Logical operation → Output fact
2. For each input fact, verify it has a source document
3. For each logical operation, verify the instruction/document tells players to perform it
4. If any step has a missing input or unstated operation → `fail`

### 4c. Code derivation test
For the final code/solution:
1. Verify the instruction tells players HOW to derive the code from the intermediate results
2. Verify the format matches (e.g., "4 digits" instruction → code is actually 4 digits)
3. Verify the ordering rule is stated (e.g., "del mayor al menor" → players know the order)
4. If the derivation method is unclear or unstated → `fail`

Any information gap across 4a/4b/4c → `fail` with the specific missing fact and where it should appear.

## Check 5: Self-contained — Documents outside the box have all info needed to open the box

List all documents marked as "FUERA de la caja" / "sobre la mesa" / "KIT DE RESOLUCIÓN". Verify these alone contain enough information to derive the code. Documents "DENTRO de la caja" must NOT be required for the code.

If inside-box documents are needed to open the box → `fail` (circular dependency).

## Check 6: Lock-code consistency — Generated materials match `barrera_fisica.codigo`

If any generated document contains a code, verify it matches `barrera_fisica.codigo`. Mismatch → `fail`.

## Check 7: Hilo conductor consistency — Letter in generated materials matches `hilo_conductor.letra`

If any generated document mentions the reward letter or value, verify it matches `hilo_conductor.letra` and `hilo_conductor.significado`. Mismatch → `fail`.

## Check 8: No solution leakage — No generated document reveals the answer prematurely

Documents accessible BEFORE solving must NOT contain:
- The code explicitly
- A direct statement of the solution without deduction
- Information that belongs to a LATER puzzle

Premature reveal → `fail`.

## Check 9: Text fidelity — Generated document text matches JSON source

Compare the text content in each generated HTML against the `texto` field in `documentos_in_game`. Any divergence (missing sentences, changed words, wrong names) → `fail`.

## Check 10: Classification correct — File naming matches actual content role

Verify file prefixes:
- `reco-` files contain ONLY recompensa content (reward for solving, opened after code)
- `deco-` files contain ONLY decorative/narrative content (not needed to solve)
- Files without prefix are solving materials (needed to derive the code)

Misclassified file → `warning` (wrong category won't break the game but confuses setup).

## Check 11: Completeness — No empty/placeholder documents

Every generated HTML/PDF must have actual content. Files with only headers, empty sections, or "TODO" placeholders → `fail`.

## Check 12: Cross-puzzle consistency — Accumulated rewards carry forward correctly

For puzzle N, verify that the hilo conductor reward matches what puzzle N+1 expects as incoming. If P1 gives letter "L" and P2's JSON references P1's letter as "L" → pass. Mismatch in the chain → `fail`.
