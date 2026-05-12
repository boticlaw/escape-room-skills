# Referencia — Investigacion Texto

## Variables

| Variable | Tipo | Rango | Default |
|----------|------|-------|---------|
| `longitud_texto` | string | "corto" \| "medio" \| "largo" | "medio" |
| `tipo_texto` | string | "narrativo" \| "informativo" \| "dialogo" \| "documento" | "narrativo" |
| `formato_respuesta` | string | "palabra_clave" \| "frase" \| "concepto" \| "url" | "palabra_clave" |
| `ubicacion_pista` | string | "inicio" \| "medio" \| "final" \| "resaltado" | "medio" |
| `dificultad_comprension` | number | 1-10 | 5 |

Opcionales: `texto_completo`, `respuesta_correcta`, `palabras_clave_resaltadas`, `contexto_adicional`, `pistas_linea`

## Errores

1. **Lectura superficial:** "No sale" cuando esta. **Intervencion:** Pista de seccion/parrafo
2. **Sobreinterpretacion:** Buscan significados ocultos donde no los hay. **Intervencion:** Confirmar que es literal
3. **No reconocen respuesta:** Leen pero no identifican. **Intervencion:** Resaltar o dar contexto

**Senales:** >8 min, "lei todo sin exito", multiples respuestas incorrectas.
**Tiempo maximo:** 10 min.

## Ejemplo: Vestigios del Palacio Condal

```json
{ "longitud_texto": "medio", "tipo_texto": "informativo", "formato_respuesta": "palabra_clave", "ubicacion_pista": "resaltado", "respuesta_correcta": "la calleja" }
```

Pistas: 1)"Recuerda lo que Pepe cuenta" 2)"Calle que simboliza vida humilde" 3)"El Free Tour de Pepe ayuda" 4)"Info resaltada en explicaciones" 5)"La respuesta es 'la calleja'"

## Sinergias

- `prueba-adivinanza-ubicacion`: Texto contiene adivinanza
- `prueba-exploracion-visual`: Texto con elementos visuales ocultos
