# Referencia — Exploracion Visual

## Variables

| Variable | Tipo | Rango | Default |
|----------|------|-------|---------|
| `tipo_ocultamiento` | string | "color" \| "posicion" \| "interaccion" \| "scroll" | "interaccion" |
| `area_busqueda` | string | "toda_pagina" \| "seccion" \| "footer" \| "header" | "toda_pagina" |
| `tipo_interaccion` | string | "clic" \| "hover" \| "scroll" \| "arrastrar" | "clic" |
| `dificultad_visual` | number | 1-10 | 5 |
| `feedback_revelacion` | boolean | - | true |

Opcionales: `coordenadas_elemento`, `color_camuflaje`, `mensaje_oculto`, `codigo_recompensa`, `pista_visual`

## Errores

1. **No hacen scroll:** "No hay nada mas". **Intervencion:** "Desplazate hasta el final"
2. **No prueban interacciones:** Miran sin hacer clic. **Intervencion:** "Interactua con zonas inusuales"
3. **Solo texto:** Ignoran elementos graficos. **Intervencion:** "Mira elementos graficos, no solo texto"

**Senales:** >8 min en pagina, "no hay nada", no hicieron scroll completo.
**Tiempo maximo:** 10 min.

## Ejemplo: Secretos de la Muralla

```json
{ "tipo_ocultamiento": "interaccion", "area_busqueda": "footer", "tipo_interaccion": "clic", "coordenadas_elemento": "seccion negra al pie de pagina", "mensaje_oculto": "CODIGO_SECRETO_123" }
```

Pistas: 1)"Explora todos los elementos" 2)"Respuestas en lugares poco habituales" 3)"Desplazate al final" 4)"Clic en seccion negra" 5)"Clic en parte negra = codigo"
