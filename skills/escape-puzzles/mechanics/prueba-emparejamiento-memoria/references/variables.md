# Referencia — Emparejamiento Memoria

## Variables

| Variable | Tipo | Rango | Default |
|----------|------|-------|---------|
| `numero_pares` | number | 3-7 | 5 |
| `tipo_elemento_a` | string | "llaves" \| "codigos" \| "simbolos" \| "colores" | "llaves" |
| `tipo_elemento_b` | string | "cerraduras" \| "destinos" \| "posiciones" \| "cajas" | "cerraduras" |
| `mostrar_feedback` | boolean | - | true |
| `requiere_secuencia` | boolean | - | true |

Opcionales: `solucion_emparejamientos`(array), `secuencia_final`(array), `intentos_maximos`, `penalizacion_error`, `codigo_recompensa`

## Errores

1. **No anotan secuencia:** Olvidan orden. **Intervencion:** "Apuntar es util"
2. **Prueban al azar:** Sin estrategia. **Intervencion:** "Prueba sistematicamente cada llave"
3. **Confunden similares:** Elementos parecidos. **Prevencion:** Visualmente distinguibles

**Senales:** 8+ errores, "probe todo", fallan secuencia repetidamente.
**Tiempo maximo:** 12 min.

## Ejemplo: Las Cinco Llaves

```json
{ "numero_pares": 5, "tipo_elemento_a": "llaves", "tipo_elemento_b": "cerraduras", "requiere_secuencia": true, "solucion_emparejamientos": [[1,4],[2,3],[3,1],[4,5],[5,2]] }
```

Pistas: 1)"Pincha llave + cerradura" 2)"Acierta sin errores" 3)"Recuerda que llave con que cerradura" 4)"Prueba cada llave" 5)"Secuencia: L1-C4, L2-C3, L3-C1, L4-C5, L5-C2"

## Sinergias

- `prueba-cifrado`: Pares forman codigo
- `prueba-tablet-cooperativo`: Coordinacion grupal
