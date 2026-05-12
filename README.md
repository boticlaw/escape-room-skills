# Escape Room Skills

> Sistema portable de diseño de escape rooms para agentes de IA — desde el concepto hasta los materiales imprimibles.

## ¿Qué es esto?

Un toolkit completo que le da a cualquier agente de IA el conocimiento y las plantillas para diseñar, construir y testear juegos de escape room profesionales. Tres skills componibles cubren todo el pipeline, respaldados por 10 frameworks de investigación, 21 mecánicas de puzzle, juegos reales de ejemplo, scripts probados en producción, evaluación dual-LLM y un stack de búsqueda self-hosted para investigación temática automática.

| Skill | Función |
|---|---|
| **escape-design** | Pipeline maestro — proceso de diseño de 12 fases resumible con 15 skills de fase individuales |
| **escape-build** | Generación HTML→PDF con plantillas temáticas y 7 categorías de materiales |
| **escape-puzzles** | Catálogo de 21 mecánicas de puzzle con archivos SKILL.md individuales por mecánica |
| **escape-setup** | Configuración del sistema — detección de modelos, jueces dual-LLM, verificación de entorno |

## Arquitectura

```
escape-room-skills/
├── skills/
│   ├── escape-design/              # Skill maestro — pipeline completo de diseño
│   │   ├── SKILL.md                # Orchestrador del pipeline
│   │   └── pipeline/               # 15 skills de fase individuales
│   │       ├── pipeline-orchestrator/  # Orchestrador con template PROGRESS
│   │       ├── pipeline-explore/       # Brief + investigación temática
│   │       ├── pipeline-conceive/      # Generación de concepto
│   │       ├── pipeline-design/        # Diseño de puzzles
│   │       ├── pipeline-build/         # Construcción de archivos del juego
│   │       ├── pipeline-verify/        # Verificación de calidad (27 checks)
│   │       ├── pipeline-judgment-day/  # Revisión adversarial dual-LLM
│   │       ├── pipeline-playtest/      # Playtest simulado dual-LLM
│   │       ├── pipeline-judge-logic/   # Evaluación de lógica
│   │       ├── pipeline-judge-story/   # Evaluación de narrativa
│   │       ├── pipeline-narrative-consistency/
│   │       ├── pipeline-difficulty-calibration/
│   │       ├── pipeline-regression/
│   │       ├── pipeline-skill-resolution/
│   │       ├── skill-architect-pruebas-escape/
│   │       └── skill-creador-juegos/
│   ├── escape-build/               # Plantillas, CSS, generador de materiales
│   ├── escape-puzzles/             # Catálogo de mecánicas
│   │   ├── SKILL.md                # Resumen + matriz de compatibilidad
│   │   └── mechanics/              # 21 carpetas individuales de mecánicas
│   └── escape-setup/               # Configuración del sistema
├── schemas/                        # JSON Schema (draft-07) + registro de skills
│   ├── game.schema.json
│   ├── prueba.schema.json
│   ├── brief.schema.json
│   ├── concept.schema.json
│   ├── design.schema.json
│   ├── verify-report.schema.json
│   └── skill-registry.json
├── scripts/                        # 16 scripts de utilidad
│   ├── build-pdf.mjs, build.sh, escape-materials-generator.py...
│   ├── dual-llm-evaluate.py        # Evaluación LLM externa (fallback)
│   └── dual-llm-synthesis.py       # Cruce de hallazgos dual-LLM
├── templates/
│   ├── css/escape-base.css         # 8 variables CSS + componentes
│   └── html/game-design.html       # Plantilla completa de diseño
├── research-frameworks/            # 10 guías profesionales de diseño
│   ├── 01-game-design.md           # Framework MDA, tipos de flow
│   ├── 02-puzzle-design.md         # Taxonomía, momentos aha
│   ├── 03-storytelling.md          # Pirámide de Freytag, narrativa ambiental
│   ├── 04-psicologia.md            # Teoría del flow, motivación
│   ├── 05-ux.md                    # Usabilidad, fricción, pistas
│   ├── 06-escenografia.md          # Atmósfera, diseño sensorial
│   ├── 07-tecnologia.md            # Sensores, AR, tablets
│   ├── 08-testing.md               # Metodología de playtest, métricas
│   ├── 09-estilo-juegos.md         # Lecciones de juegos reales
│   └── 10-escape-room-master.md    # Tratado master + checklists
├── game-types/
│   ├── hall-escape/                # Interior 50+ m², equipos 5-10
│   ├── street-escape/              # Exterior, GPS/QR, equipos 2-5
│   └── investigation/              # Detective/crimen, equipos 2-6
├── services/                       # Stack de búsqueda (opcional, self-hosted)
│   ├── docker-compose.yml          # SearXNG + Perplexica en Docker
│   ├── searxng/settings.yml        # Config SearXNG (JSON habilitado)
│   ├── perplexica/config.toml      # Config Perplexica (Gemini API)
│   └── scripts/
│       ├── searxng-search.py       # Helper de consultas SearXNG
│       └── perplexica-search.py    # Helper de búsqueda IA Perplexica
├── docs/                           # Documentación del sistema
│   ├── SOUL.md, pipeline-details.md, data-model.md...
├── SEARCH-SETUP.md                 # Guía completa de instalación del stack
└── examples/
    ├── example-game.json, example-prueba.json
    ├── real-games/                 # 6 juegos reales completos
    │   ├── biblioteca-maldita-v2/  # Escape temático de biblioteca (v2)
    │   ├── biblioteca-maldita-v3/  # Versión refinada con mejoras
    │   ├── juego-de-prueba/, juego-de-prueba-con-cita/, test-final/
    │   └── la-dama-del-salon/      # Street escape en producción (13 niveles)
    ├── pipeline-artifacts/         # Artifacts de ejecuciones reales del pipeline
    └── escape-material-pruebas/    # 30+ ejemplos de pruebas reales en Markdown
```

