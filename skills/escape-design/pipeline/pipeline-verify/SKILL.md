---
name: pipeline-verify
description: "Trigger: verificar juego escape room, QA, validación completa, FASE 5 pipeline. 31 checks de calidad: schema, solucionabilidad, dead ends, curva, tiempos, mecánicas, narrativa, pistas, materiales, códigos, B&W compatibility."
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
6. All 31 checks are mandatory.

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

#### Check 1b: Game Integrity — Cross-File (automated) ⚠️ CRITICAL

```bash
python3 scripts/validate-game-integrity.py juegos/{juego-id}/juego/juego.json
```

Runs 11 cross-file checks: reward letter consistency, hilo conductor completeness, navigation continuity, navigation text consistency, juego.json summary sync (lock codes, labels, difficulty curve, duration), and copy-paste error detection (wrong letter in ubicación, wrong prueba reference, wrong letter in elementos).

Any CRITICAL from this script → overall `fail`. WARNINGs compound with manual checks.

This catches errors that per-file validators miss: reordering mistakes, stale summary fields, broken navigation chains, mismatched reward letters.

#### Check 2: Solvability (mental simulation)

- Complete flow chain (no info gaps between puzzles)
- Resolving one puzzle gives info/keys for next
- No "magic clues" — info obtainable through normal play
- Average team can complete without external help
- **Prerequisite**: Check 1b must pass first (automated navigation/reward validation)

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

#### Check 28: Code Guessability ⚠️ CRITICAL

Verify lock codes do NOT appear in:
- Narrative text (sinopsis, secciones, narrativa fields)
- Decorative documents (not part of the puzzle itself)
- Other puzzles' in-game documents

Numeric codes: search for exact match in all text. Year-codes (1900-2099): verify the year doesn't appear prominently in the narrative. Any code findable without solving → `fail`.

#### Check 29: Puzzle Skip Resistance ⚠️ CRITICAL

Each puzzle must REQUIRE the reward from the previous puzzle:
- Physical items needed (barrera_fisica requires item from previous)
- No puzzle solvable independently without prior rewards
- Hilo conductor letters delivered individually, not revealed early
- Navigation documents only accessible after solving

Any puzzle bypassable → `fail`.

#### Check 30: Anti-Brute Force

Lock codes must resist brute force:
- 4-digit numeric: not in top 100 common PINs, not sequential, not repeated digits
- Word codes: not the game title, not a theme word visible on the box/door
- Cryptex: not an obvious word from the game description
- Codes should require puzzle-specific knowledge to derive

Common PIN or game-title code → `fail`. Sequential/repeated → `warning`.

#### Check 31: B&W Compatibility ⚠️ CRITICAL

Verify all puzzles work in B&W laser printing (default mode):
- No puzzle relies on color distinction WITHOUT `impresion.color: true`
- If `impresion.color: true`, `motivo_color` is present and justified
- Decorative elements use patterns/textures, not color-only differentiation
- Maps, diagrams, and charts use patterns (stripes, dots, crosshatch) or labels instead of color fills
- Photos that need color are tagged with `impresion.color: true`
- Red/green feedback pairs use shape/icon distinction (not color alone)

Color used without `impresion.color: true` → `fail`. Missing `motivo_color` → `warning`.

### Game-Type-Specific Checks

The following checks activate based on `tipo` in juego.json. Only checks for the matching game type run; others are skipped.

#### Concurso Checks

##### Check C1: Question Integrity ⚠️ CRITICAL

For quiz/concurso games with `preguntas.json` or `preguntas-*.json`:

- Every question has ≥2 options in `opciones` array
- `correcta` field exists and is a valid index (A/B/C/D) within opciones
- Exactly 1 correct answer per question
- `dificultad` field present
- `dato` or `explicacion` field present (educational value)
- No duplicate questions (same `pregunta` text)

Missing correcta or invalid index → `fail`. Missing dificultad/dato → `warning`.

##### Check C2: Difficulty Progression

- Questions grouped by `ronda` or `pct` show consistent difficulty
- `pct` values progress from high (easy, 90%) to low (hard, 1%)
- No single question with dificultad > 8
- Rounds increase in difficulty or stay level

Reversed difficulty → `warning`.

##### Check C3: Mini-game Balance

For `minijuegos.json`:

- Each minijuego has `material`, `tiempo` (≤120s), `dificultad`, `participantes`
- ≥3 different categories represented
- No single material item > 50€
- Total material feasible for venue setup

Missing fields → `warning`. No category variety → `warning`.

#### Street Escape Checks

##### Check S1: GPS Coordinates ⚠️ CRITICAL

For each puzzle with `latitud_objetivo`/`longitud_objetivo`:

- Coordinates are valid numbers (not "TODO" or placeholders)
- Latitude -90 to 90, longitude -180 to 180
- `radio_verificacion` exists and > 0
- Backup navigation exists (url_maps_backup or instrucciones_sin_gps)

"TODO" coordinates → `fail`. Missing radio → `warning`.

##### Check S2: Walking Distances

- Calculate walking distance between consecutive GPS points
- Each leg ≤ 5 minutes walking (≤ 400m)
- Maximum ≤ 10 minutes between any two points
- Total route ≤ 3km walking

> 5 min between points → `warning`. > 10 min → `fail`.

#### Hall Escape Checks

##### Check H1: Team Separation

For games with max players > 8 (multi-team):

- Physical separation between teams documented
- Anti-cheat: teams cannot overhear or observe other teams' solutions
- Multiple copies of shared documents (one per team)
- Solution verification is self-service

Missing separation → `warning`.

#### Investigation Checks

##### Check I1: Evidence Chain

- Each puzzle's solution is derivable from its own in-game documents
- No document contains the solution to another puzzle (cross-contamination)
- Evidence accumulates across the game (later puzzles build on earlier discoveries)
- Red herrings are resolvable with available information

Solvable without in-game docs → `warning`. Cross-contamination → `fail`.

### Design Compliance Matrix (Check 18 extended)

Per puzzle: Objetivo, Input, Mecanismo, Output, Conexión, Pista GM, Solución verificable. Empty cell for active puzzle → `fail`.

## Output Contract

`{output_dir}/VERIFY-REPORT.json` — Schema in `references/verify-report-schema.md`.

## References

- `references/verify-report-schema.md` — Full report schema + field descriptions
- `references/calibration-thresholds.md` — Playtest-derived thresholds
- `references/example-details.md` — Example check outputs
