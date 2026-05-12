import React, { useState, useCallback, useMemo } from 'react';
import { useDebug } from '../context/DebugContext';
import './CodeLockBox.css';

interface CodeLockBoxProps {
  correctCode: string;
  onSuccess: () => void;
  onIncorrect?: (attempt: string) => void;
  maxAttempts?: number;
}

// Símbolos grabados para cada dial (5 símbolos)
const ENGRAVED_SYMBOLS = ['♠', '♥', '♦', '♣', '★'];

const CodeLockBox: React.FC<CodeLockBoxProps> = ({
  correctCode,
  onSuccess,
  onIncorrect,
  maxAttempts = 0 // 0 significa intentos ilimitados
}) => {
  const [code, setCode] = useState<string[]>(Array(5).fill('0'));
  const [attempts, setAttempts] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [shakeLock, setShakeLock] = useState<boolean>(false);
  const [unlocked, setUnlocked] = useState<boolean>(false);
  const { isDebugEnabled } = useDebug();
  const [showFlowerPopup, setShowFlowerPopup] = useState<boolean>(false);
  // Prevenir doble toque
  const [touchCooldown, setTouchCooldown] = useState<boolean>(false);
  
  // Para el debug: contar cuántos dígitos son correctos actualmente
  const correctDigits = code.filter((digit, index) => digit === correctCode[index]).length;

  // Prevenir múltiples toques accidentales
  const preventMultipleTouches = useCallback((callback: () => void) => {
    if (touchCooldown) return;
    
    setTouchCooldown(true);
    callback();
    
    // Breve cooldown para evitar toques múltiples accidentales
    setTimeout(() => {
      setTouchCooldown(false);
    }, 300);
  }, [touchCooldown]);

  // Función simple para incrementar un dígito
  const incrementDigit = useCallback((index: number) => {
    if (!isLocked || unlocked || (maxAttempts > 0 && attempts >= maxAttempts)) {
      return;
    }
    
    const newCode = [...code];
    const currentDigit = parseInt(newCode[index]);
    newCode[index] = ((currentDigit + 1) % 10).toString();
    setCode(newCode);
    
  }, [code, isLocked, unlocked, maxAttempts, attempts]);

  // Función simple para decrementar un dígito
  const decrementDigit = useCallback((index: number) => {
    if (!isLocked || unlocked || (maxAttempts > 0 && attempts >= maxAttempts)) {
      return;
    }
    
    const newCode = [...code];
    const currentDigit = parseInt(newCode[index]);
    newCode[index] = ((currentDigit + 9) % 10).toString(); // +9 % 10 es lo mismo que -1 % 10
    setCode(newCode);
    
  }, [code, isLocked, unlocked, maxAttempts, attempts]);

  // Verifica el código sin animaciones complejas
  const verifyCode = useCallback(() => {
    if (!isLocked || unlocked || (maxAttempts > 0 && attempts >= maxAttempts)) {
      return;
    }
    
    const enteredCode = code.join('');
    
    if (enteredCode === correctCode) {
      setUnlocked(true);
      
      if (isDebugEnabled) {
        console.log("¡Combinación correcta! Abriendo caja...");
      }
      
      setTimeout(() => {
        setIsLocked(false);
        onSuccess();
      }, 1000);
    } else {
      // Animación simple de sacudida
      setShakeLock(true);
      setTimeout(() => setShakeLock(false), 500);
      
      if (isDebugEnabled) {
        console.log(`Combinación incorrecta: ${enteredCode}. Intentos: ${attempts + 1}`);
      }
      
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (onIncorrect) {
        onIncorrect(enteredCode);
      }
    }
  }, [code, isLocked, unlocked, maxAttempts, attempts, correctCode, isDebugEnabled, onSuccess, onIncorrect]);

  // Función para verificar si un dígito es correcto (para el debug)
  const isCorrectDigit = (index: number) => {
    return code[index] === correctCode[index];
  };

  // Verificar si los controles están deshabilitados
  const areControlsDisabled = () => {
    return unlocked || (maxAttempts > 0 && attempts >= maxAttempts);
  };

  // Toggle para mostrar/ocultar el popup de la flor
  const toggleFlowerPopup = useCallback(() => {
    setShowFlowerPopup(!showFlowerPopup);
  }, [showFlowerPopup]);

  // Generar un orden aleatorio de los símbolos para el popup
  const shuffledSymbols = useMemo((): string[] => {
    const arr = [...ENGRAVED_SYMBOLS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [showFlowerPopup]);

  // Mapeo de símbolo a índice original (para conectar con el número)
  const symbolToIndex = useMemo((): number[] => {
    return shuffledSymbols.map(sym => ENGRAVED_SYMBOLS.indexOf(sym));
  }, [shuffledSymbols]);

  // Generar los datos de las líneas enredadas para el SVG
  const tangledLines = useMemo((): {key: string; d: string}[] => {
    // Parámetros de los recuadros
    const boxWidth = 40;
    const boxHeight = 40;
    const numBoxY = 10;
    const numBoxX = (i: number) => 40 + i * 48;
    const symBoxY = 150;
    const symBoxX = (i: number) => 40 + (2 + i) * 48;
    const margin = 6; // separación para que la línea no entre en el recuadro

    // Generador de puntos intermedios caóticos
    function generateIntermediatePoints(x0: number, y0: number, x1: number, y1: number, n: number): Array<[number, number]> {
      const points: Array<[number, number]> = [];
      for (let i = 1; i < n; i++) {
        const t = i / n;
        // Línea base
        let x = x0 + (x1 - x0) * t;
        let y = y0 + (y1 - y0) * t;
        // Desplazamiento caótico
        x += (Math.random() - 0.5) * 80;
        y += (Math.random() - 0.5) * 60;
        points.push([x, y]);
      }
      return points;
    }

    // Conexiones de símbolos a números (enrevesadas)
    const usedIndices: number[] = [];
    interface LineData {
      key: string;
      d: string;
    }
    const lines: LineData[] = shuffledSymbols.map((sym, i) => {
      const numIndex = ENGRAVED_SYMBOLS.indexOf(sym); // 0-4
      usedIndices.push(numIndex);
      // Salida justo debajo del recuadro del número
      const xStart = numBoxX(numIndex) + boxWidth / 2;
      const yStart = numBoxY + boxHeight + margin;
      // Entrada justo encima del recuadro del símbolo
      const xEnd = symBoxX(i) + boxWidth / 2;
      const yEnd = symBoxY - margin;
      // Número aleatorio de segmentos (3 a 6)
      const segments = 3 + Math.floor(Math.random() * 4);
      const intermediates = generateIntermediatePoints(xStart, yStart, xEnd, yEnd, segments);
      // Construir el path SVG con múltiples curvas Bézier
      let d = `M${xStart},${yStart}`;
      let prev = [xStart, yStart];
      for (let j = 0; j < intermediates.length; j++) {
        // Cada punto intermedio es el final de una curva, el control está desplazado entre prev y next
        const [ix, iy] = intermediates[j];
        // Control point: entre prev y actual, con desplazamiento caótico
        const cx = (prev[0] + ix) / 2 + (Math.random() - 0.5) * 40;
        const cy = (prev[1] + iy) / 2 + (Math.random() - 0.5) * 40;
        d += ` Q${cx},${cy} ${ix},${iy}`;
        prev = [ix, iy];
      }
      // Última curva hasta el destino
      const cx = (prev[0] + xEnd) / 2 + (Math.random() - 0.5) * 40;
      const cy = (prev[1] + yEnd) / 2 + (Math.random() - 0.5) * 40;
      d += ` Q${cx},${cy} ${xEnd},${yEnd}`;
      return {
        key: sym,
        d
      };
    });
    // Líneas sueltas (también caóticas, terminan fuera de los recuadros)
    for (let i = 0; i < 9; i++) {
      if (!usedIndices.includes(i)) {
        const xStart = numBoxX(i) + boxWidth / 2;
        const yStart = numBoxY + boxHeight + margin;
        // Terminan en la parte baja del SVG, pero no dentro de ningún recuadro
        const xEnd = xStart + (Math.random() - 0.5) * 120;
        const yEnd = 200 - margin - Math.random() * 20;
        const segments = 3 + Math.floor(Math.random() * 4);
        const intermediates = generateIntermediatePoints(xStart, yStart, xEnd, yEnd, segments);
        let d = `M${xStart},${yStart}`;
        let prev = [xStart, yStart];
        for (let j = 0; j < intermediates.length; j++) {
          const [ix, iy] = intermediates[j];
          const cx = (prev[0] + ix) / 2 + (Math.random() - 0.5) * 40;
          const cy = (prev[1] + iy) / 2 + (Math.random() - 0.5) * 40;
          d += ` Q${cx},${cy} ${ix},${iy}`;
          prev = [ix, iy];
        }
        const cx = (prev[0] + xEnd) / 2 + (Math.random() - 0.5) * 40;
        const cy = (prev[1] + yEnd) / 2 + (Math.random() - 0.5) * 40;
        d += ` Q${cx},${cy} ${xEnd},${yEnd}`;
        lines.push({
          key: `loose-${i}`,
          d
        });
      }
    }
    return lines;
  }, [shuffledSymbols]);

  return (
    <div className={`code-lock-box ${unlocked ? 'unlocked' : ''}`}>
      <h3 className="code-lock-title">
        La Caja de los Secretos
        {isDebugEnabled && <span style={{color: 'red', fontSize: '14px', marginLeft: '8px'}}>(Debug)</span>}
      </h3>
      
      {/* Información de debug simplificada */}
      {isDebugEnabled && (
        <div style={{marginBottom: '16px', padding: '8px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '4px', fontSize: '12px'}}>
          <p><strong>Código correcto:</strong> {correctCode}</p>
          <p><strong>Código actual:</strong> {code.join('')}</p>
          <p><strong>Progreso:</strong> {correctDigits} de 5 dígitos correctos</p>
          <p><strong>Intentos:</strong> {attempts}</p>
          <p><strong>Estado:</strong> {unlocked ? 'Desbloqueado' : 'Bloqueado'}</p>
        </div>
      )}
      
      <div className={`code-lock-container ${shakeLock ? 'shake' : ''}`}>
        <div className="code-display">
          <div className="code-dials">
            {code.map((digit, index) => (
              <div key={index} className="code-dial">
                {/* Símbolo grabado encima del botón */}
                <div className="engraved-symbol">{ENGRAVED_SYMBOLS[index]}</div>
                
                {/* Control de incremento optimizado para táctil */}
                <div 
                  className={`simple-control up ${areControlsDisabled() ? 'disabled' : ''}`}
                  onClick={() => !areControlsDisabled() && !touchCooldown && incrementDigit(index)}
                  onTouchStart={(e) => {
                    if (!areControlsDisabled()) {
                      e.preventDefault(); // Prevenir zoom u otros gestos
                      preventMultipleTouches(() => incrementDigit(index));
                    }
                  }}
                  role="button"
                  aria-label={`Incrementar dígito ${index + 1}`}
                  tabIndex={0}
                >
                  <span>▲</span>
                </div>
                
                {/* Visualización del dígito simplificada */}
                <div 
                  className={`dial-display ${isDebugEnabled && isCorrectDigit(index) ? 'debug-correct' : ''}`}
                  aria-live="polite"
                  aria-label={`Dígito ${index + 1} valor ${digit}`}
                >
                  <div className="digit">{digit}</div>
                </div>
                
                {/* Control de decremento optimizado para táctil */}
                <div 
                  className={`simple-control down ${areControlsDisabled() ? 'disabled' : ''}`}
                  onClick={() => !areControlsDisabled() && !touchCooldown && decrementDigit(index)}
                  onTouchStart={(e) => {
                    if (!areControlsDisabled()) {
                      e.preventDefault(); // Prevenir zoom u otros gestos
                      preventMultipleTouches(() => decrementDigit(index));
                    }
                  }}
                  role="button"
                  aria-label={`Decrementar dígito ${index + 1}`}
                  tabIndex={0}
                >
                  <span>▼</span>
                </div>
              </div>
            ))}
          </div>
          <div className="dial-indicator"></div>
        </div>
        
        {/* Flor grabada en la esquina optimizada para táctil */}
        <div 
          className="engraved-flower" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!touchCooldown) {
              toggleFlowerPopup();
            }
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            preventMultipleTouches(toggleFlowerPopup);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          role="button"
          aria-label="Ver la flor de Clara"
          tabIndex={0}
        >
          ✿
        </div>
      </div>
      
      <div className="actions-container">
        <p className="instructions">
          {unlocked 
            ? "¡Combinación correcta! La caja se ha abierto revelando los secretos de Clara." 
            : "Gira los discos para introducir la combinación correcta y abrir la caja que contiene el secreto final de Clara."}
        </p>
        
        {/* Pistas de debug simplificadas */}
        {isDebugEnabled && !unlocked && (
          <div style={{marginBottom: '12px', padding: '8px', backgroundColor: '#fff8e1', borderRadius: '4px', fontSize: '12px', border: '1px dashed #ffc107'}}>
            <p style={{textAlign: 'center', fontWeight: 'bold'}}>Pista: Piensa en el año que aparece en el diario de Clara (♦)</p>
          </div>
        )}
        
        {maxAttempts > 0 && !unlocked && (
          <p className="attempts-counter">
            Intentos restantes: {Math.max(0, maxAttempts - attempts)}
          </p>
        )}
        
        {!unlocked && (
          <div 
            className={`simple-verify-button ${areControlsDisabled() ? 'disabled' : ''}`}
            onClick={() => !areControlsDisabled() && !touchCooldown && verifyCode()}
            onTouchStart={(e) => {
              if (!areControlsDisabled()) {
                e.preventDefault();
                preventMultipleTouches(verifyCode);
              }
            }}
            role="button"
            aria-label="Verificar combinación"
            tabIndex={0}
          >
            Verificar combinación
          </div>
        )}
        
        {/* Botón de debug simplificado */}
        {isDebugEnabled && !unlocked && (
          <div 
            className="simple-debug-button"
            onClick={() => {
              if (!touchCooldown) {
                setCode(correctCode.split(''));
                setTimeout(() => verifyCode(), 500);
              }
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              preventMultipleTouches(() => {
                setCode(correctCode.split(''));
                setTimeout(() => verifyCode(), 500);
              });
            }}
            role="button"
            aria-label="Resolver automáticamente (modo debug)"
            tabIndex={0}
          >
            [DEBUG] Resolver automáticamente
          </div>
        )}
      </div>

      {/* Popup con imagen optimizado para táctil */}
      {showFlowerPopup && (
        <div 
          className="flower-popup"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <div 
            className="flower-popup-content"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <span 
              className="close-popup" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                preventMultipleTouches(toggleFlowerPopup);
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                preventMultipleTouches(toggleFlowerPopup);
              }}
              role="button"
              aria-label="Cerrar ventana"
              tabIndex={0}
            >
              &times;
            </span>

            <p className="flower-caption">La rosa de cinco pétalos - La flor favorita de Clara</p>

            {/* Imagen del laboratorio optimizada para móviles */}
            <div className="lab-image-container">
              <img 
                src="/images/lab.jpg" 
                alt="Laboratorio de Clara" 
                className="lab-image"
                loading="lazy"
                width="100%"
                height="auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeLockBox; 