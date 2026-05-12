---
name: pipeline-narrative-consistency
description: Verifica que todos los elementos narrativos del escape room son coherentes entre sí. Detecta nombres inconsistentes, contradicciones temporales, relaciones ilógicas, objetos que aparecen/desaparecen, promesas narrativas abiertas y cambios de tono. Se ejecuta después de Design y después de Build si hay cambios narrativos.
---

# Pipeline Narrative Consistency — Checker de Coherencia Narrativa

Verifica que todos los elementos narrativos del escape room son coherentes entre sí. Detecta inconsistencias que los checks mecánicos de Verify no captan.

> ⏱️ Tiempo estimado: ~3-5 min.

## Input

Leer estos archivos del proyecto:

- `juego/diseño/DISEÑO-JUEGO.md` — Diseño completo (pruebas, flujo, tiempos)
- `juego/narrativa/NARRATIVA.md` — Narrativa (intro, transiciones, final)
- `DESIGN.json` — Diseño estructurado
- `CONCEPT.json` — Concepto original (tono, público, ambientación)

## Mecánica

### 1. Extracción de Entidades

Escanear todo el documento y extraer:

- **Personajes**: nombres, roles, descripciones físicas, relaciones entre ellos
- **Ubicaciones**: nombres, descripciones, conexiones espaciales
- **Objetos**: nombres, dónde aparecen, quién los usa, estado (intacto/roto/etc.)
- **Eventos**: fechas, horas, secuencia temporal, causa-efecto
- **Promesas narrativas**: misterios planteados, pistas sin resolver, personajes mencionados sin aparecer

### 2. Cross-Reference

Verificar que cada entidad es consistente en todas sus apariciones:

- Mismo nombre deletreado igual siempre (case-sensitive)
- Mismo rol/descripción en cada mención
- Misma ubicación si aplica
- Aparición y desaparición lógica (no aparece de la nada, no desaparece sin razón)
- Relaciones entre personajes estables (salvo evolución narrativa intencional)

### 3. Timeline Check

Verificar secuencia temporal:

- Las fechas/horas mencionadas son coherentes entre sí
- El orden de eventos narrativos tiene sentido lógico
- No hay anacronismos (ej: tecnología de 2024 en un juego ambientado en 1990)
- Duraciones mencionadas son realistas

### 4. Plot Thread Tracking

Verificar que todas las promesas narrativas se resuelven:

- Misterios planteados → resueltos (o intencionalmente abiertos con justificación)
- Personajes mencionados → relevantes para la historia (o señalados como color local)
- Pistas planteadas → conducen a algo concreto
- No hay Chekhov's guns sin disparar (elementos introducidos que no cumplen ninguna función)

### 5. Tone Check

Verificar consistencia tonal:

- El tono es coherente entre todas las pruebas
- Los cambios de tono están justificados narrativamente (ej: el terror crece progresivamente)
- El lenguaje y registro son apropiados para el público objetivo
- No hay humor incongruente en momentos de tensión (salvo intención deliberada)

### 6. Information Flow Check (Anti-Repeticiones)

Verificar que la información se revela en el orden correcto y no se repite:

- **No spoilers anticipados:** Ninguna prueba anterior explica o da pistas sobre algo que el jugador debería descubrir en una prueba posterior
- **Componentes sin instrucciones:** Los objetos físicos que se acumulan entre pruebas (llaves, cables, piezas) no llevan etiquetas ni notas que revelen su propósito antes de tiempo
- **Notas de navegación limpias:** Las cartas/mensajes que indican la siguiente sala solo mencionan el destino, nunca describen lo que hay allí o qué hacer
- **Diagramas e instrucciones únicos:** Cualquier diagrama, mapa, instrucciones de montaje o guía mecánica aparece SOLO en la sala donde se usa, nunca parcialmente en salas anteriores

**Método:** Construir una tabla de flujo de información:

