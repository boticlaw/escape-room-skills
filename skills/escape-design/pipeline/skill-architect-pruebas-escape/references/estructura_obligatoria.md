# Estructura Obligatoria de Skills de Prueba

Todo skill de prueba DEBE incluir estas 7 secciones exactas en el orden especificado.

---

## Formato General

```markdown
---
name: prueba-{mecanica}
description: [Descripcion completa incluyendo cuando usar este skill]
---

# Prueba {Nombre Mecanica}

## Cuando Usar Este Tipo de Prueba

[Contenido obligatorio]

## Cuando NO Usarlo (Anti-Patrones)

[Contenido obligatorio]

## Variables de Diseno

[Contenido obligatorio]

## Errores Comunes de Jugadores

[Contenido obligatorio]

## Escalado de Dificultad

[Contenido obligatorio]

## Adaptaciones

[Contenido obligatorio]

## Relaciones con Otros Skills

[Contenido obligatorio]
```

---

## Seccion 1: Cuando Usar Este Tipo de Prueba

### Proposito
Definir triggers especificos que indican cuando esta mecanica es apropiada.

### Contenido Requerido

**1. Lista de Triggers (minimo 3)**

Cada trigger debe ser:
- Especifico y observable
- Accionable (el agente puede detectarlo)
- Distinto de los demas triggers

**Formato:**
```markdown
Usa este skill cuando:

- [ ] **Trigger 1:** [Condicion especifica]
- [ ] **Trigger 2:** [Condicion especifica]
- [ ] **Trigger 3:** [Condicion especifica]
```

**2. Ejemplos de Prompts**

Lista de prompts de usuario que activarian este skill:

```markdown
**Ejemplos de prompts que activan este skill:**
- "[Prompt ejemplo 1]"
- "[Prompt ejemplo 2]"
- "[Prompt ejemplo 3]"
```

### Ejemplo Bueno

```markdown
## Cuando Usar Este Tipo de Prueba

Usa este skill cuando:

- [ ] **Trigger 1:** El usuario menciona explicitamente "codigos", "cifrado", 
      "descifrar" o sinonimos
- [ ] **Trigger 2:** La solucion requiere transformar simbolos/siglas/texto 
      para revelar un mensaje oculto
- [ ] **Trigger 3:** El tema del juego involucra espionaje, comunicacion 
      secreta, o antiguedades con inscripciones

**Ejemplos de prompts que activan este skill:**
- "Quiero una prueba donde descifren un mensaje secreto"
- "Necesito algo con codigo Morse para un escape de barco"
- "Como hacer una prueba de Cesar pero mas dificil?"
```

### Errores Comunes

❌ **Demasiado vago:**
```markdown
Usa este skill para puzzles mentales.
```

❌ **Solo un trigger:**
```markdown
Usa este skill cuando el usuario quiera un cifrado.
```

❌ **No accionable:**
```markdown
Usa este skill cuando sea apropiado.
```

---

## Seccion 2: Cuando NO Usarlo (Anti-Patrones)

### Proposito
Prevenir uso inapropiado del skill y sugerir alternativas mejores.

### Contenido Requerido

**1. Anti-Patrones (minimo 2)**

Cada anti-patron debe incluir:
- Descripcion de la situacion
- Por que este skill fallaria
- Skill alternativo recomendado

**Formato:**
```markdown
### Anti-Patron 1: [Nombre descriptivo]
- **Por que falla:** [Explicacion]
- **Mejor alternativa:** Usar `prueba-[alternativa]`

### Anti-Patron 2: [Nombre descriptivo]
- **Por que falla:** [Explicacion]
- **Mejor alternativa:** Usar `prueba-[alternativa]`
```

**2. Regla General**

Una regla simple que resume cuando evitar este skill:

```markdown
**Regla general:** Si [condicion], entonces este tipo NO es adecuado.
```

### Ejemplo Bueno

