import React, { useState, useEffect, useCallback } from 'react';
import { useDebug } from '../context/DebugContext';

interface MinesweeperProps {
  onGameWon: () => void;
  difficulty?: 'easy' | 'medium' | 'hard';
  maxTime?: number; // Tiempo máximo en segundos
}

// Configuraciones de dificultad
const difficultySettings = {
  easy: { rows: 6, cols: 6, mines: 5 },
  medium: { rows: 8, cols: 8, mines: 10 },
  hard: { rows: 10, cols: 10, mines: 20 }
};

type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

const Minesweeper: React.FC<MinesweeperProps> = ({ 
  onGameWon, 
  difficulty = 'easy',
  maxTime = 120 // 2 minutos por defecto
}) => {
  const { isDebugEnabled } = useDebug();
  const settings = difficultySettings[difficulty];
  
  const [grid, setGrid] = useState<CellState[][]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [flagMode, setFlagMode] = useState(false);
  const [remainingFlags, setRemainingFlags] = useState(settings.mines);
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [messageText, setMessageText] = useState<string>("");
  const [showInstructions, setShowInstructions] = useState(true);
  const [revealedCells, setRevealedCells] = useState(0); // Contador de celdas reveladas

  // Inicializar el tablero
  const initializeGrid = useCallback(() => {
    // Crear un tablero vacío
    const newGrid: CellState[][] = Array(settings.rows).fill(null).map(() => 
      Array(settings.cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0
      }))
    );
    
    // Colocar minas aleatoriamente
    let minesPlaced = 0;
    while (minesPlaced < settings.mines) {
      const row = Math.floor(Math.random() * settings.rows);
      const col = Math.floor(Math.random() * settings.cols);
      
      if (!newGrid[row][col].isMine) {
        newGrid[row][col].isMine = true;
        minesPlaced++;
      }
    }
    
    // Calcular minas adyacentes para cada celda
    for (let row = 0; row < settings.rows; row++) {
      for (let col = 0; col < settings.cols; col++) {
        if (!newGrid[row][col].isMine) {
          let count = 0;
          // Revisar las 8 celdas adyacentes
          for (let r = Math.max(0, row - 1); r <= Math.min(settings.rows - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(settings.cols - 1, col + 1); c++) {
              if (!(r === row && c === col) && newGrid[r][c].isMine) {
                count++;
              }
            }
          }
          newGrid[row][col].adjacentMines = count;
        }
      }
    }
    
    return newGrid;
  }, [settings.rows, settings.cols, settings.mines]);

  // Inicializar el juego
  useEffect(() => {
    setGrid(initializeGrid());
    setRemainingFlags(settings.mines);
    setGameStatus('playing');
    setTimeLeft(maxTime);
    setMessageText("");
    setRevealedCells(0);
  }, [initializeGrid, settings.mines, maxTime]);
  
  // Temporizador
  useEffect(() => {
    if (gameStatus !== 'playing' || !timeLeft) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameStatus('lost');
          setMessageText("¡Se acabó el tiempo!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStatus, timeLeft]);

  // Revelar celda y sus vecinas si tiene 0 minas adyacentes
  const revealCell = (row: number, col: number, newGrid: CellState[][], revealCount = 0) => {
    if (
      row < 0 || row >= settings.rows || 
      col < 0 || col >= settings.cols || 
      newGrid[row][col].isRevealed || 
      newGrid[row][col].isFlagged
    ) {
      return { grid: newGrid, count: revealCount };
    }
    
    if (!newGrid[row][col].isRevealed) {
      newGrid[row][col].isRevealed = true;
      revealCount++;
    }
    
    if (newGrid[row][col].adjacentMines === 0) {
      // Revelar todas las celdas adyacentes
      for (let r = Math.max(0, row - 1); r <= Math.min(settings.rows - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(settings.cols - 1, col + 1); c++) {
          if (!(r === row && c === col) && !newGrid[r][c].isRevealed) {
            const result = revealCell(r, c, newGrid, revealCount);
            newGrid = result.grid;
            revealCount = result.count;
          }
        }
      }
    }
    
    return { grid: newGrid, count: revealCount };
  };

  // Verificar si el juego ha sido ganado
  const checkWinCondition = (grid: CellState[][]) => {
    for (let row = 0; row < settings.rows; row++) {
      for (let col = 0; col < settings.cols; col++) {
        // Si hay una celda sin revelar que no es una mina, aún no se ha ganado
        if (!grid[row][col].isRevealed && !grid[row][col].isMine) {
          return false;
        }
      }
    }
    return true;
  };

  // Revelar todas las minas (al perder)
  const revealAllMines = (grid: CellState[][]) => {
    const newGrid = [...grid];
    
    for (let row = 0; row < settings.rows; row++) {
      for (let col = 0; col < settings.cols; col++) {
        if (newGrid[row][col].isMine) {
          newGrid[row][col].isRevealed = true;
        }
      }
    }
    
    return newGrid;
  };

  // Manejar clic en una celda
  const handleCellClick = (row: number, col: number) => {
    if (gameStatus !== 'playing' || grid[row][col].isRevealed) return;
    
    // Si está en modo bandera, alternar bandera
    if (flagMode) {
      handleRightClick(row, col);
      return;
    }
    
    // Si la celda tiene una bandera, no hacer nada
    if (grid[row][col].isFlagged) return;
    
    const newGrid = [...grid];
    
    // Si es una mina, juego perdido
    if (newGrid[row][col].isMine) {
      newGrid[row][col].isRevealed = true;
      setGrid(revealAllMines(newGrid));
      setGameStatus('lost');
      setMessageText("¡Has encontrado una mina!");
      return;
    }
    
    // Revelar esta celda y las adyacentes si tiene 0 minas
    const { grid: updatedGrid, count } = revealCell(row, col, newGrid, 0);
    setGrid(updatedGrid);
    setRevealedCells(prev => prev + count);
    
    // Verificar si se ha ganado
    if (checkWinCondition(updatedGrid)) {
      setGameStatus('won');
      setMessageText("¡Felicidades! Has despejado todas las celdas seguras.");
      // Notificar al componente padre que se ha ganado
      setTimeout(() => {
        onGameWon();
      }, 1500);
    }
  };

  // Manejar el click derecho (colocar/quitar bandera)
  const handleRightClick = (row: number, col: number) => {
    if (gameStatus !== 'playing' || grid[row][col].isRevealed) return;
    
    const newGrid = [...grid];
    
    // Si ya tiene bandera, quitarla
    if (newGrid[row][col].isFlagged) {
      newGrid[row][col].isFlagged = false;
      setRemainingFlags(prev => prev + 1);
    } 
    // Si no tiene bandera y quedan banderas, ponerla
    else if (remainingFlags > 0) {
      newGrid[row][col].isFlagged = true;
      setRemainingFlags(prev => prev - 1);
    }
    // Si no quedan banderas, mostrar mensaje
    else {
      setMessageText("¡No quedan banderas disponibles!");
      setTimeout(() => setMessageText(""), 2000);
      return;
    }
    
    setGrid(newGrid);
  };
  
  // Soporte para eventos táctiles y prevención de contexto
  const handleTouchStart = (row: number, col: number, e: React.TouchEvent) => {
    e.preventDefault(); // Prevenir zoom y otros comportamientos predeterminados
    
    // Iniciar temporizador para detectar pulsación larga
    const timer = setTimeout(() => {
      handleRightClick(row, col);
    }, 500); // 500ms para considerar pulsación larga
    
    setLongPressTimer(timer);
  };
  
  const handleTouchEnd = (row: number, col: number, e: React.TouchEvent) => {
    e.preventDefault();
    
    // Si el temporizador existe, limpiarlo y procesar como clic normal
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
      
      // Solo procesar clic si fue un toque corto
      handleCellClick(row, col);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    
    // Si el usuario mueve el dedo, cancelar cualquier acción
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // Prevenir menú contextual en navegadores
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Renderizar una celda
  const renderCell = (row: number, col: number) => {
    const cell = grid[row][col];
    
    let cellContent = '';
    let cellClass = 'w-9 h-9 flex justify-center items-center border border-gray-400 text-base ';
    
    if (cell.isRevealed) {
      if (cell.isMine) {
        cellContent = '💣';
        cellClass += 'bg-red-500 text-black';
      } else {
        if (cell.adjacentMines > 0) {
          cellContent = cell.adjacentMines.toString();
          
          // Colores para diferentes números
          const numberColors = [
            '', // 0 minas no muestra número
            'text-blue-600', // 1 mina
            'text-green-600', // 2 minas
            'text-red-600', // 3 minas
            'text-purple-700', // 4 minas
            'text-orange-700', // 5 minas
            'text-teal-700', // 6 minas
            'text-black', // 7 minas
            'text-gray-700' // 8 minas
          ];
          
          cellClass += `bg-gray-200 ${numberColors[cell.adjacentMines]} font-bold`;
        } else {
          cellClass += 'bg-gray-200';
        }
      }
    } else if (cell.isFlagged) {
      cellContent = '🚩';
      cellClass += 'bg-amber-100';
    } else {
      cellClass += 'bg-amber-300 hover:bg-amber-200 cursor-pointer';
      
      // En modo debug, mostrar posiciones de las minas
      if (isDebugEnabled && cell.isMine) {
        cellClass += ' ring-1 ring-inset ring-red-500';
      }
    }
    
    return (
      <div
        key={`cell-${row}-${col}`}
        className={cellClass}
        onClick={() => handleCellClick(row, col)}
        onContextMenu={(e) => {
          e.preventDefault();
          handleRightClick(row, col);
        }}
        onTouchStart={(e) => handleTouchStart(row, col, e)}
        onTouchEnd={(e) => handleTouchEnd(row, col, e)}
        onTouchMove={handleTouchMove}
      >
        {cellContent}
      </div>
    );
  };

  return (
    <div className="bg-amber-50 rounded-lg shadow-md p-3 w-full flex flex-col items-center">
      <h3 className="text-center text-lg font-serif font-bold mb-1 text-amber-800">
        Buscaminas Antiguo
        {isDebugEnabled && (
          <span className="ml-2 text-xs font-normal text-red-600">(Modo Debug)</span>
        )}
      </h3>
      
      {showInstructions && (
        <div className="mb-4 p-3 bg-amber-100 rounded-md text-sm max-w-[280px] mx-auto w-full">
          <p className="text-amber-800 mb-2 font-medium">
            <span className="font-bold">Instrucciones:</span> Despeja el tablero sin detonar las minas.
          </p>
          <ul className="list-disc list-inside text-amber-700 space-y-1 mb-2">
            <li>Toca una celda para revelarla</li>
            <li>Mantén presionado para marcar posibles minas</li>
            <li>Los números indican minas cercanas</li>
          </ul>
          <button 
            className="w-full mt-1 text-sm bg-amber-200 py-1.5 rounded font-medium hover:bg-amber-300 transition-colors"
            onClick={() => setShowInstructions(false)}
          >
            Entendido
          </button>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-3 w-full max-w-[280px] mx-auto">
        <div className="bg-amber-100 p-1.5 rounded-md text-sm">
          <span className="font-medium text-amber-800">
            🚩 {remainingFlags}/{settings.mines}
          </span>
        </div>
        
        <div className="bg-amber-100 p-1.5 rounded-md text-sm">
          <span className="font-medium text-amber-800">
            ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
        
        <button
          className={`px-3 py-1.5 rounded-md text-sm ${
            flagMode 
              ? 'bg-amber-600 text-white' 
              : 'bg-amber-200 text-amber-800'
          }`}
          onClick={() => setFlagMode(!flagMode)}
        >
          {flagMode ? '🚩 Modo' : '🔍 Modo'}
        </button>
      </div>
      
      {messageText && (
        <div className="mb-3 text-center p-2 bg-amber-100 rounded text-sm text-amber-800 max-w-[280px] mx-auto w-full">
          {messageText}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-0.5 bg-gray-400 p-0.5 rounded-md mx-auto">
        {grid.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex justify-center gap-0.5">
            {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
          </div>
        ))}
      </div>
      
      {gameStatus !== 'playing' && (
        <div className="mt-4 flex justify-center">
          <button
            className="px-5 py-2 bg-amber-500 text-white font-medium rounded-md shadow-md hover:bg-amber-600 transition-colors"
            onClick={() => {
              setGrid(initializeGrid());
              setRemainingFlags(settings.mines);
              setGameStatus('playing');
              setTimeLeft(maxTime);
              setMessageText("");
              setRevealedCells(0);
            }}
          >
            Jugar de nuevo
          </button>
        </div>
      )}
      
      {isDebugEnabled && (
        <div className="mt-1 p-1 bg-black/10 rounded-md text-xs">
          <details>
            <summary className="font-bold text-amber-800 cursor-pointer">Debug</summary>
            <p className="text-amber-700 text-[10px]">
              Estado: {gameStatus} | Minas: {settings.mines} | Banderas: {remainingFlags}
            </p>
            <p className="text-amber-700 text-[10px]">
              Celdas reveladas: {revealedCells} de {(settings.rows * settings.cols) - settings.mines} seguras
            </p>
            <button
              className="mt-0.5 px-1 py-0.5 bg-amber-200 rounded text-[10px] w-full"
              onClick={() => onGameWon()}
            >
              Simular Victoria
            </button>
          </details>
        </div>
      )}
    </div>
  );
};

export default Minesweeper; 