// La Biblioteca Maldita v2 — Documento de Diseño
// Generado por Escapeitor

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE COLORES
// ═══════════════════════════════════════════════════════════════

#let color_principal = rgb("#5C4033")
#let color_secundario = rgb("#D4AF37")
#let color_principal_claro = color_principal.lighten(20%)
#let color_principal_oscuro = color_principal.darken(20%)
#let gris_oscuro = rgb("#2D2D2D")
#let gris_claro = rgb("#F5F5F5")

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN DEL DOCUMENTO
// ═══════════════════════════════════════════════════════════════

#set document(
  title: "La Biblioteca Maldita",
  author: "Escapeitor",
  keywords: ("escape room", "investigación", "biblioteca", "misterio")
)

#set page(
  paper: "a4",
  margin: (x: 2cm, y: 2.5cm),
  numbering: "1",
  footer: align(center, text(size: 9pt, fill: color_principal, [
    La Biblioteca Maldita | El bibliotecario dejó un libro abierto. Nunca debisteis leerlo.
  ]))
)

#set text(
  font: ("Libertinus Serif", "DejaVu Sans", "Noto Sans", "FreeSans"),
  size: 11pt,
  fill: gris_oscuro
)

#set par(justify: true, leading: 0.6em)
#set heading(numbering: "1.")

// ═══════════════════════════════════════════════════════════════
// ESTILOS DE ENCABEZADOS
// ═══════════════════════════════════════════════════════════════

#show heading.where(level: 1): it => {
  set align(left)
  set text(size: 20pt, fill: color_principal_oscuro, weight: "bold")
  it
  v(0.5em)
}

#show heading.where(level: 2): it => {
  set text(size: 16pt, fill: color_principal, weight: "bold")
  it
  v(0.3em)
}

#show heading.where(level: 3): it => {
  set text(size: 13pt, fill: color_principal_claro, weight: "semibold")
  it
  v(0.2em)
}

// ═══════════════════════════════════════════════════════════════
// BLOQUES REUTILIZABLES
// ═══════════════════════════════════════════════════════════════

#let info_box(title, content) = {
  block(
    fill: color_principal_claro.lighten(80%),
    stroke: color_principal + 1pt,
    radius: 4pt,
    inset: 8pt
  )[
    #text(weight: "bold", fill: color_principal_oscuro)[#title]
    #v(0.3em)
    #content
  ]
}

#let alert_box(content) = {
  block(
    fill: rgb("#FFF3CD"),
    stroke: rgb("#FFC107") + 2pt,
    radius: 4pt,
    inset: 8pt
  )[
    #content
  ]
}

#let quote_box(author, content) = {
  align(left,
    block(
      fill: gris_claro,
      stroke: color_principal + 2pt,
      radius: 4pt,
      inset: 12pt
    )[
      #text(style: "italic", fill: gris_oscuro)[
        "#content"
      ]
      #v(0.3em)
      #text(size: 10pt, fill: color_principal)[
        — #author
      ]
    ]
  )
}

#let hint_box(level, content) = {
  let colors = (
    "1": rgb("#17A2B8"),
    "2": rgb("#FFC107"),
    "3": rgb("#FD7E14"),
  )
  let labels = (
    "1": "Pista Sutil",
    "2": "Pista Moderada",
    "3": "Pista Directa"
  )
  
  block(
    fill: colors.at(level, default: rgb("#17A2B8")).lighten(70%),
    stroke: colors.at(level, default: rgb("#17A2B8")) + 2pt,
    radius: 4pt,
    inset: 8pt
  )[
    #text(weight: "bold", fill: colors.at(level, default: rgb("#17A2B8")))[
      #labels.at(level, default: "Pista")
    ]
    #v(0.3em)
    #content
  ]
}

// ═══════════════════════════════════════════════════════════════
// TABLAS PROFESIONALES
// ═══════════════════════════════════════════════════════════════

#set table(
  stroke: color_principal + 0.5pt,
  fill: (col, row) => if row == 0 { color_principal } else if calc.rem(row, 2) == 0 { color_principal_claro.lighten(85%) },
  inset: 6pt
)

#set list(marker: (text(fill: color_principal)[●], text(fill: color_principal_claro)[○], text(fill: color_principal_claro)[◆]))
#set enum(numbering: "1.")

#show raw: it => {
  set text(size: 9pt)
  block(
    fill: gris_claro,
    stroke: color_principal + 1pt,
    radius: 4pt,
    inset: 8pt,
    it
  )
}

