# Material Templates with Visual Treatments

Each material type has a base template (structure) and visual treatments (decorative CSS). All derive colors/fonts from `STYLE.json` and treatment recipes from `print-design-guide.md`.

## Common Base

Every material starts with:
```css
@import url('STYLE.tipografia.import_url');
@page { size: A4 portrait; margin: 0; }
body { width: 186mm; margin: 0; padding: 0; }
```

Title elements use `STYLE.tipografia.titulo` (Playfair Display or equivalent).
Body elements use `STYLE.tipografia.cuerpo` (EB Garamond or equivalent).

## Type 1: cartel (sign/poster)

**Purpose**: Instructions posted on walls, doors, or boxes. Players see these first.

**Structure**:
```html
<div class="cartel">
  <div class="cartel-motif">─ ─ │ │ ─ ─ │ │</div>
  <div class="cartel-text">
    <strong>MAIN INSTRUCTION</strong>
    Supporting text
  </div>
  <div class="cartel-sub">Additional notes</div>
  <div class="cartel-border"></div>
</div>
```

**Required CSS**:
- Background: `STYLE.componentes.cartel.fondo` (dark)
- Text: `STYLE.componentes.cartel.texto` (light)
- Ornamental border: double border with ✦ corners (from print-design-guide)
- Inner glow: warm inset box-shadow on dark background
- Font: Playfair Display for main instruction, EB Garamond for sub-text
- Vertically centered with flexbox

## Type 2: carta (letter/note)

**Purpose**: Narrative documents — letters from characters, notes, fragments of story.

**Structure**:
```html
<div class="carta-page">
  <p class="drop-cap">First paragraph with large initial...</p>
  <p>More text...</p>
  <div class="firma-bloque">
    <div class="firma-linea"></div>
    <div class="firma-nombre">Character Name</div>
    <div class="firma-fecha">Date</div>
  </div>
  <!-- carta-despedida only: -->
  <div class="sello-cera">E</div>
</div>
```

**Required CSS**:
- Background: `STYLE.componentes.carta.fondo` (sepia)
- Text: `STYLE.componentes.carta.texto`
- Aging: inner shadow from `STYLE.texturas.sombra_interior`
- Coffee stains: 1-2 per page (radial-gradient)
- Fold creases: horizontal + vertical center lines
- Drop-cap: first letter large, Playfair Display, `STYLE.paleta.acento` color
- Signature block: right-aligned, underline, italic name
- Margins: 25mm left, 22mm right (wider left for holding)

**Intensity varies**:
- Navigation letters: light treatment (aging + seal)
- Elena fragments: medium (aging + stain + fold)
- Final letter: heavy (all effects + wax seal)

## Type 3: diario (diary/journal)

**Purpose**: Multi-page character diary with dated entries.

**Structure**:
```html
<div class="diario-cuaderno diario-page">
  <div class="page-header">Diary Title</div>
  <div class="page-number">1</div>
  <p><strong>Date</strong></p>
  <p>Entry text...</p>
  <p>★ <em>Highlighted thought</em></p>
</div>
```

**Required CSS**:
- Notebook lines: `background-image: linear-gradient(#b8cfe5 0.5px, transparent 0.5px)` at 8mm spacing
- Red margin: vertical line at 12mm from left, `#e8c0a0`
- Aging: strong inner shadow
- Coffee stains on alternating pages
- Page numbers: bottom-right, small italic
- ★ entries with decorative styling
- Tape mark on one page (translucent strip, rotated)

## Type 4: tablero (board/display)

**Purpose**: Grid-based puzzles — logic boards, family trees, restriction tables.

**Structure**:
```html
<div class="marco-ornamental">
  <div class="section-title">─── ✦ ─── Title ─── ✦ ───</div>
  <table class="restricciones">
    <tr><th>Col 1</th><th>Col 2</th></tr>
    <tr><td>Data</td><td>Data</td></tr>
  </table>
</div>
```

