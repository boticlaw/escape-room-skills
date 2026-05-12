#!/usr/bin/env python3
"""Playtest simulado con agentes con personalidad para Escape Room.

Simula un equipo de jugadores con personalidades recorriendo un juego completo.
Determinista, sin dependencias externas, solo stdlib.
"""

import json
import os
import sys
import random
import hashlib
from dataclasses import dataclass, field
from typing import Optional

# ─── Colores ANSI ───
C = {
    "reset": "\033[0m", "bold": "\033[1m", "dim": "\033[2m",
    "red": "\033[91m", "green": "\033[92m", "yellow": "\033[93m",
    "blue": "\033[94m", "magenta": "\033[95m", "cyan": "\033[96m",
}

def c(color: str, text: str) -> str:
    return f"{C.get(color, '')}{text}{C['reset']}"

# ─── Plantillas de personalidades ───
ROLES = {
    "líder": {
        "emoji": "👑",
        "comprehension": 0.75,
        "time_mult": 0.85,       # organiza → más rápido
        "hint_threshold": 0.55,   # pide pistas tarde
        "frustration_rate": 0.6,
        "strengths": ["organización", "comunicación"],
        "weaknesses": ["impaciencia con lentos", "dominancia"],
        "narrative_tropes": [
            "{name} tomó el mando y repartió tareas",
            "{name} coordinó al equipo desde el centro de la sala",
            "{name} propuso una estrategia que funcionó",
            "{name} se frustró porque nadie le escuchaba",
        ],
    },
    "analítico": {
        "emoji": "🧠",
        "comprehension": 0.92,
        "time_mult": 1.15,       # lee todo → más lento
        "hint_threshold": 0.75,   # casi nunca pide pistas
        "frustration_rate": 0.4,
        "strengths": ["atención al detalle", "resolución lógica"],
        "weaknesses": ["lentitud", "análisis parálisis"],
        "narrative_tropes": [
            "{name} leyó cada detalle antes de actuar",
            "{name} encontró la clave que todos pasaron por alto",
            "{name} estuvo 2 minutos en silencio estudiando los documentos",
            "{name} resolvió el puzzle solo mientras los demás miraban",
        ],
    },
    "impaciente": {
        "emoji": "⚡",
        "comprehension": 0.55,
        "time_mult": 0.80,       # salta pasos → a veces rápido
        "hint_threshold": 0.30,   # pide pistas muy pronto
        "frustration_rate": 0.85,
        "strengths": ["iniciativa", "ensayo y error rápido"],
        "weaknesses": ["fuerza bruta", "saltar pasos", "frustración"],
        "narrative_tropes": [
            "{name} probó combinaciones al azar antes de leer las instrucciones",
            "{name} se frustró y amenazó con pedir todas las pistas",
            "{name} encontró un atajo por pura intuición",
            "{name} quiso saltar directamente al candado sin resolver el puzzle",
        ],
    },
    "creativo": {
        "emoji": "🎨",
        "comprehension": 0.70,
        "time_mult": 0.95,
        "hint_threshold": 0.50,
        "frustration_rate": 0.5,
        "strengths": ["pensamiento lateral", "conexiones inusuales"],
        "weaknesses": ["distracción", "overthinking"],
        "narrative_tropes": [
            "{name} propuso una solución que nadie esperaba",
            "{name} se distrajo con un detalle irrelevante durante 1 minuto",
            "{name} conectó una pista de otra sala con la actual",
            "{name} tuvo una idea brillante pero le costó explicarla",
        ],
    },
    "seguidor": {
        "emoji": "🤝",
        "comprehension": 0.68,
        "time_mult": 1.0,
        "hint_threshold": 0.45,
        "frustration_rate": 0.45,
        "strengths": ["apoyo", "trabajo en equipo"],
        "weaknesses": ["falta de iniciativa", "depender del líder"],
        "narrative_tropes": [
            "{name} apoyó al equipo revisando lo que otros encontraron",
            "{name} ayudó a mantener la calma cuando el equipo se bloqueó",
            "{name} siguió las instrucciones al pie de la letra",
            "{name} se aburrió porque no participaba activamente",
        ],
    },
}

