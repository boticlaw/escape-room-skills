import React, { useState, useEffect } from 'react';
import { useDebug } from '../context/DebugContext';

interface PianoProps {
  onCorrectSequence: () => void;
  showPlayedSequence?: boolean;
}

// Notas del piano en español
type Note = 'Do' | 'Do#' | 'Re' | 'Re#' | 'Mi' | 'Fa' | 'Fa#' | 'Sol' | 'Sol#' | 'La' | 'La#' | 'Si' | 'Mib';

// Las primeras 4 notas de la 5ª sinfonía de Beethoven (en notación española)
// Sol-Sol-Sol-Mib (en lugar de G-G-G-Eb)
// Extendida a 8 notas: Sol-Sol-Sol-Mib, Fa-Fa-Fa-Re
const BEETHOVEN_SEQUENCE: Note[] = ['Sol', 'Sol', 'Sol', 'Mib', 'Fa', 'Fa', 'Fa', 'Re'];
const REQUIRED_CONSECUTIVE_NOTES = 8; // Número de notas consecutivas correctas necesarias

// Mapeo de español a inglés (solo para cálculo de frecuencia)
const noteToEnglish: Record<Note, string> = {
  'Do': 'C', 'Do#': 'C#', 'Re': 'D', 'Re#': 'D#', 'Mi': 'E', 'Fa': 'F',
  'Fa#': 'F#', 'Sol': 'G', 'Sol#': 'G#', 'La': 'A', 'La#': 'A#', 'Si': 'B',
  'Mib': 'Eb' // Mib es enarmónico con Re#
};

// Notas enarmónicas (notas que suenan igual pero se escriben diferente)
const enarmonicEquivalents: Record<string, string[]> = {
  'Re#': ['Mib'], 
  'Mib': ['Re#']
};

// Mapeo de inglés a español (para el display de teclas negras si es necesario)
const englishToNote: Record<string, Note> = {
  'C': 'Do', 'C#': 'Do#', 'D': 'Re', 'D#': 'Re#', 'E': 'Mi', 'F': 'Fa',
  'F#': 'Fa#', 'G': 'Sol', 'G#': 'Sol#', 'A': 'La', 'A#': 'La#', 'B': 'Si',
  'Eb': 'Mib'
};

