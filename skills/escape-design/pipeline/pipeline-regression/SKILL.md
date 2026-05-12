---
name: pipeline-regression
description: Cuando se modifica un escape room existente, verifica que los cambios no rompieron nada que ya funcionaba. Compara versión anterior vs nueva, analiza regresiones de score, verifica integridad de la cadena de pruebas, y ejecuta solo las re-verificaciones necesarias.
---

# Pipeline Regression — Testing de Regresión

Verifica que las modificaciones a un escape room existente no rompieron funcionalidad que ya funcionaba. Compara baseline anterior vs estado actual.

> ⏱️ Tiempo estimado: ~2-4 min (depende de cantidad de cambios).

## Input

- `{output_dir}/BASELINE-{version}.json` — Snapshot anterior (si existe)
- `juegos/{juego}/` — Estado actual del juego
- `DESIGN.json` — Diseño estructurado actual
- Reports previos: `VERIFY-REPORT.json`, `JUDGMENT-REPORT.json`, `PLAYTEST-REPORT.json`, `DIFFICULTY-REPORT.json`, `NARRATIVE-CONSISTENCY-REPORT.json`

## Cuándo Ejecutar

- **Al inicio del pipeline** si existe un BASELINE previo (es una modificación, no creación nueva).
- **Si no hay baseline** → saltar esta fase (juego nuevo, no hay nada que regredir).
- **Después de cada iteración** del pipeline (Design → Build → Verify → Judge) para detectar regresiones inmediatas.

## Mecánica

### 1. Baseline Capture

Al pasar Verify o Judgment Day por primera vez, guardar un snapshot:

```json
{
  "game_ref": "{juego-slug}",
  "version": "v1.0",
  "timestamp": "ISO-8601",
  "verify_report": { "..." : "..." },
  "judgment_report": { "..." : "..." },
  "narrative_consistency_report": { "..." : "..." },
  "playtest_report": { "..." : "..." },
  "difficulty_report": { "..." : "..." },
  "puzzle_summary": [
    {"prueba": "P1", "type": "cipher", "difficulty": 3, "connections": ["P2"]},
    {"prueba": "P2", "type": "physical", "difficulty": 4, "connections": ["P1", "P3"]}
  ]
}
```

Guardar en: `{output_dir}/BASELINE-{version}.json`

### 2. Diff Analysis

Cargar baseline más reciente y comparar con estado actual:

**Por cada prueba:**
- ¿Se **eliminó** alguna prueba? → Verificar que no rompe la cadena de recompensas
- ¿Se **cambió el tipo** de puzzle? → Flag para re-verificar con Verify
- ¿Se **cambió la dificultad**? → Flag para re-verificar con Difficulty Calibration
- ¿Se **cambió la conexión** entre pruebas? → Flag para re-verificar flujo completo
- ¿Se **añadió** nueva prueba? → Verificar integración con existentes

**Comparar scores:**
- Score bajó >1 punto en cualquier área → WARNING
- Score bajó >2 puntos → CRITICAL regression
- Score subió → log como improvement

### 3. Chain Integrity

Verificar que la cadena de recompensas sigue completa:

- Cada prueba debe recibir al menos 1 input de otra prueba (excepto P1)
- Cada prueba debe entregar al menos 1 output a otra prueba (excepto última)
- No hay "islas" (pruebas sin conectar al flujo principal)
- No hay links rotos (prueba A entrega a prueba B que ya no existe)

### 4. Selective Re-Verification

Solo re-ejecutar las fases afectadas por los cambios:

| Tipo de cambio | Re-verificaciones necesarias |
|----------------|------------------------------|
| Cambió narrativa | Narrative Consistency + JudgeStory |
| Cambió puzzles (tipo/mecánica) | Verify + JudgeLogic + Playtest |
| Cambió dificultad | Difficulty Calibration |
| Cambió conexiones entre pruebas | Verify + Playtest |
| Cambió todo | Pipeline completo |

### 5. Cross-Game Regression ⚠️ NUEVO

Comparar el diseño del juego nuevo contra los juegos reales completados que tienen playtest reports.

```bash
# Buscar juegos con perfil similar
python3 scripts/search-games.py --similar "[tema]" --pretty
python3 scripts/search-games.py --difficulty [min]-[max] --pretty
```

**Comparar contra juegos reales:**

1. **Curva de dificultad**: ¿La curva del nuevo juego es similar a los juegos que funcionaron bien? Si los juegos exitosos tienen curva 3→4→5→4 y el nuevo tiene 2→7→3→8, hay un problema.

2. **Variedad de mecánicas**: Contar mecánicas únicas en el nuevo juego vs. los juegos reales. Si los juegos reales usan 5-6 mecánicas distintas y el nuevo solo 3, falta variedad.

