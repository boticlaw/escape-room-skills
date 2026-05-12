import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getUserGameProgress, initializeGameProgress, updateGameProgress, updateUserLastUrl } from 'wasp/client/operations';
import LoadingSpinner from '../admin/layout/LoadingSpinner';
import SlidingPuzzleLock from './components/SlidingPuzzleLock';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Optimización: reducir consultas usando staleTime y cacheTime
  const { data: gameProgress, isLoading, error } = useQuery(getUserGameProgress, {
    staleTime: 60000, // 1 minuto antes de considerar los datos obsoletos
    cacheTime: 120000, // 2 minutos antes de eliminar datos de la caché
    retry: false, // No reintentar automáticamente en caso de error
    refetchOnWindowFocus: false, // No refetch al cambiar el foco de la ventana
  });
  
  const [puzzleLocked, setPuzzleLocked] = useState(true);
  const hasInitialized = useRef(false);
  const hasRedirected = useRef(false);
  const isUpdatingProgress = useRef(false);
  
  useEffect(() => {
    // Función de inicialización con prevención de múltiples ejecuciones
    const initializeIfNeeded = async () => {
      if (isLoading || error || hasInitialized.current) return;
      
      hasInitialized.current = true;
      
      if (!gameProgress) {
        try {
          // Inicializar el progreso del juego si no existe
          await initializeGameProgress({ startLevel: 0 });
        } catch (error) {
          console.error('Error al inicializar el progreso del juego:', error);
        }
      } else if (gameProgress.currentLevel > 0 && !hasRedirected.current) {
        // Si el usuario ya ha avanzado más allá del nivel 0, redirigirlo al nivel correspondiente
        hasRedirected.current = true;
        navigate(`/game/level/${gameProgress.currentLevel}`, { replace: true });
      }
    };

    // Solo ejecutar esta lógica una vez cuando tengamos los datos necesarios
    if (!isLoading && !error) {
      initializeIfNeeded();
    }
  }, [gameProgress, isLoading, error, navigate]);

  const handlePuzzleUnlock = async () => {
    // Evitar múltiples actualizaciones simultáneas
    if (isUpdatingProgress.current) return;
    
    try {
      isUpdatingProgress.current = true;
      console.log("¡Puzzle desbloqueado! Avanzando al nivel 1...");
      
      // Actualizar UI inmediatamente para mejor experiencia
      setPuzzleLocked(false);
      
      // Actualizar el progreso del juego y la URL en una sola operación
      const promises = [
        updateGameProgress({
          currentLevel: 1,
          levelCompleted: true
        }),
        updateUserLastUrl({ 
          lastUrl: '/game/level/1' 
        })
      ];
      
      await Promise.all(promises);
      
      // Navegación inmediata para evitar estados intermedios
      navigate('/game/level/1', { replace: true });
    } catch (error) {
      console.error('Error al actualizar el progreso:', error);
      isUpdatingProgress.current = false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700">{(error as Error).message}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50/30 py-12 px-4 sm:px-6 lg:px-8 dark:bg-boxdark-2">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-100" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.03em' }}>
            La Dama del Salón - Street Escape
          </h1>
          <p className="mt-3 text-amber-700 dark:text-amber-300" style={{ fontFamily: "'Playfair Display', serif" }}>
            Bienvenido/a a la aventura por las calles de Palencia
          </p>
        </div>

        {gameProgress && (
          <div className="space-y-8">
            <div className="bg-white/70 dark:bg-boxdark/70 rounded-xl shadow-md p-6 backdrop-blur-sm">
              <p className="text-amber-800 dark:text-amber-200 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Has descubierto un misterioso <strong>diario de 1897 que perteneció a Clara Vela</strong>. Sus páginas, impregnadas con el aroma a claveles, revelan una intrigante red de pistas ocultas que parecen señalar un tesoro ancestral. El diario está protegido por un peculiar mecanismo.
              </p>
              
              <SlidingPuzzleLock 
                locked={puzzleLocked} 
                onUnlock={handlePuzzleUnlock} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage; 