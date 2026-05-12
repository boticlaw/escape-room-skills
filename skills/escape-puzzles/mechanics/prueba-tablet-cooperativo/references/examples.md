# Ejemplos — Tablet Cooperativo

## Ejemplo 1: Ritmo Cardiaco — "Corazon Sincronizado"

Laboratorio medico. 3 jugadores pulsan al ritmo de un corazon (65 BPM). 10 latidos sincronizados → codigo "VITAL".

```json
{ "tipo_juego": "ritmo_cardiaco", "numero_jugadores": 3, "ritmo_bpm": 65, "tolerancia_ms": 120, "aciertos_necesarios": 10, "codigo_recompensa": "VITAL" }
```

## Ejemplo 2: Simon Dice — "Secuencia de Colores"

Sala de control alienigena. 3 jugadores, cada uno un color. Secuencia creciente hasta 7 elementos → codigo "4284".

```json
{ "tipo_juego": "simon_dice", "numero_jugadores": 3, "secuencia_maxima": 7, "colores_botones": ["rojo","azul","verde"], "codigo_recompensa": "4284" }
```

## Ejemplo 3: Control Cooperativo — "Nave Espacial"

3 jugadores: uno arriba, otro izquierda, otro derecha. Navegan por asteroides → codigo "4529".

```json
{ "tipo_juego": "control_cooperativo", "numero_jugadores": 3, "objeto_controlar": "nave", "funciones_jugadores": ["arriba","izquierda","derecha"], "nivel_dificultad": 4, "codigo_recompensa": "4529" }
```

## Sinergias

- `prueba-busqueda-objetos`: Encontrar tablet escondida primero
- `prueba-cifrado`: Codigo de recompensa necesita descifrado
- `prueba-logica-secuencial`: Secuencia sigue logica deducible
- `prueba-comunicacion-restringida`: Sin hablar, solo senas

## Alternativas

- `prueba-panel-electrico` → Componente fisico tangible
- `prueba-digital-interfaz` → Un solo jugador
