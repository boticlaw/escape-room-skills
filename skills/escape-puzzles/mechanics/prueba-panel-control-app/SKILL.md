---
name: prueba-panel-control-app
description: Prueba interactiva con app de tablet tipo panel de control donde los jugadores deben ajustar parámetros y/o introducir códigos para restaurar sistemas.
---

# Prueba: Panel de Control App

## Descripción
Los jugadores interactúan con una aplicación web en una tablet que simula un panel de control industrial/de sistema. Deben descubrir los valores correctos de parámetros (números, textos, códigos) a partir de pistas distribuidas por la sala.

## Mecánica
1. Los jugadores encuentran la tablet con la app cargada
2. La app muestra N sistemas/paneles, cada uno con uno o más parámetros a ajustar
3. Los parámetros correctos se deducen de documentos/pistas en la sala
4. Al introducir los valores correctos, cada sistema cambia de rojo a verde (feedback visual)
5. Finalmente, introducen un código de autorización y pulsan un botón para completar

## Variables de configuración
- `sistemas`: Array de sistemas con nombre, parámetros (tipo, rango, valor correcto)
- `codigo_autorizacion`: String de caracteres (ej: "AV1P")
- `tolerancia_numerica`: Porcentaje de tolerancia para sliders numéricos (ej: ±5%)
- `respuestas_texto_alternativas`: Array de strings aceptados como correctos para cada campo de texto

## Tipos de parámetros
| Tipo | Input | Ejemplo |
|------|-------|---------|
| slider_numerico | Slider táctil con rango | CO2: 415 ppm |
| texto_libre | Input de texto | Causa: "Contaminación industrial" |
| codigo_numerico | Input numérico | Código: 1503 |
| codigo_alfanumerico | Input de 1 carácter por campo | AV1P |

## Ventajas
- Interacción táctil moderna y atractiva
- Feedback visual inmediato (sin GM intermediario)
- Reutilizable para cualquier temática (ecología, espacio, hospital, etc.)
- No requiere materiales físicos complejos

## Requisitos
- 1 tablet por grupo (Android/iOS con navegador)
- La app es un HTML autocontenido, funciona offline
- No requiere conexión a internet

## Ejemplo: Protocolo Alerta Verde
- 3 sistemas: Aire (CO2 + causa), Agua (caudal + fuga), Energía (rendimiento + código emergencia)
- Código autorización: AV1P
- Valores deducidos de 4 documentos en la sala
