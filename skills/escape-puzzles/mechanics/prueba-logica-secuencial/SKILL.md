---
name: prueba-logica-secuencial
description: Skill para crear puzzles de lógica secuencial y patrones. Usar cuando se necesite (1) diseñar pruebas donde el orden de elementos importa, (2) crear puzzles de series, progresiones o secuencias deducibles, (3) implementar mecánicas de "siguiente elemento" o "completar el patrón".
---

# Prueba Lógica Secuencial

Skill para el diseño, validación y adaptación de puzzles donde los jugadores deben deducir el orden correcto de elementos o completar una secuencia lógica.

---

## 1. Cuándo Usar Este Tipo de Prueba

Usa este skill cuando:

- [x] **Trigger 1:** El usuario pide "secuencia", "patrón", "serie", o "orden correcto"
- [x] **Trigger 2:** Hay elementos que deben ordenarse según una lógica implícita
- [x] **Trigger 3:** Se necesita deducir el siguiente elemento o completar una progresión

**Ejemplos de prompts que activan este skill:**
- "Quiero un puzzle de secuencia de colores"
- "Necesito que ordenen eventos cronológicamente para obtener un código"
- "Cómo hacer una serie numérica que revelen un número"
- "Los jugadores deben deducir el orden de 5 elementos por tamaño/color/forma"

---

## 2. Cuándo NO Usarlo (Anti-Patrones)

### Anti-Patrón 1: Secuencia sin Lógica Deducible
- **Por qué falla:** Si el orden es arbitrario, es adivinanza, no puzzle
- **Mejor alternativa:** Asegurar que existe regla clara (aunque implícita)

### Anti-Patrón 2: Secuencia Demasiado Obvia
- **Por qué falla:** 1-2-3-4-? es trivial y no aporta desafío
- **Mejor alternativa:** Usar patrones menos evidentes (Fibonacci, series alfanuméricas)

### Anti-Patrón 3: Múltiples Órdenes Válidos
- **Por qué falla:** Si hay 2+ formas válidas de ordenar, los jugadores se frustran
- **Mejor alternativa:** Diseñar para que solo haya UN orden correcto verificable

**Regla general:** Si la secuencia no tiene una regla deducible o tiene múltiples soluciones, rediseñar.

---

## 3. Variables de Diseño

### Variables Principales

| Variable | Tipo | Rango | Default | Descripción |
|----------|------|-------|---------|-------------|
| `tipo_secuencia` | string | "numerica" \| "alfabetica" \| "visual" \| "temporal" \| "mixta" | "numerica" | Tipo de elementos |
| `longitud_secuencia` | number | 3-10 | 5 | Cantidad de elementos |
| `elemento_faltante` | boolean | true/false | false | Si falta un elemento por deducir |
| `posicion_faltante` | number | 1-longitud | última | Qué posición falta |
| `formato_respuesta` | string | "orden_completo" \| "siguiente" \| "faltante" | "orden_completo" | Qué deben proporcionar |

### Variables por Tipo de Secuencia

**Si `tipo_secuencia="numerica"`:**
| Variable | Tipo | Descripción |
|----------|------|-------------|
| `tipo_progresion` | string | "aritmetica" \| "geometrica" \| "fibonacci" \| "primos" \| "custom" |
| `inicio` | number | Primer número de la serie |
| `diferencia/ratio` | number | Para aritmética/geométrica |

**Si `tipo_secuencia="alfabetica"`:**
| Variable | Tipo | Descripción |
|----------|------|-------------|
| `tipo_letras` | string | "abecedario" \| "iniciales" \| "palabras" |
| `regla` | string | "saltos" \| "iniciales_meses" \| "iniciales_planetas" \| "custom" |

**Si `tipo_secuencia="visual"`:**
| Variable | Tipo | Descripción |
|----------|------|-------------|
| `elementos_visuales` | array | Colores, formas, iconos |
| `dimension_orden` | string | "color" \| "tamaño" \| "forma" \| "multiple" |
| `regla_visual` | string | "arcoiris" \| "espectro" \| "tamaño_creciente" \| "custom" |

**Si `tipo_secuencia="temporal"`:**
| Variable | Tipo | Descripción |
|----------|------|-------------|
| `tipo_eventos` | string | "fechas" \| "historia" \| "proceso" \| "narrativo" |
| `unidad_tiempo` | string | "siglos" \| "años" \| "meses" \| "horas" |
| `evento_referencia` | string | Evento ancla para ordenar |

