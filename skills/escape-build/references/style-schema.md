# STYLE.json Schema

## Purpose

`STYLE.json` is the single source of truth for the visual identity of a game. It lives at `juego/STYLE.json` and is consumed by `escape-build` to generate all materials with consistent styling.

## When is it created?

During the RESOLVE phase of the pipeline. The orchestrator asks the user:
- "¿Tenés un estilo definido (cartel, moodboard, referencia visual)?"
- If yes → user provides description → STYLE.json is generated from that description
- If no → "¿Querés que diseñe uno basado en la temática del juego?" → auto-generate from game theme

## Schema

```json
{
  "nombre": "string — style name for reference",
  "descripcion": "string — mood/aesthetic description",
  "paleta": {
    "primario": "hex — main brand/background color",
    "secundario": "hex — secondary panels/sections",
    "acento": "hex — highlights, CTAs, important elements",
    "texto": "hex — body text color",
    "texto_secundario": "hex — muted/secondary text",
    "fondo_principal": "hex — main background (documents)",
    "fondo_secundario": "hex — alternate background (cards, boxes)",
    "borde": "hex — borders, dividers"
  },
  "tipografia": {
    "titulo": "font-family — for headings and titles",
    "titulo_import": "font-size for main titles (e.g. '28pt')",
    "titulo_seccion": "font-size for section headers (e.g. '15pt')",
    "cuerpo": "font-family — for body text",
    "cuerpo_tamano": "font-size for body (e.g. '10.5pt')",
    "especial": "font-family — for narrative/special text (diary, letters)",
    "import_url": "string — Google Fonts import URL (or null if system font)"
  },
  "componentes": {
    "cartel": {
      "fondo": "hex — poster/sign background",
      "texto": "hex — poster text color",
      "borde": "hex — poster border/accent"
    },
    "carta": {
      "fondo": "hex — letter background",
      "texto": "hex — letter text color",
      "estilo": "string — CSS style notes (e.g. 'aged paper, burnt edges')"
    },
    "solucion": {
      "fondo": "hex — solution box background",
      "texto": "hex — solution box text",
      "borde": "hex — solution box border"
    },
    "recompensa": {
      "fondo": "hex — reward box background",
      "borde": "hex — reward box border"
    }
  },
  "texturas": {
    "papel": "string — paper style (e.g. 'sepia aged', 'white clean', 'kraft')",
    "envejecimiento": "boolean — apply aging effects to documents",
    "bordes_quemados": "boolean — burnt edges effect on special documents",
    "sombra_interior": "string — inner shadow CSS for document aging (or null)"
  },
  "formato": {
    "pagina": "string — page size (default: 'A4')",
    "orientacion": "string — 'portrait' or 'landscape'",
    "margenes": "string — margins (default: '15mm')"
  },
  "notas": "string — any additional style notes for the builder"
}
```

## How escape-build uses STYLE.json

1. Read `STYLE.json` from the game directory
2. Generate CSS `:root` variables from `paleta` fields
3. Apply `tipografia` to font stacks
4. Apply `componentes` to component classes
5. Apply `texturas` as CSS effects (shadows, gradients, borders)
6. Apply `formato` to `@page` rules

## Theme Presets (for auto-generation)

When the user has no style preference, use these presets based on game genre:

| Genre | Preset | Key Colors | Font |
|---|---|---|---|
| Mystery/Investigation | Sepia Vintage | #faf0e6, #8b7355, #3d2b1f | EB Garamond |
| Sci-Fi/Space | Neon Dark | #0b0c10, #1f2833, #66fcf1 | Space Mono |
| Horror/Haunted | Dark Gothic | #1a1a1a, #2d2d2d, #6b2d5b | Crimson Text |
| Adventure/Jungle | Earthy Green | #1b4332, #2d6a4f, #d4a373 | Bitter |
| Pirate/Historical | Warm Gold | #3e1f00, #6b3a00, #f4d35e | Playfair Display |
| Spy/Espionage | Cool Blue | #0d1b2a, #1b263b, #e07000 | JetBrains Mono |

These presets are suggestions — the builder should adapt based on the game's specific narrative and mood.
