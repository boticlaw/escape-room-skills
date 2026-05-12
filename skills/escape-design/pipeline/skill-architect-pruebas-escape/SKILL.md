---
name: skill-architect-pruebas-escape
description: Skill metodologica para crear, validar y normalizar skills de tipos de prueba para escape rooms, street escape y juegos de investigacion. Usar cuando se necesite (1) decidir si crear un nuevo skill de prueba, (2) validar la estructura de un skill existente, (3) analizar pruebas JSON para detectar patrones candidatos a skill, (4) inicializar un nuevo skill de prueba siguiendo el estandar, (5) entender las relaciones entre skills y pruebas concretas.
---

# Architect de Skills de Pruebas Escape

Esta skill establece el metodo para convertir experiencia repetida en capacidades reutilizables. No genera pruebas ni narrativas: define el SISTEMA para que otros skills de tipos de prueba sean consistentes, descubribles y utiles.

## Fundamentos del Sistema

### Jerarquia de Datos

```
SKILL-ARCHITECT (esta skill)
    ↓ define metodologia
SKILL de Tipo de Prueba (ej: prueba-cifrado)
    ↓ define reglas y patrones
PRUEBA JSON concreta (ej: cesar_facil.json)
    ↓ implementa con valores especificos
INSTANCIA en un juego
```

**Regla de oro:** Las pruebas JSON referencian skills. Los skills NUNCA referencian pruebas JSON.

---

## Que ES un Skill de Prueba

Un skill de prueba es una **familia de puzzles que comparten logica de diseno, reglas de validacion y patrones de frustracion/acierto**.

**Ejemplos validos:**
- `prueba-cifrado` → Cualquier puzzle basado en transformacion de simbolos/texto
- `prueba-busqueda-objetos` → Puzzles de hallazgo visual o fisico
- `prueba-logica-secuencial` → Puzzles donde el orden importa

**Caracteristicas:**
- Define CUANDO usar este tipo (triggers)
- Define CUANDO NO usarlo (anti-patrones)
- Documenta variables configurables
- Anticipa errores de jugadores
- Establece escalado de dificultad

---

## Que NO ES un Skill de Prueba

**No es:**
- Una prueba concreta (eso es un JSON)
- Una narrativa o historia
- Un manual de instrucciones para jugadores
- Un generador automatico de contenido
- Una coleccion de assets visuales

**Anti-ejemplos:**
- `prueba-cifrado-cesar-mayusculas` → Demasiado especifico
- `prueba-misterio-habitacion-3` → Vinculado a instancia concreta
- `prueba-dificil` → Demasiado generico

---

## Criterios de Creacion (Scorecard)

Evaluar cada candidato a skill con estos criterios. **Score minimo: 7/10**.

| Criterio | Peso | Descripcion |
|----------|------|-------------|
| **Cantidad de pruebas candidatas** | Alto (3pts) | ≥3 pruebas JSON que encajarian |
| **Reglas propias unicas** | Alto (3pts) | Tiene logica de validacion/distribucion especifica |
| **Reutilizacion cross-juego** | Medio-Alto (2pts) | Usable en hall, street e investigacion |
| **Impacto en decisiones de diseno** | Medio (1pt) | Cambia como se estructura el flujo del juego |
| **Complejidad configuracional** | Variable (1pt) | Necesita explicar multiples variables |

### Umbrales de Decision

- **Score 9-10:** Crear skill inmediatamente
- **Score 7-8:** Crear skill, monitorizar uso
- **Score 5-6:** Esperar a acumular mas pruebas candidatas
- **Score <5:** NO crear skill, usar skill generico existente

---

## Estructura Obligatoria del SKILL.md

Todo skill de prueba DEBE incluir estas 7 secciones:

### 1. Cuando Usar Este Tipo de Prueba

**Requisito:** Triggers especificos que activan este skill.

**Formato:**
- Lista de condiciones que indican "esta prueba deberia ser de este tipo"
- Ejemplos concretos de prompts de usuario que activarian este skill

### 2. Cuando NO Usarlo (Anti-Patrones)

**Requisito:** Casos donde este tipo es inapropiado y alternativas mejores.

