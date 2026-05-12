---
name: pipeline-design
description: >
  FASE 3 del pipeline — Dual-LLM: Dos jueces con modelos distintos diseñan pruebas
  desde perspectivas complementarias. El agente sintetiza las mejores pruebas de cada
  propuesta en un DESIGN.json final.
---

# Pipeline Design (Dual-LLM)

FASE 3 del pipeline. Dos jueces con modelos distintos diseñan el set completo de pruebas desde perspectivas complementarias. El agente sintetiza lo mejor de cada propuesta.

## Input

| Archivo | Fuente | Qué aporta |
|---------|--------|------------|
| `CONCEPT.json` | FASE 2 | Narrativa, temas, tono, pistas narrativas, pruebas candidatas |
| `BRIEF.json` | FASE 1 | Duración total, público objetivo, número jugadores, restricciones |
| `skill-registry.json` | `.registry/` | 20 skills disponibles con sus IDs y categorías |

## Output

| Producto | Ruta |
|----------|------|
| Diseño Juez A | `{output_dir}/designs/DESIGN-A.json` |
| Diseño Juez B | `{output_dir}/designs/DESIGN-B.json` |
| Diseño final sintetizado | `{output_dir}/DESIGN.json` |

## Los Dos Jueces

| Agente | Config | Enfoque |
|--------|--------|---------|
| `escape-judge-a` | `opencode.json` model | **Puzzles lógicos** — cadena deductiva, progresión equilibrada, mecánicas probadas |
| `escape-judge-b` | `opencode.json` model (DIFFERENT provider) | **Puzzles experienciales** — momentos "wow", interacción física, sorpresa emocional |

**Ventaja dual-LLM**: Un modelo optimiza la solidez lógica y el balance de dificultad; el otro prioriza la experiencia memorable y los momentos de sorpresa. La síntesis produce un diseño que es a la vez sólido y emocionante.

### Si ambos jueces usan el mismo provider

Si `scripts/verify-judges.py` reporta `same_provider: true`, los jueces deben MAXIMIZAR la divergencia de enfoque:

| Aspecto | Juez A | Juez B |
|---------|--------|--------|
| Personalidad | Ingeniero QA — sistemático, frío, busca fallos | Jugador apasionado — emocional, busca magia |
| Método | Checklist de criterios, scoring 1-10 por item | Narrativa experiencial + red flags específicas |
| Bias | Pesimista (asumir problemas) | Optimista (asumir que funciona, demostrar que no) |
| Output | JSON estructurado con scores | Narrativa libre + resumen de problemas |

### Paso 0a: Consultar catálogo de pruebas para diseño ⚠️ OBLIGATORIO

Antes de diseñar pruebas, consultar el catálogo de 82+ pruebas individuales (testeadas e ideas) para basar las decisiones en data concreta de mecánicas y dificultad:

```bash
# Buscar pruebas por mecánica específica (ver qué ya existe)
python3 scripts/search-games.py --puzzles --mechanic "{skill_deseado}" --pretty

# Ver pruebas en el rango de dificultad del diseño actual
python3 scripts/search-games.py --puzzles --difficulty {dificultad_min}-{dificultad_max} --pretty

# Ver categorías disponibles (para variedad de mecánicas)
python3 scripts/search-games.py --puzzles --list-categories --pretty

# Buscar pruebas similares temáticamente
python3 scripts/search-games.py --puzzles --similar "{tema}" --pretty

# Ver detalle completo de una prueba candidata
python3 scripts/search-games.py --puzzles --puzzle "{puzzle_id}" --pretty

# Incluir descartadas para ver qué NO funcionó
python3 scripts/search-games.py --puzzles --include-discarded --mechanic "{skill}" --pretty
```

**Extraer del catálogo de pruebas:**
- **Pruebas existentes por mecánica**: Cuántas pruebas hay de cada skill (priorizar las ya testeadas)
- **Duración real**: Tiempos estimados por tipo de prueba (calibrar tiempos del diseño)
- **Dificultad real**: Niveles de dificultad observados por mecánica (validar curva)
- **Configuración concreta**: Estructura, materiales, pistas de pruebas reales (modelo para pruebas nuevas)
- **Descartadas**: Qué mecánicas/probaditas fallaron y por qué (evitar repetir errores)

