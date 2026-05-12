# Design Principles for Skills

## Single Responsibility
A skill does ONE thing well. If it describes 2 distinct mechanics, split.

## Open/Closed
Existing skills can extend (new variables) but not modify in essence (change when to use).

## Liskov Substitution
A puzzle configured for `prueba-cifrado-sustitucion` should work if changed to generic `prueba-cifrado`.

## Interface Segregation
Prefer 2 specific skills over 1 skill with many "modes". Easier to choose.

## Dependency Inversion
High-level (compound) skills depend on atomic skills, not the reverse.
