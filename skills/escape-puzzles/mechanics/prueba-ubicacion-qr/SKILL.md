---
name: prueba-ubicacion-qr
description: Skill para crear pruebas de escaneo de QR en ubicaciones fisicas. Usar cuando se necesite (1) que los jugadores se desplacen a un lugar especifico del pueblo/ciudad, (2) escanear un codigo QR para desbloquear el siguiente paso, (3) combinar exploracion fisica con activacion digital.
---

# Prueba Ubicacion QR

Skill para el diseno, validacion y adaptacion de pruebas basadas en escaneo de codigos QR en ubicaciones fisicas especificas.

---

## Cuando Usar Este Tipo de Prueba

Usa este skill cuando:

- [x] **Trigger 1:** El jugador debe desplazarse fisicamente a una ubicacion concreta (monumento, edificio, punto de interes)
- [x] **Trigger 2:** Se necesita verificar que el jugador ha llegado al lugar correcto mediante escaneo de QR
- [x] **Trigger 3:** La narrativa requiere "descubrir" informacion solo disponible in situ

**Ejemplos de prompts que activan este skill:**
- "Quiero que los jugadores vayan al puente y escaneen un codigo"
- "Necesito una prueba donde tengan que buscar el palacio del pueblo"
- "Crea un enigma que los lleve a una iglesia y escaneen alli"

---

## Cuando NO Usarlo (Anti-Patrones)

**NO uses este skill cuando:**

### Anti-Patron 1: Ubicacion no accesible
- **Por que falla:** Si el lugar no tiene acceso publico o horarios restringidos, los jugadores quedaran bloqueados
- **Mejor alternativa:** Usar `prueba-exploracion-visual` con fotos/imagenes del lugar

### Anti-Patron 2: Solo necesitas navegacion sin verificacion
- **Por que falla:** Si solo quieres guiar al jugador sin verificar llegada, el QR es innecesario
- **Mejor alternativa:** Usar `prueba-gps-navegacion` sin verificacion QR

### Anti-Patron 3: Ubicacion interna/de interior
- **Por que falla:** Edificios cerrados, horarios limitados, o espacios privados impiden el acceso
- **Mejor alternativa:** Colocar QR en exterior cercano o usar `prueba-adivinanza-ubicacion` con foto

**Regla general:** Si la ubicacion no esta disponible 24/7 en espacio publico, reconsiderar el diseno.

---

## Variables de Diseno

### Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `tipo_ubicacion` | string | ["monumento", "edificio", "naturaleza", "urban"] | "monumento" | Categoria del lugar de interes |
| `requiere_gps` | boolean | true/false | false | Si debe mostrar navegacion GPS hasta el punto |
| `url_maps` | string | - | "" | Enlace de Google Maps para ayudar a localizar |
| `mensaje_llegada` | string | - | "" | Texto que aparece al escanear el QR |
| `url_siguiente` | string | - | "" | URL a la que redirige el QR escaneado |
| `pista_ubicacion` | string | - | "" | Pista textual sobre donde encontrar el QR |

### Variables Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `nombre_lugar` | string | Nombre oficial del lugar (ej: "Puente sobre el rio Carrion") |
| `coordenadas_lat` | number | Latitud GPS para verificacion opcional |
| `coordenadas_lng` | number | Longitud GPS para verificacion opcional |
| `horario_acceso` | string | Horario de acceso si aplica (ej: "9:00-20:00") |
| `foto_referencia` | string | URL o path a foto del lugar para ayuda visual |

### Combinaciones Validas

- **Configuracion Basica:** `tipo_ubicacion="monumento"`, `requiere_gps=false`, `url_maps=""`
- **Configuracion con GPS:** `requiere_gps=true`, `coordenadas_lat=42.0`, `coordenadas_lng=-4.5`, `url_maps="https://maps.app.goo.gl/..."`

### Combinaciones Prohibidas/Peligrosas

- [x] NO combines `requiere_gps=true` sin `coordenadas_lat/lng` validas
- [WARN] Cuidado con `horario_acceso` si el escape puede jugarse en cualquier momento

---

## Errores Comunes de Jugadores

### Error 1: No encuentran el QR
- **Sintoma:** El jugador esta en el lugar correcto pero no ve el codigo
- **Causa:** QR mal colocado, pequeno, o deteriorado
- **Prevencion:** Incluir foto de referencia de donde esta el QR
- **Intervencion:** Pista 4-5 con descripcion exacta de ubicacion del QR

