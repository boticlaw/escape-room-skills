#!/usr/bin/env python3
"""Search via local SearXNG instance. Usage: searxng-search.py "query" [max_results]"""
import json, sys, urllib.request, urllib.parse

# Default to localhost:8888 — override with SEARXNG_URL env var
import os
SEARXNG_URL = os.environ.get("SEARXNG_URL", "http://localhost:8888/search")

def search(query, max_results=5):
    params = urllib.parse.urlencode({"q": query, "format": "json"})
    req = urllib.request.Request(f"{SEARXNG_URL}?{params}", headers={"User-Agent": "EscapeRoomSkills/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read())
            results = []
            for r in data.get("results", [])[:max_results]:
                results.append({
                    "title": r.get("title", ""),
                    "url": r.get("url", ""),
                    "content": r.get("content", ""),
                    "engine": r.get("engine", "")
                })
            return results
    except Exception as e:
        return [{"error": str(e)}]

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: searxng-search.py \"query\" [max_results]", file=sys.stderr)
        print("Env: SEARXNG_URL — override default http://localhost:8888/search", file=sys.stderr)
        sys.exit(1)
    n = int(sys.argv[2]) if len(sys.argv) > 2 else 5
    results = search(sys.argv[1], n)
    for i, r in enumerate(results, 1):
        print(f"{i}. {r['title']}")
        print(f"   {r.get('url', '')}")
        print(f"   {r.get('content', '')[:150]}")
        print()
