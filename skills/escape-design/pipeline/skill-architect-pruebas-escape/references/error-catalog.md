# Common Creation Errors

## Error 1: Hyper-Specificity
**Symptom**: `prueba-cifrado-cesar-mayusculas-3letras`
**Problem**: Only serves one case. Not reusable.
**Fix**: Raise abstraction level. Specific values go in the JSON.

## Error 2: Hyper-Generality
**Symptom**: `prueba-puzzle` or `prueba-dificil`
**Problem**: Too broad, adds no value.
**Fix**: Divide into concrete mechanics.

## Error 3: Instance Binding
**Symptom**: `prueba-habitacion-sala-roja`
**Problem**: Tied to specific context.
**Fix**: Extract mechanic, leave narrative for JSON.

## Error 4: Missing Anti-Patterns
**Symptom**: Only describes when to use, not when to avoid.
**Problem**: Agents use skill inappropriately.
**Fix**: Exhaustive section 2.

## Error 5: Poorly Defined Variables
**Symptom**: "You can adjust the difficulty"
**Problem**: Doesn't specify HOW.
**Fix**: Document concrete parameters and effects.

## Error 6: Ignoring Relationships
**Symptom**: Isolated skill, doesn't mention others.
**Problem**: Loses ecosystem context.
**Fix**: Map synergies and conflicts with existing skills.