```markdown
## Cuando NO Usarlo (Anti-Patrones)

### Anti-Patron 1: Publico Infantil No Lectores
- **Por que falla:** Los cifrados requieren manipulacion de simbolos/leetras
  que frustran a ninos <8 anos. Abandono alto.
- **Mejor alternativa:** Usar `prueba-colores-patrones` o 
  `prueba-asociacion-imagenes`

### Anti-Patron 2: Solucion Ambigua
- **Por que falla:** Los cifrados tienen solucion unica (texto especifico).
  Si la respuesta puede interpretarse de multiples formas, el jugador 
  pensara que su solucion alternativa es valida.
- **Mejor alternativa:** Usar `prueba-interpretacion-contexto` para 
  respuestas abiertas

### Anti-Patron 3: Espacio con Mucho Ruido
- **Por que falla:** Algunos cifrados requieren concentracion para comparar 
  simbolos. Ruido ambiental aumenta errores.
- **Mejor alternativa:** Usar `prueba-cifrado-visual` (sin audio) o 
  `prueba-mecanismo-fisico` (feedback inmediato)

**Regla general:** Si el publico objetivo no lee con fluidez o la solucion 
no es un texto especifico, entonces este tipo NO es adecuado.
```

### Errores Comunes

❌ **Sin alternativas:**
```markdown
No usar con ninos pequenos.
```

❌ **Sin explicacion:**
```markdown
No usar cuando haya mucho ruido.
```

❌ **Anti-patron sin accion:**
```markdown
Evitar si el espacio es pequeno.
```

---

## Seccion 3: Variables de Diseno

### Proposito
Documentar todos los parametros configurables y como afectan la experiencia.

### Contenido Requerido

**1. Variables Principales (tabla)**

```markdown
| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `nombre_var` | string \| number \| boolean | [valores] | valor | Que hace |
```

**2. Variables Opcionales**

Variables que no siempre se usan:

```markdown
### Variables Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `extra` | tipo | Para que sirve |
```

**3. Combinaciones Validas**

Ejemplos de configuraciones que funcionan bien:

```markdown
### Combinaciones Validas

- **Configuracion Basica:** `var1="X"`, `var2=5`
- **Configuracion Avanzada:** `var1="Y"`, `var2=8`, `var3=true`
```

**4. Combinaciones Prohibidas/Peligrosas**

Configuraciones que causan problemas:

```markdown
### Combinaciones Prohibidas/Peligrosas

- ❌ NO combines `var1="X"` con `var3=true` (causa [problema])
- ⚠️ Cuidado con `var2 > 8` si el publico es infantil
```

### Ejemplo Bueno

```markdown
## Variables de Diseno

### Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `tipo_cifrado` | string | "sustitucion" \| "transposicion" \| "hibrido" | "sustitucion" | Algoritmo de cifrado a usar |
| `alfabeto` | string | "latin" \| "numerico" \| "simbolos" \| "personalizado" | "latin" | Conjunto de caracteres usados |
| `longitud_mensaje` | number | 4-50 | 12 | Numero de caracteres del mensaje cifrado |
| `incluye_pista` | boolean | true/false | true | Si el mensaje original tiene pistas de contexto |

### Variables Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `clave` | string | Para cifrados que requieren clave (Vigenere, etc.) |
| `direccion` | string | "encriptar" \| "desencriptar" (default: desencriptar) |
| `distractores` | number | 0-5 mensajes falsos adicionales para confusion |

### Combinaciones Validas

- **Configuracion Basica:** `tipo_cifrado="sustitucion"`, `alfabeto="latin"`,
  `longitud_mensaje=8`, `incluye_pista=true`
- **Configuracion Avanzada:** `tipo_cifrado="hibrido"`, `alfabeto="simbolos"`,
  `longitud_mensaje=20`, `incluye_pista=false`, `distractores=2`

### Combinaciones Prohibidas/Peligrosas

- ❌ NO combines `alfabeto="personalizado"` sin definir `alfabeto_personalizado`
- ❌ NO combines `longitud_mensaje < 6` con `distractores > 0` (mensaje 
  demasiado corto para distracciones)
- ⚠️ Cuidado con `longitud_mensaje > 30` si el publico es infantil 
  (falta de paciencia)
- ⚠️ Cuidado con `incluye_pista=false` + `distractores > 2` (muy dificil)
```

### Errores Comunes

❌ **Sin tipos:**
```markdown
- dificultad: facil, media, dificil
```

❌ **Sin defaults:**
```markdown
| Variable | Tipo |
|----------|------|
| modo | string |
```

❌ **Sin explicacion de impacto:**
```markdown
| Variable | Tipo | Rango |
|----------|------|-------|
| nivel | number | 1-10 |
```

