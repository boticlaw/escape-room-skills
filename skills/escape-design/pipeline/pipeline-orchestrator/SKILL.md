---
name: pipeline-orchestrator
description: Skill maestro que coordina las fases del pipeline de creación de escape rooms. Sistema retomable con PROGRESS.json, ejecución fase por fase, gates de decisión, dual-LLM en CONCEIVE/DESIGN/PLAYTEST/JUDGMENT, y reglas de diseño integradas.
---

# Pipeline Orchestrator — Escape Room Creation Pipeline

Skill maestro que ejecuta cuando Daniel pide "crea un escape room". Coordina las fases delegando cada una como subagente. Las fases CONCEIVE, DESIGN, PLAYTEST y JUDGMENT usan dual-LLM (razonator + visionator).

## Resumen

El orchestrator NO ejecuta fases directamente. Lee el SKILL.md de cada fase, prepara el prompt con el artefacto input correcto, delega vía `sessions_spawn`, valida output y decide si continuar o iterar.

**Sistema retomable:** Cada fase guarda su output inmediatamente. PROGRESS.json trackea el estado. Si el pipeline se interrumpe (timeout, crash, sesión nueva), se retoma desde la primera fase no completada.

---

## REGLAS CRÍTICAS

### 1. GUARDAR después de cada fase
Después de cada fase, escribir el output a `{project_dir}/{artefacto}` y verificar con `ls -la`.
Nunca acumular sin guardar. Si el proceso se interrumpe, lo completado ya está guardado.

### 2. PROGRESS.json — Estado del pipeline (RETOMABLE)
Antes de iniciar CUALQUIER fase, leer `{project_dir}/PROGRESS.json`. Si existe y contiene
fases completadas, **RETOMAR** desde la primera fase no completada. No repetir trabajo hecho.

Actualizar PROGRESS.json después de cada fase completada exitosamente.

```json
{
  "schema_version": "1.0",
  "pipeline_version": "escape-room-v1",
  "game_id": "slug-del-juego",
  "started_at": "2026-05-01T08:00:00Z",
  "last_updated": "2026-05-01T08:30:00Z",
  "mode": "full",
  "phases": {
    "RESOLVE": { "status": "done", "completed_at": "...", "file": "RESOLVED_STANDARDS.json" },
    "EXPLORE": { "status": "done", "completed_at": "...", "file": "BRIEF.json" },
    "REGRESSION": { "status": "skipped", "reason": "No baseline exists" },
    "CONCEIVE": { "status": "done", "completed_at": "...", "file": "CONCEPT.json" },
    "DESIGN": { "status": "done", "completed_at": "...", "file": "DESIGN.json" },
    "NARRATIVE-CONSISTENCY": { "status": "done", "completed_at": "...", "file": "NARRATIVE-CONSISTENCY-REPORT.json" },
    "DIFFICULTY-CALIBRATION": { "status": "done", "completed_at": "...", "file": "DIFFICULTY-REPORT.json" },
    "BUILD": { "status": "done", "completed_at": "...", "output_dir": "juegos/{juego}/" },
    "NARRATIVE-CONSISTENCY-RECHECK": { "status": "pending" },
    "PLAYTEST": { "status": "pending" },
    "VERIFY": { "status": "pending" },
    "JUDGMENT": { "status": "pending" }
  },
  "gate_results": {
    "post_explore": "continue",
    "post_conceive": "continue",
    "post_design": "continue"
  },
  "iteration_counts": {
    "conceive_attempts": 1,
    "design_attempts": 1,
    "build_playtest_cycles": 0,
    "design_build_verify_cycles": 0,
    "total_full_cycles": 0
  },
  "dual_llm_results": {
    "conceive": { "razonator": "done", "visionator": "done", "synthesis": "done" },
    "design": { "razonator": "done", "visionator": "done", "synthesis": "done" },
    "playtest": { "razonator": null, "visionator": null, "synthesis": null },
    "judgment": { "razonator": null, "visionator": null, "synthesis": null }
  }
}
```

Valores de `status`: `pending` | `in_progress` | `done` | `skipped` | `failed`

### 3. Timeouts por fase
Cada fase tiene un tiempo máximo estimado. Si se excede, guardar lo que haya y marcar como `failed`.

