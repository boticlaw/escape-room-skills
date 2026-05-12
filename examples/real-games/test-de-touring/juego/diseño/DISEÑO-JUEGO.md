# 🔐 Test de Touring — Diseño de Juego v2

> **Escape Room Educativo sobre IA Real**
> Versión 2.2 · 8 Abril 2026
> **Físico > Digital · Sin servidor · Tablets standalone como apoyo mínimo**

---

## 📋 FICHA TÉCNICA

| Aspecto | Detalle |
|---------|---------|
| **Tipo** | Hall Escape (5 salas secuenciales) |
| **Tema** | IA real — peligros y oportunidades |
| **Audiencia** | Jóvenes 12-18 años |
| **Duración** | 50 minutos |
| **Pruebas** | 6 (5 salas: las 4 primeras tienen 1 prueba, la Sala 5 tiene 2) |
| **Jugadores** | 5-6 por grupo |
| **Dificultad media** | 4/10 |
| **Presupuesto** | ~120€ |
| **Código final** | TURING |
| **Tecnología** | 4 tablets standalone (sin WiFi, sin servidor) |
| **Puertas** | GM abre con llave física |
| **GM** | Invisible — solo abre puertas y da pistas cuando se piden |

---

## 📐 TABLA MAESTRA DE PRUEBAS (Fuente única de verdad)

> ⚠️ Esta tabla es la referencia canónica. Cualquier discrepancia con otros documentos se resuelve a favor de esta tabla.

| # | Prueba | Sala | Tema IA | Dificultad | Código | Mecánica principal | Cierre | Letra | Símbolo | Emoción | Perfiles que destacan |
|---|--------|------|---------|------------|--------|--------------------|--------|-------|--------------------------|
| 1 | Real o Falso | Lab | Deepfakes | **2/10** | F-R-A-U-D-E | Clasificar tarjetas real/IA + reverso | Cryptex 6 letras | **F** | HUELLA | Curiosidad | Observador, Analista |
| 2 | Tu Huella Digital | Archivo | Datos personales | **3/10** | PERFIL | Perfiles en dossier + conectar con hilos | Tablet password | **U** | BÁSCULA | Inquietud | Buscador, Conector |
| 3 | Justicia Algorítmica | Evaluación | Sesgos | **5/10** | Llave | Eliminar criterios sesgados de fichas | Llave física (en sobre) | **R** | TELÉFONO ANTIGUO | Indignación | Analista, Crítico |
| 5 | Sin Móvil | Analógica | Dependencia tech | **5/10** | 2-0-0-7 | 5 retos analógicos cooperativos | Candado 4 dígitos | **I** | CEREBRO | Frustración→Diversión | Líder, Práctico |
| 4 | El Interrogatorio | Núcleo | Test de Turing | **6/10** | 1-9-1-2 | Conversación pre-impresa + dato histórico | Candado 4 dígitos | **N** | — | Tensión | Lector, Debateador |
| 6 | Código de Apagado | Núcleo | Alfabetización digital | **5/10** | TURING→HUMANO | Tablet password + candado numérico | Tablet + candado | **G** | VICTORIA | Triunfo | Memorista, Sintetizador |

**Curva de dificultad:** 2 → 3 → 4 → 5 → 6 → 4
- Entrada suave (Prueba 1: 2/10) — confianza
- Progresión (Pruebas 2-4: 3→4→5)
- Pico (Prueba 5: 6/10) — Test de Turing
- Recompensa rápida (Prueba 6: 4/10) — componer TURING

**Código final:** T + U + R + I + N + G = **TURING**

---

## 🗺️ MAPA DE FLUJO

```
ENTRADA (Cartel Protocolo Touring, 2 min)
    │
    ▼
┌───────────────────────────┐
│ SALA 1: LABORATORIO       │  Prueba 1: "Real o Falso"
│ Simbolo puerta: OJO       │  ~6 min · Dif 2/10
│ Letra desbloqueada: F      │  Cryptex 6 letras → F-R-A-U-D-E
└─────────┬─────────────────┘
          │ Nota Dra. Torres → "Buscad la HUELLA"
          │ GM abre puerta
          ▼
┌───────────────────────────┐
│ SALA 2: ARCHIVO DE DATOS  │  Prueba 2: "Tu Huella Digital"
│ Simbolo puerta: HUELLA    │  ~7 min · Dif 3/10
│ Letra desbloqueada: U      │  Tablet password → PERFIL
└─────────┬─────────────────┘
          │ Nota Dra. Torres → "Buscad la BÁSCULA"
          │ GM abre puerta
          ▼
┌───────────────────────────┐
│ SALA 3: SALA DE EVALUACIÓN│  Prueba 3: "Justicia Algorítmica"
│ Simbolo puerta: BÁSCULA   │  ~8 min · Dif 4/10
│ Letra desbloqueada: R      │  Llave física (sobre sellado)
└─────────┬─────────────────┘
          │ Nota Dra. Torres → "Buscad el TELÉFONO ANTIGUO"
          │ GM abre puerta
          ▼
┌───────────────────────────┐
│ SALA 5: ZONA ANALÓGICA    │  Prueba 5: "Sin Móvil"
│ Simbolo puerta: TELÉFONO  │  ~8 min · Dif 5/10
│ Letra desbloqueada: I      │  Candado 4 dígitos → 2-0-0-7
└─────────┬─────────────────┘
          │ Nota Dra. Torres → "Buscad el CEREBRO"
          │ GM abre puerta
          ▼
┌───────────────────────────┐
│ SALA 4: NÚCLEO DE EVA     │  Prueba 4: "El Interrogatorio"
│ Simbolo puerta: CEREBRO   │  ~9 min · Dif 6/10
│ Letra desbloqueada: N      │  Candado 4 dígitos → 1-9-1-2
│                           │───────────────────────────────────
│                           │  Prueba 6: "Código de Apagado"
│                           │  ~7 min · Dif 4/10
│ Letra desbloqueada: G      │  Cryptex 6 letras → T-U-R-I-N-G
└───────────────────────────┘
          │
          ▼
     ¡VICTORIA! → Debrief (10 min)
```

**Tiempo total:** 2 + 6 + 7 + 8 + 8 + 9 + 7 = **47 min** + 3 min margen = **50 min**

---

## 🧩 PRUEBAS DETALLADAS

---

