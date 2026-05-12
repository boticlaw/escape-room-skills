---
name: prueba-emparejamiento-memoria
description: Skill para crear pruebas de emparejamiento de elementos con secuencia de memoria. Usar cuando se necesite (1) que los jugadores asocien pares de elementos, (2) recordar la secuencia de emparejamientos para reproducirla, (3) puzzles tipo llave-cerradura o codigo-destino.
---

# Prueba Emparejamiento Memoria

Skill para el diseno, validacion y adaptacion de pruebas basadas en emparejar elementos y recordar secuencias.

---

## Cuando Usar Este Tipo de Prueba

Usa este skill cuando:

- [x] **Trigger 1:** El jugador debe asociar elementos de dos conjuntos (llaves-cerraduras, codigos-destinos)
- [x] **Trigger 2:** Tras emparejar, debe recordar y reproducir la secuencia correcta
- [x] **Trigger 3:** La prueba combina deduccion con memoria a corto plazo

**Ejemplos de prompts que activan este skill:**
- "Quiero que asocien llaves con cerraduras y luego recuerden el orden"
- "Crea un puzzle donde cada codigo abre una caja diferente"
- "Necesito que emparejen elementos y recuerden la secuencia"

---

## Cuando NO Usarlo (Anti-Patrones)

**NO uses este skill cuando:**

### Anti-Patron 1: Solo asociacion sin memoria
- **Por que falla:** Si no hay que recordar la secuencia, es solo un puzzle de asociacion
- **Mejor alternativa:** Usar `prueba-emparejamiento-texto` simple

### Anti-Patron 2: Demasiados elementos
- **Por que falla:** Mas de 7-8 pares sobrecarga la memoria de trabajo
- **Mejor alternativa:** Dividir en multiples fases

### Anti-Patron 3: Sin forma de deducir
- **Por que falla:** Si es pura prueba y error sin logica, es frustrante
- **Mejor alternativa:** Incluir pistas visuales o logicas

**Regla general:** El numero de elementos debe estar entre 3 y 7 para memoria funcional.

---

## Variables de Diseno

### Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `numero_pares` | number | 3-7 | 5 | Cantidad de parejas a emparejar |
| `tipo_elemento_a` | string | ["llaves", "codigos", "simbolos", "colores"] | "llaves" | Primer conjunto de elementos |
| `tipo_elemento_b` | string | ["cerraduras", "destinos", "posiciones", "cajas"] | "cerraduras" | Segundo conjunto de elementos |
| `mostrar_feedback` | boolean | true/false | true | Si indica acierto/error en tiempo real |
| `permitir_errores` | boolean | true/false | true | Si se puede fallar y reintentar |
| `requiere_secuencia` | boolean | true/false | true | Si hay que recordar el orden |

### Variables Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `solucion_emparejamientos` | array | Pares correctos [(1,4), (2,3), ...] |
| `secuencia_final` | array | Orden en que pulsar tras emparejar |
| `intentos_maximos` | number | Limite de intentos (0 = infinito) |
| `penalizacion_error` | number | Segundos de penalizacion por error |
| `codigo_recompensa` | string | Codigo al completar |

### Combinaciones Validas

- **Configuracion Basica:** `numero_pares=5`, `mostrar_feedback=true`, `requiere_secuencia=true`
- **Configuracion Facil:** `numero_pares=3`, `permitir_errores=true`, `requiere_secuencia=false`

### Combinaciones Prohibidas/Peligrosas

- [x] NO combines `numero_pares > 5` con `requiere_secuencia=true` en publico general
- [WARN] Cuidado con `permitir_errores=false` (muy punitivo)

---

## Errores Comunes de Jugadores

### Error 1: No anotan la secuencia
- **Sintoma:** Emparejan correctamente pero olvidan el orden
- **Causa:** Subestiman la carga de memoria
- **Prevencion:** Pistas que sugieren "apuntar es util"
- **Intervencion:** Recordar que pueden probar antes de confirmar

### Error 2: Prueban al azar sin estrategia
- **Sintoma:** Muchos errores por falta de sistema
- **Causa:** No establecen metodo de pruebas
- **Prevencion:** Pista 1 sugiriendo probar sistematicamente
- **Intervencion:** Explicar que pueden probar cada llave

### Error 3: Confunden elementos similares
- **Sintoma:** Errores en pares que se parecen
- **Causa:** Elementos con caracteristicas similares
- **Prevencion:** Elementos visualmente distinguibles

**Senales de alarma (el jugador esta atascado):**
- [ ] Mas de 8 errores sin progreso
- [ ] Reportan "haber probado todo" sin exito
- [ ] Emparejan pero fallan la secuencia repetidamente

**Tiempo maximo recomendado antes de intervenir:** 12 minutos

---

## Escalado de Dificultad

### Version Facil (Nivel 1-3)
- **Caracteristicas:**
  - 3 pares
  - Feedback inmediato de acierto/error
  - No requiere secuencia final
- **Tiempo estimado:** 3-5 minutos
- **Publico objetivo:** Ninos, novatos

### Version Estandar (Nivel 4-6)
- **Caracteristicas:**
  - 5 pares
  - Feedback visual
  - Requiere secuencia final
