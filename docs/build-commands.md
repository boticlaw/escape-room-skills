# Build Commands

## Pipeline completo (valida + sincroniza + PDF)

```bash
bash scripts/build.sh <game.json>
```

## Solo validación

```bash
bash scripts/validar-sincronizacion.sh <game.json>
bash scripts/validate-schema.sh <game.json>
```

## Solo PDF (requiere validación previa)

```bash
node scripts/escape-pdf-generator.mjs <game.json>
```

**Regla:** Tras modificar JSONs → SIEMPRE build completo. Si falla, corregir antes de reportar completado.
