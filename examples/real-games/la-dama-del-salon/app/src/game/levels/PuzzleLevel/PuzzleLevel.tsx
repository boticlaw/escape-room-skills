import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LevelGuard from '../../components/LevelGuard';
import LevelHeader from '../components/LevelHeader';
import HintDisplay from '../components/HintDisplay';
import MessageDisplay from '../components/MessageDisplay';
import ProgressStats from '../components/ProgressStats';
import { getLevelById } from '../../data/levels';
import { useGameProgress } from '../../hooks/useGameProgress';

interface PuzzleLevelProps {
  levelId: string;
}

const PuzzleLevel: React.FC<PuzzleLevelProps> = ({ levelId }) => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  
  const {
    gameProgress,
    message,
    setMessage,
    markLevelComplete,
    useHint
  } = useGameProgress(levelId);
  
  const level = getLevelById(levelId);
  
  if (!level || gameProgress.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }
  
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!level) {
      setMessage({ text: "Nivel no encontrado", type: "error" });
      return;
    }

    if (answer.trim().toLowerCase() === level.solution.toLowerCase()) {
      setMessage({ text: "¡Respuesta correcta!", type: "success" });
      
      const nextLevelId = await markLevelComplete();
      
      // Después de 2 segundos, redirigir al siguiente nivel
      setTimeout(() => {
        if (nextLevelId) {
          navigate(`/game/level/${nextLevelId}`);
        } else {
          navigate('/game/completed');
        }
      }, 2000);
    } else {
      setMessage({ text: "Respuesta incorrecta. Inténtalo de nuevo.", type: "error" });
      // Ya no registramos intentos fallidos
    }
  };
  
  // Función para mostrar pista
  const handleShowHint = async () => {
    setShowHint(true);
    await useHint();
  };
  
  return (
    <LevelGuard currentLevelId={parseInt(levelId)}>
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 dark:bg-boxdark-2">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden dark:bg-boxdark">
          <div className="p-8">
            <LevelHeader 
              levelNumber={parseInt(levelId)}
              title={level.title}
              imageUrl={level.imageUrl}
              description={level.description}
            />
            
            {/* Formulario de respuesta */}
            <form onSubmit={handleSubmitAnswer} className="mb-6 space-y-4">
              <div>
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tu respuesta
                </label>
                <input
                  type="text"
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 dark:bg-boxdark-2 dark:border-gray-600 dark:text-white"
                  placeholder="Escribe tu respuesta..."
                  required
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:focus:ring-offset-boxdark"
                >
                  Comprobar
                </button>
              </div>
            </form>
            
            {/* Mostrar pista o botón para mostrarla */}
            <HintDisplay 
              hint={level.hint}
              showHint={showHint}
              onShowHint={handleShowHint}
            />
            
            {/* Mostrar mensajes */}
            <MessageDisplay message={message} />
            
            {/* Mostrar estadísticas */}
            <ProgressStats gameProgress={gameProgress} />
          </div>
        </div>
      </div>
    </LevelGuard>
  );
};

export default PuzzleLevel; 