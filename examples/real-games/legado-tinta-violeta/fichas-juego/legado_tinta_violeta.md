# El Legado en Tinta Violeta
## Versión 2.0 - Edición Mejorada

## Configuración

| Parámetro | Valor |
|-----------|-------|
| **Tipo** | Hall escape + Investigación |
| **Temática** | Escritoras palentinas |
| **Duración** | 50 minutos |
| **Jugadores** | 5 por grupo (2 grupos simultáneos) |
| **Dificultad** | 4/10 |
| **Espacio** | 3 plantas, 6 espacios |
| **Objetivo** | Encontrar el manuscrito perdido y escapar |

---

## 🆕 NOVEDADES VERSIÓN 2.0

### Materiales Reales y Táctiles
- ✅ Candados físicos reales (no solo códigos en papel)
- ✅ Linterna UV para revelar mensajes ocultos
- ✅ Objetos manipulables (llaves, cartas con sellos de cera)
- ✅ Caja fuerte mecánica real

### Cooperación Obligatoria
- ✅ Cada prueba requiere mínimo 2 jugadores cooperando
- ✅ Roles asignados (lector/observador, manipulador, cronometrador)
- ✅ Elementos que necesitan 2+ personas para resolverse

### Misterio Secundario: "El Intruso"
- ✅ Pistas de que alguien más busca el manuscrito
- ✅ Notas alteradas, huellas, objetos movidos
- ✅ Revelación final: ¿quién es el intruso?

### Desenlace Mejorado
- ✅ Sorpresa final al abrir la caja
- ✅ Certificado de "Investigador Literario"
- ✅ Foto con el manuscrito

---

## Narrativa

### Introducción

> *"Hace más de un siglo, en las tierras de Palencia, varias mujeres dejaron su huella con la pluma. Escribieron en secreto, publicaron bajo seudónimo, o simplemente guardaron sus palabras en cajones que nunca vieron la luz. Una de ellas —a la que llamamos 'la dama de tinta violeta'— escondió su obra más preciada en este edificio. Dicen que contiene secretos que podrían cambiar la historia de la literatura española."*

Los jugadores son un equipo de investigadores literarios que han descubierto una pista sobre el paradero del manuscrito perdido. Han conseguido acceso al edificio histórico donde se cree que está escondido.

### Conflicto

> *"El edificio cierra en exactamente 50 minutos para una restauración que durará meses. Si no encuentran el manuscrito antes, desaparecerá para siempre tras los andamios."*

### 🆕 Misterio Secundario: El Intruso

A lo largo del juego, los jugadores encuentran pistas de que **otra persona** ha estado buscando el mismo tesoro:
- Huellas frescas en el polvo
- Notas con letra diferente a las de las escritoras
- Un objeto movido de lugar
- Una puerta que estaba abierta cuando debería estar cerrada

**Revelación final:** El intruso es el guardián del edificio, descendiente de una de las escritoras, que ha estado protegiendo el manuscrito en secreto.

### Objetivo Principal
Encontrar el manuscrito de "la dama de tinta violeta" y escapar del edificio antes de que cierre.

### Objetivo Secundario (Bonus)
Descubrir quién es el intruso y convencerle de que el manuscrito debe ser compartido con el mundo.

### Conclusión

> *"Al abrir la caja fuerte, encuentran el manuscrito. Pero también hay una carta del guardián: 'Lo habéis encontrado. Mi familia lo protegió por generaciones. Ahora es vuestro turno de compartirlo con el mundo.' Junto al manuscrito, un certificado en blanco: 'Investigador Literario - La Sociedad de la Tinta Violeta os reconoce como miembros honorarios.'"*

---

## Distribución del Espacio

