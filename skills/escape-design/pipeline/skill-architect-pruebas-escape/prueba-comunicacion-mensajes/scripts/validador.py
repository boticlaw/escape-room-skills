#!/usr/bin/env python3
"""
Validador especifico para pruebas de tipo comunicacion-mensajes

Valida que un JSON de prueba cumple las reglas de este skill.
Opcional: implementar si la validacion es compleja.
"""

import json
import sys
from pathlib import Path

def validar_prueba(json_path):
    """Valida una prueba contra las reglas de prueba-comunicacion-mensajes."""
    with open(json_path, 'r', encoding='utf-8') as f:
        prueba = json.load(f)
    
    errores = []
    
    # TODO: Implementar validaciones especificas
    # Ejemplo:
    # if 'campo_obligatorio' not in prueba:
    #     errores.append("Falta campo_obligatorio")
    
    if errores:
        print(f"[X] Validacion fallida para {json_path}")
        for error in errores:
            print(f"   - {error}")
        return False
    else:
        print(f"[OK] {json_path} valido")
        return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: validador.py <path/to/prueba.json>")
        sys.exit(1)
    
    exit(0 if validar_prueba(sys.argv[1]) else 1)
