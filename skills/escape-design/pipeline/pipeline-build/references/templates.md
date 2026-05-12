# Build Templates

## NARRATIVA.md

```markdown
# {Nombre del Juego} — Narrativa

## Introducción
{Gancho y presentación del escenario}

## Acto I: {Nombre}
{Desarrollo — personajes, contexto}

## Acto II: {Nombre}
{Desarrollo — conflicto, descubrimientos}

## Acto III: {Nombre}
{Climax y resolución}

## Personajes
{Lista de personajes con descripción breve}

## Notas de ambientación
{Indicaciones para el GM sobre tono y atmósfera}
```

## DISEÑO-JUEGO.md

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

## lista-materiales.md

```markdown
# {Nombre del Juego} — Lista de Materiales

## Materiales por prueba
{Agrupados por prueba}

## Materiales generales
{Comunes a todo el juego}

## Checklist de preparación
{Lista de verificación para el GM}
```

## Example Flow

**Input:** Brief "La Maldición del Reloj" (hall_escape, 4-6 jugadores, 90 min)

1. `init-juego.py "la-maldicion-del-reloj"` → creates structure
2. `juego.json` → nombre, tipo, colors dorado #C5A55A + negro #1A1A2E
3. Copy 2 existing puzzles
4. Generate 3 new: `prueba_cifrado_reloj_invertido_001`, `prueba_logica_engranajes_001`, `prueba_fisica_llave_oculta_001`
5. Write NARRATIVA.md (3 acts)
6. Write DISEÑO-JUEGO.md
7. Write lista-materiales.md (12 items)
8. `generate-pdf-html.py` → PDF final
