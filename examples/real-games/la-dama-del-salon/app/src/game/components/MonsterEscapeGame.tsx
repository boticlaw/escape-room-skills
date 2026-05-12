import React, { createContext, useContext, useReducer, useEffect, useState, useRef } from 'react';

// Tipos para el estado y las acciones
type Position = {
  x: number;
  y: number;
};

type GameState = {
  playerPos: Position;
  previousPlayerPos: Position | null; // Añadir posición anterior del jugador
  playerDirection: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null; // Dirección actual del jugador
  pursuersPositions: Position[]; // Cambiado de monsterPositions a pursuersPositions
  gameOver: boolean;
  gameWon: boolean;
  movesCount: number;
  boardSize: number;
  targetMoves: number;
};

type GameAction =
  | { type: 'MOVE_PLAYER'; direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' }
  | { type: 'MOVE_PURSUERS' } // Cambiado de MOVE_MONSTERS a MOVE_PURSUERS
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_TARGET_MOVES'; targetMoves: number };

// Contexto para el estado global del juego
const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

// Hook personalizado para usar el contexto del juego
const useGameState = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameState debe ser usado dentro de un GameProvider');
  }
  return context;
};

// Función para generar posiciones aleatorias que no colisionen entre sí
const generateRandomPositions = (boardSize: number, count: number, avoidPos?: Position): Position[] => {
  const positions: Position[] = [];
  
  while (positions.length < count) {
    const newPos = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize)
    };
    
    // Verificar que la posición no coincide con posiciones a evitar o ya generadas
    // Añadimos una distancia mínima de seguridad (3 celdas) desde la posición del jugador
    const doesCollide = positions.some(pos => pos.x === newPos.x && pos.y === newPos.y) || 
                        (avoidPos && (
                          avoidPos.x === newPos.x && avoidPos.y === newPos.y ||
                          getManhattanDistance(avoidPos, newPos) <= 2  // Distancia de seguridad de al menos 2 celdas
                        ));
    
    if (!doesCollide) {
      positions.push(newPos);
    }
  }
  
  return positions;
};

// Función para calcular la distancia Manhattan entre dos posiciones
const getManhattanDistance = (pos1: Position, pos2: Position): number => {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
};

