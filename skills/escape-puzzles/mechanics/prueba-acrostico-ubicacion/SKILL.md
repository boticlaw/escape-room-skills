---
name: prueba-acrostico-ubicacion
description: Skill para crear pruebas de acrosticos que revelan nombres de ubicaciones. Usar cuando se necesite (1) que los jugadores identifiquen la primera letra de cada linea, (2) las letras formen el nombre de un lugar fisico, (3) combinar lectura poetica con deduccion linguistica.
---

# Prueba Acrostico Ubicacion

Skill para el diseno, validacion y adaptacion de pruebas basadas en acrosticos que revelan ubicaciones.

---

## Cuando Usar Este Tipo de Prueba

Usa este skill cuando:

- [x] **Trigger 1:** El jugador debe identificar un patron en las primeras letras de lineas
- [x] **Trigger 2:** Las letras forman el nombre de un lugar fisico
- [x] **Trigger 3:** Tras descifrar, debe ir fisicamente al lugar

**Ejemplos de prompts que activan este skill:**
- "Quiero un poema donde las iniciales formen IGLESIA"
- "Crea un acrostico que revele el nombre del monumento"
- "Necesito que las primeras letras de cada verso den el lugar"

---

## Cuando NO Usarlo (Anti-Patrones)

**NO uses este skill cuando:**

### Anti-Patron 1: Palabra muy corta o muy larga
- **Por que falla:** Menos de 4 letras es trivial, mas de 8 es agotador
- **Mejor alternativa:** Usar 5-7 letras

### Anti-Patron 2: Versos forzados que no tienen sentido
- **Por que falla:** Si el poema es incoherente, arruina la inmersión
- **Mejor alternativa:** Redactar versos que funcionen semanticamente

### Anti-Patron 3: Palabra obvia desde el inicio
- **Por que falla:** Si las primeras 2 letras ya revelan todo
- **Mejor alternativa:** Palabra menos obvia o versos menos explicitos

**Regla general:** El acrostico debe ser descubrible pero no obvio a primera vista.

---

## Variables de Diseno

### Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `palabra_objetivo` | string | 4-8 letras | - | Palabra que forma el acrostico |
| `numero_letras` | number | 4-8 | 6 | Cantidad de lineas/letras |
| `formato_texto` | string | ["poema", "prosa", "versos"] | "poema" | Formato del contenido |
| `dificultad_deduccion` | number | 1-10 | 5 | Que tan obvio es el patron |
| `explicitar_patron` | boolean | true/false | false | Si se menciona "primera letra" |

### Variables Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `texto_completo` | string | Poema o texto con acrostico |
| `ubicacion_revelada` | string | Nombre del lugar |
| `url_maps` | string | Google Maps del lugar |
| `pista_patron` | string | Pista sobre el patron a buscar |
| `versos` | array | Array con cada verso/linea |

### Combinaciones Validas

- **Configuracion Basica:** `formato_texto="poema"`, `explicitar_patron=false`, `dificultad_deduccion=5`
- **Configuracion Facil:** `explicitar_patron=true`, `dificultad_deduccion=3`

### Combinaciones Prohibidas/Peligrosas

- [x] NO combines `explicitar_patron=false` con `dificultad_deduccion > 7`
- [WARN] Cuidado con `numero_letras > 8` (agota)

---

## Errores Comunes de Jugadores

### Error 1: No identifican el patron
- **Sintoma:** Leen el poema pero no ven las iniciales
- **Causa:** No estan familiarizados con acrosticos
- **Prevencion:** Incluir pista sobre "como empiezas siempre es importante"
- **Intervencion:** Explicar que miren las primeras letras

### Error 2: Interpretan el contenido literalmente
- **Sintoma:** Buscan el lugar basandose en el contenido del poema, no en el acrostico
- **Causa:** Foco en significado sobre estructura
- **Prevencion:** Pista que dirija atencion a estructura
- **Intervencion:** "Fijate en las letras, no solo en el mensaje"

### Error 3: Combinan letras incorrectas
- **Sintoma:** Toman letras del medio o final de lineas
- **Causa:** No especificar que son las iniciales
- **Prevencion:** Versos con primera letra clara
- **Intervencion:** Confirmar que son las primeras letras

**Senales de alarma (el jugador esta atascado):**
- [ ] Mas de 8 minutos sin identificar patron
- [ ] Reportan que el poema "no dice donde ir"
- [ ] Prueban palabras aleatorias

**Tiempo maximo recomendado antes de intervenir:** 10 minutos

---

## Escalado de Dificultad

### Version Facil (Nivel 1-3)
- **Caracteristicas:**
  - Palabra comun de 4-5 letras
  - Patron mencionado explicitamente
  - Pista directa
- **Tiempo estimado:** 2-5 minutos
- **Publico objetivo:** Ninos, novatos

### Version Estandar (Nivel 4-6)
- **Caracteristicas:**
  - Palabra de 6-7 letras
  - Patron implicito
  - Versos coherentes
- **Tiempo estimado:** 5-10 minutos
- **Publico objetivo:** Publico general

### Version Dificil (Nivel 7-9)
- **Caracteristicas:**
  - Palabra de 7-8 letras
  - Patron no mencionado
  - Versos que distraen del acrostico
