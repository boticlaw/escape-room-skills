# Phase Details — Research Rules, Constraints & Checklists

## RESOLVE — Gather Requirements

Collect from user: game type, player count, duration, theme, difficulty target, space constraints.

**Output**: Requirements document.

**Research rules applied**:
- UX: Define target audience and accessibility needs upfront
- Psychology: Match difficulty to player experience level
- Game Design: Clear objectives before any creative work

## EXPLORE — Research & Reference

Search for theme-appropriate references, real-world inspiration, and similar games.

**Output**: Reference list with adaptation notes.

**Research rules applied**:
- Storytelling: Historical or thematic accuracy grounds the fiction
- Scenography: Research authentic atmosphere elements
- Game Style: Learn from published games in the same genre

## CONCEIVE — Core Concept

Define the hook, the unique selling point, and the player's journey in one paragraph.

**Output**: Concept statement (1 paragraph).

**Research rules applied**:
- Game Design: One clear core mechanic or theme as skeleton
- Storytelling: Simple plot, complex characters
- Psychology: Intrinsic motivation — why do players care?

## DESIGN — Puzzle Architecture

Select mechanics from `escape-puzzles` catalog. Define puzzle count, flow, and dependencies.

**Output**: Puzzle list with mechanics, order, and connections.

**Research rules applied**:
- Puzzle Design: Variety across categories, aha moments, no flat difficulty
- Game Design: Progressive difficulty, collaboration opportunities
- UX: No friction from ambiguity — every puzzle has clear affordances
- Technology: Select mechanisms that fit the space and budget

**Constraints**:
- Minimum 4 puzzles, maximum 8 for standard games
- Each puzzle uses exactly one primary mechanic
- At least 2 different mechanic categories per game
- Every puzzle has self-service verification

## NARRATIVE — Story Integration

Weave the story through puzzles. Each puzzle justifies its existence in the narrative.

**Output**: Narrative thread linking all puzzles.

**Research rules applied**:
- Storytelling: Show don't tell. Players are protagonists. Story drives game.
- Psychology: Emotions guide attention — urgency, curiosity, surprise
- Game Design: Narrative as skeleton, puzzles as organs
- Scenography: Story dictates atmosphere, lighting, sound

**Rules**:
- Players discover story through play, not reading
- No infodumps — reveal backstory through puzzle artifacts
- Each solved puzzle advances the plot
- Optional meta-puzzle (hilo_conductor) using collected elements

## DIFFICULTY — Calibrate & Balance

Assign difficulty ratings, estimate solve times, validate total duration.

**Output**: Calibrated puzzle list with difficulty and time budgets.

**Research rules applied**:
- Puzzle Design: Difficulty scaling across the game arc
- Psychology: Flow theory — challenge matches skill, frustration < 2 min
- UX: Hint system at 3 levels (subtle → moderate → explicit)
- Testing: Benchmark against target audience experience

**Calibration rules**:

| Phase | Difficulty Range | % of Total Time |
|---|---|---|
| Opening (P1–P2) | 2–4 | 25% |
| Middle (P3–Pn-1) | 4–7 | 50% |
| Climax (Pn) | 6–8 | 25% |

## BUILD — Generate Files

Create `game.json` and individual `prueba-*.json` files. Use `escape-build` for documents.

**Output**: Complete game file set.

**Research rules applied**:
- Technology: Validate mechanism feasibility
- UX: Print all materials, test readability
- Game Design: Verify flow against original concept

**File checklist**:
- [ ] `game.json` — validates against `schemas/game.schema.json`
- [ ] `prueba-P01.json` through `prueba-PN.json` — each validates against `schemas/prueba.schema.json`
- [ ] All puzzles self-contained (NO CROSS-DEPENDENCIES check)
- [ ] All solutions have self-verification
- [ ] All hints escalate (nivel 1→3)

## PLAYTEST — Mental Walkthrough

Simulate the game start to finish. Identify blockers, ambiguities, and flow breaks.

**Output**: Playtest report with issues list.

**Research rules applied**:
- Testing: Walk through as a naive player, not the designer
- UX: Check every interaction for friction
- Psychology: Identify frustration points (>2 min stuck = redesign)
- Game Style: Verify anti-cheat by trying to brute-force each puzzle

**Playtest checklist**:
- [ ] Every puzzle solvable with provided information only
- [ ] No dead ends (player always has a next step)
- [ ] Hints actually help without giving away the answer
- [ ] Total time ≈ target duration ± 15%
- [ ] No ambiguity in puzzle instructions
- [ ] Anti-cheat: no shortcut or brute-force path exists

## VERIFY — Validate Files

Schema validation and internal consistency check.

**Output**: Validation report (pass/fail per check).

**Checks**:
- [ ] `game.json` passes `schemas/game.schema.json`
- [ ] Each `prueba-*.json` passes `schemas/prueba.schema.json`
- [ ] Total puzzle durations ≈ game duration ± 20%
- [ ] Difficulty progression follows calibration rules
- [ ] All puzzle IDs in `game.json` match existing prueba files
- [ ] No orphan files (prueba referenced nowhere)
- [ ] All materials listed are obtainable
- [ ] Barrier codes are unique across the game

## JUDGMENT — Final Review

Evaluate the complete design against quality criteria.

**Output**: Final verdict (APPROVED / NEEDS REVISION).

**Quality criteria**:
- [ ] Originality: Is this game memorable and unique?
- [ ] Immersion: Does the narrative hold throughout?
- [ ] Fairness: Can all puzzles be solved without outside knowledge?
- [ ] Accessibility: Can the target player count participate meaningfully?
- [ ] Self-service: Does the game truly need zero GM?
- [ ] Anti-cheat: Are solutions robust against shortcuts?
- [ ] Flow: Does the game maintain engagement from start to finish?
- [ ] Fun: Would players recommend this to a friend?

## REMIX — Variations & Reuse

Generate variations of the completed game for different audiences, themes, or difficulty levels.

**Output**: Remix variants with change annotations.

**Research rules applied**:
- Game Design: Identify which elements are theme-dependent vs. structure-dependent
- Puzzle Design: Swap mechanics while preserving difficulty curves
- Psychology: Adapt for different player experience levels

**Remix options**:
- Theme swap: same structure, different narrative skin
- Difficulty shift: easier/harder variants with adjusted puzzle complexity
- Audience adaptation: age-appropriate content and mechanism changes
- Duration variant: shorter/longer versions with puzzle count adjustment
