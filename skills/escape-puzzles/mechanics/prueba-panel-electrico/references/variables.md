# Variables — Panel Electrico

## Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `numero_cables` | number | 3-8 | 5 | Cables de colores |
| `colores_cables` | array | 8 colores disponibles | 5 colores | Colores del panel |
| `secuencia_cables` | array | orden de colores | aleatorio | Orden correcto |
| `numero_interruptores_onoff` | number | 2-6 | 4 | Interruptores ON/OFF |
| `configuracion_interruptores` | array | booleanos | [T,F,T,F] | Posicion correcta |
| `numero_interruptores_posicion` | number | 0-4 | 2 | Interruptores 3 posiciones |
| `posiciones_interruptores` | array | [-1,0,1] | [1,-1] | -1=abajo, 0=centro, 1=arriba |
| `dispositivo_activacion` | string | "emisor_fm" \| "luz" \| "motor" \| "pantalla" | "emisor_fm" | Dispositivo al completar |

## Por Dispositivo

**emisor_fm:** `frecuencia_fm`(88-108 MHz, d:104.5), `mensaje_fm`(string), `duracion_mensaje`(5-60s), `repetir_mensaje`(bool)

**luz:** `color_luz`("blanco"|"rojo"|"verde"|"azul"|"rgb"), `patron_luz`("fijo"|"parpadeo"|"secuencia"), `duracion_luz`(5-300s)

**motor:** `accion_motor`("abrir"|"cerrar"|"girar"|"subir"), `tiempo_motor`(1-30s)

## Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `feedback_progresivo` | boolean | LEDs por cable conectado |
| `tiempo_limite` | number | Segundos antes de reset |
| `intentos_maximos` | number | Fallos antes de bloqueo temporal |
| `pistas_montaje` | array | Secuencia de pistas de conexion |
