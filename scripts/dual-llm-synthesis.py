#!/usr/bin/env python3
"""
Dual-LLM Synthesis — Cross findings from Judge A and Judge B.

Usage:
  dual-llm-synthesis.py --judge-a PLAYTEST-A.json --judge-b PLAYTEST-B.json --output PLAYTEST-REPORT.json --type playtest
  dual-llm-synthesis.py --judge-a JUDGE-A.json --judge-b JUDGE-B.json --output JUDGMENT-REPORT.json --type judgment

Does NOT call any LLM. Pure logic: reads both reports, crosses findings, classifies.
"""
import argparse
import json
import sys
from datetime import datetime, timezone


def classify_issue(issue_text_a: str, issues_b: list, threshold: float = 0.4) -> dict:
    """Check if Judge B has a similar issue. Simple keyword overlap."""
    words_a = set(issue_text_a.lower().split())
    best_match = None
    best_score = 0.0

    for ib in issues_b:
        words_b = set(ib.get("description", ib.get("finding", "")).lower().split())
        if not words_b:
            continue
        overlap = len(words_a & words_b) / max(len(words_a | words_b), 1)
        if overlap > best_score:
            best_score = overlap
            best_match = ib

    if best_score >= threshold and best_match:
        return {
            "classification": "CONFIRMED",
            "judge_b_match": best_match,
            "confidence": round(best_score, 2)
        }
    return {"classification": "SUSPECT", "judge_b_match": None, "confidence": 0.0}


def synthesize_playtest(report_a: dict, report_b: dict, game_ref: str) -> dict:
    """Cross playtest findings from both judges."""
    findings = []
    all_issues_a = []
    all_issues_b = []

    # Collect issues from Judge A
    for profile, data in report_a.get("profiles_summary", {}).items():
        if data.get("block_risk") in ("medium", "high"):
            all_issues_a.append({
                "profile": profile,
                "type": "block_risk",
                "description": f"{profile}: block_risk={data.get('block_risk')}, hints={data.get('hints', '?')}",
                "severity": "high" if data.get("block_risk") == "high" else "medium"
            })

    # Collect issues from Judge B
    for profile, data in report_b.get("profiles_summary", {}).items():
        if data.get("block_risk") in ("medium", "high"):
            all_issues_b.append({
                "profile": profile,
                "type": "block_risk",
                "description": f"{profile}: block_risk={data.get('block_risk')}, hints={data.get('hints', '?')}",
                "severity": "high" if data.get("block_risk") == "high" else "medium"
            })

    # Cross findings
    confirmed = []
    suspects = []

    for ia in all_issues_a:
        result = classify_issue(ia["description"], all_issues_b)
        if result["classification"] == "CONFIRMED":
            confirmed.append({
                **ia,
                "classification": "CRITICAL",
                "judge_b_match": result["judge_b_match"],
                "confidence": result["confidence"]
            })
        else:
            suspects.append({
                **ia,
                "classification": "WARNING",
                "source_judge": "judge_a"
            })

    # Add Judge B issues not matched
    matched_b = {id(f.get("judge_b_match")) for f in confirmed if f.get("judge_b_match")}
    for ib in all_issues_b:
        if id(ib) not in matched_b:
            suspects.append({
                **ib,
                "classification": "WARNING",
                "source_judge": "judge_b"
            })

    # Compute verdict
    has_block = any(
        d.get("block_risk") == "high"
        for d in list(report_a.get("profiles_summary", {}).values()) +
                 list(report_b.get("profiles_summary", {}).values())
    )
    if has_block:
        verdict = "fail"
    elif confirmed:
        verdict = "pass_with_concerns"
    else:
        verdict = "pass"

    return {
        "id": f"playtest_{datetime.now(timezone.utc).strftime('%Y-%m-%d')}_{game_ref}",
        "game_ref": game_ref,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "dual_llm": True,
        "judge_a_model": report_a.get("_meta", {}).get("model", "opencode-agent"),
        "judge_b_model": report_b.get("_meta", {}).get("model", "unknown"),
        "summary": {
            "judge_a_profiles": list(report_a.get("profiles_summary", {}).keys()),
            "judge_b_profiles": list(report_b.get("profiles_summary", {}).keys()),
            "total_profiles": len(report_a.get("profiles_summary", {})) + len(report_b.get("profiles_summary", {})),
            "overall_verdict": verdict
        },
        "critical_findings": confirmed,
        "warnings": suspects,
        "judge_a_summary": report_a.get("profiles_summary", {}),
        "judge_b_summary": report_b.get("profiles_summary", {}),
        "synthesis_stats": {
            "critical": len(confirmed),
            "warning": len(suspects)
        }
    }


