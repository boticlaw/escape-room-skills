---
name: pipeline-remix
description: >
  Crea variantes de juegos existentes. Toma un juego real como base y aplica modificaciones
  (jugadores, temática, dificultad, duración, añadir/eliminar puzzles) preservando lo que funciona.
  Shortcut del pipeline completo — NO empieza de cero.
  Trigger: "remix", "variante", "adaptar juego", "modificar juego existente".
---

# Pipeline Remix — Variantes de Juegos Existentes

Crea una variante de un juego existente sin empezar de cero. Lee el juego base, identifica qué conservar y qué modificar, y genera una versión nueva que mantiene los patrones probados.

> ⏱️ Tiempo estimado: ~5-10 min (vs 40-60 min del pipeline completo con dual-LLM, playtest y judgment).

## Cuándo Usar

- "Adaptá Protocolo Alerta Verde para 4 jugadores en vez de 6"
- "Remixá El Legado de la Familia con temática de piratas"
- "Hacé una versión más fácil de Legado Tinta Violeta para niños de 10-12"
- "Agregá 2 puzzles más a Test de Touring"
- "Convertí este hall escape a concurso"
- "Acortá la duración a 30 minutos"

**NO usar cuando:**
- El juego base no existe en `examples/real-games/`
- Los cambios son tan grandes que no queda nada del original (usar pipeline completo)
- No hay playtest data del original para saber qué conservar

## Input

| Parámetro | Requerido | Ejemplo |
|-----------|-----------|---------|
| `base_game` | ✅ | "protocolo-alerta-verde" |
| `modifications` | ✅ | Uno o más de: jugadores, temática, dificultad, duración, tipo, puzzles |
| `output_name` | ✅ | "alerta-verde-compact" |

## Paso 1: Cargar juego base

**⚠️ VALIDACIÓN PREVIA**: Antes de cargar el juego, verificar que existe:

```bash
python3 scripts/search-games.py --game "{base_game}" 
```

Si el script no encuentra el juego → MOSTRAR ERROR y listar juegos disponibles:

```bash
python3 scripts/search-games.py --list-games --pretty
```

El usuario debe elegir un juego de la lista o usar el pipeline completo para crear desde cero.

```bash
# Obtener el juego completo
python3 scripts/search-games.py --game "{base_game}" --pretty
```

Leer TODOS los archivos del juego base:
- `examples/real-games/{base_game}/juego/juego.json` — Metadata y estructura
- `examples/real-games/{base_game}/juego/pruebas/prueba-*.json` — Cada puzzle
- `examples/real-games/{base_game}/juego/pruebas/playtest-report.json` — Playtest real (si existe)
- `examples/real-games/{base_game}/juego/diseño/*.md` — Diseño y narrativa (si existen)
- `examples/real-games/{base_game}/BRIEF.json` — Brief original (si existe)

**Compilar inventario del juego base:**

```json
{
  "base_game": "protocolo-alerta-verde",
  "metadata": { "nombre": "...", "jugadores": "5-6", "duracion": 50, "dificultad": 4 },
  "puzzles": [
    { "id": "P1", "nombre": "...", "mecanica": "prueba-xxx", "dificultad": 3, "duracion_estimada": 8 },
    { "id": "P2", "nombre": "...", "mecanica": "prueba-yyy", "dificultad": 4, "duracion_estimada": 10 }
  ],
  "playtest_lessons": {
    "best_puzzle": "P3 — diversión 85, sin frustración",
    "worst_puzzle": "P5 — frustración 10, +50% tiempo estimado",
    "mechanics_that_worked": ["prueba-xxx", "prueba-zzz"],
    "mechanics_that_struggled": ["prueba-yyy"]
  },
  "narrative_pattern": "Sabotaje ecológico con descubrimiento progresivo",
  "difficulty_curve": [3, 4, 4, 5, 4, 3],
  "total_estimated_time": 45,
  "closures": ["candado_num", "cryptex", "llave", "candado_alpha", "digital", "cryptex"]
}
```

## Paso 2: Analizar modificaciones

Para CADA modificación solicitada, determinar el impacto:

### Cambio de jugadores (ej: 6→4)

| Impacto | Qué cambia |
|---------|-----------|
| Puzzles cooperativos | Si un puzzle requiere 5+ jugadores, adaptar o reemplazar |
| Distribución de roles | Reasignar roles para menos jugadores |
| Materiales | Menos copias de documentos compartidos |
| Puzzles de búsqueda | Reducir área o elementos a buscar |
| Puzzle de comunicación | Puede simplificarse (menos canales) |

**Regla**: Si un puzzle requiere `jugadores_min > nuevos_max`, es incompatible → marcar para reemplazo.

### Cambio de temática (ej: "ecología" → "piratas")

