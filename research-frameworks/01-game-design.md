# 01 - Game Design en Escape Rooms
## Cómo funciona el diseño de juegos aplicado a experiencias de escape

---

## 📋 Resumen Ejecutivo

El Game Design en escape rooms es el arte de estructurar la experiencia completa del jugador: desde la narrativa inicial hasta el desenlace final. No es solo crear puzzles, sino diseñar un **sistema cohesivo** donde cada elemento (mecánicas, historia, espacio, dificultad) trabaje junto para crear inmersión y satisfacción.

---

## 🎯 Principios Clave

### 1. **Narrativa como Esqueleto**
- La historia NO es decoración: es el **marco que justifica todo**
- Cada puzzle debe tener sentido dentro del mundo narrativo
- Objetivo claro desde el minuto 0 (escapar, resolver crimen, recuperar objeto)
- **Regla:** Si un jugador pregunta "¿por qué está esto aquí?", el diseño falló

### 2. **Inmersión Total**
- **Consistencia visual:** Cada objeto debe pertenecer al mundo
- **Atmosfera multisensorial:** Luz, sonido, texturas, incluso olor
- **Nada rompe la cuarta pared:** No hay post-its modernos en una sala medieval
- **Feedback constante:** El entorno responde a las acciones del jugador

### 3. **Claridad de Objetivos**
- **Objetivo principal:** Siempre visible (reloj, pantalla, meta física)
- **Objetivos secundarios:** Desbloquear áreas, encontrar llaves, resolver sub-tramas
- **Progreso tangible:** Candados abiertos, luces encendidas, puertas desbloqueadas

### 4. **Dificultad Progresiva (Curva de Aprendizaje)**
- **Inicio (10-15% del tiempo):** Puzzles fáciles para generar confianza
- **Desarrollo (60-70%):** Escalada gradual de complejidad
- **Climax (15-20%):** Meta-puzzle que integra elementos anteriores
- **Regla de oro:** Frustración controlada, nunca bloqueo total

### 5. **Diseño para Colaboración**
- **Puzzles multi-jugador:** Requieren 2+ personas (dividir información, acciones simultáneas)
- **Roles emergentes:** Permitir que cada jugador aporte su fortaleza
- **Comunicación obligatoria:** Pistas que están en lugares separados

### 6. **Justicia y Consistencia**
- **Una solución válida:** No puzzles con múltiples interpretaciones
- **Auto-validación:** El candado se abre o no, no hay ambigüedad
- **Reglas del mundo estables:** Si algo funciona de una manera, siempre funciona igual

---

## 🔧 Frameworks y Metodologías

### **MDA Framework (Mechanics-Dynamics-Aesthetics)**
- **Mechanics:** Puzzles, candados, reglas del juego
- **Dynamics:** Urgencia temporal, colaboración, descubrimiento
- **Aesthetics:** Inmersión, emoción, satisfacción

### **Flujo de Diseño Recomendado**
1. **Concepto:** Tema + objetivo + emociones objetivo
2. **Narrativa:** Historia completa con puntos de giro
3. **Mapa de flujo:** Diagrama de puzzles y dependencias
4. **Prototipo rápido:** Versión jugable (aunque sea con papel)
5. **Testing iterativo:** Mínimo 5 grupos de prueba
6. **Refinamiento:** Ajustar dificultad, ritmo, claridad

### **Tipos de Flujo de Juego**
| Tipo | Descripción | Mejor para |
|------|-------------|-----------|
| **Lineal** | Puzzle 1 → 2 → 3 → Final | Principiantes, equipos pequeños |
| **No lineal (abierto)** | Múltiples puzzles disponibles simultáneamente | Grupos grandes, jugadores experimentados |
| **Multi-lineal** | Varios caminos que convergen en meta común | Balance entre estructura y libertad |

---

## ⚠️ Errores Comunes

### 1. **Sobrecarga de Candados**
- **Problema:** Demasiados candados = monotonía + búsqueda repetitiva
- **Solución:** Diversificar mecánicas (mecanismos, electromagnéticos, puzzles físicos)

### 2. **Puzzles Desconectados de la Narrativa**
- **Problema:** Sudoku en una sala de piratas rompe inmersión
- **Solución:** Cada puzzle debe justificarse en el mundo ("descifrar mapa del tesoro" vs "resolver sudoku")

