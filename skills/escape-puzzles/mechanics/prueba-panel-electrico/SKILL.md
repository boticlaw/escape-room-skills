---
name: prueba-panel-electrico
description: "Trigger: panel electrico, cableado, interruptores, circuitos, conectar cables. Paneles de control con cableado e interruptores que activan dispositivos electronicos."
---

# Prueba Panel Electrico

## Activation Contract

**Use when:** Cableado/conexiones electricas, activar dispositivo electronico (emisor FM, luz, motor), temas de ingenieria/electricidad/bunker/laboratorio. Panel fisico con cables e interruptores.

**Don't use when:** Sin componente fisico real (usar `prueba-digital-interfaz`), peligro electrico real >12V (usar `prueba-mecanismo-fisico` mecanico), solo una variable simple como "pulsa boton" (usar prueba basica).

## Hard Rules

- **NO** `numero_cables < 3` (demasiado simple)
- **NO** `numero_interruptores_onoff=0` AND `numero_interruptores_posicion=0` (sin variables)
- **WARN** `tiempo_limite < 30` con muchos cables (frustracion)
- **WARN** `intentos_maximos < 3` (desanimo temprano)
- **Max voltaje:** 12V DC (baja tension segura). Fusible de proteccion obligatorio.
- **Max time before GM intervention:** 8 min (6 novatos, 12 expertos)

## Decision Gates

| Nivel | Cables | ON/OFF | Posicionales | Feedback | Pistas | Tiempo |
|-------|--------|--------|--------------|----------|--------|--------|
| Facil | 3 | 2 | 0 | Progresivo (LEDs) | Diagrama | 5-8min |
| Estandar | 5 | 4 | 2 | Progresivo | Codigo indirecto | 10-15min |
| Dificil | 6-8 | 5-6 | 2-4 | Todo/Nada | Cripticas | 15-22min |
| Extrema | 8 | 6 | 4 | Ninguno | Ninguna | 25+min |

## Execution Steps

1. Seleccionar `dispositivo_activacion` (emisor_fm, luz, motor, pantalla)
2. Configurar `numero_cables`, `colores_cables`, `secuencia_cables`
3. Configurar interruptores ON/OFF y posicionales
4. Si `feedback_progresivo=true`: anadir LEDs por cable/interruptor
5. Preparar pistas sobre orden de conexion y configuracion
6. Verificar seguridad electrica (<12V, fusible, carcasa aislante)

## Output Contract

Output incluye: configuracion del panel (cables + interruptores + dispositivo), secuencia correcta de cables, configuracion correcta de interruptores, dispositivo a activar, pistas progresivas.

## References

- `references/variables.md` — Variables principales, por dispositivo, opcionales
- `references/difficulty-scale.md` — Detalle completo de niveles
- `references/adaptations.md` — Adaptaciones por edad, espacio y duracion
- `references/errors.md` — Errores comunes + intervenciones GM
- `references/examples.md` — 2 ejemplos (laboratorio, central telefonica)
