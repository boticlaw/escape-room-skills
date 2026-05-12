# Verify Report — Protocolo Alerta Verde

**Fichero:** `PROTOCOLO-ALERTA-VERDE-PRUEBAS.html` (v6.2)
**Fecha:** 2026-04-06

---

## Check 1: Consistencia de códigos por prueba

| Prueba | Header | Cierre | Solución | Mecánica | TOC | Status |
|--------|--------|--------|----------|----------|-----|--------|
| P1 — Archivo de Alertas | `2026` | — (Candado 4 dígitos) | `2026` | `2026` | `2026` | ✅ PASS |
| P2 — Frecuencias Cruzadas | `1038` | `1038` | `1038` | `1038` | `1038` | ✅ PASS |
| P3 — Tablón del Investigador | `1503` | — (Candado 4 dígitos) | `1503` | `1503` | `1503` | ✅ PASS |
| P4 — Código Oculto UV | `UVK` | — (Candado 3 letras) | `UVK` | `UVK` | `UVK` | ✅ PASS |
| P5 — La Radio de Marina | `104.5` | — (Emisor FM) | `104.5 MHz` | `104.5 MHz` | `104.5 MHz` | ✅ PASS |
| P6 — Detener el Sabotaje | `AV1P` | — (Candado 4 letras) | `AV1P` | `AV1P` | `AV1P` | ✅ PASS |

**Resultado: ✅ PASS** — Todos los códigos son consistentes en las 5 ubicaciones por prueba.

---

## Check 2: Consistencia de dificultades

| Prueba | Dificultad |
|--------|-----------|
| P1 | 2/10 |
| P2 | 3/10 |
| P3 | 4/10 |
| P4 | 4/10 |
| P5 | 5/10 |
| P6 | 4/10 |

Curva: **2 → 3 → 4 → 4 → 5 → 4**

El descenso P5(5)→P6(4) es esperado y correcto: P6 es una meta-prueba de investigación de texto (no requiere resolución de puzzles complejos, sino cruzar información). La curva es progresiva con el clímax en P5.

**Resultado: ✅ PASS**

---

## Check 3: Consistencia de tiempos

| Prueba | Duración |
|--------|----------|
| P1 | ~6 min |
| P2 | ~7 min |
| P3 | ~7 min |
| P4 | ~7 min |
| P5 | ~10 min |
| P6 | ~7 min |
| **Total** | **44 min** |

Límite: ~55 min (dejando margen para intro + final).

44 min < 55 min → Margen de 11 min para intro (~3 min) + clímax/cierre (~5 min) + transiciones (~3 min).

**Resultado: ✅ PASS**

---

## Check 4: Pistas GM

| Prueba | Niveles | Timings | N3 da solución directa? |
|--------|---------|---------|------------------------|
| P1 | 3 ✓ | 4 → 7 → 10 ✓ | ⚠️ Sí: "Probad 2026 en el candado" |
| P2 | 3 ✓ | 4 → 7 → 10 ✓ | ⚠️ Sí: indica VIDA directamente |
| P3 | 3 ✓ | 3 → 6 → 8 ✓ | ⚠️ Sí: dice "15 de marzo... ¿cómo la escribiríais en 4 dígitos?" |
| P4 | 3 ✓ | 3 → 6 → 9 ✓ | ⚠️ Sí: "Las letras son U, V y K. El código es UVK" |
| P5 | 3 ✓ | 4 → 7 → 10 ✓ | ⚠️ Sí: da la solución completa |
| P6 | 3 ✓ | 2 → 5 → 7 ✓ | ⚠️ Sí: "El código es AV1P" |

**Resultado: ⚠️ WARNING** — Los timings son progresivos en las 6 pruebas y todas tienen 3 niveles. Sin embargo, **la pista N3 da directamente la solución en las 6 pruebas**. Esto es aceptable como último recurso (pista de emergencia), pero sería mejor que N3 diera una pista casi-directa en vez de revelar el código literalmente.

**Recomendación:** En P1, P4, P5 y P6, la N3 revela el código sin que el jugador haga ningún paso mental final. Considerar reformular para que el jugador haga al menos una deducción mínima en N3.

---

## Check 5: Cross-referencias entre pruebas

### Flujo de acceso entre plantas

