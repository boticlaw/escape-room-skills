---
name: prueba-gps-navegacion
description: Skill para crear pruebas de navegacion GPS hacia un destino. Usar cuando se necesite (1) que los jugadores se desplacen a una ubicacion usando GPS, (2) verificar cercania a un punto sin QR fisico, (3) combinar exploracion fisica con tecnologia de geolocalizacion.
---

# Prueba GPS Navegacion

Skill para el diseno, validacion y adaptacion de pruebas basadas en navegacion GPS.

---

## Cuando Usar Este Tipo de Prueba

Usa este skill cuando:

- [x] **Trigger 1:** El jugador debe navegar a una ubicacion usando GPS del movil
- [x] **Trigger 2:** Se verifica llegada por distancia, no por QR
- [x] **Trigger 3:** La ubicacion puede no tener QR fisico instalado

**Ejemplos de prompts que activan este skill:**
- "Quiero que los lleve al graffiti usando GPS"
- "Crea una prueba de navegacion hasta un punto sin QR"
- "Necesito que usen el GPS para llegar a un destino"

---

## Cuando NO Usarlo (Anti-Patrones)

**NO uses este skill cuando:**

### Anti-Patron 1: Ubicacion con GPS pobre
- **Por que falla:** Interiores, tuneles, zonas con mala cobertura
- **Mejor alternativa:** Usar `prueba-ubicacion-qr` con verificacion manual

### Anti-Patron 2: Necesitas verificacion exacta
- **Por que falla:** GPS tiene margen de error de 5-20 metros
- **Mejor alternativa:** Usar `prueba-ubicacion-qr` para verificacion precisa

### Anti-Patron 3: Sin acceso a ubicacion
- **Por que falla:** Si el usuario no autoriza GPS, no funciona
- **Mejor alternativa:** Incluir instrucciones manuales o link Maps

**Regla general:** Siempre tener fallback para usuarios sin GPS autorizado.

---

## Variables de Diseno

### Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `latitud_objetivo` | number | -90 a 90 | - | Latitud del punto destino |
| `longitud_objetivo` | number | -180 a 180 | - | Longitud del punto destino |
| `radio_verificacion` | number | 5-100 | 20 | Metros para considerar "llegado" |
| `mostrar_distancia` | boolean | true/false | true | Si muestra metros restantes |
| `mostrar_direccion` | boolean | true/false | true | Si muestra flecha de direccion |
| `url_maps_backup` | string | - | "" | Link a Google Maps como alternativa |

### Variables Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `nombre_destino` | string | Nombre del lugar |
| `descripcion_destino` | string | Descripcion para ayudar a ubicar |
| `mensaje_llegada` | string | Texto al llegar |
| `foto_referencia` | string | Foto del lugar |
| `instrucciones_sin_gps` | string | Que hacer si no hay GPS |

### Combinaciones Validas

- **Configuracion Basica:** `radio_verificacion=20`, `mostrar_distancia=true`, `mostrar_direccion=true`
- **Configuracion Precisa:** `radio_verificacion=10`, `url_maps_backup` incluido

### Combinaciones Prohibidas/Peligrosas

- [x] NO combines `radio_verificacion < 10` sin instrucciones alternativas
- [WARN] Cuidado sin `url_maps_backup` (usuarios sin GPS se bloquean)

---

## Errores Comunes de Jugadores

### Error 1: No autorizan ubicacion
- **Sintoma:** Ve "calculando distancia" permanente
- **Causa:** No dieron permiso de GPS al navegador/app
- **Prevencion:** Mensaje inicial pidiendo autorizar
- **Intervencion:** Instrucciones para habilitar GPS por dispositivo

### Error 2: GPS impreciso
- **Sintoma:** Esta en el lugar pero no detecta llegada
- **Causa:** GPS tiene error de 10-20 metros
- **Prevencion:** Radio de verificacion generoso (20+ metros)
- **Intervencion:** Sugerir moverse un poco o refrescar

### Error 3: Van en direccion incorrecta
- **Sintoma:** Distancia aumenta en lugar de disminuir
- **Causa:** Confusion con la direccion
- **Prevencion:** Flecha de direccion clara
- **Intervencion:** Pista 3: "Ve hacia el colegio" o referencia local

**Senales de alarma (el jugador esta atascado):**
- [ ] "Calculando distancia" por mas de 2 minutos
- [ ] Distancia no cambia en mucho tiempo
- [ ] Reportan estar en el lugar pero no detecta

**Tiempo maximo recomendado antes de intervenir:** 10 minutos

---

## Escalado de Dificultad

### Version Facil (Nivel 1-3)
- **Caracteristicas:**
  - Radio amplio (30+ metros)
  - Distancia y direccion visibles
  - Google Maps link directo
- **Tiempo estimado:** 5-10 minutos
- **Publico objetivo:** Ninos, novatos, turistas

### Version Estandar (Nivel 4-6)
- **Caracteristicas:**
  - Radio medio (20 metros)
  - Solo distancia visible
  - Pista de direccion general
- **Tiempo estimado:** 10-15 minutos
- **Publico objetivo:** Publico general

