---
name: prueba-tablet-cooperativo
description: Skill para crear pruebas de tablet con mecánicas cooperativas sincronizadas. Usar cuando se necesite (1) diseñar un juego donde múltiples jugadores interactúen simultáneamente con una tablet, (2) crear desafíos de sincronización, ritmo o coordinación grupal, (3) recompensar con códigos al completar objetivos cooperativos, (4) implementar minijuegos tipo Simon Dice, ritmo cardíaco, o control multidireccional compartido.
---

# Prueba Tablet Cooperativo

Skill para el diseño, validación y adaptación de pruebas cooperativas con tablet/móviles donde múltiples jugadores deben sincronizar sus acciones para completar el desafío.

**Compatibilidad:**
- **Hall Escape:** Todos los jugadores comparten UNA tablet central (multitouch en pantalla compartida)
- **Street Escape:** Cada jugador usa SU PROPIO móvil (sincronización vía servidor en tiempo real)

---

## Cuando Usar Este Tipo de Prueba

Usa este skill cuando:

- [ ] **Trigger 1:** El usuario busca una prueba en tablet que requiera cooperación entre 2+ jugadores
- [ ] **Trigger 2:** Se necesita un minijuego de sincronización, ritmo o coordinación grupal
- [ ] **Trigger 3:** El objetivo es que todos los jugadores participen simultáneamente con roles o acciones diferentes
- [ ] **Trigger 4:** Se quiere recompensar con un código al completar un objetivo cooperativo

**Ejemplos de prompts que activan este skill:**
- "Quiero una prueba en tablet donde varios jugadores tengan que sincronizarse"
- "Necesito un juego de ritmo donde todos pulsen al mismo tiempo"
- "Cómo hacer un minijuego cooperativo tipo Simon Dice"
- "Prueba donde cada jugador tenga un botón diferente y tengan que coordinarse"
- "Juego de tablet donde unos mueven arriba, otros abajo, y deben cooperar"
- "Minijuego de latidos del corazón que requiera sincronización grupal"

---

## Cuando NO Usarlo (Anti-Patrones)

**NO uses este skill cuando:**

### Anti-Patrón 1: Solo Un Jugador
- **Por qué falla:** Este skill está diseñado específicamente para cooperación múltiple. Si solo hay un jugador, pierde la esencia sincronizada.
- **Mejor alternativa:** Usar `prueba-digital-interfaz` con desafíos individuales o `prueba-codigo-numerico`

### Anti-Patrón 2: Turnos Secuenciales
- **Por qué falla:** Si los jugadores actúan por turnos uno tras otro, no hay sincronización real ni cooperación simultánea.
- **Mejor alternativa:** Usar `prueba-logica-secuencial` o `prueba-turnos-cooperativo` (si existiera)

### Anti-Patrón 3: Sin Feedback Inmediato
- **Por qué falla:** Los juegos cooperativos en tablet requieren feedback visual/auditivo inmediato para que los jugadores se sincronicen. Sin feedback, la coordinación es imposible.
- **Mejor alternativa:** Usar `prueba-puzzle-fisico` con componentes tangibles

### Anti-Patrón 4: Competitivo en Lugar de Cooperativo
- **Por qué falla:** Si los jugadores compiten entre sí (uno contra otro), no es cooperativo sino competitivo.
- **Mejor alternativa:** Usar `prueba-competitiva-digital` o minijuegos tipo "1 vs 1"

**Regla general:** Si solo hay 1 jugador O actúan por turnos O no hay feedback sincronizado O es competitivo, entonces este tipo NO es adecuado.

---

## Variables de Diseño

### Variables Principales

