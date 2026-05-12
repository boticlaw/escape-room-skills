# Variables — Logica Nonogram

## Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `dimensiones_cuadricula` | object | {filas, columnas} | {10, 10} | Tamano |
| `tipo_solucion` | string | "imagen" \| "palabra" \| "codigo" \| "mixto" | "imagen" | Que se revela |
| `dificultad_logica` | string | "facil" \| "medio" \| "dificil" | "medio" | Complejidad |
| `formato_presentacion` | string | "papel" \| "pantalla_tactil" \| "pizarra" | "papel" | Medio |

## Por Dimension

| Dimensiones | Nivel | Tiempo |
|-------------|-------|--------|
| 5x5 | Facil | 5-8min |
| 10x10 | Medio | 10-15min |
| 15x15 | Dificil | 18-25min |
| 20x20+ | Extremo | 30+min |

## Opcionales

`pistas_iniciales`(bool), `validacion_automatica`(bool), `feedback_error`(bool), `herramientas`(["lapiz","x","borrador"])
