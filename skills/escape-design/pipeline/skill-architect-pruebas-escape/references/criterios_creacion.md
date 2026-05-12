# Criterios de Creacion de Skills

## Scorecard Detallada

Esta scorecard evalua objetivamente si un candidato a skill merece ser creado.

**Score minimo para crear skill: 7/10**

---

## Criterio 1: Cantidad de Pruebas Candidatas (0-3 puntos)

Evalua cuantas pruebas existen (o se planean) que encajarian en este skill.

| Pruebas | Puntos | Interpretacion |
|---------|--------|----------------|
| ≥10 | 3 | Mecanica muy consolidada |
| 5-9 | 2 | Mecanica emergente |
| 3-4 | 1 | Mecanica incipiente |
| <3 | 0 | Insuficiente, acumular mas |

### Como Contar

**Pruebas validas:**
- Archivos JSON ya existentes
- Ideas documentadas en backlog con especificacion parcial
- Variaciones de una prueba base que requieren configuraciones distintas

**NO cuentan:**
- Ideas vagas sin estructura
- Pruebas que ya usan otro skill adecuadamente
- Variaciones meramente cosmeticas

### Ejemplo de Evaluacion

**Caso A: `prueba-cifrado`**
- Prueba 1: Cifrado Cesar (JSON existente)
- Prueba 2: Codigo Morse (JSON existente)
- Prueba 3: Sustitucion simbolica (JSON existente)
- Prueba 4: Cifrado Vigenere (planeada)
- Prueba 5: Cifrado binario (planeada)
- **Total: 5 pruebas → 2 puntos**

**Caso B: `prueba-realidad-virtual`**
- Prueba 1: Escape room VR (idea sin especificar)
- **Total: 1 prueba → 0 puntos (NO crear skill)**

---

## Criterio 2: Reglas Propias Unicas (0-3 puntos)

Evalua si esta mecanica tiene logica de validacion o comportamiento especifico.

| Nivel | Puntos | Caracteristicas |
|-------|--------|-----------------|
| Alta especificidad | 3 | Validacion compleja, estados multiples, interacciones unicas |
| Media especificidad | 2 | Validacion estandar pero parametros especificos |
| Baja especificidad | 1 | Mapeo directo de campos sin logica especial |
| Generica | 0 | No diferenciable de skills existentes |

### Indicadores de Reglas Propias

**3 puntos - Alta especificidad:**
- Requiere algoritmo de validacion propio
- Tiene estados intermedios (no solo correcto/incorrecto)
- Interaccion fisica especifica (mecanismos, peso, etc.)
- Temporalidad (cronometro, secuencias, ritmo)
- Multiple soluciones validas con scoring

**2 puntos - Media especificidad:**
- Validacion estandar pero con parametros unicos
- Estructura de datos especifica
- Reglas de puntuacion propias

**1 punto - Baja especificidad:**
- Solo mapea campos a comportamiento
- Sin logica adicional

**0 puntos - Generica:**
- Indistinguible de `prueba-generica`

### Ejemplo de Evaluacion

**`prueba-cifrado` → 3 puntos**
- Validacion: comparacion de texto procesado vs solucion
- Parametros: algoritmo, clave, direccion (encriptar/desencriptar)
- Estados: intento fallido (feedback) vs exito

**`prueba-pregunta` → 0 puntos**
- Solo compara respuesta == solucion
- No diferenciable de cualquier quiz generico

---

## Criterio 3: Reutilizacion Cross-Juego (0-2 puntos)

Evalua si este skill funciona en multiples contextos (hall, street, digital).

| Contextos | Puntos | Alcance |
|-----------|--------|---------|
| 3+ | 2 | Universal (hall + street + digital) |
| 2 | 1 | Parcial (ej: hall + digital) |
| 1 | 0 | Especifico de un formato |

### Como Evaluar

**2 puntos:**
- Funciona igual en sala fisica, exterior y virtual
- Adaptaciones menores por contexto
- Ejemplo: `prueba-cifrado` (papel en hall, app en digital, cartel en street)

**1 punto:**
- Funciona en 2 de 3 contextos
- Requiere adaptaciones significativas
- Ejemplo: `prueba-mecanismo-fisico` (hall + street, dificil en digital)

**0 puntos:**
- Solo funciona en un contexto
- Ejemplo: `prueba-olfato` (solo hall, dificil en otros formatos)

---

## Criterio 4: Impacto en Decisiones de Diseno (0-1 punto)

Evalua si usar este skill cambia como se estructura el juego.

**1 punto si:**
- Determina el flujo de otros elementos
- Requiere preparacion especifica del espacio
- Afecta timing global del juego
- Necesita coordinacion con otros puzzles

**0 puntos si:**
- Es independiente del resto del juego
- No afecta a otros elementos

### Ejemplos

**Impacto alto (1 punto):**
- `prueba-mecanismo-central`: Al resolverse, abre multiples areas
- `prueba-secuencia-narrativa`: El orden afecta la historia

**Impacto bajo (0 puntos):**
- `prueba-cifrado-aislado`: Resolverlo no afecta otros puzzles

---

## Criterio 5: Complejidad Configuracional (0-1 punto)

Evalua si el skill requiere explicar muchas variables.

**1 punto si:**
- ≥4 variables configurables
- Variables con interdependencias
- Necesita explicar casos de uso complejos

**0 puntos si:**
- ≤3 variables simples
- Configuracion intuitiva

