# Validation & Playtest

## Flujo de validación

```
1. Diseñar pruebas (JSONs)
2. Validar diseño → validate-design.py
3. Playtest determinista → playtest-simulado.py
4. Playtest LLM → playtest-llm.py
5. SI CRITICAL → corregir → volver a 2
6. SI OK → generar PDF
```

## Ejecución

```bash
# Determinista (<1s, gratis)
python3 scripts/playtest-simulado.py game.json --jugadores N

# LLM (~15s primera vez, 0s si no cambió, usa cache)
python3 scripts/playtest-llm.py game.json
```

Ambos generan reportes JSON con `problemas_detectados`.

## Loop de corrección (máx 3 iteraciones)

| Problema | Acción |
|----------|--------|
| Desbalance participación | Añadir interacciones cooperativas |
| Pista N2+ pedida | Revisar instrucciones, añadir pistas N1 |
| Cuello de botella / tiempo excesivo | Simplificar mecánica o dividir en fases |
| Jugador frustrado | Reducir dificultad o pistas progresivas |
| Novato no entiende (LLM) | Reescribir instrucciones más simple |
| Experimentado se aburre (LLM) | Añadir capa complejidad/reto opcional |
| Confusión en mecánica (LLM) | Revisar narrativa y pasos, más explícito |

Corregir JSONs → re-ejecutar ambos playtests. Criterios de salida:

- **Exit 0** sin CRITICALs → generar PDF
- Máx 3 iteraciones con WARNINGs (no CRITICAL) → aceptar y continuar
- CRITICAL tras 3 iteraciones → reportar a Daniel con problemas persistentes

## Exit codes

- **Exit 0**: OK (puede haber WARNINGs, sin CRITICALs)
- **Exit 1**: CRITICAL detectado
