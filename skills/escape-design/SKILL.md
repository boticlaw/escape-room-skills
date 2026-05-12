---
name: escape-design
description: Master escape room design pipeline. 10-phase process with integrated research frameworks for designing complete escape room games.
triggers:
  - design escape room
  - create escape game
  - diseño sala escape
  - design puzzle game
  - crear juego escape
---

# Escape Room Design — Master Pipeline

## Overview

This skill drives the complete design of an escape room game through a 10-phase pipeline. Each phase integrates compact rules from 10 research frameworks. Output: `game.json` + individual `prueba-*.json` files.

## Core Design Rules

| Rule | Description |
|---|---|
| **ZERO GM** | No human game master. All verification is self-service. |
| **ANTI-CHEAT** | Puzzles resist brute-force, lucky guesses, and accidental solves. |
| **SELF-SERVICE** | Players verify solutions through physical/digital mechanisms. |
| **REAL MECHANISMS** | Locks open, lights turn on, doors unlock — real feedback. |
| **NO CROSS-DEPENDENCIES** | Each puzzle is self-contained. No data from puzzle A needed in puzzle B. |

## Pipeline Phases

```
RESOLVE → EXPLORE → CONCEIVE → DESIGN → NARRATIVE → DIFFICULTY → BUILD → PLAYTEST → VERIFY → JUDGMENT
```

### 1. RESOLVE — Gather Requirements

Collect from user: game type, player count, duration, theme, difficulty target, space constraints.

**Output**: Requirements document.

**Research rules applied**:
- UX: Define target audience and accessibility needs upfront
- Psychology: Match difficulty to player experience level
- Game Design: Clear objectives before any creative work

### 2. EXPLORE — Research & Reference

Search for theme-appropriate references, real-world inspiration, and similar games.

**Output**: Reference list with adaptation notes.

**Research rules applied**:
- Storytelling: Historical or thematic accuracy grounds the fiction
- Scenography: Research authentic atmosphere elements
- Game Style: Learn from published games in the same genre

### 3. CONCEIVE — Core Concept

Define the hook, the unique selling point, and the player's journey in one paragraph.

**Output**: Concept statement (1 paragraph).

**Research rules applied**:
- Game Design: One clear core mechanic or theme as skeleton
- Storytelling: Simple plot, complex characters
- Psychology: Intrinsic motivation — why do players care?

### 4. DESIGN — Puzzle Architecture

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

### 5. NARRATIVE — Story Integration

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

### 6. DIFFICULTY — Calibrate & Balance

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

### 7. BUILD — Generate Files

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

### 8. PLAYTEST — Mental Walkthrough

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

### 9. VERIFY — Validate Files

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

### 10. JUDGMENT — Final Review

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

## Research Frameworks (Compact Rules)

### F1. Game Design

| Principle | Rule |
|---|---|
| Narrative skeleton | Story is the structure; puzzles serve the story |
| Immersion | Every element reinforces the fictional world |
| Clear objectives | Players always know WHAT to do, the challenge is HOW |
| Progressive difficulty | Ramp up smoothly; never spike or plateau |
| Collaboration | Every player must have meaningful participation |
| Fairness | Solvable with information provided; no outside knowledge |

**Common errors**: story disconnected from puzzles, difficulty cliff, solo-player bottleneck, unclear win condition.

### F2. Puzzle Design

| Principle | Rule |
|---|---|
| Narrative integration | Puzzle justifies its existence in the story |
| Variety | Mix categories: logic, physical, search, digital |
| Fairness/clarity | Unambiguous instructions; one valid interpretation |
| Difficulty scaling | Within-puzzle scaffolding (clues within the puzzle itself) |
| Aha moments | Every puzzle has a satisfying insight, not just grinding |
| Forced collaboration | Some puzzles require 2+ people simultaneously |

**Common errors**: all same category, ambiguous instructions, no insight moment, soloable when team required.

### F3. Storytelling

| Principle | Rule |
|---|---|
| Simple plot, complex characters | One goal, many interesting NPCs |
| Show don't tell | Players discover story through artifacts, not narration |
| Player as protagonist | The story happens TO the player, not in front of them |
| Coherence | No contradictions in timeline, character, or world rules |
| Emotions guide | Use urgency, wonder, surprise to direct attention |
| Story drives game | If you remove the story, the game should feel empty |

**Common errors**: reading-heavy backstory, passive player role, plot holes, emotional flatline.

### F4. Psychology

| Principle | Rule |
|---|---|
| Flow theory | Challenge matches perceived skill; anxiety and boredom are both bad |
| Frustration management | If stuck > 2 minutes, hint system activates |
| Motivation | Intrinsic (curiosity, mastery) > extrinsic (points, prizes) |
| Collaboration dynamics | Shared goals build bonds; avoid competitive sub-games in cooperative games |