---

## Seccion 4: Errores Comunes de Jugadores

### Proposito
Anticipar frustraciones tipicas y documentar como prevenirlas y resolverlas.

### Contenido Requerido

**1. Errores Cognitivos (minimo 2)**

Cada error debe incluir:
- Sintoma (como se manifiesta)
- Causa (por que ocurre)
- Prevencion (como disenar para evitarlo)
- Intervencion (cuando y como dar pista)

**Formato:**
```markdown
### Error 1: [Tipo de error]
- **Sintoma:** [Como se manifiesta]
- **Causa:** [Por que ocurre]
- **Prevencion:** [Como disenar para evitarlo]
- **Intervencion:** [Cuando y como dar pista]
```

**2. Senales de Alarma**

Lista de comportamientos que indican atasco:

```markdown
**Senales de alarma (el jugador esta atascado):**
- [ ] Senal 1: [Descripcion observable]
- [ ] Senal 2: [Descripcion observable]
```

**3. Tiempo de Intervencion**

Recomendacion de cuando actuar:

```markdown
**Tiempo maximo recomendado antes de intervenir:** [X minutos]
```

### Ejemplo Bueno

```markdown
## Errores Comunes de Jugadores

### Error 1: Paralisis por Complejidad
- **Sintoma:** El grupo mira el cifrado pero nadie empieza. 
  Conversaciones tipo "Esto es imposible" sin intentar.
- **Causa:** El cifrado parece mas complejo de lo que es. 
  Falta punto de entrada obvio.
- **Prevencion:** 
  - Incluir al menos 2-3 caracteres descifrados como ejemplo
  - Usar `incluye_pista=true` para contexto
  - Empezar con palabras cortas/faciles
- **Intervencion:** Si tras 3 minutos no han empezado, pista nivel 1: 
  "Fijaros en los simbolos que ya estan resueltos al principio"

### Error 2: Solucion Parcial Prematura
- **Sintoma:** Creen que han resuelto porque descifraron 2-3 palabras 
  pero ignoraron el resto del mensaje.
- **Causa:** Falta de instruccion clara sobre cuando considerar 
  la prueba completada.
- **Prevencion:** 
  - Incluir validacion que verifique mensaje completo
  - Indicador visual de progreso (ej: "3 de 5 palabras")
- **Intervencion:** Si intentan validar solucion incompleta, 
  feedback: "Falta algo... seguid descifrando"

### Error 3: Interpretacion Incorrecta del Cifrado
- **Sintoma:** Aplican el algoritmo incorrectamente (ej: Cesar 
  en direccion contraria).
- **Causa:** Instrucciones ambiguas o falta de ejemplo completo.
- **Prevencion:**
  - Incluir ejemplo paso a paso con solucion
  - Verificacion intermedia (ej: "La primera letra debe ser M")
- **Intervencion:** Si tras 5 minutos van por mal camino, 
  pista: "Revisad la direccion del desplazamiento"

**Senales de alarma (el jugador esta atascado):**
- [ ] Han estado mirando el cifrado sin escribir nada >3 minutos
- [ ] Discuten sobre metodos que no tienen nada que ver (sobrepensar)
- [ ] Intentaron 3+ soluciones incorrectas seguidas
- [ ] Piden pista explicitamente (desesperacion)

**Tiempo maximo recomendado antes de intervenir:** 5 minutos
(4 minutos si es publico infantil, 7 si es grupo experto)
```

### Errores Comunes

❌ **Sin prevencion:**
```markdown
### Error: No entienden
- Causa: Es dificil
- Solucion: Dar pista
```

❌ **Sin senales observables:**
```markdown
Se dan por vencidos facilmente.
```

❌ **Sin tiempo de intervencion:**
```markdown
Intervenir cuando se vea necesario.
```

---

## Seccion 5: Escalado de Dificultad

### Proposito
Definir como adaptar la misma mecanica a diferentes niveles de dificultad.

### Contenido Requerido

**1. Versiones de Dificultad (minimo 3)**

Cada version debe incluir:
- Caracteristicas especificas
- Tiempo estimado
- Publico objetivo

