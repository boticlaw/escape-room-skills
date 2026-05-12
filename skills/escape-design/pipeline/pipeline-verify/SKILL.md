---
name: pipeline-verify
description: "FASE 5 — VerifierAgent (QA). Valida que el juego generado es correcto, solucionable y coherente antes de pasar a producción."
---

# Pipeline Verify — VerifierAgent (QA)

## Input

Directorio completo del juego: `agents/escapeitor/juegos/{juego-id}/`

| Archivo | Ubicación relativa |
|---------|-------------------|
| juego.json | Raíz del juego |
| NARRATIVA.md | `juego/narrativa/NARRATIVA.md` |
| DISEÑO-JUEGO.md | `juego/diseño/DISEÑO-JUEGO.md` |
| Pruebas | `juego/pruebas/*.json` |
| DESIGN.json | `agents/escapeitor/.pipeline/{juego-id}/DESIGN.json` |
| CONCEPT.json | `agents/escapeitor/.pipeline/{juego-id}/CONCEPT.json` |

## Output

`agents/escapeitor/.pipeline/{juego-id}/VERIFY-REPORT.json`

## Checks (18 checks)

### 1. Schema Compliance (automático)

Ejecutar el script de validación:

```bash
cd /home/daniel/.openclaw/workspace/agents/escapeitor
python scripts/validate_game.py juegos/{juego-id}/
```

- Si el script pasa → `status: "pass"`
- Si falla → `status: "fail"`, incluir output completo en `details`

### 2. Solucionabilidad (simulación mental)

Leer cada prueba y su solución. Verificar:

- La cadena de pruebas tiene **flow completo** (no hay gaps de información entre pruebas)
- Resolver una prueba da información/claves necesarias para la siguiente
- No hay **"pistas mágicas"** — información que el jugador no puede obtener por medios normales dentro del juego
- Simular mentalmente una partida: ¿puede un equipo medio completar el juego sin ayuda externa?

### 3. Dead Ends

- Cada prueba tiene **al menos una pista** que permite avanzar
- No hay **dependencias circulares** (A requiere B que requiere A)
- No hay **pruebas aisladas** (sin conexión al flujo principal)
- Revisar el grafo de dependencias de las pruebas

### 4. Curva de Dificultad

- La dificultad es **progresiva** o tiene picos intencionales justificados narrativamente
- No hay **saltos brutales** (ej: dificultad 3 → dificultad 8 sin justificación)
- La prueba final es el **clímax** (no más fácil que las anteriores)
- `status: "warning"` si hay saltos >3 sin justificación clara

### 5. Tiempos

- Sumar `duracion_estimada` de todas las pruebas
- Verificar: `suma ≤ duracion_total - margen` (margen ≈ 15-20% para transiciones)
- Verificar que **ninguna prueba individual > 20 min** (riesgo de bloqueo/frustración)
- `status: "warning"` si una prueba está en 15-20 min, `fail` si >20 min

### 6. Variedad de Mecánicas

- Contar `skills_primarios` distintos entre todas las pruebas
- Mínimo **3 mecánicas distintas**
- Máximo **2 pruebas del mismo skill**
- Si no se cumple → `status: "fail"`

### 7. Coherencia Narrativa

- `NARRATIVA.md` es consistente con `CONCEPT.json` (mismo tono, personajes, ambientación)
- Cada prueba tiene **conexión narrativa** (no puzzles genéricos desconectados del tema)
- El tono es coherente en todo el juego (no hay mezcla de terror cómico con drama existencial sin justificación)
- Revisar `DISEÑO-JUEGO.md` para verificar que la narrativa se refleja en el diseño

### 8. Pistas

- Cada prueba tiene **al menos 3 niveles de pistas** (hint1, hint2, hint3 o equivalente)
- Las pistas son **progresivas** (hint1 sutil, hint2 más directo, hint3 casi la respuesta)
- Las pistas globales del GM cubren los **puntos críticos** del flujo
- Las pistas NO dan la respuesta de golpe en el primer nivel