// Función para mover un perseguidor un paso hacia el jugador
const movePursuerTowardsPlayer = (
  pursuerPos: Position, 
  playerPos: Position, 
  boardSize: number, 
  otherPursuers: Position[],
  playerDirection: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null,
  previousPlayerPos: Position | null
): Position => {
  const possibleMoves: Position[] = [
    { x: pursuerPos.x - 1, y: pursuerPos.y }, // izquierda
    { x: pursuerPos.x + 1, y: pursuerPos.y }, // derecha
    { x: pursuerPos.x, y: pursuerPos.y - 1 }, // arriba
    { x: pursuerPos.x, y: pursuerPos.y + 1 }  // abajo
  ].filter(pos => 
    pos.x >= 0 && pos.x < boardSize && 
    pos.y >= 0 && pos.y < boardSize &&
    !otherPursuers.some(m => m.x === pos.x && m.y === pos.y)
  );
  
  if (possibleMoves.length === 0) {
    return pursuerPos; // No hay movimientos posibles
  }
  
  // Inteligencia mejorada: predecir el movimiento del jugador basado en su dirección anterior
  // Probabilidad de que el perseguidor sea "inteligente" aumenta con la dificultad
  const isSmartPursuer = Math.random() < 0.7; // 70% de probabilidad
  
  if (isSmartPursuer && playerDirection && previousPlayerPos) {
    // Analizar el patrón de movimiento del jugador
    let predictedPos = { ...playerPos };
    
    // Si el jugador se mueve horizontalmente
    if (playerDirection === 'LEFT' || playerDirection === 'RIGHT') {
      // Predecir que seguirá moviéndose en la misma dirección
      if (playerDirection === 'LEFT') {
        predictedPos.x = Math.max(0, playerPos.x - 1);
      } else {
        predictedPos.x = Math.min(boardSize - 1, playerPos.x + 1);
      }
      
      // Algunos perseguidores intentarán interceptar verticalmente
      if (Math.abs(pursuerPos.x - playerPos.x) < 3) {
        // Estamos cerca horizontalmente, intentar moverse verticalmente para interceptar
        if (pursuerPos.y > playerPos.y) {
          // El perseguidor está debajo del jugador, moverse hacia arriba
          const upMove = possibleMoves.find(move => move.y < pursuerPos.y);
          if (upMove) return upMove;
        } else if (pursuerPos.y < playerPos.y) {
          // El perseguidor está encima del jugador, moverse hacia abajo
          const downMove = possibleMoves.find(move => move.y > pursuerPos.y);
          if (downMove) return downMove;
        }
      }
    }
    
    // Si el jugador se mueve verticalmente
    if (playerDirection === 'UP' || playerDirection === 'DOWN') {
      // Predecir que seguirá moviéndose en la misma dirección
      if (playerDirection === 'UP') {
        predictedPos.y = Math.max(0, playerPos.y - 1);
      } else {
        predictedPos.y = Math.min(boardSize - 1, playerPos.y + 1);
      }
      
      // Algunos perseguidores intentarán interceptar horizontalmente
      if (Math.abs(pursuerPos.y - playerPos.y) < 3) {
        // Estamos cerca verticalmente, intentar moverse horizontalmente para interceptar
        if (pursuerPos.x > playerPos.x) {
          // El perseguidor está a la derecha del jugador, moverse hacia la izquierda
          const leftMove = possibleMoves.find(move => move.x < pursuerPos.x);
          if (leftMove) return leftMove;
        } else if (pursuerPos.x < playerPos.x) {
          // El perseguidor está a la izquierda del jugador, moverse hacia la derecha
          const rightMove = possibleMoves.find(move => move.x > pursuerPos.x);
          if (rightMove) return rightMove;
        }
      }
    }
    
    // Si estamos cerca de la posición predicha, intentar ir directamente hacia ella
    return possibleMoves.reduce((bestMove, currentMove) => {
      const currentDistance = getManhattanDistance(currentMove, predictedPos);
      const bestDistance = getManhattanDistance(bestMove, predictedPos);
      
      return currentDistance < bestDistance ? currentMove : bestMove;
    }, possibleMoves[0]);
  }
  
  // Comportamiento estándar para perseguidores menos inteligentes
  return possibleMoves.reduce((bestMove, currentMove) => {
    const currentDistance = getManhattanDistance(currentMove, playerPos);
    const bestDistance = getManhattanDistance(bestMove, playerPos);
    
    return currentDistance < bestDistance ? currentMove : bestMove;
  }, possibleMoves[0]);
};

