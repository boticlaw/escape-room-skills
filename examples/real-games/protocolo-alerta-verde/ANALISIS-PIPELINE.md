# 📊 Análisis Pipeline — Protocolo Alerta Verde

**Fecha:** 2026-04-06  
**Analizado por:** Scout (subagente)  
**Versión del juego:** 5.0  
**Ficheros revisados:** `protocolo-alerta-verde.md`, `OVERVIEW.md`, `PROTOCOLO-ALERTA-VERDE.html`, `PROTOCOLO-ALERTA-VERDE-PRUEBAS.html`

---

## Evaluación por Criterio

### 1. Equipo activo
**⚠️ Parcial**

La mayoría de pruebas son de "lectura + deducción" que naturalmente generan cuellos de botella: un jugador lee un documento mientras los demás esperan o se dedican a buscar por la sala sin dirección clara.

- **Prueba 1:** Exploración — 2-3 jugadores pueden buscar documentos simultáneamente. Aceptable.
- **Prueba 2:** Emparejamiento de 6 tarjetas — 6 jugadores pueden leer tarjetas en paralelo. ✅ Buena.
- **Prueba 3:** Montar tablón cronológico — buena para 3-4 personas (emparejar, ordenar, leer).
- **Prueba 4:** UV — la linterna es un recurso único → 1 jugador explora, el resto mira. ❌ Cuello de botella.
- **Prueba 5:** Montaje del emisor — 1 persona conecta cables, 1 maneja la radio, el resto espera. ⚠️ Mejorable.
- **Prueba 6:** Lectura de 4 documentos — se puede paralelizar parcialmente.

**Problema principal:** Las pruebas 4 y 5 centralizan la acción en 1-2 jugadores.

---

### 2. Físico > Digital
**✅ Cumple**

El juego es 100% analógico: candados, llaves, documentos impresos, linterna UV, cables físicos, emisor FM de radio. No hay tablets, pantallas interactivas ni apps. La experiencia es táctil (polaroids, pizarra, cables de colores, interruptores). La única tecnología es la radio FM, que es un elemento físico clásico.

---

### 3. Contenedor narrativo
**⚠️ Parcial**

Los materiales están distribuidos por habitaciones con nombres temáticos (Centro de Operaciones, Laboratorio de Análisis, Sala de Control), pero no hay un **contenedor físico temático** que agrupe los materiales. Los documentos están en escritorios, archivadores y cajas genéricas. Falta un elemento icónico tipo "maleta de emergencia UPA", "carpeta confidencial sellada" o "caja fuerte del sabotaje" que dé contexto a los materiales.

El archivador con candado (P1) es el más cercano a un contenedor narrativo, pero el resto son cajas de madera genéricas.

---

### 4. Doble descubrimiento
**⚠️ Parcial**

- **Prueba 1:** 1 fase (encontrar fecha → código). ❌ Un solo paso.
- **Prueba 2:** 2 fases (emparejar frecuencias cruzadas → descubrir que VIDA es la normal). ✅ Buen doble "aha!".
- **Prueba 3:** 2 fases (emparejar+ordenar → descubrir que Pardo es el culpable + extraer código). ✅ Buen doble descubrimiento.
- **Prueba 4:** 2 fases (encontrar marcas UV → aplicar orden del marco). ✅ Correcto.
- **Prueba 5:** 2 fases (montar emisor → escuchar mensaje revelador). ✅ Buen momento.
- **Prueba 6:** 1-2 fases (cruzar pistas FM con documentos → código). La pista N2 del GM ya da la solución completa, lo que reduce el "aha!" a casi nada.

**4 de 6 pruebas** tienen doble descubrimiento. Las pruebas 1 y 6 son débiles.

---

### 5. Temática coherente
**✅ Cumple**

Todas las pruebas conectan con la narrativa ecológica: estaciones de monitoreo (AIRE, AGUA, ENERGÍA, VIDA, etc.), sabotaje ambiental, datos reales del medio ambiente (OMS, lince ibérico, renovables). Los documentos tienen logos y formatos que refuerzan el contexto (informes técnicos, recortes de prensa, correos filtrados). La temática es consistente de principio a fin.

---

### 6. Curva de dificultad
**⚠️ Parcial**

Dificultades declaradas: 2→3→4→3→5→3

