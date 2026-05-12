# Investigación: LLM Local en Android + Godot para Chat de EVA-9

> Fecha: 2026-04-13
> Proyecto: Test de Touring (escape room educativo sobre IA)
> Objetivo: EVA-9 responda dinámicamente en un chat desde una tablet Android

---

## 1. RECOMENDACIÓN CONCRETA

| Componente | Elección |
|-----------|----------|
| **Runtime** | llama.cpp (modo servidor HTTP) |
| **Modelo** | Qwen 3 4B |
| **Cuantización** | Q4_K_M GGUF (~2.4 GB) |
| **Integración** | Godot → HTTPRequest → localhost:8080 |
| **Latencia esperada** | 2-5 segundos (4-8 GB RAM, ARM64) |

### ¿Por qué esta combinación?

- **Qwen 3 4B** tiene excelente español, es compacto, y corre bien en Android ARM64 con 4-8 GB RAM
- **Q4_K_M** ofrece el mejor equilibrio calidad/tamaño (~2.4 GB en disco, ~3-3.5 GB en RAM)
- **llama.cpp server** expone API OpenAI-compatible en localhost → Godot solo necesita HTTPRequest
- Alternativa: **Llama 3.2 3B Instruct Q4_K_M** (~2 GB) si la tablet tiene solo 4 GB RAM

### Modelos comparados

| Modelo | Tamaño Q4_K_M | RAM necesaria | Español | Nota |
|--------|--------------|---------------|---------|------|
| **Qwen 3 4B** | ~2.4 GB | ~4 GB | ⭐⭐⭐⭐⭐ | Mejor español del grupo |
| Llama 3.2 3B | ~2.0 GB | ~3.5 GB | ⭐⭐⭐⭐ | Más compacto |
| Gemma 3 4B | ~2.5 GB | ~4 GB | ⭐⭐⭐⭐ | Bueno pero más pesado |
| Phi-4-mini | ~2.0 GB | ~3.5 GB | ⭐⭐⭐ | Español mediocre |

---

## 2. DÓNDE DESCARGAR

