---
name: prueba-exploracion-visual
description: "Trigger: explorar pagina, elemento oculto, clic zona secreta, scroll, contenido escondido. Encontrar elementos ocultos en interfaces digitales."
---

# Prueba Exploracion Visual

## Activation Contract

**Use when:** Explorar pagina/interfaz completa, elemento oculto a descubrir, clic en zona especifica revela contenido secreto. Tipos: color, posicion, interaccion, scroll.

**Don't use when:** Elemento imposible (pixel unico sin pista), solo adivinanza sin exploracion (`prueba-adivinanza-ubicacion`), pantalla pequena movil con area grande.

## Hard Rules

- **NO** `dificultad_visual > 8` + `area_busqueda="toda_pagina"`
- **WARN** `tipo_interaccion="hover"` en moviles (no funciona)
- **REGLA:** Al menos una pista indirecta de donde buscar
- **Max time before GM intervention:** 10 min

## Decision Gates

| Nivel | Ocultamiento | Area | Interaccion | Tiempo |
|-------|-------------|------|------------|--------|
| Facil | Scroll al final | Footer | Ninguna | 2-5min |
| Estandar | En zona especifica | Toda pagina | Clic | 5-10min |
| Dificil | Camuflado por color | Especifica | Clic sutil | 10-15min |
| Extrema | Multiple capas | Pixel hunting | Compleja | 15+min |

## Execution Steps

1. Definir ubicacion exacta del elemento
2. Elegir tipo de ocultamiento (color, interaccion, scroll)
3. Incluir al menos una pista indirecta
4. Asegurar feedback al encontrar

## Output Contract

Tipo de ocultamiento, area de busqueda, tipo de interaccion, mensaje/codigo revelado, coordenadas aproximadas, pistas progresivas.

## References

- `references/variables.md` — Variables, errores, adaptaciones, ejemplo
