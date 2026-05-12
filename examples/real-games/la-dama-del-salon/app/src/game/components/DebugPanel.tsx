import React from 'react';
import { useDebug } from '../context/DebugContext';
import { useAuth } from 'wasp/client/auth';

const DebugPanel: React.FC = () => {
  const { isDebugEnabled, toggleDebug } = useDebug();
  const { data: user } = useAuth();
  
  // Solo mostrar en entorno de desarrollo y para usuarios administradores
  if (process.env.NODE_ENV !== 'development' || !user?.isAdmin) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800/90 text-white p-3 rounded-md shadow-lg z-[9999] opacity-80 hover:opacity-100 transition-opacity">
      <div className="flex flex-col items-center space-y-2">
        <span className="text-xs font-medium">Modo Debug</span>
        <button 
          onClick={toggleDebug}
          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
            isDebugEnabled 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isDebugEnabled ? 'ACTIVADO' : 'DESACTIVADO'}
        </button>
      </div>
    </div>
  );
};

export default DebugPanel; 