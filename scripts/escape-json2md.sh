#!/bin/bash
# escape-json2md.sh - Convierte pruebas JSON a Markdown
# Uso: ./escape-json2md.sh [directorio_json] [directorio_salida]
# Por defecto: escape-material/pruebas/ -> escape-material/pruebas/md/

# No usar set -e para continuar aunque falle un archivo

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
JSON_DIR="${1:-$BASE_DIR/escape-material/pruebas}"
MD_DIR="${2:-$JSON_DIR/md}"

# Crear directorio de salida si no existe
mkdir -p "$MD_DIR"

# Contadores
CONVERTIDOS=0
ERRORES=0
ERROR_FILES=""

echo "Convirtiendo JSON de: $JSON_DIR"
echo "Salida en: $MD_DIR"
echo "---"

# Procesar cada archivo JSON
for json_file in "$JSON_DIR"/*.json; do
    [ -f "$json_file" ] || continue
    
    filename=$(basename "$json_file" .json)
    md_file="$MD_DIR/${filename}.md"
    
    # Extraer campos con jq (con defaults para campos opcionales)
    id=$(jq -r '.id // empty' "$json_file")
    nombre=$(jq -r '.nombre // "Sin nombre"' "$json_file")
    skill=$(jq -r '.skill_primario // "Sin skill"' "$json_file")
    dificultad=$(jq -r '.dificultad // 0' "$json_file")
    descripcion=$(jq -r '.descripcion // "Sin descripción"' "$json_file")
    
    # Tags: pueden estar en metadata.tags o como array en root
    tags=$(jq -r '
        if .metadata.tags then (.metadata.tags | join(", "))
        elif .tags then (.tags | join(", "))
        else "Sin tags"
        end
    ' "$json_file")
    
    # Solución: manejar diferentes estructuras
    solucion=$(jq -r '
        if .solucion.mecanica and .solucion.estrategia then
            "\(.solucion.mecanica): \(.solucion.estrategia)"
        elif .solucion.mecanica and .solucion.descripcion then
            "\(.solucion.mecanica): \(.solucion.descripcion)"
        elif .solucion.metodo and .solucion.resultado then
            "\(.solucion.metodo): \(.solucion.resultado)"
        elif .solucion.contrasena and .solucion.metodo then
            "Contraseña: \(.solucion.contrasena) - \(.solucion.metodo)"
        elif .solucion.descripcion then
            .solucion.descripcion
        elif .solucion.mecanica then
            .solucion.mecanica
        elif .solucion then
            (.solucion | to_entries | map("\(.key): \(.value)") | join("; "))
        else
            "Sin solución definida"
        end
    ' "$json_file")
    
    # Generar archivo MD
    cat > "$md_file" <<EOF
# ${nombre}

## ID
${id}

## Skill
${skill}

## Dificultad
${dificultad}/10

## Descripción
${descripcion}

## Tags
${tags}

## Solución
${solucion}
EOF
    
    if [ $? -eq 0 ]; then
        CONVERTIDOS=$((CONVERTIDOS + 1))
        echo "✓ $filename"
    else
        ERRORES=$((ERRORES + 1))
        ERROR_FILES="$ERROR_FILES $filename"
        echo "✗ Error en: $filename"
    fi
done

echo ""
echo "=== RESUMEN ==="
echo "Archivos convertidos: $CONVERTIDOS"
echo "Errores: $ERRORES"
if [ -n "$ERROR_FILES" ]; then
    echo "Archivos con error:$ERROR_FILES"
fi
