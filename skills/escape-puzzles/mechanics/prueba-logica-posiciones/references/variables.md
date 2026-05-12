# Referencia — Logica Posiciones

## Variables

| Variable | Tipo | Rango | Default |
|----------|------|-------|---------|
| `numero_elementos` | number | 3-8 | 6 |
| `tipo_disposicion` | string | "lineal" \| "circular" \| "matriz" | "circular" |
| `numero_restricciones` | number | 3-8 | 5 |
| `formato_restricciones` | string | "texto" \| "lista" \| "tabla" | "texto" |
| `dificultad_logica` | number | 1-10 | 5 |

Opcionales: `elementos`(array), `restricciones`(array), `solucion_orden`(array), `elemento_objetivo`(string), `imagen_referencia`(string)

## Errores Comunes

1. **No sistematizan:** Intentan resolver mentalmente sin escribir. **Intervencion:** "Dibuja la mesa y situa a las personas"
2. **Malinterpretan restriccion:** Ambiguedad invalida todo. **Prevencion:** Redactar sin ambiguedad
3. **No verifican todas:** Solucion no cumple alguna pista. **Intervencion:** "Comprueba que cumple todas las pistas"

**Senales:** >15 min, reportan "contradictorio", prueban ordenes sin verificar.
**Tiempo maximo:** 15 min.

## Ejemplo: La Reunion con Ana

7 personas en mesa circular, 5 restricciones. Orden: Luis, Carlos, Carmen, Pedro, Maria, Sofia, Ana. Objetivo: identificar a Ana como persona clave.

Pistas: 1)"Haz un esquema" 2)"Relaciones directas" 3)"Carlos entre Luis y Carmen" 4)"Orden: Luis, Carlos, Carmen, Pedro, Maria, Sofia, Ana" 5)"La persona clave es Ana"

## Sinergias

- `prueba-investigacion-texto`: Restricciones extraidas de un texto
- `prueba-emparejamiento-memoria`: Posiciones + memoria de secuencia