### Version Dificil (Nivel 7-9)
- **Caracteristicas:**
  - Radio estrecho (10 metros)
  - Sin direccion automatica
  - Solo referencia textual
- **Tiempo estimado:** 15-25 minutos
- **Publico objetivo:** Locales, expertos

### Version Extrema (Nivel 10)
- **Caracteristicas:**
  - Multiple waypoints
  - Sin indicaciones de ningun tipo
  - Requiere conocer el pueblo
- **Tiempo estimado:** 25+ minutos
- **Publico objetivo:** Locales expertos

**Matriz de escalado:**

| Aspecto | Facil | Estandar | Dificil |
|---------|-------|----------|---------|
| Radio verificacion | 30m | 20m | 10m |
| Mostrar direccion | Si | Si | No |
| Google Maps link | Directo | En pista | No |
| Pistas disponibles | 5 | 4 | 2 |

---

## Adaptaciones

### Por Edad

**Ninos (6-10 anos):**
- Simplificar: Radio muy amplio, direccion clara
- Evitar: Distancias muy largas
- Anadir: Dibujos o iconos

**Adolescentes (11-17 anos):**
- Mantener: Nivel estandar
- Permitir: Competencia de quien llega primero

**Adultos (18+):**
- Complejidad completa
- Considerar: Referencias locales

### Por Espacio

**Hall Escape (sala fisica):**
- Ventajas: No aplica
- Limitaciones: No hay GPS real
- Adaptaciones especificas: No usar en hall escape

**Street Escape (exterior/movil):**
- Ventajas: Ideal para este tipo
- Limitaciones: Clima, cobertura
- Adaptaciones especificas: Fallback sin GPS

**Juego de Investigacion (no presencial):**
- Ventajas: No aplica
- Limitaciones: No hay presencia fisica
- Adaptaciones especificas: Usar Street View virtual

### Por Duracion

**Quick (5-10 minutos):**
- Elementos a eliminar: Distancias largas
- Foco: Destino cercano (< 500m)

**Standard (15-30 minutos):**
- Version completa

**Epic (45+ minutos):**
- Elementos a anadir: Multiples destinos encadenados
- Sub-etapas: GPS1 → punto → GPS2 → punto → GPS3

---

## Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-ubicacion-qr`**
- **Sinergia:** GPS lleva a zona, QR verifica exacto
- **Ejemplo compuesto:** Navega con GPS → escanea QR al llegar
- **Frecuencia:** Comun

**2. `prueba-adivinanza-ubicacion`**
- **Sinergia:** Adivinanza revela destino, GPS guia
- **Ejemplo compuesto:** Resuelve adivinanza → navega con GPS
- **Frecuencia:** Comun

### Skills Alternativos (Sustitucion)

**En lugar de este skill, considera:**

- **`prueba-ubicacion-qr`** → Si tienes QR instalado y necesitas precision
- **`prueba-adivinanza-ubicacion`** → Si prefieres puzzle sobre tecnologia

---

## Ejemplos Concretos

### Ejemplo 1: El Graffiti Final

**Contexto:** Street escape, llegar al graffiti final como ultimo desafio

**Configuracion:**
```json
{
  "latitud_objetivo": 42.1234,
  "longitud_objetivo": -4.5678,
  "radio_verificacion": 20,
  "mostrar_distancia": true,
  "mostrar_direccion": true,
  "nombre_destino": "Graffiti de Monzon de Campos",
  "instrucciones_sin_gps": "Si el GPS no funciona, recuerda que tienes que permitir el acceso a la ubicacion"
}
```

**Flujo de juego:**
1. Jugador ve pantalla con distancia al graffiti
2. Sigue la direccion/flecha en pantalla
3. Observa que la distancia disminuye
4. Al llegar (distancia < 20m), se desbloquea contenido

**Solucion:** Navegar hasta el graffiti usando GPS

**Pistas progresivas:**
- Pista 1: "Observa hacia donde tienes que ir, siempre tienes que restar metros. Autoriza a tu telefono para acceder a la ubicacion"
- Pista 2: "Avanza un poco y fijate si suben o bajan los metros"
- Pista 3: "Ir en direccion al colegio suele ser una buena opcion"
- Pista 4: "Paciencia y observa"
- Pista 5: "Encuentra el graffiti y escanea el codigo QR"

---

## Notas de Implementacion

### Para el Agente Usuario

**Antes de usar este skill:**
1. Obtener coordenadas exactas del destino
2. Verificar cobertura GPS en la zona
3. Preparar instrucciones para usuarios sin GPS

**Mientras usas este skill:**
1. Incluir siempre fallback sin GPS
2. Radio de verificacion generoso
3. Pistas de referencia local

**Despues de crear la prueba:**
1. Testear in situ con diferentes dispositivos
2. Verificar precision del GPS
3. Ajustar radio segun resultados

---

## Changelog

- **v1.0** (2026-02-15): Creacion inicial del skill

---

**Score de evaluacion:** 7/10  
**Frecuencia de uso esperada:** Media  
**Dependencias:** Ninguna
