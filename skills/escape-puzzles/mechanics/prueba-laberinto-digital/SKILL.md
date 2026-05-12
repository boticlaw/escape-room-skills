---
name: prueba-laberinto-digital
description: Skill para crear pruebas de laberintos digitales navegables. Usar cuando se necesite (1) que los jugadores naveguen un laberinto en pantalla, (2) simbolizar caminos complicados con metafora visual, (3) puzzles de navegacion con controles direccionales.
---

# Prueba Laberinto Digital

Skill para el diseno, validacion y adaptacion de pruebas basadas en navegacion de laberintos digitales.

---

## Cuando Usar Este Tipo de Prueba

Usa este skill cuando:

- [x] **Trigger 1:** El jugador debe navegar un laberinto usando controles direccionales
- [x] **Trigger 2:** Se quiere simbolizar un camino complicado (busqueda de vivienda, decisiones dificiles)
- [x] **Trigger 3:** La prueba requiere paciencia y observacion visual para encontrar la ruta

**Ejemplos de prompts que activan este skill:**
- "Quiero un laberinto que represente la busqueda de casa"
- "Crea un puzzle donde tengan que encontrar la salida de un laberinto"
- "Necesito que naveguen un laberinto digital"

---

## Cuando NO Usarlo (Anti-Patrones)

**NO uses este skill cuando:**

### Anti-Patron 1: Laberinto fisico real
- **Por que falla:** Si el laberinto es un espacio fisico real, no es digital
- **Mejor alternativa:** Usar prueba de ubicacion fisica

### Anti-Patron 2: Solo necesitas navegacion libre
- **Por que falla:** Si no hay paredes/restricciones, no es un laberinto
- **Mejor alternativa:** Usar `prueba-gps-navegacion` o `prueba-control-cooperativo`

### Anti-Patron 3: Publico muy joven con baja motricidad fina
- **Por que falla:** Los controles direccionales pueden ser frustrantes para ninos pequenos
- **Mejor alternativa:** Simplificar drasticamente o usar `prueba-exploracion-visual`

**Regla general:** Si la frustracion supera la satisfaccion al resolver, reducir complejidad.

---

## Variables de Diseno

### Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `tamano_laberinto` | string | ["pequeno", "mediano", "grande"] | "mediano" | Dimensiones del laberinto |
| `tipo_vista` | string | ["superior", "primera_persona"] | "superior" | Perspectiva de camara |
| `tiempo_limite` | number | 0-300 | 0 | Segundos (0 = sin limite) |
| `mostrar_minimapa` | boolean | true/false | false | Si muestra mapa general |
| `punto_inicio` | string | ["esquina", "centro", "aleatorio"] | "esquina" | Donde empieza el jugador |
| `punto_fin` | string | ["esquina_opuesta", "centro", "aleatorio"] | "esquina_opuesta" | Donde esta la salida |

### Variables Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `solucion_path` | string | Secuencia de movimientos (ej: "ADADAIAD" = Abajo-Derecha-...) |
| `permitir_retroceso` | boolean | Si se puede volver atras |
| `penalizar_reinicio` | boolean | Si reiniciar tiene penalizacion |
| `feedback_visual` | boolean | Efectos al tocar paredes |
| `codigo_recompensa` | string | Codigo mostrado al completar |

### Combinaciones Validas

- **Configuracion Basica:** `tamano_laberinto="pequeno"`, `tiempo_limite=0`, `mostrar_minimapa=false`
- **Configuracion Desafiante:** `tamano_laberinto="grande"`, `tiempo_limite=120`, `mostrar_minimapa=false`

### Combinaciones Prohibidas/Peligrosas

- [x] NO combines `tamano_laberinto="grande"` con `tiempo_limite < 60` (muy estresante)
- [WARN] Cuidado con `mostrar_minimapa=true` en laberintos pequenos (trivial)

---

## Errores Comunes de Jugadores

### Error 1: Intentan el camino obvio y fallan
- **Sintoma:** Repiten el mismo camino aparentemente logico
- **Causa:** El laberinto tiene caminos trampa que parecen correctos
- **Prevencion:** Disenar caminos trampa no demasiado largos
- **Intervencion:** Pista 3 sugiriendo "empezar desde el final"

### Error 2: Se pierden y no encuentran salida
- **Sintoma:** Circulan en bucles sin progreso
- **Causa:** Falta de puntos de referencia visuales
- **Intervencion:** Pista con seccion clave del camino

### Error 3: Frustracion por controles
- **Sintoma:** Reportan que "los controles no responden"
- **Causa:** Latencia o interfaz poco intuitiva
- **Prevencion:** Controles responsivos, feedback visual inmediato

**Senales de alarma (el jugador esta atascado):**
- [ ] Mas de 5 minutos sin progreso visible
- [ ] Reportan haber "probado todo"
- [ ] Circulan en patron repetitivo

**Tiempo maximo recomendado antes de intervenir:** 10 minutos

---

## Escalado de Dificultad

### Version Facil (Nivel 1-3)
- **Caracteristicas:**
  - Laberinto pequeno (10x10)
  - Sin tiempo limite
  - Camino unico sin bifurcaciones complejas
