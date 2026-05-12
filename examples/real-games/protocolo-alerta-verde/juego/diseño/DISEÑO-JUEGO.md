# DISEÑO DEL JUEGO: Protocolo Alerta Verde

## Configuración

| Campo | Valor |
|-------|-------|
| **Tipo** | Hall escape (edificio de 3 plantas, 6 habitaciones) |
| **Duración** | 50 minutos |
| **Jugadores** | Hasta 6 por grupo, 2 grupos simultáneos, 4 grupos/sesión |
| **Público** | Jóvenes 12-18 años |
| **Dificultad** | 4/10 (accesible, teamwork-focused) |
| **Presupuesto** | Gasto contenido, mínima decoración |
| **Formato** | Competitivo (2 grupos simultáneos compiten por resolver primero) |
| **Temática** | Ecológica / Ciencia ficción / Investigación |

## Restricciones de Diseño

### Espacio
- 3 plantas, 6 habitaciones
- 2 grupos simultáneos → cada grupo usa 3 habitaciones (1 por planta)
- No se pueden ver/oir entre plantas
- Grupos rotan: cuando un grupo termina, el siguiente empieza

### Público joven (12-18)
- Dificultad accesible (máx 5/10 en cualquier prueba)
- Puzzles táctiles y visuales (poco texto denso)
- Feedback inmediato y claro
- Colaboración forzada (no puzzles solitarios)
- Cada prueba ≤8 min para mantener ritmo

### Capa Educativa Ambiental

Los datos de medio ambiente están integrados de forma natural en los documentos del juego. **Los jugadores aprenden sin darse cuenta**, leyendo los mismos informes y mensajes que necesitan para resolver las pruebas. No hay preguntas de trivia ni exámenes disfrazados.

### Principios de Integración

1. **El dato sirve a la narrativa** — Los datos aparecen porque los personajes (Tomás, Marina) los usarían en su trabajo real
2. **El dato no bloquea el puzzle** — Resolver las pruebas no requiere entender ni memorizar ningún dato
3. **Comparaciones impactantes** — "8.000 litros = 40 bañeras" se recuerda mejor que "8.000 litros"
4. **Datos locales (Castilla y León)** — 7 horas de sol, 1,8M hectáreas de bosque, lince ibérico
5. **El panel informativo es decoración con superpoder** — Los jugadores lo leen mientras esperan; genera conversación

### Datos por Prueba

| Prueba | Dato integrado | Dónde aparece |
|--------|---------------|---------------|
| 1 | PM2.5: límite OMS 15 µg/m³, el informe marca 95 | Informe del aire (escritorio) |
| 1 | Bosques CyL: 1,8M hectáreas absorben 8M ton CO2/año | Panel informativo (pared) |
| 1 | Árboles urbanos: absorben 22 kg CO2/año | Nota de la Dra. Soler |
| 1 | Temperatura: +1,2°C desde 1900 | Panel informativo (pared) |
| 2 | CO2: a 1000 ppm se pierde capacidad cognitiva | Mensaje Estación NUBE |
| 2 | Agua: 8.000 L/h = 40 bañeras/hora | Mensaje Estación RÍO |
| 2 | Energía: 478 kWh = 16.000 cargas de móvil | Mensaje Estación SOL |
| 2 | NO2: límite legal 40 µg/m³, el tráfico lo provoca | Mensaje Estación VIENTO |
| 2 | Plomo: tóxico a 50 ppm en suelo | Mensaje Estación TIERRA |
| 2 | Lince ibérico: de 94 a +2.000 (2002→2024) | Mensaje Estación VIDA |
| 3 | CO2 duplicado en sensores de aire | Tablón del Investigador (15/03) |
| 3 | Miles de litros de agua perdidos | Tablón del Investigador (22/03) |
| 3 | Paneles solares desactivados | Tablón del Investigador (03/04) |
| 3 | Bosque urbano amenazado, Marina desaparecida | Tablón del Investigador (14/04) |
| 4 | 7h sol/día en Castilla y León | Marca UV junto a SOL |
| 4 | 3 litros/día = mínimo vital OMS | Marca UV junto a RÍO (agua) |
| 4 | 9/10 personas respiran aire contaminado | Marca UV junto a NUBE (aire) |
| 4 | 1 turbina eólica = 1.500 hogares | Marca UV junto al logo de energía renovable |

### Impacto Esperado

