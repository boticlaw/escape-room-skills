---
name: prueba-comunicacion-mensajes
description: "Trigger: codigo morse, banderas nauticas, semaforo, mensaje secreto, comunicacion equipos, descifrar mensaje. Pruebas de envío y descifrado de mensajes usando códigos y sistemas de comunicación."
---

# Prueba: Comunicación de Mensajes

## Activation Contract

Use when:
- User mentions codes, ciphers, secret messages, "morse", "flags", "semaphore"
- Players must decipher info using predefined encoding system
- Teams separated with complementary info must communicate
- Theme involves espionage, military, naval, telecom, survival
- Players interpret unconventional visual/auditory signals

## Anti-Patterns (Don't Use)

| Anti-Pattern | Why | Alternative |
|-------------|-----|-------------|
| Kids <8 years | No patience for symbol→letter mapping | `prueba-figuras-colores` |
| Very noisy space | Audio codes become impossible | `prueba-cifrado-visual` |
| Solution must be ambiguous | Code systems are deterministic | `prueba-interpretacion` |
| Messages >20 chars | Manual transcription is tedious | Split messages or use `prueba-busqueda-objetos` |

**Rule**: If decoding takes >5 min manual transcription → simplify or change type.

## Design Variables

### Primary

| Variable | Type | Range | Default |
|----------|------|-------|---------|
| `tipo_codigo` | string | morse, banderas_nauticas, semaforo, torres_agua, braille, codigo_cesar, lenguaje_signos, alfabeto_fonetico, personalizado | morse |
| `longitud_mensaje` | number | 4-20 | 8 |
| `separacion_equipos` | boolean | true/false | false |
| `modalidad_comunicacion` | string | visual, auditiva, tactil, mixta | visual |
| `diccionario_proporcionado` | boolean | true/false | true |

### Forbidden Combinations

- ❌ `separacion_equipos=true` + `modalidad="tactil"` (can't communicate at distance)
- ❌ `diccionario_proporcionado=false` + `tipo_codigo="personalizado"` + `longitud_mensaje>8` (impossible to deduce)
- ⚠️ `longitud_mensaje >15` + `separacion_equipos=true` (error-prone)
- ⚠️ `modalidad="auditiva"` in spaces with echo/ambient noise

## Common Player Errors

| Error | Symptom | Prevention | Intervention |
|-------|---------|------------|-------------|
| Similar-symbol confusion (E vs T in morse) | Some letters wrong | Include examples of confusable symbols in dictionary | "Check the 2nd letter, two symbols are very similar" |
| Transcription errors in separation | Team A sends, Team B decodes differently | Let receiving team see original; add verification methods | "Review the original message together" |
| Creative interpretation of code | Invent own interpretation instead of using dictionary | Include one solved example "A = [symbol]" | "The code is exact, not interpretive. Use dictionary literally" |
| Overthinking obvious dictionary | Searching for hidden patterns when message is literal | Add instruction: "Decoded message IS the solution" | "Trust what you see, no extra trick" |

**Alarm signals**: 3+ failed combos, debating "what they saw", abandoned dictionary, one team silent.

**Max time before intervention**: 8 min (10 min with team separation).

## Difficulty Scaling

| Aspect | Easy (1-3) | Standard (4-6) | Hard (7-9) | Extreme (10) |
|--------|-----------|---------------|------------|--------------|
| Message length | 4-6 chars | 6-10 | 10-15 | 15-20+ |
| Team separation | No | Optional | Yes | Multiple teams |
| Dictionary | Complete | Complete | Partial | Absent (deduce) |
| Code complexity | Standard (morse) | Standard | Less common | Multiple codes |
| Attempts | Unlimited | 5 | 3 | 2 |

## Adaptations

### By Age
- **Kids (8-12)**: Known codes (morse slow audio, tactile braille), no separation, visual elements
- **Teens (13-17)**: Standard codes, 2-team separation OK, espionage narrative
- **Adults (18+)**: Full complexity, authentic historical codes, partial dictionaries

### By Space
- **Hall**: Walls separate teams, speakers for audio codes, observation windows
- **Street**: Real distances, phones for distant communication, choose quiet zones
- **Investigation**: Digital video/audio, PDF dictionaries, remote transmission

### By Duration
- **Quick (5-10 min)**: Short message, complete dictionary, no separation
- **Standard (15-30)**: Optional separation, 8-10 chars, may include bidirectional
- **Epic (45+)**: Multiple messages, deduce dictionary, multiple codes, sub-stages (find dictionary → receive → decode → transmit response)

## Relationships

| Type | Skills | Frequency |
|------|--------|-----------|
| **Synergy** | `prueba-busqueda-objetos` (hidden dictionary) | Very common |
| **Synergy** | `prueba-logica-secuencial` (decoded message = sequence) | Very common |
| **Synergy** | `prueba-panel-electrico` (decoded = wiring instructions) | Common |
| **Alternative** | `prueba-interpretacion-texto` (metaphors, not code) | — |
| **Alternative** | `prueba-rompecabezas-visual` (pattern recognition, no code) | — |
| **Conflict** | `prueba-memorizacion-pura` (codes need reference, not memory) | — |

Compound examples in `references/compound-examples.md`.

## References

- `references/compound-examples.md` — 3 detailed compound puzzle examples
- `references/concrete-examples.md` — 4 complete puzzle examples (Morse, Flags, Semaphore, Deduction)
