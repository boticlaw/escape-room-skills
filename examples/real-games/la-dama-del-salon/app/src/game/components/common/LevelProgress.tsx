import React from 'react';

interface LevelProgressProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
}

const LevelProgress: React.FC<LevelProgressProps> = ({
  current,
  total,
  label = 'Progreso',
  showPercentage = true
}) => {
  const progressValue = Math.min(Math.max((current / total) * 100, 0), 100);
  
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {label}
        </div>
        {showPercentage && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round(progressValue)}%
          </div>
        )}
      </div>
      
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700">
        <div 
          className="h-full bg-yellow-500 rounded-full" 
          style={{ width: `${progressValue}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between mt-1">
        <div className="text-xs text-gray-500 dark:text-gray-500">
          {current} de {total}
        </div>
      </div>
    </div>
  );
};

export default LevelProgress; 