| Variable | Tipo | Rango | Default | Descripción |
|----------|------|-------|---------|-------------|
| `tipo_juego` | string | "ritmo_cardiaco" \| "simon_dice" \| "control_cooperativo" \| "sincronizacion_botones" | "ritmo_cardiaco" | Tipo de mecánica cooperativa |
| `numero_jugadores` | number | 2-6 | 3 | Cantidad de jugadores que participan simultáneamente |
| `duracion_juego_segundos` | number | 30-300 | 60 | Tiempo total del minijuego en segundos |
| `modo_juego` | string | "tablet_compartida" \| "moviles_individuales" | "tablet_compartida" | Hall escape = tablet compartida, Street escape = cada uno en su móvil |
| `dispositivo_activacion` | string | "pantalla_codigo" | "pantalla_codigo" | El código siempre se muestra en pantalla (tablet o móvil de cada jugador) |

**Variables específicas por tipo de juego:**

*Si `tipo_juego="ritmo_cardiaco"`:*
| Variable | Tipo | Rango | Default | Descripción |
|----------|------|-------|---------|-------------|
| `ritmo_bpm` | number | 40-120 | 60 | Latidos por minuto objetivo |
| `tolerancia_ms` | number | 50-200 | 100 | Margen de error en milisegundos para considerar sincronizado |
| `aciertos_necesarios` | number | 5-20 | 10 | Número de latidos sincronizados correctos necesarios |
| `feedback_visual` | string | "corazon" \| "onda" \| "barra" | "corazon" | Tipo de animación de feedback |

*Si `tipo_juego="simon_dice"`:*
| Variable | Tipo | Rango | Default | Descripción |
|----------|------|-------|---------|-------------|
| `secuencia_inicial` | number | 3-5 | 3 | Longitud inicial de la secuencia |
| `secuencia_maxima` | number | 6-12 | 8 | Longitud máxima para completar la prueba |
| `colores_botones` | array | 2-6 colores | ["rojo","azul","verde","amarillo"] | Colores de los botones |
| `tiempo_entre_secuencias` | number | 500-1500 | 1000 | Milisegundos entre cada elemento de la secuencia |
| `tiempo_respuesta` | number | 3000-8000 | 5000 | Milisegundos máximos para responder cada elemento |

*Si `tipo_juego="control_cooperativo"`:*
| Variable | Tipo | Rango | Default | Descripción |
|----------|------|-------|---------|-------------|
| `objeto_controlar` | string | "esfera" \| "personaje" \| "objeto" | "esfera" | Qué elemento se mueve en pantalla |
| `funciones_jugadores` | array | ["arriba","abajo","izquierda","derecha","coger","soltar"] | ["arriba","abajo","izquierda"] | Funciones asignadas a cada jugador |
| `objetivo` | string | "llegar_punto" \| "recoger_objetos" \| "evitar_obstaculos" | "llegar_punto" | Meta del minijuego |
| `nivel_dificultad` | number | 1-5 | 3 | Complejidad del recorrido (obstáculos, velocidad) |

*Si `tipo_juego="sincronizacion_botones"`:*
| Variable | Tipo | Rango | Default | Descripción |
|----------|------|-------|---------|-------------|
| `patrones` | array | lista de patrones | ver descripción | Secuencias de botones que deben pulsarse simultáneamente |
| `patrones_necesarios` | number | 3-8 | 5 | Cuántos patrones deben completarse |
| `tiempo_sincronizacion` | number | 500-2000 | 1000 | Ventana de tiempo en ms para considerar simultáneo |

**Variables de recompensa (código mostrado en pantalla):**
| Variable | Tipo | Rango | Default | Descripción |
|----------|------|-------|---------|-------------|
| `codigo_recompensa` | string | 4-8 caracteres | "4284" | Código mostrado en pantalla al completar. Puede ser numérico (ej: "8426"), alfabético (ej: "VITAL") o mixto (ej: "NAV-47") |
| `mensaje_exito` | string | 1-100 caracteres | "¡Sincronización perfecta!" | Mensaje mostrado junto al código |

**Nota sobre el código:**
- **Hall Escape:** El código aparece en la pantalla compartida de la tablet
- **Street Escape:** El código aparece simultáneamente en el móvil de cada jugador