### Error 2: Se equivocan de lugar
- **Sintoma:** Escanean QR pero no es el correcto o no hay QR
- **Causa:** Pista demasiado ambigua sobre la ubicacion
- **Prevencion:** Pistas progresivas que reducen el area de busqueda
- **Intervencion:** Proporcionar Google Maps link en pista avanzada

### Error 3: Problemas tecnicos
- **Sintoma:** No pueden escanear el QR (camara, luz, etc.)
- **Causa:** Condiciones de iluminacion, QR danado, o problemas de dispositivo
- **Prevencion:** Incluir codigo alfanumerico alternativo como backup
- **Intervencion:** Proporcionar URL directa como alternativa

**Senales de alarma (el jugador esta atascado):**
- [ ] Lleva mas de 10 minutos en la misma ubicacion sin escanear
- [ ] Reporta que "no hay QR" en el lugar
- [ ] La distancia GPS no cambia durante mucho tiempo

**Tiempo maximo recomendado antes de intervenir:** 15 minutos

---

## Escalado de Dificultad

### Version Facil (Nivel 1-3)
- **Caracteristicas:**
  - Google Maps link directo proporcionado
  - Ubicacion muy visible y conocida
  - QR en lugar obvio (entrada principal, cartel)
- **Tiempo estimado:** 5-10 minutos
- **Publico objetivo:** Ninos, grupos novatos, turistas

### Version Estandar (Nivel 4-6)
- **Caracteristicas:**
  - Pista textual sin link directo
  - Ubicacion requiere busqueda moderada
  - QR en lugar visible pero no obvio
- **Tiempo estimado:** 10-20 minutos
- **Publico objetivo:** Publico general

### Version Dificil (Nivel 7-9)
- **Caracteristicas:**
  - Adivinanza o acrostico revela la ubicacion
  - Lugar menos conocido o multiple pasos
  - QR pequeno o semi-oculto
- **Tiempo estimado:** 20-40 minutos
- **Publico objetivo:** Expertos, locales

### Version Extrema (Nivel 10)
- **Caracteristicas:**
  - Requiere resolver multiples pistas previas
  - Ubicacion requiere investigacion historica
  - QR integrado en elemento decorativo
- **Tiempo estimado:** 40+ minutos
- **Publico objetivo:** Competencias, speedruns con conocimiento local

**Matriz de escalado:**

| Aspecto | Facil | Estandar | Dificil |
|---------|-------|----------|---------|
| Pista ubicacion | Link Maps | Descripcion | Adivinanza |
| Tamano QR | Grande (10cm+) | Mediano (5cm) | Pequeno (3cm) |
| Google Maps | Directo | En pista 4 | Nunca |
| Pistas disponibles | 5 | 4 | 3 |

---

## Adaptaciones

### Por Edad

**Ninos (6-10 anos):**
- Simplificar: Proporcionar siempre Google Maps link
- Evitar: Ubicaciones en areas de trafico o peligrosas
- Anadir: Foto del lugar como pista visual

**Adolescentes (11-17 anos):**
- Mantener: Nivel estandar
- Permitir: Ubicaciones que requieran caminar mas

**Adultos (18+):**
- Complejidad completa
- Considerar: Ubicaciones con interes historico/cultural

**Grupos mixtos:**
- Estrategia: Adultos guian, ninos escanean
- Elementos cooperativos: Un miembro busca mientras otro lee pistas

### Por Espacio

**Hall Escape (sala fisica):**
- Ventajas: No aplica (es prueba de exterior)
- Limitaciones: No usar en hall escape
- Adaptaciones especificas: Solo si hay patio o area exterior anexa

**Street Escape (exterior/movil):**
- Ventajas: Ideal para este tipo de prueba
- Limitaciones: Clima, horarios, acceso publico
- Adaptaciones especificas: Verificar siempre acceso 24/7

**Juego de Investigacion (no presencial):**
- Ventajas: No aplica
- Limitaciones: Imposible verificar presencia fisica
- Adaptaciones especificas: Usar `prueba-exploracion-visual` con Street View

### Por Duracion

**Quick (5-10 minutos):**
- Elementos a eliminar: Adivinanzas previas
- Foco: Ubicacion cercana y obvia

