import React, { useState, useEffect, useCallback } from 'react';
import { useDebug } from '../../context/DebugContext';

interface FishSortGameProps {
  onGameWon: () => void;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Tipos de peces
type FishType = 'standard' | 'puffer' | 'angel' | 'seahorse';

// Cada pez en el juego
interface Fish {
  id: string;
  type: FishType;
  tube: number;
  position: number; // Posición dentro del tubo (0 es la inferior)
}

// Configuraciones de dificultad
const difficultySettings = {
  easy: { tubes: 4, fishTypes: 4, fishPerTube: 4 },
  medium: { tubes: 5, fishTypes: 4, fishPerTube: 4 },
  hard: { tubes: 6, fishTypes: 4, fishPerTube: 4 }
};

// Colores más sutiles para los peces (tonos azul marino y turquesa)
const fishColors: Record<FishType, string> = {
  standard: '#6FA8DC', // Azul medio
  puffer: '#9FC5E8',   // Azul claro
  angel: '#45818E',    // Turquesa oscuro
  seahorse: '#76A5AF'  // Turquesa medio
};

// Componente de pez estándar SVG
const StandardFishSvg: React.FC<{ direction?: 'left' | 'right' }> = ({ direction = 'right' }) => {
  const transform = direction === 'left' ? 'scale(-1, 1)' : undefined;
  
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ transform }}>
      {/* Cuerpo del pez */}
      <path
        d="M70,50 C70,35 60,25 40,25 C20,25 10,35 10,50 C10,65 20,75 40,75 C60,75 70,65 70,50 Z"
        fill={fishColors.standard}
        stroke="#000"
        strokeWidth="2"
      />
      {/* Cola del pez */}
      <path
        d="M70,50 L85,30 L85,70 Z"
        fill={fishColors.standard}
        stroke="#000"
        strokeWidth="2"
      />
      {/* Ojo del pez */}
      <circle cx="30" cy="45" r="5" fill="white" stroke="#000" strokeWidth="1" />
      <circle cx="30" cy="45" r="2" fill="black" />
      {/* Aleta superior */}
      <path
        d="M45,25 Q50,15 55,25"
        fill={fishColors.standard}
        stroke="#000"
        strokeWidth="2"
      />
      {/* Aleta inferior */}
      <path
        d="M45,75 Q50,85 55,75"
        fill={fishColors.standard}
        stroke="#000"
        strokeWidth="2"
      />
    </svg>
  );
};

// Componente de pez globo SVG
const PufferFishSvg: React.FC<{ direction?: 'left' | 'right' }> = ({ direction = 'right' }) => {
  const transform = direction === 'left' ? 'scale(-1, 1)' : undefined;
  
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ transform }}>
      {/* Cuerpo del pez globo (más redondeado) */}
      <circle
        cx="45" 
        cy="50" 
        r="30"
        fill={fishColors.puffer}
        stroke="#000"
        strokeWidth="2"
      />
      {/* Cola pequeña */}
      <path
        d="M75,50 L85,40 L85,60 Z"
        fill={fishColors.puffer}
        stroke="#000"
        strokeWidth="2"
      />
      {/* Ojo del pez */}
      <circle cx="30" cy="40" r="4" fill="white" stroke="#000" strokeWidth="1" />
      <circle cx="30" cy="40" r="2" fill="black" />
      {/* Espinas (características del pez globo) */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * Math.PI) / 4;
        const x1 = 45 + 30 * Math.cos(angle);
        const y1 = 50 + 30 * Math.sin(angle);
        const x2 = 45 + 38 * Math.cos(angle);
        const y2 = 50 + 38 * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#000"
            strokeWidth="2"
          />
        );
      })}
      {/* Boca */}
      <path
        d="M28,55 Q35,60 42,55"
        fill="none"
        stroke="#000"
        strokeWidth="2"
      />
    </svg>
  );
};