#let separator() = {
  v(0.5em)
  line(length: 100%, stroke: color_principal + 1pt)
  v(0.5em)
}

// ═══════════════════════════════════════════════════════════════
// PORTADA
// ═══════════════════════════════════════════════════════════════

#align(center)[
  #v(3cm)
  
  #text(size: 36pt, fill: color_principal_oscuro, weight: "bold")[
    La Biblioteca Maldita
  ]
  
  #v(1em)
  
  #text(size: 18pt, fill: color_principal)[
    El bibliotecario dejó un libro abierto. Nunca debisteis leerlo.
  ]
  
  #v(2em)
  
  #line(length: 60%, stroke: color_principal + 2pt)
  
  #v(2em)
  
  #text(size: 14pt, fill: gris_oscuro)[
    Documento de Diseño y Logística
  ]
  
  #v(0.5em)
  
  #text(size: 12pt, fill: color_principal_claro)[
    Abril 2026 | v1.0
  ]
  
  #v(3em)
  
  #block(
    fill: color_principal.lighten(90%),
    stroke: color_principal + 1pt,
    radius: 8pt,
    inset: 15pt,
    width: 70%
  )[
    #text(size: 11pt, fill: gris_oscuro, style: "italic")[
      "No busquéis la verdad. La verdad os encontrará."
    ]
  ]
  
  #v(3em)
  
  #text(size: 10pt, fill: gris_oscuro)[
    Creado por Escapeitor
  ]
]

#pagebreak()

// ═══════════════════════════════════════════════════════════════
// FICHA DEL JUEGO
// ═══════════════════════════════════════════════════════════════

= Ficha del Juego

#block(
  fill: color_principal.lighten(90%),
  stroke: color_principal + 1pt,
  radius: 8pt,
  inset: 12pt,
  width: 80%
)[
  #grid(
    columns: (auto, 1fr),
    gutter: 0.5em,
    text(weight: "bold")[Jugadores:], [4],
    text(weight: "bold")[Duración:], [60 minutos],
    text(weight: "bold")[Dificultad:], [5/10],
    text(weight: "bold")[Tipo:], [Investigación],
    text(weight: "bold")[Pruebas:], [6 (5 existentes + 1 nueva)],
  )
]

Hace tres noches, el anciano bibliotecario Cornelius Fogg desapareció de la Biblioteca Municipal dejando únicamente un libro sin título sobre su escritorio.

#separator()

// ═══════════════════════════════════════════════════════════════
// DISEÑO DEL JUEGO
// ═══════════════════════════════════════════════════════════════

#pagebreak()

= Diseño del Juego

== Vista General

Juego de investigación para 4 jugadores, 60 minutos, dificultad 5/10. Flujo de acumulación: los jugadores van reuniendo pistas que convergen en el clímax. 6 pruebas con curva de dificultad progresiva (3→8).

== Lista de Pruebas

#table(
  columns: (auto, 1fr, auto, auto, auto, auto),
  [N.º], [Prueba], [Skill], [Dur.], [Dif.], [Acto],
  [1], [Las Notas Invisibles de Fogg], [exploración-visual], [8 min], [3/10], [I],
  [2], [El Libro Sin Título], [investigación-texto], [10 min], [4/10], [I],
  [3], [El Catálogo Alterado], [emparejamiento-texto], [8 min], [5/10], [II],
  [4], [Los Cuarenta Años de Fogg], [lógica-secuencial], [10 min], [6/10], [II],
  [5], [El Código de los Estantes\*], [lógica-posiciones], [12 min], [7/10], [III],
  [6], [La Última Página], [acróstico-ubicación], [10 min], [8/10], [III],
)

_\* Prueba nueva (17% del total). 5 existentes (83%)._

== Flujo Visual

+ [1. Notas UV] → [2. Libro Sin Título] → nombre: *Victor Shelley*
+ [3. Catálogo Alterado] ←→ [4. Diario de Fogg] (paralelo parcial)
+ Ambas convergen → [5. Estantería Cifrada] → [6. Acróstico Final] → ¡Escape!

== Curva de Dificultad

Progresión estrictamente creciente: 3 → 4 → 5 → 6 → 7 → 8.

== Tiempos Estimados

