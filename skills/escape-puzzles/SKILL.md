---
name: escape-puzzles
description: "Trigger: puzzle mechanic, select puzzle type, mecanica puzzle, choose puzzle. Catalog of 21 escape room puzzle mechanics organized by category."
---

# Escape Room Puzzles — Mechanics Catalog

## Activation Contract

Load when selecting puzzle mechanics during game design, or when asked "what mechanic for X need?".

## Quick Reference: "What Mechanic for X Need?"

| You need... | Use mechanic |
|---|---|
| Players to think logically | nonogram, secuencial, posiciones |
| Players to remember things | memoria |
| Players to match/compare | texto |
| Physical interaction | mecanismo, panel-electrico, puzzle-ensamblaje |
| Physical skill | punteria-derribo |
| Digital/tablet integration | tablet-cooperativo, panel-control-app, arcade-digital, laberinto-digital |
| Split team communication | comunicacion-mensajes |
| Players to search the room | busqueda-objetos, exploracion-visual |
| Outdoor navigation | gps-navegacion, ubicacion-qr |
| Location-based discovery | acrostico-ubicacion, adivinanza-ubicacion |
| Reading and deduction | investigacion-texto |

## Game Type Compatibility Matrix

| Mechanic | Hall Escape | Street Escape | Investigation |
|---|:---:|:---:|:---:|
| nonogram | ✅ | ✅ | ✅ |
| posiciones | ✅ | ✅ | ✅ |
| secuencial | ✅ | ✅ | ✅ |
| memoria | ✅ | ⚠️ | ✅ |
| texto | ✅ | ⚠️ | ✅ |
| mecanismo | ✅ | ❌ | ✅ |
| panel-electrico | ✅ | ❌ | ⚠️ |
| punteria-derribo | ✅ | ❌ | ❌ |
| puzzle-ensamblaje | ✅ | ⚠️ | ✅ |
| tablet-cooperativo | ✅ | ✅ | ⚠️ |
| panel-control-app | ✅ | ✅ | ⚠️ |
| arcade-digital | ✅ | ✅ | ❌ |
| laberinto-digital | ✅ | ✅ | ❌ |
| comunicacion-mensajes | ✅ | ✅ | ✅ |
| busqueda-objetos | ✅ | ✅ | ✅ |
| exploracion-visual | ✅ | ✅ | ✅ |
| ubicacion-qr | ❌ | ✅ | ⚠️ |
| gps-navegacion | ❌ | ✅ | ❌ |
| acrostico-ubicacion | ⚠️ | ✅ | ⚠️ |
| adivinanza-ubicacion | ⚠️ | ✅ | ✅ |
| investigacion-texto | ✅ | ✅ | ✅ |

✅ = Excellent fit | ⚠️ = Possible with adaptation | ❌ = Not recommended

## Output Contract

Selected mechanics with difficulty ratings, player counts, and duration estimates for the DESIGN phase.

## References

- `references/mechanic-catalog.md` — Full descriptions, common errors, and scaling for all 21 mechanics
- Individual mechanic skills in `mechanics/prueba-{name}/` — Per-mechanic SKILL.md files
