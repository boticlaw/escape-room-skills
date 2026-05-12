# Single-LLM Fallback

If no external API is available:

- Run Judge A only
- Mark `_meta.dual_llm = false` in report
- Warnings from single-judge have lower confidence
- No CRITICAL classification possible (needs 2 judges)
- All findings classified as SUSPECT (weight 0.6)