---

## Calculo del Score

```
Score = C1 + C2 + C3 + C4 + C5

Donde:
- C1: Cantidad (0-3)
- C2: Reglas (0-3)
- C3: Reutilizacion (0-2)
- C4: Impacto (0-1)
- C5: Complejidad (0-1)

Maximo: 10 puntos
Minimo para crear skill: 7 puntos
```

---

## Umbrales de Decision

### Score 9-10: Crear Inmediatamente

**Caracteristicas:**
- Mecanica consolidada
- Muchas pruebas candidatas
- Reglas claras y especificas
- Altamente reusable

**Ejemplo:** `prueba-cifrado`
- C1: 10+ pruebas → 3pts
- C2: Validacion compleja → 3pts
- C3: Funciona en todos los contextos → 2pts
- C4: Impacto medio → 1pt
- C5: 5+ variables → 1pt
- **Total: 10/10**

### Score 7-8: Crear y Monitorizar

**Caracteristicas:**
- Mecanica prometedora pero emergente
- Suficientes pruebas para justificar
- Reutilizable pero con limitaciones

**Accion:**
- Crear skill
- Revisar uso tras 3 meses
- Si <3 pruebas lo usan: considerar deprecar

**Ejemplo:** `prueba-realidad-aumentada`
- C1: 5 pruebas → 2pts
- C2: Reglas especificas → 3pts
- C3: Solo digital → 0pts
- C4: Impacto alto → 1pt
- C5: Complejidad alta → 1pt
- **Total: 7/10**

### Score 5-6: Acumular Mas Pruebas

**Caracteristicas:**
- Potencial pero insuficiente evidencia
- Pocas pruebas concretas
- Reutilizacion limitada

**Accion:**
- NO crear skill aun
- Documentar pruebas candidatas
- Revisar cuando se acumulen 3+ pruebas mas

**Ejemplo:** `prueba-interaccion-olfativa`
- C1: 3 pruebas → 1pt
- C2: Reglas simples → 1pt
- C3: Solo hall → 0pts
- C4: Impacto bajo → 0pts
- C5: Simple → 0pts
- **Total: 2/10 → Esperar**

### Score <5: No Crear

**Caracteristicas:**
- Demasiado especifico o demasiado generico
- Sin pruebas concretas
- Duplica funcionalidad existente

**Accion:**
- Usar skill existente
- Documentar como variante
- Si persiste la necesidad, revisar en 6 meses

---

## Casos de Estudio

### Caso 1: `prueba-cifrado-cesar` vs `prueba-cifrado`

**Opcion A: Skill especifico `prueba-cifrado-cesar`**
- C1: Solo pruebas Cesar → 1pt (limitado)
- C2: Validacion simple → 1pt
- C3: Universal → 2pts
- C4: Bajo → 0pts
- C5: Simple → 0pts
- **Score: 4/10 → NO crear**

**Opcion B: Skill generico `prueba-cifrado`**
- C1: Todas las pruebas de cifrado → 3pts
- C2: Framework de cifrado → 3pts
- C3: Universal → 2pts
- C4: Medio → 1pt
- C5: Complejo → 1pt
- **Score: 10/10 → Crear**

**Decision:** Crear `prueba-cifrado` con variable `tipo_cifrado`.

### Caso 2: `prueba-mecanismo` vs `prueba-cerradura` + `prueba-palanca`

**Opcion A: Skills separados**
- `prueba-cerradura`: Score 5/10 (muy especifico)
- `prueba-palanca`: Score 4/10 (muy especifico)

**Opcion B: Skill unificado `prueba-mecanismo`**
- C1: Todas las pruebas mecanicas → 3pts
- C2: Framework de mecanismos → 3pts
- C3: Hall + Street → 1pt
- C4: Alto → 1pt
- C5: Complejo → 1pt
- **Score: 9/10 → Crear**

**Decision:** Crear `prueba-mecanismo` con variable `tipo_mecanismo`.

---

## Checklist de Evaluacion

Antes de crear un skill, responder:

- [ ] ¿Tengo al menos 3 pruebas JSON que encajarian?
- [ ] ¿Estas pruebas comparten logica de validacion?
- [ ] ¿Funcionaria en al menos 2 contextos (hall/street/digital)?
- [ ] ¿Tiene variables configurables que justifiquen documentacion?
- [ ] ¿NO existe ya un skill que cubra este caso?
- [ ] ¿El score calculado es >= 7?

Si todas las respuestas son SI → Crear skill.

---

## Metricas Post-Creacion

Un skill creado con score 7+ deberia alcanzar:

- **Mes 1:** ≥1 prueba lo usa
- **Mes 3:** ≥3 pruebas lo usan
- **Mes 6:** Usado en ≥2 juegos diferentes

Si no cumple estas metricas, reconsiderar:
- ¿El skill es demasiado especifico?
- ¿Hay un skill alternativo mejor?
- ¿Las pruebas candidatas reales son menos de las esperadas?

---

## Revisiones de Score

El score de un skill puede cambiar con el tiempo:

**Aumenta si:**
- Se acumulan mas pruebas candidatas
- Se descubren nuevas variables configurables
- Se expande a nuevos contextos

**Disminuye si:**
- Se fragmenta en variantes muy especificas
- Aparece un skill mejor que lo sustituye
- Las pruebas migran a otros skills

**Revisar scores cada 6 meses.**
