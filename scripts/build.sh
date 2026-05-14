#!/usr/bin/env bash
# === BUILD — Pipeline completo de escape room ===
# Valida schemas → Valida sincronización → Genera PDF
#
# Uso:
#   bash build.sh <game.json> [--skip-pdf] [--skip-review]
#   bash build.sh                     # busca game.json en dir actual
#
# Flags:
#   --skip-pdf      Solo valida, no genera PDF
#   --skip-review   Skip LLM adversarial review
#   --playtest N    Ejecutar playtest simulado con N jugadores

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKIP_PDF=false
SKIP_REVIEW=false
PLAYTEST_MODE=false
PLAYTEST_LLM=false
BUMP_MODE=""
BUMP_DESC=""

# Parse args
POSITIONAL=()
i=0
while [ $i -lt $# ]; do
    arg="${!i}"
    case "$arg" in
        --skip-pdf)    SKIP_PDF=true ;;
        --skip-review) SKIP_REVIEW=true ;;
        --bump)        BUMP_MODE="auto" ;;
        --bump-patch)  BUMP_MODE="patch" ;;
        --bump-minor)  BUMP_MODE="minor" ;;
        --playtest)
            PLAYTEST_MODE=true
            j=$((i + 1))
            next="${!j:-}"
            if [[ "$next" =~ ^[0-9]+$ ]]; then
                DO_PLAYTEST="$next"
                i=$((i + 1))
            fi
            ;;
        --playtest=*)  PLAYTEST_MODE=true; DO_PLAYTEST="${arg#*=}" ;;
        --playtest-llm) PLAYTEST_LLM=true ;;
        *)             POSITIONAL+=("$arg") ;;
    esac
    i=$((i + 1))
done
DO_PLAYTEST="${DO_PLAYTEST:-5}"

