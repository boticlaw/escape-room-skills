---
name: prueba-exploracion-visual
description: Skill para crear pruebas de exploracion visual donde los jugadores encuentran elementos ocultos en interfaces. Usar cuando se necesite (1) que los jugadores exploren una pagina o interfaz, (2) encontrar elementos ocultos o camuflados, (3) descubrir contenido secreto al interactuar con zonas especificas.
---

# Prueba Exploracion Visual

Skill para el diseno, validacion y adaptacion de pruebas basadas en encontrar elementos ocultos visualmente.

---

## Cuando Usar Este Tipo de Prueba

Usa este skill cuando:

- [x] **Trigger 1:** El jugador debe explorar una pagina web o interfaz completa
- [x] **Trigger 2:** Hay un elemento oculto que debe ser descubierto
- [x] **Trigger 3:** Al hacer clic en una zona especifica aparece contenido secreto

**Ejemplos de prompts que activan este skill:**
- "Quiero que encuentren un codigo oculto al final de la pagina"
- "Crea un puzzle donde deban hacer clic en una zona oscura"
- "Necesito que exploren toda la interfaz para encontrar algo escondido"

---

## Cuando NO Usarlo (Anti-Patrones)

**NO uses este skill cuando:**

### Anti-Patron 1: Elemento imposible de encontrar
- **Por que falla:** Si esta en pixel unico o sin ninguna pista, es frustrante
- **Mejor alternativa:** Incluir al menos una pista sutil

### Anti-Patron 2: Solo adivinanza sin exploracion
- **Por que falla:** Si la respuesta es puramente cognitiva, no es exploracion
- **Mejor alternativa:** Usar `prueba-adivinanza-ubicacion` o `prueba-investigacion-texto`

### Anti-Patron 3: Pantalla pequena (movil)
- **Por que falla:** Explorar en movil es dificil si el area es grande
- **Mejor alternativa:** Reducir area de busqueda o hacer mas obvio

**Regla general:** Debe haber al menos una pista indirecta de donde buscar.

---

## Variables de Diseno

### Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `tipo_ocultamiento` | string | ["color", "posicion", "interaccion", "scroll"] | "interaccion" | Como esta oculto |
| `area_busqueda` | string | ["toda_pagina", "seccion", "footer", "header"] | "toda_pagina" | Donde buscar |
| `tipo_interaccion` | string | ["clic", "hover", "scroll", "arrastrar"] | "clic" | Que accion revela |
| `dificultad_visual` | number | 1-10 | 5 | Que tan oculto esta |
| `feedback_revelacion` | boolean | true/false | true | Si hay feedback al encontrar |

### Variables Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `coordenadas_elemento` | string | Posicion aproximada (ej: "footer central") |
| `color_camuflaje` | string | Color que lo hace invisible |
| `mensaje_oculto` | string | Contenido que aparece al revelar |
| `codigo_recompensa` | string | Codigo revelado |
| `pista_visual` | string | Elemento que sugiere donde buscar |

### Combinaciones Validas

- **Configuracion Basica:** `tipo_ocultamiento="scroll"`, `area_busqueda="footer"`, `dificultad_visual=3`
- **Configuracion Avanzada:** `tipo_ocultamiento="color"`, `dificultad_visual=7`, `feedback_revelacion=true`

### Combinaciones Prohibidas/Peligrosas

- [x] NO combines `dificultad_visual > 8` con `area_busqueda="toda_pagina"`
- [WARN] Cuidado con `tipo_interaccion="hover"` en moviles

---

## Errores Comunes de Jugadores

### Error 1: No hacen scroll suficiente
- **Sintoma:** No encuentran el elemento porque no bajan del todo
- **Causa:** Asumen que todo el contenido importante esta arriba
- **Prevencion:** Indicar en pista que exploren "toda" la pagina
- **Intervencion:** Pista especifica: "desplazate hasta el final"

### Error 2: No prueban interacciones
- **Sintoma:** Miran pero no hacen clic en zonas sospechosas
- **Causa:** No esperan elementos interactivos ocultos
- **Prevencion:** Texto que sugiera "explorar e interactuar"
- **Intervencion:** Pista: "haz clic o interactua con zonas inusuales"

### Error 3: Miran solo texto, ignoran elementos visuales
- **Sintoma:** Leen todo pero no ven el elemento grafico
- **Causa:** Foco en contenido textual
- **Prevencion:** Elemento visual contrastante
- **Intervencion:** Pista: "mira los elementos graficos, no solo el texto"

**Senales de alarma (el jugador esta atascado):**
- [ ] Mas de 8 minutos en la misma pagina
- [ ] Reportan "no hay nada mas"
- [ ] No han hecho scroll completo

**Tiempo maximo recomendado antes de intervenir:** 10 minutos

---

## Escalado de Dificultad

### Version Facil (Nivel 1-3)
- **Caracteristicas:**
  - Elemento al final de scroll
  - Area oscura pero visible
  - Pista directa de donde buscar
- **Tiempo estimado:** 2-5 minutos
- **Publico objetivo:** Ninos, novatos

