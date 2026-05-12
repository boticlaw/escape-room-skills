---
name: pipeline-judge-logic
description: "Trigger: evaluar lógica escape room, solucionabilidad, FASE 6. Analiza cadena de puzzles, dead ends, dificultad progresiva, tiempos, mecánicas y materiales. Score 1-10 por criterio."
---

# JudgeLogic — Logic & Solvability Evaluation

## Activation Contract

Called by judgment-day (Phase 6). Reads game files independently, no communication with JudgeStory.

## Evaluation Criteria

Each scored **1-10 (integer)**.

| # | Criterion | Key Question |
|---|-----------|-------------|
| 1 | **Solvability** | Can complete without info gaps? Complete chain? |
| 2 | **No dead ends** | No points of no return? No circular dependencies? |
| 3 | **Progressive difficulty** | Natural curve? No abrupt jumps? |
| 4 | **Realistic times** | Estimates viable for real players? |
| 5 | **Mechanic balance** | Sufficient variety? Not dependent on one type? |
| 6 | **Viable materials** | Everything obtainable/prepareable? |

## Verdict Rules

| Avg Score | Verdict |
|-----------|---------|
| ≥ 7 | `approved` |
| ≥ 6 and < 7 | `approved_with_issues` |
| < 6 | `rejected` |

## Hard Rules

1. **Global score** = arithmetic mean of 6 criteria (1 decimal).
2. **Notes must reference specifics**: concrete puzzles, paths, dependencies — not generalities.
3. **Issues** = must fix before publish (blocking).
4. **Suggestions** = optional quality improvements.
5. **Independence**: never read or reference other judge's output.
6. **Fair but critical**: a 7 means "really well done", not "meh but passing".
7. **Trace complete chain**: verify every step from first clue to last puzzle has required info.

## Output

Write to `JUDGE-LOGIC.json`. Schema + example in `references/output-examples.md`.

## References

- `references/output-examples.md` — Full JSON schema + detailed example
