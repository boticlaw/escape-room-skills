# Guía de Diseño para Materiales Impresos de Escape Room

## Principios Fundamentales

### 1. Los materiales son PROPS, no documentos
Un material de escape room no se lee en pantalla — se TOCA. Se sostiene, se gira, se arruga, se rasga. El diseño debe:
- Funcionar en papel físico, no en monitor
- Ser legible bajo luz cálida, velas, o luz tenue de desván
- Resistir el manejo brusco (márgenes generosos, nada frágil en los bordes)
- Evocar la época/ambiente del juego (no parecer un documento de Word)

### 2. Jerarquía visual = prioridad de información
El jugador escanea el documento en 2 segundos. ¿Qué ve primero?
1. El TÍTULO o instrucción principal (más grande, más oscuro, más peso)
2. Las ACCIONES que debe realizar (segundo nivel)
3. Los DETALLES y contexto (texto cuerpo, más pequeño)

Si un jugador no entiende qué hacer en 5 segundos, el diseño falló.

### 3. Menos es más — pero con personalidad
Cada documento tiene UN propósito. Un cartel instruye. Una carta narra. Un tablero organiza.
- Un documento = una función
- Eliminar todo lo que no contribuya a esa función
- Pero la decoración que REFUERZA la inmersión (bordes envejecidos, sellos, texturas) es BIENVENIDA

## Tipografía para Impresión

### Reglas de oro
- **Título**: 16-28pt, bold, serif o display. Legible a 1 metro de distancia.
- **Subtítulo**: 12-14pt, semibold. Visible al sostener el documento.
- **Cuerpo**: 10-11pt, regular. Legible cómodamente sostenido en la mano.
- **Notas/pie**: 8-9pt, italic. Para contexto adicional, no esencial.
- **Interlineado**: 1.5-1.7 para cuerpo. Los documentos envejecidos necesitan más espacio.
- **Nunca** menor a 8pt — ni en luz perfecta es legible en papel.

### Fuentes por género
| Género | Fuente recomendada | Personalidad |
|--------|-------------------|--------------|
| Misterio/Investigación | EB Garamond, Cormorant Garamond | Elegante, clásica, documentos antiguos |
| Ciencia Ficción | Space Mono, IBM Plex Mono | Técnica, limpia, futurista |
| Terror | Crimson Text, Playfair Display | Gótica, dramática, inquietante |
| Aventura/Jungla | Bitter, Merriweather | Robusta, terrosa, legible |
| Pirata/Histórico | Playfair Display, Spectral | Clásica, con carácter, navideña |
| Espionaje | JetBrains Mono, Source Code Pro | Codificada, precisa, fría |
| Familiar/Nostálgico | EB Garamond, Lora | Cálida, humana, cercana |
| Concurso/Quiz | Poppins, Nunito | Moderna, divertida, redondeada |

### Parejas tipográficas (font pairings)
Usar DOS fuentes por juego: una para títulos y otra para cuerpo. Esto crea contraste visual sin caer en la monotonía.

| Pareja | Título | Cuerpo | Género ideal | Import URL |
|--------|--------|--------|--------------|------------|
| Clásica elegante | EB Garamond (700) | EB Garamond (400) | Misterio, Familiar | `family=EB+Garamond:wght@400;600;700` |
| Vintage cálida | Playfair Display (700) | Lora (400) | Histórico, Nostálgico | `family=Playfair+Display:wght@700&family=Lora` |
| Gótica dramática | Crimson Text (700) | Cormorant Garamond (400) | Terror, Misterio oscuro | `family=Crimson+Text:wght@700&family=Cormorant+Garamond` |
| Técnica limpia | Space Mono (700) | IBM Plex Sans (400) | Sci-Fi, Laboratorio | `family=Space+Mono:wght@700&family=IBM+Plex+Sans` |
| Aventurera | Bitter (700) | Merriweather (400) | Jungla, Exploración | `family=Bitter:wght@700&family=Merriweather` |
| Codificada fría | JetBrains Mono (700) | Source Sans 3 (400) | Espionaje, Militar | `family=JetBrains+Mono:wght@700&family=Source+Sans+3` |
| Editorial moderna | Spectral (700) | Crimson Pro (400) | Concurso, Elegant | `family=Spectral:wght@700&family=Crimson+Pro` |
| Divertida redondeada | Nunito (700) | Quicksand (400) | Familiar, Niños | `family=Nunito:wght@700&family=Quicksand` |

**Regla:** Si el `STYLE.json` solo define una fuente, usar la misma con pesos distintos (400 para cuerpo, 700 para títulos).

### Google Fonts para imprenta
Siempre usar Google Fonts con `@import` — funciona offline si se carga antes de imprimir:
```css
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&display=swap');
```
Incluir SIEMPRE fallback: `'EB Garamond', Georgia, serif`

