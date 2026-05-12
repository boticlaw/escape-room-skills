---
name: prueba-panel-electrico
description: Skill para crear pruebas de paneles electricos con cableado e interruptores. Usar cuando se necesite (1) disenar una prueba que requiera conectar cables en orden especifico y configurar interruptores, (2) activar dispositivos electronicos al completar la secuencia correcta, (3) crear puzzles de ingenieria/electricidad con feedback tangible.
---

# Prueba Panel Electrico

Skill para el diseno, validacion y adaptacion de pruebas basadas en paneles de control electricos con cableado e interruptores.

---

## Cuando Usar Este Tipo de Prueba

Usa este skill cuando:

- [ ] **Trigger 1:** El usuario busca una prueba con cableado, conexiones o circuitos electricos
- [ ] **Trigger 2:** Se necesita activar un dispositivo electronico (emisores, luces, mecanismos) mediante configuracion correcta
- [ ] **Trigger 3:** El tema del juego involucra ingenieria, electricidad, laboratorios, bunkers, o salas de control

**Ejemplos de prompts que activan este skill:**
- "Quiero una prueba donde conecten cables para activar algo"
- "Necesito un panel de interruptores tipo sala de control"
- "Como hacer una prueba de electricidad que encienda un dispositivo"
- "Panel con cables de colores que hay que conectar bien"

---

## Cuando NO Usarlo (Anti-Patrones)

**NO uses este skill cuando:**

### Anti-Patron 1: Sin Componente Fisico Real
- **Por que falla:** Este skill requiere hardware fisico (cables, interruptores, dispositivo a activar). Si solo hay simulacion digital sin tacto, pierde el valor de la manipulacion fisica.
- **Mejor alternativa:** Usar `prueba-digital-interfaz` con simulacion de panel virtual

### Anti-Patron 2: Peligro Electrico Real
- **Por que falla:** Si requiere corriente real (>12V), existe riesgo de seguridad. Los escape rooms deben usar baja tension o simulacion segura.
- **Mejor alternativa:** Usar `prueba-mecanismo-fisico` con activacion mecanica pura (sin electricidad real)

### Anti-Patron 3: Solo Una Variable Simple
- **Por que falla:** Si solo es "pulsa el boton correcto" sin combinacion de elementos (cables + interruptores), es demasiado simple para justificar un panel complejo.
- **Mejor alternativa:** Usar `prueba-mecanismo-fisico` simple o `prueba-codigo-numerico`

**Regla general:** Si no hay componente fisico tangible O hay riesgo electrico real O solo hay una variable de configuracion, entonces este tipo NO es adecuado.

---

## Variables de Diseno

### Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `numero_cables` | number | 3-8 | 5 | Cantidad de cables de colores a conectar |
| `colores_cables` | array | ["rojo","azul","verde","amarillo","negro","blanco","naranja","marron"] | ["rojo","azul","verde","amarillo","negro"] | Colores disponibles en el panel |
| `secuencia_cables` | array | orden de colores | aleatorio | Orden correcto de conexion |
| `numero_interruptores_onoff` | number | 2-6 | 4 | Cantidad de interruptores tipo ON/OFF |
| `configuracion_interruptores` | array | booleanos | [true,false,true,false] | Posicion correcta de cada interruptor |
| `numero_interruptores_posicion` | number | 0-4 | 2 | Interruptores con 3 posiciones (arriba/centro/abajo) |
| `posiciones_interruptores` | array | [-1,0,1] | [1,-1] | Posicion correcta (-1=abajo, 0=centro, 1=arriba) |
| `dispositivo_activacion` | string | "emisor_fm" \| "luz" \| "motor" \| "pantalla" | "emisor_fm" | Que dispositivo se activa al completar |

**Variables especificas por tipo de dispositivo:**

*Si `dispositivo_activacion="emisor_fm"`:*
| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `frecuencia_fm` | number | 88.0-108.0 | 104.5 | Frecuencia en MHz para sintonizar |
| `mensaje_fm` | string | 1-120 caracteres | "Mision completada" | Mensaje de audio transmitido |
| `duracion_mensaje` | number | 5-60 | 10 | Segundos que dura la transmision |
| `repetir_mensaje` | boolean | true/false | true | Si el mensaje se repite en bucle |

