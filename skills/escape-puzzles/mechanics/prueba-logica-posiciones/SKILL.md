---
name: prueba-logica-posiciones
description: Skill para crear pruebas de logica sobre posiciones y ordenamiento. Usar cuando se necesite (1) que los jugadores deduzcan posiciones basandose en restricciones logicas, (2) resolver puzzles tipo "quien esta donde", (3) combinar multiples pistas relacionales para encontrar una solucion unica.
---

# Prueba Logica Posiciones

Skill para el diseno, validacion y adaptacion de pruebas basadas en deduccion de posiciones.

---

## Cuando Usar Este Tipo de Prueba

Usa este skill cuando:

- [x] **Trigger 1:** El jugador debe deducir posiciones basandose en restricciones
- [x] **Trigger 2:** Hay multiples pistas relacionales ("A esta junto a B", "C no esta al lado de D")
- [x] **Trigger 3:** La solucion requiere combinar todas las restricciones logicamente

**Ejemplos de prompts que activan este skill:**
- "Quiero un puzzle donde deduzcan quien se sienta donde en una mesa"
- "Crea un enigma de posiciones con restricciones multiples"
- "Necesito que ordenen personas segun pistas logicas"

---

## Cuando NO Usarlo (Anti-Patrones)

**NO uses este skill cuando:**

### Anti-Patron 1: Demasiadas restricciones
- **Por que falla:** Mas de 7-8 restricciones sobrecarga la memoria de trabajo
- **Mejor alternativa:** Simplificar o dividir en fases

### Anti-Patron 2: Solucion ambigua
- **Por que falla:** Si hay multiples ordenes validos, genera confusion
- **Mejor alternativa:** Verificar que la solucion es unica

### Anti-Patron 3: Sin forma de sistematizar
- **Por que falla:** Si las pistas son muy abstractas, no hay metodo
- **Mejor alternativa:** Incluir restricciones concretas y verificables

**Regla general:** Debe haber exactamente una solucion valida.

---

## Variables de Diseno

### Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `numero_elementos` | number | 3-8 | 6 | Cantidad de elementos a posicionar |
| `tipo_disposicion` | string | ["lineal", "circular", "matriz"] | "circular" | Como se organizan |
| `numero_restricciones` | number | 3-8 | 5 | Cantidad de pistas logicas |
| `formato_restricciones` | string | ["texto", "lista", "tabla"] | "texto" | Como se presentan las pistas |
| `dificultad_logica` | number | 1-10 | 5 | Complejidad de deduccion |

### Variables Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `elementos` | array | Nombres de personas/objetos |
| `restricciones` | array | Lista de pistas logicas |
| `solucion_orden` | array | Orden correcto final |
| `elemento_objetivo` | string | Elemento especifico a identificar |
| `imagen_referencia` | string | Imagen de la disposicion |

### Combinaciones Validas

- **Configuracion Basica:** `numero_elementos=5`, `tipo_disposicion="lineal"`, `numero_restricciones=4`
- **Configuracion Mesa:** `tipo_disposicion="circular"`, `numero_elementos=7`

### Combinaciones Prohibidas/Peligrosas

- [x] NO combines `numero_elementos > 6` con `numero_restricciones < 5`
- [WARN] Cuidado con `tipo_disposicion="circular"` sin imagen de referencia

---

## Errores Comunes de Jugadores

### Error 1: No sistematizan las pistas
- **Sintoma:** Intentan resolver mentalmente sin escribir
- **Causa:** Subestiman la complejidad
- **Prevencion:** Pista sugiriendo "haz un esquema"
- **Intervencion:** "Dibuja la mesa y situa a las personas"

### Error 2: Malinterpretan una restriccion
- **Sintoma:** Una interpretacion erronea invalida todo
- **Causa:** Ambiguedad en el lenguaje
- **Prevencion:** Redactar restricciones sin ambiguedad
- **Intervencion:** Clarificar la restriccion problematica

### Error 3: No verifican todas las restricciones
- **Sintoma:** Llegan a solucion que no cumple alguna pista
- **Causa:** Olvidan verificar contra todas las restricciones
- **Prevencion:** Lista de verificacion disponible
- **Intervencion:** "Comprueba que tu solucion cumple todas las pistas"

**Senales de alarma (el jugador esta atascado):**
- [ ] Mas de 15 minutos sin progreso
- [ ] Reportan "contradictorio" o "imposible"
- [ ] Prueban multiples ordenes sin verificar

**Tiempo maximo recomendado antes de intervenir:** 15 minutos

---

## Escalado de Dificultad

### Version Facil (Nivel 1-3)
- **Caracteristicas:**
  - 4-5 elementos
  - 3-4 restricciones directas
  - Disposicion lineal
- **Tiempo estimado:** 5-8 minutos
- **Publico objetivo:** Ninos, novatos

### Version Estandar (Nivel 4-6)
- **Caracteristicas:**
  - 6-7 elementos
  - 5-6 restricciones
  - Disposicion circular o mesa
- **Tiempo estimado:** 10-15 minutos
- **Publico objetivo:** Publico general

### Version Dificil (Nivel 7-9)
- **Caracteristicas:**
  - 7-8 elementos
  - 7-8 restricciones complejas
  - Restricciones con negacion
- **Tiempo estimado:** 15-25 minutos
- **Publico objetivo:** Expertos

