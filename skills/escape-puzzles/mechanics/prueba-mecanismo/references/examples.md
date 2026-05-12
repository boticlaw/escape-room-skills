# Ejemplos — Mecanismo

Los ejemplos completos estan en `ejemplos/`:
- `mecanismo_001.json` — Secuencia de interruptores
- `mecanismo_002.json` — Caja con multiples candados
- `mecanismo_003.json` — Puzzle de peso/balance

## Ejemplo tipico: Multi-Candado

3 candados (numerico, letras, llave) en una caja. Cada candado tiene su pista en ubicacion diferente. Abrir todos accede al contenido. No requiere electronica.

## Implementacion Tecnica

**Secuencias:** Arduino/ESP32, interruptores basculantes, LEDs RGB.
**Multi-Candado:** Candados de calidad, 2-3 tipos distintos, caja resistente.
**Peso:** Sensor HX711 + celula de carga, o balancin mecanico.
**Mantenimiento:** Revisar interruptores semanalmente, lubricar candados mensualmente, calibrar sensores antes de cada sesion.
