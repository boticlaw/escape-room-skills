# Referencia Completa — Puzzle Ensamblaje

## Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `numero_fragmentos` | number | 2-12 | 6 | Piezas a ensamblar |
| `tipo_ensamblaje` | string | "puzzle_tradicional" \| "superposicion" \| "secuencia" \| "mecanismo" | "puzzle_tradicional" | Como se unen |
| `contenido_final` | string | "imagen" \| "texto" \| "codigo" \| "objeto_funcional" | "imagen" | Que forma el ensamblaje |
| `formato_piezas` | string | "fisico" \| "digital" \| "mixto" | "fisico" | Medio |
| `pieza_guia` | boolean | true/false | false | Imagen/base referencia |

## Por Tipo

**puzzle_tradicional:** `forma_piezas`, `numero_filas`(2-4), `numero_columnas`(2-4), `borde_guia`(bool)
**superposicion:** `capas`(2-5), `alineacion`("marcas"|"esquinas"|"completo"), `orden_capas`(bool)
**secuencia:** `longitud_secuencia`(3-10), `tipo_orden`("cronologico"|"numerico"|"logico"), `pistas_orden`(bool)
**mecanismo:** `piezas_mecanicas`(2-8), `tipo_encaje`("magnetico"|"ranura"|"encaje"), `funcion_activa`(bool)

## Opcionales

`piezas_decoy`(number), `marcas_ocultas`(bool), `validacion_automatica`(bool), `feedback_progresivo`(bool)

## Errores Comunes

1. **Forzar encajes incorrectos:** Piezas similares. **Prevencion:** Encajes unicos. **Intervencion:** "Buscad primero las esquinas/bordes"
2. **Ignorar orden en secuencias:** No detectan pistas. **Intervencion:** "Notais algun patron que sugiera un orden?"
3. **No verificar resultado final:** Ensamblan pero no "leen". **Intervencion:** "Que muestra el ensamblaje completo?"

**Senales de alarma:** >5 min con piezas incorrectas, no identifican decoys, ensamblaron pero no avanzan.
**Tiempo maximo:** 10-12 min.

## Adaptaciones

**Ninos (6-10):** Piezas grandes y coloridas. Encajes holgados. Imagen guia siempre. Sin decoy.
**Adolescentes:** Medianas. Superposicion/secuencia. 1-2 decoy.
**Adultos:** Complejidad completa. Mecanismos funcionales.

**Hall Escape:** Mesa dedicada. Piezas magneticas. Validacion visual.
**Street Escape:** App que une fragmentos o piezas en contenedor portable.
**Investigacion:** Documentos rasgados. Fotos fragmentadas de evidencia.

## Ejemplos

**Mapa del Tesoro:** 6 fragmentos puzzle tradicional → mapa con coordenadas.
**Contrato Secreto:** 4 paginas secuencia numerica → clausula oculta que incrimina.

## Sinergias

- `prueba-busqueda-objetos`: Piezas encontradas antes de ensamblar
- `prueba-logica-secuencial`: Orden de piezas sigue logica
- `prueba-mecanismo`: Ensamblaje forma mecanismo funcional
