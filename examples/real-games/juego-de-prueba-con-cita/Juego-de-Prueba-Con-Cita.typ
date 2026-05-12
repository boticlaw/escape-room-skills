// Plantilla Base Typst para Juegos de Escape Room
// Sistema reutilizable con variables configurables

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE COLORES (pasados como parámetros desde Python)
// ═══════════════════════════════════════════════════════════════

#let color_principal = rgb("#16A085")
#let color_secundario = rgb("#16A085")
#let color_principal_claro = color_principal.lighten(20%)
#let color_principal_oscuro = color_principal.darken(20%)
#let gris_oscuro = rgb("#2D2D2D")
#let gris_claro = rgb("#F5F5F5")

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN DEL DOCUMENTO
// ═══════════════════════════════════════════════════════════════

#set document(
  title: "Juego de Prueba Con Cita",
  author: "Escapeitor",
  keywords: ("escape room", "juego", "investigación")
)

#set page(
  paper: "a4",
  margin: (x: 2cm, y: 2.5cm),
  numbering: "1",
  footer: align(center, text(size: 9pt, fill: color_principal, [
    Juego de Prueba Con Cita | Escape Room
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

// Bloque de información general
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

// Bloque de alerta (amarillo)
#let alert_box(content) = {
  block(
    fill: rgb("#FFF3CD"),
    stroke: rgb("#FFC107") + 2pt,
    radius: 4pt,
    inset: 8pt
  )[
    #emoji.warning 
    #content
  ]
}

// Bloque de peligro/error (rojo)
#let danger_box(content) = {
  block(
    fill: rgb("#F8D7DA"),
    stroke: rgb("#DC3545") + 2pt,
    radius: 4pt,
    inset: 8pt
  )[
    #emoji.exclamation 
    #content
  ]
}

// Bloque de éxito (verde)
#let success_box(content) = {
  block(
    fill: rgb("#D4EDDA"),
    stroke: rgb("#28A745") + 2pt,
    radius: 4pt,
    inset: 8pt
  )[
    #emoji.check 
    #content
  ]
}

// Bloque de cita
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

// Bloque de pista (para game masters)
#let hint_box(level, content) = {
  let colors = (
    "1": rgb("#17A2B8"),  // Azul - pista sutil
    "2": rgb("#FFC107"),  // Amarillo - pista moderada
    "3": rgb("#FD7E14"),  // Naranja - pista directa
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
      #emoji.lightbulb #labels.at(level, default: "Pista")
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

// ═══════════════════════════════════════════════════════════════
// LISTAS Y ENUMERACIONES
// ═══════════════════════════════════════════════════════════════

#set list(marker: (text(fill: color_principal)[●], text(fill: color_principal_claro)[○], text(fill: color_principal_claro)[◆]))
#set enum(numbering: "1.")

// ═══════════════════════════════════════════════════════════════
// CÓDIGO
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// ELEMENTOS DECORATIVOS
// ═══════════════════════════════════════════════════════════════

// Línea horizontal decorativa
#let separator() = {
  v(0.5em)
  line(length: 100%, stroke: color_principal + 1pt)
  v(0.5em)
}

// Caja de información del juego
#let game_info_box(data) = {
  block(
    fill: color_principal.lighten(90%),
    stroke: color_principal + 1pt,
    radius: 8pt,
    inset: 12pt,
    width: 80%
  )[
    #text(size: 12pt, weight: "bold", fill: color_principal_oscuro)[
      Ficha del Juego
    ]
    #v(0.5em)
    #grid(
      columns: (auto, 1fr),
      gutter: 0.5em,
      text(weight: "bold")[Jugadores:], data.at("jugadores", default: "2-6"),
      text(weight: "bold")[Duración:], data.at("duracion", default: "60 min"),
      text(weight: "bold")[Dificultad:], data.at("dificultad", default: "Media"),
      text(weight: "bold")[Tipo:], data.at("tipo", default: "Escape Room"),
    )
  ]
}

// ═══════════════════════════════════════════════════════════════
// PORTADA
// ═══════════════════════════════════════════════════════════════

#let title_page() = {
  align(center)[
    #v(3cm)
    
    #text(size: 36pt, fill: color_principal_oscuro, weight: "bold")[
      Juego de Prueba Con Cita
    ]
    
    #v(1em)
    
    #text(size: 18pt, fill: color_principal)[
      Escape Room
    ]
    
    #v(2em)
    
    #line(length: 60%, stroke: color_principal + 2pt)
    
    #v(2em)
    
    #text(size: 14pt, fill: gris_oscuro)[
      Documento de Diseño y Logística
    ]
    
    #v(0.5em)
    
    #text(size: 12pt, fill: color_principal_claro)[
      March 2026 | 1.0
    ]
    
    #v(3em)
    
    
    
    #v(3em)
    
    #text(size: 10pt, fill: gris_oscuro)[
      Creado por Escapeitor
    ]
  ]
  
  pagebreak()
}

// ═══════════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL DEL DOCUMENTO
// ═══════════════════════════════════════════════════════════════

#let main(content) = {
  title_page()
  content
}


// CONTENIDO DEL DOCUMENTO
#main([


// ========== Diseño Juego ==========
#pagebreak()


= Diseño del Juego: Juego de Prueba Con Cita

== Visión General

_Tipo de juego_: [Hall Escape / Street Escape / Investigación]
_Duración objetivo_: 60-90 minutos
_Número de jugadores_: 2-6
_Dificultad objetivo_: 5/10

== Temática

[Describe aquí la temática principal del juego]

== Mecánicas Principales

1. [Mecánica 1]
2. [Mecánica 2]
3. [Mecánica 3]

