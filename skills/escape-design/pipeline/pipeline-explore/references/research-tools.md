# Research Tools

## SearXNG (raw search results)

```bash
python3 services/scripts/searxng-search.py "[temática] escape room historical facts curiosities" 10
python3 services/scripts/searxng-search.py "[temática] puzzles mechanisms interactive elements" 10
python3 services/scripts/searxng-search.py "[temática] timeline key events dates" 5

# Direct API:
curl -s "http://localhost:8888/search?q=QUERY&format=json" | jq '.results[:5] | .[] | {title, url, content}'
```

## Perplexica (AI summary + citations)

```bash
python3 services/scripts/perplexica-search.py "Research [temática] for escape room design. Key facts, playable elements." webSearch
python3 services/scripts/perplexica-search.py "[temática] academic research timeline" academicSearch
```

## Content Extraction

```bash
curl -s "https://r.jina.ai/URL_HERE" | head -200
```

## Research Data Output

```json
{
  "research_data": {
    "searxng_queries": ["query1", "query2"],
    "perplexica_summary": "AI-generated summary",
    "sources": [{"title": "...", "url": "...", "relevant_facts": ["..."]}],
    "playable_elements": ["fact for puzzle", "date for timeline"],
    "historical_timeline": ["event1 (year)"],
    "characters": ["name - role - why interesting"],
    "datos_clave": "Concise summary"
  }
}
```

No research needed for: generic themes (fantasy, sci-fi), or when user provides all data.

If unavailable: `webfetch` fallback, mark `research_data.incomplete = true`.