## Color para Papel

### Reglas de oro
- **Fondo claro + texto oscuro** = legibilidad máxima (la base del 90% de los documentos)
- **Fondo oscuro + texto claro** = impacto dramático (solo para carteles y portadas)
- **Jamás** texto claro sobre fondo claro — aunque quede "bonito" en pantalla
- **Jamás** más de 3 colores principales en un documento
- Los colores en pantalla se ven MÁS BRILLANTES que en papel — reducir saturación un 15%

### Paletas por mood
| Mood | Fondo | Texto | Acento | Uso |
|------|-------|-------|--------|-----|
| Papel antiguo | #faf0e6 | #4a3728 | #8b7355 | Cartas, diarios, documentos familiares |
| Pergamino | #f5e6c8 | #3d2b1f | #8b4513 | Documentos legales, testamentos |
| Noche/Secreto | #1a1a1a | #f5e6c8 | #8b7355 | Carteles de instrucciones, mensajes ocultos |
| Bosque/Natural | #2d6a4f | #f5e6c8 | #d4a373 | Señales, mapas, guías de exploración |
| Laboratorio | #f0f0f0 | #1a1a1a | #e94560 | Informes científicos, documentos técnicos |
| Militar/Confidencial | #3a3a2a | #d4d4b8 | #8b0000 | Expedientes, dossieres, archivos clasificados |

### Contraste mínimo
Siempre verificar contraste con esta regla práctica:
- Texto cuerpo sobre fondo: diferencia de luminosidad ≥ 60%
- Texto grande (títulos): diferencia ≥ 40%
- Cuando dudes, imprimir y leer con luz tenue

## Escala de Espaciado para Impresión

Usar siempre múltiplos de esta escala para mantener consistencia entre todos los materiales de un juego:

| Token | Valor | Uso |
|-------|-------|-----|
| `xs` | 1.5mm | Separación entre línea de texto y su borde |
| `sm` | 3mm | Padding interno de tarjetas, gap entre elementos pequeños |
| `md` | 5mm | Margen entre bloques, padding de cajas de solución |
| `lg` | 8mm | Separación entre secciones, padding de cartas |
| `xl` | 12mm | Márgenes de página, separación entre pruebas |
| `2xl` | 15mm | Márgenes de @page, espaciado de portada |
| `3xl` | 20mm | Márgenes laterales de cartas, padding de portada |

### Tipografía — escala de tamaños
| Token | Tamaño | Uso |
|-------|--------|-----|
| `text-xs` | 8pt | Notas al pie, pies de foto, contexto no esencial |
| `text-sm` | 9pt | Subtítulos secundarios, etiquetas, metadata |
| `text-base` | 10.5pt | Texto cuerpo estándar |
| `text-md` | 12pt | Subtítulos, texto destacado |
| `text-lg` | 14pt | Títulos de sección |
| `text-xl` | 18pt | Títulos de documento |
| `text-2xl` | 24pt | Portada, título principal |
| `text-3xl` | 28pt | Cover del juego, código de solución |

## Composición de Página

### Tamaño A4 (210 × 297 mm)
El A4 es el estándar. Margen útil: 186 × 267 mm (15mm por lado).

```css
@page { size: A4 portrait; margin: 15mm; }
/* o para paisaje: */
@page { size: A4 landscape; margin: 15mm; }
```

### Layouts por tipo de documento

#### Cartel (instruction/sign)
- Centrado vertical y horizontal
- Título en bloque superior (20-30% de la página)
- Instrucciones en bloque central (50-60%)
- Nota/pista en bloque inferior (10-20%)
- Fondo oscuro con texto claro para máxima visibilidad
- El jugador debe entender QUÉ HACER sin leer detalle

#### Carta (letter/note)
- Layout de carta real: fecha arriba, cuerpo centrado, firma abajo
- Papel texturizado (sepia, envejecido)
- Sombra interior sutil para efecto de envejecimiento
- Fuente serif elegante, itálica para frase especial
- Márgenes generosos (25mm laterales) — las cartas se sostienen con las manos en los bordes

#### Diario (diary/journal)
- Entradas fechadas con separación clara
- Textura de cuaderno (líneas sutiles o papel rayado)
- Letra "manuscrita" si el mood lo permite (cuidado con la legibilidad)
- Elementos decorativos: ★ asteriscos para entradas destacadas, márgenes con notas

#### Tarjeta (card/ticket)
- Compacta, una sola función
- Borde visible (el jugador la identifica como objeto separado)
- Texto grande y directo — la tarjeta se lee rápido
- Número/identificador en esquina si hay múltiples

#### Tablero (board/display)
- Grid claro con celdas definidas
- Etiquetas en cabeceras (negrita, fondo oscuro)
- Celdas alternadas si hay muchas filas
- Instrucción del tablero como texto aparte, NO integrada en el grid

