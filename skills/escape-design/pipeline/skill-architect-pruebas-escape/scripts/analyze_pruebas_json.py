#!/usr/bin/env python3
"""
Analizador de Pruebas JSON para Deteccion de Patrones

Analiza un directorio de pruebas JSON para proponer candidatos a skills.
Usa algoritmos de agrupamiento por similitud de campos y valores.

Usage:
    analyze_pruebas_json.py <path/to/pruebas/> [--min-cluster-size N]

Output:
    Reporte de candidatos a skills con score y recomendaciones
"""

import sys
import json
import re
from pathlib import Path
from collections import defaultdict
from dataclasses import dataclass, field
from typing import List, Dict, Set, Tuple, Union, Any
import argparse


@dataclass
class Prueba:
    """Representa una prueba JSON cargada."""
    id: str
    file_path: Path
    data: dict
    fields: Set[str] = field(default_factory=set)
    mecanica_hints: List[str] = field(default_factory=list)
    
    def __post_init__(self):
        self.fields = self._extract_fields(self.data)
        self.mecanica_hints = self._detect_mecanica()
    
    def _extract_fields(self, data: Union[dict, list, Any], prefix="") -> Set[str]:
        """Extrae todos los campos del JSON recursivamente."""
        fields = set()
        if isinstance(data, dict):
            for key, value in data.items():
                full_key = f"{prefix}.{key}" if prefix else key
                fields.add(full_key)
                if isinstance(value, (dict, list)):
                    fields.update(self._extract_fields(value, full_key))
        elif isinstance(data, list):
            for i, item in enumerate(data):
                fields.update(self._extract_fields(item, f"{prefix}[{i}]"))
        return fields
    
    def _detect_mecanica(self) -> List[str]:
        """Detecta posibles mecanicas basadas en campos y valores."""
        hints = []
        data_str = json.dumps(self.data, ensure_ascii=False).lower()
        
        # Patrones de mecanicas
        patterns = {
            'cifrado': ['cifrado', 'codigo', 'encript', 'cesar', 'morse', 'sustitucion'],
            'busqueda': ['buscar', 'encontrar', 'objeto', 'escondite', 'oculto', 'hallar'],
            'logica': ['logica', 'secuencia', 'orden', 'patron', 'deduccion'],
            'mecanismo': ['mecanismo', 'cerradura', 'combinacion', 'llave', 'puerta'],
            'observacion': ['observar', 'visual', 'imagen', 'detalle', 'ver'],
            'matematico': ['numero', 'calculo', 'ecuacion', 'matematica', 'suma', 'resta'],
            'fisico': ['fisico', 'objeto', 'manipular', 'tactil', 'mover'],
            'audio': ['sonido', 'audio', 'musica', 'cancion', 'escuchar'],
            'cooperativo': ['cooperar', 'equipo', 'simultaneo', 'colaborar'],
        }
        
        for mecanica, keywords in patterns.items():
            if any(kw in data_str for kw in keywords):
                hints.append(mecanica)
        
        return hints


@dataclass
class ClusterCandidato:
    """Representa un grupo de pruebas similares candidato a skill."""
    id: str
    pruebas: List[Prueba]
    campos_comunes: Set[str]
    mecanica_sugerida: str
    score: int
    razon: str


