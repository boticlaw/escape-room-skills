# Regression Report Schema

## REGRESSION-REPORT.json

```json
{
  "id": "regression_{date}_{slug}",
  "game_ref": "{slug}",
  "baseline_version": "v1.0",
  "current_version": "v2.0",
  "changes_detected": {
    "added": [],
    "modified": ["P3", "P6"],
    "removed": [],
    "unchanged": ["P1", "P2", "P4", "P5"]
  },
  "chain_integrity": {
    "complete": true,
    "broken_links": [],
    "orphan_tests": []
  },
  "score_delta": {
    "overall": -0.3,
    "story": 0,
    "logic": -0.5
  },
  "regressions": [
    {"area": "P3 logic", "previous_score": 8.0, "current_score": 7.5, "delta": -0.5, "reason": "string"}
  ],
  "improvements": [],
  "re_verification_needed": {
    "narrative_consistency": false,
    "verify": true,
    "judge_story": false,
    "judge_logic": true,
    "playtest": true,
    "difficulty_calibration": false
  },
  "cross_game_regression": {
    "games_compared": ["el-legado-de-la-familia"],
    "difficulty_curve_delta": "+1.2",
    "mechanic_variety_score": "6 unique / 7 puzzles",
    "time_distribution": "38min puzzles / 12min transitions",
    "warnings": [],
    "patterns_checked": {
      "has_cooperative_puzzle": true,
      "max_same_type": 2,
      "has_hilo_conductor": true
    }
  },
  "verdict": "pass|pass_with_concerns|fail"
}
```