**Common errors**: difficulty too high causing anxiety, no hint system, pure extrinsic motivation, one player dominating.

### F5. UX (User Experience)

| Principle | Rule |
|---|---|
| Usability | Every element's purpose is immediately clear |
| Friction | Zero unnecessary steps between intention and action |
| Hints | 3-level system: subtle nudge → partial direction → explicit help |
| Accessibility | Color-blind safe, multi-sensory where possible, no physical barriers |
| Onboarding | First puzzle teaches the game's language and mechanics |

**Common errors**: unclear affordances, hint too vague or too obvious, no onboarding, visual-only puzzles.

### F6. Scenography

| Principle | Rule |
|---|---|
| Atmosphere | Lighting, sound, temperature, smell all contribute |
| Lighting | Direct attention with spotlights; hide with shadow |
| Sound | Ambient track + triggered effects; silence is powerful too |
| Sensory immersion | Touch, smell, temperature — beyond sight and sound |

**Common errors**: ignoring sound design, flat lighting, no temperature/texture consideration.

### F7. Technology

| Principle | Rule |
|---|---|
| Automation | Sensors and actuators for instant feedback |
| Reliability | Test all electronics 10x before game day |
| Tablet/app | Use for complex interfaces, hint delivery, timer |
| Graceful degradation | If tech fails, game is still playable with manual override |

**Common errors**: over-reliance on tech, no backup when electronics fail, complex setup.

### F8. Testing

| Principle | Rule |
|---|---|
| Iteration | Design → test → revise; never skip testing |
| Playtest | Watch real players, don't just imagine |
| Metrics | Time per puzzle, hint usage, satisfaction rating |
| Feedback loops | After each playtest, identify top 3 improvements |

**Common errors**: skipping playtest, testing only with designers, ignoring metrics, no iteration budget.

### F9. Game Style (Practical Lessons)

| Principle | Rule |
|---|---|
| Start strong | First 30 seconds set the tone |
| End stronger | Final reveal should be the most memorable moment |
| Pacing | Alternate intense and calm; never flat energy |
| Red herrings | Use sparingly and resolve definitively |
| Physical objects | Tangible items create stronger memories than screens |

**Common errors**: weak opening, anticlimactic ending, constant intensity, unresolved red herrings.

### F10. Escape Room Master (Complete Treatise)

Fundamentals: escape rooms combine puzzle-solving, storytelling, and immersive environments in a time-limited challenge. Success requires balancing difficulty, narrative, and player agency.

Best practices checklist:
- [ ] Game is completable without any outside knowledge
- [ ] Every prop serves the game (no pure decoration without purpose)
- [ ] Players never feel "stuck" with no path forward
- [ ] Game accommodates the stated player range meaningfully
- [ ] Reset time between games < 15 minutes
- [ ] All electronic components have manual bypass
- [ ] Player safety is guaranteed (no tripping, fire, or lock-in hazards)
- [ ] The experience is memorable after the game ends (discuss-able)

## Game Types

### hall-escape
- Indoor 50+ m², projector, audio, teams 5–10
- See `game-types/hall-escape/GAMETYPE.md`

### street-escape
- Outdoor, GPS/QR navigation, teams 2–5
- See `game-types/street-escape/GAMETYPE.md`

### investigation
- Detective/crime, narrative-heavy, teams 2–6
- See `game-types/investigation/GAMETYPE.md`

## Progress Tracking (PROGRESS.json)

```json
{
  "game_id": "",
  "current_phase": "RESOLVE",
  "phase_status": {
    "RESOLVE": "pending",
    "EXPLORE": "pending",
    "CONCEIVE": "pending",
    "DESIGN": "pending",
    "NARRATIVE": "pending",
    "DIFFICULTY": "pending",
    "BUILD": "pending",
    "PLAYTEST": "pending",
    "VERIFY": "pending",
    "JUDGMENT": "pending"
  },
  "iterations": {
    "total": 0,
    "max_build_playtest_cycles": 1,
    "max_design_build_verify_cycles": 2,
    "phase_attempts": {}
  },
  "issues": [],
  "notes": ""
}
```

## Iteration Rules

| Rule | Limit |
|---|---|
| Max attempts per phase | 2 |
| Max build→playtest cycles | 1 |
| Max design→build→verify cycles | 2 |
| If JUDGMENT fails | Revise and re-enter at DESIGN phase |
| If max iterations reached | Report to user with recommendations |

## Communication Checkpoints

| After Phase | Communicate to User |
|---|---|
| RESOLVE | Confirm requirements summary |
| CONCEIVE | Present concept statement for approval |
| DESIGN | Present puzzle architecture for review |
| BUILD | Deliver generated files |
| JUDGMENT | Final verdict and recommendations |
