---
name: pipeline-judgment-day
description: "FASE 6 — Revisión adversarial dual-LLM con iteración. Lanza Razonator (GLM-5.1) y Visionator (GPT-5.5) como agentes independientes, cada uno evaluando narrativa + lógica. Sintetiza findings, auto-fixea issues confirmados y itera hasta convergencia."
---

# Pipeline Judgment Day — Revisión Dual-LLM con Iteración

Orquesta la evaluación completa del escape room mediante **dos LLMs diferentes** (GLM-5.1 y GPT-5.5) que evalúan el juego de forma independiente. Cada juez evalúa TANTO narrativa como lógica, proporcionando dos perspectivas completas desde modelos distintos.

## Cuándo se ejecuta

Después de FASE 4 (Build) y FASE 5 (Verify). Si Verify es `pass` o `pass_with_warnings`, ejecutar Judgment Day. Si Verify es `fail`, volver a Design primero.

El Orchestrator DEBE llamar a este skill en lugar de lanzar jueces por separado.

## Input

- `juegos/{juego-id}/` — Directorio completo del juego
- `CONCEPT.json` — Concepto original
- `DESIGN.json` — Diseño técnico
- `VERIFY-REPORT.json` — Reporte de verificación previo

## Los Dos Jueces

| Agente | Modelo | Perfil |
|--------|--------|--------|
| `razonator` | `zai/glm-5.1` | Evaluador analítico — foco en coherencia, estructura, solucionabilidad |
| `visionator` | `openai-codex/gpt-5.5` | Evaluador creativo — foco en inmersión, experiencia, originalidad |

**Ventaja dual-LLM**: Dos modelos independientes capturan más defects y sesgos que un solo modelo evaluándose a sí mismo. Los findings confirmados por ambos son altamente fiables.

## Paso 1: Launch Paralelo

Lanzar ambos jueces como **agentes independientes** con `sessions_spawn`:

```
sessions_spawn(agentId=razonator, task:
  "Lee skills/pipeline-judge-story/SKILL.md Y skills/pipeline-judge-logic/SKILL.md.
   Evalúa el juego en projects/{proyecto}/ como Juez A (GLM-5.1).
   Evalúa TODOS los criterios de narrativa Y lógica.
   Lee todos los archivos del juego: game.json, pruebas/*.json, narrativa, diseño.
   Escribe resultado en JUDGE-A.json"
)

sessions_spawn(agentId=visionator, task:
  "Lee skills/pipeline-judge-story/SKILL.md Y skills/pipeline-judge-logic/SKILL.md.
   Evalúa el juego en projects/{proyecto}/ como Juez B (GPT-5.5).
   Evalúa TODOS los criterios de narrativa Y lógica.
   Lee todos los archivos del juego: game.json, pruebas/*.json, narrativa, diseño.
   Escribe resultado en JUDGE-B.json"
)
```

Ambos en paralelo. Esperar AMBOS antes de continuar a Paso 2.

**REGLA CRÍTICA**: Cada juez NO ve el output del otro. Evaluación 100% independiente.

**Los jueces son agentes con modelo fijo en config** — Escapeitor no necesita especificar modelo, cada agente ya tiene su LLM asignado.

## Paso 2: Synthesis (Escapeitor orquesta)

Escapeitor lee `JUDGE-A.json` y `JUDGE-B.json` y realiza la síntesis directamente (no delega a subagente).

Comparar los dos veredictos completos. Clasificar cada finding:

### Clasificación de Findings

| Tipo | Definición | Acción |
|------|-----------|--------|
| **CONFIRMED** | Ambos jueces (GLM + GPT) detectaron el mismo issue | Alta confianza → Auto-fix obligatorio |
| **SUSPECT** | Solo un LLM lo detectó | Baja confianza → Investigar, posible fix |
| **CONTRADICTION** | Los LLMs discrepan sobre el mismo aspecto | Debate → Escapeitor decide con argumentos |

### Prompt Template para Synthesis

