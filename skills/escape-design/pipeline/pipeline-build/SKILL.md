---
name: pipeline-build
description: FASE 4 del pipeline de Escapeitor. El BuilderAgent genera todos los archivos del juego: estructura, pruebas, narrativa, diseño, materiales y PDF final.
---

# Pipeline Build — BuilderAgent (FASE 4)

## Input

| Archivo | Origen | Descripción |
|---------|--------|-------------|
| `DESIGN.json` | FASE 3 | Diseño completo: flujo, pruebas, tiempos, materiales |
| `BRIEF.json` | FASE 1 | `output_dir`: ruta donde guardar el juego (proyecto o suelto) |
| `CONCEPT.json` | FASE 2 | Concepto: premisa, personajes, actos, tagline |
| `BRIEF.json` | FASE 1 | Brief original: tipo, jugadores, duración, temática |

Todos se encuentran en `escape-material/` del juego correspondiente.

## Output

Directorio completo en la ruta indicada por `BRIEF.json.output_dir`:

```
{output_dir}/{juego-id}/
├── juego.json
├── {juego-id}.pdf
└── juego/
    ├── narrativa/NARRATIVA.md
    ├── diseño/DISEÑO-JUEGO.md
    ├── materiales/lista-materiales.md
    └── pruebas/*.json
```

## Pasos

### Paso 1: Inicializar estructura

```bash
python3 scripts/init-juego.py "{juego-id}" "{output_dir}"
```

Esto crea el esqueleto de directorios del juego.

### Paso 2: Escribir `juego.json`

Generar el archivo principal del juego usando el schema:

```json
{
  "nombre": "string",
  "subtitulo": "string (del CONCEPT.json tagline)",
  "autor": "Escapeitor",
  "fecha_creacion": "ISO-8601",
  "version": "1.0",
  "color_principal": "#hex",
  "color_secundario": "#hex",
  "tipo": "hall_escape|street_escape|investigation|concurso",
  "jugadores_min": number,
  "jugadores_max": number,
  "duracion_minutos": number,
  "dificultad": number,
  "descripcion": "string (de CONCEPT.json premisa)",
  "tags": []
}
```

**Fuentes de datos:**
- `nombre`, `tipo`, `jugadores_*`, `duracion_minutos`, `dificultad`, `tags` → de `BRIEF.json`
- `subtitulo` → de `CONCEPT.json.tagline`
- `descripcion` → de `CONCEPT.json.premisa`
- `color_*` → derivar de la temática (coherencia visual)
- `autor` → siempre `"Escapeitor"`
- `fecha_creacion` → fecha actual en ISO-8601
- `version` → `"1.0"`

### Paso 3: Copiar pruebas existentes

Si `DESIGN.json` referencia pruebas existentes:

```bash
cp escape-material/pruebas/*.json juegos/{juego-id}/juego/pruebas/
```

### Paso 4: Generar pruebas nuevas

Para cada prueba en `DESIGN.json.pruebas_nuevas_requeridas`:

1. **Leer el skill** del `skill_primario` correspondiente (en `escape-material/skills/`)
2. **Leer el schema** `schemas/prueba.schema.json` para validar estructura
3. **Generar el JSON** completo con todos los campos:

```json
{
  "id": "prueba_{mecanica}_{slug}_{001}",
  "nombre": "string",
  "skill_primario": "string",
  "skills_secundarios": [],
  "metadata_contextual": {
    "tipo_juego": "string",
    "adaptaciones": ["string"]
  },
  "descripcion": "string",
  "dificultad": number,
  "duracion_estimada_minutos": number,
  "configuracion": {},
  "materiales": [],
  "pistas": {
    "nivel_1": "string",
    "nivel_2": "string",
    "nivel_3": "string",
    "nivel_4": "string (opcional)",
    "nivel_5": "string (opcional)"
  },
  "solucion": "string",
  "feedback_exito": "string",
  "feedback_fallo": "string"
}
```

4. **Guardar** en `juegos/{juego-id}/juego/pruebas/`

**Importante:** La `configuracion` debe seguir las variables definidas en el SKILL.md del skill_primario.

### Paso 5: Escribir narrativa, diseño y materiales

#### `juego/narrativa/NARRATIVA.md`

Basada en `CONCEPT.json`. Estructura obligatoria:

```markdown
# {Nombre del Juego} — Narrativa

## Introducción
{Gancho y presentación del escenario}

## Acto I: {Nombre}
{Desarrollo del primer acto — personajes, contexto}

## Acto II: {Nombre}
{Desarrollo — conflicto, descubrimientos}

## Acto III: {Nombre}
{Climax y resolución}

## Personajes
{Lista de personajes con descripción breve}

## Notas de ambientación
{Indicaciones para el GM sobre tono y atmósfera}
```

