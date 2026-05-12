import React, { useState, useRef, useEffect } from 'react';

interface StarPuzzleProps {
  onComplete: () => void; // Callback a llamar cuando el puzzle se completa
}

const StarPuzzle: React.FC<StarPuzzleProps> = ({ onComplete }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [position, setPosition] = useState({ x: 10, y: 50 }); // Posición inicial en el punto de inicio
  const [isDragging, setIsDragging] = useState(false);
  const [completionProgress, setCompletionProgress] = useState(0); // 0-100% para la animación
  const [checkpoints, setCheckpoints] = useState<Array<{ reached: boolean }>>([
    { reached: true },  // Punto de inicio (ya marcado como alcanzado)
    { reached: false }, // Checkpoint 1
    { reached: false }, // Checkpoint 2
    { reached: false }, // Checkpoint 3
    { reached: false }, // Punto final
  ]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  
  // Coordenadas de los checkpoints en el camino (porcentajes)
  const pathPoints = [
    { x: 10, y: 50 },   // Punto de inicio
    { x: 30, y: 20 },   // Checkpoint 1
    { x: 50, y: 70 },   // Checkpoint 2
    { x: 70, y: 30 },   // Checkpoint 3
    { x: 90, y: 50 },   // Punto final
  ];
  
  // Calcular el progreso basado en los checkpoints alcanzados
  const calculateProgress = (checks: Array<{ reached: boolean }>) => {
    const reachedCount = checks.filter(c => c.reached).length;
    return (reachedCount / checks.length) * 100;
  };
  
  // Manejar evento de inicio de arrastre (ratón)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isCompleted) return;
    e.preventDefault();
    setIsDragging(true);
  };
  
  // Manejar evento de inicio de arrastre (táctil)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isCompleted) return;
    // No prevenir el evento predeterminado para permitir el desplazamiento de la página
    setIsDragging(true);
  };
  
  // Manejar evento de movimiento (ratón)
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || isCompleted) return;
    handleMovement(e.clientX, e.clientY);
  };
  
  // Manejar evento de movimiento (táctil)
  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || isCompleted) return;
    // Prevenir el desplazamiento de la página mientras se arrastra
    e.preventDefault();
    const touch = e.touches[0];
    handleMovement(touch.clientX, touch.clientY);
  };
  
  // Lógica común para manejar movimiento
  const handleMovement = (clientX: number, clientY: number) => {
    const container = containerRef.current;
    
    if (container) {
      const rect = container.getBoundingClientRect();
      
      // Calcular posición relativa dentro del contenedor (en porcentajes)
      const x = Math.min(Math.max(0, ((clientX - rect.left) / rect.width) * 100), 100);
      const y = Math.min(Math.max(0, ((clientY - rect.top) / rect.height) * 100), 100);
      
      setPosition({ x, y });
      
      // Verificar si estamos cerca de alguno de los checkpoints
      const newCheckpoints = [...checkpoints];
      let updated = false;
      
      pathPoints.forEach((point, index) => {
        // Distancia entre la posición actual y el checkpoint
        const distance = Math.sqrt(
          Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2)
        );
        
        // Si estamos a menos del 10% de distancia, marcamos como alcanzado
        if (distance < 10 && !newCheckpoints[index].reached) {
          newCheckpoints[index].reached = true;
          updated = true;
        }
      });
      
      if (updated) {
        setCheckpoints(newCheckpoints);
        setCompletionProgress(calculateProgress(newCheckpoints));
        
        // Verificar si todos los checkpoints han sido alcanzados
        if (newCheckpoints.every(cp => cp.reached) && !isCompleted) {
          animateCompletion();
        }
      }
    }
  };
  
  // Manejar evento de fin de arrastre
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  // Animación de finalización
  const animateCompletion = () => {
    setIsCompleted(true);
    
    // Mover la estrella suavemente hasta el punto final
    const finalPoint = pathPoints[pathPoints.length - 1];
    
    // Animar la posición hacia el punto final
    const startPos = {...position};
    const startTime = Date.now();
    const duration = 1000; // 1 segundo para la animación
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Interpolación suave
      const easedProgress = 0.5 - 0.5 * Math.cos(progress * Math.PI);
      
      const newX = startPos.x + (finalPoint.x - startPos.x) * easedProgress;
      const newY = startPos.y + (finalPoint.y - startPos.y) * easedProgress;
      
      setPosition({ x: newX, y: newY });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Cuando termina la animación, llamar al callback de finalización
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    };
    
    requestAnimationFrame(animate);
  };
  
  // Agregar y eliminar event listeners
  useEffect(() => {
    // Event listeners para ratón
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Event listeners para táctil
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      // Limpiar event listeners al desmontar
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, isCompleted]);
  
  return (
    <div className="my-8 p-6 bg-amber-50 border border-dashed border-amber-400 rounded-lg text-center shadow-inner">
      <h4 className="text-lg font-semibold text-amber-800 mb-4 font-serif italic">"He copiado varias veces sus símbolos junto a un croquis..."</h4>
      <p className="text-amber-700 mb-6">
        Ayuda a Clara a trazar el camino que dibujó en su diario moviendo la estrella a lo largo del recorrido marcado.
      </p>
      
      {/* Barra de progreso */}
      <div className="w-full h-2 bg-amber-200 rounded-full mb-4 overflow-hidden">
        <div 
          className="h-full bg-amber-600 transition-all duration-500 ease-in-out" 
          style={{ width: `${completionProgress}%` }}
        ></div>
      </div>
      
      {/* Área interactiva del puzzle */}
      <div 
        ref={containerRef}
        className="relative w-full h-64 bg-gradient-to-br from-amber-100 to-amber-200 rounded-md mb-6 overflow-hidden border border-amber-300 shadow-sm"
      >
        {/* Camino a seguir */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path 
            d={`M ${pathPoints[0].x}% ${pathPoints[0].y}% 
                C ${pathPoints[0].x + 10}% ${pathPoints[0].y - 20}%, 
                  ${pathPoints[1].x - 10}% ${pathPoints[1].y + 20}%,
                  ${pathPoints[1].x}% ${pathPoints[1].y}%
                C ${pathPoints[1].x + 10}% ${pathPoints[1].y - 20}%, 
                  ${pathPoints[2].x - 10}% ${pathPoints[2].y - 20}%,
                  ${pathPoints[2].x}% ${pathPoints[2].y}%
                C ${pathPoints[2].x + 10}% ${pathPoints[2].y + 20}%,
                  ${pathPoints[3].x - 10}% ${pathPoints[3].y - 10}%,
                  ${pathPoints[3].x}% ${pathPoints[3].y}%
                C ${pathPoints[3].x + 10}% ${pathPoints[3].y + 20}%,
                  ${pathPoints[4].x - 10}% ${pathPoints[4].y - 20}%,
                  ${pathPoints[4].x}% ${pathPoints[4].y}%`}
            fill="none"
            stroke="rgba(180, 83, 9, 0.2)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="5,5"
          />
          
          {/* Círculos para los checkpoints */}
          {pathPoints.map((point, index) => (
            <circle 
              key={index}
              cx={`${point.x}%`} 
              cy={`${point.y}%`} 
              r="6" 
              fill={checkpoints[index].reached ? "rgba(180, 83, 9, 0.8)" : "rgba(180, 83, 9, 0.2)"}
              className={checkpoints[index].reached ? "animate-pulse" : ""}
            />
          ))}
          
          {/* Texto de la solución que aparecerá cerca del punto final */}
          <g 
            style={{
              opacity: isCompleted ? 1 : 0,
              transition: "opacity 1s ease-in-out 0.5s",
            }}
          >
            <rect 
              x={`${pathPoints[4].x - 15}%`} 
              y={`${pathPoints[4].y + 5}%`} 
              width="30%" 
              height="15%" 
              rx="10"
              fill="white"
              stroke="rgba(180, 83, 9, 0.6)"
              strokeWidth="2"
              strokeDasharray="0"
              style={{
                filter: "drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.2))",
              }}
            />
            <text 
              x={`${pathPoints[4].x}%`} 
              y={`${pathPoints[4].y + 12}%`} 
              textAnchor="middle" 
              dominantBaseline="middle"
              className="font-serif text-amber-900 font-bold"
              style={{
                fontSize: "16px",
                fill: "#92400e",
                animation: isCompleted ? "fadeIn 1s forwards 0.5s" : "none",
                opacity: 0,
              }}
            >
              Monumento Ponce de León
            </text>
          </g>
        </svg>
        
        {/* Estrella arrastrable */}
        <div
          ref={starRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)',
            cursor: isDragging ? 'grabbing' : 'grab',
            filter: isCompleted ? 'drop-shadow(0 0 8px gold)' : 'none',
          }}
          className={`absolute w-12 h-12 transition-all ${
            isDragging ? '' : 'transition-transform duration-300 ease-out'
          } ${isCompleted ? 'animate-pulse scale-110' : ''}`}
        >
          <svg viewBox="0 0 51 48" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"
              fill="#f59e0b"
              stroke="#92400e"
              strokeWidth="2"
            />
          </svg>
        </div>
        
        {/* Estilo para la animación fadeIn */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
      
      {/* Instrucciones adicionales */}
      <p className="text-sm text-amber-600 mb-4">
        {isCompleted 
          ? "La estrella ha revelado el lugar señalado en el diario." 
          : "Toca la estrella y arrástrala para seguir el camino marcado, pasando por todos los puntos."}
      </p>
    </div>
  );
};

export default StarPuzzle; 