```
┌─────────────────────────────────────┐
│      SEGUNDA PLANTA (Climax)        │
│  ┌─────────────┐  ┌───────────────┐  │
│  │  Despacho   │  │ Sala Tesoro   │  │
│  │  Privado    │  │  (Final)      │  │
│  │  Prueba 5   │  │  Prueba 6     │  │
│  └─────────────┘  └───────────────┘  │
├─────────────────────────────────────┤
│      PRIMERA PLANTA (Desarrollo)    │
│  ┌─────────────┐  ┌───────────────┐  │
│  │ Biblioteca  │  │Sala Trabajo   │  │
│  │  Prueba 3   │  │  Prueba 4     │  │
│  └─────────────┘  └───────────────┘  │
├─────────────────────────────────────┤
│      PLANTA BAJA (Introducción)     │
│  ┌─────────────┐  ┌───────────────┐  │
│  │ Recepción   │  │Sala Intro     │  │
│  │  Prueba 1   │  │  Prueba 2     │  │
│  └─────────────┘  └───────────────┘  │
└─────────────────────────────────────┘
```

---

## Flujo de Pruebas (MEJORADAS)

### Prueba 1: El Mural de las Escritoras (Recepción)
- **Skill:** `prueba-exploracion-visual`
- **Dificultad:** 2/10
- **Duración:** ~5-7 min
- **Archivo:** `prueba_mural_escritoras_001.json`
- **Código/Recompensa:** Primer dígito del código final (3)
- **Desbloquea:** Acceso a Sala de Introducción

**🆕 Elemento cooperativo:**
- El mural está dividido en 3 secciones. Cada jugador debe explorar una sección y reportar lo que encuentra.
- Un jugador no puede ver todas las secciones desde un punto.

**🆕 Mecanismo real:**
- Los nombres en violeta solo se ven con la **linterna UV**.
- Un jugador sostiene la linterna, otro marca los nombres encontrados.

**🆕 Pista del Intruso:**
- Hay una huella fresca en el polvo debajo del mural.

---

### Prueba 2: Autoras y Obras (Sala de Introducción)
- **Skill:** `prueba-emparejamiento-memoria`
- **Dificultad:** 3/10
- **Duración:** ~8-10 min
- **Archivo:** `prueba_autoras_obras_001.json`
- **Código/Recompensa:** Segundo dígito del código final (7)
- **Desbloquea:** Acceso a Primera Planta

**🆕 Elemento cooperativo:**
- Las tarjetas están repartidas en 2 mesas separadas.
- Jugadores deben comunicarse para encontrar las parejas.
- Una mesa tiene autoras, otra tiene obras.

**🆕 Mecanismo real:**
- Cuando se forma una pareja correcta, las tarjetas encajan físicamente (tipo puzzle).
- Candado de 3 dígitos en la puerta de escalera. Código: 347 (del número de parejas: 6 parejas → 6-2+3=7, más ajuste temático).

**🆕 Pista del Intruso:**
- Una de las tarjetas tiene una nota pegada detrás con letra moderna: "Casi lo tengo."

---

### Prueba 3: Las Cartas Secretas (Biblioteca)
- **Skill:** `prueba-investigacion-texto`
- **Dificultad:** 4/10
- **Duración:** ~8-10 min
- **Archivo:** `prueba_cartas_secretas_001.json`
- **Código/Recompensa:** Tercer dígito del código final (2)
- **Desbloquea:** Acceso a Sala de Trabajo

**🆕 Elemento cooperativo:**
- Las 5 cartas están escondidas en diferentes lugares de la biblioteca.
- Cada jugador busca en una zona. Deben reportar qué encontraron.
- Las fechas solo se ven con **lupa compartida**.

**🆕 Mecanismo real:**
- Las cartas tienen sellos de cera que deben romperse (satisfactorio).
- Las letras violeta solo se ven con **linterna UV**.
- Candado de letra en la puerta interior. Código: D (primera letra de la primera carta).

**🆕 Pista del Intruso:**
- Un sobre está abierto, pero el sello de cera está roto recientemente (cera fresca).

---

### Prueba 4: El Acróstico Violeta (Sala de Trabajo)
- **Skill:** `prueba-acrostico-ubicacion`
- **Dificultad:** 4/10
- **Duración:** ~8-10 min
- **Archivo:** `prueba_acrostico_violeta_001.json`
- **Código/Recompensa:** Cuarto dígrito del código final (9)
- **Desbloquea:** Acceso a Segunda Planta

