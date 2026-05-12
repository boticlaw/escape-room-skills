---
name: prueba-punteria-derribo
description: Skill para crear pruebas de punteria y destreza donde los jugadores derriban objetos para revelar numeros, letras o simbolos que forman un codigo o password. Usar cuando se necesite (1) disenar una prueba que requiera lanzar proyectiles con tirachinas, arco, bolas u otros medios, (2) crear mecanismos donde al derribar objetos se revelen pistas ocultas, (3) implementar juegos de feria o carnaval con recompensas progresivas.
---

# Prueba Punteria Derribo

Skill para el diseno, validacion y adaptacion de pruebas basadas en juegos de punteria donde derribar objetos revela elementos clave para resolver un codigo.

---

## Cuando Usar Este Tipo de Prueba

Usa este skill cuando:

- [ ] **Trigger 1:** El usuario busca una prueba con componente de punteria o lanzamiento de proyectiles
- [ ] **Trigger 2:** Se necesita que al derribar/caeser objetos se revelen elementos ocultos (numeros, letras, simbolos)
- [ ] **Trigger 3:** El tema del juego involucra ferias, carnavales, entrenamiento militar, caza, o competencias de destreza

**Ejemplos de prompts que activan este skill:**
- "Quiero una prueba donde tiren con tirachinas para derribar latas"
- "Necesito que derriben botellas y revelen numeros para un codigo"
- "Como hacer un juego de tiro al blanco que de una contrasena"
- "Prueba de punteria con arco que revele pistas al acertar"
- "Juego de lanzar pelotas para tirar objetos y descubrir letras"

---

## Cuando NO Usarlo (Anti-Patrones)

**NO uses este skill cuando:**

### Anti-Patron 1: Sin Componente de Punteria Real
- **Por que falla:** Este skill requiere que los jugadores realmente lancen/disparen proyectiles. Si solo es presionar botones o simulacion digital, pierde la esencia fisica.
- **Mejor alternativa:** Usar `prueba-digital-interfaz` con simulacion de tiro

### Anti-Patron 2: Peligro Fisico Real
- **Por que falla:** Si los proyectiles pueden causar dano (flechas afiladas, objetos pesados, espacio reducido), existe riesgo de seguridad.
- **Mejor alternativa:** Usar `prueba-mecanismo-fisico` con proyectiles seguros (bolas de espuma, gomitas) o sistemas de deteccion sin proyectiles reales

### Anti-Patron 3: Solo Un Objetivo Simple
- **Por que falla:** Si solo hay un objetivo que derribar sin revelar elementos multiples, es demasiado simple para justificar esta estructura.
- **Mejor alternativa:** Usar `prueba-mecanismo-fisico` simple o `prueba-target-unico`

### Anti-Patron 4: Sin Espacio Fisico Adecuado
- **Por que falla:** Se necesita espacio para lanzar (minimo 3-5 metros) y zona segura detras del objetivo. En espacios reducidos es peligroso o impracticable.
- **Mejor alternativa:** Usar `prueba-codigo-numerico` o reducir escala con `proyectiles_miniatura`

**Regla general:** Si no hay lanzamiento fisico real O hay riesgo de seguridad O solo hay un objetivo sin elementos revelables, entonces este tipo NO es adecuado.

---

## Variables de Diseno

### Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `numero_objetivos` | number | 3-10 | 5 | Cantidad de objetos a derribar |
| `tipo_proyectil` | string | "tirachinas" \| "arco" \| "bolas_mano" \| "dardos" \| "anillos" | "tirachinas" | Metodo de lanzamiento |
| `material_objetivos` | string | "latas" \| "botellas" \| "cajas" \| "bloques_madera" \| "peluches" | "latas" | Material de los objetivos |
| `elemento_revelado` | string | "numeros" \| "letras" \| "simbolos" \| "colores" | "numeros" | Que se revela al caer |
| `formacion_codigo` | string | "password_numerico" \| "palabra" \| "secuencia" \| "ecuacion" | "password_numerico" | Como se forma la solucion |
| `orden_revelacion` | string | "libre" \| "secuencial" \| "aleatorio" | "libre" | Orden en que deben derribarse |
| `distancia_lanzamiento` | number | 2-15 | 4 | Metros de distancia al objetivo |
| `intentos_maximos` | number | 5-50 | 20 | Total de proyectiles disponibles |