### Paso 0b: Consultar juegos reales para diseño de pruebas ⚠️ OBLIGATORIO

Después del catálogo de pruebas, consultar los juegos reales para basar las decisiones en data probada de juegos completos:

```bash
# Buscar mecánicas que funcionaron en juegos similares (unificado: juegos + catálogo)
python3 scripts/search-games.py --similar "{tema}" --pretty

# Ver qué mecánicas se usaron recientemente (para variedad)
python3 scripts/search-games.py --recent-mechanics --pretty

# Ver mecánicas disponibles (unificado: juegos + catálogo)
python3 scripts/search-games.py --list-mechanics --pretty

# Ver detalle de un juego específico con sus playtests
python3 scripts/search-games.py --game "el-legado-de-la-familia" --pretty
```

**Extraer de cada juego referenciado:**
- **Mecánicas principales**: Qué skills usó como primarios y cómo se combinaron
- **Curva de dificultad real**: Dificultad por prueba y si los playtests confirmaron la curva
- **Tiempos reales**: Duración estimada vs real de cada prueba (si hay playtest data)
- **Cierres**: Tipo de cierre por prueba (candado, cryptex, llave, digital) y variedad
- **Lecciones del playtest**: Qué pruebas fueron más rápidas/lentas de lo esperado, dónde piden más pistas

**Inyectar en los prompts de ambos jueces** como contexto:
```
## Data real de juegos existentes (para calibración)

{output del search-games.py}

Reglas:
- Calibrar tiempos de cada prueba contra los tiempos reales de juegos similares
- Evitar mecánicas que los playtests muestran como frustrantes sin buena razón
- Priorizar mecánicas con mejor recepción (mayor diversión, menor frustración)
- Mantener variedad de cierres: no más de 2 del mismo tipo (como en los juegos reales)
- La dificultad máxima del nuevo juego no debe exceder la del juego real más difícil del mismo tipo
```

## Paso 1: Launch Paralelo

Lanzar ambos jueces como **agentes independientes** vía `delegate()`:

```
delegate(agent="escape-judge-a", prompt="Lee skills/pipeline-design/SKILL.md para entender el formato de output y las REGLAS CRÍTICAS.
   Lee BRIEF.json en {output_dir}/BRIEF.json.
   Lee CONCEPT.json en {output_dir}/CONCEPT.json.
   Lee skill-registry.json.
   Lee los research frameworks: 01-game-design.md, 02-puzzle-design.md, 04-psicologia.md, 05-ux.md, 09-estilo-juegos.md.
   
   Tu ENFOQUE: puzzles lógicos, cadena deductiva, progresión equilibrada.
   - Cada prueba debe tener una cadena de deducción clara (pista → inferencia → acción)
   - Progresión de dificultad estricta y predecible
   - Mecánicas probadas y fiables (priorizar EXISTENTES del registry)
   - Balance matemático de tiempos realista
   - Cierres variados pero funcionales
   - Misterio secundario que refuerza la lógica (ej: sílabas que forman nombre)
   
   Genera un DESIGN.json completo siguiendo la estructura del skill.
   Escríbelo en {output_dir}/designs/DESIGN-A.json"
)

delegate(agent="escape-judge-b", prompt="Lee skills/pipeline-design/SKILL.md para entender el formato de output y las REGLAS CRÍTICAS.
   Lee BRIEF.json en {output_dir}/BRIEF.json.
   Lee CONCEPT.json in {output_dir}/CONCEPT.json.
   Lee skill-registry.json.
   Lee los research frameworks: 01-game-design.md, 02-puzzle-design.md, 04-psicologia.md, 05-ux.md, 09-estilo-juegos.md.
   
   Tu ENFOQUE: puzzles experienciales, momentos 'wow', interacción física.
   - Cada prueba debe crear un momento memorable (descubrimiento, sorpresa, emoción)
   - Interacción física y manipulación como protagonistas
   - Momentos 'aha' que generen exclamaciones
   - Doble descubrimiento como mecánica estrella
   - Atmósfera e inmersión integradas en las pruebas
   - Contenedores narrativos creativos (no solo cajas con candado)
   - Momentos de energía en inicio y final
   
   Genera un DESIGN.json completo siguiendo la estructura del skill.
   Escríbelo en {output_dir}/designs/DESIGN-B.json"
)
```

