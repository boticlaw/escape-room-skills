---
name: prueba-comunicacion-mensajes
description: Skill para crear pruebas de envio y descifrado de mensajes usando codigos (morse, banderas, semaforo, torres, etc.). Usar cuando se necesite (1) disenar una prueba donde los jugadores descifren mensajes usando un diccionario o codigo, (2) crear pruebas de comunicacion entre equipos separados con informacion complementaria, (3) implementar codigos de comunicacion visual o auditiva, (4) requerir que los jugadores se comuniquen efectivamente para resolver el puzzle.
---

# Prueba: Comunicacion de Mensajes (Cifrado/Descifrado)

Skill para el diseno, validacion y adaptacion de pruebas basadas en el envio, recepcion y descifrado de mensajes usando codigos y sistemas de comunicacion.

---

## Cuando Usar Este Tipo de Prueba

Usa este skill cuando:

- **Trigger 1:** El usuario menciona codigos, cifrados, mensajes secretos, o palabras como "morse", "banderas", "semaforo", "torres", "codigo"
- **Trigger 2:** Necesitas que los jugadores descifren informacion usando un sistema de codificacion predefinido
- **Trigger 3:** Quieres separar a los jugadores en grupos con informacion complementaria que deben comunicarse para resolver el puzzle
- **Trigger 4:** El tema del juego involucra espionaje, comunicacion militar, historia naval, telecomunicaciones o supervivencia
- **Trigger 5:** Requieres que los jugadores interpreten senales visuales o auditivas no convencionales

**Ejemplos de prompts que activan este skill:**
- "Quiero una prueba de codigo morse donde los jugadores tengan que descifrar un mensaje"
- "Necesito que unos jugadores vean banderas y otros tengan el diccionario para traducir"
- "Como puedo hacer que dos equipos separados se comuniquen para resolver un puzzle"
- "Quiero usar el codigo de semaforo en una prueba de espias"
- "Necesito una prueba de torres de agua/banderas maritimas"

---

## Cuando NO Usarlo (Anti-Patrones)

**NO uses este skill cuando:**

### Anti-Patron 1: Para publico muy joven (< 8 anos)
- **Por que falla:** Los ninos pequenos no tienen la paciencia ni capacidad cognitiva para mapear simbolos a letras y luego formar palabras
- **Mejor alternativa:** Usar `prueba-figuras-colores` o `prueba-asociacion-simple`

### Anti-Patron 2: Si el espacio es muy ruidoso
- **Por que falla:** Los codigos auditivos (morse por sonido) se vuelven imposibles de distinguir
- **Mejor alternativa:** Usar `prueba-cifrado-visual` con simbolos escritos o `prueba-puzzle-mecanico`

### Anti-Patron 3: Si la solucion debe ser ambigua o interpretativa
- **Por que falla:** Los sistemas de codigo son deterministicos; no admiten interpretacion subjetiva
- **Mejor alternativa:** Usar `prueba-interpretacion` o `prueba-logica-deduccion`

### Anti-Patron 4: Para mensajes muy largos (> 20 caracteres)
- **Por que falla:** El descifrado manual caracter por caracter es tedioso y frustra
- **Mejor alternativa:** Dividir en mensajes cortos o usar `prueba-busqueda-objetos` para revelar partes

**Regla general:** Si el descifrado requiere mas de 5 minutos de transcripcion manual, simplifica el mensaje o cambia el tipo de prueba.

---

## Variables de Diseno

### Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `tipo_codigo` | string | ["morse", "banderas_nauticas", "semaforo", "torres_agua", "braille", "codigo_cesar", "lenguaje_signos", "alfabeto_fonetico", "personalizado"] | "morse" | Sistema de codificacion a usar |
| `longitud_mensaje` | number | 4-20 | 8 | Cantidad de caracteres del mensaje a descifrar |
| `separacion_equipos` | boolean | true/false | false | Si los jugadores estan fisicamente separados con informacion complementaria |
| `modalidad_comunicacion` | string | ["visual", "auditiva", "tactil", "mixta"] | "visual" | Como se transmite el mensaje |
| `diccionario_proporcionado` | boolean | true/false | true | Si se da el diccionario/codigo o deben deducirlo |