*Si `dispositivo_activacion="luz"`:*
| Variable | Tipo | Rango | Default | Descripcion |
| `color_luz` | string | "blanco" \| "rojo" \| "verde" \| "azul" \| "rgb" | "blanco" | Color de la iluminacion |
| `patron_luz` | string | "fijo" \| "parpadeo" \| "secuencia" | "fijo" | Como se comporta la luz |
| `duracion_luz` | number | 5-300 | 60 | Segundos que permanece encendida |

*Si `dispositivo_activacion="motor"`:*
| Variable | Tipo | Rango | Default | Descripcion |
| `accion_motor` | string | "abrir" \| "cerrar" \| "girar" \| "subir" | "abrir" | Que accion realiza el mecanismo |
| `tiempo_motor` | number | 1-30 | 5 | Segundos que dura la accion |

### Variables Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `feedback_progresivo` | boolean | Si da feedback parcial (cables bien conectados vs todo correcto) |
| `tiempo_limite` | number | Segundos para completar antes de reset (opcional) |
| `intentos_maximos` | number | Veces que pueden fallar antes de bloqueo temporal |
| `pistas_montaje` | array | Secuencia de pistas sobre orden de conexion |

### Combinaciones Validas

- **Configuracion Basica:** `numero_cables=3`, `numero_interruptores_onoff=2`, `dispositivo_activacion="luz"`
- **Configuracion Estandar:** `numero_cables=5`, `numero_interruptores_onoff=4`, `numero_interruptores_posicion=2`, `dispositivo_activacion="emisor_fm"`
- **Configuracion Avanzada:** `numero_cables=8`, `numero_interruptores_onoff=6`, `numero_interruptores_posicion=4`, `feedback_progresivo=false`, `dispositivo_activacion="motor"`

### Combinaciones Prohibidas/Peligrosas

- [X] NO combines `numero_cables < 3` (demasiado simple, usar mecanismo basico)
- [X] NO combines `numero_interruptores_onoff=0` AND `numero_interruptores_posicion=0` (sin variables, no es panel)
- [WARN] Cuidado con `tiempo_limite < 30` si hay muchos cables (frustracion por presion)
- [WARN] Cuidado con `intentos_maximos < 3` (desanimo por fracaso temprano)

---

## Errores Comunes de Jugadores

### Error 1: Conexion Aleatoria Sin Sistema
- **Sintoma:** Conectan cables al azar "a ver si funciona" sin buscar patron logico
- **Causa:** No encontraron la pista que indica el orden, o la pista es muy abstracta
- **Prevencion:** Proporcionar pista clara sobre orden (ej: diagrama, instruccion numerada, color codificado)
- **Intervencion:** A los 5 minutos: "Fijaros si hay algun diagrama o instruccion que indique el orden de los cables"

### Error 2: Fijarse Solo en Una Variable
- **Sintoma:** Conectan los cables bien pero no configuran interruptores, o viceversa
- **Causa:** No entienden que ambos componentes deben estar correctos simultaneamente
- **Prevencion:** Indicador visual que muestre estado de cables e interruptores por separado
- **Intervencion:** Si cables estan bien pero no funciona: "Revisad tambien los interruptores, todo debe estar correcto"

### Error 3: Sobre-Analisis de Interruptores Posicionales
- **Sintoma:** Gastan mucho tiempo en los interruptores de 3 posiciones, ignorando cables
- **Causa:** Los interruptores posicionales parecen mas "complejos" y llaman la atencion
- **Prevencion:** Equilibrar dificultad: si hay muchos interruptores posicionales, simplificar cables
- **Intervencion:** Si estancados en interruptores >7 minutos: "Quizas deberiais empezar por los cables"

### Error 4: No Detectar que Funciona Parcialmente
- **Sintoma:** Creen que fallaron pero en realidad estaban cerca (feedback insuficiente)
- **Causa:** Falta de feedback progresivo (luces indicadoras, sonidos)
- **Prevencion:** Implementar `feedback_progresivo=true` con LEDs indicadores
- **Intervencion:** "Estais cerca, revisad la ultima conexion/ultimo interruptor"

**Senales de alarma (el jugador esta atascado):**
- [ ] Han intentado 5+ configuraciones sin sistema logico
- [ ] Discuten si "el orden importa" (no entienden la secuencia)
- [ ] Ignoran completamente uno de los componentes (cables o interruptores)
- [ ] Piden ayuda explicita sobre "como funciona esto"
- [ ] Llevan >10 minutos sin progreso visible