### 9. Materiales

- `lista-materiales.md` (o sección de materiales) coincide con los materiales listados en cada prueba
- Los materiales son **viables** (obtenibles, asequibles, posibles de fabricar)
- No hay materiales imposibles o contradictorios
- `status: "warning"` si hay materiales de difícil obtención pero viables

### 10. Consistencia de Códigos ⚠️ CRÍTICO

Para cada prueba, verificar que el **código del code-box** (el que se muestra en la ficha) sea coherente con el **tipo de cierre** declarado:

| Tipo de cierre | Formato esperado del code-box | Ejemplo válido |
|---|---|---|
| Candado 4 dígitos | Exactamente 4 números (ej: `2030`, `1503`) | ✅ `2030` ❌ `ROJO` |
| Candado letras | Solo letras (mayúsculas, 3-6 caracteres) | ✅ `CRIPTA` ❌ `1038` |
| Llave física | La palabra `LLAVE` o descripción (no un código) | ✅ `LLAVE` ❌ `4321` |
| Cryptex | Una palabra temática (letras, 4-8 caracteres) | ✅ `LEGADO` ❌ `123456` |
| Emisor/Radio | Frecuencia o palabra clave | ✅ `104.5 MHz` |
| Candado dirección | Combinación de letras/números | ✅ `A3B` |

**Reglas adicionales:**
- El código del code-box debe coincidir con el código mencionado en la **solución** de la prueba
- El código debe coincidir con el código mencionado en la **mecánica paso a paso**
- Si el DESIGN.json tiene un campo `codigo`, debe coincidir con el code-box
- `status: "fail"` si hay inconsistencia entre code-box y tipo de cierre
- `status: "fail"` si el código en la solución difiere del code-box

**Ejemplo de error detectado:**
```
Cierre: "Candado 4 dígitos (1038)" → OK
Code-box: "LLAVE" → ❌ FAIL
"El cierre dice candado numérico pero el code-box dice LLAVE"
```

### Check #11: Densidad de Progreso (Pacing)
Verificar que ningún tramo del juego supere los 15 minutos sin un hit de progreso tangible. Calcular la densidad de hits por fase:
- Apertura: ≥1 hit cada 5 min
- Desarrollo: ≥1 hit cada 10-15 min
- Clímax: hits en sucesión rápida

**FAIL** si algún tramo >15 min sin avance.

### Check #12: Solución Única (No Ambigüedad)
Verificar que cada puzzle tiene exactamente UNA solución lógica deductiva. Si un puzzle admite múltiples respuestas razonables, está mal diseñado.

**FAIL** si cualquier puzzle admite >1 respuesta lógica.

### Check #13: Self-Contained Logic
Verificar que todos los puzzles pueden resolverse SOLO con la información disponible en la sala. Cero conocimientos externos requeridos (cultura general, matemáticas avanzadas, idiomas).

**FAIL** si cualquier puzzle requiere conocimiento externo.

### Check #14: Zero Cross-Puzzle Data Dependencies ⚠️
Verificar que NINGÚN puzzle requiere información (textos, códigos, pistas, documentos) de una prueba anterior para resolverse.

**Reglas:**
- Cada prueba se resuelve con los materiales disponibles EN ESA SALA
- ✅ Pueden viajar: llaves físicas, herramientas reutilizables (linterna UV), candados abiertos
- ❌ NO pueden viajar: tarjetas con códigos, documentos con pistas, notas con información relevante
- La única excepción es el **hilo conductor** (letras que forman una palabra) que viaja como recompensa

**FAIL** si un puzzle requiere un documento/pista de otra sala para resolverse.
**WARNING** si un puzzle menciona "recuerda X de la prueba Y" sin proporcionar X localmente.

### Check #15: Cooperación Real
Verificar que al menos 1 puzzle requiere la participación simultánea de 2+ jugadores. No basta con "pueden ayudarse" — debe ser imposible para un solo jugador.