### Variables Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `tiempo_limite` | number | Segundos para recibir/transmitir el mensaje (para modalidad cronometrada) |
| `intentos_maximos` | number | Cantidad de intentos permitidos para acertar el mensaje |
| `pistas_diccionario` | number | Cantidad de letras ya descifradas en el diccionario (0 = ninguna, 26 = todas) |
| `requiere_transmision` | boolean | Si los jugadores deben NO SOLO descifrar sino tambien transmitir un mensaje nuevo |

### Combinaciones Validas

- **Configuracion Basica:** `tipo_codigo="morse"`, `longitud_mensaje=6`, `separacion_equipos=false`, `diccionario_proporcionado=true`
- **Configuracion Cooperativa:** `tipo_codigo="banderas_nauticas"`, `separacion_equipos=true`, `modalidad="visual"`
- **Configuracion Dificil:** `tipo_codigo="personalizado"`, `longitud_mensaje=12`, `diccionario_proporcionado=false`, `pistas_diccionario=5`

### Combinaciones Prohibidas/Peligrosas

- **NO combines** `separacion_equipos=true` con `modalidad="tactil"` (imposible comunicar a distancia)
- **NO combines** `diccionario_proporcionado=false` con `tipo_codigo="personalizado"` y `longitud_mensaje>8` (imposible deducir)
- **WARN:** Cuidado con `longitud_mensaje > 15` si hay `separacion_equipos=true` (comunicacion propensa a errores)
- **WARN:** Evita `modalidad="auditiva"` en espacios con eco o ruido ambiental

---

## Errores Comunes de Jugadores

### Error 1: Confusion similares (Morse: E vs T, Banderas: simbolos parecidos)
- **Sintoma:** Descifran algunas letras correctas pero otras las confunden (ej: E=· y T=- en morse)
- **Causa:** Simbolos con diferencias sutiles en el sistema de codigo
- **Prevencion:** Incluir ejemplos claros de los simbolos mas confundibles en el diccionario
- **Intervencion:** Pista: "Revisa la segunda letra, hay dos simbolos muy parecidos en ese codigo"

### Error 2: Errores de transcripcion en separacion
- **Sintoma:** Equipo A ve el mensaje, lo comunica al Equipo B, pero B descifra algo diferente
- **Causa:** Errores humanos al comunicar (telefono roto), especialmente con codigos complejos
- **Prevencion:** Permitir que el equipo receptor vea el mensaje original, no solo escucharlo; o dar metodos de verificacion
- **Intervencion:** Sugerir que vuelvan a revisar el mensaje original juntos o usen un sistema de confirmacion

### Error 3: Interpretacion creativa del codigo
- **Sintoma:** Inventan su propia interpretacion del codigo en lugar de seguir el diccionario
- **Causa:** No entienden que el codigo es sistematico y deterministico
- **Prevencion:** Incluir un ejemplo completo "A = [simbolo]" resuelto en el diccionario
- **Intervencion:** Pista: "El codigo es exacto, no interpretativo. Usa el diccionario literalmente."

### Error 4: Sobrepensar cuando el diccionario es obvio
- **Sintoma:** Buscan patrones ocultos o cifrados adicionales cuando el mensaje es literal
- **Causa:** Expectativa de que debe haber un nivel extra de complejidad
- **Prevencion:** Incluir instruccion clara: "El mensaje descifrado ES la solucion, no requiere pasos adicionales"
- **Intervencion:** "Confien en lo que ven, no hay truco adicional"

**Senales de alarma (el jugador esta atascado):**
- Han intentado 3+ combinaciones sin exito
- Estan discutiendo entre ellos sobre "lo que vieron" vs "lo que creen que vieron"
- Han abandonado el diccionario y estan intentando adivinar sin usar el sistema
- Un equipo separado esta enviando mensajes pero el otro no los esta recibiendo/procesando

**Tiempo maximo recomendado antes de intervenir:** 8 minutos (10 minutos si hay separacion de equipos)

---

## Escalado de Dificultad

### Version Facil (Nivel 1-3)
- **Caracteristicas:**
  - Mensaje corto: 4-6 caracteres (ej: "SOS", "AYUDA")
  - Diccionario completo y claro proporcionado
  - Todos los jugadores juntos (sin separacion)
  - Codigo estandar y conocido (morse, braille)
  - Ejemplo de decodificacion incluido
- **Tiempo estimado:** 5-8 minutos
- **Publico objetivo:** Ninos 8-12 anos, grupos novatos

### Version Estandar (Nivel 4-6)
- **Caracteristicas:**
  - Mensaje de 6-10 caracteres
  - Diccionario proporcionado pero sin ejemplos resueltos
  - Posible separacion en 2 equipos con informacion complementaria
  - Codigo estandar (morse, banderas, semaforo)
