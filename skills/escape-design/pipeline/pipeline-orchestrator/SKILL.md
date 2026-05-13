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

Load when Daniel requests creating an escape room, designing a game, or running the pipeline.
The orchestrator delegates phases as sub-agents — it does NOT execute phases directly.

## Hard Rules

1. **GUARDAR después de cada fase.** Write output to `{project_dir}/{artifact}`, verify with `ls -la`. Never accumulate unsaved work.
2. **PROGRESS.json is retomable.** Before any phase, read `{project_dir}/PROGRESS.json`. Resume from first non-completed phase. Update after each phase (see `references/progress-schema.md`). Required: `phases.{name}.status` (`pending`|`in_progress`|`done`|`skipped`|`failed`).
3. **Timeouts.** Exceed → save what exists, mark `failed`.

RESOLVE 3m · EXPLORE 8m · REGRESSION 5m · CONCEIVE 12m · DESIGN 15m · NARRATIVE 5m · DIFFICULTY 5m · BUILD 10m · MATERIALS-VERIFY 5m · NARRATIVE-RECHECK 5m · PLAYTEST 12m · VERIFY 8m · JUDGMENT 10m

## Decision Gates

### Gate 1: Post-EXPLORE

| Condition | Result |
|-----------|--------|
| `datos_pendientes` not empty | `"blocked"` → stop, ask Daniel, re-run EXPLORE with answers |
| Baseline exists | Execute REGRESSION before CONCEIVE |
| Sufficient data | `"continue"` |

### Gate 2: Post-CONCEIVE

| Condition | Result |
|-----------|--------|
| Passes CONCEIVE checks (see `references/design-checks.md`) | `"continue"` |
| Fundamental problems | `"revise"` → adjust synthesis (max 2), then escalate |

### Gate 3: Post-DESIGN

| Condition | Result |
|-----------|--------|
| Passes Narrative Consistency + Difficulty Calibration | `"continue"` |
| Adjustments needed | `"adjust"` → apply and continue |

## Execution Steps

### Phase Table

| # | Phase | Skill | Input → Output | Model |
|---|-------|-------|----------------|-------|
| 0 | RESOLVE | `pipeline-skill-resolution` | game_type+theme+difficulty → `RESOLVED_STANDARDS.json` | glm-5-turbo |
| 1 | EXPLORE | `pipeline-explore` | Daniel's request → `BRIEF.json` | glm-5-turbo |
| 1b | REGRESSION | `pipeline-regression` | BASELINE+game → `REGRESSION-REPORT.json` | glm-5-turbo |
| 2 | CONCEIVE | `pipeline-conceive` | `BRIEF.json` → `concepts/A.json`+`B.json` → `CONCEPT.json` | **dual-LLM** |
| 3 | DESIGN | `pipeline-design` | `CONCEPT.json` → `designs/A.json`+`B.json` → `DESIGN.json` | **dual-LLM** |
| 3a | NARRATIVE | `pipeline-narrative-consistency` | `DESIGN.json`+`CONCEPT.json` → `NARRATIVE-CONSISTENCY-REPORT.json` | glm-5-turbo |
| 3b | DIFFICULTY | `pipeline-difficulty-calibration` | `CONCEPT.json`+`DESIGN.json` → `DIFFICULTY-REPORT.json` | glm-5-turbo |
| 4 | BUILD | `pipeline-build` | `DESIGN.json`+difficulty report → `juegos/{juego}/` | glm-5.1 |
| 4a | MATERIALS-VERIFY | `pipeline-verify-materials` | `juegos/{juego}/`+`materiales/` → `MATERIALS-VERIFY-REPORT.json` | glm-5-turbo |
| 4b | NARRATIVE-RECHECK | `pipeline-narrative-consistency` | `juegos/`+`DESIGN.json` → `NARRATIVE-CONSISTENCY-REPORT.json` | glm-5-turbo |
| 4c | PLAYTEST | `pipeline-playtest` | `juegos/`+`DESIGN.json`+`CONCEPT.json` → `playtests/A.json`+`B.json` → `PLAYTEST-REPORT.json` | **dual-LLM** |
| 5 | VERIFY | `pipeline-verify` | `juegos/`+`DESIGN.json`+reports → `VERIFY-REPORT.json` | glm-5-turbo |
| 6 | JUDGMENT | `pipeline-judgment-day` | all artifacts → `JUDGMENT-REPORT.json` | **dual-LLM** |
| 7 | FIX | `pipeline-fix` | report+JSONs → fixed JSONs+materials → `FIX-REPORT.json` | glm-5.1 |

