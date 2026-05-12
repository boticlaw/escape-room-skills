# VERIFY-REPORT.json Schema

```json
{
  "id": "verify_{fecha}_{juego-slug}",
  "game_ref": "{juego-slug}",
  "timestamp": "ISO-8601",
  "validate_game_output": "...",
  "verdict": "pass|pass_with_warnings|fail",
  "checks": {
    "schema_compliance": {"status": "pass|fail", "details": "string"},
    "solucionabilidad": {"status": "pass|fail", "details": "string"},
    "dead_ends": {"status": "pass|fail", "details": "string"},
    "curva_dificultad": {"status": "pass|warning|fail", "details": "string"},
    "tiempos": {"status": "pass|warning|fail", "details": "string"},
    "variedad_mecanicas": {"status": "pass|fail", "details": "string"},
    "coherencia_narrativa": {"status": "pass|fail", "details": "string"},
    "pistas_suficientes": {"status": "pass|fail", "details": "string"},
    "materiales_viables": {"status": "pass|warning|fail", "details": "string"},
    "consistencia_codigos": {"status": "pass|fail", "details": "string"},
    "densidad_progreso": {"status": "pass|fail", "details": "string"},
    "solucion_unica": {"status": "pass|fail", "details": "string"},
    "self_contained_logic": {"status": "pass|fail", "details": "string"},
    "cooperacion_real": {"status": "pass|warning", "details": "string"},
    "condiciones_fisicas": {"status": "pass|warning", "details": "string"},
    "empoderamiento_perfiles": {"status": "pass|warning", "details": "string"},
    "completitud_solucion": {"status": "pass|fail", "details": "string"},
    "design_compliance_matrix": {"status": "pass|warning|fail", "details": "string", "matrix": [...]},
    "anti_repeticiones": {"status": "pass|warning|fail", "details": "string"},
    "tres_capas_claridad": {"status": "pass|warning|fail", "details": "string"},
    "redundancia_tolerancia": {"status": "pass|warning|fail", "details": "string"},
    "mapa_emocional": {"status": "pass|warning|fail", "details": "string"},
    "recompensas_intermedias": {"status": "pass|warning|fail", "details": "string"},
    "final_memorable": {"status": "pass|warning|fail", "details": "string"},
    "legibilidad_visual": {"status": "pass|warning|fail", "details": "string"},
    "regla_oro": {"status": "pass|warning|fail", "details": "string"},
    "finalizacion_garantizada": {"status": "pass|warning|fail", "details": "string"}
  },
  "phase_reports": {
    "difficulty_calibration": {"file": "DIFFICULTY-REPORT.json", "verdict": "pass|pass_with_adjustments|fail"},
    "narrative_consistency": {"file": "NARRATIVE-CONSISTENCY-REPORT.json", "verdict": "pass|pass_with_warnings|fail"},
    "playtest": {"file": "PLAYTEST-REPORT.json", "verdict": "pass|pass_with_concerns|fail"},
    "regression": {"file": "REGRESSION-REPORT.json", "verdict": "pass|pass_with_concerns|fail|skip"}
  },
  "warnings": ["string"],
  "issues": ["string"],
  "suggestions": ["string"]
}
```

## Field Descriptions

| Field | Description |
|-------|-------------|
| `id` | `verify_{fecha}_{juego-slug}` |
| `game_ref` | Game ID verified |
| `validate_game_output` | Raw validation script output |
| `verdict` | Global result |
| `checks` | 27 checks with status + details |
| `warnings` | Non-blocking alerts |
| `issues` | Actionable problems (what to fix + how) |
| `suggestions` | Optional improvements |
