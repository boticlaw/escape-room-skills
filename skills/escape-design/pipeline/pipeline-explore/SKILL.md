---
name: pipeline-explore
description: >
  FASE 1 del pipeline de generación de escape rooms. El ExploreAgent investiga,
  parsea la petición del usuario, selecciona game type, busca pruebas existentes
  y prepara el BRIEF.json para las fases creativas.
  Trigger: Cuando se inicia la generación de un nuevo escape room.
metadata:
  version: "1.0"
  scope: [escapeitor]
  auto_invoke: "Inicio de generación de escape room"
  pipeline_phase: 1
---

# Pipeline Explore — FASE 1

## Input

Petición del usuario (texto libre) que puede incluir:

| Campo | Obligatorio | Default |
|-------|-------------|---------|
| Temática | ✅ | — |
| Jugadores (min/max) | ✅ | 2-6 |
| Duración (minutos) | ✅ | 60 |
| Dificultad (1-5) | ✅ | 3 |
| Objetivo | ✅ | — |
| Proyecto | ✖ | null |
| Notas adicionales | ✖ | "" |

### Campo: Proyecto

Si el usuario no lo indica, **preguntar**: "¿Este juego pertenece a algún proyecto existente (ej: viernes-de-escape) o es un juego suelto?"

**Si pertenece a un proyecto:**
- Leer `PROJECT-SPECS.md` del proyecto para obtener parámetros por defecto
- Los parámetros del proyecto **sobreescriben** los defaults de la tabla
- El juego se guarda en la carpeta del proyecto

**Proyectos conocidos:**

| Proyecto | Ruta PROJECT-SPECS | Defaults que aplica |
|----------|-------------------|---------------------|
| `viernes-de-escape` | `projects/viernes-de-escape/PROJECT-SPECS.md` | 5-6 jugadores, 45-55 min, dificultad 4-5, 12-18 años, 6 pruebas, 5 salas, ~100-150€ |

**Si es juego suelto:** crear carpeta `projects/{juego-slug}/` y usar los defaults de la tabla.

## Output

`BRIEF.json` guardado en `agents/escapeitor/.pipeline/{juego-id}/BRIEF.json`

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
  "skills_recomendados": ["prueba-xxx", "..."],
  "puzzles_recientes_evitar": ["prueba_xxx (usado en fecha)"],
  "datos_pendientes": [],
  "research_data": {
    "scout": "research-scout.json (ruta relativa)",
    "extractor": "research-extractor.json (ruta relativa)",
    "datos_clave": "Resumen de hallazgos más relevantes para el diseño"
  }
}
```

## Pasos

### 1. Parsear petición del usuario
Extraer del texto libre: temática, jugadores, duración, dificultad, objetivo, notas.
Si faltan datos obligatorios → llenar `datos_pendientes` con preguntas específicas y **parar** (no continuar al paso 2).

### 2. Determinar game type óptimo
Leer los 3 GAMETYPE.md existentes:

- `agents/escapeitor/game-types/game-type-hall-escape/GAMETYPE.md`
- `agents/escapeitor/game-types/game-type-street-escape/GAMETYPE.md`
- `agents/escapeitor/game-types/game-type-investigation/GAMETYPE.md`

Comparar temática, duración y objetivos del usuario con cada game type. Seleccionar el mejor ajuste e incluir justificación en `game_type_justificacion`.

### 3. Buscar en juegos reales existentes ⚠️ OBLIGATORIO

**ESTE PASO ES CRÍTICO. Los juegos reales son la principal fuente de inspiración y referencia.**

Buscar en los 6 juegos reales de `examples/real-games/` usando `scripts/search-games.py`:

```bash
# Buscar por temática similar
python3 scripts/search-games.py --theme "[tema del juego nuevo]" --pretty

# Buscar por mecánicas que encajen con el game type
python3 scripts/search-games.py --mechanic "prueba-XXX" --pretty

# Ver todas las mecánicas usadas (para variedad)
python3 scripts/search-games.py --list-mechanics --pretty

# Ver qué mecánicas se usaron recientemente (para evitar repetir)
python3 scripts/search-games.py --recent-mechanics --pretty

# Buscar juegos similares para inspiración
python3 scripts/search-games.py --similar "[tema]" --pretty

# Listar todos los juegos con resumen
python3 scripts/search-games.py --list-games --pretty
```

**Reglas:**

1. **Inspiración**: Para cada juego encontrado con temática similar, extraer:
   - Qué mecánicas usó y por qué funcionaron
   - Curva de dificultad y cómo se sintieron los jugadores (ver playtest reports)
   - Patrones narrativos que conectaron con el público
   - Errores documentados en playtest reports que este juego nuevo debe evitar

2. **No repetir**: Verificar qué mecánicas se usaron en los 2-3 juegos más recientes. Si `prueba-logica-nonogram` apareció en los últimos 2 juegos, priorizar otras mecánicas.

3. **Calibración**: Comparar la dificultad objetivo del nuevo juego contra los juegos existentes. Si el nuevo juego quiere dificultad 5, buscar en los juegos reales cuáles tenían esa dificultad y qué tan bien funcionó.

4. **`pruebas_existentes_candidatas`**: Para cada juego real encontrado, listar sus puzzles como candidatas de inspiración (no para reutilizar directamente, sino como referencia de diseño).

5. **Regla de variedad**: Si >50% de los juegos existentes usan la misma mecánica como primaria, priorizar mecánicas menos usadas para el nuevo juego.

**Output:** Incluir en el BRIEF.json:
```json
{
  "juegos_referencia": [
    {
      "nombre": "Protocolo Alerta Verde",
      "tematica_similar": true,
      "mecanicas_usadas": ["prueba-xxx", "prueba-yyy"],
      "dificultad": 4,
      "leccion_clave": "El puzzle de radio marina fue el más disfrutado por los jugadores",
      "playtest_score": 80
    }
  ],
  "mecanicas_recientes_evitar": ["prueba-logica-nonogram"],
  "mecanicas_subutilizadas": ["prueba-gps-navegacion", "prueba-emparejamiento-memoria"]
}
```

### 5. Investigación temática automática ⚠️ OBLIGATORIO si el tema lo requiere

Si la temática del juego necesita datos reales (históricos, científicos, geográficos, culturales), usar el search stack (SearXNG + Perplexica). Ver `SEARCH-SETUP.md` para instalación.

#### 5a. Búsqueda de hechos con SearXNG (raw results)

```bash
# General thematic search
python3 services/scripts/searxng-search.py "[temática] escape room historical facts curiosities" 10

