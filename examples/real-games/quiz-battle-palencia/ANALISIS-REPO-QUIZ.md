# Análisis del Repositorio Quiz-Offline (Godot 4.6 + MQTT)

**Fecha:** 2026-04-23  
**Repo analizado:** `/tmp/quiz-analysis`  
**Propósito:** Evaluación exhaustiva del MVP de quiz interactivo offline para integración con Viernes de Escape

---

## 1. Stack Tecnológico

| Componente | Tecnología | Detalle |
|---|---|---|
| Motor | **Godot 4.6** | `config_version=5`, features `PackedStringArray("4.6")` |
| Lenguaje | **GDScript** | 100% del código. Sin C#/GDExtension |
| Protocolo | **MQTT v3.1.1** | Broker Mosquitto en red local (Termux Android o PC) |
| Addon MQTT | **Vendoreado + parcheado** | `/addons/mqtt/mqtt.gd` — implementación pura GDScript de MQTT, parche UTF-8 aplicado |
| Datos | **JSON local** | `res://data/preguntas.json` — sin base de datos |
| Testing | **Headless/E2E** | `smoke_runner.gd` (validación de escenas) + `e2e_runner.gd` (flujo completo por CLI args) |
| Persistencia | **`user://presenter_session.json`** | Solo del lado presentador, guarda estado + preguntas usadas |
| Resolución | **1280×720**, stretch `canvas_items` + `expand` | Responsive para tablets |

**No hay:** audio, animaciones, ESP32 firmware, scripts Python, PlatformIO, hardware wiring. Todo eso está en el PRD pero no implementado.

---

## 2. Arquitectura

### 2.1 Autoloads (singletones globales)

Se registran en `project.godot` en este orden:

| Autoload | Clase | Responsabilidad |
|---|---|---|
| **AppState** | `app_state.gd` | Estado compartido: rol, team_id, GameState actual. Emite signals de cambio. |
| **ContentRepo** | `content_repo.gd` | Carga preguntas desde `preguntas.json`. Filtrado por ronda. |
| **GameService** | `game_service.gd` | ** cerebro del juego**. Lógica de arbitraje, corrección, persistencia, publicación MQTT. |
| **MqttBus** | `mqtt_bus.tscn` (contiene `mqtt.gd`) | Wrapper del addon MQTT. Subscribe, publish JSON, reconexión automática de suscripciones. |

### 2.2 Jerarquía de scenes/scripts

```
main.tscn (bootstrap)
├── RoleSelect (scene) → role_select_controller.gd
└── ActiveRoot (swap dinámico)
    ├── presenter_root.tscn → presenter_root_controller.gd
    ├── contestant_root.tscn → contestant_controller.gd
    └── display_root.tscn → display_controller.gd
```

### 2.3 Modelos core

| Archivo | Clase | Propósito |
|---|---|---|
| `enums.gd` | `Enums` | AppRole, GamePhase, AnswerFeedbackStatus, TeamLockState + helpers de nombre |
| `game_state.gd` | `GameState` | Objeto inmutable-style con `duplicate_state()`. to_dict/from_dict. |
| `question.gd` | `Question` | Modelo de pregunta con `to_dict()`, `to_public_dict()` (sin correcta), `from_dict()` |
| `message_topics.gd` | `MessageTopics` | Constantes de topics MQTT |
| `message_codec.gd` | `MessageCodec` | Codificación/decodificación JSON + serialización GameState |

### 2.4 Patrón de diseño

- **Presentador = autoridad única**: publica estado, los demás escuchan.
- **State broadcast**: el presentador publica el `GameState` completo en `concurso/estado` con retain=true. Los clientes se sincronizan al conectar.
- **Command pattern**: respuestas, puntos, locks van por topics específicos.
- **Signal-driven**: toda la UI se actualiza vía signals (`game_state_changed`, `scores_changed`).
- **No hay networking directa**: todo pasa por MQTT.

---

## 3. Flujo del Juego