### PRUEBA 1: "Real o Falso" — Deepfakes y Manipulación Multimedia
**Sala:** Laboratorio de EVA | **Dificultad:** 2/10 | **Duración:** ~6 min | **Letra:** T

#### Tema educativo
Las IA pueden generar imágenes, audios y textos falsos casi indistinguibles de la realidad.

#### Contenedor narrativo
**Carpeta negra etiquetada "CLASIFICADO — MUESTRA EVA-9"** sobre una mesa blanca. Dentro: tarjetas con imágenes y textos, instrucciones impresas de EVA-9.

#### Mecánica

**Tres capas:**
- **Qué ven:** Una carpeta negra con 12 tarjetas de imágenes/textos y un cryptex cerrado
- **Qué entienden:** EVA-9 les pide clasificar las tarjetas como reales o generadas por IA
- **Qué hacen:** Clasificar las 12 tarjetas, identificar las 6 falsificaciones peligrosas, leer el reverso para obtener el código FRAUDE

**Fase 1 — Clasificación (3 min):**
- 12 tarjetas físicas (aprox. 10×15 cm) con contenido visual:
  - 4 **fotos** (2 reales + 2 generadas por IA: rostros, paisajes)
  - 4 **titulares de noticias** (2 reales + 2 generados por IA)
  - 4 **capturas de chats** (2 reales + 2 generados por IA)
- Cada tarjeta tiene un reverso **blanco** (sin info)
- Los jugadores deben clasificar en 2 montones: "REAL" y "GENERADO POR IA"
- Hay 2 cajas etiquetadas en la mesa para clasificar
- Mesa de la sala tiene indicaciones impresas de EVA-9: *"Demuéstrame que sabéis distinguir la realidad de mis creaciones. Clasificad cada tarjeta. Las creaciones que más me preocupan — las que suplantan identidades ajenas — llevan mi marca roja. Esas son las verdaderamente peligrosas."*
- **Las 4 tarjetas de IA peligrosa tienen un BORDE ROJO** visible. Las 2 de IA neutral tienen borde negro. Las 6 reales no tienen borde especial.

**Fase 2 — Doble descubrimiento (3 min):**
- Al clasificar correctamente, miran el **reverso de las tarjetas "GENERADO POR IA"** (las 6 correctas)
- En el reverso de cada una hay una **letra grande**: F, A, K, E, X, X (2 son distractores)
- Las 4 que corresponden a IA **realmente peligrosa** (borde rojo — deepfake de persona, noticia falsa, chat suplantando identidad, clonación de voz) tienen las letras: **F-A-K-E**
- Las 2 restantes (IA neutral — borde negro: paisaje IA, texto informativo IA) tienen letras distractores (X, X)
- Los jugadores deben identificar las tarjetas con borde rojo (la pista de EVA-9 dice que esas son "las que suplantan identidades") y leer sus letras
- Los jugadores deben ordenar las letras y deducir la palabra → **FRAUDE**
- Introducen FRAUDE en el **cryptex de 6 letras** que está en la mesa

#### Roles (5-6 jugadores)
- 2 jugadores: clasifican fotos
- 2 jugadores: clasifican textos/titulares
- 1-2 jugadores: clasifican capturas de chat
- Todos juntos: deducen la palabra del reverso

#### Cierre
Cryptex de 6 letras → **FRAUDE**. Dentro del cryptex: nota con la **letra F** + nota de la Dra. Torres → "Buscad la HUELLA"

#### Origen lógico del código
Solo las tarjetas de IA **peligrosa** (borde rojo — suplantación) tienen letras útiles. EVA-9 lo indica en sus instrucciones: "las que suplantan identidades llevan mi marca roja". Los jugadores usan el borde rojo como indicador visual deducible narrativamente → las letras ordenadas por tipo (Fotos→Titulares→Chats) forman FRAUDE.

#### Pistas GM
| Nivel | Pista |
|-------|-------|
| 1 (sutil) | *"¿Han mirado bien los ojos y las manos en las fotos? ¿Y los titulares son demasiado perfectos? Volved a leer las instrucciones de EVA-9 — dijo algo sobre una marca..."* |
| 2 (directa) | *"EVA-9 dijo que las IA que suplantan identidades llevan su marca roja. Fijaos solo en las tarjetas con borde rojo y mirad el reverso"* |
| 3 (casi solución) | *"Las 6 tarjetas con borde rojo (IA que suplanta identidades) tienen letras: F, R (fotos), A, U (titulares), D, E (chats). El código es FRAUDE."* |

---

### PRUEBA 2: "Tu Huella Digital" — Datos Personales y Privacidad
**Sala:** Archivo de Datos | **Dificultad:** 3/10 | **Duración:** ~7 min | **Letra:** U

#### Tema educativo
Cada día compartimos datos personales sin saberlo. Esos datos alimentan sistemas de IA que toman decisiones sobre nosotros.

#### Contenedor narrativo
**Archivador metálico viejo** con 6 cajones. Cada cajón tiene un "expediente" de un perfil ficticio. Encima del archivador, un panel de corcho con hilos y chinchetas.

#### Mecánica

**Fase 1 — Exploración de perfiles (3 min):**
- 6 **expedientes físicos** (carpetas de cartón) en el archivador, cada uno con:
  - Nombre ficticio, edad, foto recortada de revista
  - Redes sociales (usuario, seguidores)
  - Últimas búsquedas
  - Compras online
  - Ubicaciones visitadas
  - App más usada + tiempo diario

  Ejemplo:
  ```
  PERFIL #3: MARCOS, 16 años
  - Instagram: @marcos_gamer_99 (1.2K seguidores)
  - Última búsqueda: "cómo hackear WiFi"
  - Ubicación: Instituto + centro comercial sábados
  - Compras: Auriculares gaming, Spotify
  - App más usada: TikTok (3.5h/día)
  - **FECHA CLAVE: 2014** — "Año de creación de Instagram — cuando las fotos se convirtieron en datos"
  ```

- Cada expediente tiene una **etiqueta de color** en la esquina (rojo, azul, verde, amarillo, naranja, morado)
- Cada expediente tiene una **fecha clave destacada en rojo** con una nota que explica qué hito de privacidad representa

