# Game Type: Concurso / Quiz Battle

## Overview

Competitive quiz-style event where teams face rounds of questions, mini-games, and elimination challenges. Inspired by TV game shows like "El 1%" (Antena 3). Not a traditional escape room — it's a fast-paced, high-energy competition format with puzzles, trivia, and physical mini-games.

## Constraints

| Parameter | Value |
|---|---|
| Space | Indoor, 30+ m² (classroom, hall, or gym) |
| Equipos | 2-3 equipos simultáneos |
| Duration | 50-60 minutos |
| Technology | Godot app + MQTT (offline) OR tablets with quiz app; projector for display |
| Staff | 1 Presentador (host) + optional screen operator |
| Internet | NOT required (offline-first) |
| Budget | ~30-50€ (minimal physical materials) |

## Recommended Mechanics

| Priority | Mechanics |
|---|---|
| Core | investigacion-texto (trivia), emparejamiento-texto (matching), comunicacion-mensajes (team coordination) |
| Mini-games | Destreza física (bolígrafo en botella, cucharas con pelota), Precisión (gomitas en vaso, anillos en botellas), Equilibrio (stack de donuts, galleta en cara), Velocidad (ordenar monedas, abrochar camisa) |
| Supporting | logica-secuencial (deduction rounds), memoria (memory rounds) |
| Digital | panel-control-app (quiz app), tablet-cooperativo (team answer submission) |
| Avoid | gps-navegacion, ubicacion-qr (indoor-only), mecanismo (no physical locks needed) |

## Flow Structure

- **Rondas progresivas**: Questions ordered by difficulty (easy → hard)
- **Eliminación**: Wrong answer in easy rounds = elimination; hard rounds allow "buying" a pass
- **Mini-games intercalados**: 3-5 physical challenges between question rounds to break pacing
- **Scoring**: Points per round (1st = 100pts, 2nd = 60pts, 3rd = 30pts)

### Typical Round Structure

```
Ronda Veloz (10s/pregunta) → Mini-game → Ronda de Imagen → Mini-game → 
Ronda Curiosidades → Mini-game → Ronda Profunda → Ronda Desafío → Final
```

## Design Adaptations

- **Two modes possible**:
  1. **Cultura local**: Trivia about local history, monuments, gastronomy, traditions, geography
  2. **Lógica/Deducción**: "El 1%" style — progressive difficulty from 90% to 1% solvability
- **Presentador** is active (unlike escape rooms with ZERO GM) — host reads questions, judges mini-games, controls pacing
- **Material por equipo**: Each team needs their own set of mini-game materials
- **Pantalla compartida**: Projector shows questions, timer, scores — all teams see the same
- **Tablets**: Optional for answer submission; can also use paper/buzzer
- **Idioma**: Questions and answers in the local language (Spanish by default)
- **Anti-cheat**: Teams physically separated; no phones during question rounds
- **Empate**: Sudden-death mini-game to break ties

## Question Categories

| Category | Example Topics |
|----------|---------------|
| Historia | Local founding events, key historical figures, dates |
| Monumentos | Landmarks, architecture, artworks |
| Gastronomía | Local dishes, ingredients, restaurants |
| Geografía | Rivers, mountains, regions, borders |
| Tradiciones | Festivals, customs, folklore |
| Naturaleza | Local flora, fauna, natural features |
| Deportes | Local teams, athletes, venues |
| Lógica | Deduction, lateral thinking, pattern recognition |

## Mini-Game Categories

| Category | Examples | Difficulty |
|----------|----------|-----------|
| Destreza | Bolígrafo en botella, cucharas con pelota | 2-3 |
| Precisión | Gomitas en vaso, anillos en botellas, monedas en vaso | 1-3 |
| Equilibrio | Stack de donuts, galleta en cara, vaso en cabeza | 1-2 |
| Velocidad | Ordenar monedas, abrochar camisa, escribir al revés | 1-3 |
| Cerebro | Escribir al revés | 3 |
| Trabajo equipo | Aparcamiento del cucharón (vendado + guía) | 2 |

## Validations

- [ ] Questions have exactly 1 correct answer among options
- [ ] Difficulty progression makes sense (easy → hard within each round)
- [ ] Each question includes a "dato" (fun fact) for educational value
- [ ] Mini-games use accessible, cheap materials (~30€ total)
- [ ] Duration per mini-game ≤ 60 seconds
- [ ] Total game fits within time budget (50-60 min)
- [ ] All teams can participate simultaneously or in rapid rotation
- [ ] Tie-breaking mechanism exists

## Real Example

**Quiz Battle Palencia** — Full production game:
- 80 preguntas de cultura palentina (5 rondas: veloz, imagen, curiosidades, profunda, desafío)
- 76 preguntas "El 1%" (lógica/deducción, dificultad 90% → 1%)
- 20 minijuegos físicos documentados en `minijuegos.json`
- App Godot 4.6 + MQTT (offline)
- Deployado en eventos Viernes de Escape

## Differences from Other Game Types

| Aspect | Concurso | Hall Escape | Street Escape | Investigation |
|--------|----------|-------------|---------------|---------------|
| GM Role | Active host | Invisible | Invisible | Minimal |
| Competition | Team vs team | Team vs clock | Team vs clock | Team vs mystery |
| Puzzles | Trivia + mini-games | Physical + logic | GPS + exploration | Deduction + evidence |
| Duration | 50-60 min | 50-60 min | 60-90 min | 45-60 min |
| Narrative | Light (host personality) | Heavy | Heavy | Central |
| Physical space | Classroom/hall | Dedicated room | Streets | Room with props |
