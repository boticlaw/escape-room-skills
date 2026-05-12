# Referencia — GPS Navegacion

## Variables

| Variable | Tipo | Rango | Default |
|----------|------|-------|---------|
| `latitud_objetivo` | number | -90 a 90 | - |
| `longitud_objetivo` | number | -180 a 180 | - |
| `radio_verificacion` | number | 5-100 | 20 |
| `mostrar_distancia` | boolean | - | true |
| `mostrar_direccion` | boolean | - | true |
| `url_maps_backup` | string | - | "" |

Opcionales: `nombre_destino`, `descripcion_destino`, `mensaje_llegada`, `foto_referencia`, `instrucciones_sin_gps`

## Errores Comunes

1. **No autorizan ubicacion:** "Calculando distancia" permanente. **Intervencion:** Instrucciones para habilitar GPS
2. **GPS impreciso:** En el lugar pero no detecta. **Prevencion:** Radio generoso 20+m. **Intervencion:** Moverse un poco o refrescar
3. **Direccion incorrecta:** Distancia aumenta. **Prevencion:** Flecha clara. **Intervencion:** "Ve hacia el colegio" o referencia local

**Senales:** "Calculando" >2 min, distancia no cambia, reportan estar pero no detecta.
**Tiempo maximo:** 10 min.

## Ejemplo: El Graffiti Final

```json
{ "latitud_objetivo": 42.1234, "longitud_objetivo": -4.5678, "radio_verificacion": 20, "mostrar_distancia": true, "mostrar_direccion": true, "nombre_destino": "Graffiti de Monzon" }
```

Pistas: 1)"Observa hacia donde ir, autoriza ubicacion" 2)"Fijate si suben o bajan metros" 3)"Hacia el colegio" 4)"Paciencia y observa" 5)"Encuentra el graffiti y escanea QR"

## Adaptaciones

**Ninos:** Radio amplio, direccion clara, sin distancias largas.
**Hall Escape:** No aplica.
**Street:** Ideal con fallback sin GPS.
**Investigacion:** Usar Street View virtual.

## Sinergias

- `prueba-ubicacion-qr`: GPS a zona, QR verifica exacto
- `prueba-adivinanza-ubicacion`: Adivinanza revela destino, GPS guia
