---
name: escape-setup
description: "Trigger: escape room setup, configure judges, verify environment, configurar jueces. Detects LLM models, configures dual-LLM judges, validates environment."
---

# Escape Room Setup

## Activation Contract

Load for first-time setup, changing judge models, or verifying the escape room environment.

## Hard Rules

1. **Judges MUST use models from DIFFERENT providers.** Same-provider models share biases and miss the same issues. If same provider detected → Enhanced Prompt Divergence Mode (reduced effectiveness).
2. **Same model for both judges = STOP.** Warn the user. Dual-LLM provides minimal value with identical models.

## Decision Gates

| Verification Result | Action |
|---|---|
| Different providers ✅ | Full dual-LLM mode. Continue. |
| Same provider, different models ⚠️ | Enhanced Prompt Divergence Mode. Automatic. |
| Same provider, SAME model ❌ | STOP. Warn user. Offer: change one judge, use EPD, or single-judge mode. |

## Execution Steps

### Step 1: Detect Models

```bash
opencode models
```

Select TWO models from DIFFERENT providers. Ideal: one analytical (GLM-5.1, Claude-Opus), one creative (GPT-5.5, Gemini).

### Step 2: Configure Judges

Add judge agents to `opencode.json` with subagent mode and evaluation prompts (see `references/judge-config.md` for full JSON).

### Step 3: Verify Search Stack (Optional)

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:8888   # SearXNG
curl -s -o /dev/null -w "%{http_code}" http://localhost:3100   # Perplexica
```

Both `200` → search active. Otherwise pipeline works with manual research fallback.

### Step 4: Verify Judge Config

```bash
opencode agent list 2>/dev/null | grep escape-judge
python3 scripts/verify-judges.py --pretty
```

Validate: agents exist AND provider divergence (see `references/verification-details.md` for all three result scenarios).

### Step 5: Present Configuration Summary

Show final config: Judge A model, Judge B model, mode, search status, games/mechanics/pipeline counts.

## Output Contract

Verified configuration with:
- Judge A + Judge B confirmed with provider divergence
- Mode: `dual_llm_full` | `enhanced_prompt_divergence`
- Search stack status
- System ready for pipeline execution

## References

- `references/judge-config.md` — Full JSON config, provider table, ideal pairings, model rotations
- `references/verification-details.md` — Verification result scenarios, Enhanced Prompt Divergence table, dual-LLM flow
- `references/search-setup.md` — SearXNG + Perplexica setup details
