---
name: skill-creador-juegos
description: Skill para diseñar juegos completos de escape room, street escape e investigación. Usar cuando se necesite (1) crear un nuevo juego desde cero con narrativa y pruebas, (2) expandir un juego existente con más pruebas, (3) reorganizar o validar la estructura de un juego, (4) buscar inspiración en skills y pruebas existentes para componer un nuevo juego.
---

# Creador de Juegos de Escape

Skill para diseñar juegos completos que combinan narrativa, pruebas y flujo de juego coherente.

## Flujo Principal

```
Usuario pide crear juego
        ↓
1. Recopilar contexto (preguntar si falta)
        ↓
2. Buscar skills disponibles en .agents/skills/
        ↓
3. Buscar pruebas reutilizables en pruebas/
        ↓
4. Proponer combinación de pruebas
        ↓
5. Crear documento de narrativa (.md)
        ↓
6. Crear fichas de nuevas pruebas en pruebas/
```

---

## Paso 1: Recopilar Contexto

Antes de diseñar, confirmar estos datos. Si el usuario no los proporciona, preguntar:

### Variables básicas del juego

| Variable | Valores | Default |
|----------|---------|---------|
| `tipo` | hall_escape / street_escape / investigacion | - |
| `tematica` | medieval, futurista, mitologia, crimen, terror, etc. | - |
| `jugadores` | min-max (ej: 2-6) | 2-6 |
| `duracion_minutos` | 30-90 | 60 |
| `dificultad` | 1-10 | 5 |
| `objetivo` | escapar / investigar / recuperar objeto / resolver crimen | escapar |

### ⚠️ Preguntas obligatorias sobre el espacio físico (ANTES de diseñar)

**NO asumir un espacio genérico.** Siempre preguntar:

1. **¿Cuánto espacio físico disponible?**
   - Salón, habitaciones, plantas, exterior...
   - Metros aproximados o distribución

2. **¿Hay estructuras especiales que podamos aprovechar?**
   - Peceras, cristaleras, puertas con llave, escaleras...
   - Elementos que puedan ser parte del juego

3. **¿Los grupos pueden verse/oírse o deben estar aislados?**
   - Afecta si diseñamos competitivo vs cooperativo
   - Afecta pruebas de comunicación

4. **¿Qué materiales ya tenemos disponibles?**
   - Tablets, microscopios, candados, cajas, luces...
   - Ver sección "Uso creativo de materiales"

**Pregunta sugerida completa:**
> "Para diseñar el juego necesito saber:
> 1. ¿Qué tipo (sala física, calle, investigación)? ¿Qué temática?
> 2. ¿Cuántos jugadores y cuánto tiempo? ¿Qué dificultad objetivo?
> 3. ¿Qué espacio físico tienes? ¿Hay elementos especiales (puertas con llave, cristaleras...)?
> 4. ¿Qué materiales ya tienes (tablets, candados, etc.)?"

### Formato del juego: Cooperativo vs Competitivo

Considerar cuál encaja mejor:

| Formato | Cuándo usar | Ventajas |
|---------|-------------|----------|
| **Cooperativo** | Grupos pequeños, narrativa de equipo, espacio limitado | Todos colaboran, menor tensión |
| **Competitivo** | 2 grupos, espacio permite ver/oír, usuario quiere emoción | Mayor tensión, más replayability |

**Criterios para formato competitivo:**
- ✅ Espacio permite ver/oir entre grupos (o hay forma de comunicar progreso)
- ✅ Usuario quiere mayor tensión/emoción
- ✅ Hay suficientes recursos para 2 grupos simultáneos
- ✅ Narrativa encaja con competencia (carrera contra tiempo, detective vs ladrón...)

---

## Paso 2: Buscar Skills Disponibles

Ejecutar búsqueda en `.agents/skills/` para identificar skills utilizables. Buscar patrones `prueba-*`:

**Categorías de skills:**
- **Físicos:** prueba-punteria-derribo, prueba-panel-electrico
- **Digitales:** prueba-tablet-cooperativo, prueba-laberinto-digital, prueba-arcade-digital
- **Lógica:** prueba-logica-posiciones, prueba-logica-secuencial
- **Comunicación:** prueba-comunicacion-mensajes
- **Exploración:** prueba-exploracion-visual, prueba-ubicacion-qr, prueba-gps-navegacion
- **Memoria:** prueba-emparejamiento-memoria
- **Investigación:** prueba-investigacion-texto, prueba-acrostico-ubicacion

