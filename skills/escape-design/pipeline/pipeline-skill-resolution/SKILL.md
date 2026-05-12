---
name: pipeline-skill-resolution
description: "Resuelve qué frameworks y patrones son relevantes para cada fase del pipeline según game_type, phase y contexto. Se ejecuta antes de cada fase."
---

# Skill Resolution Protocol

Ejecutar al **inicio de cada fase** del pipeline. Determina qué research frameworks, patrones y skills son relevantes para la fase actual, evitando cargar todo el conocimiento disponible.

## Input

| Parámetro | Valores posibles | Fuente |
|-----------|-----------------|--------|
| `game_type` | `hall-escape`, `investigation`, `street-escape`, `concurso` | `BRIEF.json` o petición de Daniel |
| `phase` | `conceive`, `design`, `build`, `explore`, `verify`, `judge` | Fase actual del pipeline |
| `theme` | string (ej: `piratas`, `terror`) | `BRIEF.json` |
| `difficulty` | `facil`, `medio`, `dificil` | `BRIEF.json` |

## Registry

### Por game_type → frameworks base

| game_type | frameworks |
|-----------|-----------|
| `hall-escape` | `01-narrative-arc`, `02-puzzle-design`, `06-spatial-puzzles`, `10-escape-room-master` |
| `investigation` | `01-narrative-arc`, `03-clue-chains`, `07-deduction-games`, `10-escape-room-master` |
| `street-escape` | `01-narrative-arc`, `04-team-dynamics`, `08-mobile-puzzles`, `10-escape-room-master` |
| `concurso` | `01-narrative-arc`, `02-puzzle-design`, `05-ux`, `09-estilo-juegos` |

### Por phase → additions

| phase | Adicionales a los frameworks base |
|-------|----------------------------------|
| `explore` | Solo verificación de conectividad (sin frameworks extra) |
| `conceive` | frameworks base + `estilo-juegos` (patrones de estilo) |
| `design` | frameworks base + patrones #1–#10 (de `estilo-juegos`) |
| `build` | frameworks base + patrones #11–#18 (de `estilo-juegos`) |
| `verify` | `pipeline-verify/SKILL.md` (checks internos) |
| `judge` | `pipeline-judge-story/SKILL.md` + `pipeline-judge-logic/SKILL.md` |

## Output

El skill retorna un listado de archivos que el agente de la fase DEBE cargar. Formato:

```
RESOLVED_STANDARDS:
- research-frameworks/01-narrative-arc.md
- research-frameworks/02-puzzle-design.md
- research-frameworks/10-escape-room-master.md
- research-frameworks/09-estilo-juegos.md
```

Si la fase lo requiere, incluir también el SKILL.md correspondiente:
```
RESOLVED_STANDARDS:
- research-frameworks/01-game-design.md
- skills/pipeline-verify/SKILL.md
```

## Reglas

1. **El agente de la fase DEBE cargar solo estos archivos**, no todo el directorio de frameworks
2. Si `game_type` no está definido, usar `hall-escape` como default
3. Si `phase` no está en la tabla, no añadir adicionales (solo frameworks base)
4. Los paths son relativos a la raíz del proyecto
5. Este skill NO genera archivos — solo retorna el listado como output del subagente
6. Ejecución: < 5s (es un lookup, no requiere LLM pesado)

## Ejemplos

### Ejemplo 1: hall-escape, fase design
```
RESOLVED_STANDARDS:
- research-frameworks/01-narrative-arc.md
- research-frameworks/02-puzzle-design.md
- research-frameworks/06-spatial-puzzles.md
- research-frameworks/10-escape-room-master.md
- research-frameworks/09-estilo-juegos.md
```

### Ejemplo 2: investigation, fase verify
```
RESOLVED_STANDARDS:
- research-frameworks/01-narrative-arc.md
- research-frameworks/03-clue-chains.md
- research-frameworks/07-deduction-games.md
- research-frameworks/10-escape-room-master.md
- escape-material/.agents/skills/pipeline-verify/SKILL.md
```

### Ejemplo 3: hall-escape, fase build
```
RESOLVED_STANDARDS:
- research-frameworks/01-narrative-arc.md
- research-frameworks/02-puzzle-design.md
- research-frameworks/06-spatial-puzzles.md
- research-frameworks/10-escape-room-master.md
- research-frameworks/09-estilo-juegos.md

PUZZLE_CATALOG:
- escape-material/pruebas/prueba-laberinto-hilos.json
- escape-material/pruebas/prueba-cifrado-cesar.json
- escape-material/pruebas/prueba_codigo_binario_001.json
```

### Ejemplo 4: street-escape, fase judge
```
RESOLVED_STANDARDS:
- research-frameworks/01-narrative-arc.md
- research-frameworks/04-team-dynamics.md
- research-frameworks/08-mobile-puzzles.md
- research-frameworks/10-escape-room-master.md
- skills/pipeline-judge-story/SKILL.md
- skills/pipeline-judge-logic/SKILL.md
```

## Puzzle Catalog Lookup (phase=build only)

Cuando la fase es `build`, además de los frameworks, buscar puzzles relevantes en el catálogo existente.

### Catálogo
Ubicación: `escape-material/pruebas/`

### Búsqueda
1. Leer `escape-material/pruebas/review-tracker.json`
2. Del campo `ideas`, filtrar entradas con `"estado": "validada"`
3. Cruzar con el diseño del juego según:
   - `skill_primario` / tipo de puzzle que coincida con las necesidades del diseño
   - `dificultad` dentro del rango del difficulty target
   - `coste` compatible con el presupuesto del BRIEF
   - `edad_recomendada` compatible con el público
4. Para cada puzzle encontrado, incluir en RESOLVED_STANDARDS:

```
PUZZLE_CATALOG:
- escape-material/pruebas/prueba-laberinto-hilos.json
- escape-material/pruebas/prueba-cifrado-simbolos-001.json
```

### Comando de búsqueda
```bash
# Filtrar validadas desde review-tracker.json
jq '[.ideas[] | select(.estado == "validada") | .archivo]' review-tracker.json
# Fallback sin jq: grep
grep -o '"archivo": "[^"]*"' review-tracker.json | grep -v archivo_validado
```

### Reglas
- El agente Build DEBE revisar los puzzles del catálogo ANTES de crear nuevos
- Preferir puzzles existentes y adaptarlos al contexto del juego
- Solo crear puzzles nuevos si el catálogo no cubre lo necesario
- Documentar qué puzzles del catálogo se usaron y qué se crearon nuevos

## Integración con Orchestrator

El Orchestrator DEBE ejecutar skill-resolution como **primer paso de cada fase**, antes de preparar el prompt del subagente. Los resolved standards se inyectan en el prompt como contexto.
