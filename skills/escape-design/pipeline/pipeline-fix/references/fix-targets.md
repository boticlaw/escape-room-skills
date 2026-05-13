# Fix Targets — Issue Type to Fix Target Mapping

## MATERIALS-VERIFY Fixes

| Issue Type | Fix Target | Scope |
|-----------|------------|-------|
| Coverage gap (missing doc) | Add to `documentos_in_game` + generate HTML | Single puzzle JSON |
| Solvability gap (missing info) | Modify documento text in JSON to add the info | Single puzzle JSON |
| Circular dependency | Restructure which docs are inside/outside box in JSON | Single puzzle JSON |
| Code/letter mismatch | Fix `hilo_conductor` or `barrera_fisica` in JSON | Single puzzle JSON |
| Duplicate content | Remove duplicate from JSON, delete orphan HTML/PDF | Single puzzle JSON |
| Text divergence | Regenerate HTML from current JSON (JSON is truth) | Single material |
| Wrong classification | Rename file (prefix) + update JSON metadata | Single material |

## VERIFY Fixes

| Issue Type | Fix Target | Scope |
|-----------|------------|-------|
| Narrative coherence | Fix `documentos_in_game` texts + `NARRATIVA.md` | Puzzle JSON + narrative |
| Difficulty curve | Adjust `dificultad` + modify puzzle constraints | Single puzzle JSON |
| Mechanic variety | Escalate — requires DESIGN level changes | Escalate |

## PLAYTEST Fixes

| Issue Type | Fix Target | Scope |
|-----------|------------|-------|
| Player confusion | Add hint level, clarify instructions in JSON | Single puzzle JSON |
| Too easy/hard | Adjust constraints, add/remove complexity | Single puzzle JSON |

## JUDGMENT Fixes

| Issue Type | Fix Target | Scope |
|-----------|------------|-------|
| Rejected by both judges | Escalate — fundamental design problem | Escalate |
| Approved with suggestions | Apply non-breaking suggestions, regenerate | Per suggestion |