**Regla:** Variedad de mecánicas. No repetir el mismo tipo de skill más de 2 veces por juego.

---

## Paso 3: Buscar Pruebas Reutilizables

Consultar `pruebas/*.json` para encontrar pruebas que puedan adaptarse.

Para cada prueba relevante, verificar:
- ¿La temática es compatible o adaptable?
- ¿El skill_primario encaja con el juego?
- ¿El codigo_recompensa puede cambiarse?

**Prioridad:** Reutilizar > Adaptar > Crear nueva

---

## Paso 4: Proponer Combinación de Pruebas

### Número recomendado de pruebas

| Duración | Pruebas |
|----------|---------|
| 30 min | 3-4 |
| 45 min | 4-6 |
| 60 min | 5-8 |
| 90 min | 7-10 |

### Variedad obligatoria

Un juego debe incluir al menos:
- 1 prueba física o manipulativa
- 1 prueba de lógica o deducción
- 1 prueba cooperativa (si jugadores > 2)
- 1 prueba final que integre elementos previos

### Progresión de dificultad

```
Prueba 1-2: Fácil (dificultad 2-3) → Introducción
Prueba 3-4: Media (dificultad 4-5) → Desarrollo
Prueba 5-6: Alta (dificultad 6-7) → Clímax
Prueba 7+:   Variable → Cierre
```

---

## Paso 5: Crear Narrativa y Flujo

### Elementos narrativos obligatorios

1. **Introducción/hook** - Por qué están ahí, qué deben hacer
2. **Conflicto** - Qué ha salido mal, qué obstáculo hay
3. **Objetivo claro** - Qué deben conseguir para ganar
4. **Conclusión** - Qué pasa cuando logran el objetivo

### Flujo de juego

Ver `references/patrones_flujo.md` para patrones detallados.

**Flujo lineal simple (recomendado para principiantes):**
```
Prueba 1 → Código A → Prueba 2 → Código B → Prueba 3 → Victoria
```

---

## ⭐ OVERVIEW en Formato Narrativo (CRÍTICO)

**El usuario prefiere MUCHO un OVERVIEW narrativo que explique "cómo se juega" en lugar de solo especificaciones técnicas.**

### Formato deseado

El OVERVIEW debe ser:
- **Narrativo y fluido**, como si explicaras a alguien cómo se juega
- **Paso a paso claro:** inicio → prueba 1 → resultado → siguiente paso → prueba 2 → ...
- **Incluye qué hacen los jugadores** en cada momento
- **Incluye qué objetos/materiales usan**
- **Incluye qué códigos/recompensas obtienen**
- **Fácil de entender** para alguien que va a montar el juego

### Ejemplo de OVERVIEW narrativo

> "La sesión empieza con la historia de [X]. Les damos el sobre inicial con [elementos].
>
> En la sala donde empiezan hay [descripción física]. Con los elementos del sobre, los jugadores deben [acción]. Esto les da un código [XXXX].
>
> Con ese código abren la caja que está en [ubicación], que contiene [objeto/llave].
>
> La llave abre la puerta de [lugar], donde encuentran [nuevo elemento]. Con eso, resuelven [prueba 2] que les da...
>
> [Continúa hasta el final]"

### Dónde va el OVERVIEW

El OVERVIEW narrativo va al **principio del documento del juego**, ANTES de los detalles de cada prueba. Es lo primero que lee alguien para entender el juego completo.

### Checklist del OVERVIEW

- [ ] Se explica el inicio (qué se les da, dónde están)
- [ ] Se menciona cada prueba en orden
- [ ] Se indica qué obtienen al resolver cada prueba
- [ ] Se explica cómo se conectan las pruebas (qué desbloquea qué)
- [ ] Se mencionan los objetos/materiales clave
- [ ] Se describe el final/cierre del juego

---

## Paso 6: Crear Documento de Narrativa

Crear archivo markdown con la narrativa y flujo del juego: `{nombre_juego}.md`

**Estructura recomendada:**