Ambos en paralelo. Esperar AMBOS antes de continuar a Paso 2.

**REGLA CRÍTICA**: Cada juez NO ve el output del otro. Diseño 100% independiente.

**Los jueces son agentes configurados en opencode.json** — cada agente ya tiene su LLM asignado.

## Paso 2: Synthesis (el agente orchestrador orquesta)

El agente lee `DESIGN-A.json` y `DESIGN-B.json` y sintetiza directamente.

### Clasificación de Pruebas

Al comparar las propuestas, clasificar cada prueba:

| Clasificación | Definición | Acción |
|---------------|-----------|--------|
| **CONFIRMED** | Ambos jueces proponen la misma (o equivalente) prueba | Alta calidad → incluir directamente |
| **SUSPECT-A** | Solo Juez A la propone (enfoque lógico) | Evaluar si merece la pena por solidez |
| **SUSPECT-B** | Solo Juez B la propone (enfoque experiencial) | Evaluar si merece la pena por impacto |
| **CONTRADICTION** | Ambos abordan el mismo slot narrativo pero con mecánicas distintas | El agente decide cuál (o híbrida) |

### Prompt Template para Synthesis

```
Eres un lead game designer de escape rooms. Tienes dos propuestas de diseño de jueces distintos:

## DISEÑO A (Juez A — Lógico)
{DESIGN-A.json completo}

## DISEÑO B (Juez B — Experiencial)
{DESIGN-B.json completo}

## CONCEPT ORIGINAL
{CONCEPT.json completo}

## BRIEF
{BRIEF.json completo}

## TAREA
Sintetiza las mejores pruebas de cada propuesta en un único DESIGN.json final:

1. **Comparar pruebas posición por posición** (slot narrativo: intro, desarrollo, clímax, final)
2. **Clasificar cada prueba**:
   - CONFIRMED: ambos proponen lo mismo (o equivalente) → incluir directamente
   - SUSPECT-A: solo el lógico → evaluar solidez
   - SUSPECT-B: solo el creativo → evaluar impacto
   - CONTRADICTION: mismo slot, mecánicas distintas → elegir la mejor o hibridar
3. **Seleccionar el set final**:
   - Mantener al menos 1 prueba Confirmed de cada tipo si las hay
   - Balancear: ~60% lógicas (de A), ~40% experienciales (de B)
   - Si A tiene mejor flujo → usar flujo de A
   - Si B tiene mejores momentos de energía → usar momentos de B
   - Curva de dificultad: priorizar la progresión de A (más predecible)
4. **Mantener todas las REGLAS CRÍTICAS** del pipeline-design:
   - ≥50% pruebas EXISTENTES
   - Solo skill_primario del registry
   - Suma duraciones ≤ duración_total − 10min
   - Máx 2 pruebas del mismo skill
   - ≥3 mecánicas distintas
   - Curva estrictamente progresiva
   - Última prueba integra elementos anteriores

Genera el DESIGN.json final siguiendo la estructura estándar.
```

## Paso 3: Validar

Verificar todas las reglas críticas del diseño final:

- [ ] Suma de duraciones ≤ `duracion_total` del BRIEF − 10 min
- [ ] Máx 2 pruebas del mismo `skill_primario`
- [ ] Al menos 3 mecánicas distintas
- [ ] Curva de dificultad estrictamente progresiva
- [ ] Última prueba integra elementos de anteriores
- [ ] ≥50% pruebas EXISTENTES
- [ ] Variedad de cierres (máx 3 del mismo tipo)
- [ ] Misterio secundario coherente