**Variables especificas por tipo de proyectil:**

*Si `tipo_proyectil="tirachinas"`:*
| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `tipo_municion` | string | "bolas_goma" \| "papel_bolas" \| "gomitas_elasticas" | "bolas_goma" | Proyectiles para tirachinas |
| `tension_tirachinas` | string | "baja" \| "media" \| "alta" | "media" | Dificultad del tirachinas |

*Si `tipo_proyectil="arco"`:*
| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `tipo_arco` | string | "arco_juguete" \| "arco_deportivo" \| "ballesta_segura" | "arco_juguete" | Tipo de arco a usar |
| `flechas_seguras` | boolean | true/false | true | Flechas con punta de goma/esponja |
| `diana_incluida` | boolean | true/false | false | Si los objetivos son dianas con puntos |

*Si `tipo_proyectil="bolas_mano"`:*
| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `tamano_bolas` | string | "pequenas" \| "medianas" \| "grandes" | "medianas" | Tamano de las bolas (5-15cm) |
| `material_bolas` | string | "plastico" \| "espuma" \| "tenis" | "plastico" | Material de las bolas |
| `peso_bolas` | string | "ligero" \| "medio" \| "pesado" | "ligero" | Peso relativo |

### Variables Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `feedback_progresivo` | boolean | Si se indica cuantos objetivos llevan derribados |
| `proyectiles_ilimitados` | boolean | Si tienen intentos infinitos (sin presion) |
| `bonus_precision` | boolean | Si hay recompensa extra por derribo en primer intento |
| `obstaculos` | array | Elementos que dificultan el lanzamiento (viento, barreras) |
| `multiplicadores` | array | Objetivos especiales que dan pistas extra |
| `sonido_impacto` | boolean | Si hay sonido al acertar |
| `indicador_progreso` | string | "visual" \| "sonoro" \| "ambos" \| "ninguno" | Feedback de avance |

### Combinaciones Validas

- **Configuracion Facil:** `numero_objetivos=3`, `tipo_proyectil="bolas_mano"`, `distancia_lanzamiento=2`, `intentos_maximos=30`
- **Configuracion Estandar:** `numero_objetivos=5`, `tipo_proyectil="tirachinas"`, `distancia_lanzamiento=4`, `intentos_maximos=20`, `elemento_revelado="numeros"`
- **Configuracion Avanzada:** `numero_objetivos=8`, `tipo_proyectil="arco"`, `distancia_lanzamiento=6`, `intentos_maximos=15`, `orden_revelacion="secuencial"`
- **Configuracion Experto:** `numero_objetivos=10`, `tipo_proyectil="tirachinas"`, `distancia_lanzamiento=8`, `proyectiles_ilimitados=false`, `intentos_maximos=12`, `obstaculos=["viento"]`

### Combinaciones Prohibidas/Peligrosas

- [X] NO combines `distancia_lanzamiento < 2` con `tipo_proyectil="arco"` (riesgo de rebote, espacio insuficiente)
- [X] NO combines `numero_objetivos < 3` (demasiado simple, usar prueba basica)
- [X] NO combines `intentos_maximos < 5` con `numero_objetivos > 5` (imposible por probabilidad)
- [WARN] Cuidado con `distancia_lanzamiento > 10` en espacios interiores (precision muy baja, frustracion)
- [WARN] Cuidado con `tipo_proyectil="dardos"` sin proteccion adecuada (riesgo de pinchazo)

---

## Errores Comunes de Jugadores

