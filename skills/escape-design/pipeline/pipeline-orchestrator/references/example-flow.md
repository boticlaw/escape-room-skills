# Example Flow

```
Daniel: "Crea un escape room de piratas para niños 8-10 años"

1. LEER PROGRESS.json → No existe → Crear nuevo
2. INICIO → "Voy a crear un escape room de piratas. Pipeline dual-LLM en 4 fases."
3. RESOLVE → RESOLVED_STANDARDS.json → GUARDAR
4. EXPLORE → BRIEF.json generado → GUARDAR → Gate: continue
   → "Brief: 4-6 jugadores, 60min, dificultad media, puzzles adaptados a 8-10 años"
5. CONCEIVE (dual) → GLM-5.1 genera CONCEPT-A, GPT-5.5 genera CONCEPT-B → síntesis
   → Checks CONCEIVE: ✅ equipo activo, ✅ físico>digital, ✅ doble descubrimiento...
   → GUARDAR PROGRESS.json
   → "🎮 El Tesoro del Capitán Calavera / '¿Podrás encontrar el oro antes de que el barco se hunda?' / Los jugadores son grumos que deben encontrar el tesoro escondido antes de que el barco zozobre."
6. DESIGN (dual) → GLM-5.1 diseña lógicos, GPT-5.5 diseña experienciales → síntesis
   → Checks DESIGN: ✅ 2 fases/prueba, ✅ contenedores narrativos, ✅ pistas 3 niveles...
   → GUARDAR PROGRESS.json
   → "5 pruebas: 2 existentes (adaptadas), 3 nuevas. 3 confirmed, 1 suspect_A, 1 suspect_B."
7. NARRATIVE CONSISTENCY → pass → GUARDAR
8. DIFFICULTY CALIBRATION → pass_with_adjustments → GUARDAR
9. BUILD → juegos/el-tesoro-del-capitan-calavera/ → GUARDAR
10. PLAYTEST (dual) → GLM-5.1 simula 3 analíticos, GPT-5.5 simula 3 experienciales → cruce
    → GUARDAR PROGRESS.json
    → "✅ pass — 0 critical, 2 warnings, 1 divergencia."
11. VERIFY → Checks VERIFY completos → VERIFY-REPORT.json → verdict: pass
    → GUARDAR PROGRESS.json
    → "⚠️ Warning: Puzzle 3 podría ser confuso sin pistas claras. No bloqueante."
12. JUDGMENT (dual) → GLM-5.1 + GPT-5.5 evalúan completo → síntesis
    → GUARDAR PROGRESS.json
    → "Juicio dual: GLM-5.1 (8.5/10 approved) + GPT-5.5 (8.2/10 approved) → ✅ ENTREGAR"
13. FINAL → "Juego completo en juegos/el-tesoro-del-capitan-calavera/. PDF generado."
```
