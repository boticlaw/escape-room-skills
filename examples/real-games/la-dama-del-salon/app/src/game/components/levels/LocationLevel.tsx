import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LevelHeader from '../common/LevelHeader';
import { LevelData } from '../../data/levels';
import GeoLocationChecker from '../GeoLocationChecker';

interface LocationLevelProps {
  levelData: LevelData;
}

export const LocationLevel: React.FC<LocationLevelProps> = ({ levelData }) => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Función para calcular la distancia usando la fórmula Haversine
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('La geolocalización no está disponible en tu dispositivo');
    }
  }, []);

  const handleCheckLocation = () => {
    if (!levelData.location) {
      setError('Este nivel no tiene una ubicación asociada');
      return;
    }

    setChecking(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition(position);
        setChecking(false);
        
        // Usar el componente GeoLocationChecker
        const onLocationReached = () => {
          setFeedback({ 
            correct: true, 
            message: '¡Has encontrado el lugar correcto!'
          });
        };
        
        const onLocationError = (errorMessage: string) => {
          setFeedback({
            correct: false,
            message: errorMessage
          });
        };
        
        // Verificar si el usuario está en la ubicación correcta
        if (levelData.location) {
          const distance = calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
            levelData.location.latitude,
            levelData.location.longitude
          );
          
          const distanceThreshold = 25; // metros
          
          if (distance <= distanceThreshold) {
            onLocationReached();
          } else {
            onLocationError(`No estás en el lugar correcto. Te encuentras a ${Math.round(distance)} metros del punto exacto.`);
          }
        }
      },
      (error) => {
        setChecking(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Permiso de ubicación denegado');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Información de ubicación no disponible');
            break;
          case error.TIMEOUT:
            setError('La solicitud de ubicación expiró');
            break;
          default:
            setError('Error desconocido al obtener la ubicación');
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleNext = () => {
    // Navegar al siguiente nivel o de vuelta al mapa
    // const nextLevelId = GameProgress.getNextLevelId(levelData.id);
    const nextLevelId = null;
    if (nextLevelId) {
      navigate(`/game/level/${nextLevelId}`);
    } else {
      navigate('/game');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4">
      <LevelHeader title={levelData.title} subtitle={levelData.description} />
      
      <div className="p-6 mt-4 bg-white rounded-lg shadow-md border border-gray-200 dark:bg-boxdark">
        <h2 className="text-lg font-medium mb-3 dark:text-white">
          Desafío de ubicación
        </h2>
        <p className="text-gray-600 mb-4 dark:text-gray-400">
          Para completar este nivel, debes encontrar el lugar indicado en la descripción y verificar tu ubicación.
        </p>
        
        <button
          className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 flex items-center justify-center mb-3 dark:focus:ring-offset-boxdark"
          onClick={handleCheckLocation}
          disabled={checking}
        >
          {checking ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verificando ubicación...
            </>
          ) : (
            'Verificar mi ubicación'
          )}
        </button>
        
        <button 
          className="w-full mt-2 border border-yellow-600 text-yellow-600 py-2 px-4 rounded-md hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 mb-3 dark:border-yellow-500 dark:text-yellow-500 dark:hover:bg-yellow-900/20 dark:focus:ring-offset-boxdark"
          onClick={() => setShowHint(!showHint)}
        >
          {showHint ? 'Ocultar pista' : 'Mostrar pista'}
        </button>
        
        {error && (
          <div className="p-3 mt-3 bg-red-50 rounded-md text-red-700 text-sm dark:bg-red-900/30 dark:text-red-200">
            <p>Error: {error}</p>
          </div>
        )}
        
        {showHint && (
          <div className="p-3 mt-3 bg-yellow-50 rounded-md border border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800">
            <p className="text-sm">
              <strong>Pista:</strong> {levelData.hint}
            </p>
          </div>
        )}
        
        {feedback && (
          <div 
            className={`p-3 mt-3 rounded-md ${
              feedback.correct ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200'
            }`}
          >
            <p>{feedback.message}</p>
            {feedback.correct && (
              <button 
                className="mt-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-boxdark"
                onClick={handleNext}
              >
                Continuar
              </button>
            )}
          </div>
        )}
        
        {position && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200 dark:bg-boxdark-2 dark:border-gray-700">
            <p className="text-xs font-mono mb-1 text-gray-500 dark:text-gray-400">
              Tu ubicación actual:
            </p>
            <p className="text-xs font-mono mb-1 text-gray-500 dark:text-gray-400">
              Latitud: {position.coords.latitude.toFixed(6)}
            </p>
            <p className="text-xs font-mono mb-1 text-gray-500 dark:text-gray-400">
              Longitud: {position.coords.longitude.toFixed(6)}
            </p>
            <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
              Precisión: ±{Math.round(position.coords.accuracy)} metros
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationLevel; 