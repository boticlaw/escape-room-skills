# MATERIALS-VERIFY-REPORT.json Schema

```json
{
  "id": "materials-verify_{fecha}_{juego-slug}",
  "game_ref": "{juego-slug}",
  "timestamp": "ISO-8601",
  "verdict": "pass|pass_with_warnings|fail",
  "puzzles": {
    "P1": {
      "puzzle_ref": "prueba-001-tablero.json",
      "documents_defined": 8,
      "documents_generated": 6,
      "checks": {
        "coverage_docs_to_materials": {"status": "pass|fail", "details": "string", "missing": ["doc-name"]},
        "coverage_materials_to_docs": {"status": "pass|warning", "details": "string", "orphans": ["filename"]},
        "no_duplicates": {"status": "pass|fail", "details": "string", "duplicates": [{"file_a": "...", "file_b": "...", "reason": "..."}]},
        "solvability_trace": {
          "status": "pass|fail",
          "details": "string",
          "trace": [
            {"step": "Carmen=1", "source": "Testimonio 5", "accessible": true},
            {"step": "Marcos=hijo mayor", "source": "Testimonio 1", "accessible": true},
            {"step": "Orden edad Marcos>Carmen>Luis>Miguel", "source": "Testimonio 4 'nacido entre Carmen y Miguel'", "accessible": true}
          ],
          "gaps": []
        },
        "self_contained": {"status": "pass|fail", "details": "string", "circular_deps": []},
        "lock_code_consistency": {"status": "pass|fail", "details": "string", "expected": "3154", "found": ["3154"]},
        "hilo_conductor_consistency": {"status": "pass|fail", "details": "string", "expected_letter": "L", "found": "L"},
        "no_solution_leakage": {"status": "pass|fail", "details": "string", "leaks": []},
        "text_fidelity": {"status": "pass|fail", "details": "string", "divergences": []},
        "classification_correct": {"status": "pass|warning", "details": "string", "misclassified": []},
        "completeness": {"status": "pass|fail", "details": "string", "empty_files": []},
        "cross_puzzle_consistency": {"status": "pass|fail", "details": "string"}
      },
      "puzzle_verdict": "pass|pass_with_warnings|fail"
    }
  },
  "game_summary": {
    "total_documents_defined": 0,
    "total_documents_generated": 0,
    "total_fails": 0,
    "total_warnings": 0,
    "per_puzzle_verdicts": {"P1": "pass"},
    "global_verdict": "pass|pass_with_warnings|fail"
  },
  "issues": ["string"],
  "warnings": ["string"],
  "suggestions": ["string"]
}
```

## Field Descriptions

| Field | Description |
|-------|-------------|
| `solvability_trace.trace` | Step-by-step derivation of the code from accessible documents. Each step names the fact, the source document, and whether it's accessible at that point. |
| `solvability_trace.gaps` | Facts needed for the code that have no source in accessible documents. Non-empty = `fail`. |
| `self_contained.circular_deps` | Info locked inside the box that is needed to open the box. Non-empty = `fail`. |
| `no_solution_leakage.leaks` | Documents accessible before solving that contain the answer directly. Non-empty = `fail`. |
| `text_fidelity.divergences` | Text differences between JSON source and generated HTML/PDF. Format: `{file, field, expected, actual}`. |
