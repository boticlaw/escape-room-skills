# ESTILO-JUEGOS.md — Lecciones de Diseño

> **Extraído de:** El Legado en Tinta Violeta (v4.1)
> **Fecha:** Marzo 2026
> **Contexto:** Sesión de refactor intensivo — 5 pruebas modificadas en un día
>
> Este documento captura los patrones que nos gustan, las decisiones que tomamos, y los errores que corregimos. Es la referencia para diseñar futuros juegos.

---

## 🧭 Principios Fundamentales

### 1. Todo el equipo activo siempre

Cada jugador debe tener algo que hacer en cada momento. Si hay 5-6 personas, hay 5-6 roles implícitos.

**Ejemplos del Legado:**
- **Biblioteca:** Uno escucha audio, otros buscan palabras magnéticas, otro ordena en el tablero
- **Prensa:** Unos revisan portadas, otros fechan, otro ordena cronológicamente
- **Taller:** Unos abren la maleta, otros alinean acetatos, otro busca bajo la mesa
- **Noemí:** Grupo dentro de la pecera vs grupo fuera, se comunican por pizarras
- **Poesía:** Cada jugador explora una pared distinta con linterna UV
- **Viajes:** Parejas que ubican lugares en el mapa, otro suma

**Antipatrón:** Un jugador escucha audio 3 minutos mientras los demás esperan (dictado pasivo). Eliminado.

### 2. Físico > Digital

Preferimos que los jugadores toquen, muevan, superpongan, busquen. Lo digital es apoyo, no protagonista.

| Bien | Mal |
|------|-----|
| Palabras magnéticas que se tocan y ordenan | Tablet con quiz interactivo |
| Acetatos que se superponen sobre un plano | App con capas que se cambian tocando |
| Linternas UV que revelan texto oculto | Pantalla que muestra pistas |
| Mapa físico con marcadores | Google Maps en tablet |

**Excepción aceptada:** Audio corto (≤60s) para dar contexto narrativo o pistas clave.

### 3. El contenedor cuenta

La maleta del Taller no es solo una caja donde guardar cosas — es parte de la experiencia. Abrir una maleta vieja con plumas, papel y tintas genera inmersión antes incluso de empezar el puzzle.

**Regla:** Si un puzzle tiene varios componentes, encuéntrales un contenedor narrativo que tenga sentido (maleta, cofre, carpeta, sobre…).

### 4. Doble descubrimiento

Las mejores pruebas tienen dos capas de "¡aha!":
1. Resolver el puzzle principal (ordenar palabras, superponer acetatos…)
2. Descubrir que la solución revela algo más (letras en el reverso, palabra "Abajo", código oculto…)

**Ejemplos:**
- Biblioteca: Ordenar poemas → letras del reverso forman LEGADO
- Taller: Superponer acetatos → forma MESA + "Abajo" → buscar bajo la mesa
- Prensa: Ordenar portadas → reverso revela "AÑO 1952"

### 5. La temática no es decoración

Wyoming no tenía sentido en un juego sobre escritoras palentinas. Los Viajes de Tess con mapa de Palencia conecta con la realidad de las autoras. Las portadas de Noemí son sus libros reales. Los poemas de Casilda son su obra.

**Regla:** Cada prueba debe poder explicarse como "esta escritora hizo X en la vida real, y el puzzle refleja eso."

---

## 🎲 Patrones de Mecánicas que Nos Gustan

### Superposición (Taller)
Varias capas transparentes que al combinarse revelan información. Requiere cooperación física y precisión.

**Variantes posibles:** Acetatos sobre mapa, papel vegetal sobre dibujo, capas de plástico con rayas.

### Comunicación limitada (Noemí)
Dos grupos separados por una barrera física que pueden verse pero no oírse. Deben comunicarse por escrito.

**Variantes posibles:** Pecera, biombo, habitaciones separadas con videollamada sin audio.

### Búsqueda + ordenación (Prensa, Noemí)
Encontrar elementos entre distractores y luego ordenarlos según un criterio (cronológico, alfabético, tamaño…). El orden revela el código.

**Variantes posibles:** Fotografías por fecha, cartas por remitente, obras por año de publicación.

### Reverso oculto (Biblioteca)
Cada pieza del puzzle tiene información en el reverso que solo se lee al completar la ordenación correcta.