### Variables Opcionales

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `pistas_orden` | boolean | Si hay indicios del criterio de ordenación |
| `validacion_parcial` | boolean | Feedback por cada posición correcta |
| `intentos_maximos` | number | Límite de intentos |
| `distraction_elements` | number | Elementos extra que no pertenecen a la secuencia |

### Combinaciones Válidas

- **Configuración Básica:** `tipo_secuencia="numerica"`, `longitud=5`, `tipo_progresion="aritmetica"`
- **Configuración Visual:** `tipo_secuencia="visual"`, `elementos="colores"`, `regla="arcoiris"`
- **Configuración Temporal:** `tipo_secuencia="temporal"`, `eventos="historia"`, `unidad="siglos"`

### Combinaciones Prohibidas/Peligrosas

- [X] NO uses `longitud_secuencia > 7` sin validación parcial (carga cognitiva excesiva)
- [X] NO combines múltiples criterios de ordenación ambiguos (¿por tamaño o por color?)
- [WARN] Cuidado con `distraction_elements > 2` (puede confundir excesivamente)

---

## 4. Errores Comunes de Jugadores

### Error 1: Adivinar en Lugar de Deducir
- **Síntoma:** Prueban ordenes aleatorios sin buscar patrón
- **Causa:** No detectan la regla implícita
- **Prevención:** Asegurar que la regla es deducible con observación
- **Intervención:** "Mirad los elementos con atención. ¿Veis algún patrón?"

### Error 2: Fijarse en Criterio Equivocado
- **Síntoma:** Ordenan por tamaño cuando la regla es color
- **Causa:** Múltiples dimensiones ordenables
- **Prevención:** Hacer un criterio más evidente que otros
- **Intervención:** "¿Estáis seguros de que ese es el criterio correcto?"

### Error 3: Ignorar el Contexto Narrativo
- **Síntoma:** No usan pistas del tema para deducir orden
- **Causa:** No conectan secuencia con la historia
- **Prevención:** Integrar regla con narrativa (ej: orden de planetas del sistema solar)
- **Intervención:** "Recordad el tema del escape. ¿Cómo se relaciona?"

**Señales de alarma:**
- [ ] Han probado 3+ ordenes diferentes sin sistema
- [ ] No pueden explicar por qué eligieron ese orden
- [ ] Llevan >8 minutos sin progreso

**Tiempo máximo antes de intervenir:** 10-12 minutos

---

## 5. Escalado de Dificultad

### Versión Fácil (Nivel 1-3)
- 3-4 elementos
- Regla obvia (1-2-3-4, A-B-C-D, colores primarios)
- Sin distractores
- Pista del criterio disponible
- **Tiempo:** 3-5 minutos

### Versión Estándar (Nivel 4-6)
- 5-6 elementos
- Regla implícita pero deducible
- 1 distractor posible
- Contexto narrativo ayuda
- **Tiempo:** 8-12 minutos

### Versión Difícil (Nivel 7-9)
- 6-8 elementos
- Regla compleja (Fibonacci, primos, custom)
- 2 distractores
- Sin pistas explícitas
- **Tiempo:** 12-18 minutos

### Versión Extrema (Nivel 10)
- 8-10 elementos
- Secuencia multi-criterio
- Múltiples distractores
- Sin validación parcial
- **Tiempo:** 20+ minutos

---

## 6. Adaptaciones

### Por Edad

**Niños (6-10 años):**
- Máximo 4 elementos
- Colores o tamaños (visual)
- Reglas muy evidentes
- Sin distractores

**Adolescentes (11-17 años):**
- 5-6 elementos
- Series numéricas simples
- Contexto temático ayuda

**Adultos (18+):**
- Sin restricciones
- Progresiones complejas
- Múltiples criterios

**Grupos mixtos:**
- Discusión colaborativa
- Un jugador propone, otros verifican

### Por Espacio

**Hall Escape:**
- Elementos físicos ordenables (tarjetas, bloques)
- Ranuras o posiciones marcadas
- Validación al completar orden

**Street Escape:**
- App con drag & drop
- GPS desbloquea elementos en orden
- Validación digital