**Formato:**
- Situaciones que parecen encajar pero no
- Que skill usar en su lugar
- Por que este tipo fallaria aqui

### 3. Variables de Diseno

**Requisito:** Que parametros se pueden configurar y como afectan.

**Formato:**
- Lista de variables (nombre, tipo, rango, default)
- Impacto de cada variable en la experiencia
- Combinaciones prohibidas o peligrosas

### 4. Errores Comunes de Jugadores

**Requisito:** Frustraciones tipicas y como anticiparlas.

**Formato:**
- Errores cognitivos predecibles
- Senales de que el jugador esta atascado
- Cuando intervenir con pista vs dejar explorar

### 5. Escalado de Dificultad

**Requisito:** Como hacer esta prueba mas facil o dificil.

**Formato:**
- Version facil (quitar/completar elementos)
- Version estandar
- Version dificil (anadir distracciones/complejidad)

### 6. Adaptaciones

**Requisito:** Variaciones por contexto.

**Formato:**
- **Por edad:** Ninos (simplificar), Adultos (complejidad completa), Mixto (balance)
- **Por espacio:** Hall escape (fisico), Street (movil/externo), Digital (virtual)
- **Por duracion:** Quick (5-10min), Standard (15-30min), Epic (45min+)

### 7. Relaciones con Otros Skills

**Requisito:** Como este skill se combina con otros.

**Formato:**
- Skills que complementan bien (sinergias)
- Skills que sustituyen (alternativas)
- Skills incompatibles (no usar juntos)
- Ejemplos de pruebas compuestas (usando 2+ skills)

### 8. Adaptaciones por Tipo de Juego

**Requisito:** Todo skill debe documentar cómo se adapta a cada tipo de juego (hall, street, investigation).

#### Principio de Adaptación

Los skills son **genéricos** y funcionan en todos los tipos de juego. La adaptación específica se implementa mediante `metadata_contextual` en cada prueba JSON, NO creando skills específicos por tipo.

**Regla:** NUNCA crear `prueba-hall-cifrado` o `prueba-street-qr`. Usar `prueba-cifrado` con metadata contextual.

#### Formato de Documentación

Cada skill debe incluir esta sub-sección:

```markdown
#### Adaptaciones por Tipo

**Hall Escape:**
- Materiales: Cómo escalar a grupos grandes
- Interacción: Cómo gestionar múltiples equipos
- Presentación: Formato en pantalla grande/proyector

**Street Escape:**
- Materiales: Versión móvil (app/folleto)
- Interacción: Ubicación física real
- Tecnología: GPS/QR en lugar de objetos físicos

**Investigación:**
- Materiales: Formato de evidencia/documento
- Interacción: Análisis individual + síntesis grupal
- Narrativa: Conexión con el caso/misterio
```

#### Metadata Contextual en Pruebas JSON

Toda prueba JSON DEBE incluir `metadata_contextual` cuando forme parte de un juego:

```json
{
  "metadata_contextual": {
    "tipo_juego": "game-type-hall-escape",
    "espacio_requerido": "pantalla_proyector",
    "participantes_tipo": "equipos",
    "adaptacion_hall": {
      "formato": "proyectado",
      "interaccion": "equipos_anotan_respuestas"
    }
  }
}
```

#### Validación de Metadata Contextual

Al crear una prueba, verificar:

- [ ] `metadata_contextual.tipo_juego` coincide con el tipo del juego
- [ ] Existe adaptación específica para el tipo (`adaptacion_hall`, `adaptacion_street`, o `adaptacion_investigation`)
- [ ] Los materiales son coherentes con el tipo de juego
- [ ] La interacción es apropiada para el espacio/participantes

#### Anti-Patrones de Adaptación

**❌ INCORRECTO:**
- Crear skill `prueba-hall-punteria` específico para hall escape
- Hardcodear valores de participantes en el skill (ej: "10-200 personas")
- Ignorar tipo de juego y usar configuración genérica

**✅ CORRECTO:**
- Usar `prueba-punteria` genérico con metadata contextual
- Definir `min`/`max` en `GAME.json`, no en el skill
- Documentar adaptaciones en el skill para referencia

---

## Taxonomia de Skills

