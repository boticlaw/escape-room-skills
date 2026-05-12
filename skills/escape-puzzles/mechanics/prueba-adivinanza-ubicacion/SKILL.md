---
name: prueba-adivinanza-ubicacion
description: Skill para crear pruebas de adivinanzas que revelan ubicaciones fisicas. Usar cuando se necesite (1) que los jugadores descifren una adivinanza poetica, (2) la respuesta sea un lugar fisico a visitar, (3) combinar deduccion literaria con exploracion fisica.
---

# Prueba Adivinanza Ubicacion

Skill para el diseno, validacion y adaptacion de pruebas basadas en adivinanzas que revelan ubicaciones.

---

## Cuando Usar Este Tipo de Prueba

Usa este skill cuando:

- [x] **Trigger 1:** El jugador debe descifrar una adivinanza o poema
- [x] **Trigger 2:** La respuesta es un lugar fisico especifico
- [x] **Trigger 3:** Tras resolver, el jugador debe ir fisicamente al lugar

**Ejemplos de prompts que activan este skill:**
- "Quiero una adivinanza que lleve al palacio del pueblo"
- "Crea un poema que revele la iglesia como destino"
- "Necesito que deduzcan la plaza principal de un acertijo"

---

## Cuando NO Usarlo (Anti-Patrones)

**NO uses este skill cuando:**

### Anti-Patron 1: Adivinanza demasiado ambigua
- **Por que falla:** Si hay multiples respuestas validas, los jugadores se frustran
- **Mejor alternativa:** Usar pistas mas directas o `prueba-ubicacion-qr` con Google Maps

### Anti-Patron 2: Lugar no conocido por el publico
- **Por que falla:** Si nadie conoce el lugar, la adivinanza es imposible
- **Mejor alternativa:** Incluir mas contexto o usar `prueba-gps-navegacion`

### Anti-Patron 3: Sin cultura/patrimonio local
- **Por que falla:** Las adivinanzas funcionan mejor con lugares con historia
- **Mejor alternativa:** Usar `prueba-exploracion-visual` con fotos

**Regla general:** La adivinanza debe tener una unica respuesta clara para quien conoce el lugar.

---

## Variables de Diseno

### Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `formato_adivinanza` | string | ["poema", "prosa", "verso"] | "poema" | Formato del texto |
| `numero_lineas` | number | 4-12 | 6 | Cantidad de lineas/versos |
| `tipo_ubicacion` | string | ["monumento", "edificio", "naturaleza", "plaza"] | "monumento" | Categoria del lugar |
| `dificultad_texto` | number | 1-10 | 5 | Complejidad linguistica |
| `requiere_conocimiento_local` | boolean | true/false | true | Si necesita saber del lugar |

### Variables Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `texto_adivinanza` | string | Adivinanza completa |
| `respuesta_correcta` | string | Nombre del lugar |
| `pistas_contexto` | array | Pistas adicionales sobre el lugar |
| `url_maps` | string | Enlace Google Maps para pista final |
| `historia_lugar` | string | Contexto historico para enriquecer |

### Combinaciones Validas

- **Configuracion Basica:** `formato_adivinanza="poema"`, `numero_lineas=6`, `dificultad_texto=5`
- **Configuracion Dificil:** `dificultad_texto=8`, `requiere_conocimiento_local=true`

### Combinaciones Prohibidas/Peligrosas

- [x] NO combines `dificultad_texto > 7` con `requiere_conocimiento_local=false`
- [WARN] Cuidado con referencias muy locales sin contexto

---

## Errores Comunes de Jugadores

### Error 1: Interpretacion literal
- **Sintoma:** Buscan algo que coincide literalmente con el texto
- **Causa:** No captan las metaforas o referencias historicas
- **Prevencion:** Incluir pistas que guien hacia interpretacion figurativa
- **Intervencion:** Pista explicando el contexto historico

### Error 2: Piensan en lugar incorrecto
- **Sintoma:** Van a un lugar que "tambien podria ser"
- **Causa:** Adivinanza permite multiples interpretaciones
- **Prevencion:** Incluir versos que eliminen ambiguedad
- **Intervencion:** Pista especifica del lugar correcto

### Error 3: No conocen el lugar
- **Sintoma:** No pueden resolver por falta de conocimiento
- **Causa:** Adivinanza asume familiaridad con el sitio
- **Prevencion:** Contexto previo o tour que mencione el lugar
- **Intervencion:** Proporcionar Google Maps o descripcion

**Senales de alarma (el jugador esta atascado):**
- [ ] Mas de 10 minutos sin progreso
- [ ] Reportan "no sabemos de que habla"
- [ ] Van a multiples lugares incorrectos

**Tiempo maximo recomendado antes de intervenir:** 12 minutos

---

## Escalado de Dificultad

### Version Facil (Nivel 1-3)
- **Caracteristicas:**
  - Poesia simple, referencias directas
  - Lugar muy conocido
  - Pistas visuales incluidas
- **Tiempo estimado:** 3-5 minutos
- **Publico objetivo:** Ninos, turistas

### Version Estandar (Nivel 4-6)
- **Caracteristicas:**
  - Poesia con metaforas moderadas
  - Lugar conocido localmente
  - Requiere pensar pero no experto
- **Tiempo estimado:** 5-10 minutos
- **Publico objetivo:** Publico general