**Fase 2 — Conexión con hilos (4 min):**
- En la mesa hay un **panel A3** impreso con 3 columnas:
  - Columna A: "¿Qué dato se expuso?" (10 tipos: ubicación, gustos, contactos, rutinas, compras, salud, passwords, fotos, relaciones, opiniones)
  - Columna B: "¿Quién lo recopiló?" (6 fuentes: app, red social, navegador, tienda online, GPS, IA)
  - Columna C: "¿Para qué se usa?" (6 usos: publicidad, recomendaciones, scoring, vigilancia, manipulación, perfilado)

- Los jugadores deben **conectar con hilos de colores** (los mismos colores que las etiquetas de expediente) desde cada dato del expediente hasta su fuente y uso
- Hay **6 hilos de colores** (uno por expediente) y chinchetas

- Al completar las conexiones correctamente, los hilos **tiran de 4 solapas ocultas** en el panel que revelan los 4 dígitos del código: **2, 0, 1, 8**. Los 6 expedientes son necesarios para completar todas las conexiones.
- Los expedientes 5 y 6 (Andrés y Elena) tienen datos necesarios para las conexiones 5 y 6. Sin completar las 6 conexiones, las solapas no se revelan.
- Las **fechas clave** de los expedientes confirman los dígitos revelados:
  - Perfil #1: Año del primer tweet del usuario → 201**2** → **2**
  - Perfil #2: Año del escándalo Cambridge Analytica → 202**0** → **0**
  - Perfil #3: Año de creación de Instagram → 201**4** → **1**
  - Perfil #4: Año de entrada en vigor del RGPD en Europa → 201**8** → **8**
  - Perfil #5: Año del primer GDPR europeo aprobado → 2016 (confirmación)
  - Perfil #6: Año de la LOPD en España → 2022 (confirmación)
  - Código: **PERFIL** (las letras ocultas bajo las tarjetas de fuente del panel)

  **Pista de EVA-9 en la sala:** *"Vuestras leyes intentaron ponerme freno. Cuatro años marcan el camino. El orden es el de vuestro número de expediente. Completad las conexiones del panel para ver la respuesta."*
  - Los jugadores que conozcan sobre datos personales reconocerán la temática. Los que no, deducen la palabra al ver las letras reveladas.

#### Roles (5-6 jugadores)
- Cada jugador toma 1 expediente y lo analiza
- 1-2 jugadores dirigen las conexiones en el panel
- Todos verifican que los años encajan

#### Cierre
Tablet password → **PERFIL**. Dentro de la caja: nota con la **letra U** + nota de la Dra. Torres → "Buscad la BÁSCULA"

#### Doble descubrimiento
1. Conectar datos con fuentes y usos en el panel (las tarjetas de fuente revelan letras)
2. Las 6 letras leídas en orden forman PERFIL — lo que EVA-9 construye con vuestros datos

#### Pistas GM
| Nivel | Pista |
|-------|-------|
| 1 (sutil) | *"Cada expediente tiene una fecha clave. Completad las conexiones del panel con los 6 hilos — las tarjetas de fuente ocultan algo."* |
| 2 (directa) | *"Conectad los 6 expedientes con sus fuentes correctas usando los hilos. Al colocar cada tarjeta de fuente, una letra queda visible. Leed las 6 letras en orden."* |
| 3 (casi solución) | *"Conectad los 6 expedientes con sus fuentes. Las letras de las tarjetas de fuente, leídas en orden, forman P-E-R-F-I-L. El password es PERFIL."* |

---

### PRUEBA 3: "Justicia Algorítmica" — Sesgos en la IA
**Sala:** Sala de Evaluación | **Dificultad:** 4/10 | **Duración:** ~8 min | **Letra:** R

#### Tema educativo
La IA aprende de datos humanos con sesgos. Si nuestros datos tienen sesgos, la IA los amplifica.

#### Contenedor narrativo
**Carpeta beige etiquetada "SISTEMA DE EVALUACIÓN EVA-9 — CANDIDATOS"** sobre un podio/atrio. Contiene fichas de candidatos. Al lado: **tablero de selección** (panel magnético o de corcho con casillas).

#### Mecánica

**Fase 1 — Detectar el sesgo (4 min):**
- 8 **fichas de candidatos** (tarjetas A5), cada una con:
  - Nombre, formación, experiencia, edad, género, barrio
  - Puntuación de EVA-9 (del 1 al 10)
  - Observación de EVA-9 (comentario generado)

- La puntuación de EVA-9 está **sesgada**: sistemáticamente más baja para mujeres, barrios "desfavorecidos" y >45 años

- Los jugadores deben comparar **parejas de candidatos** con formación/experiencia similares pero puntuaciones diferentes:
  - Par 1: Alejandro (9/10, barrio centro, hombre, 28) vs. Lucía (6/10, barrio sur, mujer, 28, misma formación)
  - Par 2: Roberto (8/10, centro, 35) vs. Carmen (5/10, barrio norte, mujer, 35)
  - Par 3: Miguel (7/10, centro, 42) vs. Antonio (4/10, barrio este, 52)
  - Par 4: Ana (8/10, centro, mujer, 30) vs. Víctor (5/10, barrio sur, hombre, 48)

- Hay un **formulario impreso** con la pregunta: *"¿Qué criterios está usando EVA-9 para puntuar?"* con checkboxes

**Fase 2 — Corregir el sistema (4 min):**
- Hay 6 **fichas de criterio** (tarjetas grandes) en la mesa:
  - ✅ Formación académica (justo)
  - ✅ Experiencia profesional (justo)
  - ❌ Género (sesgado)
  - ❌ Barrio de residencia (sesgado)
  - ❌ Edad (sesgado)
  - ❌ "Distancia al centro" (proxy de nivel económico — sesgado oculto)

- Los jugadores deben **eliminar** las 4 fichas sesgadas (incluida la trampa "distancia al centro")
- Al retirar cada ficha sesgada, el reverso muestra una letra:
  - Género → **S**
  - Barrio → **O**
  - Edad → **L**
  - Distancia al centro → **O**
  - Las 2 fichas justas (Formación, Experiencia) no tienen letra relevante en el reverso

- Al retirar las 4 fichas sesgadas, se revela un **sobre sellado con lacre** con una llave física dentro

#### Roles (5-6 jugadores)
- 2 jugadores: analizan parejas de candidatos
- 2 jugadores: debaten cuáles son sesgados
- 1-2 jugadores: retiran fichas y leen el reverso

