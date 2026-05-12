---
name: prueba-arcade-digital
description: "Trigger: minijuego arcade, Frogger, Pong, Snake, Breakout, reflejos, timing. Minijuegos clasicos tipo arcade como parte del escape room."
---

# Prueba Arcade Digital

## Activation Contract

**Use when:** Minijuego arcade clasico (Frogger, Pong, Snake, Breakout), simbolizar obstaculos con mecanicas conocidas, requiere reflejos + timing + paciencia.

**Don't use when:** Publico con poca habilidad controles (ninos muy pequenos, mayores), solo necesitas puzzle logico (`prueba-logica-posiciones`), como unico tipo de prueba en el escape.

## Hard Rules

- **NO** `vidas=1` + `dificultad_base > 7` (muy punitivo)
- **WARN** `condicion_victoria` muy estricta tipo "ganar sin recibir puntos"
- **Max time before GM intervention:** 15 min

## Decision Gates

| Nivel | Vidas | Velocidad | Pistas | Reinicio | Tiempo |
|-------|-------|-----------|--------|----------|--------|
| Facil | 5 | Lenta (3) | 5 | Checkpoint | 2-5min |
| Estandar | 3 | Media (5) | 3 | Inicio | 5-10min |
| Dificil | 1-2 | Alta (8) | 1 | Inicio | 10-20min |
| Extrema | 1 | Maxima | 0 | Inicio | 20+min |

## Execution Steps

1. Elegir `tipo_juego` y `condicion_victoria`
2. Calibrar `dificultad_base` y `vidas` segun publico
3. Definir `codigo_recompensa` mostrado al ganar
4. Balancear desafio vs frustracion

## Output Contract

Tipo de juego, configuracion de dificultad, condicion de victoria, codigo de recompensa, pistas progresivas.

## References

- `references/variables.md` — Variables por tipo de juego, errores, adaptaciones, ejemplos
