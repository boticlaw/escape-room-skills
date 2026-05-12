# Referencia — Panel de Control App

## Variables de Configuracion

- `sistemas`: Array de sistemas con nombre, parametros (tipo, rango, valor correcto)
- `codigo_autorizacion`: String de caracteres (ej: "AV1P")
- `tolerancia_numerica`: Porcentaje de tolerancia para sliders (ej: ±5%)
- `respuestas_texto_alternativas`: Array de strings aceptados como correctos

## Tipos de Parametros

| Tipo | Input | Ejemplo |
|------|-------|---------|
| `slider_numerico` | Slider tactil con rango | CO2: 415 ppm |
| `texto_libre` | Input de texto | Causa: "Contaminacion industrial" |
| `codigo_numerico` | Input numerico | Codigo: 1503 |
| `codigo_alfanumerico` | Input de 1 caracter por campo | AV1P |

## Ejemplo: Protocolo Alerta Verde

- 3 sistemas: Aire (CO2 + causa), Agua (caudal + fuga), Energia (rendimiento + codigo emergencia)
- Codigo autorizacion: AV1P
- Valores deducidos de 4 documentos en la sala

## Mecanica

1. Jugadores encuentran tablet con app cargada
2. App muestra N sistemas/paneles con parametros a ajustar
3. Parametros correctos se deducen de documentos/pistas en la sala
4. Al introducir valores correctos, sistema cambia rojo → verde
5. Finalmente, introducen codigo de autorizacion y pulsan boton
