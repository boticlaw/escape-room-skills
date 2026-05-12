# Search Stack Setup

## Verify Search Stack (Optional)

```bash
# Check if SearXNG is running
curl -s -o /dev/null -w "%{http_code}" http://localhost:8888

# Check if Perplexica is running
curl -s -o /dev/null -w "%{http_code}" http://localhost:3100
```

If both return `200` → search stack is ready for automatic research.
If not → see `SEARCH-SETUP.md` for installation, or the pipeline works without it (manual research fallback).