| Fase | Timeout estimado | Notas |
|------|-----------------|-------|
| RESOLVE | 3 min | Skill resolution |
| EXPLORE | 8 min | Recopilar brief + research delegado |
| REGRESSION | 5 min | Solo si existe baseline |
| CONCEIVE | 12 min | Dual-LLM (6 min cada modelo + síntesis) |
| DESIGN | 15 min | Dual-LLM (7 min cada modelo + síntesis) |
| NARRATIVE-CONSISTENCY | 5 min | Cross-reference de entidades |
| DIFFICULTY-CALIBRATION | 5 min | Evaluación de curva |
| BUILD | 10 min | Generación de contenido |
| NARRATIVE-CONSISTENCY-RECHECK | 5 min | Re-check post-build |
| PLAYTEST | 12 min | Dual-LLM (6 perfiles: 3+3) |
| VERIFY | 8 min | Checks mecánicos |
| JUDGMENT | 10 min | Dual-LLM (evaluación completa) |

**Total estimado pipeline completo:** ~90-100 min.

### 4. Gates de decisión

#### Gate 1: Post-EXPLORE
Después de BRIEF.json, evaluar:
- ¿Hay datos suficientes? → Si `datos_pendientes` no vacío: `gate_result = "blocked"` → preguntar Daniel
- ¿Hay baseline existente? → Si sí: ejecutar REGRESSION antes de CONCEIVE
- ¿Merece pipeline completo? → `gate_result = "continue"`

#### Gate 2: Post-CONCEIVE
Después de CONCEPT.json, evaluar:
- ¿El concepto pasa los checks de diseño (ver sección "Reglas integradas")? → `gate_result = "continue"`
- ¿Hay problemas fundamentales? → `gate_result = "revise"` → ajustar y reintentar

#### Gate 3: Post-DESIGN
Después de DESIGN.json, evaluar:
- ¿Pasa Narrative Consistency + Difficulty Calibration? → `gate_result = "continue"`
- ¿Hay ajustes? → `gate_result = "adjust"` → aplicar y continuar

---

## Modelo por Fase

| Fase | Modelo | Dual-LLM | Razón |
|------|--------|----------|-------|
| RESOLVE | `zai/glm-5-turbo` | No | Búsqueda y clasificación |
| EXPLORE | `zai/glm-5-turbo` | No | Recopilar brief |
| REGRESSION | `zai/glm-5-turbo` | No | Comparación y diff |
| **CONCEIVE** | **Razonator (GLM-5.1) + Visionator (GPT-5.5)** | **Sí** | **Concepto: estructurado + creativo → síntesis** |
| **DESIGN** | **Razonator (GLM-5.1) + Visionator (GPT-5.5)** | **Sí** | **Puzzles: lógicos + experienciales → síntesis** |
| NARRATIVE-CONSISTENCY | `zai/glm-5-turbo` | No | Extracción y cross-reference |
| DIFFICULTY-CALIBRATION | `zai/glm-5-turbo` | No | Evaluación de parámetros y curva |
| BUILD | `zai/glm-5.1` | No | Generación de contenido |
| **PLAYTEST** | **Razonator (GLM-5.1) + Visionator (GPT-5.5)** | **Sí** | **6 perfiles: analíticos + experienciales → cruce** |
| VERIFY | `zai/glm-5-turbo` | No | Checks mecánicos y validación |
| **JUDGMENT** | **Razonator (GLM-5.1) + Visionator (GPT-5.5)** | **Sí** | **Evaluación: analítica + creativa → síntesis con auto-fix** |

### Resumen Dual-LLM

| Fase | Razonator (GLM-5.1) aporta | Visionator (GPT-5.5) aporta | Síntesis |
|------|------------------------|------------------------|----------|
| **CONCEIVE** | Narrativa clásica, progresión lógica | Giros narrativos, mecánicas innovadoras | Mejor de cada uno → 1 CONCEPT.json |
| **DESIGN** | Puzzles lógicos, cadena deductiva | Puzzles experienciales, momentos "wow" | Mejores pruebas → 1 DESIGN.json |
| **PLAYTEST** | 3 perfiles analíticos (novato lento, experimentado, experto) | 3 perfiles experienciales (ansioso, impulsivo, pragmático) | Cruce findings → 1 PLAYTEST-REPORT.json |
| **JUDGMENT** | Evaluación completa narrativa+lógica | Evaluación completa narrativa+lógica | Confirmados → auto-fix → 1 JUDGMENT-REPORT.json |

---

## REGLAS DE DISEÑO INTEGRADAS

