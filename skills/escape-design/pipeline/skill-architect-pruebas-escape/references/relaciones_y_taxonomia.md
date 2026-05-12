# Relaciones y Taxonomia de Skills

## Principios de Relacion

### 1. Las Pruebas JSON Referencian Skills

**Flujo de referencia:**
```
prueba_concreta.json
    ↓ referencia
SKILL de tipo (ej: prueba-cifrado)
    ↓ define reglas
Prueba implementada en juego
```

**Regla:** Una prueba JSON debe tener:
```json
{
  "id": "prueba_001",
  "skill_primario": "prueba-cifrado",
  "skills_secundarios": ["prueba-busqueda-objetos"],
  "configuracion": {
    "tipo_cifrado": "cesar",
    "longitud": 12
  }
}
```

**Nunca al reves:** Los skills NO contienen listas de pruebas JSON.

---

### 2. Composicion de Skills

**Una prueba puede usar multiples skills:**

```json
{
  "id": "prueba_compuesta_001",
  "nombre": "El Mensaje Escondido",
  "descripcion": "Encontrar fragmentos de un mensaje cifrado",
  "skill_primario": "prueba-cifrado",
  "skills_secundarios": ["prueba-busqueda-objetos", "prueba-logica-secuencial"],
  "fases": [
    {
      "orden": 1,
      "skill": "prueba-busqueda-objetos",
      "objetivo": "Encontrar 3 fragmentos de papel"
    },
    {
      "orden": 2,
      "skill": "prueba-logica-secuencial",
      "objetivo": "Determinar el orden correcto de los fragmentos"
    },
    {
      "orden": 3,
      "skill": "prueba-cifrado",
      "objetivo": "Descifrar el mensaje completo"
    }
  ]
}
```

**Reglas de composicion:**
- 1 skill primario (el tipo principal de la prueba)
- 0-3 skills secundarios (complementos)
- Las fases deben ser opcionales (no toda prueba compuesta es secuencial)

---

### 3. Jerarquia de Skills

#### Skills Atomicos (Base)

Mecanicas puras, indivisibles:

- `prueba-cifrado` → Transformacion simbolica
- `prueba-busqueda-objetos` → Hallazgo fisico
- `prueba-mecanismo-fisico` → Interaccion tactil
- `prueba-logica-secuencial` → Deduccion ordenada
- `prueba-observacion` → Percepcion visual
- `prueba-asociacion` → Conexiones conceptuales
- `prueba-cooperativo` → Accion simultanea

**Caracteristicas:**
- Definen una mecanica unica
- No dependen de otros skills
- Reutilizables en cualquier combinacion

#### Skills Compuestos (Derivados)

Combinaciones frecuentes que merecen skill propio:

- `prueba-cifrado-busqueda` → Mensajes cifrados escondidos
- `prueba-mecanismo-logica` → Puzzles mecanicos complejos
- `prueba-cooperativo-mecanismo` → Requiere 2+ jugadores accionando

**Cuando crear un skill compuesto:**
1. La combinacion aparece en ≥5 pruebas distintas
2. Tiene reglas de validacion especificas de la combinacion
3. No se puede expresar como skill atomico + configuracion

**Ejemplo:**

Skill atomico `prueba-cifrado` tiene variable `ubicacion` que puede ser "encontrado" o "dado". Esto cubre la mayoria de casos.

Pero si el 90% de los cifrados en tu sistema involucran busqueda fisica extensa con logica de "encontrar piezas para formar mensaje", entonces:
- Crear skill compuesto: `prueba-cifrado-por-partes`
- O extender el atomico con variable `modo_entrega="fragmentado"`

**Decision:** Si la variante requiere:
- Logica de validacion unica (ej: verificar que tienen TODOS los fragmentos)
- Estados intermedios especificos
- Documentacion extensa de errores propios de la combinacion

Entonces: skill compuesto.

Si solo cambia como se presenta: extender skill atomico.

---

## Taxonomia del Ecosistema

### Categorias Principales

