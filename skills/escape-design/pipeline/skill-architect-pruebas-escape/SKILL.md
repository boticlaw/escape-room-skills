---
name: skill-architect-pruebas-escape
description: "Trigger: crear skill de prueba, validar skill escape room, analizar pruebas JSON, nuevo tipo de prueba. Metodología para crear, validar y normalizar skills de tipos de prueba para escape rooms."
---

# Architect de Skills de Pruebas Escape

## Activation Contract

When needing to: (1) decide if a new puzzle skill should be created, (2) validate an existing skill's structure, (3) analyze JSON puzzles to detect skill candidates, (4) initialize a new skill following the standard.

## Data Hierarchy

```
SKILL-ARCHITECT (this skill)
    ↓ defines methodology
SKILL de Tipo de Prueba (e.g: prueba-cifrado)
    ↓ defines rules and patterns
PRUEBA JSON concreta (e.g: cesar_facil.json)
    ↓ implements with specific values
INSTANCIA in a game
```

**Golden rule**: JSON puzzles reference skills. Skills NEVER reference JSON puzzles.

## What IS a Puzzle Skill

A **family of puzzles sharing design logic, validation rules, and frustration/achievement patterns**.

Characteristics:
- Defines WHEN to use (triggers)
- Defines when NOT to use (anti-patterns)
- Documents configurable variables
- Anticipates player errors
- Establishes difficulty scaling

## What it is NOT

- A specific puzzle (that's a JSON)
- A narrative or story
- An auto-content generator
- Too specific (`prueba-cifrado-cesar-mayusculas`) or too generic (`prueba-dificil`)

## Creation Scorecard

Evaluate each candidate. **Minimum: 7/10**.

| Criterion | Weight | Description |
|-----------|--------|-------------|
| **Candidate count** | High (3pts) | ≥3 JSON puzzles that fit |
| **Unique rules** | High (3pts) | Has specific validation/distribution logic |
| **Cross-game reuse** | Mid-High (2pts) | Works in hall, street, investigation |
| **Design impact** | Mid (1pt) | Changes game flow structure |
| **Config complexity** | Variable (1pt) | Multiple variables to document |

| Score | Decision |
|-------|----------|
| 9-10 | Create immediately |
| 7-8 | Create, monitor usage |
| 5-6 | Wait for more candidates |
| <5 | Don't create, use existing skill |

## Mandatory SKILL.md Structure (7 sections + game-type adaptation)

1. **When to Use** — Specific triggers + user prompt examples
2. **When NOT to Use (Anti-patterns)** — Cases + better alternatives
3. **Design Variables** — Name, type, range, default, impact per variable
4. **Common Player Errors** — Predictable frustrations + when to intervene
5. **Difficulty Scaling** — Easy / Standard / Hard versions
6. **Adaptations** — By age, space (hall/street/digital), duration
7. **Relationships** — Synergies, alternatives, incompatibilities with other skills
8. **Game-Type Adaptation** — Hall/Street/Investigation specifics via `metadata_contextual`

**Rule**: Never create `prueba-hall-cifrado`. Use `prueba-cifrado` with contextual metadata.

## Process

### Phase 1: Candidate Analysis

Group puzzles by similar mechanics → identify patterns → count per pattern → document common rules.

### Phase 2: Creation Decision

Apply scorecard. Verify no similar skill exists. Ask: "Would I use this in 3+ different games?"

### Phase 3: Create Skill

`init_skill_prueba.py <name>` → complete 7 sections → review name (`prueba-{mecanica}` kebab-case) → add 2-3 concrete examples.

### Phase 4: Validate

`validate_skill_prueba.py <path>` → verify 7 sections + no duplication + example coherence.

### Phase 5: Integrate

Update JSON puzzles to reference new skill → document relationships (update section 7 of others) → create first example puzzle.

### Phase 6: Maintain

Monitor usage. <3 puzzles after 3 months → consider deprecation. Significant variant → evaluate compound skill.

## Validation Checklist

### Structure
- [ ] Name: `prueba-{mecanica}` kebab-case
- [ ] SKILL.md present
- [ ] 7 sections complete, no empty sections
- [ ] ≤500 lines in SKILL.md

### Content
- [ ] Section 1: ≥3 specific triggers
- [ ] Section 2: ≥2 anti-patterns with alternatives
- [ ] Section 3: Variables with types and ranges
- [ ] Section 4: Predictable player errors
- [ ] Section 5: 3 difficulty levels
- [ ] Section 6: Hall/street/digital adaptations
- [ ] Section 7: Relations with ≥2 existing skills

### Quality
- [ ] Concrete examples (not abstract)
- [ ] Imperative language
- [ ] Doesn't duplicate existing skill
- [ ] Score ≥7 on creation criteria

## References

- `references/good-bad-examples.md` — Good skill vs bad skill examples
- `references/error-catalog.md` — Common creation errors (hyper-specificity, hyper-generality, etc.)
- `references/design-principles.md` — SOLID principles for skills
- `references/success-metrics.md` — How to measure if a skill is working