### Version Extrema (Nivel 10)
- **Caracteristicas:**
  - 8+ elementos
  - Restricciones interdependientes
  - Multiples deducciones encadenadas
- **Tiempo estimado:** 25+ minutos
- **Publico objetivo:** Expertos en logica

**Matriz de escalado:**

| Aspecto | Facil | Estandar | Dificil |
|---------|-------|----------|---------|
| Elementos | 4-5 | 6-7 | 7-8 |
| Restricciones | 3-4 | 5-6 | 7-8 |
| Tipo | Lineal | Circular | Compleja |
| Pistas disponibles | 5 | 4 | 2 |

---

## Adaptaciones

### Por Edad

**Ninos (6-10 anos):**
- Simplificar: 4 elementos, restricciones simples
- Evitar: Negaciones y dobles negaciones
- Anadir: Imagen de la disposicion

**Adolescentes (11-17 anos):**
- Mantener: Nivel estandar
- Permitir: Tematicas de interes

**Adultos (18+):**
- Complejidad completa
- Considerar: Contextos realistas

### Por Espacio

**Hall Escape (sala fisica):**
- Ventajas: Papel y lapiz disponibles
- Limitaciones: Tiempo limitado
- Adaptaciones especificas: Hoja de trabajo impresa

**Street Escape (exterior/movil):**
- Ventajas: Pueden hacer esquema en movil
- Limitaciones: Pantalla pequena para dibujar
- Adaptaciones especificas: Interfaz drag & drop

**Juego de Investigacion (no presencial):**
- Ventajas: Tiempo ilimitado
- Limitaciones: Sin papel fisico
- Adaptaciones especificas: Interfaz interactiva

### Por Duracion

**Quick (5-10 minutos):**
- Elementos a eliminar: Restricciones complejas
- Foco: 4-5 elementos con solucion directa

**Standard (15-30 minutos):**
- Version completa

**Epic (45+ minutos):**
- Elementos a anadir: Multiple fases logicas
- Sub-etapas: Fase 1 → elementos → Fase 2

---

## Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-investigacion-texto`**
- **Sinergia:** Restricciones extraidas de un texto
- **Ejemplo compuesto:** Leer documento → extraer pistas → resolver posiciones
- **Frecuencia:** Comun

**2. `prueba-emparejamiento-memoria`**
- **Sinergia:** Tras resolver posiciones, recordar orden
- **Ejemplo compuesto:** Deduce posiciones → recuerda secuencia
- **Frecuencia:** Ocasional

### Skills Alternativos (Sustitucion)

**En lugar de este skill, considera:**

- **`prueba-emparejamiento-memoria`** → Si es mas asociacion que deduccion
- **`prueba-investigacion-texto`** → Si no hay restricciones logicas

---

## Ejemplos Concretos

### Ejemplo 1: La Reunion con Ana

**Contexto:** Street escape, deducir quien puede ayudar a Pepe con la vivienda

**Configuracion:**
```json
{
  "numero_elementos": 7,
  "tipo_disposicion": "circular",
  "numero_restricciones": 5,
  "elementos": ["Luis", "Carlos", "Carmen", "Pedro", "Maria", "Sofia", "Ana"],
  "restricciones": [
    "Luis esta junto a Carlos y no esta junto a Ana",
    "Carlos esta entre Luis y Carmen y por eso no esta al lado de Ana",
    "Pedro debe estar sentado a la derecha de Maria",
    "Ana esta a la izquierda de Carlos y no junto a Carmen",
    "Maria esta entre Pedro y Sofia"
  ],
  "solucion_orden": ["Luis", "Carlos", "Carmen", "Pedro", "Maria", "Sofia", "Ana"],
  "elemento_objetivo": "Ana"
}
```

**Flujo de juego:**
1. Jugador lee las restricciones sobre quienes se sientan donde
2. Dibuja un esquema de la mesa circular
3. Aplica cada restriccion logicamente
4. Deduce el orden completo
5. Identifica que Ana es la persona clave

**Solucion:** Orden: Luis, Carlos, Carmen, Pedro, Maria, Sofia, Ana. Ana es la persona que puede ayudar.

**Pistas progresivas:**
- Pista 1: "Haz un esquema de la mesa y situa a las personas segun las pistas. Fijate en la imagen."
- Pista 2: "Identifica las relaciones directas entre las personas mencionadas"
- Pista 3: "Carlos esta entre Luis y Carmen, lo que define su posicion"
- Pista 4: "El orden correcto es: Luis, Carlos, Carmen, Pedro, Maria, Sofia, Ana"
- Pista 5: "La persona clave es Ana, que puede ayudar a Pepe con la vivienda"

---

## Notas de Implementacion

### Para el Agente Usuario

**Antes de usar este skill:**
1. Definir todos los elementos y sus nombres
2. Redactar restricciones sin ambiguedad
3. Verificar que hay solucion unica

**Mientras usas este skill:**
1. Incluir imagen de referencia de la disposicion
2. Balancear numero de restricciones vs elementos
3. Preparar pista con solucion parcial

**Despues de crear la prueba:**
1. Verificar solucion unica matematicamente
2. Testear tiempo de resolucion
3. Ajustar numero de restricciones segun feedback

---

## Changelog

- **v1.0** (2026-02-15): Creacion inicial del skill

---

**Score de evaluacion:** 8/10  
**Frecuencia de uso esperada:** Media  
**Dependencias:** Ninguna
