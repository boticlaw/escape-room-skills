import React, { useEffect, useState } from 'react';
import MonsterEscapeGame from './MonsterEscapeGame';

interface MonsterEscapeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameWon: () => void;
  onGameOver: () => void;
  difficulty?: 'easy' | 'medium' | 'hard';
  reducedTarget?: boolean;
  clickPosition?: { x: number, y: number } | null;
}

const MonsterEscapeModal: React.FC<MonsterEscapeModalProps> = ({
  isOpen,
  onClose,
  onGameWon,
  onGameOver,
  difficulty = 'medium',
  reducedTarget = false,
  clickPosition = null
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setVisible(false);
      setTimeout(() => setVisible(true), 50);
      return () => {
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 sm:p-6 overflow-auto">
      <div
        className={`bg-amber-50 rounded-lg shadow-xl w-full max-w-lg sm:max-w-3xl h-full sm:h-auto max-h-full sm:max-h-[90vh] overflow-auto flex flex-col transition-all duration-200 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <div className="p-2 bg-amber-800 rounded-t-lg flex justify-between items-center w-full sticky top-0 z-10">
          <h2 className="text-white font-bold text-lg px-3">La Huida del Marqués</h2>
          <button 
            onClick={onClose}
            className="text-white p-2 hover:bg-amber-700 rounded-full"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-2 md:p-4">
          <div className="bg-amber-100 border-2 border-amber-300 rounded-lg p-3 mb-3 w-full mx-auto text-center">
            <p className="text-amber-800 text-sm font-medium">
              He observado que la pista se mantiene; por ello, me he adentrado por los senderos del parque hasta hallar este enigmático rincón, donde cada sombra susurra secretos del pasado. Pero me esta costando escapar de ellos y ya son muchas vueltas las que llevo dando. ¿Me puedes ayudar?
            </p>
          </div>
          
          <div className="w-full flex-1 flex justify-center items-center">
            <MonsterEscapeGame 
              onGameWon={onGameWon}
              onGameOver={onGameOver}
              difficulty={difficulty}
              reducedTarget={reducedTarget}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonsterEscapeModal; 