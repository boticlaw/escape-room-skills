---
name: prueba-mecanismo
description: Skill para crear pruebas basadas en mecanismos físicos con interacción táctil. Usar cuando se necesite (1) diseñar una prueba que requiera manipulación física de objetos para activar/desbloquear algo, (2) crear puzzles de secuencia, combinación o alineación con feedback tangible, (3) implementar candados, interruptores, balanzas, o sistemas mecánicos de apertura.
---

# Prueba Mecanismo

Skill para el diseño, validación y adaptación de pruebas basadas en mecanismos físicos con interacción táctil y feedback inmediato.

---

## 1. Descripción

### Cuándo Usar Este Tipo de Prueba

Usa este skill cuando:

- [ ] **Trigger 1:** El usuario busca una prueba donde los jugadores deban manipular objetos físicamente (girar, pulsar, colocar, alinear)
- [ ] **Trigger 2:** Se necesita feedback inmediato y tangible (luz, sonido, apertura) al completar una acción correcta
- [ ] **Trigger 3:** El diseño involucra candados, interruptores, balanzas, sistemas de peso, o cualquier mecanismo que requiera interacción física

**Ejemplos de prompts que activan este skill:**
- "Quiero una prueba con interruptores que haya que activar en orden"
- "Necesito una caja con varios candados"
- "Como hacer un puzzle de peso/balance que abra algo"
- "Mecanismo físico con secuencia correcta"

---

## 2. Variables de Diseño

### Variables Principales

| Variable | Tipo | Rango | Default | Descripción |
|----------|------|-------|---------|-------------|
| `tipo_mecanismo` | string | "secuencia" \| "combinacion" \| "alineacion" \| "peso" \| "multi_candado" | "secuencia" | Tipo principal de mecanismo |
| `numero_elementos` | number | 2-8 | 3 | Cantidad de elementos a manipular (interruptores, candados, objetos) |
| `feedback_tipo` | string | "luz" \| "sonido" \| "apertura" \| "combinado" | "luz" | Tipo de feedback al completar |
| `reintentos` | number | 1-10 \| "infinito" | "infinito" | Veces que pueden fallar antes de bloqueo/reset |
| `orden_importa` | boolean | true/false | true | Si la secuencia/orden es importante |

### Variables por Tipo de Mecanismo

**Si `tipo_mecanismo="secuencia"`:**
| Variable | Tipo | Rango | Default | Descripción |
|----------|------|-------|---------|-------------|
| `secuencia_correcta` | array | [1,2,3...] | [1,2,3] | Orden correcto de activación |
| `elementos_tipo` | string | "interruptores" \| "botones" \| "diales" | "interruptores" | Tipo de elementos secuenciales |
| `reset_error` | boolean | true/false | true | Si un error resetea la secuencia |

**Si `tipo_mecanismo="combinacion"`:**
| Variable | Tipo | Rango | Default | Descripción |
|----------|------|-------|---------|-------------|
| `digitos` | number | 3-8 | 4 | Cantidad de dígitos/posiciones |
| `combinacion_correcta` | array | [0-9] o ["A-Z"] | [1,2,3,4] | Combinación correcta |
| `tipo_dial` | string | "numerico" \| "letras" \| "simbolos" | "numerico" | Tipo de caracteres |

**Si `tipo_mecanismo="alineacion"`:**
| Variable | Tipo | Rango | Default | Descripción |
|----------|------|-------|---------|-------------|
| `numero_discos` | number | 2-5 | 3 | Cantidad de discos/ruedas a alinear |
| `marcas_referencia` | array | ["▲","●","■"] | ["▲"] | Marcas visuales de referencia |
| `tolerancia` | number | 0-15 (grados) | 5 | Margen de error en grados |

**Si `tipo_mecanismo="peso"`:**
| Variable | Tipo | Rango | Default | Descripción |
|----------|------|-------|---------|-------------|
| `objetos_peso` | array | [{peso, nombre}] | [{"peso":100,"nombre":"libro"}] | Objetos disponibles con peso |
| `peso_objetivo` | number | 50-500 | 200 | Peso total necesario en gramos |
| `tolerancia_peso` | number | 0-20 (gramos) | 10 | Margen de error |

**Si `tipo_mecanismo="multi_candado"`:**
| Variable | Tipo | Rango | Default | Descripción |
|----------|------|-------|---------|-------------|
| `numero_candados` | number | 2-4 | 3 | Cantidad de candados |
| `tipos_candados` | array | ["numero","letras","llave"] | ["numero","letras"] | Tipos de cada candado |
| `pistas_separadas` | boolean | true/false | true | Si cada candado tiene su pista en ubicación distinta |

