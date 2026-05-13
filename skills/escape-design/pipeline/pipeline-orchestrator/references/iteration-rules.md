# Iteration Rules

## Global Limits (`PROGRESS.iteration_counts`)

- Max **2 attempts** per phase (reset per major cycle)
- Max **1** Build→Playtest cycle
- Max **2** Design→Build→Verify cycles
- Max **3** full Design→Build→Verify→Judge cycles
- Exceeded → `failed` + escalate

## Per-Scenario Actions

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
