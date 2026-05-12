import React, { useEffect } from 'react';
import './GameLoader.css';

interface GameLoaderProps {
  text?: string;
  timeout?: number;
}

const GameLoader: React.FC<GameLoaderProps> = ({ 
  text = 'Cargando...', 
  timeout = 10000 
}) => {
  useEffect(() => {
    // Seguridad: eliminar el loader después del tiempo de espera máximo
    const safetyTimeout = setTimeout(() => {
      const existingLoader = document.getElementById('game-loader-container');
      if (existingLoader) {
        document.body.removeChild(existingLoader);
      }
    }, timeout);

    return () => {
      clearTimeout(safetyTimeout);
      // Asegurarse de que se elimina el loader al desmontar el componente
      const existingLoader = document.getElementById('game-loader-container');
      if (existingLoader) {
        document.body.removeChild(existingLoader);
      }
    };
  }, [timeout]);

  return (
    <div id="game-loader-container" className="game-loader-container">
      <div className="game-loader">
        <div className="spinner"></div>
        <p className="loading-text">{text}</p>
      </div>
    </div>
  );
};

export default GameLoader; 