**Variantes posibles:** Fichas con números al dorso, tarjetas con letras detrás, piezas de puzzle con código en la cara oculta.

### Exploración espacial (Poesía, Viajes)
Los jugadores deben moverse por el espacio y explorar para encontrar pistas (UV en paredes, lugares en un mapa).

**Variantes posibles:** Pistas en distintos rincones, código escondido en la habitación, elementos que solo se ven desde ciertos ángulos.

### Contenedor inmersivo (Taller)
Un objeto narrativo (maleta, cofre, carpeta) que centraliza todos los componentes del puzzle y genera inmersión al abrirlo.

**Variantes posibles:** Baúl de viaje, caja de herramientas, estuche de artista, armario viejo.

---

## 🚫 Lo Que Hemos Eliminado (y Por Qué)

### Audio largo como mecánica central
| Antes | Problema | Después |
|-------|----------|---------|
| Dictado de soneto 3 minutos | 1 jugador activo, 4-5 esperando | Audio 60s + manipulación física de palabras magnéticas |
| Audionovela 6 capítulos en MP3 | Muy pasivo, desconecta al grupo | Maleta con materiales táctiles |

**Lección:** Audio máximo 60 segundos. Sirve para dar contexto o pistas, no como mecánica principal.

### Mecánicas de un solo paso
| Antes | Problema | Después |
|-------|----------|---------|
| "PULSA LA FLOR" → FLORCA | Un solo descubrimiento, sin capas | Letras en el reverso de cada palabra → ordenar → leer → formar código |

**Lección:** Cada puzzle necesita al menos 2 fases distintas (encontrar + interpretar, ordenar + revelar, superponer + deducir).

### Elementos temáticamente desvinculados
| Antes | Problema | Después |
|-------|----------|---------|
| Rancho de Wyoming con firma 247 millas | Nada que ver con escritoras palentinas | Mapa de viajes por Palencia con lugares reales |
| Símbolo BOTA vaquera | Desentona en contexto literario | Símbolo CABRA (mascota de Tess) |

**Lección:** Si tienes que explicar por qué un elemento está ahí, probablemente no debería estar.

### Piezas hexagonales como recompensa
| Antes | Problema | Después |
|-------|----------|---------|
| Piezas hexagonales sueltas | Abstracto, no conecta con la temática | Partes del cartel del juego (poster del escape) |

**Lección:** La recompensa acumulada debe tener sentido narrativo y visual. Un cartel del juego que se va completando es más satisfactorio que piezas geométricas genéricas.

### Soportes innecesarios
| Antes | Problema | Después |
|-------|----------|---------|
| Atril plegable para base A3 | Elemento extra que montar, no aporta | Maleta que ya es parte del puzzle |

**Lección:** Si un elemento solo sirve de soporte y no aporta a la experiencia, intégralo en algo que sí lo haga.

---

## 📐 Estructura Típica de Juego

### Ficha técnica estándar
| Aspecto | Valor típico |
|---------|-------------|
| **Duración** | 45-55 minutos |
| **Nº de pruebas** | 6 |
| **Jugadores por equipo** | 4-6 |
| **Equipos simultáneos** | 2 (competitivo) |
| **Dificultad media** | 4-5/10 |
| **Audiencia** | Jóvenes (14-25 años) |
| **Coste materiales** | ~100-150€ |

### Curva de dificultad
```
  6 ┤              ★
  5 ┤          ●   ●
  4 ┤      ●           ●
  3 ┤  ●
  2 ┤
  1 ┤
    └──────────────────────
      P1  P2  P3  P4  P5  P6
```

**Patrón:** Entrada suave (3) → progresión (4-5) → pico (6) → recompensa rápida antes del final (3-4).

La última prueba no debe ser la más difícil. Los jugadores necesitan sentir que van rápido al final para generar emoción competitiva.

### Distribución de cierres
No repetir el mismo tipo de cierre más de 3 veces. Mezclar:

| Tipo | Ejemplo | Cuándo usarlo |
|------|---------|---------------|
| Candado numérico (4 dígitos) | 1-9-5-2 | Código basado en números |
| Candado alfanumérico (4 letras) | C-A-T-A | Código basado en letras |
| Cryptex (6 letras) | LEGADO | Palabra temática, entrada de confianza |
| Llave física | Cofre con llave del sol | Búsqueda física de la llave |

