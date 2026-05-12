---
name: escape-setup
description: >
  Setup and configuration for the escape room skills system.
  Detects available LLM models, configures dual-LLM judges, validates the environment.
  Trigger: First-time setup, changing judge models, verifying environment.
---

# Escape Room Setup

## What This Does

Configures the escape room system for your opencode installation:

1. Detects available LLM models
2. Configures Judge A and Judge B with different models (for dual-LLM evaluation)
3. Validates search stack (SearXNG + Perplexica) availability
4. Verifies scripts and schemas are accessible

## Step 1: Detect Available Models

```bash
opencode models
```

From the output, select TWO models from DIFFERENT providers for best dual-LLM results:

| Provider Family | Models (examples) | Good For |
|----------------|-------------------|----------|
| **GLM** | glm-5, glm-5.1 | Analytical, structured thinking |
| **GPT** | gpt-5, gpt-5.5, gpt-5.5-pro | Creative, nuanced, experiential |
| **Claude** | claude-opus-4-7, claude-sonnet-4-6 | Balanced, detailed analysis |
| **Gemini** | gemini-3-flash, gemini-3.1-pro | Fast, broad knowledge |
| **DeepSeek** | deepseek-v4-flash-free | Budget option, still capable |
| **Qwen** | qwen3.5-plus, qwen3.6-plus | Good analytical skills |

**Ideal pairing** (different strengths):
- Judge A (analytical): GLM-5.1 or Claude-Opus — structured, logical
- Judge B (creative): GPT-5.5 or Gemini — experiential, creative

**Minimum requirement**: 2 models from different providers.
**Budget option**: Use any free model + any paid model.

## Step 2: Configure Judges

Add to your `opencode.json` (or `~/.config/opencode/opencode.json`):

```json
{
  "agent": {
    "escape-judge-a": {
      "description": "Escape Room Judge A — analytical evaluator",
      "hidden": true,
      "model": "opencode/YOUR_MODEL_A",
      "mode": "subagent",
      "prompt": "You are Judge A — an ANALYTICAL evaluator for escape rooms. You evaluate from an analytical perspective: coherence, structure, solvability, consistency. Be BRUTALLY HONEST. Reference specific elements. Output structured JSON. You do NOT delegate.",
      "tools": { "bash": true, "read": true, "write": true }
    },
    "escape-judge-b": {
      "description": "Escape Room Judge B — creative/experiential evaluator",
      "hidden": true,
      "model": "opencode/YOUR_MODEL_B",
      "mode": "subagent",
      "prompt": "You are Judge B — a CREATIVE evaluator for escape rooms. You evaluate from an experiential perspective: immersion, emotional arc, originality, player experience. Be BRUTALLY HONEST but constructive. Reference specific elements. Output structured JSON. You do NOT delegate.",
      "tools": { "bash": true, "read": true, "write": true }
    }
  }
}
```

Replace `YOUR_MODEL_A` and `YOUR_MODEL_B` with models from different providers.

**The key rule**: Judge A and Judge B MUST use models from DIFFERENT providers. Two models from the same provider have similar biases and will miss the same issues.

## Step 3: Verify Search Stack (Optional)

```bash
# Check if SearXNG is running
curl -s -o /dev/null -w "%{http_code}" http://localhost:8888

# Check if Perplexica is running
curl -s -o /dev/null -w "%{http_code}" http://localhost:3100
```

If both return `200` → search stack is ready for automatic research.
If not → see `SEARCH-SETUP.md` for installation, or the pipeline works without it (manual research fallback).

## Step 4: Verify — Judge Configuration ⚠️ CRÍTICO

### 4a. Check judge agents exist

```bash
# Check if judges are configured
opencode agent list 2>/dev/null | grep escape-judge
```

If `escape-judge-a` and `escape-judge-b` are NOT listed → go back to Step 2.

### 4b. Check provider divergence ⚠️ OBLIGATORIO

```bash
python3 scripts/verify-judges.py --pretty
```

This script checks if both judges use models from **DIFFERENT providers**.

**Three possible results:**

#### Result: Different providers ✅ (IDEAL)

```
Judge A: GLM (glm-5.1)     → Analytical perspective
Judge B: OpenAI (gpt-5.5)  → Creative perspective
Providers: DIFFERENT ✅
Mode: dual_llm_full
```

→ Continue. Full dual-LLM effectiveness.

#### Result: Same provider, different models ⚠️ (ACCEPTABLE)