Las siguientes reglas son **checks obligatorios** dentro de las fases correspondientes.
Están integradas directamente en el pipeline — NO se referencian como archivo externo.

### Checks obligatorios en CONCEIVE

Antes de aceptar un concepto, verificar:

1. **Todo el equipo activo siempre** — El concepto debe describir cómo cada jugador (4-6) tiene algo que hacer en cada prueba. Sin momentos de espera pasiva.
2. **Físico > Digital** — Las mecánicas propuestas deben priorizar manipulación física (tocar, mover, superponer, buscar). Lo digital solo como apoyo, nunca como protagonista.
3. **Doble descubrimiento** — Cada prueba debe tener al menos 2 capas de "¡aha!": resolver el puzzle principal Y descubrir algo que revela la solución o siguiente paso.
4. **La temática no es decoración** — Cada prueba debe poder explicarse como "este elemento refleja algo real de la temática". Nada forzado.
5. **Curva de dificultad: 3→4→5→(pico 6)→4** — La última prueba NO es la más difícil. Entrada suave, progresión, pico, y recompensa rápida antes del final.
6. **Variedad de mecánicas** — Máximo 2 pruebas con mecánica similar en todo el juego.
7. **Variedad de cierres** — Máximo 3 cierres del mismo tipo (candado numérico, alfanumérico, cryptex, llave física, etc.).
8. **Mapa emocional alternado** — No 2 pruebas seguidas con la misma emoción objetivo (curiosidad, descubrimiento, urgencia, cooperación, giro, alivio, triunfo).
9. **Todos terminan el juego** — Diseñar para que ningún grupo se quede sin completar. El GM es el último recurso.

### Checks obligatorios en DESIGN

Antes de aceptar un diseño, verificar:

1. **Cada prueba necesita al menos 2 fases distintas** — Encontrar + interpretar, ordenar + revelar, superponer + deducir. Nada de un solo paso.
2. **El contenedor cuenta** — Si un puzzle tiene varios componentes, encuéntrales un contenedor narrativo (maleta, cofre, carpeta, sobre…). No soportes genéricos.
3. **Audio máximo 60 segundos** — Si hay audio, solo para contexto narrativo o pistas clave. Nunca como mecánica principal.
4. **3 niveles de pistas progresivos** — Cada prueba debe tener: N1 sutil, N2 directa, N3 casi solución. Diseñados con la prueba, no improvisados.
5. **Narrativa como motor** — Cada prueba responde a una pregunta narrativa ("¿qué descubrimos?", "¿por qué esto tiene sentido aquí?"). Si existe solo porque "tocaba meter un puzzle", rediseñar.
6. **Redundancia y tolerancia al error** — Identificar componentes críticos y crear redundancias. Si se pierde una pieza, el juego sigue. Validaciones parciales sin GM.
7. **Recompensas intermedias = avance en la misión** — Cada 1-2 pruebas: una revelación, nueva capacidad, verdad sobre la historia. No solo "acertaste el código".
8. **Final memorable** — Acción clara + resolución narrativa + recompensa emocional. La victoria debe sentirse ganada y visible.

### Checks obligatorios en VERIFY

Además de las validaciones mecánicas existentes:

1. **Checklist completo de diseño** — Verificar TODOS los checks de CONCEIVE y DESIGN como lista de verificación.
2. **Anti-repeticiones entre pruebas** — Ninguna información clave se da anticipada en pruebas anteriores. Cada pieza/info se presenta UNA vez. Los componentes acumulados NO llevan instrucciones de para qué sirven.
3. **Ningún elemento temáticamente desvinculado** — Si tienes que explicar por qué un elemento está ahí, probablemente no debería estar.
4. **Curva de dificultad verificada** — Confirmar que la secuencia de dificultades sigue 3→4→5→(6)→4.
5. **Variedad de mecánicas verificada** — Máx 2 pruebas con mecánica similar.
6. **Variedad de cierres verificada** — Máx 3 del mismo tipo de cierre.
7. **Mapa emocional sin repeticiones consecutivas** — No 2 pruebas seguidas con la misma emoción.
8. **Legibilidad visual** — Jerarquía clara: qué es pista, qué es ambientación.
9. **Finalización garantizada** — El juego tiene mecanismos para que todos los grupos terminen.

---

## Fases

