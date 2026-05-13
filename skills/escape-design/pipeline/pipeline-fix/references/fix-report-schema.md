# FIX-REPORT.json Schema

```json
{
  "id": "fix_{fecha}_{juego-slug}",
  "game_ref": "{juego-slug}",
  "timestamp": "ISO-8601",
  "source_report": "MATERIALS-VERIFY-REPORT.json|VERIFY-REPORT.json|PLAYTEST-REPORT.json|JUDGMENT-REPORT.json",
  "source_verdict": "fail|pass_with_warnings",
  "verdict": "fixed|needs_escalation",
  "fixes_applied": [
    {
      "issue_id": "P1.solvability_trace",
      "issue_summary": "Orden de nacimiento no deducible de testimonios",
      "fix_type": "json_modify",
      "file": "juego/pruebas/prueba-001-tablero.json",
      "field": "documentos_in_game[3].texto",
      "old_value": "Testimonio 4: Luis no estuvo antes que Miguel.",
      "new_value": "Testimonio 4: Luis, nacido entre Carmen y Miguel, no estuvo antes que Miguel en los eventos.",
      "materials_regenerated": [
        "materiales/01-testimonios.html",
        "materiales/01-testimonios.pdf"
      ]
    }
  ],
  "fixes_escalated": [
    {
      "issue_id": "P4.mechanic_variety",
      "reason": "Requires adding new puzzle mechanic — needs DESIGN phase"
    }
  ],
  "revalidation": {
    "phase": "pipeline-verify-materials",
    "verdict": "pass|fail",
    "report_path": "MATERIALS-VERIFY-REPORT.json"
  },
  "cycle": 1,
  "max_cycles": 2
}
```

## Field Descriptions

| Field | Description |
|-------|-------------|
| `source_report` | Which report triggered the fix |
| `fixes_applied` | Every change made, with before/after and affected files |
| `fixes_escalated` | Issues that couldn't be fixed at this level |
| `revalidation` | Result of re-running the originating validation |
| `cycle` | Current fix cycle (max 2 before escalation) |
