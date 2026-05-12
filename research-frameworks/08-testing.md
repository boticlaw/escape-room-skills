# 08 - Testing en Escape Rooms
## Cómo mejora la iteración: validar, ajustar, perfeccionar

---

## 📋 Resumen Ejecutivo

Testing en escape rooms es el **proceso iterativo** que separa juegos buenos de excelentes. No es opcional: es obligatorio. Sin testing, los diseñadores son ciegos a los problemas que solo los jugadores revelan. El objetivo es identificar **fricción injusta**, **dificultad desbalanceada** y **momentos de confusión** antes de abrir al público.

---

## 🎯 Principios Clave

### 1. **Test Early, Test Often**
- Prototipar rápido (aunque sea con papel)
- Testing desde las primeras versiones jugables
- Iterar constantemente, no esperar al final

### 2. **Diversidad de Testers**
- Novatos vs. expertos
- Diferentes tamaños de grupo (2, 4, 6 jugadores)
- Diversidad de edades, habilidades, idiomas
- Amigos vs. extraños (sesgo de honestidad)

### 3. **Observación > Preguntas**
- Ver cómo juegan es más valioso que lo que dicen
- Puntos de confusión, fricción, aburrimiento
- Dónde se atascan, qué ignoran, qué les emociona

### 4. **Datos Cuantitativos + Cualitativos**
- **Cuantitativo:** Tiempo por puzzle, hints usados, éxito/fracaso
- **Cualitativo:** Frustración, satisfacción, momentos memorables

### 5. **Iterar Sin Miedo**
- Cambiar lo que no funciona, aunque duela
- No aferrarse a ideas por "sunk cost"
- Versionar cambios (v1.0 → v1.1 → v1.2)

### 6. **Testing Continuo Post-Lanzamiento**
- No termina cuando abre al público
- Monitorear métricas constantemente
- Ajustar según feedback real de clientes

---

## 🔧 Tipos de Testing

### **1. Playtesting (Fase Inicial)**
| Aspecto | Detalle |
|---------|---------|
| **Cuándo** | Tan pronto hay versión jugable (aunque sea tosca) |
| **Quién** | Amigos cercanos, otros diseñadores |
| **Objetivo** | Funcionalidad básica, ¿se puede jugar? |
| **Método** | Observación directa, notes en tiempo real |
| **Iteraciones** | 3-5 sesiones antes de beta |

### **2. Beta Testing (Fase Intermedia)**
| Aspecto | Detalle |
|---------|---------|
| **Cuándo** | Versión más pulida, casi lista |
| **Quién** | Grupos diversos (10-15 sesiones) |
| **Objetivo** | Balance, dificultad, experiencia general |
| **Método** | Observación + cuestionario post-juego |
| **Iteraciones** | Ajustar entre cada sesión si es crítico |

### **3. Soft Launch (Fase Final)**
| Aspecto | Detalle |
|---------|---------|
| **Cuándo** | Versión "final", listo para público |
| **Quién** | Clientes reales (tarifa reducida o gratis) |
| **Objetivo** | Validar en condiciones reales de operación |
| **Método** | Métricas + reviews + feedback espontáneo |
| **Iteraciones** | Ajustes menores basados en datos reales |

---

## 📊 Métricas Clave a Monitorear

### **Métricas de Rendimiento**
| Métrica | Bueno | Preocupante | Acción |
|---------|-------|-------------|--------|
| **Tasa de éxito** | 40-60% | <20% o >80% | Ajustar dificultad |
| **Tiempo promedio** | 50-55 min (en juego de 60) | <40 o >60 | Añadir/quitar puzzles |
| **Hints por partida** | 2-4 | 0 o >8 | Ajustar claridad/dificultad |
| **Puzzles resueltos** | 80-95% | <70% | Simplificar o añadir hints |

### **Métricas de Satisfacción**
| Métrica | Bueno | Preocupante | Acción |
|---------|-------|-------------|--------|
| **NPS (Net Promoter Score)** | >50 | <20 | Revisar experiencia general |
| **Satisfacción (1-10)** | >8 | <6 | Identificar puntos de dolor |
| **Recomendación%** | >70% | <40% | Investigar qué falló |

### **Métricas de Puzzles Individuales**
| Métrica | Bueno | Preocupante |
|---------|-------|-------------|
| **Tiempo promedio** | 3-8 min | <2 (muy fácil) o >15 (muy difícil) |
| **Tasa de éxito sin hints** | >60% | <30% |
| **Frustración reportada** | <20% | >50% |

