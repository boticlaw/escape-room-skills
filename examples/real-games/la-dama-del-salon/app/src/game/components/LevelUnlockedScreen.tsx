import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLevelStore } from '../store/useLevelStore';
import { getNextLevelId } from '../data/levels';
import { PursuitEscapeGame } from './';

const LevelUnlockedScreen: React.FC<{ levelId: string; onComplete: () => void }> = ({ 
  levelId, 
  onComplete 
}) => {
  const navigate = useNavigate();
  const [showMiniGame, setShowMiniGame] = useState(false);
  const { unlockLevel } = useLevelStore();
  
  const handleContinue = () => {
    if (!showMiniGame) {
      setShowMiniGame(true);
      return;
    }
    
    const nextLevelId = getNextLevelId(levelId);
    if (nextLevelId) {
      unlockLevel(nextLevelId);
      navigate(`/game/level/${nextLevelId}`);
    } else {
      // Si no hay siguiente nivel, volvemos al mapa
      navigate('/game/map');
    }
    
    onComplete();
  };

  const handleMiniGameComplete = () => {
    handleContinue();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-amber-100 p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold text-amber-800 mb-4">¡Nivel Completado!</h2>
        
        {showMiniGame ? (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-amber-700 mb-2">
              Escapa de los perseguidores para continuar
            </h3>
            <div className="border-4 border-amber-700 rounded-lg overflow-hidden">
              <PursuitEscapeGame 
                onComplete={handleMiniGameComplete}
                difficulty="easy"
              />
            </div>
          </div>
        ) : (
          <p className="text-amber-900 mb-4">
            Has descubierto una pista más para encontrar la Fuente de la Juventud.
            Sigue adelante para descubrir el resto del misterio.
          </p>
        )}
        
        {!showMiniGame && (
          <button
            onClick={handleContinue}
            className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded"
          >
            Continuar
          </button>
        )}
      </div>
    </div>
  );
};

export default LevelUnlockedScreen; 