// Componente de pez ángel SVG
const AngelFishSvg: React.FC<{ direction?: 'left' | 'right' }> = ({ direction = 'right' }) => {
  const transform = direction === 'left' ? 'scale(-1, 1)' : undefined;
  
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ transform }}>
      {/* Cuerpo vertical del pez ángel */}
      <ellipse
        cx="45" 
        cy="50" 
        rx="20" 
        ry="30" 
        fill={fishColors.angel}
        stroke="#000"
        strokeWidth="2"
      />
      {/* Aleta superior grande (triangular) */}
      <path
        d="M45,20 L60,5 L75,25 Z"
        fill={fishColors.angel}
        stroke="#000"
        strokeWidth="2"
      />
      {/* Aleta inferior grande (triangular) */}
      <path
        d="M45,80 L60,95 L75,75 Z"
        fill={fishColors.angel}
        stroke="#000"
        strokeWidth="2"
      />
      {/* Cola estrecha */}
      <path
        d="M65,50 L85,40 L85,60 Z"
        fill={fishColors.angel}
        stroke="#000"
        strokeWidth="2"
      />
      {/* Ojo del pez */}
      <circle cx="35" cy="40" r="4" fill="white" stroke="#000" strokeWidth="1" />
      <circle cx="35" cy="40" r="2" fill="black" />
      {/* Boca pequeña */}
      <path
        d="M30,45 Q35,48 40,45"
        fill="none"
        stroke="#000"
        strokeWidth="1"
      />
    </svg>
  );
};

// Componente de caballito de mar SVG
const SeahorseSvg: React.FC<{ direction?: 'left' | 'right' }> = ({ direction = 'right' }) => {
  const transform = direction === 'left' ? 'scale(-1, 1)' : undefined;
  
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ transform }}>
      {/* Cabeza curva del caballito */}
      <path
        d="M30,35 C25,30 25,25 30,20 C35,15 45,15 45,25 C45,30 40,35 35,35"
        fill={fishColors.seahorse}
        stroke="#000"
        strokeWidth="2"
      />
      {/* Cuerpo curvo */}
      <path
        d="M35,35 C50,40 55,45 50,55 C45,65 40,75 45,85"
        fill="none"
        stroke={fishColors.seahorse}
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Aleta dorsal */}
      <path
        d="M32,40 Q40,30 48,40"
        fill={fishColors.seahorse}
        stroke="#000"
        strokeWidth="1"
      />
      {/* Ojo del caballito */}
      <circle cx="30" cy="25" r="3" fill="white" stroke="#000" strokeWidth="1" />
      <circle cx="30" cy="25" r="1.5" fill="black" />
      {/* Cola enrollada */}
      <path
        d="M45,85 C40,95 35,90 40,85"
        fill="none"
        stroke={fishColors.seahorse}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
};

// Componente que selecciona el tipo de pez a renderizar
const FishSvg: React.FC<{ type: FishType, direction?: 'left' | 'right' }> = ({ type, direction = 'right' }) => {
  switch (type) {
    case 'standard':
      return <StandardFishSvg direction={direction} />;
    case 'puffer':
      return <PufferFishSvg direction={direction} />;
    case 'angel':
      return <AngelFishSvg direction={direction} />;
    case 'seahorse':
      return <SeahorseSvg direction={direction} />;
    default:
      return <StandardFishSvg direction={direction} />;
  }
};

