# Remix Report Schemas

## Change Plan

```json
{
  "plan": {
    "base_game": "protocolo-alerta-verde",
    "output_name": "alerta-verde-compact",
    "modifications_requested": ["duración: 30min", "jugadores: 4"],
    "changes": [
      {"action": "keep", "puzzle": "P1", "reason": "Buen playtest score"},
      {"action": "modify", "puzzle": "P2", "change": "Reducir dificultad 5→3", "reason": "Jugadores menos experimentados"},
      {"action": "remove", "puzzle": "P4", "reason": "Peor playtest score"},
      {"action": "keep", "puzzle": "P6", "reason": "Puzzle final, buen score"}
    ],
    "narrative_changes": "Comprimir transiciones. Eliminar subtrama del archivo.",
    "materials_changes": "Menos copias (4 vs 6). Eliminar materiales de P4.",
    "estimated_new_duration": 32,
    "preservation_score": 0.65
  }
}
```

## REMIX-DIFF.json

```json
{
  "base_game": "protocolo-alerta-verde",
  "remix_name": "alerta-verde-compact",
  "summary": {
    "puzzles_kept": 4,
    "puzzles_modified": 2,
    "puzzles_removed": 2,
    "puzzles_added": 0,
    "total_puzzles": {"original": 6, "remix": 4},
    "duration": {"original": 50, "remix": 32},
    "players": {"original": "5-6", "remix": "4"},
    "difficulty_avg": {"original": 4.0, "remix": 3.5}
  },
  "per_puzzle_diff": [
    {"puzzle": "P1", "status": "unchanged"},
    {"puzzle": "P2", "status": "modified", "changes": ["dificultad: 5→3"]},
    {"puzzle": "P4", "status": "removed", "reason": "Worst playtest score"}
  ],
  "narrative_changes": "Removed sub-plot about intercepted messages.",
  "playtest_delta": {
    "predicted_frustration": {"original_avg": 5, "remix_predicted": 2},
    "predicted_fun": {"original_avg": 80, "remix_predicted": 82}
  }
}
```

## Base Game Inventory

```json
{
  "base_game": "protocolo-alerta-verde",
  "metadata": {"nombre": "...", "jugadores": "5-6", "duracion": 50, "dificultad": 4},
  "puzzles": [
    {"id": "P1", "nombre": "...", "mecanica": "prueba-xxx", "dificultad": 3, "duracion_estimada": 8}
  ],
  "playtest_lessons": {
    "best_puzzle": "P3 — diversión 85",
    "worst_puzzle": "P5 — frustración 10, +50% tiempo",
    "mechanics_that_worked": ["prueba-xxx"],
    "mechanics_that_struggled": ["prueba-yyy"]
  },
  "difficulty_curve": [3, 4, 4, 5, 4, 3],
  "total_estimated_time": 45,
  "closures": ["candado_num", "cryptex", "llave", "candado_alpha", "digital", "cryptex"]
}
```
