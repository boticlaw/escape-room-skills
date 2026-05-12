# SearXNG + Perplexica — Search Stack for Escape Room Research

> Self-hosted search stack: SearXNG (meta-search) + Perplexica (AI search with citations). Docker-based, works anywhere.

## Why This Matters

The escape room design pipeline uses **automatic thematic research** during the EXPLORE phase. When you say "create an escape room about the Spanish Inquisition", the pipeline:

1. Searches for historical facts, curiosities, anecdotes, playable elements
2. Gets AI-summarized results with cited sources
3. Feeds the research into BRIEF.json → CONCEIVE → DESIGN

Without this stack, the pipeline works but research is manual. **With it, research is automatic.**

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌───────────┐
│   SearXNG   │────▶│  Perplexica  │────▶│  Gemini   │
│  :8888      │     │  :3100       │     │  API      │
│  meta-search│     │  AI summary  │     │  (LLM)    │
│  70+ engines│     │  + citations │     │           │
└─────────────┘     └──────────────┘     └───────────┘
       ▲                    ▲
       │                    │
       ▼                    ▼
  escape-puzzles      pipeline-explore
  (mechanic lookup)   (thematic research)
```

## Quick Start

### Prerequisites

- Docker + Docker Compose v2
- A Gemini API key (free tier: https://aistudio.google.com/apikey)
- Ports 8888 and 3100 available

### 1. Install Docker Compose v2 (if needed)

```bash
mkdir -p ~/.docker/cli-plugins
curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-$(uname -m)" \
  -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose
docker compose version  # verify
```

### 2. Copy the search stack config

```bash
cp -r services/ ~/escape-search/
cd ~/escape-search/
```

### 3. Set your API key

```bash
# Edit perplexica/config.toml — replace YOUR_GEMINI_API_KEY
sed -i 's/YOUR_GEMINI_API_KEY/your-actual-key-here/' perplexica/config.toml
```

### 4. Launch

```bash
docker compose up -d
```

Wait ~15 seconds, then verify:
```bash
curl -s http://localhost:8888  # SearXNG → 200
curl -s http://localhost:3100  # Perplexica → 200
```

### 5. Configure Perplexica (first time only)

Open **http://localhost:3100** in your browser:

1. Go to **Settings**
2. Select **Chat Model Provider**: Google Gemini
3. Select **Chat Model**: `gemini-2.0-flash`
4. Select **Embedding Model**: any Gemini embedding model
5. Save

## Usage from Agents / Scripts

### SearXNG — Raw search results

```bash
# Python script (included)
python3 services/scripts/searxng-search.py "Spanish Inquisition escape room" 10

# Direct API
curl -s "http://localhost:8888/search?q=Spanish+Inquisition+escape+room&format=json" | jq '.results[:5] | .[] | {title, url, content}'
```

### Perplexica — AI search with citations

```bash
# API call
curl -s -X POST http://localhost:3100/api/search \
  -H "Content-Type: application/json" \
  -d '{"query":"Spanish Inquisition historical facts for escape room design","focusMode":"webSearch"}'
```

### Jina Reader — Extract content from URLs

```bash
curl -s "https://r.jina.ai/https://example.com/article" | head -100
```

## Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Full stack: SearXNG + Perplexica |
| `searxng/settings.yml` | SearXNG config (JSON format enabled) |
| `perplexica/config.toml` | Perplexica config (Gemini API key placeholder) |
| `scripts/searxng-search.py` | Python helper for SearXNG queries |

## Troubleshooting

| Problem | Solution |
|---------|----------|
| SearXNG restarting | Check `docker logs searxng`. Usually missing `settings.yml` or JSON format not enabled. |
| Perplexica returns errors | Open :3100 → Settings → verify model provider is configured. |
| SearXNG blocked by upstream engines | SearXNG uses Google/Bing/DuckDuckGo — excessive use gets rate-limited. Add a proxy or reduce query frequency. |
| Port conflicts | Edit `docker-compose.yml` ports: `"8889:8080"` for SearXNG, `"3101:3000"` for Perplexica. Update `SEARXNG_API_URL` accordingly. |

## Alternative LLM Providers

Perplexica supports multiple providers. Edit `perplexica/config.toml`:

| Provider | Config section | Requirements |
|----------|---------------|--------------|
| **Gemini** | `[MODELS.GEMINI]` | API key from Google AI Studio |
| **OpenAI** | `[MODELS.OPENAI]` | API key |
| **Ollama** | `[MODELS.OLLAMA]` | Local Ollama running on port 11434 |
| **Groq** | `[MODELS.GROQ]` | API key |
| **Custom OpenAI** | `[MODELS.CUSTOM_OPENAI]` | Any OpenAI-compatible API |

For local/offline use, install Ollama and pull a model:
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.1
# Then in Perplexica settings, select Ollama as provider
```

## Data Persistence

All data is stored in Docker named volumes:

```bash
docker volume ls | grep perplexica   # perplexica-dbstore, perplexica-uploads, perplexica_searxng-data
```

To backup:
```bash
docker run --rm -v perplexica_perplexica-dbstore:/data -v $(pwd):/backup alpine tar czf /backup/perplexica-backup.tar.gz /data
```

To clean everything and start fresh:
```bash
docker compose down -v  # removes containers AND volumes
```
