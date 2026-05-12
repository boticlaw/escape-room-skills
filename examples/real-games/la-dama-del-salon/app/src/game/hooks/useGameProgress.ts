import { useState, useEffect } from 'react';
import { useAuth } from 'wasp/client/auth';
import { getUserGameProgress, updateGameProgress, useQuery } from 'wasp/client/operations';
import { getNextLevelId } from '../data/levels';
import { useQueryClient } from '@tanstack/react-query';

// Clave de consulta global que compartirán todos los componentes
export const GAME_PROGRESS_QUERY_KEY = 'userGameProgress';

export interface GameProgress {
  currentLevel: number;
  hintsUsed: number;
  levelCompleted: boolean;
  isLoading: boolean;
  maxLevelReached?: number;
}

export function useGameProgress(levelId: string) {
  const { data: user } = useAuth();
  const queryClient = useQueryClient();
  const [gameProgress, setGameProgress] = useState<GameProgress>({
    currentLevel: parseInt(levelId),
    hintsUsed: 0,
    levelCompleted: false,
    isLoading: true
  });
  const [message, setMessage] = useState<{ text: string; type: string }>({ text: "", type: "" });

  // Usar useQuery en lugar de useEffect para obtener datos
  const { 
    data: fetchedProgress, 
    isLoading: queryIsLoading, 
    error: queryError 
  } = useQuery(getUserGameProgress, null, {
    queryKey: [GAME_PROGRESS_QUERY_KEY, user?.id],
    enabled: !!user,
    staleTime: 300000, // 5 minutos (igual que en LevelGuard)
    cacheTime: 600000, // 10 minutos (igual que en LevelGuard)
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  // Efecto para actualizar el estado local cuando cambian los datos de la consulta
  useEffect(() => {
    if (queryIsLoading) {
      // Mantener el estado de carga si la consulta está cargando
      if (!gameProgress.isLoading) {
        setGameProgress(prev => ({ ...prev, isLoading: true }));
      }
      return;
    }

    if (queryError) {
      console.error('Error al obtener el progreso del juego:', queryError);
      setGameProgress(prev => ({ ...prev, isLoading: false }));
      return;
    }

    if (fetchedProgress) {
      // Actualizar estado con los datos recibidos
      const currentLevelNum = parseInt(levelId);
      setGameProgress(prev => ({
        ...prev,
        ...fetchedProgress,
        // Mantener el nivel actual basado en el levelId del prop
        currentLevel: currentLevelNum,
        // Determinar si el nivel está completado
        levelCompleted: fetchedProgress.maxLevelReached > currentLevelNum || 
                        fetchedProgress.currentLevel > currentLevelNum,
        isLoading: false
      }));
    } else if (!user) {
      // Si no hay usuario, marcar como no cargando
      setGameProgress(prev => ({ ...prev, isLoading: false }));
    }
  }, [fetchedProgress, queryIsLoading, queryError, levelId, user]);

  // Funciones para actualizar el progreso
  const markLevelComplete = async (): Promise<string | null> => {
    try {
      const nextLevelId = getNextLevelId(levelId);
      const nextLevel = nextLevelId ? parseInt(nextLevelId) : parseInt(levelId) + 1;
      const currentMaxLevel = fetchedProgress?.maxLevelReached || 0;
      const newMaxLevel = Math.max(currentMaxLevel, nextLevel);
      
      console.log(`--- DEBUG markLevelComplete ---`);
      console.log(`Completando nivel: ${levelId}`);
      console.log(`Nivel siguiente: ${nextLevelId || nextLevel}`);
      console.log(`maxLevelReached actual: ${currentMaxLevel}`);
      console.log(`Nuevo maxLevelReached: ${newMaxLevel}`);
      
      // Actualización optimista del estado local
      setGameProgress(prev => ({
        ...prev,
        currentLevel: nextLevel,
        levelCompleted: true,
        maxLevelReached: newMaxLevel // Usar el valor calculado explícitamente
      }));
      
      setMessage({ text: "¡Nivel completado!", type: "success" });
      
      // Actualizar en la base de datos con los parámetros explícitos
      const result = await updateGameProgress({ 
        currentLevel: nextLevel,
        levelCompleted: true, // Añadimos explícitamente levelCompleted: true
      });
      
      console.log(`Respuesta del servidor:`, result);
      console.log(`Nivel ${levelId} completado. Avanzando al nivel ${nextLevelId || nextLevel}`);
      
      // Actualizar la caché para todos los componentes
      queryClient.invalidateQueries([GAME_PROGRESS_QUERY_KEY, user?.id]);
      
      // Esperar un poco menos para que se complete la actualización del caché
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Opcionalmente, actualizar la caché manualmente con los datos nuevos
      queryClient.setQueryData([GAME_PROGRESS_QUERY_KEY, user?.id], result);
      
      return nextLevelId || null;
    } catch (error) {
      console.error('Error al marcar nivel como completado:', error);
      setMessage({ text: "Error al guardar el progreso", type: "error" });
      
      // Revertir el estado optimista en caso de error
      if (fetchedProgress) {
        setGameProgress(prev => ({
          ...prev,
          currentLevel: fetchedProgress.currentLevel,
          levelCompleted: false,
          maxLevelReached: fetchedProgress.maxLevelReached
        }));
      }
      
      return null;
    }
  };

  const useHint = async () => {
    const currentHints = gameProgress.hintsUsed || 0;
    
    // Actualización optimista
    setGameProgress(prev => ({
      ...prev,
      hintsUsed: currentHints + 1
    }));
    
    try {
      await updateGameProgress({ hintsUsed: currentHints + 1 });
    } catch (error) {
      console.error('Error al registrar el uso de pista:', error);
      // Revertir en caso de error
      setGameProgress(prev => ({
        ...prev,
        hintsUsed: currentHints
      }));
    }
  };

  return {
    gameProgress,
    message,
    setMessage,
    markLevelComplete,
    useHint
  };
} 