---

## 🔍 Qué Observar Durante Testing

### **Señales de Problemas**
- Jugadores **miran el reloj constantemente** (aburrimiento)
- **>5 minutos sin progreso** en un puzzle (frustración)
- **Ignoran objetos obvios** (signaling falló)
- **Sobre-piensan puzzles simples** (demasiada ambigüedad)
- **No colaboran** (diseño no fomenta teamwork)
- **Piden hints excesivamente** (dificultad mal calibrada)

### **Señales de Éxito**
- **Flow visible:** Dejan de mirar reloj, inmersos
- **Comunicación fluida:** Comparten descubrimientos emocionados
- **"Aha moments":** Expresiones de iluminación satisfactoria
- **Adrenalina al final:** Urgencia positiva, no pánico
- **Celebración real:** Alegría genuina al escapar

---

## ⚠️ Errores Comunes en Testing

### 1. **Testear Solo con Amigos**
- **Problema:** Amigos son amables, no honestos
- **Solución:** Incluir extraños, grupos diversos

### 2. **No Documentar Observaciones**
- **Problema:** Olvidan lo que vieron después de 2 días
- **Solución:** Notes en tiempo real, grabar sesiones (con permiso)

### 3. **Testear Insuficientemente**
- **Problema:** 2-3 sesiones no revelan problemas reales
- **Solución:** Mínimo 10-15 sesiones antes de lanzar

### 4. **No Iterar Entre Tests**
- **Problema:** Repiten mismo test sin cambios
- **Solución:** Ajustar rápidamente, testear versión mejorada

### 5. **Ignorar Feedback Negativo**
- **Problema:** Solo escuchan lo positivo, descartan críticas
- **Solución:** Feedback negativo es oro, investigar a fondo

### 6. **Testing Solo de Dificultad**
- **Problema:** Solo ajustan puzzles, ignoran narrativa/UX
- **Solución:** Testear experiencia completa, no solo mecánicas

---

## ✅ Checklist de Testing

### **Pre-Testing**
- [ ] Versión jugable funcional completa
- [ ] Sistema de hints implementado
- [ ] GM entrenado en observación
- [ ] Cuestionario post-juego listo
- [ ] Consentimiento para grabar (si aplica)

### **Durante Testing**
- [ ] Observar sin intervenir (excepto emergencias)
- [ ] Anotar tiempos por puzzle
- [ ] Registrar hints solicitados
- [ ] Notar momentos de confusión/frustración
- [ ] Identificar "aha moments" exitosos

### **Post-Testing**
- [ ] Cuestionario inmediato (memoria fresca)
- [ ] Entrevista corta (5-10 min)
- [ ] Revisar métricas cuantitativas
- [ ] Identificar patrones entre sesiones
- [ ] Priorizar ajustes (críticos vs. nice-to-have)

### **Iteración**
- [ ] Cambios documentados (changelog)
- [ ] Versión nueva numerada (v1.1)
- [ ] Re-testear cambios específicos
- [ ] Validar que no rompió nada más

---

## 💡 Ejemplos de Implementación

### **Ejemplo 1: Cuestionario Post-Juego**
```markdown
# Cuestionario de Playtest - Escape Room "El Crimen de Elena"

## Experiencia General (Círcula del 1-10)
- Satisfacción general: 1 2 3 4 5 6 7 8 9 10
- Dificultad percibida: 1 (muy fácil) ... 10 (imposible)
- Probabilidad de recomendar: 1 2 3 4 5 6 7 8 9 10

## Puzzles Específicos
¿Cuál puzzle te gustó más? ¿Por qué? ___________
¿Cuál fue más frustrante? ¿Por qué? ___________
¿Hubo alguno que no entendiste? ___________

## Narrativa
¿La historia te enganchó? Sí / No
¿Recordarías la trama en 1 semana? Sí / No
¿Qué personaje te generó más empatía? ___________

## Colaboración
¿Sentiste que todos aportaron? Sí / No
¿Hubo momentos donde no sabías qué hacer? Sí / No

## Abierto
¿Qué cambiarías? ___________
¿Qué momento más recuerdas? ___________
```

