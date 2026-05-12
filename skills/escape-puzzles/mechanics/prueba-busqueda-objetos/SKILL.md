---
name: prueba-busqueda-objetos
description: Skill para crear pruebas de búsqueda y hallazgo de objetos. Usar cuando se necesite (1) diseñar una prueba donde los jugadores deban encontrar objetos ocultos o dispersos, (2) crear scavenger hunts o búsquedas del tesoro, (3) implementar mecánicas de recolección de items necesarios para avanzar.
---

# Prueba Búsqueda de Objetos

Skill para el diseño, validación y adaptación de pruebas basadas en encontrar objetos ocultos o dispersos en un espacio.

---

## 1. Cuándo Usar Este Tipo de Prueba

Usa este skill cuando:

- [x] **Trigger 1:** El usuario pide "esconder objetos", "búsqueda del tesoro", o "encontrar items"
- [x] **Trigger 2:** Se necesitan recolectar múltiples elementos para desbloquear algo (llaves, piezas, evidencias)
- [x] **Trigger 3:** El espacio físico permite ocultamientos naturales (muebles, rincones, objetos decorativos)

**Ejemplos de prompts que activan este skill:**
- "Quiero esconder 5 llaves por la sala"
- "Necesito una prueba de búsqueda de evidencias forenses"
- "Cómo hacer un scavenger hunt en una plaza"
- "Los jugadores deben encontrar 3 fragmentos de un mapa"

---

## 2. Cuándo NO Usarlo (Anti-Patrones)

### Anti-Patrón 1: Búsqueda sin Contexto Narrativo
- **Por qué falla:** Encontrar objetos "porque sí" rompe inmersión
- **Mejor alternativa:** Conectar cada objeto con la historia (evidencia, pieza de maquinaria, tesoro)

### Anti-Patrón 2: Objetos Imposibles de Encontrar
- **Por qué falla:** Ocultamientos injustos generan frustración, no desafío
- **Mejor alternativa:** Usar el principio "visible pero no obvio" - el objeto está a la vista pero camuflado

### Anti-Patrón 3: Búsqueda Puramente Azarosa
- **Por qué falla:** Sin pistas, es luck puro y no skill
- **Mejor alternativa:** Proporcionar indicios (lista, descripción, pista visual)

**Regla general:** Si los objetos no tienen conexión narrativa o las pistas son inexistentes, reconsiderar el diseño.

---

## 3. Variables de Diseño

### Variables Principales

| Variable | Tipo | Rango | Default | Descripción |
|----------|------|-------|---------|-------------|
| `numero_objetos` | number | 2-10 | 5 | Cantidad de objetos a encontrar |
| `tipo_ocultamiento` | string | "camuflaje" \| "escondido" \| "disperso" \| "mixto" | "disperso" | Método de ocultación |
| `pistas_disponibles` | boolean | true/false | true | Si hay lista/indicios de qué buscar |
| `formato_pistas` | string | "lista" \| "imagenes" \| "descripciones" \| "ninguno" | "lista" | Cómo se presentan las pistas |
| `objetivo_final` | string | "coleccion" \| "ensamblaje" \| "acceso" | "coleccion" | Qué se logra al encontrar todos |

### Variables por Tipo de Ocultamiento

**Si `tipo_ocultamiento="camuflaje"`:**
| Variable | Tipo | Descripción |
|----------|------|-------------|
| `objeto_camuflaje` | string | En qué se camufla (ej: "libro rojo entre libros rojos") |
| `dificultad_visual` | number | 1-10, cuán difícil de distinguir |

**Si `tipo_ocultamiento="escondido"`:**
| Variable | Tipo | Descripción |
|----------|------|-------------|
| `ubicaciones` | array | Lista de posibles escondites |
| `accesibilidad` | string | "facil" \| "medio" \| "requiere_herramienta" |

**Si `tipo_ocultamiento="disperso"`:**
| Variable | Tipo | Descripción |
|----------|------|-------------|
| `area_busqueda` | string | "sala" \| "edificio" \| "exterior" \| "multiple" |
| `distancia_maxima` | number | Metros entre objetos más lejanos |

### Variables Opcionales

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `orden_importa` | boolean | Si deben encontrarse en secuencia |
| `tiempo_limite` | number | Segundos para completar |
| `objetos_decoy` | number | Objetos falsos/distractores |
| `feedback_parcial` | boolean | Indicación por cada objeto encontrado |