### Variables Opcionales

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `tiempo_limite` | number | Segundos para completar antes de reset automático |
| `override_gm` | boolean | Si el game master tiene override manual (para atascos) |
| `feedback_parcial` | boolean | Si hay feedback por cada elemento correcto (no solo al final) |
| `indicador_progreso` | boolean | Si hay luz/display que muestra progreso (ej: 2/3 candados abiertos) |

### Combinaciones Válidas

- **Configuración Básica:** `tipo_mecanismo="secuencia"`, `numero_elementos=3`, `feedback_tipo="luz"`
- **Configuración Estándar:** `tipo_mecanismo="multi_candado"`, `numero_candados=3`, `pistas_separadas=true`
- **Configuración Avanzada:** `tipo_mecanismo="alineacion"`, `numero_discos=4`, `tolerancia=3`, `feedback_tipo="combinado"`

### Combinaciones Prohibidas/Peligrosas

- [X] NO combines `tipo_mecanismo="peso"` sin objetos de peso diferenciado claro (frustración por precisión imposible)
- [X] NO combines `reintentos < 3` con mecanismos complejos (desanimo temprano)
- [WARN] Cuidado con `tolerancia < 5` en alineación (puede ser físicamente imposible de calibrar)
- [WARN] Cuidado con `numero_elementos > 6` sin feedback parcial (memoria de trabajo sobrecargada)

---

## 3. Materiales

### Materiales Típicos

**Para Secuencias/Interruptores:**
- Interruptores simples (toggle, push-button)
- LEDs (indicadores de estado)
- Cableado básico
- Microcontrolador (Arduino/ESP32) para lógica
- Caja/panel para montaje

**Para Combinación/Candados:**
- Candados numéricos (3-4 dígitos)
- Candados de letras
- Candados con llave
- Caja fuerte o contenedor con cerraduras
- Pistas impresas para cada candado

**Para Alineación:**
- Discos giratorios de madera/cartón
- Ejes centrales
- Marcas visuales (pegatinas, pintura)
- Sistema de enclavamiento (imanes, pestillos)

**Para Peso/Balance:**
- Balanza o balancín
- Objetos de peso diferenciado (libros, piedras, pesas)
- Interruptor de presión o sensor de peso
- Plataforma de apoyo

**Para Feedback:**
- LEDs (rojo/verde/amarillo)
- Zumbadores/buzzers
- Relés para apertura
- Cerraduras electromagnéticas

### Costes Estimados

| Tipo | Coste Bajo | Coste Medio | Coste Alto |
|------|------------|-------------|------------|
| Secuencia | 5-15€ | 15-40€ | 40-100€ |
| Multi-candado | 10-25€ | 25-60€ | 60-150€ |
| Alineación | 10-30€ | 30-80€ | 80-200€ |
| Peso | 15-40€ | 40-100€ | 100-250€ |

---

## 4. Instrucciones

### Flujo de Diseño

1. **Definir objetivo:** ¿Qué se desbloquea/activa al completar? (caja, puerta, luz, próximo puzzle)
2. **Seleccionar tipo:** Elegir `tipo_mecanismo` según tema del juego y espacio disponible
3. **Configurar variables:** Ajustar número de elementos, feedback, y tolerancias
4. **Diseñar pistas:** Crear pistas que guíen hacia la solución sin revelarla
5. **Implementar feedback:** Decidir tipo de feedback (luz, sonido, apertura)
6. **Prever errores:** Identificar puntos de fricción y preparar intervenciones del GM

### Implementación Técnica

**Para Secuencias con Arduino:**
```cpp
int secuenciaCorrecta[] = {1, 2, 3};
int entradaActual = 0;
int posicionSecuencia = 0;

void loop() {
  if (botonActivado() && boton == secuenciaCorrecta[posicionSecuencia]) {
    posicionSecuencia++;
    if (posicionSecuencia == 3) {
      activarFeedback();
    }
  } else if (botonActivado()) {
    posicionSecuencia = 0; // Reset si error
  }
}
```

**Para Multi-Candado:**
- Cada candado tiene su propia pista en ubicación distinta
- Abrir todos los candados permite acceder al contenido
- No requiere electrónica (mecánico puro)

**Para Alineación:**
- Discos con marcas que deben coincidir
- Usar imanes o pestillos para enclavar posición correcta
- Tolerancia ajustable con tamaño de marcas

### Validación

El sistema debe:
- Detectar cuando todos los elementos están correctos
- Proporcionar feedback inmediato (no más de 1 segundo de delay)
- Resetear automáticamente si hay error (si `reset_error=true`)
- Permitir override manual del GM (si `override_gm=true`)