### Error 1: Fuerza vs Precision
- **Sintoma:** Lanzan muy fuerte pero sin punteria, fallan repetidamente
- **Causa:** Creen que mas fuerza = mejor, no controlan direccion
- **Prevencion:** Disenar sistema donde precision importe mas que fuerza (objetivos estables que no caen solo por impacto fuerte)
- **Intervencion:** "Intentad apuntar mejor, no solo lanzar mas fuerte"

### Error 2: No Notar los Numeros Revelados
- **Sintoma:** Derriban objetivos pero no ven/memorizan los numeros que se revelan
- **Causa:** Enfocados solo en derribar, no en el objetivo de la prueba
- **Prevencion:** Hacer que los numeros sean visibles/obligatorios de recoger para continuar
- **Intervencion:** "Aseguraos de ver que numero/letra aparece cada vez que cae uno"

### Error 3: Orden Equivocado
- **Sintoma:** Si `orden_revelacion="secuencial"`, intentan derribar en orden incorrecto y frustrarse
- **Causa:** No entienden que deben seguir un orden especifico
- **Prevencion:** Indicador claro de cual es el siguiente objetivo valido (luz, marcador)
- **Intervencion:** "Fijaos si hay algun indicador de que objetivo debes derribar primero"

### Error 4: Gastar Proyectiles en el Mismo Objetivo
- **Sintoma:** Tiran 5+ veces al mismo objetivo sin lograrlo, se quedan sin municion
- **Causa:** Obcecacion con un objetivo dificil, no rotan a otros mas faciles
- **Prevencion:** Permitir cambiar de objetivo, feedback de "prueba con otro"
- **Intervencion:** "Quizas deberiais intentar con otro objetivo mas accesible"

### Error 5: No Entender la Formacion del Codigo
- **Sintoma:** Tienen todos los numeros pero no saben como ordenarlos para el password
- **Causa:** No hay pista clara sobre el orden o la formacion del codigo
- **Prevencion:** Proporcionar diagrama o instruccion sobre como ordenar los elementos
- **Intervencion:** "Mirad si hay algun diagrama que indique el orden de los numeros"

**Senales de alarma (el jugador esta atascado):**
- [ ] Llevan 10+ intentos sin derribar ningun objetivo (problema de punteria)
- [ ] Derribaron todos pero no saben que hacer con los numeros/letras
- [ ] Discuten sobre "en que orden van los numeros" sin tener pista
- [ ] Se quedaron sin proyectiles y no completaron
- [ ] Llevan >15 minutos sin derribar el minimo necesario

**Tiempo maximo recomendado antes de intervenir:** 10 minutos (8 si son novatos, 15 si son expertos)

---

## Escalado de Dificultad

### Version Facil (Nivel 1-3)
- **Caracteristicas:**
  - 3-4 objetivos, bolas de mano (facil de lanzar)
  - Distancia corta (2 metros)
  - Numeros grandes y visibles
  - Proyectiles ilimitados o 30+ intentos
  - Orden libre (cualquiera primero)
  - Feedback claro de acierto (sonido/luz)
- **Tiempo estimado:** 5-10 minutos
- **Publico objetivo:** Ninos 8-12 anos, grupos novatos, familias

### Version Estandar (Nivel 4-6)
- **Caracteristicas:**
  - 5-6 objetivos, tirachinas o bolas medianas
  - Distancia media (4 metros)
  - Numeros/letras que forman password claro
  - 20 intentos disponibles
  - Feedback progresivo de cuantos llevan
- **Tiempo estimado:** 10-18 minutos
- **Publico objetivo:** Publico general, adultos

### Version Dificil (Nivel 7-9)
- **Caracteristicas:**
  - 7-8 objetivos, arco o tirachinas con precision
  - Distancia larga (6+ metros)
  - Letras que forman palabra con orden especifico
  - 15 intentos o menos
  - Orden secuencial requerido
  - Posibles distractores (objetivos que no son parte del codigo)
- **Tiempo estimado:** 18-25 minutos
- **Publico objetivo:** Expertos, entusiastas

