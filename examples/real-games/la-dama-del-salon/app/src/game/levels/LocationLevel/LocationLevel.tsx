import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LevelGuard from '../../components/LevelGuard';
import GeoLocationChecker from '../../components/GeoLocationChecker';
import LevelHeader from '../components/LevelHeader';
import HintDisplay from '../components/HintDisplay';
import MessageDisplay from '../components/MessageDisplay';
import ProgressStats from '../components/ProgressStats';
import { getLevelById, getNextLevelId } from '../../data/levels';
import { useGameProgress } from '../../hooks/useGameProgress';

interface LocationLevelProps {
  levelId: string;
}

// Detectar el nivel 9 específicamente y mostrar el video y enigma
const SpecialLevel9: React.FC = () => {
  const navigate = useNavigate();
  const [enigmaAnswer, setEnigmaAnswer] = useState('');
  const [showError, setShowError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  const {
    gameProgress,
    message,
    setMessage,
    markLevelComplete,
    useHint
  } = useGameProgress("9");
  
  const level = getLevelById("9");
  
  if (!level) {
    return <div>Cargando nivel 9...</div>;
  }
  
  // Función para verificar la respuesta
  const handleEnigmaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const normalizedAnswer = enigmaAnswer.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    if (normalizedAnswer === "recuerdame") {
      setMessage({ text: "¡Respuesta correcta!", type: "success" });
      await markLevelComplete();
      
      setTimeout(() => {
        navigate('/game/level/10');
      }, 1500);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };
  
  const handleShowHint = async () => {
    setShowHint(true);
    await useHint();
  };
  
  return (
    <div className="p-8">
      {/* Marcador visual para identificar que estamos en el nivel 9 */}
      <div className="bg-blue-100 p-3 rounded-lg text-blue-800 font-bold mb-4">
        NIVEL 9 ESPECIAL - SIN GEOLOCALIZACIÓN
      </div>
      
      <LevelHeader 
        levelNumber={9}
        title={level.title}
        imageUrl={level.imageUrl}
        description={level.description}
      />
      
      {/* Video de YouTube y enigma */}
      <div className="mt-6 space-y-4">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/glhK0eUxxzs"
            title="Video de YouTube"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg mt-4">
          <h3 className="text-xl font-bold text-amber-900 mb-2">Enigma</h3>
          <p className="text-amber-800 mb-4">¿Qué melodía?</p>
          
          <form onSubmit={handleEnigmaSubmit} className="space-y-3">
            <input
              type="text"
              value={enigmaAnswer}
              onChange={(e) => setEnigmaAnswer(e.target.value)}
              placeholder="Escribe tu respuesta..."
              className="w-full px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
            
            {showError && (
              <p className="text-red-600 text-sm">Respuesta incorrecta. Inténtalo de nuevo.</p>
            )}
            
            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Verificar
            </button>
          </form>
        </div>
      </div>
      
      <HintDisplay 
        hint={level.hint}
        showHint={showHint}
        onShowHint={handleShowHint}
      />
      
      <MessageDisplay message={message} />
      
      <ProgressStats gameProgress={gameProgress} />
    </div>
  );
};

// Componente LocationLevel modificado
const LocationLevel: React.FC<LocationLevelProps> = ({ levelId }) => {
  const navigate = useNavigate();
  const params = useParams(); // Obtener los parámetros de la URL directamente
  const urlLevelId = params.levelId; // Este es el ID que viene de la URL
  
  // Mostrar información de depuración en consola
  useEffect(() => {
    console.log("Props levelId:", levelId);
    console.log("URL levelId:", urlLevelId);
    console.log("Son iguales:", levelId === urlLevelId);
    console.log("Es nivel 9 (props):", levelId === "9");
    console.log("Es nivel 9 (URL):", urlLevelId === "9");
  }, [levelId, urlLevelId]);
  
  // Si estamos específicamente en el nivel 9 por URL, mostrar el componente especial
  if (urlLevelId === "9") {
    return (
      <LevelGuard currentLevelId={9}>
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 dark:bg-boxdark-2">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden dark:bg-boxdark">
            <SpecialLevel9 />
          </div>
        </div>
      </LevelGuard>
    );
  }
  
  // Para el resto de niveles, continuar con el comportamiento normal
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
  
  // Función para cuando el usuario llega a la ubicación correcta
  const handleLocationReached = async () => {
    setMessage({ text: "¡Has llegado al lugar correcto!", type: "success" });
    
    const nextLevelId = await markLevelComplete();
    
    setTimeout(() => {
      if (nextLevelId) {
        navigate(`/game/level/${nextLevelId}`);
      } else {
        navigate('/game/completed');
      }
    }, 2000);
  };
  
  // Función para manejar errores de geolocalización
  const handleLocationError = (error: string) => {
    setMessage({ text: error, type: "error" });
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
            {/* Información de depuración visible */}
            <div className="bg-gray-100 p-2 rounded-lg text-xs mb-4">
              <p>Debug: levelId: {levelId} | URL levelId: {urlLevelId}</p>
            </div>
            
            <LevelHeader 
              levelNumber={parseInt(levelId)}
              title={level.title}
              imageUrl={level.imageUrl}
              description={level.description}
            />
            
            {/* Componente de geolocalización */}
            {level.location && (
              <div className="mb-6">
                <GeoLocationChecker 
                  targetLocation={level.location}
                  onLocationReached={handleLocationReached}
                  onError={handleLocationError}
                  distanceThreshold={25}
                />
              </div>
            )}
            
            <HintDisplay 
              hint={level.hint}
              showHint={showHint}
              onShowHint={handleShowHint}
            />
            
            <MessageDisplay message={message} />
            
            <ProgressStats gameProgress={gameProgress} />
          </div>
        </div>
      </div>
    </LevelGuard>
  );
};

export default LocationLevel; 