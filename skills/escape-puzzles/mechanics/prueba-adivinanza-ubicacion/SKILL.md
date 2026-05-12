---
name: prueba-adivinanza-ubicacion
description: "Trigger: adivinanza, poema, acertijo, deducir lugar, ubicacion fisica, ir al lugar. Adivinanzas poeticas que revelan ubicaciones fisicas a visitar."
---

# Prueba Adivinanza Ubicacion

## Activation Contract

**Use when:** Descifrar adivinanza/poema que revela lugar fisico, respuesta es ubicacion a visitar, combina deduccion literaria con exploracion fisica.

**Don't use when:** Adivinanza ambigua con multiples respuestas validas, lugar desconocido por el publico, sin patrimonio/cultura local (usar `prueba-exploracion-visual`).

## Hard Rules

- **NO** `dificultad_texto > 7` + `requiere_conocimiento_local=false`
- **REGLA:** Una unica respuesta clara para quien conoce el lugar
- **WARN** Referencias muy locales sin contexto
- **Max time before GM intervention:** 12 min

## Decision Gates

| Nivel | Complejidad | Conocimiento | Contexto | Tiempo |
|-------|------------|-------------|----------|--------|
| Facil | Simple, directa | No necesario | Mucho | 3-5min |
| Estandar | Metaforas moderadas | Util | Alguno | 5-10min |
| Dificil | Referencias historicas | Necesario | Minimo | 10-20min |
| Extrema | Arcaica/cifrada | Investigacion | Ninguno | 20+min |

## Execution Steps

1. Investigar historia del lugar objetivo
2. Redactar adivinanza con referencias especificas (univoca)
3. Verificar unica respuesta clara
4. Incluir pistas literales y figurativas

## Output Contract

Adivinanza, respuesta correcta, tipo de ubicacion, pistas contexto, URL Maps backup.

## References

- `references/variables.md` — Variables, errores, adaptaciones, ejemplo concreto
