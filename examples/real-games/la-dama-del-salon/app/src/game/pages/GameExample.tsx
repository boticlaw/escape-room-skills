import React, { useState } from 'react';
import GameWrapper from '../components/GameWrapper';
import GeoLocationChecker from '../components/GeoLocationChecker';
import SlidingPuzzleLock from '../components/SlidingPuzzleLock';

const GameExample: React.FC = () => {
  const [isLocationReached, setIsLocationReached] = useState(false);
  const [isPuzzleUnlocked, setIsPuzzleUnlocked] = useState(false);
  
  // Ubicación objetivo (ejemplo: Puerta del Sol, Madrid)
  const targetLocation = {
    latitude: 40.416775,
    longitude: -3.703790,
    name: "Puerta del Sol"
  };
  
  // Ubicación para pruebas (muy cerca del objetivo)
  const testLocation = {
    latitude: 40.416780,
    longitude: -3.703795
  };
  
  return (
    <GameWrapper>
      <div className="max-w-3xl mx-auto p-4 space-y-8">
        <h1 className="text-2xl font-bold text-center text-amber-800">Ejemplo de Juego</h1>
        
        <div className="space-y-8">
          {/* Componente de verificación de ubicación */}
          <div className="bg-amber-50 p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-amber-800">Prueba 1: Llegar al lugar correcto</h2>
            <GeoLocationChecker 
              targetLocation={targetLocation}
              testUserLocation={testLocation} // Para pruebas
              distanceThreshold={25}
              onLocationReached={() => setIsLocationReached(true)}
              onError={(error) => console.error(error)}
            />
          </div>
          
          {/* Componente de puzzle de pasador */}
          {isLocationReached && (
            <div className="bg-amber-50 p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-amber-800">Prueba 2: Resolver el pasador</h2>
              <SlidingPuzzleLock 
                locked={true}
                onUnlock={() => setIsPuzzleUnlocked(true)}
              />
            </div>
          )}
          
          {/* Mensaje final */}
          {isPuzzleUnlocked && (
            <div className="bg-green-100 p-6 rounded-lg shadow text-center">
              <h2 className="text-xl font-bold text-green-800 mb-2">¡Enhorabuena!</h2>
              <p className="text-green-700">Has superado todas las pruebas.</p>
            </div>
          )}
        </div>
      </div>
    </GameWrapper>
  );
};

export default GameExample; 