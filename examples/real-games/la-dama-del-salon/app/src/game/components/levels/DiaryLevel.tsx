import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LevelHeader from '../common/LevelHeader';
import { LevelData } from '../../data/levels';
import { useGameProgress } from '../../hooks/useGameProgress';
import GameLoader from '../GameLoader';

interface DiaryLevelProps {
  levelData: LevelData;
}

export const DiaryLevel: React.FC<DiaryLevelProps> = ({ levelData }) => {
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { markLevelComplete, useHint } = useGameProgress(levelData.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (answer.toLowerCase().trim() === levelData.solution.toLowerCase().trim()) {
      setFeedback({ correct: true, message: '¡Correcto! Has completado este nivel.' });
    } else {
      setFeedback({ correct: false, message: 'Respuesta incorrecta. Intenta de nuevo.' });
    }
  };

  const handleNext = async () => {
    try {
      setIsLoading(true);
      // Marcar nivel como completado y obtener el siguiente nivel
      const nextLevelId = await markLevelComplete();
      
      // Navegación inmediata al siguiente nivel o de vuelta al mapa
      setTimeout(() => {
        if (nextLevelId) {
          navigate(`/game/level/${nextLevelId}`, { replace: true });
        } else {
          navigate('/game', { replace: true });
        }
      }, 1000); // Cambiado a 1000ms
    } catch (error) {
      console.error('Error al avanzar de nivel:', error);
      setIsLoading(false);
    }
  };

  const handleHintClick = () => {
    if (!showHint) {
      useHint();
    }
    setShowHint(!showHint);
  };

  // Crear un array de elementos que incluye párrafos y la imagen en la posición correcta
  const renderDiaryContent = () => {
    if (!levelData.diaryContent) return null;
    
    const paragraphs = levelData.diaryContent.split('\n\n');
    const contentElements: React.ReactNode[] = [];
    
    const imagePosition = levelData.imagePositionAfterParagraph ?? -1;
    
    paragraphs.forEach((paragraph, index) => {
      // Añadir párrafo con keywords resaltados
      contentElements.push(
        <p key={`p-${index}`} className="mb-4">
          {highlightKeywords(paragraph, levelData.highlightedKeywords || [])}
        </p>
      );
      
      // Añadir imagen después del párrafo correspondiente
      if (index === imagePosition && levelData.imageUrl) {
        contentElements.push(
          <div key={`img-container`} className="flex justify-center my-4">
            <div className="relative inline-block">
              <div className="bg-white p-3 shadow-md rotate-1 transform">
                <img 
                  src={levelData.imageUrl} 
                  alt="Imagen del diario" 
                  className="max-w-full h-auto max-h-64 sepia"
                />
              </div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 rotate-12 w-10 h-4 bg-gray-300/60"></div>
            </div>
          </div>
        );
      }
    });
    
    return contentElements;
  };

  // Función para resaltar palabras clave
  const highlightKeywords = (text: string, keywords: string[]) => {
    if (!keywords || !keywords.length) return text;
    
    // Escapar caracteres especiales para RegExp
    const escapedKeywords = keywords.map(keyword => 
      keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    
    // Crear regex que coincida con palabras completas
    const regex = new RegExp(`(${escapedKeywords.join('|')})`, 'gi');
    
    // Dividir el texto por las coincidencias
    const parts = text.split(regex);
    
    // Mapear las partes alternando entre texto normal y resaltado
    return parts.map((part, index) => {
      if (keywords.some(kw => part.toLowerCase() === kw.toLowerCase())) {
        return <span key={index} className="bg-yellow-200 font-semibold">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-4">
      {isLoading && <GameLoader text="Avanzando al siguiente nivel..." timeout={1000} />}
      
      <LevelHeader title={levelData.title} subtitle={levelData.description} />
      
      <div className="p-3 mt-3 bg-amber-100 rounded-lg shadow border-amber-300 border">
        <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed p-4 border-amber-200 border rounded-md bg-amber-50 shadow-inner">
          {renderDiaryContent()}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="mt-6">
        <h3 className="text-lg font-medium mb-2">
          Basándote en la lectura del diario, ¿cuál es la respuesta correcta?
        </h3>
        
        <input
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm mb-4 dark:bg-boxdark-2 dark:border-gray-600 dark:text-white"
          placeholder="Tu respuesta"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            type="button" 
            className="p-2 border border-amber-500 text-amber-700 rounded-md hover:bg-amber-100 dark:border-amber-700 dark:text-amber-400"
            onClick={handleHintClick}
          >
            {showHint ? 'Ocultar pista' : 'Mostrar pista'}
          </button>
          
          <button 
            type="submit" 
            className="p-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
          >
            Verificar respuesta
          </button>
        </div>
        
        {showHint && (
          <div className="p-3 mt-4 bg-amber-50 rounded-md border border-amber-200">
            <p className="text-sm">
              <strong>Pista:</strong> {levelData.hint}
            </p>
          </div>
        )}
        
        {feedback && (
          <div 
            className={`p-3 mt-4 rounded-md ${
              feedback.correct ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200'
            }`}
          >
            <p>{feedback.message}</p>
            {feedback.correct && (
              <button 
                className="mt-2 p-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={handleNext}
              >
                Continuar
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default DiaryLevel; 