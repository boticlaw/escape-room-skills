# JudgeLogic Output Examples

## Schema

```json
{
  "judge": "logic",
  "verdict": "approved|approved_with_issues|rejected",
  "score": 9,
  "evaluacion": {
    "solucionabilidad": {"score": 9, "nota": "string"},
    "sin_dead_ends": {"score": 10, "nota": "string"},
    "dificultad_progresiva": {"score": 9, "nota": "string"},
    "tiempos_realistas": {"score": 8, "nota": "string"},
    "balance_mecanicas": {"score": 9, "nota": "string"},
    "materiales_viables": {"score": 9, "nota": "string"}
  },
  "strengths": ["string"],
  "issues": ["string"],
  "suggestions": ["string"]
}
```

## Detailed Example

```json
{
  "judge": "logic",
  "verdict": "approved_with_issues",
  "score": 6.7,
  "evaluacion": {
    "solucionabilidad": {"score": 7, "nota": "La cadena principal funciona. Pero en prueba 4 se necesita info del diario (Acto 2) que muchos jugadores ya descartaron. Gap parcial."},
    "sin_dead_ends": {"score": 6, "nota": "Si el jugador no encuentra la pista oculta en la carpeta naranja (prueba 2), se queda bloqueado sin alternativa ni hint system."},
    "dificultad_progresiva": {"score": 7, "nota": "Pruebas 1-3 progresan bien. Salto en prueba 5 (cifrado complejo sin rampa)."},
    "tiempos_realistas": {"score": 8, "nota": "Total 47min estimado, razonable para 60min. Prueba 3 podría tomar 12min vs 5min estimados."},
    "balance_mecanicas": {"score": 5, "nota": "5 de 6 pruebas son puzzles de códigos/números. Solo 1 física. Falta variedad."},
    "materiales_viables": {"score": 8, "nota": "Todo imprimible y accesible. Carpeta con compartimento secreto necesita binding artesanal — viable pero laborioso."}
  },
  "strengths": [
    "La cadena principal (1→2→3→6) bien conectada y fluye naturalmente",
    "Tiempos totales realistas dentro del budget"
  ],
  "issues": [
    "Dead end en prueba 2: sin ruta alternativa si no encuentran pista de carpeta naranja",
    "Prueba 5 no tiene rampa de dificultad — salto desde prueba 3"
  ],
  "suggestions": [
    "Añadir 1-2 pruebas no-código para equilibrar mecánicas",
    "Implementar hint system pasivo (pista tras X minutos de inactividad)"
  ]
}
```
