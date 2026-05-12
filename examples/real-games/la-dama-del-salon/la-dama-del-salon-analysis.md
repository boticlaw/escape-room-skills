# Análisis: La Dama del Salón - Street Escape

> **Fecha:** 2026-04-27  
> **Repo:** https://github.com/danielgap/La-dama-del-salon (privado)  
> **Ubicación:** Palencia, España  
> **Tipo:** Street Escape (outdoor, geolocalizado)

---

## 1. Visión General

Street Escape ambientado en el Salón de Palencia (parque histórico). El jugador sigue el diario ficticio de **Clara Vela**, una joven de 1897 que huye de un matrimonio arreglado mientras busca la Fuente de la Juventud siguiendo las huellas de Ponce de León. 13 niveles progresivos que combinan narrativa, geolocalización y minijuegos.

---

## 2. Stack Técnico

| Componente | Tecnología |
|-----------|-----------|
| Framework | **Wasp** (React + Node.js fullstack) |
| Frontend | React + TypeScript + Vite |
| Backend | Node.js con Wasp server |
| Base de datos | PostgreSQL (Prisma ORM) |
| Deploy | **Fly.io** |
| Blog/docs | Astro + Starlight |
| Auth | Wasp auth (email/social) |
| Payments | Stripe / LemonSqueezy |
| IA | OpenAI (GPT-4o-mini) + Google Gemini (2.0-flash-lite) |
| Tests E2E | Playwright |
| Hosting estáticos | nginx |

**Dominio:** `ladamadelsalon.es`

---

## 3. Estructura de Niveles (13 niveles)

### Progresión Lineal

```
Nivel 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13
```

Cada nivel tiene un tipo (`diary` | `location` | `puzzle`) y se desbloquea secuencialmente.

### Detalle por Nivel

| # | Tipo | Mecánica Principal | Ubicación Real | Solución/Respuesta |
|---|------|-------------------|----------------|-------------------|
| 1 | diary + geo | Video intro → Leer diario → Geo-check | Templete del Salón (42.0060, -4.5291) | "templete" |
| 2 | diary + puzzle | Leer diario → Piano interactivo | — | Tocar 5ª Sinfonía Beethoven (Sol-Sol-Sol-Mib-Fa-Fa-Fa-Re) |
| 3 | diary + geo + puzzle | Geo-check → StarPuzzle (arrastrar) → Buscaminas | Monumento Ponce de León (42.0053, -4.5312) | "Monumento Ponce de León" |
| 4 | diary + enigma | Leer diario → Enigma numérico (2 fechas) | — | Laredo: 1803, Astillero: 1880 |
| 5 | puzzle | Memory Card (emparejar) → Revela "ABUELOS" | — | Emparejar todas las cartas |
| 6 | diary + geo + IA | Geo-check → Chat con "Los Abuelos" (Gemini/OpenAI) | Los abuelos (42.0060, -4.5303) | "ir a los abuelos" → pista calle Clavel |
| 7 | diary + trivia | Pregunta: nombre de la villa → Código numérico | — | "celia" → código 6298 |
| 8 | diary + geo + puzzle | Geo-check → FishSortGame (ordenar bolas colores) | Puerta Ponce de León (42.0058, -4.5307) | "En ponce al lado de la calle mayor" |
| 9 | diary + geo + video | Geo-check → Video YouTube → Enigma melodía | Arco de las rosas (42.0068, -4.5277) | "recuerdame" |
| 10 | diary + geo + arcade | Geo-check → MonsterEscapeGame (escapar perseguidores grid) | Templete del Salón (42.0060, -4.5291) | "recuérdame" |
| 11 | diary + geo | Solo geo-check (banco oculto) | Estatua "Otro lado del silencio" (42.0069, -4.5268) | Geo-verify |
| 12 | diary + puzzle | CodeLockBox (5 dígitos) con flor/secreto | — | Código: 63239 |
| 13 | diary + geo + video | Video final + Geo-check final | Puente de Hierro (42.0052, -4.5317) | Final del juego |

---

## 4. Mecánicas de Juego Identificadas

### 4.1 Sistema de Niveles
- **Progresión estrictamente lineal** — no se puede saltar niveles
- **LevelGuard** protege acceso: compara `currentLevel` del usuario con el nivel solicitado
- **Persistencia** en PostgreSQL (tabla `GameProgress`)
- Métricas: `hintsUsed`, `wrongAttempts`, `lastLevelCompletedAt`, `maxLevelReached`
- **Auto-restore**: guarda `lastUrl` del usuario para restaurar sesión al volver

