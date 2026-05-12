---
name: prueba-comunicacion-mensajes
description: "Trigger: mensajes secretos, cifrado, morse, banderas, semaforo, codigo, comunicacion equipos. Pruebas de envio y descifrado de mensajes usando codigos y sistemas de comunicacion."
---

# Prueba: Comunicacion de Mensajes

## Activation Contract

**Use when:** Mensajes secretos, cifrado, morse, banderas, semaforo, torres de agua, braille, cesar, lenguaje de signos. Jugadores descifran con diccionario/codigo. Equipos separados con info complementaria. Temas: espionaje, naval, telecomunicaciones.

**Don't use when:** Publico < 8 anos (usar `prueba-figuras-colores`), espacio muy ruidoso con codigos auditivos, solucion debe ser ambigua/interpretativa (usar `prueba-logica-deduccion`), mensajes > 20 caracteres (tedioso).

## Hard Rules

- **NO** `separacion_equipos=true` + `modalidad="tactil"` (imposible a distancia)
- **NO** `diccionario_proporcionado=false` + `tipo_codigo="personalizado"` + `longitud_mensaje>8` (imposible deducir)
- **WARN** `longitud_mensaje > 15` + `separacion_equipos=true` (propenso a errores)
- **WARN** `modalidad="auditiva"` en espacios con eco o ruido
- **Max time before GM intervention:** 8 min (10 con separacion de equipos)

## Decision Gates

| Nivel | Longitud | Equipos | Diccionario | Codigo | Intentos | Tiempo |
|-------|----------|---------|-------------|--------|----------|--------|
| Facil | 4-6 | No | Completo | Estandar | Infinitos | 5-8 min |
| Estandar | 6-10 | Opcional | Completo | Estandar | 5 | 10-15 min |
| Dificil | 10-15 | Si | Parcial | Menos comun | 3 | 15-25 min |
| Extrema | 15-20+ | Multiple | Ausente | Multiple | 2 | 25-40 min |

## Execution Steps

1. Seleccionar `tipo_codigo` y `longitud_mensaje` segun nivel de dificultad
2. Definir `separacion_equipos` y `modalidad_comunicacion`
3. Preparar diccionario (completo/parcial/ausente) y mensaje cifrado
4. Si `separacion_equipos=true`: asignar informacion complementaria a cada equipo
5. Preparar pistas progresivas (ver `references/errors.md`)
6. Documentar solucion valida y variaciones aceptables

## Output Contract

Output incluye: configuracion de variables (`tipo_codigo`, `longitud_mensaje`, `separacion_equipos`, `modalidad_comunicacion`, `diccionario_proporcionado`), mensaje cifrado con solucion, diccionario/clave, y pistas progresivas.

## References

- `references/variables.md` — Variables principales y opcionales con rangos y defaults
- `references/difficulty-scale.md` — Detalle completo de niveles Facil/Estandar/Dificil/Extrema
- `references/adaptations.md` — Adaptaciones por edad, espacio y duracion
- `references/errors.md` — Errores comunes de jugadores + intervenciones GM
- `references/examples.md` — 4 ejemplos concretos (morse, banderas, semaforo, deduccion)
