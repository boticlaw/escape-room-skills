#!/usr/bin/env python3
"""
Generador de PDF para "Test Final"
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
        "--directorio", "/home/daniel/.openclaw/workspace/agents/escapeitor/juegos/test-final",
        "--nombre", "Test Final",
        "--subtitulo", "None",
        "--color", "#8E44AD",
        "--color-sec", "#8E44AD",
        "--autor", "Escapeitor",
        "--plantilla", "/home/daniel/.openclaw/workspace/agents/escapeitor/juegos/test-final/plantilla.typ",
    ] + sys.argv[1:]  # Añadir argumentos adicionales del usuario
    
    # Ejecutar generador genérico
    result = subprocess.run(cmd)
    sys.exit(result.returncode)
