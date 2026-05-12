# Escape Room Skills

> Portable escape room design system for AI agents — from concept to printable materials.

## What Is This?

A self-contained toolkit that gives any LLM agent the knowledge and templates to design, build, and test professional escape room games. Three composable skills cover the full pipeline, backed by 10 research frameworks, 21 puzzle mechanics, real game examples, production-tested scripts, and an optional self-hosted search stack for automatic thematic research.

| Skill | Purpose |
|---|---|
| **escape-design** | Master pipeline — 12-phase resumable design process with 15 pipeline phase skills |
| **escape-build** | HTML→PDF generation with themed templates and 7 material categories |
| **escape-puzzles** | Catalog of 21 puzzle mechanics with individual SKILL.md files per mechanic |

## Architecture

```
escape-room-skills/
├── skills/
│   ├── escape-design/              # Master skill — full design pipeline
│   │   ├── SKILL.md                # Main pipeline orchestrator
│   │   └── pipeline/               # 15 individual phase skills
│   │       ├── pipeline-orchestrator/  # Pipeline orchestrator with PROGRESS template
│   │       ├── pipeline-explore/       # Brief + research
│   │       ├── pipeline-conceive/      # Concept generation (dual perspective)
│   │       ├── pipeline-design/        # Puzzle design (dual perspective)
│   │       ├── pipeline-build/         # Build game files
│   │       ├── pipeline-verify/        # Quality verification
│   │       ├── pipeline-judgment-day/  # Adversarial review
│   │       ├── pipeline-judge-logic/   # Logic evaluation
│   │       ├── pipeline-judge-story/   # Narrative evaluation
│   │       ├── pipeline-playtest/      # Simulated playtest
│   │       ├── pipeline-narrative-consistency/  # Story coherence
│   │       ├── pipeline-difficulty-calibration/ # Balance difficulty
│   │       ├── pipeline-regression/    # Regression testing
│   │       ├── pipeline-skill-resolution/  # Mechanic selection
│   │       ├── skill-architect-pruebas-escape/ # New mechanic creator
│   │       └── skill-creador-juegos/   # Game creator meta-skill
│   ├── escape-build/               # Templates, CSS, materials generator
│   └── escape-puzzles/             # Mechanics catalog
│       ├── SKILL.md                # Overview + compatibility matrix
│       └── mechanics/              # 21 individual mechanic folders
│           ├── prueba-logica-nonogram/SKILL.md
│           ├── prueba-gps-navegacion/SKILL.md
│           └── ... (19 more)
├── schemas/                        # JSON Schema (draft-07) + skill registry
│   ├── game.schema.json
│   ├── prueba.schema.json
│   ├── brief.schema.json
│   ├── concept.schema.json
│   ├── design.schema.json
│   ├── verify-report.schema.json
│   └── skill-registry.json         # Full mechanic/pipeline registry
├── scripts/                        # 14 utility scripts
│   ├── build-pdf.mjs               # Puppeteer PDF generator
│   ├── build.sh                    # Full build pipeline
│   ├── escape-materials-generator.py  # Generate printable materials
│   ├── escape-pdf-generator.mjs    # Advanced PDF with categories
│   ├── escape-compact-pdf.py       # Compact PDF generation
│   ├── init-juego.py               # Initialize new game project
│   ├── validate-design.py          # Design validation
│   ├── review-design.py            # Design review
│   ├── playtest-simulado.py        # Simulated playtest
│   ├── playtest-llm.py             # LLM-powered playtest
│   ├── gamejson-to-markdown.mjs    # Convert JSON to Markdown
│   ├── escape-json2md.sh           # Batch JSON to Markdown
│   └── validate-schema.sh          # Schema validation
├── templates/
│   ├── css/escape-base.css         # 8 CSS variables + all components
│   └── html/game-design.html       # Full game design template
├── research-frameworks/            # 10 professional design guides
│   ├── 01-game-design.md           # MDA framework, flow types
│   ├── 02-puzzle-design.md         # Taxonomy, aha moments
│   ├── 03-storytelling.md          # Freytag pyramid, environmental narrative
│   ├── 04-psicologia.md            # Flow theory, motivation
│   ├── 05-ux.md                    # Usability, friction, hints
│   ├── 06-escenografia.md          # Atmosphere, sensory design
│   ├── 07-tecnologia.md            # Sensors, AR, tablets
│   ├── 08-testing.md               # Playtest methodology, metrics
│   ├── 09-estilo-juegos.md         # Lessons from real games
│   └── 10-escape-room-master.md    # Master treatise + checklists
├── game-types/
│   ├── hall-escape/                # Indoor 50+ m², teams 5-10
│   ├── street-escape/              # Outdoor, GPS/QR, teams 2-5
│   └── investigation/              # Detective/crime, teams 2-6
├── docs/                           # System documentation
│   ├── SOUL.md                     # Core identity + rules
│   ├── pipeline-details.md         # Pipeline phase details
│   ├── data-model.md               # JSON data model reference
│   ├── validation-playtest.md      # Playtest validation guide
│   └── build-commands.md           # Build command reference
├── services/                       # Search stack (optional, self-hosted)
│   ├── docker-compose.yml          # SearXNG + Perplexica in Docker
│   ├── searxng/settings.yml        # SearXNG config (JSON enabled)
│   ├── perplexica/config.toml      # Perplexica config (Gemini API)
│   └── scripts/                    # Search helper scripts
│       ├── searxng-search.py       # SearXNG query helper
│       └── perplexica-search.py    # Perplexica AI search helper
├── SEARCH-SETUP.md                 # Full setup guide for search stack
└── examples/
    ├── example-game.json           # Sample game (museum heist)
    ├── example-prueba.json         # Sample puzzle (nonogram)
    ├── real-games/                 # 6 complete real games
    │   ├── biblioteca-maldita-v2/  # Library-themed escape (v2)
    │   ├── biblioteca-maldita-v3/  # Library-themed escape (v3)
    │   ├── juego-de-prueba/        # Test game
    │   ├── juego-de-prueba-con-cita/ # Test game with appointment
    │   ├── test-final/             # Final test game
    │   └── la-dama-del-salon/      # Street escape in production (13 levels)
    ├── pipeline-artifacts/         # Pipeline run artifacts
    │   ├── biblioteca-maldita-v2_20260406/  # BRIEF → CONCEPT → DESIGN → VERIFY → JUDGMENT
    │   └── biblioteca-maldita-v3_20260406/
    ├── .pipeline/                  # Active pipeline state example
    └── escape-material-pruebas/    # 30+ real puzzle examples in Markdown
```