- **Tiempo estimado:** 10-15 minutos
- **Publico objetivo:** Publico general, adultos, familias mixtas

### Version Dificil (Nivel 7-9)
- **Caracteristicas:**
  - Mensaje de 10-15 caracteres
  - Diccionario parcial (algunas letras faltan, deben deducirlas)
  - Separacion de equipos obligatoria con comunicacion limitada
  - Codigo menos comun (torres de agua, alfabeto fonetico, lenguaje de signos)
  - Puede requerir transmitir Y recibir mensajes
- **Tiempo estimado:** 15-25 minutos
- **Publico objetivo:** Entusiastas, equipos experimentados

### Version Extrema (Nivel 10)
- **Caracteristicas:**
  - Mensaje largo: 15-20 caracteres o multiple mensajes
  - Sin diccionario: deben crearlo a partir de pistas
  - 3+ equipos separados con informacion fragmentada
  - Combinacion de multiples codigos (ej: morse cifrado con Cesar)
  - Elementos distractores o mensajes falsos incluidos
- **Tiempo estimado:** 25-40 minutos
- **Publico objetivo:** Competencias, expertos, speedruns avanzados

**Matriz de escalado:**

| Aspecto | Facil | Estandar | Dificil | Extrema |
|---------|-------|----------|---------|---------|
| Longitud mensaje | 4-6 | 6-10 | 10-15 | 15-20+ |
| Separacion equipos | No | Opcional | Si | Multiple |
| Diccionario | Completo | Completo | Parcial | Ausente |
| Complejidad codigo | Estandar | Estandar | Menos comun | Multiple |
| Intentos permitidos | Infinitos | 5 | 3 | 2 |

---

## Adaptaciones

### Por Edad

**Ninos (8-12 anos):**
- Simplificar: Usar codigos muy conocidos (morse con audio lento, braille tactil)
- Evitar: Separacion de equipos (frustracion alta), codigos abstractos
- Anadir: Elementos visuales atractivos (colores en banderas, sonidos claros)
- Mensajes: Palabras conocidas relacionadas con el tema

**Adolescentes (13-17 anos):**
- Mantener: Codigos estandar con desafio moderado
- Permitir: Separacion en 2 equipos, mensajes de 8-12 caracteres
- Agregar: Narrativa de espionaje o supervivencia que justifique el codigo

**Adultos (18+):**
- Complejidad completa: Separacion, deduccion de diccionarios, codigos multiples
- Considerar: Elementos historicos autenticos (codigos navales reales, metodos militares)

**Grupos mixtos:**
- Estrategia: Asignar roles (los adultos decodifican, los ninos transmiten/reciben)
- Elementos cooperativos: Todos deben participar en la comunicacion

### Por Espacio

**Hall Escape (sala fisica):**
- Ventajas: Paredes separan equipos, luces/altavoces para codigos, objetos fisicos con codigos
- Limitaciones: Acustica, espacio limitado para separacion real
- Adaptaciones: Usar paredes divisibles, auriculares para comunicacion, ventanas de observacion
- Ejemplos: Un equipo en una habitacion ve banderas por ventana, otro tiene diccionario

**Street Escape (exterior/movil):**
- Ventajas: Grandes distancias para separacion real, uso de senales reales (faro, banderas)
- Limitaciones: Ruido ambiental, viento afecta banderas, dependencia del clima
- Adaptaciones: Usar telefonos para comunicacion entre equipos distantes, elegir zonas tranquilas
- Ejemplos: Un equipo en edificio A observa torre de agua, equipo en edificio B tiene diccionario

**Juego de Investigacion (no presencial):**
- Ventajas: Uso de video/audio digital, transmision a distancia real
- Limitaciones: Sin tacto, dependencia de tecnologia
- Adaptaciones: Videos con codigo morse, imagenes de banderas, audios de semaforo
- Ejemplos: Recibir video de alguien haciendo senales, descifrar con diccionario PDF

**Digital/Virtual:**
- Ventajas: Automatizacion de validacion, temporizadores, animaciones de codigos
- Limitaciones: Sin componente fisico, sensacion menos inmersiva
- Adaptaciones: Simuladores de codigo, reconocimiento de patrones dibujados
- Ejemplos: App donde dibujan morse y el sistema lo interpreta, juego de banderas virtual