| Impacto | Qué cambia |
|---------|-----------|
| Narrativa completa | Reescribir toda la narrativa |
| Nombres de personajes | Nuevos nombres coherentes con temática |
| Documentos in-game | Reescribir textos, cartas, diarios |
| Elementos temáticos | Cambiar props y materiales |
| Estructura de puzzles | **Conservar** mecánicas, solo cambiar skin |
| Códigos | Pueden mantenerse si no son temáticamente dependientes |

**Regla**: Las MECÁNICAS se conservan. Solo cambia la "piel" narrativa y visual.

### Cambio de dificultad (ej: 4→2)

| Impacto | Qué cambia |
|---------|-----------|
| Curva completa | Reducir cada valor proporcionalmente |
| Ciphers | Simplificar (reemplazar complejos por básicos) |
| Pistas | Nivel 1 más explícito, nivel 2 más directo |
| Tiempos | Reducir complejidad = menos tiempo por puzzle |
| Playtest | Recalibrar perfiles para público más casual |

**Regla**: No bajar dificultad de un puzzle específico > 2 puntos. Si necesita bajar 3+, reemplazar mecánica.

### Cambio de duración (ej: 50min → 30min)

| Impacto | Qué cambia |
|---------|-----------|
| Número de puzzles | Reducir proporcionalmente (6 puzzles 50min → 4 puzzles 30min) |
| Tiempo por puzzle | Recalcular duración estimada |
| Puzzles a eliminar | Quitar los de menor score en playtest PRIMERO |
| Hilo conductor | Adaptar piezas acumulativas a menos puzzles |
| Narrativa | Comprimir transiciones |

**Regla**: Al acortar, siempre eliminar los puzzles con peor playtest score primero. Nunca eliminar el mejor puzzle.

### Cambio de tipo (ej: "hall_escape" → "concurso")

| Impacto | Qué cambia |
|---------|-----------|
| Toda la estructura | Flujo, mecánicas, narrativa |
| Mecánicas principales | Reemplazar por mecánicas del nuevo tipo |
| GM Role | Hall: invisible → Concurso: presentador activo |
| Scoring | Sin scoring → sistema de puntos |
| Solo conserva | Temática general y conocimiento del tema |

**Regla**: Cambio de tipo es el más destructivo. Solo conserva temática y data de research.

### Añadir/eliminar puzzles

| Acción | Reglas |
|--------|--------|
| Añadir | Buscar en `search-games.py --list-mechanics` mecánicas NO usadas en el juego base. Elegir la que mejor complementa la variedad existente. |
| Eliminar | Priorizar eliminación por: (1) peor playtest score, (2) mecánica repetida, (3) mayor frustración. Nunca eliminar el único puzzle cooperativo. |

## Paso 3: Generar plan de cambios

Antes de modificar nada, generar un PLAN:

```json
{
  "plan": {
    "base_game": "protocolo-alerta-verde",
    "output_name": "alerta-verde-compact",
    "modifications_requested": ["duración: 30min", "jugadores: 4"],
    "changes": [
      { "action": "keep", "puzzle": "P1", "reason": "Buen playtest score, mecánica probada" },
      { "action": "modify", "puzzle": "P2", "change": "Reducir dificultad 5→3", "reason": "Jugadores menos experimentados" },
      { "action": "modify", "puzzle": "P3", "change": "Adaptar roles de 5→4 jugadores", "reason": "Menos jugadores" },
      { "action": "remove", "puzzle": "P4", "reason": "Peor playtest score (frustración 15, tiempo +60%)" },
      { "action": "remove", "puzzle": "P5", "reason": "Reducir duración a 30min" },
      { "action": "keep", "puzzle": "P6", "reason": "Puzzle final de recompensa, buen score" }
    ],
    "narrative_changes": "Comprimir transiciones. Eliminar subtrama del archivo de alertas (relacionada con P4 eliminado).",
    "materials_changes": "Menos copias (4 en vez de 6). Eliminar materiales de P4 y P5.",
    "estimated_new_duration": 32,
    "preservation_score": 0.65
  }
}
```

**Regla de preservation_score**: Si < 0.4 (menos del 40% del juego se conserva), advertir al usuario que quizás conviene más usar el pipeline completo desde cero.

## Paso 4: Presentar plan al usuario

Mostrar el plan y pedir confirmación. El usuario puede:
- **Aceptar** → continuar al Paso 5
- **Ajustar** → modificar el plan y re-presentar
- **Cancelar** → abortar

## Paso 5: Ejecutar cambios

Para cada cambio en el plan:

### KEEP — Copiar sin cambios
```
Copiar prueba-*.json original al nuevo directorio.
Copiar narrativa asociada.
```