### Design Pipeline (escape-design)

```
RESOLVE → EXPLORE → REGRESSION* → CONCEIVE → DESIGN → NARRATIVE → DIFFICULTY → BUILD → PLAYTEST → VERIFY → JUDGMENT
                                    *only if baseline exists
```

Each phase is a standalone skill with its own SKILL.md. The pipeline is **resumable** via `PROGRESS.json` — if interrupted, continues from the first incomplete phase.

### Core Design Rules

| Rule | Meaning |
|---|---|
| **ZERO GM** | Games must run without a human game master organizing, explaining, or enforcing |
| **ANTI-CHEAT** | If players CAN cheat, they WILL — design to make cheating impossible or useless |
| **SELF-SERVICE** | Everything players need is self-discovered in the game space |
| **REAL MECHANISMS** | Every physical mechanism must be buildable with ~€120 budget and accessible materials |
| **NO CROSS-DEPENDENCIES** | Each puzzle is self-contained; no data travels between puzzles (only keys and tools) |
| **PHYSICAL > DIGITAL** | Prioritize tangible interaction; digital is support, never protagonist |
| **DOUBLE DISCOVERY** | Each puzzle has 2+ layers of "aha!" — solve + reveal |

### 21 Puzzle Mechanics

| Category | Mechanics |
|----------|-----------|
| **Logic** | Nonogram, Positions, Sequential |
| **Matching** | Memory, Text |
| **Physical** | Mechanism, Electrical Panel, Target, Assembly |
| **Digital** | Tablet Co-op, Control Panel, Arcade, Maze |
| **Cooperative** | Communication/Messages |
| **Search/Location** | Object Search, Visual Exploration, QR, GPS, Acrostic, Riddle |
| **Investigation** | Text Research |

Each mechanic has its own SKILL.md with: design variables, common errors, difficulty scaling, game-type adaptations, and example puzzles.

## Install

```bash
git clone https://github.com/boticlaw/escape-room-skills.git
```

### opencode
```bash
cp -r skills/* ~/.config/opencode/skills/
```

### Claude Code
```bash
cp -r skills/* .claude/skills/
```