| Transición | Recompensa | Destino | Planta correcta? |
|-----------|-----------|---------|-----------------|
| P1 → P2 | Llave habitación P2 | P2: Planta 1 (misma sala) | ✅ |
| P2 → P3 | Llave habitación P3 | P3: Planta 2 | ✅ |
| P3 → P4 | Llave zona UV | P4: Planta 2 (misma planta) | ✅ |
| P4 → P5 | Llave Planta 3 | P5: Planta 3 | ✅ |
| P5 → P6 | Mensaje FM (acceso) | P6: Planta 3 (misma sala) | ✅ |

### Cables del emisor (P5)

P5 requiere 5 cables: `rojo + verde (P1), azul + amarillo (P2), negro (P3)`

| Fuente | Cables declarados | Cables en setup/solución | Status |
|--------|------------------|------------------------|--------|
| P1 (archivador) | rojo + verde (2) | ✅ Doc #7: "los 2 cables (rojo, verde)" | ✅ |
| P2 (caja) | azul + amarillo (2) | ✅ Solución: "2 cables (azul, amarillo)" | ✅ |
| P3 (caja) | negro (1) | ❌ **NO aparece** en setup ni solución | ❌ FAIL |

**Resultado: ❌ FAIL** — Falta el cable negro de P3. El setup de P3 dice: *"Dentro: Linterna UV + Post-it de Marina + Llave zona UV"* — no hay mención de ningún cable. La solución tampoco lo menciona. Sin embargo, P5 asume que los jugadores traen 5 cables incluyendo uno negro de P3.

**Acción requerida:** Añadir `+ Cable negro` al setup y solución de P3 (dentro de la caja con candado 1503).

---

## Check 6: Documentos in-game

| Prueba | Documentos | Todos con título+contenido+formato? | TODO/placeholder? |
|--------|-----------|-------------------------------------|-------------------|
| P1 | 7 documentos | ✅ | No |
| P2 | 2 documentos + 6 mensajes + 2 recompensas | ✅ | No |
| P3 | 1 post-it + 5 fotos/tarjetas + 1 recompensa | ✅ | No |
| P4 | 3 documentos UV + 1 recompensa | ✅ | No |
| P5 | 1 diagrama + 1 mensaje FM | ✅ | No |
| P6 | 1 sobre instrucciones + 4 docs + 2 recompensas | ✅ | No |

**Resultado: ✅ PASS** — Todos los documentos tienen título, contenido completo y formato sugerido. No hay placeholders ni TODOs.

---

## Check 7: Setup GM

| Prueba | Pasos concretos? | Materiales coinciden? |
|--------|-----------------|----------------------|
| P1 | 6 pasos numerados ✅ | ✅ (mapa, panel, post-it, informes, archivador, llave, cables) |
| P2 | 5 pasos numerados ✅ | ✅ (plan frecuencias, 6 tarjetas, hoja protocolo, caja con contenido) |
| P3 | 6 pasos numerados ✅ | ⚠️ Falta cable negro (ver Check 5) |
| P4 | 7 pasos numerados ✅ | ✅ (mapa UV, marco, vaso, linterna, candado) |
| P5 | 5 pasos numerados ✅ | ✅ (máquina, diagrama, interruptores, radio, mensaje) |
| P6 | 8 pasos numerados ✅ | ✅ (sobre, 4 docs, panel, certificados) |

**Resultado: ⚠️ WARNING** — Todos los setups tienen pasos concretos. El único problema es el cable negro faltante en P3 (ya reportado en Check 5).

---

## Resumen

| # | Check | Status |
|---|-------|--------|
| 1 | Consistencia de códigos | ✅ PASS |
| 2 | Consistencia de dificultades | ✅ PASS |
| 3 | Consistencia de tiempos | ✅ PASS |
| 4 | Pistas GM | ⚠️ WARNING (N3 da solución directa en 6/6) |
| 5 | Cross-referencias | ❌ FAIL (cable negro de P3 desaparecido) |
| 6 | Documentos in-game | ✅ PASS |
| 7 | Setup GM | ⚠️ WARNING (deriva del FAIL de Check 5) |

### Score: **5/7 PASS · 2 WARNING · 1 FAIL**

### Acción prioritaria
1. **[FAIL]** Añadir `Cable negro` al contenido de la caja de P3 (setup + solución + checklist de impresión)
2. **[WARNING]** Considerar que las pistas N3 no revelen el código literalmente (al menos en P4, P5, P6)