### 4.2 Geolocalización (GeoLocationChecker)
- **Radio de verificación:** 25 metros por defecto
- Usa `navigator.geolocation.getCurrentPosition` con alta precisión
- Fórmula de Haversine para calcular distancia
- **Modo debug:** coordenadas simuladas para testing sin estar in-situ
- Permisos: detecta y maneja estados (granted/denied/prompt)
- **Usado en 9 de 13 niveles**

### 4.3 Tipos de Minijuegos

| Minijuego | Componente | Descripción | Nivel |
|-----------|-----------|-------------|-------|
| **Piano** | `Piano.tsx` | Teclado interactivo con Audio API, detecta secuencia de notas (8 notas de Beethoven) | 2 |
| **StarPuzzle** | `StarPuzzle.tsx` | Drag & drop de estrella por checkpoints en SVG | 3 |
| **Buscaminas** | `Minesweeper.tsx` + `MinesweeperModal.tsx` | Grid 6x6/8x8/10x10, timer, flag mode, long-press mobile | 3 |
| **MemoryCard** | `MemoryCard.tsx` | Emparejar cartas boca abajo, revela palabra secreta "ABUELOS" | 5 |
| **Chat IA** | `GeminiChatModal.tsx` | Conversación con NPC "Los Abuelos" via Gemini/OpenAI, system prompt en español antiguo | 6 |
| **SlidingPuzzle** | `SlidingPuzzleLock.tsx` | Puzzle tipo "unblock me" - deslizar bloques | (componente disponible) |
| **FishSortGame** | `FishSortGame.tsx` | Ordenar bolas de colores (tipo bubble sort físico) | 8 |
| **MonsterEscape** | `MonsterEscapeGame.tsx` | Grid-based escape game - huir de perseguidores en turnos | 10 |
| **CodeLockBox** | `CodeLockBox.tsx` | Caja fuerte 5 dígitos con diales, símbolos y flor secreta | 12 |

### 4.4 Sistema de Pistas (Hints)
- Cada nivel tiene una pista predefinida (`hint` field)
- Se muestran bajo demanda con contador de uso
- El contador `hintsUsed` se incrementa y persiste

### 4.5 Chat con NPC (IA)
- **Gemini 2.0-flash-lite** como primario, **GPT-4o-mini** como backup
- System prompt define personalidad del NPC (ancianos de Palencia, lenguaje antiguo)
- Conversación breve (5-6 intercambios máximo)
- Guía al jugador hacia la respuesta sin dársela directamente
- Respuestas de fallback predefinidas si la API falla

---

## 5. Estilo Narrativo

### 5.1 Formato: Diario de Clara Vela
- **Voz:** Primera persona, Clara Vela (joven burguesa, 1897)
- **Tono:** Literario, romántico, misterioso; estilo decimonónico español
- **Estructura:** Entradas fechadas (15 abril - 7 junio 1897)
- **Temas:** Matrimonio forzado, búsqueda de libertad, Fuente de la Juventud, Ponce de León

### 5.2 Trama
- Clara descubre un pergamino de Ponce de León sobre la Fuente de la Juventud
- El Marqués de Albaida también la busca (antagonista)
- "Los Abuelos" son aliados misteriosos que ayudan a Clara
- Los símbolos en forma de estrella marcan las ubicaciones clave
- La caja final contiene el secreto de Clara

### 5.3 Palabras Clave Resaltadas
- Cada nivel tiene `highlightedKeywords` que se resaltan visualmente en el texto
- Técnica: regex con `<span class="text-amber-800 font-bold bg-amber-100">` via `dangerouslySetInnerHTML`
- **Guía implícita** al jugador sobre dónde buscar pistas en el texto

### 5.4 Elementos Visuales del Diario
- Fondo pergamino con gradientes ámbar
- Esquinas dobladas (CSS puro)
- Imágenes estilo foto antigua (sepia, grayscale)
- "Post-it" notas amarillas decorativas sobre las fotos
- Tipografía serif (Playfair Display)
- Borde ondulado bajo títulos
- **Muy mobile-first**: responsive con breakpoints agresivos

---

## 6. Patrones de Diseño Identificados

### 6.1 Patrón de Nivel "Diario"
```
Video intro (solo nivel 1)
→ Texto narrativo con keywords resaltadas
→ [Imagen opcional insertada entre párrafos]
→ Mecánica específica del nivel (geo/puzzle/chat)
→ Pista disponible bajo demanda
→ Mensaje de éxito → Transición al siguiente nivel
```

