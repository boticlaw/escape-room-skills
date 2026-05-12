---
name: prueba-puzzle-ensamblaje
description: Skill para crear pruebas de ensamblaje y composición. Usar cuando se necesite (1) diseñar puzzles donde fragmentos dispersos deben unirse para formar un todo coherente, (2) crear mecánicas de reconstrucción de objetos, documentos o imágenes, (3) implementar puzzles tipo puzzle tradicional con piezas físicas o digitales.
---

# Prueba Puzzle de Ensamblaje

Skill para el diseño, validación y adaptación de pruebas donde fragmentos deben unirse para formar un todo coherente y revelar información.

---

## 1. Cuándo Usar Este Tipo de Prueba

Usa este skill cuando:

- [x] **Trigger 1:** El usuario pide "unir fragmentos", "reconstruir [algo]", o "puzzle de piezas"
- [x] **Trigger 2:** Hay múltiples items que deben combinarse para revelar un mensaje/código/imagen
- [x] **Trigger 3:** Se necesita una mecánica táctil de encajar piezas físicas

**Ejemplos de prompts que activan este skill:**
- "Quiero que encuentren 5 trozos de un mapa y lo reconstruyan"
- "Necesito un puzzle de foto rota que revele una pista"
- "Cómo hacer un puzzle de documentos que formen un contrato"
- "Los jugadores deben ensamblar un mecanismo con piezas dispersas"

---

## 2. Cuándo NO Usarlo (Anti-Patrones)

### Anti-Patrón 1: Fragmentos Sin Sentido Combinado
- **Por qué falla:** Piezas que no forman nada coherente al unirse
- **Mejor alternativa:** Usar `prueba-coleccion` simple sin ensamblaje

### Anti-Patrón 2: Ensamblaje Obvio Sin Desafío
- **Por qué falla:** 3 piezas que encajan obviamente es trivial
- **Mejor alternativa:** Añadir piezas extra (decoy) o requerir orden específico

### Anti-Patrón 3: Dependencia Excesiva de Destreza Física
- **Por qué falla:** Si el desafío es físico (encajar preciso) y no cognitivo
- **Mejor alternativa:** Usar encajes holgados o sistema magnético

**Regla general:** Si el ensamblaje no revela información nueva o no requiere deducción, reconsiderar.

---

## 3. Variables de Diseño

### Variables Principales

| Variable | Tipo | Rango | Default | Descripción |
|----------|------|-------|---------|-------------|
| `numero_fragmentos` | number | 2-12 | 6 | Cantidad de piezas a ensamblar |
| `tipo_ensamblaje` | string | "puzzle_tradicional" \| "superposicion" \| "secuencia" \| "mecanismo" | "puzzle_tradicional" | Cómo se unen las piezas |
| `contenido_final` | string | "imagen" \| "texto" \| "codigo" \| "objeto_funcional" | "imagen" | Qué forma el ensamblaje completo |
| `formato_piezas` | string | "fisico" \| "digital" \| "mixto" | "fisico" | Medio de las piezas |
| `pieza_guia` | boolean | true/false | false | Si hay imagen/base de referencia |

### Variables por Tipo de Ensamblaje

**Si `tipo_ensamblaje="puzzle_tradicional"`:**
| Variable | Tipo | Descripción |
|----------|------|-------------|
| `forma_piezas` | string | "clásico" \| "irregular" \| "cuadradas" |
| `numero_filas` | number | 2-4 filas |
| `numero_columnas` | number | 2-4 columnas |
| `borde_guia` | boolean | Si las piezas de borde son distinguibles |

**Si `tipo_ensamblaje="superposicion"`:**
| Variable | Tipo | Descripción |
|----------|------|-------------|
| `capas` | number | 2-5 capas transparentes |
| `alineacion` | string | "marcas" \| "esquinas" \| "completo" |
| `orden_capas` | boolean | Si el orden de las capas importa |

**Si `tipo_ensamblaje="secuencia"`:**
| Variable | Tipo | Descripción |
|----------|------|-------------|
| `longitud_secuencia` | number | 3-10 elementos |
| `tipo_orden` | string | "cronologico" \| "numerico" \| "logico" |
| `pistas_orden` | boolean | Si hay indicios del orden correcto |

