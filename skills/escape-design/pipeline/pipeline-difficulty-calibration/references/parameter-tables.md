# Parameter Tables

## Age Profile (base levels)

| Range | Level | Notes |
|-------|-------|-------|
| 8-11 | Very easy (1-3) | Physical only, no complex ciphers |
| 12-14 | Easy-Mid (2-4) | Simple ciphers (A=1), physical + basic logic |
| 15-17 | Mid (3-6) | Standard ciphers, deduction, multi-layer |
| 18-25 | Mid-High (4-7) | Complex ciphers, advanced logic, abstract |
| 26-40 | Mid (3-6) | More patience for long puzzles |
| 40+ | Mid (3-5) | Prefer clear logical, less frustration tolerance |

## Experience Multiplier

| Experience | Multiplier |
|------------|-----------|
| Never played | ×0.7 |
| 1-3 rooms | ×0.85 |
| 4-10 rooms | ×1.0 |
| +10 rooms | ×1.2 |

## Group Size Adjustment

| Size | Effect on max params |
|------|---------------------|
| 2 | +1 |
| 3-4 | 0 (base) |
| 5-6 | -1 |
| 7+ | -2 |

## Base Levels by Age × Parameter

| Parameter | 8-11 | 12-14 | 15-17 | 18-25 | 26-40 | 40+ |
|-----------|------|-------|-------|-------|-------|-----|
| cognitive_load | 2 | 4 | 5 | 7 | 6 | 5 |
| physical_complexity | 3 | 4 | 5 | 6 | 5 | 4 |
| lateral_thinking | 1 | 3 | 4 | 6 | 5 | 4 |
| info_integration | 2 | 3 | 5 | 7 | 6 | 5 |
| time_pressure | 2 | 3 | 4 | 6 | 5 | 4 |
| cooperation_required | 3 | 4 | 5 | 6 | 6 | 5 |

## Max Puzzle Time by Age

| Age | Max min/puzzle |
|-----|---------------|
| 8-11 | 6 |
| 12-14 | 8 |
| 15-17 | 10 |
| 18-25 | 12 |
| 26-40 | 12 |
| 40+ | 10 |

**Recommended total puzzles** = `total_duration / max_puzzle_time` (round, min 4, max 8).

## Recommended Hints per Puzzle

| Experience | Hints/puzzle |
|------------|-------------|
| Never | 2-3 |
| 1-3 rooms | 1-2 |
| 4-10 rooms | 1 |
| +10 rooms | 0-1 |

## Real Game Calibration Data

| Game | Target | Real Curve | Playtest Result |
|------|--------|-----------|----------------|
| El Legado de la Familia | 4/10 | 3→4→4→5→4→3 | ✅ Fun 80, Frustration 0-5 |
| Legado Tinta Violeta | 4/10 | 3→3→4→5→5→4→3 | ✅ v4.1 stable |
| Protocolo Alerta Verde | 4/10 | (see puzzle JSONs) | ✅ Complete |