# Capture bump description (last positional arg after game.json)
if [[ ${#POSITIONAL[@]} -ge 2 ]]; then
    BUMP_DESC="${POSITIONAL[-1]}"
    unset 'POSITIONAL[-1]'
fi

if [[ ${#POSITIONAL[@]} -ge 1 && "${POSITIONAL[0]}" != "--" ]]; then
    GAME_JSON="$(cd "$(dirname "${POSITIONAL[0]}")" && pwd)/$(basename "${POSITIONAL[0]}")"
else
    GAME_JSON="$(pwd)/game.json"
fi

if [[ ! -f "$GAME_JSON" ]]; then
    echo "❌ No se encontró: $GAME_JSON"
    exit 1
fi

echo "╔══════════════════════════════════════════════════════╗"
echo "║  ESCAPE ROOM BUILD PIPELINE                        ║"
echo "╚══════════════════════════════════════════════════════╝"
echo "Game: $GAME_JSON"
echo ""

# ─── Step 0: Version bump (optional) ──────────────────────────────────────────
if [[ -n "$BUMP_MODE" ]]; then
    echo "📦 [0/5] Bumping version ($BUMP_MODE)..."
    if [[ -n "$BUMP_DESC" ]]; then
        python3 "$SCRIPT_DIR/bump-version.py" "$GAME_JSON" "--$BUMP_MODE" "$BUMP_DESC"
    else
        python3 "$SCRIPT_DIR/bump-version.py" "$GAME_JSON" "--$BUMP_MODE" "Auto bump"
    fi
    echo ""
fi

# ─── Step 1: Schema validation ──────────────────────────────────────────────
echo "📋 [1/5] Validando schemas JSON..."
if bash "$SCRIPT_DIR/validate-schema.sh" "$GAME_JSON"; then
    echo "✅ Schemas OK"
else
    echo "❌ Schema validation FAILED — corrige los errores antes de continuar"
    exit 1
fi
echo ""

# ─── Step 2: Sync validation ────────────────────────────────────────────────
echo "🔍 [2/5] Validando sincronización..."
if bash "$SCRIPT_DIR/validar-sincronizacion.sh" "$GAME_JSON"; then
    echo "✅ Sincronización OK"
else
    echo "❌ Sincronización FAILED — corrige las diferencias antes de continuar"
    exit 1
fi
echo ""

# ─── Step 3: Design validation ─────────────────────────────────────────────
echo "📐 [3/5] Validando diseño de pruebas..."
# Detectar directorio de pruebas (juego/pruebas/ o pruebas/)
PRUEBAS_DIR_DESIGN="$(dirname "$GAME_JSON")/juego/pruebas"
if [ ! -d "$PRUEBAS_DIR_DESIGN" ]; then
    PRUEBAS_DIR_DESIGN="$(dirname "$GAME_JSON")/pruebas"
fi
if [ -d "$PRUEBAS_DIR_DESIGN" ]; then
    python3 "$SCRIPT_DIR/validate-design.py" "$PRUEBAS_DIR_DESIGN"
    DESIGN_EXIT=$?
else
    echo "⚠️  No se encontró directorio de pruebas, saltando"
    DESIGN_EXIT=0
fi
if [ $DESIGN_EXIT -eq 1 ]; then
    echo "❌ Diseño FAILED — hay errores CRITICAL que corregir antes de continuar"
    exit 1
elif [ $DESIGN_EXIT -gt 1 ]; then
    echo "❌ Error ejecutando validate-design.py"
    exit 1
else
    echo "✅ Diseño OK"
fi
echo ""

# ─── Step 3.1: Game integrity (cross-file checks) ─────────────────────────
echo "🔗 [3.1/5] Validando integridad del juego (cross-file)..."
python3 "$SCRIPT_DIR/validate-game-integrity.py" "$GAME_JSON"
INTEGRITY_EXIT=$?
if [ $INTEGRITY_EXIT -eq 1 ]; then
    echo "❌ Integridad FAILED — recompensas, navegación o sync con juego.json tienen errores CRITICAL"
    exit 1
elif [ $INTEGRITY_EXIT -gt 1 ]; then
    echo "❌ Error ejecutando validate-game-integrity.py"
    exit 1
else
    echo "✅ Integridad OK"
fi
echo ""

# ─── Step 3.5: Playtest simulado (optional, before PDF) ───────────────────
if [ "$PLAYTEST_MODE" = "true" ]; then
    NUM_JUGADORES="${DO_PLAYTEST:-5}"
    echo "🎮 [3.5/5] Playtest simulado ($NUM_JUGADORES jugadores)..."
    python3 "$SCRIPT_DIR/playtest-simulado.py" "$GAME_JSON" --jugadores "$NUM_JUGADORES"
    PLAYTEST_EXIT=$?
    if [ $PLAYTEST_EXIT -ne 0 ]; then
        echo "❌ Playtest detectó problemas CRITICAL — corregir antes de generar PDF"
        exit 1
    fi
    echo "✅ Playtest OK"
    echo ""
fi

if [ "$PLAYTEST_LLM" = "true" ]; then
    echo "🧠 [3.6/5] Playtest LLM..."
    if python3 "$SCRIPT_DIR/playtest-llm.py" "$GAME_JSON"; then
        echo "✅ Playtest LLM OK"
    else
        LLM_EXIT=$?
        if [ $LLM_EXIT -eq 2 ]; then
            echo "⚠️  Playtest LLM no disponible, continuando..."
        elif [ $LLM_EXIT -eq 1 ]; then
            echo "❌ Playtest LLM detectó problemas CRITICAL"
            exit 1
        fi
    fi
    echo ""
fi

# ─── Step 4: Generate PDF ───────────────────────────────────────────────────
if $SKIP_PDF; then
    echo "⏭️  [5/5] PDF generation skipped (--skip-pdf)"
    echo ""
    echo "✅ BUILD COMPLETADO (validación solo)"
    exit 0
fi

# ─── Step 4: LLM adversarial review (optional, skip with --skip-review) ─────────────
echo "🧠 [4/5] Revisión adversarial LLM..."
PRUEBAS_DIR="$(dirname "$GAME_JSON")/juego/pruebas"
if [ ! -d "$PRUEBAS_DIR" ]; then
    PRUEBAS_DIR="$(dirname "$GAME_JSON")/pruebas"
fi
if [ "$SKIP_REVIEW" != "1" ] && [ -d "$PRUEBAS_DIR" ]; then
    if python3 "$SCRIPT_DIR/review-design.py" "$PRUEBAS_DIR"; then
        echo "✅ LLM Review OK"
    else
        REVIEW_EXIT=$?
        if [ $REVIEW_EXIT -eq 1 ]; then
            echo "❌ LLM Review encontró problemas CRITICAL"
            exit 1
        elif [ $REVIEW_EXIT -eq 0 ]; then
            echo "✅ LLM Review OK"
        else
            echo "⚠️  LLM Review no disponible, continuando..."
        fi
    fi
elif [ "$SKIP_REVIEW" = "1" ]; then
    echo "⏭️  [4/5] LLM Review skipped (--skip-review)"
else
    echo "⏭️  [4/5] LLM Review skipped (no pruebas dir)"
fi
echo ""

# ─── Step 5: Generate PDF ───────────────────────────────────────────────────
echo "📄 [5/5] Generando PDF..."
GAME_DIR="$(dirname "$GAME_JSON")"
node "$SCRIPT_DIR/escape-pdf-generator.mjs" "$GAME_JSON" --skip-sync

echo ""
echo "✅ BUILD COMPLETADO"


