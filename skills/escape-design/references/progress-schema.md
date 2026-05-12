# Progress Tracking (PROGRESS.json)

```json
{
  "game_id": "",
  "current_phase": "RESOLVE",
  "phase_status": {
    "RESOLVE": "pending",
    "EXPLORE": "pending",
    "REGRESSION": "pending",
    "CONCEIVE": "pending",
    "DESIGN": "pending",
    "NARRATIVE-CONSISTENCY": "pending",
    "DIFFICULTY-CALIBRATION": "pending",
    "BUILD": "pending",
    "NARRATIVE-RECHECK": "pending",
    "PLAYTEST": "pending",
    "VERIFY": "pending",
    "JUDGMENT": "pending",
    "REMIX": "pending"
  },
  "iterations": {
    "total": 0,
    "max_build_playtest_cycles": 1,
    "max_design_build_verify_cycles": 2,
    "phase_attempts": {}
  },
  "issues": [],
  "notes": ""
}
```

## Iteration Rules

| Rule | Limit |
|---|---|
| Max attempts per phase | 2 |
| Max build→playtest cycles | 1 |
| Max design→build→verify cycles | 2 |
| If JUDGMENT fails | Revise and re-enter at DESIGN phase |
| If max iterations reached | Report to user with recommendations |

## Communication Checkpoints

| After Phase | Communicate to User |
|---|---|
| RESOLVE | Confirm requirements summary |
| CONCEIVE | Present concept statement for approval |
| DESIGN | Present puzzle architecture for review |
| BUILD | Deliver generated files |
| JUDGMENT | Final verdict and recommendations |
