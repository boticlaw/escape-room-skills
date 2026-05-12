---
name: pipeline-playtest
description: >
  FASE 4b — Dual-LLM: Razonator (GLM-5.1) simula perfiles analíticos (novato lento,
  experimentado metódico, experto crítico), Visionator (GPT-5.5) simula perfiles experienciales
  (novato ansioso, adolescente impulsivo, adulto pragmático). Escapeitor cruza findings
  de ambos en un PLAYTEST-REPORT.json final.
---

# Pipeline Playtest — Simulación Dual-LLM

Dos LLMs simulan 6 perfiles de jugador distintos (3 cada uno) desde perspectivas complementarias. Escapeitor cruza los findings para identificar issues críticos con alta confianza.

> ⏱️ Tiempo estimado: ~4-6 min por juez (8-12 min total en paralelo).

## Cuándo se ejecuta

Después de FASE 4 (Build). Antes de FASE 5 (Verify).

Si Verify ya se ejecutó y es `pass` o `pass_with_warnings`, Playtest se ejecuta igualmente si no se ha ejecutado antes.

## Input

Leer estos archivos del proyecto:

- `juego/diseño/DISEÑO-JUEGO.md` — Diseño completo (pruebas, flujo, tiempos)
- `juego/narrativa/NARRATIVA.md` — Narrativa (intro, transiciones, final)
- `DESIGN.json` — Diseño estructurado
- `CONCEPT.json` — Concepto original (público objetivo, dificultad, duración)

## Output

| Producto | Ruta |
|----------|------|
| Playtest Juez A | `agents/escapeitor/.pipeline/{juego-id}/playtests/PLAYTEST-A.json` |
| Playtest Juez B | `agents/escapeitor/.pipeline/{juego-id}/playtests/PLAYTEST-B.json` |
| Reporte final sintetizado | `agents/escapeitor/.pipeline/{juego-id}/PLAYTEST-REPORT.json` |

## Los Dos Jueces

| Agente | Modelo | Perfiles que simula |
|--------|--------|-------------------|
| `razonator` | `zai/glm-5.1` | **Analíticos** — novato lento, experimentado metódico, experto crítico |
| `visionator` | `openai-codex/gpt-5.5` | **Experienciales** — novato ansioso, adolescente impulsivo, adulto pragmático |

**Ventaja dual-LLM**: 6 perfiles cubren un espectro más amplio de jugadores. Los issues detectados por ambos jueces (desde perspectivas distintas) son altamente fiables.

## Perfiles de Simulación

### Razonator: Perfiles Analíticos

#### Perfil A1: "Novato Lento" (2-3 jugadores)
- **Roles:** Todos novatos, nadie lidera naturalmente
- **Dinámica:** Cautelosos, leen todo dos veces, miedo a equivocarse
- **Nivel:** bajo (primer escape room)
- **Tendencia:** Over-thinking, no prueban cosas por miedo a "hacerlo mal"
- **Ventaja:** Lectura atenta, no se saltan detalles
- **Debilidad:** Lentos, se bloquean si no hay instrucciones claras, no prueban por ensayo-error
- **Tiempos típicos:** 30-50% más lentos que el diseño en todas las pruebas

#### Perfil A2: "Experimentado Metódico" (4 jugadores)
- **Roles:** 1 líder organizado + 3 que siguen sistema
- **Dinámica:** Sistemáticos, dividen y conquistan con plan, comunican hallazgos
- **Nivel:** alto (10+ escape rooms)
- **Tendencia:** Optimizan tiempo, buscan patrones, esperan "tricks" del diseñador
- **Ventaja:** Eficientes, buena comunicación, reconocen mecánicas conocidas
- **Debilidad:** Over-complican puzzles simples, buscan complejidad donde no la hay
- **Tiempos típicos:** 10-20% más rápidos en mecánicas conocidas, similares en novedosas

#### Perfil A3: "Experto Crítico" (2-4 jugadores)
- **Roles:** Jugadores hardcore que evalúan calidad del diseño
- **Dinámica:** Analizan cada decisión de diseño, comparan con mejores experiencias
- **Nivel:** experto (50+ escape rooms, posibles designers)
- **Tendencia:** Señalan inconsistencias lógicas, evalúan calidad de "aha moments"
- **Ventaja:** Detectan flaws que otros no ven, feedback técnico valioso
- **Debilidad:** No representan al jugador promedio, pueden ser demasiado duros
- **Tiempos típicos:** Más rápidos en general, pero se detienen a analizar

