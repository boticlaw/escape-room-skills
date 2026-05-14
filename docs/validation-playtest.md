# Validation & Playtest

## Flujo de validación

```
1. Diseñar pruebas (JSONs)
2. Validar diseño → validate-design.py (por archivo)
3. Validar integridad → validate-game-integrity.py (cross-file)
4. Playtest determinista → playtest-simulado.py
5. Playtest LLM → playtest-llm.py
6. SI CRITICAL → corregir → volver a 2
7. SI OK → generar PDF
```

## Ejecución

```bash
# Integridad cross-file (<1s, gratis, requiere juego.json + pruebas)
python3 scripts/validate-game-integrity.py juego.json
# o pasando el directorio que contiene juego.json:
python3 scripts/validate-game-integrity.py examples/real-games/mi-juego/

# Determinista (<1s, gratis)
python3 scripts/playtest-simulado.py game.json --jugadores N

# LLM (~15s primera vez, 0s si no cambió, usa cache)
python3 scripts/playtest-llm.py game.json
```

Todos generan reportes con `problemas_detectados`.

## Checks de integridad (validate-game-integrity.py)

Estos checks validan la coherencia **entre archivos** — detectan errores que los validadores por-archivo no pueden ver:

| Check | Qué verifica | Severidad base |
|-------|-------------|----------------|
| 1. Letra recompensa | `solucion.recompensa.letra` = `hilo_conductor.letra` en cada prueba | CRITICAL si mismatch |
| 2. Hilo conductor completo | Letras consecutivas, forman la palabra esperada, sin huecos | CRITICAL si faltan, WARNING si letra nunca se gana |
| 3. Continuidad navegación | Cada prueba (excepto la última) tiene `carta_navegacion`, y hay punto de entrada | CRITICAL si falta navegación |
| 4. Consistencia textos nav | `ingame_docs` navigation text = `carta_navegacion` text | WARNING si divergen |
| 5a. Código candado sync | `juego.json` mecánica menciona código que coincide con `barrera_fisica.codigo` | CRITICAL si difiere |
| 5b. Etiquetas materiales | `P1_X` en desglose coincide con nombre real de P1 | WARNING si no match |
| 5c. Curva dificultad | `dificultad.curva[]` en juego.json = `dificultad` de cada prueba | WARNING si difiere |
| 5d. Duración total | Suma de duraciones ≈ `duracion_minutos` (±20%) | WARNING si fuera de rango |
| 6a. Letra en ubicación | `barrera_fisica.ubicacion` menciona la letra correcta | WARNING si mismatch (copy-paste) |
| 6b. Referencia prueba | `elementos_necesarios` menciona "P1" en prueba que NO es P1 | WARNING (copy-paste) |
| 6c. Letra en elementos | `elementos_necesarios` menciona "Letra X" pero hilo dice Y | WARNING (copy-paste) |
| 7. Timeline matemático | Fechas de nacimiento, edades y eventos son matemáticamente consistentes | WARNING si hay contradicciones |
| 8. Personajes sync | Array `personajes` en juego.json coincide con datos en pruebas | WARNING si divergen |
| 9. Código adivinable | Código de candado no aparece expuesto en documentos accesibles | WARNING si aparece en narrativa |
| 10. Anti fuerza bruta | Códigos suficientemente largos/aleatorios para resistir fuerza bruta | WARNING si código es débil |
| 11. Impresión B&W | Colores y contrastes funcionan en impresión blanco y negro | WARNING si problemas |
| 12. Resolvibilidad coordenadas | Extracción por coordenadas produce el código correcto | CRITICAL si código no cuadra |
| 13. Código en solución | Código mencionado en `solucion` = `barrera_fisica.codigo` | CRITICAL si diferentes |
| 14. Documentos referenciados | Documentos mencionados en solución existen en `documentos_in_game` | CRITICAL si faltan |
| 15. Materiales referenciados | Items críticos de la solución están en `elementos_necesarios` | WARNING si faltan |

Checks 1-11 detectan errores de **estructura y reordenación**. Checks 12-15 detectan errores de **resolvibilidad mecánica** — puzzles que no se pueden resolver porque los datos son inconsistentes.

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
