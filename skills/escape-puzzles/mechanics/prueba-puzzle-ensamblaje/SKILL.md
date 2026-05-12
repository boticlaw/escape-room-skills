---
name: prueba-puzzle-ensamblaje
description: "Trigger: unir fragmentos, reconstruir, puzzle piezas, ensamblaje, composicion. Fragmentos dispersos se unen para formar todo coherente que revela informacion."
---

# Prueba Puzzle de Ensamblaje

## Activation Contract

**Use when:** Unir fragmentos, reconstruir objeto/documento/imagen, puzzle de piezas fisicas o digitales, multiples items que combinados revelan mensaje/codigo/imagen.

**Don't use when:** Fragmentos sin sentido combinado (`prueba-coleccion`), ensamblaje obvio sin desafio (anadir decoys), dependencia excesiva de destreza fisica (usar encajes holgados o magneticos).

## Hard Rules

- **NO** `numero_fragmentos > 10` + `piezas_decoy > 3` (complejidad excesiva)
- **NO** `tipo_ensamblaje="superposicion"` + formato fisico sin transparencias reales
- **WARN** `formato_piezas="fisico"` sin sistema de validacion para GM
- **Max time before GM intervention:** 10-12 min

## Decision Gates

| Nivel | Fragmentos | Tipo | Decoys | Guia | Tiempo |
|-------|-----------|------|--------|------|--------|
| Facil | 4-6 | Puzzle tradicional | 0 | Imagen guia | 5-8min |
| Estandar | 6-9 | Irregular/superposicion | 1-2 | Pistas implicitas | 10-15min |
| Dificil | 9-12 | Multiple capas/secuencia | 2-3 | Pistas minimas | 15-22min |
| Extrema | 12+ | Mecanismo funcional | 3+ | Sin guia | 25+min |

## Execution Steps

1. Elegir `tipo_ensamblaje` (puzzle_tradicional, superposicion, secuencia, mecanismo)
2. Definir `numero_fragmentos` y `contenido_final`
3. Disenar decoys si aplica
4. Establecer sistema de validacion (visual, sensor, GM)
5. Preparar pistas sobre orden si `tipo_ensamblaje="secuencia"`

## Output Contract

Configuracion de fragmentos, tipo de ensamblaje, contenido revelado al completar, sistema de validacion, pistas progresivas.

## References

- `references/variables.md` — Variables principales, por tipo, opcionales, errores, adaptaciones
