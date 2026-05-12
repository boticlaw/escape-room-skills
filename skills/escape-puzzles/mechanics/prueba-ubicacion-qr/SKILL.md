---
name: prueba-ubicacion-qr
description: "Trigger: escanear QR, ubicacion fisica, ir al lugar, monumento, edificio, Street Escape. Jugadores se desplazan a ubicacion y escanean QR para desbloquear siguiente paso."
---

# Prueba Ubicacion QR

## Activation Contract

**Use when:** Jugador debe ir fisicamente a ubicacion concreta (monumento, edificio, punto de interes), verificar llegada escaneando QR, narrativa requiere info solo disponible in situ. Street Escape ideal.

**Don't use when:** Ubicacion no accesible 24/7 (usar `prueba-exploracion-visual`), solo navegacion sin verificacion (usar `prueba-gps-navegacion`), ubicacion interior/privada (colocar QR en exterior cercano).

## Hard Rules

- **NO** `requiere_gps=true` sin coordenadas validas
- **WARN** `horario_acceso` si el escape puede jugarse en cualquier momento
- **REGLA:** Ubicacion debe ser espacio publico accesible 24/7
- **SIEMPRE:** Incluir backup (codigo alfanumerico alternativo o URL directa)
- **Max time before GM intervention:** 15 min

## Decision Gates

| Nivel | Pista ubicacion | Tamano QR | Maps | Pistas | Tiempo |
|-------|----------------|-----------|------|--------|--------|
| Facil | Link Maps directo | Grande 10cm+ | Directo | 5 | 5-10min |
| Estandar | Descripcion textual | Mediano 5cm | En pista avanzada | 4 | 10-20min |
| Dificil | Adivinanza/acrostico | Pequeno 3cm | Nunca | 3 | 20-40min |
| Extrema | Multiples pistas previas | Integrado en decorado | Nunca | 2 | 40+min |

## Execution Steps

1. Seleccionar ubicacion (verificar acceso 24/7 publico)
2. Obtener coordenadas y URL de Google Maps
3. Disenar pistas progresivas (de sutil a directa con Maps)
4. Preparar QR fisico y codigo de backup
5. Configurar URL de destino del QR
6. Testear fisicamente el recorrido

## Output Contract

Output incluye: ubicacion con coordenadas, URL Maps, pista de ubicacion, URL destino del QR, mensaje de llegada, pistas progresivas (5 niveles), codigo de backup.

## References

- `references/variables.md` — Variables principales y opcionales
- `references/difficulty-scale.md` — Detalle de niveles
- `references/adaptations.md` — Adaptaciones por edad, espacio y duracion
- `references/errors.md` — Errores comunes + intervenciones
- `references/examples.md` — Ejemplo concreto (Puente Rio Carrion)