### Tipos de Skills

**1. Skills Atomicos**
- Representan un mecanismo de puzzle puro
- Ejemplo: `prueba-cifrado`, `prueba-mecanismo`

**2. Skills Compuestos**
- Combinacion de 2+ skills atomicos
- Ejemplo: `prueba-cifrado-mecanismo` (cifrado que activa mecanismo)
- Solo crear si la combinacion es muy comun

**3. Skills de Flujo**
- No son puzzles, son estructuras narrativas
- Ejemplo: `flujo-lineal`, `flujo-ramificado`
- Usar con moderacion

### Composicion de Pruebas

Una prueba JSON puede referenciar **1 skill primario** y **0-3 skills secundarios**.

```json
{
  "id": "prueba_001",
  "skills": {
    "primario": "prueba-cifrado",
    "secundarios": ["prueba-busqueda-objetos"]
  }
}
```

---

## Proceso Paso a Paso

### Fase 1: Analisis de Candidatos

**Entrada:** Coleccion de pruebas JSON existentes o ideas nuevas.

**Pasos:**
1. Agrupar pruebas por mecanica similar
2. Identificar patrones recurrentes
3. Contar cuantas pruebas encajan en cada patron
4. Documentar reglas comunes detectadas

**Salida:** Lista de candidatos a skill con conteo inicial.

### Fase 2: Decision de Creacion

**Entrada:** Candidato a skill con datos de analisis.

**Pasos:**
1. Aplicar scorecard (cantidad, reglas, reutilizacion, impacto, complejidad)
2. Verificar que no existe skill similar (buscar sinergias antes de crear)
3. Consultar: "Si creo este skill, lo usaria en 3+ juegos distintos?"

**Salida:** Decision (crear / esperar / fusionar con skill existente).

### Fase 3: Creacion del Skill

**Entrada:** Decision positiva de crear skill.

**Pasos:**
1. Ejecutar `init_skill_prueba.py <nombre>`
2. Completar las 7 secciones obligatorias
3. Revisar nombre: formato `prueba-{mecanica}` en kebab-case
4. Anadir ejemplos concretos (minimo 2-3)

**Salida:** Directorio de skill con SKILL.md completo.

### Fase 4: Validacion

**Entrada:** Skill recien creado.

**Pasos:**
1. Ejecutar `validate_skill_prueba.py <ruta>`
2. Verificar checklist de 7 secciones
3. Comprobar que no duplica funcionalidad
4. Revisar ejemplos de coherencia

**Salida:** Skill validado o lista de correcciones.

### Fase 5: Integracion

**Entrada:** Skill validado.

**Pasos:**
1. Actualizar pruebas JSON para referenciar nuevo skill
2. Documentar relacion con skills existentes (actualizar seccion 7 de otros)
3. Crear primera prueba de ejemplo si no existe

**Salida:** Skill operativo en el ecosistema.

### Fase 6: Iteracion y Mantenimiento

**Entrada:** Skill en uso.

**Pasos:**
1. Monitorizar que pruebas lo usan
2. Si <3 pruebas tras 3 meses: considerar deprecacion
3. Si surge variante significativa: evaluar skill compuesto
4. Actualizar ejemplos basados en uso real

---

## Checklist de Validacion

Antes de dar por valido un skill de prueba, verificar:

### Estructura
- [ ] Nombre sigue formato `prueba-{mecanica}` en kebab-case
- [ ] SKILL.md presente en raiz
- [ ] Las 7 secciones obligatorias estan completas
- [ ] No hay secciones vacias ni marcadores pendientes

### Contenido
- [ ] Seccion 1: Al menos 3 triggers especificos
- [ ] Seccion 2: Al menos 2 anti-patrones con alternativas
- [ ] Seccion 3: Variables documentadas con tipos y rangos
- [ ] Seccion 4: Errores de jugadores son predecibles/reales
- [ ] Seccion 5: 3 niveles de dificultad definidos
- [ ] Seccion 6: Adaptaciones para hall/street/digital
- [ ] Seccion 7: Relaciones con minimo 2 skills existentes

