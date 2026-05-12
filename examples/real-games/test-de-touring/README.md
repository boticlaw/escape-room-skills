# Test de Touring v2

> Escape Room Educativo sobre IA Real
> **Físico > Digital · ~128€ presupuesto · 50 minutos · 6 pruebas**

---

## 📁 Estructura de Documentos

```
test-de-touring/
├── BRIEF.json                          # Ficha técnica del juego
├── OVERVIEW.md                         # Resumen ejecutivo + tabla maestra
├── juego/
│   ├── diseño/
│   │   ├── DISEÑO-JUEGO.md            # Tabla maestra + pruebas detalladas (fuente de verdad)
│   │   ├── NARRATIVA.md               # Historia, cartas de navegación, voz de EVA-9
│   │   ├── PISTAS-GM.md               # Sistema de hints por prueba (3 niveles)
│   │   ├── LOGISTICA.md               # Cronograma, personal, checklist montaje
│   │   ├── GUIA-JUGADORES.md          # Guía para Game Masters
│   │   └── VALIDACION.md              # Checklist de calidad (v1 problemas corregidos)
│   ├── pruebas/
│   │   ├── prueba-001-real-o-falso.json
│   │   ├── prueba-002-huella-digital.json
│   │   ├── prueba-003-justicia-algoritmica.json
│   │   ├── prueba-004-sin-movil.json
│   │   ├── prueba-005-interrogatorio.json
│   │   └── prueba-006-codigo-apagado.json
│   └── materiales/
│       └── lista-materiales.md         # Compras y presupuesto (~128€)
```

---

## 📋 Ficha Rápida

| Aspecto | Valor |
|---------|-------|
| **Tipo** | Hall Escape (5 salas secuenciales) |
| **Público** | 12-18 años |
| **Jugadores** | 5-6 por grupo |
| **Duración** | 50 minutos |
| **Pruebas** | 6 (Sala 5 tiene 2) |
| **Dificultad** | 4/10 (curva: 2→3→4→5→6→4) |
| **Código final** | TURING |
| **Presupuesto** | ~128€ |
| **Cierres** | 2 cryptex + 2 candados numéricos + 1 candado letras + 1 llave |
| **Tecnología** | 4 tablets standalone (apoyo mínimo) |
| **GM** | Invisible, abre puertas con llave |

---

## 🔄 Cambios v1 → v2

| Aspecto | v1 | v2 |
|---------|----|----|
| Servidor | Raspberry Pi | Sin servidor |
| Tablets | App web sincronizada | Standalone, apoyo mínimo |
| EVA-9 | Altavoces + TTS | Documentos impresos |
| Puertas | Maglocks electromagnéticos | Llave física (GM abre) |
| Pantallas | 2 pantallas HDMI | Ninguna |
| Pruebas | 5 | 6 |
| Duración | 60 min | 50 min |
| Presupuesto | 1.305€ | ~128€ |
| Enfoque | Digital | Físico > Digital |
| Doble descubrimiento | Parcial | En las 6 pruebas |
| Contenedores | No | En las 6 pruebas |

---

*Test de Touring v2.0 — 7 Abril 2026 — Generador*
