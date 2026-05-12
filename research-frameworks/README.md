# 🔐 Guías de Diseño de Escape Rooms
## Sistema de investigación y mejora de templates

**Versión:** 1.0  
**Fecha:** Marzo 2026  
**Autor:** Generador Agent  
**Propósito:** Sintetizar las 8 disciplinas clave para crear escape rooms excepcionales y mejorar templates estándar

---

## 📚 Índice de Guías

| # | Disciplina | Guía | Enfoque | Archivo |
|---|------------|------|---------|---------|
| 1 | **Game Design** | Cómo funciona | Estructura, mecánicas, flujo | [01-game-design.md](01-game-design.md) |
| 2 | **Puzzle Design** | Qué hacen | Tipos, dificultad, "aha moments" | [02-puzzle-design.md](02-puzzle-design.md) |
| 3 | **Storytelling** | Por qué importa | Narrativa, emociones, personajes | [03-storytelling.md](03-storytelling.md) |
| 4 | **Psicología** | Cómo piensan | Flow, frustración, colaboración | [04-psicologia.md](04-psicologia.md) |
| 5 | **UX** | Cómo lo viven | Usabilidad, fricción, accesibilidad | [05-ux.md](05-ux.md) |
| 6 | **Escenografía** | Cómo se siente | Atmósfera, luz, sonido, props | [06-escenografia.md](06-escenografia.md) |
| 7 | **Tecnología** | Cómo sorprende | Automatización, sensores, efectos | [07-tecnologia.md](07-tecnologia.md) |
| 8 | **Testing** | Cómo mejora | Validación, iteración, métricas | [08-testing.md](08-testing.md) |

---

## 🎯 Resumen Ejecutivo

Este sistema de 8 guías proporciona un **framework completo** para diseñar escape rooms de alta calidad. Cada guía cubre:

✅ **Principios clave** - Fundamentos de la disciplina  
✅ **Frameworks/metodologías** - Sistemas probados de diseño  
✅ **Errores comunes** - Qué evitar (basado en experiencia real)  
✅ **Checklists de validación** - Herramientas prácticas de revisión  
✅ **Ejemplos de implementación** - Casos concretos aplicables  
✅ **Aplicación al Template** - Cambios específicos para `templates/escape-room/`

---

## 🔗 Integración entre Disciplinas

Las 8 disciplinas **no están aisladas**, se interconectan constantemente:

```
GAME DESIGN (Estructura)
    ↓
    ├─→ STORYTELLING (Narrativa que guía estructura)
    ├─→ PUZZLE DESIGN (Mecánicas dentro de estructura)
    └─→ TECNOLOGÍA (Herramientas para implementar)

PSICOLOGÍA (Mente del jugador)
    ↓
    ├─→ UX (Eliminar fricción, potenciar flow)
    └─→ PUZZLE DESIGN (Dificultad calibrada, "aha moments")

ESCENOGRAFÍA (Ambiente)
    ↓
    ├─→ STORYTELLING (Mostrar, no contar)
    ├─→ TECNOLOGÍA (Efectos automáticos)
    └─→ UX (Señalización visual, accesibilidad)

TESTING (Validación)
    ↓
    └─→ Todas las demás (iteración basada en feedback real)
```

**Conclusión:** No se puede diseñar una disciplina sin considerar las otras. El diseño de escape rooms es **sistémico**.

---

## 🛠️ Recomendaciones de Integración en el Template

### **1. Estructura de Directorios Mejorada**

```
templates/escape-room/
├── GAME.json                 # Configuración global (Game Design)
├── NARRATIVE.json            # Historia completa (Storytelling)
├── FLOW.json                 # Mapa de flujo (Game Design + Puzzle Design)
├── PSYCHOLOGY.json           # Perfil psicológico (Psicología)
├── UX.json                   # Usabilidad y accesibilidad (UX)
├── SCENOGRAPHY.json          # Atmósfera y ambiente (Escenografía)
├── TECHNOLOGY.json           # Sistemas técnicos (Tecnología)
├── TESTING.json              # Plan de testing (Testing)
│
├── puzzles/                  # Fichas individuales de puzzles
│   ├── puzzle_001.json
│   ├── puzzle_002.json
│   └── ...
│
├── assets/                   # Recursos físicos/digitales
│   ├── props/
│   ├── audio/
│   ├── visual/
│   └── tech/
│
├── testing/                  # Herramientas de testing
│   ├── playtest-feedback.md
│   ├── observation-sheet.md
│   ├── metrics-dashboard.md
│   └── changelog.md
│
└── validation/               # Scripts de validación
    ├── validate_game_design.py
    ├── validate_puzzle_balance.py
    ├── validate_narrative.py
    ├── validate_psychology.py
    ├── validate_ux.py
    └── validate_all.py
```