**WARNING** si ningún puzzle requiere cooperación simultánea.

### Check #16: Condiciones Físicas Viables
Verificar que los puzzles visuales especifican condiciones de iluminación adecuadas. Verificar que los puzzles físicos usan materiales robustos (no frágiles bajo presión).

**WARNING** si hay puzzles visuales sin especificar iluminación o puzzles físicos con materiales frágiles.

### Check #17: Empoderamiento de Perfiles
Verificar que el juego incluye puzzles para distintos perfiles:
- Buscador (exploración visual, búsqueda de objetos)
- Analista (lógica, cifrados, deducción)
- Líder (coordinación, comunicación)
- Cronometrador (gestión de tiempo implícita)

**WARNING** si >50% de los puzzles favorecen el mismo perfil.

### Check #18: Completitud de la Solución
Verificar que la **solución completa** de cada prueba menciona TODOS los valores/parámetros necesarios para completarla según el tipo de cierre.

**Reglas por tipo de cierre:**
- **Candado N dígitos/letras** → Solución debe mencionar el código exacto
- **Llave física** → Solución debe mencionar qué abre
- **App/tablet (panel de control)** → Solución debe listar TODOS los parámetros (sliders, campos de texto, código de autorización) con sus valores correctos
- **App/tablet (otro tipo)** → Solución debe listar todas las acciones/valores necesarios en la app
- **Mecanismo físico** → Solución debe describir la acción mecánica completa
- **Radio/frecuencia** → Solución debe mencionar la frecuencia exacta
- **Código UV** → Solución debe mencionar las letras y su ubicación

**Criterio:** Para cada prueba, comparar el tipo de cierre con lo que la solución lista. Si la solución omite valores/acciones necesarios → **FAIL**.

**Ejemplo de FAIL:** Prueba con cierre "App Panel de Control" cuya solución solo menciona "código AV1P" pero la app requiere además ajustar 3 sistemas con sliders y campos de texto.

**Ejemplo de PASS:** Solución lista: código autorización AV1P + AIRE: CO2=415, causa=contaminación industrial + AGUA: caudal=12000, fuga=tubería principal + ENERGÍA: rendimiento=95%, código emergencia=1503.

**FAIL** si cualquier prueba tiene valores/acciones faltantes en la solución.
**WARNING** si la solución es vaga ("ajustar los sistemas") sin valores concretos.

### Check #19: Anti-Repeticiones entre Pruebas

Verificar que **ninguna información clave se revela antes de tiempo**. Los jugadores deben descubrir cada pieza de información en el momento adecuado.

**Reglas:**
- Si una prueba X introduce un concepto, mecánica o componente, ese concepto NO debe aparecer explicado en pruebas 1 a X-1
- Los componentes físicos acumulados entre pruebas (llaves, cables, piezas, tarjetas) NO deben llevar instrucciones que revelen su propósito final — el jugador lo descubre al llegar a la prueba donde se usan
- Las notas de navegación entre salas solo indican **dónde ir**, nunca **qué hacer** en la siguiente sala
- Un diagrama, mapa o instrucciones que se usa en la prueba Y, no debe aparecer (ni parcialmente) en pruebas anteriores

**Método:** Para cada prueba, listar:
1. Qué información/componente se INTRODUCE por primera vez
2. Qué información/componente se USA (recibido de pruebas anteriores)
3. Verificar que nada de (1) aparece explicado antes de su prueba

**FAIL** si información de una prueba posterior aparece anticipada en una prueba anterior.
**WARNING** si un componente se repite pero sin revelar su propósito (marginal).

**Ejemplo de FAIL:** La Prueba 5 requiere montar un emisor con 5 cables y un diagrama de conexiones. Las Pruebas 1-3 entregan los cables con notas que dicen "Componente A del emisor" y un diagrama parcial. → El jugador ya sabe para qué sirven los cables antes de llegar a la Prueba 5.

**Ejemplo de PASS:** Las Pruebas 1-3 entregan cables sin ninguna nota. En la Prueba 5, el jugador encuentra los cables acumulados + el diagrama completo, y deduce la conexión.

