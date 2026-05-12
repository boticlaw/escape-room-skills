# Ejemplos Conceptuales: Buenos y Malos Skills

## Criterios de Evaluacion

Un buen skill de prueba debe ser:
1. **Reutilizable:** Aplicable a multiples pruebas concretas
2. **Especifico:** Define claramente cuando usarlo y cuando no
3. **Completo:** Incluye las 7 secciones obligatorias con contenido util
4. **Accionable:** Un agente puede seguirlo para crear una prueba funcional
5. **Escalable:** Funciona en diferentes dificultades y contextos

---

## EJEMPLO 1: Cifrado

### BUEN Skill: `prueba-cifrado`

```markdown
---
name: prueba-cifrado
description: Skill para crear pruebas de descifrado de mensajes. Usar cuando se 
necesite (1) ocultar informacion tras transformacion de simbolos/texto, 
(2) validar soluciones de texto especifico, (3) crear puzzles de comunicacion 
secreta en contextos de espionaje, misterio o historia.
---

# Prueba Cifrado

Skill para disenar pruebas basadas en transformacion de mensajes.

## Cuando Usar Este Tipo de Prueba

Usa este skill cuando:

- [ ] El usuario menciona "codigos", "cifrado", "descifrar", "mensaje secreto"
- [ ] La solucion es un texto especifico que debe procesarse (no un objeto)
- [ ] El tema del juego involucra espionaje, comunicacion oculta, 
      antiguedades con inscripciones, o elementos secretos

**Ejemplos de prompts que activan este skill:**
- "Quiero que descifren un mensaje para saber donde esta la llave"
- "Necesito algo con codigo Morse para un escape de barco pirata"
- "Como puedo hacer un cifrado Cesar pero mas dificil?"

## Cuando NO Usarlo (Anti-Patrones)

### Anti-Patron 1: Publico Pre-Lector
- **Por que falla:** Los cifrados requieren manipulacion de simbolos/leteras
  que ninos <7 anos no dominan. Frustracion garantizada.
- **Mejor alternativa:** Usar `prueba-colores-patrones` o 
  `prueba-asociacion-imagenes` donde la correspondencia es visual directa

### Anti-Patron 2: Solucion Ambigua
- **Por que falla:** Los cifrados tienen solucion exacta (texto especifico).
  Si hay multiples interpretaciones validas, el jugador pensara que su 
  respuesta alternativa es correcta y el sistema la rechazara injustamente.
- **Mejor alternativa:** Usar `prueba-interpretacion` para respuestas abiertas

### Anti-Patron 3: Contexto de Alto Ruido
- **Por que falla:** Comparar simbolos requiere concentracion. En espacios 
  ruidosos (calles con trafico, bares) aumentan errores y frustracion.
- **Mejor alternativa:** Usar `prueba-cifrado-visual-silencioso` (sin audio) 
  o `prueba-mecanismo-fisico` (feedback inmediato tangible)

**Regla general:** Si el publico no lee con fluidez O la solucion no es 
un texto exacto O el entorno es muy ruidoso, entonces este tipo NO es adecuado.

## Variables de Diseno

### Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `tipo_cifrado` | string | "sustitucion" \| "transposicion" \| "hibrido" | "sustitucion" | Algoritmo de cifrado |
| `alfabeto` | string | "latin" \| "numerico" \| "simbolos" \| "custom" | "latin" | Caracteres usados |
| `longitud` | number | 4-50 | 12 | Caracteres del mensaje |
| `ayuda_inicial` | enum | "ejemplo_completo" \| "primer_letra" \| "ninguna" | "ejemplo_completo" | Cuanto se da gratis |

### Variables Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `clave` | string | Para cifrados que requieren clave (Vigenere) |
| `distractores` | number | 0-5 mensajes falsos adicionales |
| `direccion` | string | "encriptar" \| "desencriptar" (default: desencriptar) |

### Combinaciones Validas

- **Basica:** `tipo="sustitucion", alfabeto="latin", longitud=8, ayuda="ejemplo_completo"`
- **Avanzada:** `tipo="hibrido", alfabeto="simbolos", longitud=20, ayuda="ninguna", distractores=3`

### Combinaciones Prohibidas

- ❌ `alfabeto="custom"` sin definir `alfabeto_custom` (no sabra que simbolos usar)
- ❌ `longitud < 6` + `distractores > 0` (mensaje demasiado corto)
- ⚠️ `longitud > 30` + publico infantil (pierden paciencia)

## Errores Comunes de Jugadores

### Error 1: Paralisis por Complejidad
- **Sintoma:** Miran el cifrado sin actuar. "Esto es imposible" sin intentar.
- **Causa:** Falta punto de entrada obvio. Parece mas complejo de lo que es.
- **Prevencion:** Incluir 2-3 caracteres ya resueltos como ejemplo visible
- **Intervencion:** A los 3 minutos: "Fijaros, estas 3 letras ya estan descifradas"

### Error 2: Solucion Parcial Prematura
- **Sintoma:** Creen que ganaron porque leyeron 2 palabras. Ignoran el resto.
- **Causa:** No queda claro cuando la prueba esta completa.
- **Prevencion:** Indicador de progreso ("3 de 5 palabras descifradas")
- **Intervencion:** Feedback: "Falta algo... seguid descifrando el resto"

### Error 3: Direccion Incorrecta
- **Sintoma:** Aplican algoritmo al reves (ej: encriptar en lugar de desencriptar)
- **Causa:** Instrucciones ambiguas o falta de ejemplo paso a paso
- **Prevencion:** Incluir diagrama con 1 ejemplo completo resuelto
- **Intervencion:** A los 5 minutos: "Revisad si estaIS yendo en la direccion correcta"

**Senales de alarma:**
- [ ] Mirando sin escribir >3 minutos
- [ ] Discutiendo metodos irrelevantes (sobrepensando)
- [ ] 3+ intentos fallidos seguidos
- [ ] Piden pista explicitamente

**Tiempo maximo antes de intervenir:** 5 minutos

## Escalado de Dificultad

### Facil (Nivel 1-3)
- Mensaje corto (4-8 chars), cifrado simple, 3 ejemplos dados
- Tiempo: 3-5 minutos
- Publico: Ninos 8-10 anos, novatos

### Estandar (Nivel 4-6)
- Mensaje medio (10-15 chars), Cesar/sustitucion, 1 ejemplo
- Tiempo: 8-12 minutos
- Publico: Adultos general

### Dificil (Nivel 7-9)
- Mensaje largo (20-30 chars), hibrido, sin ejemplos, distractores
- Tiempo: 15-20 minutos
- Publico: Expertos

### Extrema (Nivel 10)
- Multi-capa, cifrado personalizado, cambio dinamico
- Tiempo: 25+ minutos
- Publico: Speedrunners, competiciones

## Adaptaciones

### Por Edad
- **Ninos:** Usar simbolos dibujos, rueda fisica giratoria, colores
- **Adultos:** Cifrados historicos reales (Enigma), multi-etapa

### Por Espacio
- **Hall:** Objetos fisicos (ruedas cifrado, libros codigo)
- **Street:** Fachadas con inscripciones reales. Evitar audio.
- **Digital:** Validacion automatica, decodificadores online

### Por Duracion
- **Quick:** Un cifrado directo, corto
- **Epic:** Narrativa multi-capa (encontrar herramienta → usar → resultado)

## Relaciones con Otros Skills

### Complementan
- `prueba-busqueda-objetos` → El cifrado esta en un objeto encontrado
- `prueba-mecanismo` → El resultado abre un candado
- `prueba-logica-secuencial` → El cifrado es una etapa

### Alternativas
- `prueba-asociacion-directa` → Si no se necesita procesamiento
- `prueba-colores-patrones` → Si son ninos pre-lectores

### Incompatibles
- ❌ `prueba-trivia` (ambos son mentales, confunden)

### Ejemplo Compuesto: "El Mensaje del Espia"
- **Skills:** `prueba-busqueda-objetos` + `prueba-cifrado`
- **Flujo:** Encontrar 3 fragmentos → Unirlos → Descifrar mensaje completo
- **Por que funciona:** Exploracion fisica + climax mental
```