### 3. **Falta de Indicadores de Progreso**
- **Problema:** Jugadores no saben si avanzan o están estancados
- **Solución:** Feedback visual/audio (luces que se encienden, cajas que se abren, sonidos de confirmación)

### 4. **Diseño para un Solo Jugador**
- **Problema:** Un jugador hace todo mientras otros miran
- **Solución:** Puzzles que requieren información dividida, acciones simultáneas, comunicación forzada

### 5. **Testing Insuficiente**
- **Problema:** Puzzles obvios para el diseñador son imposibles para jugadores
- **Solución:** Mínimo 5 playtests con grupos diversos (edad, experiencia, tamaño)

### 6. **Ignorar Feedback del Game Master**
- **Problema:** El GM ve patrones que el diseñador no ve
- **Solución:** Registrar dónde se atascan los grupos y ajustar

---

## ✅ Checklist de Validación

### **Narrativa y Tema**
- [ ] ¿La historia justifica cada puzzle?
- [ ] ¿El objetivo es claro desde el inicio?
- [ ] ¿Los objetos pertenecen al mundo narrativo?
- [ ] ¿Hay coherencia visual/audio en toda la sala?

### **Mecánicas y Puzzles**
- [ ] ¿Hay variedad de tipos de puzzle (no solo candados)?
- [ ] ¿Las soluciones son inequívocas (auto-validables)?
- [ ] ¿Los puzzles fomentan colaboración?
- [ ] ¿Hay balance entre búsqueda, lógica y física?

### **Flujo y Ritmo**
- [ ] ¿El mapa de flujo está documentado?
- [ ] ¿Los primeros puzzles son más fáciles?
- [ ] ¿El climax integra elementos anteriores?
- [ ] ¿Hay transiciones suaves entre áreas/puzzles?

### **Experiencia de Jugador**
- [ ] ¿Hay feedback claro cuando se resuelve algo?
- [ ] ¿Los jugadores pueden medir su progreso?
- [ ] ¿Hay hints disponibles si se atascan?
- [ ] ¿La dificultad escala progresivamente?

### **Testing**
- [ ] ¿Se han hecho mínimo 5 playtests?
- [ ] ¿Se ha ajustado según feedback del GM?
- [ ] ¿Se ha probado con grupos de diferentes tamaños?
- [ ] ¿Se han identificado y corregido puntos de bloqueo?

---

## 💡 Ejemplos de Implementación

### **Ejemplo 1: Flujo Lineal para Principiantes**
```
INTRO (5 min)
└─> Briefing + exploración inicial

PUZZLE 1 (Fácil, 5 min)
└─> Búsqueda visual simple → Abre caja con pista para P2

PUZZLE 2 (Medio, 10 min)
└─> Decodificar mensaje usando pista de P1 → Abre puerta secreta

PUZZLE 3 (Medio-Difícil, 15 min)
└─> Combinar objetos de área nueva → Activa mecanismo final

META-PUZZLE (Difícil, 10 min)
└─> Usa pistas acumuladas de P1+P2+P3 → Escapar

TOTAL: 45 min (margen de 15 min para hints/exploración)
```

### **Ejemplo 2: Flujo No Lineal para Expertos**
```
INTRO (5 min)
└─> Briefing + área central con 4 puzzles disponibles

PARALELO A: Puzzle mecánico (10 min)
PARALELO B: Puzzle de lógica (10 min)
PARALELO C: Puzzle de búsqueda (10 min)
PARALELO D: Puzzle de comunicación (10 min)
    ↓
CONVERGENCIA (15 min)
└─> Cada paralelo da 1/4 del código final
└─> Meta-puzzle requiere integrar las 4 partes

CLIMAX (10 min)
└─> Acción final (pulsar botón, girar llave, escapar)

TOTAL: 60 min
```

### **Ejemplo 3: Curva de Dificultad en 60 min**
```
Min 0-10:   Dificultad 2/10 (warm-up, generar confianza)
Min 10-30:  Dificultad 4-5/10 (engagement, exploración)
Min 30-50:  Dificultad 6-7/10 (desafío real, colaboración)
Min 50-60:  Dificultad 5/10 (resolución satisfactoria, no frustración)
```

