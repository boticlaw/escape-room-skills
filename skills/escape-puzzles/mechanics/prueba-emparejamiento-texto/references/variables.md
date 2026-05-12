# Referencia — Emparejamiento Texto

## Variables

| Variable | Tipo | Rango | Default |
|----------|------|-------|---------|
| `numero_pares` | number | 3-8 | 5 |
| `tipo_emparejamiento` | string | "objecion-respuesta" \| "concepto-definicion" \| "problema-solucion" \| "causa-efecto" | "objecion-respuesta" |
| `mostrar_feedback` | boolean | - | true |
| `permitir_reordenar` | boolean | - | true |
| `dificultad_logica` | number | 1-10 | 5 |

Opcionales: `textos_a`(array), `textos_b`(array), `solucion_emparejamientos`(array), `criterio_emparejamiento`(string), `contexto_narrativo`(string)

## Errores

1. **Interpretan mal conexion:** Palabras clave incorrectas. **Prevencion:** Textos claros. **Intervencion:** Explicar criterio
2. **No leen completamente:** Primera impresion sin leer todo. **Prevencion:** Textos concisos. **Intervencion:** "Lee cada opcion completamente"
3. **Confunden similares:** Opciones con solapamiento. **Prevencion:** Opciones diferenciadas

**Senales:** 10+ intentos incorrectos, "no hay logica", dejan sin emparejar mucho tiempo.
**Tiempo maximo:** 12 min.

## Ejemplo: Objeciones de los Hermanos

```json
{ "numero_pares": 5, "tipo_emparejamiento": "objecion-respuesta", "contexto_narrativo": "Ana cuenta objeciones de sus hermanos sobre alquilar a Pepe" }
```

Pistas: 1)"Identifica objeciones principales" 2)"Argumentos que aborden preocupaciones" 3)"Empareja objecion con solucion" 4)"Proyecto de Pepe beneficia a todos" 5)"Completa emparejamiento para avanzar"

## Sinergias

- `prueba-investigacion-texto`: Textos extraidos de narrativa
- `prueba-emparejamiento-memoria`: Emparejar y luego recordar secuencia