# Specific searches for playable elements
python3 services/scripts/searxng-search.py "[temática] puzzles mechanisms interactive elements" 10
python3 services/scripts/searxng-search.py "[temática] timeline key events dates" 5

# Direct API alternative:
curl -s "http://localhost:8888/search?q=QUERY&format=json" | jq '.results[:5] | .[] | {title, url, content}'
```

#### 5b. Síntesis con IA usando Perplexica (AI summary + citations)

```bash
# AI-powered research synthesis
python3 services/scripts/perplexica-search.py "Research [temática] for escape room design. Key historical facts, curiosities, anecdotes, playable elements, dates, locations, characters." webSearch

# Academic/historical focus
python3 services/scripts/perplexica-search.py "[temática] academic research timeline primary sources" academicSearch
```

#### 5c. Extracción de contenido de URLs específicas

```bash
# Extract full text from promising URLs found in step 5a
curl -s "https://r.jina.ai/URL_HERE" | head -200
```

#### 5d. Compilar research_data

Guardar los resultados en `research_data` del BRIEF.json:

```json
{
  "research_data": {
    "searxng_queries": ["query1", "query2"],
    "perplexica_summary": "AI-generated summary with key findings",
    "sources": [
      {"title": "...", "url": "...", "relevant_facts": ["..."]}
    ],
    "playable_elements": ["fact suitable for puzzle", "date for timeline", "location for map"],
    "historical_timeline": ["event1 (year)", "event2 (year)"],
    "characters": ["name - role - why interesting"],
    "datos_clave": "Concise summary of findings most relevant for game design"
  }
}
```

**No requiere research:** temas genéricos (fantasía, sci-fi genérico), o si el usuario ya proporciona todos los datos.

**Si SearXNG/Perplexica no están disponibles:** Usar `webfetch` o búsqueda web directa como fallback. Marcar `research_data.incomplete = true` y listar qué faltaría investigar manualmente.

### 6. Consultar contexto histórico

- Leer `agents/escapeitor/MEMORY.md` → identificar puzzles usados recientemente → añadir a `puzzles_recientes_evitar`
- Consultar `agents/escapeitor/scripts/generate_escape_ideas.py` para ideas recientes
- Leer `agents/escapeitor/.registry/skill-registry.json` para skills recomendados por game type

### 7. Seleccionar research frameworks
Según la temática y game type, seleccionar frameworks relevantes de `agents/escapeitor/research-frameworks/` (ej: `01-game-design.md`, `02-puzzle-theory.md`, etc.)

### 8. Seleccionar skills recomendados
Del skill-registry.json, elegir al menos 3 skills que mejor se adapten al game type y temática. **SOLO** usar IDs de los 20 skills registrados.

### 9. Generar BRIEF.json
Componer el JSON final y guardarlo en la ruta del pipeline.

## Reglas

1. **Datos obligatorios** → Si falta alguno, NO continuar. Devolver BRIEF.json con `datos_pendientes` lleno de preguntas concretas.
2. **Game type** → DEBE ser uno de los 3 existentes: `game-type-hall-escape`, `game-type-street-escape`, `game-type-investigation`.
3. **Skills** → SOLO IDs del skill-registry.json. Mínimo 3 recomendados.
4. **Pruebas candidatas** → Máximo 10, con relevancia clasificada.
5. **No inventar** → Si el usuario no da un dato, preguntar. Nunca asumir valores para campos obligatorios (salvo defaults explícitos en la tabla de Input).
6. **Evitar repetición** → Siempre consultar MEMORY.md y excluir puzzles recientes.

## Scripts & Tools

| Tool | Uso | Disponibilidad |
|------|-----|----------------|
| `services/scripts/searxng-search.py` | Búsqueda raw multi-motor | Requiere SearXNG (localhost:8888) |
| `services/scripts/perplexica-search.py` | Búsqueda AI con citas | Requiere Perplexica (localhost:3100) |
| `curl r.jina.ai/URL` | Extraer contenido de URLs | Sin instalación |
| `webfetch` | Búsqueda web directa | Fallback si no hay search stack |
| `scripts/search-games.py` | Buscar en juegos reales por temática, mecánica, dificultad | Siempre disponible |

## Files Referenciados

| Fichero | Propósito |
|---------|-----------|
| `game-types/*/GAMETYPE.md` | Definiciones de game types |
| `schemas/skill-registry.json` | Registro de skills disponibles |
| `research-frameworks/*.md` | Frameworks de investigación |
| `SEARCH-SETUP.md` | Instalación del search stack (SearXNG + Perplexica) |
