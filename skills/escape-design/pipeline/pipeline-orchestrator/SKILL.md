---
name: pipeline-orchestrator
description: "Trigger: crea un escape room, diseña un juego, pipeline escape room. Master pipeline coordinator: delegates phases, tracks progress, manages dual-LLM gates."
license: Apache-2.0
metadata:
  author: escape-room-skills
  version: "2.0"
---

# Pipeline Orchestrator

## Activation Contract

Load when Daniel requests creating an escape room, designing a game, or running the pipeline. The orchestrator delegates phases as sub-agents — it does NOT execute phases directly.

## Hard Rules

1. **GUARDAR después de cada fase.** Write output to `{project_dir}/{artifact}`, verify with `ls -la`. Never accumulate unsaved work.
2. **PROGRESS.json is retomable.** Before any phase, read `{project_dir}/PROGRESS.json`. Resume from first non-completed phase. Update after each phase.
3. **Timeouts.** Exceed → save what exists, mark `failed`.

Timeouts: RESOLVE 3m · EXPLORE 8m · REGRESSION 5m · CONCEIVE 12m · DESIGN 15m · NARRATIVE 5m · DIFFICULTY 5m · BUILD 10m · MATERIALS-VERIFY 5m · NARRATIVE-RECHECK 5m · PLAYTEST 12m · VERIFY 8m · JUDGMENT 10m

## Decision Gates

### Gate 0.5: Post-RESOLVE (Style)

| Condition | Result |
|-----------|--------|
| `STYLE.json` exists in `juego/` | `"continue"` — use it |
| User provides style reference | Generate `STYLE.json` → continue |
| No style preference | Ask → auto-generate from preset → continue |

### Gate 1: Post-EXPLORE

| Condition | Result |
|-----------|--------|
| `datos_pendientes` not empty | `"blocked"` → stop, ask Daniel, re-run EXPLORE |
| Baseline exists | Execute REGRESSION before CONCEIVE |
| Sufficient data | `"continue"` |

### Gate 2: Post-CONCEIVE

| Condition | Result |
|-----------|--------|
| Passes CONCEIVE checks | `"continue"` |
| Fundamental problems | `"revise"` → adjust synthesis (max 2), then escalate |

### Gate 3: Post-DESIGN

| Condition | Result |
|-----------|--------|
| Passes Narrative + Difficulty | `"continue"` |
| Adjustments needed | `"adjust"` → apply and continue |

## Execution Steps

### Phase Table

| # | Phase | Skill | Input → Output | Model |
|---|-------|-------|----------------|-------|
| 0 | RESOLVE | `pipeline-skill-resolution` | game_type+theme+difficulty → `RESOLVED_STANDARDS.json` + `STYLE.json` | glm-5-turbo |
| 1 | EXPLORE | `pipeline-explore` | request → `BRIEF.json` | glm-5-turbo |
| 1b | REGRESSION | `pipeline-regression` | BASELINE+game → `REGRESSION-REPORT.json` | glm-5-turbo |
| 2 | CONCEIVE | `pipeline-conceive` | `BRIEF.json` → `CONCEPT.json` | **dual-LLM** |
| 3 | DESIGN | `pipeline-design` | `CONCEPT.json` → `DESIGN.json` | **dual-LLM** |
| 3a | NARRATIVE | `pipeline-narrative-consistency` | → `NARRATIVE-CONSISTENCY-REPORT.json` | glm-5-turbo |
| 3b | DIFFICULTY | `pipeline-difficulty-calibration` | → `DIFFICULTY-REPORT.json` | glm-5-turbo |
| 4 | BUILD | `pipeline-build` | → `juegos/{juego}/` | glm-5.1 |
| 4a | MATERIALS-VERIFY | `pipeline-verify-materials` | → `MATERIALS-VERIFY-REPORT.json` | glm-5-turbo |
| 4b | NARRATIVE-RECHECK | `pipeline-narrative-consistency` | → report | glm-5-turbo |
| 4c | PLAYTEST | `pipeline-playtest` | → `PLAYTEST-REPORT.json` | **dual-LLM** |
| 5 | VERIFY | `pipeline-verify` | → `VERIFY-REPORT.json` | glm-5-turbo |
| 6 | JUDGMENT | `pipeline-judgment-day` | → `JUDGMENT-REPORT.json` | **dual-LLM** |
| 7 | FIX | `pipeline-fix` | → fixed JSONs + `FIX-REPORT.json` | glm-5.1 |

**Dual-LLM** = escape-judge-a (GLM-5.1) + escape-judge-b (GPT-5.5).

### Auto-Fix Loop

After validation (4a, 4c, 5, 6) produces `fail`/`pass_with_warnings`: launch `pipeline-fix` → re-run originating validation → if still fails, retry (max 2 cycles) → exceeded → `failed` + escalate.

### Per-Phase Loop

1. READ PROGRESS → done/skipped? → skip
2. Mark `in_progress` → SAVE
3. Read `pipeline-{phase}/SKILL.md`, build prompt with input + RESOLVED_STANDARDS
4. `delegate(agent="escape-judge-a", prompt="...")` → wait → validate output
5. Fail → retry once → fail → `failed` + escalate
6. OK → `done` → SAVE → next phase

### Iteration & Consensus Rules

Global limits (see `references/iteration-rules.md`): max 2 attempts/phase, 1 Build→Playtest cycle, 2 Design→Build→Verify cycles, 3 full Design→Build→Verify→Judge cycles. Exceeded → `failed` + escalate.

Scenario-specific actions (e.g., CONCEIVE fails → adjust max 2 → escalate, VERIFY fail → FIX max 2 → re-verify → DESIGN → escalate): see `references/iteration-rules.md`.

Judgment consensus (e.g., both approved → ENTREGAR, both rejected → EXPLORE): see `references/judgment-consensus.md`.

## Output Contract

Report at each milestone (see `references/communication-milestones.md`). Follow `references/directory-structure.md`.

## References

- `references/progress-schema.md` — PROGRESS.json schema
- `references/design-checks.md` — 9 CONCEIVE + 8 DESIGN + 9 VERIFY checks
- `references/directory-structure.md` — Directory layouts
- `references/example-flow.md` — Complete example walkthrough
- `references/communication-milestones.md` — Exact messages per milestone
- `references/iteration-rules.md` — Iteration limits and per-scenario actions
- `references/judgment-consensus.md` — Dual-judge consensus table
- `../../escape-build/references/style-schema.md` — STYLE.json schema and genre presets
