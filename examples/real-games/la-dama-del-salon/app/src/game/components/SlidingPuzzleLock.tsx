import React, { useState, useEffect, useRef } from 'react';
import { useDebug } from '../context/DebugContext';

interface SlidingPuzzleLockProps {
  locked: boolean;
  onUnlock: () => void;
}

// Tipos de bloques
type BlockType = 'pasador' | 'bloque' | 'salida';

// Tipo para representar un bloque del puzzle
type Block = {
  id: string;
  type: BlockType;
  width: number; // En unidades (1 o 2)
  height: number; // En unidades (1 o 2)
  x: number; // Posición X (0-3)
  y: number; // Posición Y (0-4)
  color: string;
  movable: boolean;
};

// Tipo para representar confeti
type Confetti = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  speed: number;
};

// Para el sistema de arrastrar
type DragState = {
  isDragging: boolean;
  blockId: string | null;
  startX: number;
  startY: number;
  blockStartX: number;
  blockStartY: number;
  currentDirection: 'horizontal' | 'vertical' | null;
};

// Dimensiones del tablero
const BOARD_WIDTH = 4;
const BOARD_HEIGHT = 5;
const CELL_SIZE = 60; // pixels

const SlidingPuzzleLock: React.FC<SlidingPuzzleLockProps> = ({ locked, onUnlock }) => {
  // El estado del puzzle son los bloques
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(!locked);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [exitAnimation, setExitAnimation] = useState(false);
  const { isDebugEnabled } = useDebug(); // Usar el contexto de depuración centralizado
  
  // Estado para el arrastre
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    blockId: null,
    startX: 0,
    startY: 0,
    blockStartX: 0,
    blockStartY: 0,
    currentDirection: null
  });
  
  // Refs para el tablero y los bloques
  const boardRef = useRef<HTMLDivElement>(null);
  
  // Inicializar el puzzle cuando cambia el estado de locked
  useEffect(() => {
    if (locked) {
      initializePuzzle();
    } else {
      setIsUnlocked(true);
    }
  }, [locked]);
  
  // Comprobar si el puzzle está resuelto
  const checkIfPuzzleSolved = () => {
    const pasador = blocks.find(b => b.type === 'pasador');
    const salida = blocks.find(b => b.type === 'salida');
    
    if (!pasador || !salida) return false;
    
    // Comprobar si el pasador ha salido completamente por la salida
    // El pasador está alineado con la salida horizontalmente
    // y su borde inferior está por debajo de la posición Y de la salida
    const pasadorBottomY = pasador.y + pasador.height;
    return pasador.x === salida.x && pasadorBottomY > salida.y + 0.5; // Requiere que el pasador esté más de la mitad fuera
  };
  
  // Comprobar si el puzzle está resuelto después de cada movimiento
  useEffect(() => {
    if (blocks.length > 0 && !isUnlocked) {
      const pasador = blocks.find(block => block.type === 'pasador');
      const salida = blocks.find(block => block.type === 'salida');
      
      // Verificar si el pasador ha llegado a la salida
      if (pasador && salida) {
        if (isDebugEnabled) {
          console.log(`Pasador en (${pasador.x}, ${pasador.y}), Salida en (${salida.x}, ${salida.y})`);
        }
        
        // Condición de victoria modificada:
        // El pasador debe estar en la misma columna X que la salida y su base debe estar más allá de la salida
        // lo que significa que el pasador ha salido completamente del tablero
        const pasadorBottomY = pasador.y + pasador.height;
        
        if (pasador.x === salida.x && pasadorBottomY > salida.y + 0.5) {
          if (isDebugEnabled) {
            console.log("¡Puzzle resuelto! El pasador ha salido completamente. Desbloqueando...");
          }
          
          // Iniciar animación de salida
          setExitAnimation(true);
          
          // Animar el pasador saliendo completamente
          const newBlocks = [...blocks];
          const pasadorIndex = newBlocks.findIndex(b => b.type === 'pasador');
          
          if (pasadorIndex !== -1) {
            // Establecer nueva posición para la animación de salida
            const animatedPasador = { 
              ...newBlocks[pasadorIndex],
              y: Math.min(BOARD_HEIGHT, salida.y + 1.2), // Posicionar para que sobresalga visiblemente pero no demasiado
            };
            newBlocks[pasadorIndex] = animatedPasador;
            setBlocks(newBlocks);
            
            // Animación adicional para seguir moviendo el pasador fuera del tablero
            setTimeout(() => {
              const finalPasador = { 
                ...animatedPasador,
                y: BOARD_HEIGHT + 0.5, // Mover aún más abajo
              };
              setBlocks(prevBlocks => {
                const updatedBlocks = [...prevBlocks];
                const idx = updatedBlocks.findIndex(b => b.type === 'pasador');
                if (idx !== -1) {
                  updatedBlocks[idx] = finalPasador;
                }
                return updatedBlocks;
              });
            }, 300); // Tiempo reducido para una animación más rápida
          }
          
          // Pequeño retraso antes de mostrar la animación completa
          setTimeout(() => {
            // Marcar como desbloqueado
            setIsUnlocked(true);
            
            // Lanzar confeti
            setShowConfetti(true);
            createConfetti();
            
            // Llamar a onUnlock con un retraso mínimo para ver el confeti
            setTimeout(() => {
              onUnlock();
            }, 800); // Tiempo reducido para avanzar más rápido
          }, 500); // Tiempo reducido para una animación más rápida
        }
      }
    }
  }, [blocks, isUnlocked, onUnlock, isDebugEnabled]);
  
  // Configurar handlers para arrastrar cuando el estado de drag cambia
  useEffect(() => {
    if (isUnlocked) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.blockId) return;
      
      const block = blocks.find(b => b.id === dragState.blockId);
      if (!block) return;
      
      const board = boardRef.current;
      if (!board) return;
      
      const boardRect = board.getBoundingClientRect();
      
      // Calcular posición en el tablero
      const offsetX = e.clientX - boardRect.left - dragState.startX;
      const offsetY = e.clientY - boardRect.top - dragState.startY;
      
      // Determinar dirección si no está establecida
      let direction = dragState.currentDirection;
      if (!direction && (Math.abs(offsetX) > 10 || Math.abs(offsetY) > 10)) {
        direction = Math.abs(offsetX) > Math.abs(offsetY) ? 'horizontal' : 'vertical';
        
        // Validar que la dirección sea compatible con la forma del bloque
        if (block.width > block.height && direction !== 'horizontal') {
          direction = 'horizontal'; // Forzar horizontal para bloques anchos
        } else if (block.height > block.width && direction !== 'vertical') {
          direction = 'vertical';   // Forzar vertical para bloques altos
        }
        
        setDragState(prev => ({ ...prev, currentDirection: direction }));
      }
      
      if (!direction) return;
      
      // Calcular nueva posición basada en la dirección
      let newX = dragState.blockStartX;
      let newY = dragState.blockStartY;
      
      // Solo mover en una dirección a la vez
      if (direction === 'horizontal') {
        const cellsToMove = Math.round(offsetX / CELL_SIZE);
        newX = dragState.blockStartX + cellsToMove;
        // Mantener la posición Y original
        newY = dragState.blockStartY;
      } else {
        const cellsToMove = Math.round(offsetY / CELL_SIZE);
        newY = dragState.blockStartY + cellsToMove;
        // Mantener la posición X original
        newX = dragState.blockStartX;
      }
      
      // Verificar límites y colisiones de manera más estricta
      if (canBlockMoveTo(dragState.blockId, newX, newY, blocks)) {
        // Solo mover si la posición es diferente
        if (newX !== block.x || newY !== block.y) {
          moveBlockTo(dragState.blockId, newX, newY);
        }
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!dragState.isDragging || !dragState.blockId) return;
      
      // Prevenir el scroll cuando se arrastra un bloque
      e.preventDefault();
      
      const block = blocks.find(b => b.id === dragState.blockId);
      if (!block) return;
      
      const board = boardRef.current;
      if (!board) return;
      
      const boardRect = board.getBoundingClientRect();
      const touch = e.touches[0]; // Usar el primer toque
      
      // Calcular posición en el tablero
      const offsetX = touch.clientX - boardRect.left - dragState.startX;
      const offsetY = touch.clientY - boardRect.top - dragState.startY;
      
      // Determinar dirección si no está establecida
      let direction = dragState.currentDirection;
      if (!direction && (Math.abs(offsetX) > 10 || Math.abs(offsetY) > 10)) {
        direction = Math.abs(offsetX) > Math.abs(offsetY) ? 'horizontal' : 'vertical';
        
        // Validar que la dirección sea compatible con la forma del bloque
        if (block.width > block.height && direction !== 'horizontal') {
          direction = 'horizontal'; // Forzar horizontal para bloques anchos
        } else if (block.height > block.width && direction !== 'vertical') {
          direction = 'vertical';   // Forzar vertical para bloques altos
        }
        
        setDragState(prev => ({ ...prev, currentDirection: direction }));
      }
      
      if (!direction) return;
      
      // Calcular nueva posición basada en la dirección
      let newX = dragState.blockStartX;
      let newY = dragState.blockStartY;
      
      // Solo mover en una dirección a la vez
      if (direction === 'horizontal') {
        const cellsToMove = Math.round(offsetX / CELL_SIZE);
        newX = dragState.blockStartX + cellsToMove;
        // Mantener la posición Y original
        newY = dragState.blockStartY;
      } else {
        const cellsToMove = Math.round(offsetY / CELL_SIZE);
        newY = dragState.blockStartY + cellsToMove;
        // Mantener la posición X original
        newX = dragState.blockStartX;
      }
      
      // Verificar límites y colisiones de manera más estricta
      if (canBlockMoveTo(dragState.blockId, newX, newY, blocks)) {
        // Solo mover si la posición es diferente
        if (newX !== block.x || newY !== block.y) {
          moveBlockTo(dragState.blockId, newX, newY);
        }
      }
    };
    
    const handleMouseUp = () => {
      if (dragState.isDragging && dragState.blockId) {
        // Check if puzzle is solved after a block is moved
        if (checkIfPuzzleSolved()) {
          setIsUnlocked(true);
          createConfetti();
          setTimeout(() => {
            if (onUnlock) {
              onUnlock();
            }
          }, 2000); // Delay for unlock animation
        }
      }
      
      // Reset dragging state
      setDragState({
        isDragging: false,
        blockId: null,
        startX: 0,
        startY: 0,
        blockStartX: 0,
        blockStartY: 0,
        currentDirection: null
      });
    };
    
    const handleTouchEnd = () => {
      // Usar la misma lógica que mouseUp
      if (dragState.isDragging && dragState.blockId) {
        // Check if puzzle is solved after a block is moved
        if (checkIfPuzzleSolved()) {
          setIsUnlocked(true);
          createConfetti();
          setTimeout(() => {
            if (onUnlock) {
              onUnlock();
            }
          }, 2000); // Delay for unlock animation
        }
      }
      
      // Reset dragging state
      setDragState({
        isDragging: false,
        blockId: null,
        startX: 0,
        startY: 0,
        blockStartX: 0,
        blockStartY: 0,
        currentDirection: null
      });
    };
    
    if (dragState.isDragging) {
      // Mouse events
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      // Touch events
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      document.addEventListener('touchcancel', handleTouchEnd);
    }
    
    return () => {
      // Mouse events
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Touch events
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [dragState, blocks, isUnlocked, onUnlock]);
  
  // Crear configuración inicial del puzzle
  const initializePuzzle = () => {
    // Configuración corregida para garantizar que sea resoluble
    const initialBlocks: Block[] = [
      // El pasador (bloque principal que hay que mover a la salida)
      {
        id: 'pasador',
        type: 'pasador',
        width: 1,
        height: 2,
        x: 1,
        y: 0,
        color: '#B45309', // amber-700
        movable: true
      },
      // La salida (donde debe llegar el pasador)
      {
        id: 'salida',
        type: 'salida',
        width: 1,
        height: 1,
        x: 1,
        y: 4,
        color: '#92400E', // amber-800
        movable: false
      },
      // Bloques horizontales (2x1)
      {
        id: 'bloque1',
        type: 'bloque',
        width: 2,
        height: 1,
        x: 0,
        y: 2,
        color: '#B45309', // amber-700
        movable: true
      },
      {
        id: 'bloque2',
        type: 'bloque',
        width: 2,
        height: 1,
        x: 2,
        y: 3,
        color: '#B45309', // amber-700
        movable: true
      },
      // Bloques verticales (1x2)
      {
        id: 'bloque4',
        type: 'bloque',
        width: 1,
        height: 2,
        x: 3,
        y: 0,
        color: '#D97706', // amber-600
        movable: true
      },
      {
        id: 'bloque5',
        type: 'bloque',
        width: 1,
        height: 2,
        x: 0,
        y: 0,
        color: '#D97706', // amber-600
        movable: true
      },
      {
        id: 'bloque6',
        type: 'bloque',
        width: 1,
        height: 2,
        x: 2,
        y: 0,
        color: '#D97706', // amber-600
        movable: true
      },
      // Bloques cuadrados (1x1)
      {
        id: 'bloque8',
        type: 'bloque',
        width: 1,
        height: 1,
        x: 3,
        y: 2,
        color: '#F59E0B', // amber-500
        movable: true
      },
      {
        id: 'bloque9',
        type: 'bloque',
        width: 1,
        height: 1,
        x: 3,
        y: 4,
        color: '#F59E0B', // amber-500
        movable: true
      },
      {
        id: 'bloque10',
        type: 'bloque',
        width: 1,
        height: 1,
        x: 1,
        y: 3,
        color: '#F59E0B', // amber-500
        movable: true
      },
      {
        id: 'bloque11',
        type: 'bloque',
        width: 1,
        height: 1,
        x: 0,
        y: 3,
        color: '#F59E0B', // amber-500
        movable: true
      }
    ];
    
    setBlocks(initialBlocks);
    setIsUnlocked(false);
  };
  
  // Crear partículas de confeti
  const createConfetti = () => {
    const colors = ['#FFD700', '#FFA500', '#FF4500', '#8B4513', '#D2691E', '#E53935', '#B71C1C'];
    const particles: Confetti[] = [];
    
    for (let i = 0; i < 100; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: -20 - Math.random() * 80,
        size: 5 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        speed: 1 + Math.random() * 3
      });
    }
    
    setConfetti(particles);
    
    // Animar el confeti
    const animateConfetti = () => {
      setConfetti(prev => 
        prev.map(particle => ({
          ...particle,
          y: particle.y + particle.speed,
          rotation: particle.rotation + particle.speed
        })).filter(particle => particle.y < 150) // Permitir que las partículas caigan más abajo
      );
    };
    
    // Animar las partículas cada 50ms
    const interval = setInterval(animateConfetti, 50);
    
    // Limpiar después de 3 segundos
    setTimeout(() => {
      clearInterval(interval);
      setShowConfetti(false);
      setConfetti([]);
    }, 3500);
  };
  
  // Verificar si una posición está ocupada por algún bloque
  const isPositionOccupied = (x: number, y: number, currentBlocks: Block[], excludeBlockId: string): boolean => {
    // Si la posición está fuera del tablero, considerarla como ocupada
    if (x < 0 || y < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) {
      return true;
    }
    
    return currentBlocks.some(block => {
      if (block.id === excludeBlockId) return false;
      
      // Comprobar si la posición está dentro del área del bloque
      const blockOccupiesX = x >= block.x && x < block.x + block.width;
      const blockOccupiesY = y >= block.y && y < block.y + block.height;
      
      return blockOccupiesX && blockOccupiesY;
    });
  };
  
  // Verificar si un bloque puede moverse a una posición
  const canBlockMoveTo = (blockId: string, newX: number, newY: number, currentBlocks: Block[]): boolean => {
    const block = currentBlocks.find(b => b.id === blockId);
    
    if (!block) return false;
    
    // Si intenta moverse a su posición actual, es válido
    if (block.x === newX && block.y === newY) {
      return true;
    }
    
    // Comprobar límites del tablero
    if (newX < 0 || newY < 0 || newX + block.width > BOARD_WIDTH) {
      return false;
    }
    
    // Caso especial para el pasador: puede salir por la salida
    if (block.type === 'pasador') {
      const salida = currentBlocks.find(b => b.type === 'salida');
      
      if (salida && newX === salida.x) {
        // No permitir salir por arriba
        if (newY < 0) {
          return false;
        }
        
        // Limitar cuánto puede salir por abajo
        if (newY + block.height > BOARD_HEIGHT + 1) {
          return false;
        }
        
        // Si el pasador está comenzando a salir, comprobar si hay bloques en el camino hasta la salida
        if (newY + block.height > salida.y) {
          for (let dx = 0; dx < block.width; dx++) {
            for (let dy = 0; dy < block.height; dy++) {
              // Solo verificar colisiones hasta la salida
              if (newY + dy < salida.y) {
                if (isPositionOccupied(newX + dx, newY + dy, currentBlocks, blockId)) {
                  return false;
                }
              }
            }
          }
          return true;
        }
      } else {
        // Si no está alineado con la salida, usar las reglas normales
        if (newY + block.height > BOARD_HEIGHT) {
          return false;
        }
      }
    } else {
      // Bloques normales no pueden salir del tablero
      if (newY + block.height > BOARD_HEIGHT) {
        return false;
      }
    }
    
    // Comprobar colisiones con otros bloques
    for (let dx = 0; dx < block.width; dx++) {
      for (let dy = 0; dy < block.height; dy++) {
        // Para el pasador, ignorar colisiones con la salida
        if (block.type === 'pasador') {
          const salida = currentBlocks.find(b => b.type === 'salida');
          if (salida && 
              newX + dx === salida.x && 
              newY + dy === salida.y) {
            continue;
          }
        }
        
        // Verificar si la posición está ocupada
        if (isPositionOccupied(newX + dx, newY + dy, currentBlocks, blockId)) {
          return false;
        }
      }
    }
    
    return true;
  };
  
  // Mover un bloque a una posición específica
  const moveBlockTo = (blockId: string, newX: number, newY: number) => {
    setBlocks(prevBlocks => {
      const newBlocks = [...prevBlocks];
      const blockIndex = newBlocks.findIndex(block => block.id === blockId);
      
      if (blockIndex === -1) return prevBlocks;
      
      const block = { ...newBlocks[blockIndex] };
      
      // Verificación adicional para evitar movimientos no válidos
      if (!canBlockMoveTo(blockId, newX, newY, newBlocks)) {
        if (isDebugEnabled) {
          console.log(`Movimiento no válido para bloque ${blockId} a (${newX}, ${newY})`);
        }
        return prevBlocks;
      }
      
      block.x = newX;
      block.y = newY;
      newBlocks[blockIndex] = block;
      
      // Verificación para asegurar que no haya superposiciones
      let hasOverlap = false;
      for (let i = 0; i < newBlocks.length; i++) {
        for (let j = i + 1; j < newBlocks.length; j++) {
          const a = newBlocks[i];
          const b = newBlocks[j];
          
          // Ignorar colisión entre pasador y salida
          if ((a.type === 'pasador' && b.type === 'salida') || 
              (b.type === 'pasador' && a.type === 'salida')) {
            continue;
          }
          
          // Verificar si hay superposición
          const overlapX = a.x < b.x + b.width && a.x + a.width > b.x;
          const overlapY = a.y < b.y + b.height && a.y + a.height > b.y;
          
          if (overlapX && overlapY) {
            hasOverlap = true;
            if (isDebugEnabled) {
              console.error(`¡Superposición detectada entre ${a.id} y ${b.id}!`);
            }
            break;
          }
        }
        if (hasOverlap) break;
      }
      
      if (hasOverlap) {
        if (isDebugEnabled) {
          console.error("¡Estado inválido! Hay bloques superpuestos. Revirtiendo movimiento.");
        }
        return prevBlocks;
      }
      
      return newBlocks;
    });
  };
  
  // Manejar el inicio del arrastre (mouse)
  const handleMouseDown = (e: React.MouseEvent, blockId: string) => {
    if (isUnlocked) return;
    
    const block = blocks.find(b => b.id === blockId);
    if (!block || !block.movable) return;
    
    const board = boardRef.current;
    if (!board) return;
    
    const boardRect = board.getBoundingClientRect();
    
    // Pre-determinar la dirección basada en la forma del bloque
    let forcedDirection: 'horizontal' | 'vertical' | null = null;
    if (block.width > block.height) {
      forcedDirection = 'horizontal'; // Bloques anchos solo pueden moverse horizontalmente
    } else if (block.height > block.width) {
      forcedDirection = 'vertical';   // Bloques altos solo pueden moverse verticalmente
    }
    
    setDragState({
      isDragging: true,
      blockId: blockId,
      startX: e.clientX - boardRect.left,
      startY: e.clientY - boardRect.top,
      blockStartX: block.x,
      blockStartY: block.y,
      currentDirection: forcedDirection
    });
    
    // Establecer también el bloque seleccionado para la visualización
    setSelectedBlock(blockId);
    
    e.preventDefault();
  };
  
  // Manejar el inicio del arrastre (touch)
  const handleTouchStart = (e: React.TouchEvent, blockId: string) => {
    if (isUnlocked) return;
    
    const block = blocks.find(b => b.id === blockId);
    if (!block || !block.movable) return;
    
    const board = boardRef.current;
    if (!board) return;
    
    const boardRect = board.getBoundingClientRect();
    const touch = e.touches[0]; // Usar el primer toque
    
    // Pre-determinar la dirección basada en la forma del bloque
    let forcedDirection: 'horizontal' | 'vertical' | null = null;
    if (block.width > block.height) {
      forcedDirection = 'horizontal'; // Bloques anchos solo pueden moverse horizontalmente
    } else if (block.height > block.width) {
      forcedDirection = 'vertical';   // Bloques altos solo pueden moverse verticalmente
    }
    
    setDragState({
      isDragging: true,
      blockId: blockId,
      startX: touch.clientX - boardRect.left,
      startY: touch.clientY - boardRect.top,
      blockStartX: block.x,
      blockStartY: block.y,
      currentDirection: forcedDirection
    });
    
    // Establecer también el bloque seleccionado para la visualización
    setSelectedBlock(blockId);
    
    // No prevenir el evento predeterminado aquí para permitir la propagación inicial
  };
  
  // Obtener estilo del bloque basado en su tipo
  const getBlockStyle = (block: Block) => {
    let baseClasses = "absolute rounded-md transition-transform duration-150 ease-in-out ";
    let specificClasses = "";
    let styles: React.CSSProperties = {
      width: `${block.width * CELL_SIZE}px`,
      height: `${block.height * CELL_SIZE}px`,
      left: `${block.x * CELL_SIZE}px`,
      top: `${block.y * CELL_SIZE}px`,
    };
    
    // Agregar estilos específicos según el tipo
    if (block.type === 'pasador') {
      specificClasses += "border-2 border-amber-900 shadow-md z-20 ";
      if (block.movable && !isUnlocked) {
        specificClasses += "cursor-grab active:cursor-grabbing ";
      }
      styles.backgroundColor = "#8B4513"; // Marrón oscuro para la madera
      // Textura de madera para el pasador
      styles.backgroundImage = "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjOEI0NTEzIi8+PGcgZmlsbD0iIzVEMkUwQiIgZmlsbC1vcGFjaXR5PSIwLjQiPjxwYXRoIGQ9Ik0wIDBoMTB2NDBoLTEwek0yMCAwaDEwdjQwaC0xMHpNMTAgMGgxMHY0MGgtMTB6TTMwIDBoMTB2NDBoLTEweiIvPjwvZz48L3N2Zz4=')";
    } else if (block.type === 'salida') {
      specificClasses += "border-2 border-amber-900/40 z-10 ";
      styles.backgroundColor = "rgba(146, 64, 14, 0.1)"; // amber-800 con transparencia
    } else {
      specificClasses += "border border-amber-900/30 shadow-sm ";
      if (block.movable && !isUnlocked) {
        specificClasses += "cursor-grab active:cursor-grabbing hover:brightness-110 ";
      }
      styles.backgroundColor = block.color;
    }
    
    // Agregar estilos para selección
    if (selectedBlock === block.id) {
      specificClasses += "ring-2 ring-yellow-300 ";
    }
    
    // Agregar opacidad si está desbloqueado
    if (isUnlocked) {
      specificClasses += "opacity-70 ";
    } else {
      specificClasses += "opacity-100 ";
    }
    
    return {
      className: baseClasses + specificClasses,
      style: styles
    };
  };
  
  // Renderizar el puzzle
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="relative bg-amber-900/80 p-4 rounded-md shadow-inner border border-amber-600 dark:border-amber-950">
        {/* Confeti cuando se desbloquea */}
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
            {confetti.map(particle => (
              <div
                key={particle.id}
                className="absolute"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  transform: `rotate(${particle.rotation}deg)`,
                  opacity: Math.max(0, Math.min(1, (120 - particle.y) / 120)),
                  transition: 'top 0.05s linear, opacity 0.05s linear'
                }}
              />
            ))}
          </div>
        )}
        
        {/* Mensaje de desbloqueo */}
        {isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-amber-700/90 text-amber-100 rounded-md z-20 animate-pulse">
            <div className="text-center">
              <div className="bg-amber-600 h-px w-16 mx-auto mb-2"></div>
              <p className="text-lg font-bold">¡Desbloqueado!</p>
              <p className="text-sm">Avanzando al siguiente enigma...</p>
              <div className="bg-amber-600 h-px w-16 mx-auto mt-2"></div>
            </div>
          </div>
        )}
        
        <div className="text-center mb-3 text-amber-200">
          <h3 className="text-lg font-bold">¡Abreme!, si puedes</h3>
        </div>
        
        {/* Tablero del puzzle */}
        <div 
          ref={boardRef}
          className={`bg-amber-100/30 rounded-md border-2 border-amber-900/40 relative overflow-visible shadow-inner select-none ${isDebugEnabled ? 'bg-amber-100/50' : ''}`}
          style={{ 
            width: `${BOARD_WIDTH * CELL_SIZE}px`, 
            height: `${BOARD_HEIGHT * CELL_SIZE}px`,
            margin: '0 auto'
          }}
        >
          {/* Textura de madera */}
          <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMzAyMDEwIj48L3JlY3Q+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMiIgZmlsbD0iIzIwMTAwMCI+PC9jaXJjbGU+PC9zdmc+')]"></div>
          
          {/* Rejilla del tablero */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-5 pointer-events-none">
            {Array.from({ length: BOARD_WIDTH * BOARD_HEIGHT }).map((_, index) => (
              <div 
                key={`cell-${index}`} 
                className={`border ${isDebugEnabled ? 'border-amber-800/40' : 'border-amber-800/10'}`}
              />
            ))}
          </div>
          
          {/* Render blocks */}
          {blocks.map((block) => {
            // Skip rendering salida here - it's rendered separately
            if (block.type === 'salida') return null;
            
            // Estilo común para todos los bloques
            const blockStyle: React.CSSProperties = {
              width: `${block.width * CELL_SIZE}px`,
              height: `${block.height * CELL_SIZE}px`,
              left: `${block.x * CELL_SIZE}px`,
              top: `${block.y * CELL_SIZE}px`,
              backgroundColor: block.color,
              cursor: block.movable ? 'move' : 'default',
              zIndex: block.type === 'pasador' ? 20 : 10,
              transition: dragState.isDragging ? 'none' : 'all 0.2s ease',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            };

            // Estilos adicionales para el pasador
            if (block.type === 'pasador') {
              blockStyle.backgroundImage = 'linear-gradient(to bottom, #8B4513, #A0522D)';
              blockStyle.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.3), inset 0 1px 3px rgba(255, 255, 255, 0.3)';
              
              return (
                <div
                  key={block.id}
                  className="absolute select-none"
                  style={blockStyle}
                  onMouseDown={(e) => handleMouseDown(e, block.id)}
                  onTouchStart={(e) => handleTouchStart(e, block.id)}
                >
                  {/* Clavel integrado en el pasador */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div 
                      style={{
                        width: '60%',
                        height: '60%',
                        borderRadius: '50%',
                        backgroundColor: '#e11d48',
                        backgroundImage: 'radial-gradient(circle, #e11d48 0%, #be123c 100%)',
                        boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.5), 0 0 5px rgba(0, 0, 0, 0.3)'
                      }}
                    />
                  </div>
                </div>
              );
            }

            return (
              <div
                key={block.id}
                className="absolute select-none"
                style={blockStyle}
                onMouseDown={(e) => handleMouseDown(e, block.id)}
                onTouchStart={(e) => handleTouchStart(e, block.id)}
              />
            );
          })}
          
          {/* Render exit */}
          {blocks.filter(block => block.type === 'salida').map(block => {
            const blockStyle = getBlockStyle(block);
            return (
              <div
                key={block.id}
                className={`${blockStyle.className} ${exitAnimation ? 'animate-pulse' : ''}`}
                style={blockStyle.style}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-5/6 h-5/6 rounded-full border-2 ${exitAnimation ? 'border-green-500 bg-green-100/20' : 'border-dashed border-amber-500/70'} flex items-center justify-center ${exitAnimation ? 'animate-pulse' : ''}`}>
                    <div className="w-3/4 h-3/4 rounded-full flex items-center justify-center">
                      <div className="text-xs text-amber-800 font-bold">Salida</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Instrucciones */}
        <div className="text-center mt-3 text-sm text-amber-100">
          <p>{isUnlocked 
            ? "¡El clavel ha pasado por la salida!" 
            : dragState.isDragging 
              ? "Arrastra el bloque en la dirección deseada" 
              : "Mueve los bloques para abrirme"
          }</p>
          
          {/* Información de debug */}
          {isDebugEnabled && (
            <div className="mt-2 p-1 bg-black/30 text-xs text-amber-200 rounded">
              <p className="mb-1">Posiciones de bloques:</p>
              <div className="grid grid-cols-2 gap-1 text-left">
                {blocks.map(b => (
                  <div key={`debug-${b.id}`} className="text-xs">
                    {`${b.id}: (${b.x},${b.y}) ${b.width}x${b.height}`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlidingPuzzleLock; 