### MODIFY — Aplicar cambios específicos
```
Leer prueba JSON original.
Modificar campos específicos (dificultad, roles, duración, configuración).
Ajustar pista y solución si cambia la mecánica.
Escribir prueba JSON modificada.
```

### REMOVE — Eliminar
```
No copiar la prueba.
Ajustar flujo (si P3 entregaba llave para P4, redirigir la recompensa).
Ajustar hilo conductor (si acumulaba piezas, recalcular qué piezas siguen).
Ajustar narrativa (eliminar referencias al puzzle eliminado).
```

### ADD — Crear nuevo puzzle
```
Buscar mecánica adecuada con search-games.py.
Diseñar puzzle nuevo que encaje en el flujo.
Insertar en la posición correcta de la secuencia.
```

## Paso 6: Reconstruir archivos globales

Regenerar:
- `juego.json` — metadata actualizada
- `juego/diseño/DISEÑO-JUEGO.md` — diseño completo
- `juego/narrativa/NARRATIVA.md` — narrativa adaptada
- `juego/materiales/lista-materiales.md` — materiales actualizados
- `juego/pruebas/*.json` — puzzles finales

## Paso 7: Verify + Diff

Ejecutar `pipeline-verify` sobre el resultado.

Además, generar un **REMIX-DIFF.json** que compara original vs remix:

```json
{
  "base_game": "protocolo-alerta-verde",
  "remix_name": "alerta-verde-compact",
  "summary": {
    "puzzles_kept": 4,
    "puzzles_modified": 2,
    "puzzles_removed": 2,
    "puzzles_added": 0,
    "total_puzzles": { "original": 6, "remix": 4 },
    "duration": { "original": 50, "remix": 32 },
    "players": { "original": "5-6", "remix": "4" },
    "difficulty_avg": { "original": 4.0, "remix": 3.5 }
  },
  "per_puzzle_diff": [
    { "puzzle": "P1", "status": "unchanged" },
    { "puzzle": "P2", "status": "modified", "changes": ["dificultad: 5→3", "roles: 5→4 jugadores"] },
    { "puzzle": "P4", "status": "removed", "reason": "Worst playtest score" },
    { "puzzle": "P5", "status": "removed", "reason": "Duration reduction" }
  ],
  "narrative_changes": "Removed sub-plot about intercepted messages. Compressed transitions between P3 and P6.",
  "playtest_delta": {
    "predicted_frustration": { "original_avg": 5, "remix_predicted": 2 },
    "predicted_fun": { "original_avg": 80, "remix_predicted": 82 }
  }
}
```

## Paso 8: Playtest + Judgment (opcional)

Si el usuario quiere validación completa, ejecutar `pipeline-playtest` y `pipeline-judgment-day` sobre el remix.

Si no, entregar con el REMIX-DIFF como garantía de calidad.

## Output

```
{output_dir}/{remix_name}/
├── juego.json
├── REMIX-DIFF.json
└── juego/
    ├── narrativa/NARRATIVA.md
    ├── diseño/DISEÑO-JUEGO.md
    ├── materiales/lista-materiales.md
    └── pruebas/*.json
```

## Reglas

1. **Conservar primero**: Siempre priorizar conservar lo que funcionó (playtest score alto).
2. **Eliminar por data**: Eliminar puzzles basándose en playtest data, no en suposiciones.
3. **Variedad de mecánicas**: Si al eliminar/modificar quedan 2+ puzzles de la misma mecánica, marcar como WARNING.
4. **Hilo conductor**: Si el original tiene hilo conductor (piezas acumulativas), adaptar al nuevo número de puzzles.
5. **Preservation score < 0.4**: Advertir al usuario que los cambios son tan grandes que quizás conviene pipeline completo.
6. **No eliminar el único cooperativo**: Si el juego tiene un solo puzzle cooperativo, no eliminarlo.
7. **Narrativa coherente**: Al eliminar puzzles, ajustar la narrativa para que no haya referencias a elementos que ya no existen.
8. **Materiales actualizados**: La lista de materiales debe reflejar solo los puzzles del remix.
9. **Calibrar contra original**: Los playtest scores del remix deben ser ≥ los del original (si son peores, algo anda mal).
10. **Referenciar la fuente**: El juego.json del remix debe incluir `"remix_of": "protocolo-alerta-verde"` y `"remix_changes": [...]`.

## Scripts Usados

| Tool | Uso |
|------|-----|
| `scripts/search-games.py --game` | Cargar juego base completo |
| `scripts/search-games.py --list-mechanics` | Buscar mecánicas para nuevos puzzles |
| `scripts/search-games.py --similar` | Buscar juegos con temática similar para inspiración |
| `pipeline-verify` | Verificar calidad del resultado |
| `pipeline-playtest` | Validación completa (opcional) |
| `pipeline-judgment-day` | Revisión adversarial (opcional)