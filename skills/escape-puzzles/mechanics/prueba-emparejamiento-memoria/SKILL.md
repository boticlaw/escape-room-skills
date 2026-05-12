---
name: prueba-emparejamiento-memoria
description: "Trigger: emparejar, llaves cerraduras, asociar pares, recordar secuencia, matching memoria. Asociar pares de elementos y recordar secuencia para reproducirla."
---

# Prueba Emparejamiento Memoria

## Activation Contract

**Use when:** Asociar elementos de dos conjuntos (llaves-cerraduras, codigos-destinos), recordar y reproducir secuencia tras emparejar, combina deduccion + memoria a corto plazo.

**Don't use when:** Solo asociacion sin memoria (`prueba-emparejamiento-texto`), mas de 7-8 pares (sobrecarga), pura prueba y error sin logica (frustrante).

## Hard Rules

- **NO** `numero_pares > 5` + `requiere_secuencia=true` en publico general
- **WARN** `permitir_errores=false` (muy punitivo)
- **REGLA:** Numero de elementos entre 3 y 7 para memoria funcional
- **Max time before GM intervention:** 12 min

## Decision Gates

| Nivel | Pares | Secuencia | Errores | Tiempo |
|-------|-------|-----------|---------|--------|
| Facil | 3 | No | Infinitos | 3-5min |
| Estandar | 5 | Si | Infinitos | 5-10min |
| Dificil | 7 | Si | 3 max | 10-15min |
| Extrema | 7+ similares | Si | Penalizacion | 15+min |

## Execution Steps

1. Definir pares y logica de asociacion
2. Decidir si requiere secuencia posterior
3. Documentar solucion completa (emparejamientos + secuencia)
4. Incluir feedback claro de acierto/error

## Output Contract

Pares, tipo de elementos, emparejamientos correctos, secuencia final, codigo recompensa, pistas progresivas.

## References

- `references/variables.md` — Variables, errores, adaptaciones, ejemplo