**Formato:**
```markdown
### Version [Nivel] (Nivel X-Y)
- **Caracteristicas:**
  - [Aspecto 1]
  - [Aspecto 2]
- **Tiempo estimado:** [X-Y minutos]
- **Publico objetivo:** [Descripcion]
```

**2. Matriz de Escalado (opcional pero recomendada)**

Tabla comparativa:

```markdown
**Matriz de escalado:**

| Aspecto | Facil | Estandar | Dificil |
|---------|-------|----------|---------|
| Variable 1 | Valor A | Valor B | Valor C |
```

### Ejemplo Bueno

```markdown
## Escalado de Dificultad

### Version Facil (Nivel 1-3)
- **Caracteristicas:**
  - Mensaje corto (4-8 caracteres)
  - Cifrado simple (sustitucion directa)
  - 2-3 caracteres ya descifrados como ejemplo
  - Pistas de contexto muy explicitas
- **Tiempo estimado:** 3-5 minutos
- **Publico objetivo:** Ninos 8-10 anos, grupos novatos, 
  escape express (30min total)

### Version Estandar (Nivel 4-6)
- **Caracteristicas:**
  - Mensaje medio (10-15 caracteres)
  - Cifrado estandar (Cesar, sustitucion)
  - 1 caracter de ejemplo o pista inicial
  - Contexto moderado
- **Tiempo estimado:** 8-12 minutos
- **Publico objetivo:** Publico general, adultos, 
  escape standard (60min total)

### Version Dificil (Nivel 7-9)
- **Caracteristicas:**
  - Mensaje largo (20-30 caracteres)
  - Cifrado complejo (hibrido, Vigenere, o multiple paso)
  - Sin ejemplos dados, solo herramientas
  - Contexto minimo o nulo
  - Posibles distractores (mensajes falsos)
- **Tiempo estimado:** 15-20 minutos
- **Publico objetivo:** Expertos, entusiastas, 
  competiciones, escape largo (90min+)

### Version Extrema (Nivel 10)
- **Caracteristicas:**
  - Mensaje muy largo o multiple mensajes
  - Cifrado personalizado o multi-capa
  - Sin ayudas, descubrimiento total
  - Posible variante: cifrado en tiempo real 
    (cambia segun acciones)
- **Tiempo estimado:** 25+ minutos
- **Publico objetivo:** Speedrunners, campeonatos, 
  jugadores que buscan reto extremo

**Matriz de escalado:**

| Aspecto | Facil | Estandar | Dificil | Extrema |
|---------|-------|----------|---------|---------|
| Longitud | 4-8 | 10-15 | 20-30 | 30+ |
| Tipo | Sustitucion | Cesar | Hibrido | Multi-capa |
| Ejemplos dados | 3 | 1 | 0 | 0 |
| Contexto | Alto | Medio | Bajo | Nulo |
| Distractores | 0 | 0 | 2 | 5+ |
| Tiempo | 3-5min | 8-12min | 15-20min | 25min+ |
```

### Errores Comunes

❌ **Solo dos niveles:**
```markdown
### Facil y Dificil
- Facil: mensaje corto
- Dificil: mensaje largo
```

❌ **Sin tiempos:**
```markdown
- Facil: pistas
- Dificil: sin pistas
```

❌ **Sin publico objetivo:**
```markdown
- Nivel 1: 5 caracteres
- Nivel 5: 15 caracteres
- Nivel 10: 30 caracteres
```

---

## Seccion 6: Adaptaciones

### Proposito
Documentar como adaptar la prueba a diferentes contextos y constraints.

### Contenido Requerido

**1. Por Edad (todos los rangos)**

```markdown
### Ninos (6-10 anos)
### Adolescentes (11-17 anos)
### Adultos (18+ anos)
### Grupos mixtos
```

**2. Por Espacio (todos los formatos)**

```markdown
### Hall Escape (sala fisica)
### Street Escape (exterior/movil)
### Juego de Investigacion (no presencial)
### Digital/Virtual
```

**3. Por Duracion (opcional pero recomendado)**

```markdown
### Quick (5-10 minutos)
### Standard (15-30 minutos)
### Epic (45+ minutos)
```

### Ejemplo Bueno

