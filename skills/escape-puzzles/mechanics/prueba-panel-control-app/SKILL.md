---
name: prueba-panel-control-app
description: "Trigger: panel de control, app tablet, ajustar parametros, codigo autorizacion, restaurar sistemas. App en tablet que simula panel de control industrial con parametros a ajustar."
---

# Prueba: Panel de Control App

## Activation Contract

**Use when:** App web en tablet simula panel de control industrial/sistema, jugadores ajustan parametros y/o introducen codigos para restaurar sistemas, feedback visual inmediato (rojo→verde).

**Don't use when:** Sin tablet disponible, prefieres componente puramente fisico (`prueba-panel-electrico`), solo introducir codigo sin parametros (`prueba-codigo-numerico`).

## Hard Rules

- App es HTML autocontenido, funciona offline
- Requiere 1 tablet por grupo (Android/iOS con navegador)
- No requiere conexion a internet

## Decision Gates

| Parametro | Input | Ejemplo |
|-----------|-------|---------|
| `slider_numerico` | Slider tactil con rango | CO2: 415 ppm |
| `texto_libre` | Input de texto | Causa: "Contaminacion industrial" |
| `codigo_numerico` | Input numerico | Codigo: 1503 |
| `codigo_alfanumerico` | Input 1 caracter por campo | AV1P |

## Execution Steps

1. Definir `sistemas` (array con nombre, parametros, valores correctos)
2. Definir `codigo_autorizacion` final
3. Establecer `tolerancia_numerica` para sliders
4. Distribuir pistas en la sala para deducir cada valor
5. Preparar HTML autocontenido

## Output Contract

Array de sistemas con parametros y valores correctos, codigo de autorizacion, tolerancia numerica, respuestas alternativas aceptadas, pistas distribuidas por la sala.

## References

- `references/variables.md` — Variables de configuracion completas y ejemplo Protocolo Alerta Verde
