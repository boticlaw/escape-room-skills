---
name: pipeline-playtest
description: >
  FASE 4b — Dual-LLM Playtest Simulation. Judge A (opencode agent) simulates
  analytical profiles, Judge B (external API) simulates experiential profiles.
  Synthesis script crosses findings from both.
---

# Pipeline Playtest — Dual-LLM Simulation (Portable)

Two DIFFERENT LLMs simulate 6 player profiles (3 each) from complementary perspectives. A synthesis script crosses findings to identify issues with high confidence.

> ⏱️ Estimated time: ~4-6 min per judge (8-12 min total in parallel).

## When to Run

After Build (Phase 4). Before Verify (Phase 5).

## Architecture

```
┌─────────────────────┐     ┌──────────────────────────┐
│  Judge A             │     │  Judge B                  │
│  (opencode agent)    │     │  (Gemini/OpenAI API)      │
│  DIFFERENT model     │     │  DIFFERENT model          │
│                      │     │                           │
│  Perfil A1: Novato   │     │  Perfil B1: Novato        │
│    Lento (analítico) │     │    Ansioso (experiencial) │
│  Perfil A2: Experi-  │     │  Perfil B2: Adolescente   │
│    mentado Metódico  │     │    Impulsivo              │
│  Perfil A3: Experto  │     │  Perfil B3: Adulto        │
│    Crítico           │     │    Pragmático             │
└────────┬─────────────┘     └──────────┬────────────────┘
         │                              │
         ▼                              ▼
    PLAYTEST-A.json              PLAYTEST-B.json
         │                              │
         └──────────┬───────────────────┘
                    ▼
         dual-llm-synthesis.py
                    │
                    ▼
          PLAYTEST-REPORT.json
    (CRITICAL / WARNING / DIVERGENCE)
```

## Input

- `juego/diseño/DISEÑO-JUEGO.md` — Complete design
- `juego/narrativa/NARRATIVA.md` — Narrative
- `DESIGN.json` — Structured design
- `CONCEPT.json` — Original concept

## Output

| Product | Path |
|---------|------|
| Judge A simulation | `{output_dir}/playtests/PLAYTEST-A.json` |
| Judge B simulation | `{output_dir}/playtests/PLAYTEST-B.json` |
| Synthesis report | `{output_dir}/PLAYTEST-REPORT.json` |

## The Six Profiles

### Judge A: Analytical Profiles (opencode agent)

| Profile | Players | Behavior | Time vs Design |
|---------|---------|----------|---------------|
| **A1: Novato Lento** | 2-3 | Cautious, read twice, fear mistakes, over-think | +30-50% |
| **A2: Experimentado Metódico** | 4 | Systematic, divide & conquer, optimize | -10-20% on known, normal on new |
| **A3: Experto Crítico** | 2-4 | Evaluate design quality, spot flaws, compare | Normal, stops to analyze |

### Judge B: Experiential Profiles (external API)

| Profile | Players | Behavior | Time vs Design |
|---------|---------|----------|---------------|
| **B1: Novato Ansioso** | 3-4 | Nervous, pressure each other, ask hints at 3min | +40-60% |
| **B2: Adolescente Impulsivo** | 4-6 | High energy, skip reading, brute force | +20% action, +40% reading puzzles |
| **B3: Adulto Pragmático** | 3-5 | Practical, want clear feedback, hate "nonsense" | Normal if clear, +30% if confusing |

## Step 1: Prepare game data

Combine all game files into a single JSON for Judge B:

```bash
# Create combined game data
python3 -c "
import json, glob
data = {}
for f in ['DESIGN.json', 'CONCEPT.json']:
    try:
        with open('{pipeline_dir}/' + f) as fh: data[f] = json.load(fh)
    except: pass
for f in glob.glob('{game_dir}/juego/pruebas/*.json'):
    with open(f) as fh:
        data['prueba_' + f.split('/')[-1]] = json.load(fh)
for f in ['juego/diseño/DISEÑO-JUEGO.md', 'juego/narrativa/NARRATIVA.md']:
    try:
        with open('{game_dir}/' + f) as fh: data[f.split('/')[-1]] = fh.read()
    except: pass
with open('{output_dir}/playtests/game-data.json', 'w') as fh:
    json.dump(data, fh, ensure_ascii=False, indent=2)
"
```