**Standard (15-30 minutos):**
- Version completa sin modificaciones

**Epic (45+ minutos):**
- Elementos a anadir: Multiple ubicaciones encadenadas
- Sub-etapas: QR1 → pista → QR2 → pista → QR3

---

## Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-adivinanza-ubicacion`**
- **Sinergia:** La adivinanza revela el nombre del lugar, luego van a escanear QR
- **Ejemplo compuesto:** "Fui hogar de condes..." → Palacio Condal → Ir y escanear QR
- **Frecuencia:** Muy comun

**2. `prueba-gps-navegacion`**
- **Sinergia:** El GPS guia hasta la zona general, el QR verifica llegada exacta
- **Ejemplo compuesto:** GPS lleva al puente → QR en el puente confirma
- **Frecuencia:** Comun

**3. `prueba-acrostico-ubicacion`**
- **Sinergia:** El acrostico forma el nombre del lugar, luego escaneo QR
- **Ejemplo compuesto:** "IGLESIA" → Ir a la iglesia → Escanear QR
- **Frecuencia:** Comun

### Skills Alternativos (Sustitucion)

**En lugar de este skill, considera:**

- **`prueba-gps-navegacion`** → Si no tienes acceso fisico al lugar para colocar QR
- **`prueba-exploracion-visual`** → Si es un juego no presencial

### Skills Incompatibles (No Usar Juntos)

**Evita combinar con:**

- [x] `prueba-panel-electrico` → Conflicto: Mecanicas incompatibles (fisico exterior vs interior)

### Ejemplos de Pruebas Compuestas

**Ejemplo 1: Adivinanza + QR**
- **Skills usados:** `prueba-adivinanza-ubicacion` + `prueba-ubicacion-qr`
- **Descripcion:** Jugador lee adivinanza, deduce ubicacion, se desplaza y escanea QR
- **Por que funciona:** Combina deduccion cognitiva con verificacion fisica

---

## Ejemplos Concretos

### Ejemplo 1: Puente sobre el Rio Carrion

**Contexto:** Street escape en Monzon de Campos sobre vivienda rural

**Configuracion:**
```json
{
  "tipo_ubicacion": "monumento",
  "nombre_lugar": "Puente sobre el rio Carrion",
  "requiere_gps": false,
  "url_maps": "https://maps.app.goo.gl/C9hqUPtMLfRhdz89A",
  "url_siguiente": "https://devueltaalpueblo.com/pu3nt3",
  "mensaje_llegada": "Has llegado al antiguo puente..."
}
```

**Flujo de juego:**
1. Jugador recibe pista sobre "lugar que conecta partes del pueblo sobre un rio"
2. Deduce que es el puente
3. Se desplaza fisicamente
4. Escanea QR ubicado en el puente
5. Accede a la siguiente URL/enigma

**Solucion:** Ir al puente y escanear el codigo QR

**Pistas progresivas:**
- Pista 1: "Piensa en un lugar que conecta diferentes partes del pueblo sobre un rio"
- Pista 2: "Es un puente antiguo y emblematico"
- Pista 3: "El puente sobre el rio Carrion es tu proximo destino"
- Pista 4: "Dirigete al puente y busca un codigo QR. Puedes usar Google Maps"
- Pista 5: "Ve al puente y escanea el QR: https://maps.app.goo.gl/C9hqUPtMLfRhdz89A"

---

## Notas de Implementacion

### Para el Agente Usuario

**Antes de usar este skill:**
1. Verificar que la ubicacion es accesible 24/7
2. Confirmar que el QR puede colocarse fisicamente
3. Tener listo el URL de destino
4. Preparar enlace de Google Maps

**Mientras usas este skill:**
1. Configurar pistas progresivas que guian sin revelar demasiado
2. Incluir siempre una opcion de backup (codigo manual o URL directa)
3. Documentar coordenadas exactas del QR

**Despues de crear la prueba:**
1. Testear fisicamente el recorrido
2. Verificar que el QR escanea correctamente
3. Comprobar que el link de Maps funciona

---

## Changelog

- **v1.0** (2026-02-15): Creacion inicial del skill

---

**Score de evaluacion:** 8/10  
**Frecuencia de uso esperada:** Alta  
**Dependencias:** Ninguna