const FishSortGame: React.FC<FishSortGameProps> = ({
  onGameWon,
  difficulty = 'medium' // Cambiado a medium por defecto
}) => {
  const { isDebugEnabled } = useDebug();
  
  // Estado del juego
  const [tubes, setTubes] = useState<Fish[][]>([]);
  const [selectedTube, setSelectedTube] = useState<number | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [movesCount, setMovesCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [instructionsVisible, setInstructionsVisible] = useState(true);
  
  // Agregar estado para detectar dispositivos táctiles
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  // Inicializar juego
  const initializeGame = useCallback(() => {
    // Configuración fija para este nivel
    const numTubes = 5; // 5 tubos en total (4 con peces + 1 vacío)
    const fishPerTube = 4; // 4 peces por tubo
    
    // Crear los 16 peces en total (4 de cada tipo)
    const allFish: Fish[] = [];
    const fishTypes: FishType[] = ['standard', 'puffer', 'angel', 'seahorse'];
    
    // Crear 4 peces de cada tipo (16 en total)
    fishTypes.forEach(type => {
      for (let i = 0; i < fishPerTube; i++) {
        allFish.push({
          id: `${type}-${i}`,
          type,
          tube: -1,
          position: -1
        });
      }
    });
    
    // Mezclar aleatoriamente
    for (let i = allFish.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allFish[i], allFish[j]] = [allFish[j], allFish[i]];
    }
    
    // Crear 5 tubos vacíos
    const initialTubes: Fish[][] = [];
    for (let i = 0; i < numTubes; i++) {
      initialTubes.push([]);
    }
    
    // Distribuir 16 peces en los primeros 4 tubos (4 peces por tubo)
    let fishIndex = 0;
    for (let t = 0; t < numTubes - 1; t++) {
      for (let p = 0; p < fishPerTube; p++) {
        if (fishIndex < allFish.length) {
          const fish = {...allFish[fishIndex]}; // Crear copia del pez
          fish.tube = t;
          fish.position = p;
          initialTubes[t].push(fish);
          fishIndex++;
        }
      }
    }
    
    // Log de depuración
    if (isDebugEnabled) {
      console.log('Total de peces:', allFish.length);
      initialTubes.forEach((tube, i) => {
        console.log(`Tubo ${i}: ${tube.length} peces`);
      });
    }
    
    setTubes(initialTubes);
    setSelectedTube(null);
    setMovesCount(0);
    setGameWon(false);
    setInstructionsVisible(true);
  }, [isDebugEnabled]);
  
  // Detectar dispositivos táctiles al montar el componente
  useEffect(() => {
    const detectTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        (navigator as any).msMaxTouchPoints > 0
      );
    };
    
    detectTouchDevice();
    
    // También detectar cuando cambia el tamaño de la ventana
    window.addEventListener('resize', detectTouchDevice);
    return () => window.removeEventListener('resize', detectTouchDevice);
  }, []);
  
  // Inicializar al montar el componente
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);
  
  // Verificar si un tubo está completo (todos los peces son del mismo tipo)
  const isTubeComplete = (tube: Fish[]): boolean => {
    if (tube.length === 0) return true; // Un tubo vacío se considera completo
    if (tube.length !== 4) return false; // Si no está vacío, debe tener 4 peces
    
    const firstType = tube[0].type;
    return tube.every(fish => fish.type === firstType);
  };
  
  // Verificar si el juego ha sido ganado
  const checkWinCondition = useCallback(() => {
    // Verificar si tenemos todos los 16 peces
    const totalFish = tubes.reduce((sum, tube) => sum + tube.length, 0);
    if (totalFish !== 16) return false;
    
    // El juego se gana cuando cada tubo tiene 4 peces del mismo tipo o está vacío
    return tubes.every(tube => isTubeComplete(tube));
  }, [tubes]);
  
  // Effect para comprobar la victoria después de cada movimiento
  useEffect(() => {
    if (tubes.length > 0 && !gameWon && !isMoving) {
      if (checkWinCondition()) {
        setGameWon(true);
        setTimeout(() => {
          onGameWon();
        }, 1500);
      }
    }
  }, [tubes, gameWon, isMoving, checkWinCondition, onGameWon]);
  
  // Manejar el clic en un tubo
  const handleTubeClick = (tubeIndex: number) => {
    if (isMoving || gameWon) return;
    
    // Ocultar instrucciones al primer clic
    if (instructionsVisible) {
      setInstructionsVisible(false);
    }
    
    if (selectedTube === null) {
      // Si no hay tubo seleccionado, seleccionar este si tiene peces
      if (tubes[tubeIndex].length > 0) {
        setSelectedTube(tubeIndex);
      }
    } else if (selectedTube === tubeIndex) {
      // Si se hace clic en el mismo tubo, deseleccionar
      setSelectedTube(null);
    } else {
      // Intentar mover un pez del tubo seleccionado al tubo de destino
      moveFish(selectedTube, tubeIndex);
    }
  };
  
  // Mover un pez de un tubo a otro
  const moveFish = (fromTubeIndex: number, toTubeIndex: number) => {
    const fromTube = [...tubes[fromTubeIndex]];
    const toTube = [...tubes[toTubeIndex]];
    
    // Verificar si hay peces en el tubo de origen
    if (fromTube.length === 0) {
      setSelectedTube(null);
      return;
    }
    
    // Verificar si el tubo de destino está lleno
    if (toTube.length >= 4) { // Siempre 4 máximo
      setSelectedTube(null);
      return;
    }
    
    // Obtener el pez superior del tubo de origen
    const topFishIndex = fromTube.length - 1;
    const fishToMove = {...fromTube[topFishIndex]}; // Crear copia del pez
    
    // Mover el pez
    setIsMoving(true);
    
    // Crear copia profunda de los tubos para no mutar el estado directamente
    const newTubes = tubes.map(tube => [...tube]);
    
    // Quitar el pez del tubo de origen
    newTubes[fromTubeIndex].pop();
    
    // Actualizar propiedades del pez
    fishToMove.tube = toTubeIndex;
    fishToMove.position = toTube.length;
    
    // Añadir el pez al tubo de destino
    newTubes[toTubeIndex] = [...newTubes[toTubeIndex], fishToMove];
    
    // Actualizar estado
    setTubes(newTubes);
    setSelectedTube(null);
    setMovesCount(count => count + 1);
    
    // Establecemos un retraso para actualizar isMoving
    setTimeout(() => {
      setIsMoving(false);
      // La comprobación de victoria se hace ahora en el useEffect
    }, 300);
  };
  
  // Renderizar un pez
  const renderFish = (fish: Fish, index: number, tubeIndex: number, isTopFish: boolean) => {
    // Cada pez se renderiza desde abajo hacia arriba (el índice 0 está en la parte inferior)
    // Con 4 posiciones posibles en cada tubo (0,1,2,3)
    const positionFromBottom = index; // Posición desde abajo (0 = más abajo)
    
    // Alternar la dirección del pez
    const direction = (index % 2 === 0) ? 'right' : 'left';
    
    const fishStyle: React.CSSProperties = {
      bottom: `${positionFromBottom * 25}%`, // 0%, 25%, 50%, 75% desde abajo
      height: '25%', // Cada pez ocupa 1/4 del tubo
      width: '100%',
      position: 'absolute',
      zIndex: index + 1,
      transition: 'all 0.3s ease-out',
      padding: '3px'
    };
    
    return (
      <div
        key={fish.id}
        className={`${
          isTopFish && selectedTube === tubeIndex ? 'ring-2 ring-white pulse-animation' : ''
        }`}
        style={fishStyle}
      >
        <FishSvg type={fish.type} direction={direction} />
      </div>
    );
  };
  
  // Renderizar un tubo
  const renderTube = (tubeIndex: number) => {
    const tube = tubes[tubeIndex] || [];
    const isSelected = selectedTube === tubeIndex;
    
    return (
      <div
        key={`tube-${tubeIndex}`}
        className={`relative w-16 h-64 mx-1 sm:mx-2 border-2 ${
          isSelected ? 'border-yellow-400' : 'border-gray-400'
        } rounded-b-xl bg-blue-100 bg-opacity-70 overflow-hidden cursor-pointer touch-manipulation`}
        onClick={() => handleTubeClick(tubeIndex)}
        style={{ touchAction: 'manipulation' }}
      >
        {/* Renderizar peces en el tubo */}
        {tube.map((fish, index) => renderFish(
          fish, 
          index, 
          tubeIndex, 
          index === tube.length - 1
        ))}
        
        {/* Burbuja de agua */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={`bubble-${tubeIndex}-${i}`}
            className="absolute w-2 h-2 rounded-full bg-white bg-opacity-70 animate-bubble"
            style={{
              left: `${30 + Math.random() * 40}%`,
              bottom: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
        
        {/* Marcador de tubo completado */}
        {isTubeComplete(tube) && tube.length > 0 && (
          <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
        )}
        
        {/* Debugging - Mostrar número de peces */}
        {isDebugEnabled && (
          <div className="absolute top-0 left-0 bg-black text-white text-xs px-1">
            {tube.length}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div 
      className="mt-8 p-2 sm:p-4 bg-blue-900 bg-opacity-20 border border-blue-300 rounded-lg max-w-full overflow-hidden"
    >
      {/* Cabecera con estadísticas */}
      <div className="flex justify-between items-center mb-2 sm:mb-4">
        <div className="text-blue-800 text-sm sm:text-base">
          <span className="font-bold">Movimientos:</span> {movesCount}
          {isDebugEnabled && <span className="ml-3">Peces: {tubes.reduce((sum, tube) => sum + tube.length, 0)}</span>}
        </div>
        <button
          onClick={initializeGame}
          className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 touch-manipulation"
        >
          Reiniciar
        </button>
      </div>
      
      {/* Instrucciones */}
      {instructionsVisible && (
        <div className="mb-2 sm:mb-4 p-2 sm:p-3 bg-yellow-100 rounded-lg text-xs sm:text-sm text-yellow-800">
          <p className="mb-1 sm:mb-2"><strong>Objetivo:</strong> Ordena los peces para que cada tubo contenga solo peces del mismo tipo.</p>
          <p><strong>Cómo jugar:</strong> Toca un tubo para seleccionarlo, luego toca otro tubo para mover un pez. Puedes mover cualquier pez superior a cualquier tubo que tenga espacio.</p>
          <button
            onClick={() => setInstructionsVisible(false)}
            className="mt-1 sm:mt-2 px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs hover:bg-yellow-300 touch-manipulation"
          >
            Entendido
          </button>
        </div>
      )}
      
      {/* Mensaje de victoria */}
      {gameWon && (
        <div className="mb-2 sm:mb-4 p-2 sm:p-3 bg-green-100 text-green-800 rounded-lg text-center animate-pulse">
          <p className="font-bold text-base sm:text-lg">¡Felicidades!</p>
          <p className="text-sm sm:text-base">Has completado el puzle de los peces.</p>
        </div>
      )}
      
      {/* Área de juego con tubos */}
      <div 
        className="flex justify-center items-end gap-1 sm:gap-2 p-2 sm:p-4 overflow-x-auto"
      >
        {tubes.map((_, index) => renderTube(index))}
      </div>
      
      {/* Estilos para animaciones */}
      <style>{`
        @keyframes bubble {
          0% { transform: translateY(0) scale(1); opacity: 0.7; }
          50% { transform: translateY(-40px) scale(1.2); opacity: 0.4; }
          100% { transform: translateY(-80px) scale(0.8); opacity: 0; }
        }
        
        .animate-bubble {
          animation: bubble 5s infinite;
        }
        
        @keyframes pulse-animation {
          0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
        
        .pulse-animation {
          animation: pulse-animation 1.5s infinite;
        }
        
        /* Mejoras para dispositivos táctiles */
        @media (pointer: coarse) {
          .touch-manipulation {
            touch-action: manipulation;
          }
        }
      `}</style>
    </div>
  );
};

export default FishSortGame; 