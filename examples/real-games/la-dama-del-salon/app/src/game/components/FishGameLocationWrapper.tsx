import React, { useState } from 'react';
import GeoLocationChecker, { GeoCoordinates } from './GeoLocationChecker';
import FishSortGame from './FishSortGame/FishSortGame';
import { useDebug } from '../context/DebugContext';

interface FishGameLocationWrapperProps {
  targetLocation: GeoCoordinates;
  onGameWon: () => void;
  difficulty?: 'easy' | 'medium' | 'hard';
  distanceThreshold?: number;
}

const FishGameLocationWrapper: React.FC<FishGameLocationWrapperProps> = ({
  targetLocation,
  onGameWon,
  difficulty = 'medium',
  distanceThreshold = 25
}) => {
  const [locationValidated, setLocationValidated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isDebugEnabled } = useDebug();

  const handleLocationReached = () => {
    setLocationValidated(true);
  };

  const handleLocationError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="w-full">
      {!locationValidated ? (
        <>
          <GeoLocationChecker
            targetLocation={targetLocation}
            onLocationReached={handleLocationReached}
            onError={handleLocationError}
            distanceThreshold={distanceThreshold}
            testUserLocation={isDebugEnabled ? {
              latitude: targetLocation.latitude,
              longitude: targetLocation.longitude,
              name: "Ubicación simulada para pruebas"
            } : undefined}
          />
          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded-md text-red-700 text-sm">
              <p>{error}</p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm">
            <h3 className="text-lg font-medium text-green-900 mb-2">
              ¡Ubicación verificada!
            </h3>
          </div>
          <FishSortGame
            onGameWon={onGameWon}
            difficulty={difficulty}
          />
        </>
      )}
    </div>
  );
};

export default FishGameLocationWrapper; 