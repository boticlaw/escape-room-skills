---
name: pipeline-conceive
description: "Trigger: concepto narrativo escape room, concebir juego, FASE 2 pipeline. Dual-LLM: dos jueces generan conceptos independientes (estructurado vs creativo), síntesis unificada en CONCEPT.json."
license: Apache-2.0
metadata:
  author: escape-room-skills
  version: "2.0"
  scope: [escape-design]
  phase: 2
  dual_llm: true
---

# Pipeline Conceive (FASE 2 — Dual-LLM)

## Activation Contract

After EXPLORE. BRIEF.json complete, `datos_pendientes` empty.

## Hard Rules

1. **Independencia**: Judges NO comparten output. 100% independent generation.
2. **Duración**: suma de actos ≤ duración del BRIEF.
3. **Actos**: mínimo 3, máximo 4.
4. **Progresión emocional**: no plana — actos suben o bajan, no se repiten.
5. **Gancho**: visual/inmediato, <30 seg. No backstory largo.
6. **Síntesis coherente**: el concepto final lee como una sola propuesta, no una mezcla.

## Decision Gates

### Same-provider detection

If `scripts/verify-judges.py` reports `same_provider: true`, maximize divergence:

| Aspecto | Juez A | Juez B |
|---------|--------|--------|
| Personalidad | Ingeniero QA — sistemático, pesimista | Jugador apasionado — emocional, optimista |
| Método | Checklist, scoring 1-10 | Narrativa experiencial + red flags |
| Output | JSON con scores | Narrativa libre + resumen |

## Execution Steps

### Step 0: Research (both judges)

Consult puzzle catalog + real games (see `references/research-commands.md`).

Research frameworks: `03-storytelling.md`, `04-psicologia.md`, `06-escenografia.md`.

### Step 1: Launch Parallel

```
delegate(agent="escape-judge-a", prompt="Lee BRIEF.json, research frameworks, GAMETYPE.md.
ENFOQUE: estructurado — arco clásico 3 actos, progresión lógica, gancho por misterio.
Genera CONCEPT.json completo → {output_dir}/concepts/CONCEPT-A.json")

delegate(agent="escape-judge-b", prompt="Lee BRIEF.json, research frameworks, GAMETYPE.md.
ENFOQUE: creativo — giros narrativos, mecánicas innovadoras, atmósfera inmersiva.
Genera CONCEPT.json completo → {output_dir}/concepts/CONCEPT-B.json")
```

Both in parallel. Wait for BOTH before Step 2.

### Step 2: Synthesis (orchestrator agent reads + synthesizes)

Read CONCEPT-A.json + CONCEPT-B.json. Synthesize following these priorities:

1. **Título**: best of both, or combine if synergy
2. **Premisa**: logic of A + twist of B (if it works)
3. **Actos**: structure of A + wow moments of B
4. **Atmósfera**: most immersive (tends to B if feasible)

Synthesis prompt template in `references/synthesis-prompt.md`.

### Step 3: Validate

- [ ] Suma duración actos ≤ duración BRIEF
- [ ] 3 ≤ actos ≤ 4
- [ ] Progresión emocional no plana
- [ ] Gancho intriguing <30 seg
- [ ] Tono coherente con temática
- [ ] Flujo compatible con game_type

If fails: adjust synthesis, re-validate (max 2 attempts). Then escalate.

### Step 4: Save

1. `concepts/CONCEPT-A.json`
2. `concepts/CONCEPT-B.json`
3. `CONCEPT.json` (final)

## Output Contract

| Product | Path |
|---------|------|
| Concept Judge A | `{output_dir}/concepts/CONCEPT-A.json` |
| Concept Judge B | `{output_dir}/concepts/CONCEPT-B.json` |
| Final synthesized | `{output_dir}/CONCEPT.json` |

CONCEPT.json schema: `references/concept-schema.md`

## References

- `references/concept-schema.md` — Full CONCEPT.json schema + example
- `references/synthesis-prompt.md` — Synthesis prompt template
- `references/research-commands.md` — Catalog/game search commands