### Variables Opcionales

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `intentos_maximos` | number | Veces que pueden fallar antes de reiniciar (default: 3) |
| `tiempo_recuperacion` | number | Segundos de descanso entre intentos (default: 10) |
| `musica_fondo` | boolean | Si suena música de ambiente durante el juego (default: true) |
| `efectos_sonido` | boolean | Feedback sonoro para aciertos/errores (default: true) |
| `vibracion` | boolean | Vibración en tablet para feedback (default: true) |
| `mostrar_progreso` | boolean | Barra de progreso visible (default: true) |

### Combinaciones Válidas

**Para Hall Escape (tablet compartida):**
- **Configuración Básica:** `modo_juego="tablet_compartida"`, `tipo_juego="ritmo_cardiaco"`, `numero_jugadores=2`, `ritmo_bpm=60`
- **Configuración Estándar:** `modo_juego="tablet_compartida"`, `tipo_juego="simon_dice"`, `numero_jugadores=3`, `secuencia_maxima=8`
- **Configuración Avanzada:** `modo_juego="tablet_compartida"`, `tipo_juego="control_cooperativo"`, `numero_jugadores=4`, `nivel_dificultad=4`

**Para Street Escape (móviles individuales):**
- **Configuración Básica:** `modo_juego="moviles_individuales"`, `tipo_juego="ritmo_cardiaco"`, `numero_jugadores=3`, `ritmo_bpm=60`
- **Configuración Estándar:** `modo_juego="moviles_individuales"`, `tipo_juego="simon_dice"`, `numero_jugadores=4`, `secuencia_maxima=8`
- **Configuración Avanzada:** `modo_juego="moviles_individuales"`, `tipo_juego="control_cooperativo"`, `numero_jugadores=5`, `nivel_dificultad=4`

### Combinaciones Prohibidas/Peligrosas

- [X] NO combines `numero_jugadores < 2` (no es cooperativo)
- [X] NO combines `tipo_juego="control_cooperativo"` con `numero_jugadores=2` Y menos de 2 funciones (falta control)
- [WARN] Cuidado con `ritmo_bpm > 100` si hay jugadores novatos (frustración por dificultad)
- [WARN] Cuidado con `tolerancia_ms < 50` (casi imposible sincronizar)
- [WARN] Cuidado con `tiempo_respuesta < 3000` en Simon Dice (muy rápido)

---

## Errores Comunes de Jugadores

### Error 1: Desincronización por Ansiedad
- **Síntoma:** Los jugadores pulsan nerviosamente sin prestar atención al ritmo/feedback visual
- **Causa:** Presión del tiempo o competición interna por ser "el mejor"
- **Prevención:** Enfatizar que es cooperativo, no competitivo. Usar mensajes calmados.
- **Intervención:** A los 3 minutos: "Respirad profundo y mirad el ritmo visual juntos"

### Error 2: No Escuchar/Ver a los Compañeros
- **Síntoma:** Cada jugador mira solo su zona de la pantalla sin prestar atención al resto
- **Causa:** Falta de comunicación verbal y conciencia grupal
- **Prevención:** Diseñar mecánicas que obliguen a mirar toda la pantalla (ej: objeto central)
- **Intervención:** "Mirad el centro de la pantalla juntos, no solo vuestros botones"

### Error 3: Pulsa Antes de Tiempo (Ritmo)
- **Síntoma:** En juegos de ritmo, pulsan antes de que coincida el momento exacto
- **Causa:** Ansiedad por anticiparse o no entender el feedback visual
- **Prevención:** Feedback visual claro con "ventana de éxito" visible (zona verde)
- **Intervención:** "Esperad a que el círculo esté completamente verde antes de pulsar"

### Error 4: Desorden en Secuencias (Simon Dice)
- **Síntoma:** En Simon Dice, los jugadores olvidan quién tiene qué color o el orden
- **Causa:** Sobrecarga cognitiva o falta de asignación clara de roles
- **Prevención:** Mostrar claramente qué jugador controla qué color (icono + nombre)
- **Intervención:** "Recordad: Ana=Rojo, Luis=Azul, Marta=Verde"