### Version Dificil (Nivel 7-9)
- **Caracteristicas:**
  - Poesia elaborada con referencias historicas
  - Lugar menos conocido
  - Requiere conocimiento local o investigacion
- **Tiempo estimado:** 10-20 minutos
- **Publico objetivo:** Locales, expertos

### Version Extrema (Nivel 10)
- **Caracteristicas:**
  - Poesia arcaica o cifrada
  - Lugar historico poco conocido
  - Requiere investigacion profunda
- **Tiempo estimado:** 20+ minutos
- **Publico objetivo:** Historiadores, expertos locales

**Matriz de escalado:**

| Aspecto | Facil | Estandar | Dificil |
|---------|-------|----------|---------|
| Complejidad texto | Simple | Moderada | Elaborada |
| Conocimiento local | No | Util | Necesario |
| Pistas disponibles | 5 | 4 | 3 |
| Contexto previo | Mucho | Alguno | Minimo |

---

## Adaptaciones

### Por Edad

**Ninos (6-10 anos):**
- Simplificar: Versos cortos y rimas obvias
- Evitar: Referencias historicas complejas
- Anadir: Ilustraciones o emojis

**Adolescentes (11-17 anos):**
- Mantener: Nivel estandar
- Permitir: Referencias culturales modernas

**Adultos (18+):**
- Complejidad completa
- Considerar: Referencias historicas y literarias

### Por Espacio

**Hall Escape (sala fisica):**
- Ventajas: Pueden leer despacio
- Limitaciones: No hay exploracion real
- Adaptaciones especificas: Foto del lugar como verificacion

**Street Escape (exterior/movil):**
- Ventajas: Exploracion real del lugar
- Limitaciones: Lectura en pantalla pequena
- Adaptaciones especificas: Texto grande, leer antes de mover

**Juego de Investigacion (no presencial):**
- Ventajas: Pueden investigar online
- Limitaciones: No hay verificacion fisica
- Adaptaciones especificas: Usar Street View

### Por Duracion

**Quick (5-10 minutos):**
- Elementos a eliminar: Versos extra
- Foco: Adivinanza corta y directa

**Standard (15-30 minutos):**
- Version completa

**Epic (45+ minutos):**
- Elementos a anadir: Multiples adivinanzas encadenadas
- Sub-etapas: Adivinanza 1 → lugar → nueva adivinanza → lugar 2

---

## Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-ubicacion-qr`**
- **Sinergia:** Adivinanza revela lugar, QR verifica llegada
- **Ejemplo compuesto:** Poema sobre palacio → ir al palacio → escanear QR
- **Frecuencia:** Muy comun

**2. `prueba-acrostico-ubicacion`**
- **Sinergia:** Adivinanza con estructura de acrostico
- **Ejemplo compuesto:** Versos donde las iniciales forman el nombre
- **Frecuencia:** Comun

### Skills Alternativos (Sustitucion)

**En lugar de este skill, considera:**

- **`prueba-ubicacion-qr`** → Si la adivinanza no aporta valor
- **`prueba-acrostico-ubicacion`** → Si prefieres estructura mas clara

---

## Ejemplos Concretos

### Ejemplo 1: El Palacio Condal

**Contexto:** Street escape en Monzon de Campos, descubrir el palacio medieval

**Configuracion:**
```json
{
  "formato_adivinanza": "poema",
  "numero_lineas": 6,
  "tipo_ubicacion": "monumento",
  "dificultad_texto": 5,
  "requiere_conocimiento_local": true,
  "texto_adivinanza": "Fui hogar de condes, lugar de esplendor,\nmis muros guardaban historias de honor.\nHoy solo restos me quedan por mostrar,\npero en mi torre el pasado se puede vislumbrar.\nSi la vida medieval quieres encontrar,\na mi vieja plaza te debes acercar."
}
```

**Flujo de juego:**
1. Jugador lee la adivinanza
2. Identifica pistas: "condes", "esplendor", "medieval", "plaza"
3. Deduce que es el Palacio Condal
4. Se desplaza a la plaza del pueblo
5. Escanea QR en los restos del palacio

**Solucion:** Plaza del pueblo donde estan los restos del Palacio Condal

**Pistas progresivas:**
- Pista 1: "Busca en un antiguo edificio historico relacionado con la nobleza"
- Pista 2: "Fue hogar de condes y centro de poder en la Edad Media"
- Pista 3: "Aunque en ruinas, sus columnas aun se alzan en la plaza principal"
- Pista 4: "Se trata del antiguo Palacio Condal de Monzon de Campos"
- Pista 5: "Ve a la Plaza del pueblo y busca los restos del Palacio Condal"

---

## Notas de Implementacion

### Para el Agente Usuario

**Antes de usar este skill:**
1. Investigar la historia del lugar objetivo
2. Redactar adivinanza con referencias especificas
3. Verificar que tiene unica respuesta clara

**Mientras usas este skill:**
1. Balancear poesia vs claridad
2. Incluir tanto pistas literales como figurativas
3. Preparar contexto historico

**Despues de crear la prueba:**
1. Testear con quien no conoce el lugar
2. Verificar que las pistas guian correctamente
3. Ajustar dificultad segun feedback

---

## Changelog

- **v1.0** (2026-02-15): Creacion inicial del skill

---

**Score de evaluacion:** 8/10  
**Frecuencia de uso esperada:** Alta  
**Dependencias:** `prueba-ubicacion-qr` (comun combinacion)