- **Tiempo estimado:** 5-10 minutos
- **Publico objetivo:** Publico general

### Version Dificil (Nivel 7-9)
- **Caracteristicas:**
  - 7 pares
  - Errores limitados
  - Secuencia obligatoria
- **Tiempo estimado:** 10-15 minutos
- **Publico objetivo:** Expertos

### Version Extrema (Nivel 10)
- **Caracteristicas:**
  - 7+ pares con elementos similares
  - Sin feedback de error
  - Penalizacion severa
- **Tiempo estimado:** 15+ minutos
- **Publico objetivo:** Competencias

**Matriz de escalado:**

| Aspecto | Facil | Estandar | Dificil |
|---------|-------|----------|---------|
| Numero pares | 3 | 5 | 7 |
| Requiere secuencia | No | Si | Si |
| Errores permitidos | Infinitos | Infinitos | 3 |
| Pistas disponibles | 5 | 4 | 2 |

---

## Adaptaciones

### Por Edad

**Ninos (6-10 anos):**
- Simplificar: 3 pares, sin secuencia
- Evitar: Elementos abstractos
- Anadir: Colores y formas distintivas

**Adolescentes (11-17 anos):**
- Mantener: 5 pares con secuencia
- Permitir: Desafios de memoria

**Adultos (18+):**
- Complejidad completa
- Considerar: Tematicas narrativas

### Por Espacio

**Hall Escape (sala fisica):**
- Ventajas: Elementos fisicos posibles (llaves reales)
- Limitaciones: Requiere preparacion fisica
- Adaptaciones especificas: Llaves fisicas con cerraduras

**Street Escape (exterior/movil):**
- Ventajas: Interfaz tactil intuitiva
- Limitaciones: Pantalla pequena
- Adaptaciones especificas: Elementos grandes y claros

**Juego de Investigacion (no presencial):**
- Ventajas: Perfecto para interfaz web
- Limitaciones: Sin tacto fisico
- Adaptaciones especificas: Drag & drop

### Por Duracion

**Quick (5-10 minutos):**
- Elementos a eliminar: Secuencia final
- Foco: 3-4 pares

**Standard (15-30 minutos):**
- Version completa: 5 pares con secuencia

**Epic (45+ minutos):**
- Elementos a anadir: Multiples fases de emparejamiento
- Sub-etapas: Emparejar fase 1 → Emparejar fase 2

---

## Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-cifrado`**
- **Sinergia:** Los pares emparejados forman un codigo
- **Ejemplo compuesto:** Llave1-Cerradura4 = "14", formar codigo completo
- **Frecuencia:** Comun

### Skills Alternativos (Sustitucion)

**En lugar de este skill, considera:**

- **`prueba-emparejamiento-texto`** → Si es solo conceptos sin secuencia
- **`prueba-tablet-cooperativo`** → Si requiere coordinacion grupal

---

## Ejemplos Concretos

### Ejemplo 1: Las Cinco Llaves y Cerraduras

**Contexto:** Street escape sobre busqueda de vivienda, 5 casas potenciales

**Configuracion:**
```json
{
  "numero_pares": 5,
  "tipo_elemento_a": "llaves",
  "tipo_elemento_b": "cerraduras",
  "mostrar_feedback": true,
  "permitir_errores": true,
  "requiere_secuencia": true,
  "solucion_emparejamientos": [[1,4], [2,3], [3,1], [4,5], [5,2]]
}
```

**Flujo de juego:**
1. Jugador ve 5 llaves y 5 cerraduras
2. Prueba cada llave con cada cerradura para encontrar match
3. Recuerda que llave va con cada cerradura
4. Pulsa las cerraduras en secuencia correcta

**Solucion:** 
- Llave 1 - Cerradura 4
- Llave 2 - Cerradura 3
- Llave 3 - Cerradura 1
- Llave 4 - Cerradura 5
- Llave 5 - Cerradura 2

**Pistas progresivas:**
- Pista 1: "Pincha en la llave y la cerradura con la que crees que funciona"
- Pista 2: "Acierta cada llave sin cometer errores"
- Pista 3: "Recuerda con que llave funciona cada cerradura"
- Pista 4: "Puedes probar cada llave para saber con que cerradura funciona"
- Pista 5: "Secuencia: L1-C4, L2-C3, L3-C1, L4-C5, L5-C2"

---

## Notas de Implementacion

### Para el Agente Usuario

**Antes de usar este skill:**
1. Definir los pares y su logica de asociacion
2. Documentar la solucion completa
3. Verificar que no hay ambiguedades

**Mientras usas este skill:**
1. Balancear numero de pares vs dificultad
2. Incluir feedback claro de acierto/error
3. Preparar pistas especificas de la secuencia

**Despues de crear la prueba:**
1. Testear con usuarios reales
2. Medir tiempo de completado
3. Ajustar numero de pares segun feedback

---

## Changelog

- **v1.0** (2026-02-15): Creacion inicial del skill

---

**Score de evaluacion:** 8/10  
**Frecuencia de uso esperada:** Alta  
**Dependencias:** Ninguna
