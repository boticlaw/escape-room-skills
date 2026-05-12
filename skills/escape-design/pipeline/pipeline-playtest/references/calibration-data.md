# Calibration Data

Source: `examples/real-games/el-legado-de-la-familia/juego/pruebas/playtest-report.json`

| Metric | Source | Use |
|--------|--------|-----|
| Average frustration by profile | `frustracion_final` per player | If real avg is 0-5, simulated profiles must not predict >10 |
| Hints requested by role | `frustracion_final` + `pistas_pedidas` | Calibrate how many hints each player type asks |
| Final energy average | `energia_final` | If real drops to 50-70%, profiles must reflect similar fatigue |
| Average fun | `diversion` | Target: simulated fun ≥ real fun of successful games |
| Real vs estimated time | Puzzle JSON duration vs real behavior | Calibrate time_delta per profile |

## Calibration Injection

```
## Datos de calibración de jugadores reales
{datos extraídos de playtest-report.json}

REGLAS DE CALIBRACIÓN:
- Frustración predicha: real ± 2
- Pistas pedidas: real ± 1
- Energía final: similar a real
- Diversión: target ≥ media real (~80)
- Time delta: similar tipo de puzzle → similar delta
```
