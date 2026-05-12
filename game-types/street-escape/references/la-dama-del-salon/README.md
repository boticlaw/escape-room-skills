# Referencia: La Dama del Salón

**Tipo:** Street Escape (outdoor, geolocalizado)  
**Ubicación:** Parque del Salón, Palencia, España  
**Repo:** `https://github.com/danielgap/La-dama-del-salon` (privado, acceso boticlaw)  
**Código fuente:** `SANITIZED_PATH`  
**Fecha análisis:** 2026-04-27

---

## Archivos de Referencia

| Archivo | Descripción |
|---------|-------------|
| `ANALYSIS.md` | Análisis completo del juego (stack, mecánicas, narrativa, patrones) |
| `dama-mecanicas-catalogo.json` | 12 mecánicas con parámetros configurables y score de reusabilidad |
| `dama-narrative-templates.json` | Templates narrativos, sistema de hints, NPC chat, diseño visual |
| `dama-data-model-patterns.json` | Modelo de datos, API, state management, flow template |
| `dama-levels-complete.json` | Los 13 niveles con GPS, soluciones, keywords y mecánicas |

## Cómo usar esta referencia

1. **Diseñando un street escape nuevo** → consulta `dama-levels-complete.json` para ver el flujo completo nivel a nivel
2. **Necesitas una mecánica concreta** → busca en `dama-mecanicas-catalogo.json` por tipo (geo, puzzle, chat...)
3. **Escribiendo narrativa** → usa `dama-narrative-templates.json` como template de diario/personajes
4. **Modelando datos** → referencia `dama-data-model-patterns.json` para el schema del juego
5. **Visión general** → lee `ANALYSIS.md` primero

## Métricas del juego real

- 13 niveles, ~2km de recorrido
- 69% niveles con geolocalización (25m radio)
- 46% niveles con minijuegos
- 8% con IA conversacional
- Stack: Wasp + React + PostgreSQL + Fly.io + Gemini/OpenAI