- **Sin esfuerzo adicional para el jugador** — Lee los documentos que ya leería para resolver el puzzle
- **Dato-cuchillo (stick)** — Los datos negativos (contaminación, plomo) generan indignación contra Pardo
- **Dato-esperanza (carrot)** — Los datos positivos (lince ibérico, renovables) generan esperanza al final
- **Datos locales** — Conectan con el entorno real de los jugadores (Castilla y León)
- **Memorables** — Las comparaciones (40 bañeras, 16.000 móviles) se quedan en la cabeza

### Presupuesto contenido
- Usar elementos del edificio (puertas, mesas, paredes)
- Materiales baratos: papel impreso, cajas de madera, candados, linterna UV
- Sin tecnología compleja (tablets solo si ya disponibles)
- Decoración mínima: usar cartelería, documentos y señalización

## MDA Framework

### Mechanics (Mecánicas)
- **Búsqueda y exploración** de habitaciones
- **Emparejamiento** de documentos/pistas
- **Descifrado** de códigos y mensajes
- **Resolución lógica** de secuencia de eventos
- **Cooperación** con información dividida

### Dynamics (Dinámicas)
- **Urgencia temporal** (timer de 50 min)
- **Competición sana** entre 2 grupos
- **Colaboración intragrupo** emergente
- **Descubrimiento progresivo** de la historia
- **Curiosidad** por quién está detrás del sabotaje

### Aesthetics (Estéticas)
- **Inmersión** en mundo de unidad ambiental
- **Satisfacción** al resolver cada prueba
- **Tensión** en los últimos minutos
- **Sorpresa** en el giro narrativo
- **Triunfo compartido** al finalizar

## Estructura de Actos

```
ACTO 1: ALERTA (0-10 min) — Dificultad 2-3
├─ Briefing + sobre inicial
├─ Exploración de la primera habitación
└─ Primeros descubrimientos

ACTO 2: INVESTIGACIÓN (10-35 min) — Dificultad 3-5
├─ Pruebas de deducción en las habitaciones
├─ Revelaciones progresivas del sabotaje
├─ Trabajo en las 3 plantas
└─ Giro narrativo: el saboteador no es un extraño

ACTO 3: CONTRAATAQUE (35-48 min) — Dificultad 4-5
├─ Meta-prueba que integra todo lo descubierto
├─ Urgencia máxima (últimos 15 min)
└─ Resolución del sabotaje

ACTO 4: CIERRE (48-50 min)
├─ Celebración
├─ Revelación final del saboteador
└─ Foto/vídeo del equipo ganador
```

## Curva de Dificultad (Flow)

```
Min 0-5:   Dificultad 2/10 (briefing, exploración, primer hallazgo)
Min 5-15:  Dificultad 3/10 (primera prueba, generar confianza)
Min 15-35: Dificultad 4/10 (pruebas principales, colaboración)
Min 35-45: Dificultad 5/10 (meta-prueba, integración)
Min 45-50: Dificultad 2/10 (cierre, celebración)
```

## Distribución de Pruebas por Habitación

### Grupo A y Grupo B (mismo diseño, paralelo)

| Habitación | Planta | Pruebas | Duración estimada |
|------------|--------|---------|-------------------|
| **Centro de Operaciones** | Planta 1 | Prueba 1 + Prueba 2 | ~13 min |
| **Laboratorio de Análisis** | Planta 2 | Prueba 3 + Prueba 4 | ~13 min |
| **Sala de Control** | Planta 3 | Prueba 5 (La Radio de Marina) + Prueba 6 (Meta-prueba) | ~15 min |

### Flujo entre habitaciones
- Cada prueba puede estar en una habitación diferente
- Al resolver una prueba, obtienen la **llave a la habitación de la siguiente prueba**
- El flujo es siempre lineal: P1 → P2 → P3 → P4 → P5 → P6
- Las transiciones entre habitaciones se hacen SIEMPRE con llave física

### Sistema de Componentes del Emisor (v3.0)

Las Pruebas 1-3 entregan **componentes físicos del emisor de radio** como recompensa adicional. Los jugadores acumulan estos componentes y los usan en la Prueba 5 (La Radio de Marina) para montar el emisor y escuchar el mensaje FM.