### Version Extrema (Nivel 10)
- **Caracteristicas:**
  - 10 objetivos, arco deportivo o tirachinas de alta precision
  - Distancia 8-10 metros
  - Ecuacion matematica (derribar para formar operacion)
  - 12 intentos maximos, proyectiles limitados
  - Obstaculos (viento artificial, barreras moviles)
  - Sin feedback de progreso (no saben cuantos llevan)
- **Tiempo estimado:** 25+ minutos
- **Publico objetivo:** Competencias, speedruns, expertos

**Matriz de escalado:**

| Aspecto | Facil | Estandar | Dificil |
|---------|-------|----------|---------|
| Objetivos | 3-4 | 5-6 | 7-8 |
| Distancia | 2m | 4m | 6m+ |
| Proyectiles | Ilimitados/30+ | 20 | 12-15 |
| Formacion | Libre | Libre | Secuencial |
| Proyectil | Bolas mano | Tirachinas | Arco |
| Tiempo | 5-10min | 10-18min | 18-25min |

---

## Adaptaciones

### Por Edad

**Ninos (6-10 anos):**
- Simplificar: Maximo 3 objetivos, distancia 2 metros
- Evitar: Tirachinas (requieren coordinacion), objetivos muy pequenos
- Anadir: Objetivos grandes y coloridos, sonidos divertidos al acertar, proyectiles grandes y suaves
- Seguridad: Proyectiles de espuma, espacio amplio sin objetos fragiles cerca

**Adolescentes (11-17 anos):**
- Mantener: Version estandar completa
- Permitir: Tirachinas y arcos de juguete, distancias medias
- Anadir: Elemento competitivo (puntuaciones, tiempo)

**Adultos (18+):**
- Complejidad completa
- Considerar: Tirachinas potentes, arcos deportivos, distancias largas
- Tematica: Entrenamiento militar, supervivencia, caza deportiva

**Grupos mixtos:**
- Estrategia: Permitir que los adultos lancen y los ninos recojan/lean los numeros
- Elementos cooperativos: Cada jugador se especializa en ciertos objetivos

### Por Espacio

**Hall Escape (sala fisica):**
- Ventajas: Espacio controlado, decoracion tematica
- Limitaciones: Altura del techo, objetos fragiles cercanos
- Adaptaciones: Zona delimitada para lanzar, proteccion de paredes (colchonetas), objetivos en estantes o mesa

**Street Escape (exterior/movil):**
- Ventajas: Espacio abierto, contexto real (feria, parque)
- Limitaciones: Clima, seguridad publica, ruido
- Adaptaciones: Estructura portatil, proteccion contra viento, sistema de recogida automatica de proyectiles

**Juego de Investigacion (no presencial):**
- NO aplica este skill - requiere componente fisico de lanzamiento
- Alternativa: `prueba-digital-interfaz` con simulacion de tiro

**Digital/Virtual:**
- NO aplica - sin componente fisico de punteria real
- Alternativa: `prueba-simulacion-tiro` virtual

### Por Duracion

**Quick (5-10 minutos):**
- Elementos a eliminar: Orden secuencial, proyectiles limitados, obstaculos
- Foco: 3-4 objetivos rapidos, bolas de mano
- Configuracion: `numero_objetivos=3`, `distancia_lanzamiento=2`, `proyectiles_ilimitados=true`

**Standard (15-30 minutos):**
- Version completa estandar

**Epic (45+ minutos):**
- Elementos a anadir: Multi-etapa
- Sub-etapas:
  1. Encontrar proyectiles escondidos
  2. Derribar objetivos basicos para obtener herramienta mejorada
  3. Derribar objetivos principales con herramienta mejor
  4. Descifrar codigo formado

---

## Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-busqueda-objetos`**
- **Sinergia:** Los proyectiles o el tirachinas estan fisicamente escondidos
- **Ejemplo compuesto:** Los jugadores buscan y encuentran un tirachinas y municion. Luego lo usan en la prueba de punteria.
- **Frecuencia:** Muy comun

