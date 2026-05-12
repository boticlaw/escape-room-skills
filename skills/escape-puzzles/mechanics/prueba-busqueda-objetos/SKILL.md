---
name: prueba-busqueda-objetos
description: "Trigger: esconder objetos, busqueda del tesoro, encontrar items, scavenger hunt. Jugadores encuentran objetos ocultos o dispersos necesarios para avanzar."
---

# Prueba Busqueda de Objetos

## Activation Contract

**Use when:** Esconder objetos, busqueda del tesoro, recolectar multiples items para desbloquear algo, espacio permite ocultamientos naturales. Tipos de ocultamiento: camuflaje, escondido, disperso.

**Don't use when:** Sin contexto narrativo (rompe inmersion), objetos imposibles de encontrar (frustracion injusta), busqueda puramente azarosa sin pistas.

## Hard Rules

- **NO** `numero_objetos > 8` + `area_busqueda="sala"` (saturacion)
- **NO** `pistas_disponibles=false` + `tipo_ocultamiento="camuflaje"` (imposible injusto)
- **WARN** `objetos_decoy > 3` (confusion excesiva)
- **Max time before GM intervention:** 8-10 min sin progreso

## Decision Gates

| Nivel | Objetos | Ocultamiento | Decoys | Tiempo |
|-------|---------|-------------|--------|--------|
| Facil | 3-4 | Evidente "visible pero no obvio" | 0 | 5-8min |
| Estandar | 5-6 | Mixto (camuflaje+escondido) | 1-2 | 10-15min |
| Dificil | 7-8 | Camuflaje exigente | 2-3 | 15-22min |
| Extrema | 10 | Multi-area | 3+ | 25+min |

## Execution Steps

1. Definir `numero_objetos` y `tipo_ocultamiento`
2. Conectar cada objeto con narrativa (evidencia, pieza, tesoro)
3. Preparar lista/indicios (`formato_pistas`)
4. Ubicar objetos segun "visible pero no obvio"
5. Documentar todas las ubicaciones para GM
6. Prever reposicion rapida entre sesiones

## Output Contract

Lista de objetos con ubicaciones, tipo de ocultamiento, lista/imagenes de pista para jugadores, objetivo final al encontrar todos.

## References

- `references/variables.md` — Variables, tipos de ocultamiento, errores, adaptaciones, ejemplos
