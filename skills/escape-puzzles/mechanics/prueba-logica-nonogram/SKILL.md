---
name: prueba-logica-nonogram
description: Skill para crear pruebas de nonograms (puzzles de lógica con cuadrícula). Usar cuando se necesite (1) diseñar un puzzle donde las pistas numéricas indican celdas consecutivas a rellenar, (2) crear puzzles de deducción lógica con feedback visual, (3) implementar nonograms que revelen imágenes, palabras, o códigos al completarse.
---

# Prueba Lógica Nonogram

Skill para el diseño, validación y adaptación de pruebas basadas en nonograms (puzzles de lógica con cuadrícula).

---

## 1. Descripción

### Cuándo Usar Este Tipo de Prueba

Usa este skill cuando:

- [ ] **Trigger 1:** El usuario busca un puzzle de lógica deductiva con pistas numéricas
- [ ] **Trigger 2:** Se necesita un puzzle que revele una imagen, palabra, o código al completarse
- [ ] **Trigger 3:** El diseño involucra cuadrículas donde las pistas indican celdas consecutivas

**Ejemplos de prompts que activan este skill:**
- "Quiero un nonogram que forme una imagen"
- "Necesito un puzzle de lógica con números"
- "Como hacer un picross que revele un código"
- "Nonogram mitológico con palabras ocultas"

---

## 2. Variables de Diseño

### Variables Principales

| Variable | Tipo | Rango | Default | Descripción |
|----------|------|-------|---------|-------------|
| `dimensiones_cuadricula` | object | {filas, columnas} | {10, 10} | Tamaño de la cuadrícula |
| `tipo_solucion` | string | "imagen" \| "palabra" \| "codigo" \| "mixto" | "imagen" | Qué se revela al completar |
| `dificultad_logica` | string | "facil" \| "medio" \| "dificil" | "medio" | Complejidad de la deducción |
| `formato_presentacion` | string | "papel" \| "pantalla_tactil" \| "pizarra" | "papel" | Medio donde se resuelve |

### Variables por Dimensiones

| Dimensiones | Nivel | Tiempo Estimado | Descripción |
|-------------|-------|-----------------|-------------|
| 5x5 | Fácil | 5-8 min | Para principiantes |
| 10x10 | Medio | 10-15 min | Estándar |
| 15x15 | Difícil | 18-25 min | Para expertos |
| 20x20+ | Extremo | 30+ min | Competitivo |

### Variables por Tipo de Solución

**Si `tipo_solucion="imagen"`:**
| Variable | Tipo | Rango | Default | Descripción |
|----------|------|-------|---------|-------------|
| `imagen_objetivo` | string | "simbolo" \| "figura" \| "patron" | "simbolo" | Tipo de imagen a formar |
| `reconocimiento` | string | "obvio" \| "sutil" | "obvio" | Facilidad de reconocer la imagen |
| `informacion_extra` | boolean | true/false | false | Si la imagen contiene información útil |

**Si `tipo_solucion="palabra"`:**
| Variable | Tipo | Rango | Default | Descripción |
|----------|------|-------|---------|-------------|
| `palabras_reveladas` | array | ["PALABRA1", "PALABRA2"] | ["SOLUCION"] | Palabras que aparecen |
| `orientacion` | string | "horizontal" \| "vertical" \| "ambas" | "horizontal" | Dirección de las palabras |
| `fuente` | string | "mayusculas" \| "minusculas" | "mayusculas" | Tipo de letra |

**Si `tipo_solucion="codigo"`:**
| Variable | Tipo | Rango | Default | Descripción |
|----------|------|-------|---------|-------------|
| `digitos_codigo` | number | 3-8 | 4 | Cantidad de dígitos del código |
| `ubicacion_codigo` | string | "celdas_especificas" \| "patron" | "celdas_especificas" | Dónde está el código |
| `formato_codigo` | string | "numerico" \| "alfanumerico" | "numerico" | Tipo de caracteres |

### Variables Opcionales

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `pistas_iniciales` | boolean | Si algunas celdas están ya rellenas como ayuda |
| `validacion_automatica` | boolean | Si el sistema detecta automáticamente cuando está correcto |
| `feedback_error` | boolean | Si hay feedback al cometer error (celda incorrecta) |
| `herramientas` | array | ["lapiz", "x", "borrador"] | Herramientas disponibles |

---

## 3. Materiales

### Materiales Típicos

**Para Papel:**
- Cuadrícula impresa (tamaño grande para grupos)
- Lápiz y goma
| Mesa de trabajo con buena iluminación

**Para Pantalla Táctil:**
- Tablet con stylus
- App de nonogram
| Pantalla grande (opcional para visualización grupal)

