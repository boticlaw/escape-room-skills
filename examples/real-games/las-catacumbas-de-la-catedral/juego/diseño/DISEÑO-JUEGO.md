# DISEÑO DE JUEGO — Las Catacumbas de la Catedral

## Tabla Maestra de Pruebas

| # | Nombre | Sala | Acto | Skill Primario | Dificultad | Tipo Cierre | Código | Duración | Fragmento |
|---|--------|------|------|----------------|------------|-------------|--------|----------|-----------|
| 1 | El Escritorio Saboteado | 1 | 1 | exploracion-visual | 3 | Candado 4 dígitos | 1321 | 8-10 min | V |
| 2 | Los Fragmentos Perdidos | 2 | 1 | emparejamiento-texto | 4 | Candado letras | LIBRO | 8-10 min | E |
| 3 | El Código del Archivero | 3 | 2 | comunicacion-mensajes | 5 | Cryptex | PIEDRA | 10-12 min | R |
| 4 | El Mapa de las Catacumbas | 4 | 2 | logica-posiciones | 6 | Mecanismo físico | — | 8-10 min | D |
| 5 | El Diario del Canónigo | 5 | 3 | investigacion-texto | 4 | Llave física | — | 4-5 min | A |
| 6 | El Sello de la Verdad | 5 | 3 | puzzle-ensamblaje | 4 | Código digital | VERDAD | 4-5 min | D |
| 7 | La Verdad Revelada (META) | 5 | 3 | — | 3 | Narrativa | — | 2-3 min | Todos |

---

## Detalle de Pruebas

### Prueba 1: El Escritorio Saboteado

**Skill primario**: `prueba-exploracion-visual`
**Skills secundarios**: `prueba-investigacion-texto`
**Dificultad**: 3/10
**Sala**: 1 | **Acto**: 1 | **Emoción**: CURIOSIDAD

**Contenedor narrativo**: Carpeta de cuero con sello de cera rota
**Tipo de cierre**: Candado 4 dígitos
**Código**: `1321`

**Materiales**:
- 1× Carpeta de cuero (o similar) con candado de 4 dígitos
- 10-12 documentos impresos en papel envejecido (4 marcados con símbolos rojos)
- 1× Mapa desplegado de la catedral con marcas rojas
- 1× Corcho con fotos y recortes
- Post-its verdes (notas de la Dra. Marcos)
- 1× Lámpara de escritorio ámbar

**Mecánica**:
Los jugadores exploran un escritorio saboteado con documentos esparcidos. Entre los 10-12 documentos, 4 tienen un pequeño símbolo rojo oculto en una esquina (ojo, cruz, media luna, estrella). Cada documento marcado contiene un número subrayado en su texto. El mapa tiene una nota de la Dra. Marcos: *"¡Los símbolos siguen el orden de las constelaciones sobre la catedral! ☉→✟→☽→★"* indicando el orden. Los números en ese orden forman el código 1321.

**Doble descubrimiento**:
1. *Capa 1*: Encontrar los 4 documentos con símbolos ocultos entre el desorden.
2. *Capa 2*: Ordenar los números según los símbolos para formar el código.

**Participación (4-6 jugadores)**:
- 2 jugadores exploran la mesa principal
- 1-2 jugadores revisan el corcho y las paredes
- 1 jugador coordina y anota los números encontrados
- 1 jugador examina el mapa para encontrar la pista del orden

**Fragmento de misterio**: Losa de cartón piedra con la letra **V** y fragmento de inscripción latina *"VERI..."*

---

### Prueba 2: Los Fragmentos Perdidos

**Skill primario**: `prueba-emparejamiento-texto`
**Skills secundarios**: `prueba-exploracion-visual`, `prueba-logica-secuencial`
**Dificultad**: 4/10
**Sala**: 2 | **Acto**: 1 | **Emoción**: DESCUBRIMIENTO

**Contenedor narrativo**: Cofre de madera antigua con herrajes de latón
**Tipo de cierre**: Candado letras (5 letras)
**Código**: `LIBRO`

**Materiales**:
- 1× Cofre de madera con candado de letras de 5 posiciones
- 8 fragmentos de documentos (4 pares) impresos en papel envejecido, rasgados
- 1× Marco con árbol genealógico de obispos (5 obispos con fechas)
- 2-3 cajas de archivo como decoración con documentos adicionales dentro

