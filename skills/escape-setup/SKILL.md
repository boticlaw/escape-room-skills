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

## Step 4: Verify

Run a quick check:

```bash
# Models configured
opencode agent list | grep escape-judge

# Search stack
curl -s http://localhost:8888/search?q=test&format=json | head -1

# Scripts
ls scripts/dual-llm-*.py
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