**Investigación:**
- Documentos que deben ordenarse cronológicamente
- Evidencias que reconstruyen timeline
- Contexto: línea temporal del crimen

### Por Duración

**Quick (5-10 min):**
- 4-5 elementos
- Regla simple

**Standard (15-30 min):**
- 5-7 elementos
- Búsqueda + ordenación

**Epic (45+ min):**
- Múltiples secuencias encadenadas
- Cada secuencia revela parte del código

---

## 7. Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-mecanismo`**
- **Sinergia:** El orden correcto activa un mecanismo físico
- **Ejemplo:** Presionar botones en secuencia correcta abre caja

**2. `prueba-busqueda-objetos`**
- **Sinergia:** Los elementos de la secuencia deben encontrarse primero
- **Ejemplo:** Encuentran 5 bloques numerados + los ordenan

**3. `prueba-puzzle-ensamblaje`**
- **Sinergia:** Los fragmentos tienen orden implícito
- **Ejemplo:** Páginas de diario que deben ordenarse por fecha

### Skills Alternativos

- **`prueba-logica-posiciones`** → Si el foco es posición espacial, no secuencia
- **`prueba-logica-nonogram`** → Si el puzzle es de rejilla

### Skills Incompatibles

- [X] `prueba-azar` → Conflicto: Secuencia es deducible, no aleatoria

---

## 8. Ejemplos Concretos

### Ejemplo 1: Secuencia de Planetas

**Contexto:** Escape espacial

**Configuración:**
```json
{
  "tipo_secuencia": "temporal",
  "longitud": 8,
  "elementos": ["Mercurio", "Venus", "Tierra", "Marte", "Júpiter", "Saturno", "Urano", "Neptuno"],
  "regla": "Distancia al sol (ordenamiento astronómico)",
  "formato_respuesta": "orden_completo",
  "resultado": "Código: 12345678 (cada posición = dígito)"
}
```

**Pistas:**
- "El Sol es el centro de todo"
- "Los más cercanos primero"

---

### Ejemplo 2: Serie Fibonacci

**Contexto:** Escape matemático

**Configuración:**
```json
{
  "tipo_secuencia": "numerica",
  "tipo_progresion": "fibonacci",
  "elementos": [1, 1, 2, 3, 5, "?", 13],
  "elemento_faltante": true,
  "posicion_faltante": 6,
  "resultado": 8
}
```

**Pista:** "Cada número es la suma de los dos anteriores"

---

### Ejemplo 3: Timeline del Crimen

**Contexto:** Investigación forense

**Configuración:**
```json
{
  "tipo_secuencia": "temporal",
  "tipo_eventos": "narrativo",
  "elementos": [
    "Llegada del sospechoso (21:00)",
    "Llamada telefónica (21:15)",
    "Gritos escuchados (21:30)",
    "Descubrimiento del cuerpo (22:00)",
    "Llegada de policía (22:15)"
  ],
  "regla": "Cronología de eventos",
  "pistas_orden": true
}
```

**Resultado:** Ordenar revela que el sospechoso llegó ANTES de la llamada clave.

---

## Notas de Implementación

### Para el Agente Usuario

**Antes de usar:**
1. Verificar que la regla es deducible (no adivinable)
2. Asegurar que solo hay UN orden correcto
3. Calcular tiempo estimado
4. Preparar pistas progresivas

**Mientras usas:**
1. Documentar la regla exacta
2. Definir qué se obtiene al ordenar correctamente
3. Crear sistema de validación
4. Estimar dificultad basado en complejidad de regla

**Después de crear:**
1. Testear con persona que no conozca la regla
2. Verificar que la deducción es posible
3. Medir tiempo real
4. Ajustar número de elementos si es muy fácil/difícil

---

## Changelog

- **v1.0** (2026-03-15): Creación inicial del skill

---

**Score de evaluación:** 9/10
- C1 (Cantidad): Ya referenciado en pruebas existentes → 3pts
- C2 (Reglas): Variables de secuencia bien definidas → 3pts
- C3 (Reutilización): Hall/Street/Investigación → 2pts
- C4 (Impacto): Alto (desbloquea código/acceso) → 1pt

**Frecuencia de uso esperada:** Alta (secuencias son mecánica versátil)
**Dependencias:** Ninguna (skill atómico)
