import React, { useState, useEffect } from 'react';
import SlidingPuzzleLock from './SlidingPuzzleLock';

interface DiaryProps {
  isLocked: boolean;
  onUnlock: () => void;
  currentLevel: number;
  lastCompletedLevel: number;
}

const Diary: React.FC<DiaryProps> = ({ isLocked, onUnlock, currentLevel, lastCompletedLevel }) => {
  const [showingLock, setShowingLock] = useState(isLocked);

  // Asegurar que el diario esté sincronizado con el estado isLocked
  useEffect(() => {
    setShowingLock(isLocked);
  }, [isLocked]);

  const handleUnlock = () => {
    console.log("SlidingPuzzle desbloqueado, actualizando diario...");
    setShowingLock(false);
    // Llamamos a onUnlock inmediatamente para ir al siguiente nivel
    onUnlock();
  };

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden transition-all duration-500 ease-in-out transform">
      {/* Contenedor principal del diario con aspecto antiguo */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-700 rounded-lg shadow-xl border border-amber-900/50 overflow-hidden relative">
        {/* Textura de cuero envejecido */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNjY2MiPjwvcmVjdD4KPC9zdmc+')]"></div>
        
        {/* Parte superior del diario - Cubierta */}
        <div className="relative p-5 text-center transition-all duration-700 ease-in-out overflow-hidden">
          <div className="flex justify-center items-center">
            {/* Decoración izquierda */}
            <div className="h-px w-12 bg-amber-300/70 mr-3"></div>
            
            <h2 className="text-xl font-serif font-bold text-amber-100 tracking-widest" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.05em', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
              Diario de Clara Vela
            </h2>
            
            {/* Decoración derecha */}
            <div className="h-px w-12 bg-amber-300/70 ml-3"></div>
          </div>
          
          {/* Cerradura del diario (puzzle deslizante) */}
          {showingLock && (
            <div className="mt-6 transition-opacity duration-500 ease-in-out">
              <SlidingPuzzleLock locked={isLocked} onUnlock={handleUnlock} />
            </div>
          )}
        </div>
      </div>
      
      {/* Texto de ayuda debajo del diario */}
      <div className="text-center mt-3 text-sm text-amber-700 dark:text-amber-400 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
        {showingLock 
          ? "Resuelve el puzzle para continuar" 
          : "¡Desbloqueado! Avanzando al siguiente enigma..."}
      </div>
    </div>
  );
};

export default Diary;