```markdown
## Adaptaciones

### Por Edad

**Ninos (6-10 anos):**
- Simplificar: Usar `alfabeto="simbolos"` con dibujos en lugar de letras
- Evitar: Cifrados que requieren escritura (mejor tarjetas fisicas)
- Anadir: Elementos tactiles (encajar fichas, rotar discos)
- Ejemplo: Cifrado Cesar con rueda fisica giratoria

**Adolescentes (11-17 anos):**
- Mantener: Complejidad completa permitiendo eleccion
- Permitir: Cifrados de popular culture (codigos de videojuegos)
- Considerar: Elemento competitivo (tabla de tiempos)

**Adultos (18+):**
- Complejidad completa sin restricciones
- Considerar: Cifrados historicos autenticos (Enigma, escitala)
- Permitir: Multi-etapa (cada fase revela herramienta para siguiente)

**Grupos mixtos:**
- Estrategia: Dividir por roles (unos descifran, otros buscan pistas)
- Elementos cooperativos: Parte del mensaje en cada jugador
- Balance: 70% facil + 30% desafio opcional

### Por Espacio

**Hall Escape (sala fisica):**
- Ventajas: Objetos fisicos (ruedas de cifrado, libros codigo)
- Limitaciones: Espacio limitado para materiales
- Adaptaciones: Usar paredes para alfabetos de referencia

**Street Escape (exterior/movil):**
- Ventajas: Contexto real (monumentos con inscripciones)
- Limitaciones: Clima, ruido, transeuntes
- Adaptaciones: Cifrados en placas/fachadas reales. 
  Evitar audio por ruido ambiente.

**Juego de Investigacion (no presencial):**
- Ventajas: Recursos digitales (herramientas online)
- Limitaciones: Sin interaccion tactil
- Adaptaciones: Links a decodificadores online. 
  Permitir copiar-pegar texto.

**Digital/Virtual:**
- Ventajas: Validacion automatica, feedback inmediato
- Limitaciones: Sin componente tactil
- Adaptaciones: Input de texto con auto-validacion. 
  Posibles animaciones de descifrado.

### Por Duracion

**Quick (5-10 minutos):**
- Elementos a eliminar: Contexto extenso, multiple pasos
- Foco: Un solo cifrado directo
- Configuracion: `longitud_mensaje=6`, `incluye_pista=true`

**Standard (15-30 minutos):**
- Version completa sin modificaciones
- Posible: 2-3 cifrados en secuencia

**Epic (45+ minutos):**
- Elementos a anadir: Narrativa, multi-capa
- Sub-etapas: 
  1. Encontrar herramienta de cifrado
  2. Descifrar mensaje parcial
  3. Usar resultado para descifrar mensaje final
```

### Errores Comunes

❌ **Falta algun contexto:**
```markdown
### Por Edad: ...
### Por Espacio: Hall escape
(Falta street, digital...)
```

❌ **Sin ejemplos concretos:**
```markdown
### Ninos: Mas facil
### Adultos: Mas dificil
```

❌ **Sin adaptaciones especificas:**
```markdown
### Hall Escape: Funciona bien
### Street: Tambien funciona
```

---

## Seccion 7: Relaciones con Otros Skills

### Proposito
Situar este skill en el ecosistema y documentar sinergias/conflictos.

### Contenido Requerido

**1. Skills que Complementan (minimo 2)**

```markdown
### 1. `prueba-[nombre]`
- **Sinergia:** [Como se complementan]
- **Ejemplo compuesto:** [Descripcion]
- **Frecuencia:** [Muy comun | Comun | Ocasional]
```

**2. Skills Alternativos**

```markdown
### En lugar de este skill, considera:
- `prueba-[A]` → Si [condicion]
```

**3. Skills Incompatibles**

```markdown
### Evita combinar con:
- ❌ `prueba-[X]` → Conflicto: [Explicacion]
```

**4. Ejemplos de Pruebas Compuestas (minimo 1)**

```markdown
### Ejemplo: [Nombre]
- **Skills usados:** `prueba-X` + `prueba-Y`
- **Descripcion:** [Como se integran]
```

### Ejemplo Bueno

```markdown
## Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-busqueda-objetos`**
- **Sinergia:** El cifrado puede estar "escondido" en un objeto 
  (ej: mensaje cifrado en el reverso de un cuadro)
- **Ejemplo compuesto:** Los jugadores encuentran un libro (busqueda).
  En su interior hay un mensaje cifrado que indica donde esta la llave.