### **2. Archivos JSON de Configuración**

#### **GAME.json (Game Design)**
```json
{
  "id": "juego-ejemplo-001",
  "nombre": "El Crimen de la Calle Mayor",
  "tipo": "hall_escape",
  "duracion_minutos": 60,
  "jugadores": {"min": 2, "max": 6, "optimo": 4},
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

#### **NARRATIVE.json (Storytelling)**
```json
{
  "titulo": "El Último Secreto de Elena",
  "sinopsis": "En 1923, Elena García desapareció...",
  "objetivo_jugador": "Descubrir qué le pasó a Elena",
  "actos": [
    {
      "nombre": "El Hallazgo",
      "emocion_objetivo": "curiosidad",
      "revelaciones": ["Elena tenía relación secreta"]
    }
  ],
  "personajes": [
    {
      "nombre": "Elena García",
      "rol": "Protagonista (ausente)",
      "motivacion": "Escapar de relación tóxica"
    }
  ]
}
```

#### **PSYCHOLOGY.json (Psicología)**
```json
{
  "curva_flow": [
    {"minuto": 5, "nivel_flow_esperado": 3, "dificultad": 2},
    {"minuto": 30, "nivel_flow_esperado": 7, "dificultad": 5},
    {"minuto": 55, "nivel_flow_esperado": 9, "dificultad": 5}
  ],
  "arquetipos_objetivo": [
    {"tipo": "buscador", "puzzles_asignados": ["puzzle_001"]},
    {"tipo": "logico", "puzzles_asignados": ["puzzle_002"]}
  ],
  "sistema_hints": {
    "tiempo_sin_progreso_nivel_1": 5,
    "autonomia_jugador": true
  }
}
```

#### **UX.json (UX)**
```json
{
  "onboarding": {
    "briefing_duracion_segundos": 150,
    "reglas_maximas": 3
  },
  "accesibilidad": {
    "visual": {"alternativas_audio": true},
    "auditiva": {"subtitulos": true}
  },
  "espacio_fisico": {
    "metros_por_jugador": 1.5,
    "iluminacion_min_lux": 300
  }
}
```

### **3. Validadores Automáticos**

Crear scripts Python que validen automáticamente:

```python
# validate_all.py

def validar_juego_completo(directorio_juego):
    errores = []
    
    # Game Design
    errores += validate_game_design(directorio_juego)
    
    # Puzzle Balance
    errores += validate_puzzle_balance(directorio_juego)
    
    # Narrative Coherence
    errores += validate_narrative(directorio_juego)
    
    # Psychology Flow
    errores += validate_psychology(directorio_juego)
    
    # UX Accessibility
    errores += validate_ux(directorio_juego)
    
    # Technology Reliability
    errores += validate_technology(directorio_juego)
    
    # Testing Metrics
    errores += validate_testing_metrics(directorio_juego)
    
    return errores
