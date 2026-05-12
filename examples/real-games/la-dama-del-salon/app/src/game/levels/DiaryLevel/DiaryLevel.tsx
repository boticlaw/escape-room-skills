import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LevelGuard from '../../components/LevelGuard';
import VideoModal from '../../components/VideoModal';
import HintDisplay from '../components/HintDisplay';
import MessageDisplay from '../components/MessageDisplay';
import ProgressStats from '../components/ProgressStats';
import StarPuzzle from '../../components/StarPuzzle';
import Piano from '../../components/Piano';
import MinesweeperModal from '../../components/MinesweeperModal';
import MemoryCard from '../../components/MemoryCard';
import FishSortGame from '../../components/FishSortGame';
import { getLevelById, getNextLevelId } from '../../data/levels';
import { useGameProgress } from '../../hooks/useGameProgress';
import { useDebug } from '../../context/DebugContext';
import GeoLocationChecker from '../../components/GeoLocationChecker';
import GeminiChatModal from '../../components/GeminiChatModal';
import FishGameLocationWrapper from '../../components/FishGameLocationWrapper';
import { PursuitEscapeGame } from '../../components';
import CodeLockBox from '../../components/CodeLockBox';
import MonsterEscapeGame from '../../components/MonsterEscapeGame';

interface DiaryLevelProps {
  levelId: string;
}