Si falla, ajustar la síntesis y re-validar (máx 2 intentos). Si persiste, escalar al Orchestrator.

## Paso 4: Guardar

1. Guardar `DESIGN-A.json` en `{output_dir}/designs/DESIGN-A.json`
2. Guardar `DESIGN-B.json` en `{output_dir}/designs/DESIGN-B.json`
3. Guardar `DESIGN.json` (final) en `{output_dir}/DESIGN.json`

## Reglas CRÍTICAS

- **REUTILIZACIÓN OBLIGATORIA** — Al menos el 50% de las pruebas deben ser EXISTENTES (del catálogo). Solo crear nuevas si no hay ninguna existente adecuada para esa mecánica. `pruebas_existentes_candidatas` del BRIEF es tu fuente principal.
- **SOLO** usar `skill_primario` de los 20 skills en `skill-registry.json`
- Suma de duraciones ≤ `duracion_total` del BRIEF − 10 min (margen de seguridad)
- **Máx 2 pruebas** del mismo `skill_primario`
- **Al menos 3 mecánicas distintas** (lógica, exploración, físico, cripto, manipulación, etc.)
- Curva de dificultad **estrictamente progresiva** (nunca plana ni decreciente)
- La **última prueba** debe integrar elementos de anteriores (clímax narrativo+mejores mecánicas)
- Pruebas nuevas: **solo** si no hay existente adecuado. Incluir `descripcion_breve` en `pruebas_nuevas_requeridas`
- **Independencia**: los jueces NO comparten output. Cada uno diseña sin ver el diseño del otro
- **Síntesis balanceada**: no puede ser 100% de un juez. Debe haber contribuciones de ambos

### Reglas de Estilo de Juegos (de 09-estilo-juegos.md)

- **Todo el equipo activo** — Cada prueba debe tener 4-6 jugadores haciendo cosas simultáneamente
- **Físico > Digital** — Preferir manipulación, superposición, búsqueda
- **Contenedor narrativo** — Si un puzzle tiene varios componentes, usar contenedor temático
- **Doble descubrimiento** — Cada puzzle necesita 2 fases: encontrar + interpretar
- **Temática no es decoración** — Cada prueba debe poder explicarse como parte de la historia
- **Curva recomendada** — 3→4→5→(pico)→4. La última prueba NO debe ser la más difícil
- **Variedad de cierres** — Máx 3 candados del mismo tipo
- **Misterio secundario** — Un hilo conductor que conecta todas las pruebas
- **Momentos de energía** — Mínimo 2 picos emocionales por juego (inicio y final)
- **Cartas de navegación** — Cada prueba entrega una carta/breve que guía a la siguiente

## Estructura de DESIGN.json (output final)

