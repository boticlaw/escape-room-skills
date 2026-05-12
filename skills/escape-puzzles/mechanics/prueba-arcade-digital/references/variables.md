# Referencia — Arcade Digital

## Variables Principales

| Variable | Tipo | Rango | Default |
|----------|------|-------|---------|
| `tipo_juego` | string | "frogger" \| "pong" \| "snake" \| "breakout" \| "custom" | "frogger" |
| `dificultad_base` | number | 1-10 | 5 |
| `vidas` | number | 1-5 | 3 |
| `permite_continuar` | boolean | - | true |

**Frogger:** `carriles_coche`(d:3), `carriles_rio`(d:3), `velocidad_coche`(d:3), `velocidad_tronco`(d:2)
**Pong:** `puntos_victoria`(d:5), `puntos_derrota_max`(d:0), `velocidad_pelota`(d:5), `tamano_paleta`(d:100)

Opcionales: `condicion_victoria`(string), `incremento_dificultad`(bool), `codigo_recompensa`(string)

## Errores Comunes

1. **Impaciencia:** Pasan rapido y chocan. **Intervencion:** "Esperar el momento adecuado es clave"
2. **No observan patrones:** Reactivo sin estrategia. **Intervencion:** "Observa primero, actua despues"
3. **Frustracion tras varios intentos:** "Es imposible". **Intervencion:** Reducir temporalmente dificultad

**Senales:** 10+ intentos sin progreso, frustracion extrema, >15 min en un minijuego.
**Tiempo maximo:** 15 min.

## Adaptaciones

**Ninos:** Velocidad muy lenta, muchas vidas, visuales atractivos.
**Hall:** Tablet o pantalla grande, turnos.
**Street:** Moviles, botones grandes sin precision requerida.
**Investigacion:** Ambos controles (teclado + tactil).

## Ejemplos

**Frogger Cruzando el Rio:** 3 carriles coches + 3 rio → cruzar → siguiente enigma.
**Pong Negociacion:** Ganar 5-0 → codigo recompensa. Si recibe punto, reinicia.
