---
name: prueba-logica-secuencial
description: "Trigger: secuencia, patron, serie, orden correcto, patron deducible, siguiente elemento. Puzzles donde el orden de elementos importa y sigue una logica deducible."
---

# Prueba Logica Secuencial

## Activation Contract

**Use when:** Secuencia/patron/serie/orden correcto, elementos deben ordenarse segun logica implicita, deducir siguiente elemento o completar progresion. Tipos: numerica, alfabetica, visual, temporal, mixta.

**Don't use when:** Orden arbitrario sin regla deducible (es adivinanza), secuencia obvia tipo 1-2-3-4 (trivial), multiples ordenes validos (frustracion).

## Hard Rules

- **NO** `longitud_secuencia > 7` sin validacion parcial (carga cognitiva)
- **NO** multiples criterios ambiguos (por tamano O por color?)
- **WARN** `distraction_elements > 2` (confusion excesiva)
- **Max time before GM intervention:** 10-12 min

## Decision Gates

| Nivel | Elementos | Regla | Distractores | Tiempo |
|-------|-----------|-------|-------------|--------|
| Facil | 3-4 | Obvia (1-2-3-4, ABCD) | 0 | 3-5min |
| Estandar | 5-6 | Implicita deducible | 1 | 8-12min |
| Dificil | 6-8 | Compleja (Fibonacci, primos) | 2 | 12-18min |
| Extrema | 8-10 | Multi-criterio | 3+ | 20+min |

## Execution Steps

1. Elegir `tipo_secuencia` (numerica, alfabetica, visual, temporal)
2. Definir regla (debe ser deducible, unica solucion)
3. Configurar `longitud_secuencia` y `elemento_faltante`
4. Anadir distractores si aplica
5. Preparar validacion y pistas

## Output Contract

Tipo de secuencia, elementos, regla, solucion, formato de respuesta, pistas progresivas.

## References

- `references/variables.md` — Variables, tipos, errores, adaptaciones, ejemplos
