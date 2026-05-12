---
name: pipeline-difficulty-calibration
description: Ajusta automáticamente la dificultad de cada puzzle según el público objetivo del BRIEF. Calcula difficulty target, evalúa cada prueba contra parámetros objetivos y valida la curva de dificultad. Se ejecuta tras Design y antes de Build.
---

# Pipeline Difficulty Calibration — Calibración de Dificultad

Ajusta la dificultad de cada puzzle al público objetivo, eliminando la subjetividad del LLM con parámetros objetivos medibles.

> ⏱️ Tiempo estimado: ~2-3 min.

## Input

Leer estos archivos del proyecto:

- `CONCEPT.json` — Público objetivo (edad, experiencia, tamaño de grupo, duración)
- `DESIGN.json` — Diseño completo (pruebas, mecánicas, tiempos)
- `juego/diseño/DISEÑO-JUEGO.md` — Detalle de pruebas (opcional, para más contexto)

## Paso 1: Calcular Difficulty Target

Del BRIEF/CONCEPT extraer:
- Edad del público → nivel base
- Experiencia previa → multiplicador
- Tamaño de grupo → ajuste
- Duración deseada → puzzles totales estimados

### Perfil por edad

| Rango | Nivel base | Notas |
|-------|-----------|-------|
| 8-11 | Muy fácil (1-3) | Solo puzzles físicos, sin ciphers complejos, pistas muy explícitas |
| 12-14 | Fácil-Medio (2-4) | Ciphers simples (A=1), puzzles físicos + lógica básica |
| 15-17 | Medio (3-6) | Ciphers estándar, deducción, puzzles de varias capas |
| 18-25 | Medio-Alto (4-7) | Ciphers complejos, lógica avanzada, puzzles abstractos |
| 26-40 | Medio (3-6) | Similar a 18-25 pero con más paciencia para puzzles largos |
| 40+ | Medio (3-5) | Preferencia por puzzles lógicos claros, menos tolerancia a frustración |

### Multiplicador por experiencia

| Experiencia | Multiplicador | Notas |
|-------------|--------------|-------|
| Nunca han jugado | ×0.7 | Reducir complejidad un 30% |
| 1-3 escape rooms | ×0.85 | Reducir un 15% |
| 4-10 escape rooms | ×1.0 | Base |
| +10 escape rooms | ×1.2 | Aumentar complejidad un 20% |

### Ajuste por tamaño de grupo

| Tamaño | Efecto en max params | Notas |
|--------|---------------------|-------|
| 2 | +1 | Menos ojos, menos dividing tasks |
| 3-4 | 0 (base) | Ideal para escape rooms |
| 5-6 | -1 | Más ojos pero posible caos |
| 7+ | -2 | Necesitan puzzles que dividan al grupo |

### Cálculo de max params

Para cada parámetro, calcular: `max_param = round(nivel_base × multiplicador + ajuste_grupo)`

Límites: todos los max params entre 1 y 10.

**Niveles base por parámetro:**

| Parámetro | 8-11 | 12-14 | 15-17 | 18-25 | 26-40 | 40+ |
|-----------|------|-------|-------|-------|-------|-----|
| cognitive_load | 2 | 4 | 5 | 7 | 6 | 5 |
| physical_complexity | 3 | 4 | 5 | 6 | 5 | 4 |
| lateral_thinking | 1 | 3 | 4 | 6 | 5 | 4 |
| info_integration | 2 | 3 | 5 | 7 | 6 | 5 |
| time_pressure | 2 | 3 | 4 | 6 | 5 | 4 |
| cooperation_required | 3 | 4 | 5 | 6 | 6 | 5 |

**Max puzzle time** (por edad):

| Edad | Max min/puzzle |
|------|---------------|
| 8-11 | 6 |
| 12-14 | 8 |
| 15-17 | 10 |
| 18-25 | 12 |
| 26-40 | 12 |
| 40+ | 10 |

**Recommended total puzzles** = `duración_total_min / max_puzzle_time` (redondear, mínimo 4, máximo 8).

