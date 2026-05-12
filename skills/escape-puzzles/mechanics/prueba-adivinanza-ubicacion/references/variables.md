# Referencia — Adivinanza Ubicacion

## Variables

| Variable | Tipo | Rango | Default |
|----------|------|-------|---------|
| `formato_adivinanza` | string | "poema" \| "prosa" \| "verso" | "poema" |
| `numero_lineas` | number | 4-12 | 6 |
| `tipo_ubicacion` | string | "monumento" \| "edificio" \| "naturaleza" \| "plaza" | "monumento" |
| `dificultad_texto` | number | 1-10 | 5 |
| `requiere_conocimiento_local` | boolean | - | true |

Opcionales: `texto_adivinanza`(string), `respuesta_correcta`(string), `pistas_contexto`(array), `url_maps`(string)

## Errores Comunes

1. **Interpretacion literal:** Buscan coincidencia textual. **Intervencion:** Contexto historico
2. **Lugar incorrecto:** Multiples interpretaciones. **Intervencion:** Pista especifica
3. **No conocen el lugar:** Falta de conocimiento previo. **Intervencion:** Google Maps o descripcion

**Senales:** >10 min, "no sabemos de que habla", van a multiples lugares incorrectos.
**Tiempo maximo:** 12 min.

## Ejemplo: El Palacio Condal

"Fui hogar de condes, lugar de esplendor, mis muros guardaban historias de honor. Hoy solo restos me quedan por mostrar, pero en mi torre el pasado se puede vislimplar..."

Respuesta: Plaza del pueblo donde estan los restos del Palacio Condal.

Pistas: 1)"Edificio historico nobleza" 2)"Hogar de condes, Edad Media" 3)"Columnas en plaza principal" 4)"Palacio Condal de Monzon" 5)"Ve a la Plaza del pueblo"

## Sinergias

- `prueba-ubicacion-qr`: Adivinanza revela lugar, QR verifica
- `prueba-acrostico-ubicacion`: Adivinanza con estructura de acrostico
