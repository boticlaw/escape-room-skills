# La Biblioteca Maldita

El bibliotecario dejó un libro abierto. Nadie debía leerlo.

## Información del Juego

- **Nombre**: La Biblioteca Maldita
- **Subtítulo**: El bibliotecario dejó un libro abierto. Nadie debía leerlo.
- **Autor**: Escapeitor
- **Fecha de creación**: 2026-04-06
- **Color temático**: #5C4033

## Estructura del Proyecto

```
biblioteca-maldita-v3/
├── juego/                    # Contenido del juego
│   ├── diseño/              # Diseño del juego, mecánicas, etc.
│   ├── materiales/          # Lista de materiales necesarios
│   ├── personajes/          # Fichas de personajes (si aplica)
│   ├── pruebas/             # Documentación de pruebas
│   └── narrativa/           # Historia, guión, etc.
├── doc/                      # Documentación de proceso
│   └── proceso/             # Notas de desarrollo
├── assets/                   # Recursos (imágenes, etc.)
├── plantilla.typ            # Plantilla Typst personalizada
├── generar-pdf.py           # Script para generar PDF
└── README.md                # Este archivo
```

## Generar PDF

Para generar el PDF del juego:

```bash
# Desde este directorio
python generar-pdf.py

# O con opciones adicionales
python generar-pdf.py --version "2.0" --cita "Nueva cita"

# O usando el generador genérico directamente
python scripts/generar-pdf.py \
    --directorio . \
    --nombre "La Biblioteca Maldita" \
    --color "#5C4033"
```

El script:
1. Busca automáticamente archivos MD en `juego/`
2. Los convierte a formato Typst
3. Genera un PDF profesional con la plantilla

## Personalización

### Cambiar colores

Edita `plantilla.typ` y modifica las líneas:

```typst
#let color_principal = rgb("#5C4033")
#let color_secundario = rgb("#D4AF37")
```

### Añadir contenido

1. Crea archivos Markdown en los directorios correspondientes:
   - `juego/diseño/` → Diseño del juego
   - `juego/narrativa/` → Historia y guión
   - `juego/materiales/` → Lista de materiales
   - etc.

2. El generador los incluirá automáticamente en el PDF

### Excluir archivos

Si quieres controlar exactamente qué archivos incluir:

```bash
python generar-pdf.py --archivos "diseño/DISEÑO-JUEGO.md:Diseño,narrativa/HISTORIA.md:Historia"
```

## Próximos Pasos

- [ ] Completar diseño del juego (`juego/diseño/DISEÑO-JUEGO.md`)
- [ ] Desarrollar narrativa (`juego/narrativa/`)
- [ ] Crear lista de materiales (`juego/materiales/lista-materiales.md`)
- [ ] Documentar pruebas (`juego/pruebas/`)
- [ ] Generar PDF final

## Notas

Añade aquí cualquier nota importante sobre el desarrollo del juego.

---
*Creado con el sistema de inicialización de Escapeitor*