```markdown
# Nombre del Juego

## Configuración
- Tipo: hall_escape
- Duración: 60 minutos
- Jugadores: 2-6
- Dificultad: 5/10

## Narrativa

### Introducción
[Texto que se lee a los jugadores al empezar]

### Conflicto
[Qué ha salido mal, qué obstáculo hay]

### Objetivo
[Qué deben conseguir para ganar]

## Flujo de Pruebas

1. **Prueba X** (prueba_xxx_001) → Código: 1234 → Desbloquea: [siguiente]
2. **Prueba Y** (prueba_yyy_001) → Código: 5678 → Desbloquea: [siguiente]
...

## Pistas Globales (Game Master)
1. [Pista nivel 1]
2. [Pista nivel 2]
3. [Pista nivel 3]

## Elementos Físicos Necesarios
- [Lista de elementos: candados, cajas, tablets, etc.]
```

**Nota:** Los detalles de cada prueba están en `pruebas/*.json`. Este documento solo contiene la narrativa y el flujo.

---

## Paso 7: Crear Fichas de Nuevas Pruebas

Para cada prueba nueva necesaria:

1. Identificar el skill_primario apropiado
2. Consultar el SKILL.md de ese skill para variables y estructura
3. Crear ficha en `pruebas/prueba_{juego}_{tipo}_001.json`
4. Incluir pistas progresivas (3 niveles)
5. Documentar solución clara

---

## Checklist de Validación

Ver `references/checklist_validacion.md` para lista completa.

**Resumen rápido:**
- [ ] Narrativa conecta todas las pruebas
- [ ] Variedad de skills (máx 2 repeticiones)
- [ ] Progresión de dificultad adecuada
- [ ] Tiempo total estimado coherente
- [ ] Cada prueba tiene solución documentada

---

## Errores Comunes

| Error | Síntoma | Solución |
|-------|---------|----------|
| Sobrecarga | 10+ pruebas en 45 min | Eliminar pruebas prescindibles |
| Falta de narrativa | Pruebas desconectadas | Crear hilo que justifique cada acción |
| Dificultad inconsistente | Fácil seguida de imposible | Ordenar por progresión |
| Dependencias circulares | A necesita B que necesita A | Diagramar flujo antes |

---

## Ejemplo de Uso

**Usuario:** "Quiero crear un juego de escape en una biblioteca antigua para 4 jugadores, 60 minutos"

**Proceso:**
1. Confirmar contexto
2. Buscar skills: prueba-logica-secuencial, prueba-exploracion-visual...
3. Buscar pruebas reutilizables en `pruebas/`
4. Proponer 6 pruebas con progresión
5. Crear documento `biblioteca_prohibida.md` con narrativa y flujo
6. Crear fichas de prueba en `pruebas/`

---

## Relaciones con Otros Skills

| Tipo | Skills |
|------|--------|
| Soporte | skill-architect-pruebas-escape, skill-creator |
| Catálogo | Todos los skills `prueba-*` |

**Orden de consulta:**
1. Este skill (estructura general)
2. Skills de prueba específicos (detalles de cada prueba)
3. skill-architect-pruebas-escape (si falta skill necesario)

---

## Uso Creativo de Materiales Disponibles

**Principio:** Los materiales disponibles (tablets, microscopios, candados, etc.) deben usarse para crear mecánicas únicas, no solo como soporte decorativo.

### Ejemplos de uso creativo por material

| Material | Uso creativo | Mecánica |
|----------|--------------|----------|
| **Tablet** | Sistema de password | Desbloqueo por código, diary con timestamp, galería con desbloqueo progresivo |
| **Microscopio** | Detalles ocultos | Objetos físicos con marcas de agua, capas ocultas, micro-texto |
| **Candados** | Recompensas físicas | Códigos derivados de la resolución (no adivinables), feedback tangible |
| **Cajas fuertes** | Contenedores de siguiente paso | Pistas dentro, llaves, objetos necesarios |
| **Linternas** | Revelado de información | Tinta invisible, marcas UV, elementos en oscuridad |
| **Espejos** | Perspectivas alternativas | Texto invertido, mensajes ocultos, reflexiones |
| **Relojes/timers** | Urgencia y pistas | Hora específica como código, countdown como pista |

### Preguntas para diseño con materiales