**Recommended hints per puzzle:**
| Experiencia | Hints/puzzle |
|-------------|-------------|
| Nunca | 2-3 |
| 1-3 rooms | 1-2 |
| 4-10 rooms | 1 |
| +10 rooms | 0-1 |

Output: `difficulty_target.json`

```json
{
  "id": "difficulty_target_2026-04-06_{juego-slug}",
  "game_ref": "{juego-slug}",
  "timestamp": "ISO-8601",
  "audience": "adolescentes 12-14",
  "age_range": [12, 14],
  "experience": "novatos",
  "group_size": [4, 6],
  "difficulty_level": "facil",
  "calculation": {
    "age_base": "12-14",
    "experience_multiplier": 0.7,
    "group_adjustment": -1
  },
  "max_cognitive_load": 3,
  "max_physical_complexity": 3,
  "max_lateral_thinking": 2,
  "max_info_integration": 2,
  "max_time_pressure": 2,
  "max_cooperation_required": 3,
  "max_puzzle_time_minutes": 8,
  "recommended_total_puzzles": 5,
  "recommended_hints_per_puzzle": 2
}
```

### Paso 1b: Calibrar contra curvas de dificultad reales

Verificar que la curva de dificultad propuesta es consistente con los juegos reales completados:

```bash
python3 scripts/search-games.py --difficulty 3-5 --pretty
```

**Comparar contra juegos reales:**

| Juego Real | Dificultad Objetivo | Curva Real (por prueba) | Resultado Playtest |
|------------|-------------------|------------------------|-------------------|
| El Legado de la Familia | 4/10 | 3→4→4→5→4→3 | ✅ Diversión 80, Frustración 0-5 |
| Legado Tinta Violeta | 4/10 | 3→3→4→5→5→4→3 | ✅ v4.1 estable |
| Protocolo Alerta Verde | 4/10 | (ver prueba JSONs) | ✅ Completo |

**Reglas de calibración:**
- Si el juego nuevo tiene dificultad pico > max(dificultad_pico_juegos_reales) + 1 → WARNING
- Si la dificultad del primer puzzle > 4 (cuando los juegos reales empiezan en 3) → WARNING
- Si la dificultad del último puzzle es la más alta (cuando en juegos reales el último es de recompensa) → WARNING
- Calibrar duración: si los juegos reales de dificultad 4 tienen 6-7 pruebas en 50 min, el nuevo debe mantener esa proporción

## Paso 2: Evaluar cada puzzle

Para cada prueba del escape room, evaluar los 6 parámetros (escala 1-10) y comparar contra el target.

### Definición de parámetros

| Parámetro | Descripción | 1-2 (Bajo) | 3-4 (Medio) | 5-6 (Alto) | 7-10 (Muy Alto) |
|-----------|-------------|------------|-------------|------------|-----------------|
| **cognitive_load** | Carga mental necesaria | Buscar objeto, abrir candado | Cipher simple (A=1), deducción directa | Cipher estándar (Caesar), cruzar 2 fuentes | Cipher complejo + multi-fuente |
| **physical_complexity** | Complejidad física | Abrir caja, pulsar botón | Insertar pieza, usar herramienta | Ensamblar 3+ piezas, manipulación precisa | Mecanismo multi-paso con 5+ piezas |
| **lateral_thinking** | Pensamiento lateral | Aplicar código a candado | Interpretar pista visual obvia | Conexión no evidente entre elementos | Metáfora/abstracción para encontrar ubicación |
| **info_integration** | Integrar varias fuentes | 1 fuente = 1 pista | 2 fuentes simples | 3 fuentes con cruces | 4+ fuentes con deducción cruzada |
| **time_pressure** | Dependencia del reloj | Sin presión | Tiempo holgado (no penaliza) | Si no resuelven pierden bonus | Si no resuelven en X min pierden oportunidad |
| **cooperation_required** | Trabajo en equipo necesario | 1 persona puede solo | 2 personas en paralelo | 2 personas simultáneas | 3+ personas coordinadas en tiempo real |

