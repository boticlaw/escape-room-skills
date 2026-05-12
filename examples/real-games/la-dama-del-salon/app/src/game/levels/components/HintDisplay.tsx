import React, { useRef, useEffect } from 'react';

interface HintDisplayProps {
  hint: string;
  showHint: boolean;
  onShowHint: () => void;
}

const HintDisplay: React.FC<HintDisplayProps> = ({ hint, showHint, onShowHint }) => {
  const scrollPosRef = useRef<number>(0);
  
  // Capturar el clic y prevenir comportamiento por defecto
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Guardar la posición actual del scroll
    scrollPosRef.current = window.scrollY || document.documentElement.scrollTop;
    
    // Programar la restauración de la posición después de la actualización de estado
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollPosRef.current,
          behavior: 'auto' // Uso 'auto' en lugar de 'smooth' para evitar animación
        });
      });
    });
    
    // Ejecutar la función que muestra la pista
    onShowHint();
  };
  
  // Efecto adicional para asegurar que se mantiene la posición
  useEffect(() => {
    if (showHint) {
      // Usar setTimeout para asegurar que se ejecuta después del renderizado
      const timer = setTimeout(() => {
        window.scrollTo({
          top: scrollPosRef.current,
          behavior: 'auto'
        });
      }, 10);
      
      return () => clearTimeout(timer);
    }
  }, [showHint]);

  return (
    <div className="hint-container">
      {showHint ? (
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 dark:bg-blue-900/30 dark:border-blue-700">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Pista</h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-200">{hint}</p>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="mt-4 w-full bg-amber-100 text-amber-800 py-2 px-4 rounded-md hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:bg-amber-900/30 dark:text-amber-200 dark:hover:bg-amber-800/40"
        >
          Mostrar pista
        </button>
      )}
    </div>
  );
};

export default HintDisplay; 