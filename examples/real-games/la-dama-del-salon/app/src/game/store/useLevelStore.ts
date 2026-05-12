import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';

interface LevelState {
  // Niveles desbloqueados (array de IDs)
  unlockedLevels: string[];
  
  // Nivel actual seleccionado
  currentLevel: string | null;
  
  // Acciones
  unlockLevel: (levelId: string) => void;
  setCurrentLevel: (levelId: string) => void;
  resetProgress: () => void;
  isLevelUnlocked: (levelId: string) => boolean;
}

const persistOptions: PersistOptions<LevelState> = {
  name: 'dama-game-level-storage',
};

export const useLevelStore = create<LevelState>()(
  persist(
    (set, get) => ({
      unlockedLevels: ['intro'], // Por defecto, solo el nivel intro está desbloqueado
      currentLevel: null,
      
      unlockLevel: (levelId: string) => 
        set((state: LevelState) => ({
          unlockedLevels: state.unlockedLevels.includes(levelId) 
            ? state.unlockedLevels 
            : [...state.unlockedLevels, levelId]
        })),
        
      setCurrentLevel: (levelId: string) => 
        set({ currentLevel: levelId }),
        
      resetProgress: () => 
        set({ unlockedLevels: ['intro'], currentLevel: null }),
        
      isLevelUnlocked: (levelId: string) => 
        get().unlockedLevels.includes(levelId)
    }),
    persistOptions
  )
); 