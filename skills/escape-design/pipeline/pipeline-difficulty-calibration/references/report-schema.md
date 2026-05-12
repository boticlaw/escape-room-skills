# Difficulty Report Schema

## difficulty_target.json

```json
{
  "id": "difficulty_target_{date}_{slug}",
  "game_ref": "{slug}",
  "audience": "string",
  "age_range": [12, 14],
  "experience": "string",
  "group_size": [4, 6],
  "difficulty_level": "facil",
  "calculation": {
    "age_base": "12-14",
    "experience_multiplier": 0.7,
    "group_adjustment": -1
  },
  "max_cognitive_load": 3,
  "max_physical_complexity": 3,
  "max_lateral_thinking": 2,
  "max_info_integration": 2,
  "max_time_pressure": 2,
  "max_cooperation_required": 3,
  "max_puzzle_time_minutes": 8,
  "recommended_total_puzzles": 5,
  "recommended_hints_per_puzzle": 2
}
```

## DIFFICULTY-REPORT.json

```json
{
  "id": "difficulty_{date}_{slug}",
  "game_ref": "{slug}",
  "difficulty_target": { "...target object..." },
  "puzzles": [
    {
      "prueba": "P1",
      "name": "...",
      "cognitive_load": 3,
      "physical_complexity": 2,
      "lateral_thinking": 2,
      "info_integration": 2,
      "time_pressure": 1,
      "cooperation_required": 2,
      "difficulty_score": 2.0,
      "status": "within_target|over_difficulty|under_difficulty",
      "exceeds": [],
      "suggestions": []
    }
  ],
  "summary": {
    "total_puzzles": 6,
    "within_target": 4,
    "over_difficulty": 1,
    "under_difficulty": 1,
    "estimated_total_time": "52min",
    "target_time": "45min",
    "time_delta": "+7min"
  },
  "difficulty_curve": {
    "pattern": "healthy|flat|spike_early|no_climax|dip_at_end",
    "scores": [{"prueba": "P1", "difficulty_score": 2.0, "ideal_zone": true}],
    "curve_issues": []
  },
  "verdict": "pass|pass_with_adjustments|fail",
  "adjustments_needed": [
    {"prueba": "P3", "parameter": "cognitive_load", "current": 6, "target_max": 5, "suggestion": "string"}
  ]
}
```