### Pipeline de Diseño (escape-design)

```
RESOLVE → EXPLORE → REGRESSION* → CONCEIVE → DESIGN → NARRATIVE → DIFFICULTY → BUILD → PLAYTEST → VERIFY → JUDGMENT
                                    *solo si existe baseline
```

Cada fase es un skill independiente con su propio SKILL.md. El pipeline es **resumible** vía `PROGRESS.json` — si se interrumpe, continúa desde la primera fase incompleta.

### Reglas de Diseño Core

| Regla | Significado |
|---|---|
| **ZERO GM** | Los juegos deben funcionar sin un game master humano organizando, explicando o enforcementando |
| **ANTI-CHEAT** | Si los jugadores PUEDEN hacer trampa, la HARÁN — diseñar para que sea imposible o inútil |
| **SELF-SERVICE** | Todo lo que los jugadores necesitan se autodescubren en el espacio de juego |
| **MECANISMOS REALES** | Cada mecanismo físico debe ser construible con ~120€ de presupuesto y materiales accesibles |
| **SIN DEPENDENCIAS CRUZADAS** | Cada puzzle es autocontenido; no viaja data entre puzzles (solo llaves y herramientas) |
| **FÍSICO > DIGITAL** | Priorizar interacción tangible; lo digital es soporte, nunca protagonista |
| **DOBLE DESCUBRIMIENTO** | Cada puzzle tiene 2+ capas de "¡aha!" — resolver + revelar |

### 21 Mecánicas de Puzzle

| Categoría | Mecánicas |
|-----------|-----------|
| **Lógica** | Nonogram, Posiciones, Secuencial |
| **Emparejamiento** | Memoria, Texto |
| **Física** | Mecanismo, Panel Eléctrico, Diana, Ensamblaje |
| **Digital** | Tablet Cooperativo, Panel de Control, Arcade, Laberinto |
| **Cooperativo** | Comunicación/Mensajes |
| **Búsqueda/Ubicación** | Búsqueda Objetos, Exploración Visual, QR, GPS, Acróstico, Adivinanza |
| **Investigación** | Investigación de Texto |

Cada mecánica tiene su propio SKILL.md con: variables de diseño, errores comunes, escalado de dificultad, adaptaciones por tipo de juego y ejemplos.

## Evaluación Dual-LLM

El sistema usa **dos modelos GENUINAMENTE distintos** para evaluar cada juego — lo que elimina sesgos individuales de un solo modelo:

```
┌─────────────────────┐     ┌──────────────────────────┐
│  Juez A              │     │  Juez B                  │
│  (opencode agent)    │     │  (opencode agent)        │
│  MODELO DISTINTO     │     │  MODELO DISTINTO         │
│                      │     │                          │
│  Perfil analítico:   │     │  Perfil experiencial:    │
│  - Coherencia        │     │  - Inmersión             │
│  - Estructura        │     │  - Arco emocional        │
│  - Solvabilidad      │     │  - Originalidad          │
│  - Consistencia      │     │  - Experiencia jugador   │
└────────┬─────────────┘     └──────────┬───────────────┘
         │                              │
         └──────────┬───────────────────┘
                    ▼
         Síntesis: CONFIRMED / SUSPECT / CONTRADICTION
```

Se aplica en dos fases:

**Playtest** — Simula 6 perfiles de jugador (3 por juez):
- Juez A: Novato Lento, Experimentado Metódico, Experto Crítico
- Juez B: Novato Ansioso, Adolescente Impulsivo, Adulto Pragmático

**Judgment Day** — Revisión adversarial con iteración:
- Cruza hallazgos de ambos jueces
- Auto-fixea issues CONFIRMED (ambos coinciden)
- Re-evalúa y itera hasta convergencia (máx. 2 iteraciones)

**Configuración en opencode** — Dos agentes en `opencode.json`:

```json
{
  "agent": {
    "escape-judge-a": {
      "model": "opencode/glm-5.1",
      "mode": "subagent",
      "prompt": "Juez A — evaluador ANALÍTICO..."
    },
    "escape-judge-b": {
      "model": "opencode/gpt-5.5",
      "mode": "subagent",
      "prompt": "Juez B — evaluador CREATIVO..."
    }
  }
}
```