**Mecánica**:
Los jugadores encuentran 8 fragmentos de documentos rasgados (como si alguien los hubiera arrancado a propósito). Deben emparejar los fragmentos por contenido textual y bordes que coinciden. Los 4 pares forman cartas completas del Archivero de la Catedral. Cada carta tiene una palabra destacada en tinta roja. El marco del árbol genealógico muestra 5 obispos con fechas; una nota dice: *"Lee las cartas en el orden de los obispos"* (cronológico). Las palabras en orden son: L-I-B-R-O (cada carta tiene una única letra destacada en realidad, no palabras completas — esto es más limpio para el diseño).

**Nota de diseño**: Cada carta reconstruida tiene una **letra** grande y roja en el encabezado. Las 4 cartas completas tienen las letras L, I, B, R. Pero el candado es de 5 letras. La 5ª letra (O) aparece en el marco del árbol genealógico — en el nombre del quinto obispo, "Obispo **O**rdoño", con la O destacada. Esto añade una capa extra de búsqueda.

**Doble descubrimiento**:
1. *Capa 1*: Emparejar los fragmentos para reconstruir las cartas.
2. *Capa 2*: Ordenar las letras de las cartas por el orden de los obispos y encontrar la letra O en el marco.

**Participación (4-6 jugadores)**:
- 2-3 jugadores buscan fragmentos por la sala
- 2 jugadores trabajan en la mesa emparejando
- 1 jugador analiza el árbol genealógico buscando la conexión

**Fragmento de misterio**: Trozo de pergamino con la letra **E** y fragmento *"…TAS"* 

---

### Prueba 3: El Código del Archivero

**Skill primario**: `prueba-comunicacion-mensajes`
**Skills secundarios**: `prueba-cifrado`
**Dificultad**: 5/10
**Sala**: 3 | **Acto**: 2 | **Emoción**: TENSIÓN

**Contenedor narrativo**: Estuche tubular de cuero (portafolios enrollable)
**Tipo de cierre**: Cryptex de 6 letras
**Código**: `PIEDRA`

**Materiales**:
- 1× Cryptex de 6 letras
- 1× Estuche tubular de cuero (donde va el cryptex)
- 1× Mensaje cifrado impreso en pergamino (para Grupo A)
- 1× Texto de contexto sobre cifrado medieval (para Grupo B)
- 1× Disco de cifrado medieval (impreso en cartón rígido, dividido en 2 mitades)
- 1× Reloj de arena de 3 minutos (opcional, para tensión)
- Notas del archivero Pablo

**Mecánica**:
La sala está dividida en dos zonas. Grupo A (2-3 jugadores) tiene el mensaje cifrado y la mitad interior del disco de cifrado. Grupo B (2-3 jugadores) tiene el texto de contexto y la mitad exterior del disco. No pueden intercambiar materiales pero SÍ hablar.

El **disco de cifrado** es un cifrado César visual: la mitad interior tiene letras A-Z, la exterior tiene letras desplazadas. Para usarlo, necesitan ambas mitades alineadas con un desplazamiento específico (que se deduce del texto de contexto del Grupo B: *"El archivero usaba el desplazamiento de la fecha de fundación de la catedral"* — la pista en el contexto revela desplazamiento 7).

El mensaje cifrado, una vez descifrado, dice: *"LA PALABRA ES LO QUE SOSTIENE LA CATEDRAL DESDE SUS CIMIENTOS. SIN ELLA NO HAY CONSTRUCCIÓN. ES LO QUE PERDURA 705 AÑOS."*

Respuesta: **PIEDRA**.

**Doble descubrimiento**:
1. *Capa 1*: Comunicarse para reconstruir el cifrado y descifrar el mensaje.
2. *Capa 2*: El mensaje descifrado es una adivinanza cuya respuesta es PIEDRA.

**Participación (4-6 jugadores)**:
- Grupo A (2-3): Mensaje cifrado + mitad del disco → describen su contenido verbalmente
- Grupo B (2-3): Contexto + mitad del disco → describen su contenido verbalmente
- Todos colaboran para descifrar y resolver la adivinanza

**Fragmento de misterio**: Sello de metal con la letra **R** y fragmento *"…LIBE…"*