---

## 🛠️ Aplicación al Template

### **Cambios Concretos Sugeridos para `templates/escape-room/`**

#### 1. **Estructura de Directorios**
```
templates/escape-room/
├── GAME.json              # Configuración global del juego
├── NARRATIVE.json         # Historia completa con actos
├── FLOW.json              # Mapa de flujo de puzzles
├── puzzles/               # Fichas individuales de puzzles
│   ├── puzzle_001.json
│   ├── puzzle_002.json
│   └── ...
├── assets/                # Recursos físicos/digitales
│   ├── props/
│   ├── audio/
│   └── visual/
└── testing/               # Plantillas de testing
    ├── playtest-feedback.md
    ├── difficulty-matrix.md
    └── gm-notes.md
```

#### 2. **GAME.json - Campos Obligatorios**
```json
{
  "id": "juego-crimen-palencia-001",
  "nombre": "El Crimen de la Calle Mayor",
  "tipo": "hall_escape",
  "duracion_minutos": 60,
  "jugadores": {
    "min": 2,
    "max": 6,
    "optimo": 4
  },
  "dificultad_objetivo": 6,
  "tematica": "crimen/historico",
  "flujo": "multi-lineal",
  "objetivo_principal": "Resolver el asesinato de 1923",
  "actos": [
    {"nombre": "Investigación inicial", "duracion_min": 15},
    {"nombre": "Descubrimiento de evidencia", "duracion_min": 25},
    {"nombre": "Revelación final", "duracion_min": 20}
  ]
}
```

#### 3. **FLOW.json - Dependencias de Puzzles**
```json
{
  "nodos": [
    {"id": "puzzle_001", "tipo": "inicio", "desbloquea": ["puzzle_002", "puzzle_003"]},
    {"id": "puzzle_002", "tipo": "paralelo", "desbloquea": ["puzzle_final"]},
    {"id": "puzzle_003", "tipo": "paralelo", "desbloquea": ["puzzle_final"]},
    {"id": "puzzle_final", "tipo": "meta", "requiere": ["puzzle_002", "puzzle_003"]}
  ],
  "puntos_control": [
    {"al_completar": "puzzle_002", "feedback": "Luz verde se enciende en el altar"},
    {"al_completar": "puzzle_003", "feedback": "Cajón secreto se abre"}
  ]
}
```

#### 4. **NARRATIVE.json - Estructura Narrativa**
```json
{
  "acto_1": {
    "titulo": "El Hallazgo",
    "intro": "Han descubierto un cuerpo en la calle Mayor...",
    "objetivo_jugador": "Examinar la escena del crimen",
    "puzzles_relacionados": ["puzzle_001", "puzzle_002"],
    "emocion_objetivo": "curiosidad"
  },
  "acto_2": {
    "titulo": "La Investigación",
    "giro_narrativo": "La víctima no era quien parecía",
    "objetivo_jugador": "Encontrar evidencia oculta",
    "puzzles_relacionados": ["puzzle_003", "puzzle_004"],
    "emocion_objetivo": "sorpresa"
  },
  "acto_3": {
    "titulo": "La Verdad",
    "climax": "Identificar al asesino",
    "objetivo_jugador": "Resolver el meta-puzzle",
    "puzzles_relacionados": ["puzzle_final"],
    "emocion_objetivo": "satisfacción"
  }
}
```

#### 5. **Validador Automático de Game Design**
Crear script `validate_game_design.py` que verifique:
- Curva de dificultad (primeros puzzles < últimos)
- Balance de mecánicas (no más de 40% candados)
- Puzzles con dependencias circulares
- Objetivos claros en cada acto
- Progresión de emociones (curiosity → surprise → satisfaction)

---

## 📚 Referencias Clave

- **MDA Framework:** Hunicke, LeBlanc, Zubek (2004)
- **Flow Theory:** Mihaly Csikszentmihalyi
- **Escape Room Design Guide:** REA (Room Escape Artist)
- **13 Rules for Escape Room Puzzle Design:** The Codex

---

## 🎓 Siguiente Paso

Continuar con **02-puzzle-design.md** para profundizar en la creación de puzzles específicos que sigan estos principios de game design.

---

*Guía creada como parte del sistema de mejora de templates de escape rooms - Generador Agent*
