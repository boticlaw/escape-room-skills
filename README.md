# Escape Room Skills

> Sistema portable de diseño de escape rooms para agentes de IA — desde el concepto hasta los materiales imprimibles.

## ¿Qué es esto?

Un toolkit completo que le da a cualquier agente de IA el conocimiento y las plantillas para diseñar, construir y testear juegos de escape room profesionales. Cuatro skills componibles cubren todo el pipeline, respaldados por 10 frameworks de investigación, 21 mecánicas de puzzle, 6 juegos reales con playtest data, 16 fases de pipeline (incluyendo remix), evaluación dual-LLM con detección de providers, y un stack de búsqueda self-hosted para investigación temática automática.

| Skill | Función |
|---|---|
| **escape-design** | Pipeline maestro — 16 fases resumibles con skills individuales por fase, incluyendo remix |
| **escape-build** | Generación HTML→PDF con plantillas temáticas y 7 categorías de materiales |
| **escape-puzzles** | Catálogo de 21 mecánicas de puzzle con archivos SKILL.md individuales por mecánica |
| **escape-setup** | Configuración del sistema — detección de modelos, validación de providers, jueces dual-LLM |

## Arquitectura

```
escape-room-skills/
├── skills/
│   ├── escape-design/              # Skill maestro — pipeline completo de diseño
│   │   ├── SKILL.md                # Orchestrador del pipeline
│   │   └── pipeline/               # 16 skills de fase individuales
│   │       ├── pipeline-orchestrator/  # Orchestrador con template PROGRESS
│   │       ├── pipeline-explore/       # Brief + investigación temática + juegos reales
│   │       ├── pipeline-conceive/      # Generación de concepto (dual-LLM)
│   │       ├── pipeline-design/        # Diseño de puzzles (dual-LLM)
│   │       ├── pipeline-build/         # Construcción de archivos del juego
│   │       ├── pipeline-verify/        # Verificación de calidad (27 checks + playtest data)
│   │       ├── pipeline-judgment-day/  # Revisión adversarial dual-LLM
│   │       ├── pipeline-playtest/      # Playtest simulado dual-LLM + calibración real
│   │       ├── pipeline-remix/         # ⭐ Crear variantes de juegos existentes
│   │       ├── pipeline-judge-logic/   # Evaluación de lógica
│   │       ├── pipeline-judge-story/   # Evaluación de narrativa
│   │       ├── pipeline-narrative-consistency/
│   │       ├── pipeline-difficulty-calibration/  # Calibrado contra curvas reales
│   │       ├── pipeline-regression/    # Regresión + cross-game comparison
│   │       ├── pipeline-skill-resolution/
│   │       ├── skill-architect-pruebas-escape/
│   │       └── skill-creador-juegos/
│   ├── escape-build/               # Plantillas, CSS, generador de materiales
│   ├── escape-puzzles/             # Catálogo de mecánicas
│   │   ├── SKILL.md                # Resumen + matriz de compatibilidad
│   │   └── mechanics/              # 21 carpetas individuales de mecánicas
│   └── escape-setup/               # Configuración + validación de providers
├── schemas/                        # JSON Schema (draft-07) + registro de skills
├── scripts/                        # 19 scripts de utilidad
│   ├── build-pdf.mjs, build.sh, escape-materials-generator.py...
│   ├── search-games.py            # ⭐ Búsqueda en juegos reales (9 modos)
│   ├── verify-judges.py           # ⭐ Validación de providers de jueces
│   ├── dual-llm-evaluate.py       # Evaluación LLM externa (fallback)
│   └── dual-llm-synthesis.py      # Cruce de hallazgos dual-LLM
├── templates/
│   ├── css/escape-base.css         # 8 variables CSS + componentes
│   └── html/game-design.html       # Plantilla completa de diseño
├── research-frameworks/            # 10 guías profesionales de diseño
├── game-types/
│   ├── hall-escape/                # Interior 50+ m², equipos 5-10
│   ├── street-escape/              # Exterior, GPS/QR, equipos 2-5
│   ├── investigation/              # Detective/crimen, equipos 2-6
│   └── concurso/                   # Quiz battle competitivo, equipos 2-3, 20-45 min
├── services/                       # Stack de búsqueda (opcional, self-hosted)
│   ├── docker-compose.yml          # SearXNG + Perplexica en Docker
│   └── scripts/                    # Helpers de búsqueda
├── docs/                           # Documentación del sistema
├── SEARCH-SETUP.md                 # Guía completa de instalación del stack
└── examples/
    └── real-games/                 # 6 juegos reales con playtest data
        ├── el-legado-de-la-familia/   # Completo con playtest reports
        ├── legado-tinta-violeta/      # v4.1 completo, escritoras palentinas
        ├── protocolo-alerta-verde/    # Sabotaje ecológico
        ├── test-de-touring/           # IA y sus peligros
        ├── quiz-battle-palencia/      # Quiz battle (Godot+MQTT)
        └── la-dama-del-salon/         # App completa, 13 niveles GPS
```