---

### Prueba 4: El Mapa de las Catacumbas

**Skill primario**: `prueba-logica-posiciones`
**Skills secundarios**: `prueba-exploracion-visual`, `prueba-emparejamiento-texto`
**Dificultad**: 6/10 (PICO)
**Sala**: 4 | **Acto**: 2 | **Emoción**: COOPERACIÓN

**Contenedor narrativo**: Bolsa de terciopelo con fichas metálicas + Tablero de madera
**Tipo de cierre**: Mecanismo físico (tablero con posiciones correctas)
**Código**: N/A (resolución física)

**Materiales**:
- 1× Mapa grande de las catacumbas (A0, impreso en papel tipo pergamino)
- 1× Tablero de madera con 6 huecos numerados (mecanismo: cuando las 6 fichas están en posición correcta, un compartimento se abre por la parte inferior — se puede hacer con imanes o con un simple cierre de madera que se libera al presionar las fichas correctas)
- 6× Fichas metálicas con símbolos (puerta, columna, altar, fuente, pasillo, cripta)
- 6× "Crónicas del obispo" en marcos (textos con pistas espaciales)
- Tiras LED azules para ambiente
- 1× Tablet con audio ambiental (goteo, eco, 30s en loop, volumen bajo)

**Mecánica**:
El mapa de las catacumbas tiene 6 ubicaciones marcadas con números (1-6) pero sin nombres. Los jugadores tienen 6 fichas con símbolos que representan ubicaciones. Cada crónica del obispo describe UNA ubicación con pistas espaciales relativas:

- *"La Cripta está en la posición más al norte, donde convergen los tres pasillos."* → Posición 1
- *"La Fuente está al este de la entrada, una posición más al sur que la Cripta."* → Posición 3
- *"El Altar está en el centro exacto del laberinto."* → Posición 4
- *"La Puerta de entrada está en la posición más al sur y al oeste."* → Posición 6
- *"La Columna está entre la Cripta y el Altar, una posición al este de la Cripta."* → Posición 2
- *"El Pasillo Secreto está entre la Fuente y la Puerta."* → Posición 5

Las posiciones correctas:
| Posición | Ficha |
|----------|-------|
| 1 | Cripta |
| 2 | Columna |
| 3 | Fuente |
| 4 | Altar |
| 5 | Pasillo Secreto |
| 6 | Puerta |

Cuando las 6 fichas están colocadas, los símbolos de las fichas forman visualmente una **flecha** que señala la parte inferior del tablero, donde se abre el compartimento secreto.

**Doble descubrimiento**:
1. *Capa 1*: Compartir la información de cada crónica y deducir la posición de cada ficha.
2. *Capa 2*: Las fichas colocadas forman una flecha que señala el compartimento secreto.

**Participación (4-6 jugadores)**:
- Cada jugador lee una crónica diferente (ideal: 6 jugadores = 6 crónicas)
- Comparten la información para deducir las posiciones
- 1-2 jugadores colocan las fichas en el tablero
- El grupo verifica visualmente la flecha formada

**Fragmento de misterio**: Pieza de metal con la letra **D** y fragmento *"…RABIT…"*

---

### Prueba 5: El Diario del Canónigo

**Skill primario**: `prueba-investigacion-texto`
**Skills secundarios**: `prueba-logica-secuencial`
**Dificultad**: 4/10
**Sala**: 5 | **Acto**: 3 | **Emoción**: GIRO

**Contenedor narrativo**: Compartimento del altar
**Tipo de cierre**: Llave física (candado pequeño)
**Código**: N/A (hallar la llave)

**Materiales**:
- 1× Diario del Canónigo (cuaderno forrado en cuero, 8-10 páginas con entradas)
- 1× Altar improvisado (mesa cubierta con paño oscuro, cruz, velas LED)
- 1× Compartimento en el altar (caja con bisagra + candado pequeño con llave)
- 1× "Piedra del suelo" (cartón pintado) con símbolo del ojo
- 3-4 elementos decorativos en la sala (marco, placa, vela grande, jarrón)

**Mecánica**:
Los jugadores encuentran el diario de Don Álvaro de Cervatos. Las entradas (fechadas en 1321) contienen pistas sobre dónde escondió la llave del compartimento del altar:

- *Entrada del 15 de marzo de 1321*: *"He sellado las catacumbas. La clave está dividida en seis, como manda la tradición. Pero la llave del altar debe estar a salvo. La ocultaré donde solo quien conozca nuestros símbolos pueda encontrarla."*
- *Entrada del 22 de marzo de 1321*: *"He colocado la llave bajo la protección del Ojo que Todo lo Ve. Donde la luz del rosetón cae sobre la tercera piedra del camino. Buscad el símbolo que ya conocéis."*
- *Entrada del 5 de abril de 1321*: *"Si alguien lee esto, debe saber que no ocultamos maldad. Protegemos conocimiento. Que la VERDAD os guíe."*

La clave: Buscar en la sala un elemento con el **símbolo del ojo** (que vieron en la Sala 1 en los documentos). Hay una "piedra del suelo" con ese símbolo. Debajo de ella (o detrás, según la disposición) está la llave.

**El giro**: La entrada del 5 de abril revela que las catacumbas no ocultan nada malvado. Esto cambia la perspectiva de los jugadores sobre el "saboteador" — ¿y si no es un villano?

**Doble descubrimiento**:
1. *Capa 1*: Interpretar las pistas del diario para localizar la llave.
2. *Capa 2*: La llave está bajo el símbolo del ojo de la Sala 1 (loop narrativo) Y el diario revela que no hay maldad, solo protección.

**Participación (4-6 jugadores)**:
- 2-3 jugadores leen el diario en voz alta y discuten las pistas
- 1-2 jugadores buscan en la sala el símbolo del ojo
- 1 jugador coordina pistas anteriores con lo que encuentran ahora

**Fragmento de misterio**: Trozo de pergamino con la letra **A** y fragmento *"…VOS"*

---

### Prueba 6: El Sello de la Verdad

**Skill primario**: `prueba-puzzle-ensamblaje`
**Skills secundarios**: `prueba-investigacion-texto`, `prueba-exploracion-visual`
**Dificultad**: 4/10
**Sala**: 5 | **Acto**: 3 | **Emoción**: TRIUNFO + ALIVIO

**Contenedor narrativo**: Altar de piedra tallada con seis hendiduras + Tablet
**Tipo de cierre**: Código digital (tablet)
**Código**: `VERDAD`

**Materiales**:
- Los 5 fragmentos de misterio recogidos durante el juego (V, E, R, D, A)
- 1× Fragmento D sexto (oculto bajo una losa del suelo marcada con cruz gótica)
- 1× Altar de piedra (caja pintada como piedra tallada, ~60×40×30cm) con 6 hendiduras circulares
- 1× Tira LED roja/neón detrás del altar (activada por interruptor magnético en 6ª hendidura)
- 1× Losa suelta del suelo (cartón piedra, ~25×25cm) con cruz gótica grabada
- 1× Tablet con interfaz de código (app offline / HTML local)
- Efecto de cambio de iluminación: azul oscuro → dorado/ámbar al completar el sello

**Mecánica**:
Los jugadores traen los cinco fragmentos de misterio (V, E, R, D, A) de las pruebas anteriores. En el fondo de las catacumbas encuentran un **altar de piedra** con seis hendiduras circulares, cada una marcada con una letra (V, E, R, D, A, D). Los fragmentos encajan físicamente en las hendiduras por su forma única.

Al colocar los cinco fragmentos, notan que **queda una hendidura vacía** (la segunda D). Deben buscar en la sala y encontrar la **losa del suelo con una cruz gótica**. Al levantarla, descubren el sexto fragmento D con la inscripción *"AD DISCENDO"*.

Al colocar el sexto fragmento:
- El **interruptor magnético** (imán en la pieza D + Reed switch en la hendidura) cierra el circuito
- La **tira LED** detrás del altar se enciende, iluminando el sello completo
- Las luces de la sala cambian de azul a **dorado/ámbar cálido**
- La tablet muestra la pantalla de entrada de código

La inscripción completa del sello: **"VERITAS LIBERABIT VOS AD DISCENDO"** — *"La verdad os hará libres al descubrirla."*
Las letras de los seis fragmentos: **V-E-R-D-A-D**.

Introducen **VERDAD** en la tablet.