```json
{
  "id": "design_{fecha}_{slug}",
  "concept_ref": "concept_id",
  "dual_llm": true,
  "synthesis_sources": {
    "design_a": "designs/DESIGN-A.json",
    "design_b": "designs/DESIGN-B.json"
  },
  "pruebas_seleccionadas": [
    {
      "orden": 1,
      "prueba_ref": "EXISTENTE:prueba_xxx_001",
      "skill_primario": "prueba-xxx",
      "acto": 1,
      "duracion_minutos": 8,
      "dificultad": 2,
      "titulo_personalizado": "El portal olvidado",
      "conexion_narrativa": "Los jugadores descubren la entrada al templo",
      "tipo_cierre": "candado_4digitos|llave_fisica|cryptex|candado_letras",
      "codigo": "XXXX",
      "doble_descubrimiento": "Descripción de la segunda capa de '¡aha!'",
      "contenedor_narrativo": "cofre de madera|maleta antigua|carpeta...",
      "carta_navegacion": "Texto breve que guía a la siguiente prueba",
      "fragmento_misterio": "CA (sílaba, símbolo, fragmento...)",
      "jugadores_activos": "Cómo participan los 4-6 jugadores simultáneamente",
      "source": "confirmed|suspect_a|suspect_b|hybrid"
    }
  ],
  "flujo_tipo": "lineal",
  "flujo_descripcion": "Flujo lineal con 6 pruebas. Cada prueba desbloquea la siguiente.",
  "curva_dificultad": [3, 4, 5, 5, 6, 4],
  "curva_justificacion": "Entrada suave → progresión → pico en 5 → recompensa rápida en 6",
  "misterio_secundario": "CATALINA VALENTO",
  "momentos_energia": [
    {"posicion": "inicio", "descripcion": "Reloj de arena + dramatismo del GM"},
    {"posicion": "final", "descripcion": "Luz violeta + sobre lacrado + frase épica"}
  ],
  "distribucion_cierres": {"candado_4digitos": 3, "llave_fisica": 1, "cryptex": 1, "candado_letras": 1},
  "tiempo_total_estimado": 55,
  "margen_seguridad_minutos": 5,
  "variedad_mecanicas": {"logica": 2, "exploracion": 1, "fisico": 1, "cripto": 1, "manipulacion": 1},
  "materiales_requeridos": [
    {"nombre": "Candado de combinación 4 dígitos", "tipo": "fisico", "cantidad": 1}
  ],
  "pistas_globales_gm": [
    {"nivel": 1, "trigger": "Atascados >5 min en prueba 1", "texto": "Fíjate en los símbolos repetidos del mapa"},
    {"nivel": 2, "trigger": "Atascados >10 min en prueba 1", "texto": "Cuenta las estrellas en cada esquina"},
    {"nivel": 3, "trigger": "Atascados >15 min en prueba 1", "texto": "El código es 3-1-4-2"}
  ],
  "pruebas_nuevas_requeridas": [],
  "synthesis_stats": {
    "confirmed": 3,
    "suspect_a": 1,
    "suspect_b": 2,
    "hybrid": 0
  }
}
```

## Research Frameworks

| # | Framework | Ruta | Clave para diseño |
|---|-----------|------|-------------------|
| 1 | Game Design | `research-frameworks/01-game-design.md` | MDA, balance, core loop |
| 2 | Puzzle Design | `research-frameworks/02-puzzle-design.md` | Principios de buen puzzle, variedad |
| 3 | Psicología | `research-frameworks/04-psicologia.md` | Flow Theory, zona óptima |
| 4 | UX | `research-frameworks/05-ux.md` | Fricción, feedback, affordances |
| 5 | Estilo Juegos | `research-frameworks/09-estilo-juegos.md` | Patrones probados de diseño |

## Scripts

### Validación rápida

```bash
# Verificar que curva de dificultad es progresiva
cat {output_dir}/DESIGN.json | jq '.curva_dificultad' | \
  python3 -c "
import sys, json
curve = json.load(sys.stdin)
for i in range(1, len(curve)):
    if curve[i] < curve[i-1]:
        print(f'ERROR: dificultad baja en posición {i}: {curve[i-1]} → {curve[i]}')
        sys.exit(1)
print('Curva OK: progresiva')
"

# Verificar max 2 pruebas por skill
cat {output_dir}/DESIGN.json | jq -r '.pruebas_seleccionadas[].skill_primario' | \
  sort | uniq -c | awk '$1 > 2 {print "ERROR: " $2 " aparece " $1 " veces (máx 2)"}'

# Verificar clasificación de síntesis
cat {output_dir}/DESIGN.json | jq '.pruebas_seleccionadas[].source' | \
  sort | uniq -c
```

## Integración con Orchestrator

El Orchestrator debe:
1. Llamar a `pipeline-design` cuando CONCEPT.json esté disponible
2. Esperar los 3 archivos (DESIGN-A.json, DESIGN-B.json, DESIGN.json)
3. Mostrar a Daniel: resumen de pruebas + stats de síntesis (confirmed/suspect/hybrid)
4. Continuar a Narrative Consistency y Difficulty Calibration con DESIGN.json final

## Agentes Utilizados

- `escape-judge-a` — Agente configurado en `opencode.json` (enfoque lógico)
- `escape-judge-b` — Agente configurado en `opencode.json`, modelo de provider DISTINTO (enfoque experiencial)
- Ambos se invocan vía `delegate()`
