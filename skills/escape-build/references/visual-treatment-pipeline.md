# Visual Treatment Pipeline

## Pipeline (MANDATORY)

For EVERY material generated:

1. **Read `STYLE.json.tratamientos_visuales`** — defines which decorative treatments apply to which material types
2. **Identify material type** — cartel, carta, diario, tablero, tarjeta, fragmento, etiqueta, foto, certificado
3. **Apply matching treatments** — for each treatment where the material type appears in `aplica_a`, include the corresponding CSS from `print-design-guide.md` recipes
4. **Verify prop quality** — if the material looks like it could be an email, spreadsheet, or Word document, it fails Hard Rule #5

## Treatment Application by Material Type

| Material Type | Required Treatments |
|---------------|-------------------|
| **cartel** (sign/poster) | Dark background + ornamental border + marionetta/stage motif + inner glow |
| **carta** (letter/note) | Sepia paper + aging shadow + coffee stains + fold creases + signature block + drop-cap |
| **diario** (diary/journal) | Notebook lines + red margin + aging + coffee stains + page numbers + tape marks |
| **tablero** (board/display) | Ornamental border + decorative title underline + alternating rows + subtle aging |
| **tarjeta** (card) | Card-textured background + inner shadow + numbered badge + scratch-off seals (if applicable) |
| **fragmento** (torn piece) | Irregular clip-path edges + heavy aging + coffee stains + fold creases + faint numbering |
| **etiqueta** (label/tag) | Card-textured background + small decorative border + optional wax seal |
| **foto** (photo) | Polaroid frame (white border, extra bottom) + drop shadow + slight rotation + date caption + scratch-off seal |
| **certificado** (certificate) | Formal ornamental border + parchment background + wax seal + signature lines + official stamp |

## Treatment Intensity

Not every document needs every treatment. Use judgment:

- **Light treatment**: cartas de navegación, etiquetas simples → aging + subtle shadow
- **Medium treatment**: cartas de Elena, tarjetas, tableros → aging + stains + decorative borders
- **Heavy treatment**: diario, fragmentos, certificados, carta de despedida → full treatment with all effects
- **Special treatment**: carteles de instrucción → dark bg + ornamental (different from sepia docs)

The `STYLE.json.tratamientos_visuales.envejecimiento` section specifies which aging effects are active for which document types.
