# Escape Room Skills

> Portable escape room design system for AI agents — from concept to printable materials.

## What Is This?

A self-contained toolkit that gives any LLM agent the knowledge and templates to design, build, and test professional escape room games. Three composable skills cover the full pipeline:

| Skill | Purpose |
|---|---|
| **escape-design** | Master pipeline — 10-phase design process with integrated research frameworks |
| **escape-build** | HTML→PDF generation with themed templates and materials |
| **escape-puzzles** | Catalog of 21 puzzle mechanics with selection guidance |

## Architecture

```
escape-room-skills/
├── skills/
│   ├── escape-design/      # Master skill — full design pipeline
│   ├── escape-build/       # Templates, CSS, materials generator
│   └── escape-puzzles/     # Mechanics catalog (21 types)
├── schemas/                # JSON Schema (draft-07) for game.json & prueba
├── scripts/                # build-pdf.mjs, validate-schema.sh
├── templates/
│   ├── css/                # escape-base.css (variables + components)
│   └── html/               # game-design.html template
├── game-types/
│   ├── hall-escape/        # Indoor 50+ m², teams 5-10
│   ├── street-escape/      # Outdoor, GPS/QR, teams 2-5
│   └── investigation/      # Detective/crime, narrative-heavy
├── research-frameworks/    # Source references
└── examples/               # Sample game.json + prueba.json
```

### Design Pipeline (escape-design)

```
RESOLVE → EXPLORE → CONCEIVE → DESIGN → NARRATIVE → DIFFICULTY → BUILD → PLAYTEST → VERIFY → JUDGMENT
```

Each phase has compact rules distilled from 10 research frameworks covering game design, puzzle theory, storytelling, psychology, UX, scenography, technology, testing, practical game style, and master-level escape room design.

### Core Design Rules

| Rule | Meaning |
|---|---|
| **ZERO GM** | Games must run without a human game master |
| **ANTI-CHEAT** | Puzzles resist brute-force and accidental solves |
| **SELF-SERVICE** | Players self-verify solutions through mechanisms |
| **REAL MECHANISMS** | Physical/digital locks, not "tell the GM the answer" |
| **NO CROSS-DEPENDENCIES** | Each puzzle is self-contained; no data from puzzle A needed in puzzle B |

## Install

### opencode

```bash
cp -r skills/* ~/.config/opencode/skills/
```

### Claude Code

```bash
cp -r skills/* .claude/skills/
```

### Generic LLM Agent

Copy the contents of each `skills/*/SKILL.md` into your agent's instruction context. The files are self-contained with no external dependencies.

See [INSTALL.md](INSTALL.md) for detailed instructions.

## Quick Start

1. Load `escape-design/SKILL.md` into your agent
2. Describe the game you want: type, theme, player count, duration
3. The agent follows the 10-phase pipeline
4. Output: `game.json` + individual `prueba-*.json` files
5. Run `scripts/build-pdf.mjs` to generate printable design and test documents

## Schemas

Validate your game files:

```bash
# Validate game structure
python3 -m json.tool schemas/game.schema.json > /dev/null

# Validate all puzzles
bash scripts/validate-schema.sh /path/to/game-dir
```

## License

[Apache-2.0](LICENSE) — use freely, attribution appreciated.