class PruebaAnalyzer:
    def __init__(self, pruebas_dir: Path, min_cluster_size: int = 3):
        self.pruebas_dir = Path(pruebas_dir)
        self.min_cluster_size = min_cluster_size
        self.pruebas: List[Prueba] = []
        self.clusters: List[ClusterCandidato] = []
    
    def analyze(self) -> List[ClusterCandidato]:
        """Ejecuta el analisis completo."""
        print(f"Analizando pruebas en: {self.pruebas_dir}")
        print("=" * 70)
        
        # 1. Cargar todas las pruebas
        self._load_pruebas()
        
        if len(self.pruebas) < self.min_cluster_size:
            print(f"\n[X] Solo {len(self.pruebas)} pruebas encontradas.")
            print(f"   Se necesitan al menos {self.min_cluster_size} para detectar patrones.")
            return []
        
        print(f"[OK] {len(self.pruebas)} pruebas cargadas")
        
        # 2. Agrupar por similitud
        self._cluster_by_similarity()
        print(f"[OK] {len(self.clusters)} grupos candidatos detectados")
        
        # 3. Evaluar cada cluster
        self._evaluate_clusters()
        
        # 4. Ordenar por score
        self.clusters.sort(key=lambda x: x.score, reverse=True)
        
        return self.clusters
    
    def _load_pruebas(self):
        """Carga todos los archivos JSON del directorio."""
        if not self.pruebas_dir.exists():
            print(f"[X] Directorio no existe: {self.pruebas_dir}")
            return
        
        json_files = list(self.pruebas_dir.glob("*.json"))
        
        for json_file in json_files:
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                prueba_id = data.get('id', json_file.stem)
                prueba = Prueba(
                    id=prueba_id,
                    file_path=json_file,
                    data=data
                )
                self.pruebas.append(prueba)
            except Exception as e:
                print(f"[WARN]  Error cargando {json_file}: {e}")
    
    def _cluster_by_similarity(self):
        """Agrupa pruebas por similitud de campos y mecanicas."""
        # Usar mecanicas detectadas como primer nivel de agrupamiento
        mecanica_groups = defaultdict(list)
        
        for prueba in self.pruebas:
            if prueba.mecanica_hints:
                # Usar la primera mecanica detectada como grupo principal
                primary = prueba.mecanica_hints[0]
                mecanica_groups[primary].append(prueba)
            else:
                mecanica_groups['sin_clasificar'].append(prueba)
        
        # Crear clusters a partir de grupos con suficientes pruebas
        for mecanica, pruebas in mecanica_groups.items():
            if len(pruebas) >= self.min_cluster_size:
                # Calcular campos comunes
                campos_comunes = set.intersection(*[p.fields for p in pruebas])
                
                cluster = ClusterCandidato(
                    id=f"candidato-{mecanica}",
                    pruebas=pruebas,
                    campos_comunes=campos_comunes,
                    mecanica_sugerida=mecanica,
                    score=0,
                    razon=""
                )
                self.clusters.append(cluster)
        
        # Tambien buscar similitudes por campos (para mecanicas no detectadas)
        self._cluster_by_fields()
    
    def _cluster_by_fields(self):
        """Agrupa pruebas que comparten muchos campos estructurales."""
        # Encontrar grupos donde >70% de campos sean compartidos
        used_pruebas = set()
        for cluster in self.clusters:
            used_pruebas.update(p.id for p in cluster.pruebas)
        
        remaining = [p for p in self.pruebas if p.id not in used_pruebas]
        
        # Agrupamiento simple: pruebas con >70% de campos en comun
        for i, prueba1 in enumerate(remaining):
            if prueba1.id in used_pruebas:
                continue
            
            grupo = [prueba1]
            for prueba2 in remaining[i+1:]:
                if prueba2.id in used_pruebas:
                    continue
                
                # Calcular similitud Jaccard
                intersection = len(prueba1.fields & prueba2.fields)
                union = len(prueba1.fields | prueba2.fields)
                similarity = intersection / union if union > 0 else 0
                
                if similarity > 0.7:  # 70% de similitud
                    grupo.append(prueba2)
                    used_pruebas.add(prueba2.id)
            
            if len(grupo) >= self.min_cluster_size:
                campos_comunes = set.intersection(*[p.fields for p in grupo])
                
                # Detectar mecanica del grupo
                all_hints = []
                for p in grupo:
                    all_hints.extend(p.mecanica_hints)
                
                mecanica = max(set(all_hints), key=all_hints.count) if all_hints else 'mixta'
                
                cluster = ClusterCandidato(
                    id=f"candidato-estructura-{i}",
                    pruebas=grupo,
                    campos_comunes=campos_comunes,
                    mecanica_sugerida=mecanica,
                    score=0,
                    razon=""
                )
                self.clusters.append(cluster)
    
    def _evaluate_clusters(self):
        """Evalua cada cluster con la scorecard."""
        for cluster in self.clusters:
            score = 0
            razones = []
            
            # 1. Cantidad de pruebas (0-3 puntos)
            cantidad = len(cluster.pruebas)
            if cantidad >= 10:
                score += 3
                razones.append(f"Cantidad: {cantidad} pruebas (3pts)")
            elif cantidad >= 5:
                score += 2
                razones.append(f"Cantidad: {cantidad} pruebas (2pts)")
            elif cantidad >= 3:
                score += 1
                razones.append(f"Cantidad: {cantidad} pruebas (1pt)")
            
            # 2. Reglas propias (0-3 puntos)
            # Mas campos comunes = reglas mas definidas
            campos_score = min(len(cluster.campos_comunes) / 5, 3)
            score += int(campos_score)
            razones.append(f"Reglas: {len(cluster.campos_comunes)} campos comunes ({int(campos_score)}pts)")
            
            # 3. Reutilizacion (0-2 puntos)
            # Simulado: si mecanica aparece en diferentes archivos
            archivos = set(p.file_path.name for p in cluster.pruebas)
            if len(archivos) >= 3:
                score += 2
                razones.append("Reutilizacion: en 3+ archivos (2pts)")
            else:
                score += 1
                razones.append("Reutilizacion: potencial (1pt)")
            
            # 4. Impacto en decisiones (0-1 punto)
            # Si tiene campos de configuracion complejos
            config_fields = [f for f in cluster.campos_comunes if any(x in f for x in ['config', 'tipo', 'nivel', 'dificultad'])]
            if len(config_fields) >= 2:
                score += 1
                razones.append("Impacto: campos configurables (1pt)")
            
            # 5. Complejidad (0-1 punto)
            # Si requiere validacion especifica
            if any('validacion' in f or 'solucion' in f for f in cluster.campos_comunes):
                score += 1
                razones.append("Complejidad: requiere validacion (1pt)")
            
            cluster.score = score
            cluster.razon = "\n     ".join(razones)
    
    def generate_report(self):
        """Genera reporte de candidatos."""
        print("\n" + "=" * 70)
        print("REPORTE DE CANDIDATOS A SKILLS")
        print("=" * 70)
        
        if not self.clusters:
            print("\nNo se detectaron candidatos. Recomendaciones:")
            print("  - Asegurate de tener suficientes pruebas (min 3)")
            print("  - Verifica que los JSON tengan estructura similar")
            print("  - Considera anadir campos descriptivos de mecanica")
            return
        
        # Separar por score
        alto = [c for c in self.clusters if c.score >= 7]
        medio = [c for c in self.clusters if 5 <= c.score < 7]
        bajo = [c for c in self.clusters if c.score < 5]
        
        if alto:
            print(f"\n🟢 CANDIDATOS RECOMENDADOS (Score >= 7) - {len(alto)} grupos:")
            for cluster in alto:
                self._print_cluster(cluster, "CREAR SKILL")
        
        if medio:
            print(f"\n🟡 CANDIDATOS POTENCIALES (Score 5-6) - {len(medio)} grupos:")
            for cluster in medio:
                self._print_cluster(cluster, "ACUMULAR MAS PRUEBAS")
        
        if bajo:
            print(f"\n🔴 CANDIDATOS DEBILES (Score < 5) - {len(bajo)} grupos:")
            for cluster in bajo:
                self._print_cluster(cluster, "NO CREAR")
        
        # Resumen de acciones
        print("\n" + "=" * 70)
        print("ACCIONES RECOMENDADAS:")
        print("=" * 70)
        
        if alto:
            print(f"\n1. Crear {len(alto)} skill(s) nuevo(s):")
            for cluster in alto:
                nombre = f"prueba-{cluster.mecanica_sugerida}"
                print(f"   - {nombre} ({len(cluster.pruebas)} pruebas)")
            print("\n   Comando para cada uno:")
            print(f"   init_skill_prueba.py prueba-<mecanica> --path ./skills")
        
        print("\n2. Revisar clusters con score medio:")
        print("   - Evaluar si merecen la pena mas pruebas")
        print("   - O fusionar con skills existentes")
        
        print("\n3. Clusters con score bajo:")
        print("   - No crear skills dedicados")
        print("   - Documentar como variaciones de skills existentes")
    
    def _print_cluster(self, cluster: ClusterCandidato, decision: str):
        """Imprime informacion de un cluster."""
        print(f"\n  📦 {cluster.id}")
        print(f"     Score: {cluster.score}/10 - {decision}")
        print(f"     Mecanica sugerida: {cluster.mecanica_sugerida}")
        print(f"     Pruebas: {len(cluster.pruebas)}")
        print(f"       - {', '.join([p.id for p in cluster.pruebas[:3]])}")
        if len(cluster.pruebas) > 3:
            print(f"       - ... y {len(cluster.pruebas) - 3} mas")
        print(f"     Campos comunes ({len(cluster.campos_comunes)}):")
        campos_muestra = list(cluster.campos_comunes)[:5]
        print(f"       - {', '.join(campos_muestra)}")
        if len(cluster.campos_comunes) > 5:
            print(f"       - ... y {len(cluster.campos_comunes) - 5} mas")
        print(f"     Puntuacion:")
        for linea in cluster.razon.split('\n'):
            print(f"       {linea}")


def main():
    parser = argparse.ArgumentParser(
        description='Analiza pruebas JSON para detectar patrones candidatos a skills'
    )
    parser.add_argument('pruebas_dir', help='Directorio con archivos JSON de pruebas')
    parser.add_argument('--min-cluster-size', type=int, default=3,
                       help='Minimo de pruebas para formar un cluster (default: 3)')
    
    args = parser.parse_args()
    
    analyzer = PruebaAnalyzer(
        pruebas_dir=args.pruebas_dir,
        min_cluster_size=args.min_cluster_size
    )
    
    clusters = analyzer.analyze()
    analyzer.generate_report()
    
    # Retornar codigo de salida basado en candidatos encontrados
    alto = [c for c in clusters if c.score >= 7]
    sys.exit(0 if alto else 1)


if __name__ == "__main__":
    main()