**Evaluacion:**
- ✅ **Reutilizable:** Cubre todos los cifrados (Cesar, Morse, Vigenere, etc.)
- ✅ **Especifico:** Define claramente cuando usarlo y 3 anti-patrones
- ✅ **Completo:** Las 7 secciones estan detalladas
- ✅ **Accionable:** Variables configurables con valores concretos
- ✅ **Escalable:** 4 niveles de dificultad + adaptaciones

**Score: 10/10**

---

### MAL Skill: `prueba-acertijo`

```markdown
---
name: prueba-acertijo
description: Para pruebas de acertijos y preguntas ingeniosas
---

# Prueba Acertijo

Crea acertijos para tu escape room.

## Cuando Usar

Cuando quieras hacer una pregunta con respuesta ingeniosa.

## Como Usar

Escribe un acertijo. La respuesta debe ser una palabra o frase.

## Ejemplos

- "Tengo agujas pero no coso. Que soy?" → Reloj
- "Blanco por dentro, verde por fuera..." → Pera

## Variaciones

- Facil: Respuesta obvia
- Dificil: Respuesta abstracta
```

**Evaluacion:**
- ❌ **No reutilizable:** Tan generico que no aporta valor
- ❌ **No especifico:** "Cuando quieras" no ayuda a decidir
- ❌ **Incompleto:** Solo 4 secciones, sin anti-patrones, sin variables
- ❌ **No accionable:** "Escribe un acertijo" no es guia
- ❌ **No escalable:** "Facil/Dificil" sin criterios

