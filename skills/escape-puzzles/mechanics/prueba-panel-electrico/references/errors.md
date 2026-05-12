# Errores — Panel Electrico

## Error 1: Conexion aleatoria sin sistema
Conectan "a ver si funciona" sin buscar patron. **Intervencion (5 min):** "Fijaros si hay diagrama que indique el orden"

## Error 2: Fijarse solo en una variable
Cables bien pero no interruptores, o viceversa. **Intervencion:** "Revisad tambien los interruptores, todo debe estar correcto"

## Error 3: Sobre-analisis interruptores posicionales
Gastan tiempo en posicionales ignorando cables. **Intervencion (>7 min):** "Quizas deberiais empezar por los cables"

## Error 4: No detectar que funciona parcialmente
Creen que fallaron pero estaban cerca. **Prevencion:** `feedback_progresivo=true` con LEDs. **Intervencion:** "Estais cerca, revisad la ultima conexion"

## Senales de alarma
- 5+ configuraciones sin sistema logico
- Discuten si "el orden importa"
- Ignoran completamente un componente
- Piden ayuda explicita
- >10 min sin progreso

**Tiempo maximo:** 8 min (6 novatos, 12 expertos)