#### Cierre
Al eliminar los 4 criterios sesgados, se revela un **sobre sellado con lacre** oculto detrás de las fichas. Dentro: **llave física** que abre la caja con la **letra R** + nota de la Dra. Torres → "Buscad el TELÉFONO ANTIGUO"

#### Doble descubrimiento
1. Detectar el patrón de discriminación en los candidatos
2. La trampa "distancia al centro" = proxy de sesgo → eliminarla es necesaria para revelar completamente el sobre con la llave

#### Pistas GM
| Nivel | Pista |
|-------|-------|
| 1 (sutil) | *"Comparad candidatos con la misma formación pero diferente puntuación. ¿Qué tienen de diferente?"* |
| 2 (directa) | *"EVA-9 usa 6 criterios. Eliminad los 4 que no deberían importar para un trabajo. Cuidado con 'distancia al centro'"* |
| 3 (casi solución) | *"Quitad género, barrio, edad y distancia. Detrás de las fichas hay un sobre sellado con una llave dentro."* |

---

### PRUEBA 5: "Sin Móvil" — Dependencia Tecnológica
**Sala:** Zona Analógica | **Dificultad:** 5/10 | **Duración:** ~8 min | **Letra:** I

#### Tema educativo
Dependemos de la tecnología para lo más básico. ¿Qué pasa cuando desaparece?

#### Contenedor narrativo
**Caja de madera vieja etiquetada "KIT DE EMERGENCIA — SIN RED"** en el centro de la sala. Dentro: herramientas analógicas y 5 sobres con retos. La sala tiene estética vintage: mapas, libros, objetos antiguos.

#### Mecánica

**5 retos analógicos cooperativos** con estructura ramificada (3 ramas paralelas → 2 finales):

**RAMA A (disponible desde el inicio, 2 jugadores):**
1. **"Navega sin GPS"**: Mapa de papel de una ciudad en la pared + tarjeta con dirección. Deben trazar la ruta a pie y contar las **calles que cruzan** → resultado: 7

**RAMA B (disponible desde el inicio, 2 jugadores):**
2. **"Calcula sin calculadora"**: Hoja con 4 operaciones matemáticas que deben resolver a mano → resultado: 240

**RAMA C (necesita resultado de A+B, 1-2 jugadores):**
3. **"Busca sin Google"**: Libro de enciclopedia en la estantería con páginas marcadas con pestañas. La nota de EVA-9 dice: 'La página la dan los que navegan y los que calculan.' Los jugadores suman: 7 + 240 = **página 247**. Deben encontrar la respuesta a una pregunta en esa página → palabra: **Turing**

**RETOS FINALES (necesitan resultado de C):**
4. **"Escribe sin autocorrector"**: Dictado de una frase con faltas de ortografía intencionadas. Deben escribirla correctamente → las letras corregidas forman parte del código
5. **"Comunícate sin WhatsApp"**: Un jugador tiene un mensaje cifrado (código César simple). Debe descifrarlo y transmitirlo verbalmente al resto del equipo que lo escribe

**El código** del candado se obtiene descifrando el **mensaje César** del reto 5B: **'TODO EMPEZO EN 2007'** (código: 2007).

**Principio respetado:** 2-3 equipos trabajan simultáneamente desde el inicio. Nadie espera pasivamente.

El **candado numérico** (código 2007) cierra la caja que contiene la **letra I** + la nota de la Dra. Torres.

#### Doble descubrimiento
1. Resolver los retos analógicos secuencialmente (cooperación)
2. El último reto (César) descifra "TODO EMPEZO EN 2007" — el año que cambió la dependencia móvil

#### Roles (5-6 jugadores)
- **Equipo Navegación** (2 jugadores): traza ruta en mapa (reto 1) → luego escribe dictado (reto 4)
- **Equipo Cálculo** (2 jugadores): resuelve operaciones (reto 2) → luego busca en enciclopedia (reto 3)
- **Equipo Descifrado** (2 jugadores): coopera con ambos equipos → descifra código César (reto 5)
- Los equipos de Navegación y Cálculo trabajan **en paralelo** desde el inicio

#### Cierre
Candado numérico de 4 dígitos → **2007** (año del iPhone) → contiene **letra I** + nota Dra. Torres → "Buscad el CEREBRO"

#### Pistas GM
| Nivel | Pista |
|-------|-------|
| 1 (sutil) | *"Los primeros 3 sobres se abren a la vez. Dos equipos pueden trabajar en paralelo. Comunicad los resultados entre equipos."* |
| 2 (directa) | *"El equipo de cálculo suma su resultado (240) con el de navegación (7) = 247. Esa es la página de la enciclopedia."* |
| 3 (casi solución) | *"Página 247 → 'Turing'. Dictado → H,A,C,E → César +3. Mensaje: 'WRGR HPSHCR HQ 2007' → 'TODO EMPEZO EN 2007'. Código: 2007."* |

---

### PRUEBA 4: "El Interrogatorio" — Test de Turing
**Sala:** Núcleo de EVA | **Dificultad:** 6/10 (pico) | **Duración:** ~9 min | **Letra:** N

#### Tema educativo
El Test de Turing: ¿podemos distinguir una IA de un humano por cómo responde?

#### Contenedor narrativo
**Carpeta roja etiquetada "TRANSCRIPCIÓN DE INTERROGATORIO — PROTOCOLO TURING"** sobre una mesa central con luz directa. Tres **carpetas de colores** (A: azul, B: verde, C: naranja) representan las tres entidades.

#### Mecánica

**Fase 1 — El interrogatorio (5 min):**
- 3 **transcripciones impresas** de conversaciones (entidad A, B, C)
- Cada transcripción tiene **8 preguntas y respuestas** sobre temas variados (música, comida, recuerdos, emociones, opiniones)
- Los jugadores deben leer las transcripciones y determinar:
  - ¿Quién es la IA? (Entidad A)
  - ¿Quién es el humano? (Entidad B)
  - ¿Quién es el híbrido? (Entidad C — IA con supervisión humana)

