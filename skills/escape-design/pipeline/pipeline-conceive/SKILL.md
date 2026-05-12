---
name: pipeline-conceive
description: >
  FASE 2 del pipeline de escapeitor. Dual-LLM: Razonator (GLM-5.1) y Visionator (GPT-5.5) generan
  conceptos independientes desde enfoques distintos (estructurado vs creativo). Escapeitor
  sintetiza lo mejor de ambos en un CONCEPT.json final.
license: Apache-2.0
metadata:
  author: escapeitor-team
  version: "2.0"
  scope: [escapeitor]
  phase: 2
  dual_llm: true
  auto_invoke: "Cuando se solicita crear el concepto narrativo de un juego de escape room"
---

# Pipeline — FASE 2: Conceive (Dual-LLM)

Dos LLMs generan conceptos independientes desde perspectivas distintas. Escapeitor sintetiza lo mejor de cada uno en un concepto final unificado.

## Cuándo se ejecuta

Después de FASE 1 (Explore). El Orchestrator llama a este skill cuando el `BRIEF.json` está completo y sin `datos_pendientes`.

## Input

| Fuente | Ruta |
|--------|------|
| Brief del juego | `agents/escapeitor/.pipeline/{juego-id}/BRIEF.json` |

## Output

| Producto | Ruta |
|----------|------|
| Concepto Juez A | `agents/escapeitor/.pipeline/{juego-id}/concepts/CONCEPT-A.json` |
| Concepto Juez B | `agents/escapeitor/.pipeline/{juego-id}/concepts/CONCEPT-B.json` |
| Concepto final sintetizado | `agents/escapeitor/.pipeline/{juego-id}/CONCEPT.json` |

## Los Dos Jueces

| Agente | Modelo | Enfoque |
|--------|--------|---------|
| `razonator` | `zai/glm-5.1` | **Estructurado** — narrativa clásica, progresión lógica, arcos tradicionales, solidez narrativa |
| `visionator` | `openai-codex/gpt-5.5` | **Creativo** — giros narrativos, mecánicas innovadoras, atmósferas originales, gancho impactante |

**Ventaja dual-LLM**: Un modelo prioriza solidez estructural, el otro aporta frescura creativa. La síntesis captura lo mejor de ambos enfoques.

## Research Frameworks (consultar ANTES de generar)

| Framework | Ruta | Uso |
|-----------|------|-----|
| Storytelling | `agents/escapeitor/research-frameworks/03-storytelling.md` | Arco narrativo, Hero's Journey |
| Psicología | `agents/escapeitor/research-frameworks/04-psicologia.md` | Flow Theory, progresión emocional |
| Escenografía | `agents/escapeitor/research-frameworks/06-escenografia.md` | Atmósfera, inmersión sensorial |

Ambos jueces deben leer estos frameworks antes de generar.

## Paso 1: Launch Paralelo

Lanzar ambos jueces como **agentes independientes** con `sessions_spawn`:

```
sessions_spawn(agentId=razonator, task:
  "Lee skills/pipeline-conceive/SKILL.md para entender el formato de output.
   Lee el BRIEF.json en agents/escapeitor/.pipeline/{juego-id}/BRIEF.json.
   Lee los research frameworks: research-frameworks/03-storytelling.md, 04-psicologia.md, 06-escenografia.md.
   Lee el GAMETYPE.md correspondiente al game_type del brief.
   
   Tu ENFOQUE: estructurado, narrativa clásica, progresión lógica.
   - Arco narrativo sólido (3 actos claros con setup/confrontation/resolution)
   - Personajes con motivaciones bien definidas
   - Progresión emocional predecible pero efectiva
   - Gancho basado en misterio clásico (algo que no debería estar ahí)
   - Flujo recomendado conservador (compatible con el game_type)
   
   Genera un CONCEPT.json completo siguiendo la estructura del skill.
   Escríbelo en agents/escapeitor/.pipeline/{juego-id}/concepts/CONCEPT-A.json"
)

sessions_spawn(agentId=visionator, task:
  "Lee skills/pipeline-conceive/SKILL.md para entender el formato de output.
   Lee el BRIEF.json en agents/escapeitor/.pipeline/{juego-id}/BRIEF.json.
   Lee los research frameworks: research-frameworks/03-storytelling.md, 04-psicologia.md, 06-escenografia.md.
   Lee el GAMETYPE.md correspondiente al game_type del brief.
   
   Tu ENFOQUE: creativo, giros narrativos, mecánicas innovadoras.
   - Giros inesperados en la narrativa (nothing is what it seems)
   - Mecánicas de interacción poco convencionales
   - Atmósfera inmersiva y sensorialmente rica
   - Gancho visual/emocional impactante (shock o wonder en <30 seg)
   - Flujo recomendado atrevido si el game_type lo permite
   
   Genera un CONCEPT.json completo siguiendo la estructura del skill.
   Escríbelo en agents/escapeitor/.pipeline/{juego-id}/concepts/CONCEPT-B.json"
)
```

