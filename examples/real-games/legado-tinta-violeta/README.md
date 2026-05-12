# El Legado en Tinta Violeta

> **Escape Room sobre Escritoras Palentinas**
> **Versión 3.0** - Navegación autónoma, barreras físicas reales, GM invisible

---

## 📋 Ficha Técnica

| Aspecto | Detalle |
|---------|---------|
| **Tipo** | Investigación + Escape Room Cooperativo |
| **Tema** | Escritoras palentinas |
| **Audiencia** | Jóvenes (14-25 años) |
| **Duración** | 50 minutos |
| **Grupos** | ~5 personas × 2 grupos simultáneos |
| **Dificultad** | 5.3/10 |

---

## 🆕 Novedades v3

1. **Pacto de la Tinta Violeta** - Separación autónoma (elección de puerta)
2. **Barreras físicas reales** - Candados de combinación en todas las pruebas
3. **GM invisible** - Ayuda solo cuando se pide, nunca guía
4. **Navegación por cartas** - Las escritoras indican el camino

---

## 📁 Estructura del Proyecto

```
legado-tinta-violeta/
├── README.md                    # Este archivo (índice principal)
├── OVERVIEW-ESCUETO-v3.md       # Documento maestro v3
├── El-Legado-en-Tinta-Violeta.typ # Fuente Typst para PDF
├── El-Legado-en-Tinta-Violeta.pdf # PDF generado
│
├── juego/                       # Documentación del juego
│   ├── README.md
│   ├── diseño/                  # Diseño y narrativa
│   │   ├── DISEÑO-JUEGO.md      # Ficha técnica y flujo
│   │   ├── NARRATIVA.md         # Pacto de la Tinta Violeta
│   │   ├── GUIA-JUGADORES.md    # Guía de GMs
│   │   └── LOGISTICA.md         # Cronograma y checklist
│   ├── pruebas/                 # Fichas JSON de pruebas
│   │   ├── prueba-biblioteca.json
│   │   ├── prueba-prensa.json
│   │   ├── prueba-taller.json
│   │   ├── prueba-ilustracion.json
│   │   ├── prueba-poesia.json
│   │   ├── prueba-rancho.json
│   │   └── prueba-final.json
│   ├── materiales/              # Lista de materiales
│   │   └── lista-materiales.md
│   └── personajes/              # Información de escritoras
│       └── escritoras-palentinas.md
│
├── doc/                         # Documentación de proceso
│   └── proceso/                 # Archivos de desarrollo
│       ├── META_PUZZLE.json     # Meta puzzle final
│       ├── FLOW.json            # Flujo de juego
│       ├── TESTING.json         # Plan de testing
│       └── ...
│
└── _archivado/                  # Archivos obsoletos
    └── obsoleto/                # Versiones antiguas eliminadas
```

---

## 🗺️ Flujo de Juego

### Camino de la Luz (Grupo A)
```
Entrada → [PLUMA] → Biblioteca → [LIBRO ALADO] → Taller → [LLAMA] → Poesía → Final
```
**Sílabas:** CA - TA - LI

### Camino de la Sombra (Grupo B)
```
Entrada → [PRENSA] → Prensa → [PINCEL] → Ilustración → [BOTA] → Rancho → Final
```
**Sílabas:** NA - VA - TO

### Reunión Final
**Nombre secreto:** CATALINA VALENTO

---

## 🔐 Códigos de Candados

| Prueba | Código | Origen |
|--------|--------|--------|
| Biblioteca | 1-0-7 | 107 palabras del soneto |
| Prensa | 1-5-2-2 | Días de artículos (15, 22, 8, 3) |
| Taller | 5-3-7 | 5 objetos, 3 personas, 7 escenas |
| Ilustración | 7-3 | 7 diferencias, 3 elementos comunes |
| Poesía | 1-4-1-1 | 14 versos, 11 sílabas |
| Rancho | 2-4-7-1 | 247 millas + 1 |

---

## 📚 Documentación Principal

| Archivo | Descripción |
|---------|-------------|
| [OVERVIEW-ESCUETO-v3.md](OVERVIEW-ESCUETO-v3.md) | Documento maestro con todo el diseño v3 |
| [juego/diseño/DISEÑO-JUEGO.md](juego/diseño/DISEÑO-JUEGO.md) | Ficha técnica y resumen de pruebas |
| [juego/diseño/NARRATIVA.md](juego/diseño/NARRATIVA.md) | Pacto de la Tinta Violeta y cartas |
| [juego/diseño/GUIA-JUGADORES.md](juego/diseño/GUIA-JUGADORES.md) | Guía para Game Masters |

---

## 🚀 Inicio Rápido

1. **Leer** `OVERVIEW-ESCUETO-v3.md` para entender el diseño completo
2. **Revisar** `juego/pruebas/*.json` para detalles de cada prueba
3. **Consultar** `juego/diseño/GUIA-JUGADORES.md` para protocolos de GM
4. **Usar** `juego/materiales/lista-materiales.md` para compras

---

## 👻 Rol del GM

- **NO guía** - Los jugadores navegan autónomamente
- **Solo ayuda cuando se le pide**
- **Observa desde sala de control**
- **Activa efecto WOW final**

---

*Versión 3.0 - Marzo 2026*
*Agente: Generador*