| Información/Componente | Primera aparición | Se usa en | Aparece antes? | Status |
|----------------------|-------------------|-----------|----------------|--------|
| Cables rojo+verde | Prueba 1 | Prueba 5 | No (sin notas) | ✅ |
| Diagrama emisor | Prueba 5 | Prueba 5 | No | ✅ |

**FAIL** si hay información anticipada.
**WARNING** si hay ambigüedad (el componente aparece antes pero sin contexto revelador).

## Output

Escribir resultado en `NARRATIVE-CONSISTENCY-REPORT.json`:

```json
{
  "id": "narrative_2026-04-07_{juego-slug}",
  "game_ref": "{juego-slug}",
  "timestamp": "ISO-8601",
  "entities": {
    "characters": [
      {"name": "Pardo", "role": "villano", "appearances": ["P1", "P2", "P6"], "consistent": true}
    ],
    "locations": [
      {"name": "Laboratorio", "descriptions": ["P1", "P3"], "consistent": true}
    ],
    "objects": [
      {"name": "Diario", "appearances": ["P1", "P4"], "consistent": true}
    ],
    "events": [
      {"description": "Incendio del laboratorio", "references": ["P2", "P5"], "consistent": true}
    ]
  },
  "inconsistencies": [
    {
      "type": "name_mismatch|timeline_error|logic_gap|tone_shift|unresolved_promise|object_disappearance|anachronism|relationship_error",
      "location": "P4",
      "description": "El villano se llama 'Pardo' en P1-P3 pero 'Soto' en P4",
      "severity": "critical|major|minor",
      "suggestion": "Unificar nombre a 'Pardo' en P4"
    }
  ],
  "unresolved_promises": [
    {
      "promise": "Desaparición de Marina (mencionada en P2)",
      "location_planted": "P2",
      "resolved": false,
      "intentional": false,
      "suggestion": "Añadir resolución en P5 o P6"
    }
  ],
  "tone_analysis": {
    "overall_tone": "thriller",
    "shifts_detected": [],
    "consistent": true
  },
  "verdict": "pass|pass_with_warnings|fail"
}
```

## Veredicto

| Condición | Veredicto |
|-----------|-----------|
| 0 inconsistencies, todas las promesas resueltas o intencionalmente abiertas | ✅ `pass` |
| ≤2 minor inconsistencies, sin unresolved promises no intencionales | ⚠️ `pass_with_warnings` |
| ≥1 critical inconsistency O ≥1 unresolved promise no intencional | ❌ `fail` |

## Reglas

1. **Ser exhaustivo**: Escanear TODO el documento, no solo las pruebas principales. Incluir intro, transiciones, finales, pistas, documentos in-world.
2. **Referenciar concretamente**: "El villano se llama 'Pardo' en P1 línea 45 pero 'Soto' en P4 sección 3.2" no "hay un nombre inconsistente".
3. **Severity guide**: `critical` = rompe la historia o impide resolver (nombre clave, contradicción temporal), `major` = confunde pero no rompe, `minor` = detalle cosmético.
4. **Intentional openness**: Si un misterio se deja abierto intencionalmente (sequel hook, ambigüedad deliberada), marcarlo como `intentional: true` y no contar como fail.
5. **Tolerancia para tono**: Un solo shift menor de tono no es fail. Dos o más shifts no justificados → `major`.
6. **Objetos tracked**: Si un objeto aparece en P1 y se menciona en P4, verificar que hay continuidad lógica (no desapareció sin razón ni apareció de la nada).

## Integración Pipeline

Este skill se ejecuta en dos puntos:

1. **Después de Design (fase 3)** — Verificar coherencia del diseño narrativo antes de Build.
2. **Después de Build (fase 4)** — Re-verificar si Build introdujo cambios narrativos.

Si `verdict = "fail"` → los inconsistencies se pasan a Build/Design para corrección.
Si `verdict = "pass_with_warnings"` → las sugerencias se pasan como notas a Verify.
Si `verdict = "pass"` → continuar pipeline normalmente.