### Pipeline de Diseño (escape-design)

```
RESOLVE → EXPLORE → REGRESSION* → CONCEIVE → DESIGN → NARRATIVE → DIFFICULTY → BUILD → PLAYTEST → VERIFY → JUDGMENT
                                     *solo si existe baseline
```

O atajo vía **REMIX**:
```
REMIX: juego_base + modificaciones → plan → ejecutar → verify → REMIX-DIFF.json
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

El sistema usa **dos modelos distintos** para evaluar cada juego. Ejecutá `python3 scripts/verify-judges.py --pretty` para verificar la configuración.

### Modo ideal: Providers diferentes ✅

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

### Modo fallback: Mismo provider ⚠️ Enhanced Prompt Divergence

Si ambos jueces usan el mismo provider, el sistema activa automáticamente **Enhanced Prompt Divergence**:

| Aspecto | Juez A (QA Engineer) | Juez B (Player Advocate) |
|---------|---------------------|--------------------------|
| Personalidad | Sistemático, frío, pesimista | Emocional, cálido, optimista |
| Método | Checklist scoring 1-10 por criterio | Narrativa experiencial + red flags |
| Bias | "Asumir que todo falla" | "Asumir que funciona, demostrar que no" |
| Output | JSON estructurado con scores | Narrativa libre + resumen de problemas |

Síntesis ajustada: hallazgos CONFIRMED peso 1.0, hallazgos SUSPECT peso 0.6 (reducido por posible bias del mismo modelo).

### Se aplica en 4 fases:

| Fase | Juez A | Juez B |
|------|--------|--------|
| **CONCEIVE** | Narrativa clásica, 3 actos, progresión lógica | Giros narrativos, atmósferas originales, gancho emocional |
| **DESIGN** | Puzzles lógicos, cadena deductiva, mecánicas probadas | Momentos "wow", interacción física, sorpresa emocional |
| **PLAYTEST** | Novato Lento, Experimentado Metódico, Experto Crítico | Novato Ansioso, Adolescente Impulsivo, Adulto Pragmático |
| **JUDGMENT** | Coherencia, estructura, solvabilidad, consistencia | Inmersión, arco emocional, originalidad, experiencia jugador |

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

**Regla clave**: Los jueces DEBEN usar modelos de providers distintos. Ver `skills/escape-setup/SKILL.md` para configuración completa, rotación de modelos, y fallback para mismo provider.

## Juegos Reales como Knowledge Base

Los 6 juegos reales no son solo ejemplos — son una **knowledge base activa** que el pipeline consulta automáticamente:

- **CONCEIVE**: Busca patrones narrativos que funcionaron (ganchos, arcos emocionales, lecciones de playtest)
- **DESIGN**: Consulta qué mecánicas tuvieron mejor recepción y calibra tiempos contra datos reales
- **PLAYTEST**: Calibra perfiles simulados contra jugadores reales (frustración, pistas, energía, diversión)
- **VERIFY**: Establece umbrales de verificación desde playtest data real
- **DIFFICULTY**: Compara curvas de dificultad contra los 3 juegos completados con playtest
- **REMIX**: Usa playtest scores para decidir qué conservar y qué eliminar al crear variantes

```bash
# Buscar en juegos reales
python3 scripts/search-games.py --theme "ecología" --pretty
python3 scripts/search-games.py --mechanic "prueba-comunicacion" --pretty
python3 scripts/search-games.py --similar "sabotaje naturaleza" --pretty
python3 scripts/search-games.py --list-mechanics --pretty
python3 scripts/search-games.py --recent-mechanics --pretty
```

## Pipeline Remix — Variantes de Juegos

Atajo del pipeline completo: toma un juego existente y aplica modificaciones targeteadas.

```bash
# Ejemplos de uso:
"Adaptá Protocolo Alerta Verde para 4 jugadores en 30 minutos"
"Remixá El Legado de la Familia con temática de piratas"
"Hacé una versión más fácil de Legado Tinta Violeta para niños de 10-12"
```

**Flujo:**

```
1. Carga juego base (search-games.py)
2. Analiza modificaciones (jugadores, temática, dificultad, duración, tipo)
3. Genera plan de cambios con preservation score
   → Si < 40% del original se conserva: advertir que conviene pipeline completo