```

### **4. Templates de Documentación**

#### **Playtest Feedback Template**
Ver ejemplo completo en `08-testing.md` → Ejemplo 1

#### **Observation Sheet Template**
Ver ejemplo completo en `08-testing.md` → Ejemplo 2

#### **Changelog Template**
Ver ejemplo completo en `08-testing.md` → Template de Changelog

---

## 🚀 Flujo de Trabajo Recomendado

### **Fase 1: Concepto (Días 1-3)**
1. **Game Design:** Definir estructura, flujo, actos
2. **Storytelling:** Crear narrativa, personajes, emociones objetivo
3. **Crear:** GAME.json + NARRATIVE.json

### **Fase 2: Diseño Detallado (Días 4-10)**
1. **Puzzle Design:** Diseñar cada puzzle con ficha completa
2. **Psicología:** Calibrar dificultad, arquetipos, flow
3. **UX:** Definir onboarding, accesibilidad, fricción cero
4. **Crear:** puzzles/*.json + PSYCHOLOGY.json + UX.json

### **Fase 3: Implementación (Días 11-20)**
1. **Escenografía:** Diseñar ambiente, luz, sonido
2. **Tecnología:** Implementar automatización, sensores
3. **Crear:** SCENOGRAPHY.json + TECHNOLOGY.json

### **Fase 4: Testing (Días 21-30)**
1. **Playtest:** 5 sesiones con amigos
2. **Beta:** 12 sesiones con grupos diversos
3. **Iterar:** Ajustar según feedback
4. **Crear:** TESTING.json + testing/ templates

### **Fase 5: Soft Launch (Días 31-40)**
1. **Lanzamiento suave:** 20 sesiones con clientes reales
2. **Métricas:** Monitorear tasas de éxito, satisfacción
3. **Ajustes finales:** Cambios menores
4. **Launch oficial:** Abrir al público general

---

## 📊 Checklist de Lanzamiento

Antes de abrir al público, verificar:

### **Game Design**
- [ ] Estructura de actos clara
- [ ] Flujo de puzzles documentado
- [ ] Objetivo principal en una frase
- [ ] Dificultad calibrada (40-60% éxito esperado)

### **Puzzle Design**
- [ ] Variedad de tipos (no solo candados)
- [ ] Cada puzzle integrado en narrativa
- [ ] Soluciones únicas y auto-validables
- [ ] Pistas documentadas (3 niveles)

### **Storytelling**
- [ ] Briefing < 3 minutos
- [ ] Personajes con profundidad
- [ ] Viaje emocional planificado
- [ ] Desenlace satisfactorio (2-3 min)

### **Psicología**
- [ ] Curva de dificultad progresiva
- [ ] Puzzles para todos los arquetipos
- [ ] Sistema de hints accesible
- [ ] Flow state alcanzable

### **UX**
- [ ] Props funcionan 99%+ del tiempo
- [ ] Feedback inmediato en cada acción
- [ ] Espacio accesible (sillas de ruedas, alturas)
- [ ] Alternativas para puzzles sensoriales

### **Escenografía**
- [ ] Iluminación suficiente (300+ lux)
- [ ] Sonido no repetitivo (loops 15+ min)
- [ ] Props auténticos y duraderos
- [ ] Consistencia temática absoluta

### **Tecnología**
- [ ] Backup manual para todo sistema
- [ ] Latencia < 1 segundo
- [ ] Documentación de mantenimiento
- [ ] Testing diario implementado

### **Testing**
- [ ] Mínimo 15 sesiones completadas
- [ ] Métricas en rango objetivo
- [ ] Feedback negativo investigado
- [ ] Changelog documentado

---

## 🎓 Recursos Adicionales

### **Libros Recomendados**
- *Flow: The Psychology of Optimal Experience* - Mihaly Csikszentmihalyi
- *The Design of Everyday Things* - Don Norman
- *Reality is Broken* - Jane McGonigal

### **Comunidades**
- Room Escape Artist (REA)
- Reddit r/escaperooms
- Escape Room Owner Discord

### **Herramientas**
- Arduino para automatización
- QLab para audio profesional
- DMX software para iluminación

---

## 📝 Contribución

Este sistema de guías es **vivo y mejorable**. Si encuentras:

- Errores o imprecisiones
- Ejemplos mejores
- Frameworks adicionales
- Técnicas probadas

**Contribuye** actualizando las guías correspondientes y documentando el cambio en el changelog.

---

## 🎯 Próximos Pasos

1. **Revisar** cada guía completa antes de diseñar
2. **Aplicar** recomendaciones específicas al template actual
3. **Implementar** validadores automáticos
4. **Testear** rigurosamente siguiendo proceso
5. **Iterar** constantemente basado en feedback real

---

**Recuerda:** Un escape room excelente no es accidental. Es el resultado de **diseño intencional** en las 8 disciplinas, **testing riguroso** y **iteración constante**.

---

* Sistema creado por Generador Agent - Especialista en diseño de escape rooms*  
* Basado en investigación de mejores prácticas de la industria*
