# NARRATIVE-CONSISTENCY-REPORT.json Schema

```json
{
  "id": "narrative_2026-04-07_{juego-slug}",
  "game_ref": "{juego-slug}",
  "timestamp": "ISO-8601",
  "entities": {
    "characters": [
      {"name": "Pardo", "role": "villano", "appearances": ["P1", "P2", "P6"], "consistent": true}
    ],
    "locations": [
      {"name": "Laboratorio", "descriptions": ["P1", "P3"], "consistent": true}
    ],
    "objects": [
      {"name": "Diario", "appearances": ["P1", "P4"], "consistent": true}
    ],
    "events": [
      {"description": "Incendio del laboratorio", "references": ["P2", "P5"], "consistent": true}
    ]
  },
  "inconsistencies": [
    {
      "type": "name_mismatch|timeline_error|logic_gap|tone_shift|unresolved_promise|object_disappearance|anachronism|relationship_error",
      "location": "P4",
      "description": "string",
      "severity": "critical|major|minor",
      "suggestion": "string"
    }
  ],
  "unresolved_promises": [
    {
      "promise": "string",
      "location_planted": "P2",
      "resolved": false,
      "intentional": false,
      "suggestion": "string"
    }
  ],
  "tone_analysis": {
    "overall_tone": "thriller",
    "shifts_detected": [],
    "consistent": true
  },
  "verdict": "pass|pass_with_warnings|fail"
}
```

## Inconsistency Types

| Type | Description |
|------|-------------|
| `name_mismatch` | Same entity, different name |
| `timeline_error` | Dates/times contradict |
| `logic_gap` | Action without cause or effect |
| `tone_shift` | Unjustified tone change |
| `unresolved_promise` | Mystery posed but never addressed |
| `object_disappearance` | Object appears then vanishes without explanation |
| `anachronism` | Technology/element out of time period |
| `relationship_error` | Character relationships contradict |
