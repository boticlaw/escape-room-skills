# Build Schemas

## juego.json

```json
{
  "nombre": "string",
  "subtitulo": "string (del CONCEPT.json tagline)",
  "autor": "escape-room-skills",
  "fecha_creacion": "ISO-8601",
  "version": "1.0",
  "color_principal": "#hex",
  "color_secundario": "#hex",
  "tipo": "hall_escape|street_escape|investigation|concurso",
  "jugadores_min": number,
  "jugadores_max": number,
  "duracion_minutos": number,
  "dificultad": number,
  "descripcion": "string (de CONCEPT.json premisa)",
  "tags": []
}
```

## Prueba JSON

```json
{
  "id": "prueba_{mecanica}_{slug}_{001}",
  "nombre": "string",
  "skill_primario": "string",
  "skills_secundarios": [],
  "metadata_contextual": {
    "tipo_juego": "string",
    "adaptaciones": ["string"]
  },
  "descripcion": "string",
  "dificultad": number,
  "duracion_estimada_minutos": number,
  "configuracion": {},
  "materiales": [],
  "pistas": {
    "nivel_1": "string",
    "nivel_2": "string",
    "nivel_3": "string",
    "nivel_4": "string (optional)",
    "nivel_5": "string (optional)"
  },
  "solucion": "string",
  "feedback_exito": "string",
  "feedback_fallo": "string"
}
```

## File Structure

```
{project_root}/
├── escape-material/
│   ├── skills/pipeline-build/SKILL.md
│   ├── scripts/init-juego.py
│   ├── schemas/prueba.schema.json
│   └── pruebas/              ← existing reusable puzzles
├── templates/
│   └── escape-room-template.html
├── scripts/
│   └── generate-pdf-html.py
└── {output_dir}/{juego-id}/  ← generated output
```
