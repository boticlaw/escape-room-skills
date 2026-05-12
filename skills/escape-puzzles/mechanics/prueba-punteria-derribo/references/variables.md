# Variables — Punteria Derribo

## Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `numero_objetivos` | number | 3-10 | 5 | Objetos a derribar |
| `tipo_proyectil` | string | "tirachinas" \| "arco" \| "bolas_mano" \| "dardos" \| "anillos" | "tirachinas" | Metodo de lanzamiento |
| `material_objetivos` | string | "latas" \| "botellas" \| "cajas" \| "bloques_madera" \| "peluches" | "latas" | Material objetivos |
| `elemento_revelado` | string | "numeros" \| "letras" \| "simbolos" \| "colores" | "numeros" | Que se revela al caer |
| `formacion_codigo` | string | "password_numerico" \| "palabra" \| "secuencia" \| "ecuacion" | "password_numerico" | Como se forma la solucion |
| `orden_revelacion` | string | "libre" \| "secuencial" \| "aleatorio" | "libre" | Orden de derribo |
| `distancia_lanzamiento` | number | 2-15 | 4 | Metros al objetivo |
| `intentos_maximos` | number | 5-50 | 20 | Proyectiles disponibles |

## Por Proyectil

**tirachinas:** `tipo_municion`("bolas_goma"|"papel_bolas"|"gomitas"), `tension_tirachinas`("baja"|"media"|"alta")

**arco:** `tipo_arco`("arco_juguete"|"arco_deportivo"|"ballesta_segura"), `flechas_seguras`(bool), `diana_incluida`(bool)

**bolas_mano:** `tamano_bolas`("pequenas"|"medianas"|"grandes"), `material_bolas`("plastico"|"espuma"|"tenis"), `peso_bolas`("ligero"|"medio"|"pesado")

## Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `feedback_progresivo` | boolean | Indica cuantos objetivos derribados |
| `proyectiles_ilimitados` | boolean | Intentos infinitos |
| `bonus_precision` | boolean | Recompensa extra por primer intento |
| `obstaculos` | array | Elementos que dificultan lanzamiento |
