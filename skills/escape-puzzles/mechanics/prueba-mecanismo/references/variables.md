# Variables — Mecanismo

## Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `tipo_mecanismo` | string | "secuencia" \| "combinacion" \| "alineacion" \| "peso" \| "multi_candado" | "secuencia" | Tipo de mecanismo |
| `numero_elementos` | number | 2-8 | 3 | Elementos a manipular |
| `feedback_tipo` | string | "luz" \| "sonido" \| "apertura" \| "combinado" | "luz" | Feedback al completar |
| `reintentos` | number | 1-10 \| "infinito" | "infinito" | Fallos antes de bloqueo |
| `orden_importa` | boolean | true/false | true | Si la secuencia importa |

## Por Tipo

**secuencia:** `secuencia_correcta`(array), `elementos_tipo`("interruptores"|"botones"|"diales"), `reset_error`(bool)

**combinacion:** `digitos`(3-8, d:4), `combinacion_correcta`(array), `tipo_dial`("numerico"|"letras"|"simbolos")

**alineacion:** `numero_discos`(2-5, d:3), `marcas_referencia`(array), `tolerancia`(0-15 grados, d:5)

**peso:** `objetos_peso`(array {peso,nombre}), `peso_objetivo`(50-500g), `tolerancia_peso`(0-20g)

**multi_candado:** `numero_candados`(2-4, d:3), `tipos_candados`(["numero","letras","llave"]), `pistas_separadas`(bool)

## Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `tiempo_limite` | number | Segundos antes de reset |
| `override_gm` | boolean | Override manual para atascos |
| `feedback_parcial` | boolean | Feedback por elemento correcto |
| `indicador_progreso` | boolean | Display de progreso (ej: 2/3) |
