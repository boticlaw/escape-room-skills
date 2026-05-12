---
name: pipeline-judgment-day
description: "Trigger: revisión adversarial escape room, judgment day, FASE 6 pipeline. Dual-LLM: evaluación analítica vs creativa, clasificación CONFIRMED/SUSPECT/CONTRADICTION, auto-fix iterativo hasta convergencia."
---

# Pipeline Judgment Day (FASE 6 — Dual-LLM Review)

## Activation Contract

After VERIFY (Phase 5). If Verify failed → back to Design first.

## Hard Rules

1. Both judges evaluate narrative AND logic (no separation).
2. Judges run independently — neither sees the other's output.
3. Only CONFIRMED issues get auto-fixed. SUSPECT/CONTRADICTION = manual review.
4. Max 2 iterations. Exceeded → escalate to user.

## The Two Judges

| Judge | Agent | Perspective |
|-------|-------|------------|
| **A** | escape-judge-a | Analytical — coherence, structure, solvability, consistency, completeness |
| **B** | escape-judge-b | Creative — immersion, emotion, originality, player experience |

### Same-provider divergence

If `scripts/verify-judges.py` → `same_provider: true`:

- Judge A: QA engineer mode — systematic, cold, checklist, 1-10 scoring per item
- Judge B: Player advocate — passionate, emotional first, then analytical
- SUSPECT weight: 0.6 (reduced). CONTRADICTION: manual review required.

## Execution Steps

### Step 1: Prepare game data

Combine all game files (same pattern as playtest).

### Step 2: Launch both judges (parallel)

```
delegate(agent="escape-judge-a", prompt="Evaluate ANALYTICALLY: coherence, structure, solvability, consistency, completeness. Score 1-10 per criterion. List every issue. RUTHLESS but constructive. Output JUDGE-A.json → {output_dir}/JUDGE-A.json")

delegate(agent="escape-judge-b", prompt="Evaluate CREATIVELY: immersion, emotional arc, originality, narrative-puzzle integration, player experience. Score 1-10 per criterion. BRUTALLY HONEST. Output JUDGE-B.json → {output_dir}/JUDGE-B.json")
```

### Step 3: Synthesize

```bash
python3 scripts/dual-llm-synthesis.py \
  --judge-a {output_dir}/JUDGE-A.json \
  --judge-b {output_dir}/JUDGE-B.json \
  --output {output_dir}/JUDGMENT-REPORT.json \
  --type judgment --game-ref {juego-id}
```

### Finding Classification

| Type | Definition | Action |
|------|-----------|--------|
| **CONFIRMED** | Both found same issue | Auto-fix mandatory |
| **SUSPECT** | Only one found | Investigate, optional |
| **CONTRADICTION** | Score delta ≥ 3 | Manual review |

### Step 4: Auto-fix CONFIRMED issues

For each CONFIRMED: apply fix, update game files, document change.

Do NOT auto-fix SUSPECT or CONTRADICTION.

### Step 5: Re-judge modified parts only

- Narrative + logic changed → both re-evaluate both
- Only narrative → both evaluate narrative only
- Only logic → both evaluate logic only

### Step 6: Convergence

| Condition | Result |
|-----------|--------|
| `combined ≥ 8.0` | ✅ APPROVED |
| `0 CONFIRMED + 0 CONTRADICTION` | ✅ APPROVED (only suspects) |
| Iteration ≥ 2 | ⚠️ ESCALATE to user |

If escalated: (1) continue 1 more iteration, (2) accept with warnings, (3) discard → back to CONCEIVE.

## Output Contract

`{output_dir}/JUDGMENT-REPORT.json` — Schema in `references/judgment-report-schema.md`.

## References

- `references/judgment-report-schema.md` — Full report schema
- `references/system-prompts.md` — System prompts for both judges
- `references/fallback.md` — Single-LLM fallback

Referenced skills (used by both judges for criteria):
- `pipeline-judge-story/SKILL.md`
- `pipeline-judge-logic/SKILL.md`