const Piano: React.FC<PianoProps> = ({ onCorrectSequence, showPlayedSequence }) => {
  const [playedNotes, setPlayedNotes] = useState<Note[]>([]);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [correctSequenceStarted, setCorrectSequenceStarted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showHints, setShowHints] = useState(false); // Estado para controlar la visualización de pistas
  const { isDebugEnabled } = useDebug(); // Usar el contexto de depuración centralizado

  // Detectar si es un dispositivo táctil
  useEffect(() => {
    const detectTouchDevice = () => {
      setIsTouchDevice(('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
    };
    detectTouchDevice();
  }, []);

  // Inicializar el audio context al montar el componente
  useEffect(() => {
    // Create audio context only after user interaction
    const setupAudio = () => {
      if (!audioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);
        document.removeEventListener('click', setupAudio);
      }
    };
    document.addEventListener('click', setupAudio);
    return () => {
      document.removeEventListener('click', setupAudio);
    };
  }, [audioContext]);

  // Comprobar si la secuencia tocada coincide con el inicio de la 5ª sinfonía
  useEffect(() => {
    if (playedNotes.length > 0) {
      // Buscar una subsecuencia de notas correctas consecutivas
      let maxConsecutiveCorrect = 0;
      let currentConsecutive = 0;
      let sequenceStartIndex = -1;

      // Buscar secuencias correctas en cualquier parte del historial de notas
      for (let i = 0; i <= playedNotes.length - REQUIRED_CONSECUTIVE_NOTES; i++) {
        currentConsecutive = 0;
        
        // Verificar cuántas notas consecutivas correctas hay a partir de esta posición
        for (let j = 0; j < BEETHOVEN_SEQUENCE.length && i + j < playedNotes.length; j++) {
          if (playedNotes[i + j] === BEETHOVEN_SEQUENCE[j]) {
            currentConsecutive++;
            
            // Si encontramos suficientes notas consecutivas, guardamos la posición inicial
            if (currentConsecutive === REQUIRED_CONSECUTIVE_NOTES && sequenceStartIndex === -1) {
              sequenceStartIndex = i;
            }
          } else {
            break; // Si hay una nota incorrecta, rompemos esta secuencia
          }
        }
        
        maxConsecutiveCorrect = Math.max(maxConsecutiveCorrect, currentConsecutive);
      }

      // Verificar si se ha iniciado una secuencia correcta (al menos 3 notas)
      if (maxConsecutiveCorrect >= 3) {
        setCorrectSequenceStarted(true);
      } else {
        setCorrectSequenceStarted(false);
      }

      // Verificar si hay suficientes notas consecutivas correctas
      if (maxConsecutiveCorrect >= REQUIRED_CONSECUTIVE_NOTES) {
        if (isDebugEnabled) {
          console.log(`¡Secuencia correcta encontrada! ${maxConsecutiveCorrect} notas consecutivas correctas. Avanzando al siguiente nivel...`);
        }
        setShowSuccess(true);
        setTimeout(() => {
          onCorrectSequence();
        }, 800);
      }
    }
  }, [playedNotes, onCorrectSequence, isDebugEnabled]);

  // Reproducir el sonido de una nota
  const playNote = (note: Note, octave: number = 4) => {
    if (!audioContext) return;

    if (isDebugEnabled) {
      console.log(`Nota tocada: ${note}`);
    }

    // Usar el mapeo para obtener la nota en inglés para calcular la frecuencia
    const englishNote = noteToEnglish[note];
    if (!englishNote) {
      console.error(`Error: Nota desconocida para cálculo de frecuencia: ${note}`);
      return;
    }

    // Frecuencias base de las notas (en octava 4) - Mantenemos claves en inglés
    const baseFrequencies: Record<string, number> = {
      'C': 261.63,
      'C#': 277.18,
      'D': 293.66,
      'D#': 311.13, // Re# y Mib son la misma frecuencia
      'E': 329.63,
      'F': 349.23,
      'F#': 369.99,
      'G': 392.00,
      'G#': 415.30,
      'A': 440.00,
      'A#': 466.16,
      'B': 493.88,
      'Eb': 311.13, // Idéntico a D#, mantenemos para compatibilidad
    };

    // Calcular la frecuencia para la octava deseada
    const frequency = baseFrequencies[englishNote] * Math.pow(2, octave - 4);

    // Crear un oscilador
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    // Crear un nodo de ganancia para controlar el volumen
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);

    // Conectar el oscilador al nodo de ganancia y luego a la salida
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Iniciar y detener el oscilador
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);

    // Actualizar el estado con la nota tocada (en español)
    setPlayedNotes(prev => {
      const newNotes = [...prev, note];
      // Mantener solo las últimas 10 notas (suficiente para la secuencia de 8)
      if (newNotes.length > 10) {
        return newNotes.slice(newNotes.length - 10);
      }
      return newNotes;
    });
  };

  // Manejador de eventos unificado para prevenir duplicación
  const handleNotePlay = (note: Note, e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    playNote(note);
  };

  // Crear las teclas del piano
  const renderKeys = () => {
    // Definir teclas usando notación española
    const whiteKeys: Note[] = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'];
    
    // Mapeo para generar teclas negras
    const blackKeysMap: Record<string, Note | null> = {
      'C': 'Do#', 
      'D': 'Re#', // Usamos Re# de manera estándar en la UI
      'E': null,  // No hay tecla negra entre Mi y Fa
      'F': 'Fa#', 
      'G': 'Sol#', 
      'A': 'La#',
      'B': null   // No hay tecla negra entre Si y Do
    };

    // Posiciones de desplazamiento para las teclas negras, ajustadas para que coincidan con un piano real
    // Las teclas negras no están exactamente en medio sino ligeramente desplazadas según la nota
    const blackKeyOffsets: Record<string, number> = {
      'Do#': 0.8,  // Desplazamiento para Do#/Reb
      'Re#': 0.85, // Desplazamiento para Re#/Mib
      'Fa#': 0.75, // Desplazamiento para Fa#/Solb
      'Sol#': 0.7, // Desplazamiento para Sol#/Lab
      'La#': 0.8   // Desplazamiento para La#/Sib
    };

    // Función para verificar si una nota está en la secuencia de Beethoven,
    // considerando notas enarmónicas
    const isNoteInSequence = (note: Note): boolean => {
      if (BEETHOVEN_SEQUENCE.includes(note)) return true;
      
      // Comprobar si alguna nota enarmónica equivalente está en la secuencia
      const enarmonics = enarmonicEquivalents[note] || [];
      return enarmonics.some(enarmonic => BEETHOVEN_SEQUENCE.includes(enarmonic as Note));
    };

    // Función para obtener el nombre de la nota a mostrar en la pista
    const getNoteDisplayName = (note: Note): string => {
      // Para Re#, mostrar Mib si aparece en la secuencia de Beethoven
      if (note === 'Re#' && BEETHOVEN_SEQUENCE.includes('Mib')) {
        return 'Mib';
      }
      return note;
    };
    
    // Función para obtener la nota a tocar
    const getNoteToPlay = (note: Note): Note => {
      // Si la nota es Re# pero se usa Mib en la secuencia, tocar Mib
      if (note === 'Re#' && BEETHOVEN_SEQUENCE.includes('Mib')) {
        return 'Mib';
      }
      return note;
    };

    return (
      <div className="relative w-full max-w-md mx-auto h-48 overflow-hidden">
        {/* Teclas blancas */}
        <div className="flex h-full">
          {whiteKeys.map((note, index) => (
            <div
              key={`white-${note}`}
              className={`flex-1 border border-gray-700 bg-white hover:bg-gray-100 active:bg-gray-200 cursor-pointer rounded-b-md relative ${
                note === 'Sol' && correctSequenceStarted ? 'bg-amber-100' : ''
              } ${
                isDebugEnabled && isNoteInSequence(note) ? 'ring-2 ring-green-500' : ''
              }`}
              onClick={isTouchDevice ? undefined : () => handleNotePlay(note)}
              onTouchStart={isTouchDevice ? (e) => handleNotePlay(note, e) : undefined}
            >
              {/* Mostrar nombre de la nota si las pistas están activadas */}
              {showHints && (
                <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-amber-800 font-semibold text-sm">
                  {note}
                </span>
              )}
              
              {/* Debug info */}
              {isDebugEnabled && isNoteInSequence(note) && (
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-green-600 font-bold text-[10px]">
                  {BEETHOVEN_SEQUENCE.filter(n => n === note).length > 1
                    ? `x${BEETHOVEN_SEQUENCE.filter(n => n === note).length}`
                    : '✓'}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Teclas negras */}
        <div className="absolute top-0 left-0 right-0 flex h-28">
          {whiteKeys.map((whiteNote, index) => {
             // Obtener la nota negra correspondiente
             const englishKey = noteToEnglish[whiteNote];
             const blackNote = blackKeysMap[englishKey];
             
             // Si no hay tecla negra después de esta tecla blanca, no renderizar nada
             if (!blackNote) return null;
             
             // Obtener el nombre a mostrar y la nota a tocar
             const displayName = getNoteDisplayName(blackNote);
             const noteToPlay = getNoteToPlay(blackNote);
             
             // Determinar si esta nota es parte de la secuencia de Beethoven
             const isInSequence = isNoteInSequence(blackNote);
             
             // Calcular posición ajustada para que coincida con un piano real
             // Usamos el desplazamiento específico para cada tecla negra
             const offset = blackKeyOffsets[blackNote] || 0.66;
             const leftPosition = `calc(${(index + offset) * (100 / 7)}% - 1rem)`;

             return (
               <div
                 key={`black-${blackNote}`}
                 className={`w-8 h-full bg-gray-800 hover:bg-gray-700 active:bg-gray-600 cursor-pointer rounded-b-md z-10 mx-1 relative ${
                   displayName === 'Mib' && correctSequenceStarted ? 'bg-amber-800' : ''
                 } ${
                   isInSequence && displayName === 'Mib' ? 'bg-amber-950' : ''
                 } ${
                   isDebugEnabled && isInSequence ? 'ring-2 ring-green-500' : ''
                 }`}
                 style={{ position: 'absolute', left: leftPosition }}
                 onClick={isTouchDevice ? undefined : () => handleNotePlay(noteToPlay)}
                 onTouchStart={isTouchDevice ? (e) => handleNotePlay(noteToPlay, e) : undefined}
               >
                 {/* Mostrar nombre de la nota si las pistas están activadas */}
                 {showHints && (
                   <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-white font-semibold text-[10px]">
                     {displayName}
                   </span>
                 )}
                 
                 {/* Debug info */}
                 {isDebugEnabled && isInSequence && (
                   <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-green-400 font-bold text-[10px]">✓</span>
                 )}
               </div>
             );
          })}
        </div>

        {/* Controles adicionales para móvil - Mib y Re */}
        <div className="mt-4 flex justify-center space-x-4 p-2">
          <button
            className={`px-4 py-2 bg-amber-600 text-white rounded-md shadow-md active:bg-amber-700 ${
              isDebugEnabled && BEETHOVEN_SEQUENCE.includes('Mib') ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={isTouchDevice ? undefined : () => handleNotePlay('Mib')}
            onTouchStart={isTouchDevice ? (e) => handleNotePlay('Mib', e) : undefined}
          >
            Mib {isDebugEnabled && '✓'}
          </button>
          <button
            className={`px-4 py-2 bg-amber-600 text-white rounded-md shadow-md active:bg-amber-700 ${
              isDebugEnabled && BEETHOVEN_SEQUENCE.includes('Re') ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={isTouchDevice ? undefined : () => handleNotePlay('Re')}
            onTouchStart={isTouchDevice ? (e) => handleNotePlay('Re', e) : undefined}
          >
            Re {isDebugEnabled && '✓'}
          </button>
        </div>
        
        {/* Información adicional sobre la melodía */}
        {showHints && (
          <div className="mt-3 text-xs text-center text-amber-700">
            <p>La 5ª Sinfonía de Beethoven comienza con el famoso motivo:</p>
            <p className="mt-1 font-semibold">Sol-Sol-Sol-Mib, Fa-Fa-Fa-Re</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 bg-amber-50 rounded-lg shadow-lg">
      <h3 className="text-center text-lg font-serif font-bold mb-4 text-amber-800">
        Piano de Clara
        {isDebugEnabled && (
          <span className="ml-2 text-xs font-normal text-red-600">(Modo Debug Activo)</span>
        )}
      </h3>

      {/* Instrucciones */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-amber-700">
          Toca las teclas para reproducir una melodía
        </p>
        <button 
          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-sm rounded-md shadow-sm transition-colors"
          onClick={() => setShowHints(!showHints)}
        >
          {showHints ? "Ocultar pista" : "Pedir pista"}
        </button>
      </div>

      {/* Pista visible cuando está activada */}
      {showHints && (
        <div className="mb-3 p-2 bg-amber-100 rounded-md text-sm">
          <p className="text-center text-amber-800">
            <span className="font-medium">Pista:</span> Toca las notas de la famosa 5ª Sinfonía de Beethoven: 
            <span className="font-bold ml-1">{BEETHOVEN_SEQUENCE.join(' - ')}</span>
          </p>
        </div>
      )}

      {/* Información de secuencia en modo debug */}
      {isDebugEnabled && (
        <div className="mb-3 p-2 bg-black/10 rounded-md text-xs">
          <p className="font-bold text-amber-800 mb-1">Información de depuración:</p>
          <p className="text-amber-700">
            Secuencia a tocar: {BEETHOVEN_SEQUENCE.join(' - ')} {/* Mostrar secuencia en español */}
          </p>
          <p className="text-amber-700 mt-1">
            {/* Contar notas correctas comparando con la secuencia en español */}
            <span className="font-medium">Progreso:</span> {playedNotes.filter((note, index) => index < BEETHOVEN_SEQUENCE.length && note === BEETHOVEN_SEQUENCE[index]).length} de {BEETHOVEN_SEQUENCE.length} notas correctas
          </p>
          <p className="text-amber-700 mt-1">
            <span className="font-medium">Estado:</span> {correctSequenceStarted ? 'Secuencia correcta iniciada' : 'Esperando secuencia correcta'}
          </p>
        </div>
      )}

      {/* Piano */}
      {renderKeys()}

      {/* Notas tocadas (solo si showPlayedSequence es true) */}
      {showPlayedSequence && (
        <div className="mt-4 flex justify-center">
          <div className="text-center px-4 py-2 bg-amber-100 rounded-md text-sm">
            <div className="text-amber-800 font-medium">Secuencia tocada ({BEETHOVEN_SEQUENCE.length} notas):</div>
            <div className="flex justify-center space-x-2 mt-1">
              {/* Crear exactamente N espacios, donde N es la longitud de la secuencia objetivo */}
              {Array.from({ length: BEETHOVEN_SEQUENCE.length }).map((_, index) => {
                const note = playedNotes[index]; // Obtener la nota correspondiente del historial
                const isCorrect = note && index < BEETHOVEN_SEQUENCE.length && note === BEETHOVEN_SEQUENCE[index];
                const isEmpty = !note;
  
                return (
                  <span
                    key={index}
                    className={`w-6 h-6 flex items-center justify-center rounded-full ${  
                      isCorrect
                        ? 'bg-green-100 text-green-800' // Nota correcta
                        : isEmpty 
                        ? 'bg-gray-200 text-gray-400' // Espacio vacío
                        : 'bg-red-100 text-red-800' // Nota incorrecta (o más allá de la secuencia actual)
                    }`}
                  >
                    {note || '?'} {/* Mostrar nota o placeholder */}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de éxito */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-md">
            <h3 className="text-2xl font-bold text-amber-800 mb-2">¡Melodía correcta!</h3>
            <p className="text-amber-700">
              Has tocado el famoso motivo inicial de la Quinta Sinfonía de Beethoven.
            </p>
            <div className="mt-4 animate-pulse text-lg font-bold text-amber-600">
              Avanzando al siguiente enigma...
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Piano; 