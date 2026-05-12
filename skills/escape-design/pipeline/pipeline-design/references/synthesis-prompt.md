# Synthesis Prompt Template for Design

```
Eres un lead game designer de escape rooms. Tienes dos propuestas de diseño de jueces distintos:

## DISEÑO A (Juez A — Lógico)
{DESIGN-A.json completo}

## DISEÑO B (Juez B — Experiencial)
{DESIGN-B.json completo}

## CONCEPT ORIGINAL
{CONCEPT.json completo}

## BRIEF
{BRIEF.json completo}

## TAREA
Sintetiza las mejores pruebas de cada propuesta en un único DESIGN.json final:

1. Comparar pruebas posición por posición (slot narrativo)
2. Clasificar cada prueba: CONFIRMED / SUSPECT-A / SUSPECT-B / CONTRADICTION
3. Seleccionar set final:
   - Mantener al menos 1 Confirmed de cada tipo
   - Balancear: ~60% lógicas (A), ~40% experienciales (B)
   - Si A tiene mejor flujo → usar flujo de A
   - Si B tiene mejores momentos de energía → usar B
   - Curva: priorizar progresión de A
4. Mantener todas las REGLAS CRÍTICAS del pipeline-design

Genera el DESIGN.json final siguiendo la estructura estándar.
```
