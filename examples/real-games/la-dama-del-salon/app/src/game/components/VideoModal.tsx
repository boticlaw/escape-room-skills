import React, { useState, useEffect, useCallback } from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  autoplay?: boolean;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoId, autoplay = true }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Manejar el efecto de montaje para evitar problemas con SSR
  useEffect(() => {
    setIsMounted(true);
    
    // Bloquear scroll del cuerpo cuando el modal está abierto
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    // Limpiar al desmontar
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Función para manejar el gesto de deslizar hacia abajo para cerrar
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchEnd - touchStart;
    const isDownSwipe = distance > 70; // Umbral para considerar un deslizamiento significativo
    
    if (isDownSwipe) {
      onClose();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, onClose]);

  // Si el modal no está abierto o el componente no está montado, no renderizar nada
  if (!isOpen || !isMounted) {
    return null;
  }

  // Crear la URL de YouTube con parámetros adecuados para dispositivos móviles
  const youtubeUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1${autoplay ? '&autoplay=1' : ''}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="relative w-full max-w-4xl h-0 pb-[56.25%] sm:pb-[56.25%]"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={youtubeUrl}
          title="Video"
          id="modal-title"
          className="absolute inset-0 w-full h-full rounded-lg shadow-2xl"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        ></iframe>

        {/* Botón para cerrar - más grande y visible para móviles */}
        <button
          className="absolute -top-12 sm:-top-14 right-0 p-2 text-white hover:text-gray-300 focus:outline-none"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Indicador visual para deslizar en móviles */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 md:hidden">
          <div className="w-10 h-1 rounded-full bg-white bg-opacity-50"></div>
          <p className="text-sm text-white text-opacity-70 mt-2">Desliza hacia abajo para cerrar</p>
        </div>
      </div>
    </div>
  );
};

export default VideoModal; 