#### Fragmento (torn piece)
- Bordes irregulares simulados con clip-path o márgenes asimétricos
- Texto parcial — cortado a mitad de frase
- Papel envejecido obligatorio
- Numeración sutil si hay muchos fragmentos

#### Etiqueta (label/tag)
- Tamaño pequeño (A6 o menos)
- Borde punteado opcional para recortar
- Agujero para colgar si es colgante (círculo CSS)
- Texto mínimo, directo

## Efectos de Textura para Papel

### Papel envejecido
```css
background-color: #faf0e6;
box-shadow: inset 0 0 40px 10px rgba(139,115,85,0.1);
```

### Pergamino
```css
background: linear-gradient(135deg, #f5e6c8 0%, #efe0c0 50%, #f5e6c8 100%);
```

### Papel quemado (bordes)
```css
box-shadow: inset 0 0 30px 5px rgba(80,40,10,0.2),
            inset 0 0 60px 10px rgba(80,40,10,0.1);
border-radius: 2mm;
```

### Sombra de desgaste
```css
box-shadow: inset 0 0 100px 20px rgba(0,0,0,0.05);
```

### Sello de cera (decorativo)
```css
.wax-seal {
  width: 15mm;
  height: 15mm;
  background: radial-gradient(circle, #8b0000 30%, #5c0000 70%, #3a0000 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d4a373;
  font-size: 10pt;
}
```

### Sello raspable (scratch-off)
```css
.scratch-seal {
  background: linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 50%, #d0d0d0 100%);
  color: transparent;
  padding: 2mm 4mm;
  border: 1px solid #888;
  text-align: center;
  user-select: none;
}
/* En impresión, el sello es plateado. El contenido real va en letra pequeña bajo él. */
```

## Reglas Priorizadas

Las reglas de esta guía se clasifican en tres niveles de prioridad:

### 🔴 OBLIGATORIAS — Violación = material rechazado
1. **Texto mínimo 10pt para cuerpo** — Nunca menor a 8pt ni en notas
2. **Contraste mínimo 60%** — Texto oscuro sobre fondo claro (o viceversa)
3. **Un documento = una función** — Sin mezclar instrucciones con narrativa
4. **Google Fonts con fallback** — `'EB Garamond', Georgia, serif`
5. **`break-inside: avoid`** en bloques completos — Nada cortado por salto de página
6. **Verificar B/N** — Los colores deben funcionar sin color (muchas impresoras)

### 🟡 RECOMENDADAS — Violación = justificar con motivo
1. **Dos fuentes por juego** (título + cuerpo) usando la tabla de parejas tipográficas
2. **Escala de espaciado consistente** (xs/sm/md/lg/xl/2xl/3xl)
3. **Efectos de textura** en documentos narrativos (cartas, diarios, fragmentos)
4. **Fondo oscuro solo para carteles cortos** (< 200 palabras)
5. **Márgenes ≥ 15mm** — 25mm laterales en cartas (se sostienen por los bordes)
6. **No más de 3 colores** por documento

### 🟢 OPCIONALES — Aportan calidad pero no son bloqueantes
1. Font pairing con dos fuentes distintas (título vs cuerpo)
2. Sellos decorativos (cera, scratch-off)
3. Bordes quemados en documentos narrativos especiales
4. Celdas alternadas en tableros con muchas filas
5. Numeración sutil en fragmentos múltiples

## Errores Comunes a Evitar

1. **Texto demasiado pequeño** — Si no se lee sosteniendo el papel a 40cm, es demasiado pequeño
2. **Fondo oscuro en documentos largos** — Agota la vista. Solo para carteles cortos.
3. **Columnas estrechas** — El papel se dobla al sostenerlo. Mínimo 60mm de ancho útil.
4. **Decoración que compite con el texto** — Las texturas son FONDO, no primer plano.
5. **Sin jerarquía** — Si todo es igual de importante, nada lo es.
6. **Imprimir en color cuando no hace falta** — Los materiales en B/N son más baratos y igual de inmersivos si el diseño es bueno.
7. **Olvidar el reverso** — Algunos materiales se imprimen por ambos lados. Dejar margen para alineación.

## Formato de Impresión

### Reglas de @page
```css
@page { size: A4 portrait; margin: 15mm; }
```

### Nunca romper dentro de
```css
.cartel, .carta, .tarjeta, .bloque-instruccion {
  break-inside: avoid;
}
```

### Forzar nueva página entre secciones
```css
.seccion-nueva {
  page-break-before: always;
}
```

### Verificación antes de imprimir
- Siempre generar PDF y abrirlo antes de imprimir
- Verificar que no hay texto cortado por saltos de página
- Verificar que los colores se ven bien en B/N (muchas impresoras)
- Verificar que las texturas no oscurecen el texto al imprimir
