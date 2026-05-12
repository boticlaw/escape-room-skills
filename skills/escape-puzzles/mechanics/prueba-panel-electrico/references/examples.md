# Ejemplos — Panel Electrico

## Ejemplo 1: Panel de Laboratorio

Escape room laboratorio cientifico.

```json
{ "numero_cables": 5, "secuencia_cables": ["rojo","verde","azul","amarillo","negro"], "numero_interruptores_onoff": 4, "configuracion_interruptores": [true,true,false,true], "numero_interruptores_posicion": 2, "posiciones_interruptores": [1,-1], "dispositivo_activacion": "luz_uv", "feedback_progresivo": true }
```

Flujo: Diagrama en pizarra (RGB cromatico) → conectan cables con LEDs de feedback → configuran interruptores con formulas quimicas → luz UV revela mensaje fluorescente.

## Ejemplo 2: Central Telefonica

```json
{ "numero_cables": 6, "numero_interruptores_onoff": 6, "numero_interruptores_posicion": 0, "dispositivo_activacion": "emisor_fm", "frecuencia_fm": 98.7, "feedback_progresivo": false }
```

Flujo: Manual de codigos de colores telefonicos → aplican codigo → configuran interruptores por extension → emisor FM transmite mensaje en 98.7 MHz.

## Sinergias

- `prueba-busqueda-objetos`: Diagrama/manual escondido
- `prueba-cifrado`: Secuencia de cables codificada
- `prueba-logica-secuencial`: Orden sigue logica deducible
- `prueba-mecanismo-fisico`: Panel activa mecanismo (puerta, cajon)
