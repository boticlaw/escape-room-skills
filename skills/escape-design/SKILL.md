---
name: escape-design
description: "Trigger: design escape room, create escape game, diseño sala escape. Master pipeline for complete escape room design with dual-LLM quality gates, zero-GM self-service verification."
---

# Escape Room Design — Master Pipeline

## Activation Contract

Load when Daniel requests creating an escape room, designing a game, or running the full design pipeline. This skill is the entry point — it references the pipeline orchestrator and sub-phase skills.

## Hard Rules

| Rule | Description |
|---|---|
| **ZERO GM** | No human game master. All verification is self-service. |
| **ANTI-CHEAT** | Puzzles resist brute-force, lucky guesses, and accidental solves. |
| **SELF-SERVICE** | Players verify solutions through physical/digital mechanisms. |
| **REAL MECHANISMS** | Locks open, lights turn on, doors unlock — real feedback. |
| **NO CROSS-DEPENDENCIES** | Each puzzle is self-contained. No data from puzzle A needed in puzzle B. |
| **PHYSICAL > DIGITAL** | Prioritize physical manipulation. Digital only as support, never protagonist. |
| **DOUBLE DISCOVERY** | Every puzzle has at least 2 layers of "aha!" — solve it AND discover something revealing. |

## Decision Gates

See `references/phase-details.md` for research rules, constraints, and checklists per phase.

| Gate | Decision |
|---|---|
| Post-EXPLORE | Missing data → blocked. Sufficient → continue. Baseline exists → run REGRESSION first. |
| Post-CONCEIVE | Passes checks → continue. Fundamental problems → revise (max 2), then escalate. |
| Post-DESIGN | Passes Narrative + Difficulty → continue. Adjustments needed → apply and continue. |

## Execution Steps

### Pipeline Flow

```
RESOLVE → EXPLORE → REGRESSION → CONCEIVE → DESIGN → NARRATIVE-CONSISTENCY → DIFFICULTY-CALIBRATION → BUILD → NARRATIVE-RECHECK → PLAYTEST → VERIFY → JUDGMENT → REMIX
```

### Phase Directory Mapping

| Phase | Directory |
|---|---|
| Orchestration | `pipeline-orchestrator/` |
| Explore | `pipeline-explore/` |
| Conceive | `pipeline-conceive/` |
| Design | `pipeline-design/` |
| Build | `pipeline-build/` |
| Verify | `pipeline-verify/` |
| Judgment Day | `pipeline-judgment-day/` |
| Playtest | `pipeline-playtest/` |
| Judge Logic | `pipeline-judge-logic/` |
| Judge Story | `pipeline-judge-story/` |
| Narrative Consistency | `pipeline-narrative-consistency/` |
| Difficulty Calibration | `pipeline-difficulty-calibration/` |
| Regression | `pipeline-regression/` |
| Skill Resolution | `pipeline-skill-resolution/` |
| Remix | `pipeline-remix/` |
| Test Architect | `skill-architect-pruebas-escape/` |
| Game Creator | `skill-creador-juegos/` |

### Iteration Rules

| Rule | Limit |
|---|---|
| Max attempts per phase | 2 |
| Max build→playtest cycles | 1 |
| Max design→build→verify cycles | 2 |
| If JUDGMENT fails | Revise and re-enter at DESIGN |
| If max iterations reached | Report to user with recommendations |

### Communication Checkpoints

| After Phase | Communicate to User |
|---|---|
| RESOLVE | Confirm requirements summary |
| CONCEIVE | Present concept statement for approval |
| DESIGN | Present puzzle architecture for review |
| BUILD | Deliver generated files |
| JUDGMENT | Final verdict and recommendations |

## Output Contract

- `game.json` + individual `prueba-*.json` files per game
- PROGRESS.json tracks phase status and iteration counts (see `references/progress-schema.md`)
- Communication at each milestone checkpoint

## References

- `references/phase-details.md` — Research rules, constraints, checklists per phase
- `references/research-frameworks.md` — F1–F10 compact rule tables
- `references/game-types.md` — hall-escape, street-escape, investigation
- `references/progress-schema.md` — PROGRESS.json schema + iteration rules
