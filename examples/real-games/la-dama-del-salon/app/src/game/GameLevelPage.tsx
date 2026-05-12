import React, { Suspense, lazy, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLevelType, levelExists } from './data/levels';
import LevelLoader from './levels/components/LevelLoader';
import { useQuery } from 'wasp/client/operations';
import { getUserGameProgress } from 'wasp/client/operations';

// Carga dinámica de los componentes de nivel
const DiaryLevel = lazy(() => import('./levels/DiaryLevel/DiaryLevel'));
const LocationLevel = lazy(() => import('./levels/LocationLevel/LocationLevel'));
const PuzzleLevel = lazy(() => import('./levels/PuzzleLevel/PuzzleLevel'));

const GameLevelPage: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const { data: gameProgress, isLoading } = useQuery(getUserGameProgress);
  
  useEffect(() => {
    // Si el nivel no existe, verificar el progreso del juego
    if (!levelExists(levelId) && !isLoading && gameProgress) {
      // Si ha completado el nivel 13, redirigir a la página de completado
      if (gameProgress.maxLevelReached >= 13) {
        navigate('/game/completed', { replace: true });
      } else {
        // De lo contrario, redirigir a la página principal del juego
        navigate('/game', { replace: true });
      }
    }
    
    // Hacer scroll al inicio al cargar un nuevo nivel
    window.scrollTo(0, 0);
  }, [levelId, navigate, gameProgress, isLoading]);
  
  // Si el nivel no existe, mostrar un loader mientras se verifica el progreso
  if (!levelExists(levelId)) {
    return <LevelLoader />;
  }

  // Determinar el tipo de nivel y renderizar el componente correspondiente
  const levelType = getLevelType(levelId);

  return (
    <Suspense fallback={<LevelLoader />}>
      {levelType === 'diary' && <DiaryLevel key={`diary-${levelId}`} levelId={levelId as string} />}
      {levelType === 'location' && <LocationLevel key={`location-${levelId}`} levelId={levelId as string} />}
      {levelType === 'puzzle' && <PuzzleLevel key={`puzzle-${levelId}`} levelId={levelId as string} />}
      {/* Se pueden añadir más tipos de niveles aquí a medida que crezca el juego */}
    </Suspense>
  );
};

export default GameLevelPage;