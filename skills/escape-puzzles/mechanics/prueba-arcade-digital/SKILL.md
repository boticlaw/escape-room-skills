---
name: prueba-arcade-digital
description: Skill para crear pruebas de minijuegos arcade digitales tipo Frogger, Pong, etc. Usar cuando se necesite (1) que los jugadores completen un minijuego clasico, (2) simbolizar obstaculos con mecanicas de juego conocidas, (3) combinar reflejos y paciencia en desafios digitales.
---

# Prueba Arcade Digital

Skill para el diseno, validacion y adaptacion de pruebas basadas en minijuegos arcade clasicos.

---

## Cuando Usar Este Tipo de Prueba

Usa este skill cuando:

- [x] **Trigger 1:** El jugador debe completar un minijuego tipo Frogger, Pong, Snake, etc.
- [x] **Trigger 2:** Se quiere simbolizar obstaculos con mecanicas de juego conocidas
- [x] **Trigger 3:** La prueba requiere reflejos, timing y paciencia

**Ejemplos de prompts que activan este skill:**
- "Quiero un juego tipo Frogger para cruzar un rio"
- "Crea un Pong donde tengan que ganar 5-0"
- "Necesito un minijuego arcade clasico como parte del escape"

---

## Cuando NO Usarlo (Anti-Patrones)

**NO uses este skill cuando:**

### Anti-Patron 1: Publico con poca habilidad con controles
- **Por que falla:** Ninos muy pequenos o personas mayores pueden frustrarse
- **Mejor alternativa:** Usar puzzles mas cognitivos

### Anti-Patron 2: Solo necesitas un puzzle logico
- **Por que falla:** Si no hay componente de reflejos/timing, no es arcade
- **Mejor alternativa:** Usar `prueba-logica-posiciones` o similar

### Anti-Patron 3: Como unico tipo de prueba en el escape
- **Por que falla:** Variedad limitada, puede cansar
- **Mejor alternativa:** Combinar con otros tipos de puzzles

**Regla general:** Los juegos arcade deben ser una parte del escape, no el todo.

---

## Variables de Diseno

### Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `tipo_juego` | string | ["frogger", "pong", "snake", "breakout", "custom"] | "frogger" | Tipo de minijuego arcade |
| `dificultad_base` | number | 1-10 | 5 | Nivel inicial de dificultad |
| `objetivo_puntos` | number | 1-100 | 5 | Puntos/metas para completar |
| `vidas` | number | 1-5 | 3 | Intentos antes de reiniciar |
| `permite_continuar` | boolean | true/false | true | Si se puede reintentar tras perder |

### Variables Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `condicion_victoria` | string | Descripcion especifica (ej: "ganar 5-0") |
| `velocidad_inicial` | number | Velocidad base del juego |
| `incremento_dificultad` | boolean | Si aumenta dificultad con progreso |
| `codigo_recompensa` | string | Codigo al completar |
| `mensaje_exito` | string | Texto al ganar |

### Variables por Tipo de Juego

**Frogger:**
| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `carriles_coche` | number | 3 | Carriles con vehiculos |
| `carriles_rio` | number | 3 | Carriles con troncos |
| `velocidad_coche` | number | 3 | Velocidad de vehiculos |
| `velocidad_tronco` | number | 2 | Velocidad de troncos |

**Pong:**
| Variable | Tipo | Default | Descripcion |
|----------|------|---------|-------------|
| `puntos_victoria` | number | 5 | Puntos para ganar |
| `puntos_derrota_max` | number | 0 | Puntos maximos que puede marcar IA |
| `velocidad_pelota` | number | 5 | Velocidad inicial |
| `tamano_paleta` | number | 100 | Tamano de la paleta |

### Combinaciones Validas

- **Configuracion Frogger:** `tipo_juego="frogger"`, `vidas=3`, `objetivo_puntos=1`
- **Configuracion Pong Estricta:** `tipo_juego="pong"`, `condicion_victoria="ganar 5-0"`