## Step 2: Launch Judge A (opencode agent)

Run this as a delegation or task. The agent IS Judge A.

**System prompt for Judge A:**

```
You are Judge A — an ANALYTICAL playtest simulator for escape rooms.

Simulate 3 player profiles from an ANALYTICAL perspective:
- A1: Novato Lento (2-3 players, first escape room, cautious, over-think everything)
- A2: Experimentado Metódico (4 players, 10+ rooms, systematic, divide & conquer)
- A3: Experto Crítico (2-4 players, 50+ rooms, evaluate design quality)

For EACH profile, simulate the COMPLETE game session step by step:
1. Entry → introduction reaction
2. Each puzzle → approach, attempt, time spent, hints needed, block risks
3. Transitions → flow experience
4. Ending → satisfaction level

Be BRUTALLY HONEST. If a puzzle is confusing, say so.
Reference specific elements: "The cipher in P4 uses symbols that appear nowhere else"

Output JSON:
{
  "profiles_summary": {
    "novato_lento": {"completed": bool, "time_delta": "+X%", "hints": N, "block_risk": "none|low|medium|high"},
    "experimentado_metodico": {...},
    "experto_critico": {...}
  },
  "findings": [
    {"profile": "...", "puzzle": "P3", "type": "block_risk|frustration|dead_end|time_mismatch", "description": "...", "severity": "high|medium|low"}
  ]
}
```

## Step 3: Launch Judge B (external API, in parallel)

```bash
python3 scripts/dual-llm-evaluate.py \
  --task playtest \
  --input {output_dir}/playtests/game-data.json \
  --output {output_dir}/playtests/PLAYTEST-B.json
```

Environment variables needed:
```bash
export DUAL_LLM_API_KEY="your-gemini-api-key"   # or OpenAI key
export DUAL_LLM_PROVIDER="gemini"                 # or "openai"
export DUAL_LLM_MODEL="gemini-2.0-flash"          # any available model
```

**CRITICAL**: Judge A and Judge B run INDEPENDENTLY. Neither sees the other's output.

## Step 4: Synthesize

```bash
python3 scripts/dual-llm-synthesis.py \
  --judge-a {output_dir}/playtests/PLAYTEST-A.json \
  --judge-b {output_dir}/playtests/PLAYTEST-B.json \
  --output {output_dir}/PLAYTEST-REPORT.json \
  --type playtest \
  --game-ref {juego-id}
```

### Classification

| Type | Definition | Action |
|------|-----------|--------|
| **CRITICAL** | Both judges detected same issue | Must fix before Verify |
| **WARNING** | Only one judge detected | Investigate, possible fix |
| **DIVERGENCE** | One says problem, other says fine | Context-dependent, evaluate |

## Verdict Rules

| Condition | Verdict |
|-----------|---------|
| All profiles complete with ≤2 hints, 0 CRITICAL | ✅ `pass` |
| CRITICAL found but all complete, or some need 3+ hints | ⚠️ `pass_with_concerns` |
| Some profile cannot complete even with hints | ❌ `fail` |

## Rules

1. **Be ruthless**: Don't be lenient. If a puzzle is confusing, say so.
2. **Realistic profiles**: Base on how real people play.
3. **Each profile is independent**: Simulate each as a separate playthrough.
4. **Reference concrete elements**: "P4's cipher uses symbols that don't appear anywhere" not "the puzzle is confusing".
5. **Time delta**: Always calculate vs design estimate. Delta > +50% is an alert.
6. **Independence**: Judges don't share output. 100% independent simulation.
7. **Cross-validation**: An issue detected by both judges from different profiles is CRITICAL.

## Pipeline Integration

Runs between Build (Phase 4) and Verify (Phase 5).

- If `verdict = "fail"` → findings go back to Build for correction
- If `verdict = "pass_with_concerns"` → recommendations passed as suggestions to Verify
- If `verdict = "pass"` → continue to Verify normally

## Fallback (single-LLM)

If no external API is available, run Judge A only. Mark `_meta.dual_llm = false` in the report. Warnings from single-judge evaluation have lower confidence.