4. Usuario confirma el plan
5. Ejecuta: KEEP / MODIFY / REMOVE / ADD puzzles
6. Reconstruye archivos + REMIX-DIFF.json
7. Verify (y opcionalmente playtest + judgment)
```

**Reglas clave:**
- Siempre priorizar conservar lo que funcionó (playtest score alto)
- Eliminar puzzles basándose en playtest data, no suposiciones
- Nunca eliminar el único puzzle cooperativo
- `remix_of` y `remix_changes` se registran en el juego.json resultante

## 4 Game Types

| Tipo | Espacio | Equipos | Duración | GM | Enfoque |
|------|---------|---------|----------|----|---------|
| **Hall Escape** | Interior 50+ m² | 5-10 | 60-90 min | Invisible | Puzzles físicos + digitales |
| **Street Escape** | Exterior, calles | 2-5 | 90-120 min | Invisible | GPS + exploración real |
| **Investigation** | Interior o mixto | 2-6 | 45-60 min | Mínimo | Deducción + evidencia |
| **Concurso** | Interior 30+ m² | 2-3 equipos | 20-45 min | Presentador activo | Trivia + mini-juegos físicos |

## Instalación

```bash
git clone https://github.com/boticlaw/escape-room-skills.git
```

### opencode
```bash
cp -r skills/* ~/.config/opencode/skills/

# Configurar jueces dual-LLM (agregar a opencode.json)
# Ver skills/escape-setup/SKILL.md para detalles

# Verificar configuración
python3 scripts/verify-judges.py --pretty
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
3. Configurar los jueces dual-LLM en `opencode.json` → ver `skills/escape-setup/SKILL.md`
4. Verificar: `python3 scripts/verify-judges.py --pretty`
5. Describir el juego que querés: tipo, temática, jugadores, duración
6. El agente sigue el pipeline resumible con tracking via `PROGRESS.json`
7. Si el stack de búsqueda está corriendo, la fase EXPLORE investiga la temática automáticamente
8. Los jueces consultan los 6 juegos reales como knowledge base antes de generar/evaluar
9. Output: `game.json` + archivos `prueba-*.json` individuales
10. Ejecutar `scripts/build-pdf.mjs` para generar documentos imprimibles

### O usar REMIX:
```
"Remixá Protocolo Alerta Verde para 4 jugadores en 30 minutos"
→ Carga juego → plan → confirmar → generar → verify
```

## Juegos Reales Incluidos

### Proyecto: Viernes de Escape

Evento de escape rooms para jóvenes (12-18 años), 5-6 jugadores, 45-55 minutos. Incluye `PROJECT-SPECS.md` con todas las restricciones del proyecto.

| Juego | Temática | Estado | Puzzles |
|-------|----------|--------|---------|
| **El Legado de la Familia** | Familiar/misterio | Completo con playtest | 6 pruebas + meta-prueba |
| **Legado Tinta Violeta** | Escritoras palentinas | v4.1 completo | 7 pruebas + final |
| **Protocolo Alerta Verde** | Medio ambiente/sabotaje ecológico | Completo | 6 pruebas |
| **Test de Touring** | IA y sus peligros | En diseño | 6 pruebas |
| **Quiz Battle Palencia** | Cultura palentina + lógica | MVP funcional (Godot+MQTT) | Quiz + 20 mini-juegos |

### La Dama del Salón

Street escape real de Palencia — app web completa (React + Node.js + PostgreSQL + Stripe) con:
- **13 niveles GPS** con coordenadas reales de Palencia
- **3 tipos de nivel**: diario (narrativa), ubicación (GPS), puzzle (interactivo)
- **Componentes de juego**: GPS checker, memory cards, sliding puzzle, piano, minesweeper, fish sort
- **Desplegado en producción** con Docker + Fly.io

## Stack de Búsqueda (Opcional — Investigación Temática Automática)

```
SearXNG (:8888)  →  Perplexica (:3100)  →  LLM (Gemini/OpenAI/Ollama)
  meta-search         resumen IA+citas       cualquier provider
  70+ motores         con fuentes            local o cloud
```

**Instalación:** `docker compose -f services/docker-compose.yml up -d` — ver [SEARCH-SETUP.md](SEARCH-SETUP.md) para instrucciones completas.

Funciona sin el stack también — el pipeline hace fallback a `webfetch` o investigación manual.

## Scripts

| Script | Lenguaje | Función |
|--------|----------|---------|
| `search-games.py` | Python | Buscar en juegos reales por temática, mecánica, dificultad, similitud (9 modos) |
| `verify-judges.py` | Python | Validar configuración de jueces y providers |
| `build-pdf.mjs` | Node.js | Genera PDF desde HTML vía Puppeteer |
| `build.sh` | Bash | Orchestración completa del build |
| `escape-materials-generator.py` | Python | Genera materiales imprimibles categorizados (7 categorías) |
| `escape-pdf-generator.mjs` | Node.js | PDF avanzado con categorías visuales |
| `init-juego.py` | Python | Inicializa estructura de nuevo juego |
| `validate-design.py` | Python | Valida diseño contra reglas |
| `review-design.py` | Python | Revisa y puntúa calidad del diseño |
| `playtest-simulado.py` | Python | Simula 3 perfiles de jugador |
| `playtest-llm.py` | Python | Playtest simulado con LLM |
| `dual-llm-evaluate.py` | Python | Evaluación LLM externa (fallback) |
| `dual-llm-synthesis.py` | Python | Cruce de hallazgos dual-LLM |
| `gamejson-to-markdown.mjs` | Node.js | Convierte JSON de juego a Markdown |
| `validate-schema.sh` | Bash | Valida JSON contra schemas |

## Licencia

[Apache-2.0](LICENSE) — uso libre, se agradece atribución.