### Evaluación por prueba

```json
{
  "prueba": "P3",
  "name": "El código del laboratorio",
  "cognitive_load": 6,
  "physical_complexity": 3,
  "lateral_thinking": 4,
  "info_integration": 5,
  "time_pressure": 2,
  "cooperation_required": 3,
  "estimated_time": "10min",
  "status": "over_difficulty",
  "exceeds": ["cognitive_load", "info_integration"],
  "suggestions": [
    "Reducir cognitive_load: simplificar cipher (A=1 en vez de Caesar)",
    "Reducir info_integration: consolidar pistas en 1 documento en vez de 3"
  ]
}
```

### Status por prueba

| Condición | Status |
|-----------|--------|
| Todos los params ≤ max | `within_target` |
| Algún param > max | `over_difficulty` |
| Todos los params ≤ max-2 | `under_difficulty` |

### Sugerencias automáticas

Si un parámetro excede el target, generar sugerencias concretas basadas en el tipo de puzzle:

**cognitive_load over:**
- Simplificar cipher (A=1 en vez de Caesar)
- Reducir pasos de deducción
- Hacer la pista más directa/explicita

**physical_complexity over:**
- Reducir piezas del mecanismo
- Eliminar manipulación fina
- Usar un candado estándar en vez de custom

**lateral_thinking over:**
- Añadir pista directa que indique la conexión
- Eliminar la metáfora/abstracción
- Hacer el salto lógico más corto

**info_integration over:**
- Consolidar fuentes en 1-2 documentos
- Añadir pista que vincule las fuentes
- Reducir datos a cruzar

**time_pressure over:**
- Convertir penalización en bonus
- Aumentar tiempo límite o eliminarlo
- Añadir pista de "último momento" si se acercan al límite

**cooperation_required over:**
- Reducir a 2 personas simultáneas
- Añadir modo alternativo para 1 persona
- Eliminar dependencia de coordinación temporal

## Paso 3: Difficulty Curve Analysis

Calcular el `difficulty_score` promedio por prueba: `mean(cognitive_load, physical_complexity, lateral_thinking, info_integration, time_pressure, cooperation_required)`.

Verificar que la curva sigue un patrón saludable:

### Patrón ideal: Warm-up → Build → Climax → Resolution

| Posición | Patrón esperado | Rango del score |
|----------|----------------|-----------------|
| P1 (primera) | Warm-up bajo | target × 0.4-0.6 |
| P2 | Sube ligeramente | target × 0.6-0.8 |
| P3 | Build intermedio | target × 0.7-0.9 |
| P4-Pn-1 | Climax | target × 0.9-1.0 |
| Pn (última) | Resolution (alto pero satisfactorio) | target × 0.8-1.0 |

### Patrones a detectar

| Patrón | Condición | Severidad |
|--------|-----------|-----------|
| ❌ **Flat** | Desviación estándar de scores < 0.5 | Media — juego monótono |
| ❌ **Spike early** | P1 o P2 tiene el score más alto | Alta — frustración inmediata |
| ❌ **No climax** | No hay ningún puzzle ≥ target × 0.9 | Media — falta momento memorable |
| ❌ **Dip at end** | Último puzzle es el más fácil | Media — final anticlimático |
| ✅ **Healthy** | Progresión gradual con climax claro | — |

## Paso 4: Generar Difficulty Report

Output: `DIFFICULTY-REPORT.json`

