---
name: prueba-laberinto-digital
description: "Trigger: laberinto, navegar, camino, salir, controles direccionales. Navegacion de laberintos digitales con controles direccionales en pantalla."
---

# Prueba Laberinto Digital

## Activation Contract

**Use when:** Navegar laberinto con controles direccionales, simbolizar camino complicado (busqueda, decisiones), paciencia + observacion visual para encontrar ruta.

**Don't use when:** Laberinto fisico real (usar prueba ubicacion), sin paredes/restricciones (`prueba-gps-navegacion`), publico muy joven con baja motricidad fina (`prueba-exploracion-visual`).

## Hard Rules

- **NO** `tamano_laberinto="grande"` + `tiempo_limite < 60` (muy estresante)
- **WARN** `mostrar_minimapa=true` en laberintos pequenos (trivial)
- **REGLA:** Si frustracion supera satisfaccion, reducir complejidad
- **Max time before GM intervention:** 10 min

## Decision Gates

| Nivel | Tamano | Tiempo | Minimapa | Tiempo estimado |
|-------|--------|--------|----------|----------------|
| Facil | 10x10 | Sin limite | Opcional | 2-5min |
| Estandar | 15x15 | Sin limite | No | 5-10min |
| Dificil | 20x20+ | 120s | No | 10-20min |
| Extrema | Muy grande+trampas | Estricto | No | 20+min |

## Execution Steps

1. Disenar laberinto con solucion unica
2. Documentar secuencia de movimientos
3. Verificar sin atajos no intencionados
4. Incluir feedback visual claro (paredes, destino)

## Output Contract

Tamano, tipo de vista, solucion (secuencia de movimientos), punto inicio/fin, codigo recompensa, pistas progresivas.

## References

- `references/variables.md` — Variables, errores, adaptaciones, ejemplo
