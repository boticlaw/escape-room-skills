#!/usr/bin/env python3
"""AI search via Perplexica. Usage: perplexica-search.py "query" [focus_mode]
Focus modes: webSearch (default), academicSearch, writingAssistant, youtubeSearch, redditSearch"""
import json, sys, urllib.request, os

PERPLEXICA_URL = os.environ.get("PERPLEXICA_URL", "http://localhost:3100/api/search")

def search(query, focus_mode="webSearch"):
    payload = json.dumps({
        "query": query,
        "focusMode": focus_mode
    }).encode("utf-8")
    req = urllib.request.Request(
        PERPLEXICA_URL,
        data=payload,
        headers={"Content-Type": "application/json", "User-Agent": "EscapeRoomSkills/1.0"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())
            return data
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: perplexica-search.py \"query\" [focus_mode]", file=sys.stderr)
        print("Focus modes: webSearch, academicSearch, writingAssistant, youtubeSearch, redditSearch", file=sys.stderr)
        print("Env: PERPLEXICA_URL — override default http://localhost:3100/api/search", file=sys.stderr)
        sys.exit(1)
    focus = sys.argv[2] if len(sys.argv) > 2 else "webSearch"
    result = search(sys.argv[1], focus)
    if "error" in result:
        print(f"Error: {result['error']}", file=sys.stderr)
        sys.exit(1)
    # Print the response — structure depends on Perplexica version
    print(json.dumps(result, indent=2, ensure_ascii=False))