**Regla:** Máximo 3 candados numéricos de 4 dígitos en un juego de 6 pruebas. Variar es clave.

### Misterio secundario (hilo conductor)
Un misterio paralelo que se va resolviendo con cada prueba:
- Cada prueba revela una pieza (sílaba, símbolo, fragmento)
- Al final, las piezas se combinan para revelar algo
- Conecta todas las pruebas entre sí

**En el Legado:** 6 sílabas → CATALINA VALENTO (la séptima escritora olvidada).

---

## ✍️ Estilo de Narrativa

### Cartas de navegación
Cada prueba contiene una carta que indica dónde ir después. La carta:
- Está escrita en primera persona (la escritora habla)
- Menciona la siguiente escritora y su símbolo
- Es breve (1 frase)

**Ejemplo:** *"Carmen guardaba sus secretos en una maleta del taller. Buscad la puerta con el LIBRO ALADO."*

### Símbolos en puertas
Cada espacio tiene un símbolo visual (PLUMA, PRENSA, PINCEL…). Los jugadores navegan buscando el símbolo que menciona la carta.

### Tono
- Misterioso pero accesible
- Sin terror ni gore
- Conexión emocional con personajes reales o verosímiles
- Frase final memorable que los jugadores puedan leer en voz alta

### GM invisible
El GM no guía ni explica rutas. Su rol:
- Dar pistas SOLO cuando se piden (3 niveles: sutil, directa, casi solución)
- Resolver problemas técnicos
- Supervisar fair play
- Generar momentos de energía (reloj de arena, luz violeta)

---

## 🏗️ Estructura de Fichas de Prueba (JSON)

Cada prueba tiene un JSON con esta estructura mínima:

```
{
  "id": "juego_001_nombre",
  "nombre": "Nombre evocativo de la prueba",
  "descripcion": "Qué encuentran y qué tienen que hacer",
  "espacio": 1,
  "planta": 1,
  "escritora": "Nombre real",
  "skill_primario": "prueba-tipo-mecanica",
  "dificultad": 3-6,
  "duracion_estimada_minutos": 6-9,
  "cooperacion_obligatoria": true,
  "configuracion": {
    "mecanica_principal": "Resumen de la mecánica",
    "elementos_necesarios": ["lista de materiales"],
    "codigo_candado": "XXXX",
    "mecanismo_codigo": "Cómo se obtiene el código",
    "mecanismo_barrera": "Qué se abre y cómo"
  },
  "pistas": [
    { "nivel": 1, "tipo": "sutil", "texto": "..." },
    { "nivel": 2, "tipo": "directa", "texto": "..." },
    { "nivel": 3, "tipo": "casi_solucion", "texto": "..." }
  ],
  "solucion": {
    "descripcion": "Pasos resumidos",
    "pasos_detallados": ["Paso 1: ...", "Paso 2: ..."],
    "recompensa": {
      "carta": "Texto de la carta de navegación",
      "parte_cartel": "Símbolo visual",
      "silaba": "XX",
      "siguiente_espacio": "Siguiente prueba"
    }
  },
  "materiales": {
    "impresion": ["Cosas que hay que imprimir"],
    "mobiliario": ["Muebles o soportes necesarios"],
    "extras": ["Decoración o accesorios"]
  }
}
```

---

## 📋 Checklist de Diseño para Nuevos Juegos

### Antes de diseñar
- [ ] Temática definida y coherente (no elementos forzados)
- [ ] Audiencia y rango de edad claro
- [ ] Espacio disponible medido (plantas, habitaciones)
- [ ] Presupuesto máximo definido

### Al diseñar cada prueba
- [ ] ¿Están los 4-6 jugadores activos simultáneamente?
- [ ] ¿Hay doble descubrimiento (2 fases distintas)?
- [ ] ¿El contenedor/materiales tienen sentido narrativo?
- [ ] ¿La mecánica refleja algo de la temática?
- [ ] ¿El audio (si lo hay) dura ≤60 segundos?
- [ ] ¿Las pistas tienen 3 niveles progresivos?
- [ ] ¿El código tiene un origen lógico que los jugadores pueden deducir?

