---
name: pipeline-judgment-day
description: "FASE 6 — Dual-LLM adversarial review with iteration. Judge A (escape-judge-a) evaluates analytically, Judge B (escape-judge-b) evaluates creatively. Synthesis crosses findings, auto-fixes confirmed issues, iterates."
---

# Pipeline Judgment Day — Dual-LLM Review (Portable)

Two DIFFERENT LLMs evaluate the complete escape room independently via opencode agent delegation. Each evaluates BOTH narrative and logic from their perspective. Synthesis crosses findings, auto-fixes confirmed issues, iterates until convergence.

## Architecture

```
┌─────────────────────┐     ┌──────────────────────────┐
│  Judge A             │     │  Judge B                  │
│  (opencode agent)    │     │  (opencode agent)         │
│  escape-judge-a      │     │  escape-judge-b            │
│  GLM-5.1             │     │  GPT-5.5                  │
│                      │     │                           │
│  ANALYTICAL focus:   │     │  CREATIVE focus:          │
│  - Coherence         │     │  - Immersion quality      │
│  - Structure         │     │  - Emotional arc          │
│  - Solvability       │     │  - Originality            │
│  - Consistency       │     │  - Player experience      │
└────────┬─────────────┘     └──────────┬────────────────┘
         │                              │
         ▼                              ▼
    JUDGE-A.json                  JUDGE-B.json
         │                              │
         └──────────┬───────────────────┘
                    ▼
         dual-llm-synthesis.py → CONFIRMED / SUSPECT / CONTRADICTION
                    │
                    ▼
         Auto-fix CONFIRMED → Re-judge → Converge
```

## When to Run

After Build (Phase 4) and Verify (Phase 5). If Verify is `fail`, go back to Design first.

## Input

- Complete game directory: `{game_dir}/`
- `CONCEPT.json`, `DESIGN.json`, `VERIFY-REPORT.json`

## The Two Judges

| Judge | Source | Perspective |
|-------|--------|------------|
| **A** | opencode agent (escape-judge-a) | Analytical — coherence, structure, solvability, consistency |
| **B** | opencode agent (escape-judge-b) | Creative — immersion, emotion, originality, experience |

**Key advantage**: Two genuinely different models capture more defects and biases than one model self-evaluating.

## Step 1: Prepare game data

```bash
# Same as playtest — combine all game files
# (see pipeline-playtest for the script)
```

## Step 2: Launch Judge A (opencode agent — escape-judge-a)

Launch via delegation:

```
delegate(agent="escape-judge-a", prompt="Evaluate this escape room from an ANALYTICAL perspective: coherence, structure, solvability, consistency, completeness. Read all game files in {game_dir}/. Score each criterion 1-10. List every issue found. Be RUTHLESS but constructive. Reference specific elements. Output JUDGE-A.json to {output_dir}/JUDGE-A.json")
```

**System prompt for Judge A (configured in opencode.json):**

```
You are Judge A — an ANALYTICAL evaluator for escape rooms.

Evaluate this escape room from an ANALYTICAL perspective:
- Coherence: Does the story hold together? Are characters consistent?
- Structure: Is the flow logical? Are transitions clear?
- Solvability: Can every puzzle be solved with available information?
- Consistency: Do codes match their lock types? Do materials match descriptions?
- Completeness: Does every solution list all required values?

Score each criterion 1-10. List every issue found.
Be RUTHLESS but constructive. Reference specific elements.

Output JSON:
{
  "scores": {"coherence": N, "structure": N, "solvability": N, "consistency": N, "completeness": N},
  "overall_score": N,
  "findings": [
    {"criterion": "...", "description": "...", "severity": "critical|major|minor", "suggestion": "..."}
  ],
  "verdict": "approved|approved_with_suggestions|rejected"
}
```

## Step 3: Launch Judge B (opencode agent — escape-judge-b, in parallel)

Launch via delegation:

```
delegate(agent="escape-judge-b", prompt="Evaluate this escape room from a CREATIVE and EXPERIENTIAL perspective: immersion quality, emotional arc, originality, narrative-puzzle integration, player experience. Read all game files in {game_dir}/. Score each criterion 1-10. List all issues and suggestions. Be BRUTALLY HONEST but constructive. Reference specific elements. Output JUDGE-B.json to {output_dir}/JUDGE-B.json")
```

Both judges run independently via async delegation — neither sees the other's output.

## Step 4: Synthesize

```bash
python3 scripts/dual-llm-synthesis.py \
  --judge-a {output_dir}/JUDGE-A.json \
  --judge-b {output_dir}/JUDGE-B.json \
  --output {output_dir}/JUDGMENT-REPORT.json \
  --type judgment \
  --game-ref {juego-id}
```

### Finding Classification

| Type | Definition | Action |
|------|-----------|--------|
| **CONFIRMED** | Both judges found same issue | Auto-fix mandatory |
| **SUSPECT** | Only one judge found it | Investigate, optional fix |
| **CONTRADICTION** | Judges disagree (score delta ≥ 3) | Manual review needed |

## Step 5: Auto-fix

For each CONFIRMED issue:
1. Apply the concrete fix described in synthesis
2. Update game files in `{game_dir}/`
3. Document what changed and why

**Do NOT auto-fix** SUSPECT or CONTRADICTION issues.

## Step 6: Re-judge

Re-launch both judges on the **modified parts only**:
- If narrative + logic changed → both re-evaluate
- If only narrative → both evaluate narrative only
- If only logic → both evaluate logic only

## Step 7: Convergence

| Condition | Result |
|-----------|--------|
| `combined ≥ 8.0` | ✅ APPROVED — no more iterations |
| `0 CONFIRMED + 0 CONTRADICTION` | ✅ APPROVED — only suspects |
| Iteration ≥ 2 | ⚠️ ESCALATE — present to user |

### If escalated

Present options:
1. **Continue iterating** — reset counter (1 more iteration)
2. **Accept with warnings** — deliver with suspect notes
3. **Discard and regenerate** — back to Phase 2 (Conceive) with all feedback

## Output: JUDGMENT-REPORT.json

```json
{
  "id": "judgment_YYYY-MM-DD_{juego-slug}",
  "game_ref": "{juego-slug}",
  "timestamp": "ISO-8601",
  "dual_llm": true,
  "iterations": 1,
  "judge_a_model": "opencode/glm-5.1",
  "judge_b_model": "opencode/gpt-5.5",
  "synthesis": {
    "confirmed": [],
    "suspect": [],
    "contradiction": []
  },
  "scores": {
    "judge_a": 7.5,
    "judge_b": 7.4,
    "combined": 7.45
  },
  "verdict": "approved|approved_with_suggestions|rejected",
  "fixes_applied": [],
  "remaining_suspects": []
}
```

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/dual-llm-synthesis.py` | Cross findings, classify, synthesize |

Note: `scripts/dual-llm-evaluate.py` is no longer needed — both judges are opencode agents now.

## Fallback (single-LLM)

If only one judge agent is configured, run Judge A only. Mark `_meta.dual_llm = false`. Single-judge evaluation has lower confidence but is still valuable for catching basic issues.

## Skills Referenced

- `pipeline-judge-story/SKILL.md` — Narrative evaluation criteria (used by both judges)
- `pipeline-judge-logic/SKILL.md` — Logic evaluation criteria (used by both judges)
