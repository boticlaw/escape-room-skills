---
name: pipeline-playtest
description: "Trigger: simular playtest escape room, FASE 4b pipeline. Dual-LLM: 6 perfiles de jugador (3 por juez) simulan partida completa. Síntesis cruza hallazgos para identificar issues con alta confianza."
---

# Pipeline Playtest (FASE 4b — Dual-LLM Simulation)

## Activation Contract

After BUILD (Phase 4). Before VERIFY (Phase 5).

## Hard Rules

1. **Be ruthless**: If confusing, say so.
2. **Realistic profiles**: Base on how real people play.
3. **Concrete references**: "P4's cipher uses symbols that don't appear anywhere" not "confusing".
4. **Time delta**: Always vs design estimate. Delta >+50% = alert.
5. **Independence**: Judges don't share output. 100% independent.
6. **Cross-validation**: Issue from both judges = CRITICAL.

## The Six Profiles

### Judge A: Analytical (escape-judge-a)

| Profile | Players | Behavior | Time vs Design |
|---------|---------|----------|---------------|
| **A1: Novato Lento** | 2-3 | Cautious, over-think, fear mistakes | +30-50% |
| **A2: Experimentado Metódico** | 4 | Systematic, divide & conquer | -10-20% on known |
| **A3: Experto Crítico** | 2-4 | Evaluate design quality, spot flaws | Normal, stops to analyze |

### Judge B: Experiential (escape-judge-b)

| Profile | Players | Behavior | Time vs Design |
|---------|---------|----------|---------------|
| **B1: Novato Ansioso** | 3-4 | Nervous, pressure each other, hints at 3min | +40-60% |
| **B2: Adolescente Impulsivo** | 4-6 | High energy, skip reading, brute force | +20% action, +40% reading |
| **B3: Adulto Pragmático** | 3-5 | Practical, clear feedback, hate nonsense | Normal if clear, +30% if confusing |
| **B4: El Tramposo** | 2-3 | Intentionally tries to skip puzzles, guess codes, brute-force locks, use meta-knowledge from narrative | Tests anti-cheat design |

### Same-provider divergence

If `scripts/verify-judges.py` → `same_provider: true`:

- Judge A: QA engineer mode, temp 0.2 equivalent, systematic checklist
- Judge B: Player who paid €25, temp 0.9, emotional first then analytical
- SUSPECT weight reduced to 0.6 (vs 1.0 for CONFIRMED)

### Anti-cheat simulation (B4)

Profile B4 simulates a player who actively tries to break the game:
- Skips reading and tries codes from narrative text
- Attempts to solve puzzles out of order
- Uses years, names, and theme words as code guesses
- Tries to brute-force numeric locks with common PINs
- Looks for shortcuts between rooms/phases

B4's findings feed directly into Verify checks 28-30 (anti-cheat). Any successful shortcut = CRITICAL for the game.

### B4 by game type

| Game Type | B4 Specific Behaviors |
|-----------|----------------------|
| **hall-escape** | Observes other teams' stations for solutions, counts projector slides for hints, tries to read other teams' materials |
| **street-escape** | GPS spoofs to skip locations, scans all QR codes at once, walks the route backwards, uses Google Maps instead of in-game clues |
| **investigation** | Speed-reads documents and guesses based on highlighted words, checks if final answer is solvable from intro alone, ignores red herrings to go straight for conclusion |
| **concurso** | Searches answers on phone during rounds, signals between teams, pre-positions mini-game materials for advantage |

## Execution Steps

### Step 0: Calibrate against real playtests

Read `playtest-report.json` from real games. Adjust profile metrics against real data. See `references/calibration-data.md`.

### Step 1: Prepare game data

Combine all files into `playtests/game-data.json`.

### Step 2: Launch both judges (parallel)

```
delegate(agent="escape-judge-a", prompt="Simulate 3 analytical profiles (A1-A3). Read game files in {game_dir}/. Complete playthrough step by step. BRUTALLY HONEST. Reference specific elements. Output PLAYTEST-A.json → {output_dir}/playtests/PLAYTEST-A.json")

delegate(agent="escape-judge-b", prompt="Simulate 4 experiential profiles (B1-B4). Read game files in {game_dir}/. Complete playthrough step by step. BRUTALLY HONEST but constructive. Output PLAYTEST-B.json → {output_dir}/playtests/PLAYTEST-B.json")
```

### Step 3: Synthesize

```bash
python3 scripts/dual-llm-synthesis.py \
  --judge-a {output_dir}/playtests/PLAYTEST-A.json \
  --judge-b {output_dir}/playtests/PLAYTEST-B.json \
  --output {output_dir}/PLAYTEST-REPORT.json \
  --type playtest --game-ref {juego-id}
```

### Classification

| Type | Definition | Action |
|------|-----------|--------|
| **CRITICAL** | Both judges found same issue | Must fix before Verify |
| **WARNING** | Only one judge found | Investigate |
| **DIVERGENCE** | Judges disagree | Context-dependent |

## Output Contract

| Product | Path |
|---------|------|
| Judge A simulation | `{output_dir}/playtests/PLAYTEST-A.json` |
| Judge B simulation | `{output_dir}/playtests/PLAYTEST-B.json` |
| Synthesis report | `{output_dir}/PLAYTEST-REPORT.json` |

## Verdict Rules

| Condition | Verdict |
|-----------|---------|
| All complete ≤2 hints, 0 CRITICAL | ✅ `pass` |
| CRITICAL but all complete, or 3+ hints | ⚠️ `pass_with_concerns` |
| Some profile cannot complete even with hints | ❌ `fail` |

Pipeline: `fail` → BUILD with feedback. `pass_with_concerns` → suggestions to Verify. `pass` → continue.

## References

- `references/calibration-data.md` — Playtest-derived calibration metrics
- `references/system-prompts.md` — Full system prompts for both judges
- `references/fallback.md` — Single-LLM fallback mode
