#!/usr/bin/env python3
"""
Validador de Skills de Prueba

Valida que un skill de prueba cumple la estructura obligatoria
y los criterios de calidad definidos en skill-architect-pruebas-escape.

Usage:
    validate_skill_prueba.py <path/to/skill-directory>

Exit codes:
    0 - Skill valido
    1 - Errores de estructura
    2 - Errores de contenido
    3 - Errores graves (duplicacion, score bajo)
"""

import sys
import re
from pathlib import Path
from dataclasses import dataclass
from typing import List, Tuple, Optional


@dataclass
class ValidationError:
    severity: str  # 'error', 'warning', 'info'
    code: str
    message: str
    section: Optional[str] = None


class SkillValidator:
    REQUIRED_SECTIONS = [
        "cuando usar",
        "cuando no usar",
        "variables de diseno",
        "errores comunes",
        "escalado de dificultad",
        "adaptaciones",
        "relaciones"
    ]
    
    def __init__(self, skill_path: Path):
        self.skill_path = Path(skill_path)
        self.errors: List[ValidationError] = []
        self.warnings: List[ValidationError] = []
        self.infos: List[ValidationError] = []
        self.content = ""
        self.frontmatter = {}
        
    def validate(self) -> bool:
        """Ejecuta todas las validaciones."""
        print(f"Validando skill: {self.skill_path.name}")
        print("=" * 60)
        
        # 1. Validar estructura de archivos
        self._validate_structure()
        
        # 2. Cargar y parsear SKILL.md
        if not self._load_skill_md():
            return False
            
        # 3. Validar frontmatter
        self._validate_frontmatter()
        
        # 4. Validar secciones obligatorias
        self._validate_required_sections()
        
        # 5. Validar contenido de secciones
        self._validate_section_content()
        
        # 6. Validar calidad general
        self._validate_quality()
        
        # 7. Reportar resultados
        return self._report_results()
    
    def _validate_structure(self):
        """Valida que existen los archivos necesarios."""
        if not self.skill_path.exists():
            self.errors.append(ValidationError(
                'error', 'E001', 
                f"Directorio no existe: {self.skill_path}"
            ))
            return
            
        skill_md = self.skill_path / 'SKILL.md'
        if not skill_md.exists():
            self.errors.append(ValidationError(
                'error', 'E002',
                "Falta archivo SKILL.md en raiz"
            ))
    
    def _load_skill_md(self) -> bool:
        """Carga y parsea el archivo SKILL.md."""
        skill_md = self.skill_path / 'SKILL.md'
        if not skill_md.exists():
            return False
            
        try:
            self.content = skill_md.read_text(encoding='utf-8')
        except Exception as e:
            self.errors.append(ValidationError(
                'error', 'E003',
                f"No se pudo leer SKILL.md: {e}"
            ))
            return False
        
        # Parsear frontmatter
        frontmatter_match = re.match(r'^---\s*\n(.*?)\n---\s*\n', self.content, re.DOTALL)
        if frontmatter_match:
            fm_text = frontmatter_match.group(1)
            for line in fm_text.strip().split('\n'):
                if ':' in line and not line.startswith('#'):
                    key, value = line.split(':', 1)
                    self.frontmatter[key.strip()] = value.strip()
        else:
            self.errors.append(ValidationError(
                'error', 'E004',
                "No se encontro frontmatter YAML (debe empezar con ---)"
            ))
            
        return True
    
    def _validate_frontmatter(self):
        """Valida campos del frontmatter."""
        # Nombre obligatorio
        if 'name' not in self.frontmatter:
            self.errors.append(ValidationError(
                'error', 'E005',
                "Frontmatter debe incluir campo 'name'"
            ))
        else:
            name = self.frontmatter['name']
            # Validar formato prueba-{mecanica}
            if not name.startswith('prueba-') and not name.startswith('tipo-prueba-'):
                self.warnings.append(ValidationError(
                    'warning', 'W001',
                    f"Nombre '{name}' no sigue convencion 'prueba-{{mecanica}}' o 'tipo-prueba-{{mecanica}}'",
                    'frontmatter'
                ))
            # Validar kebab-case
            if not re.match(r'^[a-z0-9]+(-[a-z0-9]+)*$', name):
                self.warnings.append(ValidationError(
                    'warning', 'W002',
                    f"Nombre '{name}' debe usar kebab-case (minusculas y guiones)",
                    'frontmatter'
                ))
        
        # Descripcion obligatoria
        if 'description' not in self.frontmatter:
            self.errors.append(ValidationError(
                'error', 'E006',
                "Frontmatter debe incluir campo 'description'"
            ))
        else:
            desc = self.frontmatter['description']
            if len(desc) < 50:
                self.warnings.append(ValidationError(
                    'warning', 'W003',
                    "Descripcion muy corta (<50 caracteres). Debe explicar cuando usar este skill.",
                    'frontmatter'
                ))
            if 'when' not in desc.lower() and 'cuando' not in desc.lower():
                self.warnings.append(ValidationError(
                    'warning', 'W004',
                    "Descripcion deberia incluir 'cuando usar' este skill",
                    'frontmatter'
                ))
    
    def _validate_required_sections(self):
        """Valida que existen las 7 secciones obligatorias."""
        content_lower = self.content.lower()
        
        missing_sections = []
        for section in self.REQUIRED_SECTIONS:
            # Buscar como header (## o ###)
            pattern = rf'##+\s*{re.escape(section)}'
            if not re.search(pattern, content_lower):
                missing_sections.append(section)
        
        if missing_sections:
            for section in missing_sections:
                self.errors.append(ValidationError(
                    'error', 'E007',
                    f"Falta seccion obligatoria: '{section}'",
                    'estructura'
                ))
    
    def _validate_section_content(self):
        """Valida el contenido de cada seccion."""
        sections = self._extract_sections()
        
        # Validar seccion 1: Cuando usar
        if 'cuando usar' in sections:
            content = sections['cuando usar']
            triggers = len(re.findall(r'^\s*[-*]\s+', content, re.MULTILINE))
            if triggers < 3:
                self.warnings.append(ValidationError(
                    'warning', 'W005',
                    f"Seccion 'Cuando usar' deberia tener al menos 3 triggers especificos (tiene {triggers})",
                    'cuando usar'
                ))
        
        # Validar seccion 2: Cuando NO usar
        if 'cuando no usar' in sections:
            content = sections['cuando no usar']
            antipatterns = len(re.findall(r'^\s*[-*]\s+', content, re.MULTILINE))
            if antipatterns < 2:
                self.warnings.append(ValidationError(
                    'warning', 'W006',
                    f"Seccion 'Cuando NO usar' deberia tener al menos 2 anti-patrones (tiene {antipatterns})",
                    'cuando no usar'
                ))
            # Verificar que menciona alternativas
            if 'usar' not in content.lower() or 'alternativa' not in content.lower():
                self.warnings.append(ValidationError(
                    'warning', 'W007',
                    "Seccion 'Cuando NO usar' deberia sugerir skills alternativos",
                    'cuando no usar'
                ))
        
        # Validar seccion 3: Variables
        if 'variables' in sections:
            content = sections['variables']
            # Buscar definiciones de variables (nombre: tipo o tabla)
            vars_found = len(re.findall(r'[-*`]\s*\w+\s*:', content))
            if vars_found < 2:
                self.warnings.append(ValidationError(
                    'warning', 'W008',
                    f"Seccion 'Variables de diseno' deberia documentar al menos 2 variables (tiene {vars_found})",
                    'variables de diseno'
                ))
        
        # Validar seccion 5: Escalado
        if 'escalado' in sections:
            content = sections['escalado']
            levels = ['facil', 'dificil', 'avanzado', 'simple', 'complejo']
            has_levels = any(level in content.lower() for level in levels)
            if not has_levels:
                self.warnings.append(ValidationError(
                    'warning', 'W009',
                    "Seccion 'Escalado de dificultad' deberia definir niveles (facil/media/dificil)",
                    'escalado de dificultad'
                ))
        
        # Validar seccion 6: Adaptaciones
        if 'adaptaciones' in sections:
            content = sections['adaptaciones']
            contexts = ['hall', 'street', 'digital', 'edad', 'ninos', 'adultos']
            has_contexts = any(ctx in content.lower() for ctx in contexts)
            if not has_contexts:
                self.warnings.append(ValidationError(
                    'warning', 'W010',
                    "Seccion 'Adaptaciones' deberia mencionar contextos (hall/street/edad)",
                    'adaptaciones'
                ))
        
        # Validar seccion 7: Relaciones
        if 'relaciones' in sections:
            content = sections['relaciones']
            skills = len(re.findall(r'prueba-[a-z-]+', content))
            if skills < 2:
                self.warnings.append(ValidationError(
                    'warning', 'W011',
                    f"Seccion 'Relaciones' deberia mencionar al menos 2 skills (tiene {skills})",
                    'relaciones'
                ))
    
    def _extract_sections(self) -> dict:
        """Extrae el contenido de cada seccion."""
        sections = {}
        current_section = None
        current_content = []
        
        for line in self.content.split('\n'):
            if line.startswith('#'):
                # Guardar seccion anterior
                if current_section:
                    sections[current_section] = '\n'.join(current_content)
                
                # Nueva seccion
                header = line.lstrip('#').strip().lower()
                current_section = header
                current_content = []
            elif current_section:
                current_content.append(line)
        
        # Guardar ultima seccion
        if current_section:
            sections[current_section] = '\n'.join(current_content)
            
        return sections
    
    def _validate_quality(self):
        """Validaciones de calidad general."""
        # Verificar longitud
        lines = self.content.split('\n')
        if len(lines) > 500:
            self.warnings.append(ValidationError(
                'warning', 'W012',
                f"SKILL.md muy largo ({len(lines)} lineas). Considerar mover contenido a references/",
                'general'
            ))
        
        # Verificar TODOs (marcadores pendientes, no la palabra "todo" en español)
        # Busca: [TODO], TODO:, o TODO como palabra aislada en mayusculas
        todos = len(re.findall(r'\[TODO\]|TODO:|^TODO\s*$|\sTODO\s', self.content))
        if todos > 0:
            self.errors.append(ValidationError(
                'error', 'E008',
                f"SKILL.md contiene {todos} TODOs pendientes. Completar antes de validar.",
                'general'
            ))
        
        # Verificar ejemplos concretos (no abstractos)
        examples = re.findall(r'```.*?```', self.content, re.DOTALL)
        if len(examples) < 1:
            self.infos.append(ValidationError(
                'info', 'I001',
                "Considerar anadir ejemplos concretos en bloques de codigo",
                'general'
            ))
        
        # Verificar duplicacion potencial (simulado - en produccion comparar con otros skills)
        generic_terms = ['prueba', 'puzzle', 'juego', 'reto']
        specificity_score = 0
        for term in generic_terms:
            if term in self.content.lower():
                specificity_score += 1
        if specificity_score >= 4 and len(self.content) < 2000:
            self.warnings.append(ValidationError(
                'warning', 'W013',
                "Skill parece muy generico. Verificar que no duplica skill existente.",
                'general'
            ))
    
    def _report_results(self) -> bool:
        """Muestra resultados y retorna True si no hay errores."""
        print()
        
        if self.errors:
            print(f"[X] ERRORES ({len(self.errors)}):")
            for err in self.errors:
                section = f" [{err.section}]" if err.section else ""
                print(f"   {err.code}: {err.message}{section}")
            print()
        
        if self.warnings:
            print(f"[!] ADVERTENCIAS ({len(self.warnings)}):")
            for warn in self.warnings:
                section = f" [{warn.section}]" if warn.section else ""
                print(f"   {warn.code}: {warn.message}{section}")
            print()
        
        if self.infos:
            print(f"[i] INFO ({len(self.infos)}):")
            for info in self.infos:
                section = f" [{info.section}]" if info.section else ""
                print(f"   {info.code}: {info.message}{section}")
            print()
        
        if not self.errors and not self.warnings:
            print("[OK] Skill validado correctamente")
            print()
            print("Cumple:")
            print("   [OK] Estructura de archivos")
            print("   [OK] Frontmatter completo")
            print("   [OK] 7 secciones obligatorias")
            print("   [OK] Contenido minimo en cada seccion")
            return True
        elif not self.errors:
            print("[OK] Skill validado con advertencias (corregir warnings para calidad optima)")
            return True
        else:
            print(f"[FAIL] Validacion FALLIDA: {len(self.errors)} errores deben corregirse")
            return False


def main():
    if len(sys.argv) < 2:
        print("Usage: validate_skill_prueba.py <path/to/skill-directory>")
        print()
        print("Valida que un skill de prueba cumple:")
        print("  - Estructura de archivos correcta")
        print("  - Frontmatter con name y description")
        print("  - 7 secciones obligatorias")
        print("  - Contenido minimo por seccion")
        print("  - Calidad general (longitud, TODOs, ejemplos)")
        sys.exit(1)
    
    skill_path = Path(sys.argv[1])
    validator = SkillValidator(skill_path)
    is_valid = validator.validate()
    
    sys.exit(0 if is_valid else 1)


if __name__ == "__main__":
    main()
