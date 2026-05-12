# TOOLS.md - Local Notes

## Estructura de Proyectos
Ver `PROJECTS-STRUCTURE.md` en workspace raíz. OBLIGATORIO al guardar archivos de proyectos.

## 🔍 REGLA #1: BUSCAR ANTES DE CREAR

**OBLIGATORIO**: Antes de crear cualquier prueba o juego nuevo, SIEMPRE busca en el catálogo existente.

## 🚀 SISTEMA DE BÚSQUEDA HÍBRIDA

### Búsqueda Exacta
```bash
~/.repositorio/workspace/agents/generador/scripts/escape-search.sh [opciones] <término>
# Flags: --skill=NAME, --dificultad=N o N-M, --tipo=pruebas|ideas
```
Usar para: filtros específicos, valores numéricos, términos exactos.

### Búsqueda Semántica (QMD)
```bash
qmd search "<consulta>" -c pruebas-escape   # Lenguaje natural, conceptos
qmd query "<consulta>" -c pruebas-escape    # Híbrida con expansión (más lenta)
```
Usar para: lenguaje natural, conceptos abstractos, exploración abierta.

### Decisión rápida
- Filtros específicos → `escape-search.sh`
- Conceptos/natural → `qmd search`
- Complejo → combinar ambos

> 📖 Ejemplos detallados: `docs/search-reference.md`

### Flujo: IDENTIFICAR → BUSCAR → REVISAR → DECIDIR → CREAR

Re-indexar tras nuevas pruebas: `qmd update`

## 🎯 Protocolo Kanban

**API:** `http://localhost:3000/api/kanban/agent/tasks`
**Auth:** `X-Agent-Id: generador` / `X-Agent-Key: sk-generador-secret-2026`

| Acción | Método | Path |
|--------|--------|------|
| Crear | POST | `/api/kanban/agent/tasks` |
| Actualizar | PATCH | `/api/kanban/agent/tasks/{id}` |

**Estados:** `backlog` → `in_progress` → `review` → `done`