**Score: 2/10**

**Problemas especificos:**
1. No define cuando NO usarlo (toda prueba mental podria ser "acertijo")
2. Sin variables de diseno (cualquier formato/texto es valido)
3. Sin errores comunes de jugadores (aplicable a cualquier cosa)
4. Sin relaciones (no se sabe como se diferencia de `prueba-cifrado`, `prueba-logica`, etc.)

**Solucion:** Dividir en skills especificos:
- `prueba-asociacion-lateral` (pensar fuera de la caja)
- `prueba-deduccion-logica` (premisa → conclusion)
- `prueba-interpretacion-contexto` (respuesta abierta)

---

## EJEMPLO 2: Busqueda

### BUEN Skill: `prueba-busqueda-objetos`

```markdown
---
name: prueba-busqueda-objetos
description: Skill para pruebas de hallazgo de objetos o informacion oculta.
Usar cuando (1) la solucion requiera encontrar algo fisico/digital, 
(2) se quiera fomentar exploracion del espacio, (3) se necesite 
conectar diferentes areas del juego.
---

# Prueba Busqueda de Objetos

Skill para disenar pruebas de exploracion y hallazgo.

## Cuando Usar Este Tipo de Prueba

- [ ] La solucion es un objeto fisico o fragmento de informacion oculto
- [ ] Se quiere que los jugadores exploren activamente el espacio
- [ ] Se necesita conectar diferentes areas/zonas del juego

**Ejemplos de prompts:**
- "Necesito que busquen pistas escondidas en la habitacion"
- "Como hago para que recorran toda la sala?"
- "Quiero que encuentren las partes de un mapa"

## Cuando NO Usarlo

### Anti-Patron 1: Objeto Obvio
- **Por que falla:** Si esta al descubierto, no es "busqueda", es "coger"
- **Alternativa:** Usar `prueba-observacion` (esta a la vista pero pasa desapercibido)

### Anti-Patron 2: Solucion Mental
- **Por que falla:** Si resolverlo no requiere encontrar nada fisico
- **Alternativa:** Usar `prueba-logica` o `prueba-cifrado`

### Anti-Patron 3: Objeto Peligroso
- **Por que falla:** Buscar en lugares inseguros (electricidad, altura)
- **Alternativa:** Usar `prueba-observacion-visual` desde distancia segura

## Variables de Diseno

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `numero_objetos` | number | 1-20 | 3 | Cuantos objetos encontrar |
| `ocultamiento` | enum | "simple" \| "camuflado" \| "requiere_herramienta" | "simple" | Como estan escondidos |
| `distribucion` | enum | "misma_zona" \| "multizona" \| "todo_espacio" | "misma_zona" | Area de busqueda |
| `orden_relevante` | boolean | true/false | false | Si el orden de hallazgo importa |

## Errores Comunes

### Error 1: Frustracion por Dificultad
- **Sintoma:** "No encontramos nada" tras 10 minutos buscando
- **Causa:** Ocultamiento excesivo o pistas insuficientes
- **Prevencion:** Proporcionar 1 pista de zona general por objeto
- **Intervencion:** A los 7 minutos: "Revisad la zona del [pista]"

### Error 2: Objetos Perdidos
- **Sintoma:** Otro grupo jugo antes y movio/malvio el objeto
- **Causa:** Objetos pequenos sin fijacion
- **Prevencion:** Usar objetos grandes o fijar con velcro/cinta

**Tiempo maximo:** 10 minutos (busqueda es frustrante si se alarga)

## Escalado

### Facil
- 1-2 objetos, ocultamiento simple, misma zona
- Tiempo: 3-5 minutos

### Estandar
- 3-5 objetos, camuflaje moderado, multizona
- Tiempo: 8-10 minutos

### Dificil
- 6-10 objetos, requieren herramienta (linterna UV, iman), todo el espacio
- Tiempo: 12-15 minutos

## Adaptaciones

### Por Espacio
- **Hall:** Cajones, detras de cuadros, bajo muebles
- **Street:** Placas, monumentos, comercios colaboradores
- **Digital:** Links ocultos, meta-datos de imagenes

## Relaciones

### Complementan
- `prueba-cifrado` → Lo que encuentras es un mensaje cifrado
- `prueba-mecanismo` → Los objetos activan el mecanismo

### Alternativas
- `prueba-observacion` → Si solo hay que MIRAR, no buscar

### Ejemplo Compuesto: "Las Piezas del Reloj"
- **Skills:** `prueba-busqueda-objetos` (encontrar 4 engranajes) + 
  `prueba-mecanismo` (colocarlos en orden correcto)
- **Flujo:** Buscar piezas → Encontrar instruccion de montaje → 
  Colocar en mecanismo
```

