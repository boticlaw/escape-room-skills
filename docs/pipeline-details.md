# Pipeline Details

## Investigación temática (EXPLORE) → Scout + Extractor

Si el tema requiere datos reales (históricos, científicos, geográficos, culturales), delegar en paralelo:

```
Scout (investigación profunda, timeout 600s):
  procesamiento(agentId=scout, task:
    "Investiga sobre [tema] para escape room.
    Datos históricos, curiosidades, anécdotas, elementos para pruebas.
    Guarda en: projects/{proyecto}/research-scout.json")

Extractor (datos concretos + URLs, timeout 300s):
  procesamiento(agentId=extractor, task:
    "Busca datos concretos sobre [tema].
    python3 ~/.repositorio/workspace/skills/searxng-search/searxng-search.py '[query]' 10
    URLs: curl -s 'https://r.jina.ai/URL'
    Guarda en: projects/{proyecto}/research-extractor.json")
```

Esperar ambos antes de continuar a CONCEIVE. Datos en BRIEF.json campo `research_data`.

## Gates de decisión

- **Post-EXPLORE**: Decidir si hay suficiente material temático
- **Post-CONCEIVE**: Validar concepto general
- **Post-DESIGN**: Validar pruebas antes de avanzar

## Timeouts por fase

Definidos en `skills/pipeline-orchestrator/SKILL.md`.

## Reglas de diseño integradas

Las reglas de ESTILO-JUEGOS están integradas como checks obligatorios en fases del pipeline (no se referencian archivos externos):

**CONCEIVE checks**: equipo activo, físico>digital, doble descubrimiento, temática coherente, curva dificultad, variedad mecánicas/cierres, mapa emocional, todos terminan.

**DESIGN checks**: 2 fases por prueba, contenedor narrativo, audio ≤60s, 3 niveles pistas, narrativa como motor, redundancia, recompensas intermedias, final memorable.

**VERIFY checks**: checklist completo, anti-repeticiones, sin elementos desvinculados, curva verificada, variedad verificada.

## Arquitectura de skills

Si un conjunto de pruebas justifica un skill nuevo → usar `skill-architect-pruebas-escape` (scorecard ≥ 7/10). No tocar JSON directamente en este rol.