| # | Fase | Skill | Input | Output |
|---|------|-------|-------|--------|
| 0 | RESOLVE | `pipeline-skill-resolution` | game_type + phase + theme + difficulty | `RESOLVED_STANDARDS.json` |
| 1 | EXPLORE | `pipeline-explore` | Petición de Daniel | `BRIEF.json` |
| 1b | REGRESSION | `pipeline-regression` | BASELINE (si existe) + juego actual | `REGRESSION-REPORT.json` |
| 2 | **CONCEIVE** | `pipeline-conceive` | `BRIEF.json` + Checks CONCEIVE | `concepts/CONCEPT-A.json` + `concepts/CONCEPT-B.json` → `CONCEPT.json` |
| 3 | **DESIGN** | `pipeline-design` | `CONCEPT.json` + Checks DESIGN | `designs/DESIGN-A.json` + `designs/DESIGN-B.json` → `DESIGN.json` |
| 3a | NARRATIVE CONSISTENCY | `pipeline-narrative-consistency` | `DESIGN.json` + `CONCEPT.json` | `NARRATIVE-CONSISTENCY-REPORT.json` |
| 3b | DIFFICULTY CALIBRATION | `pipeline-difficulty-calibration` | `CONCEPT.json` + `DESIGN.json` | `DIFFICULTY-REPORT.json` |
| 4 | BUILD | `pipeline-build` | `DESIGN.json` + `DIFFICULTY-REPORT.json` (si existe) | `juegos/{juego}/` completo |
| 4a | NARRATIVE CONSISTENCY (re-check) | `pipeline-narrative-consistency` | `juegos/{juego}/` + `DESIGN.json` | `NARRATIVE-CONSISTENCY-REPORT.json` |
| 4b | **PLAYTEST** | `pipeline-playtest` | `juegos/{juego}/` + `DESIGN.json` + `CONCEPT.json` | `playtests/PLAYTEST-A.json` + `playtests/PLAYTEST-B.json` → `PLAYTEST-REPORT.json` |
| 5 | VERIFY | `pipeline-verify` | `juegos/{juego}/` + `DESIGN.json` + `PLAYTEST-REPORT.json` + Checks VERIFY | `VERIFY-REPORT.json` |
| 6 | **JUDGMENT** | `pipeline-judgment-day` | `juegos/{juego}/` + `DESIGN.json` + `CONCEPT.json` + `VERIFY-REPORT.json` + `PLAYTEST-REPORT.json` | `JUDGMENT-REPORT.json` |

### Ejecución de cada fase — PASOS OBLIGATORIOS

```
Para CADA fase del pipeline:

1. LEER PROGRESS.json → ¿Esta fase ya está "done" o "skipped"? → Saltar
2. Marcar fase como "in_progress" en PROGRESS.json → GUARDAR
3. Leer el SKILL.md del pipeline-{fase}
4. Preparar el prompt con el input correcto (artefacto de la fase anterior) + RESOLVED_STANDARDS
5. sessions_spawn con el prompt
6. Esperar resultado (push-based)
7. Validar que el output se generó correctamente (ls -la {output_file})
8. Si falla → intentar 1 vez más → si vuelve a fallar → marcar "failed" + escalar a Daniel
9. Si ok → marcar como "done" en PROGRESS.json → GUARDAR → pasar a siguiente fase
```

**Skills de pipeline referenciados** (todos en `escape-material/.agents/skills/`):
- `pipeline-skill-resolution/SKILL.md`
- `pipeline-explore/SKILL.md`
- `pipeline-conceive/SKILL.md` (dual-LLM)
- `pipeline-design/SKILL.md` (dual-LLM)
- `pipeline-build/SKILL.md`
- `pipeline-verify/SKILL.md`
- `pipeline-judgment-day/SKILL.md` (dual-LLM)
- `pipeline-judge-story/SKILL.md` (orquestado internamente por judgment-day)
- `pipeline-judge-logic/SKILL.md` (orquestado internamente por judgment-day)
- `pipeline-playtest/SKILL.md` (dual-LLM, fase 4b)
- `pipeline-difficulty-calibration/SKILL.md` (fase 3b)
- `pipeline-narrative-consistency/SKILL.md` (fase 3a tras Design, fase 4a tras Build)
- `pipeline-regression/SKILL.md` (fase 1b, tras Explore si existe baseline)

---

## Reglas de Iteración

### Límites Globales (trackeados en PROGRESS.json)

