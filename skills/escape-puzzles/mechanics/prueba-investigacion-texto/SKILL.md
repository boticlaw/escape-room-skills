---
name: prueba-investigacion-texto
description: Skill para crear pruebas de investigacion en textos y narrativas. Usar cuando se necesite (1) que los jugadores encuentren informacion especifica en textos proporcionados, (2) resolver enigmas basados en contenido narrativo, (3) extraer pistas de documentos, explicaciones o dialogos.
---

# Prueba Investigacion Texto

Skill para el diseno, validacion y adaptacion de pruebas basadas en investigacion en textos.

---

## Cuando Usar Este Tipo de Prueba

Usa este skill cuando:

- [x] **Trigger 1:** El jugador debe buscar informacion en un texto proporcionado
- [x] **Trigger 2:** La respuesta esta escondida en explicaciones, dialogos o documentos
- [x] **Trigger 3:** Se requiere lectura atenta y comprension para avanzar

**Ejemplos de prompts que activan este skill:**
- "Quiero que encuentren una pista en las explicaciones del tour"
- "Crea un enigma donde deban leer un documento cuidadosamente"
- "Necesito que extraigan informacion de un texto narrativo"

---

## Cuando NO Usarlo (Anti-Patrones)

**NO uses este skill cuando:**

### Anti-Patron 1: Texto demasiado largo
- **Por que falla:** Mas de 500 palabras agota la atencion
- **Mejor alternativa:** Dividir en secciones o resumir

### Anti-Patron 2: Respuesta demasiado obvia
- **Por que falla:** Si esta en la primera linea, no hay investigacion
- **Mejor alternativa:** Usar `prueba-exploracion-visual` o simplicar

### Anti-Patron 3: Informacion no presente
- **Por que falla:** Si la respuesta requiere conocimiento externo
- **Mejor alternativa:** Incluir toda la informacion necesaria

**Regla general:** Toda la informacion necesaria debe estar en el texto proporcionado.

---

## Variables de Diseno

### Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `longitud_texto` | string | ["corto", "medio", "largo"] | "medio" | Extension del texto |
| `tipo_texto` | string | ["narrativo", "informativo", "dialogo", "documento"] | "narrativo" | Formato del contenido |
| `formato_respuesta` | string | ["palabra_clave", "frase", "concepto", "url"] | "palabra_clave" | Tipo de respuesta esperada |
| `ubicacion_pista` | string | ["inicio", "medio", "final", "resaltado"] | "medio" | Donde esta la informacion |
| `dificultad_comprension` | number | 1-10 | 5 | Complejidad del texto |

### Variables Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `texto_completo` | string | Contenido del texto |
| `respuesta_correcta` | string | Respuesta esperada |
| `palabras_clave_resaltadas` | array | Palabras que destacar visualmente |
| `contexto_adicional` | string | Informacion de fondo |
| `pistas_linea` | number | Linea aproximada de la respuesta |

### Combinaciones Validas

- **Configuracion Basica:** `longitud_texto="corto"`, `ubicacion_pista="resaltado"`, `formato_respuesta="palabra_clave"`
- **Configuracion Avanzada:** `longitud_texto="largo"`, `ubicacion_pista="medio"`, `dificultad_comprension=7`

### Combinaciones Prohibidas/Peligrosas

- [x] NO combines `longitud_texto="largo"` con `dificultad_comprension > 7`
- [WARN] Cuidado con `ubicacion_pista="resaltado"` si es muy obvio

---

## Errores Comunes de Jugadores

### Error 1: Lectura superficial
- **Sintoma:** Dicen "no sale" cuando la informacion esta
- **Causa:** No leen con atencion o saltan parrafos
- **Prevencion:** Indicar que deben leer todo cuidadosamente
- **Intervencion:** Pista sobre donde buscar (seccion o parrafo)

### Error 2: Sobreinterpretacion
- **Sintoma:** Buscan significados ocultos donde no los hay
- **Causa:** Esperan enigmas complejos donde es simple
- **Prevencion:** Texto claro sin ambiguedades
- **Intervencion:** Confirmar que la respuesta es literal

### Error 3: No reconocen la respuesta
- **Sintoma:** Leen la palabra pero no la identifican como respuesta
- **Causa:** Falta de contexto o conexion con el enigma
- **Prevencion:** Formular pregunta que apunte a la respuesta
- **Intervencion:** Resaltar la palabra o dar mas contexto

**Senales de alarma (el jugador esta atascado):**
- [ ] Mas de 8 minutos sin encontrar la respuesta
- [ ] Reportan haber leido "todo" sin exito
- [ ] Prueban multiples respuestas incorrectas

**Tiempo maximo recomendado antes de intervenir:** 10 minutos

---

## Escalado de Dificultad

### Version Facil (Nivel 1-3)
- **Caracteristicas:**
  - Texto corto (<200 palabras)
  - Palabra resaltada o en negrita
  - Pregunta directa
- **Tiempo estimado:** 2-5 minutos
- **Publico objetivo:** Ninos, novatos

### Version Estandar (Nivel 4-6)
- **Caracteristicas:**
  - Texto medio (200-500 palabras)
  - Informacion en medio del texto
  - Requiere comprension basica