### Combinaciones Prohibidas/Peligrosas

- [x] NO combines `vidas=1` con `dificultad_base > 7` (muy punitivo)
- [WARN] Cuidado con `condicion_victoria` muy estricta como "ganar sin recibir puntos"

---

## Errores Comunes de Jugadores

### Error 1: Impaciencia
- **Sintoma:** Intentan pasar rapido y chocan repetidamente
- **Causa:** Quieren terminar rapido sin observar patrones
- **Prevencion:** Pistas que enfatizan paciencia
- **Intervencion:** Recordar que "esperar el momento adecuado" es clave

### Error 2: No observan patrones
- **Sintoma:** Juegan de forma reactiva sin estrategia
- **Causa:** Falta de analisis previo de movimientos
- **Prevencion:** Tiempo de observacion antes de empezar
- **Intervencion:** Pista sugiriendo observar primero

### Error 3: Frustracion tras varios intentos
- **Sintoma:** Reportan que "es imposible"
- **Causa:** Dificultad mal calibrada o racha mala
- **Prevencion:** Curva de dificultad progresiva
- **Intervencion:** Reducir temporalmente dificultad

**Senales de alarma (el jugador esta atascado):**
- [ ] Mas de 10 intentos sin progreso
- [ ] Reportan frustracion extrema
- [ ] Tiempo excesivo (>15 min) en un solo minijuego

**Tiempo maximo recomendado antes de intervenir:** 15 minutos

---

## Escalado de Dificultad

### Version Facil (Nivel 1-3)
- **Caracteristicas:**
  - Velocidad lenta
  - Vidas generosas (5+)
  - Condiciones de victoria permisivas
- **Tiempo estimado:** 2-5 minutos
- **Publico objetivo:** Ninos, novatos

### Version Estandar (Nivel 4-6)
- **Caracteristicas:**
  - Velocidad media
  - 3 vidas
  - Condiciones normales
- **Tiempo estimado:** 5-10 minutos
- **Publico objetivo:** Publico general

### Version Dificil (Nivel 7-9)
- **Caracteristicas:**
  - Velocidad alta
  - 1-2 vidas
  - Condiciones estrictas (ej: Pong 5-0)
- **Tiempo estimado:** 10-20 minutos
- **Publico objetivo:** Expertos, gamers

### Version Extrema (Nivel 10)
- **Caracteristicas:**
  - Velocidad maxima
  - 1 vida
  - Condiciones imposibles aparentemente
- **Tiempo estimado:** 20+ minutos
- **Publico objetivo:** Speedrunners

**Matriz de escalado:**

| Aspecto | Facil | Estandar | Dificil |
|---------|-------|----------|---------|
| Vidas | 5 | 3 | 1 |
| Velocidad | 3 | 5 | 8 |
| Pistas disponibles | 5 | 3 | 1 |
| Reinicio al perder | Checkpoint | Inicio | Inicio |

---

## Adaptaciones

### Por Edad

**Ninos (6-10 anos):**
- Simplificar: Velocidad muy lenta, muchas vidas
- Evitar: Condiciones estrictas tipo "5-0"
- Anadir: Elementos visuales atractivos

**Adolescentes (11-17 anos):**
- Mantener: Nivel estandar
- Permitir: Desafios competitivos

**Adultos (18+):**
- Complejidad completa
- Considerar: Referencias retro

### Por Espacio

**Hall Escape (sala fisica):**
- Ventajas: Tablet o pantalla grande
- Limitaciones: Un jugador a la vez
- Adaptaciones especificas: Turnos o pantalla compartida

**Street Escape (exterior/movil):**
- Ventajas: Cada uno en su movil
- Limitaciones: Controles tactiles menos precisos
- Adaptaciones especificas: Botones grandes, sin precis requerida

**Juego de Investigacion (no presencial):**
- Ventajas: Perfecto para web
- Limitaciones: Controles teclado vs tactil
- Adaptaciones especificas: Ambos controles disponibles