**Regla clave**: Los jueces DEBEN usar modelos de PROVEEDORES DISTINTOS. Ver `skills/escape-setup/SKILL.md` para configuración completa.

## Instalación

```bash
git clone https://github.com/boticlaw/escape-room-skills.git
```

### opencode
```bash
cp -r skills/* ~/.config/opencode/skills/

# Configurar jueces dual-LLM (agregar a opencode.json)
# Ver skills/escape-setup/SKILL.md para detalles
```

### Claude Code
```bash
cp -r skills/* .claude/skills/
```

### Agente LLM genérico
Copiar el contenido de cada `skills/*/SKILL.md` en el contexto de instrucciones del agente. Ver [INSTALL.md](INSTALL.md) para detalles.

## Quick Start

1. Instalar los skills en tu agente
2. *(Opcional)* Levantar el stack de búsqueda: `docker compose -f services/docker-compose.yml up -d` → ver [SEARCH-SETUP.md](SEARCH-SETUP.md)
3. *(Opcional)* Configurar los jueces dual-LLM en `opencode.json` → ver `skills/escape-setup/SKILL.md`
4. Describir el juego que querés: tipo, temática, jugadores, duración
5. El agente sigue el pipeline resumible con tracking via `PROGRESS.json`
6. Si el stack de búsqueda está corriendo, la fase EXPLORE investiga la temática automáticamente vía SearXNG + Perplexica
7. Output: `game.json` + archivos `prueba-*.json` individuales
8. Ejecutar `scripts/build-pdf.mjs` para generar documentos de diseño imprimibles
9. Ejecutar `scripts/escape-materials-generator.py` para generar materiales categorizados

## Juegos Reales de Ejemplo

El directorio `examples/real-games/` contiene 6 juegos completos:

| Juego | Tipo | Puzzles | Notas |
|-------|------|---------|-------|
| **Biblioteca Maldita v2** | Hall Escape | 6 | Temática de biblioteca, testeado por pipeline |
| **Biblioteca Maldita v3** | Hall Escape | 5 | Versión refinada con mejoras |
| **Juego de Prueba** | Test | Básico | Prototipo inicial |
| **Juego de Prueba con Cita** | Test | Con cita | Variante con sistema de citas |
| **Test Final** | Test | Completo | Juego de validación final |
| **La Dama del Salón** | Street Escape | 13 niveles | **En producción** — street escape de Palencia |

La Dama del Salón incluye: análisis completo, 12 mecánicas catalogadas, plantillas narrativas, patrones del data model y 13 niveles con GPS.

## Stack de Búsqueda (Opcional — Investigación Temática Automática)

El pipeline puede investigar automáticamente las temáticas usando un stack self-hosted:

```
SearXNG (:8888)  →  Perplexica (:3100)  →  LLM (Gemini/OpenAI/Ollama)
  meta-search         resumen IA+citas       cualquier provider
  70+ motores         con fuentes            local o cloud
```

Cuando está corriendo, la fase EXPLORE automáticamente:
1. Busca datos históricos, curiosidades, elementos jugables vía SearXNG
2. Obtiene investigación resumida con citas vía Perplexica
3. Extrae contenido clave de URLs prometedoras vía Jina Reader
4. Compila todo en el campo `research_data` del BRIEF

**Instalación:** `docker compose -f services/docker-compose.yml up -d` — ver [SEARCH-SETUP.md](SEARCH-SETUP.md) para instrucciones completas.

Funciona sin el stack también — el pipeline hace fallback a `webfetch` o investigación manual.

## Scripts

| Script | Lenguaje | Función |
|--------|----------|---------|
| `build-pdf.mjs` | Node.js | Genera PDF desde HTML vía Puppeteer |
| `build.sh` | Bash | Orchestración completa del build |
| `escape-materials-generator.py` | Python | Genera materiales imprimibles categorizados (7 categorías) |
| `escape-pdf-generator.mjs` | Node.js | PDF avanzado con categorías visuales |
| `escape-compact-pdf.py` | Python | Generación compacta de PDF |
| `init-juego.py` | Python | Inicializa estructura de nuevo juego |
| `validate-design.py` | Python | Valida diseño contra reglas |
| `review-design.py` | Python | Revisa y puntúa calidad del diseño |
| `playtest-simulado.py` | Python | Simula 3 perfiles de jugador |
| `playtest-llm.py` | Python | Playtest simulado con LLM |
| `dual-llm-evaluate.py` | Python | Evaluación LLM externa (fallback si no hay opencode) |
| `dual-llm-synthesis.py` | Python | Cruce de hallazgos dual-LLM |
| `gamejson-to-markdown.mjs` | Node.js | Convierte JSON de juego a Markdown |
| `escape-json2md.sh` | Bash | Conversión batch JSON a Markdown |
| `validate-schema.sh` | Bash | Valida JSON contra schemas |

## Licencia

[Apache-2.0](LICENSE) — uso libre, se agradece atribución.