const DiaryLevel: React.FC<DiaryLevelProps> = ({ levelId }) => {
  const navigate = useNavigate();
  const { isDebugEnabled } = useDebug();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
  const [showGeoChecker, setShowGeoChecker] = useState(false);
  const [showSolutionText, setShowSolutionText] = useState(false);
  const [showMinesweeperModal, setShowMinesweeperModal] = useState(false);
  const [isSolitaireComplete, setIsSolitaireComplete] = useState(false);
  const [showGeoCheckerLevel5, setShowGeoCheckerLevel5] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [answer, setAnswer] = useState('');
  const [flowerAnswer, setFlowerAnswer] = useState('');
  const [isVillaComplete, setIsVillaComplete] = useState(false);
  const [isFlowerComplete, setIsFlowerComplete] = useState(false);
  const [isFishGameComplete, setIsFishGameComplete] = useState(false);
  const [locationVerified, setLocationVerified] = useState<boolean>(isDebugEnabled);
  const [escapeGameAttempts, setEscapeGameAttempts] = useState<number>(0);
  const [level7Code, setLevel7Code] = useState('');
  const [showLevel7Form, setShowLevel7Form] = useState(false);
  const loadingElementRef = useRef<HTMLDivElement | null>(null);
  const escapeGameRef = useRef<HTMLDivElement | null>(null);
  
  // Estados para el enigma del nivel 4
  const [laredoYear, setLaredoYear] = useState('');
  const [astilleroYear, setAstilleroYear] = useState('');
  const [enigmaFeedback, setEnigmaFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  
  const [videoId, setVideoId] = useState("g0V2_dKage0");
  
  const {
    gameProgress,
    message,
    setMessage,
    markLevelComplete,
    useHint
  } = useGameProgress(levelId);
  
  const level = getLevelById(levelId);
  
  const keywords = useMemo(() => {
    if (!level?.highlightedKeywords) return [];
    return level.highlightedKeywords;
  }, [level]);
  
  const renderHighlightedParagraph = (paragraph: string, index: number): React.ReactNode => {
    if (!paragraph) return null;
    let highlightedParagraph = paragraph;
    
    // Mensajes de depuración mejorados
    console.log(`Level ${levelId} paragraph ${index}:`, paragraph);
    console.log(`Level ${levelId} keywords:`, keywords);
    
    if (keywords.length > 0) {
      // Ordenar palabras clave por longitud (de más larga a más corta)
      // para evitar problemas con palabras que son subconjuntos de otras
      const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
      console.log(`Level ${levelId} sorted keywords:`, sortedKeywords);
      
      sortedKeywords.forEach(keyword => {
        // Escapar caracteres especiales de expresiones regulares
        const escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        
        // Crear regex adecuada según el tipo de palabra clave
        const regex = keyword.includes(' ') || keyword.includes('-') || /[^\w]/.test(keyword)
          ? new RegExp(`(${escapedKeyword})`, 'gi')  // Para frases o palabras con caracteres especiales
          : new RegExp(`\\b(${escapedKeyword})\\b`, 'gi'); // Para palabras únicas
        
        // Comprobar si hay coincidencias en este párrafo
        const hasMatches = paragraph.match(regex);
        console.log(`Level ${levelId} keyword "${keyword}": matches=${hasMatches ? hasMatches.length : 0}`);
        
        // Reemplazar las coincidencias con spans resaltados
        highlightedParagraph = highlightedParagraph.replace(
          regex, 
          (match, p1) => {
            console.log(`Level ${levelId} replacing: "${match}" with highlighted span`);
            return `<span class="text-amber-800 font-bold bg-amber-100 px-1 rounded">${p1}</span>`;
          }
        );
      });
    }
    
    return (
      <p 
        key={`${levelId}-p-${index}`} 
        className="mb-6 indent-6 leading-relaxed" 
        dangerouslySetInnerHTML={{ __html: highlightedParagraph }}
      />
    );
  };
  
  useEffect(() => {
    if (levelId === "1") {
      setIsVideoModalOpen(true);
    } else {
      setIsVideoModalOpen(false);
    }
  }, [levelId]);
  
  useEffect(() => {
    // Limpiar el popup de carga si existe (del nivel anterior)
    if (loadingElementRef.current && document.body.contains(loadingElementRef.current)) {
      console.log('Eliminando popup de carga al cambiar de nivel');
      document.body.removeChild(loadingElementRef.current);
      loadingElementRef.current = null;
    }
    
    setShowHint(false);
    setLocationError(null);
    setIsPuzzleComplete(false);
    setShowGeoChecker(false);
    setShowSolutionText(false);
    setShowMinesweeperModal(false);
    
    // Limpiar cualquier mensaje al cambiar de nivel
    // Usar un pequeño timeout para asegurar que el mensaje se limpia después de la navegación
    setTimeout(() => {
      setMessage({ text: "", type: "" });
      console.log('Mensaje limpiado al cambiar al nivel', levelId);
    }, 100);
  }, [levelId, setMessage]);
  
  useEffect(() => {
    // Agregamos una limpieza global que se ejecutará al montar el componente
    const handleBeforeUnload = () => {
      if (loadingElementRef.current && document.body.contains(loadingElementRef.current)) {
        console.log('Eliminando popup por evento beforeunload');
        document.body.removeChild(loadingElementRef.current);
        loadingElementRef.current = null;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Eliminar el elemento de carga si existe
      if (loadingElementRef.current && document.body.contains(loadingElementRef.current)) {
        console.log('Limpiando popup en efecto de limpieza');
        document.body.removeChild(loadingElementRef.current);
        loadingElementRef.current = null;
      }
    };
  }, []);
  
  // Añadir useEffect para hacer scroll al juego cuando se valida la ubicación
  useEffect(() => {
    if (levelId === '10' && locationVerified && escapeGameRef.current) {
      escapeGameRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [levelId, locationVerified]);
  
  if (!level || gameProgress.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        <p className="ml-3">Cargando...</p>
      </div>
    );
  }
  
  const handleLevelAdvance = async (successMessage: string) => {
    setMessage({ text: successMessage, type: "success" });
    
    try {
      // Ejecutar markLevelComplete y obtener el siguiente nivel
      const nextLevelId = await markLevelComplete();
      
      // Esperar un momento breve para que el estado se actualice
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Mostrar un indicador de carga solo después de obtener el siguiente nivel
      const loadingElement = document.createElement('div');
      loadingElementRef.current = loadingElement;
      loadingElement.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
      loadingElement.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
          <p class="text-lg font-semibold">Avanzando al siguiente nivel...</p>
        </div>
      `;
      
      // Añadir el indicador al cuerpo
      document.body.appendChild(loadingElement);
      
      // Programar eliminación del popup y navegación
      setTimeout(() => {
        // Asegurarnos de eliminar el popup antes de navegar
        if (loadingElementRef.current && document.body.contains(loadingElementRef.current)) {
          document.body.removeChild(loadingElementRef.current);
          loadingElementRef.current = null;
        }
        
        // Navegar al siguiente nivel o a completado
        if (nextLevelId) {
          // Usar replace: true y asegurarnos de limpiar el estado local antes de navegar
          // Esto fuerza a que se cargue completamente la nueva página
          setMessage({ text: "", type: "" });
          setLocationError(null);
          setIsPuzzleComplete(false);
          setShowGeoChecker(false);
          setShowSolutionText(false);
          setShowMinesweeperModal(false);
          navigate(`/game/level/${nextLevelId}`, { replace: true });
        } else {
          navigate('/game/completed', { replace: true });
        }
      }, 500); // Reducido a 500ms
      
    } catch (error) {
      console.error('Error al avanzar de nivel:', error);
      setMessage({ text: "Hubo un problema al avanzar al siguiente nivel", type: "error" });
    }
  };

  const handleLocationReached = () => {
    // Para el nivel 3, mostrar el buscaminas en lugar de avanzar directamente
    if (levelId === '3') {
      setMessage({ text: "¡Has encontrado el lugar! Ahora debes desactivar las trampas.", type: "success" });
      setShowMinesweeperModal(true);
    } 
    // Para el nivel 6, mostrar el chat con Los Abuelos
    else if (levelId === '6') {
      setMessage({ text: "¡Has llegado al lugar correcto! Los abuelos te están esperando.", type: "success" });
      setShowChatModal(true);
    }
    else {
      handleLevelAdvance("¡Has llegado al lugar correcto!");
    }
  };
  
  const handleLocationError = (error: string) => {
    setLocationError(error);
    setMessage({ text: error, type: "error" });
  };
  
  const handleShowHint = async () => {
    setShowHint(true);
    await useHint();
  };
  
  const handlePuzzleComplete = () => {
    setIsPuzzleComplete(true);
    setTimeout(() => {
      setShowSolutionText(true);
      setTimeout(() => {
        setShowGeoChecker(true);
      }, 500); // Reducido de 1500 a 500 ms
    }, 500); // Reducido de 1000 a 500 ms
  };

  const handleCorrectSequence = () => {
    // Para el nivel 2 (piano), usamos una implementación especial
    if (levelId === '2') {
      setMessage({ text: "¡Has tocado la melodía correcta!", type: "success" });
      
      // Esperamos un momento antes de hacer la transición
      setTimeout(async () => {
        try {
          const nextLevelId = await markLevelComplete();
          
          // Limpiamos el estado antes de navegar
          setMessage({ text: "", type: "" });
          setLocationError(null);
          setIsPuzzleComplete(false);
          setShowGeoChecker(false);
          setShowSolutionText(false);
          setShowMinesweeperModal(false);
          
          // Navegamos directamente sin popup para el caso nivel 2 a nivel 3
          if (nextLevelId) {
            navigate(`/game/level/${nextLevelId}`, { replace: true });
          } else {
            navigate('/game/completed', { replace: true });
          }
        } catch (error) {
          console.error('Error al avanzar al nivel 3:', error);
          setMessage({ text: "Hubo un problema al avanzar al siguiente nivel", type: "error" });
        }
      }, 1000);
    } else {
      // Para otros niveles usamos el método estándar
      handleLevelAdvance("¡Has tocado la melodía correcta!");
    }
  };

  // Función que se llama cuando el jugador completa el buscaminas
  const handleMinesweeperComplete = () => {
    setMessage({ text: "¡Has desactivado todas las trampas! El camino está despejado.", type: "success" });
    
    // Esperar un momento para mostrar el mensaje antes de avanzar
    setTimeout(() => {
      handleLevelAdvance("¡Has completado el desafío!");
    }, 1000);
  };

  // Función para manejar cuando se completa el solitario
  const handleSolitaireComplete = () => {
    setIsSolitaireComplete(true);
    setMessage({ text: "¡Has descubierto la clave de los abuelos!", type: "success" });
    
    // Avanzar automáticamente al nivel 6 después de una breve pausa
    setTimeout(async () => {
      try {
        const nextLevelId = await markLevelComplete();
        if (nextLevelId) {
          // Limpiar completamente el estado antes de navegar
          setMessage({ text: "", type: "" });
          setLocationError(null);
          setIsPuzzleComplete(false);
          setShowGeoChecker(false);
          setShowSolutionText(false);
          setShowMinesweeperModal(false);
          setIsSolitaireComplete(false);
          navigate(`/game/level/${nextLevelId}`, { replace: true });
        } else {
          navigate('/game/completed', { replace: true });
        }
      } catch (error) {
        console.error('Error al avanzar al siguiente nivel:', error);
        setMessage({ text: "Hubo un problema al avanzar al siguiente nivel", type: "error" });
      }
    }, 2000);
  };

  // Añadir handler para el juego de peces
  const handleFishGameComplete = () => {
    setIsFishGameComplete(true);
    setMessage({ text: "¡Has organizado todas las bolas! Has encontrado el pasadizo.", type: "success" });
    
    // Avanzar automáticamente al siguiente nivel después de una breve pausa
    setTimeout(() => {
      handleLevelAdvance("¡Has completado el desafío de las bolas de colores!");
    }, 2000);
  };

  return (
    <LevelGuard currentLevelId={parseInt(levelId)}>
      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => {
          setIsVideoModalOpen(false);
          
          // Ya no usamos el modal para el nivel 12
        }}
        videoId={videoId}
        autoplay={true}
      />
      
      {/* Modal del Buscaminas para el nivel 3 */}
      <MinesweeperModal
        isOpen={showMinesweeperModal}
        onClose={() => setShowMinesweeperModal(false)}
        onGameWon={handleMinesweeperComplete}
      />
      
      {/* Modal de Chat con Los Abuelos para el nivel 6 */}
      <GeminiChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        onComplete={() => {
          setShowChatModal(false);
          handleLevelAdvance("¡Has descubierto una pista sobre la calle Clavel!");
        }}
      />
      
      {/* Para el nivel 5, mostrar solo el juego de memoria centrado sin formato de diario */}
      {levelId === '5' ? (
        <div className="min-h-screen bg-amber-50 flex items-center justify-center">
          <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center">
            <div className="w-full flex justify-center mb-4">
              <MemoryCard 
                onComplete={handleSolitaireComplete}
              />
            </div>
            
            {/* El GeoLocationChecker se ha eliminado */}

            <div className="mt-8 w-full">
              <MessageDisplay message={message} />
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-amber-50 py-12 px-4 sm:py-6 sm:px-2 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 sm:mb-3 flex justify-between items-center">
              <span className="inline-flex items-center px-3 py-1 sm:px-2 sm:py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-sm sm:text-xs font-medium">
                Nivel {levelId}
              </span>
            </div>
            
            <div className="bg-amber-100 border-amber-300 border shadow-lg rounded-lg overflow-hidden transform rotate-1 sm:rotate-0 relative">
              <div className="absolute top-0 right-0 w-0 h-0 border-0 border-t-[30px] border-r-[30px] sm:border-t-[15px] sm:border-r-[15px] border-amber-200 border-b-transparent border-l-transparent shadow-md"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0 border-0 border-b-[30px] border-l-[30px] sm:border-b-[15px] sm:border-l-[15px] border-amber-200 border-t-transparent border-r-transparent shadow-md"></div>
              
              <div className="p-8 sm:p-3 bg-gradient-to-r from-amber-50 to-amber-100 relative">
                <div className="absolute top-2 left-2 w-24 h-24 sm:w-16 sm:h-16 opacity-30 sm:opacity-20">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-amber-900">
                    {levelId === '1' && <g transform="translate(5,5) scale(0.9)"><path d="M20,80 C25,70 45,45 65,25 C70,20 80,15 85,10 C87,8 90,5 92,12 C93,16 90,20 88,22 C80,30 70,40 60,50 C50,60 40,70 30,80 C28,82 25,85 20,80 Z" fill="currentColor" opacity="0.7" /><path d="M30,80 L20,80 C25,70 45,45 65,25 L75,25 C55,45 35,70 30,80 Z" fill="currentColor" opacity="0.3" /><circle cx="65" cy="40" r="18" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" /><path d="M65,22 L65,40 L78,40" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7" /><circle cx="65" cy="40" r="2" fill="currentColor" opacity="0.7" /></g>}
                    {levelId === '2' && <g transform="translate(5,5) scale(0.9)"><path d="M50,10 C45,10 40,15 38,20 C36,25 35,30 35,35 C35,40 37,45 40,48 C43,51 45,55 45,60 C45,65 43,70 40,75 C37,80 35,85 35,90 L65,90 C65,85 63,80 60,75 C57,70 55,65 55,60 C55,55 57,51 60,48 C63,45 65,40 65,35 C65,30 64,25 62,20 C60,15 55,10 50,10" fill="currentColor" opacity="0.7"/><path d="M35,35 C35,30 33,25 30,20 C27,15 25,10 25,5 C25,3 30,2 35,3 C40,4 45,5 50,5 C55,5 60,4 65,3 C70,2 75,3 75,5 C75,10 73,15 70,20 C67,25 65,30 65,35" fill="currentColor" opacity="0.5"/></g>}
                  </svg>
                </div>
                
                <div className="rotate-[-1deg] sm:rotate-0">
                  <h1 className="text-2xl md:text-xl sm:text-base xs:text-sm font-bold text-amber-900 mb-6 md:mb-4 sm:mb-2 font-serif text-center underline decoration-wavy decoration-amber-800 underline-offset-8 sm:underline-offset-3">
                    {level.title}
                  </h1>
                  
                  <div className="font-serif text-amber-950">
                    <div className="mb-10 md:mb-6 sm:mb-2 flex justify-end">
                      <div className="relative sm:scale-70 sm:origin-right">
                        <div className="bg-amber-50 p-2 md:p-1.5 sm:p-0.5 shadow-sm border-b border-amber-800 transform -rotate-1 relative">
                          <div className="absolute top-1 h-[80%] w-[1px] left-0 bg-amber-700 opacity-30"></div>
                          <div className="absolute top-1 h-[80%] w-[1px] right-0 bg-amber-700 opacity-30"></div>
                          <div className="px-4 md:px-3 sm:px-2 py-1 sm:py-0.5 relative">
                            <div className="text-center">
                              <p className="text-amber-900 font-serif text-lg md:text-base sm:text-xs leading-snug sm:leading-tight">
                                <span className="border-b border-amber-700 border-dashed pb-[1px] tracking-wide">
                                  {level.description}
                                </span>
                              </p>
                            </div>
                            <div className="h-[2px] w-full mt-1 sm:mt-0.5 bg-gradient-to-r from-transparent via-amber-800 to-transparent opacity-40"></div>
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 w-2 h-1 bg-amber-950 rounded-full opacity-10 transform rotate-45"></div>
                        <div className="absolute bottom-0 left-6 w-1 h-1 bg-amber-950 rounded-full opacity-15"></div>
                      </div>
                    </div>

                    <div className="prose prose-amber prose-lg md:prose-base sm:prose-xs max-w-none text-amber-950 sm:leading-tight">
                      {(() => {
                        const paragraphs = level.diaryContent?.split('\n\n') || [];
                        const imagePos = level.imagePositionAfterParagraph;
                        const hasImage = !!level.imageUrl;
                        const elementsToRender: React.ReactNode[] = [];

                        const imageElement = hasImage && levelId !== "11" && (
                          <div key={`${levelId}-img`} className="my-8 md:my-6 sm:my-4 flex justify-center"> 
                            <div className="relative transform rotate-2 hover:rotate-0 transition-transform duration-150 ease-in-out max-w-md sm:max-w-[85%]">
                              <div className="relative border-4 border-amber-50/60 shadow-md overflow-hidden">
                                <picture>
                                  <source srcSet={level.imageUrl?.replace(/\.(jpg|png)$/, '.webp')} type="image/webp" />
                                  <img 
                                    src={level.imageUrl} 
                                    alt={`Imagen del nivel ${levelId}`}
                                    className={`block w-full h-auto ${levelId === '4' || levelId === '8' ? 'grayscale' : 'sepia-[20%] contrast-[1.05] brightness-[0.98]'} ${levelId === '8' ? 'max-w-[250px] mx-auto' : ''}`}
                                    onError={(e) => { 
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none'; 
                                    }}
                                  />
                                </picture>
                                <div className="absolute inset-0 bg-amber-50/10 mix-blend-multiply"></div>
                              </div>
                              <div className="absolute -top-2 -left-3 w-12 h-5 sm:w-8 sm:h-4 bg-yellow-200/60 backdrop-blur-[1px] border border-yellow-400/30 transform -rotate-[25deg] shadow-sm" style={{ clipPath: 'polygon(0 0, 100% 15%, 100% 100%, 0% 85%)' }}></div>
                              <div className="absolute -top-3 -right-2 w-10 h-5 sm:w-7 sm:h-4 bg-yellow-200/60 backdrop-blur-[1px] border border-yellow-400/30 transform rotate-[20deg] shadow-sm" style={{ clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0 100%)' }}></div>
                              <div className="absolute -bottom-3 -right-3 w-14 h-6 sm:w-10 sm:h-5 bg-yellow-200/60 backdrop-blur-[1px] border border-yellow-400/30 transform -rotate-[30deg] shadow-sm" style={{ clipPath: 'polygon(0 0, 85% 0, 100% 100%, 15% 100%)' }}></div>
                            </div>
                          </div>
                        );

                        // Para el nivel 7, solo mostrar el contenido si locationVerified es true
                        if (levelId === '7' && !locationVerified) {
                          // No renderizar los párrafos para el nivel 7 hasta que el usuario responda correctamente
                          return null;
                        }

                        paragraphs.forEach((paragraphContent, index) => {
                          elementsToRender.push(renderHighlightedParagraph(paragraphContent, index));

                          if (imageElement && typeof imagePos === 'number' && imagePos === index) {
                            elementsToRender.push(imageElement);
                          }
                        });

                        if (imageElement && typeof imagePos === 'undefined') {
                          elementsToRender.push(imageElement);
                        }

                        return elementsToRender;
                      })()}

                      {/* Añadir GeoLocationChecker para el nivel 11 */}
                      {levelId === '11' && level.location && (
                        <div className="my-8">
                          <GeoLocationChecker 
                            targetLocation={level.location}
                            onLocationReached={() => {
                              setMessage({ text: "¡Has encontrado el banco donde Clara escondió su diario!", type: "success" });
                              setTimeout(async () => {
                                try {
                                  // Marcar el nivel actual como completado antes de navegar
                                  await markLevelComplete();
                                  // Ahora navegamos al nivel 12
                                  navigate(`/game/level/12`, { replace: true });
                                } catch (error) {
                                  console.error('Error al completar el nivel:', error);
                                  setMessage({ text: "Hubo un problema al avanzar al siguiente nivel", type: "error" });
                                }
                              }, 1500);
                            }}
                            onError={handleLocationError}
                            distanceThreshold={25}
                            testUserLocation={isDebugEnabled ? {
                              latitude: level.location.latitude,
                              longitude: level.location.longitude,
                              name: "Ubicación simulada para pruebas"
                            } : undefined}
                          />
                        </div>
                      )}

                      {/* Componente CodeLockBox para el nivel 12 */}
                      {levelId === '12' && (
                        <div className="my-8">
                          <CodeLockBox
                            correctCode="63239"
                            onSuccess={() => {
                              setMessage({ text: "¡La caja ha sido abierta! Has descubierto el gran secreto de Clara.", type: "success" });
                              // Ya no mostramos el video modal, navegamos directamente al nivel 13
                              setTimeout(async () => {
                                try {
                                  await markLevelComplete();
                                  navigate('/game/level/13', { replace: true });
                                } catch (error) {
                                  console.error('Error al completar el nivel:', error);
                                  setMessage({ text: "Hubo un problema al avanzar al siguiente nivel", type: "error" });
                                }
                              }, 1500);
                            }}
                            onIncorrect={(attempt) => {
                              // Eliminamos el mensaje de error para códigos incorrectos
                              // setMessage({ text: `Combinación incorrecta: ${attempt}. Intenta de nuevo.`, type: "error" });
                            }}
                            maxAttempts={0} // Intentos ilimitados
                          />
                        </div>
                      )}

                    </div>

                    {/* Formulario para el nivel 7 - Villa (colocado al inicio) */}
                    {levelId === '7' && !locationVerified && (
                      <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-6 shadow-inner">
                        <div className="mb-5 p-4 border-l-4 border-amber-400 bg-amber-100/70 rounded-r">
                          <p className="font-serif text-amber-800 italic leading-relaxed text-lg">
                            "Aún recuerdo el día que mi madre le puso el nombre a la villa. No, mi madre no se llama así, ni siquiera mi abuela, pero ella siempre fue fanática de la protagonista de su novela favorita..."
                          </p>
                        </div>
                        
                        {isDebugEnabled && (
                          <div className="mb-3 p-2 bg-black/10 rounded-md text-xs">
                            <p className="font-bold text-amber-800 mb-1">Información de depuración:</p>
                            <p className="text-amber-700">
                              <span className="font-medium">Respuesta correcta:</span> Celia
                            </p>
                          </div>
                        )}
                        
                        <h3 className="text-lg font-semibold text-amber-800 mb-4 text-center">
                          ¿Cómo se llamaba la protagonista de la novela?
                        </h3>
                        
                        <div className="flex flex-col gap-4 justify-center">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={answer}
                              onChange={(e) => setAnswer(e.target.value)}
                              placeholder="Escribe tu respuesta aquí..."
                              className="w-full p-2 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-center">
                          <button
                            onClick={() => {
                              if (answer.trim().toLowerCase() === "celia") {
                                setMessage({ text: "¡Correcto! Has descubierto el nombre de la protagonista.", type: "success" });
                                setTimeout(() => {
                                  setLocationVerified(true);
                                  setShowSolutionText(true); // Asegurar que el texto se muestre
                                  setShowLevel7Form(true); // Mostrar el formulario en lugar de avanzar automáticamente
                                }, 1500);
                              } else {
                                setMessage({ text: "Respuesta incorrecta. Intenta de nuevo.", type: "error" });
                              }
                            }}
                            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors duration-200"
                          >
                            Verificar respuesta
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Formulario para pasar al siguiente nivel en nivel 7 */}
                    {levelId === '7' && showLevel7Form && (
                      <>
                        {/* Imagen de flores encima del formulario */}
                        <div className="my-8 flex justify-center">
                          <div className="relative transform rotate-2 hover:rotate-0 transition-transform duration-150 ease-in-out max-w-md sm:max-w-[85%]">
                            <div className="relative border-4 border-amber-50/60 shadow-md overflow-hidden">
                              <picture>
                                <source srcSet="/images/flores.webp" type="image/webp" />
                                <img 
                                  src="/images/flores.jpg" 
                                  alt="Flores del nivel 7"
                                  className="block w-full h-auto sepia-[20%] contrast-[1.05] brightness-[0.98]"
                                  onError={(e) => { 
                                    const target = e.target as HTMLImageElement;
                                    console.error("Error al cargar la imagen flores.jpg");
                                    target.style.display = 'none'; 
                                  }}
                                />
                              </picture>
                              <div className="absolute inset-0 bg-amber-50/10 mix-blend-multiply"></div>
                            </div>
                            <div className="absolute -top-2 -left-3 w-12 h-5 sm:w-8 sm:h-4 bg-yellow-200/60 backdrop-blur-[1px] border border-yellow-400/30 transform -rotate-[25deg] shadow-sm" style={{ clipPath: 'polygon(0 0, 100% 15%, 100% 100%, 0% 85%)' }}></div>
                            <div className="absolute -top-3 -right-2 w-10 h-5 sm:w-7 sm:h-4 bg-yellow-200/60 backdrop-blur-[1px] border border-yellow-400/30 transform rotate-[20deg] shadow-sm" style={{ clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0 100%)' }}></div>
                            <div className="absolute -bottom-3 -right-3 w-14 h-6 sm:w-10 sm:h-5 bg-yellow-200/60 backdrop-blur-[1px] border border-yellow-400/30 transform -rotate-[30deg] shadow-sm" style={{ clipPath: 'polygon(0 0, 85% 0, 100% 100%, 15% 100%)' }}></div>
                          </div>
                        </div>

                        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6 shadow-inner animate-fadeIn">
                          <h3 className="text-lg font-semibold text-amber-800 mb-4 text-center">
                            Introduce la clave para continuar tu aventura
                            {isDebugEnabled && (
                              <span className="ml-2 text-xs font-normal text-red-600">(Modo Debug Activo)</span>
                            )}
                          </h3>
                          
                          {isDebugEnabled && (
                            <div className="mb-3 p-2 bg-black/10 rounded-md text-xs">
                              <p className="font-bold text-amber-800 mb-1">Información de depuración:</p>
                              <p className="text-amber-700">
                                <span className="font-medium">Código correcto:</span> 6298
                              </p>
                            </div>
                          )}
                          
                          <div className="flex flex-col gap-4 justify-center">
                            <div className="flex-1">
                              <input
                                type="number"
                                value={level7Code}
                                onChange={(e) => setLevel7Code(e.target.value)}
                                placeholder="Introduce el código..."
                                className={`w-full p-2 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                                  isDebugEnabled ? 'ring-2 ring-green-500' : ''
                                }`}
                              />
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-center">
                            <button
                              onClick={() => {
                                if (level7Code.trim() === "6298") {
                                  handleLevelAdvance("¡Has descubierto el diario completo!");
                                } else {
                                  setMessage({ text: "Código incorrecto. Intenta de nuevo.", type: "error" });
                                }
                              }}
                              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors duration-200"
                            >
                              Continuar
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {levelId === '2' && (
                      <div className="mt-8 sm:mt-4 animate-fadeIn">
                         <Piano 
                           onCorrectSequence={handleCorrectSequence} 
                           showPlayedSequence={showHint}
                         />
                      </div>
                    )}
                    
                    {levelId === '3' && !isPuzzleComplete && (
                      <StarPuzzle onComplete={handlePuzzleComplete} />
                    )}
                    
                    {levelId === '3' && showSolutionText && (
                       <div className="my-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-center shadow-md animate-pulse">
                           <p className="text-xl font-bold text-yellow-800 font-serif tracking-wider">
                              {level.solution} 
                           </p>
                       </div>
                    )}
                    
                    {/* Enigma para el nivel 4 - Laredo y Astillero */}
                    {levelId === '4' && (
                      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6 shadow-inner">
                        {isDebugEnabled && (
                          <div className="mb-3 p-2 bg-black/10 rounded-md text-xs">
                            <p className="font-bold text-amber-800 mb-1">Información de depuración:</p>
                            <p className="text-amber-700">
                              <span className="font-medium">Respuestas correctas:</span>
                            </p>
                            <p className="text-amber-700 mt-1">
                              <span className="font-medium">Laredo:</span> 1803
                            </p>
                            <p className="text-amber-700 mt-1">
                              <span className="font-medium">Astillero:</span> 1880
                            </p>
                          </div>
                        )}
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <div className="flex-1">
                            <label className="block text-amber-700 text-sm font-medium mb-1">Laredo:</label>
                            <input
                              type="number"
                              value={laredoYear}
                              onChange={(e) => setLaredoYear(e.target.value)}
                              className={`w-full p-2 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                                isDebugEnabled ? 'ring-2 ring-green-500' : ''
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-amber-700 text-sm font-medium mb-1">Astillero:</label>
                            <input
                              type="number"
                              value={astilleroYear}
                              onChange={(e) => setAstilleroYear(e.target.value)}
                              className={`w-full p-2 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                                isDebugEnabled ? 'ring-2 ring-green-500' : ''
                              }`}
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-center">
                          <button
                            onClick={() => {
                              if (parseInt(laredoYear) === 1803 && parseInt(astilleroYear) === 1880) {
                                setEnigmaFeedback({
                                  message: "¡Correcto!",
                                  isCorrect: true
                                });
                                
                                // Esperar un momento y luego avanzar al siguiente nivel
                                setTimeout(() => {
                                  handleLevelAdvance("¡Has descifrado el enigma!");
                                }, 1500);
                              } else {
                                setEnigmaFeedback({
                                  message: "Incorrecto. Vuelve a intentarlo.",
                                  isCorrect: false
                                });
                              }
                            }}
                            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                          >
                            Verificar respuesta
                          </button>
                        </div>
                        
                        {enigmaFeedback && (
                          <div className={`mt-4 p-3 rounded-md text-center ${
                            enigmaFeedback.isCorrect 
                              ? 'bg-green-50 text-green-700 border border-green-300' 
                              : 'bg-red-50 text-red-700 border border-red-300'
                          }`}>
                            <p>{enigmaFeedback.message}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Añadir FishSortGame para el nivel 8 */}
                    {levelId === '8' && !isFishGameComplete && (
                      <div className="my-8">
                        {level.location ? (
                          <FishGameLocationWrapper 
                            targetLocation={level.location}
                            onGameWon={handleFishGameComplete}
                            difficulty="easy"
                            distanceThreshold={25}
                          />
                        ) : (
                          <FishSortGame 
                            onGameWon={handleFishGameComplete}
                            difficulty="easy"
                          />
                        )}
                      </div>
                    )}

                    {/* Añadir GeoLocationChecker para el nivel 9 */}
                    {levelId === '9' && level.location && (
                      <div className="my-8">
                        <GeoLocationChecker 
                          targetLocation={level.location}
                          onLocationReached={handleLocationReached}
                          onError={handleLocationError}
                          distanceThreshold={25}
                          testUserLocation={isDebugEnabled ? {
                            latitude: level.location.latitude,
                            longitude: level.location.longitude,
                            name: "Ubicación simulada para pruebas"
                          } : undefined}
                        />
                      </div>
                    )}

                    {/* Añadir GeoLocationChecker para el nivel 10 */}
                    {levelId === '10' && level.location && !locationVerified && (
                      <div className="my-8">
                        <GeoLocationChecker 
                          targetLocation={level.location}
                          onLocationReached={() => {
                            setLocationVerified(true);
                            setMessage({ text: "¡Has llegado al lugar correcto! Ahora debes enfrentarte a los secuaces del Marqués.", type: "success" });
                          }}
                          onError={handleLocationError}
                          distanceThreshold={25}
                          testUserLocation={isDebugEnabled ? {
                            latitude: level.location.latitude,
                            longitude: level.location.longitude,
                            name: "Ubicación simulada para pruebas"
                          } : undefined}
                        />
                      </div>
                    )}

                    {/* Añadir el juego de escape de monstruos para el nivel 10 */}
                    {levelId === '10' && locationVerified && (
                      <div className="my-4 sm:my-8" ref={escapeGameRef}>
                        <div className="mb-3 sm:mb-6 bg-amber-50 p-2 sm:p-4 rounded-lg border border-amber-200 shadow-sm">
                          <h3 className="text-lg font-medium text-amber-900 mb-2">
                            Ayúdame a despistarlos
                          </h3>
                          <p className="text-amber-700 mb-4">
                            He observado que la pista se mantiene; por ello, me he adentrado por los senderos del parque hasta hallar este enigmático rincón, donde cada sombra susurra secretos del pasado. Pero me está costando escapar de ellos y ya son muchas vueltas las que llevo dando. ¿Me puedes ayudar?
                          </p>
                        </div>
                        <div className="mb-4 sm:mb-8">
                          <MonsterEscapeGame
                            onGameWon={() => {
                              setMessage({ text: "¡Has descifrado el enigma de los recuerdos!", type: "success" });
                              setTimeout(async () => {
                                try {
                                  await markLevelComplete();
                                  navigate(`/game/level/11`, { replace: true });
                                } catch (error) {
                                  console.error('Error al completar el nivel:', error);
                                  setMessage({ text: "Hubo un problema al avanzar al siguiente nivel", type: "error" });
                                }
                              }, 1500);
                            }}
                            onGameOver={() => setEscapeGameAttempts(prev => prev + 1)}
                            difficulty="medium"
                            reducedTarget={escapeGameAttempts >= 8}
                          />
                        </div>
                      </div>
                    )}

                    {/* Video embebido para el nivel 13 */}
                    {levelId === '13' && (
                      <div className="my-8">
                        <div className="relative pb-[56.25%] h-0 overflow-hidden mb-6">
                          <iframe
                            src="https://www.youtube.com/embed/4DFxPJ47h2U?rel=0&modestbranding=1&playsinline=1&autoplay=1"
                            title="Video de Clara"
                            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                            allowFullScreen
                          ></iframe>
                        </div>
                        {/* Añadir GeoLocationChecker para el nivel 13 */}
                        {levelId === '13' && level.location && (
                          <div className="my-8">
                            <GeoLocationChecker 
                              targetLocation={level.location}
                              onLocationReached={handleLocationReached}
                              onError={handleLocationError}
                              distanceThreshold={25}
                              testUserLocation={isDebugEnabled ? {
                                latitude: level.location.latitude,
                                longitude: level.location.longitude,
                                name: "Ubicación simulada para pruebas"
                              } : undefined}
                            />
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
            
            {level.location && (
              (levelId === '1' || 
               (levelId === '3' && showGeoChecker))
            ) && (
              <div className="mt-8 sm:mt-4">
                <GeoLocationChecker 
                  targetLocation={level.location}
                  onLocationReached={handleLocationReached}
                  onError={handleLocationError}
                  distanceThreshold={25}
                  // Usar coordenadas de prueba en modo debug para facilitar el testing
                  testUserLocation={isDebugEnabled ? {
                    latitude: level.location.latitude,
                    longitude: level.location.longitude,
                    name: "Ubicación simulada para pruebas"
                  } : undefined}
                />
              </div>
            )}

            {/* Mostrar la pista general solo si no estamos en el nivel 7 sin verificar */}
            {!(levelId === '7' && !locationVerified) && (
              <HintDisplay 
                hint={level.hint}
                showHint={showHint}
                onShowHint={handleShowHint}
              />
            )}

            {/* Añadir HintDisplay específico para el nivel 7 solo cuando no está verificado */}
            {levelId === '7' && !locationVerified && (
              <div className="mt-4">
                <HintDisplay 
                  hint="Busca la villa y tendrás la respuesta"
                  showHint={showHint}
                  onShowHint={handleShowHint}
                />
              </div>
            )}

            {/* Añadir GeoLocationChecker para el nivel 6 */}
            {levelId === '6' && level.location && (
              <div className="mt-8 sm:mt-4">
                <GeoLocationChecker 
                  targetLocation={level.location}
                  onLocationReached={handleLocationReached}
                  onError={handleLocationError}
                  distanceThreshold={25}
                  // Usar coordenadas de prueba en modo debug para facilitar el testing
                  testUserLocation={isDebugEnabled ? {
                    latitude: level.location.latitude,
                    longitude: level.location.longitude,
                    name: "Ubicación simulada para pruebas"
                  } : undefined}
                />
              </div>
            )}

            <MessageDisplay message={message} />
          </div>
        </div>
      )}
    </LevelGuard>
  );
};

export default DiaryLevel; 