```
SKILLS DE PRUEBA
├── Mentales (Procesamiento cognitivo)
│   ├── Simbolicos
│   │   ├── prueba-cifrado
│   │   ├── prueba-asociacion
│   │   └── prueba-interpretacion
│   └── Logicos
│       ├── prueba-logica-secuencial
│       ├── prueba-logica-espacial
│       └── prueba-deduccion
├── Fisicos (Interaccion espacio)
│   ├── Busqueda
│   │   ├── prueba-busqueda-objetos
│   │   └── prueba-observacion
│   └── Manipulacion
│       ├── prueba-mecanismo-fisico
│       └── prueba-construccion
├── Sociales (Interaccion jugadores)
│   ├── prueba-cooperativo
│   ├── prueba-rol-oculto
│   └── prueba-comunicacion-restringida
├── Temporales (Tiempo)
│   ├── prueba-ritmo
│   ├── prueba-sincronizacion
│   └── prueba-cronometro
└── Tecnologicos (Digital/AR/VR)
    ├── prueba-digital-interfaz
    ├── prueba-realidad-aumentada
    └── prueba-virtual-espacial
```

### Matriz de Combinaciones Comunes

| Skill A | Skill B | Frecuencia | Skill Compuesto? |
|---------|---------|------------|------------------|
| cifrado | busqueda | Muy alta | Considerar |
| mecanismo | logica | Alta | Si |
| busqueda | observacion | Media | No (extender busqueda) |
| cooperativo | mecanismo | Media | Si |
| cifrado | cifrado | N/A | No (redundante) |
| logica | logica | N/A | No (redundante) |

---

## Tipos de Relaciones

### 1. Sinergia (Complementan)

**Definicion:** Skills que funcionan mejor juntos que separados.

**Ejemplos:**
- `prueba-cifrado` + `prueba-busqueda-objetos` = Mensaje cifrado escondido
- `prueba-mecanismo-fisico` + `prueba-logica-secuencial` = Mecanismo multi-paso
- `prueba-cooperativo` + `prueba-ritmo` = Accion sincronizada entre jugadores

**Documentacion:** En seccion 7 del SKILL.md:
```markdown
### Skills que Complementan
- `prueba-X` → [Explicacion de la sinergia]
- Ejemplo compuesto: [Descripcion concreta]
```

### 2. Alternativa (Sustituyen)

**Definicion:** Skills que resuelven el mismo proposito de diferentes maneras.

**Ejemplos:**
- `prueba-cifrado` vs `prueba-asociacion-imagenes` (ambos revelan informacion oculta)
- `prueba-mecanismo-fisico` vs `prueba-digital-interfaz` (ambos validan accion)
- `prueba-busqueda-objetos` vs `prueba-observacion` (ambos involucran hallazgo)

**Criterio de eleccion:**
- Publico objetivo
- Contexto fisico/digital
- Preferencias del disenador

**Documentacion:**
```markdown
### Skills Alternativos
- `prueba-X` → Si [condicion diferente]
```

### 3. Incompatibilidad (Conflicto)

**Definicion:** Skills que no deberian usarse juntos por redundancia o confusion.

**Ejemplos:**
- ❌ `prueba-cifrado` + `prueba-cifrado-transposicion` (redundante)
- ❌ `prueba-logica-secuencial` + `prueba-logica-deduccion` (ambos logicos, confunden)
- ❌ `prueba-trivia` + `prueba-cifrado` (ambos mentales, sin variedad)

**Excepcion:** Skills compuestos especificos que resuelven la incompatibilidad:
- ✅ `prueba-logica-secuencial-deductiva` (skill compuesto que integra ambos)

**Documentacion:**
```markdown
### Skills Incompatibles
- ❌ `prueba-X` → Conflicto: [Explicacion]
```

### 4. Jerarquia (Extienden)

**Definicion:** Un skill general y variantes especificas.

**Estructura:**
```
prueba-cifrado (general)
    ├── tipo: "sustitucion" (variable)
    ├── tipo: "transposicion" (variable)
    └── tipo: "hibrido" (variable)

NO crear:
    ├── prueba-cifrado-sustitucion (especifico)
    └── prueba-cifrado-transposicion (especifico)
```

**Cuando romper jerarquia:**
Si una variante tiene reglas tan diferentes que no encajan:

```
prueba-mecanismo (general)
    ├── tipo: "cerradura" (variable)
    ├── tipo: "dial" (variable)
    └── tipo: "secuencia" (variable)

SI crear separado:
    └── prueba-mecanismo-peso (especifico)
        (porque requiere sensores de peso, calibracion, etc.)
```

**Documentacion:** En skill especifico:
```markdown
### Extends
- Extiende: `prueba-X` con especializacion en [aspecto]
- Diferencia clave: [Que lo hace separado]
```

---

## Mapa de Relaciones Ejemplo

