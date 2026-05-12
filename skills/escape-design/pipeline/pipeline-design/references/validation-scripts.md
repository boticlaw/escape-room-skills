# Validation Scripts

Quick validation commands for DESIGN.json:

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