Ambos en paralelo. Esperar AMBOS antes de continuar a Paso 2.

**REGLA CRÍTICA**: Cada juez NO ve el output del otro. Generación 100% independiente.

**Los jueces son agentes con modelo fijo en config** — Escapeitor no necesita especificar modelo, cada agente ya tiene su LLM asignado.

## Paso 2: Synthesis (Escapeitor orquesta)

Escapeitor lee `CONCEPT-A.json` y `CONCEPT-B.json` y sintetiza directamente (no delega a subagente).

### Prompt Template para Synthesis

```
Eres un director creativo de escape rooms. Tienes dos propuestas de concepto de LLMs diferentes:

## CONCEPTO A (GLM-5.1 — Estructurado)
{CONCEPT-A.json completo}

## CONCEPTO B (GPT-5.5 — Creativo)
{CONCEPT-B.json completo}

## BRIEF ORIGINAL
{BRIEF.json completo}

## TAREA
Sintetiza lo mejor de ambos conceptos en un único CONCEPT.json final:

1. **Título**: Elige el mejor, o combina si hay sinergia
2. **Tagline**: El más evocador de los dos
3. **Premisa**: Combina la solidez lógica de A con el giro de B (si funciona)
4. **Gancho**: El más impactante visualmente/emocionalmente
5. **Actos**: Estructura de A (3-4 actos con progresión clara) con momentos wow de B
6. **Personajes**: Los mejor definidos de cada propuesta
7. **Flujo**: El más compatible con el game_type del BRIEF
8. **Atmósfera**: La más inmersiva (tiende a B si es factible)
9. **Tono**: El más coherente con la premisa final

REGLAS:
- La síntesis debe ser coherente, no un Frankenstein
- Priorizar la viabilidad del concepto final sobre la originalidad pura
- La suma de actos debe ser ≤ duración del BRIEF
- Mínimo 3, máximo 4 actos
- Progresión emocional NO plana

Genera el CONCEPT.json final siguiendo la estructura estándar.
```

## Paso 3: Validar

Verificar el concepto final:

- [ ] Suma de duración de actos ≤ duración del BRIEF
- [ ] 3 ≤ actos ≤ 4
- [ ] Progresión emocional (no plana: los actos suben o bajan, no se repiten)
- [ ] Gancho intriguing <30 seg
- [ ] Tono coherente con temática del brief
- [ ] Flujo compatible con game_type del GAMETYPE.md

Si falla validación, ajustar la síntesis y re-validar (máx 2 intentos). Si persiste, escalar al Orchestrator.

## Paso 4: Guardar

1. Guardar `CONCEPT-A.json` en `agents/escapeitor/.pipeline/{juego-id}/concepts/CONCEPT-A.json`
2. Guardar `CONCEPT-B.json` en `agents/escapeitor/.pipeline/{juego-id}/concepts/CONCEPT-B.json`
3. Guardar `CONCEPT.json` (final) en `agents/escapeitor/.pipeline/{juego-id}/CONCEPT.json`

## Estructura de CONCEPT.json (output final)

```json
{
  "id": "concept_{YYYY-MM-DD}_{tematica_slug}",
  "brief_ref": "brief_id_del_brief_original",
  "dual_llm": true,
  "synthesis_sources": {
    "concept_a": "concepts/CONCEPT-A.json",
    "concept_b": "concepts/CONCEPT-B.json"
  },
  "titulo": "string",
  "tagline": "string",
  "premisa": "string (2-3 frases)",
  "gancho": "string (lo que ven al entrar)",
  "actos": [
    {
      "numero": 1,
      "nombre": "string",
      "duracion_minutos": 15,
      "emocion_objetivo": "string"
    }
  ],
  "personajes": [
    {
      "nombre": "string",
      "rol": "string",
      "descripcion_breve": "string"
    }
  ],
  "flujo_recomendado": "lineal|acumulacion|cadenas_paralelas",
  "atmosfera": {
    "iluminacion": "string",
    "sonido": "string",
    "elementos_sensoriales": "string"
  },
  "tono": "string"
}
```