### Error 5: Comandos Contradictorios (Control Cooperativo)
- **Síntoma:** En control cooperativo, unos dicen "izquierda" y otros "derecha" simultáneamente
- **Causa:** Falta de coordinación verbal y liderazgo temporal
- **Prevención:** Establecer "turnos de comando" rotativos o un coordinador designado
- **Intervención:** "Designad a una persona que diga los movimientos y el resto obedece"

**Señales de alarma (el grupo está atascado):**
- [ ] Llevan 3+ intentos fallidos seguidos
- [ ] Discuten o se frustran entre ellos
- [ ] Un jugador domina y los demás se desaniman
- [ ] No se comunican verbalmente (silencio total)
- [ ] Llevan >8 minutos sin progreso

**Tiempo máximo recomendado antes de intervenir:** 5 minutos (3 si son novatos, 8 si son expertos)

---

## Escalado de Dificultad

### Versión Fácil (Nivel 1-3)
- **Características:**
  - 2 jugadores, ritmo lento (60 BPM)
  - Feedback muy claro (colores brillantes, sonidos distintivos)
  - Secuencias cortas (3 elementos en Simon Dice)
  - Objetivo simple sin obstáculos
  - Pocos intentos necesarios (5 aciertos)
- **Tiempo estimado:** 5-8 minutos
- **Público objetivo:** Niños 10-12 años, grupos novatos

### Versión Estándar (Nivel 4-6)
- **Características:**
  - 3 jugadores, ritmo medio (70-80 BPM)
  - Feedback claro pero más sutil
  - Secuencias medias (5-6 elementos)
  - Algunos obstáculos o giros
  - Aciertos moderados (8-10)
- **Tiempo estimado:** 10-15 minutos
- **Público objetivo:** Público general, adultos

### Versión Difícil (Nivel 7-9)
- **Características:**
  - 4-5 jugadores, ritmo rápido (90-100 BPM)
  - Feedback mínimo (deben confiar en coordinación)
  - Secuencias largas (7-8 elementos)
  - Obstáculos móviles o temporizados
  - Muchos aciertos necesarios (15-20)
- **Tiempo estimado:** 15-20 minutos
- **Público objetivo:** Expertos, entusiastas

### Versión Extrema (Nivel 10)
- **Características:**
  - 5-6 jugadores, ritmo muy rápido (110+ BPM)
  - Sin feedback visual (solo auditivo o táctil)
  - Secuencias muy largas (10+ elementos)
  - Múltiples obstáculos simultáneos
  - Combinación de mecánicas (ritmo + control + secuencias)
- **Tiempo estimado:** 20-25 minutos
- **Público objetivo:** Competencias, speedruns

**Matriz de escalado:**

| Aspecto | Fácil | Estándar | Difícil |
|---------|-------|----------|---------|
| Jugadores | 2 | 3 | 4-5 |
| Ritmo (BPM) | 60 | 75 | 90-100 |
| Secuencia (Simon) | 3 | 5-6 | 7-8 |
| Tolerancia (ms) | 150 | 100 | 50-75 |
| Aciertos necesarios | 5 | 8-10 | 15-20 |
| Feedback | Alto | Medio | Mínimo |
| Tiempo | 5-8min | 10-15min | 15-20min |

---

## Adaptaciones

### Por Edad

**Niños (6-10 años):**
- Simplificar: Máximo 2 jugadores, ritmo lento (50-60 BPM)
- Evitar: Tolerancias muy estrictas, secuencias largas
- Añadir: Animaciones divertidas, personajes, música animada
- Considerar: Adulto acompañante como "ayudante"

**Adolescentes (11-17 años):**
- Mantener: Versión estándar completa
- Permitir: Mayor complejidad y ritmos más rápidos
- Añadir: Elementos competitivos internos ("quién acierta más")