**Si `tipo_ensamblaje="mecanismo"`:**
| Variable | Tipo | Descripción |
|----------|------|-------------|
| `piezas_mecanicas` | number | 2-8 componentes |
| `tipo_encaje` | string | "magnético" \| "ranura" \| "encaje" |
| `funcion_activa` | boolean | Si el ensamblaje funcional activa algo |

### Variables Opcionales

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `piezas_decoy` | number | Piezas extra que no pertenecen |
| `marcas_ocultas` | boolean | Piezas tienen marcas solo visibles al unir |
| `validacion_automatica` | boolean | Sistema detecta cuando está correcto |
| `feedback_progresivo` | boolean | Indicación por cada pieza correcta |

### Combinaciones Válidas

- **Configuración Básica:** `numero_fragmentos=6`, `tipo_ensamblaje="puzzle_tradicional"`, `contenido_final="imagen"`
- **Configuración Misterio:** `numero_fragmentos=4`, `tipo_ensamblaje="superposicion"`, `contenido_final="texto"`
- **Configuración Mecánica:** `numero_fragmentos=5`, `tipo_ensamblaje="mecanismo"`, `funcion_activa=true`

### Combinaciones Prohibidas/Peligrosas

- [X] NO combines `numero_fragmentos > 10` con `piezas_decoy > 3` (complejidad excesiva)
- [X] NO combines `tipo_ensamblaje="superposicion"` con formato físico sin transparencias reales
- [WARN] Cuidado con `formato_piezas="fisico"` sin sistema de validación (¿cómo sabe el GM que está correcto?)

---

## 4. Errores Comunes de Jugadores

### Error 1: Forzar Encajes Incorrectos
- **Síntoma:** Intentan encajar piezas que no van juntas
- **Causa:** Piezas demasiado similares o sistema de encaje poco distintivo
- **Prevención:** Diseñar encajes únicos o con formas diferenciadas
- **Intervención:** "Probad a buscar primero las esquinas/bordes"

### Error 2: Ignorar el Orden en Secuencias
- **Síntoma:** Unen fragmentos sin respetar secuencia lógica
- **Causa:** No detectan las pistas de orden
- **Prevención:** Añadir marcadores implícitos (números, colores progresivos, narrativa)
- **Intervención:** "¿Notáis algún patrón que sugiera un orden específico?"

### Error 3: No Verificar el Resultado Final
- **Síntoma:** Ensamblan pero no "leen" el resultado
- **Causa:** Se centran en la mecánica y olvidan el propósito
- **Prevención:** Hacer que el resultado sea claramente relevante (código grande, imagen obvia)
- **Intervención:** "¿Qué muestra el ensamblaje completo?"

**Señales de alarma:**
- [ ] Llevan >5 minutos intentando encajar piezas incorrectas
- [ ] No identifican qué piezas son decoy
- [ ] Ensamblaron pero no avanzan (no ven la pista)

**Tiempo máximo antes de intervenir:** 10-12 minutos

---

## 5. Escalado de Dificultad

### Versión Fácil (Nivel 1-3)
- 4-6 piezas
- Puzzle tradicional con bordes claros
- Imagen guía disponible
- Sin decoy
- **Tiempo:** 5-8 minutos

### Versión Estándar (Nivel 4-6)
- 6-9 piezas
- Forma irregular o superposición
- Pistas de orden implícitas
- 1-2 decoy
- **Tiempo:** 10-15 minutos

### Versión Difícil (Nivel 7-9)
- 9-12 piezas
- Múltiples capas o secuencia compleja
- Pistas mínimas
- 2-3 decoy
- **Tiempo:** 15-22 minutos

### Versión Extrema (Nivel 10)
- 12+ piezas
- Mecanismo funcional con encajes precisos
- Sin guía
- Decoys engañosos
- **Tiempo:** 25+ minutos

---

## 6. Adaptaciones

### Por Edad

**Niños (6-10 años):**
- Piezas grandes y coloridas
- Encajes muy holgados
- Imagen guía siempre disponible
- Sin decoy

**Adolescentes (11-17 años):**
- Piezas medianas
- Superposición o secuencia
- 1-2 decoy aceptables

**Adultos (18+):**
- Complejidad completa
- Mecanismos funcionales
- Decoys válidos

**Grupos mixtos:**
- Niños encuentran piezas, adultos ensamblan
- Roles: buscadores vs ensambladores

### Por Espacio

