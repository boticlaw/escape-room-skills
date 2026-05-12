import React from 'react';
import Minesweeper from './Minesweeper';
import { useDebug } from '../context/DebugContext';

interface MinesweeperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameWon: () => void;
}

const MinesweeperModal: React.FC<MinesweeperModalProps> = ({ isOpen, onClose, onGameWon }) => {
  const { isDebugEnabled } = useDebug();
  
  if (!isOpen) return null;

  // Al ganar el juego, llamamos a onGameWon y cerramos el modal
  const handleGameWon = () => {
    onGameWon();
    // Esperar un momento antes de cerrar para que el usuario vea el mensaje de victoria
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-[350px] overflow-y-auto flex flex-col items-center">
        <div className="p-1 bg-amber-800 rounded-t-lg flex justify-between items-center w-full">
          <h2 className="text-white font-bold text-lg px-3">Desactiva las Trampas</h2>
          <button 
            onClick={onClose}
            className="text-white p-2 hover:bg-amber-700 rounded-full"
          >
            ✕
          </button>
        </div>
        
        <div className="p-3 flex flex-col items-center">
          <p className="text-amber-800 text-sm mb-3 text-center">
            Has encontrado un antiguo mecanismo. Desactiva todas las trampas para descubrir el siguiente enigma.
          </p>
          
          <Minesweeper 
            onGameWon={handleGameWon} 
            difficulty="easy" 
            maxTime={180}
          />
        </div>
      </div>
    </div>
  );
};

export default MinesweeperModal; 