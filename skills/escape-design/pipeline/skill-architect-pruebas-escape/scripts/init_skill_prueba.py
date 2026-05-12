#!/usr/bin/env python3
"""
Inicializador de Skills de Prueba

Crea la estructura inicial de un nuevo skill de prueba con las 7 secciones
obligatorias pre-configuradas.

Usage:
    init_skill_prueba.py <nombre-mecanica> [--path <dir>]

Examples:
    init_skill_prueba.py cifrado --path ./skills
    init_skill_prueba.py busqueda-objetos
    init_skill_prueba.py logica-secuencial --path /custom/location
"""

import sys
import re
from pathlib import Path


SKILL_TEMPLATE = """---
name: prueba-{mecanica}
description: Skill para crear pruebas de tipo {mecanica_titulo}. Usar cuando se necesite (1) disenar una prueba que involucre {descripcion_corta}, (2) validar que una prueba existente sigue buenas practicas de {mecanica}, (3) adaptar una prueba de {mecanica} a diferente dificultad o contexto, (4) entender que errores esperar de los jugadores en este tipo de prueba.
---

# Prueba {mecanica_titulo}

Skill para el diseno, validacion y adaptacion de pruebas basadas en {mecanica}.

---

## Cuando Usar Este Tipo de Prueba

Usa este skill cuando:

- [ ] **Trigger 1:** [Condicion especifica, ej: "El usuario menciona 'codigos secretos' o 'descifrar'"]
- [ ] **Trigger 2:** [Condicion especifica, ej: "Necesitas validacion automatica de la solucion"]
- [ ] **Trigger 3:** [Condicion especifica, ej: "El tema del juego involucra espionaje, misterio o comunicacion oculta"]

**Ejemplos de prompts que activan este skill:**
- "Quiero una prueba donde los jugadores tengan que descifrar un mensaje"
- "Necesito algo con codigos para un escape de espias"
- "Como puedo hacer una prueba de [mecanica especifica]"

---

## Cuando NO Usarlo (Anti-Patrones)

**NO uses este skill cuando:**

### Anti-Patron 1: [Situacion especifica]
- **Por que falla:** [Explicacion]
- **Mejor alternativa:** Usar `prueba-[alternativa]`

### Anti-Patron 2: [Situacion especifica]
- **Por que falla:** [Explicacion]
- **Mejor alternativa:** Usar `prueba-[alternativa]`

### Anti-Patron 3: [Situacion especifica]
- **Por que falla:** [Explicacion]
- **Mejor alternativa:** Usar `prueba-[alternativa]`

**Regla general:** Si [condicion], entonces este tipo NO es adecuado.

---

## Variables de Diseno

### Variables Principales

| Variable | Tipo | Rango | Default | Descripcion |
|----------|------|-------|---------|-------------|
| `variable_1` | string | ["opcion1", "opcion2"] | "opcion1" | Descripcion del efecto |
| `variable_2` | number | 1-10 | 5 | Descripcion del efecto |
| `variable_3` | boolean | true/false | false | Descripcion del efecto |

### Variables Opcionales

| Variable | Tipo | Descripcion |
|----------|------|-------------|
| `extra_1` | string | [Descripcion] |
| `extra_2` | number | [Descripcion] |

### Combinaciones Validas

- **Configuracion Basica:** `variable_1="opcion1"`, `variable_2=5`
- **Configuracion Avanzada:** `variable_1="opcion2"`, `variable_2=8`, `variable_3=true`

### Combinaciones Prohibidas/Peligrosas

- [X] NO combines `variable_1="opcion1"` con `variable_3=true` (causa [problema])
- [WARN] Cuidado con `variable_2 > 8` si el publico es infantil

---

## Errores Comunes de Jugadores

### Error 1: [Tipo de error cognitivo]
- **Sintoma:** [Como se manifiesta]
- **Causa:** [Por que ocurre]
- **Prevencion:** [Como disenar para evitarlo]
- **Intervencion:** [Cuando y como dar pista]

### Error 2: [Tipo de error cognitivo]
- **Sintoma:** [Como se manifiesta]
- **Causa:** [Por que ocurre]
- **Prevencion:** [Como disenar para evitarlo]
- **Intervencion:** [Cuando y como dar pista]

### Error 3: [Tipo de error cognitivo]
- **Sintoma:** [Como se manifiesta]
- **Causa:** [Por que ocurre]
- **Prevencion:** [Como disenar para evitarlo]
- **Intervencion:** [Cuando y como dar pista]

**Senales de alarma (el jugador esta atascado):**
- [ ] Senal 1: [Descripcion observable]
- [ ] Senal 2: [Descripcion observable]
- [ ] Senal 3: [Descripcion observable]

**Tiempo maximo recomendado antes de intervenir:** [X minutos]

---

## Escalado de Dificultad

### Version Facil (Nivel 1-3)
- **Caracteristicas:**
  - [Simplificacion especifica]
  - [Simplificacion especifica]
  - [Simplificacion especifica]
- **Tiempo estimado:** [X-Y minutos]
- **Publico objetivo:** Ninos <10 anos, grupos novatos

### Version Estandar (Nivel 4-6)
- **Caracteristicas:**
  - [Configuracion estandar]
  - [Configuracion estandar]
- **Tiempo estimado:** [X-Y minutos]
- **Publico objetivo:** Publico general, adultos

### Version Dificil (Nivel 7-9)
- **Caracteristicas:**
  - [Anadido de complejidad]
  - [Anadido de complejidad]
  - [Anadido de complejidad]
- **Tiempo estimado:** [X-Y minutos]
- **Publico objetivo:** Expertos, entusiastas

### Version Extrema (Nivel 10)
- **Caracteristicas:**
  - [Configuracion maxima]
- **Tiempo estimado:** [X+ minutos]
- **Publico objetivo:** Competencias, speedruns

**Matriz de escalado:**

| Aspecto | Facil | Estandar | Dificil |
|---------|-------|----------|---------|
| Variable 1 | Valor A | Valor B | Valor C |
| Variable 2 | 3 | 6 | 9 |
| Pistas disponibles | 4 | 2 | 1 |

---

## Adaptaciones

### Por Edad

**Ninos (6-10 anos):**
- Simplificar: [Aspectos a simplificar]
- Evitar: [Elementos frustrantes]
- Anadir: [Elementos de diversion]

**Adolescentes (11-17 anos):**
- Mantener: [Elementos clave]
- Permitir: [Mayor complejidad en...]

**Adultos (18+):**
- Complejidad completa
- Considerar: [Variantes para expertos]

**Grupos mixtos:**
- Estrategia: [Como balancear]
- Elementos cooperativos: [Si aplica]

### Por Espacio

**Hall Escape (sala fisica):**
- Ventajas: [Que aprovechar del espacio]
- Limitaciones: [Restricciones]
- Adaptaciones especificas: [Cambios necesarios]

**Street Escape (exterior/movil):**
- Ventajas: [Que aprovechar del entorno]
- Limitaciones: [Restricciones climaticas/logisticas]
- Adaptaciones especificas: [Cambios necesarios]

**Juego de Investigacion (no presencial):**
- Ventajas: [Que aprovechar del formato]
- Limitaciones: [Sin interaccion fisica]
- Adaptaciones especificas: [Cambios necesarios]

**Digital/Virtual:**
- Ventajas: [Automatizacion posible]
- Limitaciones: [Sin tacto]
- Adaptaciones especificas: [Cambios necesarios]

### Por Duracion

**Quick (5-10 minutos):**
- Elementos a eliminar: [Que quitar]
- Foco: [En que concentrarse]

**Standard (15-30 minutos):**
- Version completa sin modificaciones

**Epic (45+ minutos):**
- Elementos a anadir: [Como expandir]
- Sub-etapas: [Si aplica, dividir en fases]

---

## Relaciones con Otros Skills

### Skills que Complementan (Sinergias)

**1. `prueba-[skill-relacionado-1]`**
- **Sinergia:** [Como se complementan]
- **Ejemplo compuesto:** [Descripcion de prueba usando ambos]
- **Frecuencia:** [Muy comun | Comun | Ocasional]

**2. `prueba-[skill-relacionado-2]`**
- **Sinergia:** [Como se complementan]
- **Ejemplo compuesto:** [Descripcion de prueba usando ambos]
- **Frecuencia:** [Muy comun | Comun | Ocasional]

### Skills Alternativos (Sustitucion)

**En lugar de este skill, considera:**

- **`prueba-[alternativa-1]`** → Si [condicion diferente]
- **`prueba-[alternativa-2]`** → Si [condicion diferente]

### Skills Incompatibles (No Usar Juntos)

**Evita combinar con:**

- [X] `prueba-[incompatible-1]` → Conflicto: [Explicacion]
- [X] `prueba-[incompatible-2]` → Conflicto: [Explicacion]

### Ejemplos de Pruebas Compuestas

**Ejemplo 1: [Nombre descriptivo]**
- **Skills usados:** `prueba-{mecanica}` + `prueba-[otro]`
- **Descripcion:** [Como se integran]
- **Por que funciona:** [Explicacion pedagogica]

**Ejemplo 2: [Nombre descriptivo]**
- **Skills usados:** `prueba-{mecanica}` + `prueba-[otro-1]` + `prueba-[otro-2]`
- **Descripcion:** [Como se integran]
- **Por que funciona:** [Explicacion pedagogica]

---

## Ejemplos Concretos

### Ejemplo 1: [Nombre descriptivo]

**Contexto:** [Breve descripcion del juego/tema]

**Configuracion:**
```json
{{
  "variable_1": "valor",
  "variable_2": 5,
  "variable_3": true
}}
```

**Flujo de juego:**
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

**Solucion:** [Como se resuelve]

**Pistas progresivas:**
- Pista 1: [Sutil]
- Pista 2: [Mas directa]
- Pista 3: [Casi la solucion]

---

### Ejemplo 2: [Nombre descriptivo]

**Contexto:** [Breve descripcion]

**Configuracion:**
```json
{{
  "variable_1": "otro_valor",
  "variable_2": 8
}}
```

**Flujo de juego:** [Descripcion]

**Solucion:** [Descripcion]

---

## Notas de Implementacion

### Para el Agente Usuario

**Antes de usar este skill:**
1. Verificar que los triggers de "Cuando Usar" aplican
2. Confirmar que no caes en ningun "Anti-Patron"
3. Seleccionar nivel de dificultad apropiado
4. Revisar adaptaciones necesarias para el contexto

**Mientras usas este skill:**
1. Configurar variables segun la tabla
2. Prever errores comunes y preparar pistas
3. Documentar la solucion valida
4. Estimar tiempo realista

**Despues de crear la prueba:**
1. Validar que sigue el patron del skill
2. Testear con usuarios representativos si es posible
3. Ajustar dificultad segun resultados
4. Documentar lecciones aprendidas

---

## Changelog

- **v1.0** (YYYY-MM-DD): Creacion inicial del skill

---

**Score de evaluacion:** [X]/10  
**Frecuencia de uso esperada:** [Alta | Media | Baja]  
**Dependencias:** Ninguna
"""