### Al revisar el juego completo
- [ ] Curva de dificultad: 3→4→5→(pico)→4 (no terminar en el pico)
- [ ] Variedad de mecánicas (no más de 2 pruebas con mecánica similar)
- [ ] Variedad de cierres (máximo 3 del mismo tipo)
- [ ] Cada prueba entrega recompensa con sentido narrativo
- [ ] Las cartas de navegación conectan todas las pruebas
- [ ] Hay misterio secundario/hilo conductor
- [ ] 2+ momentos de energía (inicio, final, o punto medio)
- [ ] El final es satisfactorio (no anticlimático)
- [ ] Coste total dentro de presupuesto (~100-150€)
- [ ] Montaje posible en 60-90 minutos
- [ ] Materiales fáciles de conseguir o fabricar

### Al documentar
- [ ] Ficha JSON por prueba (estructura estándar)
- [ ] DISEÑO-JUEGO.md con tabla maestra como fuente de verdad
- [ ] NARRATIVA.md con cartas de navegación
- [ ] LOGISTICA.md con cronograma y personal
- [ ] GUIA-JUGADORES.md para GMs
- [ ] lista-materiales.md para compras y preparación

---

## 🔄 Evolución del Estilo (Historial)

### v3 → v4: De pasivo a activo
- Eliminado dictado de 3 minutos → poemas magnéticos
- Eliminado 6 candados iguales → mezcla de cierres
- Añadidos momentos de energía

### v4 → v4.1 (Marzo 2026): De genérico a coherente
- Wyoming → Palencia (temática local)
- Piezas hexagonales → partes del cartel (recompensa con sentido)
- BOTA → CABRA (símbolo coherente)
- Rancho → Viajes de Tess (nueva ficha alineada)

### Sesión de refactor (24 Marzo 2026): De complejo a elegante
| Prueba | Cambio | Principio aplicado |
|--------|--------|-------------------|
| Biblioteca | FLORCA → letras en reverso | Doble descubrimiento |
| Taller | Audio+atril → maleta+acetatos | Contenedor inmersivo, físico > digital |
| Noemí | Mitades+espejo → portadas+pecera | Temática real, doble reto |
| Viajes | Rancho viejo → ficha nueva | Coherencia temática |
| Recompensas | Hexagonales → partes del cartel | Sentido narrativo |

**Tendencia clara:** Menos mecanismos artificiales, más conexiones con la temática real. Menos objetos técnicos, más objetos que cuentan historia.

---

*Documento vivo — actualizar después de cada juego o refactor significativo.*
*Última actualización: 24 de marzo de 2026*

---

## Patrones del Tratado Maestro (2026)

### 11. Self-Contained Logic
La lógica de cada puzzle debe ser interna a la narrativa. Cero conocimientos externos (cultura general, matemáticas avanzadas). Si un puzzle requiere saber algo que no está en la sala, está mal diseñado.

### 12. Design Backwards
Diseñar cada puzzle DESDE la solución hacia atrás. La solución dicta el camino, no al revés. Esto previene ambigüedad y leaps of logic.

### 13. Pacing por Fases
- Apertura: hit cada ~5 min (confianza)
- Desarrollo: hit cada ~10-15 min (colaboración)
- Clímax: sucesión rápida de hitos (euforia)
- REGLA: Jamás >15 min sin avance tangible.

### 14. Hint System Estructurado
3 min observación → pista sutil (ambiental) → pista directiva (objeto) → solución mecánica (explicar cómo, nunca el código). Las pistas son mantenimiento preventivo, no parches.

### 15. Perfiles de Jugador
Diseñar puzzles que empoderen cada perfil: Líder (coordina), Buscador (táctico), Analista (cerebro), Cronometrador (urgencia). Evitar que el extrovertido domine todo.

### 16. Validación Multisensorial
Cada éxito → hit de dopamina (luz + sonido + apertura). Si un puzzle se resuelve sin feedback sensorial, se siente anticlimático.

### 17. Cooperación Física Real
Mínimo 1 puzzle que requiera 2+ jugadores simultáneamente (interruptores distantes, manipular objeto mientras otro lee instrucciones, etc.).

### 18. Materiales Auténticos
Metal/ madera/ cuerda > plástico. La percepción de calidad = autenticidad. Tecnología invisible (RFID tras madera, no teclados numéricos).
