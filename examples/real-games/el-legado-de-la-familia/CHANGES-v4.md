# CHANGES v4.0 — ZERO GM + ANTI-TRAMPA

**Fecha:** 2026-05-11
**Versión:** 4.0 (major)
**Base:** v3.1 → v4.0

---

## Resumen

12 problemas críticos identificados en el review ZERO-GM-REVIEW.md. Todos corregidos aplicando las 3 Hard Rules: ZERO GM, ANTI-TRAMPA, SELF-SERVICE.

---

## Archivos Modificados

### 1. juego.json

**Cambios:**
- **Briefing:** Eliminado GM como Abogado. Ahora es un sobre lacrado en la puerta del despacho con testamento + llave + nota de marionetas. El GM solo abre la puerta al inicio.
- **Sistema de roles:** "Rotación obligatoria" → "Auto-selección". Eliminada la frase "Forzar participación de los más callados". Ahora son sugerencias impresas en cada prueba.
- **Personajes:** Eliminado "Abogado (GM)" de la lista de personajes.
- **Debriefing:** "Mensaje final del GM" → "Última carta de Elena" (impresa, leída por jugadores).
- **Presupuesto:** Actualizado a ~130€ (incremento por papel ferromagnético y cajas auto-equipo).
- **Version:** 3.1 → 4.0
- **Historial:** Añadida entrada v4.0 con descripción de todos los cambios.

### 2. prueba-001-diario-secreto.json (P1 — El Retrato de las Seis Capas)

**Cambios:**
- **Mecánica:** Acetatos → Papel ferromagnético verde + imanes ocultos en marco.
- Los 6 imanes detrás del marco forman la letra L. Al pasar el papel verde por el marco, se revela la L.
- Mantiene las 6 láminas de papel vegetal translúcido para superponer sobre el retrato.
- **Materiales:** Eliminados acetatos. Añadidos: 6 imanes neodimio, 6 hojas papel ferromagnético verde.
- **Descripción:** Actualizada para reflejar la nueva mecánica de detección magnética.
- **Instrucción del marco:** Añadida referencia al papel verde.
- **Control de movimiento:** Añadido mecanismo de pins + sticker in-game de protección narrativa.

### 3. prueba-002-cartas-desordenadas.json (P2 — El Tablero de las Presencias)

**Cambios:**
- **Candado:** 3 dígitos (315, 1.000 combinaciones) → 4 dígitos (3154, 10.000 combinaciones). No fuerza-bruteable en tiempo razonable.
- **Código:** Posiciones de los 4 hijos en orden de edad: Marcos=3, Carmen=1, Luis=5, Miguel=4 → 3154.
- **Consejo Familiar:** Antes "entregado por GM" → Ahora DENTRO de la caja de notario.
- **Plantilla de tabla:** Antes "entregar con la caja" → Ahora DENTRO de la caja.
- **Cartas familiares:** Antes "disponibles en el despacho" → Ahora DENTRO de la caja.
- **Instrucción del tablero:** Añadida frase "El código del candado: las posiciones de los cuatro hijos, en orden de edad."
- **Control de movimiento:** Eliminada "nota GM anti-monopolio". Regla impresa en la caja (self-service).

### 4. prueba-003-fotos-recuerdos.json (P3 — Las Voces que No se Muestran)

**Cambios (REDISEÑO SUSTANCIAL):**
- **ANTI-TRAMPA:** Los sellos con dígitos ahora están bajo CAPA RASPABLE PLATEADA en cada tarjeta. No se pueden ver hasta que ambos equipos confirman la pareja verbalmente y rascán.
- **Mostrar tarjetas ya NO es trampa:** La información visible (descripción sensorial) es compartible. Los números están protegidos físicamente.
- **Código:** 1987 (año obvio) → 7391 (no-obvio, no es un año ni fecha familiar).
- **Instrucción del álbum:** Rediseñada: "Los sellos plateados custodian números. NO los raspéis hasta que ambos equipos estéis de acuerdo."
- **Control de movimiento:** Rediseñado: "Mostrar las tarjetas no revela el código" — diseño que funciona con adolescentes.
- **Tarjetas Momento/Recuerdo:** Actualizadas con sellos raspables plateados y códigos actualizados.

### 5. prueba-004-linea-temporal.json (P4 — El Árbol que Faltaba)

**Cambios:**
- **ALVAR ya NO es explícito:** La tarjeta 10 ahora dice "Buscad el nombre del hombre que salvó a mi hijo en lo que Rodrigo nunca tocó" (antes decía "Buscad ALVAR").
- **Certificado de adopción:** Eliminada "ALVAR es el nombre del hombre que salvó a mi hijo" del marginal manuscrito. Ahora dice "El hombre que salvó a mi hijo le dio su nombre y su amor."
- **Fragmento de carta de Elena:** Eliminada mención directa de "Álvaro" (jugadores ya lo saben del árbol).
- **Deducción requerida:** Los jugadores deben: ver "Álvaro" en el árbol → Álvaro → ALVARO → ALVAR (primeras 5 letras).
- **Pista nivel 3:** Actualizada para guiar la deducción sin dar la respuesta directamente.

### 6. prueba-005-mensaje-dividido.json (P5 — El Mensaje Dividido)