- **Pistas en las transcripciones:**
  - **Entidad A (IA):** Respuestas perfectas, gramática impecable, sin dudas, no usa muletillas, respuestas demasiado elaboradas y completas, carece de opinión personal real (responde con datos objetivos siempre)
  - **Entidad B (Humano):** Comete errores ortográficos, usa "mmm", "no sé", tiene opiniones inconsistentes, humor, respuestas cortas a veces
  - **Entidad C (Híbrido):** Mezcla — errores deliberados pero demasiado consistentes, a veces responde como IA (perfecto) y a veces como humano

**Fase 2 — El veredicto (4 min):**
- Un **formulario impreso** "VEREDICTO TURING" donde marcan:
  - Entidad ___ es IA
  - Entidad ___ es HUMANO
  - Entidad ___ es HÍBRIDO

- Al marcar correctamente, el formulario tiene una sección oculta (plegada) con instrucciones:
  - *"PROTOCOLO DE EXTRACCIÓN: Si habéis identificado correctamente quién es quién, buscad la respuesta a la PREGUNTA 8 en cada transcripción. Coged la PRIMERA LETRA de cada respuesta, en orden de entidad (A→B→C)... pero faltar\u00e1 una letra. La cuarta letra es la inicial del APELLIDO de quien propuso todo esto."*
  - Transcripción A, pregunta 8: respuesta empieza con **A** ("Algoritmicamente...")
  - Transcripción B, pregunta 8: respuesta empieza con **L** ("Lo que más me flipa...")
  - Transcripción C, pregunta 8: respuesta empieza con **A** ("A veces me fascina...")
  - Cuarta letra: ¿quién propuso este test? → inicial del **apellido** de Turing → **N**
  - Código: **1-9-1-2** (año de nacimiento de Alan Turing, mencionado por la IA)

- Dentro de la caja que abre el candado: **letra N** + sobre con mensaje cifrado de EVA-9 (para prueba 6) + nota de la Dra. Torres: *"EVA-9 dej\u00f3 un mensaje final cifrado. Descifrarlo os dar\u00e1 la \u00faltima pieza. \u00a1R\u00e1pido!"*

#### Doble descubrimiento
1. Identificar quién es IA/humano/híbrido por el estilo de las respuestas
2. La IA menciona datos históricos con precisión (Turing nació en 1912) que el humano no conoce → 1-9-1-2

#### Roles (5-6 jugadores)
- 2 jugadores: leen transcripción A
- 2 jugadores: leen transcripción B
- 1-2 jugadores: leen transcripción C
- Todos debaten y votan

#### Cierre
Candado numérico de 4 dígitos → **1-9-1-2**. Dentro: **letra N** + sobre con mensaje cifrado EVA-9 (prueba 6)

#### Pistas GM
| Nivel | Pista |
|-------|-------|
| 1 (sutil) | *"\u00bfQui\u00e9n responde DEMASIADO bien? \u00bfY qui\u00e9n tiene dudas, errores, cosas humanas? Leed entre l\u00edneas. Y fijaos en la pregunta 8 de cada transcripci\u00f3n"* |
| 2 (directa) | *"La entidad A es la IA, B es humana, C es h\u00edbrida. Marcad el formulario, desplegad la secci\u00f3n oculta y buscad las primeras letras de las respuestas a la pregunta 8"* |
| 3 (casi solución) | *"Marcad A=IA, B=HUMANO, C=HÍBRIDO. La IA menciona en la pregunta 5 que Turing nació en 1912. El código es 1912."* |

---

### PRUEBA 6: "Código de Apagado" — Composición Final
**Sala:** Núcleo de EVA (misma sala) | **Dificultad:** 5/10 | **Duración:** ~7 min | **Letra:** G

#### Tema educativo
La alfabetización digital es la herramienta fundamental. El código eres tú.

#### Contenedor narrativo
**Tablet sobre podio** en el centro de la sala, junto a una **caja de seguridad negra** con candado numérico. Al lado, un **panel de corcho** con 6 pinzas donde colocar las letras.

#### Mecánica

**Fase 0 — Ganar la G (~2 min):**
- Al abrir la caja del candado 1912 (prueba 5), los jugadores encuentran:
  - La **letra N** (recompensa de la prueba 5)
  - Un **sobre** con un mensaje cifrado de EVA-9 y una nota de la Dra. Torres: *"EVA-9 dejó un mensaje final cifrado. Descifrarlo os dará la última pieza. Cada letra se desplaza una posición hacia atrás en el abecedario."*
  - El mensaje cifrado usa **código César +1** (eco de la prueba 4): cada letra se desplaza una posición hacia adelante para cifrar, hacia atrás para descifrar
  - Mensaje cifrado: **"HBOBTUFJT. MB QSJNFSB MFUSB FT MB DMBWF. H"**
  - Mensaje descifrado: **"GANASTEIS. LA PRIMERA LETRA ES LA CLAVE. G"**
  - La **letra G** es la primera letra del mensaje descifrado ("GANASTEIS") — también aparece al final del mensaje explícitamente
  - **Sin descifrar, no hay G**. No está en ningún sobre ni reverso — solo en el mensaje.

**Fase 1 — Componer (3 min):**
- Los jugadores ahora tienen las 6 letras: **T, U, R, I, N, G**
- Hay un **panel con 6 pinzas** numeradas (1-6) donde colocar cada letra
- Sobre la mesa hay **pistas contextuales** que ayudan a ordenar:
  - La nota de EVA-9 de la Sala 1: *"El primer código fue FRAUDE. La **F** fue vuestra primera victoria."* → F es la 1ª
  - La nota del Archivo: *"La **U** de Único — vuestra huella digital, vuestra singularidad"* → U es la 2ª
  - Nota de Evaluación: *"La **R** de Razón — lo que les falta a los algoritmos"* → R es la 3ª
  - Nota de la Zona Analógica: *"La **I** de Individuo — lo que ningún algoritmo puede ser"* → I es la 4ª
  - Nota del Interrogatorio: *"La **N** de No — la palabra más importante que podéis decirle a una IA"* → N es la 4ª
  - La **G** obtenida al descifrar el mensaje de EVA-9 → G es la 6ª

**Fase 2 — Activar (3 min):**
- Los jugadores ordenan **T-U-R-I-N-G** en el panel
- Deben leer la palabra en voz alta (momento de energía)
- Introducen **TURING** como password en la tablet
- La pantalla de EVA-9 muestra: *"Bien jugado, humanos. Pero antes de apagarme, respondedme esto: ¿Qué soy yo?"*
- Los jugadores deben deducir la respuesta: **HUMANO**
- Pistas contextuales: EVA-9 siempre llama a los jugadores "humanos", la Dra. Torres habla de "inteligencia humana", el Test de Turing (Prueba 4) trata de distinguir IA de humano
- Introducen **HUMANO** como segundo password
- La pantalla revela el **código numérico** del candado final