El patrón esperado es 3→4→5→(pico)→4. El juego tiene:
- Inicio bajo (2/10) — demasiado fácil, funciona como tutorial
- Subida a 4 (P3) — correcto
- Baja a 3 (P4) — rompe la progresión ascendente
- Pico en 5 (P5, la radio) — correcto como momento culminante
- Cierre en 3 (P6) — demasiado fácil para el final, debería mantener tensión

La curva es **2-3-4-3-5-3** en lugar de la ideal **3-4-5-5-4-4**. El descenso después del pico (P5→P6) es demasiado brusco y la prueba final es la segunda más fácil del juego.

---

### 7. Variedad de cierres
**❌ No cumple**

| Prueba | Tipo de cierre |
|--------|---------------|
| 1 | Candado 4 dígitos |
| 2 | Candado 4 dígitos |
| 3 | Candado 4 dígitos |
| 4 | Candado 4 dígitos |
| 5 | Emisor FM (único diferente) |
| 6 | Candado 4 letras |

**4 de 6 cierres son candados de 4 dígitos.** Solo P5 (emisor FM) y P6 (4 letras) rompen la monotonía. Faltan variedad: llaves físicas, cryptex, candados de dirección, cajas con bisagras, candados de combinación de letras, etc.

---

### 8. Misterio secundario
**✅ Cumple**

Hay un hilo conductor claro: **los 5 cables del emisor** que se acumulan a lo largo de P1→P2→P3 y convergen en P5. Los cables son elementos físicos sin información (cumplen la regla de cero dependencias) pero crean un sentido de progresión: "estamos construyendo algo". Además, hay una narrativa secundaria progresiva (quién es el saboteador, qué pasó con Marina, el plan de Pardo) que se revela en P3 (giro) y se cierra en P6.

---

### 9. Momentos de energía
**⚠️ Parcial**

- **Pico 1 (min ~20):** Descubrir que Pardo es el culpable en el tablón (P3). ✅ Buen giro narrativo.
- **Pico 2 (min ~35):** Montar el emisor FM y escuchar la voz de Marina (P5). ✅ Excelente momento táctil+auditivo.
- **Pico 3 (min ~45):** El cierre final... pero P6 es tan fácil (3/10, 5 min) que el final se siente desinflado. ❌ El clímax emocional debería ser la meta-prueba, no la anterior.

El inicio (briefing) es funcional pero no memorable. Faltaría un momento "wow" de apertura (algo visual, sonoro o físico que enganche desde el minuto 0).

**Tiene 2 picos sólidos (P3, P5) pero el final es anticlimático.**

---

### 10. Cartas de navegación
**⚠️ Parcial**

No hay "cartas de navegación" explícitas. La progresión es lineal (P1→P2→P3→P4→P5→P6) y cada recompensa es una llave a la siguiente habitación, lo que guía implícitamente. Pero no hay un elemento visual tipo "mapa del progreso" o "checklist" que muestre a los jugadores cuántas pruebas faltan o por dónde van.

El **diagrama parcial de 5 colores** (recompensa P2) funciona como pista de que se están construyendo algo, pero no como navegación.

---

### 11. Pistas GM
**✅ Cumple**

Cada prueba tiene exactamente 3 niveles progresivos:
- N1: Dirección general (~3-4 min)
- N2: Acción específica (~6-7 min)
- N3: Casi solución (~8-10 min)

Los timings son realistas y están bien calibrados para el público objetivo (12-18 años). Hay un protocolo de emergencia para el min 45 (dar códigos directamente). El sistema de eventos temporados (min 15, 30, 40, 45) añade tensión ambiental.

**Pequeño problema:** La pista N2 de P6 ya revela la solución completa ("A-V-1-P"), lo que salta de "ayuda" a "resolución directa". Debería dar las 4 respuestas sin armarlas.

---

### 12. Solucionabilidad
**✅ Cumple**

- Cada prueba es autocontenida en información (regla explícita del diseño).
- No hay dependencias cruzadas entre pruebas (salvo los cables, que son elementos físicos sin información).
- Los documentos están bien descritos y los textos son claros.
- El GM tiene repuestos de cables por si se pierden.
- Los códigos son deducibles a partir de la información disponible.

**Riesgo menor:** Si los jugadores pierden algún cable en las transiciones entre plantas, la P5 podría bloquearse. El documento contempla dar repuestos, pero no está automatizado.

