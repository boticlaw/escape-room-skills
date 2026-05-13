# CSS Variables & Style System

## Dynamic Theme from STYLE.json

All CSS variables are derived from `juego/STYLE.json`. The builder reads the style guide and generates `:root` variables automatically:

```css
:root {
  --color-primary: STYLE.paleta.primario;
  --color-secondary: STYLE.paleta.secundario;
  --color-accent: STYLE.paleta.acento;
  --color-text: STYLE.paleta.texto;
  --color-text-muted: STYLE.paleta.texto_secundario;
  --color-bg-main: STYLE.paleta.fondo_principal;
  --color-bg-alt: STYLE.paleta.fondo_secundario;
  --color-border: STYLE.paleta.borde;
}
```

Additional variables from `componentes`:
```css
:root {
  --cartel-bg: STYLE.componentes.cartel.fondo;
  --cartel-text: STYLE.componentes.cartel.texto;
  --carta-bg: STYLE.componentes.carta.fondo;
  --carta-text: STYLE.componentes.carta.texto;
  --solution-bg: STYLE.componentes.solucion.fondo;
  --solution-text: STYLE.componentes.solucion.texto;
  --reward-bg: STYLE.componentes.recompensa.fondo;
  --reward-border: STYLE.componentes.recompensa.borde;
}
```

Typography from `tipografia`:
```css
:root {
  --font-title: STYLE.tipografia.titulo;
  --font-body: STYLE.tipografia.cuerpo;
  --font-special: STYLE.tipografia.especial;
  --size-title-main: STYLE.tipografia.titulo_import;
  --size-title-section: STYLE.tipografia.titulo_seccion;
  --size-body: STYLE.tipografia.cuerpo_tamano;
}
```

## Theme Presets (for auto-generation)

When the user has no style preference, select based on game genre:

| Genre | Style Name | Primary | Background | Accent | Font |
|---|---|---|---|---|---|
| Mystery/Investigation | Sepia Vintage | #8b7355 | #faf0e6 | #8b4513 | EB Garamond |
| Sci-Fi/Space | Neon Dark | #1f2833 | #0b0c10 | #66fcf1 | Space Mono |
| Horror/Haunted | Dark Gothic | #2d2d2d | #1a1a1a | #6b2d5b | Crimson Text |
| Adventure/Jungle | Earthy Green | #2d6a4f | #1b4332 | #d4a373 | Bitter |
| Pirate/Historical | Warm Gold | #6b3a00 | #3e1f00 | #f4d35e | Playfair Display |
| Spy/Espionage | Cool Blue | #1b263b | #0d1b2a | #e07000 | JetBrains Mono |
| Family/Nostalgic | Warm Sepia | #8b7355 | #faf0e6 | #d4a373 | EB Garamond |
| Competition/Quiz | Bold Modern | #e94560 | #1a1a2e | #f4d35e | Poppins |

Full preset definitions are in `references/style-schema.md`.
