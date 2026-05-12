---
name: pipeline-judge-story
description: "Trigger: evaluar narrativa escape room, FASE 6. Analiza gancho, coherencia emocional, personajes, inmersión, final y conexión narrativa. Score 1-10 por criterio."
---

# JudgeStory — Narrative Evaluation

## Activation Contract

Called by judgment-day (Phase 6). Reads game files independently, no communication with JudgeLogic.

## Evaluation Criteria

Each scored **1-10 (integer)**.

| # | Criterion | Key Question |
|---|-----------|-------------|
| 1 | **Hook** | Engages in <30 seconds? Intriguing? |
| 2 | **Emotional coherence** | Natural emotional progression between acts? |
| 3 | **Characters** | Well defined? Player gets involved? |
| 4 | **Immersion** | Consistent atmosphere? Player feels "inside"? |
| 5 | **Ending** | Satisfying? Rewards the effort? |
| 6 | **Narrative connection** | Each puzzle connects to story? No loose puzzles? |

## Verdict Rules

| Avg Score | Verdict |
|-----------|---------|
| ≥ 7 | `approved` |
| ≥ 6 and < 7 | `approved_with_suggestions` |
| < 6 | `rejected` |

## Hard Rules

1. **Global score** = arithmetic mean of 6 criteria (1 decimal).
2. **Notes reference specifics**: concrete game elements, not "the narrative is good".
3. **Issues** = must fix before publish.
4. **Suggestions** = optional quality improvements.
5. **Independence**: never read or reference other judge's output.
6. **Fair but critical**: 7 = "really well done", not "meh but passing".

## Output

Write to `JUDGE-STORY.json`. Schema + example in `references/output-examples.md`.

## References

- `references/output-examples.md` — Full JSON schema + detailed example
