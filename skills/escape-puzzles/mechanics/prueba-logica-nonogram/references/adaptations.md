# Adaptaciones y Errores — Logica Nonogram

## Adaptaciones

**Hall Escape:** Cuadricula grande en papel/pizarra. Colaboracion en deduccion. Division de tareas (filas/columnas).

**Street Escape:** Tablet con app. Validacion instantanea.

**Investigacion:** Nonogram como evidencia del caso. Papel con apariencia de documento antiguo.

## Errores Comunes

1. **No entender reglas:** Rellenan al azar. **Intervencion:** "Cada numero indica celdas consecutivas"
2. **No marcar vacios:** Pierden info. **Intervencion:** "Marcar celdas vacias os ayudara"
3. **Error temprano que propaga:** Deducen mal sin verificar. **Prevencion:** `feedback_error=true` si digital

**Senales de alarma:** >10 min sin avanzar, rellenan al azar, "no entender", piden ayuda.
**Tiempo maximo:** 10-15 min.

## Sinergias

- `prueba-cifrado`: Codigo revelado esta cifrado
- `prueba-logica-secuencial`: Solucion indica un orden

## Alternativas

- `prueba-logica-sudoku` → Puzzles de numeros
- `prueba-puzzle-visual` → Sin logica numerica