**Hall Escape:**
- Mesa o superficie plana dedicada
- Piezas reposicionables (magnéticas o con peso)
- Validación visual al completar (cámara, sensor)

**Street Escape:**
- Formato digital (app que une fragmentos)
- O piezas físicas en contenedor portable
- Validación por QR al completar

**Investigación:**
- Documentos rasgados que reconstruyen informe
- Fotos fragmentadas de evidencia
- Formato "escritorio de detective"

### Por Duración

**Quick (5-10 min):**
- 4-6 piezas
- Puzzle simple

**Standard (15-30 min):**
- 6-9 piezas
- Búsqueda + ensamblaje combinados

**Epic (45+ min):**
- 10+ piezas
- Múltiples sub-ensamblajes que forman uno mayor

---

## 7. Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-busqueda-objetos`**
- **Sinergia:** Las piezas deben encontrarse antes de ensamblar
- **Ejemplo:** Encuentran 6 fragmentos de mapa + los ensamblan

**2. `prueba-logica-secuencial`**
- **Sinergia:** El orden de las piezas sigue una lógica deducible
- **Ejemplo:** Páginas numeradas que deben ordenarse cronológicamente

**3. `prueba-mecanismo`**
- **Sinergia:** El ensamblaje forma un mecanismo funcional
- **Ejemplo:** Piezas que al unirse activan un dispositivo

### Skills Alternativos

- **`prueba-coleccion`** → Si solo importa recolectar, no ensamblar
- **`prueba-cifrado`** → Si el contenido revelado está codificado

### Skills Incompatibles

- [X] `prueba-pure-observational` → Conflicto: Ensamblaje requiere manipulación activa

---

## 8. Ejemplos Concretos

### Ejemplo 1: Mapa del Tesoro Fragmentado

**Contexto:** Aventura de piratas

**Configuración:**
```json
{
  "numero_fragmentos": 6,
  "tipo_ensamblaje": "puzzle_tradicional",
  "contenido_final": "imagen",
  "formato_piezas": "fisico",
  "disposicion": "2x3",
  "resultado": "Mapa con coordenadas: 41.5N, 4.7W"
}
```

**Flujo:**
1. Encuentran 6 fragmentos dispersos
2. Los ensamblan en superficie plana
3. El mapa revela ubicación del tesoro

**Pistas progresivas:**
- Pista 1: "Los bordes del mapa son rectos, el centro es irregular"
- Pista 2: "Buscad primero las 4 esquinas"
- Pista 3: "La X marca el sitio - empieza por donde está la brújula"

---

### Ejemplo 2: Contrato Secreto

**Contexto:** Misterio corporativo

**Configuración:**
```json
{
  "numero_fragmentos": 4,
  "tipo_ensamblaje": "secuencia",
  "contenido_final": "texto",
  "tipo_orden": "numerico",
  "pistas_orden": true,
  "resultado": "Contrato con cláusula oculta que incrimina al CEO"
}
```

**Solución:** Ordenar páginas por número de página (implícito en esquinas) y leer cláusula 7.

---

## Notas de Implementación

### Para el Agente Usuario

**Antes de usar:**
1. Verificar que el contenido revelado es relevante (no solo decorativo)
2. Asegurar que las piezas son distinguibles (no idénticas)
3. Definir criterio de "correcto" (¿cómo valida el GM?)
4. Prever pérdida de piezas (backup)

**Mientras usas:**
1. Documentar contenido exacto del ensamblaje final
2. Definir si el orden importa y por qué
3. Crear sistema de validación (visual, sensor, GM check)
4. Estimar tiempo de búsqueda + ensamblaje

**Después de crear:**
1. Testear con persona que no conozca el resultado
2. Verificar que el contenido revelado es legible/comprensible
3. Ajustar número de piezas si es muy fácil/difícil
4. Documentar posición inicial de cada pieza

---

## Changelog

- **v1.0** (2026-03-15): Creación inicial del skill

---

**Score de evaluación:** 8/10
- C1 (Cantidad): Ya referenciado en pruebas existentes → 3pts
- C2 (Reglas): Variables de ensamblaje definidas → 2pts
- C3 (Reutilización): Hall/Street/Investigación → 2pts
- C4 (Impacto): Alto (revela información clave) → 1pt

**Frecuencia de uso esperada:** Media-Alta (ensamblaje es mecánica satisfactoria)
**Dependencias:** Ninguna (skill atómico)