### Visionator: Perfiles Experienciales

#### Perfil B1: "Novato Ansioso" (3-4 jugadores)
- **Roles:** Amigos primerizos nerviosos, uno pagó y arrastra a los demás
- **Dinámica:** Tensión entre ganas de gustar y miedo a fracasar, se presionan mutuamente
- **Nivel:** bajo (primer escape room, no eligieron ir voluntariamente)
- **Tendencia:** Pánico cuando se atascan, pedir pistas pronto, celebrar excesivamente los éxitos
- **Ventaja:** Entusiasmo genuino, experiencia emocional intensa
- **Debilidad:** Se rinden rápido, no piensan bajo presión, frustración acumulativa
- **Tiempos típicos:** 40-60% más lentos, piden pista en cuanto pasan 3 min sin progreso

#### Perfil B2: "Adolescente Impulsivo" (4-6 jugadores, 14-17 años)
- **Roles:** Líderes naturales emergentes, competencia interna, mucho ruido
- **Dinámica:** Alta energía, prisa por terminar, se saltan textos, prueban todo por fuerza bruta
- **Nivel:** medio (digitales nativos, poca paciencia)
- **Tendencia:** No leen instrucciones, tocan todo sin pensar, se distraen entre ellos
- **Ventaja:** Rápidos, creativos, no tienen miedo a probar
- **Debilidad:** Zero paciencia, se pierden detalles sutiles, abandonan si algo "es aburrido"
- **Tiempos típicos:** 20% más rápidos en acción, 40% más lentos en puzzles de lectura

#### Perfil B3: "Adulto Pragmático" (3-5 jugadores, 35-55 años)
- **Roles:** Padres/compañeros de trabajo, uno organizó el plan
- **Dinámica:** Prácticos, buscan la solución más directa, no quieren "perder el tiempo"
- **Nivel:** bajo-medio (2-3 escape rooms, lo hacen como actividad social)
- **Tendencia:** Preguntan "¿para qué sirve esto?" constantemente, quieren feedback de progreso
- **Ventaja:** Pensamiento práctico, buena comunicación, persistencia tranquila
- **Debilidad:** Frustración con lo "incomprensible", impaciencia con mecánicas abstractas
- **Tiempos típicos:** Similar al diseño si el flujo es claro, +30% si hay momentos confusos

## Paso 1: Launch Paralelo

Lanzar ambos jueces como **agentes independientes** con `sessions_spawn`:

```
sessions_spawn(agentId=razonator, task:
  "Lee skills/pipeline-playtest/SKILL.md para entender la mecánica de simulación.
   Lee los archivos del juego: DESIGN.json, CONCEPT.json, juego/diseño/DISEÑO-JUEGO.md, juego/narrativa/NARRATIVA.md.
   
   Simula TRES perfiles analíticos paso a paso:
   - A1: Novato Lento (2-3 jugadores, primer escape room, cautos y over-thinkers)
   - A2: Experimentado Metódico (4 jugadores, 10+ rooms, sistemáticos)
   - A3: Experto Crítico (2-4 jugadores, 50+ rooms, evalúan calidad)
   
   Para cada perfil, simula la partida completa: entrada → cada prueba → salida.
   Registra tiempos estimados, hints necesarios, block risks, frustration moments.
   
   Escríbelo en agents/escapeitor/.pipeline/{juego-id}/playtests/PLAYTEST-A.json"
)

sessions_spawn(agentId=visionator, task:
  "Lee skills/pipeline-playtest/SKILL.md para entender la mecánica de simulación.
   Lee los archivos del juego: DESIGN.json, CONCEPT.json, juego/diseño/DISEÑO-JUEGO.md, juego/narrativa/NARRATIVA.md.
   
   Simula TRES perfiles experienciales paso a paso:
   - B1: Novato Ansioso (3-4 jugadores, primerizos nerviosos)
   - B2: Adolescente Impulsivo (4-6 jugadores, 14-17 años, alta energía)
   - B3: Adulto Pragmático (3-5 jugadores, 35-55 años, prácticos)
   
   Para cada perfil, simula la partida completa: entrada → cada prueba → salida.
   Registra tiempos estimados, hints necesarios, block risks, frustration moments.
   
   Escríbelo en agents/escapeitor/.pipeline/{juego-id}/playtests/PLAYTEST-B.json"
)
```