#table(
  columns: (1fr, auto, auto, auto),
  [Prueba], [Tiempo], [Buffer], [Acum.],
  [1. Notas UV], [8 min], [2 min], [10 min],
  [2. Libro Sin Título], [10 min], [0 min], [20 min],
  [3. Catálogo Alterado], [8 min], [2 min], [30 min],
  [4. Diario de Fogg], [10 min], [0 min], [40 min],
  [5. Estantería Cifrada], [12 min], [0 min], [52 min],
  [6. Acróstico Final], [10 min], [0 min], [62 min],
  [Total], [58 min], [4 min], [62 min],
)

#alert_box[Margen: 2 minutos por debajo del límite de 60 min. Ajustar si los jugadores van rápidos.]

== Pistas para el GM

#table(
  columns: (1fr, 1fr, 1fr, 1fr),
  [Prueba], [Nivel 1 (>5 min)], [Nivel 2 (>10 min)], [Nivel 3 (>15 min)],
  [1. Notas UV], ["Revisad el cajón superior"], ["Usad la linterna con las notas"], ["Los mensajes UV dicen: 'MIRAD PRIMERA LETRA'"],
  [2. Libro], ["El libro tiene párrafos numerados"], ["Las primeras letras de 6 párrafos"], ["El nombre es: VICTOR SHELLEY"],
  [3. Catálogo], ["Las fichas con marca roja"], ["Emparejad por autor y año"], [—],
  [4. Diario], ["Buscad fechas en los fragmentos"], ["Ordenad de 1986 a 2026"], [—],
  [5. Estantería], ["La línea temporal da los números"], ["Cada década = un estante"], ["Código: 7294"],
  [6. Acróstico], ["Primera letra de cada línea"], ["Las letras verticales"], [—],
)

== Notas de Implementación

- La linterna UV debe tener pilas nuevas (testear antes)
- Las notas con tinta UV deben escribirse con marcador UV dedicado
- El libro sin título debe parecer genuinamente antiguo (encuadernación de cuero)
- Los fragmentos del diario deben estar bien distribuidos entre libros diferentes
- La estantería con candado debe ser móvil o tener un mecanismo de apertura real
- El acróstico final debe ser legible pero no obvio — considerar fuente antigua
- El audio de Elena Voss puede ser un reproductor MP3 con altavoces ocultos

#separator()

// ═══════════════════════════════════════════════════════════════
// NARRATIVA
// ═══════════════════════════════════════════════════════════════

#pagebreak()

= Narrativa

== Introducción

Sois un equipo de investigadores privados contratados por la asistente de la biblioteca, Elena Voss. Hace tres noches, Cornelius Fogg — bibliotecario durante 40 años de la Biblioteca Municipal — desapareció sin dejar rastro. La puerta estaba cerrada por dentro. Las cámaras no muestran a nadie entrando ni saliendo. Lo único que quedó fue un libro antiguo, sin título, abierto sobre su escritorio con una frase subrayada en rojo:

#quote_box("Libro sin título", [No busquéis la verdad. La verdad os encontrará.])

Al entrar a la biblioteca, encontráis el escenario exactamente como lo dejó Fogg: sillas volcadas, un café a medio tomar aún tibio, y decenas de notas dispersas por las mesas.

== Acto I: El Escritorio de Fogg (15 min)

Los jugadores empiezan explorando el escritorio del bibliotecario. Encuentran una linterna UV en el cajón superior y descubren que varias notas aparentemente normales contienen mensajes invisibles escritos con tinta reactiva. Estos mensajes les dirigen al libro sin título.

Al examinar el libro con detenimiento, descubren que las primeras letras de cada párrafo forman un mensaje oculto: el nombre de *Victor Shelley* — un autor misterioso cuyos libros no aparecen en ningún registro oficial, pero cuyas palabras parecen aparecer escondidas en otros libros de la biblioteca.

#quote_box("Elena Voss (audio)", [Si estáis escuchando esto, significa que Fogg tenía razón. No toquéis los libros de la sección oeste. Especialmente el estante tres. Por favor, encontradle.])

== Acto II: Los Estantes Malditos (20 min)

Con el nombre de Victor Shelley como pista, los jugadores acceden al fichero del catálogo de la biblioteca. Descubren que varias fichas han sido alteradas: títulos cambiados, años modificados, autores intercambiados. Deben emparejar las fichas falsas con las correctas para identificar qué libros de la biblioteca fueron intervenidos por Fogg.

