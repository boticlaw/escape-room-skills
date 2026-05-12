# Concrete Puzzle Examples

## Example 1: Morse Code — Operation Rescue

**Context**: Spy escape. Players contact HQ sending their location.

**Config**: `tipo_codigo="morse"`, `longitud_mensaje=8`, `modalidad="auditiva"`, `diccionario_proporcionado=true`, `requiere_transmision=true`

**Flow**: Find morse dictionary + flashlight → hear morse radio message → decode "SALA-317" → transmit "OK" back with flashlight → door opens.

**Hints**:
1. "The code uses dots and dashes, each combination is a letter"
2. "Long spaces separate words, short ones separate letters"
3. "S is three dots (...), O is three dashes (---)"

## Example 2: Nautical Flags — Separated Teams

**Context**: Maritime survival street escape. Two teams on different vessels.

**Config**: `tipo_codigo="banderas_nauticas"`, `longitud_mensaje=10`, `separacion_equipos=true`, `modalidad="visual"`

**Flow**: Team A on terrace with binoculars sees Team B raising flags. Team B has flag set + written message. Team A has dictionary book. Decode "ANCLAJE-NORTE".

## Example 3: Semaphore — Intelligence Farm

**Context**: Military training hall escape. Intercept enemy message.

**Config**: `tipo_codigo="semaforo"`, `longitud_mensaje=6`, `pistas_diccionario=6`

**Flow**: Screen shows video of semaphore signals. Poster has partial dictionary (6 letters: A, E, I, O, S, T). Decode "ESTOES" → find more dictionary parts → full message "ESTOES-CLAVE".

## Example 4: Code Deduction — Archaeologists

**Context**: Ancient ruins investigation. Unknown code, no dictionary.

**Config**: `tipo_codigo="personalizado"`, `longitud_mensaje=8`, `diccionario_proporcionado=false`, `pistas_diccionario=3`

**Flow**: Wall with symbols "▲▼■▲ ■▼▲■" + 3 clues (▲=A from table, DIOS word with symbols, map with square numbers 1,4,9). Deduce geometric system → decode "DIOS-SALVA".

**Hints**:
1. "Symbols represent letters, use clues to map them"
2. "The statue says DIOS with symbols underneath..."
3. "The complete message is a known religious phrase"