// Función reductora para manejar las acciones del juego
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'MOVE_PLAYER': {
      if (state.gameOver || state.gameWon) return state;
      
      let newX = state.playerPos.x;
      let newY = state.playerPos.y;
      
      switch (action.direction) {
        case 'UP':
          newY = Math.max(0, state.playerPos.y - 1);
          break;
        case 'DOWN':
          newY = Math.min(state.boardSize - 1, state.playerPos.y + 1);
          break;
        case 'LEFT':
          newX = Math.max(0, state.playerPos.x - 1);
          break;
        case 'RIGHT':
          newX = Math.min(state.boardSize - 1, state.playerPos.x + 1);
          break;
      }
      
      // Si no hubo movimiento real (por ejemplo, si está en el borde), no actualizamos
      if (newX === state.playerPos.x && newY === state.playerPos.y) {
        console.log('No hubo movimiento real');
        return state;
      }
      
      // Verificar si la nueva posición colisiona con algún perseguidor
      const collision = state.pursuersPositions.some(
        pursuer => pursuer.x === newX && pursuer.y === newY
      );
      
      if (collision) {
        console.log('Colisión con perseguidor');
        return { ...state, gameOver: true };
      }
      
      // Incrementar contador de movimientos
      const newMovesCount = state.movesCount + 1;
      const gameWon = newMovesCount >= state.targetMoves;
      
      console.log('Movimiento válido', {
        desde: {x: state.playerPos.x, y: state.playerPos.y},
        hacia: {x: newX, y: newY},
        contadorAnterior: state.movesCount,
        nuevoContador: newMovesCount
      });
      
      // Asegurarnos de que newMovesCount es un número
      const validMovesCount = isNaN(newMovesCount) ? 1 : newMovesCount;
      
      // Crear nuevo estado con las actualizaciones
      return {
        ...state,
        previousPlayerPos: { ...state.playerPos },
        playerPos: { x: newX, y: newY },
        playerDirection: action.direction,
        movesCount: validMovesCount,
        gameWon: validMovesCount >= state.targetMoves
      };
    }
    
    case 'MOVE_PURSUERS': {
      if (state.gameOver || state.gameWon) return state;
      
      const newPursuersPositions: Position[] = [];
      let gameOver = false;
      
      // Mover cada perseguidor un paso hacia el jugador
      for (let i = 0; i < state.pursuersPositions.length; i++) {
        const otherPursuers = [...state.pursuersPositions];
        otherPursuers.splice(i, 1); // Excluir el perseguidor actual
        
        const newPos = movePursuerTowardsPlayer(
          state.pursuersPositions[i],
          state.playerPos,
          state.boardSize,
          newPursuersPositions, // Solo considerar las nuevas posiciones ya calculadas
          state.playerDirection,
          state.previousPlayerPos
        );
        
        newPursuersPositions.push(newPos);
        
        // Verificar si el perseguidor alcanzó al jugador
        if (newPos.x === state.playerPos.x && newPos.y === state.playerPos.y) {
          gameOver = true;
        }
      }
      
      return {
        ...state,
        pursuersPositions: newPursuersPositions,
        gameOver
      };
    }
    
    case 'RESET_GAME': {
      // Inicializar nuevo juego
      const boardSize = state.boardSize;
      // Para dispositivos móviles, podríamos usar un tablero más pequeño
      const playerPos = { x: Math.floor(boardSize / 2), y: Math.floor(boardSize / 2) };
      
      // Ajustar número de perseguidores basado en dificultad y boardSize
      let pursuersCount = 5;
      if (state.boardSize <= 7) { // Para tableros más pequeños
        pursuersCount = state.targetMoves <= 15 ? 2 : 3; // Menos perseguidores
      } else {
        pursuersCount = state.targetMoves <= 15 ? 3 : 5;
      }
      
      const pursuersPositions = generateRandomPositions(boardSize, pursuersCount, playerPos);
      
      return {
        playerPos,
        previousPlayerPos: null,
        playerDirection: null,
        pursuersPositions,
        gameOver: false,
        gameWon: false,
        movesCount: 0,
        boardSize,
        targetMoves: state.targetMoves // Mantener el mismo objetivo
      };
    }
    
    case 'UPDATE_TARGET_MOVES': {
      return {
        ...state,
        targetMoves: action.targetMoves
      };
    }
    
    default:
      return state;
  }
};

// Componente principal del juego
interface MonsterEscapeGameProps {
  onComplete?: () => void;
  onGameWon?: () => void;
  onGameOver?: () => void;
  difficulty?: 'easy' | 'medium' | 'hard';
  reducedTarget?: boolean;
}