**Para Pizarra:**
- Pizarra blanca con cuadrícula
| Rotuladores (dos colores: relleno y X)
| Trapo para borrar

### Costes Estimados

| Tipo | Coste Bajo | Coste Medio | Coste Alto |
|------|------------|-------------|------------|
| Papel | 1-5€ | 5-15€ | 15-40€ |
| Tablet | 50-150€ | 150-400€ | 400-1000€ |
| Pizarra | 20-60€ | 60-150€ | 150-400€ |

---

## 4. Instrucciones

### Flujo de Diseño

1. **Definir objetivo:** ¿Qué se revela al completar? (imagen, palabra, código)
2. **Diseñar solución:** Crear el patrón de celdas que forma la solución
3. **Calcular pistas:** Generar pistas numéricas para filas y columnas
4. **Verificar unicidad:** Asegurar que hay una única solución
5. **Ajustar dificultad:** Simplificar o complicar según nivel deseado
6. **Preparar validación:** Decidir cómo se verifica que está correcto

### Cálculo de Pistas

**Para cada fila:**
- Contar celdas consecutivas rellenas
- Ejemplo: □□■■■□■□ → [3, 1]

**Para cada columna:**
- Contar celdas consecutivas rellenas
- Ejemplo: □■■□■■□ → [2, 2]

### Implementación

**Para Papel:**
- Imprimir cuadrícula con pistas en filas y columnas
| Dejar espacio suficiente para trabajar
| Proporcionar lápiz y goma de calidad

**Para Pantalla Táctil:**
- Usar app de nonogram configurada con el puzzle
| Habilitar herramientas (lápiz, X, borrador)
| Configurar validación automática si aplica

### Validación

El sistema debe:
- Verificar que todas las pistas se cumplen
- Detectar errores (celdas incorrectas) si `feedback_error=true`
- Proporcionar feedback claro al completar
- Tener solución de backup (imagen completa) para GM

---

## 5. Pistas

### Niveles de Pistas

**Pista Nivel 1 (Sutil):**
- "Empezad por las filas o columnas con números grandes. Son más fáciles de colocar."
- "Usad X para marcar las celdas que sabéis que están vacías."

**Pista Nivel 2 (Directa):**
- "La fila 5 tiene todas las celdas rellenas. Empezad por ahí."
- "La columna 3 tiene un 10, lo que significa que toda la columna está rellena."

**Pista Nivel 3 (Reveladora):**
- "El patrón que se forma es [descripción de la imagen/palabra]."
- "Las celdas [ubicación] contienen el código."

### Estrategia de Pistas

| Nivel | Estrategia |
|-------|-----------|
| Fácil | "Empezad por filas/columnas completas" |
| Medio | "Buscad las pistas que solo tienen una solución posible" |
| Difícil | "Usad deducción por eliminación" |

---

## 6. Solución

### Estructura de Solución

```json
{
  "solucion": {
    "mecanica": "Nonogram de [dimensiones]",
    "descripcion": "[Qué se forma al completar]",
    "resultado": "Imagen/palabra/código revelado",
    "validacion": "Cómo se verifica que está correcto"
  }
}
```

### Validación de Solución

- Verificar que todas las pistas de filas se cumplen
- Verificar que todas las pistas de columnas se cumplen
- Comprobar que la solución es única (no hay ambigüedad)

---

## 7. Ejemplos

Ver archivos en `ejemplos/`:
- `nonogram_001.json` - Nonogram 10x10 con palabras mitológicas
- `nonogram_002.json` - Nonogram 5x5 con símbolo simple

---

## 8. Adaptaciones por Tipo de Juego

### Hall Escape

**Materiales:**
- Cuadrícula grande en papel o pizarra
| Lápices/rotuladores para grupos
| Validación por GM o automática

**Interacción:**
- Grupos de 2-6 personas
| Colaboración en deducción
| División de tareas (unos filas, otros columnas)

**Presentación:**
- Papel grande en mesa o pizarra en pared
| Instrucciones claras de cómo resolver nonogram
| Feedback visual al completar (luz, pantalla)

### Street Escape

**Materiales:**
- Tablet con app de nonogram
| Stylus o dedo
| App con validación automática

**Interacción:**
- 1-4 jugadores por tablet
| Resolución colaborativa en pantalla
| Validación instantánea

**Tecnología:**
- App dedicada o web app
| GPS puede desbloquear el puzzle
| AR para superponer solución

### Investigación

**Materiales:**
- Nonogram como evidencia del caso
| Papel con apariencia de documento antiguo
| Lupa (si la cuadrícula es pequeña)

**Interacción:**
- Análisis individual + síntesis grupal
| Documentar proceso de deducción
| Conexión narrativa con el caso