### Check #20: Tres Capas de Claridad *(Estilo-JUEGOS.md §7)*

Para cada prueba, verificar las 3 capas:
1. **¿Qué ven?** — Elementos visibles disponibles al jugador
2. **¿Qué entienden?** — La lógica que deben deducir
3. **¿Qué hacen?** — La acción concreta a ejecutar

**FAIL** si una capa es opaca o falta. **WARNING** si alguna capa es débil pero deducible.

### Check #21: Redundancia y Tolerancia al Error *(Estilo-JUEGOS.md §10)*

Para cada componente crítico (pieza física, código, documento): ¿qué pasa si se pierde, rompe o malinterpreta?

**Reglas:**
- Identificar componentes sin los cuales el juego se bloquea
- Verificar que existe al menos una alternativa (copia, repuesto, pista alternativa, validación parcial)
- El grupo debe poder saber si va bien sin intervención del GM

**FAIL** si un solo punto de fallo bloquea el juego sin alternativa.

### Check #22: Mapa Emocional *(Estilo-JUEGOS.md §6)*

Verificar que las pruebas tienen emociones objetivo variadas (curiosidad, descubrimiento, urgencia, cooperación, giro narrativo, alivio, triunfo).

**Reglas:**
- No 2 pruebas seguidas con la misma emoción
- El arco emocional debe tener variedad
- La dificultad puede subir pero la emoción también debe cambiar

**FAIL** si más de 2 pruebas seguidas comparten emoción. **WARNING** si el arco es monótono.

### Check #23: Recompensas Intermedias *(Estilo-JUEGOS.md §11)*

Verificar que cada 1-2 pruebas hay una recompensa que avance la misión (no solo un código).

**Reglas:**
- La recompensa debe ser una revelación, nueva capacidad, o verdad sobre la historia
- No basta con "acertaste, aquí va la llave" — debe sentirse como avance en el mundo del juego

**FAIL** si más de 2 pruebas consecutivas dan solo códigos sin avance narrativo.

### Check #24: Final Memorables *(Estilo-JUEGOS.md §15)*

Verificar que el cierre cumple 3 condiciones: acción clara + resolución narrativa + recompensa emocional.

**FAIL** si falta alguna de las 3. **WARNING** si el cierre es funcional pero poco memorable.

### Check #25: Legibilidad Visual *(Estilo-JUEGOS.md §14)*

Verificar jerarquía visual: qué llama la atención, qué es fondo, qué se lee rápido.

**Reglas:**
- Las pistas reales deben distinguirse de la ambientación
- Los textos críticos deben ser legibles de un vistazo
- La estética no debe ocultar la función

**FAIL** si pistas y ambientación son indistinguibles. **WARNING** si la jerarquía es confusa.

### Check #26: Regla de Oro *(Estilo-JUEGOS.md §16)*

Cada prueba debe cumplir 4 condiciones:
1. Se entiende
2. Se juega de forma interesante
3. Hace avanzar la historia
4. No puede romper la partida si algo sale mal

**FAIL** si alguna prueba falla en más de 1 condición.

### Check #27: Finalización Garantizada *(Estilo-JUEGOS.md §17)*

Todos los grupos deben terminar el juego completo. No hay opción a perder.

**Reglas:**
- El GM puede intervenir con pistas de cualquier nivel en cualquier momento
- Si el grupo está bloqueado, el GM escala hasta resolver si es necesario
- El tiempo límite no es game over — si se acaba el tiempo, el GM acelera las pruebas restantes
- Ningún grupo se queda sin ver el final

**FAIL** si el diseño tiene un punto sin escape (donde ni el GM puede ayudar). **WARNING** si el GM necesita intervenir frecuentemente (el diseño es demasiado difícil para el público objetivo).

---

### Check #18: Design Compliance Matrix

Verificar trazabilidad completa entre decisiones de diseño y verificaciones:

1. Por cada prueba/puzzle del escape room, verificar que existe:
   - ✅ Objetivo claro (qué debe resolver el jugador)
   - ✅ Input (qué información/recursos tiene el jugador)
   - ✅ Mecanismo (cómo interactúa)
   - ✅ Output (qué obtiene al resolver)
   - ✅ Conexión (cómo conecta con la siguiente prueba)
   - ✅ Pista GM (qué hint tiene el GM si se bloquean)
   - ✅ Solución verificable (un jugador puede confirmar que resolvió)

2. Generar una tabla de compliance:
   | Prueba | Objetivo | Input | Mecanismo | Output | Conexión | Pista | Solución | Status |
   |--------|----------|-------|-----------|--------|----------|-------|----------|--------|

3. **FAIL** si alguna celda está vacía para una prueba activa
4. **WARNING** si la conexión entre pruebas es débil (no hay recompensa clara que motive al jugador a avanzar)

## Estructura de VERIFY-REPORT.json

```json
{
  "id": "verify_2026-04-06_la-casa-del-relojero",
  "game_ref": "la-casa-del-relojero",
  "timestamp": "2026-04-06T15:39:00+02:00",
  "validate_game_output": "...",
  "verdict": "pass|pass_with_warnings|fail",
  "checks": {
    "schema_compliance": {"status": "pass|fail", "details": "string"},
    "solucionabilidad": {"status": "pass|fail", "details": "string"},
    "dead_ends": {"status": "pass|fail", "details": "string"},
    "curva_dificultad": {"status": "pass|warning|fail", "details": "string"},
    "tiempos": {"status": "pass|warning|fail", "details": "string"},
    "variedad_mecanicas": {"status": "pass|fail", "details": "string"},
    "coherencia_narrativa": {"status": "pass|fail", "details": "string"},
    "pistas_suficientes": {"status": "pass|fail", "details": "string"},
    "materiales_viables": {"status": "pass|warning|fail", "details": "string"},
    "consistencia_codigos": {"status": "pass|fail", "details": "string"},
    "densidad_progreso": {"status": "pass|fail", "details": "string"},
    "solucion_unica": {"status": "pass|fail", "details": "string"},
    "self_contained_logic": {"status": "pass|fail", "details": "string"},
    "cooperacion_real": {"status": "pass|warning", "details": "string"},
    "condiciones_fisicas": {"status": "pass|warning", "details": "string"},
    "empoderamiento_perfiles": {"status": "pass|warning", "details": "string"},
    "completitud_solucion": {"status": "pass|fail", "details": "string"},
    "design_compliance_matrix": {"status": "pass|warning|fail", "details": "string", "matrix": [{"prueba": "", "objetivo": "", "input": "", "mecanismo": "", "output": "", "conexion": "", "pista": "", "solucion": "", "status": ""}]},
    "anti_repeticiones": {"status": "pass|warning|fail", "details": "string"},
    "tres_capas_claridad": {"status": "pass|warning|fail", "details": "string"},
    "redundancia_tolerancia": {"status": "pass|warning|fail", "details": "string"},
    "mapa_emocional": {"status": "pass|warning|fail", "details": "string"},
    "recompensas_intermedias": {"status": "pass|warning|fail", "details": "string"},
    "final_memorable": {"status": "pass|warning|fail", "details": "string"},
    "legibilidad_visual": {"status": "pass|warning|fail", "details": "string"},
    "regla_oro": {"status": "pass|warning|fail", "details": "string"}
  },
  "phase_reports": {
    "difficulty_calibration": {"file": "DIFFICULTY-REPORT.json", "verdict": "pass|pass_with_adjustments|fail", "summary": "string"},
    "narrative_consistency": {"file": "NARRATIVE-CONSISTENCY-REPORT.json", "verdict": "pass|pass_with_warnings|fail", "summary": "string"},
    "playtest": {"file": "PLAYTEST-REPORT.json", "verdict": "pass|pass_with_concerns|fail", "summary": "string"},
    "regression": {"file": "REGRESSION-REPORT.json", "verdict": "pass|pass_with_concerns|fail|skip", "summary": "string"}
  },
  "warnings": ["string"],
  "issues": ["string"],
  "suggestions": ["string"]
}
```

