---
name: prueba-emparejamiento-texto
description: Skill para crear pruebas de emparejamiento de textos conceptuales. Usar cuando se necesite (1) que los jugadores asocien conceptos, objeciones con respuestas, (2) conectar elementos textuales basandose en logica o contenido, (3) puzzles de matching sin componente de memoria secuencial.
---

# Prueba Emparejamiento Texto

Skill para el diseno, validacion y adaptacion de pruebas basadas en emparejar textos conceptuales.

---

## Cuando Usar Este Tipo de Prueba

Usa este skill cuando:

- [x] **Trigger 1:** El jugador debe asociar textos de dos categorias (objecion-respuesta, concepto-ejemplo)
- [x] **Trigger 2:** El emparejamiento es por contenido o logica, no por memoria
- [x] **Trigger 3:** No hay secuencia posterior que recordar

**Ejemplos de prompts que activan este skill:**
- "Quiero que asocien cada objecion con su respuesta"
- "Crea un puzzle donde conecten conceptos con sus definiciones"
- "Necesito que emparejen problemas con soluciones"

---

## Cuando NO Usarlo (Anti-Patrones)

**NO uses este skill cuando:**

### Anti-Patron 1: Necesitan recordar secuencia
- **Por que falla:** Si hay que recordar el orden, es `prueba-emparejamiento-memoria`
- **Mejor alternativa:** Usar `prueba-emparejamiento-memoria`

### Anti-Patron 2: Emparejamiento visual, no textual
- **Por que falla:** Si es imagenes o simbolos, es otro tipo de prueba
- **Mejor alternativa:** Usar `prueba-emparejamiento-memoria` con elementos visuales

### Anti-Patron 3: Sin logica de conexion
- **Por que falla:** Si es puro azar sin criterio, es frustrante
- **Mejor alternativa:** Incluir criterio claro de emparejamiento

**Regla general:** Debe haber una logica clara para cada emparejamiento.

---

## Variables de Diseno

### Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `numero_pares` | number | 3-8 | 5 | Cantidad de parejas |
| `tipo_emparejamiento` | string | ["objecion-respuesta", "concepto-definicion", "problema-solucion", "causa-efecto"] | "objecion-respuesta" | Naturaleza de los textos |
| `mostrar_feedback` | boolean | true/false | true | Si indica acierto/error |
| `permitir_reordenar` | boolean | true/false | true | Si se puede cambiar despues |
| `dificultad_logica` | number | 1-10 | 5 | Complejidad de las conexiones |

### Variables Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `textos_a` | array | Primer conjunto de textos |
| `textos_b` | array | Segundo conjunto de textos |
| `solucion_emparejamientos` | array | Pares correctos |
| `criterio_emparejamiento` | string | Explicacion de la logica |
| `contexto_narrativo` | string | Historia que rodea el puzzle |

### Combinaciones Validas

- **Configuracion Basica:** `numero_pares=5`, `tipo_emparejamiento="objecion-respuesta"`, `mostrar_feedback=true`
- **Configuracion Conceptual:** `tipo_emparejamiento="concepto-definicion"`, `dificultad_logica=6`

### Combinaciones Prohibidas/Peligrosas

- [x] NO combines `numero_pares > 6` con textos muy largos
- [WARN] Cuidado con `mostrar_feedback=false` (muy dificil)

---

## Errores Comunes de Jugadores

### Error 1: Interpretan mal la conexion
- **Sintoma:** Emparejan basandose en palabras clave incorrectas
- **Causa:** Textos ambiguos o multiples interpretaciones
- **Prevencion:** Textos claros con una conexion obvia
- **Intervencion:** Explicar el criterio de emparejamiento

### Error 2: No leen completamente
- **Sintoma:** Emparejan por primera impresion sin leer todo
- **Causa:** Textos demasiado largos o impaciencia
- **Prevencion:** Textos concisos
- **Intervencion:** Sugerir leer completamente cada opcion

### Error 3: Confunden opciones similares
- **Sintoma:** Emparejan con texto incorrecto pero similar
- **Causa:** Opciones con mucho solapamiento
- **Prevencion:** Opciones claramente diferenciadas
- **Intervencion:** Senalar diferencias clave

**Senales de alarma (el jugador esta atascado):**
- [ ] Mas de 10 intentos incorrectos
- [ ] Reportan "no hay logica"
- [ ] Dejan textos sin emparejar mucho tiempo

**Tiempo maximo recomendado antes de intervenir:** 12 minutos

---

## Escalado de Dificultad

### Version Facil (Nivel 1-3)
- **Caracteristicas:**
  - 3-4 pares
  - Textos cortos (< 10 palabras)
  - Conexiones muy claras
  - Feedback inmediato
- **Tiempo estimado:** 3-5 minutos
- **Publico objetivo:** Ninos, novatos

### Version Estandar (Nivel 4-6)
- **Caracteristicas:**
  - 5-6 pares
  - Textos medios (10-20 palabras)
  - Conexiones logicas
  - Feedback de acierto/error