**Tiempo maximo recomendado antes de intervenir:** 8 minutos (6 si son novatos, 12 si son expertos)

---

## Escalado de Dificultad

### Version Facil (Nivel 1-3)
- **Caracteristicas:**
  - 3 cables, 2 interruptores ON/OFF
  - Diagrama con orden claro de cables
  - Colores diferentes y obvios
  - Feedback inmediato (LED por cada cable bien conectado)
- **Tiempo estimado:** 5-8 minutos
- **Publico objetivo:** Ninos 10-12 anos, grupos novatos

### Version Estandar (Nivel 4-6)
- **Caracteristicas:**
  - 5 cables, 4 interruptores ON/OFF, 2 interruptores posicionales
  - Pista indirecta sobre orden (ej: codigo en otra parte)
  - Feedback progresivo habilitado
  - Dispositivo de activacion interesante (emisores FM)
- **Tiempo estimado:** 10-15 minutos
- **Publico objetivo:** Publico general, adultos

### Version Dificil (Nivel 7-9)
- **Caracteristicas:**
  - 6-8 cables, 5-6 interruptores ON/OFF, 2-4 interruptores posicionales
  - Sin feedback progresivo (todo o nada)
  - Pistas cripticas o divididas en diferentes ubicaciones
  - Posibles distractores (cables extra que no se usan)
- **Tiempo estimado:** 15-22 minutos
- **Publico objetivo:** Expertos, entusiastas

### Version Extrema (Nivel 10)
- **Caracteristicas:**
  - 8 cables, 6 interruptores ON/OFF, 4 interruptores posicionales
  - Secuencia cambia segun condiciones (tiempo, intentos previos)
  - Sin pistas, descubrimiento total
  - Multiple pasos: cables → interruptores → validacion → activacion
- **Tiempo estimado:** 25+ minutos
- **Publico objetivo:** Competencias, speedruns

**Matriz de escalado:**

| Aspecto | Facil | Estandar | Dificil |
|---------|-------|----------|---------|
| Cables | 3 | 5 | 6-8 |
| Interruptores ON/OFF | 2 | 4 | 5-6 |
| Interruptores posicionales | 0 | 2 | 2-4 |
| Feedback | Progresivo | Progresivo | Todo/Nada |
| Pistas | Diagrama | Codigo indirecto | Criptica |
| Tiempo | 5-8min | 10-15min | 15-22min |

---

## Adaptaciones

### Por Edad

**Ninos (6-10 anos):**
- Simplificar: Maximo 3 cables, colores muy distintos (rojo/amarillo/azul)
- Evitar: Interruptores posicionales (confusion), cables que se parecen
- Anadir: Diagrama grande y claro, conexion magnética (facil de conectar)

**Adolescentes (11-17 anos):**
- Mantener: Version estandar completa
- Permitir: Mayor complejidad en secuencia (logica matematica simple)

**Adultos (18+):**
- Complejidad completa
- Considerar: Tematica profesional (laboratorio, central electrica)

**Grupos mixtos:**
- Estrategia: Dividir tareas (unos conectan cables, otros configuran interruptores)
- Elementos cooperativos: Necesitan ambos componentes correctos para activar

### Por Espacio

**Hall Escape (sala fisica):**
- Ventajas: Panel puede ser parte del decorado (cuadro electrico, servidor)
- Limitaciones: Espacio para cableado, seguridad electrica (baja tension)
- Adaptaciones: Panel fijo en pared, cables conexion rapida (bananas/jacks)

**Street Escape (exterior/movil):**
- Ventajas: Contexto real (caja de luz, centralita telefonica)
- Limitaciones: Proteccion climatica, seguridad publica
- Adaptaciones: Panel portatil con funda, baterias selladas

**Juego de Investigacion (no presencial):**
- NO aplica este skill - requiere componente fisico
- Alternativa: `prueba-digital-interfaz` con simulacion de panel

**Digital/Virtual:**
- NO aplica - sin tacto pierde la esencia
- Alternativa: `prueba-simulacion-circuito` virtual

### Por Duracion

**Quick (5-10 minutos):**
- Elementos a eliminar: Interruptores posicionales, feedback complejo
- Foco: Solo cables con orden simple
- Configuracion: `numero_cables=3`, `numero_interruptores_onoff=2`

