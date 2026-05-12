# Referencia — Busqueda de Objetos

## Variables

| Variable | Tipo | Rango | Default |
|----------|------|-------|---------|
| `numero_objetos` | number | 2-10 | 5 |
| `tipo_ocultamiento` | string | "camuflaje" \| "escondido" \| "disperso" \| "mixto" | "disperso" |
| `pistas_disponibles` | boolean | - | true |
| `formato_pistas` | string | "lista" \| "imagenes" \| "descripciones" \| "ninguno" | "lista" |
| `objetivo_final` | string | "coleccion" \| "ensamblaje" \| "acceso" | "coleccion" |

**camuflaje:** `objeto_camuflaje`(string), `dificultad_visual`(1-10)
**escondido:** `ubicaciones`(array), `accesibilidad`("facil"|"medio"|"requiere_herramienta")
**disperso:** `area_busqueda`("sala"|"edificio"|"exterior"|"multiple"), `distancia_maxima`(m)

Opcionales: `orden_importa`(bool), `tiempo_limite`, `objetos_decoy`(number), `feedback_parcial`(bool)

## Errores Comunes

1. **Busqueda no sistematica:** Revisitan sitios. **Intervencion:** "Dividir la sala en zonas"
2. **Ignorar decorativos:** Pasan por alto props. **Intervencion:** "Nada es solo decorativo en un escape"
3. **Fijacion en una zona:** No exploran resto. **Intervencion:** "Revisasteis las otras zonas?"

**Senales:** >5 min sin encontrar ninguno, revisan mismo lugar 3+, discuten si "ya encontraron todo".
**Tiempo maximo:** 8-10 min.

## Adaptaciones

**Ninos:** Objetos grandes/coloridos, ocultamientos evidentes, lista con imagenes, sin decoy.
**Hall:** Objetos fijos en decorado, feedback centralizado.
**Street:** Ubicaciones reales (estatuas, bancos), GPS/QR para validar.
**Investigacion:** Formato evidencia, "escena del crimen" con items forenses.

## Ejemplos

**Evidencias del crimen:** 5 objetos dispersos (carta, veneno, foto, cuenta bancaria, llave) → acusar al culpable.
**Fragmentos del mapa:** 6 fragmentos mixtos (camuflaje detras de cuadro, dentro de botella, en baul) → ensamblar mapa con coordenadas.
