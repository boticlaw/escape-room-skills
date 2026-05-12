import React from 'react';

interface LevelHeaderProps {
  levelNumber: number;
  title: string;
  imageUrl?: string;
  description?: string;
}

const LevelHeader: React.FC<LevelHeaderProps> = ({ 
  levelNumber, 
  title, 
  imageUrl,
  description 
}) => {
  return (
    <div className="mb-6">
      <div className="mb-6 flex justify-between items-center">
        <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium dark:bg-yellow-900/30 dark:text-yellow-200">
          Nivel {levelNumber}
        </span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">{title}</h1>
      
      {imageUrl && (
        <div className="mb-6 overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={`Imagen del nivel ${levelNumber}`}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      {description && (
        <div className="prose max-w-none mb-6 dark:prose-invert">
          <p>{description}</p>
        </div>
      )}
    </div>
  );
};

export default LevelHeader; 