**Standard (15-30 minutos):**
- Version completa estandar

**Epic (45+ minutos):**
- Elementos a anadir: Multi-etapa (panel A activa panel B)
- Sub-etapas: 
  1. Encontrar diagrama escondido
  2. Reconstruir orden de cables
  3. Configurar interruptores
  4. Validar y activar

---

## Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-busqueda-objetos`**
- **Sinergia:** El diagrama/instruccion del panel esta fisicamente escondido
- **Ejemplo compuesto:** Los jugadores buscan y encuentran un manual de instrucciones escondido. El manual indica como conectar los cables del panel.
- **Frecuencia:** Muy comun

**2. `prueba-cifrado`**
- **Sinergia:** La secuencia de cables esta codificada/encriptada
- **Ejemplo compuesto:** Descifran un mensaje que dice "Conecta: Rojo-Azul-Verde". Luego aplican al panel.
- **Frecuencia:** Comun

**3. `prueba-logica-secuencial`**
- **Sinergia:** El orden de los cables sigue una logica deducible (ej: RGB orden cromático)
- **Ejemplo compuesto:** Deducen que el orden es cromatico (rojo-naranja-amarillo...) aplicando logica de secuencias.
- **Frecuencia:** Ocasional

**4. `prueba-mecanismo-fisico`**
- **Sinergia:** El panel activa/desbloquea un mecanismo fisico (puerta, cajon)
- **Ejemplo compuesto:** Panel electrico correctamente configurado activa rele que abre cajon fuerte.
- **Frecuencia:** Muy comun

### Skills Alternativos (Sustitucion)

**En lugar de este skill, considera:**

- **`prueba-mecanismo-fisico`** → Si no se necesita electricidad real (solo mecanica)
- **`prueba-codigo-numerico`** → Si es solo introducir combinacion (sin cableado)
- **`prueba-secuencia-colores`** → Si es solo ordenar colores (sin interruptores ni electricidad)

### Skills Incompatibles (No Usar Juntos)

**Evita combinar con:**

- [X] `prueba-panel-electrico-simple` (si existiera) → Conflicto: Redundancia, usar variables de este skill
- [X] `prueba-simulacion-digital` → Conflicto: Este skill requiere fisico real

### Ejemplos de Pruebas Compuestas

**Ejemplo 1: "La Central Electrica"**
- **Skills usados:** `prueba-cifrado` + `prueba-panel-electrico` + `prueba-busqueda-objetos`
- **Descripcion:** 
  1. Buscan y encuentran fragmentos de un manual (busqueda)
  2. Descifran el orden de conexion (cifrado)
  3. Aplican al panel electrico con cables e interruptores
  4. Al completar, se activa generador que ilumina la siguiente area
- **Por que funciona:** Multi-etapa que integra mental (cifrado), exploracion (busqueda) y manipulacion fisica (panel).

**Ejemplo 2: "El Emisor de Radio" (TU PRUEBA)**
- **Skills usados:** `prueba-panel-electrico`
- **Configuracion:**
  ```json
  {
    "numero_cables": 5,
    "colores_cables": ["rojo","azul","verde","amarillo","negro"],
    "numero_interruptores_onoff": 4,
    "numero_interruptores_posicion": 2,
    "dispositivo_activacion": "emisor_fm",
    "frecuencia_fm": 104.5
  }
  ```
- **Descripcion:** Panel con 5 cables de colores a conectar en orden especifico, 4 interruptores ON/OFF, y 2 interruptores de 3 posiciones. Al configurar todo correctamente, se activa emisor FM en 104.5 MHz transmitiendo un mensaje de audio grabado (configurable: puede ser pista, contrasena, narrativa, etc.).
- **Por que funciona:** Combina multiple variables (cables + interruptores), feedback tangible (emisor real), y recompensa auditiva personalizable (frecuencia y mensaje adaptables a cada juego).

---

## Ejemplos Concretos

### Ejemplo 1: Panel de Laboratorio

**Contexto:** Escape room tipo laboratorio cientifico

**Configuracion:**
```json
{
  "numero_cables": 5,
  "colores_cables": ["rojo","azul","verde","amarillo","negro"],
  "secuencia_cables": ["rojo","verde","azul","amarillo","negro"],
  "numero_interruptores_onoff": 4,
  "configuracion_interruptores": [true,true,false,true],
  "numero_interruptores_posicion": 2,
  "posiciones_interruptores": [1,-1],
  "dispositivo_activacion": "luz_uv",
  "feedback_progresivo": true
}
```