### **Ejemplo 2: Hoja de Observación del GM**
```markdown
# Observación de Playtest - Sesión #7

Grupo: 4 jugadores (amigos, 25-30 años, 2 con experiencia previa)
Fecha: 2024-03-15
GM: Carlos

## Timeline de Observaciones

**Min 0-10 (Exploración):**
- [ ] Exploraron toda la sala sistemáticamente ✓
- [ ] Encontraron objetos clave rápido ✓
- Nota: Ignoraron foto en escritorio (¿mala signaling?)

**Min 10-25 (Primeros Puzzles):**
- [ ] Puzzle 1 resuelto en 4 min (bien)
- [ ] Puzzle 2: 8 min, 1 hint solicitado
- Nota: Confundieron orden de pistas, añadir numeración?

**Min 25-45 (Desarrollo):**
- [ ] Puzzle 3: 12 min, SIN hints (excelente)
- [ ] Puzzle 4: 15 min, 2 hints (frustración visible)
- Nota: Se bloquearon en cifrado, considerar pista más clara

**Min 45-60 (Climax):**
- [ ] Meta-puzzle: 10 min, 1 hint
- [ ] Escaparon en min 58
- Nota: Celebración genuina, emocionados

## Métricas
- Hints totales: 4 (aceptable)
- Tiempo total: 58 min
- Puzzles resueltos: 5/5
- Tasa éxito: 100%

## Acciones Recomendadas
1. Mejorar signaling en foto inicial (luz focal)
2. Añadir pista nivel 1 más clara en puzzle 4
3. Numerar pistas de puzzle 2 para evitar confusión
```

### **Ejemplo 3: Proceso de Iteración**
```
PROBLEMA IDENTIFICADO (Test #5):
Puzzle 4 tiene tasa de éxito sin hints de 20% (muy baja)
Tiempo promedio: 14 min (demasiado)

ANÁLISIS:
- Cifrado demasiado complejo para jugadores novatos
- Pista nivel 1 no guía suficiente
- Información dividida físicamente confunde

ITERACIÓN (v1.1):
1. Simplificar cifrado (César +3 → +1)
2. Reescribir pista nivel 1: "Busca patrones en las letras"
3. Mover información divisionada a misma área

RE-TEST (Test #7):
- Tasa éxito sin hints: 55% (mejora significativa)
- Tiempo promedio: 7 min (aceptable)
- Frustración reportada: 15% (bajó de 60%)

VALIDACIÓN:
Cambio exitoso, mantener en v1.1
```

---

## 🛠️ Aplicación al Template

### **TESTING.json**
```json
{
  "fases": {
    "playtest": {
      "sesiones_objetivo": 5,
      "grupos": ["amigos", "diseñadores"],
      "cambios_mayores_permitidos": true
    },
    "beta": {
      "sesiones_objetivo": 12,
      "grupos": ["diversos", "novatos_y_expertos"],
      "cambios_menores_permitidos": true
    },
    "soft_launch": {
      "sesiones_objetivo": 20,
      "grupos": ["clientes_reales"],
      "solo_ajustes_menores": true
    }
  },
  
  "metricas_objetivo": {
    "tasa_exito": 0.5,
    "tiempo_promedio_min": 55,
    "hints_promedio": 3,
    "satisfaccion_min": 8,
    "nps_min": 50
  },
  
  "herramientas": {
    "cuestionario_postjuego": "google_forms",
    "grabacion": "con_permiso",
    "hoja_observacion_gm": "markdown_template",
    "changelog": "git_repo"
  }
}
```

### **Template de Changelog**
```markdown
# Changelog - El Crimen de Elena

## v1.2 (2024-03-20)
### Fixed
- Simplificado cifrado en Puzzle 4 (César +3 → +1)
- Mejorada signaling en foto inicial (añadido spotlight)

### Changed
- Pistas nivel 1 reescritas para más claridad

## v1.1 (2024-03-18)
### Added
- Numeración en pistas de Puzzle 2

### Fixed
- Bug en maglock de puerta final (no abría)

## v1.0 (2024-03-15)
- Versión inicial post-playtest
```

---

## 📚 Referencias

- **Playtesting 101:** Game design textbooks
- **User Testing Methods:** Nielsen Norman Group
- **Escape Room Design Community:** Reddit r/escaperooms, REA forums

---

## 🎓 Conclusión

Testing no es un paso, es un **proceso continuo**. Cada juego debe pasar por múltiples rondas de validación antes de lanzarse, y seguir iterando después. Los diseñadores que testean rigurosamente crean experiencias **memorablemente buenas**, no solo funcionales.

---

*Guía creada como parte del sistema de mejora de templates de escape rooms - Generador Agent*