### Calidad
- [ ] Ejemplos concretos (no abstractos)
- [ ] Lenguaje imperativo/infinitivo
- [ ] Conciso (max 500 lineas en SKILL.md)
- [ ] No duplica skill existente
- [ ] Score >= 7 en criterios de creacion

---

## Errores Comunes al Crear Skills

### Error 1: Hiper-Especificidad
**Sintoma:** `prueba-cifrado-cesar-mayusculas-3letras`
**Problema:** Solo sirve para un caso. No reusable.
**Solucion:** Subir nivel de abstraccion. Las variables especificas van en el JSON.

### Error 2: Hiper-Generalidad
**Sintoma:** `prueba-puzzle` o `prueba-dificil`
**Problema:** Tan amplio que no aporta valor.
**Solucion:** Dividir en mecanicas concretas.

### Error 3: Vinculacion a Instancia
**Sintoma:** `prueba-habitacion-sala-roja`
**Problema:** Amarrado a contexto especifico.
**Solucion:** Extraer mecanica, dejar narrativa para el JSON.

### Error 4: Falta de Anti-Patrones
**Sintoma:** Solo describe cuando usar, no cuando evitar.
**Problema:** Agentes usaran skill inapropiadamente.
**Solucion:** Incluir seccion 2 exhaustiva.

### Error 5: Variables Mal Definidas
**Sintoma:** "Puedes ajustar la dificultad"
**Problema:** No especifica COMO ajustarla.
**Solucion:** Documentar parametros concretos y sus efectos.

### Error 6: Ignorar Relaciones
**Sintoma:** Skill aislado, no menciona otros.
**Problema:** Pierde contexto del ecosistema.
**Solucion:** Mapear sinergias y conflictos con skills existentes.

---

## Ejemplos Conceptuales

### BUEN Skill: `prueba-cifrado`

```markdown
# Cuando Usar
- Usuario pide "algo con codigos secretos"
- Necesitas validar solucion sin intervencion del game master
- El tema del juego involucra espionaje, antiguedades, o misterios

# Cuando NO Usar
- Para publico infantil <8 anos (frustracion alta). Usar prueba-colores-figuras
- Si la solucion debe ser ambigua. Usar prueba-interpretacion
- Si el espacio es muy ruidoso. Cifrados visuales > auditivos

# Variables de Diseno
- alfabeto: "latin" | "numerico" | "simbolos" | "personalizado"
- longitud_solucion: 4-12 caracteres
- tipo_cifrado: "sustitucion" | "transposicion" | "hibrido"

[... 4 secciones mas ...]

# Relaciones
- Complementa: prueba-busqueda-objetos (el cifrado esta en un objeto)
- Alternativa: prueba-mecanismo (para publico que odia leer)
- Conflicto: prueba-logica-secuencial (ambos son mentales, pueden saturar)
```

**Por que es bueno:** Nivel de abstraccion correcto. Variables claras. Relaciones mapeadas.

---

### MAL Skill: `prueba-acertijo`

```markdown
# Descripcion
Preguntas con respuesta ingeniosa

# Como usar
Pide una pregunta dificil al jugador
```

**Por que es malo:** Demasiado generico. Sin variables. Sin anti-patrones. No distinguible de cualquier otra prueba mental.

---

### BUEN Skill: `prueba-mecanismo-fisico`

```markdown
# Cuando Usar
- Interaccion tactil requerida (no solo mental)
- Necesitas feedback inmediato (correcto/incorrecto)
- Espacio fisico permite manipulacion de objetos

# Variables de Diseno
- tipo_mecanismo: "combinacion" | "secuencia" | "alineacion" | "peso"
- feedback: "sonido" | "luz" | "apertura" | "combinado"
- reintentos: 1-5 | "infinito"

# Errores Comunes
- Jugador no entiende que hay que hacer: indicador visual de "interactuable"
- Mecanismo atascado: siempre tener override manual para GM

[... 4 secciones mas ...]
```

**Por que es bueno:** Define claramente el limite entre prueba mental y fisica. Anticipa problemas tecnicos.

---

## Recursos Incluidos

### Scripts

**validate_skill_prueba.py**
Valida que un skill cumple la estructura obligatoria.