---

## 5. Pistas

### Niveles de Pistas

**Pista Nivel 1 (Sutil):**
- "Revisa el mecanismo principal de esta prueba. Busca patrones o conexiones obvias."
- "Los elementos pueden interactuar entre sí de formas no evidentes."

**Pista Nivel 2 (Directa):**
- "El orden en que activas los elementos importa. Busca una secuencia lógica."
- "Cada candado tiene su propia pista. No todos se abren con la misma información."

**Pista Nivel 3 (Reveladora):**
- "La secuencia correcta es: [mostrar orden]. Solo falta ejecutarla."
- "El peso total necesario está indicado en [ubicación]. Suma los objetos correctos."

### Estrategia de Pistas por Tipo

| Tipo | Pista Principal | Pista Secundaria |
|------|-----------------|------------------|
| Secuencia | Orden implícito (colores, números, tamaños) | Diagrama parcial |
| Multi-candado | Cada candado → pista en ubicación distinta | Relación entre candados |
| Alineación | Marcas de referencia visuales | Posición de inicio |
| Peso | Peso objetivo indicado sutilmente | Objetos que no sirven (distractores) |

---

## 6. Solución

### Estructura de Solución

```json
{
  "solucion": {
    "mecanica": "Prueba basada en prueba-mecanismo",
    "descripcion": "[Descripción de qué deben hacer los jugadores]",
    "resultado": "Código, llave o acceso al siguiente puzzle (según configuración específica)",
    "validacion": "Cómo sabe el sistema que está correcto"
  }
}
```

### Validación de Solución

- **Secuencias:** Verificar orden exacto de activación
- **Combinaciones:** Comparar con combinación_correcta
- **Alineación:** Detectar coincidencia de marcas dentro de tolerancia
- **Peso:** Comparar peso total con peso_objetivo ± tolerancia
- **Multi-candado:** Verificar que todos los candados están abiertos

---

## 7. Ejemplos

Ver archivos en `ejemplos/`:
- `mecanismo_001.json` - Secuencia de interruptores
- `mecanismo_002.json` - Caja con múltiples candados
- `mecanismo_003.json` - Puzzle de peso/balance

---

## 8. Adaptaciones por Tipo de Juego

### Hall Escape

**Materiales:**
- Mecanismos robustos para uso intensivo (10-200 personas/día)
- Panel fijo en pared o mueble
- Cables protegidos y conexiones seguras
- Feedback visible desde distancia (LEDs grandes, proyector)

**Interacción:**
- Grupos de 2-6 personas
- Un jugador manipula, otros observan/coordinan
- Override del GM accesible pero oculto

**Presentación:**
- Integrado en decorado (cuadro eléctrico, caja fuerte, mueble)
- Instrucciones claras en pantalla o cartel
- Tiempo límite visible con countdown

### Street Escape

**Materiales:**
- Versión portátil (caja con asa, maleta)
- Protección climática (lluvia, polvo)
- Baterías de larga duración
- Códigos QR para pistas digitales

**Interacción:**
- 1-4 jugadores por dispositivo
- Ubicación física real (caja de luz, farola, banco)
- GPS puede desbloquear acceso al mecanismo

**Tecnología:**
- Bluetooth/NFC para validar solución
- App móvil como interfaz de pistas
- Sin cables expuestos (seguridad pública)

### Investigación

**Materiales:**
- Formato de evidencia (maleta con documentos, caja de pruebas)
- Objetos temáticos (llaves antiguas, candados vintage)
- Documentos con pistas integradas

**Interacción:**
- Análisis individual + síntesis grupal
- Un investigador lidera manipulación física
- Documentar proceso (fotos, notas)

**Narrativa:**
- Conexión con el caso/misterio
- Cada mecanismo revela evidencia o testigo
- Pistas en documentos del expediente

---

## Errores Comunes de Jugadores

### Error 1: Manipulación Aleatoria Sin Sistema
- **Síntoma:** Prueban combinaciones al azar sin buscar lógica
- **Causa:** No encontraron la pista que indica el orden/lógica
- **Prevención:** Proporcionar pista clara sobre orden o relación entre elementos
- **Intervención:** A los 5 minutos: "¿Habéis encontrado alguna pista que indique el orden correcto?"

### Error 2: Fijarse Solo en Un Elemento
- **Síntoma:** Se obsesionan con un candado/interruptor y ignoran los demás
- **Causa:** No entienden que es un sistema multi-elemento
- **Prevención:** Indicador visual de progreso (2/3 candados abiertos)
- **Intervención:** "Parece que hay más de un elemento que necesita atención"

