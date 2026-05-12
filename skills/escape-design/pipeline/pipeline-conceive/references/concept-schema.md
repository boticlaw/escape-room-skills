# CONCEPT.json Schema

```json
{
  "id": "concept_{YYYY-MM-DD}_{tematica_slug}",
  "brief_ref": "brief_id_del_brief_original",
  "dual_llm": true,
  "synthesis_sources": {
    "concept_a": "concepts/CONCEPT-A.json",
    "concept_b": "concepts/CONCEPT-B.json"
  },
  "titulo": "string (≤5 words, evocativo)",
  "tagline": "string",
  "premisa": "string (2-3 frases)",
  "gancho": "string (lo que ven al entrar)",
  "actos": [
    {
      "numero": 1,
      "nombre": "string",
      "duracion_minutos": 15,
      "emocion_objetivo": "string"
    }
  ],
  "personajes": [
    {
      "nombre": "string",
      "rol": "string",
      "descripcion_breve": "string"
    }
  ],
  "flujo_recomendado": "lineal|acumulacion|cadenas_paralelas",
  "atmosfera": {
    "iluminacion": "string",
    "sonido": "string",
    "elementos_sensoriales": "string"
  },
  "tono": "string (una palabra)"
}
```

## Example

```json
{
  "id": "concept_2026-04-06_hospital_abandonado",
  "brief_ref": "brief_2026-04-06_horror_medico",
  "dual_llm": true,
  "synthesis_sources": {
    "concept_a": "concepts/CONCEPT-A.json",
    "concept_b": "concepts/CONCEPT-B.json"
  },
  "titulo": "Pabellón 7",
  "tagline": "La última operación nunca terminó.",
  "premisa": "En 1983, el pabellón 7 del Hospital San Miguel fue clausurado tras la desaparición del Dr. Vega y tres pacientes. Ahora, 40 años después, una filtración en el sótano ha revelado pasillos que no aparecen en ningún plano.",
  "gancho": "Al entrar, los jugadores ven una sala de espera intacta de los años 80 con tres sillas vacías y un televisor encendido en estática. En la pared, escritos a mano: 'No salgan del pabellón después de las 10.'",
  "actos": [
    {"numero": 1, "nombre": "La Llegada", "duracion_minutos": 15, "emocion_objetivo": "inquietud"},
    {"numero": 2, "nombre": "Los Expedientes", "duracion_minutos": 20, "emocion_objetivo": "curiosidad escalofriante"},
    {"numero": 3, "nombre": "El Quirófano", "duracion_minutos": 20, "emocion_objetivo": "tensión extrema"},
    {"numero": 4, "nombre": "Salida", "duracion_minutos": 10, "emocion_objetivo": "alivio con resaca"}
  ],
  "personajes": [
    {"nombre": "Dr. Vega", "rol": "antagonista ausente", "descripcion_breve": "Cirujano jefe que desapareció. Sus notas aparecen por toda la sala."},
    {"nombre": "Enfermera Ruiz", "rol": "guía fantasma", "descripcion_breve": "Aparece en grabaciones de audio fragmentadas dando pistas."}
  ],
  "flujo_recomendado": "lineal",
  "atmosfera": {
    "iluminacion": "Luz fluorescente parpadeante, zonas de penumbra casi total",
    "sonido": "Zumbido eléctrico constante, pitidos de monitor cardíaco esporádicos",
    "elementos_sensoriales": "Olor a formaldehído, texturas de metal frío, temperatura baja"
  },
  "tono": "tenso"
}
```