**🆕 Elemento cooperativo:**
- Los 6 marcos están distribuidos en las 4 paredes.
- Un jugador no puede ver todos desde un punto.
- Deben leer en orden y reportar las primeras letras.

**🆕 Mecanismo real:**
- Las letras violeta solo se ven con **linterna UV**.
- Candado de clave en puerta de escalera. Código: NUEVE (o 9 si es numérico).

**🆕 Pista del Intruso:**
- Uno de los marcos está ligeramente torcido, como si alguien lo hubiera movido recientemente.

---

### Prueba 5: La Línea Temporal (Despacho Privado)
- **Skill:** `prueba-logica-secuencial`
- **Dificultad:** 5/10
- **Duración:** ~8-10 min
- **Archivo:** `prueba_linea_temporal_001.json`
- **Código/Recompensa:** Quinto dígito del código final (1)
- **Desbloquea:** Acceso a Sala del Tesoro

**🆕 Elemento cooperativo:**
- Las tarjetas de eventos están en un baúl cerrado con **2 candados**.
- Dos jugadores deben abrir los candados simultáneamente.
- Luego, cada jugador ordena 2-3 eventos y comparan.

**🆕 Mecanismo real:**
- Los candados tienen códigos obtenidos en pruebas anteriores.
- Línea temporal física con pinzas para colgar eventos.
- Candado final de 4 dígitos para la puerta del tesoro. Código parcial de esta prueba.

**🆕 Pista del Intruso:**
- Hay una foto antigua del edificio con una nota moderna: "Abuela, lo siento. Tengo que encontrarlo antes que ellos."

---

### Prueba 6: La Caja de Tinta Violeta (Sala del Tesoro) - FINAL
- **Skill:** `prueba-mecanismo`
- **Dificultad:** 5/10
- **Duración:** ~5-7 min
- **Archivo:** `prueba_caja_violeta_001.json`
- **Código final:** 37291
- **Desbloquea:** MANUSCRITO ENCONTRADO → VICTORIA

**🆕 Elemento cooperativo:**
- La caja fuerte requiere **2 personas** para abrirse (una gira los diales, otra confirma números).
- Un jugador no puede ver el dial y el indicador de apertura simultáneamente.

**🆕 Mecanismo real:**
- Caja fuerte mecánica real de 5 diales.
- Al abrirse, luz interior se enciende automáticamente.

**🆕 Sorpresa final:**
1. Manuscrito encontrado
2. Carta del Guardián (descendente de escritora)
3. **Certificados en blanco** para cada jugador: "La Sociedad de la Tinta Violeta os nombra Investigadores Literarios Honorarios"
4. **Sello de cera violeta** para certificar los certificados
5. Foto grupal con el manuscrito (opcional, el GM hace la foto)

**🆕 Revelación del Intruso:**
- La carta del Guardián explica que él es el intruso, pero que al ver su dedicación, decide confiarles el manuscrito.

---

## Pistas Globales (Game Master)

### Nivel 1 (sutil)
1. "Observad bien los detalles de cada sala, todo está conectado"
2. "Las escritoras palentinas eran mujeres de su tiempo, con secretos que guardar"
3. "El color violeta aparece donde menos lo esperáis... y la linterna UV os ayudará"

### Nivel 2 (directa)
1. "El mural de la recepción tiene nombres escondidos entre las decoraciones. Usad la linterna."
2. "Cada prueba os da un número. Necesitaréis los cinco para la caja final."
3. "Las fechas son importantes: la escritora más antigua primero"

### Nivel 3 (reveladora)
1. "Buscad las letras que destacan en violeta en cada documento. La linterna UV las revela."
2. "El código final es: 3-7-2-9-1"
3. "Hay alguien más en el edificio. Prestad atención a las pistas del intruso."

---

## 🆕 Kit de Materiales Reales

### Para cada grupo:
- [ ] **Linterna UV** (1 por grupo)
- [ ] **Lupa de bolsillo** (1 por grupo)
- [ ] **Walkie-talkie** (para comunicación con GM)