1. **¿Qué materiales ya tienes?** → Listar todos
2. **¿Qué mecánica única permite cada uno?** → No usar solo como "contenedor"
3. **¿Cómo se integra en la narrativa?** → Justificar su presencia
4. **¿Es reutilizable?** → Priorizar materiales que sirvan para múltiples juegos

---

## Montaje Simple (Sin cosas grandes/caras)

**Regla:** Priorizar soluciones con montaje rápido y económico.

### Qué evitar

- ❌ Biombos o divisores grandes
- ❌ Estructuras complejas de montar
- ❌ Elementos costosos de fabricar
- ❌ Configuraciones que requieren mucho tiempo

### Qué priorizar

- ✅ Elementos ya existentes del espacio (puertas, ventanas, muebles)
- ✅ Materiales pequeños y portátiles (sobres, cajas, candados)
- ✅ Soluciones de **diseño resistente** antes que restricciones físicas complejas
  - Ejemplo: Información dividida que requiere colaboración, en lugar de pared física

### Criterio de validación

Si una prueba requiere más de 15 minutos de montaje físico, reconsiderar el diseño. Buscar alternativas que logren el mismo efecto con menos infraestructura.

---

## Paso 8: Generar PDF de Presentación (OBLIGATORIO)

**Todo juego nuevo debe generar automáticamente un PDF de presentación** profesional. Este PDF es el documento que se entrega al cliente/organizador.

### Cómo generar el PDF

Usar Puppeteer para convertir un HTML con CSS inline a PDF A4. No usar `wkhtmltopdf`, `weasyprint` ni Typst.

```bash
# Puppeteer disponible globalmente vía md-to-pdf:
# require('puppeteer') — usar la instancia disponible en el sistema
```

### Script de generación

```javascript
const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve('NOMBRE-JUEGO.html'), { waitUntil: 'networkidle0' });
  await page.pdf({
    path: path.resolve('NOMBRE-JUEGO.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '2cm', bottom: '2cm', left: '2.2cm', right: '2.2cm' },
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="font-size:8px; color:#bbb; width:100%; text-align:center;"><span class="pageNumber"></span></div>'
  });
  await browser.close();
})();
```

### Contenido del PDF

El HTML debe incluir estas secciones:

1. **Portada** — Título, metadatos (jugadores, duración, dificultad, edad)
2. **Sinopsis e Historia** — Premisa narrativa, personajes/claves
3. **Estructura del Juego** — Espacios, curva de dificultad, tipo de cierres
4. **Flujo de Pruebas** — Diagrama visual de las pruebas en orden
5. **Cada prueba en tarjeta individual** — Nombre, escritora/personaje, dificultad, código, narrativa, mecánica paso a paso, recompensa, materiales
6. **Final** — Cómo termina el juego, premios
7. **Resumen de códigos y materiales** — Tabla con todos los códigos y orígenes

### Reglas de estilo CSS (PDF-safe)

| Elemento | Regla |
|----------|-------|
| **Emojis** | PROHIBIDOS. Usar badges CSS con texto (ej: `<span class="sym">PLUMA</span>`) |
| **Entidades HTML** | Usar caracteres Unicode directos (→ ▼ ·) en vez de `&#8594;` `&middot;` |
| **Códigos** | Fondo blanco `!important`, texto oscuro `#2d0a3e !important`, 18pt bold, borde 3px |
| **Fuentes** | Google Fonts (Playfair Display + Source Sans 3) con fallback |
| **CSS** | Todo inline en `<style>`, sin archivos externos |

### Ubicación de archivos

```
juegos/NOMBRE-JUEGO/
├── NOMBRE-JUEGO.html          # HTML con CSS inline (source)
├── NOMBRE-JUEGO.pdf           # PDF generado (entregable)
├── juego/
│   ├── diseño/
│   │   ├── DISEÑO-JUEGO.md
│   │   ├── NARRATIVA.md
│   │   └── ...
│   └── pruebas/
│       ├── prueba-*.json
│       └── ...
└── ESTILO-JUEGOS.md           # (opcional)
```

### Referencia

Ver `LEGADO-EN-TINTA-VIOLETA.html` como template completo y probado. Copiar la estructura CSS y adaptar el contenido.