- **Tiempo estimado:** 2-5 minutos
- **Publico objetivo:** Ninos, novatos

### Version Estandar (Nivel 4-6)
- **Caracteristicas:**
  - Laberinto mediano (15x15)
  - Multiples bifurcaciones
  - Posibles caminos sin salida
- **Tiempo estimado:** 5-10 minutos
- **Publico objetivo:** Publico general

### Version Dificil (Nivel 7-9)
- **Caracteristicas:**
  - Laberinto grande (20x20+)
  - Tiempo limite opcional
  - Multiples niveles o teletransportes
- **Tiempo estimado:** 10-20 minutos
- **Publico objetivo:** Expertos

### Version Extrema (Nivel 10)
- **Caracteristicas:**
  - Laberinto muy grande con trampas
  - Tiempo limite estricto
  - Secciones que cambian dinamicamente
- **Tiempo estimado:** 20+ minutos
- **Publico objetivo:** Competencias

**Matriz de escalado:**

| Aspecto | Facil | Estandar | Dificil |
|---------|-------|----------|---------|
| Tamano | 10x10 | 15x15 | 20x20+ |
| Tiempo limite | Sin | Sin | 120s |
| Pistas disponibles | 5 | 4 | 2 |
| Minimapa | Opcional | No | No |

---

## Adaptaciones

### Por Edad

**Ninos (6-10 anos):**
- Simplificar: Laberinto pequeno, sin tiempo
- Evitar: Caminos muy largos sin feedback
- Anadir: Colores brillantes, personaje simpatico

**Adolescentes (11-17 anos):**
- Mantener: Nivel estandar
- Permitir: Desafios de tiempo opcionales

**Adultos (18+):**
- Complejidad completa
- Considerar: Versiones con narrativa integrada

### Por Espacio

**Hall Escape (sala fisica):**
- Ventajas: Tablet o pantalla compartida
- Limitaciones: Un jugador a la vez si es individual
- Adaptaciones especificas: Turnos o pantalla grande para todos

**Street Escape (exterior/movil):**
- Ventajas: Cada uno en su movil
- Limitaciones: Pantallas pequenas
- Adaptaciones especificas: Simplificar si es en movil

**Juego de Investigacion (no presencial):**
- Ventajas: Perfecto para formato digital
- Limitaciones: Ninguna significativa
- Adaptaciones especificas: Ninguna necesaria

### Por Duracion

**Quick (5-10 minutos):**
- Elementos a eliminar: Tiempos limite
- Foco: Laberinto pequeno

**Standard (15-30 minutos):**
- Version completa

**Epic (45+ minutos):**
- Elementos a anadir: Multiples laberintos encadenados
- Sub-etapas: Laberinto 1 → codigo → Laberinto 2

---

## Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-control-cooperativo`**
- **Sinergia:** Un jugador navega mientras otros controlan obstaculos
- **Ejemplo compuesto:** Laberinto donde cada jugador abre puertas
- **Frecuencia:** Ocasional

### Skills Alternativos (Sustitucion)

**En lugar de este skill, considera:**

- **`prueba-arcade-digital`** → Si prefieres accion sobre puzzles
- **`prueba-exploracion-visual`** → Si el laberinto es conceptual

---

## Ejemplos Concretos

### Ejemplo 1: Laberinto de la Vivienda

**Contexto:** Street escape simbolizando la dificil busqueda de vivienda

**Configuracion:**
```json
{
  "tamano_laberinto": "mediano",
  "tipo_vista": "superior",
  "tiempo_limite": 0,
  "mostrar_minimapa": false,
  "punto_inicio": "esquina",
  "punto_fin": "esquina_opuesta",
  "solucion_path": "ADADAIAD"
}
```

**Flujo de juego:**
1. Jugador ve el laberinto representando "caminos complicados"
2. Navega con flechas direccionales
3. Llega a la salida
4. Recibe el siguiente enigma

**Solucion:** Abajo, Derecha, Abajo, Derecha, Abajo, Izquierda, Abajo, Derecha

**Pistas progresivas:**
- Pista 1: "Observa el laberinto con detenimiento antes de moverte"
- Pista 2: "A veces el camino correcto no es el mas evidente"
- Pista 3: "Normalmente si empiezas a buscar desde el final resulta mas sencillo"
- Pista 4: "La zona centro del laberinto es la clave"
- Pista 5: "El camino es: Abajo, Derecha, Abajo, Derecha, Abajo, Izquierda, Abajo, Derecha"

---

## Notas de Implementacion

### Para el Agente Usuario

**Antes de usar este skill:**
1. Disenar el laberinto con solucion unica
2. Documentar la secuencia de movimientos
3. Verificar que no hay atajos no intencionados

**Mientras usas este skill:**
1. Balancear dificultad vs frustracion
2. Incluir feedback visual claro
3. Preparar pistas progresivas especificas

**Despues de crear la prueba:**
1. Testear que la solucion documentada funciona
2. Verificar tiempos de completado
3. Ajustar tamano segun feedback

---

## Changelog

- **v1.0** (2026-02-15): Creacion inicial del skill

---

**Score de evaluacion:** 7/10  
**Frecuencia de uso esperada:** Media  
**Dependencias:** Ninguna