#### `juego/diseño/DISEÑO-JUEGO.md`

Basada en `DESIGN.json`. Estructura obligatoria:

```markdown
# {Nombre del Juego} — Diseño de Juego

## Vista general
{Resumen del flujo}

## Lista de pruebas (orden de ejecución)
| # | Prueba | Tipo | Duración | Dificultad |
|---|--------|------|----------|------------|

## Flujo visual
{Diagrama o descripción del flujo entre pruebas}

## Tiempos estimados
{Desglose por prueba + buffers}

## Pistas para el GM
{Resumen de pistas clave y cuándo darlas}

## Notas de implementación
{Detalles técnicos o logísticos}
```

#### `juego/materiales/lista-materiales.md`

Basada en `DESIGN.json.materiales_requeridos`:

```markdown
# {Nombre del Juego} — Lista de Materiales

## Materiales por prueba
{Agrupados por prueba}

## Materiales generales
{Comunes a todo el juego}

## Checklist de preparación
{Lista de verificación para el GM}
```

### Paso 6: Generar PDF (HTML+CSS+Puppeteer)

1. **Asegurar que `juego.json` tiene los colores** `color_principal` y `color_secundario`

2. **Generar el PDF:**

```bash
python3 scripts/generate-pdf-html.py "{output_dir}/{juego-id}/" "{output_dir}/{juego-id}/{juego-id}.pdf"
```

Opcionalmente, pasar colores explícitos como 3º y 4º argumento:

```bash
python3 scripts/generate-pdf-html.py juegos/{juego-id}/ juegos/{juego-id}/{juego-id}.pdf "#5C4033" "#D4AF37"
```

El script usa:
- **Template:** `templates/escape-room-template.html` (HTML+CSS con variables de color parametrizables)
- **Motor:** Puppeteer (instalado en `projects/viernes-de-escape/protocolo-alerta-verde/node_modules/`)
- **Fuentes:** Lee `juego.json`, `NARRATIVA.md`, `DISEÑO-JUEGO.md`, `lista-materiales.md` y todos los `pruebas/*.json`

## Reglas

1. **Validación de pruebas:** Toda prueba nueva DEBE validar contra `schemas/prueba.schema.json`
2. **Pistas mínimas:** Cada prueba nueva DEBE tener mínimo 3 niveles de pistas (recomendado 5)
3. **Formato de IDs:** `prueba_{mecanica}_{slug}_{001}` (mecánica en minúsculas, slug descriptivo, secuencial)
4. **Coherencia cromática:** Los colores en `juego.json` deben ser coherentes con la temática del juego
5. **Narrativa completa:** `NARRATIVA.md` debe cubrir introducción, desarrollo por actos, clímax y resolución
6. **Diseño completo:** `DISEÑO-JUEGO.md` debe incluir lista de pruebas con orden, flujo visual, tiempos y pistas GM
7. **Sin placeholders:** Todos los archivos generados deben estar completos, sin texto placeholder como "TODO" o "rellenar aquí"

## Estructura de Archivos de Referencia

```
{project_root}/
├── escape-material/
│   ├── skills/pipeline-build/SKILL.md  ← este archivo
│   ├── scripts/init-juego.py
│   ├── schemas/prueba.schema.json
│   └── pruebas/              ← pruebas reutilizables existentes
├── templates/
│   └── escape-room-template.html  ← template HTML+CSS
├── scripts/
│   └── generate-pdf-html.py       ← generador PDF (Puppeteer)
├── {output_dir}/{juego-id}/  ← salida generada
```

## Ejemplo de Flujo Completo

**Input:** Brief "La Maldición del Reloj" (hall_escape, 4-6 jugadores, 90 min)

1. `init-juego.py "la-maldicion-del-reloj"` → crea estructura
2. `juego.json` → nombre "La Maldición del Reloj", tipo hall_escape, colores dorado #C5A55A y negro #1A1A2E
3. Copia 2 pruebas existentes del pool
4. Genera 3 pruebas nuevas: `prueba_cifrado_reloj_invertido_001`, `prueba_logica_engranajes_001`, `prueba_fisica_llave_oculta_001` — cada una con 5 niveles de pistas
5. Escribe `NARRATIVA.md` (actos: El Despertar, Los Engrenajes, La Última Hora)
6. Escribe `DISEÑO-JUEGO.md` con flujo y tiempos
7. Escribe `lista-materiales.md` con 12 materiales listados
8. Ejecuta `generate-pdf-html.py` → PDF final (colores dorado #C5A55A y negro #1A1A2E)
