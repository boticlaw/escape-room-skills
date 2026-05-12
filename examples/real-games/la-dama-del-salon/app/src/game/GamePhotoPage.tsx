import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';

const photocallOverlayVertical = '/images/photocall-frame.svg'; // Marco para orientación vertical
const photocallOverlayHorizontal = '/images/photocall-frame-horizontal.svg'; // Marco para orientación horizontal

// Componente memoizado para reducir re-renderizados innecesarios
const GamePhotoPage: React.FC = React.memo(() => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [combinedImage, setCombinedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraChanging, setIsCameraChanging] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Detectar si es dispositivo móvil (memoizado para evitar recálculos)
  const isMobile = useMemo(() => {
    const isMobileDevice = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent);
    console.log('Detección de dispositivo móvil:', {
      userAgent: navigator.userAgent,
      isMobileDetected: isMobileDevice
    });
    return isMobileDevice;
  }, []);
  
  // Detectar dispositivos de gama baja
  const isLowEndDevice = useMemo(() => {
    const memory = (navigator as any).deviceMemory;
    const cores = (navigator as any).hardwareConcurrency;
    return isMobile && (memory <= 2 || cores <= 4 || window.devicePixelRatio <= 1);
  }, [isMobile]);
  
  // Detectar orientación
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  
  // Seleccionar el marco adecuado según la orientación
  const currentOverlay = isPortrait ? photocallOverlayVertical : photocallOverlayHorizontal;

  // Monitorear cambios de orientación con mejor rendimiento
  useEffect(() => {
    const handleOrientationChange = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    // Usar API de orientación específica para móviles si está disponible
    if (isMobile && window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', handleOrientationChange);
      return () => {
        window.screen.orientation.removeEventListener('change', handleOrientationChange);
      };
    } else {
      // Fallback al método tradicional con debounce
      let timeout: NodeJS.Timeout;
      const debouncedHandler = () => {
        clearTimeout(timeout);
        timeout = setTimeout(handleOrientationChange, 150);
      };
      
      window.addEventListener('resize', debouncedHandler);
      return () => {
        window.removeEventListener('resize', debouncedHandler);
        clearTimeout(timeout);
      };
    }
  }, [isMobile]);

  // Inicializar la cámara y verificar permisos
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        // Opciones de alta resolución
        const videoConstraints = {
          facingMode: 'user', // Forzar siempre cámara frontal
          width: { 
            ideal: isPortrait 
              ? (isLowEndDevice ? 1080 : 1920) 
              : (isLowEndDevice ? 1920 : 2560) 
          },
          height: { 
            ideal: isPortrait 
              ? (isLowEndDevice ? 1440 : 2560) 
              : (isLowEndDevice ? 1080 : 1440) 
          }
        };
        
        await navigator.mediaDevices.getUserMedia({ 
          video: videoConstraints,
          audio: false
        });
        setCameraError(null);
      } catch (err) {
        console.error('Error al acceder a la cámara:', err);
        setCameraError('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
      }
    };
    
    initializeCamera();
  }, [isPortrait, isLowEndDevice]);

  // Cargar el marco y precargar la imagen para asegurarse de que esté disponible
  const [frameImage, setFrameImage] = useState<HTMLImageElement | null>(null);
  
  useEffect(() => {
    const img = new Image();
    img.src = currentOverlay;
    img.onload = () => {
      setFrameImage(img);
    };
  }, [currentOverlay]);

  // Aplicar la combinación cuando se capture una imagen
  useEffect(() => {
    if (capturedImage && frameImage) {
      setIsProcessing(true);
      combineImages(capturedImage);
    }
  }, [capturedImage, frameImage]);

  // Regenerar la imagen combinada cuando cambia la orientación
  useEffect(() => {
    if (capturedImage && combinedImage) {
      // Volver a combinar las imágenes con el nuevo marco
      combineImages(capturedImage);
    }
  }, [isPortrait]);

  // Añadir estado para forzar el remontaje de la cámara si es necesario
  const [cameraKey, setCameraKey] = useState<number>(0);

  // Estado para el contador
  const [countdown, setCountdown] = useState<number | null>(null);

  // Función para iniciar la cuenta regresiva más robusta
  const startCountdown = () => {
    // No permitir iniciar otro contador si ya hay uno en progreso
    if (countdown !== null) return;
    
    // Tiempo de espera adaptativo según el dispositivo
    const countdownDuration = isLowEndDevice ? 4 : 3;
    setCountdown(countdownDuration);
    
    let remainingTime = countdownDuration;
    const timer = setInterval(() => {
      remainingTime -= 1;
      
      if (remainingTime <= 0) {
          clearInterval(timer);
        setCountdown(null);
        // Pequeño retardo para dar feedback visual
        setTimeout(() => {
          capture();
        }, 100);
      } else {
        setCountdown(remainingTime);
      }
    }, 1000);
    
    // Limpiar el intervalo si el componente se desmonta durante la cuenta regresiva
    return () => clearInterval(timer);
  };
  
  // Ancho responsivo basado en la orientación
  const containerClass = isMobile && !isPortrait 
    ? "max-w-full mx-auto flex flex-row items-center gap-1 px-0" // Eliminar padding completamente
    : "max-w-md mx-auto"; // Ancho normal en orientación vertical

  // Definir aspect ratio basado en la orientación
  const webcamContainerClass = isMobile && !isPortrait
    ? "relative aspect-[16/9] w-full max-w-[90%]" // Aumentar aún más el ancho para la cámara
    : "relative aspect-[3/4] w-full"; // Aspect ratio vertical

  // Función para obtener un nombre de archivo personalizado con fecha
  const getPhotoFilename = () => {
    const date = new Date();
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const formattedTime = `${date.getHours()}-${date.getMinutes()}`;
    return `dama-del-salon-equipo-${formattedDate}_${formattedTime}.jpg`;
  };

  // Combinar la imagen capturada con el marco
  const combineImages = (photoSrc: string) => {
    setIsProcessing(true);
    
    // Capturar la orientación exacta en el momento de la combinación para evitar cambios inesperados
    const currentIsPortrait = window.innerHeight > window.innerWidth;
    
    // Cargar las imágenes
    const photo = new Image();
    const overlay = new Image();
    
    photo.onload = () => {
      // Usar el marco correcto según la orientación actual
      const currentOverlayToUse = currentIsPortrait ? photocallOverlayVertical : photocallOverlayHorizontal;
      overlay.src = currentOverlayToUse;
      
      overlay.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Configurar dimensiones según la orientación capturada
        if (currentIsPortrait) {
          canvas.width = 2160; // 4K vertical
          canvas.height = 3840;
        } else {
          canvas.width = 3840; // 4K horizontal
          canvas.height = 2160;
        }
        
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          // Optimizar para la mejor calidad posible
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Verificar la orientación de la imagen capturada para evitar distorsión
          const photoWidth = photo.width;
          const photoHeight = photo.height;
          const photoIsPortrait = photoHeight > photoWidth;
          
          // Si la orientación de la foto no coincide con la orientación actual, ajustar
          if (photoIsPortrait !== currentIsPortrait) {
            console.log('Corrigiendo orientación de la imagen', {photoWidth, photoHeight, currentIsPortrait});
            
            // Rotar el canvas para corregir la orientación si es necesario
            if (!photoIsPortrait && currentIsPortrait) {
              // Horizontal a vertical
              ctx.save();
              ctx.translate(canvas.width/2, canvas.height/2);
              ctx.rotate(Math.PI/2);
              ctx.drawImage(photo, -canvas.height/2, -canvas.width/2, canvas.height, canvas.width);
              ctx.restore();
            } else if (photoIsPortrait && !currentIsPortrait) {
              // Vertical a horizontal
              ctx.save();
              ctx.translate(canvas.width/2, canvas.height/2);
              ctx.rotate(-Math.PI/2);
              ctx.drawImage(photo, -canvas.height/2, -canvas.width/2, canvas.height, canvas.width);
              ctx.restore();
            }
          } else {
            // Orientación normal
            ctx.drawImage(photo, 0, 0, canvas.width, canvas.height);
          }
          
          // Dibujar el marco encima
          ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height);
          
          // Usar JPEG con calidad máxima
          const combinedImageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
          
          setCombinedImage(combinedImageDataUrl);
          setIsProcessing(false);
        }
      };
    };
    
    photo.src = photoSrc;
  };

  // Opciones de webcam adaptativas
  const getWebcamOptions = () => {
    // Configuración con resolución máxima
    return {
      facingMode: 'user', // Cámara frontal fija
      width: { ideal: 3840 }, // 4K
      height: { ideal: 2160 }, // 4K
    };
  };

  // Capturar la foto con la orientación actual
  const capture = () => {
    if (!webcamRef.current) return;
    
    try {
      // Capturar y guardar la orientación actual
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (imageSrc) {
        // Guardar la orientación junto con la imagen
        setCapturedImage(imageSrc);
      } else {
        console.error("Error al capturar: no se obtuvo la imagen");
        setCameraError("No se pudo capturar la imagen. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error durante la captura:", error);
      setCameraError("Error al procesar la captura. Inténtalo de nuevo.");
    }
  };

  // Volver a tomar la foto
  const retake = () => {
    setCapturedImage(null);
    setCombinedImage(null);
  };

  return (
    <div className="min-h-screen bg-black py-0 px-0"> {/* Eliminar márgenes completamente */}
      {/* Navbar simplificado - Ocultar en horizontal */}
      <header className={`absolute inset-x-0 top-0 z-50 bg-black bg-opacity-80 ${!isPortrait && isMobile ? 'hidden' : ''}`}>
        <nav className="flex items-center justify-between p-1">
          <div className="flex items-center">
            <Link to="/game/completed" className="flex items-center text-amber-400 hover:text-amber-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-semibold">Volver</span>
            </Link>
          </div>
          <div className="text-center">
            <span className="text-amber-400 text-sm font-semibold">La Dama del Salón</span>
          </div>
          <div className="w-10">
            {/* Espacio vacío para equilibrar el navbar */}
          </div>
        </nav>
      </header>
      
      {/* Canvas oculto para combinar imágenes */}
      <canvas ref={canvasRef} className="hidden"></canvas>
      
      <div className={`${containerClass} ${isMobile && !isPortrait ? 'mt-0' : 'mt-12'}`}> {/* Eliminar margen superior en horizontal */}
        {/* Botón de volver en modo horizontal */}
        {!isPortrait && isMobile && (
          <div className="absolute top-1 left-1 z-50">
            <Link to="/game/completed" className="flex items-center justify-center bg-black bg-opacity-50 text-amber-400 hover:text-amber-300 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        )}
        
        {!isPortrait && isMobile && (
          <h1 className="text-lg font-bold text-white absolute top-0 left-0 right-0 text-center mt-1">Foto de Equipo</h1>
        )}
        
        {isPortrait && (
          <h1 className="text-2xl font-bold text-white text-center mb-6">Foto de Equipo</h1>
        )}
        
        {cameraError && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
            <p>{cameraError}</p>
            <p className="mt-2 text-sm">
              Para usar esta función, debes permitir el acceso a la cámara en la configuración de tu navegador.
            </p>
            <button 
              onClick={async () => {
                try {
                  // Resetear estados
                  setCameraError(null);
                  
                  // Liberar cualquier stream existente
                  if (webcamRef.current && webcamRef.current.video) {
                    const currentStream = webcamRef.current.video.srcObject as MediaStream;
                    if (currentStream) {
                      currentStream.getTracks().forEach(track => {
                        track.stop();
                        console.log('Track detenido:', track.kind, track.label);
                      });
                    }
                  }
                  
                  // Forzar un reinicio completo de la cámara
                  setCameraKey(prevKey => prevKey + 1);
                  
                  // Esperar a que se liberen los recursos
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  
                  // Intentar inicializar la cámara explícitamente
                  const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                      facingMode: 'user',
                      width: { ideal: 1920 },
                      height: { ideal: 1080 }
                    }
                  });
                  
                  console.log('Cámara reiniciada con éxito:', stream.getVideoTracks().map(t => t.label));
                  
                } catch (error) {
                  console.error('Error al reiniciar cámara:', error);
                  setCameraError("No se pudo acceder a la cámara después de reintentar. Por favor, recarga la página o verifica los permisos del navegador.");
                }
              }}
              className="mt-2 w-full py-2 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none"
            >
              Reintentar acceso a la cámara
            </button>
          </div>
        )}
        
        <div className={`bg-black rounded-lg overflow-hidden ${!isPortrait && isMobile ? 'h-screen flex-grow' : ''}`}>
          <div className={webcamContainerClass}>
            {!capturedImage ? (
              <>
                <Webcam
                  key={`webcam-${cameraKey}`}
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={getWebcamOptions()}
                  className="absolute inset-0 w-full h-full object-cover"
                  screenshotQuality={1.0}
                  forceScreenshotSourceSize
                  mirrored={true} // Siempre espejo para cámara frontal
                  onUserMedia={(stream) => {
                    // Éxito en la inicialización de la cámara
                    setCameraError(null);
                    console.log('Cámara inicializada correctamente');
                  }}
                  onUserMediaError={(err) => {
                    console.error("Error de cámara:", err);
                    // Mensaje de error más descriptivo para facilitar la depuración
                    const errorMessage = typeof err === 'string' 
                      ? err 
                      : (err as any)?.name === 'OverconstrainedError' 
                        ? "La cámara no puede cumplir con los requisitos solicitados. Intente reiniciar." 
                        : (err as any)?.name === 'NotFoundError' 
                          ? "No se encontró ninguna cámara."
                          : (err as any)?.message || "Error al acceder a la cámara.";
                    
                    setCameraError(`Error: ${errorMessage}`);
                  }}
                />
                <img 
                  src={currentOverlay} 
                  alt="Marco decorativo estilo 1897 para la foto de recuerdo de La Dama del Salón" 
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                />
                
                {/* Mostrar contador de cuenta regresiva */}
                {countdown !== null && (
                  <div className="absolute inset-0 flex items-center justify-center z-30 bg-black bg-opacity-50">
                    <div className="w-24 h-24 rounded-full bg-black bg-opacity-70 flex items-center justify-center">
                      <span className="text-white text-5xl font-bold">{countdown}</span>
                    </div>
                  </div>
                )}
                
                {/* Instrucciones para colocarse */}
                {!countdown && (
                  <div className="absolute inset-0 pointer-events-none z-5 flex items-center justify-center">
                    <div className="opacity-70 bg-black bg-opacity-40 p-2 rounded-lg">
                      <p className="text-center text-white font-bold">
                        Colocaros todo el equipo para la foto
                      </p>
                    </div>
                  </div>
                )}

                {/* Botón grande de captura en modo horizontal */}
                {!isPortrait && isMobile && !countdown && !capturedImage && (
                  <button
                    onClick={startCountdown}
                    className="absolute bottom-4 right-4 z-40 p-5 bg-amber-600 text-white rounded-full shadow-lg"
                    aria-label="Capturar foto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </>
            ) : (
              // Mostrar imagen combinada o la original con marco superpuesto mientras se procesa
              combinedImage ? (
                <img 
                  src={combinedImage} 
                  alt="Foto con marco" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <>
                  <img 
                    src={capturedImage} 
                    alt="Foto capturada" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <img 
                    src={currentOverlay} 
                    alt="Marco decorativo estilo 1897 para la foto de recuerdo de La Dama del Salón" 
                    className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  />
                  
                  {/* Indicador de carga mientras se procesa la imagen */}
                  {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center z-30 bg-black bg-opacity-50">
                      <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
                        <svg className="animate-spin h-6 w-6 text-amber-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-amber-600 font-medium">Procesando imagen...</span>
                      </div>
                    </div>
                  )}
                </>
              )
            )}
          </div>
          
          {/* UI diferente en horizontal vs vertical */}
          {!isPortrait && isMobile && !capturedImage ? (
            <></>
          ) : (
            // UI normal para orientación vertical o cuando hay imagen capturada
            <div className="px-4 py-3 bg-gray-50">
              {!capturedImage ? (
                <button
                  onClick={startCountdown}
                  disabled={countdown !== null}
                  className={`w-full ${isMobile && !isPortrait ? 'py-3 text-lg' : 'py-2'} px-4 bg-amber-600 text-white font-medium rounded-md hover:bg-amber-700 focus:outline-none flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  {countdown === null ? 'Capturar foto' : 'Preparando...'}
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={retake}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none flex items-center justify-center touch-manipulation"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Repetir
                  </button>
                  <a
                    href={combinedImage || capturedImage || '#'}
                    download={getPhotoFilename()}
                    className={`flex-1 py-2 px-4 bg-amber-600 text-white font-medium rounded-md hover:bg-amber-700 focus:outline-none text-center flex items-center justify-center touch-manipulation ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={(e) => {
                      if (isProcessing) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {isProcessing ? 'Preparando...' : 'Descargar'}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className={`text-center mt-6 ${!isPortrait && isMobile ? 'hidden' : ''}`}>
          <p className="text-amber-300 text-sm mb-4">
            La foto se guarda localmente en tu dispositivo. 
            ¡Compártela en redes con #LaDamaDelSalon!
          </p>
          
          <Link
            to="/game/completed"
            className="text-amber-400 hover:text-amber-300 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver al video final
          </Link>
        </div>
      </div>
    </div>
  );
});

export default GamePhotoPage; 