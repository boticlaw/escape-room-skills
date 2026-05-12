---
name: prueba-emparejamiento-texto
description: "Trigger: emparejar textos, objecion respuesta, concepto definicion, matching, asociar conceptos. Emparejar textos conceptuales basandose en logica o contenido."
---

# Prueba Emparejamiento Texto

## Activation Contract

**Use when:** Asociar textos de dos categorias (objecion-respuesta, concepto-definicion, problema-solucion), emparejamiento por contenido/logica, NO hay secuencia posterior que recordar.

**Don't use when:** Necesitan recordar secuencia (`prueba-emparejamiento-memoria`), emparejamiento visual no textual, sin logica de conexion (frustrante).

## Hard Rules

- **NO** `numero_pares > 6` con textos muy largos
- **WARN** `mostrar_feedback=false` (muy dificil)
- **REGLA:** Logica clara para cada emparejamiento
- **Max time before GM intervention:** 12 min

## Decision Gates

| Nivel | Pares | Textos | Feedback | Tiempo |
|-------|-------|--------|----------|--------|
| Facil | 3-4 | Cortos <10 palabras | Completo | 3-5min |
| Estandar | 5-6 | Medios 10-20 palabras | Parcial | 5-10min |
| Dificil | 6-8 | Largos, conexiones implicitas | Minimo | 10-15min |
| Extrema | 8+ | Muy similares entre si | Ninguno | 15+min |

## Execution Steps

1. Redactar textos de ambos conjuntos
2. Verificar conexion clara para cada par
3. Asegurar no hay ambiguedades
4. Incluir feedback de acierto/error

## Output Contract

Pares, tipo de emparejamiento, textos de ambos conjuntos, solucion, criterio logico, pistas.

## References

- `references/variables.md` — Variables, errores, adaptaciones, ejemplo
