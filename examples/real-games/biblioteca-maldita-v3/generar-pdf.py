#!/usr/bin/env python3
"""
Generador de PDF para "La Biblioteca Maldita"
Script específico del juego con configuración predefinida
"""

import subprocess
import sys
from pathlib import Path

# Ruta al generador genérico
GENERADOR_GENERICO = Path("/home/daniel/.openclaw/workspace/agents/escapeitor/scripts/generar-pdf.py")

if __name__ == "__main__":
    # Construir comando con configuración del juego
    cmd = [
        sys.executable,  # python3
        str(GENERADOR_GENERICO),
        "--directorio", "juegos/biblioteca-maldita-v3",
        "--nombre", "La Biblioteca Maldita",
        "--subtitulo", "El bibliotecario dejó un libro abierto. Nadie debía leerlo.",
        "--color", "#5C4033",
        "--color-sec", "#D4AF37",
        "--autor", "Escapeitor",
        "--plantilla", "juegos/biblioteca-maldita-v3/plantilla.typ",
    ] + sys.argv[1:]  # Añadir argumentos adicionales del usuario
    
    # Ejecutar generador genérico
    result = subprocess.run(cmd)
    sys.exit(result.returncode)
