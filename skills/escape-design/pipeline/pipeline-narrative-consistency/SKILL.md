---
name: pipeline-narrative-consistency
description: "Trigger: coherencia narrativa escape room, FASE 3a/4a. Detecta nombres inconsistentes, contradicciones temporales, relaciones ilógicas, promesas narrativas abiertas y cambios de tono entre pruebas."
---

# Pipeline Narrative Consistency

## Activation Contract

Runs twice: after DESIGN (Phase 3) and after BUILD (Phase 4).

## Hard Rules

1. **Exhaustive**: scan EVERYTHING — intro, transitions, endings, hints, in-world docs.
2. **Concrete references**: "Pardo in P1 line 45 but Soto in P4 section 3.2" not "name inconsistent".
3. **Severity**: `critical` = breaks story/blocks solving, `major` = confuses, `minor` = cosmetic.
4. **Intentional openness**: sequel hooks marked `intentional: true`, don't count as fail.

## Mechanics

### 1. Entity Extraction

Scan all documents, extract:
- **Characters**: names, roles, descriptions, relationships
- **Locations**: names, descriptions, spatial connections
- **Objects**: names, where they appear, who uses, state
- **Events**: dates, times, sequence, cause-effect
- **Narrative promises**: mysteries posed, unresolved clues, mentioned-but-absent characters

### 2. Cross-Reference

Each entity consistent across all appearances: same name spelling (case-sensitive), same role, same location, logical appearance/disappearance.

### 3. Timeline Check

Dates/hours coherent, event order logical, no anachronisms, durations realistic.

### 4. Plot Thread Tracking

Every posed mystery → resolved (or intentionally open). Every mentioned character → relevant. No Chekhov's guns undischarged.

### 5. Tone Check

Consistent tone across puzzles. Changes justified narratively. Language appropriate for target audience.

### 6. Information Flow (Anti-Repetition)

No spoilers before their puzzle. Components carry no revealing instructions. Navigation notes say WHERE only, never WHAT. Diagrams appear ONLY in the room where used.

Build info-flow table:

| Info/Component | First appears | Used in | Appears before? | Status |
|----------------|--------------|---------|----------------|--------|

## Output Contract

`NARRATIVE-CONSISTENCY-REPORT.json` — Schema in `references/report-schema.md`.

## Verdict Rules

| Condition | Verdict |
|-----------|---------|
| 0 inconsistencies, all promises resolved | ✅ `pass` |
| ≤2 minor, no unintentional unresolved | ⚠️ `pass_with_warnings` |
| ≥1 critical OR ≥1 unintentional unresolved | ❌ `fail` |

Pipeline: `fail` → pass to Build/Design. `pass_with_warnings` → notes to Verify. `pass` → continue.

## References

- `references/report-schema.md` — Full report schema
