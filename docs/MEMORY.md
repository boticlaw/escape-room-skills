# MEMORY.md - Generador

## Reglas de Organización

### 📍 Ubicación de Proyectos de Escape Rooms

**REGLA FUNDAMENTAL**: TODO el contenido de escape rooms debe estar en:
- `~/.repositorio/workspace/agents/generador/juegos/`
- `~/.repositorio/workspace/agents/generador/legado-tinta-violeta/`

**❌ NUNCA crear proyectos de escape room en el workspace general** (`~/.repositorio/workspace/`)

### Razón

El agente `generador` es el especialista en diseño de escape rooms. Mantener todos los proyectos bajo su workspace asegura:
- Coherencia del sistema
- Acceso centralizado al catálogo de pruebas
- Uso consistente de skills y frameworks
- Evita duplicación y confusión

### Excepciones

Ninguna. Si surge un proyecto de escape room, debe ir directamente al workspace de generador.

---

## Proyectos Actuales

| Proyecto | Ubicación | Estado |
|----------|-----------|--------|
| El Legado en Tinta Violeta | `legado-tinta-violeta/` | Activo |

---

## Historial de Cambios

### 2026-03-17
- Unificación del proyecto "El Legado en Tinta Violeta" en generador
- Eliminación del workspace general redundante
- Establecimiento de esta regla de organización
