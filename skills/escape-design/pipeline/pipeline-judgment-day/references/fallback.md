# Single-LLM Fallback

If only one judge agent is configured:

- Run Judge A only
- Mark `_meta.dual_llm = false`
- Lower confidence but still valuable for basic issues
- No CONFIRMED classification possible
- No auto-fix cycle