def kebab_to_title(name):
    """Convierte kebab-case a Titulo Con Palabras."""
    return ' '.join(word.capitalize() for word in name.split('-'))


def generate_description(mecanica):
    """Genera una descripcion corta basada en la mecanica."""
    descriptions = {
        'cifrado': 'transformacion de simbolos o texto para ocultar mensajes',
        'busqueda': 'hallazgo de objetos o informacion oculta',
        'logica': 'deduccion y razonamiento para resolver enigmas',
        'mecanismo': 'interaccion fisica con dispositivos o cerraduras',
        'observacion': 'deteccion de detalles visuales o auditivos',
        'matematico': 'calculos numericos o patrones matematicos',
        'cooperativo': 'colaboracion simultanea entre jugadores',
    }
    
    # Buscar coincidencia parcial
    for key, desc in descriptions.items():
        if key in mecanica.lower():
            return desc
    
    return f'mecanicas de tipo {mecanica}'


def init_skill_prueba(mecanica, base_path):
    """Crea la estructura de un nuevo skill de prueba."""
    # Limpiar nombre
    mecanica = mecanica.lower().strip()
    if mecanica.startswith('prueba-'):
        mecanica = mecanica[7:]  # Quitar prefijo si existe
    
    skill_name = f"prueba-{mecanica}"
    skill_dir = Path(base_path) / skill_name
    
    # Verificar si ya existe
    if skill_dir.exists():
        print(f"[X] Error: El skill '{skill_name}' ya existe en {skill_dir}")
        return None
    
    # Crear directorios
    try:
        skill_dir.mkdir(parents=True, exist_ok=False)
        (skill_dir / 'scripts').mkdir(exist_ok=True)
        (skill_dir / 'references').mkdir(exist_ok=True)
        (skill_dir / 'assets').mkdir(exist_ok=True)
        print(f"[OK] Directorio creado: {skill_dir}")
    except Exception as e:
        print(f"[X] Error creando directorios: {e}")
        return None
    
    # Generar contenido
    mecanica_titulo = kebab_to_title(mecanica)
    descripcion_corta = generate_description(mecanica)
    
    skill_content = SKILL_TEMPLATE.format(
        mecanica=mecanica,
        mecanica_titulo=mecanica_titulo,
        descripcion_corta=descripcion_corta
    )
    
    # Guardar SKILL.md
    skill_md_path = skill_dir / 'SKILL.md'
    try:
        skill_md_path.write_text(skill_content, encoding='utf-8')
        print(f"[OK] SKILL.md creado con 7 secciones obligatorias")
    except Exception as e:
        print(f"[X] Error creando SKILL.md: {e}")
        return None
    
    # Crear README explicativo en references
    readme_ref = skill_dir / 'references' / 'ejemplos_extendidos.md'
    readme_content = f"""# Ejemplos Extendidos: {mecanica_titulo}

Este archivo es para documentar ejemplos adicionales que no caben en SKILL.md.

Mantener SKILL.md bajo 500 lineas. Usar este archivo para:
- Casos de estudio completos
- Variaciones avanzadas
- Documentacion de errores reales observados
- Plantillas de configuracion

## Estructura Sugerida

### Ejemplos por Contexto
- Hall escape
- Street escape  
- Digital/Virtual

### Ejemplos por Dificultad
- Facil (ninos)
- Estandar (adultos)
- Experto (entusiastas)

### Casos de Estudio
Historias reales de implementacion con lecciones aprendidas.

---

*Este archivo es opcional. Eliminar si no se necesita.*
"""
    readme_ref.write_text(readme_content, encoding='utf-8')
    
    # Crear placeholder en scripts
    script_placeholder = skill_dir / 'scripts' / 'validador.py'
    script_content = f"""#!/usr/bin/env python3
\"\"\"
Validador especifico para pruebas de tipo {mecanica}

Valida que un JSON de prueba cumple las reglas de este skill.
Opcional: implementar si la validacion es compleja.
\"\"\"

import json
import sys
from pathlib import Path

def validar_prueba(json_path):
    \"\"\"Valida una prueba contra las reglas de prueba-{mecanica}.\"\"\"
    with open(json_path, 'r', encoding='utf-8') as f:
        prueba = json.load(f)
    
    errores = []
    
    # TODO: Implementar validaciones especificas
    # Ejemplo:
    # if 'campo_obligatorio' not in prueba:
    #     errores.append("Falta campo_obligatorio")
    
    if errores:
        print(f"[X] Validacion fallida para {{json_path}}")
        for error in errores:
            print(f"   - {{error}}")
        return False
    else:
        print(f"[OK] {{json_path}} valido")
        return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: validador.py <path/to/prueba.json>")
        sys.exit(1)
    
    exit(0 if validar_prueba(sys.argv[1]) else 1)
"""
    script_placeholder.write_text(script_content, encoding='utf-8')
    
    # Crear placeholder en assets
    asset_placeholder = skill_dir / 'assets' / 'plantilla_config.json'
    asset_content = f"""{{
  "skill": "prueba-{mecanica}",
  "version": "1.0",
  "variables": {{
    "variable_1": "valor_default",
    "variable_2": 5,
    "variable_3": false
  }},
  "_comentario": "Plantilla de configuracion para pruebas de tipo {mecanica}"
}}"""
    asset_placeholder.write_text(asset_content, encoding='utf-8')
    
    print()
    print("=" * 60)
    print(f"Skill '{skill_name}' inicializado correctamente")
    print("=" * 60)
    print()
    print("Estructura creada:")
    print(f"  {skill_name}/")
    print(f"  ├── SKILL.md (con 7 secciones obligatorias)")
    print(f"  ├── scripts/")
    print(f"  │   └── validador.py (placeholder)")
    print(f"  ├── references/")
    print(f"  │   └── ejemplos_extendidos.md (opcional)")
    print(f"  └── assets/")
    print(f"      └── plantilla_config.json (template)")
    print()
    print("Siguientes pasos:")
    print("  1. Editar SKILL.md y completar los [placeholders]")
    print("  2. Reemplazar ejemplos genericos con casos reales")
    print("  3. Ejecutar: validate_skill_prueba.py", skill_dir)
    print("  4. Implementar validador.py si es necesario")
    print()
    print("Recordatorio:")
    print("  - Mantener SKILL.md bajo 500 lineas")
    print("  - Usar lenguaje imperativo/infinitivo")
    print("  - Incluir ejemplos concretos, no abstractos")
    print()
    
    return skill_dir


def main():
    if len(sys.argv) < 2:
        print("Inicializador de Skills de Prueba")
        print()
        print("Usage: init_skill_prueba.py <nombre-mecanica> [--path <dir>]")
        print()
        print("Examples:")
        print("  init_skill_prueba.py cifrado")
        print("  init_skill_prueba.py busqueda-objetos --path ./skills")
        print("  init_skill_prueba.py logica-secuencial --path /custom/path")
        print()
        print("El nombre puede incluir o no el prefijo 'prueba-'")
        print("Se convertira automaticamente a formato prueba-{{mecanica}}")
        sys.exit(1)
    
    mecanica = sys.argv[1]
    
    # Parsear --path
    base_path = "."
    if '--path' in sys.argv:
        path_idx = sys.argv.index('--path')
        if path_idx + 1 < len(sys.argv):
            base_path = sys.argv[path_idx + 1]
    
    print(f"Inicializando skill de prueba: {mecanica}")
    print(f"Ubicacion: {base_path}")
    print()
    
    result = init_skill_prueba(mecanica, base_path)
    
    sys.exit(0 if result else 1)


if __name__ == "__main__":
    main()