### Por Duracion

**Quick (5-10 minutos):**
- Elementos a eliminar: Separacion de equipos, deduccion de codigo, mensajes largos
- Foco: Descifrado rapido con diccionario completo, mensaje corto
- Ejemplo: Mensaje de 5 letras en morse visual, todos juntos

**Standard (15-30 minutos):**
- Version completa: Separacion opcional, mensaje de 8-10 caracteres
- Puede incluir: Elemento de comunicacion bidireccional

**Epic (45+ minutos):**
- Elementos a anadir: Multiple mensajes, deduccion de diccionario, varios codigos
- Sub-etapas: 
  1. Encontrar el diccionario
  2. Recibir mensaje cifrado
  3. Descifrar mensaje
  4. Enviar respuesta cifrada

---

## Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-busqueda-objetos`**
- **Sinergia:** El diccionario o parte del mensaje esta oculto en objetos que deben encontrar primero
- **Ejemplo compuesto:** Encuentran una linterna (para hacer morse) y un papel con diccionario en cajones separados
- **Frecuencia:** Muy comun

**2. `prueba-punteria-derribo`**
- **Sinergia:** Al derribar objetos revelan letras o partes del diccionario/mensaje
- **Ejemplo compuesto:** Derriban latas numeradas que coinciden con el orden del mensaje morse
- **Frecuencia:** Comun

**3. `prueba-logica-secuencial`**
- **Sinergia:** El mensaje descifrado es una secuencia que deben aplicar en otro puzzle
- **Ejemplo compuesto:** Descifran "3-1-4" que indica el orden de botones a presionar
- **Frecuencia:** Muy comun

**4. `prueba-panel-electrico`**
- **Sinergia:** El mensaje descifrado indica que cables conectar o interruptores a activar
- **Ejemplo compuesto:** "ROJO-AZUL" descifrado del morse indica conexiones del panel
- **Frecuencia:** Comun

**5. `prueba-tablet-cooperativo`**
- **Sinergia:** Usan tablets para transmitir/recibir mensajes entre equipos separados
- **Ejemplo compuesto:** Uno dibuja banderas en tablet, otro recibe y descifra
- **Frecuencia:** Ocasional

### Skills Alternativos (Sustitucion)

**En lugar de este skill, considera:**

- **`prueba-interpretacion-texto`** → Si el mensaje requiere interpretar metaforas o pistas literarias, no decodificacion sistematica
- **`prueba-rompecabezas-visual`** → Si se trata de reconocer patrones o formas sin un sistema de codigo
- **`prueba-asociacion-conceptual`** → Si los jugadores deben hacer conexiones abstractas, no mapeo simbolo-letra

### Skills Incompatibles (No Usar Juntos)

**Evita combinar con:**

- **`prueba-memorizacion-pura`** → Conflicto: Los codigos requieren referencia constante al diccionario, no memorizacion
- **`prueba-ritmo-coordinacion`** → Conflicto: A menos que sea el objetivo especifico, el ritmo dificulta la precision del codigo

### Ejemplos de Pruebas Compuestas

**Ejemplo 1: Comunicacion Naval (Torre-Banderas)**
- **Skills usados:** `prueba-comunicacion-mensajes` + `prueba-busqueda-objetos` + `prueba-punteria-derribo`
- **Descripcion:** Los jugadores derriban objetos para revelar banderas nauticas (punteria). El diccionario esta escondido en un cofre (busqueda). Deben descifrar el mensaje de la torre de agua visible desde la ventana (comunicacion).
- **Por que funciona:** Combina habilidades fisicas (punteria), exploracion (busqueda) y mental (descifrado)

**Ejemplo 2: Espias Separados (Morse-Binario)**
- **Skills usados:** `prueba-comunicacion-mensajes` (x2) + `prueba-logica-secuencial`
- **Descripcion:** Equipo A recibe morse auditivo y debe transmitirlo al Equipo B. Equipo B tiene diccionario morse y descifra a binario. El binario activa un panel en secuencia especifica.
- **Por que funciona:** Cada equipo depende del otro, creando tension cooperativa real

**Ejemplo 3: Faro del Fin del Mundo**
- **Skills usados:** `prueba-comunicacion-mensajes` + `prueba-panel-electrico` + `prueba-tablet-cooperativo`
- **Descripcion:** Usando tablets, un equipo controla luces en el techo (faro) haciendo morse. Otro equipo desde otra sala ve las luces por camara y descifra. El mensaje indica como cablear el panel para escapar.
- **Por que funciona:** Fusion de tecnologia digital con mecanica fisica y codigo clasico

