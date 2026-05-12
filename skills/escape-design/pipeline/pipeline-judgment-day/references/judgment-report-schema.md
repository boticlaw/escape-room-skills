# JUDGMENT-REPORT.json Schema

```json
{
  "id": "judgment_YYYY-MM-DD_{juego-slug}",
  "game_ref": "{juego-slug}",
  "timestamp": "ISO-8601",
  "dual_llm": true,
  "iterations": 1,
  "judge_a_model": "opencode/glm-5.1",
  "judge_b_model": "opencode/gpt-5.5",
  "synthesis": {
    "confirmed": [],
    "suspect": [],
    "contradiction": []
  },
  "scores": {
    "judge_a": 7.5,
    "judge_b": 7.4,
    "combined": 7.45
  },
  "verdict": "approved|approved_with_suggestions|rejected",
  "fixes_applied": [],
  "remaining_suspects": []
}
```
