#!/usr/bin/env python3
"""
Inicializador de juegos de escape room
Crea game.json + JSONs de prueba vacíos (válidos contra schemas)
Pipeline: JSON → HTML (escape-pdf-generator) → PDF
"""

import sys
import argparse
import json
import re
from pathlib import Path
from datetime import datetime

# ═══════════════════════════════════════════════════════════════
# CONFIGURACIÓN
# ═══════════════════════════════════════════════════════════════

WORKSPACE_DIR = Path(__file__).parent.parent
SCHEMAS_DIR = WORKSPACE_DIR / "schemas"
PROJECTS_DIR = WORKSPACE_DIR / "projects"


def slugify(text: str) -> str:
    """Convierte texto a slug: minúsculas, sin acentos, separado por guiones"""
    text = text.lower()
    text = re.sub(r'[áàäâ]', 'a', text)
    text = re.sub(r'[éèëê]', 'e', text)
    text = re.sub(r'[íìïî]', 'i', text)
    text = re.sub(r'[óòöô]', 'o', text)
    text = re.sub(r'[úùüû]', 'u', text)
    text = re.sub(r'[ñ]', 'n', text)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    return text


def _prueba_filename(index: int, nombre: str) -> str:
    """Nombre de archivo para una prueba"""
    return f"prueba-{index:03d}-{slugify(nombre)}.json"


def make_game_json(nombre: str, subtitulo: str, tipo: str, version: str,
                   jugadores: str, duracion: str, edad: str, salas: int,
                   num_pruebas: int, test_mode: bool = False) -> dict:
    """Genera game.json mínimo válido contra game.schema.json"""
    pruebas = []
    for i in range(1, num_pruebas + 1):
        nombre_p = f"Prueba test {i:03d}" if test_mode else f"Prueba {i:03d}"
        pruebas.append({
            "id": f"prueba-{i:03d}",
            "archivo": _prueba_filename(i, nombre_p)
        })
    return {
        "nombre": nombre,
        "subtitulo": subtitulo,
        "tipo": tipo,
        "version": version,
        "fecha": datetime.now().strftime("%B %Y"),
        "meta": [
            {"label": "Jugadores", "value": jugadores},
            {"label": "Duración", "value": duracion},
            {"label": "Edad", "value": edad},
            {"label": "Dificultad", "value": "—"},
            {"label": "Salas", "value": str(salas)},
            {"label": "Pruebas", "value": str(num_pruebas)},
        ],
        "secciones": [],
        "pruebas": pruebas,
        "checklist_html": "",
        "secciones_final": []
    }


def make_prueba_json(game_slug: str, index: int, nombre: str, sala: str) -> dict:
    """Genera un JSON de prueba vacío válido contra prueba.schema.json"""
    game_id = re.sub(r'[^a-z0-9]', '', slugify(game_slug))
    nombre_slug = slugify(nombre).replace('-', '_')
    return {
        "id": f"{game_id}_{index:03d}_{nombre_slug}",
        "nombre": nombre,
        "descripcion": "",
        "juego": "",
        "version": 1,
        "espacio": index,
        "sala": sala,
        "tema_educativo": "",
        "skill_primario": "",
        "skills_secundarios": [],
        "dificultad": 5,
        "duracion_estimada_minutos": 10,
        "jugadores_min": 2,
        "jugadores_max": 6,
        "edad_minima": 10,
        "cooperacion_obligatoria": False,
        "formato": "secuencial",
        "configuracion": {
            "mecanica_principal": "",
            "mecanismo_barrera": "",
            "elementos_necesarios": [],
            "distribucion_roles": {}
        },
        "barrera_fisica": {
            "tipo": ""
        },
        "hilo_conductor": {
            "letra": "",
            "significado": "",
            "posicion": index
        },
        "pistas": [
            {"nivel": 1, "texto": ""}
        ],
        "solucion": {
            "descripcion": "",
            "verificacion": "",
            "pasos_detallados": []
        },
        "materiales": {
            "impresion": [],
            "mobiliario": [],
            "extras": []
        }
    }


