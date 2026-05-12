---
name: pipeline-skill-resolution
description: "Trigger: resolver frameworks pipeline, skill resolution, resolver estándares. Determina qué research frameworks y skills son relevantes para cada fase del pipeline según game_type y phase."
---

# Skill Resolution Protocol

## Activation Contract

Orchestrator executes this as **first step of every phase**, before preparing sub-agent prompt. Injects resolved standards into prompt as context.

## Registry

### By game_type → base frameworks

| game_type | Frameworks |
|-----------|-----------|
| `hall-escape` | `01-narrative-arc`, `02-puzzle-design`, `06-spatial-puzzles`, `10-escape-room-master` |
| `investigation` | `01-narrative-arc`, `03-clue-chains`, `07-deduction-games`, `10-escape-room-master` |
| `street-escape` | `01-narrative-arc`, `04-team-dynamics`, `08-mobile-puzzles`, `10-escape-room-master` |
| `concurso` | `01-narrative-arc`, `02-puzzle-design`, `05-ux`, `09-estilo-juegos` |

### By phase → additions to base

| phase | Additions |
|-------|-----------|
| `explore` | None (connectivity check only) |
| `conceive` | Base + `estilo-juegos` |
| `design` | Base + patrones #1-#10 (from `estilo-juegos`) |
| `build` | Base + patrones #11-#18 (from `estilo-juegos`) |
| `verify` | `pipeline-verify/SKILL.md` |
| `judge` | `pipeline-judge-story/SKILL.md` + `pipeline-judge-logic/SKILL.md` |

## Execution

Lookup game_type + phase → return file list:

```
RESOLVED_STANDARDS:
- research-frameworks/01-narrative-arc.md
- research-frameworks/02-puzzle-design.md
- research-frameworks/10-escape-room-master.md
```

If phase = `build`: also search puzzle catalog. See `references/puzzle-catalog-lookup.md`.

## Hard Rules

1. Agent loads ONLY these files, not the entire frameworks directory.
2. `game_type` undefined → default `hall-escape`.
3. Phase not in table → no additions (base only).
4. Paths relative to project root.
5. This skill generates NO files — returns list only.
6. Execution: <5s (lookup, no heavy LLM).

## Output

Return list as sub-agent output. Examples in `references/resolved-examples.md`.

## References

- `references/resolved-examples.md` — 4 resolved examples by game_type × phase
- `references/puzzle-catalog-lookup.md` — Puzzle catalog search for build phase