### Combinaciones Válidas

- **Configuración Básica:** `numero_objetos=5`, `tipo_ocultamiento="disperso"`, `formato_pistas="lista"`
- **Configuración Misterio:** `numero_objetos=3`, `tipo_ocultamiento="escondido"`, `objetivo_final="ensamblaje"`
- **Configuración Street:** `numero_objetos=8`, `tipo_ocultamiento="disperso"`, `area_busqueda="exterior"`

### Combinaciones Prohibidas/Peligrosas

- [X] NO combines `numero_objetos > 8` con `area_busqueda="sala"` (saturación de espacio)
- [X] NO combines `pistas_disponibles=false` con `tipo_ocultamiento="camuflaje"` (imposible injusto)
- [WARN] Cuidado con `objetos_decoy > 3` (puede confundir excesivamente)

---

## 4. Errores Comunes de Jugadores

### Error 1: Búsqueda No Sistemática
- **Síntoma:** Miran sin método, revisitando sitios ya revisados
- **Causa:** No dividen el espacio mentalmente
- **Prevención:** Proporcionar mapa o división visual del área
- **Intervención:** "Probad a dividir la sala en zonas y revisar cada una"

### Error 2: Ignorar Objetos "Decorativos"
- **Síntoma:** Pasan por alto objetos que parecen parte del set
- **Causa:** No distinguen entre props y objetos buscados
- **Prevención:** Establecer convención visual (todos los objetos buscados tienen X característica)
- **Intervención:** "Recordad que nada es solo decorativo en un escape room"

### Error 3: Fijación en Un Zona
- **Síntoma:** Se obsesionan con un área y no exploran resto
- **Causa:** Sesgo de confirmación (creen que allí debe estar)
- **Prevención:** Pistas que sugieren distribución amplia
- **Intervención:** "¿Habéis revisado las otras zonas con igual atención?"

**Señales de alarma:**
- [ ] Llevan >5 minutos sin encontrar ninguno
- [ ] Revisan mismo lugar 3+ veces
- [ ] Discuten si "ya lo encontraron todo" cuando no

**Tiempo máximo antes de intervenir:** 8-10 minutos sin progreso

---

## 5. Escalado de Dificultad

### Versión Fácil (Nivel 1-3)
- 3-4 objetos
- Ocultamiento evidente ("visible pero no obvio")
- Lista con imágenes/descripciones claras
- Sin distractores
- **Tiempo:** 5-8 minutos

### Versión Estándar (Nivel 4-6)
- 5-6 objetos
- Mixto: algunos camuflados, algunos escondidos
- Lista con descripciones
- 1-2 distractores opcionales
- **Tiempo:** 10-15 minutos

### Versión Difícil (Nivel 7-9)
- 7-8 objetos
- Camuflaje exigente o escondites elaborados
- Pistas crípticas o parciales
- 2-3 distractores
- **Tiempo:** 15-22 minutos

### Versión Extrema (Nivel 10)
- 10 objetos
- Multi-área (varias salas o exterior amplio)
- Pistas mínimas
- Distractores engañosos
- **Tiempo:** 25+ minutos

---

## 6. Adaptaciones

### Por Edad

**Niños (6-10 años):**
- Objetos grandes y coloridos
- Ocultamientos evidentes
- Lista con imágenes (no solo texto)
- Sin distractores

**Adolescentes (11-17 años):**
- Ocultamiento moderado
- Pistas por descripción
- 1-2 distractores aceptables

**Adultos (18+):**
- Complejidad completa
- Camuflaje sofisticado
- Distractores válidos

**Grupos mixtos:**
- Niños buscan, adultos coordinan
- Roles diferenciados

### Por Espacio

**Hall Escape:**
- Objetos fijos en decorado
- Múltiples equipos pueden buscar en paralelo (versiones distintas)
- Feedback centralizado al completar

**Street Escape:**
- Ubicaciones reales (estatuas, bancos, farolas)
- GPS/QR para validar hallazgos
- Cuidado con elementos públicos (no esconder en sitios ajenos)

**Investigación:**
- Formato evidencia (documentos, fotos, objetos)
- "Escena del crimen" con items forenses
- Inventario de evidencias recogidas

### Por Duración

**Quick (5-10 min):**
- 3-4 objetos
- Una sola área

