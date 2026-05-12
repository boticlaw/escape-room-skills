# Quiz Battle Palencia — Overview

## Concepto
**Concurso competitivo** estilo "El 1%" (Arturo Valls, Antena 3) adaptado a temática palentina. Los equipos compiten respondiendo preguntas de cultura general sobre Palencia, lógica y pensamiento lateral.

## Ficha Técnica
| Campo | Valor |
|-------|-------|
| **Tipo** | Actividad competitiva (battle) |
| **Plataforma** | Godot 4.6 + MQTT (offline) |
| **Repo** | github.com/danielgap/quiz |
| **Jugadores** | 2 equipos (hasta 24 jugadores) |
| **Duración** | 20-30 min |
| **Rol** | Actividad central o desempate entre salas |

## Dos Modos de Juego
1. **Quiz Normal** — 80 preguntas de cultura palentina (historia, monumentos, gastronomía, geografía, tradiciones, naturaleza, deportes)
2. **Quiz "El 1%"** — 76 preguntas de lógica, deducción y pensamiento lateral (dificultad progresiva del 90% al 1%)

## Flujo del Juego
1. **Bootstrap** — Selección de rol (Presentador / Jugador / Pantalla)
2. **Rondas progresivas** — Preguntas ordenadas por dificultad
3. **Eliminación** — Fallo en ronda fácil = eliminación directa; en rondas duras se puede "comprar" pase
4. **Victoria** — Último equipo en pie gana

## Archivos
- `preguntas.json` — 80 preguntas normales (rondas: veloz, imagen, curiosidades, profunda, desafio)
- `preguntas-1pct.json` — 76 preguntas estilo "El 1%" (lógica/deducción)
- `prd.md` — PRD del juego Godot+MQTT
- `ANALISIS-REPO-QUIZ.md` — Análisis técnico completo del repo
- `JUDGE-REPORT-normales.md` — Revisión de preguntas normales