Entre los estantes encuentran fragmentos del diario personal de Fogg, dispersos y ocultos entre las páginas de diferentes libros. Al ordenarlos cronológicamente, reconstruyen 40 años de investigación: Fogg descubrió que Victor Shelley no era un autor real, sino un seudónimo colectivo usado por una sociedad secreta que, desde el siglo XIX, esconde mensajes codificados dentro de libros aparentemente normales.

El diario revela que Fogg encontró la cámara secreta donde se guardan los manuscritos originales, pero que "la biblioteca no quería que saliera".

== Acto III: La Cámara Secreta (20 min)

Las pistas acumuladas — el catálogo alterado, el diario ordenado, los mensajes UV — convergen. Los jugadores deducen que deben colocar cuatro libros específicos en posiciones concretas de una estantería para abrir un candado que revela la puerta oculta.

Dentro de la cámara secreta, un manuscrito antiguo contiene un acróstico formado por las primeras letras de cada línea. El mensaje revela la verdad: Fogg no desapareció — entró voluntariamente en la cámara para proteger los manuscritos. La última línea del acróstico contiene la combinación final para salir de la biblioteca.

#quote_box("Cornelius Fogg", [Ahora sois parte de la historia. Cerrad la puerta al salir. Y no leáis la última página del libro sin título.])

== Acto IV: La Última Página (5 min)

Los jugadores salen de la cámara con la combinación y escapan de la biblioteca. Si alguien abre el libro sin título hasta la última página, encuentra una sola frase:

#quote_box("El Libro Sin Título", [Si leísteis esto, ya es demasiado tarde. La biblioteca os recuerda.])

== Personajes

#table(
  columns: (1fr, auto, 1fr),
  [Personaje], [Rol], [Descripción],
  [Cornelius Fogg], [Bibliotecario desaparecido], [Anciano erudito, 40 años al cargo. Sus notas y pistas aparecen por toda la sala. No es víctima — es guardián.],
  [Elena Voss], [Asistente / Guía], [Joven ayudante que encontró la biblioteca vacía. Aparece en mensajes de audio desesperados pidiendo ayuda.],
  [Victor Shelley], [Misterio central], [Seudónimo colectivo de una sociedad secreta del siglo XIX que esconde mensajes en libros.],
)

== Notas de Ambientación

- *Tono*: Misterioso, no terrorífico. La tensión viene de la intriga, no del susto.
- *Iluminación*: Luz cálida de lámparas de escritorio y velas artificiales. Zonas de penumbra entre estantes.
- *Sonido*: Murmullos grabados a volumen muy bajo, crujidos de madera, música clásica inquietante.
- *Olor*: Ambientador de papel antiguo y polvo.
- *Temperatura*: Ligeramente fría si es posible.
- *Regla GM*: Nunca confirmar ni desmentir si Victor Shelley es real. Mantener la ambigüedad.

#separator()

// ═══════════════════════════════════════════════════════════════
// DETALLE DE PRUEBAS
// ═══════════════════════════════════════════════════════════════

#pagebreak()

= Detalle de Pruebas

== Prueba 1: Las Notas Invisibles de Fogg

#info_box[Datos de la prueba][
  - *Skill*: Exploración visual
  - *Dificultad*: 3/10
  - *Duración*: 8 min
  - *Acto*: I
]

Mensajes escritos con rotulador invisible UV en varias superficies de la sala. Los jugadores encuentran una linterna UV en el cajón superior del escritorio y deben escanear la sala para revelar los mensajes. Los mensajes están numerados y al leerlos en orden forman una pista que les dirige al libro sin título.

*Materiales*: Linterna UV (1), notas con tinta UV (3), notas normales de distracción (5-8).

=== Pistas

#hint_box("1")[Hay algo que no se ve a simple vista. ¿Qué herramienta habéis encontrado que podría ayudar?]
#hint_box("2")[Escanead las superficies con la luz UV: bajo los muebles, detrás de los cuadros, dentro de libros.]
#hint_box("3")[Los fragmentos UV están numerados (I, II, III...). Leedlos en orden para obtener la pista completa.]

== Prueba 2: El Libro Sin Título

#info_box[Datos de la prueba][
  - *Skill*: Investigación textual
  - *Dificultad*: 4/10
  - *Duración*: 10 min
  - *Acto*: I
]

Un libro antiguo sin título sobre el escritorio de Fogg. Al examinarlo, los jugadores descubren que las primeras letras de cada párrafo forman un mensaje oculto: el nombre de *Victor Shelley*.

*Materiales*: Libro antiguo sin título (1, encuadernación de cuero, 6+ párrafos con acróstico), frase subrayada en rojo (1).