### Generic LLM Agent
Copy the contents of each `skills/*/SKILL.md` into your agent's instruction context. See [INSTALL.md](INSTALL.md) for details.

## Quick Start

1. Load `escape-design/SKILL.md` into your agent
2. *(Optional)* Set up the search stack for automatic research: `docker compose -f services/docker-compose.yml up -d` → see [SEARCH-SETUP.md](SEARCH-SETUP.md)
3. Describe the game you want: type, theme, player count, duration
4. The agent follows the resumable pipeline with PROGRESS.json tracking
5. If search stack is running, the EXPLORE phase automatically researches the theme via SearXNG + Perplexica
6. Output: `game.json` + individual `prueba-*.json` files
7. Run `scripts/build-pdf.mjs` to generate printable design and test documents
8. Run `scripts/escape-materials-generator.py` to generate categorized printable materials

## Real Game Examples

The `examples/real-games/` directory contains 6 complete games:

| Game | Type | Puzzles | Notes |
|------|------|---------|-------|
| **Biblioteca Maldita v2** | Hall Escape | 6 | Library-themed, pipeline-tested |
| **Biblioteca Maldita v3** | Hall Escape | 5 | Refined version with improvements |
| **Juego de Prueba** | Test | Basic | Initial prototype |
| **Juego de Prueba con Cita** | Test | With appointment | Appointment-based variant |
| **Test Final** | Test | Complete | Final validation game |
| **La Dama del Salón** | Street Escape | 13 levels | **In production** — Palencia street escape |

La Dama del Salón includes: complete analysis, 12 cataloged mechanics, narrative templates, data model patterns, and 13 GPS-enabled levels.

## Search Stack (Optional — Automatic Thematic Research)

The pipeline can automatically research game themes using a self-hosted search stack:

```
SearXNG (:8888)  →  Perplexica (:3100)  →  LLM (Gemini/OpenAI/Ollama)
  meta-search         AI summary+citations     any provider
  70+ engines         with sources              local or cloud
```

When running, the EXPLORE phase automatically:
1. Searches for historical facts, curiosities, playable elements via SearXNG
2. Gets AI-summarized research with citations via Perplexica
3. Extracts key content from promising URLs via Jina Reader
4. Compiles everything into the BRIEF's `research_data` field

**Setup:** `docker compose -f services/docker-compose.yml up -d` — see [SEARCH-SETUP.md](SEARCH-SETUP.md) for full instructions.

Works without the stack too — the pipeline falls back to `webfetch` or manual research.

## opencode Agent Configuration (Dual-LLM Judges)

The playtest and judgment-day pipeline phases use **two opencode agents** with different LLM models for dual evaluation:

| Agent | Model | Role |
|-------|-------|------|
| `escape-judge-a` | GLM-5.1 (analytical) | Coherence, structure, solvability |
| `escape-judge-b` | GPT-5.5 (creative) | Immersion, emotional arc, originality |

These agents are configured in `opencode.json` under the `"agent"` block. The pipeline uses `delegate()` to launch both judges in parallel, then a synthesis script crosses their findings.

**Setup**: See `skills/escape-setup/SKILL.md` for model detection, configuration, and verification. Key rule: judges MUST use models from different providers to avoid shared biases.

## Scripts

| Script | Language | Purpose |
|--------|----------|---------|
| `build-pdf.mjs` | Node.js | Generate PDF from HTML via Puppeteer |
| `build.sh` | Bash | Full build pipeline orchestration |
| `escape-materials-generator.py` | Python | Generate categorized printable materials (7 categories) |
| `escape-pdf-generator.mjs` | Node.js | Advanced PDF with visual categories |
| `escape-compact-pdf.py` | Python | Compact PDF generation |
| `init-juego.py` | Python | Initialize new game project structure |
| `validate-design.py` | Python | Validate game design against rules |
| `review-design.py` | Python | Review and score design quality |
| `playtest-simulado.py` | Python | Simulate 3 player profiles |
| `playtest-llm.py` | Python | LLM-powered playtest simulation |
| `gamejson-to-markdown.mjs` | Node.js | Convert game JSON to Markdown |
| `escape-json2md.sh` | Bash | Batch JSON to Markdown conversion |
| `validate-schema.sh` | Bash | Validate JSON against schemas |

## License

[Apache-2.0](LICENSE) — use freely, attribution appreciated.
