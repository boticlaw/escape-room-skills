import React from 'react';

interface LevelHeaderProps {
  title: string;
  subtitle?: string;
  levelNumber?: number;
}

const LevelHeader: React.FC<LevelHeaderProps> = ({ 
  title,
  subtitle,
  levelNumber
}) => {
  return (
    <div className="text-center mb-6">
      {levelNumber !== undefined && (
        <div 
          className="mb-2 text-yellow-800 font-medium"
        >
          Nivel {levelNumber}
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-2">
        {title}
      </h1>
      
      {subtitle && (
        <div className="text-gray-600 dark:text-gray-400">
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default LevelHeader; 