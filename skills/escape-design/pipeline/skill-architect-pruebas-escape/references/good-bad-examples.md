# Good vs Bad Skill Examples

## GOOD: `prueba-cifrado`

```markdown
# When to Use
- User asks for "secret codes"
- Need to validate solution without GM intervention
- Theme involves espionage, antiquities, mysteries

# When NOT to Use
- Kids <8 (high frustration). Use prueba-colores-figuras
- Solution must be ambiguous. Use prueba-interpretacion
- Very noisy space. Visual ciphers > auditory

# Design Variables
- alfabeto: "latin" | "numerico" | "simbolos" | "personalizado"
- longitud_solucion: 4-12 caracteres
- tipo_cifrado: "sustitucion" | "transposicion" | "hibrido"

[... 4 more sections ...]

# Relationships
- Complements: prueba-busqueda-objetos
- Alternative: prueba-mecanismo (for non-readers)
- Conflict: prueba-logica-secuencial (both mental, may saturate)
```

**Why good**: Correct abstraction level. Clear variables. Mapped relationships.

---

## BAD: `prueba-acertijo`

```markdown
# Description
Questions with clever answers

# How to use
Ask the player a difficult question
```

**Why bad**: Too generic. No variables. No anti-patterns. Indistinguishable from any mental puzzle.

---

## GOOD: `prueba-mecanismo-fisico`

```markdown
# When to Use
- Tactile interaction required (not just mental)
- Need immediate feedback (correct/incorrect)
- Physical space allows object manipulation

# Design Variables
- tipo_mecanismo: "combinacion" | "secuencia" | "alineacion" | "peso"
- feedback: "sonido" | "luz" | "apertura" | "combinado"
- reintentos: 1-5 | "infinito"

# Common Errors
- Player doesn't understand what to do: visual "interactable" indicator
- Mechanism jammed: always have manual override for GM

[... more sections ...]
```

**Why good**: Clear boundary between mental and physical. Anticipates technical problems.

## Compound Puzzle Example

```json
{
  "id": "prueba_001",
  "skills": {
    "primario": "prueba-cifrado",
    "secundarios": ["prueba-busqueda-objetos"]
  }
}
```

A puzzle JSON references **1 primary skill** + **0-3 secondary skills**.

## Skill Types

1. **Atomic**: Pure puzzle mechanism (e.g: `prueba-cifrado`)
2. **Compound**: 2+ atomic skills (e.g: `prueba-cifrado-mecanismo`) — only if combination is very common
3. **Flow**: Narrative structures (e.g: `flujo-lineal`) — use sparingly
