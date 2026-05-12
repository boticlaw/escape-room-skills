---
name: pipeline-difficulty-calibration
description: "Trigger: calibrar dificultad escape room, FASE 3b. Calcula difficulty target por público, evalúa cada prueba contra 6 parámetros objetivos, valida curva Warm-up→Build→Climax→Resolution."
---

# Pipeline Difficulty Calibration

## Activation Contract

Between DESIGN (Phase 3) and BUILD (Phase 4). Also runs standalone for recalibration.

## Hard Rules

1. **Realistic values**: Caesar cipher = cognitive_load 5, not 8. 4-digit lock = 3.
2. **Curve matters as much as values**: all puzzles in target but flat curve = `pass_with_adjustments`.
3. **Concrete suggestions**: "replace Caesar with A=1" not "simplify".
4. **Audience rules**: brief says 12-14 novatos → NO puzzles with cognitive_load >4. Period.
5. **Don't over-adjust**: 1 param under_difficulty is fine if curve is healthy.
6. **Time delta**: estimated total >15% over brief duration = adjustment needed.
7. **Respect narrative design**: complex puzzle is narrative key → suggest more hints, don't simplify.

## Execution Steps

### Step 1: Calculate Difficulty Target

From BRIEF/CONCEPT extract: age, experience, group size, duration.

**Formula**: `max_param = round(age_base × experience_multiplier + group_adjustment)`

All values clamped 1-10.

| Parameter | Description | Low (1-2) | Mid (3-4) | High (5-6) | Very High (7-10) |
|-----------|-------------|-----------|-----------|------------|-------------------|
| **cognitive_load** | Mental effort | Find object | Simple cipher (A=1) | Standard (Caesar) | Complex + multi-source |
| **physical_complexity** | Physical effort | Open box | Insert piece | Assemble 3+ pieces | Multi-step 5+ pieces |
| **lateral_thinking** | Creative leap | Apply code to lock | Obvious visual clue | Non-evident connection | Metaphor/abstraction |
| **info_integration** | Source count | 1 source = 1 clue | 2 simple sources | 3 with crossing | 4+ cross-deduction |
| **time_pressure** | Clock dependency | None | Relaxed | Lose bonus | Lose opportunity |
| **cooperation_required** | Teamwork need | Solo possible | 2 parallel | 2 simultaneous | 3+ coordinated real-time |

Full age/experience/group tables: `references/parameter-tables.md`.

Output: `difficulty_target.json`.

### Step 1b: Calibrate against real games

```bash
python3 scripts/search-games.py --difficulty 3-5 --pretty
```

Compare against real game curves. Rules: peak > real max +1 → WARNING. First puzzle >4 → WARNING. Last puzzle hardest → WARNING.

### Step 2: Evaluate each puzzle

Score 6 parameters (1-10). Compare against target.

| Condition | Status |
|-----------|--------|
| All params ≤ max | `within_target` |
| Any param > max | `over_difficulty` |
| All params ≤ max-2 | `under_difficulty` |

Auto-suggestions per exceeded parameter: see `references/auto-suggestions.md`.

### Step 3: Curve Analysis

Calculate `difficulty_score` per puzzle = mean of 6 params.

| Pattern | Condition | Severity |
|---------|-----------|----------|
| ❌ **Flat** | Std dev < 0.5 | Medium |
| ❌ **Spike early** | P1/P2 has highest score | High |
| ❌ **No climax** | No puzzle ≥ target × 0.9 | Medium |
| ❌ **Dip at end** | Last puzzle easiest | Medium |
| ✅ **Healthy** | Gradual with clear climax | — |

### Step 4: Generate report

Output: `DIFFICULTY-REPORT.json` — Schema in `references/report-schema.md`.

## Verdict Rules

| Condition | Verdict |
|-----------|---------|
| All within target + healthy curve | ✅ `pass` |
| ≤2 outside target + acceptable curve | ⚠️ `pass_with_adjustments` |
| >2 outside OR broken curve (spike/flat) | ❌ `fail` |

Pipeline: `pass` → Build. `pass_with_adjustments` → adjustments as Build context. `fail` → back to Design (max 1 iteration).

## References

- `references/parameter-tables.md` — Age/experience/group tables, max times, hints
- `references/auto-suggestions.md` — Per-parameter reduction suggestions
- `references/report-schema.md` — Full report + target JSON schemas
