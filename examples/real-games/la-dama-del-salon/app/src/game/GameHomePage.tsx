import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from 'wasp/client/auth';
import { getUserGameProgress, initializeGameProgress, updateUserLastUrl } from 'wasp/client/operations';
import { useNavigate } from 'react-router-dom';
import Diary from './components/Diary';

const GameHomePage = () => {
  const { data: user } = useAuth();
  const navigate = useNavigate();
  const [gameProgress, setGameProgress] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDiaryLocked, setIsDiaryLocked] = useState(true);
  const [navigationTimer, setNavigationTimer] = useState<NodeJS.Timeout | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Evitar múltiples llamadas al API
    if (hasInitialized.current || redirecting || !user) return;
    
    const fetchGameProgress = async () => {
      hasInitialized.current = true;
      
      try {
        // Obtener el progreso del usuario
        let progress = await getUserGameProgress();

        // Si no hay progreso, inicializar con nivel 0
        if (!progress) {
          progress = await initializeGameProgress({ startLevel: 0 });
        }

        setGameProgress(progress);

        // Verificar si el usuario tiene una última URL guardada
        if (user.lastUrl && 
            user.lastUrl.startsWith('/game/level/') && 
            !redirecting) {
          
          console.log("Redirigiendo a la última URL visitada:", user.lastUrl);
          setRedirecting(true);

          // Redireccionar después de un breve retraso para permitir que los componentes se rendericen
          const timer = setTimeout(() => {
            const lastUrl = user.lastUrl as string;
            navigate(lastUrl, { replace: true });
          }, 500);
          
          setNavigationTimer(timer);
        }
      } catch (error) {
        console.error('Error al obtener el progreso del juego:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameProgress();

    // Limpiar cualquier timer al desmontar el componente
    return () => {
      if (navigationTimer) {
        clearTimeout(navigationTimer);
      }
    };
  }, [user, navigationTimer, navigate, redirecting]);

  const handleDiaryUnlock = async () => {
    console.log("Diario desbloqueado en GameHomePage");
    setIsDiaryLocked(false);
    
    // Navegar directamente al siguiente nivel cuando se desbloquea el puzzle
    if (gameProgress) {
      // Si el nivel es 0, navegar a /game, de lo contrario a /game/level/X
      const nextLevelUrl = gameProgress.currentLevel === 0 
        ? '/game' 
        : `/game/level/${gameProgress.currentLevel}`;
      
      try {
        // Guardar la última URL visitada
        await updateUserLastUrl({ lastUrl: nextLevelUrl });
        
        // Navegar con un pequeño retraso
        const timer = setTimeout(() => {
          console.log("Navegando directamente al nivel:", gameProgress.currentLevel);
          navigate(nextLevelUrl, { replace: true });
        }, 1000);
        
        setNavigationTimer(timer);
      } catch (error) {
        console.error('Error al actualizar la última URL:', error);
      }
    }
  };

  if (isLoading || redirecting) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        <p className="ml-3">{redirecting ? 'Redirigiendo al último nivel...' : 'Cargando...'}</p>
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
                Has descubierto un misterioso diario de 1897 que perteneció a Clara Vela, una joven que escapaba de un matrimonio arreglado mientras seguía las huellas de Ponce de León en busca de la legendaria Fuente de la Juventud. Sus páginas, impregnadas con el aroma a claveles, revelan una intrigante red de pistas ocultas por toda la ciudad, mapas codificados y símbolos estrellados que parecen señalar un tesoro ancestral. El diario está protegido por un peculiar mecanismo con forma de clavel, quizás inspirado en la calle donde Clara vivía. Deberás resolver sus enigmas antes que el ambicioso Marqués de Albaida, quien también persigue este secreto centenario.
              </p>
              
              <Diary 
                isLocked={isDiaryLocked} 
                onUnlock={handleDiaryUnlock} 
                currentLevel={gameProgress.currentLevel}
                lastCompletedLevel={gameProgress.lastCompletedLevel || 0}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameHomePage; 