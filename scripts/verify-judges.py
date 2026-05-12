#!/usr/bin/env python3
"""verify-judges.py — Check provider divergence for dual-LLM judges.

Reads opencode.json, extracts models for escape-judge-a and escape-judge-b,
determines each model's provider, and reports whether they differ.

Usage:
    python3 scripts/verify-judges.py
    python3 scripts/verify-judges.py --config /path/to/opencode.json
    python3 scripts/verify-judges.py --pretty
"""

import argparse
import json
import os
import sys

# Provider detection: model prefix → provider name
PROVIDER_MAP = [
    ("opencode/glm", "GLM"),
    ("opencode/gpt", "OpenAI"),
    ("opencode/claude", "Anthropic"),
    ("opencode/gemini", "Google"),
    ("opencode/deepseek", "DeepSeek"),
    ("opencode/qwen", "Qwen"),
    ("opencode/llama", "Meta"),
    ("opencode/mistral", "Mistral"),
    ("opencode/command", "Cohere"),
    ("opencode/o", "OpenAI"),
]


def detect_provider(model: str | None) -> str:
    """Determine provider from model string prefix."""
    if model is None:
        return "Unknown"
    model_lower = model.lower()
    for prefix, provider in PROVIDER_MAP:
        if model_lower.startswith(prefix):
            return provider
    # Fallback: extract segment after 'opencode/' and before first '-'
    # e.g. "opencode/something-else" → "Something"
    if "/" in model:
        after_slash = model.split("/", 1)[1]
        first_part = after_slash.split("-")[0]
        return first_part.capitalize()
    return "Unknown"


def extract_model_name(model: str | None) -> str:
    """Strip the 'opencode/' prefix for display."""
    if model is None:
        return "N/A"
    if "/" in model:
        return model.split("/", 1)[1]
    return model


def load_config(config_path: str) -> dict:
    """Load and return the opencode.json config."""
    path = os.path.expanduser(config_path)
    if not os.path.isfile(path):
        print(f"Error: config file not found: {path}", file=sys.stderr)
        sys.exit(1)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def get_judge_model(config: dict, judge_name: str) -> str | None:
    """Extract the model field for a named judge agent."""
    agents = config.get("agent", {})
    if judge_name not in agents:
        return None
    return agents[judge_name].get("model")


def build_report(config: dict) -> dict:
    """Build the full verification report."""
    model_a = get_judge_model(config, "escape-judge-a")
    model_b = get_judge_model(config, "escape-judge-b")

    # Missing judge detection
    if model_a is None and model_b is None:
        return {
            "judge_a": None,
            "judge_b": None,
            "error": "Neither escape-judge-a nor escape-judge-b found in config",
            "same_provider": None,
            "recommendation": "configure_judges",
            "fallback_mode": None,
        }

    if model_a is None:
        return {
            "judge_a": None,
            "judge_b": {"model": model_b, "provider": detect_provider(model_b)},
            "error": "escape-judge-a not found in config",
            "same_provider": None,
            "recommendation": "configure_judge_a",
            "fallback_mode": None,
        }

    if model_b is None:
        return {
            "judge_a": {"model": model_a, "provider": detect_provider(model_a)},
            "judge_b": None,
            "error": "escape-judge-b not found in config",
            "same_provider": None,
            "recommendation": "configure_judge_b",
            "fallback_mode": None,
        }

    provider_a = detect_provider(model_a)
    provider_b = detect_provider(model_b)
    same_provider = provider_a == provider_b
    same_model = model_a == model_b

    report = {
        "judge_a": {"model": model_a, "provider": provider_a},
        "judge_b": {"model": model_b, "provider": provider_b},
        "same_provider": same_provider,
    }

    if same_model:
        report["recommendation"] = "change_model"
        report["fallback_mode"] = "enhanced_prompt_divergence"
        report["warning"] = (
            "Both judges use the EXACT SAME model. Dual-LLM provides minimal value. "
            "Change one judge to a different model or provider."
        )
        report["options"] = [
            {"id": "change", "description": "Change one judge to a different model (edit opencode.json)"},
            {"id": "enhanced_divergence", "description": "Use Enhanced Prompt Divergence (reduced effectiveness)"},
            {"id": "single_judge", "description": "Use only Judge A, skip dual evaluation entirely"},
        ]
    elif same_provider:
        report["recommendation"] = "enhanced_prompt_divergence"
        report["fallback_mode"] = "enhanced_prompt_divergence"
        report["warning"] = (
            f"Both judges use {provider_a} provider. Dual-LLM effectiveness is reduced. "
            "Enhanced prompt divergence mode activated."
        )
        report["options"] = [
            {"id": "keep", "description": "Continue with same provider using enhanced prompt divergence mode"},
            {"id": "change", "description": "Change one judge to a different provider (edit opencode.json)"},
        ]
    else:
        report["recommendation"] = "dual_llm_full"
        report["fallback_mode"] = None

    return report