**Dual-LLM** = escape-judge-a (GLM-5.1) + escape-judge-b (GPT-5.5). Validate against design checks (see `references/design-checks.md`).

### Auto-Fix Loop

After any validation phase (4a, 4c, 5, 6) produces `fail` or `pass_with_warnings`:

1. Launch `pipeline-fix` with the failing report + affected JSONs
2. FIX applies changes to source JSONs, regenerates materials, produces `FIX-REPORT.json`
3. If `FIX-REPORT.verdict = fixed` → re-run the originating validation
4. If re-validation passes → continue pipeline
5. If re-validation fails or FIX escalates → increment cycle counter, retry (max 2)
6. Max cycles exceeded → `failed` + escalate to Daniel

### Per-Phase Loop

1. READ PROGRESS → done/skipped? → skip
2. Mark `in_progress` → SAVE
3. Read `pipeline-{phase}/SKILL.md`, build prompt with input + RESOLVED_STANDARDS
4. `delegate(agent="escape-judge-a", prompt="...")` → wait → validate output (`ls -la`)
5. Fail → retry once → fail → `failed` + escalate
6. OK → `done` → SAVE → next phase

### Iteration Rules

**Global limits** (`PROGRESS.iteration_counts`):
- Max **2 attempts** per phase (reset per major cycle)
- Max **1** Build→Playtest cycle
- Max **2** Design→Build→Verify cycles
- Max **3** full Design→Build→Verify→Judge cycles
- Exceeded → `failed` + escalate

| Scenario | Action |
|----------|--------|
| CONCEIVE fails | Adjust synthesis (max 2) → persist → escalate |
| DESIGN fails | Adjust synthesis (max 2) → persist → escalate |
| MATERIALS-VERIFY fail | → FIX (max 2 cycles) → re-verify → escalate |
| MATERIALS-VERIFY pass_with_warnings | FIX warnings if actionable, pass rest to PLAYTEST, continue |
| PLAYTEST fail | → FIX (max 2 cycles) → re-playtest → escalate |
| PLAYTEST pass_with_concerns | FIX actionable concerns, pass report to Verify, continue |
| VERIFY fail | → FIX (max 2 cycles) → re-verify → if still fails → DESIGN → escalate |
| JUDGMENT approved_with_suggestions | FIX non-breaking suggestions, deliver |
| DIFFICULTY fail | → DESIGN with feedback (max 1) → escalate |
| DIFFICULTY pass_with_adjustments | FIX adjustments, pass to Build, continue |
| NARRATIVE fail | → DESIGN with feedback (max 1) → escalate |
| NARRATIVE pass_with_warnings | FIX warnings if actionable, continue |
| REGRESSION fail | **Stop.** Escalate. Daniel decides. |
| REGRESSION pass_with_concerns | Continue, run only `re_verification_needed` |
| FIX escalates (cannot fix) | → DESIGN or CONCEIVE depending on issue scope → escalate |

### Judgment Consensus

| judge-a (GLM-5.1) | judge-b (GPT-5.5) | Action |
|-----|-----|--------|
| approved | approved | ✅ ENTREGAR |
| approved_with_suggestions | approved | ✅ ENTREGAR (con notas) |
| approved | approved_with_suggestions | ✅ ENTREGAR (con notas) |
| approved_with_suggestions | approved_with_suggestions | ✅ ENTREGAR (notas de ambos) |
| rejected | approved | → CONCEIVE con feedback dual |
| approved | rejected | → DESIGN con feedback dual |
| rejected | rejected | → EXPLORE — concepto roto |

Both judges evaluate narrative AND logic (no separation).

## Output Contract

Report at each milestone (see `references/communication-milestones.md` for exact messages).

Follow directory structure (see `references/directory-structure.md`).

## References

- `references/progress-schema.md` — Full PROGRESS.json schema
- `references/design-checks.md` — 9 CONCEIVE + 8 DESIGN + 9 VERIFY checks
- `references/directory-structure.md` — Directory layouts
- `references/example-flow.md` — Complete example walkthrough
- `references/communication-milestones.md` — Exact messages per milestone
