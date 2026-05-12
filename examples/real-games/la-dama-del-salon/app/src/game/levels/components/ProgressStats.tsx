import React from 'react';
import { GameProgress } from '../../hooks/useGameProgress';

interface ProgressStatsProps {
  gameProgress: GameProgress;
}

const ProgressStats: React.FC<ProgressStatsProps> = ({ gameProgress }) => {
  if (!gameProgress || gameProgress.isLoading) return null;

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-900 mb-3 dark:text-white">Estadísticas</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg text-center dark:bg-boxdark-2">
          <span className="block text-sm text-gray-500 dark:text-gray-400">Nivel actual</span>
          <span className="block mt-1 text-xl font-medium text-gray-900 dark:text-white">
            {gameProgress.currentLevel}
          </span>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center dark:bg-boxdark-2">
          <span className="block text-sm text-gray-500 dark:text-gray-400">Pistas usadas</span>
          <span className="block mt-1 text-xl font-medium text-gray-900 dark:text-white">
            {gameProgress.hintsUsed}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressStats; 