- **Tiempo estimado:** 5-10 minutos
- **Publico objetivo:** Publico general

### Version Dificil (Nivel 7-9)
- **Caracteristicas:**
  - 6-8 pares
  - Textos largos
  - Conexiones implicitas
  - Feedback limitado
- **Tiempo estimado:** 10-15 minutos
- **Publico objetivo:** Expertos

### Version Extrema (Nivel 10)
- **Caracteristicas:**
  - 8+ pares
  - Textos muy similares entre si
  - Conexiones sutiles
  - Sin feedback
- **Tiempo estimado:** 15+ minutos
- **Publico objetivo:** Expertos en debate/negociacion

**Matriz de escalado:**

| Aspecto | Facil | Estandar | Dificil |
|---------|-------|----------|---------|
| Pares | 3-4 | 5-6 | 6-8 |
| Longitud textos | Corta | Media | Larga |
| Feedback | Completo | Parcial | Minimo |
| Pistas disponibles | 5 | 4 | 2 |

---

## Adaptaciones

### Por Edad

**Ninos (6-10 anos):**
- Simplificar: 3 pares, textos muy cortos
- Evitar: Conceptos abstractos
- Anadir: Iconos o imagenes

**Adolescentes (11-17 anos):**
- Mantener: Nivel estandar
- Permitir: Tematicas actuales

**Adultos (18+):**
- Complejidad completa
- Considerar: Contextos profesionales

### Por Espacio

**Hall Escape (sala fisica):**
- Ventajas: Tarjetas fisicas posibles
- Limitaciones: Espacio para tarjetas
- Adaptaciones especificas: Tarjetas con velcro o magnetico

**Street Escape (exterior/movil):**
- Ventajas: Drag & drop tactil
- Limitaciones: Textos pequenos en movil
- Adaptaciones especificas: Textos expandibles

**Juego de Investigacion (no presencial):**
- Ventajas: Interfaz web completa
- Limitaciones: Sin tacto
- Adaptaciones especificas: Click to select

### Por Duracion

**Quick (5-10 minutos):**
- Elementos a eliminar: Textos largos
- Foco: 4-5 pares con textos cortos

**Standard (15-30 minutos):**
- Version completa

**Epic (45+ minutos):**
- Elementos a anadir: Multiples rondas de emparejamiento
- Sub-etapas: Emparejar fase 1 → resultado → Emparejar fase 2

---

## Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-investigacion-texto`**
- **Sinergia:** Textos extraidos de una narrativa
- **Ejemplo compuesto:** Leer historia → emparejar conceptos de la historia
- **Frecuencia:** Comun

**2. `prueba-emparejamiento-memoria`**
- **Sinergia:** Emparejar y luego recordar secuencia
- **Ejemplo compuesto:** Emparejar textos → recordar orden
- **Frecuencia:** Ocasional

### Skills Alternativos (Sustitucion)

**En lugar de este skill, considera:**

- **`prueba-emparejamiento-memoria`** → Si hay componente de memoria
- **`prueba-logica-posiciones`** → Si es mas deduccion que matching

---

## Ejemplos Concretos

### Ejemplo 1: Objeciones de los Hermanos

**Contexto:** Street escape, ayudar a Pepe a rebatir objeciones sobre alquiler

**Configuracion:**
```json
{
  "numero_pares": 5,
  "tipo_emparejamiento": "objecion-respuesta",
  "mostrar_feedback": true,
  "contexto_narrativo": "Ana cuenta las objeciones de sus hermanos sobre alquilar a Pepe"
}
```

**Flujo de juego:**
1. Jugador ve lista de objeciones de los hermanos
2. Ve lista de posibles respuestas/argumentos
3. Empareja cada objecion con la respuesta adecuada
4. Completa todos los emparejamientos correctamente
5. Avanza en la negociacion

**Solucion:** Cada objecion tiene su respuesta correcta basada en logica

**Pistas progresivas:**
- Pista 1: "Identifica las objeciones principales de los hermanos"
- Pista 2: "Busca argumentos que aborden directamente sus preocupaciones"
- Pista 3: "Empareja cada objecion con una solucion que resuelva el problema"
- Pista 4: "Presenta como el proyecto de Pepe beneficia a todos"
- Pista 5: "Completa correctamente el emparejamiento para avanzar"

---

## Notas de Implementacion

### Para el Agente Usuario

**Antes de usar este skill:**
1. Redactar textos de ambos conjuntos
2. Verificar que cada par tiene una conexion clara
3. Asegurar que no hay ambiguedades

**Mientras usas este skill:**
1. Balancear longitud de textos
2. Incluir feedback de acierto/error
3. Preparar contexto narrativo

**Despues de crear la prueba:**
1. Testear que las conexiones son claras
2. Verificar tiempo de completado
3. Ajustar longitud segun feedback

---

## Changelog

- **v1.0** (2026-02-15): Creacion inicial del skill

---

**Score de evaluacion:** 7/10  
**Frecuencia de uso esperada:** Media  
**Dependencias:** Ninguna