=== Pistas

#hint_box("1")[El libro tiene párrafos numerados.]
#hint_box("2")[Las primeras letras de 6 párrafos forman el mensaje.]
#hint_box("3")[El nombre es: VICTOR SHELLEY.]

== Prueba 3: El Catálogo Alterado

#info_box[Datos de la prueba][
  - *Skill*: Emparejamiento textual
  - *Dificultad*: 5/10
  - *Duración*: 8 min
  - *Acto*: II
]

Dos columnas de fichas de catálogo: 8 correctas y 8 alteradas (marcadas con sello rojo). Los jugadores deben emparejar las fichas falsas con las correctas para identificar qué libros fueron intervenidos por Fogg.

*Materiales*: Fichas de catálogo correctas (8), fichas alteradas (8), caja o fichero de catálogo (1).

=== Pistas

#hint_box("1")[Las fichas con marca roja son las alteradas.]
#hint_box("2")[Emparejad por autor y año para identificar las discrepancias.]

== Prueba 4: Los Cuarenta Años de Fogg

#info_box[Datos de la prueba][
  - *Skill*: Lógica secuencial
  - *Dificultad*: 6/10
  - *Duración*: 10 min
  - *Acto*: II
]

8 fragmentos del diario personal de Fogg, dispersos entre libros de los estantes. Cada fragmento tiene una fecha (1986, 1996, 2006, 2016, 2024) y menciona libros. Los jugadores deben ordenarlos cronológicamente para reconstruir la investigación de Fogg.

*Materiales*: Fragmentos del diario (8, con fechas, papel envejecido).

=== Pistas

#hint_box("1")[Buscad fechas en los fragmentos del diario.]
#hint_box("2")[Ordenad de 1986 a 2026 para reconstruir la línea temporal.]

== Prueba 5: El Código de los Estantes *(NUEVA)*

#info_box[Datos de la prueba][
  - *Skill*: Lógica de posiciones
  - *Dificultad*: 7/10
  - *Duración*: 12 min
  - *Acto*: III
]

Una estantería con 4 posiciones marcadas (I-IV). Los jugadores deducen qué 4 libros colocar usando la línea temporal del diario y el catálogo alterado. Cada libro tiene un dígito en la contraportada. El código es *7294*.

#table(
  columns: (auto, 1fr, auto, 1fr),
  [Pos.], [Libro], [Dígito], [Pista],
  [I], [Don Quijote], [7], [1986 — Novela Clásica],
  [II], [Cien Años de Soledad], [2], [1996 — Realismo Mágico],
  [III], [La Sombra del Viento], [9], [2006 — Misterio],
  [IV], [El Nombre de la Rosa], [4], [2024 — Thriller Histórico],
)

*Materiales*: Estantería con 4 posiciones (1), 4 libros con dígitos en contraportada (7, 2, 9, 4), candado de combinación 4 dígitos (1, código: 7294).

*Feedback éxito*: El candado se abre con un clic satisfactorio. Al mover la estantería, se revela un pasillo estrecho que conduce a una pequeña cámara oculta llena de manuscritos antiguos.

*Feedback fallo*: El candado no se mueve. Los números deben estar en el orden correcto según la cronología del diario de Fogg.

=== Pistas

#hint_box("1")[La estantería tiene 4 posiciones marcadas con números romanos. Necesitáis encontrar 4 libros específicos.]
#hint_box("2")[Recordad el diario de Fogg — cada década menciona un libro que el bibliotecario escondió.]
#hint_box("3")[1986: Don Quijote (Novela Clásica). 1996: Cien Años de Soledad (Realismo Mágico). 2006: La Sombra del Viento (Misterio). 2024: El Nombre de la Rosa (Thriller Histórico).]

== Prueba 6: La Última Página

#info_box[Datos de la prueba][
  - *Skill*: Acróstico / Ubicación
  - *Dificultad*: 8/10
  - *Duración*: 10 min
  - *Acto*: III
]

Un manuscrito antiguo en la cámara secreta contiene un acróstico formado por las primeras letras de cada línea. El mensaje revela la verdad sobre Fogg y contiene la combinación final para salir.

*Materiales*: Manuscrito antiguo con acróstico (1, pergamino), candado de salida (1).

=== Pistas

#hint_box("1")[Primera letra de cada línea del manuscrito.]
#hint_box("2")[Las letras verticales forman el mensaje y la combinación.]