**2. `prueba-cifrado`**
- **Sinergia:** El orden de los numeros/letras revelados esta codificado/encriptado
- **Ejemplo compuesto:** Descifran un mensaje que dice "Ordena: Primero rojo, luego azul...". Aplican al orden de objetivos.
- **Frecuencia:** Comun

**3. `prueba-logica-secuencial`**
- **Sinergia:** El orden para derribar objetivos sigue una logica deducible
- **Ejemplo compuesto:** Deducen que deben derribar en orden cromatica (rojo-naranja-amarillo...) aplicando logica de secuencias.
- **Frecuencia:** Ocasional

**4. `prueba-mecanismo-fisico`**
- **Sinergia:** Al completar el codigo, activa un mecanismo fisico (cajon, puerta)
- **Ejemplo compuesto:** El password numerico ingresado en un teclado abre un cajon. Los numeros se obtuvieron derribando objetivos.
- **Frecuencia:** Muy comun

**5. `prueba-codigo-numerico`**
- **Sinergia:** Los numeros obtenidos se ingresan en un teclado/cerradura
- **Ejemplo compuesto:** Derriban 5 objetivos, obtienen numeros 2-7-1-9-4, los ingresan en cerradura de 5 digitos.
- **Frecuencia:** Muy comun

### Skills Alternativos (Sustitucion)

**En lugar de este skill, considera:**

- **`prueba-mecanismo-fisico`** → Si no se necesita punteria real (solo manipulacion fisica)
- **`prueba-codigo-numerico`** → Si es solo introducir combinacion (sin componente de lanzamiento)
- **`prueba-secuencia-colores`** → Si es solo ordenar/emparejar colores (sin lanzar)

### Skills Incompatibles (No Usar Juntos)

**Evita combinar con:**

- [X] `prueba-punteria-derribo-simple` (si existiera) → Conflicto: Redundancia, usar variables de este skill
- [X] `prueba-simulacion-digital` → Conflicto: Este skill requiere fisico real de lanzamiento

### Ejemplos de Pruebas Compuestas

**Ejemplo 1: "El Tiro del Sheriff"**
- **Skills usados:** `prueba-busqueda-objetos` + `prueba-punteria-derribo` + `prueba-codigo-numerico`
- **Descripcion:**
  1. Buscan y encuentran tirachinas y bolas de goma escondidas (busqueda)
  2. Usan el tirachinas para derribar 5 latas en orden especifico (punteria)
  3. Cada lata revela un numero que forma el codigo 7-2-9-4-1
  4. Ingresan el codigo en una caja fuerte del sheriff (codigo numerico)
  5. La caja contiene la llave para salir
- **Por que funciona:** Multi-etapa que integra exploracion, destreza fisica y resolucion de codigo.

**Ejemplo 2: "El Arco del Cazador" (TU PRUEBA)**
- **Skills usados:** `prueba-punteria-derribo`
- **Configuracion:**
  ```json
  {
    "numero_objetivos": 5,
    "tipo_proyectil": "arco",
    "tipo_arco": "arco_juguete",
    "flechas_seguras": true,
    "material_objetivos": "botellas",
    "elemento_revelado": "letras",
    "formacion_codigo": "palabra",
    "distancia_lanzamiento": 4,
    "intentos_maximos": 25,
    "orden_revelacion": "libre"
  }
  ```
- **Descripcion:** Los jugadores usan un arco de juguete con flechas de goma para derribar 5 botellas. Cada botella al caer revela una letra (C, A, S, A, S). Combinando las letras en el orden correcto forman la palabra "CASAS" que es la clave para abrir la puerta siguiente.
- **Por que funciona:** Combina destreza fisica (tiro con arco), recompensa progresiva (revelar letras), y resolucion de anagrama.

