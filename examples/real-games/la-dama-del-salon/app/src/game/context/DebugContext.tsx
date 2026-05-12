import React, { createContext, useContext, useState, useEffect } from 'react';

type DebugContextType = {
  isDebugEnabled: boolean;
  toggleDebug: () => void;
  enableDebug: () => void;
  disableDebug: () => void;
};

// Valor por defecto para evitar errores si se usa fuera del provider
const defaultContextValue: DebugContextType = {
  isDebugEnabled: false,
  toggleDebug: () => console.warn('DebugContext: toggleDebug llamado fuera del DebugProvider'),
  enableDebug: () => console.warn('DebugContext: enableDebug llamado fuera del DebugProvider'),
  disableDebug: () => console.warn('DebugContext: disableDebug llamado fuera del DebugProvider')
};

const DebugContext = createContext<DebugContextType>(defaultContextValue);

export const DebugProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isDebugEnabled, setIsDebugEnabled] = useState(false);
  
  // Cargar estado de localStorage al iniciar
  useEffect(() => {
    const savedState = localStorage.getItem('debug_mode');
    if (savedState) {
      setIsDebugEnabled(savedState === 'true');
    }
  }, []);
  
  // Guardar en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem('debug_mode', String(isDebugEnabled));
  }, [isDebugEnabled]);
  
  const toggleDebug = () => setIsDebugEnabled(prev => !prev);
  const enableDebug = () => setIsDebugEnabled(true);
  const disableDebug = () => setIsDebugEnabled(false);
  
  return (
    <DebugContext.Provider value={{ isDebugEnabled, toggleDebug, enableDebug, disableDebug }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = () => {
  const context = useContext(DebugContext);
  return context; // Ya no lanza error, usa el valor por defecto si no hay provider
}; 