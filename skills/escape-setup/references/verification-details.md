# Verification Details & Enhanced Prompt Divergence

## Verification Steps

### Check judge agents exist

```bash
opencode agent list 2>/dev/null | grep escape-judge
```

If `escape-judge-a` and `escape-judge-b` are NOT listed → go back to judge configuration.

### Check provider divergence

```bash
python3 scripts/verify-judges.py --pretty
```

This script checks if both judges use models from **DIFFERENT providers**.

## Three Verification Results

### Result: Different providers ✅ (IDEAL)

```
Judge A: GLM (glm-5.1)     → Analytical perspective
Judge B: OpenAI (gpt-5.5)  → Creative perspective
Providers: DIFFERENT ✅
Mode: dual_llm_full
```

→ Continue. Full dual-LLM effectiveness.

### Result: Same provider, different models ⚠️ (ACCEPTABLE)

```
Judge A: GLM (glm-5.1)      → Analytical perspective  
Judge B: GLM (glm-4.7-flash) → Creative perspective
Providers: SAME ⚠️
Mode: enhanced_prompt_divergence
```

→ **Enhanced Prompt Divergence Mode** activated automatically.

### Result: Same provider, SAME model ❌ (PROBLEMATIC)

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

## Enhanced Prompt Divergence Mode

Activated when both judges use the same provider (or same model). Maximizes evaluation difference through prompt engineering:

- Judge A and Judge B get MAXIMALLY different system prompts
- Judge A uses temperature 0.2 (deterministic, analytical)
- Judge B uses temperature 0.9 (creative, varied)
- Judge A evaluates with structured checklists
- Judge B evaluates with narrative/stream-of-consciousness
- The synthesis step gives HIGHER weight to confirmed issues (since same-model bias is more likely)

| Aspect | Judge A (Analytical) | Judge B (Creative) |
|--------|---------------------|-------------------|
| Temperature | 0.2 | 0.9 |
| Format | Structured JSON checklist | Free-form narrative then summarized |
| Perspective | "Find every flaw. Be systematic." | "Experience this as a player. Feel it." |
| Evaluation method | Criterion-by-criterion scoring | Holistic impression + specific callouts |
| Bias | Pessimistic (assume problems) | Optimistic (assume it works, prove it doesn't) |
| Output | `{scores: {}, findings: []}` | `{experience: "", emotional_arc: "", red_flags: []}` |
| Role | QA engineer testing software | Player who paid €25 for this experience |

## Dual-LLM Evaluation Flow

```
Orchestrator delegates to:
├── escape-judge-a (model A) → PLAYTEST-A.json or JUDGE-A.json
├── escape-judge-b (model B) → PLAYTEST-B.json or JUDGE-B.json  ← runs in parallel
└── Synthesis (same agent) → crosses findings, classifies CONFIRMED/SUSPECT/CONTRADICTION
```

The orchestrator launches both judges via `delegate` (async), waits for both, then crosses findings. No Python scripts needed — opencode handles the model routing.
