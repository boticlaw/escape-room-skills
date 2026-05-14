#!/usr/bin/env bash
#
# validate-schema.sh — Validate escape room JSON files
#
# Usage:
#   bash scripts/validate-schema.sh <game-directory>
#
# Validates:
#   1. juego.json exists and is valid JSON
#   2. Each prueba file referenced in juego.json exists and is valid JSON
#   3. All JSON files parse with python3 json.tool
#
# Requirements: python3

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCHEMAS_DIR="$(dirname "$SCRIPT_DIR")/schemas"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

pass=0
fail=0

check() {
  local description="$1"
  local result="$2"
  if [ "$result" -eq 0 ]; then
    echo -e "  ${GREEN}✓${NC} $description"
    ((pass++))
  else
    echo -e "  ${RED}✗${NC} $description"
    ((fail++))
  fi
}

# --- Argument check ---
if [ $# -lt 1 ]; then
  echo "Usage: bash scripts/validate-schema.sh <game-directory>"
  echo ""
  echo "Example:"
  echo "  bash scripts/validate-schema.sh ./examples"
  exit 1
fi

GAME_DIR="$(cd "$1" && pwd)"

echo "=== Escape Room Schema Validation ==="
echo "Game directory: $GAME_DIR"
echo ""

# --- Check juego.json ---
echo "Validating juego.json..."

GAME_FILE="$GAME_DIR/juego.json"
if [ ! -f "$GAME_FILE" ]; then
  # Try finding any juego*.json
  GAME_FILE=$(find "$GAME_DIR" -maxdepth 1 -name 'juego*.json' -type f | head -1)
fi

if [ -z "$GAME_FILE" ] || [ ! -f "$GAME_FILE" ]; then
  echo -e "  ${RED}✗${NC} No juego.json found in $GAME_DIR"
  ((fail++))
  exit 1
fi

# Validate JSON syntax
python3 -m json.tool "$GAME_FILE" > /dev/null 2>&1
check "juego.json is valid JSON" $?

# Check required fields
for field in nombre tipo jugadores_min jugadores_max duracion_minutos dificultad; do
  if python3 -c "
import json, sys
with open('$GAME_FILE') as f:
    data = json.load(f)
if '$field' not in data:
    sys.exit(1)
# Check nested jugador fields
if '$field' == 'jugadores':
    for k in ['min', 'max', 'optimo']:
        if k not in data['jugadores']:
            sys.exit(1)
" 2>/dev/null; then
    check "juego.json has field: $field" 0
else
    check "juego.json has field: $field" 1
fi
done

echo ""

# --- Validate prueba files ---
echo "Validating prueba files..."

# Extract prueba file list from game.json
PRUEBA_FILES=$(python3 -c "
import json
with open('$GAME_FILE') as f:
    data = json.load(f)
for p in data.get('pruebas', []):
    print(p.get('archivo', ''))
" 2>/dev/null || echo "")

if [ -z "$PRUEBA_FILES" ]; then
  echo -e "  ${YELLOW}⚠${NC} No prueba files referenced in juego.json"
else
  while IFS= read -r prueba; do
    [ -z "$prueba" ] && continue
    PRUEBA_PATH="$GAME_DIR/$prueba"

    if [ ! -f "$PRUEBA_PATH" ]; then
      # Check in same directory as game.json
      PRUEBA_PATH="$GAME_DIR/$(basename "$prueba")"
    fi

    if [ ! -f "$PRUEBA_PATH" ]; then
      echo -e "  ${RED}✗${NC} Missing file: $prueba"
      ((fail++))
      continue
    fi

    # Validate JSON syntax
    python3 -m json.tool "$PRUEBA_PATH" > /dev/null 2>&1
    check "$prueba is valid JSON" $?

    # Check required prueba fields
    for field in id nombre descripcion skill_primario dificultad duracion_estimada_minutos configuracion pistas solucion materiales; do
      if python3 -c "
import json, sys
with open('$PRUEBA_PATH') as f:
    data = json.load(f)
if '$field' not in data:
    sys.exit(1)
" 2>/dev/null; then
        check "$prueba has field: $field" 0
      else
        check "$prueba has field: $field" 1
      fi
    done
    echo ""
  done <<< "$PRUEBA_FILES"
fi

# --- Summary ---
echo "=== Summary ==="
echo -e "  ${GREEN}Passed: $pass${NC}"
if [ "$fail" -gt 0 ]; then
  echo -e "  ${RED}Failed: $fail${NC}"
  exit 1
else
  echo -e "  Failed: $fail"
fi
echo ""
echo "All validations passed!"
