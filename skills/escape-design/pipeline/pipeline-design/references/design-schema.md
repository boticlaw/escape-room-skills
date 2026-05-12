# DESIGN.json Schema

```json
{
  "id": "design_{fecha}_{slug}",
  "concept_ref": "concept_id",
  "dual_llm": true,
  "synthesis_sources": {
    "design_a": "designs/DESIGN-A.json",
    "design_b": "designs/DESIGN-B.json"
  },
  "pruebas_seleccionadas": [
    {
      "orden": 1,
      "prueba_ref": "EXISTENTE:prueba_xxx_001",
      "skill_primario": "prueba-xxx",
      "acto": 1,
      "duracion_minutos": 8,
      "dificultad": 2,
      "titulo_personalizado": "El portal olvidado",
      "conexion_narrativa": "Los jugadores descubren la entrada al templo",
      "tipo_cierre": "candado_4digitos|llave_fisica|cryptex|candado_letras",
      "codigo": "XXXX",
      "doble_descubrimiento": "Descripción de la segunda capa",
      "contenedor_narrativo": "cofre de madera|maleta antigua|carpeta...",
      "carta_navegacion": "Texto que guía a la siguiente prueba",
      "fragmento_misterio": "CA (sílaba, símbolo, fragmento...)",
      "jugadores_activos": "Cómo participan los 4-6 jugadores",
      "source": "confirmed|suspect_a|suspect_b|hybrid"
    }
  ],
  "flujo_tipo": "lineal",
  "flujo_descripcion": "Flujo lineal con 6 pruebas.",
  "curva_dificultad": [3, 4, 5, 5, 6, 4],
  "curva_justificacion": "Entrada suave → progresión → pico → recompensa",
  "misterio_secundario": "CATALINA VALENTO",
  "momentos_energia": [
    {"posicion": "inicio", "descripcion": "Reloj de arena + dramatismo del GM"},
    {"posicion": "final", "descripcion": "Luz violeta + sobre lacrado + frase épica"}
  ],
  "distribucion_cierres": {"candado_4digitos": 3, "llave_fisica": 1, "cryptex": 1, "candado_letras": 1},
  "tiempo_total_estimado": 55,
  "margen_seguridad_minutos": 5,
  "variedad_mecanicas": {"logica": 2, "exploracion": 1, "fisico": 1, "cripto": 1, "manipulacion": 1},
  "materiales_requeridos": [
    {"nombre": "Candado de combinación 4 dígitos", "tipo": "fisico", "cantidad": 1}
  ],
  "pistas_globales_gm": [
    {"nivel": 1, "trigger": "Atascados >5 min en prueba 1", "texto": "Fíjate en los símbolos repetidos del mapa"},
    {"nivel": 2, "trigger": "Atascados >10 min", "texto": "Cuenta las estrellas en cada esquina"},
    {"nivel": 3, "trigger": "Atascados >15 min", "texto": "El código es 3-1-4-2"}
  ],
  "pruebas_nuevas_requeridas": [],
  "synthesis_stats": {
    "confirmed": 3,
    "suspect_a": 1,
    "suspect_b": 2,
    "hybrid": 0
  }
}
```