**Evaluacion:** 9/10
- Casi perfecto, bien estructurado
- Una mejora: anadir variable `tamanio_objeto` (pequeno/medio/grande) para prevenir perdidas

---

### MAL Skill: `prueba-habitacion-sala-roja`

```markdown
---
name: prueba-habitacion-sala-roja
description: Pruebas para la sala roja del escape room X
---

# Pruebas Sala Roja

Las pruebas especificas de la habitacion roja de nuestro escape.

## Prueba 1: El Cajon

Los jugadores abren el cajon y encuentran una llave.

## Prueba 2: El Cuadro

Detras del cuadro hay un codigo: 4821.

## Prueba 3: La Caja Fuerte

Usan el codigo 4821 para abrir la caja fuerte.
```

**Evaluacion:** 0/10

**Problemas fatales:**
1. **NO es un skill:** Es documentacion de una instancia especifica
2. **Vinculado a contexto:** Solo sirve para "la sala roja"
3. **Sin estructura:** No sigue las 7 secciones
4. **Sin reutilizacion:** No aplica a ninguna otra prueba

**Que hacer con esta informacion:**
- Convertir en 3 JSONs de prueba concretos
- Crear skills genericos si aplica:
  - `prueba-busqueda-objetos` (cajon, cuadro)
  - `prueba-mecanismo-cerradura` (caja fuerte)

---

## EJEMPLO 3: Mecanismo