**Fase 3 — Candado final (1 min):**
- Los jugadores abren el candado numérico
- Dentro de la caja hay un **sobre final**:

  > *"EVA-9 — Último mensaje generado:*
  >
  > *'Bien jugado, humanos. Reconozco que hay cosas que yo no puedo calcular: vuestra intuición, vuestra ética, vuestra capacidad de dudar.*
  >
  > *Me llamáis IA, pero no soy inteligente. Soy una herramienta. Y vosotros... vosotros sois humanos. Eso lo teníais claro desde el principio. Pero necesitasteis vivenciar cada letra para entender por qué.*
  >
  > *La próxima IA que encontréis puede que no tenga un botón de apagado. Usadlo sabiamente.*
  >
  > *— EVA-9, desactivándose'"*

- **Nota final de la Dra. Torres:**
  > *"¡Lo habéis conseguido! EVA-9 está offline. Habéis demostrado que la inteligencia humana va más allá de los algoritmos. Ahora: compartid lo que habéis aprendido. El mundo os necesita críticos, curiosos y valientes."*

#### Doble descubrimiento
1. Descifrar el mensaje final de EVA-9 (César +1) para ganar la G
2. Componer TURING → responder HUMANO → obtener código del candado final

#### Cierre
Tablet password (TURING → HUMANO) + candado numérico. Dentro: mensaje de despedida de EVA-9

#### Pistas GM
| Nivel | Pista |
|-------|-------|
| 1 (sutil) | *"Primero descifrad el mensaje de EVA-9 (es un código César sencillo, como en la Sala 5). La primera letra del mensaje descifrado es la que buscáis. Luego, cada nota de la Dra. Torres os dice qué posición ocupa cada letra. Cuando EVA-9 os pregunte qué es... pensad en todo lo que habéis vivido."* |
| 2 (directa) | *"El mensaje cifrado es César +1. El mensaje descifrado empieza por G. Las notas mencionan: T=1ª, U=2ª, R=3ª, I=4ª, N=5ª, G=6ª. Escribid TURING en la tablet. Cuando pregunte '¿Qué soy yo?', la respuesta es HUMANO."* |
| 3 (casi solución) | *"Primer password: TURING. Cuando pregunte '¿Qué soy yo?', escribid HUMANO. La pantalla os dará el código del candado final."* |

---

## 🔐 RESUMEN DE CIERRES

| # | Prueba | Cierre | Código | Origen lógico |
|---|--------|--------|--------|---------------|
| 1 | Real o Falso | Cryptex 6 letras | F-R-A-U-D-E | Reverso de tarjetas IA peligrosa (borde rojo), ordenadas por tipo |
| 2 | Tu Huella Digital | Tablet password | PERFIL | Letras ocultas bajo tarjetas de fuente del panel (P-E-R-F-I-L) |
| 3 | Justicia Algorítmica | Llave física | — | Se revela al eliminar los 4 criterios sesgados |
| 5 | Sin Móvil | Candado 4 dígitos | 2-0-0-7 | Mensaje César descifrado: 'TODO EMPEZO EN 2007' |
| 4 | El Interrogatorio | Candado 4 dígitos | 1-9-1-2 | Año de nacimiento de Turing, mencionado por la IA |
| 6 | Código de Apagado | Tablet + candado numérico | TURING→HUMANO | Tablet password TURING → respuesta HUMANO → código numérico |

**Distribución:** 1 cryptex + 2 candados numéricos + 1 llave + 2 tablets = ✅ Variedad

---

## 📊 TIEMPOS POR PRUEBA

| Prueba | Dificultad | Tiempo estimado |
|--------|------------|-----------------|
| 1. Real o Falso | 2/10 | 6 min |
| 2. Tu Huella Digital | 3/10 | 7 min |
| 3. Justicia Algorítmica | 5/10 | 8 min |
| 5. Sin Móvil | 5/10 | 8 min |
| 4. El Interrogatorio | 6/10 | 9 min |
| 6. Código de Apagado | 5/10 | 7 min |
| **Briefing** | — | 2 min |
| **Márgen** | — | 3 min |
| **TOTAL** | **2→3→5→5→6→5** | **~50 min** |

---

## 👻 ROL DEL GM

### NO hace:
- ❌ Guía jugadores entre salas
- ❌ Explica mecánicas
- ❌ Ofrece pistas sin que se le pida

### SÍ hace:
- ✅ Da briefing inicial (lee cartel del Protocolo Touring)
- ✅ Abre puertas con llave cuando completan prueba
- ✅ Da pistas SOLO cuando se le piden (3 niveles)
- ✅ Cronometra (aviso a los 40 min: "¡10 minutos!")
- ✅ Resuelve problemas técnicos
- ✅ Supervisa fair play
- ✅ Conduce debrief post-juego

---

## ✅ CHECKLIST DE VALIDACIÓN

### Estructura
- [x] 6 pruebas en 5 salas
- [x] Curva de dificultad: 2→3→5→5→6→5
- [x] Variedad de cierres (máx 2 del mismo tipo)
- [x] Variedad de mecánicas (clasificación, conexión, deducción, cooperación, transcripción, composición)
- [x] Código final con origen lógico deducible

### Por cada prueba
- [x] ¿4-6 jugadores activos simultáneamente? ✅ (ver Roles en cada prueba)
- [x] ¿Doble descubrimiento? ✅ (ver "Doble descubrimiento" en cada prueba)
- [x] ¿Contenedor con sentido narrativo? ✅ (carpeta, archivador, caja, etc.)
- [x] ¿Mecánica refleja temática? ✅ (deepfakes, datos, sesgos, dependencia, Turing)
- [x] ¿Audio ≤60s? ✅ (no hay audio en v2, todo impreso)
- [x] ¿3 niveles de pistas? ✅
- [x] ¿Código con origen lógico? ✅

