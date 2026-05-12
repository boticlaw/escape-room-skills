# Ejemplos — Comunicacion de Mensajes

## Ejemplo 1: Codigo Morse — Operacion Rescate

**Contexto:** Escape de espias. Contactar cuartel general enviando ubicacion.

```json
{
  "tipo_codigo": "morse",
  "longitud_mensaje": 8,
  "separacion_equipos": false,
  "modalidad_comunicacion": "auditiva",
  "diccionario_proporcionado": true,
  "requiere_transmision": true
}
```

**Flujo:** Encuentran diccionario + linterna → escuchan morse (SOS) → descifran "SALA-317" → transmiten "OK" con linterna → se abre puerta.

**Pistas:** 1)"Puntos y rayas, cada combinacion es una letra" 2)"Espacios largos separan palabras" 3)"S=..., O=---"

## Ejemplo 2: Banderas Nauticas — Equipos Separados

**Contexto:** Street escape maritimo. Dos equipos en embarcaciones diferentes.

```json
{
  "tipo_codigo": "banderas_nauticas",
  "longitud_mensaje": 10,
  "separacion_equipos": true,
  "modalidad_comunicacion": "visual",
  "diccionario_proporcionado": true
}
```

**Flujo:** Equipo A ve banderas con binoculares → Equipo B las levanta → Equipo A consulta diccionario → Descifran "ANCLAJE-NORTE".

**Pistas:** 1)"Cada bandera = una letra" 2)"Usen binoculares" 3)"Dos palabras: algo que se echa al mar + una direccion"

## Ejemplo 3: Semaforo — Granja de Inteligencia

```json
{
  "tipo_codigo": "semaforo",
  "longitud_mensaje": 6,
  "separacion_equipos": false,
  "modalidad_comunicacion": "visual",
  "diccionario_proporcionado": true,
  "pistas_diccionario": 6
}
```

**Flujo:** Video de alguien haciendo senales con banderas → Poster con diccionario parcial (6 letras) → Mensaje usa solo esas letras → Descifran "ESTOES" → Encuentran mas diccionario → Mensaje completo "ESTOES-CLAVE".

## Ejemplo 4: Deduccion de Codigo — Arqueologos

```json
{
  "tipo_codigo": "personalizado",
  "longitud_mensaje": 8,
  "separacion_equipos": false,
  "modalidad_comunicacion": "visual",
  "diccionario_proporcionado": false,
  "pistas_diccionario": 3
}
```

**Flujo:** Pared con simbolos + 3 pistas (▲=A, estatua "DIOS" con simbolos debajo, mapa con coordenadas) → Deducen sistema geometrico → Descifran "DIOS-SALVA".

**Pistas:** 1)"Simbolos = letras, usen pistas para mapear" 2)"La estatua dice DIOS..." 3)"Frase religiosa conocida"

## Sinergias con Otros Skills

- `prueba-busqueda-objetos`: Diccionario/mensaje oculto en objetos
- `prueba-punteria-derribo`: Derribar objetos revela letras/diccionario
- `prueba-logica-secuencial`: Mensaje descifrado = secuencia para otro puzzle
- `prueba-panel-electrico`: Mensaje indica conexiones del panel
- `prueba-tablet-cooperativo`: Tablets para transmitir mensajes entre equipos

## Alternativas

- `prueba-interpretacion-texto` → Si requiere interpretar metaforas, no decodificacion
- `prueba-rompecabezas-visual` → Si es reconocer patrones sin codigo