**analyze_pruebas_json.py**
Analiza directorio de JSONs para proponer candidatos a skills.

**init_skill_prueba.py**
Crea estructura inicial de un nuevo skill con las 7 secciones.

### Referencias

- **criterios_creacion.md** - Scorecard detallada con ejemplos
- **estructura_obligatoria.md** - Plantilla de las 7 secciones
- **ejemplos_conceptuales.md** - Casos de estudio extendidos
- **relaciones_y_taxonomia.md** - Mapa de skills existentes y sus conexiones

### Assets

- **template_skill_prueba.md** - Plantilla SKILL.md lista para rellenar

---

## Uso de Esta Skill

### Caso 1: Tienes Muchas Pruebas JSON y Quieres Organizarlas

```
Usuario: "Tengo 50 pruebas en JSON, ayudame a organizarlas en skills"

1. Ejecutar analyze_pruebas_json.py ./pruebas/
2. Revisar candidatos propuestos con score
3. Para cada candidato con score >= 7:
   - Ejecutar init_skill_prueba.py prueba-{nombre}
   - Completar SKILL.md
   - Ejecutar validate_skill_prueba.py
```

### Caso 2: Quieres Crear un Nuevo Tipo de Prueba

```
Usuario: "Quiero crear pruebas de realidad aumentada"

1. Evaluar contra skills existentes (prueba-digital? prueba-interaccion?)
2. Aplicar scorecard:
   - Cantidad: ≥3 pruebas planificadas? 
   - Reglas: tiene logica de validacion especifica de RA?
   - Reutilizacion: sirve para hall/street o solo digital?
3. Si score >= 7: crear skill
4. Si score < 7: documentar como variante de skill existente
```

### Caso 3: Validar un Skill Existente

```
Usuario: "Revisa si mi skill de prueba-codigo-morse esta bien"

1. Ejecutar validate_skill_prueba.py ./prueba-codigo-morse/
2. Revisar checklist de 7 secciones
3. Identificar gaps o sobre-especificacion
4. Proponer mejoras o fusion con skill mas amplio
```

---

## Reglas de Convivencia entre Skills

### Principio de Responsabilidad Unica
Un skill debe hacer UNA cosa bien. Si describe 2 mecanicas distintas, dividir.

### Principio de Abierto/Cerrado
Skills existentes pueden extenderse (nuevas variables), pero no modificarse en su esencia (cambiar cuando usar).

### Principio de Sustitucion
Una prueba configurada para `prueba-cifrado-sustitucion` deberia funcionar si la cambias a `prueba-cifrado` generico.

### Principio de Segregacion
Preferir 2 skills especificos sobre 1 skill con muchas "modalidades". Facilita la eleccion.

### Principio de Inversion
Skills de alto nivel (compuestos) dependen de skills atomicos, no al reves.

---

## Metricas de Exito de un Skill

Un skill esta funcionando bien cuando:

- **≥3 pruebas JSON** lo usan (transcurren 1 mes)
- **0 consultas confusas** de agentes sobre cuando aplicarlo
- **Sinergias documentadas** se usan en juegos reales
- **Anti-patrones** evitan malos usos
- **Tiempo de decision** < 5 minutos para un agente elegir usarlo

Un skill esta fallando cuando:

- Solo 1 prueba lo usa tras 3 meses
- Agentes preguntan "esto es prueba-X o prueba-Y?"
- Las variables definidas no se usan en la practica
- Se ignora consistentemente en favor de otros skills

---

## Notas para el Agente Usuario de Esta Skill

**Tu rol:** Arquitecto del ecosistema de pruebas.

**Tu objetivo:** Mantener un catalogo de skills util, ni escaso ni inflado.

**Tu metrica:** Un game designer nuevo puede leer los skills y entender que tipo de pruebas puede construir, sin crear duplicados.

**Recuerda:**
- Es mejor tener 10 skills excelentes que 50 mediocre.
- Los skills son contratos: prometen que si sigues su metodo, la prueba funcionara.
- Los JSONs son implementaciones: pueden variar, los skills deben ser estables.

---

**Version:** 1.0  
**Ultima actualizacion:** 2026-02-12  
**Dependencias:** Ninguna (skill raiz)