---

## Resumen de Scores

| # | Criterio | Valoración | Score (1-5) |
|---|----------|-----------|-------------|
| 1 | Equipo activo | ⚠️ Parcial | 3/5 |
| 2 | Físico > Digital | ✅ Cumple | 5/5 |
| 3 | Contenedor narrativo | ⚠️ Parcial | 2/5 |
| 4 | Doble descubrimiento | ⚠️ Parcial | 3/5 |
| 5 | Temática coherente | ✅ Cumple | 5/5 |
| 6 | Curva de dificultad | ⚠️ Parcial | 3/5 |
| 7 | Variedad de cierres | ❌ No cumple | 2/5 |
| 8 | Misterio secundario | ✅ Cumple | 5/5 |
| 9 | Momentos de energía | ⚠️ Parcial | 3/5 |
| 10 | Cartas de navegación | ⚠️ Parcial | 2/5 |
| 11 | Pistas GM | ✅ Cumple | 5/5 |
| 12 | Solucionabilidad | ✅ Cumple | 5/5 |
| | **TOTAL** | | **43/60 (72%)** |

**Clasificación:** Juego funcional con fortalezas claras (temática, solucionabilidad, pistas GM) pero con áreas de mejora significativas (variedad de cierres, curva de dificultad, contenedor narrativo).

---

## Mejoras Sugeridas (Priorizadas)

### 🔴 Alta prioridad

1. **Diversificar los cierres.** Actualmente 4/6 son candados de 4 dígitos. Sustituir al menos 2 por:
   - P1: Cerradura con llave (la llave está dentro de un sobre sellado)
   - P3: Cryptex o candado de letras
   - P4: Candado de dirección/combinación diferente
   - Mantener solo 1-2 candados de 4 dígitos en todo el juego

2. **Aumentar la dificultad de la prueba final (P6).** Es la meta-prueba y tiene dificultad 3/10. Debería ser al menos 4/10. Opciones:
   - No incluir el sobre "MÁXIMA SEGURIDAD" con las 4 preguntas explícitas — que los jugadores deduzcan las preguntas a partir del mensaje FM
   - Esconder los documentos más (Doc 4 ya está escondido; hacer lo mismo con Doc 2 y Doc 3)
   - Añadir un paso extra: después de formar AV1P, necesiten una llave física para activar el panel

3. **Corregir la curva de dificultad.** Subir P1 a 3/10 y P4 a 4/10 para lograr 3→3→4→4→5→4.

### 🟡 Media prioridad

4. **Añadir contenedor narrativo.** Introducir un elemento icónico:
   - Maleta de emergencia UPA (contiene los primeros materiales)
   - Carpeta confidencial sellada "PROTOCOLO ALERTA VERDE" (envuelve los documentos clave)
   - Caja fuerte/buzón de emergencia en la Sala de Control

5. **Mejorar el "doble descubrimiento" en P1.** Actualmente es "leer fecha → código". Añadir una capa:
   - El mapa tiene 3 puntos de colores, pero el informe está mezclado con otros documentos que NO tienen fecha relevante
   - Los jugadores primero deben identificar QUÉ documento es relevante (primer "aha!") y luego extraer la fecha (segundo "aha!")

6. **Hacer P4 más paralela.** La linterna UV crea cuello de botella. Opciones:
   - Añadir una segunda linterna UV
   - Dividir la zona UV en 2 áreas que requieren exploración simultánea
   - Mientras 1-2 jugadores usan UV, otros resuelven un mini-puzzle complementario

### 🟢 Baja prioridad

7. **Añadir un momento de apertura memorable.** Sugerencias:
   - Alarma sonora al entrar + luces intermitentes
   - Video breve (30 seg) del "noticiario" sobre la crisis
   - Mensaje de radio del GM en rol de operador UPA

8. **Añadir carta de navegación visual.** Un mapa del edificio con las 3 plantas donde los jugadores marcan su progreso (pegatinas, stamps). Refuerza la sensación de avance.

9. **Revisar la pista N2 de P6.** Actualmente da la solución completa. Cambiar a: "Cada pista del mensaje de Marina corresponde a un documento diferente de esta sala. El primero habla del aire, el segundo de la estación que funciona bien..."

---

*Análisis generado automáticamente por Scout — Subagente de análisis de escape rooms*
