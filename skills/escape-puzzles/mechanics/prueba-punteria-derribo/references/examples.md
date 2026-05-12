# Ejemplos — Punteria Derribo

## Ejemplo 1: "El Tiro del Sheriff"

Buscan tirachinas + bolas (busqueda) → derriban 5 latas en orden especifico (punteria) → cada lata revela numero: 7-2-9-4-1 → ingresan en caja fuerte (codigo numerico).

## Ejemplo 2: "El Arco del Cazador"

```json
{ "numero_objetivos": 5, "tipo_proyectil": "arco", "tipo_arco": "arco_juguete", "flechas_seguras": true, "material_objetivos": "botellas", "elemento_revelado": "letras", "formacion_codigo": "palabra", "distancia_lanzamiento": 4, "intentos_maximos": 25 }
```

Arco de juguete con flechas de goma → derriban 5 botellas → letras: C-A-S-A-S → palabra "CASAS".

## Ejemplo 3: "La Feria de las Latas"

```json
{ "numero_objetivos": 6, "tipo_proyectil": "bolas_mano", "elemento_revelado": "numeros", "formacion_codigo": "ecuacion", "distancia_lanzamiento": 3, "orden_revelacion": "secuencial" }
```

Derriban 6 latas en orden (indicado por luces) → numeros + operadores → 5 + 3 x 2 = 11.