```json
{
  "id": "difficulty_2026-04-06_{juego-slug}",
  "game_ref": "{juego-slug}",
  "timestamp": "ISO-8601",
  "difficulty_target": {
    "audience": "...",
    "max_cognitive_load": 5,
    "max_physical_complexity": 4,
    "max_lateral_thinking": 3,
    "max_info_integration": 4,
    "max_time_pressure": 3,
    "max_cooperation_required": 5,
    "max_puzzle_time_minutes": 8,
    "recommended_total_puzzles": 5,
    "recommended_hints_per_puzzle": 2
  },
  "puzzles": [
    {
      "prueba": "P1",
      "name": "...",
      "cognitive_load": 3,
      "physical_complexity": 2,
      "lateral_thinking": 2,
      "info_integration": 2,
      "time_pressure": 1,
      "cooperation_required": 2,
      "estimated_time": "5min",
      "difficulty_score": 2.0,
      "status": "within_target",
      "exceeds": [],
      "suggestions": []
    }
  ],
  "summary": {
    "total_puzzles": 6,
    "within_target": 4,
    "over_difficulty": 1,
    "under_difficulty": 1,
    "estimated_total_time": "52min",
    "target_time": "45min",
    "time_delta": "+7min"
  },
  "difficulty_curve": {
    "pattern": "healthy|flat|spike_early|no_climax|dip_at_end",
    "scores": [
      {"prueba": "P1", "difficulty_score": 2.0, "ideal_zone": true},
      {"prueba": "P2", "difficulty_score": 3.8, "ideal_zone": true},
      {"prueba": "P3", "difficulty_score": 6.2, "ideal_zone": false}
    ],
    "curve_issues": []
  },
  "verdict": "pass|pass_with_adjustments|fail",
  "adjustments_needed": [
    {
      "prueba": "P3",
      "parameter": "cognitive_load",
      "current": 6,
      "target_max": 5,
      "suggestion": "Simplificar cipher de Caesar a A=1"
    }
  ]
}
```

### Veredicto

| Condición | Veredicto |
|-----------|-----------|
| Todos los puzzles within target + curva healthy | ✅ `pass` |
| ≤2 puzzles fuera del target + curva aceptable (no spike_early) | ⚠️ `pass_with_adjustments` |
| >2 puzzles fuera del target O curva rota (spike_early o flat) | ❌ `fail` |

## Output

Escribir en el directorio del juego:

- `doc/pipeline/DIFFICULTY-REPORT.json` — Reporte completo
- `doc/pipeline/difficulty_target.json` — Target calculado (reutilizable para recalibrar)

## Integración Pipeline

Este skill se ejecuta **entre Design (fase 3) y Build (fase 4)**, como fase 3b.

### Si verdict = `pass` → continuar a Build.
### Si verdict = `pass_with_adjustments` → pasar adjustments a Build como contexto adicional.
### Si verdict = `fail` → volver a Design con el DIFFICULTY-REPORT. Máx 1 iteración del ciclo Design → Difficulty Calibration.

## Modo Recalibración

Este skill puede ejecutarse de forma independiente sobre un juego existente:

1. Leer `CONCEPT.json` + `DESIGN.json` del juego existente.
2. Ejecutar Paso 1-4 normalmente.
3. Output: `DIFFICULTY-REPORT.json` con ajustes sugeridos.
4. No modifica el diseño automáticamente — genera el reporte para revisión.

Uso: `recalibrar dificultad de {juego}` o cuando Daniel quiera adaptar un juego existente a un público diferente.

## Reglas

1. **Valores realistas**: Basarse en escape rooms reales. Un cipher Caesar es cognitive_load 5, no 8. Un candado de 4 dígitos es cognitive_load 3.
2. **La curva importa tanto como los valores**: Un juego con todos los puzzles en target pero curva flat es `pass_with_adjustments`, no `pass`.
3. **Sugerencias concretas**: Nunca decir "simplificar el puzzle". Decir "reemplazar cipher Caesar con A=1 (B=2, C=3...)".
4. **El público manda**: Si el brief dice 12-14 años novatos, NO aceptar puzzles con cognitive_load >4. Punto.
5. **No sobre-ajustar**: Si un puzzle está under_difficulty en 1 parámetro, no forzarlo al máximo. Under_difficulty en 1-2 parámetros es aceptable si la curva es saludable.
6. **Time delta**: Si el tiempo estimado total excede la duración del brief en >15%, reportar como ajuste necesario.
7. **Respetar diseño narrativo**: No sugerir cambios que rompan la historia. Si un puzzle complejo es clave narrativo, sugerir añadir pistas en vez de simplificar.