Ambos en paralelo. Esperar AMBOS antes de continuar a Paso 2.

**REGLA CRÍTICA**: Cada juez NO ve el output del otro. Simulación 100% independiente.

**Los jueces son agentes con modelo fijo en config** — Escapeitor no necesita especificar modelo.

## Paso 2: Synthesis (Escapeitor orquesta)

Escapeitor lee `PLAYTEST-A.json` y `PLAYTEST-B.json` y cruza los findings directamente.

### Clasificación de Issues

| Clasificación | Definición | Acción |
|---------------|-----------|--------|
| **CRITICAL** | Ambos jueces detectan el mismo issue (o equivalente) | Alta confianza → debe corregirse antes de Verify |
| **WARNING** | Solo un juez detecta el issue | Baja confianza → investigar, posible fix |
| **DIVERGENCE** | Un juez reporta issue, el otro reporta que funciona bien | Contexto-dependiente → evaluar caso a caso |

### Prompt Template para Synthesis

```
Eres un QA lead de escape rooms. Tienes dos reports de playtest de LLMs diferentes:

## PLAYTEST A (GLM-5.1 — Perfiles Analíticos: Novato Lento, Experimentado Metódico, Experto Crítico)
{PLAYTEST-A.json completo}

## PLAYTEST B (GPT-5.5 — Perfiles Experienciales: Novato Ansioso, Adolescente Impulsivo, Adulto Pragmático)
{PLAYTEST-B.json completo}

## CONCEPT Y DISEÑO
{CONCEPT.json + DESIGN.json resumen}

## TAREA
Cruza los findings de ambos jueces:

1. **Identificar todos los issues** de cada report (block_risk, flow_break, hint_dependency, time_mismatch, frustration, dead_end)
2. **Clasificar cada issue**:
   - CRITICAL: ambos jueces detectaron el mismo problema (o equivalente desde distintas perspectivas) → alta fiabilidad
   - WARNING: solo un juez lo detectó → puede ser específico del perfil o un issue real
   - DIVERGENCE: un juez reporta problema, el otro no → puede depender del tipo de jugador
3. **Para CRITICAL**: generar sugerencia concreta de corrección
4. **Para WARNING**: incluir recomendación (fix/monitor/accept)
5. **Para DIVERGENCE**: indicar qué perfiles se verían afectados
6. **Calcular veredicto global**

Criterios de veredicto:
- Todos los perfiles completan sin ayuda o con ≤2 hints c/u → pass
- Al menos 1 perfil se bloquea sin hint → pass_with_concerns
- Algún perfil no puede completar incluso con hints → fail

Genera PLAYTEST-REPORT.json final.
```

## Paso 3: Guardar

1. Guardar `PLAYTEST-A.json` en `agents/escapeitor/.pipeline/{juego-id}/playtests/PLAYTEST-A.json`
2. Guardar `PLAYTEST-B.json` en `agents/escapeitor/.pipeline/{juego-id}/playtests/PLAYTEST-B.json`
3. Guardar `PLAYTEST-REPORT.json` (final) en `agents/escapeitor/.pipeline/{juego-id}/PLAYTEST-REPORT.json`

## Estructura de PLAYTEST-REPORT.json (output final)

