# Research Commands for Design

Same pattern as Conceive. Additional design-specific commands:

```bash
# Search by specific mechanic (for design decisions)
python3 scripts/search-games.py --puzzles --mechanic "{skill_deseado}" --pretty

# Search by difficulty range
python3 scripts/search-games.py --puzzles --difficulty {min}-{max} --pretty

# List available categories (for mechanic variety)
python3 scripts/search-games.py --puzzles --list-categories --pretty

# View full game with playtests
python3 scripts/search-games.py --game "el-legado-de-la-familia" --pretty

# Recent mechanics (avoid repetition)
python3 scripts/search-games.py --recent-mechanics --pretty
```

## Calibration Data to Extract

From real games:
- **Mechanics per game**: Which skills used as primary, how combined
- **Difficulty curve**: Per-puzzle difficulty, confirmed by playtests
- **Real times**: Estimated vs actual (if playtest data available)
- **Closures**: Type per puzzle, variety check
- **Playtest lessons**: Which puzzles were faster/slower than expected

## Validation Scripts

```bash
# Verify progressive difficulty curve
cat {output_dir}/DESIGN.json | jq '.curva_dificultad' | \
  python3 -c "
import sys, json
curve = json.load(sys.stdin)
for i in range(1, len(curve)):
    if curve[i] < curve[i-1]:
        print(f'ERROR: dificultad baja en posición {i}: {curve[i-1]} → {curve[i]}')
        sys.exit(1)
print('Curva OK: progresiva')"

# Verify max 2 per skill
cat {output_dir}/DESIGN.json | jq -r '.pruebas_seleccionadas[].skill_primario' | \
  sort | uniq -c | awk '$1 > 2 {print "ERROR: " $2 " aparece " $1 " veces (máx 2)"}'

# Verify synthesis classification
cat {output_dir}/DESIGN.json | jq '.pruebas_seleccionadas[].source' | \
  sort | uniq -c
```