## Reglas

1. **Duración**: suma de actos ≤ duración del BRIEF
2. **Actos**: mínimo 3, máximo 4
3. **Progresión emocional**: los actos NO pueden tener la misma emoción objetivo. Buscar curva (ascenso, descenso, clímax)
4. **Gancho**: debe ser visual/inmediato. No backstory largo. "Los jugadores ven X que les hace preguntarse Y"
5. **Tono**: una sola palabra, coherente con la temática
6. **Título**: evocativo, ≤5 palabras, fácil de recordar y pronunciar
7. **Compatibilidad**: el flujo_recomendado debe ser compatible con el game_type según su GAMETYPE.md
8. **Independencia**: los jueces NO comparten output. Cada uno genera su concepto sin ver el del otro
9. **Síntesis coherente**: el concepto final debe leerse como una sola propuesta, no como una mezcla

## Integración con Orchestrator

El Orchestrator debe:
1. Llamar a `pipeline-conceive` cuando BRIEF.json esté completo
2. Esperar los 3 archivos (CONCEPT-A.json, CONCEPT-B.json, CONCEPT.json)
3. Mostrar a Daniel: título + tagline + premisa (del CONCEPT.json final)
4. Si quiere ver alternativas → puede consultar CONCEPT-A.json y CONCEPT-B.json en `concepts/`

## Agentes Utilizados

- `razonator` (GLM-5.1) — Agente independiente con modelo fijo en config
- `visionator` (GPT-5.5) — Agente independiente con modelo fijo en config
- Ambos son subagentes permitidos de Escapeitor

## Ejemplo

```json
{
  "id": "concept_2026-04-06_hospital_abandonado",
  "brief_ref": "brief_2026-04-06_horror_medico",
  "dual_llm": true,
  "synthesis_sources": {
    "concept_a": "concepts/CONCEPT-A.json",
    "concept_b": "concepts/CONCEPT-B.json"
  },
  "titulo": "Pabellón 7",
  "tagline": "La última operación nunca terminó.",
  "premisa": "En 1983, el pabellón 7 del Hospital San Miguel fue clausurado tras la desaparición del Dr. Vega y tres pacientes. Ahora, 40 años después, una filtración en el sótano ha revelado pasillos que no aparecen en ningún plano.",
  "gancho": "Al entrar, los jugadores ven una sala de espera intacta de los años 80 con tres sillas vacías y un televisor encendido en estática. En la pared, escritos a mano: 'No salgan del pabellón después de las 10.'",
  "actos": [
    {"numero": 1, "nombre": "La Llegada", "duracion_minutos": 15, "emocion_objetivo": "inquietud"},
    {"numero": 2, "nombre": "Los Expedientes", "duracion_minutos": 20, "emocion_objetivo": "curiosidad escalofriante"},
    {"numero": 3, "nombre": "El Quirófano", "duracion_minutos": 20, "emocion_objetivo": "tensión extrema"},
    {"numero": 4, "nombre": "Salida", "duracion_minutos": 10, "emocion_objetivo": "alivio con resaca"}
  ],
  "personajes": [
    {"nombre": "Dr. Vega", "rol": "antagonista ausente", "descripcion_breve": "Cirujano jefe que desapareció. Sus notas aparecen por toda la sala."},
    {"nombre": "Enfermera Ruiz", "rol": "guía fantasma", "descripcion_breve": "Aparece en grabaciones de audio fragmentadas dando pistas."}
  ],
  "flujo_recomendado": "lineal",
  "atmosfera": {
    "iluminacion": "Luz fluorescente parpadeante, zonas de penumbra casi total",
    "sonido": "Zumbido eléctrico constante, pitidos de monitor cardíaco esporádicos",
    "elementos_sensoriales": "Olor a formaldehído, texturas de metal frío, temperatura baja"
  },
  "tono": "tenso"
}
```