### Candados físicos:
- [ ] 2x Candado de 3 dígitos (Prueba 2)
- [ ] 1x Candado de letra (Prueba 3)
- [ ] 1x Candado de clave/palabra (Prueba 4)
- [ ] 2x Candado de 4 dígitos (Prueba 5)
- [ ] 1x Caja fuerte de 5 diales (Prueba 6)

### Props temáticos:
- [ ] Cartas con sellos de cera (5 por grupo)
- [ ] Tarjetas autoras/obras en cartón resistente (12 por grupo)
- [ ] Marcos con fragmentos (6 por grupo)
- [ ] Tarjetas de eventos para línea temporal (8 por grupo)
- [ ] Manuscrito prop (cuero viejo, páginas envejecidas)
- [ ] Certificados en blanco (5 por grupo)
- [ ] Sello de cera violeta + vela

### Pistas del Intruso:
- [ ] Huella en polvo (harina/cocoa)
- [ ] Nota moderna pegada en tarjeta
- [ ] Foto antigua con nota moderna
- [ ] Sello de cera roto fresco

---

## 🆕 Roles Sugeridos para Jugadores

| Rol | Responsabilidad | Ideal para |
|-----|-----------------|------------|
| **Lector/Investigador** | Lee textos en voz alta, analiza | Jugador detallista |
| **Observador UV** | Maneja linterna, busca pistas ocultas | Jugador visual |
| **Manipulador** | Abre candados, maneja props | Jugador hábil con manos |
| **Cronometrador** | Vigila tiempo, organiza equipo | Jugador organizado |
| **Comunicador** | Habla con GM, reporta progreso | Jugador extrovertido |

*Nota: Los roles pueden rotar entre pruebas.*

---

## Adaptaciones

### Por edad
- **12-14 años:** Más pistas visuales, GM da el código de candados si se atascan >3 min
- **15-18 años:** Configuración estándar
- **Adultos:** Aumentar dificultad, eliminar pistas nivel 3

### Por número de jugadores
- **3-4 jugadores:** Un jugador cubre 2 roles
- **5 jugadores:** Configuración estándar (1 rol cada uno)
- **6-7 jugadores:** Añadir rol de "Archivista" (toma notas de pistas del intruso)

### Por tiempo
- **40 min:** Eliminar misterio del intruso, código de 4 dígitos
- **50 min:** Configuración estándar
- **60 min:** Añadir prueba bonus: "La carta final del Guardián" con código extra

---

## Notas para Game Master

### Preparación (antes de cada sesión)
1. Verificar que todas las linternas UV tienen batería
2. Comprobar que los candados tienen los códigos correctos
3. Colocar pistas del intruso en los lugares correctos
4. Preparar certificados y sello de cera para el final
5. Cargar cámara/móvil para foto grupal

### Durante el juego
1. **Control de flujo:** Si se atascan >5 min, dar pista nivel 1
2. **Atmósfera:** Música suave de fondo (piano clásico), iluminación tenue
3. **Gestión de 2 grupos:** Canales diferentes de walkie-talkie
4. **Código de emergencia:** 37291 (guardar en móvil, no visible)

### Desenlace
1. Cuando abran la caja, hacer **pausa dramática** (3 segundos)
2. Leer carta del Guardián en voz alta
3. Entregar certificados, invitar a sellarlos con cera violeta
4. Hacer foto grupal con manuscrito
5. Aplaudir y felicitar

---

## Escritoras Palentinas de Referencia

Para contextualizar el juego, estas son algunas escritoras reales de Palencia:

1. **Concha Espina** (1869-1955) - Aunque nacida en Santander, vivió en Palencia
2. **María Teresa León** (1903-1988) - Vinculada a la provincia
3. **Escritoras locales del siglo XIX-XX** - Para investigación específica

**Nota:** El juego usa nombres ficticios basados en estas referencias para mayor flexibilidad narrativa.

---

*Documento creado por Escapeitor | Fecha: 2026-03-16*
*Versión: 2.0 | Estado: Mejoras implementadas*
*Cambios: Materiales reales, cooperación, misterio secundario, desenlace mejorado*