### Por Duracion

**Quick (5-10 minutos):**
- Elementos a eliminar: Condiciones estrictas
- Foco: Una victoria simple

**Standard (15-30 minutos):**
- Version completa

**Epic (45+ minutos):**
- Elementos a anadir: Multiples minijuegos encadenados
- Sub-etapas: Frogger → Pong → Snake

---

## Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-tablet-cooperativo`**
- **Sinergia:** Minijuego cooperativo en tablet
- **Ejemplo compuesto:** Frogger con multiples jugadores
- **Frecuencia:** Ocasional

### Skills Alternativos (Sustitucion)

**En lugar de este skill, considera:**

- **`prueba-laberinto-digital`** → Si prefieres puzzles sobre reflejos
- **`prueba-control-cooperativo`** → Si quieres cooperacion

---

## Ejemplos Concretos

### Ejemplo 1: Frogger - Cruzando el Rio

**Contexto:** Street escape simbolizando obstaculos como cruzar el rio

**Configuracion:**
```json
{
  "tipo_juego": "frogger",
  "dificultad_base": 5,
  "vidas": 3,
  "objetivo_puntos": 1,
  "carriles_coche": 3,
  "carriles_rio": 3,
  "velocidad_coche": 3,
  "velocidad_tronco": 2
}
```

**Flujo de juego:**
1. Jugador ve la rana en la parte inferior
2. Debe cruzar carretera evitando coches
3. Luego cruzar rio saltando sobre troncos
4. Llegar al otro lado para completar

**Solucion:** Llegar al otro lado sin perder todas las vidas

**Pistas progresivas:**
- Pista 1: "Debes ayudar a Pepe a cruzar al otro lado evitando obstaculos"
- Pista 2: "Controla el personaje con las flechas de direccion"
- Pista 3: "Espera el momento adecuado para cruzar la carretera sin chocar"
- Pista 4: "Salta sobre los troncos en el rio para no caer al agua"
- Pista 5: "Llega al otro lado del rio sin perder la vida. Paciencia y prueba"

---

### Ejemplo 2: Pong - Negociando con los Hermanos

**Contexto:** Street escape, la negociacion se simboliza con un partido de Pong

**Configuracion:**
```json
{
  "tipo_juego": "pong",
  "dificultad_base": 6,
  "vidas": 1,
  "condicion_victoria": "ganar 5-0",
  "puntos_victoria": 5,
  "puntos_derrota_max": 0,
  "velocidad_pelota": 5
}
```

**Flujo de juego:**
1. Jugador controla paleta izquierda
2. Debe ganar 5 puntos sin recibir ninguno
3. Si recibe un punto, el juego reinicia

**Solucion:** Ganar 5-0 sin dejar que la IA marque

**Pistas progresivas:**
- Pista 1: "Tienes que ganar 5 a 0"
- Pista 2: "Paciencia, seguro lo consigues"
- Pista 3: "Observa bien los movimientos y aprovecha los angulos"
- Pista 4: "Animo y persiste, que tu puedes"
- Pista 5: "Paciencia y perseverancia terminaras consiguiendolo"

---

## Notas de Implementacion

### Para el Agente Usuario

**Antes de usar este skill:**
1. Elegir el tipo de juego apropiado para la narrativa
2. Calibrar dificultad segun publico objetivo
3. Definir condiciones de victoria claras

**Mientras usas este skill:**
1. Balancear desafio vs frustracion
2. Incluir progreso visible
3. Preparar pistas de paciencia/estrategia

**Despues de crear la prueba:**
1. Testear exhaustivamente
2. Medir tiempo de completado promedio
3. Ajustar dificultad segun feedback

---

## Changelog

- **v1.0** (2026-02-15): Creacion inicial del skill

---

**Score de evaluacion:** 7/10  
**Frecuencia de uso esperada:** Media  
**Dependencias:** Ninguna
