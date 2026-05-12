import React, { useState, useEffect } from 'react';
import { useDebug } from '../context/DebugContext';
import './MemoryCard.css';

// Definición de tipos
interface MemoryCardProps {
  onComplete: () => void;
}

interface Card {
  id: number;
  symbol: string;
  position: number;
  isFlipped: boolean;
  isMatched: boolean;
  letter?: string; // Para la fase final cuando se revela ABUELOS
}

// La palabra secreta que se revela al completar el juego de memoria
const SECRET_WORD = 'ABUELOS';

// Símbolos para las cartas (caracteres especiales o emojis)
const SYMBOLS = ['☉', '☽', '♃', '♄', '♆', '♇', '⚳', '⚴', '♀', '♂', '☿', '♈', '♌', '♎'];

const MemoryCard: React.FC<MemoryCardProps> = ({ onComplete }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [showingWord, setShowingWord] = useState<boolean>(false);
  const { isDebugEnabled } = useDebug();

  // Inicializar el juego
  useEffect(() => {
    resetGame();
  }, []);

  // Verificar si el juego está completo
  useEffect(() => {
    // El total de pares es la mitad del número de cartas (cada par tiene 2 cartas)
    const totalPairs = cards.length / 2;
    
    if (matchedPairs === totalPairs && !gameCompleted && cards.length > 0) {
      setGameCompleted(true);
      
      // Breve pausa y luego reorganizar las cartas para mostrar ABUELOS
      setTimeout(() => {
        revealSecretWord();
      }, 1000);
    }
  }, [matchedPairs, gameCompleted, cards.length]);

  // Reorganizar las cartas para mostrar ABUELOS
  const revealSecretWord = () => {
    // Crear una distribución de cartas que formen la palabra ABUELOS
    const wordCards: Card[] = [];
    const letterPositions = calculateLetterPositions();
    
    // Para cada letra de ABUELOS, crear una carta
    for (let i = 0; i < SECRET_WORD.length; i++) {
      wordCards.push({
        id: i,
        symbol: SECRET_WORD[i], // La carta ahora muestra la letra
        position: letterPositions[i],
        isFlipped: true,
        isMatched: true,
        letter: SECRET_WORD[i]
      });
    }
    
    // Completar el tablero con espacios vacíos o cartas decorativas
    const totalCards = letterPositions.length;
    for (let i = SECRET_WORD.length; i < totalCards; i++) {
      wordCards.push({
        id: i,
        symbol: '✦', // Símbolo decorativo
        position: letterPositions[i],
        isFlipped: true,
        isMatched: true
      });
    }
    
    // Actualizar el estado para mostrar las cartas reorganizadas
    setCards(wordCards);
    setShowingWord(true);
    
    // Esperar un momento y luego completar el juego
    setTimeout(() => {
      onComplete();
    }, 3000);
  };
  
  // Calcular posiciones para las letras de ABUELOS
  const calculateLetterPositions = () => {
    // Asumimos un tablero de 4x4 (16 cartas) o 3x4 (12 cartas)
    // Queremos que las letras estén centradas
    const positions: number[] = [];
    const totalCards = 16; // 4x4
    const rowSize = 4;
    
    // Calcular la posición central para la palabra
    const startRow = 1; // Comenzar en la segunda fila para centrar
    const wordLength = SECRET_WORD.length;
    const startCol = Math.floor((rowSize - wordLength) / 2);
    
    // Asignar posiciones para cada letra
    for (let i = 0; i < wordLength; i++) {
      positions.push(startRow * rowSize + startCol + i);
    }
    
    // Llenar el resto de posiciones
    for (let i = 0; i < totalCards; i++) {
      if (!positions.includes(i)) {
        positions.push(i);
      }
    }
    
    return positions;
  };

  // Reiniciar el juego
  const resetGame = () => {
    // Seleccionar los símbolos a usar (necesitamos pares)
    const numberOfPairs = 8; // 16 cartas (8 pares) para un tablero de 4x4
    const gameSymbols = [...SYMBOLS].sort(() => 0.5 - Math.random()).slice(0, numberOfPairs);
    
    // Crear pares de cartas
    let newCards: Card[] = [];
    
    // Crear dos cartas por cada símbolo
    gameSymbols.forEach((symbol, index) => {
      // Primera carta del par
      newCards.push({
        id: index * 2,
        symbol,
        position: 0, // Se establecerá durante la barajada
        isFlipped: false,
        isMatched: false
      });
      
      // Segunda carta del par
      newCards.push({
        id: index * 2 + 1,
        symbol,
        position: 0, // Se establecerá durante la barajada
        isFlipped: false,
        isMatched: false
      });
    });
    
    // Barajar las cartas
    newCards = shuffleCards(newCards);
    
    // Asignar posiciones
    newCards.forEach((card, index) => {
      card.position = index;
    });
    
    setCards(newCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setGameCompleted(false);
    setShowingWord(false);
  };

  // Barajar las cartas
  const shuffleCards = (cardArray: Card[]): Card[] => {
    const shuffled = [...cardArray];
    
    // En modo debug, podemos mantener un orden específico para facilitar testing
    if (isDebugEnabled) {
      // Crear un orden predecible para testing
      for (let i = 0; i < shuffled.length; i += 2) {
        shuffled[i].position = i;
        shuffled[i+1].position = i+1;
      }
      return shuffled;
    }
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  };

  // Manejar el clic en una carta
  const handleCardClick = (clickedCard: Card) => {
    // Ignorar si:
    // - la carta ya está volteada
    // - la carta ya está emparejada
    // - ya hay dos cartas volteadas esperando
    // - el juego ya está completo
    if (
      clickedCard.isFlipped ||
      clickedCard.isMatched ||
      flippedCards.length >= 2 ||
      gameCompleted
    ) {
      return;
    }

    // Voltear la carta
    const updatedCards = cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    
    setCards(updatedCards);
    
    // Añadir a las cartas volteadas
    const updatedFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(updatedFlippedCards);
    
    // Si ya hay dos cartas volteadas, comprobar si coinciden
    if (updatedFlippedCards.length === 2) {
      // Comprobar si las dos cartas volteadas tienen el mismo símbolo
      const [firstCard, secondCard] = updatedFlippedCards;
      
      if (firstCard.symbol === secondCard.symbol) {
        // Son pareja, marcarlas como emparejadas
        setTimeout(() => {
          const matchedCards = cards.map((card) =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isMatched: true }
              : card
          );
          
          setCards(matchedCards);
          setFlippedCards([]);
          setMatchedPairs(matchedPairs + 1);
        }, 800);
      } else {
        // No son pareja, voltearlas de nuevo después de un tiempo
        setTimeout(() => {
          const resetCards = cards.map((card) =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isFlipped: false }
              : card
          );
          
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Renderizar una carta
  const renderCard = (card: Card) => {
    // Determinar el contenido visible de la carta
    let content;
    let cardClass = "relative w-full h-full bg-amber-100 rounded-lg shadow-md flex items-center justify-center transform transition-all duration-300";
    
    if (card.isFlipped || card.isMatched) {
      // Si estamos mostrando la palabra final (ABUELOS)
      if (showingWord) {
        // Si es una de las letras de ABUELOS
        if (card.letter) {
          content = <span className="text-3xl sm:text-4xl font-serif font-bold text-amber-800">{card.letter}</span>;
          cardClass += " bg-amber-300 ring-2 ring-amber-500";
        } else {
          // Es una carta decorativa
          content = <span className="text-xl sm:text-2xl text-amber-400">{card.symbol}</span>;
          cardClass += " bg-amber-100";
        }
      } else {
        // Juego normal - mostrar símbolo de la carta
        content = <span className="text-3xl sm:text-4xl">{card.symbol}</span>;
        cardClass += card.isMatched ? " bg-amber-300" : " bg-amber-200";
      }
    } else {
      // Carta boca abajo
      content = <span className="text-2xl sm:text-3xl text-amber-800">?</span>;
      cardClass += " hover:scale-105 active:scale-105";
    }
    
    // Añadir estilos adicionales según el estado
    if (card.isMatched && !showingWord) {
      cardClass += " ring-2 ring-amber-500";
    }
    
    // En modo debug, mostrar información adicional
    if (isDebugEnabled && !showingWord) {
      content = (
        <div className="flex flex-col items-center">
          {content}
          <span className="text-xs mt-1">
            Símbolo: {card.symbol}
          </span>
        </div>
      );
    }
    
    return (
      <div
        key={card.id}
        className="w-[60px] h-[84px] sm:w-[70px] sm:h-[98px] perspective-1000 cursor-pointer flex items-center justify-center touch-manipulation"
        onClick={() => handleCardClick(card)}
        style={{
          gridColumn: (card.position % 4) + 1,
          gridRow: Math.floor(card.position / 4) + 1
        }}
      >
        <div
          className={`${cardClass} ${
            card.isFlipped || card.isMatched
              ? "rotate-y-180"
              : ""
          }`}
        >
          {content}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center my-4 sm:my-8">
      <div className="mb-4 sm:mb-6 text-center">
        <h3 className="text-lg sm:text-xl font-serif font-bold text-amber-800">
          Juego de Memoria
        </h3>
        <p className="text-xs sm:text-sm text-amber-700 mt-2 max-w-md mx-auto px-2">
          Encuentra todos los pares de símbolos antiguos para revelar el secreto.
        </p>
      </div>
      
      {/* Tablero de juego */}
      <div 
        className="bg-amber-50 p-4 sm:p-6 border-2 border-amber-300 rounded-lg shadow-inner flex items-center justify-center"
      >
        <div className="grid grid-cols-4 grid-rows-4 gap-2 sm:gap-4" style={{ width: 'min(350px, 100%)', height: 'auto', maxWidth: '100vw' }}>
          {cards.map(renderCard)}
        </div>
      </div>
      
      {/* Botón para modo debug y reinicio del juego */}
      {isDebugEnabled && !gameCompleted && (
        <button
          className="mt-4 px-3 py-1 bg-amber-800 text-white rounded-md hover:bg-amber-900 transition-colors text-sm"
          onClick={() => {
            // En modo debug, mostrar directamente la palabra
            setGameCompleted(true);
            revealSecretWord();
          }}
        >
          Completar Juego (Debug)
        </button>
      )}
    </div>
  );
};

export default MemoryCard; 