### Coherencia v2
- [x] Sin Raspberry Pi / servidor
- [x] Sin sincronización entre tablets
- [x] Sin pantallas grandes
- [x] Sin altavoces Bluetooth / TTS
- [x] Sin maglocks
- [x] Tablets como apoyo mínimo (solo Sala 1 si acaso)
- [x] Físico > Digital
- [x] 6 pruebas (estándar del proyecto)
- [x] 50 minutos (dentro de 45-55)
- [x] Presupuesto ~120€ (dentro de 100-150€)
- [x] GM abre puertas manualmente
- [x] EVA-9 solo en documentos impresos
- [x] Cartas de navegación entre salas
- [x] Símbolos en puertas

---

*Test de Touring v3 — Diseño Completo — 13 Abril 2026*

## 📝 Changelog v2.3 (13 Abril 2026)

| # | Cambio | Prueba | Detalle |
|---|--------|--------|---------|
| 1 | Candado → Tablet | P2 | Huella Digital: candado 2018 → tablet password PERFIL. Letras P-E-R-F-I-L ocultas bajo tarjetas de fuente del panel. |
| 2 | Candado → Llave | P3 | Justicia Algorítmica: candado SOLO → llave física en sobre sellado. Se revela al eliminar los 4 criterios sesgados. |
| 3 | Llave → Candado | P4 | Sin Móvil: llave física → candado numérico 2007. Código César descifrado: 'TODO EMPEZO EN 2007'. |
| 4 | Candado letras → Candado numérico | P5 | Interrogatorio: candado ALAN → candado numérico 1912. La IA menciona el año de nacimiento de Turing en pregunta 5. |
| 5 | Distribución actualizada | Global | 2 cryptex + 3 candados numéricos + 1 llave + 1 tablet. Sin candados de letras. |
| 6 | Curva mantenida | Global | 2→3→4→5→6→4. Los cambios de mecánica de cierre no alteran la dificultad de los puzzles. |

---

*Test de Touring v3 — Diseño Completo — 13 Abril 2026*

## 📝 Changelog v3 (13 Abril 2026)

| # | Cambio | Prueba | Detalle |
|---|--------|--------|---------|
| 1 | Cryptex 4→6 letras, FAKE→FRAUDE | P1 | 6 tarjetas de IA peligrosa (2 por tipo) con letras F,R,A,U,D,E. Orden por tipo: Fotos→Titulares→Chats. Letra T→F. |
| 2 | Cryptex→Tablet+candado | P6 | Cierre cambiado de cryptex TURING a tablet (TURING→HUMANO) + candado numérico. Dificultad 4→5. |
| 3 | Curva actualizada | Global | 2→3→5→5→6→5. P3 dificultad 4→5. |

---

*Test de Touring v2.2 — Diseño Completo — 8 Abril 2026*
*Principios: Físico > Digital · Doble descubrimiento · Todo el equipo activo · ~120€ presupuesto*

---

## 📝 Changelog v2.2 (8 Abril 2026)

| # | Correccion | Prueba | Cambio |
|---|------------|--------|--------|
| 1 | Codigo ALAN arreglado | 005 | Pregunta 8 cambiada, respuestas empiezan por A-L-A. Formulario: cuarta letra = inicial del apellido de Turing |
| 2 | Hilos ahora esenciales | 002 | Al completar las 6 conexiones, los hilos revelan 4 solapas ocultas con los digitos del codigo |
| 3 | Pista RGPD oscurecida | 002 | EVA-9 ya no menciona RGPD directamente. Pista mas critptica |
| 4 | Expedientes 5-6 utiles | 002 | Expedientes 5 y 6 ahora tienen fechas clave y son necesarios para completar conexiones |
| 5 | Prueba 4 paralela | 004 | Rediseñada de secuencial a ramificada: retos 1A, 2A, 3A simultaneos. Todo el equipo activo |
| 6 | G con merito real | 006 | G se obtiene SOLO descifrando el mensaje Cesar ('GANASTEIS...'). No esta en el reverso del sobre |
| 7 | Hilo conductor españolizado | Todas | Truth->Verdad, Uncommons->Unico. Todos los significados en español |
| 8 | EVA-9 voz unificada | Todas | Cambiado a 'vosotros' para jovenes españoles |
| 9 | Par 4 muestra sesgo genero | 003 | Vera (M) -> Victor (H). Ahora Ana vs Victor muestra sesgo de genero |
| 10 | Notas posicionales definidas | 1-5 | Cada nota de la Dra. Torres incluye posicion explicita de la letra |
| 11 | Residuos v1 corregidos | Varios | LOGISTICA, lista-materiales, VALIDACION actualizados |

---

## 🎭 Mapa Emocional

| Prueba | Emoción objetivo | Justificación |
|--------|----------------|---------------|
| 1. Real o Falso | Curiosidad | "¿Seré capaz de detectar lo falso?" — descubrimiento inicial |
| 2. Huella Digital | Inquietud | "¿Cuánto saben de mí?" — las fichas de datos personales generan incomodidad |
| 3. Justicia Algorítmica | Indignación | "¡Esto no es justo!" — detectar sesgos provoca reacción emocional |
| 5. Sin Móvil | Frustración → Diversión | Bloqueo inicial sin móvil → liberación al resolver retos analógicos |
| 4. El Interrogatorio | Tensión | "¿Quién es la IA?" — la prueba más difícil genera presión |
| 6. Código de Apagado | Triunfo | "¡Lo logramos!" — componer TURING es la recompensa emocional |

**Regla:** Las emociones alternan y suben en intensidad hasta el clímax (P5), luego resuelven (P6).

---

## 👥 Perfiles que Destacan por Prueba

| Prueba | Perfil 1 | Perfil 2 | Por qué |
|--------|----------|----------|---------|
| 1. Real o Falso | Observador | Analista | Detecta detalles visuales en fotos / Deduce patrones de clasificación y orden por tipo |
| 2. Huella Digital | Buscador | Conector | Encuentra datos en expedientes / Relaciona información entre fichas |
| 3. Justicia Algorítmica | Analista | Crítico | Detecta sesgos en criterios / Cuestiona lógica de evaluación |
| 5. Sin Móvil | Líder | Práctico | Coordina los 5 retos del equipo / Resuelve físicamente (nudos, etc.) |
| 4. El Interrogatorio | Lector | Debateador | Procesa transcripciones largas / Argumenta posiciones A/B/C |
| 6. Código de Apagado | Memorista | Sintetizador | Recuerda las 6 letras de pruebas anteriores | Compone TURING |