- Máx **2 intentos** por fase individual (reset por iteración de ciclo mayor).
- Máx **1 iteración** del ciclo Build → Playtest.
- Máx **2 iteraciones** del ciclo Design → Build → Verify.
- Máx **3 ciclos completos** (Design → Build → Verify → Judge).
- Si se exceden → marcar como `failed` en PROGRESS.json + escalar a Daniel con resumen.

### Datos pendientes tras Explore

Si `BRIEF.json` tiene `datos_pendientes` no vacío:
- **Detener el pipeline.** Gate result = `"blocked"`.
- Mostrar las preguntas pendientes a Daniel.
- Esperar respuesta.
- Re-ejecutar EXPLORE con los datos completados.

### Si CONCEIVE falla

La síntesis dual-LLM raramente falla, pero si el concepto final no pasa los checks obligatorios de CONCEIVE:
1. Escapeitor ajusta la síntesis (máx 2 intentos).
2. Si persiste → escalar a Daniel con ambos conceptos (A y B) para que elija dirección.

### Si DESIGN falla

Si la síntesis dual-LLM no pasa los checks obligatorios de DESIGN:
1. Escapeitor ajusta la síntesis (máx 2 intentos).
2. Si persiste → escalar a Daniel con ambos diseños y las validaciones fallidas.

### Si PLAYTEST falla (`verdict = "fail"`)

1. Volver a FASE 4 (BUILD) con el feedback del `PLAYTEST-REPORT` (incluye CRITICAL findings).
2. Build corrige los issues de flujo/bloqueos.
3. Máx **1 iteración** del ciclo Build → Playtest.
4. Si no pasa → escalar a Daniel con el `PLAYTEST-REPORT`.

### Si PLAYTEST con concerns (`verdict = "pass_with_concerns"`)

1. Pasar `PLAYTEST-REPORT.json` a Verify como contexto adicional.
2. Verify debe priorizar los findings del playtest.
3. Continuar pipeline normalmente.

### Si DIFFICULTY CALIBRATION falla (`verdict = "fail"`)

1. Volver a FASE 3 (DESIGN) con el feedback del `DIFFICULTY-REPORT`.
2. Designer ajusta los puzzles según las sugerencias.
3. Máx **1 iteración** del ciclo Design → Difficulty Calibration.
4. Si no pasa → escalar a Daniel con el `DIFFICULTY-REPORT`.

### Si DIFFICULTY CALIBRATION con ajustes (`verdict = "pass_with_adjustments"`)

1. Pasar `DIFFICULTY-REPORT.json` a Build como contexto adicional.
2. Build debe aplicar los ajustes sugeridos.
3. Continuar pipeline normalmente.

### Si NARRATIVE CONSISTENCY falla (`verdict = "fail"`)

1. Volver a FASE 3 (DESIGN) con el feedback del `NARRATIVE-CONSISTENCY-REPORT`.
2. Designer corrige las inconsistencias narrativas.
3. Máx **1 iteración** del ciclo Design → Narrative Consistency.
4. Si no pasa → escalar a Daniel con el report.

### Si NARRATIVE CONSISTENCY con warnings (`verdict = "pass_with_warnings"`)

1. Pasar las sugerencias como notas a Build.
2. Continuar pipeline normalmente.

### Si REGRESSION falla (`verdict = "fail"`)

1. **Detener pipeline** inmediatamente.
2. Escalar a Daniel con el `REGRESSION-REPORT`.
3. Daniel decide si continuar o revertir cambios.

### Si REGRESSION con concerns (`verdict = "pass_with_concerns"`)

1. Continuar pipeline pero solo ejecutar las re-verificaciones indicadas en `re_verification_needed`.
2. Pasar `REGRESSION-REPORT.json` como contexto a las fases afectadas.

### Si VERIFY falla (`verdict = "fail"`)

1. Volver a FASE 3 (DESIGN) con el feedback del `VERIFY-REPORT`.
2. DesignerAgent corrige los issues.
3. Máx **2 iteraciones** del ciclo Design → Build → Verify.
4. Si no pasa → escalar a Daniel con el `VERIFY-REPORT`.

### Si JUDGMENT — Tabla de Consenso (Dual-LLM)

| Razonator (GLM-5.1) | Visionator (GPT-5.5) | Acción |
|-------------------|-------------------|--------|
| approved | approved | ✅ ENTREGAR |
| approved_with_suggestions | approved | ✅ ENTREGAR (con notas) |
| approved | approved_with_suggestions | ✅ ENTREGAR (con notas) |
| approved_with_suggestions | approved_with_suggestions | ✅ ENTREGAR (con notas de ambos) |
| rejected | approved | Volver a FASE 2 (Conceive) con feedback dual |
| approved | rejected | Volver a FASE 3 (Design) con feedback dual |
| rejected | rejected | Volver a FASE 1 (Explore) — concepto roto |