**Standard (15-30 min):**
- 5-6 objetos
- Una o dos áreas

**Epic (45+ min):**
- 8-10 objetos
- Múltiples áreas conectadas

---

## 7. Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-mecanismo`**
- **Sinergia:** Los objetos encontrados son llaves/piezas para un mecanismo
- **Ejemplo:** Encuentran 3 llaves que abren candados de una caja

**2. `prueba-puzzle-ensamblaje`**
- **Sinergia:** Los objetos son fragmentos que deben ensamblarse
- **Ejemplo:** Encuentran 5 piezas de un mapa que deben unir

**3. `prueba-ubicacion-qr`**
- **Sinergia:** QRs escondidos que revelan información al escanear
- **Ejemplo:** Encuentran QRs que dan pistas del siguiente objeto

### Skills Alternativos

- **`prueba-exploracion-visual`** → Si el foco es observar detalles, no encontrar objetos
- **`prueba-gps-navegacion`** → Si la navegación es más importante que el hallazgo

### Skills Incompatibles

- [X] `prueba-tablet-cooperativo` → Conflicto: Búsqueda física vs digital

---

## 8. Ejemplos Concretos

### Ejemplo 1: Evidencias del Crimen

**Contexto:** Juego de investigación forense

**Configuración:**
```json
{
  "numero_objetos": 5,
  "tipo_ocultamiento": "disperso",
  "formato_pistas": "descripciones",
  "objetivo_final": "coleccion",
  "objetos": [
    {"nombre": "carta sospechosa", "ubicacion": "cajón escritorio"},
    {"nombre": "frasco de veneno", "ubicacion": "botiquín"},
    {"nombre": "foto comprometedora", "ubicacion": "libro marcado"},
    {"nombre": "cuenta bancaria", "ubicacion": "papelera"},
    {"nombre": "llave maestra", "ubicacion": "maceta"}
  ]
}
```

**Flujo:**
1. Reciben expediente con lista de evidencias
2. Buscan cada evidencia en la escena
3. Al encontrar todas, pueden acusar al culpable

**Pistas progresivas:**
- Pista 1: "Revisad todo, incluso lo que parece basura"
- Pista 2: "La carta está donde el difunto guardaba su correspondencia"
- Pista 3: "El veneno está cerca de donde se curaba las heridas"

---

### Ejemplo 2: Fragmentos del Mapa

**Contexto:** Aventura de piratas

**Configuración:**
```json
{
  "numero_objetos": 6,
  "tipo_ocultamiento": "mixto",
  "objetivo_final": "ensamblaje",
  "objetos": [
    {"fragmento": "A", "tipo": "camuflaje", "detras_de": "cuadro barco"},
    {"fragmento": "B", "tipo": "escondido", "dentro_de": "botella ron"},
    {"fragmento": "C", "tipo": "disperso", "ubicacion": "baúl abierto"}
  ]
}
```

**Solución:** Ensamblar los 6 fragmentos forma mapa completo que revela coordenadas del tesoro.

---

## Notas de Implementación

### Para el Agente Usuario

**Antes de usar:**
1. Verificar que el espacio permite ocultamientos seguros
2. Asegurar que los objetos no pueden perderse/romperse
3. Documentar todas las ubicaciones para el GM
4. Prever reposición rápida entre sesiones

**Mientras usas:**
1. Crear lista de control (checklist de objetos)
2. Definir criterio de "encontrado" (¿tocar? ¿llevar? ¿reportar?)
3. Preparar feedback al completar colección
4. Estimar tiempo realista basado en área y dificultad

**Después de crear:**
1. Testear con persona que no conozca ubicaciones
2. Medir tiempo promedio de hallazgo
3. Ajustar ocultamientos si algún objeto es imposible
4. Documentar posición exacta de cada objeto

---

## Changelog

- **v1.0** (2026-03-15): Creación inicial del skill

---

**Score de evaluación:** 8/10
- C1 (Cantidad): Múltiples pruebas candidatas → 3pts
- C2 (Reglas): Variables de ocultamiento definidas → 2pts
- C3 (Reutilización): Hall/Street/Investigación → 2pts
- C4 (Impacto): Alto (desbloquea progreso) → 1pt

**Frecuencia de uso esperada:** Alta (búsqueda es mecánica core)
**Dependencias:** Ninguna (skill atómico)
