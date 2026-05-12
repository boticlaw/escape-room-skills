# Referencia — Acrostico Ubicacion

## Variables

| Variable | Tipo | Rango | Default |
|----------|------|-------|---------|
| `palabra_objetivo` | string | 4-8 letras | - |
| `formato_texto` | string | "poema" \| "prosa" \| "versos" | "poema" |
| `dificultad_deduccion` | number | 1-10 | 5 |
| `explicitar_patron` | boolean | - | false |

Opcionales: `texto_completo`(string), `ubicacion_revelada`(string), `url_maps`(string), `versos`(array)

## Errores Comunes

1. **No identifican patron:** Leen sin ver iniciales. **Intervencion:** "Como empiezas siempre es importante"
2. **Interpretan literalmente:** Buscan por contenido del poema. **Intervencion:** "Fijate en las letras, no solo en el mensaje"
3. **Combinan letras incorrectas:** Toman letras del medio. **Intervencion:** Confirmar que son las primeras

**Senales:** >8 min sin identificar, "el poema no dice donde", prueban palabras aleatorias.
**Tiempo maximo:** 10 min.

## Ejemplo: La Iglesia

```json
{ "palabra_objetivo": "IGLESIA", "versos": ["Imagenes del pasado surgen a cada paso", "Grandes historias estan grabadas en sus muros", "Los ecos de tiempos antiguos aun resuenan", "Entre sus calles, la vida se mezcla con la historia", "Silencios y susurros que lo llenan de mistica", "Imponentes estructuras resisten al paso del tiempo", "Avanza y encontraras el lugar que buscas"] }
```

Pistas: 1)"Observa cuidadosamente" 2)"Como empiezas siempre es importante" 3)"Lugar sagrado" 4)"Primeras letras de cada linea" 5)"Ve a la iglesia y escanea QR"

## Sinergias

- `prueba-ubicacion-qr`: Acrostico revela lugar, QR verifica
- `prueba-adivinanza-ubicacion`: Acrostico como forma de adivinanza