def print_pretty(report: dict) -> None:
    """Print human-readable output."""
    if report.get("error") and report.get("judge_a") is None and report.get("judge_b") is None:
        print(f"❌ {report['error']}")
        print(f"   Recommendation: {report['recommendation']}")
        return

    if report.get("error") and report.get("judge_a") is None:
        print(f"Judge A: NOT CONFIGURED")
        print(f"Judge B: {report['judge_b']['provider']} ({extract_model_name(report['judge_b']['model'])})")
        print(f"❌ {report['error']}")
        print(f"   Recommendation: {report['recommendation']}")
        return

    if report.get("error") and report.get("judge_b") is None:
        print(f"Judge A: {report['judge_a']['provider']} ({extract_model_name(report['judge_a']['model'])})")
        print(f"Judge B: NOT CONFIGURED")
        print(f"❌ {report['error']}")
        print(f"   Recommendation: {report['recommendation']}")
        return

    a = report["judge_a"]
    b = report["judge_b"]

    if not report["same_provider"]:
        print(f"Judge A: {a['provider']} ({extract_model_name(a['model'])})     → Analytical perspective")
        print(f"Judge B: {b['provider']} ({extract_model_name(b['model'])})  → Creative perspective")
        print(f"Providers: DIFFERENT ✅")
        print(f"Mode: dual_llm_full")
    elif a["model"] == b["model"]:
        print(f"Judge A: {a['provider']} ({extract_model_name(a['model'])})")
        print(f"Judge B: {b['provider']} ({extract_model_name(b['model'])})")
        print(f"Providers: SAME, MODEL: SAME ❌")
        print(f"Mode: enhanced_prompt_divergence (WARNING: minimal dual-LLM value)")
        print(f"")
        print(f"⚠️  {report.get('warning', '')}")
        if report.get("options"):
            print(f"")
            print(f"Options:")
            for opt in report["options"]:
                print(f"  {opt['id']}: {opt['description']}")
    else:
        print(f"Judge A: {a['provider']} ({extract_model_name(a['model'])})     → Analytical perspective")
        print(f"Judge B: {b['provider']} ({extract_model_name(b['model'])}) → Creative perspective")
        print(f"Providers: SAME ⚠️")
        print(f"Mode: enhanced_prompt_divergence")
        print(f"")
        print(f"⚠️  {report.get('warning', '')}")
        if report.get("options"):
            print(f"")
            print(f"Options:")
            for opt in report["options"]:
                print(f"  {opt['id']}: {opt['description']}")


def main():
    parser = argparse.ArgumentParser(description="Verify dual-LLM judge provider divergence")
    parser.add_argument(
        "--config",
        default="~/.config/opencode/opencode.json",
        help="Path to opencode.json (default: ~/.config/opencode/opencode.json)",
    )
    parser.add_argument(
        "--pretty",
        action="store_true",
        help="Human-readable output instead of JSON",
    )
    args = parser.parse_args()

    config = load_config(args.config)
    report = build_report(config)

    if args.pretty:
        print_pretty(report)
    else:
        print(json.dumps(report, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
