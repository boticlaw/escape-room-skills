# Fix Catalog — Common Fixes with Exact Field Paths

## Category: Solvability Gaps

### FIX-001: Missing deduction info in documento

**Trigger**: MATERIALS-VERIFY Check 4 (solvability_trace) → gap found
**Fix**: Modify the specific `documentos_in_game[N].texto` to add the missing info
**Rule**: Add ONLY the minimum info needed. Don't reveal the full answer.

```
File: juego/pruebas/prueba-XXX-{name}.json
Field: documentos_in_game[N].texto  (find the documento that should carry the info)
Also:  ingame_docs[N].texto          (if duplicated, fix both)
```

### FIX-002: Circular dependency (info locked in box needed to open box)

**Trigger**: MATERIALS-VERIFY Check 5 (self_contained) → circular_deps found
**Fix**: Move the critical documento from inside-box to outside-box

```
File: juego/pruebas/prueba-XXX-{name}.json
Field: configuracion.elementos_necesarios  (move item from "DENTRO" section to "FUERA" section)
Also:  Update gm_notas for the moved documento
```

## Category: Consistency Errors

### FIX-010: Reward letter mismatch

**Trigger**: MATERIALS-VERIFY Check 7 (hilo_conductor_consistency) → mismatch
**Fix**: Make all references match `hilo_conductor.letra`

```
File: juego/pruebas/prueba-XXX-{name}.json
Fields to check and fix:
  - solucion.recompensa.letra           → must match hilo_conductor.letra
  - solucion.pasos_detallados           → any mention of "letra X"
  - solucion.verificacion               → any mention of "letra X"
  - materiales.impresion                → "pieza física letra X"
  - materiales.extras                   → "pieza física letra X"
  - configuracion.elementos_necesarios  → "Letra física X"
  - documentos_in_game[].gm_notas       → references to letter
  - ingame_docs[].gm_notas              → references to letter
```

### FIX-011: Lock code mismatch

**Trigger**: MATERIALS-VERIFY Check 6 (lock_code_consistency)
**Fix**: Update all references to match `barrera_fisica.codigo`

```
File: juego/pruebas/prueba-XXX-{name}.json
Fields to check and fix:
  - barrera_fisica.codigo               → source of truth
  - solucion.descripcion                → code mentioned in text
  - solucion.pasos_detallados[]         → code mentioned in steps
  - solucion.verificacion               → code mentioned in verification
  - pistas[].texto                      → code mentioned in hints (level 3 only)
  - configuracion.elementos_necesarios  → candado configuration
  - control_movimiento.solucion_implementada → code reference
```

## Category: Material Issues

### FIX-020: Duplicate content across documents

**Trigger**: MATERIALS-VERIFY Check 3 (no_duplicates)
**Fix**: Remove duplicate, keep the more appropriate location

```
Action:
  1. Remove the duplicate entry from documentos_in_game (keep the one in the correct location)
  2. Delete the corresponding HTML and PDF files
  3. If both copies serve a purpose, differentiate them (one inside box, one outside)
```

### FIX-021: Orphan material (no matching documento_in_game)

**Trigger**: MATERIALS-VERIFY Check 2 (coverage_materials_to_docs)
**Fix**: Either add a documento_in_game entry for it, or delete the orphan

```
Action:
  - If material is needed: add entry to documentos_in_game with proper titulo, texto, cantidad, gm_notas
  - If material is obsolete: delete HTML + PDF files
```

### FIX-022: Wrong classification (reco- file that isn't a reward)

**Trigger**: MATERIALS-VERIFY Check 10 (classification_correct)
**Fix**: Rename file prefix

```
Action:
  - Rename HTML file: {NN}-reco-{name}.html → {NN}-{name}.html
  - Regenerate PDF: node generate-pdf.js materiales/{NN}-{name}.html
  - Delete old PDF
```

## Category: Playtest Issues

### FIX-030: Player confusion on instructions

**Trigger**: PLAYTEST report → confusion detected at specific puzzle step
**Fix**: Clarify instructions in the relevant documento

```
File: juego/pruebas/prueba-XXX-{name}.json
Field: documentos_in_game[]  (find the instruction documento)
Action: Rewrite ambiguous text, add concrete example or visual cue
```

### FIX-031: Difficulty too easy/hard

**Trigger**: PLAYTEST report → time delta >+50% (hard) or >-30% (easy)
**Fix**: Adjust puzzle constraints

```
Too easy options:
  - Add more restrictions/constraints to deduction
  - Increase pairs/items to match
  - Remove direct clues from instructions

Too hard options:
  - Add a hint to existing pistas[] at level 1 or 2
  - Simplify a constraint (remove one deduction step)
  - Add a partial confirmation mechanism (e.g., "you'll know the first digit is correct if...")
```

## Category: Escalation Required

These issues CANNOT be fixed by pipeline-fix. They need DESIGN or CONCEIVE.

| Issue | Why escalate |
|-------|-------------|
| Mechanic variety < 3 | Requires designing a new puzzle mechanic |
| Fundamental narrative contradiction | Requires story rework |
| Both judges reject | Core concept problem |
| Physical mechanism unbuildable | Requires redesigning the puzzle's physical interaction |
