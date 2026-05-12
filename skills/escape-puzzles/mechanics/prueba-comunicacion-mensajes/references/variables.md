# Variables de Diseno — Comunicacion de Mensajes

## Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `tipo_codigo` | string | ["morse", "banderas_nauticas", "semaforo", "torres_agua", "braille", "codigo_cesar", "lenguaje_signos", "alfabeto_fonetico", "personalizado"] | "morse" | Sistema de codificacion |
| `longitud_mensaje` | number | 4-20 | 8 | Caracteres del mensaje |
| `separacion_equipos` | boolean | true/false | false | Jugadores separados con info complementaria |
| `modalidad_comunicacion` | string | ["visual", "auditiva", "tactil", "mixta"] | "visual" | Como se transmite el mensaje |
| `diccionario_proporcionado` | boolean | true/false | true | Si se da diccionario o deben deducirlo |

## Variables Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `tiempo_limite` | number | Segundos para recibir/transmitir |
| `intentos_maximos` | number | Intentos permitidos |
| `pistas_diccionario` | number | Letras ya descifradas (0-26) |
| `requiere_transmision` | boolean | Si deben tambien transmitir un mensaje |

## Combinaciones Validas

- **Basica:** `tipo_codigo="morse"`, `longitud_mensaje=6`, `separacion_equipos=false`, `diccionario_proporcionado=true`
- **Cooperativa:** `tipo_codigo="banderas_nauticas"`, `separacion_equipos=true`, `modalidad="visual"`
- **Dificil:** `tipo_codigo="personalizado"`, `longitud_mensaje=12`, `diccionario_proporcionado=false`, `pistas_diccionario=5`