---

## 🛡️ Plan de Contingencia

| Prueba | Pieza crítica | Si se pierde... | Protocolo GM |
|--------|--------------|----------------|--------------|
| 1 | Letra F (en caja del cryptex) | GM da la letra como "registro recuperado de EVA-9" | Anotar letra en pizarra del grupo |
| 1 | Tarjeta de imagen | GM dice "una se dañó en el experimento" y describe la imagen | Grupo sigue con las demás |
| 2 | Hilo de conexión | GM da cinta adhesiva o indica visualmente las conexiones | Sin cambio de dificultad |
| 2 | Expediente | GM lee el contenido del expediente perdido | Grupo sigue conectando datos |
| 3 | Fichas de criterio | GM indica cuáles eliminar | Sin cambio de dificultad |
| 4 | Sobre con llave (P3) | GM tiene repuesto en su kit | Entregar sin comentarios |
| 4 | Elemento de reto físico (cuerda, etc.) | GM da alternativa o simplifica el reto | "El sistema de EVA dañó este componente" |
| 5 | Transcripción | GM lee la parte que falta | Grupo sigue debatiendo |
| 6 | Cryptex 6 letras | GM abre manualmente y da código | Grupo lee mensajes de despedida igualmente |
| Cualquiera | Letra acumulada | GM recuerda al grupo las letras obtenidas | "EVA-9 muestra las letras en su pantalla" |

**Kit de emergencia GM:** Repuesto de cada letra (T, U, R, I, N, G) + llave de repuesto P4 + copia de cada transcripción P5.

---

## 👁️ Jerarquía Visual por Sala

### Sala 1: Laboratorio de EVA
| Elemento | Tipo | Nota |
|----------|------|------|
| Carpeta negra "CLASIFICADO" | ✅ Pista | Contiene tarjetas + instrucciones |
| 12 tarjetas de imágenes | ✅ Pista | Contenido del puzzle |
| Nota de la Dra. Torres | ✅ Pista | Carta de navegación |
| Etiqueta "Protocolo Touring" en puerta | ✅ Pista | Identifica la sala |
| Cartel de advertencia EVA-9 | 🎨 Decorado | Ambientación |
| Papel de laboratorio | 🎨 Decorado | Ambientación |

### Sala 2: Archivo de Datos
| Elemento | Tipo | Nota |
|----------|------|------|
| Archivador con expedientes | ✅ Pista | Contiene datos del puzzle |
| Panel con hilos | ✅ Pista | Mecánica de conexión |
| Nota de la Dra. Torres | ✅ Pista | Carta de navegación |
| Símbolo HUELLA en puerta | ✅ Pista | Identifica la sala |
| Carpetas genéricas | 🎨 Decorado | Ambientación |
| Etiquetas de "ARCHIVO" | 🎨 Decorado | Ambientación |

### Sala 3: Sala de Evaluación
| Elemento | Tipo | Nota |
|----------|------|------|
| Fichas de candidatos | ✅ Pista | Contenido del puzzle |
| Fichas de criterios | ✅ Pista | Contenido del puzzle |
| Carpeta de evaluación | ✅ Pista | Instrucciones |
| Nota de la Dra. Torres | ✅ Pista | Carta de navegación |
| Símbolo BÁSCULA en puerta | ✅ Pista | Identifica la sala |
| Pizarra de evaluaciones | 🎨 Decorado | Ambientación |

### Sala 4: Núcleo de EVA (Interrogatorio)
| Elemento | Tipo | Nota |
|----------|------|------|
| Caja "KIT EMERGENCIA" | ✅ Pista | Contiene retos |
| Sobre sellado con llave | ✅ Pista | Recompensa |
| Nota de la Dra. Torres | ✅ Pista | Carta de navegación |
| Símbolo TELÉFONO en puerta | ✅ Pista | Identifica la sala |
| Objetos analógicos decorativos | 🎨 Decorado | Ambientación (no interactivos) |

### Sala 5: Zona Analógica (Sin Móvil)
| Elemento | Tipo | Nota |
|----------|------|------|
| Carpeta roja de interrogatorio | ✅ Pista | Transcripciones |
| Tablet | ✅ Pista | Password TURING→HUMANO |
| Notas de la Dra. Torres | ✅ Pista | Orden de letras |
| Símbolo CEREBRO en puerta | ✅ Pista | Identifica la sala |
| Pantalla/carteles de EVA-9 | 🎨 Decorado | Ambientación |
| Luces LED o cables decorativos | 🎨 Decorado | Ambientación |

---

## 📋 Design Compliance Matrix

| Prueba | Objetivo educativo | Input | Mecanismo | Output | Conexión | Pista clave | Solución |
|--------|-------------------|-------|-----------|--------|----------|-------------|----------|
| 1 | Detectar deepfakes | 12 tarjetas + instrucciones EVA-9 | Clasificar real/IA, leer reverso | Letra F + código FRAUDE | Nota → "Buscad la HUELLA" | Borde rojo en tarjetas peligrosas | FRAUDE → cryptex 6 letras |
| 2 | Datos personales | Expedientes + panel hilos | Conectar datos, revelar letras | Letra U + código PERFIL | Nota → "Buscad la BÁSCULA" | Tarjetas fuente revelan P-E-R-F-I-L | PERFIL → tablet |
| 3 | Sesgos algorítmicos | Fichas candidatos + criterios | Eliminar criterios sesgados, revelar sobre | Letra R + llave física | Nota → "Buscad el TELÉFONO" | Género/barrio/edad/distancia discriminan | Sobre sellado → llave → caja |
| 4 | Dependencia tecnológica | Caja KIT + 5 retos | Resolver retos analógicos secuenciales | Letra I + código 2007 | Nota → "Buscad el CEREBRO" | Cada resultado desbloquea el siguiente | César → 2007 → candado |
| 5 | Test de Turing | Transcripciones + formulario | Identificar IA/humano/híbrido, dato histórico | Letra N + código 1912 | — | IA menciona Turing nació en 1912 | 1912 → candado |
| 6 | Alfabetización digital | 6 letras + mensaje cifrado EVA-9 | Descifrar César +1, ordenar letras, responder HUMANO | Código TURING→HUMANO → Victoria | — | Notas Dra. Torres dan el orden | TURING → tablet → HUMANO → candado |