3. **Tiempos estimados**: Comparar la duración total de puzzles del nuevo juego contra los juegos reales. Si los juegos reales de 50 min tienen ~35 min de puzzles y ~15 min de transiciones, el nuevo debería mantener esa proporción.

4. **Playtest scores**: Si un juego real con temática similar tuvo problemas en ciertos tipos de puzzle (documentado en playtest-report.json), verificar que el nuevo juego no repite el mismo patrón.

5. **Patrones de diseño**: Verificar que el nuevo juego cumple los patrones probados:
   - Mínimo 1 puzzle cooperativo (como en Legado Tinta Violeta, Legado de la Familia)
   - No más de 2 puzzles del mismo tipo (como en todos los juegos existentes)
   - Hilo conductor acumulativo entre pruebas (como en todos los juegos del proyecto)

**Output:** Añadir al REGRESSION-REPORT.json:

```json
{
  "cross_game_regression": {
    "games_compared": ["el-legado-de-la-familia", "protocolo-alerta-verde"],
    "difficulty_curve_delta": "+1.2 (new game is harder than average)",
    "mechanic_variety_score": "6 unique / 7 puzzles (within normal range)",
    "time_distribution": "38min puzzles / 12min transitions (healthy ratio)",
    "warnings": ["P4 difficulty 7 is 2 points above the highest difficulty in any reference game"],
    "patterns_checked": {
      "has_cooperative_puzzle": true,
      "max_same_type": 2,
      "has_hilo_conductor": true
    }
  }
}
```

## Output

Escribir resultado en `REGRESSION-REPORT.json`:

```json
{
  "id": "regression_2026-04-07_{juego-slug}",
  "game_ref": "{juego-slug}",
  "baseline_version": "v1.0",
  "current_version": "v2.0",
  "timestamp": "ISO-8601",
  "changes_detected": {
    "added": [],
    "modified": ["P3", "P6"],
    "removed": [],
    "unchanged": ["P1", "P2", "P4", "P5"]
  },
  "chain_integrity": {
    "complete": true,
    "broken_links": [],
    "orphan_tests": []
  },
  "score_delta": {
    "overall": -0.3,
    "story": 0,
    "logic": -0.5
  },
  "regressions": [
    {
      "area": "P3 logic",
      "previous_score": 8.0,
      "current_score": 7.5,
      "delta": -0.5,
      "reason": "Simplificación del cipher redujo complejidad pero también satisfacción"
    }
  ],
  "improvements": [],
  "re_verification_needed": {
    "narrative_consistency": false,
    "verify": true,
    "judge_story": false,
    "judge_logic": true,
    "playtest": true,
    "difficulty_calibration": false
  },
  "verdict": "pass|pass_with_concerns|fail"
}
```

## Veredicto

| Condición | Veredicto |
|-----------|-----------|
| Sin regresiones, cadena intacta | ✅ `pass` |
| ≤1 regresión minor (delta ≤1.0), cadena intacta | ⚠️ `pass_with_concerns` |
| Cadena rota O ≥1 regresión major (delta >1.0) | ❌ `fail` |

## Reglas

1. **Eficiencia**: No re-ejecutar fases no afectadas. Si solo cambió la narrativa de P3, no hace falta re-verificar puzzles de P1.
2. **Baseline versioning**: Cada vez que un juego pasa el pipeline completo con verdict pass, actualizar el BASELINE.
3. **Score tracking**: Los scores provienen de los reports existentes (Verify scores, Judgment scores, Difficulty scores). No re-evaluar, solo comparar.
4. **Chain integrity es hard fail**: Si la cadena de recompensas está rota (una prueba sin input o sin output), siempre es `fail` sin importar los scores.
5. **Referenciar cambios concretamente**: "P3 cambió de cipher a manipulation" no "hubo cambios en P3".
6. **No duplicar trabajo**: Si Regression indica que Verify necesita re-ejecutarse, los findings de Regression se pasan como contexto a Verify para que priorite las áreas afectadas.
7. **Baseline inexistente**: Si no hay BASELINE para el juego, output `verdict: "skip"` con `reason: "No baseline found — new game or first run"`.

## Integración Pipeline

Este skill se ejecuta **al inicio del pipeline** (fase 0.5, después de Explore):

1. Si existe BASELINE → ejecutar Regression → si `fail` → mostrar a Daniel antes de continuar
2. Si no existe BASELINE → saltar (juego nuevo)

Si `verdict = "fail"` → detener pipeline y escalar a Daniel con el `REGRESSION-REPORT`.
Si `verdict = "pass_with_concerns"` → continuar pipeline con las re-verificaciones indicadas en `re_verification_needed`.
Si `verdict = "pass"` o `"skip"` → continuar pipeline normalmente.