### Version Estandar (Nivel 4-6)
- **Caracteristicas:**
  - Elemento en footer
  - Requiere clic para revelar
  - Pista indirecta
- **Tiempo estimado:** 5-10 minutos
- **Publico objetivo:** Publico general

### Version Dificil (Nivel 7-9)
- **Caracteristicas:**
  - Elemento camuflado por color
  - Requiere exploracion completa
  - Minimo feedback visual
- **Tiempo estimado:** 10-15 minutos
- **Publico objetivo:** Expertos

### Version Extrema (Nivel 10)
- **Caracteristicas:**
  - Multiples capas de ocultamiento
  - Pixel hunting extremo
  - Sin pistas
- **Tiempo estimado:** 15+ minutos
- **Publico objetivo:** Gamers hardcore

**Matriz de escalado:**

| Aspecto | Facil | Estandar | Dificil |
|---------|-------|----------|---------|
| Tipo ocultamiento | Scroll | Interaccion | Color |
| Area busqueda | Footer | Toda pagina | Especifica |
| Pistas disponibles | 5 | 4 | 2 |
| Feedback | Inmediato | Moderado | Minimo |

---

## Adaptaciones

### Por Edad

**Ninos (6-10 anos):**
- Simplificar: Area pequena, muy visible
- Evitar: Pixel hunting
- Anadir: Animaciones al encontrar

**Adolescentes (11-17 anos):**
- Mantener: Nivel estandar
- Permitir: Easter eggs multiples

**Adultos (18+):**
- Complejidad completa
- Considerar: Referencias a juegos clasicos

### Por Espacio

**Hall Escape (sala fisica):**
- Ventajas: Pantalla grande visible
- Limitaciones: No es exploration fisica real
- Adaptaciones especificas: Elementos fisicos ocultos en sala

**Street Escape (exterior/movil):**
- Ventajas: Interaccion tactil natural
- Limitaciones: Pantalla pequena
- Adaptaciones especificas: Elementos grandes, areas reducidas

**Juego de Investigacion (no presencial):**
- Ventajas: Ideal para interfaz web
- Limitaciones: No hay tacto fisico
- Adaptaciones especificas: Cursor personalizado

### Por Duracion

**Quick (5-10 minutos):**
- Elementos a eliminar: Multiple capas
- Foco: Un elemento claramente oculto

**Standard (15-30 minutos):**
- Version completa

**Epic (45+ minutos):**
- Elementos a anadir: Multiples secretos encadenados
- Sub-etapas: Secreto1 → codigo → Secreto2

---

## Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-investigacion-texto`**
- **Sinergia:** Leer texto + encontrar elemento oculto
- **Ejemplo compuesto:** Documento con palabra oculta
- **Frecuencia:** Comun

**2. `prueba-cifrado`**
- **Sinergia:** Elemento oculto contiene codigo cifrado
- **Ejemplo compuesto:** Zona negra → clic → codigo
- **Frecuencia:** Ocasional

### Skills Alternativos (Sustitucion)

**En lugar de este skill, considera:**

- **`prueba-investigacion-texto`** → Si es mas sobre lectura
- **`prueba-ubicacion-qr`** → Si es exploracion fisica real

---

## Ejemplos Concretos

### Ejemplo 1: Los Secretos de la Muralla

**Contexto:** Street escape, explorar pagina sobre la muralla del Palacio Condal

**Configuracion:**
```json
{
  "tipo_ocultamiento": "interaccion",
  "area_busqueda": "footer",
  "tipo_interaccion": "clic",
  "dificultad_visual": 5,
  "coordenadas_elemento": "seccion negra al pie de pagina",
  "mensaje_oculto": "CODIGO_SECRETO_123"
}
```

**Flujo de juego:**
1. Jugador lee contenido sobre la muralla
2. Explora la pagina completa
3. Llega al final, ve seccion negra
4. Hace clic en la zona negra
5. Aparece codigo o mensaje oculto

**Solucion:** Clic en la seccion negra del footer

**Pistas progresivas:**
- Pista 1: "Explora cuidadosamente todos los elementos de la pagina web"
- Pista 2: "A veces, las respuestas estan ocultas en lugares poco habituales"
- Pista 3: "Desplazate hasta el final de la pagina"
- Pista 4: "Haz clic o interactua con la seccion negra al pie de la pagina"
- Pista 5: "Al hacer clic en la parte negra al final, aparecera un codigo"

---

## Notas de Implementacion

### Para el Agente Usuario

**Antes de usar este skill:**
1. Definir exactamente donde esta el elemento
2. Verificar que es posible encontrarlo
3. Incluir al menos una pista indirecta

**Mientras usas este skill:**
1. Balancear ocultamiento vs frustracion
2. Asegurar feedback al encontrar
3. Preparar pistas progresivas

**Despues de crear la prueba:**
1. Testear con usuarios sin conocimiento previo
2. Medir tiempo de descubrimiento
3. Ajustar visibilidad segun feedback

---

## Changelog

- **v1.0** (2026-02-15): Creacion inicial del skill

---

**Score de evaluacion:** 7/10  
**Frecuencia de uso esperada:** Media  
**Dependencias:** Ninguna