```json
{
  "id": "playtest_{YYYY-MM-DD}_{juego-slug}",
  "game_ref": "{juego-slug}",
  "timestamp": "ISO-8601",
  "dual_llm": true,
  "profiles_tested": ["novato_lento", "experimentado_metodico", "experto_critico", "novato_ansioso", "adolescente_impulsivo", "adulto_pragmatico"],
  "summary": {
    "total_profiles": 6,
    "completed_without_help": 4,
    "completed_with_hints": 2,
    "blocked_at": null,
    "overall_verdict": "pass"
  },
  "critical_findings": [
    {
      "type": "block_risk|flow_break|hint_dependency|time_mismatch|frustration|dead_end",
      "classification": "CRITICAL|WARNING|DIVERGENCE",
      "location": "P4",
      "description": "Descripción concreta del problema",
      "affected_profiles": ["novato_lento", "novato_ansioso"],
      "judge_a_detected": true,
      "judge_b_detected": true,
      "severity": "high|medium|low",
      "suggestion": "Sugerencia concreta para corregir"
    }
  ],
  "warnings": [
    {
      "type": "...",
      "source_judge": "judge_a|judge_b",
      "location": "P2",
      "description": "Solo un juez detectó esto",
      "affected_profiles": ["experto_critico"],
      "recommendation": "fix|monitor|accept"
    }
  ],
  "divergences": [
    {
      "topic": "Puzzle P3 claridad",
      "judge_a_position": "El Experto Crítico señala que la mecánica es confusa",
      "judge_b_position": "El Adolescente Impulsivo lo resolvió por fuerza bruta sin problema",
      "resolution": "Funciona para jugadores que prueban todo, confuso para analíticos",
      "recommendation": "Añadir una pista visual sutil sin revelar la solución"
    }
  ],
  "profiles_summary": {
    "novato_lento": {"completed": true, "time_delta": "+40%", "hints": 3, "block_risk": "medium"},
    "experimentado_metodico": {"completed": true, "time_delta": "-10%", "hints": 0, "block_risk": "none"},
    "experto_critico": {"completed": true, "time_delta": "+5%", "hints": 0, "block_risk": "none"},
    "novato_ansioso": {"completed": true, "time_delta": "+35%", "hints": 4, "block_risk": "high"},
    "adolescente_impulsivo": {"completed": true, "time_delta": "+15%", "hints": 1, "block_risk": "low"},
    "adulto_pragmatico": {"completed": true, "time_delta": "+20%", "hints": 2, "block_risk": "low"}
  },
  "recommendations": [
    "Recomendación concreta 1",
    "Recomendación concreta 2"
  ],
  "synthesis_stats": {
    "critical": 1,
    "warning": 3,
    "divergence": 2
  }
}
```

## Veredicto

| Condición | Veredicto |
|-----------|-----------|
| Todos los perfiles completan sin ayuda o con ≤2 hints c/u, 0 CRITICAL | ✅ `pass` |
| CRITICAL encontrado pero todos completan con ayuda, o algunos perfiles necesitan 3+ hints | ⚠️ `pass_with_concerns` |
| Algún perfil no puede completar incluso con hints disponibles | ❌ `fail` |

## Reglas

1. **Ser implacable**: No ser indulgente. Si un puzzle es confuso, decirlo.
2. **Perfiles realistas**: Basarse en cómo juega la gente real.
3. **Cada perfil es independiente**: Simular cada uno como partida real separada.
4. **Referenciar elementos concretos**: "El cipher de P4 usa símbolos que no aparecen en ningún lado" no "el puzzle es confuso".
5. **Time delta**: Siempre calcular diferencia entre tiempo estimado real vs diseño. Delta > +50% es alerta.
6. **Block risk levels**: `none`, `low`, `medium`, `high` (se bloquean sin hint del GM).
7. **Independencia**: los jueces NO comparten output. Cada uno simula sus 3 perfiles sin ver el resultado del otro.
8. **Cruce de findings**: Un issue detectado por ambos jueces (desde perfiles distintos) es CRITICAL y debe corregirse.

## Integración Pipeline

Este skill se ejecuta **entre Build (fase 4) y Verify (fase 5)**.

Si `overall_verdict = "fail"` → los findings se pasan a Build para corrección antes de Verify.
Si `overall_verdict = "pass_with_concerns"` → los recommendations se pasan como sugerencias a Verify.
Si `overall_verdict = "pass"` → continuar a Verify normalmente.

## Agentes Utilizados

- `razonator` (GLM-5.1) — Agente independiente con modelo fijo en config
- `visionator` (GPT-5.5) — Agente independiente con modelo fijo en config
- Ambos son subagentes permitidos de Escapeitor
