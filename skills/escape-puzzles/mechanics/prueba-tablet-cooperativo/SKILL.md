---
name: prueba-tablet-cooperativo
description: "Trigger: tablet cooperativa, sincronizacion, Simon Dice, ritmo cardiaco, control compartido, minijuego cooperativo. Mecanicas cooperativas sincronizadas en tablet/moviles."
---

# Prueba Tablet Cooperativo

## Activation Contract

**Use when:** Minijuego cooperativo en tablet, sincronizacion 2+ jugadores, Simon Dice grupal, ritmo cardiaco sincronizado, control multidireccional compartido. Hall Escape = tablet compartida. Street Escape = moviles individuales.

**Don't use when:** Solo 1 jugador (usar `prueba-digital-interfaz`), turnos secuenciales (usar `prueba-logica-secuencial`), sin feedback sincronizado (usar `prueba-puzzle-fisico`), competitivo (usar `prueba-competitiva-digital`).

## Hard Rules

- **NO** `numero_jugadores < 2` (no es cooperativo)
- **NO** `tipo_juego="control_cooperativo"` + `numero_jugadores=2` + < 2 funciones (falta control)
- **WARN** `ritmo_bpm > 100` con novatos (frustracion)
- **WARN** `tolerancia_ms < 50` (casi imposible sincronizar)
- **WARN** `tiempo_respuesta < 3000` en Simon Dice (muy rapido)
- **Max time before GM intervention:** 5 min (3 novatos, 8 expertos)

## Decision Gates

| Nivel | Jugadores | Ritmo/BPM | Secuencia | Tolerancia | Aciertos | Tiempo |
|-------|-----------|-----------|-----------|------------|----------|--------|
| Facil | 2 | 60 | 3 | 150ms | 5 | 5-8 min |
| Estandar | 3 | 70-80 | 5-6 | 100ms | 8-10 | 10-15 min |
| Dificil | 4-5 | 90-100 | 7-8 | 50-75ms | 15-20 | 15-20 min |
| Extrema | 5-6 | 110+ | 10+ | Minima | 20+ | 20-25 min |

## Execution Steps

1. Seleccionar `tipo_juego` (ritmo_cardiaco, simon_dice, control_cooperativo, sincronizacion_botones)
2. Definir `numero_jugadores` y `modo_juego` (tablet_compartida o moviles_individuales)
3. Configurar variables especificas del tipo de juego elegido
4. Definir `codigo_recompensa` y `mensaje_exito` mostrados en pantalla al completar
5. Preparar pistas para errores comunes (ver `references/errors.md`)

## Output Contract

Output incluye: configuracion del minijuego (tipo, jugadores, modo), variables especificas del juego, codigo de recompensa mostrado en pantalla, pistas progresivas.

## References

- `references/variables.md` — Variables principales, por tipo de juego, y de recompensa
- `references/difficulty-scale.md` — Detalle completo de niveles
- `references/adaptations.md` — Adaptaciones por edad, espacio y duracion
- `references/errors.md` — Errores comunes + intervenciones GM
- `references/examples.md` — 3 ejemplos (ritmo, control, Simon Dice)