**Cambios (REDISEÑO SUSTANCIAL):**
- **Auto-división:** Eliminado "El GM divide al grupo en dos equipos". Ahora hay DOS CAJAS separadas en lados opuestos del desván con instrucciones "Contad de 1 a N. Impares = Equipo A. Pares = Equipo B."
- **Sellos raspables:** Añadidos como confirmación de parejas (igual que P3).
- **Mostrar tarjetas permitido:** El diseño permite mostrar tarjetas porque los sellos son solo confirmación, no información esencial.
- **Tercera tabla:** "marcada por GM" → "marca de cera roja PERMANENTE (puesta antes del juego)".
- **Tijeras doradas:** Ahora dentro del sobre lacrado de P5 (antes: "entregadas por GM").
- **Pista progresiva:** Impresa dentro de cada caja (antes: "GM puede permitir una ojeada rápida").
- **Documentos:** Añadidas instrucciones de auto-equipo para cada caja.

### 7. prueba-006-cofre-legado.json (P6 — El Árbol del Reencuentro)

**Cambios:**
- **Carta de Elena:** Antes "El GM lee esta carta en voz alta" → Ahora "Un JUGADOR la lee en voz alta".
- **Instrucción final:** Añadido: "Cuando la raíz se abra, leed la carta de Elena entre todos. Un voluntario la lee en voz alta."
- **Tijeras doradas:** Vienen del sobre de P5, no entregadas por GM.
- **Números romanos desordenados:** Añadida justificación narrativa en el cartel de la raíz: "Elena numeró las letras en el orden en que quiso que sus nietos descubrieran cada valor, no en el orden de la palabra."
- **Control de movimiento:** "GM puede abrir manualmente si imanes fallan" → solo backup técnico, no intervención de juego.
- **Documentos:** Actualizados para reflejar lectura por jugador.

---

## Resumen por Hard Rule

### ZERO GM (eliminadas todas las dependencias)

| Antes (v3.1) | Después (v4.0) |
|---|---|
| GM como Abogado lee testamento | Sobre lacrado en puerta del despacho |
| Sistema de roles con "rotación obligatoria" | Auto-selección con sugerencias impresas |
| GM entrega Consejo Familiar en P2 | Dentro de la caja de notario |
| GM lee carta de despedida en P6 | Un jugador la lee en voz alta |
| GM divide equipos en P5 | Dos cajas auto-equipo (impares/pares) |
| GM reparte sobres en P5 | Cajas auto-equipo con tarjetas dentro |
| GM entrega tijeras doradas en P6 | Dentro del sobre lacrado de P5 |
| GM permite "una ojeada rápida" en P5 | Pista progresiva impresa en cajas |
| Debriefing = "Mensaje final del GM" | Impreso como "Última carta de Elena" |
| GM marca tercera tabla durante juego | Marca de cera roja PERMANENTE (pre-juego) |

### ANTI-TRAMPA (eliminadas todas las normas de honor)

| Antes (v3.1) | Después (v4.0) |
|---|---|
| P3: "No mostrar tarjetas" = norma de honor | P3: Sellos bajo capa raspable — mostrar tarjetas NO revela números |
| P3: Código 1987 (año obvio) | P3: Código 7391 (no-obvio) |
| P5: "Sin ver tarjetas del otro" = norma de honor | P5: Sellos raspables como confirmación — mostrar es válido |
| P2: Candado 3 dígitos (1.000 combos) | P2: Candado 4 dígitos (10.000 combos) + código no-obvio |
| P1: Acetatos (ya usados en otro juego) | P1: Papel ferromagnético verde + imanes en marco |
| P4: ALVAR explícito en tarjeta 10 y certificado | P4: Jugadores deducen ALVAR de "Álvaro" |

### SELF-SERVICE (todo dentro del espacio de juego)

| Elemento | Ubicación v3.1 | Ubicación v4.0 |
|---|---|---|
| Testamento + llave briefing | GM lo lee | Sobre lacrado en puerta |
| Consejo Familiar | GM lo entrega | Dentro de caja P2 |
| Plantilla de tabla | GM la entrega | Dentro de caja P2 |
| Cartas familiares | Disponibles en despacho | Dentro de caja P2 |
| Instrucción código P2 | No especificada | Impresa en tapa interior |
| División de equipos P5 | GM divide | Cajas auto-equipo |
| Pista progreso P5 | GM da "ojeada rápida" | Impresa dentro de cajas |
| Carta despedida P6 | GM la lee | Jugador lee (del sobre P5) |
| Tijeras doradas P6 | GM las entrega | Dentro del sobre P5 |
| Debriefing | Mensaje verbal del GM | Impreso como carta de Elena |

---

## Códigos Actualizados

| Prueba | Antes (v3.1) | Después (v4.0) |
|---|---|---|
| P1 | Alineación acetatos | Alineación 6 láminas + L magnética |
| P2 | 315 (3 dígitos) | 3154 (4 dígitos) |
| P3 | 1987 (año obvio) | 7391 (no-obvio) |
| P4 | ALVAR (explícito) | ALVAR (deducido de Álvaro) |
| P5 | Reconstrucción mensaje (igual) | Reconstrucción mensaje + sellos raspables |
| P6 | LEGADO (igual) | LEGADO (igual, con justificación de números romanos) |