**Required CSS**:
- Ornamental border: double border with ✦ corners
- Decorative title: Playfair Display with ornament underline
- Table headers: `STYLE.componentes.tablero.cabecera_fondo` background
- Alternating rows: `STYLE.componentes.tablero.celda_alternada`
- Subtle aging: light inner shadow

## Type 5: tarjeta (card/ticket)

**Purpose**: Individual cards players hold, match, or arrange.

**Structure**:
```html
<div class="tarjeta-prop">
  <div class="tarjeta-num">1</div>
  <div class="tarjeta-text">
    Card description...
    <div class="sello-raspable">
      <div class="contenido-oculto">7</div>
    </div>
  </div>
</div>
```

**Required CSS**:
- Card texture: gradient background + inner shadow
- Numbered badge: circular, `STYLE.paleta.secundario` background
- ★ badges for special cards: `STYLE.paleta.acento`
- Scratch-off seal (when applicable): silver gradient with stripe overlay
- Slight rotation alternating for organic feel
- Tape mark on 1-2 cards

## Type 6: fragmento (torn piece)

**Purpose**: Torn paper pieces that players reassemble like a jigsaw.

**Structure**:
```html
<div class="fragmento-irregular">
  <div class="fragmento-num">7</div>
  <p>Partial text that continues...</p>
</div>
```

**Required CSS**:
- Irregular edges: `clip-path: polygon(...)` — different for each fragment
- Heavy aging: strong inner shadow, pronounced coffee stains
- Fold creases: both directions
- Faint numbering: 7pt, `STYLE.paleta.texto_secundario`
- Alternate rotations for organic feel
- Vary background tint slightly between fragments

## Type 7: etiqueta (label/tag)

**Purpose**: Small labels, tags, navigation notes.

**Structure**:
```html
<div class="etiqueta-prop">
  <p>Label text...</p>
  <div class="etiqueta-sello">E</div>
</div>
```

**Required CSS**:
- Card-textured background
- Small decorative border
- Optional wax seal (for navigation letters)
- Compact layout (A6 or smaller)
- Optional dotted border for cut guides
- Optional hole punch circle (for hanging tags)

## Type 8: foto (photograph)

**Purpose**: Photographs in albums — players match them to memories.

**Structure**:
```html
<div class="foto-polaroid">
  <div class="foto-contenido">
    [Description of the photo scene]
  </div>
  <div class="foto-caption">
    <span class="foto-date">1962</span>
    <span class="foto-title">Photo Title</span>
  </div>
  <div class="sello-raspable">
    <div class="contenido-oculto">7</div>
  </div>
</div>
```

**Required CSS**:
- Polaroid frame: white border (4mm sides/top, 15mm bottom)
- Drop shadow for depth
- Slight rotation (alternating -1.5deg to +2deg)
- Date caption in bottom white area
- Scratch-off seal in corner
- Coffee stain on 1-2 photos
- Tape mark on 1-2 photos
- Description text: elegant italic, smaller, with icon ☉

## Type 9: certificado (certificate/official document)

**Purpose**: Formal documents — adoption certificates, legal papers.

**Structure**:
```html
<div class="marco-ornamental certificado">
  <div class="cert-header">DOCUMENTO OFICIAL</div>
  <div class="cert-title">Certificate Title</div>
  <p>Body text...</p>
  <div class="firma-bloque">
    <div class="firma-linea"></div>
    <div class="firma-nombre">Firmado por _______</div>
    <div class="firma-linea"></div>
    <div class="firma-nombre">Testigo _______</div>
  </div>
  <div class="sello-cera">E</div>
  <div class="cert-stamp">REGISTRADO</div>
</div>
```

**Required CSS**:
- Formal ornamental border (double line + corners)
- Parchment background (stronger gradient than regular paper)
- Wax seal: red, bottom-right
- Two signature lines
- Official header: small caps
- Stamp overlay: rotated "REGISTRADO" in light red
- Aging effects
