---
name: prueba-investigacion-texto
description: "Trigger: buscar en texto, informacion escondida, leer documento, pista en texto, comprension lectora. Encontrar informacion especifica en textos proporcionados."
---

# Prueba Investigacion Texto

## Activation Contract

**Use when:** Buscar info en texto proporcionado, respuesta escondida en explicaciones/dialogos/documentos, lectura atenta y comprension necesaria para avanzar.

**Don't use when:** Texto > 500 palabras (dividir en secciones), respuesta en primera linea (no hay investigacion), respuesta requiere conocimiento externo al texto (toda info necesaria en el texto).

## Hard Rules

- **NO** `longitud_texto="largo"` + `dificultad_comprension > 7`
- **REGLA:** Toda info necesaria debe estar en el texto proporcionado
- **Max time before GM intervention:** 10 min

## Decision Gates

| Nivel | Longitud | Ubicacion pista | Formato respuesta | Tiempo |
|-------|----------|----------------|-------------------|--------|
| Facil | Corta <200 | Resaltado/negrita | Palabra clave | 2-5min |
| Estandar | Media 200-500 | Medio del texto | Palabra/frase | 5-10min |
| Dificil | Larga 500+ | Implicita | Concepto | 10-15min |
| Extrema | Multiple documentos | Dispersa, cruzar datos | Concepto complejo | 15+min |

## Execution Steps

1. Redactar texto con info incluida
2. Verificar respuesta unica y clara
3. Decidir si resaltar palabra clave o no
4. Preparar pistas de ubicacion (seccion/parrafo)

## Output Contract

Texto completo, respuesta correcta, formato de respuesta, ubicacion de la pista, pistas progresivas.

## References

- `references/variables.md` — Variables, errores, adaptaciones, ejemplo