def synthesize_judgment(report_a: dict, report_b: dict, game_ref: str) -> dict:
    """Cross judgment findings from both judges."""
    findings_a = report_a.get("findings", report_a.get("issues", []))
    findings_b = report_b.get("findings", report_b.get("issues", []))

    if isinstance(findings_a, dict):
        findings_a = [findings_a]
    if isinstance(findings_b, dict):
        findings_b = [findings_b]

    confirmed = []
    suspects = []
    contradictions = []

    # Cross each finding from A against B
    descs_b = [f.get("description", f.get("finding", str(f))) for f in findings_b]
    matched_b_indices = set()

    for ia in findings_a:
        desc_a = ia.get("description", ia.get("finding", str(ia)))
        result = classify_issue(desc_a, findings_b)
        if result["classification"] == "CONFIRMED":
            confirmed.append({
                "finding": desc_a,
                "judge_a_ref": ia,
                "judge_b_ref": result["judge_b_match"],
                "confidence": result["confidence"],
                "severity": ia.get("severity", "major"),
                "fix": ia.get("suggestion", ia.get("fix", "Review and address"))
            })
            if result["judge_b_match"] in findings_b:
                matched_b_indices.add(id(result["judge_b_match"]))
        else:
            suspects.append({
                "finding": desc_a,
                "source": "judge_a",
                "recommendation": "investigate"
            })

    # Check for contradictions (opposing views on same topic)
    # Simple heuristic: if A scores high and B scores low on same criterion
    scores_a = report_a.get("scores", {})
    scores_b = report_b.get("scores", {})
    for criterion in set(scores_a.keys()) & set(scores_b.keys()):
        sa = scores_a[criterion] if isinstance(scores_a[criterion], (int, float)) else 0
        sb = scores_b[criterion] if isinstance(scores_b[criterion], (int, float)) else 0
        if abs(sa - sb) >= 3:
            contradictions.append({
                "topic": criterion,
                "judge_a_score": sa,
                "judge_b_score": sb,
                "delta": abs(sa - sb),
                "resolution": "Review manually — judges disagree significantly"
            })

    # Unmatched B findings
    for ib in findings_b:
        if id(ib) not in matched_b_indices:
            suspects.append({
                "finding": ib.get("description", ib.get("finding", str(ib))),
                "source": "judge_b",
                "recommendation": "investigate"
            })

    # Compute combined score
    score_a = report_a.get("overall_score", report_a.get("combined_score", 0))
    score_b = report_b.get("overall_score", report_b.get("combined_score", 0))
    if isinstance(score_a, dict):
        score_a = score_a.get("combined", score_a.get("overall", 0))
    if isinstance(score_b, dict):
        score_b = score_b.get("combined", score_b.get("overall", 0))

    combined = round((float(score_a) + float(score_b)) / 2, 2) if score_a and score_b else 0

    if combined >= 8.0 and not confirmed:
        verdict = "approved"
    elif confirmed:
        verdict = "approved_with_suggestions" if combined >= 7.0 else "rejected"
    else:
        verdict = "approved_with_suggestions"

    return {
        "id": f"judgment_{datetime.now(timezone.utc).strftime('%Y-%m-%d')}_{game_ref}",
        "game_ref": game_ref,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "dual_llm": True,
        "iterations": 1,
        "judge_a_model": report_a.get("_meta", {}).get("model", "opencode-agent"),
        "judge_b_model": report_b.get("_meta", {}).get("model", "unknown"),
        "synthesis": {
            "confirmed": confirmed,
            "suspect": suspects,
            "contradiction": contradictions
        },
        "scores": {
            "judge_a": score_a,
            "judge_b": score_b,
            "combined": combined
        },
        "verdict": verdict,
        "fixes_applied": [],
        "remaining_suspects": [s["finding"] for s in suspects]
    }


def main():
    parser = argparse.ArgumentParser(description="Dual-LLM Synthesis")
    parser.add_argument("--judge-a", required=True, help="Judge A result JSON")
    parser.add_argument("--judge-b", required=True, help="Judge B result JSON")
    parser.add_argument("--output", required=True, help="Output synthesis JSON")
    parser.add_argument("--type", required=True, choices=["playtest", "judgment", "narrative"])
    parser.add_argument("--game-ref", default="unknown", help="Game reference ID")
    args = parser.parse_args()

    with open(args.judge_a) as f:
        report_a = json.load(f)
    with open(args.judge_b) as f:
        report_b = json.load(f)

    if args.type == "playtest":
        result = synthesize_playtest(report_a, report_b, args.game_ref)
    else:
        result = synthesize_judgment(report_a, report_b, args.game_ref)

    with open(args.output, "w") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"Synthesis written to {args.output}", file=sys.stderr)
    print(f"Verdict: {result.get('summary', result).get('overall_verdict', result.get('verdict', 'unknown'))}", file=sys.stderr)


if __name__ == "__main__":
    main()
