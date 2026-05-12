---
name: prueba-mecanismo
description: "Trigger: mecanismo fisico, candados, interruptores, secuencia, combinacion, alineacion, balanza. Manipulacion fisica de objetos con feedback inmediato."
---

# Prueba Mecanismo

## Activation Contract

**Use when:** Manipulacion fisica (girar, pulsar, colocar, alinear), feedback inmediato tangible (luz, sonido, apertura), candados/interruptores/balanzas/sistemas de peso. Tipos: secuencia, combinacion, alineacion, peso, multi_candado.

**Don't use when:** Solo simulacion digital sin tacto (usar `prueba-digital-interfaz`), puramente cognitivo sin manipulacion (usar `prueba-logica-*`).

## Hard Rules

- **NO** `tipo_mecanismo="peso"` sin objetos de peso diferenciado claro
- **NO** `reintentos < 3` con mecanismos complejos (desanimo temprano)
- **WARN** `tolerancia < 5` grados en alineacion (puede ser imposible)
- **WARN** `numero_elementos > 6` sin feedback parcial (sobrecarga cognitiva)
- **Max time before GM intervention:** 8-12 min

## Decision Gates

| Nivel | Elementos | Feedback | Pistas | Tiempo |
|-------|-----------|----------|--------|--------|
| Facil | 2-3 | Progresivo completo | Orden implicito evidente | 5-8min |
| Estandar | 3-4 | Al completar | Requiere deduccion | 10-15min |
| Dificil | 4-6 | Sin feedback parcial | Cripticas + distractores | 15-22min |
| Extrema | 6-8 | Ninguno | Sin pistas + tiempo limite | 25+min |

## Execution Steps

1. Elegir `tipo_mecanismo` (secuencia, combinacion, alineacion, peso, multi_candado)
2. Configurar `numero_elementos` y variables especificas del tipo
3. Definir solucion (secuencia, combinacion, pesos, alineacion)
4. Decidir `feedback_tipo` (luz, sonido, apertura, combinado)
5. Preparar pistas progresivas y override del GM

## Output Contract

Output incluye: tipo de mecanismo, configuracion de elementos, solucion correcta, tipo de feedback, pistas progresivas.

## References

- `references/variables.md` — Variables principales y por tipo de mecanismo
- `references/difficulty-scale.md` — Detalle completo de niveles
- `references/adaptations.md` — Adaptaciones por tipo de juego y edad
- `references/errors.md` — Errores comunes + intervenciones GM
- `references/examples.md` — Ejemplos concretos