**Narrativa:**
- Nonogram es código encontrado en evidencia
| Solución revela pista del caso
| Forma parte del expediente

---

## Errores Comunes de Jugadores

### Error 1: No Entender las Reglas
- **Síntoma:** Rellenan celdas al azar sin seguir pistas
- **Causa:** No entienden cómo funcionan las pistas numéricas
- **Prevención:** Instrucciones claras con ejemplo pequeño
- **Intervención:** "Cada número indica celdas consecutivas. Empezad por las obvias."

### Error 2: Olvidar Marcar Celdas Vacías
- **Síntoma:** No usan X para celdas vacías, pierden información
- **Causa:** No entienden la utilidad de marcar vacíos
- **Prevención:** Enseñar a usar X desde el principio
- **Intervención:** "Marcar las celdas vacías os ayudará a deducir las demás."

### Error 3: Cometer Error Temprano
- **Síntoma:** Error en una celda que propaga errores en toda la cuadrícula
- **Causa:** Deducen incorrectamente sin verificar
- **Prevención:** `feedback_error=true` si es digital
- **Intervención:** "Parece que hay un error. Revisad las últimas celdas marcadas."

**Señales de alarma:**
- [ ] Llevan >10 minutos sin avanzar
- [ ] Rellenan celdas al azar sin sistema
| Frustración visible por "no entender"
| Piden ayuda para "cómo funciona esto"

**Tiempo máximo antes de intervenir:** 10-15 minutos

---

## Escalado de Dificultad

### Versión Fácil (Nivel 1-3)
- Cuadrícula 5x5
- Pistas obvias (filas/columnas completas)
| Imagen/palabra reconocible
| Tiempo: 5-8 minutos

### Versión Estándar (Nivel 4-6)
- Cuadrícula 10x10
| Requiere deducción básica
| Solución clara al completar
| Tiempo: 10-15 minutos

### Versión Difícil (Nivel 7-9)
- Cuadrícula 15x15
| Requiere deducción avanzada
| Solución sutil o código oculto
| Tiempo: 18-25 minutos

### Versión Extrema (Nivel 10)
- Cuadrícula 20x20+
| Múltiples pasos de deducción
| Sin pistas iniciales
| Tiempo: 30+ minutos

---

## Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-cifrado`**
- **Sinergia:** El código revelado por el nonogram está cifrado
- **Ejemplo:** Nonogram forma código que luego deben descifrar

**2. `prueba-logica-secuencial`**
- **Sinergia:** La solución del nonogram indica un orden
- **Ejemplo:** Nonogram revela secuencia de pasos a seguir

### Skills Alternativos

- **`prueba-logica-sudoku`** → Si prefieres puzzles de números
- **`prueba-puzzle-visual`** → Si es puzzle sin lógica numérica

### Skills Incompatibles

- [X] `prueba-mecanismo-fisico` → Conflicto: Este skill es puramente mental

---

## Notas de Implementación

### Diseño de Nonogram

**Principios:**
- Unicidad: Solo una solución válida
| Resolvibilidad: Debe poder resolverse por deducción, no por adivinanza
| Balance: Ni tan fácil que sea trivial, ni tan difícil que sea frustrante

**Herramientas:**
- Usar generadores de nonogram online para crear
| Verificar unicidad con solucionadores automáticos
| Probar con usuarios antes de implementar

### Mantenimiento

- Imprimir cuadrículas nuevas antes de cada sesión
| Verificar que las pistas son correctas
| Tener copia de solución para GM

---

## Notas para el Agente Usuario

**Antes de usar este skill:**
1. Diseñar la solución (imagen/palabra/código)
2. Calcular pistas correctas para filas y columnas
3. Verificar que hay una única solución
4. Decidir formato (papel/pantalla/pizarra)

**Mientras usas este skill:**
1. Documentar solución completa
2. Prever errores comunes y preparar intervenciones
3. Estimar tiempo realista (10-15 min estándar)
4. Preparar pistas progresivas

**Después de crear la prueba:**
1. Resolver el nonogram 3+ veces para verificar
2. Probar con usuarios piloto
3. Ajustar dificultad según resultados
4. Verificar que las instrucciones son claras

---

## Changelog

- **v1.0** (2026-03-14): Creación inicial del skill

---

**Score de evaluación:** 7/10
- C1 (Cantidad): 1 prueba existente → 1pt
- C2 (Reglas): Validación lógica → 2pts
- C3 (Reutilización): Hall/Street/Investigación → 2pts
- C4 (Impacto): Medio (revela código/información) → 1pt
- C5 (Complejidad): Media-Alta (deducción numérica) → 1pt

**Frecuencia de uso esperada:** Media (nonograms son específicos pero populares)
**Dependencias:** Ninguna (skill atómico)