### 3.1 Bootstrap

```
main.tscn carga
  → RoleSelect visible (3 botones: Presentador/Concursante/Pantalla + selector equipo)
  → Usuario elige rol
  → main.gd instancia la scene del rol y la mete en ActiveRoot
  → GameService.initialize_role() conecta MQTT y restaura sesión (si presentador)
```

### 3.2 Flujo del Presentador

```
1. Selecciona ronda (OptionButton)
2. Selecciona pregunta específica O pulsa "Aleatoria"
3. [Load] → GameService carga pregunta → publica estado MQTT
4. Mesa abierta → espera respuestas de equipos
5. Llega primera respuesta → mesa se cierra (LOCKED)
6. Presentador marca Correcta/Incorrecta
7. [Reveal] → muestra respuesta correcta en pantalla
8. Ajusta puntajes (+100/-100 por equipo)
9. Puede: reabrir pregunta, resetear locks, forzar turno a equipo
10. Siguiente pregunta
```

### 3.3 Flujo del Concursante

```
Espera estado MQTT → 
  Si QUESTION + answers_enabled + su equipo puede responder:
    → Botones A/B/C/D habilitados
    → Pulsa uno → submit_answer() → publica en concurso/respuesta
  Si LOCKED (respondió otro):
    → Botones deshabilitados, mensaje de espera
  Si REVEAL:
    → Ve si fue correcta/incorrecta + respuesta correcta
```

### 3.4 Flujo de la Pantalla

```
Escucha concurso/estado (retained):
  → Renderiza: pregunta, opciones, marcador, estado de equipos
  → Marca visualmente la opción seleccionada (⏳/✅/❌/🔒)
  → En REVEAL: muestra ✅ en la correcta
```

### 3.5 Fases del juego (GamePhase)

```
IDLE → QUESTION → LOCKED → REVEAL → (siguiente pregunta)
                   ↑         ↓
              (reopen)  (nueva pregunta)
```

---

## 4. Sistema de Preguntas

### 4.1 Formato JSON (archivo)

```json
{
  "id": 1,
  "ronda": "Ronda Veloz",
  "categoria": "historia",
  "texto": "¿Pregunta?",
  "opciones": ["A", "B", "C", "D"],
  "correcta": "B",
  "dato_curioso": "Dato",
  "tiempo": 10,
  "dificultad": "facil"
}
```

### 4.2 Mapeo Question.from_dict()

Soporta **doble nomenclatura** (español + inglés):
- `ronda` / `round` → `round_name`
- `texto` / `text` → `text`
- `categoria` / `category` → `category`
- `correcta` / `correct` → `correct_option`
- `opciones` / `options` → `options`

### 4.3 Datos de ejemplo (lo que trae el repo)

Solo **3 preguntas** de ejemplo genéricas:
1. ¿En qué continente se encuentra Egipto? (historia, Ronda Veloz)
2. ¿Cuál es el planeta más grande? (ciencia, Curiosidades)
3. ¿Capital de Japón? (geografía, Desafío)

### 4.4 Carga

- `ContentRepo._ready()` → carga automática de `res://data/preguntas.json`
- Filtrado por ronda → `get_questions_for_round()`
- Selección aleatoria con tracking de usadas → `_pick_random_question()` prioriza no usadas

### 4.5 to_public_dict() — clave de seguridad

El modelo `Question` tiene **dos** serializaciones:
- `to_dict()` → incluye `correct`, `dato_curioso` (para presentador/persistencia)
- `to_public_dict()` → **sin correcta ni trivia** (para broadcast MQTT a pantallas/equipos)

Esto previene que la respuesta correcta llegue a los dispositivos de los jugadores.

---

## 5. Comunicación MQTT

### 5.1 Topics definidos

