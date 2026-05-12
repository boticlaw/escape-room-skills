---
name: pipeline-verify
description: "Trigger: verificar juego escape room, QA, validación completa, FASE 5 pipeline. 27 checks de calidad: schema, solucionabilidad, dead ends, curva, tiempos, mecánicas, narrativa, pistas, materiales, códigos."
---

# Pipeline Verify (FASE 5 — QA)

## Activation Contract

After BUILD + PLAYTEST. Game directory complete with all files.

## Hard Rules

1. Every check MUST have `status` (`pass`/`warning`/`fail`) + `details`.
2. ANY `fail` → `verdict` = `"fail"`.
3. `warning` but no `fail` → `verdict` = `"pass_with_warnings"`.
4. All `pass` → `verdict` = `"pass"`.
5. `issues` must be **actionable**: describe what to fix and how.
6. All 27 checks are mandatory.

## Execution Steps

### Step 0: Calibrate thresholds

Compare against real playtest data (see `references/calibration-thresholds.md`).

```bash
python3 scripts/search-games.py --game "el-legado-de-la-familia" --pretty
```

### Checks 1-27

#### Check 1: Schema Compliance (automated)

```bash
python scripts/validate_game.py juegos/{juego-id}/
```

Pass/fail from script output.

#### Check 2: Solvability (mental simulation)

- Complete flow chain (no info gaps between puzzles)
- Resolving one puzzle gives info/keys for next
- No "magic clues" — info obtainable through normal play
- Average team can complete without external help

#### Check 3: Dead Ends

- Each puzzle has ≥1 hint to advance
- No circular dependencies
- No isolated puzzles (all connected to main flow)

#### Check 4: Difficulty Curve

- Progressive or intentional justified peaks
- No brutal jumps (>3 without justification) → `warning`
- Final puzzle is climax, not easiest

#### Check 5: Times

- Sum ≤ total − 15-20% margin
- No single puzzle >20 min → `fail`, 15-20 → `warning`

#### Check 6: Mechanic Variety

- ≥3 distinct mechanics
- Max 2 per skill

#### Check 7: Narrative Coherence

- NARRATIVA.md consistent with CONCEPT.json
- Each puzzle has narrative connection
- Tone coherent throughout

#### Check 8: Hints

- ≥3 hint levels per puzzle
- Progressive (subtle → direct → near-answer)
- GM global hints cover critical points

#### Check 9: Materials

- lista-materiales matches per-puzzle materials
- Viable (obtainable, affordable)
- Hard-to-get but viable → `warning`

#### Check 10: Code Consistency ⚠️ CRITICAL

Code-box must match lock type:

| Lock Type | Expected Format | Valid Example |
|-----------|----------------|---------------|
| Candado 4 dígitos | Exactly 4 numbers | ✅ `2030` ❌ `ROJO` |
| Candado letras | 3-6 uppercase letters | ✅ `CRIPTA` ❌ `1038` |
| Llave física | `LLAVE` or description | ✅ `LLAVE` ❌ `4321` |
| Cryptex | Thematic word (4-8 chars) | ✅ `LEGADO` ❌ `123456` |

Code-box must match: solution, mechanics, DESIGN.json `codigo` field. Any mismatch → `fail`.

#### Check 11: Progress Density (Pacing)

No stretch >15 min without progress hit. Apertura: ≥1/5min. Desarrollo: ≥1/10-15min.

#### Check 12: Unique Solution

Each puzzle has exactly ONE logical answer. Multiple reasonable answers → `fail`.

#### Check 13: Self-Contained Logic

All puzzles solvable with in-room info only. Zero external knowledge required.

#### Check 14: Zero Cross-Puzzle Data Dependencies ⚠️

Each puzzle solvable with materials IN THAT ROOM.

- ✅ Travel: physical keys, reusable tools (UV flashlight), opened locks
- ❌ No travel: code cards, documents with clues, info notes
- Exception: hilo conductor letters (accumulated reward)

#### Check 15: Real Cooperation

≥1 puzzle requires 2+ players simultaneously (impossible solo). None → `warning`.

#### Check 16: Physical Conditions

Visual puzzles specify lighting. Physical puzzles use robust materials.

#### Check 17: Profile Empowerment

Puzzles cover: Buscador, Analista, Líder, Cronometrador. >50% same profile → `warning`.

#### Check 18: Solution Completeness

Solution lists ALL values needed for the lock type. Missing values → `fail`.

#### Check 19: Anti-Repetition Between Puzzles

No key info revealed before its puzzle. Components carry no revealing instructions. Navigation notes only say where, never what.

#### Check 20: Three Layers of Clarity

Per puzzle: What they see → What they understand → What they do. Missing layer → `fail`.

#### Check 21: Error Tolerance

Each critical component has backup (copy, alternative, partial validation). Single point of failure → `fail`.

#### Check 22: Emotional Map

No 2 consecutive puzzles with same emotion. >2 same emotion in a row → `fail`.

#### Check 23: Intermediate Rewards

Every 1-2 puzzles: narrative advance (not just code). >2 consecutive code-only → `fail`.

#### Check 24: Memorable Ending

Action + narrative resolution + emotional reward. Missing any → `fail`.

#### Check 25: Visual Legibility

Clues distinguishable from decoration. Critical text readable at glance.

#### Check 26: Golden Rule

Each puzzle: understandable, interesting, advances story, can't break the game. Fails >1 → `fail`.

#### Check 27: Guaranteed Completion

All groups finish. GM can intervene at any level. Time limit ≠ game over. No-escape point → `fail`.

### Design Compliance Matrix (Check 18 extended)

Per puzzle: Objetivo, Input, Mecanismo, Output, Conexión, Pista GM, Solución verificable. Empty cell for active puzzle → `fail`.

## Output Contract

`{output_dir}/VERIFY-REPORT.json` — Schema in `references/verify-report-schema.md`.

## References

- `references/verify-report-schema.md` — Full report schema + field descriptions
- `references/calibration-thresholds.md` — Playtest-derived thresholds
- `references/example-details.md` — Example check outputs
