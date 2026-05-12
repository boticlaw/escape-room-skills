# VERIFY REPORT — Protocolo Alerta Verde v7.0

**Fecha:** 2026-04-06  
**Veredicto global:** ⚠️ **PASS_WITH_WARNINGS** (0 FAIL, 3 WARNING)

---

## Resumen por Check

| # | Check | Status | Nota |
|---|-------|--------|------|
| 1 | Schema Compliance | **SKIP** | No hay juego.json/pruebas JSON. Documento es HTML complementario, no fuente primaria del pipeline. |
| 2 | Solucionabilidad | ✅ PASS | Flow completo P1→P6, cada recompensa desbloquea la siguiente. Sin gaps. |
| 3 | Dead Ends | ✅ PASS | 3 niveles de pistas por prueba. Sin dependencias circulares. Todas conectadas al flujo. |
| 4 | Curva de Dificultad | ✅ PASS | 2→3→4→4→5→4. Progresión suave. Pico en P5 (montaje físico) justificado por ser la prueba de mayor complejidad operativa. |
| 5 | Tiempos | ✅ PASS | 6+7+7+7+10+7 = 44 min. Duración estimada ~60 min → margen de 27% (sobrado). Ninguna >20 min. |
| 6 | Variedad de Mecánicas | ✅ PASS | 6 mecánicas distintas: exploración visual, emparejamiento de texto, deducción+conexión visual, exploración UV, montaje físico, investigación de texto. Máx 1 por skill. |
| 7 | Coherencia Narrativa | ✅ PASS | Hilo conductor sólido: sabotaje ecológico de Pardo. Cada prueba avanza la historia. Tono coherente (thriller ambiental). |
| 8 | Pistas | ✅ PASS | 3 niveles por prueba, progresivas (sutil→directo→casi solución). Timing de activación adecuado (3-10 min). |
| 9 | Materiales | ✅ PASS | Presupuesto ~130€. Materiales estándar: papel, cartulina, candados, linterna UV, cables, radio FM, tablet. Checklist de impresión completo. |
| 10 | Consistencia de Códigos | ✅ PASS | Todos los códigos coinciden entre code-box, tipo de cierre y solución: 2026 (4 dígitos), 1038 (4 dígitos), 1503 (4 dígitos), UVK (3 letras), 104.5 MHz (frecuencia), AV1P (4 chars). |
| 11 | Densidad de Progreso | ⚠️ **WARNING** | P5 (montaje físico + sintonizar radio + escuchar mensaje) podría generar un tramo largo si los jugadores pierden cables o tardan en montar. Dentro de los 10 min estimados es viable, pero el montaje físico es inherentemente más lento. **Sugerencia:** Pre-colocar cables cerca del diagrama para reducir tiempo de búsqueda. |
| 12 | Solución Única | ⚠️ **WARNING** | P1: "2026" es la fecha del informe, pero podría interpretarse como el año genérico del escenario (2026). La nota "La fecha lo dice todo" ayuda, pero un equipo podría intentar "2031" (fecha de la nota de Soler). **Sugerencia:** Añadir a la nota "fecha del informe" en lugar de solo "la fecha". P4: Las pistas poéticas son elegantes pero "luz que da vida" podría interpretarse como algo distinto de SOL en contexto ecológico (ej: la linterna UV misma). Es un riesgo bajo pero real. |
| 13 | Self-Contained Logic | ✅ PASS | Toda la información necesaria está dentro de la sala. Los datos ambientales en el panel informativo son contexto decorativo, no necesarios para resolver. No se requiere conocimiento externo. |
| 14 | Cooperación Real | ⚠️ **WARNING** | Ningún puzzle requiere explícitamente 2+ jugadores simultáneos. Todos pueden ser resueltos por un solo jugador determinado (leer documentos, conectar cables, usar linterna). P5 (montaje) y P6 (búsqueda+tablet) se benefician de dividir tareas pero no lo exigen. **Sugerencia:** Añadir un puzzle donde un jugador ve información (ej: mensaje FM) y otro debe actuar en la tablet simultáneamente, o un puzzle que requiera dos personas operando interruptores a la vez en P5. |
| 15 | Condiciones Físicas | ✅ PASS | P4 (UV) requiere apagar/atenúar la luz para que las marcas UV sean visibles — está implícito pero es obvio al usar la linterna. P5 (montaje) usa cables y interruptores estándar, materiales robustos. |
| 16 | Empoderamiento de Perfiles | ✅ PASS | Buscador: P1 (exploración), P4 (UV), P6 (documentos escondidos). Analista: P2 (emparejamiento), P3 (deducción cronológica), P6 (deducción código maestro). Líder: P5 (coordinar montaje), P6 (gestionar tablet+documentos). Cronometrador: presión temporal implícita en P5/P6. Buena distribución. |

---

## Detalle de Warnings

### Warning 1: Densidad de Progreso (Check #11)
**Riesgo:** P5 puede estirarse si los jugadores no encuentran rápidamente los cables acumulados de pruebas anteriores.  
**Fix recomendado:** Colocar una "caja de cables" o bandeja cerca del diagrama de montaje en P5. El GM puede dar pista rápida si pasan 5 min sin conectar nada.

### Warning 2: Solución Única (Check #12)
**Riesgo P1:** Ambigüedad leve entre "fecha del informe" (2026) y "fecha del escenario" (2026/2031).  
**Fix:** Cambiar la nota del Post-it a: *"Los puntos rojos indican el primer sistema que falló. La fecha del informe lo dice todo."*

**Riesgo P4:** Las pistas poéticas podrían tener interpretaciones alternativas.  
**Fix:** Añadir una pista UV adicional: *"S=U, R=V, N=K"* junto a las letras del mapa para reforzar el emparejamiento sin eliminar la elegancia.

### Warning 3: Cooperación Real (Check #14)
**Riesgo:** Un solo jugador con buen ritmo podría resolver todo.  
**Fix prioritario:** Modificar P5 para que requiera que un jugador sostenga un botón/switch mientras otro sintoniza la radio. O modificar P6 para que el mensaje FM deba escucharse en tiempo real mientras otro introduce datos en la tablet (no se puede pausar/repetir).

---

## Estadísticas

- **Total checks:** 16
- **PASS:** 13
- **WARNING:** 3
- **FAIL:** 0
- **SKIP:** 1 (Schema — no aplica a HTML complementario)

---

## Conclusión

El Protocolo Alerta Verde v7.0 es un diseño sólido y bien estructurado. La progresión narrativa es coherente, la variedad de mecánicas es excelente (6 tipos distintos), los materiales son viables con presupuesto ajustado, y el sistema de pistas está bien calibrado. Los 3 warnings son mejoras accionables que elevarían el diseño de "bueno" a "excelente", pero ninguno bloquea la producción.

**Recomendación:** Aprobar para producción con los 3 fixes sugeridos como mejoras pre-lanzamiento.
