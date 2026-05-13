# Solvability Trace Examples

## Example 1: PASS — Prueba con tablero lógico (P1 El Legado)

```json
{
  "solvability_trace": {
    "status": "pass",
    "details": "Todas las posiciones y el código se derivan completamente de los 7 testimonios accesibles. Los 2 no-hijos (Elena, M. Á.) tienen exclusión explícita.",
    "candidate_exclusion": {
      "total_candidates": 6,
      "required": 4,
      "exclusions": [
        {
          "candidate": "Elena",
          "excluded_by": "Instrucción del tablero: 'LOS CUATRO HIJOS DE RODRIGO Y ELENA' — Elena es la madre, no hija",
          "document_accessible": true
        },
        {
          "candidate": "M. Á.",
          "excluded_by": "Testimonio 7: 'M. Á. no lleva la sangre de Rodrigo. Llegó a la familia por otro camino.'",
          "document_accessible": true
        }
      ],
      "status": "pass — all non-candidates explicitly excluded"
    },
    "trace": [
      {
        "step": "Carmen = casilla 1 (tormenta)",
        "source": "Testimonio 5: 'Carmen fue testigo de la tormenta'",
        "accessible": true
      },
      {
        "step": "Elena aparece después de Carmen",
        "source": "Testimonio 2: 'Elena aparece... después de Carmen'",
        "accessible": true
      },
      {
        "step": "Marcos = casilla 3 (notario) y es el hijo mayor",
        "source": "Testimonio 1: 'El hijo mayor firmó ante el notario'",
        "accessible": true
      },
      {
        "step": "M.Á. = casilla 6 (estación)",
        "source": "Testimonio 3: 'M.Á. estuvo en la estación'",
        "accessible": true
      },
      {
        "step": "Elena = casilla 2 (entre Carmen=1 y Marcos=3)",
        "source": "Testimonio 2 + Testimonio 6 (Marcos inmediatamente después de Elena)",
        "accessible": true
      },
      {
        "step": "Miguel = casilla 4, Luis = casilla 5",
        "source": "Testimonio 4: 'Luis no estuvo antes que Miguel' + posiciones 4-5 restantes",
        "accessible": true
      },
      {
        "step": "Orden edad: Marcos > Carmen > Luis > Miguel",
        "source": "Testimonio 1 (Marcos=hijo mayor) + Testimonio 4 ('Luis, nacido entre Carmen y Miguel')",
        "accessible": true
      },
      {
        "step": "Código: posiciones de hijos en orden edad = 3,1,5,4 = 3154",
        "source": "Instrucción del tablero + traza anterior",
        "accessible": true
      }
    ],
    "gaps": []
  }
}
```

## Example 2: FAIL — Candidate exclusion missing (M. Á. bug)

```json
{
  "solvability_trace": {
    "status": "fail",
    "details": "Puzzle requires selecting 4 children from 6 names. Elena excluded by instruction. M. Á. has NO exclusion in any accessible document. Players must guess which of 5 remaining names are the 4 children.",
    "candidate_exclusion": {
      "total_candidates": 6,
      "required": 4,
      "exclusions": [
        {
          "candidate": "Elena",
          "excluded_by": "Instrucción del tablero: 'hijos de Rodrigo y Elena'",
          "document_accessible": true
        },
        {
          "candidate": "M. Á.",
          "excluded_by": "NINGÚN DOCUMENTO accesible excluye a M. Á. como hijo",
          "document_accessible": false
        }
      ],
      "status": "FAIL — M. Á. cannot be excluded by players"
    },
    "gaps": [
      {
        "missing_fact": "Exclusión explícita de M. Á. como hijo de Rodrigo y Elena",
        "needed_for": "Reducir 5 candidatos a 4 (los 4 hijos)",
        "current_source": "NINGUNO — Testimonio 7 dice 'cuatro hijos' pero no nombra a M. Á.",
        "fix": "Cambiar Testimonio 7 para descartar a M. Á. directamente: 'M. Á. no lleva la sangre de Rodrigo. Llegó a la familia por otro camino.'"
      }
    ]
  }
}
```

## Example 3: FAIL — Circular dependency (bug original P1)

```json
{
  "solvability_trace": {
    "status": "fail",
    "details": "El orden de edad Marcos>Carmen>Luis>Miguel NO es deducible de los testimonios accesibles. El Testimonio 4 original solo decía 'Luis no estuvo antes que Miguel' — no menciona orden de nacimiento. Las cartas familiares (que confirman edades) están DENTRO de la caja cerrada.",
    "trace": [
      {
        "step": "Marcos = hijo mayor ✓",
        "source": "Testimonio 1",
        "accessible": true
      },
      {
        "step": "Carmen > Luis > Miguel en edad",
        "source": "NINGÚN TESTIMONIO lo dice explícitamente. Cartas familiares dentro de la caja dicen 'tu hijo mayor' = Marcos, pero NO ordenan Carmen/Luis/Miguel.",
        "accessible": false
      }
    ],
    "gaps": [
      {
        "missing_fact": "Orden de nacimiento de Carmen, Luis y Miguel",
        "needed_for": "Formar código 3154 (posiciones de hijos del mayor al menor)",
        "current_source": "NINGUNO accesible",
        "fix": "Añadir info de nacimiento al Testimonio 4: 'Luis, nacido entre Carmen y Miguel...'"
      }
    ]
  }
}
```

## Example 3: FAIL — Solution leakage

```json
{
  "no_solution_leakage": {
    "status": "fail",
    "details": "El cartel de instrucciones fuera de la caja contiene la solución completa.",
    "leaks": [
      {
        "file": "01-cartel-instruccion.html",
        "issue": "El cartel dice 'Carmen=1, Marcos=3, Luis=5, Miguel=4' — es la solución completa",
        "fix": "Eliminar posiciones del cartel. Mantener solo la instrucción de compartir testimonios."
      }
    ]
  }
}
```

## Example 4: FAIL — Text divergence

```json
{
  "text_fidelity": {
    "status": "fail",
    "details": "El Testimonio 4 en el HTML generado difiere del JSON fuente.",
    "divergences": [
      {
        "file": "01-testimonios.html",
        "field": "Testimonio 4",
        "expected": "Luis, nacido entre Carmen y Miguel, no estuvo antes que Miguel en los eventos.",
        "actual": "Luis no estuvo antes que Miguel.",
        "severity": "CRITICAL — versión vieja sin fix de solvability"
      }
    ]
  }
}
```
