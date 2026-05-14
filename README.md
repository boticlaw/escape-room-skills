# Escape Room Skills

> Sistema portable de diseño de escape rooms para agentes de IA — desde el concepto hasta los materiales imprimibles.

## ¿Qué es esto?

Un toolkit completo que le da a cualquier agente de IA el conocimiento y las plantillas para diseñar, construir y testear juegos de escape room profesionales. Cuatro skills componibles cubren todo el pipeline, respaldados por 10 frameworks de investigación, 21 mecánicas de puzzle, 82 pruebas reales testeadas, 6 juegos completos con playtest data, 17 fases de pipeline (incluyendo remix, validación game-type-aware con 18 checks automatizados (10 universales + tipo-específicos para 4 game types), y perfil anti-cheat en playtest), evaluación dual-LLM con detección de providers, y un stack de búsqueda self-hosted para investigación temática automática.

Todos los skills siguen la [Gentle-AI Skill Style Guide](https://github.com/Gentleman-Programming/gentle-ai/blob/main/docs/skill-style-guide.md): instrucciones ejecutables compactas (activación → reglas → decisiones → pasos → output), con detalle en `references/` para no inflar el contexto del LLM.

| Skill | Función |
|---|---|
| **escape-design** | Pipeline maestro — 19 fases resumibles con skills individuales por fase, incluyendo remix |
| **escape-build** | Generación HTML→PDF con identidad visual desde `STYLE.json`, guía de diseño print y 7 categorías de materiales |
| **escape-puzzles** | Catálogo de 21 mecánicas de puzzle con archivos SKILL.md individuales por mecánica |
| **escape-setup** | Configuración del sistema — detección de modelos, validación de providers, jueces dual-LLM |

## Arquitectura

```
escape-room-skills/
├── skills/
│   ├── escape-design/              # Skill maestro — pipeline completo de diseño
│   │   ├── SKILL.md                # Entrada al pipeline (~400 palabras)
│   │   ├── references/             # Detalle movido fuera del skill principal
│   │   └── pipeline/               # 20 skills de fase individuales
│   │       ├── pipeline-orchestrator/  # Orchestrador resumible (~830 palabras)
│   │       │   └── references/        # Design checks, progress schema, ejemplos
│   │       ├── pipeline-explore/       # Brief + investigación temática
│   │       ├── pipeline-conceive/      # Concepto (dual-LLM)
│   │       ├── pipeline-design/        # Puzzles (dual-LLM)
│   │       ├── pipeline-build/         # Construcción del juego
│   │       ├── pipeline-verify/        # 30 checks universales + game-type-specific + playtest calibration
│   │       ├── pipeline-verify-materials/ # ⭐ Verificación de materiales (12 checks)
│   │       ├── pipeline-fix/           # ⭐ Auto-repair desde reports de validación
│   │       ├── pipeline-judgment-day/  # Revisión adversarial dual-LLM
│   │       ├── pipeline-playtest/      # Playtest dual-LLM + calibración real
│   │       ├── pipeline-remix/         # ⭐ Variantes de juegos existentes
│   │       └── ...                     # 9 skills más
│   ├── escape-build/               # Plantillas, CSS, generador de materiales
│   │   ├── SKILL.md                # (~300 palabras) + STYLE.json + print design
│   │   └── references/             # style-schema, css-variables, print-design-guide, templates, checklists
│   ├── escape-puzzles/             # Catálogo de mecánicas
│   │   ├── SKILL.md                # Resumen + matriz de compatibilidad (~420 palabras)
│   │   ├── references/             # Catálogo completo de 21 mecánicas
│   │   └── mechanics/              # 21 mecánicas individuales (~220-350 palabras cada una)
│   │       └── prueba-comunicacion-mensajes/
│   │           ├── SKILL.md        # Instrucciones ejecutables compactas
│   │           └── references/     # Variables, escalado, errores, ejemplos
│   └── escape-setup/               # Configuración + validación de providers
│       ├── SKILL.md                # (~350 palabras)
│       └── references/             # Judge config, verification details
├── schemas/                        # JSON Schema (draft-07) + registro de skills
├── scripts/                        # Scripts de utilidad
│   ├── search-games.py            # ⭐ Búsqueda en juegos + 82 pruebas (13 modos)
│   ├── verify-judges.py           # ⭐ Validación de providers de jueces
│   └── ...                         # build-pdf, materials-generator, etc.
├── templates/
│   ├── css/escape-base.css         # 8 variables CSS + componentes
│   └── html/game-design.html       # Plantilla completa de diseño
├── research-frameworks/            # 10 guías profesionales de diseño
├── game-types/
│   ├── hall-escape/                # Interior 50+ m², 2-6 por equipo, 2-3 equipos
│   ├── street-escape/              # Exterior, GPS/QR, hasta ~100 simultáneos
│   ├── investigation/              # Detective/crimen, equipos 2-6
│   └── concurso/                   # Quiz battle competitivo, equipos 2-3
├── services/                       # Stack de búsqueda (opcional, self-hosted)
├── examples/
│   ├── real-games/                 # 6 juegos reales con playtest data
│   │   ├── el-legado-de-la-familia/
│   │   ├── legado-tinta-violeta/
│   │   ├── protocolo-alerta-verde/
│   │   ├── test-de-touring/
│   │   ├── quiz-battle-palencia/
│   │   └── la-dama-del-salon/
│   ├── puzzles/                    # ⭐ 82 pruebas reales como knowledge base
│   │   ├── pruebas/                # 74 pruebas validadas
│   │   ├── ideas/                  # 12 ideas pendientes
│   │   ├── descartadas/            # 10 pruebas que no funcionaron
│   │   ├── descriptions/           # 44 descripciones narrativas
│   │   └── calendarios/            # Efemérides + calendario semanal
│   └── ...
└── docs/
```

### Pipeline de Diseño (escape-design)

```
RESOLVE → EXPLORE → REGRESSION* → CONCEIVE → DESIGN → NARRATIVE → DIFFICULTY → BUILD → MATERIALS-VERIFY → NARRATIVE-RECHECK → PLAYTEST → VERIFY (30 checks + tipo) → JUDGMENT
                                      *solo si existe baseline
```

O atajo vía **REMIX**:
```
REMIX: juego_base + modificaciones → plan → ejecutar → verify → REMIX-DIFF.json
```

Fase **FIX** (auto-repair) se activa automáticamente cuando cualquier fase de validación (MATERIALS-VERIFY, PLAYTEST, VERIFY, JUDGMENT) produce `fail` o `pass_with_warnings`.

Cada fase es un skill independiente con su propio SKILL.md. El pipeline es **resumible** vía `PROGRESS.json` — si se interrumpe, continúa desde la primera fase incompleta.

### Identidad Visual: STYLE.json

Cada juego tiene un `STYLE.json` que define su identidad visual completa — colores, tipografía, texturas, componentes. Se genera en la fase RESOLVE y se consume en todas las fases de BUILD.

```json
{
  "paleta": { "fondo_principal": "#faf0e6", "texto": "#4a3728", ... },
  "tipografia": { "titulo": "'EB Garamond', Georgia, serif", ... },
  "componentes": { "cartel": { "fondo": "#1a1a1a", "texto": "#f5e6c8" }, ... },
  "texturas": { "papel": "sepia aged", "envejecimiento": true, ... }
}
```

**Flujo:**
1. RESOLVE pregunta: "¿Tenés estilo definido o querés que diseñe uno?"
2. Usuario da referencia → se genera `STYLE.json` desde la descripción
3. Sin preferencia → se auto-genera desde 8 presets por género (Sepia Vintage, Neon Dark, etc.)
4. Todos los materiales HTML/PDF derivan su CSS de `STYLE.json` — cero estilos hardcodeados

Ver `skills/escape-build/references/style-schema.md` para el schema completo.

### Guía de Diseño para Impresión

`references/print-design-guide.md` define principios de diseño específicos para materiales impresos de escape room:

- **8 parejas tipográficas** por género (título + cuerpo) con Google Fonts URLs
- **6 paletas por mood** (papel antiguo, pergamino, noche, bosque, laboratorio, militar)
- **9 layouts por tipo de documento** (cartel, carta, diario, tarjeta, tablero, fragmento, etiqueta, foto, certificado)
- **10 recetas CSS avanzadas** para props realistas: marcos ornamentales, fotos Polaroid, sellos de cera, sellos raspables plateados, líneas de cuaderno, manchas de café, dobleces simulados, cinta adhesiva, firmas elegantes, textura de cartón
- **Escala de espaciado** (xs 1.5mm → 3xl 20mm) y escala tipográfica (8pt → 28pt)
- **Reglas priorizadas**: 6 obligatorias, 6 recomendadas, 5 opcionales

### Tratamientos Visuales — Props, no documentos

`STYLE.json.tratamientos_visuales` define los tratamientos decorativos obligatorios por tipo de material. El builder los aplica automáticamente:

| Material | Tratamientos |
|----------|-------------|
| **Cartel** | Fondo oscuro + borde ornamental ✦ + motivo marioneta + brillo interior |
| **Carta** | Papel sepia + envejecimiento + manchas café + dobleces + firma + drop-cap |
| **Diario** | Líneas de cuaderno + margen rojo + manchas + cinta adhesiva + números de página |
| **Tablero** | Marco ornamental ✦ + título decorativo + filas alternadas |
| **Tarjeta** | Textura cartón + sombra interior + badge numerado + sellos raspables plateados |
| **Fragmento** | Bordes irregulares (clip-path) + envejecimiento pesado + numeración sutil |
| **Foto** | Marco Polaroid + sombra + rotación + fecha + sello raspable + cinta adhesiva |
| **Certificado** | Marco ornamental formal + pergamino + sello de cera + líneas de firma + sello "REGISTRADO" |
| **Etiqueta** | Textura cartón + borde decorativo + sello de cera opcional |

Ver `references/materials-templates.md` para las plantillas completas con estructura HTML + CSS requerido + intensidad de tratamiento.

### Game Guide (Documento de Diseño Estándar)

El output estándar del BUILD es `00-guia-completa-juego.html/pdf` con estructura fija:

1. Cover → Ficha Técnica + Sinopsis → Personajes → Flujo → Hilo Conductor
2. Pruebas (1 página cada una): mecánica detallada + recompensa + solución + materiales
3. Resumen de candados y códigos + Inventario de materiales

**No incluye** presupuesto ni debriefing (van en documentos separados).

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

### Validación Automatizada — validate-game-integrity.py

Script de validación que se ejecuta automáticamente en la fase VERIFY. Detecta el tipo de juego desde `juego.json` y ejecuta los checks correspondientes:

**10 checks universales** (todos los tipos):

| Check | Qué valida |
|-------|-----------|
| 1-2 | Consistencia letras LEGADO / hilo conductor |
| 3-4 | Continuidad y coherencia de cartas de navegación |
| 5a-5d | Códigos candado, etiquetas, curva dificultad, duración |
| 6a-6c | Letras en ubicaciones, referencias, elementos |
| 7 | **Timeline matemático** — detecta contradicciones de fechas/edades entre archivos |
| 8 | **Sincronización personajes** — valida array `personajes` vs texto de pruebas |
| 9 | **Código adivinable** — detecta códigos de candado en textos narrativos |
| 10 | **Anti fuerza bruta** — PINs comunes, secuencias, años visibles |

**Checks por tipo de juego:**

| Tipo | Checks | Qué valida |
|------|--------|-----------|
| **Concurso** | C1-C3 | Preguntas (respuesta única, campos), progresión dificultad, balance minijuegos |
| **Street Escape** | S1-S2 | Coordenadas GPS válidas, distancias caminables (haversine, ≤5 min) |
| **Hall Escape** | H1 | Separación equipos (>4 jugadores por equipo), anti-cheat entre equipos |
| **Investigation** | I1 | Cadena de evidencia, contaminación cruzada, solvabilidad |

```bash
# Ejecutar validación
python3 scripts/validate-game-integrity.py juego/juego.json
```

El pipeline VERIFY tiene 30 checks LLM + los tipo-específicos. El script automatiza 18 de ellos.

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

Cada mecánica tiene su propio SKILL.md compacto con reglas, decisiones y pasos ejecutables. Variables, escalado de dificultad y ejemplos están en `references/` por mecánica.

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
| **PLAYTEST** | Novato Lento, Experimentado Metódico, Experto Crítico | Novato Ansioso, Adolescente Impulsivo, Adulto Pragmático, **El Tramposo** (anti-cheat) |
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

## Juegos Reales + Catálogo de Pruebas como Knowledge Base

Los 6 juegos reales y las 82 pruebas individuales no son solo ejemplos — son una **knowledge base activa** que el pipeline consulta automáticamente:

- **CONCEIVE**: Busca patrones narrativos que funcionaron + pruebas sueltas por mecánica/dificultad
- **DESIGN**: Consulta qué mecánicas tuvieron mejor recepción y calibra tiempos contra datos reales + consulta pruebas testeadas de similar dificultad
- **BUILD**: Verifica estructura de output contra pruebas existentes (patrones probados)
- **PLAYTEST**: Calibra perfiles simulados contra jugadores reales (frustración, pistas, energía, diversión)
- **VERIFY**: Establece umbrales de verificación desde playtest data real
- **DIFFICULTY**: Compara curvas de dificultad contra los 3 juegos completados con playtest
- **REMIX**: Usa playtest scores para decidir qué conservar y qué eliminar al crear variantes

```bash
# Buscar en juegos reales + catálogo de pruebas (unificado)
python3 scripts/search-games.py --theme "ecología" --pretty
python3 scripts/search-games.py --mechanic "prueba-comunicacion" --pretty
python3 scripts/search-games.py --similar "sabotaje naturaleza" --pretty
python3 scripts/search-games.py --list-mechanics --pretty

# Buscar solo en el catálogo de 82 pruebas
python3 scripts/search-games.py --puzzles --difficulty 4-7 --pretty
python3 scripts/search-games.py --puzzles --list-categories --pretty
python3 scripts/search-games.py --puzzles --puzzle "prueba-laberinto-hilos" --pretty

# Incluir pruebas descartadas (qué NO funciona)
python3 scripts/search-games.py --puzzles --include-discarded --mechanic "prueba-mecanismo" --pretty
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

| Tipo | Espacio | Equipos | Duración | GM | Enfoque | Checks específicos |
|------|---------|---------|----------|----|---------|-------------------|
| **Hall Escape** | Interior 50+ m² | 2-6 por equipo, 2-3 equipos | 50-60 min | Invisible | Puzzles físicos + digitales | H1: Separación equipos |
| **Street Escape** | Exterior, calles | Hasta ~100 simultáneos | 60-90 min | Invisible | GPS + exploración real | S1-S2: GPS + distancias |
| **Investigation** | Interior o mixto | 2-6 | 45-60 min | Mínimo | Deducción + evidencia | I1: Cadena evidencia |
| **Concurso** | Interior 30+ m² | 2-3 equipos | 50-60 min | Presentador activo | Trivia + mini-juegos | C1-C3: Preguntas + minijuegos |

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
| **El Legado de la Familia** | Familiar/misterio | v5.1 completo con materiales | 6 pruebas + meta-prueba |
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
| `search-games.py` | Python | Buscar en juegos reales + catálogo de 82 pruebas (13 modos, unificado) |
| `verify-judges.py` | Python | Validar configuración de jueces y providers |
| `build-pdf.mjs` | Node.js | Genera PDF desde HTML vía Puppeteer |
| `build.sh` | Bash | Orchestración completa del build |
| `escape-materials-generator.py` | Python | Genera materiales imprimibles categorizados (7 categorías) |
| `escape-pdf-generator.mjs` | Node.js | PDF avanzado con categorías visuales |
| `init-juego.py` | Python | Inicializa estructura de nuevo juego |
| `validate-design.py` | Python | Valida diseño contra reglas |
| `validate-game-integrity.py` | Python | ⭐ Validación cruzada de integridad: 10 checks universales + tipo-específicos (concurso, street, hall, investigation) |
| `review-design.py` | Python | Revisa y puntúa calidad del diseño |
| `playtest-simulado.py` | Python | Simula 3 perfiles de jugador |
| `playtest-llm.py` | Python | Playtest simulado con LLM |
| `dual-llm-evaluate.py` | Python | Evaluación LLM externa (fallback) |
| `dual-llm-synthesis.py` | Python | Cruce de hallazgos dual-LLM |
| `gamejson-to-markdown.mjs` | Node.js | Convierte JSON de juego a Markdown |
| `validate-schema.sh` | Bash | Valida JSON contra schemas |

## Licencia

[Apache-2.0](LICENSE) — uso libre, se agradece atribución.