---

## Ejemplos Concretos

### Ejemplo 1: Codigo Morse - Operacion Rescate

**Contexto:** Escape de espias. Los jugadores deben contactar con el cuartel general enviando su ubicacion.

**Configuracion:**
```json
{
  "tipo_codigo": "morse",
  "longitud_mensaje": 8,
  "separacion_equipos": false,
  "modalidad_comunicacion": "auditiva",
  "diccionario_proporcionado": true,
  "requiere_transmision": true
}
```

**Flujo de juego:**
1. Encuentran un diccionario morse y una linterna con interruptor
2. Escuchan un mensaje en morse desde un radio (ej: "... --- ..." = SOS)
3. Usando el diccionario, descifran que dice "SALA-317"
4. Deben usar la linterna para transmitir "OK" de vuelta (. - - - - .)
5. Al transmitir correctamente, se abre una puerta

**Solucion:** Descifrar "SALA-317" y transmitir confirmacion en morse

**Pistas progresivas:**
- Pista 1: "El codigo usa puntos y rayas, cada combinacion es una letra"
- Pista 2: "Los espacios largos separan palabras, los cortos separan letras"
- Pista 3: "S es tres puntos (...), O es tres rayas (---)"

---

### Ejemplo 2: Banderas Nauticas - Equipos Separados

**Contexto:** Street escape de supervivencia maritima. Dos equipos en embarcaciones diferentes deben comunicarse.

**Configuracion:**
```json
{
  "tipo_codigo": "banderas_nauticas",
  "longitud_mensaje": 10,
  "separacion_equipos": true,
  "modalidad_comunicacion": "visual",
  "diccionario_proporcionado": true,
  "requiere_transmision": false
}
```

**Flujo de juego:**
1. Equipo A esta en terraza con binoculares, ve al Equipo B levantando banderas
2. Equipo B tiene el set de banderas y un mensaje escrito
3. Equipo A tiene el diccionario de banderas (libro)
4. Equipo B levanta banderas una por una (ej: A-N-C-L-A-V-E)
5. Equipo A las identifica con binoculares, consulta diccionario, escribe "ANCLAJE-NORTE"
6. El mensaje indica donde encontrar el siguiente objetivo

**Solucion:** Comunicar y descifrar "ANCLAJE-NORTE" (10 caracteres)

**Pistas progresivas:**
- Pista 1: "Cada bandera representa una letra o numero"
- Pista 2: "Usen los binoculares, algunas banderas tienen detalles pequenos"
- Pista 3: "El mensaje tiene dos palabras: algo que se echa al mar y una direccion"

---

### Ejemplo 3: Semaforo - Granja de Inteligencia

**Contexto:** Hall escape ambientado en campo de entrenamiento militar. Deben interceptar un mensaje enemigo.

**Configuracion:**
```json
{
  "tipo_codigo": "semaforo",
  "longitud_mensaje": 6,
  "separacion_equipos": false,
  "modalidad_comunicacion": "visual",
  "diccionario_proporcionado": true,
  "pistas_diccionario": 6
}
```

**Flujo de juego:**
1. En una pantalla ven un video de alguien haciendo senales con dos banderas (semaforo)
2. Tienen un poster con el diccionario, pero solo 6 letras estan visibles (A, E, I, O, S, T)
3. El mensaje solo usa esas letras: "ESTOES"
4. Deben interpretar las posiciones de las banderas en el video
5. Descifran "ESTOES" pero falta completar... encuentran mas partes del diccionario
6. Mensaje completo: "ESTOES-CLAVE" (8 caracteres con guion)

**Solucion:** Descifrar el mensaje semaforo usando las letras disponibles

---

### Ejemplo 4: Deduccion de Codigo - Arqueologos

**Contexto:** Investigacion en ruinas antiguas. Un codigo desconocido debe descifrarse sin diccionario.

**Configuracion:**
```json
{
  "tipo_codigo": "personalizado",
  "longitud_mensaje": 8,
  "separacion_equipos": false,
  "modalidad_comunicacion": "visual",
  "diccionario_proporcionado": false,
  "pistas_diccionario": 3
}
```

