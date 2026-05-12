# PROGRESS.json Schema

Full example with all fields:

```json
{
  "schema_version": "1.0",
  "pipeline_version": "escape-room-v1",
  "game_id": "slug-del-juego",
  "started_at": "2026-05-01T08:00:00Z",
  "last_updated": "2026-05-01T08:30:00Z",
  "mode": "full",
  "phases": {
    "RESOLVE": { "status": "done", "completed_at": "...", "file": "RESOLVED_STANDARDS.json" },
    "EXPLORE": { "status": "done", "completed_at": "...", "file": "BRIEF.json" },
    "REGRESSION": { "status": "skipped", "reason": "No baseline exists" },
    "CONCEIVE": { "status": "done", "completed_at": "...", "file": "CONCEPT.json" },
    "DESIGN": { "status": "done", "completed_at": "...", "file": "DESIGN.json" },
    "NARRATIVE-CONSISTENCY": { "status": "done", "completed_at": "...", "file": "NARRATIVE-CONSISTENCY-REPORT.json" },
    "DIFFICULTY-CALIBRATION": { "status": "done", "completed_at": "...", "file": "DIFFICULTY-REPORT.json" },
    "BUILD": { "status": "done", "completed_at": "...", "output_dir": "juegos/{juego}/" },
    "NARRATIVE-CONSISTENCY-RECHECK": { "status": "pending" },
    "PLAYTEST": { "status": "pending" },
    "VERIFY": { "status": "pending" },
    "JUDGMENT": { "status": "pending" }
  },
  "gate_results": {
    "post_explore": "continue",
    "post_conceive": "continue",
    "post_design": "continue"
  },
  "iteration_counts": {
    "conceive_attempts": 1,
    "design_attempts": 1,
    "build_playtest_cycles": 0,
    "design_build_verify_cycles": 0,
    "total_full_cycles": 0
  },
  "dual_llm_results": {
    "conceive": { "escape-judge-a": "done", "escape-judge-b": "done", "synthesis": "done" },
    "design": { "escape-judge-a": "done", "escape-judge-b": "done", "synthesis": "done" },
    "playtest": { "escape-judge-a": null, "escape-judge-b": null, "synthesis": null },
    "judgment": { "escape-judge-a": null, "escape-judge-b": null, "synthesis": null }
  }
}
```

## Status values

`pending` | `in_progress` | `done` | `skipped` | `failed`

## Gate result values

`continue` | `blocked` | `revise` | `adjust`