**Doble descubrimiento**:
1. *Capa 1*: Ensamblar los seis fragmentos en el altar (puzzle de encaje + búsqueda de la pieza oculta) y ver la palabra VERDAD confirmada por la iluminación del sello.
2. *Capa 2*: La inscripción y la revelación final transforman todo el significado — no había maldad, solo protección del conocimiento. El saboteador Don Alejandro Quintana era descendiente de los guardianes originales.

**Participación (4-6 jugadores)**:
- Cada jugador tiene exactamente un fragmento (configuración ideal: 6 jugadores = 5 fragmentos + búsqueda de la pieza D)
- Colocan los fragmentos juntos en el altar, coordinándose verbalmente
- 1-2 jugadores buscan el fragmento D oculto bajo la losa
- El ensamblaje y la revelación son vividos por TODOS simultáneamente
- Todos leen la inscripción y la revelación final en grupo

**Fragmento de misterio**: Este puzzle ES la combinación de todos los fragmentos. La **D** final se obtiene al encontrar la pieza oculta en la sala. El sello completo con la inscripción **VERITAS LIBERABIT VOS AD DISCENDO** — la Verdad finalmente revelada.

---

### Meta-Prueba 7: La Verdad Revelada

**Tipo**: Narrativa (no es un puzzle)
**Dificultad**: N/A
**Sala**: 5 | **Acto**: 3 | **Emoción**: ALIVIO + RECOMPENSA

**Materiales**:
- Tablet con pantalla de revelación
- Opcional: efecto de iluminación (cambio a luz dorada/ámbar al ganar)

**Mecánica**:
Al introducir VERDAD, la tablet muestra la revelación final:

> *"Habéis descubierto la verdad. Durante 705 años, los canónigos de la Catedral de Palencia protegieron una biblioteca de manuscritos únicos — conocimiento que habría sido destruido en guerras, inquisiciones y conflictos. No ocultaban maldad. Preservaban sabiduría.*
>
> *El saboteador era Don Alejandro Quintana, descendiente del último canónigo guardián. Creía que el mundo aún no estaba preparado para este descubrimiento. Pero la verdad siempre encuentra su camino.*
>
> *Como investigadores, habéis decidido que el conocimiento pertenece a todos. Las catacumbas de la catedral serán declaradas Patrimonio de la Humanidad."*

La pantalla muestra opcionalmente una "elección final" (pura narrativa, sin consecuencias reales) y el nombre del equipo con el tiempo empleado.

---

## Verificación de Restricciones

| Restricción | Estado | Detalle |
|-------------|--------|---------|
| 5 salas secuenciales | ✅ | Salas 1-5, cada una con cerradura que abre el GM |
| Candado físico en puertas | ✅ | GM abre con llave al resolver cada prueba |
| 4 tablets, sin WiFi | ✅ | Tablet intro, tablet ambiente (S4), tablet código (S5), tablet backup |
| Presupuesto ~100-150€ | ✅ | Ver desglose en LOGISTICA.md |
| GM invisible (3 niveles pistas) | ✅ | Ver PISTAS-GM.md |
| Todos terminan (sin perder) | ✅ | Sin condición de fallo, GM puede dar solución directa |
| 6 pruebas + meta | ✅ | 6 pruebas + meta-prueba narrativa |
| Curva 3→4→5→6→4 | ✅ | 3, 4, 5, 6, 4, 4, 3(meta) |
| Max 2 misma skill primaria | ✅ | 6 skills diferentes, 0 repeticiones |
| Max 3 cierres mismo tipo | ✅ | 6 tipos distintos, 1 de cada |
| ≥3 mecánicas distintas | ✅ | 6 mecánicas distintas |
| Doble descubrimiento | ✅ | Todas las pruebas tienen 2 capas |
| 4-6 jugadores activos | ✅ | Diseñado para participación simultánea |
| Contenedor narrativo | ✅ | Carpeta, cofre, estuche, bolsa+tablero, compartimento altar, altar de piedra con hendiduras |
| Audio ≤60s | ✅ | Intro: 30s, ambiente: 30s loop, revelación: 45s |
| Físico > Digital | ✅ | Solo 1 interacción digital (código final) |
| Hilo misterio secundario | ✅ | Fragmentos VERDAD, ensamblaje en meta-prueba |