**Ejemplo 3: "La Feria de las Latas"**
- **Skills usados:** `prueba-punteria-derribo` + `prueba-logica-secuencial`
- **Configuracion:**
  ```json
  {
    "numero_objetivos": 6,
    "tipo_proyectil": "bolas_mano",
    "material_objetivos": "latas",
    "elemento_revelado": "numeros",
    "formacion_codigo": "ecuacion",
    "distancia_lanzamiento": 3,
    "intentos_maximos": 30,
    "orden_revelacion": "secuencial"
  }
  ```
- **Descripcion:** En una tematica de feria, deben derribar 6 latas en orden (indicado por luces). Cada lata revela un numero y un operador matematico (+, -, x). Al final obtienen: 5 + 3 x 2 = ? Deben resolver para obtener el codigo 11.
- **Por que funciona:** Integra destreza, orden secuencial y habilidad matematica.

---

## Notas de Implementacion Tecnica

### Hardware Recomendado

**Objetivos:**
- Materiales ligeros pero estables (latas vacias, botellas plastico, cajas carton)
- Base que permita caer facilmente pero no por viento/soplo (peso moderado)
- Numeros/letras visibles solo cuando caen (en la base o parte inferior)
- Opcional: Sensores de impacto para detectar derribo electronico

**Sistema de Lanzamiento:**
- Tirachinas: Gomeras de resistencia media, base estable
- Arco: Arcos de juguete con potencia controlada (15-20 lbs), flechas con ventosa o punta goma
- Bolas: Canastos/buckets con bolas de plastico de 7-10cm
- Dardos: Diana magnetica o de velcro (sin puntas afiladas)

**Validacion Electronica (opcional):**
- Sensores de inclinacion en cada objetivo
- Microcontrolador (Arduino) para detectar caidas
- LEDs indicadores de objetivo activo (si orden secuencial)
- Pantalla para mostrar numeros/letras revelados

**Seguridad:**
- Zona de seguridad delimitada (nadie delante de la linea de tiro)
- Paredes protegidas (colchonetas, redes) para rebotes
- Proyectiles que no reboten peligrosamente (bolas de espuma, flechas con ventosa)
- Espacio minimo 3x5 metros sin objetos fragiles

### Validacion de Estado

El sistema debe detectar (si usa electronica):
- Cada objetivo derribado (sensor de inclinacion/impacto)
- Orden correcto (si aplica secuencial)
- Todos los objetivos derribados para revelar codigo completo
- Mostrar/visualizar elementos revelados

---

## Notas para el Agente Usuario

**Antes de usar este skill:**
1. Asegurar disponibilidad de espacio fisico adecuado (minimo 3x5 metros)
2. Verificar seguridad (proyectiles seguros, zona protegida)
3. Seleccionar tipo de proyectil apropiado al espacio y publico
4. Preparar objetivos con elementos ocultos (numeros/letras)
5. Preparar pista sobre orden de formacion del codigo

**Mientras usas este skill:**
1. Documentar claramente la solucion (orden de objetivos, codigo resultante)
2. Definir configuracion de cada objetivo (que revela cada uno)
3. Prever errores comunes (precision, orden, formacion del codigo)
4. Estimar tiempo realista (10-18 min estandar)
5. Planificar intervenciones de game master

**Despues de crear la prueba:**
1. Testear seguridad de proyectiles y espacio
2. Verificar que los elementos se revelan correctamente
3. Testear con usuarios pilotos (observar frustracion vs diversion)
4. Ajustar dificultad (distancia, numero de intentos)

---

## Changelog

- **v1.0** (2026-02-12): Creacion inicial del skill

---

**Score de evaluacion:** 7/10
- C1 (Cantidad): 1 prueba actual, escalable → 2pts
- C2 (Reglas): Validacion moderada (orden, derribo) → 2pts
- C3 (Reutilizacion): Solo hall/fisico (requiere espacio) → 1pt
- C4 (Impacto): Alto (revela codigo, activa siguiente prueba) → 1pt
- C5 (Complejidad): Media-Alta (6+ variables configurables) → 1pt

**Frecuencia de uso esperada:** Media (pruebas de destreza fisica)
**Dependencias:** Ninguna (skill atomico)