**Nota**: Ambos jueces evalúan TANTO narrativa como lógica (no hay separación). La tabla refleja el verdict global de cada juez.

---

## Comunicación con Daniel

El orchestrator DEBE informar en estos puntos:

| Momento | Qué mostrar |
|---------|-------------|
| **Inicio** | "Voy a crear un escape room de {temática}. Pipeline dual-LLM en 4 fases." |
| **Tras Explore** | Si faltan datos → preguntar. Si ok → breve resumen del brief. Si hay baseline → ejecutar Regression. |
| **Tras Regression** | Si skip → "Juego nuevo, sin baseline." Si concerns → mostrar cambios detectados. Si fail → escalar. |
| **Tras Conceive (dual)** | Título + tagline + premisa (3 líneas). "Concepto sintetizado de GLM-5.1 + GPT-5.5." |
| **Tras Design (dual)** | Resumen de pruebas (existente/nueva, count por tipo) + stats síntesis (X confirmed, Y suspect, Z hybrid). "Diseño dual: {A} lógicas + {B} experienciales." |
| **Tras Difficulty Calibration** | Verdict + número de puzzles fuera de target si los hay. |
| **Tras Build** | Confirmar build completado, anunciar playtest. |
| **Tras Playtest (dual)** | Verdict + X critical, Y warnings, Z divergencias. "Playtest dual: 6 perfiles (3 analíticos + 3 experienciales)." |
| **Tras Verify** | Si warnings/issues → mostrarlos. |
| **Tras Judgment (dual)** | Score de cada juez + verdict final. "Juicio dual: GLM-5.1 ({score}) + GPT-5.5 ({score}) → {verdict}" |
| **Final** | "Juego completo en juegos/{juego}/. PDF generado." |

---

## Estructura de Directorios

### Durante el pipeline

```
agents/escapeitor/.pipeline/{juego-id}/
├── PROGRESS.json               ← Estado del pipeline (retomable)
├── RESOLVED_STANDARDS.json
├── BRIEF.json
├── REGRESSION-REPORT.json      ← Solo si existe baseline
├── concepts/
│   ├── CONCEPT-A.json          (Razonator output)
│   └── CONCEPT-B.json          (Visionator output)
├── CONCEPT.json                (síntesis final)
├── designs/
│   ├── DESIGN-A.json           (Razonator output)
│   └── DESIGN-B.json           (Visionator output)
├── DESIGN.json                 (síntesis final)
├── NARRATIVE-CONSISTENCY-REPORT.json
├── DIFFICULTY-REPORT.json
├── VERIFY-REPORT.json
├── playtests/
│   ├── PLAYTEST-A.json         (Razonator output)
│   └── PLAYTEST-B.json         (Visionator output)
├── PLAYTEST-REPORT.json        (síntesis final)
└── JUDGMENT-REPORT.json
```

### Tras aprobación final

```
juegos/{juego}/
├── (archivos del juego)
└── doc/
    └── pipeline/
        ├── BRIEF.json
        ├── CONCEPT.json
        ├── DESIGN.json
        ├── VERIFY-REPORT.json
        ├── PLAYTEST-REPORT.json
        └── JUDGMENT-REPORT.json
```

---

## Diagrama de Decisión