**Flujo de juego:**
1. Jugadores encuentran diagrama en pizarra indicando orden: RGB orden cromático
2. Conectan cables segun diagrama (feedback: LED verde por cada cable correcto)
3. Configuran interruptores segun pista en monitor (ON-ON-OFF-ON)
4. Ajustan interruptores posicionales segun formulas quimicas (Arriba-Abajo)
5. Al completar, se activa luz UV que revela mensaje fluorescente

**Pistas progresivas:**
- Pista 1: "El orden sigue el arcoiris"
- Pista 2: "Los interruptores siguen el patron de seguridad del laboratorio"
- Pista 3: "Arriba = Alto voltaje, Abajo = Baja tension"

---

### Ejemplo 2: Central Telefonica

**Contexto:** Escape en antigua central telefonica

**Configuracion:**
```json
{
  "numero_cables": 6,
  "colores_cables": ["rojo","azul","verde","amarillo","negro","blanco"],
  "secuencia_cables": ["blanco","azul","naranja","verde","marron","gris"],
  "numero_interruptores_onoff": 6,
  "configuracion_interruptores": [true,false,true,true,false,true],
  "numero_interruptores_posicion": 0,
  "dispositivo_activacion": "emisor_fm",
  "frecuencia_fm": 98.7,
  "feedback_progresivo": false
}
```

**Flujo de juego:**
1. Encuentran manual de codigos de colores telefonicos (555 estándar)
2. Aplican codigo de colores a cables
3. Configuran interruptores segun numero de extension (obtenido de otra prueba)
4. Al completar, emisor FM transmite mensaje en 98.7 MHz
5. Jugadores sintonizan radio para escuchar mensaje

---

## Notas de Implementacion Tecnica

### Hardware Recomendado

**Cables:**
- Conectores banana o jacks de audio para facil conexion
- Colores estándar (evitar tonos similares)
- Longitud 20-30cm (manejables, no enredan)

**Interruptores:**
- ON/OFF: Interruptores basculantes o toggle
- Posicionales: Rotary switch de 3 posiciones o switch deslizante
- Retroiluminacion LED (feedback visual)

**Validacion:**
- Microcontrolador (Arduino/Raspberry Pi) para leer estado
- Rele para activar dispositivo final
- Deteccion de conexion por resistencia o circuito cerrado

**Seguridad:**
- Maximo 12V DC (baja tension segura)
- Fusible de proteccion
- Carcasa aislante para panel

### Validacion de Estado

El sistema debe detectar:
- Cada cable conectado en su posicion correcta
- Cada interruptor en su posicion correcta
- TODOS los elementos correctos simultaneamente
- Activar dispositivo solo cuando todo es correcto

---

## Notas para el Agente Usuario

**Antes de usar este skill:**
1. Asegurar disponibilidad de hardware (panel, cables, interruptores, dispositivo a activar)
2. Verificar seguridad electrica (baja tension <12V)
3. Seleccionar dispositivo de activacion apropiado (FM, luz, mecanismo)
4. Preparar pistas sobre orden de cables y configuracion de interruptores

**Mientras usas este skill:**
1. Documentar claramente secuencia correcta de cables
2. Definir configuracion exacta de interruptores
3. Prever errores comunes (sobretodo conectar sin seguir orden)
4. Estimar tiempo realista (10-15 min estandar)

**Despues de crear la prueba:**
1. Testear todos los componentes individualmente
2. Verificar que la activacion funciona cuando todo este correcto
3. Testear con usuarios pilotos
4. Ajustar dificultad segun resultados

---

## Changelog

- **v1.0** (2026-02-12): Creacion inicial del skill

---

**Score de evaluacion:** 8/10
- C1 (Cantidad): 1 prueba actual, 3+ planificadas → 2pts
- C2 (Reglas): Validacion compleja (combinaciones multiples) → 3pts
- C3 (Reutilizacion): Solo hall (fisico requerido) → 1pt
- C4 (Impacto): Alto (activa dispositivo externo) → 1pt
- C5 (Complejidad): Alta (7+ variables) → 1pt

**Frecuencia de uso esperada:** Media-Alta (pruebas de ingenieria/electricidad son comunes)
**Dependencias:** Ninguna (skill atomico)