#separator()

// ═══════════════════════════════════════════════════════════════
// LISTA DE MATERIALES
// ═══════════════════════════════════════════════════════════════

#pagebreak()

= Lista de Materiales

== Materiales por Prueba

=== Prueba 1: Notas Invisibles

#table(
  columns: (1fr, auto, auto, 1fr),
  [Material], [Tipo], [Cant.], [Notas],
  [Linterna UV], [Físico], [1], [Pilas nuevas, testear antes],
  [Notas con tinta UV], [Impreso], [3], [Marcador UV sobre papel apergaminado],
  [Notas de distracción], [Impreso], [5-8], [Para mezclar con las UV],
)

=== Prueba 2: Libro Sin Título

#table(
  columns: (1fr, auto, auto, 1fr),
  [Material], [Tipo], [Cant.], [Notas],
  [Libro antiguo sin título], [Físico], [1], [Encuadernación cuero, 6+ párrafos],
  [Frase subrayada en rojo], [Impreso], [1], [Dentro del libro],
)

=== Prueba 3: Catálogo Alterado

#table(
  columns: (1fr, auto, auto, 1fr),
  [Material], [Tipo], [Cant.], [Notas],
  [Fichas correctas], [Impreso], [8], [Autor, título, año, sección],
  [Fichas alteradas], [Impreso], [8], [Marcadas con sello rojo],
  [Caja / fichero catálogo], [Físico], [1], [Para contener las 16 fichas],
)

=== Prueba 4: Diario de Fogg

#table(
  columns: (1fr, auto, auto, 1fr),
  [Material], [Tipo], [Cant.], [Notas],
  [Fragmentos del diario], [Impreso], [8], [Con fechas y nombres de libros],
  [Papel envejecido], [Impreso], [8], [Formato de páginas arrancadas],
)

=== Prueba 5: Estantería Cifrada *(NUEVA)*

#table(
  columns: (1fr, auto, auto, 1fr),
  [Material], [Tipo], [Cant.], [Notas],
  [Estantería con 4 posiciones], [Físico], [1], [Marcadas con números romanos I-IV],
  [Don Quijote], [Físico], [1], [Con "7" en contraportada],
  [Cien Años de Soledad], [Físico], [1], [Con "2" en contraportada],
  [La Sombra del Viento], [Físico], [1], [Con "9" en contraportada],
  [El Nombre de la Rosa], [Físico], [1], [Con "4" en contraportada],
  [Candado 4 dígitos], [Físico], [1], [Código: 7294],
)

=== Prueba 6: La Última Página

#table(
  columns: (1fr, auto, auto, 1fr),
  [Material], [Tipo], [Cant.], [Notas],
  [Manuscrito con acróstico], [Impreso], [1], [Pergamino],
  [Candado de salida], [Físico], [1], [Combinación del acróstico],
)

== Materiales Generales

#table(
  columns: (1fr, auto, auto, 1fr),
  [Material], [Tipo], [Cant.], [Notas],
  [Reproductor de audio], [Digital], [1], [Con pistas de Elena Voss],
  [Timer/reloj para GM], [Físico], [1], [Control de tiempos],
  [Ambientador papel antiguo], [Físico], [1], [Opcional],
  [Cuerdas/bombillas], [Físico], [Var.], [Lámparas, velas LED],
)

#separator()

// ═══════════════════════════════════════════════════════════════
// CHECKLIST DE PREPARACIÓN
// ═══════════════════════════════════════════════════════════════

= Checklist de Preparación

== Antes del Juego (24h)

- [ ] Linterna UV con pilas nuevas (testear)
- [ ] Escribir notas UV con marcador dedicado (testear visibilidad)
- [ ] Preparar libro sin título con acróstico correcto
- [ ] Imprimir 16 fichas de catálogo (8 correctas + 8 alteradas)
- [ ] Esconder 8 fragmentos del diario entre libros de los estantes
- [ ] Preparar 4 libros con dígitos en contraportada
- [ ] Configurar candado estantería: 7294
- [ ] Configurar candado salida según acróstico
- [ ] Cargar pistas de audio de Elena Voss

== El Día del Juego

- [ ] Verificar iluminación (lámparas, velas LED)
- [ ] Colocar sillas volcadas y café como escenario inicial
- [ ] Esconder linterna UV en cajón superior del escritorio
- [ ] Testear recorrido completo (timing)
- [ ] Verificar que todo funciona
- [ ] Briefing con game master
