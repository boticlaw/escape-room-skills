# BRIEF.json Schema

```json
{
  "id": "brief_YYYY-MM-DD_tematica-slug",
  "timestamp": "ISO-8601",
  "request": {
    "tematica": "string",
    "duracion_minutos": 60,
    "jugadores_min": 2,
    "jugadores_max": 6,
    "dificultad": 3,
    "objetivo": "string",
    "notas_usuario": "string"
  },
  "game_type_recomendado": "game-type-xxx",
  "game_type_justificacion": "string",
  "proyecto": "viernes-de-escape|null",
  "output_dir": "projects/viernes-de-escape/{juego-slug}/",
  "research_frameworks_relevantes": ["01-game-design.md"],
  "pruebas_existentes_candidatas": [
    {"id": "prueba_xxx_001", "relevancia": "alta|media|baja", "skill": "prueba-xxx"}
  ],
  "skills_recomendados": ["prueba-xxx"],
  "puzzles_recientes_evitar": ["prueba_xxx (usado en fecha)"],
  "datos_pendientes": [],
  "research_data": {
    "scout": "research-scout.json",
    "extractor": "research-extractor.json",
    "datos_clave": "Summary of findings"
  }
}
```

## Additional Fields from Game Search

```json
{
  "juegos_referencia": [
    {
      "nombre": "Protocolo Alerta Verde",
      "tematica_similar": true,
      "mecanicas_usadas": ["prueba-xxx", "prueba-yyy"],
      "dificultad": 4,
      "leccion_clave": "El puzzle de radio marina fue el más disfrutado",
      "playtest_score": 80
    }
  ],
  "mecanicas_recientes_evitar": ["prueba-logica-nonogram"],
  "mecanicas_subutilizadas": ["prueba-gps-navegacion"]
}
```