| Constante | Topic | Dirección | Uso |
|---|---|---|---|
| STATE | `concurso/estado` | Presentador → Todos | Snapshot completo del GameState (retain=true, QoS 1) |
| ANSWER | `concurso/respuesta` | Concursante → Presentador | `{equipo, opcion}` |
| POINTS | `concurso/puntos` | Presentador → Pantalla | `{equipo, total}` |
| TABLET_LOCK | `concurso/tablet/lock` | Externo → Jugador | `true`/`false` (bloqueo global de tablets) |
| BUZZER | `concurso/pulsar` | ESP32 → Todos | **Definido pero no implementado en Godot** |
| AUDIO | `concurso/audio` | Presentador → Pantalla | **Definido pero no implementado** |

### 5.2 Protocolo de estado

El presentador publica el **GameState completo** serializado como JSON en `concurso/estado` con retain=true. Esto significa:

- Cualquier dispositivo que se conecte recibe inmediatamente el último estado
- No hay handshake ni negociación
- El estado incluye: fase, pregunta (sin correcta), scores, locks, equipo activo, feedback

### 5.3 Flujo de respuesta

```
Concursante pulsa botón → submit_answer("B")
  → MqttBus.publish_json("concurso/respuesta", {equipo: 2, opcion: "B"})
  → Presentador recibe en _on_mqtt_message_received
  → Valida: phase==QUESTION, answers_enabled, no hay respuesta previa
  → Cierra mesa (LOCKED), marca equipo, publica nuevo estado
```

### 5.4 Conexión MQTT

- Host/port **hardcodeados**: `127.0.0.1:1883` (constantes en `game_service.gd`)
- URL construida como `tcp://host:port/`
- MqttBus reconecta suscripciones automáticamente al reconectar
- El addon MQTT es implementación pura GDScript (TCP directo, no usa librerías nativas)

---

## 6. Estado del Proyecto

### ✅ Funcionando (MVP validado)

- Selector de rol (3 roles + selector de equipo)
- Carga de preguntas desde JSON con doble nomenclatura
- Selector de presentador: filtro por ronda, por pregunta, aleatoria
- Preview privada de pregunta (muestra correcta + tiempo)
- Tracking de preguntas usadas en sesión
- Persistencia local del presentador (`user://presenter_session.json`)
- Restauración de sesión al reiniciar
- Flujo completo: cargar → abrir → responder → corregir → revelar
- Arbitraje fino: bloquear/habilitar equipos, forzar turno manual
- Ajuste manual de puntajes (+100/-100)
- Reabrir pregunta, resetear locks
- Sync MQTT con retain — cualquier cliente se pone al día al conectar
- Smoke tests + E2E tests headless con CLI args (`--role=presenter`)
- Seguridad: `to_public_dict()` no filtra la correcta

### ❌ No implementado (definido en PRD)

- **Audio/Soundboard** — topics definidos pero sin implementación
- **Minijuegos** — `GamePhase.MINIGAME` definido pero sin lógica
- **ESP32 pulsadores** — topic `concurso/pulsar` definido, no consumido
- **Animaciones** — UI es labels + botones planos, sin transiciones
- **Resultados finales** — `GamePhase.RESULTS` definido pero sin UI
- **Timer/Cuenta atrás** — `timeout_seconds` en preguntas pero sin countdown visible
- **Imágenes** — Ronda Imagen del PRD sin soporte
- **Música de fondo** — no implementado
- **Configuración de red** — host/port hardcodeados, sin UI de configuración
- **ESP32 firmware** — no hay código Arduino/PlatformIO
- **Scripts Python** — no hay scripts de setup/backup

### ⚠️ Hardcodeado vs Configurable

| Item | Estado | Nota |
|---|---|---|
| MQTT host/port | ❌ Hardcodeado `127.0.0.1:1883` | Necesita ser configurable para la tablet |
| Nº de equipos | ❌ Hardcodeado `[1, 2, 3]` | En `TEAM_IDS` y `GameState` |
| Delta de puntos | ❌ Hardcodeado ±100 | Sin configuración de valor |
| Path preguntas | ❌ Hardcodeado `res://data/preguntas.json` | Funciona pero inflexible |
| QoS | ✅ Constantes | `SNAPSHOT_QOS=1`, `COMMAND_QOS=1` |
| Retain | ✅ Constante | `SNAPSHOT_RETAIN=true` |
| Resolución | ✅ Configurable en project.godot | 1280×720, stretch mode |

