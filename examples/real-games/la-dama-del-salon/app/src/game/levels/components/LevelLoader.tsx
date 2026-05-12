import React from 'react';

const LevelLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      <p className="ml-3 text-gray-700 dark:text-gray-300">Cargando nivel...</p>
    </div>
  );
};

export default LevelLoader; 