**Flujo de juego:**
1. Encuentran una pared con simbolos grabados y un mensaje: "▲▼■▲ ■▼▲■"
2. Tambien encuentran 3 pistas:
   - "▲ = A" (en una tabla parcial)
   - Una estatua con la palabra "DIOS" y simbolos "▼■▲▲" debajo
   - Un mapa con coordenadas donde ▲=1, ▼=4, ■=9 (patron: cuadrados 1,4,9...)
3. Deducen que es un sistema geometrico: ▲=A, ▼=I, ■=O (por posicion en DIOS)
4. Descifran el mensaje: "AIOA-OIAA"
5. Espera, eso no tiene sentido... revisan y ven que tambien puede ser: "DIOS-SALV"
6. Usando contexto religioso completan: "DIOS-SALVA"

**Solucion:** Deducir el sistema y descifrar "DIOS-SALVA" (9 caracteres)

**Pistas progresivas:**
- Pista 1: "Los simbolos representan letras, usen las pistas para mapearlos"
- Pista 2: "La estatua dice DIOS y tiene los simbolos debajo... que letra es cada simbolo?"
- Pista 3: "El mensaje completo es una frase religiosa conocida"

---

## Notas de Implementacion

### Para el Agente Usuario

**Antes de usar este skill:**
1. Verificar que los triggers de "Cuando Usar" aplican (codigos, cifrado, comunicacion)
2. Confirmar que no caes en ningun "Anti-Patron" (espacio ruidoso, publico muy joven)
3. Seleccionar nivel de dificultad apropiado segun la tabla de escalado
4. Revisar adaptaciones necesarias para el contexto (edad, espacio, duracion)
5. Verificar disponibilidad del sistema de codigo elegido (material de banderas, linterna, etc.)

**Mientras usas este skill:**
1. Configurar variables segun la tabla (tipo_codigo, longitud, separacion)
2. Preparar el diccionario FISICO - es crucial que los jugadores puedan consultarlo facilmente
3. Si hay separacion, preparar el metodo de comunicacion (walkie-talkies, gestos, etc.)
4. Prever errores comunes y tener pistas listas
5. Documentar la solucion valida y posibles variaciones aceptables
6. Testear la legibilidad del codigo (morse visible?, banderas distinguibles?)

**Despues de crear la prueba:**
1. Validar que sigue el patron del skill (diccionario + mensaje = solucion)
2. Testear con usuarios: verificar que pueden ver/oir el codigo claramente
3. Verificar que el mensaje descifrado tiene sentido y lleva a la siguiente prueba
4. Si hay separacion, probar la comunicacion entre equipos
5. Documentar lecciones aprendidas sobre dificultad y tiempo real

### Checklist de Preparacion

- [ ] Diccionario impreso/grabado y visible para todos los jugadores
- [ ] Mensaje cifrado preparado y verificado (sin errores)
- [ ] Sistema de transmision probado (linterna funciona, banderas visibles, audio claro)
- [ ] Si hay separacion: metodo de comunicacion entre equipos establecido
- [ ] Pistas preparadas para cada punto de atasco comun
- [ ] Solucion alternativa/override para el game master si todo falla
- [ ] Temporizador o indicador de cuando intervenir con pistas

### Consejos de Facilitacion (para Game Master)

**Durante la prueba:**
- Observa si estan usando el diccionario correctamente (no adivinando)
- En separacion, asegurate que ambos equipos estan comunicando (no atascados en silencio)
- Si el audio/morse es muy dificil, ofrece repeticiones lentas
- Manten el diccionario disponible y visible (no dejes que lo pierdan)
- Si descifran mal pero tienen logica, considera si la respuesta cercana cuenta

**Senales de que debes intervenir:**
- 8+ minutos sin progreso visible
- Discusiones frustradas sobre "lo que vieron"
- Abandono del diccionario (estan adivinando)
- En separacion: un equipo no sabe que hacer mientras el otro espera

---

## Changelog

- **v1.0** (2026-02-13): Creacion inicial del skill para pruebas de comunicacion y descifrado de mensajes
  - Incluye codigos: morse, banderas nauticas, semaforo, torres, braille, cesar, signos, fonetico
  - Soporta configuracion con/sin separacion de equipos
  - Documentados 4 ejemplos concretos de dificultad variada
  - Matriz de escalado y adaptaciones por edad/espacio/duracion

---

**Score de evaluacion:** 9/10 (Alta cantidad de pruebas candidatas, reglas claras, reutilizable en multiples contextos)  
**Frecuencia de uso esperada:** Alta  
**Dependencias:** Ninguna
