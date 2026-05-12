# Data Model

## game.json

Metadata global (nombre, tipo, versión, meta, secciones) + referencias a pruebas (`id` + `archivo`). **NUNCA** repite datos de prueba.

Schemas: `schemas/game.schema.json`, `schemas/prueba.schema.json`

## Estructura de prueba JSON (todos los campos obligatorios)

```json
{
  "id": "juego_001_nombre",
  "nombre": "Nombre Prueba",
  "descripcion": "Texto completo para el GM",
  "skill_primario": "prueba-logica-posiciones",
  "skills_secundarios": [],
  "dificultad": 5,
  "duracion_estimada_minutos": 10,
  "configuracion": {
    "mecanica_principal": "...",
    "mecanismo_barrera": "...",
    "elementos_necesarios": [],
    "distribucion_roles": {}
  },
  "pistas": [{"nivel": 1, "tipo": "sutil", "texto": "..."}],
  "solucion": {
    "descripcion": "...",
    "verificacion": "...",
    "pasos_detallados": [],
    "recompensa": {"letra": "A", "carta": "...", "siguiente_espacio": "..."}
  },
  "materiales": {"impresion": [], "mobiliario": [], "extras": []},
  "documentos_in_game": [{"titulo": "...", "texto": "...", "cantidad": 1, "gm_notas": "..."}],
  "barrera_fisica": {"tipo": "Candado", "ubicacion": "...", "codigo": "...", "origen_codigo": "...", "montaje_minutos": 5},
  "hilo_conductor": {"letra": "A", "significado": "...", "posicion": 1},
  "control_movimiento": {"problema_potencial": "...", "solucion_implementada": "..."},
  "metadata": {}
}
```

Fuente de verdad detallada: `projects/{proyecto}/juego/pruebas/prueba-*.json`
