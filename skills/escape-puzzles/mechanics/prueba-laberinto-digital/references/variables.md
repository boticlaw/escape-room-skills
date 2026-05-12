# Referencia — Laberinto Digital

## Variables

| Variable | Tipo | Rango | Default |
|----------|------|-------|---------|
| `tamano_laberinto` | string | "pequeno" \| "mediano" \| "grande" | "mediano" |
| `tipo_vista` | string | "superior" \| "primera_persona" | "superior" |
| `tiempo_limite` | number | 0-300 | 0 |
| `mostrar_minimapa` | boolean | - | false |
| `punto_inicio` | string | "esquina" \| "centro" \| "aleatorio" | "esquina" |
| `punto_fin` | string | "esquina_opuesta" \| "centro" \| "aleatorio" | "esquina_opuesta" |

Opcionales: `solucion_path`(string), `permitir_retroceso`, `penalizar_reinicio`, `feedback_visual`, `codigo_recompensa`

## Errores

1. **Camino obvio falla:** Repiten mismo camino trampa. **Intervencion:** "Empieza desde el final"
2. **Se pierden:** Circulan en bucles. **Prevencion:** Puntos de referencia visuales. **Intervencion:** Pista con seccion clave
3. **Frustracion controles:** "No responden". **Prevencion:** Controles responsivos, feedback inmediato

**Senales:** >5 min sin progreso, "probe todo", patron repetitivo.
**Tiempo maximo:** 10 min.

## Ejemplo: Laberinto de la Vivienda

```json
{ "tamano_laberinto": "mediano", "tipo_vista": "superior", "solucion_path": "ADADAIAD" }
```

Solucion: Abajo, Derecha, Abajo, Derecha, Abajo, Izquierda, Abajo, Derecha.
Pistas: 1)"Observa antes de mover" 2)"Camino correcto no es evidente" 3)"Buscar desde el final" 4)"Zona centro es clave" 5)"Camino: ADADAIAD"

## Adaptaciones

**Ninos:** Pequeno, colores brillantes, personaje simpatico.
**Hall:** Tablet/pantalla compartida, turnos.
**Street:** Cada uno en movil, simplificar.
**Investigacion:** Perfecto digital.