NOMBRES_M = ["Carlos", "David", "Pedro", "Álvaro", "Miguel", "Javier", "Pablo", "Sergio", "Marcos", "Iván"]
NOMBRES_F = ["María", "Laura", "Ana", "Carmen", "Lucía", "Elena", "Sara", "Paula", "Marta", "Cristina"]

# ─── Data classes ───
@dataclass
class Agente:
    nombre: str
    rol: str
    genero: str  # "M" or "F"
    energia: float = 90.0
    frustracion: float = 5.0
    motivacion: float = 85.0
    pistas_pedidas: int = 0
    puzzles_resueltos: int = 0
    aportes: int = 0
    divertido: float = 80.0  # puntuación de diversión
    
    @property
    def config(self):
        return ROLES[self.rol]
    
    @property
    def emoji_rol(self):
        return self.config["emoji"]

@dataclass
class EventoPrueba:
    texto: str
    tipo: str = "narrativo"  # narrativo, pista, frustración, éxito
    agente: str = ""

@dataclass 
class ResultadoPrueba:
    id: str
    nombre: str
    tiempo_estimado: int
    tiempo_simulado: float
    eventos: list = field(default_factory=list)
    pistas_usadas: list = field(default_factory=list)
    frustracion_equipo: str = "baja"
    contribuciones: dict = field(default_factory=dict)