```
                    prueba-cifrado
                         |
        _________________|_________________
       |                 |                 |
       v                 v                 v
prueba-busqueda    prueba-mecanismo    prueba-logica
       |                 |                 |
       |________         |________         |
              |                  |          |
              v                  v          v
       [Compuesto]         [Compuesto]   [Alternativa]
       cifrado-busqueda    mecanismo-    prueba-asociacion
                               logica

Incompatibilidades:
- prueba-cifrado X prueba-cifrado-X (redundancia)
- prueba-logica X prueba-logica-Y (confusion)

Alternativas:
- prueba-cifrado → prueba-asociacion (menos estructurado)
- prueba-busqueda → prueba-observacion (menos activo)
```

---

## Mantenimiento del Ecosistema

### Cuando Anadir una Nueva Relacion

**1. Descubrir Sinergia en Uso Real**

Si una prueba concreta funciona bien usando skills A + B:
- Documentar en ambos skills (seccion 7)
- Anadir ejemplo compuesto

**2. Identificar Conflicto**

Si agentes confunden skills X e Y:
- Revisar descripciones para diferenciacion mas clara
- Anadir a "Incompatibles" o "Alternativas"
- Considerar si deberian fusionarse

**3. Detectar Redundancia**

Si skills A y B tienen:
- 80%+ mismo contenido
- Mismo triggers
- Mismos anti-patrones

**Accion:** Fusionar en uno solo con variable.

### Revision Periodica

**Cada 6 meses:**

1. **Auditoria de uso:**
   ```
   Skills usados en <3 pruebas → Revisar deprecacion
   Skills con confusion frecuente → Revisar diferenciacion
   ```

2. **Auditoria de relaciones:**
   ```
   Sinergias documentadas pero no usadas → Eliminar
   Combinaciones frecuentes sin documentar → Anadir
   ```

3. **Auditoria de jerarquia:**
   ```
   Skill especifico Score < 6 → Fusionar con general
   Skill general demasiado amplio → Dividir
   ```

---

## Ejemplos de Documentacion de Relaciones

### Ejemplo 1: Skill con Muchas Sinergias

**`prueba-cifrado`:**
```markdown
## Relaciones

### Complementan (5 sinergias)
1. `prueba-busqueda-objetos` → El cifrado esta fisicamente escondido
2. `prueba-mecanismo-fisico` → El resultado abre un mecanismo
3. `prueba-logica-secuencial` → Multi-etapa (fases de descifrado)
4. `prueba-observacion` → Pistas visuales para descifrar
5. `prueba-cooperativo` → Partes del mensaje en diferentes jugadores

### Alternativas
- `prueba-asociacion-directa` → Si no se necesita procesamiento
- `prueba-interpretacion` → Si la respuesta es abierta

### Incompatibles
- ❌ `prueba-cifrado-X` especificos (usar variables)
- ❌ `prueba-trivia` (confusion mental)

### Ejemplos Compuestos
- "El Mapa Pirata": cifrado + busqueda + mecanismo
- "La Maquina Enigmatica": cifrado + logica + mecanismo
```

### Ejemplo 2: Skill Especializado

**`prueba-realidad-aumentada`:**
```markdown
## Relaciones

### Complementan
1. `prueba-busqueda-objetos` → Buscar markers fisicos
2. `prueba-geolocalizacion` → Triggers por ubicacion real

### Alternativas
- `prueba-digital-interfaz` → Si no se necesita overlay visual
- `prueba-observacion` → Si basta con mirar sin tecnologia

### Incompatibles
- ❌ `prueba-mecanismo-fisico` puro (contradiccion virtual/fisico)
- ❌ Skills de espacio cerrado (requiere movilidad)

### Jerarquia
- Extiende: `prueba-digital-interfaz` con capacidad AR
- Diferencia: Requiere camara y procesamiento visual
```

---

## Conclusion

Las relaciones entre skills son tan importantes como los skills mismos.

**Buen ecosistema:**
- Cada skill sabe con que otros combina
- Sinergias documentadas con ejemplos concretos
- Conflictos claros para evitar confusion
- Sin redundancia (no dos skills hacen lo mismo)

**Mal ecosistema:**
- Skills aislados sin contexto
- Sinergias solo en la cabeza del creador
- Skills que se pisotean mutuamente
- Inflacion de skills con diferencias minimas

**Mantenimiento:** Revisar relaciones cada 6 meses junto con el uso real.
