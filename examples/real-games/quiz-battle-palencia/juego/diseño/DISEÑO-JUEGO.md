# Quiz Battle Palencia — Diseño del Juego

## Mecánica Base

### Modo Quiz Normal
| Ronda | Tipo | Preguntas | Tiempo | Dificultad |
|-------|------|-----------|--------|------------|
| 1 | Veloz | 20 | 10s | 1-2 |
| 2 | Imagen | 13 | 15s | 2-3 |
| 3 | Curiosidades | 15 | 15s | 2-3 |
| 4 | Profunda | 15 | 20s | 3-4 |
| 5 | Desafío | 17 | 15-30s | 3-4 |

### Modo "El 1%"
| Fase | % Acierto | Preguntas | Tiempo |
|------|-----------|-----------|--------|
| Fácil | 90%-70% | 16 | 10s |
| Media | 60%-40% | 16 | 15s |
| Difícil | 30%-20% | 16 | 20s |
| Experta | 15%-5% | 14 | 25s |
| 1% | 1% | 10 | 30s |

## Roles (Godot + MQTT)
| Rol | Función | Dispositivos |
|-----|---------|--------------|
| **Presentador** | Controla flujo, valida respuestas, muestra tiempos | 1 (tablet/PC del GM) |
| **Jugador** | Ve pregunta, pulsa respuesta | N tablets (1 por equipo) |
| **Pantalla** | Muestra pregunta + opciones para público | 1 (TV/proyector) |

## Puntuación
- Respuesta correcta: puntos según dificultad (1-4)
- Respuesta incorrecta: 0 puntos
- Bonus de velocidad: +1 punto si respondes en <50% del tiempo

## Categorías (Quiz Normal)
- historia, monumentos, gastronomia, geografia, naturaleza, deportes, tradiciones, cultura_pop, personajes, datos_insólitos

## Requisitos Técnicos
- **Broker MQTT** (Mosquitto) en red local — no necesita internet
- **3+ dispositivos** Godot (presentador + N jugadores + pantalla)
- **100% offline** tras setup inicial

## Estado del MVP
| Componente | Estado |
|------------|--------|
| Bootstrap / role select | ✅ Funcional |
| Game state management | ✅ Funcional |
| MQTT sync (presenter → clients) | ✅ Funcional |
| Lock por equipo | ✅ Funcional |
| Preguntas normales Palencia | ✅ 80 preguntas (13 corregidas) |
| Preguntas "El 1%" | ✅ 76 preguntas (5 corregidas) |
| Normalización JSON → Godot | ⚠️ Pendiente (formatos incompatibles) |
| MQTT configurable (host/port) | ⚠️ Pendiente |
| Filtro respuesta correcta a jugadores | 🚨 BUG (se filtra) |
| UI/UX pulida | ⚠️ MVP funcional |
