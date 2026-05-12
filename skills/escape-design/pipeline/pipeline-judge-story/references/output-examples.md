# JudgeStory Output Examples

## Schema

```json
{
  "judge": "story",
  "verdict": "approved|approved_with_suggestions|rejected",
  "score": 8.5,
  "evaluacion": {
    "gancho": {"score": 9, "nota": "string"},
    "coherencia_emocional": {"score": 8, "nota": "string"},
    "personajes": {"score": 8, "nota": "string"},
    "inmersion": {"score": 9, "nota": "string"},
    "final": {"score": 8, "nota": "string"},
    "conexion_narrativa": {"score": 9, "nota": "string"}
  },
  "strengths": ["string"],
  "suggestions": ["string"],
  "issues": ["string"]
}
```

## Detailed Example

```json
{
  "judge": "story",
  "verdict": "approved_with_suggestions",
  "score": 6.5,
  "evaluacion": {
    "gancho": {"score": 8, "nota": "La carta del Dr. Voss genera urgencia inmediata. El misterio del 'Protocolo Horus' engancha."},
    "coherencia_emocional": {"score": 5, "nota": "Salto del Acto 1 (tensión) al Acto 2 (exploración) es brusco. Sin transición emocional."},
    "personajes": {"score": 7, "nota": "La IA 'ARIA' bien definida, pero Dr. Voss solo aparece en intro. Se siente abandonado."},
    "inmersion": {"score": 7, "nota": "Elementos físicos ayudan, pero audio del Acto 3 rompe la atmósfera."},
    "final": {"score": 6, "nota": "El cliffhanger frustra más que satisface."},
    "conexion_narrativa": {"score": 5, "nota": "Puzzle de cerradura numérica (prueba 3) no conecta con la trama. Genérico sin contexto."}
  },
  "strengths": [
    "Carta inicial del Dr. Voss es un gancho sólido con personalidad",
    "Diseño de elementos físicos refuerza inmersión"
  ],
  "suggestions": [
    "Añadir transición entre Acto 1 y 2 que baje tensión gradualmente",
    "Hacer reaparecer al Dr. Voss en Acto 3 para cerrar su arco"
  ],
  "issues": [
    "Puzzle cerradura numérica (prueba 3) desconectado de narrativa",
    "Final cliffhanger necesita resolución parcial que premie al jugador"
  ]
}
```
