# Judge Configuration Reference

## Full Judge Config (opencode.json)

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

## Provider Table

| Provider Family | Models (examples) | Good For |
|----------------|-------------------|----------|
| **GLM** | glm-5, glm-5.1 | Analytical, structured thinking |
| **GPT** | gpt-5, gpt-5.5, gpt-5.5-pro | Creative, nuanced, experiential |
| **Claude** | claude-opus-4-7, claude-sonnet-4-6 | Balanced, detailed analysis |
| **Gemini** | gemini-3-flash, gemini-3.1-pro | Fast, broad knowledge |
| **DeepSeek** | deepseek-v4-flash-free | Budget option, still capable |
| **Qwen** | qwen3.5-plus, qwen3.6-plus | Good analytical skills |

## Ideal Pairing

- Judge A (analytical): GLM-5.1 or Claude-Opus — structured, logical
- Judge B (creative): GPT-5.5 or Gemini — experiential, creative

**Minimum**: 2 models from different providers.
**Budget option**: Use any free model + any paid model.

## Model Rotation Recommendations

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
