# La Biblioteca Maldita — Diseño de Juego

## Vista general

Juego de investigación (game-type-investigation) para 4 jugadores, 60 minutos, dificultad 5/10. Flujo de acumulación: los jugadores van reuniendo pistas que convergen en el clímax. 6 pruebas con curva de dificultad progresiva (3→8).

## Lista de pruebas (orden de ejecución)

| # | Prueba | Skill | Duración | Dificultad | Tipo | Acto |
|---|--------|-------|----------|------------|------|------|
| 1 | Las Notas Invisibles de Fogg | exploracion-visual | 8 min | 3 | EXISTENTE | I |
| 2 | El Libro Sin Título | investigacion-texto | 10 min | 4 | EXISTENTE | I |
| 3 | El Catálogo Alterado | emparejamiento-texto | 8 min | 5 | EXISTENTE | II |
| 4 | Los Cuarenta Años de Fogg | logica-secuencial | 10 min | 6 | EXISTENTE | II |
| 5 | El Código de los Estantes | logica-posiciones | 12 min | 7 | NUEVA | III |
| 6 | La Última Página | acrostico-ubicacion | 10 min | 8 | EXISTENTE | III |

**Distribución**: 5 existentes (83%) + 1 nueva (17%) ✅ (>50% existentes)
**Variedad mecánica**: 6 skills distintos, 0 repetidos ✅

## Flujo visual

```
[ENTRADA]
    │
    ▼
[1. Notas UV] ──→ [2. Libro Sin Título]
    (linterna)      (mensaje oculto)
                         │
                         ▼ nombre: Victor Shelley
                    [3. Catálogo Alterado] ◄──► [4. Diario de Fogg]
                    (emparejar fichas)          (ordenar cronológico)
                         │                            │
                         └──────────┬─────────────────┘
                                    ▼
                           [5. Estantería Cifrada]
                           (4 libros + candado)
                                    │
                                    ▼
                           [6. Acróstico Final]
                           (manuscrito + salida)
                                    │
                                    ▼
                               [¡ESCAPE!]
```

Las pruebas 3 y 4 se pueden trabajar parcialmente en paralelo. Las demás son secuenciales.

## Curva de dificultad

```
Dificultad
  8 |                                          ●  (6. Acróstico)
  7 |                                    ●     (5. Estantería)
  6 |                              ●           (4. Diario)
  5 |                        ●                 (3. Catálogo)
  4 |                  ●                       (2. Libro)
  3 |            ●                             (1. Notas UV)
  2 |
  1 |
    +----+----+----+----+----+----+----→ Tiempo
    0   10   20   30   40   50   60
```

Progresión: 3 → 4 → 5 → 6 → 7 → 8 ✅ (estrictamente creciente)

## Tiempos estimados

| Prueba | Tiempo | Buffer | Acumulado |
|--------|--------|--------|-----------|
| 1. Notas UV | 8 min | 2 min | 10 min |
| 2. Libro Sin Título | 10 min | 0 min | 20 min |
| 3. Catálogo Alterado | 8 min | 2 min | 30 min |
| 4. Diario de Fogg | 10 min | 0 min | 40 min |
| 5. Estantería Cifrada | 12 min | 0 min | 52 min |
| 6. Acróstico Final | 10 min | 0 min | 62 min |
| **Total** | **58 min** | **4 min buffer** | **62 min** |

Margen de seguridad: 2 minutos por debajo del límite de 60 min. Ajustar si los jugadores van rápidos.

## Pistas para el GM

| Prueba | Nivel 1 (>5 min) | Nivel 2 (>10 min) | Nivel 3 (>15 min) |
|--------|-------------------|--------------------|--------------------|
| 1. Notas UV | "Revisad el cajón superior" | "Usad la linterna con las notas" | "Los mensajes UV dicen: 'MIRAD PRIMERA LETRA'" |
| 2. Libro | "El libro tiene párrafos numerados" | "Las primeras letras de 6 párrafos" | "El nombre es: VICTOR SHELLEY" |
| 3. Catálogo | "Las fichas con marca roja" | "Emparejad por autor y año" | — |
| 4. Diario | "Buscad fechas en los fragmentos" | "Ordenad de 1986 a 2026" | — |
| 5. Estantería | "La línea temporal da los números" | "Cada década = un estante" | "Código: 7294" |
| 6. Acróstico | "Primera letra de cada línea" | "Las letras verticales" | — |

## Notas de implementación

- La linterna UV debe tener pilas nuevas (testear antes)
- Las notas con tinta UV deben escribirse con marcador UV dedicado (no cualquier rotulador)
- El libro sin título debe parecer genuinamente antiguo (encuadernación de cuero o similar)
- Los fragmentos del diario deben estar bien distribuidos entre libros diferentes (no todos juntos)
- La estantería con candado debe ser móvil o tener un mecanismo de apertura real
- El acróstico final debe ser legible pero no obvio — considerar fuente antigua
- El audio de Elena Voss puede ser un reproductor MP3 con altavoces ocultos