| Prueba | Componente | Color | Detalle |
|--------|-----------|-------|---------|
| P1 — Archivo de Alertas | 2 cables | 🔴 Rojo + 🟢 Verde | Dentro del archivador |
| P2 — Mensajes Interceptados | 2 cables + diagrama parcial | 🔵 Azul + 🟡 Amarillo | Dentro de la caja |
| P3 — Tablón del Investigador | 1 cable + instrucciones | ⚫ Negro | Dentro de la caja |

**Principio clave**: Los cables son elementos físicos sin información — no rompen la regla de cero dependencias de información. Solo viajan objetos inertes (cables) y la nota de instrucciones (sin datos de puzzles).

**Excepción a la regla**: Los componentes del emisor son la única excepción a la regla de "cero papeles viajeros". Sin embargo, no contienen información de puzzles — son herramientas físicas necesarias para la Prueba 5.

## Sistema de Tarjetas-Recompensa (v2.0 — legacy, ahora parte de Prueba 6)

La Prueba 6 (Detener el Sabotaje) es una meta-prueba simplificada que usa el mensaje FM de la Prueba 5 como pista principal, confirmado por los documentos locales de la sala. Ya no se necesitan tarjetas-recompensa viajeras — toda la información está en la Sala de Control o viene del mensaje FM.

## Diseño para 4 Grupos por Sesión

| Turno | Grupo A | Grupo B |
|-------|---------|---------|
| **Sesión 1** | 12:00 - 12:50 | 12:00 - 12:50 |
| **Sesión 2** | 13:10 - 14:00 | 13:10 - 14:00 |

- 20 min entre sesiones para reset
- 2 grupos simultáneos por sesión
- Cada grupo tiene su propio set de pruebas (no comparten objetos)

## Formato Competitivo

- Los 2 grupos compiten por terminar primero
- Misma dificultad, mismas pruebas (duplicadas)
- No hay interacción directa entre grupos (están en diferentes plantas)
- El GM anuncia progreso parcial para crear tensión ("¡El Grupo A ya lleva 3 pruebas!")
- El grupo ganador recibe un diploma/certificado "Unidad de Protección Ambiental"

## Arquetipos de Jugadores Cubiertos

| Arquetipo | Prueba asignada | Por qué |
|-----------|-----------------|---------|
| **Buscador** | Prueba 1 (Exploración visual) | Encuentra documentos ocultos |
| **Lógico** | Prueba 3 (Lógica secuencial) | Deduce el orden de eventos |
| **Comunicador** | Prueba 2 (Emparejamiento cooperativo) | Conecta información dividida |
| **Creativo** | Prueba 4 (Descifrado de mensajes) | Ve patrones no obvios |
| **Líder** | Prueba 5 (Meta-prueba) | Coordina la integración final |

## Sistema de Hints

| Nivel | Cuándo | Contenido |
|-------|--------|-----------|
| **Nivel 1** | 4 min sin progreso | Dirección general ("Revisad los documentos del escritorio") |
| **Nivel 2** | 7 min sin progreso | Acción específica ("La fecha del informe coincide con el código") |
| **Nivel 3** | 10 min sin progreso | Casi solución ("El código es el año del informe: 2031") |

## Materiales Necesarios (Resumen)

### Por grupo (x2):
- 1 caja de madera con candado de 4 dígitos (P1)
- 1 candado de 3 letras (P2)
- 1 caja con candado de 4 dígitos (P3)
- 1 candado de 4 dígitos (P4)
- 1 máquina de radio (emisor FM) con 5 puertos (P5)
- 1 radio FM portátil (P5)
- 1 diagrama completo de montaje A3 (P5)
- 1 caja grande con candado de 4 letras (P6 final)
- 5 cables de colores (rojo, verde, azul, amarillo, negro — viajan desde P1-P3)
- 2 notas "Componente A — Emisor de Emergencia"
- 1 diagrama parcial de 5 colores
- 1 instrucciones de interruptores
- 6 llaves físicas (P1→P2, P2→P3, P3→P4, P4→P5, ×2 para 2 grupos)
- 6-8 documentos impresos (informes, mapas, notas)
- 1 linterna UV
- 1 mapa impreso (A3) con marcas UV
- 1 sobre inicial sellado
- 1 sobre "MÁXIMA SEGURIDAD" (instrucciones P6)
- 1 certificado/diploma (premio)

### Compartidos:
- Timer visible (reloj o pantalla)
- Cartelería de habitaciones (nombres de salas)
- Música ambiental (opcional, playlist)