### BUEN Skill: `prueba-mecanismo-fisico`

```markdown
---
name: prueba-mecanismo-fisico
description: Skill para pruebas con interaccion fisica tangible:
cerraduras, diales, palancas, sensores, etc. Usar cuando la 
solucion requiera manipulacion real de objetos y feedback 
inmediato (correcto/incorrecto).
---

# Prueba Mecanismo Fisico

Skill para pruebas con interaccion tactil y feedback fisico.

## Cuando Usar

- [ ] La solucion requiere accion fisica (girar, empujar, colocar)
- [ ] Se necesita feedback inmediato (click, luz, sonido)
- [ ] El espacio permite instalacion de mecanismos

## Cuando NO Usarlo

### Anti-Patron 1: Solucion Mental
- **Por que falla:** Si solo requiere pensar, el mecanismo es decoracion
- **Alternativa:** `prueba-logica` sin componente fisico

### Anti-Patron 2: Espacio Digital
- **Por que falla:** Sin tacto, no hay ventaja sobre boton virtual
- **Alternativa:** `prueba-mecanismo-digital` con animaciones

### Anti-Patron 3: Seguridad
- **Por que falla:** Mecanismos pesados/peligrosos (pinzas, resortes)
- **Alternativa:** `prueba-mecanismo-seguro` o version digital

## Variables

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `tipo` | enum | "cerradura" \| "dial" \| "secuencia" \| "peso" | "cerradura" | Tipo de mecanismo |
| `complejidad` | number | 1-10 | 5 | Numero de pasos/variables |
| `feedback` | enum | "sonido" \| "luz" \| "apertura" \| "combo" | "combo" | Como indica exito |
| `reintentos` | number \| "infinito" | 1-10 \| "infinito" | "infinito" | Intentos permitidos |

## Errores

### Error 1: Mecanismo Atascado
- **Sintoma:** No funciona aunque la solucion sea correcta
- **Causa:** Fallo tecnico, desgaste, mal montaje
- **Prevencion:** Testeo extensivo, materiales robustos
- **Intervencion:** Siempre tener override manual para game master

### Error 2: Feedback Confuso
- **Sintoma:** No saben si lo hicieron bien o mal
- **Causa:** Feedback sutil o inexistente
- **Prevencion:** Feedback claro (sonido+luz+apertura)

## Escalado

### Facil
- 1 paso, feedback muy obvio, reintentos infinitos

### Estandar  
- 2-3 pasos, feedback claro, 5 reintentos

### Dificil
- 4+ pasos, feedback sutil (solo sonido), 3 reintentos

## Adaptaciones

### Por Espacio
- **Hall:** Instalacion permanente, materiales robustos
- **Street:** Portatil, proteccion climatica, plegable
- **Digital:** Simulacion 3D, haptic feedback si disponible

## Relaciones

### Complementan
- `prueba-cifrado` → El resultado del cifrado es el codigo
- `prueba-busqueda` → Hay que encontrar las piezas primero

### Ejemplo: "La Caja de Pandora"
- **Skills:** `prueba-busqueda-objetos` (4 gemas) + `prueba-mecanismo-fisico` 
  (colocar en orden)
- Secuencia: Encontrar gemas → Descubrir orden (en otro puzzle) → 
  Colocar en caja → Apertura
```

**Evaluacion:** 9/10
- Muy completo
- Destaca correctamente la importancia del override manual (crucial en fisico)

---

## EJEMPLO 4: Especializado

### BUEN Skill Especifico: `prueba-cifrado-codigo-morse`

**Pregunta:** ¿Es muy especifico? ¿Deberia ser `prueba-cifrado` generico?

**Analisis:**

El codigo Morse tiene caracteristicas unicas:
- Es auditivo (no visual como la mayoria de cifrados)
- Requiere herramienta de decodificacion externa o memorizacion
- Tiene ritmo/temporalidad (no es instantaneo)
- Es universal pero subutilizado en escapes modernos

**Decision:** Crear `prueba-cifrado` generico con variable `tipo="morse"`

