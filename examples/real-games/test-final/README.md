# Test Final

None

## Información del Juego

- **Nombre**: Test Final
- **Subtítulo**: None
- **Autor**: Escapeitor
- **Fecha de creación**: 2026-03-17
- **Color temático**: #8E44AD

## Estructura del Proyecto

```
test-final/
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
    --nombre "Test Final" \
    --color "#8E44AD"
```

El script:
1. Busca automáticamente archivos MD en `juego/`
2. Los convierte a formato Typst
3. Genera un PDF profesional con la plantilla

## Personalización

### Cambiar colores

Edita `plantilla.typ` y modifica las líneas:

```typst
#let color_principal = rgb("#8E44AD")
#let color_secundario = rgb("#8E44AD")
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