- **Tiempo estimado:** 5-10 minutos
- **Publico objetivo:** Publico general

### Version Dificil (Nivel 7-9)
- **Caracteristicas:**
  - Texto largo (500+ palabras)
  - Informacion implicita
  - Requiere sintetizar multiples partes
- **Tiempo estimado:** 10-15 minutos
- **Publico objetivo:** Expertos

### Version Extrema (Nivel 10)
- **Caracteristicas:**
  - Multiples documentos
  - Informacion dispersa
  - Requiere cruzar datos
- **Tiempo estimado:** 15+ minutos
- **Publico objetivo:** Investigadores

**Matriz de escalado:**

| Aspecto | Facil | Estandar | Dificil |
|---------|-------|----------|---------|
| Longitud | Corto | Medio | Largo |
| Ubicacion | Resaltado | Medio | Implicito |
| Pistas disponibles | 5 | 4 | 2 |
| Formato respuesta | Palabra | Frase | Concepto |

---

## Adaptaciones

### Por Edad

**Ninos (6-10 anos):**
- Simplificar: Texto muy corto con imagen
- Evitar: Vocabulario complejo
- Anadir: Ilustraciones que acompanen

**Adolescentes (11-17 anos):**
- Mantener: Nivel estandar
- Permitir: Tematicas de interes

**Adultos (18+):**
- Complejidad completa
- Considerar: Documentos realistas o historicos

### Por Espacio

**Hall Escape (sala fisica):**
- Ventajas: Documentos fisicos, post-its, cartas
- Limitaciones: Cantidad limitada por espacio
- Adaptaciones especificas: Props fisicos

**Street Escape (exterior/movil):**
- Ventajas: Texto en pantalla, scrollable
- Limitaciones: Lectura en movil menos comoda
- Adaptaciones especificas: Texto con tamaño ajustable

**Juego de Investigacion (no presencial):**
- Ventajas: Textos largos, multiples fuentes
- Limitaciones: Sin tacto
- Adaptaciones especificas: Buscador de texto

### Por Duracion

**Quick (5-10 minutos):**
- Elementos a eliminar: Textos secundarios
- Foco: Un texto corto con respuesta directa

**Standard (15-30 minutos):**
- Version completa

**Epic (45+ minutos):**
- Elementos a anadir: Multiples documentos que cruzar
- Sub-etapas: Doc1 → pista → Doc2 → respuesta final

---

## Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-adivinanza-ubicacion`**
- **Sinergia:** El texto contiene la adivinanza
- **Ejemplo compuesto:** Leer documento → encontrar adivinanza → ir al lugar
- **Frecuencia:** Comun

**2. `prueba-exploracion-visual`**
- **Sinergia:** Texto con elementos visuales ocultos
- **Ejemplo compuesto:** Leer + encontrar elemento escondido
- **Frecuencia:** Ocasional

### Skills Alternativos (Sustitucion)

**En lugar de este skill, considera:**

- **`prueba-exploracion-visual`** → Si es mas visual que textual
- **`prueba-adivinanza-ubicacion`** → Si el texto es una adivinanza

---

## Ejemplos Concretos

### Ejemplo 1: Los Vestigios del Palacio Condal

**Contexto:** Street escape, encontrar informacion en las explicaciones del Free Tour

**Configuracion:**
```json
{
  "longitud_texto": "medio",
  "tipo_texto": "informativo",
  "formato_respuesta": "palabra_clave",
  "ubicacion_pista": "resaltado",
  "respuesta_correcta": "la calleja",
  "contexto": "Explicaciones del Free Tour de Pepe sobre el Palacio Condal"
}
```

**Flujo de juego:**
1. Jugador lee las explicaciones sobre el Palacio Condal
2. Busca informacion relacionada con el contraste entre ricos y pobres
3. Encuentra referencia a "la calleja" como simbolo de vida humilde
4. Introduce "la calleja" como respuesta

**Solucion:** "la calleja" - representa el contraste entre el lujo del palacio y la vida de los trabajadores

**Pistas progresivas:**
- Pista 1: "Recuerda lo que Pepe cuenta en sus tours"
- Pista 2: "Hay una calle especifica que simboliza la vida humilde fuera del palacio"
- Pista 3: "El Free Tour de Pepe puede resultar de mucha utilidad"
- Pista 4: "Busca la informacion resaltada en las explicaciones de Pepe"
- Pista 5: "La respuesta es 'la calleja', que representa el contraste"

---

## Notas de Implementacion

### Para el Agente Usuario

**Antes de usar este skill:**
1. Redactar el texto con la informacion incluida
2. Verificar que la respuesta es unica y clara
3. Decidir si resaltar o no la palabra clave

**Mientras usas este skill:**
1. Balancear longitud vs densidad de informacion
2. Incluir contexto suficiente
3. Preparar pistas especificas de ubicacion

**Despues de crear la prueba:**
1. Testear tiempo de lectura y resolucion
2. Verificar que no hay respuestas alternativas validas
3. Ajustar dificultad segun feedback

---

## Changelog

- **v1.0** (2026-02-15): Creacion inicial del skill

---

**Score de evaluacion:** 7/10  
**Frecuencia de uso esperada:** Media  
**Dependencias:** Ninguna