```
INICIO
  │
  ├─ LEER PROGRESS.json → ¿Hay fases "done"? → RETOMAR desde primera pendiente
  │
  ▼
FASE 0: RESOLVE
  │
  ▼
FASE 1: EXPLORE ──→ datos_pendientes? ──SÍ──→ Gate "blocked" → Preguntar Daniel → re-Explore
  │                                       │
  │                                       N
  ▼                                       │
FASE 1b: REGRESSION (solo si baseline)    │
  │                                       │
  ▼                                       │
FASE 2: CONCEIVE (dual-LLM)               │
  Checks CONCEIVE obligatorios            │
  razonator: estructurado                 │
  visionator: creativo                    │
  síntesis → CONCEPT.json                 │
  │ GUARDAR PROGRESS.json                 │
  ▼                                       │
FASE 3: DESIGN (dual-LLM)                 │
  Checks DESIGN obligatorios              │
  razonator: lógico                       │
  visionator: experiencial                │
  síntesis → DESIGN.json                  │
  │ GUARDAR PROGRESS.json                 │
  ▼                                       │
FASE 3a: NARRATIVE CONSISTENCY            │
FASE 3b: DIFFICULTY CALIBRATION           │
  │ GUARDAR PROGRESS.json                 │
  ▼                                       │
FASE 4: BUILD                             │
  │ GUARDAR PROGRESS.json                 │
  ▼                                       │
FASE 4a: NARRATIVE CONSISTENCY (re-check) │
FASE 4b: PLAYTEST (dual-LLM)              │
  razonator: 3 perfiles analíticos        │
  visionator: 3 perfiles experienciales   │
  síntesis → PLAYTEST-REPORT.json         │
  │ GUARDAR PROGRESS.json                 │
  ▼                                       │
FASE 5: VERIFY                            │
  Checks VERIFY obligatorios completos    │
  ──→ fail? ──SÍ──→ iter≤2? ──SÍ──→ (volver a DESIGN)
  │                    │          │
  │                   N         N
  ▼                    ▼          ▼
FASE 6: JUDGMENT (dual-LLM)        escalar
  razonator: evaluación completa
  visionator: evaluación completa
  síntesis → auto-fix → JUDGMENT-REPORT.json
  │ GUARDAR PROGRESS.json
  │
  ├─ approved + approved → ✅ ENTREGAR
  ├─ rejected + approved → volver a CONCEIVE
  ├─ approved + rejected → volver a DESIGN
  ├─ rejected + rejected → volver a EXPLORE
  └─ ciclos≥3 → escalar a Daniel
```

## Ejemplo de Flujo Completo

```
Daniel: "Crea un escape room de piratas para niños 8-10 años"

1. LEER PROGRESS.json → No existe → Crear nuevo
2. INICIO → "Voy a crear un escape room de piratas. Pipeline dual-LLM en 4 fases."
3. RESOLVE → RESOLVED_STANDARDS.json → GUARDAR
4. EXPLORE → BRIEF.json generado → GUARDAR → Gate: continue
   → "Brief: 4-6 jugadores, 60min, dificultad media, puzzles adaptados a 8-10 años"
5. CONCEIVE (dual) → GLM-5.1 genera CONCEPT-A, GPT-5.5 genera CONCEPT-B → síntesis
   → Checks CONCEIVE: ✅ equipo activo, ✅ físico>digital, ✅ doble descubrimiento...
   → GUARDAR PROGRESS.json
   → "🎮 El Tesoro del Capitán Calavera / '¿Podrás encontrar el oro antes de que el barco se hunda?' / Los jugadores son grumos que deben encontrar el tesoro escondido antes de que el barco zozobre."
6. DESIGN (dual) → GLM-5.1 diseña lógicos, GPT-5.5 diseña experienciales → síntesis
   → Checks DESIGN: ✅ 2 fases/prueba, ✅ contenedores narrativos, ✅ pistas 3 niveles...
   → GUARDAR PROGRESS.json
   → "5 pruebas: 2 existentes (adaptadas), 3 nuevas. 3 confirmed, 1 suspect_A, 1 suspect_B."
7. NARRATIVE CONSISTENCY → pass → GUARDAR
8. DIFFICULTY CALIBRATION → pass_with_adjustments → GUARDAR
9. BUILD → juegos/el-tesoro-del-capitan-calavera/ → GUARDAR
10. PLAYTEST (dual) → GLM-5.1 simula 3 analíticos, GPT-5.5 simula 3 experienciales → cruce
    → GUARDAR PROGRESS.json
    → "✅ pass — 0 critical, 2 warnings, 1 divergencia."
11. VERIFY → Checks VERIFY completos → VERIFY-REPORT.json → verdict: pass
    → GUARDAR PROGRESS.json
    → "⚠️ Warning: Puzzle 3 podría ser confuso sin pistas claras. No bloqueante."
12. JUDGMENT (dual) → GLM-5.1 + GPT-5.5 evalúan completo → síntesis
    → GUARDAR PROGRESS.json
    → "Juicio dual: GLM-5.1 (8.5/10 approved) + GPT-5.5 (8.2/10 approved) → ✅ ENTREGAR"
13. FINAL → "Juego completo en juegos/el-tesoro-del-capitan-calavera/. PDF generado."
```