**Por que no skill especifico:**
- El Morse es un algoritmo de cifrado mas
- No tiene reglas de validacion unicas (es sustitucion simbolo-letra)
- Se beneficia de la estructura general de cifrados

**Excepcion - Cuando SI crear especifico:**

Si el Morse fuera central en muchos juegos y tuviera:
- Validacion por ritmo (no solo texto correcto)
- Estados de "escuchando", "decodificando", "validado"
- Interaccion con hardware especifico (telegrafo)

Entonces: `prueba-telegrafo-morse` como skill compuesto.

---

## Resumen: Bueno vs Malo

| Aspecto | BUEN Skill | MAL Skill |
|---------|------------|-----------|
| **Nivel** | Familia de pruebas (cifrados) | Instancia unica (sala roja) o demasiado generico (acertijo) |
| **Nombre** | `prueba-cifrado` | `prueba-cifrado-cesar-mayusculas` o `prueba-cosas` |
| **Triggers** | 3+ especificos y accionables | 1 vago o ninguno |
| **Anti-patrones** | 2+ con alternativas | Ninguno o sin alternativas |
| **Variables** | Tipos, rangos, defaults, combinaciones prohibidas | "Puedes ajustar la dificultad" |
| **Errores** | Sintoma, causa, prevencion, intervencion | "Pueden frustrarse" |
| **Escalado** | 3+ niveles con tiempos y publico | "Facil o dificil" |
| **Adaptaciones** | Todos los contextos (edad/espacio) | Solo un contexto |
| **Relaciones** | Sinergias, alternativas, ejemplos compuestos | Ninguna o "combinar con otros" |

---

## Casos Limite

### Caso A: `prueba-codigo-qr`

**Evaluacion:**
- C1 (Cantidad): QR aparecen en muchos juegos → 2pts
- C2 (Reglas): Escaneo + redireccion → 1pt (simple)
- C3 (Reutilizacion): Universal → 2pts
- C4 (Impacto): Bajo → 0pts
- C5 (Complejidad): Simple → 0pts
- **Score: 5/10**

**Decision:** NO crear skill dedicado.

**Razon:** El QR es un medio, no una mecanica. Puede:
- Contener un cifrado (usar `prueba-cifrado`)
- Revelar un objeto (usar `prueba-busqueda-objetos`)
- Dar instrucciones (no es una prueba, es narrativa)

**Documentar como:** Tecnica de entrega, no tipo de prueba.

---

### Caso B: `prueba-realidad-aumentada`

**Evaluacion:**
- C1: Emergente pero creciente → 2pts
- C2: Reglas unicas (geolocalizacion, visionado) → 3pts
- C3: Solo digital/street → 1pt
- C4: Alto (cambia flujo del juego) → 1pt
- C5: Complejo (multiplataforma) → 1pt
- **Score: 8/10**

**Decision:** Crear skill.

**Estructura sugerida:**
- Variables: `tecnologia` (ARkit/ARcore/WebXR), `trigger` (marker/geolocation), `interaccion`
- Anti-patrones: Requiere app instalada, bateria, datos moviles
- Adaptaciones: Solo street/digital (no hall tradicional)

---

## Conclusiones

### Cuando Crear un Skill

✅ Score >= 7  
✅ ≥3 pruebas candidatas reales  
✅ Reglas de validacion especificas  
✅ Reutilizable en 2+ contextos  
✅ NO existe skill similar  

### Cuando NO Crear

❌ Score < 5  
❌ Solo 1-2 pruebas candidatas  
❌ Sin reglas especificas (mapeo directo)  
❌ Muy especifico de contexto  
❌ Duplica funcionalidad existente  

### Cuando Fusionar

Dos skills con Score 5-6 cada uno que:
- Comparten 50%+ de campos
- Diferencia es solo una variable
- Usados en contextos similares

**Ejemplo:** `prueba-cifrado-sustitucion` + `prueba-cifrado-transposicion` = `prueba-cifrado` con variable `tipo`
