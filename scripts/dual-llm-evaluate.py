#!/usr/bin/env python3
"""
Dual-LLM Evaluator — Calls an external LLM API as Judge B.

This script provides the "second opinion" for escape room evaluation.
Judge A runs inside opencode (the agent's model). Judge B runs here (Gemini/OpenAI API).

Usage:
  dual-llm-evaluate.py --task playtest --input game_data.json --output PLAYTEST-B.json
  dual-llm-evaluate.py --task judge --input game_data.json --output JUDGE-B.json
  dual-llm-evaluate.py --task narrative --input game_data.json --output NARRATIVE-B.json

Environment:
  DUAL_LLM_API_KEY   — API key (required)
  DUAL_LLM_MODEL     — Model name (default: gemini-2.0-flash)
  DUAL_LLM_PROVIDER  — "gemini" or "openai" (default: gemini)
  DUAL_LLM_BASE_URL  — Override base URL (optional)
"""
import argparse
import json
import os
import sys
import urllib.request
import urllib.parse
import urllib.error

# ── Config ──────────────────────────────────────────────────────────────────

API_KEY = os.environ.get("DUAL_LLM_API_KEY", "")
PROVIDER = os.environ.get("DUAL_LLM_PROVIDER", "gemini")
MODEL = os.environ.get("DUAL_LLM_MODEL", "gemini-2.0-flash")
BASE_URL = os.environ.get("DUAL_LLM_BASE_URL", "")

# ── System prompts by task ──────────────────────────────────────────────────

SYSTEM_PROMPTS = {
    "playtest": """You are Judge B — an EXPERIENTIAL playtest simulator for escape rooms.

You simulate 3 player profiles from an EXPERIENTIAL perspective:
- B1: Novato Ansioso (3-4 players, first-timers, nervous, ask for hints quickly)
- B2: Adolescente Impulsivo (4-6 players, 14-17 years, high energy, skip reading, brute force)
- B3: Adulto Pragmático (3-5 players, 35-55 years, practical, want clear feedback)

For EACH profile, simulate the COMPLETE game session step by step:
1. Entry → introduction reaction
2. Each puzzle → approach, attempt, time spent, hints needed, block risks
3. Transitions → flow experience
4. Ending → satisfaction level

Record for each profile:
- time_delta: % difference from design estimate (e.g., "+40%")
- hints: number of hints needed (0-5)
- block_risk: none|low|medium|high
- frustration_moments: specific moments where frustration builds
- highlights: specific moments of joy/aha

Be BRUTALLY HONEST. If a puzzle is confusing, say so. If players would cheat, say so.
Reference specific elements: "The cipher in P4 uses symbols that appear nowhere else" not "the puzzle is confusing".

Output as JSON matching the PLAYTEST schema.""",

    "judge": """You are Judge B — a CREATIVE evaluator for escape rooms.

You evaluate the game from a CREATIVE/IMMERSIVE perspective:
- Immersion quality — does the narrative pull players in?
- Emotional arc — variety and progression of emotions
- Originality — are the puzzles creative or generic?
- Player experience — would players remember this game?
- Narrative-puzzle integration — do puzzles feel part of the story?

Score each criterion 1-10. Provide specific feedback for each.
Also evaluate logic/solvability from your perspective.

Be RUTHLESS but constructive. If something is mediocre, say so.
Reference specific elements, not vague impressions.

Output as JSON with: scores (per criterion), findings (issues found), suggestions (improvements).""",

    "narrative": """You are Judge B — evaluating NARRATIVE consistency and quality.

Evaluate:
- Plot coherence — does the story hold together?
- Character consistency — do characters behave as established?
- Pacing — does the narrative flow well?
- Emotional engagement — would players care?
- Show vs tell — does the game show the story or just tell it?
- Environmental storytelling — do props/space convey narrative?
- Satisfying resolution — does the ending deliver?

Score each 1-10. List inconsistencies, weak points, and suggestions.
Reference specific passages, characters, and scenes.

Output as JSON with: scores, inconsistencies, suggestions."""
}

# ── API calls ───────────────────────────────────────────────────────────────

def call_gemini(system_prompt: str, user_prompt: str) -> str:
    """Call Google Gemini API."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"
    payload = json.dumps({
        "system_instruction": {"parts": [{"text": system_prompt}]},
        "contents": [{"parts": [{"text": user_prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 8192,
            "responseMimeType": "application/json"
        }
    }).encode("utf-8")

    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read())
        return data["candidates"][0]["content"]["parts"][0]["text"]


def call_openai(system_prompt: str, user_prompt: str) -> str:
    """Call OpenAI-compatible API."""
    base = BASE_URL or "https://api.openai.com/v1"
    url = f"{base}/chat/completions"
    payload = json.dumps({
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 8192,
        "response_format": {"type": "json_object"}
    }).encode("utf-8")

    req = urllib.request.Request(url, data=payload, headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    })
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read())
        return data["choices"][0]["message"]["content"]


def call_llm(system_prompt: str, user_prompt: str) -> str:
    """Call the configured LLM provider."""
    if PROVIDER == "openai":
        return call_openai(system_prompt, user_prompt)
    return call_gemini(system_prompt, user_prompt)


# ── Main ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Dual-LLM Evaluator (Judge B)")
    parser.add_argument("--task", required=True, choices=["playtest", "judge", "narrative"],
                        help="Evaluation task type")
    parser.add_argument("--input", required=True, help="Path to game data JSON")
    parser.add_argument("--output", required=True, help="Path to write result JSON")
    parser.add_argument("--prompt", default="", help="Additional context/query for the LLM")
    args = parser.parse_args()

    if not API_KEY:
        print("ERROR: DUAL_LLM_API_KEY environment variable not set", file=sys.stderr)
        print("Set it to your Gemini or OpenAI API key", file=sys.stderr)
        sys.exit(1)

    # Read game data
    with open(args.input, "r") as f:
        game_data = f.read()

    # Build user prompt
    user_prompt = f"""## Game Data
{game_data}

## Task
{args.prompt if args.prompt else f"Perform a {args.task} evaluation of this escape room game."}

Provide your evaluation as structured JSON."""

    # Call LLM
    system_prompt = SYSTEM_PROMPTS.get(args.task, SYSTEM_PROMPTS["judge"])
    print(f"Calling {PROVIDER} ({MODEL}) as Judge B for {args.task}...", file=sys.stderr)

    try:
        result_text = call_llm(system_prompt, user_prompt)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        print(f"API Error {e.code}: {body[:500]}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

    # Validate JSON
    try:
        result_json = json.loads(result_text)
    except json.JSONDecodeError:
        # Try to extract JSON from markdown code blocks
        import re
        match = re.search(r'```(?:json)?\s*(.*?)```', result_text, re.DOTALL)
        if match:
            result_json = json.loads(match.group(1))
        else:
            print("Warning: LLM did not return valid JSON, wrapping in raw field", file=sys.stderr)
            result_json = {"raw": result_text, "parse_error": True}

    # Add metadata
    result_json["_meta"] = {
        "judge": "B",
        "provider": PROVIDER,
        "model": MODEL,
        "task": args.task,
        "source_file": args.input
    }

    # Write output
    with open(args.output, "w") as f:
        json.dump(result_json, f, indent=2, ensure_ascii=False)

    print(f"Judge B evaluation written to {args.output}", file=sys.stderr)


if __name__ == "__main__":
    main()
