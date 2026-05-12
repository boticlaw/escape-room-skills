# Variables — Tablet Cooperativo

## Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `tipo_juego` | string | "ritmo_cardiaco" \| "simon_dice" \| "control_cooperativo" \| "sincronizacion_botones" | "ritmo_cardiaco" | Mecanica cooperativa |
| `numero_jugadores` | number | 2-6 | 3 | Jugadores simultaneos |
| `duracion_juego_segundos` | number | 30-300 | 60 | Tiempo total en segundos |
| `modo_juego` | string | "tablet_compartida" \| "moviles_individuales" | "tablet_compartida" | Hall=tablet, Street=moviles |

## Por Tipo de Juego

**ritmo_cardiaco:** `ritmo_bpm`(40-120, d:60), `tolerancia_ms`(50-200, d:100), `aciertos_necesarios`(5-20, d:10), `feedback_visual`("corazon"|"onda"|"barra")

**simon_dice:** `secuencia_inicial`(3-5, d:3), `secuencia_maxima`(6-12, d:8), `colores_botones`(2-6), `tiempo_respuesta`(3000-8000ms, d:5000)

**control_cooperativo:** `objeto_controlar`("esfera"|"personaje"|"objeto"), `funciones_jugadores`(["arriba","abajo",...]), `objetivo`("llegar_punto"|"recoger"|"evitar"), `nivel_dificultad`(1-5)

**sincronizacion_botones:** `patrones`(array), `patrones_necesarios`(3-8, d:5), `tiempo_sincronizacion`(500-2000ms)

## Recompensa

| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `codigo_recompensa` | string | "4284" | Codigo en pantalla al completar |
| `mensaje_exito` | string | "Sincronizacion perfecta!" | Mensaje junto al codigo |

Hall Escape: codigo en tablet compartida. Street Escape: codigo en cada movil.