**Adultos (18+):**
- Complejidad completa
- Considerar: Mecánicas que requieran comunicación estratégica
- Permitir: Ritmos rápidos y alta dificultad

**Grupos mixtos:**
- Estrategia: Emparejar adultos con niños en parejas cooperativas
- Elementos cooperativos: Los adultos guían a los niños verbalmente

### Por Espacio

**Hall Escape (sala física):**
- **Modalidad:** Todos los jugadores comparten UNA tablet central
- Ventajas: Tablet puede estar fija en soporte o pedestal, feedback visual compartido
- Limitaciones: Todos deben ver la pantalla (tamaño mínimo 10"), alcance táctil
- Adaptaciones: Pantalla grande o proyector, sonido ambiente, pedestal central
- **Mecánica:** Multitouch en una pantalla, cada jugador toca su zona

**Street Escape (exterior/móvil):**
- **Modalidad:** Cada jugador usa SU PROPIO móvil/tablet personal
- Ventajas: No dependen de un dispositivo compartido, juegan desde su ubicación
- Limitaciones: Todos necesitan conexión a internet, misma app/URL instalada
- Adaptaciones: Sincronización vía servidor web, notificaciones push, comunicación por WhatsApp/calls
- **Mecánica:** Cada uno ve la misma interfaz en su pantalla y sus acciones se sincronizan en tiempo real vía servidor
- **Requisito técnico:** Backend que coordine el estado del juego entre todos los dispositivos

**Juego de Investigación (no presencial):**
- NO aplica directamente - requiere presencia física para sincronización
- Alternativa: Versión asincrónica con `prueba-digital-interfaz`

**Digital/Virtual:**
- Aplica parcialmente - cada jugador en su dispositivo
- Adaptaciones: Sincronización vía servidor, videochat para comunicación

### Por Duración

**Quick (5-10 minutos):**
- Elementos a eliminar: Secuencias largas, múltiples fases
- Foco: Un solo objetivo simple (5-8 aciertos de ritmo)
- Configuración: `duracion_juego_segundos=30`, `aciertos_necesarios=5`

**Standard (15-30 minutos):**
- Versión completa estándar
- Puede incluir múltiples fases o niveles

**Epic (45+ minutos):**
- Elementos a añadir: Múltiples minijuegos consecutivos
- Sub-etapas:
  1. Calentamiento con ritmo lento
  2. Simon Dice cooperativo
  3. Control cooperativo complejo
  4. Desafío final sincronizado

---

## Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-busqueda-objetos`**
- **Sinergia:** Los jugadores deben encontrar primero la tablet o instrucciones
- **Ejemplo compuesto:** Buscan una tablet escondida. Una vez encontrada, deben completar el minijuego cooperativo.
- **Frecuencia:** Muy común

**2. `prueba-cifrado`**
- **Sinergia:** El código de recompensa necesita ser descifrado o interpretado
- **Ejemplo compuesto:** La tablet muestra "CÓDIGO: XYZ789", pero deben descifrarlo usando una clave encontrada previamente.
- **Frecuencia:** Común

**3. `prueba-logica-secuencial`**
- **Sinergia:** La secuencia de Simon Dice sigue una lógica deducible
- **Ejemplo compuesto:** Descubren que la secuencia de colores sigue el orden del arcoíris.
- **Frecuencia:** Ocasional

**4. `prueba-comunicacion-restringida`**
- **Sinergia:** Añade dificultad prohibiendo ciertos tipos de comunicación
- **Ejemplo compuesto:** Deben completar el minijuego de ritmo sin hablar, solo con señas.
- **Frecuencia:** Ocasional

### Skills Alternativos (Sustitución)

**En lugar de este skill, considera:**

- **`prueba-panel-electrico`** → Si se prefiere componente físico tangible
- **`prueba-digital-interfaz`** → Si es un solo jugador o no requiere sincronización
- **`prueba-mecanismo-fisico`** → Si se quiere manipulación física pura

### Skills Incompatibles (No Usar Juntos)

**Evita combinar con:**

- [X] `prueba-turnos-individuales` → Conflicto: Requiere acción simultánea vs. turnos
- [X] `prueba-competitiva` → Conflicto: Cooperativo vs. competitivo

### Ejemplos de Pruebas Compuestas

**Ejemplo 1: "El Ritmo del Corazón"**
- **Skills usados:** `prueba-tablet-cooperativo` + `prueba-cifrado`
- **Descripción:**
  1. Encuentran una tablet con un corazón pulsante en pantalla
  2. Deben sincronizarse para pulsar al ritmo del corazón (60 BPM)
  3. Necesitan 10 latidos perfectos sincronizados
  4. Al completar, la tablet muestra un código cifrado
  5. Usan una clave encontrada previamente para descifrarlo
- **Por qué funciona:** Combina sincronización física (ritmo) con procesamiento mental (cifrado).

**Ejemplo 2: "Simon Dice Asamblea"**
- **Skills usados:** `prueba-tablet-cooperativo`
- **Configuración:**
  ```json
  {
    "tipo_juego": "simon_dice",
    "numero_jugadores": 4,
    "secuencia_inicial": 3,
    "secuencia_maxima": 8,
    "colores_botones": ["rojo","azul","verde","amarillo"],
    "dispositivo_activacion": "pantalla_codigo",
    "codigo_recompensa": "SYNCHRO"
  }
  ```
- **Descripción:** Tablet con 4 zonas de colores. Cada jugador controla un color. Deben repetir secuencias cada vez más largas. Al completar la secuencia de 8 elementos, aparece el código "SYNCHRO".
- **Por qué funciona:** Requiere memoria grupal y coordinación perfecta.

**Ejemplo 3: "Nave Espacial Cooperativa"**
- **Skills usados:** `prueba-tablet-cooperativo` + `prueba-busqueda-objetos`
- **Configuración:**
  ```json
  {
    "tipo_juego": "control_cooperativo",
    "modo_juego": "tablet_compartida",
    "numero_jugadores": 3,
    "objeto_controlar": "nave",
    "funciones_jugadores": ["arriba","izquierda","derecha"],
    "objetivo": "llegar_punto",
    "nivel_dificultad": 4,
    "dispositivo_activacion": "pantalla_codigo",
    "codigo_recompensa": "4529",
    "mensaje_exito": "¡Nave aterrizada! Coordenadas correctas: Sector 7G."
  }
  ```
- **Descripción:** Una nave espacial en pantalla. Un jugador controla subir, otro izquierda, otro derecha. Deben navegar por un campo de asteroides hasta la base. Al llegar, la tablet muestra el código "4529".
- **Por qué funciona:** Cada jugador tiene un rol único e indispensable. Requiere comunicación constante.

---

## Ejemplos Concretos

### Ejemplo 1: Ritmo Cardíaco - "Corazón Sincronizado"

**Contexto:** Escape room tipo laboratorio médico

**Configuración:**
```json
{
  "tipo_juego": "ritmo_cardiaco",
  "numero_jugadores": 3,
  "ritmo_bpm": 65,
  "tolerancia_ms": 120,
  "aciertos_necesarios": 10,
  "feedback_visual": "corazon",
  "duracion_juego_segundos": 90,
  "dispositivo_activacion": "pantalla_codigo",
  "codigo_recompensa": "VITAL",
  "mensaje_exito": "¡Ritmo establecido! Acceso concedido.",
  "intentos_maximos": 3,
  "efectos_sonido": true,
  "mostrar_progreso": true
}
```

**Flujo de juego:**
1. Los jugadores encuentran una tablet en la "sala de control cardiaco"
2. En pantalla aparece un corazón que late a 65 BPM
3. Cada jugador tiene un área de la pantalla para pulsar
4. Deben pulsar sincronizados cuando el corazón se ilumina completamente
5. El sistema muestra una barra de progreso con los aciertos
6. Al llegar a 10 latidos sincronizados, aparece el código "VITAL"
7. Si fallan 3 veces, se reinicia la barra de progreso

**Pistas progresivas:**
- Pista 1: "Escuchad el ritmo juntos antes de pulsar"
- Pista 2: "Mirad cuando el corazón está completamente rojo"
- Pista 3: "Los tres debéis pulsar exactamente al mismo tiempo"

---

### Ejemplo 2: Control Cooperativo - "Puente Levadizo"

**Contexto:** Escape room tipo castillo medieval

**Configuración:**
```json
{
  "tipo_juego": "control_cooperativo",
  "numero_jugadores": 4,
  "objeto_controlar": "personaje",
  "funciones_jugadores": ["arriba","abajo","izquierda","derecha"],
  "objetivo": "llegar_punto",
  "nivel_dificultad": 3,
  "duracion_juego_segundos": 120,
  "dispositivo_activacion": "pantalla_codigo",
  "codigo_recompensa": "BRIDGE",
  "mensaje_exito": "¡El caballero ha cruzado!",
  "intentos_maximos": 5,
  "mostrar_progreso": true
}
```

**Flujo de juego:**
1. Un caballero debe cruzar un puente lleno de trampas en la tablet
2. Cada jugador controla una dirección:
   - Jugador 1: Arriba (salta)
   - Jugador 2: Abajo (agacharse)
   - Jugador 3: Izquierda
   - Jugador 4: Derecha
3. Deben guiar al caballero desde el inicio hasta la bandera final
4. Hay pinchos que requieren saltar, murciélagos que requieren agacharse
5. Si toca una trampa, vuelve al inicio (pero no reinicia intentos completos)
6. Al llegar a la meta, aparece el código "BRIDGE"

**Pistas progresivas:**
- Pista 1: "Asignad quién va a decir cada dirección"
- Pista 2: "Mirad qué trampas vienen y decidid juntos"
- Pista 3: "Salto = pinchos, Agacharse = murciélagos"

---

### Ejemplo 3: Simon Dice - "Secuencia de Colores"

**Contexto:** Escape room tipo sala de control alienígena

**Configuración:**
```json
{
  "tipo_juego": "simon_dice",
  "modo_juego": "tablet_compartida",
  "numero_jugadores": 3,
  "secuencia_inicial": 3,
  "secuencia_maxima": 7,
  "colores_botones": ["rojo","azul","verde"],
  "tiempo_entre_secuencias": 1200,
  "tiempo_respuesta": 6000,
  "dispositivo_activacion": "pantalla_codigo",
  "codigo_recompensa": "4284",
  "mensaje_exito": "¡Secuencia completada! Protocolo de desbloqueo activado.",
  "intentos_maximos": 3,
  "efectos_sonido": true
}
```

**Flujo de juego:**
1. Tablet con 3 zonas de colores (rojo, azul, verde)
2. Cada jugador está asignado a un color específico
3. La tablet reproduce una secuencia (ej: rojo-rojo-azul-verde)
4. Los jugadores deben pulsar sus colores en ese orden
5. Cada ronda añade un elemento más a la secuencia
6. Deben completar hasta la secuencia de 7 elementos
7. Al lograrlo, la tablet muestra el código "4284" en pantalla

**Pistas progresivas:**
- Pista 1: "Cada uno se encarga de un color: repartidlos"
- Pista 2: "Memorizad la secuencia juntos, repetidla en voz alta"
- Pista 3: "Decid quién empieza y seguid el orden uno por uno"

---

## Notas de Implementación Técnica

### Modo Hall Escape (Tablet Compartida)

**Hardware Recomendado:**
- **Tablet:** Tamaño mínimo 10 pulgadas, Full HD (1920x1080), procesador medio-alto, batería 4+ horas
- **Accesorios:** Soporte/pedestal, protector anti-reflejos, altavoces externos opcionales

**Desarrollo:**
- **Frameworks:** Unity, Godot, o web app con canvas
- **Input:** Multitouch (varios dedos simultáneos en pantalla)
- **Audio:** Web Audio API o sistema nativo
- **Requisitos:** Soporte multitáctil, latencia <50ms, 60 FPS, sonido sincronizado

### Modo Street Escape (Móviles Individuales)

**Hardware:**
- **Dispositivos:** Smartphone de cada jugador (Android/iOS)
- **Requisitos:** Conexión a internet (4G/5G/WiFi), navegador moderno o app instalada
- **Batería:** Recomendable power bank para juegos largos

**Desarrollo:**
- **Backend:** Servidor WebSocket para sincronización en tiempo real (ej: Socket.io, Firebase Realtime)
- **Frontend:** Web app responsive o app nativa
- **Sincronización:** 
  - Todos los dispositivos conectados a sala/juego compartido
  - Estado del juego centralizado en servidor
  - Latencia objetivo <100ms entre dispositivos
  - Mecánica: Cada jugador envía sus inputs al servidor, el servidor broadcastea el estado actualizado a todos
- **Reconexión:** Manejo de desconexiones/reconexiones automáticas
- **Notificaciones:** Push opcional para coordinación entre jugadores

### Validación de Estado

El sistema debe detectar:
- **Hall Escape:** Touch en zonas de pantalla, sincronización táctil
- **Street Escape:** Conexión de cada dispositivo, recepción de inputs vía red, broadcast de estado
- Sincronización exacta (dentro de la ventana de tolerancia)
- Secuencias correctas en orden
- Progreso hacia el objetivo (aciertos/puntuación)
- Activar recompensa solo al completar el objetivo

---

## Notas para el Agente Usuario

**Antes de usar este skill:**

*Para Hall Escape (tablet compartida):*
1. Asegurar disponibilidad de tablet funcional y cargada
2. Verificar que todos los jugadores pueden ver la pantalla y alcanzarla cómodamente

*Para Street Escape (móviles individuales):*
1. Asegurar que todos los jugadores tienen smartphone con conexión a internet
2. Verificar que la app/URL del juego está accesible
3. Confirmar que el backend/servidor está funcionando
4. Tener un plan B si alguien tiene problemas de conexión

*Para ambos:*
5. Definir claramente el tipo de minijuego y número de jugadores
6. Preparar instrucciones claras sobre quién hace qué

**Mientras usas este skill:**
1. Documentar la configuración exacta del minijuego (incluyendo `modo_juego`)
2. Prever errores comunes (ansiedad, desincronización, problemas de red en street)
3. Estimar tiempo realista (10-15 min estándar)
4. Considerar el espacio físico (todos alrededor de tablet) o distribución (cada uno en su ubicación)

**Después de crear la prueba:**
1. Testear el minijuego con grupo de prueba en el modo correspondiente
2. Ajustar dificultad según resultados (tolerancia, ritmo)
3. Verificar que el código/recompensa aparece correctamente en pantalla
4. Comprobar volumen de sonido y visibilidad de feedback
5. Para street escape: testear con diferentes tipos de conexión (WiFi vs 4G)

---

## Changelog

- **v1.0** (2026-02-12): Creación inicial del skill

---

**Score de evaluación:** 9/10
- C1 (Cantidad): 3+ pruebas candidatas inmediatas → 3pts
- C2 (Reglas): Validación compleja (sincronización, timing) → 3pts
- C3 (Reutilización): Hall, street, digital → 2pts
- C4 (Impacto): Alto (cooperación grupal) → 1pt
- C5 (Complejidad): Alta (10+ variables configurables) → 1pt

**Frecuencia de uso esperada:** Alta (minijuegos cooperativos son muy populares)
**Dependencias:** Ninguna (skill atómico, requiere solo tablet)