# ─── Motor de simulación ───
class PlaytestSimulator:
    def __init__(self, game_path: str, num_jugadores: int = 5, seed: Optional[int] = None):
        self.game_path = game_path
        self.num_jugadores = max(2, min(num_jugadores, 8))
        
        # Seed determinista basada en game_path + num_jugadores
        if seed is None:
            h = hashlib.md5(f"{game_path}:{num_jugadores}".encode()).hexdigest()
            seed = int(h[:8], 16)
        self.rng = random.Random(seed)
        
        self.agentes: list[Agente] = []
        self.resultados: list[ResultadoPrueba] = []
        self.eventos_globales: list[dict] = []
        
    def crear_equipo(self):
        """Crea un equipo equilibrado con las personalidades disponibles."""
        roles_disponibles = list(ROLES.keys())
        # Garantizar al menos 1 líder y 1 analítico si hay >=3
        roles_seleccionados = []
        
        if self.num_jugadores >= 3:
            roles_seleccionados.extend(["líder", "analítico"])
        
        if self.num_jugadores >= 4:
            roles_seleccionados.append("impaciente")
        
        if self.num_jugadores >= 5:
            roles_seleccionados.append("creativo")
        
        # Rellenar el resto
        while len(roles_seleccionados) < self.num_jugadores:
            # Rotar entre seguidor, creativo, impaciente
            candidatos = ["seguidor", "creativo", "impaciente"]
            roles_seleccionados.append(candidatos[len(roles_seleccionados) % len(candidatos)])
        
        roles_seleccionados = roles_seleccionados[:self.num_jugadores]
        
        nombres_usados = set()
        for rol in roles_seleccionados:
            if rol in ("líder", "analítico", "impaciente"):
                # Predominancia masculina en estos roles (estadístico)
                pool = NOMBRES_M if self.rng.random() < 0.6 else NOMBRES_F
            else:
                pool = NOMBRES_F if self.rng.random() < 0.55 else NOMBRES_M
            
            genero = "F" if pool is NOMBRES_F else "M"
            disponibles = [n for n in pool if n not in nombres_usados]
            if not disponibles:
                disponibles = [n for n in (NOMBRES_M + NOMBRES_F) if n not in nombres_usados]
            nombre = self.rng.choice(disponibles)
            nombres_usados.add(nombre)
            
            # Variar stats iniciales ligeramente
            self.agentes.append(Agente(
                nombre=nombre,
                rol=rol,
                genero=genero,
                energia=80 + self.rng.randint(-10, 15),
                frustracion=self.rng.randint(2, 15),
                motivacion=75 + self.rng.randint(-10, 20),
            ))
    
    def cargar_pruebas(self) -> list[dict]:
        """Carga las pruebas del game.json."""
        game_dir = os.path.dirname(self.game_path)
        with open(self.game_path) as f:
            game = json.load(f)
        
        pruebas = []
        for p in game.get("pruebas", []):
            archivo = p["archivo"]
            if archivo.startswith("juego/"):
                path = os.path.join(game_dir, archivo)
            else:
                path = os.path.join(game_dir, "juego", "pruebas", archivo)
            if os.path.exists(path):
                with open(path) as f:
                    data = json.load(f)
                pruebas.append(data)
        return pruebas
    
    def simular_prueba(self, idx: int, prueba: dict) -> ResultadoPrueba:
        """Simula cómo el equipo resuelve una prueba."""
        base_time = prueba.get("tiempo", prueba.get("duracion_estimada_minutos", 7))
        dificultad = prueba.get("dificultad", 3)
        nombre = prueba.get("nombre", f"Prueba {idx+1}")
        num_pistas = len(prueba.get("pistas", []))
        cooperacion = prueba.get("cooperacion_obligatoria", False)
        
        eventos = []
        contribuciones = {}
        pistas_usadas = []
        
        # ─── Fase 1: Evaluación individual ───
        tiempos_individuales = []
        comprensiones = []
        fue_mult = 1.0  # multiplicador por fuerza bruta
        
        for ag in self.agentes:
            cfg = ag.config
            
            # Comprensión: base del rol ajustada por dificultad
            comp = cfg["comprehension"] * (1.0 - dificultad * 0.04)
            comp = max(0.2, min(0.98, comp + (self.rng.random() - 0.5) * 0.15))
            comprensiones.append(comp)
            
            # Tiempo individual
            t = base_time * cfg["time_mult"] * (1.0 + (1.0 - comp) * 0.5)
            t *= (1.0 + (dificultad - 3) * 0.08)
            tiempos_individuales.append(t)
        
        # ─── Fase 2: Dinámica de equipo ───
        lideres = [a for a in self.agentes if a.rol == "líder"]
        impacientes = [a for a in self.agentes if a.rol == "impaciente"]
        analiticos = [a for a in self.agentes if a.rol == "analítico"]
        
        # Tiempo base: mediana del equipo
        tiempos_sorted = sorted(tiempos_individuales)
        if len(tiempos_sorted) % 2 == 0:
            team_time = (tiempos_sorted[len(tiempos_sorted)//2 - 1] + tiempos_sorted[len(tiempos_sorted)//2]) / 2
        else:
            team_time = tiempos_sorted[len(tiempos_sorted)//2]
        
        # Bonus líder: -15% si hay 1 líder
        if len(lideres) == 1:
            team_time *= 0.85
            tropes = ROLES["líder"]["narrative_tropes"]
            ev = tropes[self.rng.randint(0, 1)].format(name=lideres[0].nombre)
            eventos.append(EventoPrueba(ev, "narrativo", lideres[0].nombre))
            contribuciones[lideres[0].nombre] = contribuciones.get(lideres[0].nombre, 0) + 1
        elif len(lideres) >= 2:
            # Conflicto: +20%
            team_time *= 1.20
            eventos.append(EventoPrueba(
                f"{lideres[0].nombre} y {lideres[1].nombre} discutieron sobre la estrategia",
                "frustración"
            ))
            for l in lideres:
                l.frustracion += 8
        
        # Bonus analítico: resuelve si nadie más puede (seguro net)
        if analiticos:
            analitico = analiticos[0]
            if team_time > base_time * 1.3 and self.rng.random() < 0.6:
                team_time *= 0.90
                tropes = ROLES["analítico"]["narrative_tropes"]
                ev = tropes[1].format(name=analitico.nombre)
                eventos.append(EventoPrueba(ev, "éxito", analitico.nombre))
                contribuciones[analitico.nombre] = contribuciones.get(analitico.nombre, 0) + 2
            else:
                tropes = ROLES["analítico"]["narrative_tropes"]
                ev = tropes[self.rng.randint(0, 1)].format(name=analitico.nombre)
                eventos.append(EventoPrueba(ev, "narrativo", analitico.nombre))
        
        # ─── Fase 3: Pistas y frustración ───
        max_pista_nivel = 0
        for i, ag in enumerate(self.agentes):
            # ¿Pide pista? Probabilidad basada en rol + tiempo transcurrido + frustración previa
            hint_prob = (1.0 - cfg["hint_threshold"]) * 0.5 + ag.frustracion * 0.003
            hint_prob += dificultad * 0.05
            
            if self.rng.random() < hint_prob and num_pistas > 0:
                # Nivel de pista: impacientes piden nivel alto primero
                if ag.rol == "impaciente":
                    nivel = min(3, self.rng.choices([1, 2, 3], weights=[1, 3, 2])[0])
                else:
                    nivel = min(3, self.rng.choices([1, 2, 3], weights=[4, 3, 1])[0])
                
                if nivel > max_pista_nivel:
                    max_pista_nivel = nivel
                    pistas_usadas.append(f"N{nivel}")
                    ag.pistas_pedidas += 1
                    team_time *= (0.85 + nivel * 0.05)  # pistas altas = más ahorro
                    
                    if nivel >= 2:
                        eventos.append(EventoPrueba(
                            f"😤 {ag.nombre} pidió pista nivel {nivel}",
                            "pista", ag.nombre
                        ))
                    else:
                        eventos.append(EventoPrueba(
                            f"🔍 {ag.nombre} pidió una pista sutil (N{nivel})",
                            "pista", ag.nombre
                        ))
        
        # ─── Fase 4: Creativo ───
        creativos = [a for a in self.agentes if a.rol == "creativo"]
        for cr in creativos:
            if self.rng.random() < 0.4:
                tropes = ROLES["creativo"]["narrative_tropes"]
                ev_idx = self.rng.randint(0, len(tropes)-1)
                eventos.append(EventoPrueba(tropes[ev_idx].format(name=cr.nombre), "narrativo", cr.nombre))
                contribuciones[cr.nombre] = contribuciones.get(cr.nombre, 0) + 1
                if ev_idx == 0:  # solución brillante
                    team_time *= 0.92
        
        # ─── Fase 5: Impaciente fuerza bruta ───
        for imp in impacientes:
            if imp.frustracion > 40 and self.rng.random() < 0.35:
                team_time *= 1.15  # fuerza bruta suele añadir tiempo
                fue_mult = 1.15
                tropes = ROLES["impaciente"]["narrative_tropes"]
                ev = tropes[0].format(name=imp.nombre)
                eventos.append(EventoPrueba(ev, "frustración", imp.nombre))
                imp.frustracion += 12
            elif imp.frustracion > 30 and self.rng.random() < 0.25:
                # Atajo por intuición
                team_time *= 0.88
                tropes = ROLES["impaciente"]["narrative_tropes"]
                eventos.append(EventoPrueba(tropes[2].format(name=imp.nombre), "éxito", imp.nombre))
                contribuciones[imp.nombre] = contribuciones.get(imp.nombre, 0) + 1
        
        # ─── Fase 6: Seguidor ───
        seguidores = [a for a in self.agentes if a.rol == "seguidor"]
        for seg in seguidores:
            if self.rng.random() < 0.5:
                tropes = ROLES["seguidor"]["narrative_tropes"]
                ev = tropes[self.rng.randint(0, len(tropes)-1)].format(name=seg.nombre)
                eventos.append(EventoPrueba(ev, "narrativo", seg.nombre))
        
        # Redondear tiempo
        team_time = round(max(2, team_time), 1)
        
        # ─── Fase 7: Actualizar estados ───
        diff_pct = (team_time - base_time) / base_time
        for i, ag in enumerate(self.agentes):
            # Frustración
            if diff_pct > 0.3:
                ag.frustracion += 8 + self.rng.randint(0, 7)
            elif diff_pct > 0.1:
                ag.frustracion += 3 + self.rng.randint(0, 5)
            elif diff_pct < -0.1:
                ag.frustracion = max(0, ag.frustracion - 5)
            
            ag.frustracion = max(0, min(100, ag.frustracion))
            
            # Energía (gasto suave por puzzle)
            ag.energia -= 1.5 + (len(pistas_usadas) * 1.0)
            if diff_pct > 0.3:
                ag.energia -= 2
            ag.energia = max(15, min(100, ag.energia))
            
            # Motivación
            if diff_pct > 0.3:
                ag.motivacion -= 5
            elif diff_pct < -0.1:
                ag.motivacion += 3
            ag.motivacion = max(10, min(100, ag.motivacion))
            
            # Diversión
            if diff_pct < 0.1 and len(pistas_usadas) == 0:
                ag.divertido += 5
            elif diff_pct > 0.5:
                ag.divertido -= 8
            ag.divertido = max(20, min(100, ag.divertido))
            
            # Puzzles resueltos
            ag.puzzles_resueltos += 1
            ag.aportes += contribuciones.get(ag.nombre, 0)
        
        # Frustración del equipo
        avg_frustracion = sum(a.frustracion for a in self.agentes) / len(self.agentes)
        if avg_frustracion < 20:
            frust_label = "baja"
        elif avg_frustracion < 40:
            frust_label = "media"
        else:
            frust_label = "alta"
        
        return ResultadoPrueba(
            id=prueba.get("id", f"P{idx+1}"),
            nombre=nombre,
            tiempo_estimado=base_time,
            tiempo_simulado=team_time,
            eventos=eventos,
            pistas_usadas=pistas_usadas,
            frustracion_equipo=frust_label,
            contribuciones=contribuciones,
        )
    
    def detectar_problemas(self) -> list[str]:
        """Detecta problemas de diseño basados en los resultados."""
        problemas = []
        
        for r in self.resultados:
            diff = r.tiempo_simulado - r.tiempo_estimado
            pct = diff / r.tiempo_estimado * 100
            
            if pct > 30:
                # ¿Quién causó el retraso?
                impacientes = [a for a in self.agentes if a.rol == "impaciente" and a.frustracion > 40]
                if impacientes:
                    problemas.append(
                        f"P{self.resultados.index(r)+1} ({r.nombre}) +{diff:.0f} min: "
                        f"{impacientes[0].nombre} ({impacientes[0].rol}) bloqueó al equipo"
                    )
                else:
                    problemas.append(
                        f"P{self.resultados.index(r)+1} ({r.nombre}) +{diff:.0f} min: "
                        f"dificultad demasiado alta para el grupo"
                    )
            
            if len(r.pistas_usadas) >= 2:
                niveles = r.pistas_usadas
                problemas.append(
                    f"P{self.resultados.index(r)+1} ({r.nombre}): "
                    f"{len(r.pistas_usadas)} pistas pedidas ({', '.join(niveles)}) → "
                    f"pista N2 o superior sugiere confusión en la mecánica"
                )
            
            # Desbalance de participación
            contribuyentes = len(r.contribuciones)
            if contribuyentes <= 1 and len(self.agentes) >= 4:
                ag_principal = list(r.contribuciones.keys())[0] if r.contribuciones else "nadie"
                problemas.append(
                    f"P{self.resultados.index(r)+1} ({r.nombre}): "
                    f"solo {ag_principal} contribuyó activamente → desbalance"
                )
        
        return problemas
    
    def generar_reporte_json(self) -> dict:
        """Genera el reporte JSON completo."""
        total_estimado = sum(r.tiempo_estimado for r in self.resultados)
        total_simulado = sum(r.tiempo_simulado for r in self.resultados)
        
        # Pistas por nivel
        pistas_por_nivel = {"N1": 0, "N2": 0, "N3": 0}
        for r in self.resultados:
            for p in r.pistas_usadas:
                if p in pistas_por_nivel:
                    pistas_por_nivel[p] += 1
        
        return {
            "juego": os.path.basename(os.path.dirname(self.game_path)),
            "jugadores": self.num_jugadores,
            "equipo": [
                {
                    "nombre": a.nombre,
                    "rol": a.rol,
                    "energia_final": round(a.energia, 1),
                    "frustracion_final": round(a.frustracion, 1),
                    "motivacion_final": round(a.motivacion, 1),
                    "pistas_pedidas": a.pistas_pedidas,
                    "puzzles_resueltos": a.puzzles_resueltos,
                    "aportes": a.aportes,
                    "diversion": round(a.divertido, 1),
                }
                for a in self.agentes
            ],
            "tiempo_total_estimado": total_estimado,
            "tiempo_total_simulado": round(total_simulado, 1),
            "diferencia_pct": round((total_simulado - total_estimado) / total_estimado * 100, 1),
            "pistas_por_nivel": pistas_por_nivel,
            "pruebas": [
                {
                    "id": r.id,
                    "nombre": r.nombre,
                    "tiempo_estimado": r.tiempo_estimado,
                    "tiempo_simulado": r.tiempo_simulado,
                    "diferencia": round(r.tiempo_simulado - r.tiempo_estimado, 1),
                    "pistas_usadas": r.pistas_usadas,
                    "frustracion_equipo": r.frustracion_equipo,
                    "eventos": [e.texto for e in r.eventos],
                    "contribuciones": r.contribuciones,
                }
                for r in self.resultados
            ],
            "problemas_detectados": self.detectar_problemas(),
            "jugador_mas_frustrado": max(self.agentes, key=lambda a: a.frustracion).nombre,
            "jugador_mas_util": max(self.agentes, key=lambda a: a.aportes).nombre,
        }
    
    def imprimir_resumen(self):
        """Imprime el resumen visual en consola."""
        nombre_juego = os.path.basename(os.path.dirname(self.game_path))
        
        print()
        print(c("bold", "🎮 PLAYTEST SIMULADO") + c("dim", f" — {nombre_juego}"))
        print(c("dim", "━" * 45))
        print()
        
        # Equipo
        print(f"  Equipo: {self.num_jugadores} jugadores")
        for ag in self.agentes:
            energia_icon = "⚡"
            warn = " ⚠️" if ag.frustracion > 40 else ""
            frust_bar = self._barrita(100 - ag.frustracion, 100, "🔴", "🟢")
            print(f"    {ag.emoji_rol} {c('bold', ag.nombre)} ({ag.rol})  "
                  f"— {energia_icon} energía: {ag.energia:.0f}  "
                  f"😤 {frust_bar}{warn}")
        print()
        
        # Pruebas
        total_est = 0
        total_sim = 0
        for i, r in enumerate(self.resultados):
            total_est += r.tiempo_estimado
            total_sim += r.tiempo_simulado
            
            diff = r.tiempo_simulado - r.tiempo_estimado
            pct = diff / r.tiempo_estimado * 100
            
            if pct < -10:
                icon = "✅"
                color = "green"
            elif pct < 15:
                icon = "👌"
                color = "yellow"
            elif pct < 35:
                icon = "⚠️"
                color = "yellow"
            else:
                icon = "🔴"
                color = "red"
            
            print(f"  P{i+1}: {c('bold', r.nombre)} ({r.tiempo_estimado} min est.) "
                  f"→ {r.tiempo_simulado:.1f} min {c(color, icon)}")
            
            for ev in r.eventos:
                if ev.tipo == "frustración":
                    print(f"    {c('red', '😤')} {ev.texto}")
                elif ev.tipo == "éxito":
                    print(f"    {c('green', '✨')} {ev.texto}")
                elif ev.tipo == "pista":
                    print(f"    {c('yellow', '💡')} {ev.texto}")
                else:
                    print(f"    {c('dim', '🔍')} {ev.texto}")
            
            pistas_str = ", ".join(r.pistas_usadas) if r.pistas_usadas else "0"
            frust_emoji = {"baja": "😊", "media": "😐", "alta": "😤"}[r.frustracion_equipo]
            print(f"    {c('dim', f'⏱️ Tiempo: {r.tiempo_simulado:.1f} min | Pistas: {pistas_str} | Frustración: {r.frustracion_equipo} {frust_emoji}')}")
            print()
        
        # Resumen
        diff_pct = (total_sim - total_est) / total_est * 100
        print(c("dim", "━" * 45))
        print(c("bold", "  📊 RESUMEN"))
        
        if abs(diff_pct) < 10:
            diff_color = "green"
        elif abs(diff_pct) < 25:
            diff_color = "yellow"
        else:
            diff_color = "red"
        
        sign = "+" if diff_pct > 0 else ""
        print(f"    Tiempo total: {total_sim:.1f} min (estimado: {total_est}) "
              f"— {c(diff_color, f'{sign}{diff_pct:.1f}%')}")
        
        pistas_total = sum(len(r.pistas_usadas) for r in self.resultados)
        pistas_n1 = sum(1 for r in self.resultados for p in r.pistas_usadas if p == "N1")
        pistas_n2 = sum(1 for r in self.resultados for p in r.pistas_usadas if p == "N2")
        pistas_n3 = sum(1 for r in self.resultados for p in r.pistas_usadas if p == "N3")
        print(f"    Pistas pedidas: {pistas_total} (N1: {pistas_n1}, N2: {pistas_n2}, N3: {pistas_n3})")
        
        mas_frust = max(self.agentes, key=lambda a: a.frustracion)
        mas_util = max(self.agentes, key=lambda a: a.aportes)
        mas_div = max(self.agentes, key=lambda a: a.divertido)
        print(f"    Jugador más frustrado: {c('red', mas_frust.nombre)} ({mas_frust.rol})")
        print(f"    Jugador más útil: {c('green', mas_util.nombre)} ({mas_util.rol})")
        print(f"    Jugador que más disfrutó: {c('cyan', mas_div.nombre)} ({mas_div.rol})")
        
        # Diversión media
        avg_div = sum(a.divertido for a in self.agentes) / len(self.agentes)
        div_bar = self._barrita(avg_div, 100, "😢", "🎉")
        print(f"    Diversión media del equipo: {div_bar} {avg_div:.0f}/100")
        
        # Problemas
        problemas = self.detectar_problemas()
        if problemas:
            print()
            print(c("bold", "  ⚠️  PROBLEMAS DETECTADOS:"))
            for i, p in enumerate(problemas, 1):
                print(f"    {c('yellow', f'{i}.')} {p}")
        
        print()
    
    def _barrita(self, valor: float, maximo: float, emoji_bad: str, emoji_good: str) -> str:
        pct = valor / maximo
        if pct > 0.7:
            return emoji_good
        elif pct > 0.4:
            return "😐"
        else:
            return emoji_bad
    
    def ejecutar(self) -> dict:
        """Ejecuta la simulación completa y devuelve el reporte."""
        self.crear_equipo()
        pruebas = self.cargar_pruebas()
        
        if not pruebas:
            print("❌ No se encontraron pruebas en el game.json")
            sys.exit(1)
        
        for i, prueba in enumerate(pruebas):
            resultado = self.simular_prueba(i, prueba)
            self.resultados.append(resultado)
        
        self.imprimir_resumen()
        return self.generar_reporte_json()


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Playtest simulado con agentes con personalidad")
    parser.add_argument("game_json", help="Ruta al game.json")
    parser.add_argument("--jugadores", "-j", type=int, default=5, help="Número de jugadores (2-8, default: 5)")
    parser.add_argument("--output", "-o", help="Ruta para guardar el reporte JSON")
    parser.add_argument("--seed", "-s", type=int, help="Seed para reproducibilidad")
    parser.add_argument("--quiet", "-q", action="store_true", help="Solo mostrar resumen final")
    
    args = parser.parse_args()
    
    if not os.path.exists(args.game_json):
        print(f"❌ No encontrado: {args.game_json}")
        sys.exit(1)
    
    sim = PlaytestSimulator(args.game_json, args.jugadores, args.seed)
    reporte = sim.ejecutar()
    
    # Guardar reporte
    output_path = args.output or os.path.join(
        os.path.dirname(args.game_json), "juego", "pruebas", "playtest-report.json"
    )
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(reporte, f, indent=2, ensure_ascii=False)
    
    print(f"  {c('dim', f'📄 Reporte guardado en: {output_path}')}")

    # ─── Exit codes ───
    problemas = reporte.get("problemas_detectados", [])
    avg_div = sum(a["diversion"] for a in reporte["equipo"]) / len(reporte["equipo"])
    diff_pct = reporte["diferencia_pct"]
    max_frust = max(a["frustracion_final"] for a in reporte["equipo"])
    
    critical = []
    warnings = []
    
    if diff_pct > 50:
        critical.append(f"tiempo +{diff_pct:.0f}% sobre estimado")
    if avg_div < 50:
        critical.append(f"diversión media {avg_div:.0f}/100")
    if max_frust > 70:
        critical.append(f"frustración máxima {max_frust:.0f}/100")
    if len(problemas) >= 3:
        critical.append(f"{len(problemas)} problemas detectados")
    
    if diff_pct > 25:
        warnings.append(f"tiempo +{diff_pct:.0f}%")
    if avg_div < 65:
        warnings.append(f"diversión media {avg_div:.0f}/100")
    
    if critical:
        print(c("red", f"  ❌ CRITICAL ({len(critical)}): {', '.join(critical)})"))
        sys.exit(1)
    elif warnings:
        print(c("yellow", f"  ⚠️  WARNING ({len(warnings)}): {', '.join(warnings)})"))
        sys.exit(0)
    else:
        print(c("green", "  ✅ Playtest OK — sin problemas significativos"))
        sys.exit(0)

if __name__ == "__main__":
    main()