```
Judge A: GLM (glm-5.1)      → Analytical perspective  
Judge B: GLM (glm-4.7-flash) → Creative perspective
Providers: SAME ⚠️
Mode: enhanced_prompt_divergence
```

→ **Enhanced Prompt Divergence Mode** activated automatically. This means:
- Judge A and Judge B get MAXIMALLY different system prompts
- Judge A uses temperature 0.2 (deterministic, analytical)
- Judge B uses temperature 0.9 (creative, varied)
- Judge A evaluates with structured checklists
- Judge B evaluates with narrative/stream-of-consciousness
- The synthesis step gives HIGHER weight to confirmed issues (since same-model bias is more likely)

**How Enhanced Prompt Divergence works:**

| Aspect | Judge A (Analytical) | Judge B (Creative) |
|--------|---------------------|-------------------|
| Temperature | 0.2 | 0.9 |
| Format | Structured JSON checklist | Free-form narrative then summarized |
| Perspective | "Find every flaw. Be systematic." | "Experience this as a player. Feel it." |
| Evaluation method | Criterion-by-criterion scoring | Holistic impression + specific callouts |
| Bias | Pessimistic (assume problems) | Optimistic (assume it works, prove it doesn't) |
| Output | `{scores: {}, findings: []}` | `{experience: "", emotional_arc: "", red_flags: []}` |
| Role | QA engineer testing software | Player who paid €25 for this experience |

#### Result: Same provider, SAME model ❌ (PROBLEMATIC)

```
Judge A: GLM (glm-5.1)
Judge B: GLM (glm-5.1)
Providers: SAME, MODEL: SAME ❌
```

→ **STOP. Warn user:**

"You have both judges using the EXACT SAME model. Dual-LLM provides minimal value in this configuration.

Options:
1. **Change one judge** — edit opencode.json and set a different model for one judge
2. **Use Enhanced Prompt Divergence** — same model but maximally different prompts (reduced effectiveness, but better than single judge)
3. **Single judge mode** — use only Judge A, skip dual evaluation entirely"

### 4c. Present configuration summary

Show the user the final configuration:

```
╔══════════════════════════════════════════════╗
║   ESCAPE ROOM SYSTEM — CONFIGURATION        ║
╠══════════════════════════════════════════════╣
║                                              ║
║   Judge A:  glm-5.1 (GLM)                   ║
║   Judge B:  gpt-5.5 (OpenAI)                ║
║   Mode:     dual_llm_full ✅                ║
║                                              ║
║   SearXNG:      ✅ localhost:8888           ║
║   Perplexica:   ✅ localhost:3100           ║
║   Search stack: ACTIVE                      ║
║                                              ║
║   Games available: 6 real games             ║
║   Mechanics: 21 puzzle types                ║
║   Pipeline: 16 phases (including remix)     ║
║                                              ║
╚══════════════════════════════════════════════╝
```

## How Dual-LLM Evaluation Works

```
Orchestrator delegates to:
├── escape-judge-a (model A) → PLAYTEST-A.json or JUDGE-A.json
├── escape-judge-b (model B) → PLAYTEST-B.json or JUDGE-B.json  ← runs in parallel
└── Synthesis (same agent) → crosses findings, classifies CONFIRMED/SUSPECT/CONTRADICTION
```

The orchestrator launches both judges via `delegate` (async), waits for both, then crosses findings. No Python scripts needed — opencode handles the model routing.

## Changing Models

Edit `opencode.json` and change the `model` field of either judge. Restart opencode for changes to take effect.

Recommended rotation to avoid bias:
- Every 5-10 games, swap models between judges
- Or try different provider combinations to see which catches more issues

### Recommended Model Rotations

Every 5-10 games, swap the judge models to prevent pattern fossilization:

| Rotation | Judge A | Judge B | Notes |
|----------|---------|---------|-------|
| Default | GLM-5.1 | GPT-5.5 | Structured + Creative |
| Alt 1 | Claude Opus | Gemini 3 Flash | Deep analysis + Fast breadth |
| Alt 2 | GLM-5.1 | Claude Opus | Two strong analytical models |
| Alt 3 | GPT-5.5 | DeepSeek v4 | Creative + Budget alternative |

**If using Enhanced Prompt Divergence (same provider):**
- Rotate WHICH judge is analytical vs creative every 3 games
- This prevents the model from always giving the same "analytical" answers to Judge A
- Mark in REMIX-DIFF or JUDGMENT-REPORT which divergence mode was used
