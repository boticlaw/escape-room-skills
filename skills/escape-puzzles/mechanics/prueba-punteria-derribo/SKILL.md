---
name: prueba-punteria-derribo
description: "Trigger: punteria, derribo, tirachinas, arco, lanzar proyectiles, juego de feria, latas, botellas. Derribar objetos revela numeros/letras/simbolos que forman un codigo."
---

# Prueba Punteria Derribo

## Activation Contract

**Use when:** Punteria con proyectiles (tirachinas, arco, bolas), derribar objetos revela elementos ocultos (numeros, letras, simbolos), temas de feria/carnaval/militar/caza. Espacio minimo 3x5 metros.

**Don't use when:** Sin componente fisico real (usar `prueba-digital-interfaz`), riesgo de seguridad (usar `prueba-mecanismo-fisico` con proyectiles seguros), solo un objetivo sin revelar multiples elementos (usar prueba basica), espacio reducido sin zona segura.

## Hard Rules

- **NO** `distancia_lanzamiento < 2` + `tipo_proyectil="arco"` (rebote, espacio insuficiente)
- **NO** `numero_objetivos < 3` (demasiado simple)
- **NO** `intentos_maximos < 5` + `numero_objetivos > 5` (imposible por probabilidad)
- **WARN** `distancia_lanzamiento > 10` en interiores (precision baja, frustracion)
- **WARN** `tipo_proyectil="dardos"` sin proteccion (riesgo pinchazo)
- **Max time before GM intervention:** 10 min (8 novatos, 15 expertos)

## Decision Gates

| Nivel | Objetivos | Distancia | Proyectil | Intentos | Orden | Tiempo |
|-------|-----------|-----------|-----------|----------|-------|--------|
| Facil | 3-4 | 2m | Bolas mano | 30+/infinitos | Libre | 5-10min |
| Estandar | 5-6 | 4m | Tirachinas | 20 | Libre | 10-18min |
| Dificil | 7-8 | 6m+ | Arco | 12-15 | Secuencial | 18-25min |
| Extrema | 10 | 8-10m | Arco deportivo | 12 | Secuencial + obstaculos | 25+min |

## Execution Steps

1. Seleccionar `tipo_proyectil` y `material_objetivos` segun espacio y publico
2. Definir `numero_objetivos`, `elemento_revelado` y `formacion_codigo`
3. Establecer `distancia_lanzamiento` y `intentos_maximos`
4. Si `orden_revelacion="secuencial"`: anadir indicadores visuales del orden
5. Preparar zona de seguridad y proteccion de paredes
6. Documentar solucion (orden de objetivos, codigo resultante)

## Output Contract

Output incluye: configuracion de proyectil/objetivos, elementos revelados por cada objetivo, orden de derribo, codigo/solucion final, pistas progresivas.

## References

- `references/variables.md` — Variables principales, por tipo de proyectil, opcionales
- `references/difficulty-scale.md` — Detalle completo de niveles
- `references/adaptations.md` — Adaptaciones por edad, espacio y duracion
- `references/errors.md` — Errores comunes + intervenciones GM
- `references/examples.md` — 3 ejemplos concretos (sheriff, cazador, feria)
