---
name: prueba-gps-navegacion
description: "Trigger: GPS, navegar, distancia, coordenadas, geolocalizacion, ir al destino. Navegacion GPS hacia ubicacion verificando cercania sin QR fisico."
---

# Prueba GPS Navegacion

## Activation Contract

**Use when:** Navegar a ubicacion usando GPS del movil, verificar llegada por distancia (no QR), ubicacion puede no tener QR instalado. Street Escape ideal.

**Don't use when:** Ubicacion con GPS pobre (interiores, tuneles), necesitas verificacion exacta (GPS tiene error 5-20m, usar `prueba-ubicacion-qr`), sin acceso a ubicacion autorizado.

## Hard Rules

- **NO** `radio_verificacion < 10` sin instrucciones alternativas
- **WARN** Sin `url_maps_backup` (usuarios sin GPS se bloquean)
- **SIEMPRE** tener fallback para usuarios sin GPS autorizado
- **Max time before GM intervention:** 10 min

## Decision Gates

| Nivel | Radio | Direccion | Maps | Pistas | Tiempo |
|-------|-------|-----------|------|--------|--------|
| Facil | 30m+ | Distancia+flecha | Directo | 5 | 5-10min |
| Estandar | 20m | Solo distancia | En pista | 4 | 10-15min |
| Dificil | 10m | Sin direccion | No | 2 | 15-25min |
| Extrema | Waypoints multiples | Ninguna | No | 0 | 25+min |

## Execution Steps

1. Obtener coordenadas exactas del destino
2. Definir `radio_verificacion` generoso (20+m)
3. Preparar `url_maps_backup` y `instrucciones_sin_gps`
4. Testear cobertura GPS en la zona
5. Incluir referencias locales en pistas

## Output Contract

Coordenadas, radio verificacion, URL Maps backup, nombre destino, instrucciones sin GPS, pistas progresivas.

## References

- `references/variables.md` — Variables, errores, adaptaciones, ejemplo
