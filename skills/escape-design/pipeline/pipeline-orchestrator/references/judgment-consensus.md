# Judgment Consensus

Both judges evaluate narrative AND logic (no separation).

| judge-a (GLM-5.1) | judge-b (GPT-5.5) | Action |
|-----|-----|--------|
| approved | approved | ✅ ENTREGAR |
| approved_with_suggestions | approved | ✅ ENTREGAR (con notas) |
| approved | approved_with_suggestions | ✅ ENTREGAR (con notas) |
| approved_with_suggestions | approved_with_suggestions | ✅ ENTREGAR (notas de ambos) |
| rejected | approved | → CONCEIVE con feedback dual |
| approved | rejected | → DESIGN con feedback dual |
| rejected | rejected | → EXPLORE — concepto roto |
