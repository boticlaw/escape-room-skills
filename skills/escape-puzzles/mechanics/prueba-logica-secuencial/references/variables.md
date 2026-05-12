# Referencia — Logica Secuencial

## Variables

| Variable | Tipo | Rango | Default |
|----------|------|-------|---------|
| `tipo_secuencia` | string | "numerica" \| "alfabetica" \| "visual" \| "temporal" \| "mixta" | "numerica" |
| `longitud_secuencia` | number | 3-10 | 5 |
| `elemento_faltante` | boolean | - | false |
| `formato_respuesta` | string | "orden_completo" \| "siguiente" \| "faltante" | "orden_completo" |

**numerica:** `tipo_progresion`(aritmetica|geometrica|fibonacci|primos|custom), `inicio`, `diferencia/ratio`
**alfabetica:** `tipo_letras`(abecedario|iniciales|palabras), `regla`(saltos|iniciales_meses|planetas|custom)
**visual:** `elementos_visuales`(array), `dimension_orden`(color|tamano|forma|multiple), `regla_visual`
**temporal:** `tipo_eventos`(fechas|historia|proceso|narrativo), `unidad_tiempo`, `evento_referencia`

Opcionales: `pistas_orden`(bool), `validacion_parcial`(bool), `intentos_maximos`, `distraction_elements`

## Errores Comunes

1. **Adivinar en lugar de deducir:** No detectan regla. **Intervencion:** "Mirad con atencion, veis algun patron?"
2. **Criterio equivocado:** Ordenan por tamano cuando regla es color. **Intervencion:** "Estais seguros de ese criterio?"
3. **Ignoran contexto narrativo:** No conectan secuencia con historia. **Intervencion:** "Recordad el tema del escape"

**Senales:** 3+ ordenes sin sistema, no pueden explicar por que, >8 min sin progreso.

## Adaptaciones

**Ninos:** Max 4, colores/tamanos, reglas evidentes, sin distractores.
**Hall:** Elementos fisicos ordenables con ranuras.
**Street:** App con drag & drop.
**Investigacion:** Documentos cronologicos, timeline del crimen.

## Ejemplos

**Planetas:** 8 planetas ordenados por distancia al sol → codigo 12345678.
**Fibonacci:** 1,1,2,3,5,?,13 → elemento faltante = 8.
**Timeline crimen:** 5 eventos ordenados cronologicamente → revela sospechoso llego ANTES de llamada clave.