---

## 7. Integración con Viernes de Escape

### 7.1 Estado de las preguntas de Palencia

Ya existe un banco en `/quiz-battle-palencia/preguntas.json` con preguntas reales de Palencia:

- Formato actual: `{id, ronda, categoria, pregunta, opciones, correcta, dificultad, dato, tiempo}`
- Formato del repo: `{id, ronda, categoria, texto, opciones, correcta, dificultad, dato_curioso, tiempo}`

### 7.2 Mapeo necesario

El `Question.from_dict()` ya soporta ambos formatos gracias al doble mapeo:

| Campo Palencia | Campo Repo | Compatible |
|---|---|---|
| `pregunta` | `texto` | ✅ `from_dict` acepta ambos |
| `dato` | `dato_curioso` | ⚠️ Hay que verificar que matchea `dato_curioso` |
| `dificultad` (numérico) | `dificultad` (texto) | ❌ Incompatibilidad: Palencia usa `1/2/3`, repo espera `"facil"/"media"` |

**Problema principal:** `dificultad` es numérico en Palencia vs string en el repo. Y el campo de dato curioso difiere (`dato` vs `dato_curioso`). El `from_dict()` no tiene fallback para `dato`.

### 7.3 Plan de integración

1. **Adaptar preguntas de Palencia** al formato del repo (o extender `from_dict`)
2. **Renombrar** `pregunta` → `texto` (ya soportado) y `dato` → `dato_curioso`
3. **Normalizar dificultad** a strings o hacer el parser flexible
4. **Copiar** a `godot/data/preguntas.json` las 80 preguntas del banco
5. Las rondas de Palencia (veloz, curiosidades, desafío, etc.) mapean directo

### 7.4 Compatibilidad de rondas

| Ronda Palencia | Ronda repo ejemplo | Match |
|---|---|---|
| `veloz` | `Ronda Veloz` | ⚠️ Case/espacio diferente |
| (curiosidades) | `Curiosidades` | ⚠️ Similar |
| (desafío) | `Desafío` | ⚠️ Similar |

El filtrado es por string exacto — habría que normalizar nombres de rondas.

---

## 8. Mejoras Sugeridas (Priorizadas)

### 🔴 P0 — Necesario para funcionar en evento real

1. **MQTT configurable** — UI para ingresar host/puerto del broker (la tablet no será `127.0.0.1`)
2. **Integrar preguntas de Palencia** — adaptar formato, copiar 80 preguntas
3. **Normalizar nombres de rondas** — homogeneizar entre banco y código
4. **Soporte `dato` → `dato_curioso`** — extender `from_dict()` o renombrar campo

### 🟠 P1 — Importante para la experiencia

5. **Timer/cuenta atrás visual** — el `timeout_seconds` existe pero no hay countdown
6. **Resultados finales** — `GamePhase.RESULTS` + ranking con animación
7. **Audio básico** — buzzer, acierto, error, aplausos (topic ya definido)
8. **UI de pantalla mejorada** — tipografía grande, colores por equipo, layout de TV
9. **Score delta configurable** — permitir ±N en vez de hardcodear 100

### 🟡 P2 — Nice to have

10. **ESP32 pulsadores** — consumir `concurso/pulsar` con timestamp para "quien pulsó primero"
11. **Animaciones** — transiciones entre preguntas, feedback visual
12. **Minijuegos** — implementar `GamePhase.MINIGAME` con instrucciones + timer
13. **Modo imagen** — soporte para imágenes en preguntas (Ronda Imagen del PRD)
14. **Soundboard del presentador** — botonera de efectos de sonido
15. **Auto-arranque Mosquitto** — script Termux para la tablet