const MonsterEscapeGame: React.FC<MonsterEscapeGameProps> = ({ 
  onComplete, 
  onGameWon,
  onGameOver,
  difficulty = 'medium',
  reducedTarget = false
}) => {
  const handleGameWon = () => {
    if (onComplete) onComplete();
    if (onGameWon) onGameWon();
  };
  
  // Configurar dificultad
  const getInitialState = (): GameState => {
    // Ajustar tamaño del tablero según resolución del dispositivo
    // Dispositivos móviles usan tableros más pequeños para celdas más grandes
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth < 360; // Pantallas muy pequeñas
    
    const boardSize = isSmallScreen ? 5 : (isMobileDevice ? 6 : 10); // Reducir a 5x5 o 6x6 en móviles
    
    const playerPos = { x: Math.floor(boardSize / 2), y: Math.floor(boardSize / 2) };
    
    let pursuerCount = 5;
    let targetMoves = reducedTarget ? 15 : 20;
    
    // Ajustar número de perseguidores y movimientos objetivo según tamaño del tablero
    if (boardSize <= 5) {
      pursuerCount = reducedTarget ? 1 : 2;
      targetMoves = reducedTarget ? 10 : 15;
    } else if (boardSize <= 7) {
      pursuerCount = reducedTarget ? 2 : 3;
      targetMoves = reducedTarget ? 12 : 18;
    } else {
      pursuerCount = reducedTarget ? 3 : 5;
    }
    
    // Ajustar según dificultad
    switch(difficulty) {
      case 'easy':
        pursuerCount = Math.max(1, pursuerCount - 1);
        targetMoves = reducedTarget ? Math.floor(targetMoves * 0.8) : targetMoves;
        break;
      case 'hard':
        pursuerCount = pursuerCount + 1;
        targetMoves = reducedTarget ? targetMoves : Math.floor(targetMoves * 1.2);
        break;
      default:
        break;
    }
    
    const pursuersPositions = generateRandomPositions(boardSize, pursuerCount, playerPos);
    
    console.log('Inicializando estado del juego', {
      boardSize,
      targetMoves,
      pursuerCount
    });
    
    return {
      playerPos,
      previousPlayerPos: null,
      playerDirection: null,
      pursuersPositions,
      gameOver: false,
      gameWon: false,
      movesCount: 0, // Aseguramos que este valor sea 0
      boardSize,
      targetMoves
    };
  };
  
  const [state, dispatch] = useReducer(gameReducer, null, getInitialState);
  const [instructionsVisible, setInstructionsVisible] = useState(true);
  // Nuevo estado para manejar la orientación
  const [isLandscape, setIsLandscape] = useState(window.innerWidth > window.innerHeight);
  // Estado para detectar si es un dispositivo móvil
  const [isMobile, setIsMobile] = useState(false);
  // Estado para la última dirección de movimiento (para animaciones)
  const [lastMoveDirection, setLastMoveDirection] = useState<GameState['playerDirection']>(null);

  // Detectar orientación y tipo de dispositivo
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    // Detectar si es un dispositivo móvil
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    handleResize();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Resetear el juego con la configuración actualizada
  const handleReset = () => {
    dispatch({ type: 'RESET_GAME' });
    
    // Después del reset, actualizamos manualmente el targetMoves según la dificultad y reducedTarget
    setTimeout(() => {
      let targetMoves = reducedTarget ? 15 : 20;
      
      switch(difficulty) {
        case 'easy':
          targetMoves = reducedTarget ? 12 : 15;
          break;
        case 'hard':
          targetMoves = reducedTarget ? 20 : 25;
          break;
        default:
          break;
      }
      
      // Actualizar el estado con el nuevo targetMoves
      dispatch({ 
        type: 'UPDATE_TARGET_MOVES', 
        targetMoves 
      });
    }, 0);
  };

  // Función para manejar movimientos con feedback
  const handleMoveAction = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    setLastMoveDirection(direction);
    dispatch({ type: 'MOVE_PLAYER', direction });
  };

  // Manejar juego perdido
  useEffect(() => {
    if (state.gameOver && onGameOver) {
      onGameOver();
    }
  }, [state.gameOver, onGameOver]);
  
  // Manejar entrada de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.gameOver || state.gameWon) return;
      
      let direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null = null;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          direction = 'UP';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          direction = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          direction = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          direction = 'RIGHT';
          break;
      }
      
      if (direction) {
        e.preventDefault();
        handleMoveAction(direction);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.gameOver, state.gameWon, handleMoveAction]);
  
  // Mover perseguidores después de que el jugador se mueve
  useEffect(() => {
    if (!state.gameOver && !state.gameWon) {
      const timeoutId = setTimeout(() => {
        dispatch({ type: 'MOVE_PURSUERS' });
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [state.playerPos, state.gameOver, state.gameWon, dispatch]);
  
  // Notificar cuando el juego es ganado
  useEffect(() => {
    if (state.gameWon) {
      handleGameWon();
    }
  }, [state.gameWon, handleGameWon]);

  const hideInstructions = () => {
    setInstructionsVisible(false);
  };
  
  // Determinar el estilo de fondo basado en si es móvil
  const backgroundStyle = {
    backgroundImage: 'url("/images/old-paper-bg.jpg")',
    backgroundSize: 'cover',
    backgroundBlendMode: 'multiply' as const
  };
  
  // Contenedor específico para orientación
  const gameContainerClass = isLandscape && isMobile
    ? "flex flex-row gap-4 items-start justify-center"
    : "flex flex-col gap-4";

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      <div
        className="bg-amber-100 p-0 sm:p-1 rounded-lg border-2 border-amber-700 shadow-md overflow-hidden relative"
        style={isMobile ? { backgroundColor: '#fff8e1' } : backgroundStyle}
      >
        <h3 className="text-lg sm:text-xl text-amber-900 mb-0 sm:mb-1 font-serif font-bold">La Huida del Marqués</h3>
        
        {instructionsVisible && (
          <div className="bg-amber-50 bg-opacity-80 p-1 sm:p-2 rounded-md mb-0 sm:mb-2 text-amber-800 text-sm border border-amber-300">
            <h4 className="font-medium mb-1 font-serif">Instrucciones:</h4>
            <p>Toca directamente las casillas adyacentes para moverte.</p>
            <p>Debes sobrevivir {state.targetMoves} movimientos sin ser atrapado por los secuaces del Marqués.</p>
            <p>Los perseguidores te seguirán con cada movimiento que hagas.</p>
            <button 
              onClick={hideInstructions}
              className="mt-2 bg-amber-700 text-amber-50 px-3 py-1 rounded-md text-xs hover:bg-amber-800 font-serif"
            >
              Entendido
            </button>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-0 sm:mb-1">
          <div className="text-amber-900 font-serif text-lg">
            Pasos: <span className="font-bold" data-testid="moves-count">{state.movesCount}/{state.targetMoves}</span>
          </div>
          <button 
            onClick={handleReset}
            className="bg-amber-700 text-amber-50 px-3 py-1 rounded-md text-sm hover:bg-amber-800 border border-amber-600 font-serif"
          >
            Reiniciar
          </button>
        </div>
        
        {/* Mensaje de ayuda para dispositivos móviles */}
        {isMobile && (
          <div className="mb-0 text-sm text-amber-800 text-center font-serif">
            <p>Toca una casilla adyacente para moverte</p>
          </div>
        )}
        
        <div className="flex justify-center items-center px-0 sm:px-2 mt-0 sm:mt-1">
          <div className="w-full mx-auto" style={isMobile ? { maxWidth: `${state.boardSize * 40}px` } : undefined}>
            <Board
              onCellClick={(x, y, direction) => handleMoveAction(direction)}
              isMobile={isMobile}
              lastMoveDirection={lastMoveDirection}
            />
          </div>
        </div>
        
        {state.gameOver && (
          <GameOverOverlay onRetry={handleReset} />
        )}
        
        {state.gameWon && (
          <GameWonOverlay onContinue={handleGameWon} />
        )}
      </div>
    </GameContext.Provider>
  );
};

// Componente para el overlay de Game Over
const GameOverOverlay: React.FC<{ onRetry: () => void }> = ({ onRetry }) => {
  const backgroundStyles = { 
    backgroundImage: 'url("/images/old-paper-bg.jpg")',
    backgroundSize: 'cover',
    backgroundBlendMode: 'multiply' as const
  };
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
      <div className="bg-amber-50 p-6 rounded-lg shadow-xl text-center border-2 border-amber-700" style={backgroundStyles}>
        <h3 className="text-xl text-red-800 mb-3 font-serif">¡Te han atrapado!</h3>
        <p className="mb-4 text-amber-900 font-serif">Los secuaces del Marqués de Albaida te han alcanzado.</p>
        <button
          onClick={onRetry}
          className="bg-amber-700 text-amber-50 px-4 py-2 rounded-md hover:bg-amber-800 border border-amber-600 font-serif"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
};

// Componente para el overlay de Game Won
const GameWonOverlay: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  const backgroundStyles = { 
    backgroundImage: 'url("/images/old-paper-bg.jpg")',
    backgroundSize: 'cover',
    backgroundBlendMode: 'multiply' as const
  };
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
      <div className="bg-amber-50 p-6 rounded-lg shadow-xl text-center border-2 border-amber-700" style={backgroundStyles}>
        <h3 className="text-xl text-green-800 mb-3 font-serif">¡Has escapado!</h3>
        <p className="mb-4 text-amber-900 font-serif">Has logrado despistar a tus perseguidores.</p>
        <button
          onClick={onContinue}
          className="bg-green-700 text-amber-50 px-4 py-2 rounded-md hover:bg-green-800 border border-green-600 font-serif"
        >
          Continuar la búsqueda
        </button>
      </div>
    </div>
  );
};

// Componente del tablero con propiedades mejoradas
interface BoardProps {
  onCellClick: (x: number, y: number, direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
  isMobile: boolean;
  lastMoveDirection: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null;
  className?: string;
}

const Board: React.FC<BoardProps> = ({ onCellClick, isMobile, lastMoveDirection, className }) => {
  const { state } = useGameState();
  
  // Función para manejar clicks/toques en las celdas del tablero
  const handleCellClick = (x: number, y: number) => {
    if (state.gameOver || state.gameWon) {
      console.log('Juego terminado, no se procesan clics');
      return;
    }
    
    // No permitir clicks en celdas que ya tienen perseguidores
    const hasPursuer = state.pursuersPositions.some(pos => pos.x === x && pos.y === y);
    if (hasPursuer) {
      console.log('Celda con perseguidor, no se puede mover ahí');
      return;
    }
    
    // Calcular la dirección relativa al jugador
    const playerX = state.playerPos.x;
    const playerY = state.playerPos.y;
    
    // Determinar si el movimiento es válido (solo permitir movimientos adyacentes)
    const isAdjacent = 
      (Math.abs(x - playerX) === 1 && y === playerY) || // Horizontal
      (Math.abs(y - playerY) === 1 && x === playerX);   // Vertical
    
    if (!isAdjacent) {
      console.log('Movimiento no adyacente, ignorando');
      return;
    }
    
    // Determinar la dirección del movimiento
    let direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
    
    if (x < playerX) direction = 'LEFT';
    else if (x > playerX) direction = 'RIGHT';
    else if (y < playerY) direction = 'UP';
    else direction = 'DOWN';
    
    console.log('Procesando clic en celda', {x, y, direction});
    
    // Llamar al callback de clic con la dirección
    onCellClick(x, y, direction);
  };
  
  // Generar celdas del tablero
  const renderCells = () => {
    const cells: React.ReactNode[] = [];
    
    for (let y = 0; y < state.boardSize; y++) {
      for (let x = 0; x < state.boardSize; x++) {
        const isPlayer = state.playerPos.x === x && state.playerPos.y === y;
        const pursuerIndex = state.pursuersPositions.findIndex(
          pos => pos.x === x && pos.y === y
        );
        
        // Determinar si la celda es adyacente al jugador
        const isAdjacentToPlayer = 
          !isPlayer && 
          (pursuerIndex === -1) && 
          ((Math.abs(x - state.playerPos.x) === 1 && y === state.playerPos.y) || 
           (Math.abs(y - state.playerPos.y) === 1 && x === state.playerPos.x));
        
        cells.push(
          <Cell 
            key={`${x}-${y}`} 
            isPlayer={isPlayer} 
            pursuerIndex={pursuerIndex}
            isAdjacentToPlayer={isAdjacentToPlayer}
            x={x}
            y={y}
            onClick={handleCellClick}
            isMobile={isMobile}
            isMovingCell={
              isPlayer && lastMoveDirection !== null || 
              (isAdjacentToPlayer && 
               ((lastMoveDirection === 'UP' && x === state.playerPos.x && y === state.playerPos.y - 1) ||
                (lastMoveDirection === 'DOWN' && x === state.playerPos.x && y === state.playerPos.y + 1) ||
                (lastMoveDirection === 'LEFT' && x === state.playerPos.x - 1 && y === state.playerPos.y) ||
                (lastMoveDirection === 'RIGHT' && x === state.playerPos.x + 1 && y === state.playerPos.y)))
            }
          />
        );
      }
    }
    
    return cells;
  };
  
  // Calcular tamaño del tablero basado en el tamaño de pantalla
  const cellGap = isMobile ? "0px" : "1px";
  
  // Simplificar fondo en dispositivos móviles para mejor rendimiento
  const backgroundStyles = isMobile 
    ? { backgroundColor: '#e67e22' } // Color sólido para móviles
    : { 
        backgroundImage: 'url("/images/map-texture.jpg")',
        backgroundSize: 'cover',
        backgroundBlendMode: 'multiply' as const
      };
  
  return (
    <div
      className={`grid bg-amber-600 p-0 sm:p-0.5 md:p-1 rounded-md border-2 border-amber-800 shadow-lg aspect-square ${className || ''}`}
      style={{
        gridTemplateColumns: `repeat(${state.boardSize}, 1fr)`,
        gridGap: cellGap,
        ...backgroundStyles
      }}
      role="grid"
      aria-label="Tablero de juego"
    >
      {renderCells()}
    </div>
  );
};

// Componente de celda individual mejorado
interface CellProps {
  isPlayer: boolean;
  pursuerIndex: number;
  isAdjacentToPlayer: boolean;
  x: number;
  y: number;
  onClick: (x: number, y: number) => void;
  isMobile: boolean;
  isMovingCell: boolean;
}

const Cell: React.FC<CellProps> = ({ 
  isPlayer, 
  pursuerIndex, 
  isAdjacentToPlayer, 
  x, 
  y, 
  onClick,
  isMobile,
  isMovingCell
}) => {
  const { state } = useGameState(); // Obtener posición del jugador
  let cellContent;
  let bgColor = "bg-amber-50 bg-opacity-95"; // Aumentado contraste
  let borderStyle = "border border-amber-400";
  let emojiSize = isMobile ? "text-base" : "text-sm";
  let animation = isMovingCell ? "animate-pulse" : "";
  
  if (isPlayer) {
    cellContent = "👒"; // Sombrero como símbolo para Clara
    emojiSize = isMobile ? "text-base" : "text-sm"; // Más grande para el jugador
    bgColor = "bg-yellow-200 bg-opacity-95"; // Más contraste
    borderStyle = "border-2 border-yellow-600";
    animation = "shadow-lg " + animation;
  } else if (pursuerIndex >= 0) {
    cellContent = "👺"; // Emoji de ogro para los perseguidores
    emojiSize = isMobile ? "text-base" : "text-sm"; // Ajuste perseguidores
    bgColor = "bg-red-300 bg-opacity-95"; // Más contraste
    borderStyle = "border-2 border-red-600";
  } else if (isAdjacentToPlayer) {
    // Destacar celdas adyacentes y mostrar flecha según dirección respecto al jugador
    bgColor = "bg-green-200 hover:bg-green-300 bg-opacity-95";
    borderStyle = "border-2 border-green-600";
    const playerX = state.playerPos.x;
    const playerY = state.playerPos.y;
    if (x < playerX) cellContent = isMobile ? "⬅️" : "←";
    else if (x > playerX) cellContent = isMobile ? "➡️" : "→";
    else if (y < playerY) cellContent = isMobile ? "⬆️" : "↑";
    else if (y > playerY) cellContent = isMobile ? "⬇️" : "↓";
    emojiSize = isMobile ? "text-base" : "text-xs";
  }
  
  const handleClick = () => {
    onClick(x, y);
  };
  
  return (
    <button 
      className={`flex items-center justify-center ${bgColor} ${borderStyle} ${emojiSize} ${animation} aspect-square font-bold rounded-sm relative
        ${isPlayer ? 'text-amber-900' : (pursuerIndex >= 0 ? 'text-red-900' : '')}
        ${isAdjacentToPlayer ? 'cursor-pointer active:scale-95' : ''}
        transition-all duration-150 ${isMobile ? 'shadow-md' : 'shadow-sm'}`}
      data-pos={`${x},${y}`}
      onClick={isAdjacentToPlayer ? handleClick : undefined}
      disabled={!isAdjacentToPlayer}
      role={isAdjacentToPlayer ? "button" : "cell"}
      aria-label={isAdjacentToPlayer ? `Mover a posición ${x},${y}` : undefined}
      aria-disabled={!isAdjacentToPlayer}
      tabIndex={isAdjacentToPlayer ? 0 : -1}
    >
      {cellContent}
    </button>
  );
};

export default MonsterEscapeGame; 