```
Eres un árbitro de evaluación de escape rooms. Tienes dos evaluaciones independientes de LLMs diferentes:

## JUEZ A (GLM-5.1)
{JUDGE-A.json completo}

## JUEZ B (GPT-5.5)
{JUDGE-B.json completo}

## TAREA
1. Identificar todos los findings (issues + suggestions) de cada juez
2. Clasificar cada finding:
   - CONFIRMED: ambos LLMs lo detectaron (mismo problema o equivalentes) → alta fiabilidad
   - SUSPECT: solo un LLM lo detectó → puede ser falso positivo o perspectiva única
   - CONTRADICTION: los LLMs discrepan (ej: GLM alaba X, GPT critica X)
3. Para CONTRADICTION: decidir cuál tiene razón con argumentos
4. Para CONFIRMED: generar un fix concreto y específico
5. Calcular overall_score combinado (media ponderada)

Output en JSON:
{
  "confirmed": [
    {"finding": "...", "judge_a_ref": "...", "judge_b_ref": "...", "fix": "...", "severity": "critical|major|minor"}
  ],
  "suspect": [
    {"finding": "...", "source": "judge_a|judge_b", "investigation": "...", "recommendation": "fix|accept|monitor"}
  ],
  "contradiction": [
    {"topic": "...", "judge_a_position": "...", "judge_b_position": "...", "resolution": "...", "reasoning": "..."}
  ],
  "overall_score": {
    "judge_a": 7.5,
    "judge_b": 7.4,
    "combined": 7.45
  },
  "verdict": "approved|approved_with_suggestions|rejected"
}
```

## Paso 3: Auto-fix

Para cada issue CONFIRMED:
1. Generar el fix concreto descrito en el synthesis
2. Aplicar los cambios a los archivos del juego (`juegos/{juego-id}/`)
3. Documentar qué se cambió y por qué

**NO auto-fix** issues SUSPECT (requieren investigación) ni CONTRADICTION (ya resueltos en synthesis).

## Paso 4: Re-judge

Volver a lanzar ambos jueces (`razonator` + `visionator`) en paralelo, pero **solo sobre las partes modificadas** (no todo el escape room).

- Si se modificó narrativa + lógica → ambos re-evalúan
- Si solo narrativa → ambos re-evalúan solo narrativa
- Si solo lógica → ambos re-evalúan solo lógica

## Paso 5: Convergence

### Reglas de parada

El ciclo se detiene cuando se cumple ALGUNA de estas condiciones:

| Condición | Resultado |
|-----------|-----------|
| `combined ≥ 8.0` | ✅ APROBADO — no más iteraciones |
| `0 CONFIRMED + 0 CONTRADICTION` | ✅ APROBADO — solo suspects aceptables |
| Iteración ≥ 2 | ⚠️ ESCALAR — presentar a Daniel |

### Si se escala a Daniel

Mostrar resumen con opciones:
1. **Continuar iterando** — se resetea el contador (1 iteración más)
2. **Aceptar con warnings** — se entrega con los suspects como notas
3. **Descartar y regenerar** — volver a FASE 2 (Conceive) con todo el feedback acumulado

## Output Final

`agents/escapeitor/.pipeline/{juego-id}/JUDGMENT-REPORT.json`:

```json
{
  "id": "judgment_2026-04-25_{juego-slug}",
  "game_ref": "{juego-slug}",
  "timestamp": "ISO-8601",
  "dual_llm": true,
  "iterations": 1,
  "synthesis": {
    "confirmed": [],
    "suspect": [],
    "contradiction": []
  },
  "scores_by_iteration": [
    {"iteration": 1, "judge_a": 7.5, "judge_b": 7.4, "combined": 7.45},
    {"iteration": 2, "judge_a": 8.5, "judge_b": 8.2, "combined": 8.35}
  ],
  "overall_score": {
    "judge_a": 8.5,
    "judge_b": 8.2,
    "combined": 8.35
  },
  "verdict": "approved|approved_with_suggestions|rejected",
  "fixes_applied": ["Descripción de cada fix aplicado"],
  "remaining_suspects": ["Suspects no resueltos (si hay)"],
  "judge_a": {"model": "GLM-5.1", "verdict": "..."},
  "judge_b": {"model": "GPT-5.5", "verdict": "..."}
}
```

## Integración con Orchestrator

El Orchestrator debe:
1. Reemplazar las llamadas individuales a JudgeStory/JudgeLogic por una única llamada a `pipeline-judgment-day`
2. Recibir el `JUDGMENT-REPORT.json` con el verdict final
3. Si verdict = `rejected` → decidir a qué fase volver según la tabla de consenso del Orchestrator
4. Si verdict = `approved_with_suggestions` → entregar con notas
5. Si verdict = `approved` → entregar

## Agentes Utilizados

- `razonator` (GLM-5.1) — Agente independiente con modelo fijo en config
- `visionator` (GPT-5.5) — Agente independiente con modelo fijo en config
- Ambos son subagentes permitidos de Escapeitor

## Skills Referenciados

- `pipeline-judge-story/SKILL.md` — Criterios de evaluación narrativa (leído por ambos jueces)
- `pipeline-judge-logic/SKILL.md` — Criterios de evaluación lógica (leído por ambos jueces)
