---
name: prueba-acrostico-ubicacion
description: "Trigger: acrostico, primeras letras, poema, versos, iniciales forman palabra, lugar fisico. Las primeras letras de cada linea forman nombre de ubicacion."
---

# Prueba Acrostico Ubicacion

## Activation Contract

**Use when:** Primera letra de cada linea forma nombre de lugar, patron en iniciales de versos/poema/prosa, letras forman ubicacion fisica a visitar.

**Don't use cuando:** Palabra < 4 letras (trivial) o > 8 (agotador), versos forzados incoherentes (arruina inmersion), palabra obvia desde las primeras 2 letras.

## Hard Rules

- **NO** `explicitar_patron=false` + `dificultad_deduccion > 7`
- **WARN** `numero_letras > 8` (agota)
- Versos deben tener sentido semantico completo
- **Max time before GM intervention:** 10 min

## Decision Gates

| Nivel | Letras | Patron | Pistas | Tiempo |
|-------|--------|--------|--------|--------|
| Facil | 4-5 | Explicito | 5 | 2-5min |
| Estandar | 6-7 | Implicito | 4 | 5-10min |
| Dificil | 7-8 | No mencionado | 2 | 10-15min |
| Extrema | 8+ multiple | Bidireccional | 0 | 15+min |

## Execution Steps

1. Definir `palabra_objetivo` (4-8 letras)
2. Redactar versos coherentes que empiecen con cada letra
3. Verificar que el poema tiene sentido completo
4. Preparar pistas sobre patron ("como empiezas siempre es importante")

## Output Contract

Palabra objetivo, versos completos, formato texto, dificultad, ubicacion revelada, pistas progresivas.

## References

- `references/variables.md` — Variables, errores, adaptaciones, ejemplo concreto
