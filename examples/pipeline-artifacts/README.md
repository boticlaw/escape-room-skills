# .pipeline — Directorio temporal de artefactos

Este directorio contiene los artefactos generados durante el pipeline de creación de juegos.

## Estructura

```
.pipeline/
└── {juego-id}/
    ├── BRIEF.json
    ├── CONCEPT.json
    ├── DESIGN.json
    ├── VERIFY-REPORT.json
    └── JUDGMENT-REPORT.json
```

## Lifecycle

1. **Creación:** Se crea un subdirectorio al iniciar la FASE 1 (Explore)
2. **Uso:** Cada fase lee artefactos anteriores y genera el suyo
3. **Finalización:** Tras aprobación en Judgment Day, los artefactos se mueven a `juegos/{juego}/doc/pipeline/`
4. **Cleanup:** Si el pipeline falla o se cancela, se puede eliminar el subdirectorio

## Nombres de juego-id

Formato: `{tematica-slug}_{YYYYMMDD}`
Ejemplo: `crimen-forense_20260406`, `biblioteca-maldita_20260410`