- **Tiempo estimado:** 10-15 minutos
- **Publico objetivo:** Expertos

### Version Extrema (Nivel 10)
- **Caracteristicas:**
  - Multiple acrosticos en mismo texto
  - Lectura bidireccional
  - Sin pistas sobre patron
- **Tiempo estimado:** 15+ minutos
- **Publico objetivo:** Expertos en puzzles

**Matriz de escalado:**

| Aspecto | Facil | Estandar | Dificil |
|---------|-------|----------|---------|
| Numero letras | 4-5 | 6-7 | 7-8 |
| Patron explicito | Si | No | No |
| Pistas disponibles | 5 | 4 | 2 |
| Distraersores | Pocos | Moderados | Muchos |

---

## Adaptaciones

### Por Edad

**Ninos (6-10 anos):**
- Simplificar: Palabras cortas, patron mencionado
- Evitar: Palabras complejas o desconocidas
- Anadir: Visual con letras resaltadas

**Adolescentes (11-17 anos):**
- Mantener: Nivel estandar
- Permitir: Tematicas modernas

**Adultos (18+):**
- Complejidad completa
- Considerar: Referencias literarias

### Por Espacio

**Hall Escape (sala fisica):**
- Ventajas: Texto impreso visible
- Limitaciones: No hay exploracion real
- Adaptaciones especificas: Cartel o panel fisico

**Street Escape (exterior/movil):**
- Ventajas: Lectura individual en movil
- Limitaciones: Pantalla pequena
- Adaptaciones especificas: Texto grande

**Juego de Investigacion (no presencial):**
- Ventajas: Texto largo posible
- Limitaciones: Sin verificacion fisica
- Adaptaciones especificas: Input de texto

### Por Duracion

**Quick (5-10 minutos):**
- Elementos a eliminar: Versos distractorios
- Foco: Acrostico directo

**Standard (15-30 minutos):**
- Version completa

**Epic (45+ minutos):**
- Elementos a anadir: Multiples acrosticos encadenados
- Sub-etapas: Acrostico1 → lugar → Acrostico2

---

## Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-ubicacion-qr`**
- **Sinergia:** Acrostico revela lugar, QR verifica
- **Ejemplo compuesto:** "IGLESIA" → ir a iglesia → escanear QR
- **Frecuencia:** Muy comun

**2. `prueba-adivinanza-ubicacion`**
- **Sinergia:** Acrostico como forma de adivinanza
- **Ejemplo compuesto:** Poema que es acrostico y adivinanza
- **Frecuencia:** Comun

### Skills Alternativos (Sustitucion)

**En lugar de este skill, considera:**

- **`prueba-adivinanza-ubicacion`** → Si prefieres deduccion sobre patron
- **`prueba-ubicacion-qr`** → Si no quieres puzzle previo

---

## Ejemplos Concretos

### Ejemplo 1: El Acróstico de la Iglesia

**Contexto:** Street escape en Monzon de Campos, descubrir la iglesia

**Configuracion:**
```json
{
  "palabra_objetivo": "IGLESIA",
  "numero_letras": 7,
  "formato_texto": "poema",
  "dificultad_deduccion": 5,
  "explicitar_patron": false,
  "versos": [
    "Imagenes del pasado surgen a cada paso",
    "Grandes historias estan grabadas en sus muros",
    "Los ecos de tiempos antiguos aun resuenan",
    "Entre sus calles, la vida se mezcla con la historia",
    "Silencios y susurros que lo llenan de mistica",
    "Imponentes estructuras resisten al paso del tiempo",
    "Avanza y encontraras el lugar que buscas"
  ]
}
```

**Flujo de juego:**
1. Jugador lee el poema
2. Identifica patron de primeras letras: I-G-L-E-S-I-A
3. Deduce que debe ir a la iglesia
4. Se desplaza fisicamente
5. Escanea QR en la iglesia

**Solucion:** IGLESIA - La primera letra de cada verso forma la palabra

**Pistas progresivas:**
- Pista 1: "Observa cuidadosamente el poema"
- Pista 2: "Como empiezas siempre es importante"
- Pista 3: "La palabra es un lugar sagrado y antiguo en el pueblo"
- Pista 4: "Fijate en las primeras letras de cada linea"
- Pista 5: "Debes ir a la iglesia de Monzon de Campos y escanear el QR"

---

## Notas de Implementacion

### Para el Agente Usuario

**Antes de usar este skill:**
1. Definir la palabra objetivo
2. Redactar versos coherentes que empiecen con cada letra
3. Verificar que el poema tiene sentido completo

**Mientras usas este skill:**
1. Balancear coherencia del poema vs obviedad del acrostico
2. Incluir pista sobre el patron
3. Preparar versos que no distraigan demasiado

**Despues de crear la prueba:**
1. Testear con usuarios no familiarizados
2. Verificar tiempo de resolucion
3. Ajustar dificultad segun feedback

---

## Changelog

- **v1.0** (2026-02-15): Creacion inicial del skill

---

**Score de evaluacion:** 8/10  
**Frecuencia de uso esperada:** Alta  
**Dependencias:** `prueba-ubicacion-qr` (comun combinacion)
