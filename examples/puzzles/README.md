# Catálogo de Pruebas de Escape Room

Colección de **pruebas reales, diseñadas y probadas** para escape rooms. Este catálogo sirve como base de conocimiento para el pipeline de diseño de escape rooms.

## Estructura

```
puzzles/
├── pruebas/         # Pruebas validadas y listas para implementar (74 archivos)
├── ideas/           # Ideas generadas, pendientes de validación (12 archivos)
├── descartadas/     # Pruebas descartadas — valiosas para entender qué NO funciona (10 archivos)
├── descriptions/    # Descripciones en markdown de pruebas e ideas (44 archivos)
└── archive/         # Resúmenes históricos archivados (19 archivos)
```

## Categorías

### `pruebas/` — Pruebas validadas
Pruebas que han sido revisadas y validadas. Incluyen:
- **`prueba_*.json`** — Pruebas individuales con mecánica, dificultad, pistas y solución
- **`prueba-*.json`** — Variantes originales pre-validación
- **`resumen_*.md`** — Resúmenes diarios de progreso de diseño
- **`review-tracker.json`** — Tracker de estado de revisión de todas las pruebas

### `ideas/` — Ideas pendientes
Ideas generadas automáticamente o manualmente que aún no han sido validadas. Pueden servir como inspiración o punto de partida para nuevos puzzles.

### `descartadas/` — Lo que no funcionó
Pruebas que fueron evaluadas y descartadas por motivos como: demasiada complejidad, frágiles en la práctica, mecánica confusa, o coste desproporcionado. **Estudiar estas pruebas es tan valioso como estudiar las que funcionan** — ayuda a evitar errores repetidos.

### `descriptions/` — Descripciones en Markdown
Versiones narrativas y detalladas de pruebas e ideas en formato markdown.

### `archive/` — Resúmenes archivados
Resúmenes históricos del proceso de diseño organizados por fecha.

## Formato JSON de Prueba

Cada prueba sigue esta estructura:

```json
{
  "id": "identificador_único",
  "nombre": "Nombre descriptivo",
  "descripcion": "Descripción de la mecánica",
  "skill_primario": "habilidad-principal",
  "skills_secundarios": [],
  "dificultad": 1-5,
  "duracion_estimada_minutos": 5,
  "configuracion": { ... },
  "pistas": [
    { "nivel": 1, "texto": "Pista sutil" },
    { "nivel": 2, "texto": "Pista directa" },
    { "nivel": 3, "texto": "Solución prácticamente dada" }
  ],
  "solucion": { ... },
  "adaptaciones": {
    "edad_recomendada": "10+",
    "espacio": "interior_exterior",
    "jugadores_minimos": 2,
    "jugadores_maximos": 6
  },
  "metadata": { ... }
}
```

## Nivel de Dificultad

| Nivel | Descripción |
|-------|-------------|
| 1 | Observación directa |
| 2 | Conexión simple |
| 3 | Razonamiento lógico |
| 4 | Multi-paso o abstracción |
| 5 | Combinación de mecánicas |

## Estadísticas

- **Total de archivos**: 161
- **Pruebas validadas**: ~70
- **Ideas pendientes**: 12
- **Pruebas descartadas**: 10
- **Nivel de dificultad promedio**: 2-3
