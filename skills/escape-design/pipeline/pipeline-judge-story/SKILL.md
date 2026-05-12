---
name: pipeline-judge-story
description: Evalúa la narrativa del escape room en FASE 6 (Judgment Day). Analiza gancho, coherencia emocional, personajes, inmersión, final y conexión narrativa.
---

# JudgeStory — Evaluación de Narrativa

Evaluador independiente de la narrativa del escape room. Trabaja en paralelo con JudgeLogic sin comunicación entre ellos.

## Input

Leer estos archivos del proyecto:

- `juego/narrativa/NARRATIVA.md` — Narrativa completa
- `CONCEPT.json` — Concepto original del juego
- `VERIFY-REPORT.json` — Reporte de verificación previo
- `juego/diseño/DISEÑO-JUEGO.md` — Diseño del juego

## Research Frameworks

- `agents/escapeitor/research-frameworks/03-storytelling.md`
- `agents/escapeitor/research-frameworks/05-ux.md`

## Criterios de Evaluación

Cada criterio se puntúa del **1 al 10 (entero)**.

| # | Criterio | Pregunta clave |
|---|----------|---------------|
| 1 | **Gancho** | ¿Engancha en <30 segundos? ¿Es intrigante? |
| 2 | **Coherencia emocional** | ¿La progresión emocional entre actos es natural? |
| 3 | **Personajes** | ¿Están bien definidos? ¿El jugador se involucra? |
| 4 | **Inmersión** | ¿La atmósfera es consistente? ¿El jugador se siente "dentro"? |
| 5 | **Final** | ¿Es satisfactorio? ¿Premia el esfuerzo? |
| 6 | **Conexión narrativa** | ¿Cada prueba conecta con la historia? ¿No hay puzzles "sueltos"? |

## Output

Escribir resultado en `JUDGE-STORY.json`:

```json
{
  "judge": "story",
  "verdict": "approved|approved_with_suggestions|rejected",
  "score": 8.5,
  "evaluacion": {
    "gancho": {"score": 9, "nota": "Descripción específica del rendimiento en este criterio"},
    "coherencia_emocional": {"score": 8, "nota": "..."},
    "personajes": {"score": 8, "nota": "..."},
    "inmersion": {"score": 9, "nota": "..."},
    "final": {"score": 8, "nota": "..."},
    "conexion_narrativa": {"score": 9, "nota": "..."}
  },
  "strengths": ["Punto fuerte específico 1", "Punto fuerte específico 2"],
  "suggestions": ["Mejora opcional 1", "Mejora opcional 2"],
  "issues": ["Problema que DEBE arreglarse 1"]
}
```

## Verdict

| Score promedio | Verdict |
|----------------|---------|
| ≥ 7 | `approved` |
| ≥ 6 y < 7 | `approved_with_suggestions` |
| < 6 | `rejected` |

## Reglas

1. **Score global** = promedio aritmético de los 6 criterios (1 decimal)
2. **Notas específicas**: referenciar elementos concretos del juego, NO generalidades tipo "la narrativa es buena"
3. **Issues** = problemas que DEBEN arreglarse antes de publicar
4. **Suggestions** = mejoras opcionales que elevarían la calidad
5. **Independencia**: NO leer ni referenciar el output del otro judge
6. **Ser crítico pero justo**: un 7 debe significar "realmente bien hecho", no "meh pero lo apruebo"

## Ejemplo

```json
{
  "judge": "story",
  "verdict": "approved_with_suggestions",
  "score": 6.5,
  "evaluacion": {
    "gancho": {"score": 8, "nota": "La carta inicial del Dr. Voss genera urgencia inmediata. El misterio del 'Protocolo Horus' engancha bien."},
    "coherencia_emocional": {"score": 5, "nota": "El salto del Acto 1 (tensión) al Acto 2 (exploración) es brusco. No hay momento de transición emocional."},
    "personajes": {"score": 7, "nota": "La IA 'ARIA' está bien definida, pero el Dr. Voss solo aparece en la intro y no vuelve. Se siente abandonado."},
    "inmersion": {"score": 7, "nota": "Los elementos físicos (cartas envejecidas, carpetas clasificadas) ayudan, pero el audio del Acto 3 rompe la atmósfera."},
    "final": {"score": 6, "nota": "El cliffhanger final frustra más que satisface. El jugador no siente que su esfuerzo fue recompensado."},
    "conexion_narrativa": {"score": 5, "nota": "El puzzle de la cerradura numérica (prueba 3) no conecta con la trama. Es un puzzle genérico insertado sin contexto."}
  },
  "strengths": [
    "La carta inicial del Dr. Voss es un gancho sólido con personalidad",
    "El diseño de elementos físicos (carpetas, documentos) refuerza la inmersión"
  ],
  "suggestions": [
    "Añadir un momento de transición entre Acto 1 y 2 que baje la tensión gradualmente",
    "Hacer reaparecer al Dr. Voss en el Acto 3 como录音 o nota para cerrar su arco"
  ],
  "issues": [
    "El puzzle de la cerradura numérica (prueba 3) está desconectado de la narrativa — necesita justificación in-story",
    "El final cliffhanger necesita un epílogo o resolución parcial que premie al jugador"
  ]
}
```