### 6.2 Patrón de Verificación
- **Texto libre:** normalización (lowercase, sin acentos) antes de comparar
- **Numérico:** comparación exacta de enteros
- **Geolocalización:** distancia Haversine < threshold
- **Secuencia:** matching de arrays (notas del piano)

### 6.3 Sistema de Debug
- **DebugContext** centralizado con toggle
- Muestra respuestas correctas, coordenadas, progreso
- Permite auto-resolver puzzles
- Simula geolocalización en modo debug
- Indicadores visuales (bordes verdes, badges)

### 6.4 UX Mobile
- Touch events con cooldown anti-doble-tap
- `preventDefault()` en touch para evitar zoom/scroll accidental
- Long-press para flags en buscaminas
- Responsive: `sm:`, `md:`, `xs:` prefixes agresivos
- Animaciones CSS (`animate-fadeIn`, `animate-pulse`, `animate-spin`)

---

## 7. Modelo de Datos

```
User
├── id, email, isAdmin
├── lastUrl (para restaurar sesión)
└── GameProgress (1:1)
    ├── currentLevel: int
    ├── maxLevelReached: int
    ├── hintsUsed: int
    ├── wrongAttempts: int
    └── lastLevelCompletedAt: datetime
```

---

## 8. Lecciones para Escapeitor

### 8.1 Lo que funciona bien
1. **Narrativa como hilo conductor** — el diario mantiene engagement entre niveles
2. **Geolocalización como puerta** — obliga presencia física, auténtica el street escape
3. **Variedad de mecánicas** — cada nivel tiene su propio minijuego, evita monotonía
4. **Keywords resaltadas** — guía sutil sin romper la narrativa
5. **Progresión guardada** — el jugador puede abandonar y volver
6. **Debug mode** — esencial para testing y demo sin ir al sitio

### 8.2 Áreas de mejora
1. **Código hardcodeado** — niveles, coordenadas y soluciones todo en `levels.ts`
2. **Sin editor/admin** — crear nuevos niveles requiere programar
3. **Poca reutilizabilidad** — cada nivel tiene lógica única en `DiaryLevel.tsx` (archivo enorme)
4. **Sin dificultad adaptativa** — todos los jugadores ven lo mismo
5. **Sin multiidioma** — solo español
6. **Sin ranking/social** — no hay leaderboard ni compartir

### 8.3 Componentes Reutilizables para Escapeitor
- ✅ `GeoLocationChecker` — sistema de geolocalización completo
- ✅ `CodeLockBox` — caja de combinación
- ✅ `MemoryCard` — juego de parejas
- ✅ `Minesweeper` — buscaminas
- ✅ `Piano` — teclado musical con detección de secuencia
- ✅ `StarPuzzle` — drag por checkpoints
- ✅ `MonsterEscapeGame` — escape en grid
- ✅ `FishSortGame` — ordenar elementos
- ✅ `GeminiChatModal` — chat con NPC (IA)
- ✅ Sistema de hints + debug

### 8.4 Parámetros de Configuración de Nivel
```typescript
interface LevelData {
  id: string;
  type: 'diary' | 'location' | 'puzzle';
  title: string;
  description: string;
  imageUrl?: string;
  hint: string;
  solution: string;
  diaryContent?: string;        // Texto narrativo
  location?: GeoCoordinates;    // Para geo-check
  imagePositionAfterParagraph?: number;
  highlightedKeywords?: string[];
}
```

---

## 9. Configuración de Deploy

- **Fly.io** con Dockerfile
- PostgreSQL en Fly (internal: `ladama-db.flycast:5432`)
- Nginx como proxy
- Variables de entorno: `OPENAI_API_KEY`, `GEMINI_API_KEY`, `DATABASE_URL`
- Redirect app separada (Fly + Toml)
- Verificación de certificados SSL (`verify-certs.sh`)

---

## 10. Métricas de Interés para Escapeitor

- **13 niveles** con ~7 tipos de mecánicas distintas
- **9 niveles con geolocalización** (69%)
- **6 niveles con minijuegos** (46%)
- **1 nivel con IA conversacional** (8%)
- **Distancia total recorrida:** ~2km dentro del parque
- **Área del juego:** Parque del Salón, Palencia (~0.5km²)
- **Threshold geolocalización:** 25m

---

*Generado por Boti desde análisis del repo La-dama-del-salon*