== Flujo del Juego

=== Fase 1: Introducción (0-15 min)
- [Descripción]

=== Fase 2: Desarrollo (15-45 min)
- [Descripción]

=== Fase 3: Clímax (45-75 min)
- [Descripción]

=== Fase 4: Cierre (75-90 min)
- [Descripción]

== Pruebas

#table(
  columns: (auto,) * 5,
  [ID],
  [Nombre],
  [Tipo],
  [Dificultad],
  [Duración],
  [001],
  [[Prueba 1]],
  [[Tipo]],
  [3/10],
  [10 min],
  [002],
  [[Prueba 2]],
  [[Tipo]],
  [5/10],
  [15 min],
)

== Elementos Físicos

- [Elemento 1]
- [Elemento 2]

== Pistas Globales

1. [Pista 1]
2. [Pista 2]
3. [Pista 3]

== Notas de Diseño

[Añade notas importantes sobre decisiones de diseño, restricciones, etc.]



// ========== Lista Materiales ==========
#pagebreak()


= Lista de Materiales: Juego de Prueba Con Cita

== Materiales Necesarios

=== Impresión

#table(
  columns: (auto,) * 4,
  [Cantidad],
  [Elemento],
  [Formato],
  [Color/Special],
  [1],
  [[Elemento 1]],
  [A4],
  [[Especificaciones]],
  [1],
  [[Elemento 2]],
  [A4],
  [[Especificaciones]],
)

=== Físicos

#table(
  columns: (auto,) * 4,
  [Cantidad],
  [Elemento],
  [Ubicación],
  [Notas],
  [1],
  [[Elemento 1]],
  [[Dónde conseguirlo]],
  [[Notas]],
  [1],
  [[Elemento 2]],
  [[Dónde conseguirlo]],
  [[Notas]],
)

=== Tecnología

#table(
  columns: (auto,) * 3,
  [Cantidad],
  [Elemento],
  [Especificaciones],
  [1],
  [[Tablet/Ordenador]],
  [[Especificaciones técnicas]],
)

== Presupuesto Estimado

#table(
  columns: (auto,) * 2,
  [Categoría],
  [Costo Estimado],
  [Impresión],
  [€ XX],
  [Materiales físicos],
  [€ XX],
  [Tecnología],
  [€ XX],
  [_Total_],
  [_€ XX_],
)

== Checklist de Preparación

=== Antes del juego (24h)
- [ ] Imprimir todos los materiales
- [ ] Verificar elementos físicos
- [ ] Preparar espacio/ubicación
- [ ] Cargar dispositivos tecnológicos

=== El día del juego
- [ ] Montar todas las pruebas
- [ ] Verificar que todo funciona
- [ ] Preparar pista de respaldo
- [ ] Briefing con game master

== Almacenamiento

_Ubicación de materiales_: [Dónde se guardan los materiales entre sesiones]

_Inventario_: [Lista de chequeo para verificar que no falta nada]

== Notas

[Añade notas sobre proveedores, alternativas, etc.]



// ========== Narrativa ==========
#pagebreak()


= Narrativa: Juego de Prueba Con Cita

== Premisa

[Describe la premisa principal del juego en 2-3 frases]

== Historia

=== Contexto

[Contexto narrativo, mundo, situación inicial]

=== Conflicto

[Conflicto principal que motiva a los jugadores]

=== Objetivo

[Objetivo claro para los jugadores]

== Personajes Principales

=== [Personaje 1]
- _Rol_: [Rol en la historia]
- _Descripción_: [Descripción breve]
- _Motivación_: [Qué motiva a este personaje]

=== [Personaje 2]
- _Rol_: [Rol en la historia]
- _Descripción_: [Descripción breve]
- _Motivación_: [Qué motiva a este personaje]

== Arco Narrativo

=== Acto 1: Introducción
- _Hook_: [Gancho inicial]
- _Setup_: [Presentación del mundo y personajes]
- _Incidente_: [Incidente que inicia la acción]

=== Acto 2: Desarrollo
- _Progreso_: [Avance de la historia]
- _Complicaciones_: [Obstáculos y giros]
- _Midpoint_: [Punto medio, cambio importante]

=== Acto 3: Clímax
- _Confrontación_: [Momento de máxima tensión]
- _Resolución_: [Cómo se resuelve]
- _Epílogo_: [Cierre narrativo]

== Diálogos Clave

=== Introducción del Game Master


#align(left, block(fill: rgb("#F5F5F5"), stroke: color_principal + 2pt, radius: 4pt, inset: 12pt)[
  #text(style: "italic")[\[Diálogo de introducción que leerá el game master\]]
])


=== Instrucciones Iniciales


#align(left, block(fill: rgb("#F5F5F5"), stroke: color_principal + 2pt, radius: 4pt, inset: 12pt)[
  #text(style: "italic")[\[Instrucciones que recibirán los jugadores\]]
])


=== Cierre


#align(left, block(fill: rgb("#F5F5F5"), stroke: color_principal + 2pt, radius: 4pt, inset: 12pt)[
  #text(style: "italic")[\[Diálogo de cierre al resolver el juego\]]
])


== Elementos Narrativos en Pruebas

#table(
  columns: (auto,) * 3,
  [Prueba],
  [Elemento Narrativo],
  [Revela],
  [[Prueba 1]],
  [[Qué añade a la historia]],
  [[Qué revela]],
  [[Prueba 2]],
  [[Qué añade a la historia]],
  [[Qué revela]],
)

== Notas Narrativas

[Añade notas sobre tono, estilo, referencias culturales, etc.]

])