### Campos

| Campo | Descripción |
|-------|-------------|
| `id` | `verify_{fecha}_{juego-slug}` |
| `game_ref` | ID del juego verificado |
| `timestamp` | ISO-8601 |
| `validate_game_output` | Output crudo del script de validación |
| `verdict` | Resultado global (ver reglas) |
| `checks` | Los 27 checks con status + details |
| `warnings` | Alertas no bloqueantes |
| `issues` | Problemas accionables (qué arreglar y cómo) |
| `suggestions` | Mejoras opcionales |

## Reglas

1. **Cada check** DEBE tener `status` (`pass`, `warning`, o `fail`) y `details`
2. Si **CUALQUIER check** es `"fail"` → `verdict` = `"fail"`
3. Si hay `"warning"` pero ningún `"fail"` → `verdict` = `"pass_with_warnings"`
4. Solo `"pass"` en todos → `verdict` = `"pass"`
5. Los `issues` deben ser **accionables**: describir qué hay que arreglar, no solo "está mal"
6. Los `suggestions` son mejoras opcionales (nice-to-have)
7. Los 27 checks son los obligatorios. Se pueden añadir warnings/issues adicionales si se detectan problemas no cubiertos.

## Research Frameworks

Consultar si es necesario para profundizar en algún check:

- `agents/escapeitor/research-frameworks/08-testing.md` — Checklists de QA
- `agents/escapeitor/research-frameworks/01-game-design.md` — Balance y curva de dificultad
- `agents/escapeitor/research-frameworks/09-estilo-juegos.md` — Patrones de diseño probados (equipo activo, doble descubrimiento, variedad de cierres, misterio secundario)

## Procedimiento

```
1. Leer CONCEPT.json y DESIGN.json (contexto general)
2. Ejecutar validate_game.py → schema_compliance
3. Leer todas las pruebas → solucionabilidad + dead_ends
4. Analizar dificultades → curva_dificultad
5. Sumar tiempos → tiempos
6. Contar mecánicas → variedad_mecanicas
7. Leer NARRATIVA.md + DISEÑO-JUEGO.md → coherencia_narrativa
8. Revisar pistas por prueba → pistas_suficientes
9. Cruzar materiales → materiales_viables
10. Verificar consistencia de códigos (code-box vs tipo cierre vs solución) → consistencia_codigos
11. Analizar densidad de hits por fase → densidad_progreso
12. Verificar solución única por puzzle → solucion_unica
13. Verificar lógica autocontenida → self_contained_logic
14. Verificar cooperación simultánea → cooperacion_real
15. Verificar condiciones físicas → condiciones_fisicas
16. Verificar perfiles de jugador → empoderamiento_perfiles
17. Verificar completitud de solución por tipo de cierre → completitud_solucion
18. Generar tabla de compliance por prueba → design_compliance_matrix
19. Verificar anti-repeticiones entre pruebas → anti_repeticiones
20. Generar VERIFY-REPORT.json
```

## Ejemplo de details por check

```json
{
  "schema_compliance": {
    "status": "pass",
    "details": "validate_game.py pasó sin errores. 5 pruebas validadas."
  },
  "solucionabilidad": {
    "status": "fail",
    "details": "Prueba 3 requiere conocer el código de 4 dígitos del reloj, pero ninguna prueba anterior proporciona información sobre el reloj. Gap crítico. FIX: Añadir referencia al reloj en la pista de la prueba 2."
  },
  "curva_dificultad": {
    "status": "warning",
    "details": "Salto de dificultad 4→8 entre prueba 3 y 4. Pico justificado narrativamente (revelación del antagonista) pero puede frustrar. SUGERENCIA: Añadir hint extra en prueba 3 que presagie la dificultad."
  }
}
```
