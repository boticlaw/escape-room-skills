---
name: prueba-logica-nonogram
description: "Trigger: nonogram, picross, cuadricula logica, celdas consecutivas, puzzle numerico. Puzzles de logica con cuadricula que revelan imagenes, palabras o codigos."
---

# Prueba Logica Nonogram

## Activation Contract

**Use when:** Nonogram/picross, pistas numericas indican celdas consecutivas, cuadricula que revela imagen/palabra/codigo al completarse. Formatos: papel, pantalla tactil, pizarra.

**Don't use when:** Puzzle sin cuadricula (usar `prueba-logica-secuencial`), puramente visual sin logica numerica (usar `prueba-puzzle-visual`), mecanismo fisico sin cuadricula (usar `prueba-mecanismo`).

## Hard Rules

- **WARN** Cuadriculas > 15x15 sin validacion automatica (propenso a errores en cadena)
- **WARN** Sin `feedback_error` en formato papel (errores se propagan)
- **Max time before GM intervention:** 10-15 min

## Decision Gates

| Nivel | Cuadricula | Solucion | Pistas | Tiempo |
|-------|-----------|----------|--------|--------|
| Facil | 5x5 | Imagen obvia | Algunas celdas resueltas | 5-8min |
| Estandar | 10x10 | Imagen/palabra clara | Implicitas, deducibles | 10-15min |
| Dificil | 15x15 | Codigo/sutil | Minimas | 18-25min |
| Extrema | 20x20+ | Multi-capa | Ninguna | 30+min |

## Execution Steps

1. Definir objetivo (imagen, palabra, codigo)
2. Disenar patron de celdas solucion
3. Calcular pistas numericas (consecutivas rellenas por fila/columna)
4. Verificar unicidad de solucion
5. Ajustar dificultad (celdas iniciales resueltas, feedback)
6. Preparar validacion (GM o automatica)

## Output Contract

Output incluye: cuadricula con pistas numericas, solucion completa, tipo de revelado (imagen/palabra/codigo), pistas progresivas para GM.

## References

- `references/variables.md` — Variables principales, por dimension, por tipo de solucion
- `references/difficulty-scale.md` — Detalle de niveles
- `references/adaptations.md` — Adaptaciones por tipo de juego
- `references/errors.md` — Errores comunes + intervenciones
- `references/examples.md` — Ejemplos concretos
