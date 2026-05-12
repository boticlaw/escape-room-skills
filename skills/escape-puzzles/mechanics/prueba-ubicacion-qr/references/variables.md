# Variables y Detalle — Ubicacion QR

## Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `tipo_ubicacion` | string | "monumento" \| "edificio" \| "naturaleza" \| "urban" | "monumento" | Categoria del lugar |
| `requiere_gps` | boolean | true/false | false | Mostrar navegacion GPS |
| `url_maps` | string | - | "" | Enlace Google Maps |
| `mensaje_llegada` | string | - | "" | Texto al escanear QR |
| `url_siguiente` | string | - | "" | URL destino del QR |
| `pista_ubicacion` | string | - | "" | Pista textual |

## Opcionales

`nombre_lugar`(string), `coordenadas_lat/lng`(number), `horario_acceso`(string), `foto_referencia`(string)

## Errores Comunes

1. **No encuentran QR:** Mal colocado/pequeno/deteriorado. **Prevencion:** Foto referencia. **Intervencion:** Descripcion exacta en pista 4-5.
2. **Se equivocan de lugar:** Pista ambigua. **Prevencion:** Pistas progresivas. **Intervencion:** Google Maps link.
3. **Problemas tecnicos:** Camara/luz/QR danado. **Prevencion:** Codigo alfanumerico alternativo. **Intervencion:** URL directa.

**Senales de alarma:** >10 min en misma ubicacion, reporta "no hay QR", distancia GPS no cambia.
**Tiempo maximo:** 15 min.

## Ejemplo: Puente sobre el Rio Carrion

```json
{ "tipo_ubicacion": "monumento", "nombre_lugar": "Puente sobre el rio Carrion", "url_maps": "https://maps.app.goo.gl/...", "url_siguiente": "https://devueltaalpueblo.com/pu3nt3" }
```

Pistas: 1)"Lugar que conecta partes del pueblo sobre un rio" → 5)"Ve al puente y escanea QR"

## Sinergias

- `prueba-adivinanza-ubicacion`: Adivinanza revela lugar, QR verifica
- `prueba-gps-navegacion`: GPS guia a zona, QR verifica exacto
- `prueba-acrostico-ubicacion`: Acrostico forma nombre del lugar