def create_juego(nombre: str, num_pruebas: int, sala: str, duracion: str,
                 edad: str, jugadores: str, tipo: str, subtitulo: str,
                 version: str, directorio: Path, sobrescribir: bool,
                 test_mode: bool = False):
    """Crea la estructura completa del juego"""

    if directorio.exists() and not sobrescribir:
        print(f"❌ El directorio ya existe: {directorio}")
        print("   Usa --sobrescribir para sobrescribir")
        sys.exit(1)

    game_slug = slugify(nombre)
    if not directorio:
        directorio = PROJECTS_DIR / game_slug

    directorio.mkdir(parents=True, exist_ok=True)
    (directorio / "juego" / "pruebas").mkdir(parents=True, exist_ok=True)

    # game.json
    game_data = make_game_json(nombre, subtitulo, tipo, version,
                               jugadores, duracion, edad, 1, num_pruebas,
                               test_mode=test_mode)
    game_path = directorio / "game.json"
    game_path.write_text(json.dumps(game_data, indent=2, ensure_ascii=False) + "\n",
                         encoding='utf-8')
    print(f"  ✅ game.json")

    # JSONs de prueba
    for i in range(1, num_pruebas + 1):
        prueba_nombre = f"Prueba {i:03d}" if not test_mode else f"Prueba test {i:03d}"
        prueba_data = make_prueba_json(game_slug, i, prueba_nombre, sala)
        filename = _prueba_filename(i, prueba_nombre)
        prueba_path = directorio / "juego" / "pruebas" / filename
        prueba_path.write_text(json.dumps(prueba_data, indent=2, ensure_ascii=False) + "\n",
                               encoding='utf-8')
        print(f"  ✅ juego/pruebas/{filename}")

    return directorio


def main():
    parser = argparse.ArgumentParser(
        description='Inicializa un nuevo juego de escape room (JSON pipeline)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Ejemplos:
  python init-juego.py --nombre "Mi Juego"
  python init-juego.py --nombre "Crimen" --pruebas 5 --sala "Despacho"
  python init-juego.py --test  # Test rápido con datos de ejemplo
'''
    )

    parser.add_argument('--nombre', '-n', help='Nombre del juego')
    parser.add_argument('--pruebas', '-p', type=int, default=6, help='Número de pruebas (default: 6)')
    parser.add_argument('--sala', '-s', default='Sala 1', help='Sala por defecto (default: "Sala 1")')
    parser.add_argument('--duracion', '-d', default='60 min', help='Duración (default: "60 min")')
    parser.add_argument('--edad', '-e', default='10 - 18', help='Rango de edad (default: "10 - 18")')
    parser.add_argument('--jugadores', '-j', default='2 - 6', help='Rango de jugadores (default: "2 - 6")')
    parser.add_argument('--tipo', '-t', choices=['verde', 'rojo', 'azul', 'violeta', 'naranja', 'oscuro'],
                        default='verde', help='Paleta de colores (default: verde)')
    parser.add_argument('--subtitulo', help='Subtítulo del juego')
    parser.add_argument('--version', '-v', default='1.0', help='Versión (default: "1.0")')
    parser.add_argument('--directorio', help='Directorio personalizado')
    parser.add_argument('--sobrescribir', action='store_true', help='Sobrescribir si existe')
    parser.add_argument('--test', action='store_true', help='Modo test: crea juego de prueba')

    args = parser.parse_args()

    if args.test:
        nombre = args.nombre or "juego-test"
        directorio = Path(args.directorio) if args.directorio else PROJECTS_DIR / nombre
        if directorio.exists():
            import shutil
            shutil.rmtree(directorio)
        print(f"🧪 Modo test — creando juego en {directorio}")
        dir_created = create_juego(
            nombre=nombre, num_pruebas=3, sala="Sala Test",
            duracion="30 min", edad="10+", jugadores="2-4",
            tipo="verde", subtitulo="Juego de prueba", version="0.1",
            directorio=directorio, sobrescribir=True, test_mode=True
        )
        print(f"\n✅ Test completado. Estructura creada en: {dir_created}")
        return

    if not args.nombre:
        parser.error("--nombre es requerido (o usa --test)")

    directorio = Path(args.directorio) if args.directorio else None

    print(f"\n🎮 Inicializando: {args.nombre}")
    print(f"   Pruebas: {args.pruebas} | Sala: {args.sala} | Tipo: {args.tipo}\n")

    dir_created = create_juego(
        nombre=args.nombre, num_pruebas=args.pruebas, sala=args.sala,
        duracion=args.duracion, edad=args.edad, jugadores=args.jugadores,
        tipo=args.tipo, subtitulo=args.subtitulo, version=args.version,
        directorio=directorio, sobrescribir=args.sobrescribir
    )

    print(f"\n🎉 ¡Juego inicializado! → {dir_created}")
    print(f"\nSiguientes pasos:")
    print(f"  1. Editar {dir_created}/game.json (nombre, meta, secciones)")
    print(f"  2. Rellenar pruebas en juego/pruebas/prueba-*.json")
    print(f"  3. Generar HTML → PDF con escape-pdf-generator")


if __name__ == "__main__":
    main()
