# 🎭 Viernes de Escape — Proyecto de Escape Rooms

**Proyecto:** Escape rooms para el ayuntamiento
**Estado:** En desarrollo
**Ubicación:** `~/.repositorio/workspace/projects/viernes-de-escape/`

---

## Descripción

Proyecto de escape rooms diseñados para el ayuntamiento, orientados a jóvenes. Incluye diseño narrativo, puzzles, materiales, guías de juego y pruebas validadas.

## Juegos incluidos

### 🟢 Protocolo Alerta Verde
- **Público:** Jóvenes 12-18 años
- **Duración:** ~50 minutos
- **Escenario:** Edificio de 3 plantas, 6 habitaciones
- **Puzzles:** 10 puzzles, 2 grupos simultáneos
- **Presupuesto:** ~175€
- **Tema:** Sabotaje ecológico
- **Fase:** Diseño completo (v1.0)

### 🟣 Legado en Tinta Violeta
- **Tema:** Literario, basado en escritoras palentinas
- **Puzzles:** 8+ puzzles temáticos (biblioteca, poesía, prensa, viajes, taller, ilustración, final)
- **Materiales:** Lista completa de materiales, guía de jugadores, narrativa, logística
- **Fichas:** Ficha de juego individual + pruebas JSON estructuradas
- **Preparación:** Documentación de preparación por prueba

## Estructura

```
viernes-de-escape/
├── README.md                              ← Este archivo
├── protocolo-alerta-verde/                ← Escape room: sabotaje ecológico
│   ├── index.md                           # Inventario
│   └── protocolo-alerta-verde.md          # Diseño completo
└── legado-tinta-violeta/                  ← Escape room: escritoras palentinas
    ├── README.md                          # Resumen del juego
    ├── OVERVIEW-ESCUETO-v4.md             # Overview del diseño
    ├── ESTILO-JUEGOS.md                   # Guía de estilo
    ├── LEGADO-EN-TINTA-VIOLETA.md/.pdf    # Documento completo
    ├── juego/                             # Diseño del juego
    │   ├── diseño/                        # Diseño, narrativa, logística, guía jugadores
    │   ├── materiales/                    # Lista de materiales
    │   ├── personajes/                    # Personajes (escritoras palentinas)
    │   └── pruebas/                       # Pruebas JSON (biblioteca, poesía, prensa, etc.)
    ├── preparacion-por-prueba/            # Guía de preparación por prueba
    ├── fichas-juego/                      # Fichas de juego individuales
    └── pruebas-extra/                     # Pruebas adicionales (caja violeta, acróstico)
```

## Relación con otros proyectos

- **una-hora-centro-ocio/** — Proyecto de negocio general del centro de ocio (plan de negocio, financiación, banco). Contiene el marco empresarial bajo el cual operan estos escape rooms.
