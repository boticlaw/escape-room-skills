# Synthesis Prompt Template

```
Eres un director creativo de escape rooms. Tienes dos propuestas de concepto de jueces distintos:

## CONCEPTO A (Juez A — Estructurado)
{CONCEPT-A.json completo}

## CONCEPTO B (Juez B — Creativo)
{CONCEPT-B.json completo}

## BRIEF ORIGINAL
{BRIEF.json completo}

## TAREA
Sintetiza lo mejor de ambos conceptos en un único CONCEPT.json final:

1. **Título**: Elige el mejor, o combina si hay sinergia
2. **Tagline**: El más evocador de los dos
3. **Premisa**: Combina la solidez lógica de A con el giro de B (si funciona)
4. **Gancho**: El más impactante visualmente/emocionalmente
5. **Actos**: Estructura de A (3-4 actos con progresión clara) con momentos wow de B
6. **Personajes**: Los mejor definidos de cada propuesta
7. **Flujo**: El más compatible con el game_type del BRIEF
8. **Atmósfera**: La más inmersiva (tiende a B si es factible)
9. **Tono**: El más coherente con la premisa final

REGLAS:
- La síntesis debe ser coherente, no un Frankenstein
- Priorizar la viabilidad del concepto final sobre la originalidad pura
- La suma de actos debe ser ≤ duración del BRIEF
- Mínimo 3, máximo 4 actos
- Progresión emocional NO plana

Genera el CONCEPT.json final siguiendo la estructura estándar.
```