### Error 3: No Detectar Feedback Parcial
- **Síntoma:** Creen que fallaron pero estaban cerca
- **Causa:** Falta de feedback progresivo
- **Prevención:** Implementar `feedback_parcial=true` con LEDs por elemento
- **Intervención:** "Estáis cerca, revisad el último elemento"

**Señales de alarma (el jugador está atascado):**
- [ ] Han probado 10+ combinaciones sin sistema
- [ ] Discuten si "el orden importa"
- [ ] Ignoran elementos clave del mecanismo
- [ ] Llevan >10 minutos sin progreso

**Tiempo máximo antes de intervenir:** 8-12 minutos

---

## Escalado de Dificultad

### Versión Fácil (Nivel 1-3)
- 2-3 elementos
- Orden implícito evidente (colores, números)
- Feedback progresivo completo
- Sin tiempo límite
- **Tiempo:** 5-8 minutos

### Versión Estándar (Nivel 4-6)
- 3-4 elementos
- Orden requiere deducción
- Feedback al completar
- Pistas disponibles
- **Tiempo:** 10-15 minutos

### Versión Difícil (Nivel 7-9)
- 4-6 elementos
- Sin feedback parcial (todo o nada)
- Pistas crípticas
- Posibles distractores
- **Tiempo:** 15-22 minutos

### Versión Extrema (Nivel 10)
- 6-8 elementos
- Múltiples etapas
- Sin pistas
- Tiempo límite ajustado
- **Tiempo:** 25+ minutos

---

## Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-busqueda-objetos`**
- **Sinergia:** Las llaves/pistas para el mecanismo están escondidas
- **Ejemplo:** Buscan llaves que abren candados de una caja

**2. `prueba-cifrado`**
- **Sinergia:** La combinación correcta está codificada
- **Ejemplo:** Descifran mensaje que revela código de candado

**3. `prueba-logica-secuencial`**
- **Sinergia:** El orden sigue una lógica deducible
- **Ejemplo:** Deducen secuencia por tamaños, colores, o patrón numérico

### Skills Alternativos

- **`prueba-panel-electrico`** → Si requiere cableado/circuitos eléctricos
- **`prueba-codigo-numerico`** → Si es solo introducir código (sin manipulación física)
- **`prueba-digital-interfaz`** → Si es virtual sin componente táctil

### Skills Incompatibles

- [X] `prueba-pure-mental` → Conflicto: Este skill requiere interacción física

---

## Notas de Implementación

### Hardware Recomendado

**Para Secuencias:**
- Interruptores basculantes o push-button
- LEDs RGB para feedback
- Arduino Nano o ESP32
- Fuente 5V/12V según LEDs

**Para Multi-Candado:**
- Candados de calidad (evitar marcas baratas que se atascan)
- 2-3 tipos distintos (número, letras, llave)
- Caja resistente con multiples cerraduras

**Para Peso:**
- Balanza digital o balancín mecánico
- Sensor de peso HX711 + célula de carga
- Objetos con peso claro (etiquetado o diferenciación visual)

### Mantenimiento

- Revisar interruptores semanalmente (desgaste)
- Lubricar candados mensualmente
- Calibrar sensores de peso antes de cada sesión
- Backup de código Arduino por si fallo

---

## Notas para el Agente Usuario

**Antes de usar este skill:**
1. Verificar que el espacio permite manipulación física segura
2. Asegurar disponibilidad de materiales (interruptores, candados, etc.)
3. Decidir tipo de feedback más apropiado
4. Preparar pistas progresivas

**Mientras usas este skill:**
1. Documentar claramente la solución (secuencia, combinación, peso)
2. Definir tolerancias realistas
3. Prever errores comunes y preparar intervenciones
4. Estimar tiempo realista (10-15 min estándar)

**Después de crear la prueba:**
1. Testear mecánica completa 3+ veces
2. Verificar que el feedback funciona correctamente
3. Probar con usuarios piloto
4. Ajustar dificultad según resultados

---

## Changelog

- **v1.0** (2026-03-14): Creación inicial del skill

---

**Score de evaluación:** 9/10
- C1 (Cantidad): 10 pruebas existentes → 3pts
- C2 (Reglas): Validación multi-tipo → 3pts
- C3 (Reutilización): Hall/Street/Investigación → 2pts
- C4 (Impacto): Alto (desbloquea acceso) → 1pt
- C5 (Complejidad): Alta (5 tipos de mecanismo) → 1pt

**Frecuencia de uso esperada:** Muy Alta (mecanismos físicos son core de escape rooms)
**Dependencias:** Ninguna (skill atómico)
