import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getUserGameProgress, updateUserLastUrl } from 'wasp/client/operations';
import { useAuth } from 'wasp/client/auth';
import LoadingSpinner from '../../admin/layout/LoadingSpinner';
import { GAME_PROGRESS_QUERY_KEY } from '../hooks/useGameProgress';

interface LevelGuardProps {
  currentLevelId: number;
  children: React.ReactNode;
}

// Definimos nuestra propia interfaz extendida del tipo GameProgress
interface ExtendedGameProgress {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  currentLevel: number;
  maxLevelReached: number;
  levelStartedAt: Date;
  lastLevelCompletedAt: Date | null;
  hintsUsed: number;
  wrongAttempts: number;
  userId: string;
  lastUrl?: string | null;
}

const LevelGuard: React.FC<LevelGuardProps> = ({ currentLevelId, children }) => {
  const { data: user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const hasCheckedProgress = useRef(false);
  const hasUpdatedUrl = useRef(false);
  const isMounted = useRef(true);
  const checkRetryCount = useRef(0); // Contador de reintentos para verificar el progreso

  // Optimización: usar configuración más agresiva para reducir el número de peticiones
  const { data: gameProgress, isLoading, error, refetch } = useQuery(getUserGameProgress, null, {
    queryKey: [GAME_PROGRESS_QUERY_KEY, user?.id],
    enabled: !!user,
    staleTime: 300000, // 5 minutos antes de considerar los datos obsoletos
    cacheTime: 600000, // 10 minutos antes de eliminar datos de la caché
    retry: false,
    refetchOnWindowFocus: true, // Permitir actualizaciones al volver a enfocar la ventana
    refetchOnMount: true, // Refetch al montar para asegurar datos frescos
    refetchOnReconnect: false // No refetch al reconectar
  });

  // Al desmontar el componente, marcar como no montado para evitar actualizaciones de estado
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Efecto para gestionar redirecciones basadas en el progreso del usuario
  useEffect(() => {
    if (!user || (isLoading && checkRetryCount.current === 0)) return;

    // Reintentar si hay un error o si los datos aún no están disponibles
    if ((error || !gameProgress) && checkRetryCount.current < 3) {
      const retryTimeout = setTimeout(() => {
        console.log(`Reintentando obtener el progreso del juego: intento ${checkRetryCount.current + 1}`);
        checkRetryCount.current += 1;
        refetch(); // Reintentar la consulta
      }, 500 * (checkRetryCount.current + 1)); // Backoff exponencial
      
      return () => clearTimeout(retryTimeout);
    }

    // Reiniciar el contador si tenemos datos
    if (gameProgress) {
      checkRetryCount.current = 0;
    }

    // Solo ejecutar esta lógica una vez cuando el usuario y los datos estén disponibles
    if (hasCheckedProgress.current) return;
    
    const checkProgress = async () => {
      // Si no hay progreso disponible, no hacer nada aún
      if (!gameProgress) return;
      
      hasCheckedProgress.current = true;
      
      console.log(`Verificando acceso al nivel ${currentLevelId}. MaxLevelReached: ${gameProgress.maxLevelReached}`);

      // Si el usuario está intentando acceder a un nivel que no ha desbloqueado aún
      if (currentLevelId > gameProgress.maxLevelReached) {
        if (isMounted.current) {
          console.log(`Redirigiendo: Nivel ${currentLevelId} no desbloqueado aún. Nivel máximo: ${gameProgress.maxLevelReached}`);
          
          // Si el nivel máximo alcanzado es 0, redirigir a /game, de lo contrario a /game/level/X
          if (gameProgress.maxLevelReached === 0) {
            navigate('/game', { replace: true });
          } else {
            navigate(`/game/level/${gameProgress.maxLevelReached}`, { replace: true });
          }
        }
        return;
      }

      // Actualizar la última URL del usuario solo cuando sea necesario y una sola vez
      try {
        // Construir la ruta correcta según el nivel actual
        let currentPath = currentLevelId === 0 ? '/game' : `/game/level/${params.levelId}`;
        
        // Usamos type casting para acceder a lastUrl de forma segura
        const progress = gameProgress as ExtendedGameProgress;
        
        if (!hasUpdatedUrl.current && progress && progress.lastUrl !== currentPath) {
          hasUpdatedUrl.current = true;
          await updateUserLastUrl({ lastUrl: currentPath });
        }
      } catch (error) {
        console.error('Error al actualizar lastUrl:', error);
      }
    };

    checkProgress();
  }, [gameProgress, isLoading, error, currentLevelId, params, user, refetch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700">{(error as Error).message}</p>
        <button
          onClick={() => navigate('/game')}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Volver al inicio del juego
        </button>
      </div>
    );
  }

  // Verificación de seguridad adicional para evitar mostrar niveles no desbloqueados
  if (gameProgress && currentLevelId > gameProgress.maxLevelReached) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-amber-600 mb-4">Nivel no disponible</h1>
        <p className="text-gray-700">Debes completar los niveles anteriores primero.</p>
        <button
          onClick={() => {
            // Si el nivel máximo alcanzado es 0, redirigir a /game
            if (gameProgress.maxLevelReached === 0) {
              navigate('/game', { replace: true });
            } else {
              navigate(`/game/level/${gameProgress.maxLevelReached}`, { replace: true });
            }
          }}
          className="mt-6 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
        >
          Ir al último nivel desbloqueado
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default LevelGuard; 