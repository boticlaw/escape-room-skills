---
name: prueba-logica-posiciones
description: "Trigger: posiciones, quien esta donde, restricciones logicas, mesa circular, deduccion espacial. Deduce posiciones basandose en multiples restricciones relacionales."
---

# Prueba Logica Posiciones

## Activation Contract

**Use when:** Deducir posiciones con restricciones logicas ("A junto a B", "C no al lado de D"), combinar multiples pistas relacionales, solucion unica. Tipos: lineal, circular, matriz.

**Don't use when:** Mas de 7-8 restricciones (sobrecarga), solucion ambigua multiples ordenes validos, restricciones muy abstractas sin sistematizar.

## Hard Rules

- **NO** `numero_elementos > 6` + `numero_restricciones < 5`
- **WARN** `tipo_disposicion="circular"` sin imagen de referencia
- **REGLA:** Exactamente una solucion valida
- **Max time before GM intervention:** 15 min

## Decision Gates

| Nivel | Elementos | Restricciones | Tipo | Tiempo |
|-------|-----------|--------------|------|--------|
| Facil | 4-5 | 3-4 directas | Lineal | 5-8min |
| Estandar | 6-7 | 5-6 | Circular/mesa | 10-15min |
| Dificil | 7-8 | 7-8 complejas + negacion | Compleja | 15-25min |
| Extrema | 8+ | Interdependientes | Multiple | 25+min |

## Execution Steps

1. Definir elementos y disposicion (lineal, circular, matriz)
2. Redactar restricciones sin ambiguedad
3. Verificar solucion unica
4. Incluir imagen de referencia de la disposicion
5. Preparar pista con solucion parcial

## Output Contract

Elementos, disposicion, restricciones, solucion, elemento objetivo a identificar, imagen referencia, pistas progresivas.

## References

- `references/variables.md` — Variables, errores, adaptaciones, ejemplo concreto
