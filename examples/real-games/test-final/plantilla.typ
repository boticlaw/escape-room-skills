// Plantilla Base Typst para Juegos de Escape Room
// Sistema reutilizable con variables configurables

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE COLORES (pasados como parámetros desde Python)
// ═══════════════════════════════════════════════════════════════

#let color_principal = rgb("#8E44AD")
#let color_secundario = rgb("#8E44AD")
#let color_principal_claro = color_principal.lighten(20%)
#let color_principal_oscuro = color_principal.darken(20%)
#let gris_oscuro = rgb("#2D2D2D")
#let gris_claro = rgb("#F5F5F5")

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN DEL DOCUMENTO
// ═══════════════════════════════════════════════════════════════

#set document(
  title: "Test Final",
  author: "Escapeitor",
  keywords: ("escape room", "juego", "investigación")
)

#set page(
  paper: "a4",
  margin: (x: 2cm, y: 2.5cm),
  numbering: "1",
  footer: align(center, text(size: 9pt, fill: color_principal, [
    Test Final | Escape Room
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
      Test Final
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