- **Frecuencia:** Muy comun

**2. `prueba-mecanismo-fisico`**
- **Sinergia:** Resolver el cifrado proporciona el codigo/combinacion 
  para un candado/mecanismo
- **Ejemplo compuesto:** Descifrar mensaje revela "4821". Ese codigo 
  abre una cerradura de combinacion.
- **Frecuencia:** Comun

**3. `prueba-logica-secuencial`**
- **Sinergia:** El cifrado es una etapa de una secuencia mayor
- **Ejemplo compuesto:** Fase 1: Encontrar herramienta. 
  Fase 2: Usar herramienta para descifrar. 
  Fase 3: Usar resultado para siguiente prueba.
- **Frecuencia:** Ocasional

### Skills Alternativos (Sustitucion)

**En lugar de este skill, considera:**

- **`prueba-asociacion-directa`** → Si la "solucion" es encontrar 
  un objeto especifico sin procesamiento mental complejo
- **`prueba-interpretacion-contexto`** → Si la respuesta es abierta 
  (ej: "que crees que paso aqui?") en lugar de un texto especifico
- **`prueba-colores-patrones`** → Si el publico son ninos pequenos 
  que aun no leen con fluidez

### Skills Incompatibles (No Usar Juntos)

**Evita combinar con:**

- ❌ `prueba-cifrado-doble` (otro skill de cifrado especifico) → 
  Conflicto: Redundancia. Usa este skill con variables adecuadas.
- ❌ `prueba-trivia` (pregunta con respuesta directa) → 
  Conflicto: El jugador no sabra si debe pensar o simplemente recordar

### Ejemplos de Pruebas Compuestas

**Ejemplo 1: "El Mensaje del Espia"**
- **Skills usados:** `prueba-cifrado` + `prueba-busqueda-objetos`
- **Descripcion:** Los jugadores deben encontrar 3 fragmentos de 
  un mensaje cifrado (escondidos en diferentes lugares). Una vez 
  reunidos, descifran el mensaje completo que revela la ubicacion 
  del objeto final.
- **Por que funciona:** Combina exploracion fisica (busqueda) 
  con procesamiento mental (cifrado). La recompensa de encontrar 
  cada fragmento mantiene el momentum mientras el cifrado total 
  proporciona el climax mental.

**Ejemplo 2: "La Maquina Enigmatica"**
- **Skills usados:** `prueba-cifrado` + `prueba-mecanismo-fisico` + 
  `prueba-logica-secuencial`
- **Descripcion:** Una maquina fisica tiene 3 diales. Cada dial 
  tiene simbolos. Los jugadores deben (1) descifrar que simbolos 
  corresponden a numeros (cifrado), (2) deducir la secuencia 
  correcta de numeros (logica), (3) girar los diales a esa 
  posicion (mecanismo) para abrir el compartimento.
- **Por que funciona:** Multi-etapa que integra mental y fisico. 
  Cada skill valida una etapa diferente, proporcionando 
  checkpoints naturales.
```

### Errores Comunes

❌ **Sin ejemplos concretos:**
```markdown
### Complementa: prueba-busqueda
Buscan el cifrado.
```

❌ **Sin frecuencia:**
```markdown
### prueba-X: Buena combinacion
### prueba-Y: Tambien funciona
```

❌ **Sin alternativas:**
```markdown
### No usar con: prueba-doble
Porque es redundante.
```

---

## Validacion de Estructura

Usar este checklist para verificar que todas las secciones estan completas:

- [ ] **Seccion 1:** ≥3 triggers + ejemplos de prompts
- [ ] **Seccion 2:** ≥2 anti-patrones con alternativas
- [ ] **Seccion 3:** Tabla de variables con tipos/rangos/defaults
- [ ] **Seccion 4:** ≥2 errores con sintoma/causa/prevencion/intervencion
- [ ] **Seccion 5:** ≥3 niveles de dificultad con tiempos
- [ ] **Seccion 6:** Todos los contextos (edad/espacio) cubiertos
- [ ] **Seccion 7:** ≥2 sinergias + alternativas + ≥1 ejemplo compuesto

---

## Ejemplo Completo de Skill Minimo Viable

Ver archivo `../assets/template_skill_prueba.md` para una plantilla lista para rellenar.