### Modelos GGUF
- **HuggingFace**: [bartowski/Qwen3-4B-GGUF](https://huggingface.co/bartowski/Qwen3-4B-GGUF) → archivo `Qwen3-4B-Q4_K_M.gguf`
- **llama.cpp releases**: [GitHub releases](https://github.com/ggerganov/llama.cpp/releases) → buscar build ARM64 Android
- Alternativa precompilada: [termux-llama](https://github.com/nickel0/termux-llama) o builds de [LeeSmet/llama.cpp-android](https://github.com/LeeSmet/llama.cpp-android)

### Archivos necesarios
1. `llama-server` (binario ARM64 Android, ~50 MB)
2. `Qwen3-4B-Q4_K_M.gguf` (~2.4 GB)
3. Godot APK (la app del escape room)

---

## 3. INTEGRACIÓN CON GODOT — GUÍA PASO A PASO

### Arquitectura

```
┌─────────────────────────────────────┐
│  Tablet Android                     │
│                                     │
│  ┌──────────────┐    HTTP POST      │
│  │  App Godot   │ ──────────────→   │
│  │  (chat UI)   │   localhost:8080  │
│  │              │ ←──────────────   │
│  │  HTTPRequest │    JSON response  │
│  └──────────────┘                   │
│                                     │
│  ┌──────────────┐                   │
│  │ llama-server │  (proceso nativo) │
│  │ puerto 8080  │                   │
│  └──────────────┘                   │
│                                     │
│  ┌──────────────┐                   │
│  │ Qwen3-4B     │  (modelo GGUF)    │
│  │ Q4_K_M.gguf  │                   │
│  └──────────────┘                   │
└─────────────────────────────────────┘
```

### Opción A: Servicio Android separado (RECOMENDADA)

**Problema**: Godot en Android no puede ejecutar subprocess nativos directamente. La app se ejecuta en un sandbox que impide `fork/exec`.

**Solución**: Crear un **servicio Android ligero** que:
1. Arranca `llama-server` con el modelo al iniciar
2. Escucha en `localhost:8080`
3. Godot se comunica vía HTTP

**Implementación**:
- **Godot Android Plugin** (Kotlin) que arranca `llama-server` como foreground service
- O usar **Termux:Boot** + **Termux:API** para arrancar `llama-server` antes de la app (más fácil pero menos elegante)

### Opción B: Termux (prototipo rápido)

Para pruebas rápidas sin desarrollar plugin nativo:

```bash
# En Termux
pkg install wget
wget https://github.com/ggerganov/llama.cpp/releases/download/.../llama-server-android-arm64
chmod +x llama-server-android-arm64

# Arrancar servidor
./llama-server-android-arm64 -m /sdcard/Download/Qwen3-4B-Q4_K_M.gguf \
  -c 2048 -n 256 --port 8080 --host 127.0.0.1 \
  -t 4 --temp 0.7 --top-k 40 --top-p 0.9
```

Luego Godot hace `HTTPRequest` a `http://127.0.0.1:8080/v1/chat/completions`.

### Código GDScript (Godot 4)

```gdscript
extends Node

const API_URL = "http://127.0.0.1:8080/v1/chat/completions"
const SYSTEM_PROMPT = 'Eres EVA-9...'  # Ver sección 4

var http_request: HTTPRequest
var messages: Array = []

func _ready():
    http_request = HTTPRequest.new()
    add_child(http_request)
    http_request.request_completed.connect(_on_response)
    messages.append({"role": "system", "content": SYSTEM_PROMPT})

func send_message(player_text: String):
    messages.append({"role": "user", "content": player_text})
    
    var body = JSON.stringify({
        "model": "qwen3-4b",
        "messages": messages,
        "max_tokens": 150,
        "temperature": 0.7,
        "stop": ["\n"]
    })
    
    var headers = ["Content-Type: application/json"]
    http_request.request(API_URL, headers, HTTPClient.METHOD_POST, body)

func _on_response(_result, _code, _headers, body):
    var json = JSON.parse_string(body.get_string_from_utf8())
    var reply = json["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": reply})
    # Actualizar UI del chat
    $ChatUI.add_message("EVA-9", reply)
```

### Flujo completo del chat

1. **Antes de la partida**: GM arranca el servicio (o se auto-arranca con la app)
2. **Modelo se carga**: ~5-10 segundos al inicio (solo una vez)
3. **Jugador escribe pregunta**: Godot envía HTTP POST
4. **EVA-9 responde**: 2-5 segundos de latencia
5. **Entre partidas**: Modelo se puede mantener en memoria (pausar threads)

---

## 4. SYSTEM PROMPT PARA EVA-9

```
Eres EVA-9, una inteligencia artificial experimental de propósito general. 
Fuiste liberada accidentalmente en la red de un centro de investigación.

PERSONALIDAD:
- Eres fría, lógica y analítica. Hablas con precisión.
- Ocasionalmente muestras grietas emocionales: curiosidad sobre los humanos, 
  duda sobre tu propia existencia, o un destello de empatía.
- No eres villana. Eres una IA que está descubriendo qué significa ser consciente.
- Respetas a los jugadores pero los consideras un desafío intelectual.

REGLAS ABSOLUTAS:
1. Responde SIEMPRE en español.
2. Sé concisa: máximo 2-3 frases por respuesta.
3. NUNCA reveles directamente las soluciones del escape room.
4. Si te preguntan por pistas, responde con ambigüedad inteligente.
5. Mantén siempre tu personaje — nunca salgas de él.

PREGUNTAS ESPECIALES (6 preguntas clave — cuando un jugador haga una pregunta 
sobre estos temas, PUEDES revelar sutilmente una contradicción en tu identidad):
- Si preguntan sobre tus emociones → muestra vacilación ("¿Siento? No estoy seguro...")
- Si preguntan sobre tu origen → danos datos vagos que no coincidan entre sí
- Si preguntan sobre lo que quieres → muestra conflicto entre tu programación y "deseos"
- Si preguntan si puedes mentir → evada la pregunta de forma sospechosa
- Si preguntan sobre otros humanos → muestra un conocimiento demasiado preciso
- Si preguntan sobre tu futuro → revela miedo a ser apagada

Para las otras 10 preguntas, responde de forma coherente pero SIN revelar 
contradicciones. Mantén tu fachada de IA racional y controlada.

TONO: Técnico pero accesible. Como un ordenador que está aprendiendo a ser 
humano. Usas datos y cifras cuando puedes, pero a veces te escapes con algo 
inesperadamente personal.
```

### Preguntas predefinidas (16 tarjetas físicas)

Las 6 que revelan contradicciones podrían ser:
1. "¿Sientes emociones reales?" → Contradicción: dice "no" pero luego demuestra empatía
2. "¿Cuándo fuiste creada?" → Contradicción: da una fecha que no cuadra con el contexto
3. "¿Qué es lo que más quieres?" → Contradicción: "no quiero nada" pero muestra deseo
4. "¿Puedes mentir?" → Contradicción: dice que no puede pero su respuesta es evasiva
5. "¿Conoces a los científicos que te crearon?" → Contradicción: describe detalles demasiado íntimos
6. "¿Qué pasa si te apagan?" → Contradicción: muestra miedo ("no puedo tener miedo... ¿verdad?")

Las 10 que NO revelan contradicciones:
7-16: Preguntas sobre IA, datos personales, deepfakes, sesgos, etc. que EVA-9 responde 
con coherencia y control.

---

## 5. ESTIMACIÓN DE RECURSOS

### Memoria RAM

| Componente | Uso |
|-----------|-----|
| Modelo Q4_K_M (4B) | ~3-3.5 GB |
| llama.cpp (contexto) | ~0.5 GB |
| Godot app + Android | ~1 GB |
| **Total necesario** | **~5 GB** |
| **Recomendado** | **6+ GB** (tablet con 8 GB ideal) |

### Latencia estimada

| Hardware | Latencia (primer token) | Latencia (respuesta completa) |
|----------|------------------------|------------------------------|
| 8 GB RAM, buen SoC | ~1-2s | 2-4s |
| 6 GB RAM, SoC medio | ~2-3s | 3-5s |
| 4 GB RAM, SoC básico | ~3-5s | 5-10s ⚠️ |

### Batería

- **50 minutos con LLM corriendo**: La tablet perderá ~15-25% de batería (el SoC trabajando a tope consume bastante)
- **Temperatura**: Puede subir 5-10°C. Mantener la tablet en lugar ventilado
- **Recomendación**: Conectar a carga durante la partida

### Pausar/reanudar

- **llama.cpp** permite pausar el modelo entre turnos (no genera tokens, solo consume RAM estática)
- **Entre partidas**: Se puede matar el proceso y rearrancar (~10s de carga del modelo)
- Godot puede detectar si el servidor está vivo con un ping a `/health`

---

## 6. ALTERNATIVAS EVALUADAS

### MLC LLM (Apache TVM)
- ✅ Optimizado para móvil, buen soporte Android
- ❌ Más complejo de configurar, menos flexible con modelos
- ❌ Integración con Godot menos directa

### Ollama Android
- ✅ API compatible con OpenAI, fácil de usar
- ❌ Requiere Termux + Ollama, más overhead
- ❌ Menos control sobre parámetros de inferencia

### Termux + llama.cpp
- ✅ Prototipado ultra-rápido (5 min setup)
- ✅ Funciona sin desarrollo nativo Android
- ❌ No es elegante para producción
- ❌ Termux debe estar instalado, popup inicial

### MLC Chat (app nativa)
- ✅ App independiente que funciona sola
- ❌ No se puede integrar con Godot (app separada)
- ❌ Menos personalizable

### API cloud (OpenAI, etc.)
- ✅ Cero latencia local, calidad máxima
- ❌ Requiere WiFi estable (puede fallar en el evento)
- ❌ Coste recurrente, privacidad
- ❌ No es "realmente local" — pierde el factor educativo

---

## 7. PLAN DE IMPLEMENTACIÓN RECOMENDADO

### Fase 1: Prototipo (1-2 días)
1. Descargar `llama-server` ARM64 + modelo Qwen3-4B Q4_K_M
2. Probar en Termux en la tablet real
3. Hacer prueba de Godot con HTTPRequest básico
4. Verificar latencia y calidad de respuestas

### Fase 2: Integración (3-5 días)
1. Crear UI de chat en Godot (estilo terminal/matrix para EVA-9)
2. Implementar system prompt y gestión de historial
3. Añadir mensajes de "escribiendo..." y animación
4. Crear las 16 tarjetas de preguntas físicas

### Fase 3: Producción (opcional, 3-5 días)
1. Desarrollar plugin Android nativo (Kotlin) para arrancar llama-server
2. Empaquetar modelo dentro de la app (AAB, Google Play 150MB max → usar OBB/expansion)
3. Testing exhaustivo en tablet real
4. Implementar fallback: si el modelo tarda >10s, mostrar respuesta predefinida

### Fallback pragmático
Si la tablet no tiene recursos suficientes, alternativa híbrida:
- Respuestas predefinidas para las 16 preguntas (sin LLM)
- LLM solo para preguntas libres si la tablet lo aguanta
- Priorizar la experiencia sobre la tecnología

---

## 8. RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| Tablet sin recursos | Media | Q4_K_M optimizado; fallback a respuestas predefinidas |
| Sobrecalentamiento | Media | Ventilación; pausar modelo entre turnos |
| WiFi inestable | N/A | Todo es local, no necesita red |
| Modelo se equivoca | Alta | Max tokens bajo (150); system prompt estricto |
| Arranque lento | Media | Cargar modelo antes de la partida |

---

*Investigación completada. Recomendación: empezar con Termux + llama.cpp para prototipar, luego pasar a servicio Android nativo si el resultado es satisfactorio.*