### 🟢 P3 — Futuro

16. **Configuración de nº de equipos** — soportar 2-5 equipos en vez de hardcodear 3
17. **Logs/auditoría** — registro de eventos post-concurso
18. **Backup automático de scores** — persistencia cada cambio (ya hay base)
19. **Música de fondo** — temas por fase (tension, victoria, etc.)
20. **Modo espectador web** — cliente HTML simple para segunda pantalla

---

## Apéndice: Mapa completo de archivos

```
quiz-analysis/
├── README.md                          # Overview del MVP
├── prd.md                             # PRD completo v2.1 (visión)
└── godot/
    ├── project.godot                  # Config Godot 4.6 + autoloads
    ├── main.tscn                      # Entry point: RoleSelect + ActiveRoot
    ├── .gitignore
    ├── addons/mqtt/
    │   ├── plugin.cfg                 # Plugin metadata
    │   ├── plugin.gd                  # Plugin entry
    │   ├── mqtt.gd                    # ~700 líneas, MQTT v3.1.1 en GDScript puro
    │   └── mqtt.tscn                  # Scene del nodo MQTT
    ├── autoload/
    │   ├── app_state.gd               # Estado global (rol, team, game state)
    │   ├── content_repo.gd            # Carga de preguntas JSON
    │   ├── game_service.gd            # Cerebro: lógica + MQTT + persistencia (~450 líneas)
    │   ├── mqtt_bus.gd                # Wrapper MQTT: connect/subscribe/publish
    │   └── mqtt_bus.tscn              # Scene que incluye addon MQTT
    ├── data/
    │   ├── .gitkeep
    │   └── preguntas.json             # 3 preguntas de ejemplo
    ├── scenes/
    │   ├── bootstrap/role_select.tscn # UI de selección de rol
    │   ├── presenter/presenter_root.tscn  # Dashboard del presentador
    │   ├── contestant/contestant_root.tscn # Tablet de equipo
    │   └── display/display_root.tscn  # Pantalla principal TV
    ├── scripts/
    │   ├── bootstrap/
    │   │   ├── main.gd                # Bootstrap + E2E mode
    │   │   └── role_select_controller.gd  # UI de selección de rol
    │   ├── core/
    │   │   ├── enums.gd               # Enums + helpers
    │   │   ├── game_state.gd          # Modelo de estado del juego
    │   │   ├── message_codec.gd       # Serialización MQTT
    │   │   ├── message_topics.gd      # Constantes de topics
    │   │   └── models/question.gd     # Modelo de pregunta
    │   ├── presenter/presenter_root_controller.gd  # ~300 líneas, dashboard completo
    │   ├── contestant/contestant_controller.gd     # UI de equipo
    │   └── display/display_controller.gd           # UI de pantalla pública
    └── tests/
        ├── smoke_runner.gd            # Valida que las 3 escenas instancian
        └── e2e_runner.gd              # Flujo completo headless con --role
```

---

## Resumen ejecutivo

El repo es un **MVP sólido y bien arquitectado**. La separación de responsabilidades es clara (AppState = estado, ContentRepo = datos, GameService = lógica, MqttBus = transporte). El patrón de "presentador como autoridad única" con broadcast de estado completo por MQTT con retain es simple y efectivo.

**Lo fuerte:** Arbitraje fino (locks, force turn, corrección explícita), persistencia de sesión, tests E2E, seguridad (no filtra correcta). ~2000 líneas de GDScript limpio y bien organizado.

**Lo débil:** 3 preguntas de ejemplo genéricas, sin audio, sin timer visual, sin ESP32, sin resultados finales, MQTT host hardcodeado.

**Veredicto:** Para un evento real de Viernes de Escape, necesita: (1) preguntas de Palencia integradas, (2) MQTT configurable, (3) timer, (4) audio mínimo, (5) pantalla de resultados. Con eso, es funcional para un primer evento.
