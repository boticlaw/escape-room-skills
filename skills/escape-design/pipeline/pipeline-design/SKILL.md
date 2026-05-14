---
name: pipeline-design
description: "Trigger: diseñar pruebas escape room, FASE 3 pipeline. Dual-LLM: dos jueces diseñan desde perspectivas complementarias (lógico vs experiencial), síntesis con clasificación CONFIRMED/SUSPECT/CONTRADICTION."
license: Apache-2.0
metadata:
  author: escape-room-skills
  version: "2.0"
---

# Pipeline Design (FASE 3 — Dual-LLM)

## Activation Contract

After CONCEIVE. CONCEPT.json + BRIEF.json + `skill-registry.json` available.

## Hard Rules

1. **REUTILIZACIÓN OBLIGATORIA** — ≥50% pruebas EXISTENTES del catálogo.
2. **Solo** `skill_primario` del registry (20 skills).
3. Suma duraciones ≤ `duracion_total` − 10 min.
4. **Máx 2 pruebas** del mismo `skill_primario`.
5. **Al menos 3 mecánicas distintas**.
6. Curva de dificultad **estrictamente progresiva**.
7. La **última prueba** integra elementos de anteriores.
8. Judges NO comparten output. Síntesis balanceada (contribuciones de ambos).
9. **B&W FIRST**: El default es impresión láser B&W. Solo se usa color cuando la mecánica lo requiere explícitamente (ej: distinguir cables por color, fotos que pierden sentido en B&W). Justificar cada excepción en `impresion.motivo_color`.

## Game Style Rules (from 09-estilo-juegos.md)

- **Todo el equipo activo** — 4-6 jugadores simultáneos por prueba
- **Físico > Digital** — Manipulación, superposición, búsqueda
- **Contenedor narrativo** — Componentes múltiples en contenedor temático
- **Doble descubrimiento** — 2 fases: encontrar + interpretar
- **Variedad de cierres** — Máx 3 del mismo tipo
- **Misterio secundario** — Hilo conductor entre pruebas
- **Momentos de energía** — Mínimo 2 picos (inicio y final)
- **Curva recomendada** — 3→4→5→(pico)→4. Última NO la más difícil

## Decision Gates

### Same-provider detection

If `scripts/verify-judges.py` → `same_provider: true`, maximize divergence (see Conceive same-provider table).

### Step 0: Research

Consult puzzle catalog + real games (same pattern as Conceive — see `references/research-commands.md`).

Research frameworks: `01-game-design.md`, `02-puzzle-design.md`, `04-psicologia.md`, `05-ux.md`, `09-estilo-juegos.md`.

## Execution Steps

### Step 1: Launch Parallel

```
delegate(agent="escape-judge-a", prompt="Lee BRIEF.json, CONCEPT.json, skill-registry.json, research frameworks.
ENFOQUE: puzzles lógicos, cadena deductiva, progresión equilibrada, mecánicas probadas.
Genera DESIGN.json → {output_dir}/designs/DESIGN-A.json")

delegate(agent="escape-judge-b", prompt="Lee BRIEF.json, CONCEPT.json, skill-registry.json, research frameworks.
ENFOQUE: puzzles experienciales, momentos 'wow', interacción física, sorpresa emocional.
Genera DESIGN.json → {output_dir}/designs/DESIGN-B.json")
```

Both parallel. Wait for BOTH.

### Step 2: Synthesis

Read DESIGN-A + DESIGN-B. Classify each puzzle:

| Classification | Definition | Action |
|---------------|-----------|--------|
| **CONFIRMED** | Both propose same/equivalent | Include directly |
| **SUSPECT-A** | Only logical judge | Evaluate for solidity |
| **SUSPECT-B** | Only experiential judge | Evaluate for impact |
| **CONTRADICTION** | Same slot, different mechanics | Agent decides or hybrid |

Balance: ~60% logical (A), ~40% experiential (B). Synthesis prompt in `references/synthesis-prompt.md`.

### Step 3: Validate

- [ ] Suma duraciones ≤ `duracion_total` − 10 min
- [ ] Máx 2 pruebas del mismo `skill_primario`
- [ ] ≥3 mecánicas distintas
- [ ] Curva estrictamente progresiva
- [ ] Última prueba integra anteriores
- [ ] ≥50% EXISTENTES
- [ ] Variedad de cierres (máx 3 mismo tipo)
- [ ] Misterio secundario coherente
- [ ] **Impresión B&W**: Todas las mecánicas funcionan en B&W. Si una prueba necesita color (ej: cables de colores, fotos), está marcada con `impresion.color: true` y tiene `motivo_color` justificado. Los materiales decorativos usan patrones/texturas, no color.

Fails → adjust synthesis, re-validate (max 2). Then escalate.

### Step 4: Save

1. `designs/DESIGN-A.json`
2. `designs/DESIGN-B.json`
3. `DESIGN.json` (final)

## Output Contract

| Product | Path |
|---------|------|
| Design Judge A | `{output_dir}/designs/DESIGN-A.json` |
| Design Judge B | `{output_dir}/designs/DESIGN-B.json` |
| Final synthesized | `{output_dir}/DESIGN.json` |

DESIGN.json schema: `references/design-schema.md`

## References

- `references/design-schema.md` — Full DESIGN.json schema + example
- `references/synthesis-prompt.md` — Synthesis prompt template
- `references/research-commands.md` — Catalog/game search commands
- `references/validation-scripts.md` — Quick validation scripts
