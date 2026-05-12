# Viernes de Escape — Especificaciones del Proyecto

## Formato del Evento
- **Pases:** 2 por evento
- **Grupos por pase:** 1-2 (puede ser competitivo 2 grupos simultáneos o 1 grupo)
- **Jugadores por grupo:** 5-6
- **Total jugadores (máx):** ~24
- **Duración:** 45-55 minutos por pase
- **Dificultad media:** 4-5/10

## Espacio
- **Salas:** 5, secuenciales
- **Cerradura de puertas:** Llave física (el GM abre la puerta cuando el grupo completa la prueba)
- **Tablets:** 4 disponibles, modo **standalone** (sin servidor, sin WiFi, sin sincronización)
- **Conexión a internet:** No necesaria
- **Presupuesto materiales:** ~100-150€ por juego

## Público
- **Edad:** 12-18 años (jóvenes)
- **Estilo:** Diversión + aprendizaje educativo integrado naturalmente

## Rol del GM
- **Invisible** — interviene lo menos posible
- No guía ni explica rutas
- Da pistas SOLO cuando se piden (3 niveles: sutil → directa → casi solución)
- **Todos los grupos terminan el juego completo** — no hay opción a perder. Si un grupo está bloqueado, el GM escala pistas hasta resolver si hace falta
- El tiempo límite no es game over — si se acaba el tiempo, el GM acelera las pruebas restantes
- Abre puertas con llave cuando el grupo completa una prueba
- Resuelve problemas técnicos
- Supervisa fair play
- Genera momentos de energía

## Principios de Diseño (de ESTILO-JUEGOS.md)

### Fundamentales
1. **Todo el equipo activo siempre** — 5-6 jugadores = 5-6 roles implícitos
2. **Físico > Digital** — lo digital es apoyo, no protagonista
3. **El contenedor cuenta** — maletas, cofres, carpetas como parte de la experiencia
4. **Doble descubrimiento** — cada prueba tiene 2 capas de "¡aha!"
5. **La temática no es decoración** — cada prueba conecta con el tema real
6. **Audio máximo 60s** — solo para contexto/pistas, nunca mecánica central
7. **Cada puzzle ≥2 fases** — encontrar+interpretar, ordenar+revelar, superponer+deducir

### Curva de dificultad
- Entrada suave (2-3) → progresión (4-5) → pico (5-6) → recompensa rápida antes del final (3-4)
- La última prueba NO debe ser la más difícil

### Variedad de cierres
- Máximo 3 del mismo tipo (ej: 3 candados numéricos)
- Mezclar: candado numérico, alfanumérico, llave física, cryptex, emisor FM…
- Cada código tiene un origen lógico deducible por los jugadores

### Estructura típica
- 6 pruebas + meta-prueba final opcional
- Misterio secundario/hilo conductor (piezas que se combinan al final)
- Cartas de navegación que indican dónde ir después
- Símbolos visuales en puertas para orientación
- Tono: misterioso pero accesible, sin terror ni gore

### Checklist por prueba
- [ ] ¿4-6 jugadores activos simultáneamente?
- [ ] ¿Doble descubrimiento?
- [ ] ¿Contenedor/materiales con sentido narrativo?
- [ ] ¿Mecánica refleja la temática?
- [ ] ¿Audio ≤60s?
- [ ] ¿3 niveles de pistas?
- [ ] ¿Código con origen lógico?

### Documentación por juego
- BRIEF.json
- OVERVIEW.md (narrativa paso a paso)
- juego/diseño/DISEÑO-JUEGO.md (tabla maestra)
- juego/diseño/NARRATIVA.md (historia, personajes)
- juego/diseño/PISTAS-GM.md (sistema de hints)
- juego/diseño/LOGISTICA.md (cronograma, personal)
- juego/diseño/GUIA-JUGADORES.md (para GMs)
- juego/diseño/VALIDACION.md (checklist)
- juego/pruebas/*.json (fichas por prueba)
- juego/materiales/lista-materiales.md (compras)

## Juegos del Proyecto
| Juego | Tema | Estado |
|-------|------|--------|
| Legado Tinta Violeta | Escritoras palentinas | v4.1 completo |
| Protocolo Alerta Verde | Medio ambiente / sabotaje ecológico | Completo |
| Test de Touring | IA y sus peligros | En diseño |
| Quiz Battle Palencia | Cultura palentina + lógica | MVP funcional (Godot+MQTT) |
