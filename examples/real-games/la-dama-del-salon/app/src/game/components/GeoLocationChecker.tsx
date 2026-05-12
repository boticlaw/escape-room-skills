import React, { useState, useEffect } from 'react';
import { useDebug } from '../context/DebugContext';
import { useLocation } from 'react-router-dom';

// Interfaz para las coordenadas geográficas
export interface GeoCoordinates {
  latitude: number;
  longitude: number;
  name?: string; // Nombre opcional de la ubicación
}

interface GeoLocationCheckerProps {
  targetLocation: GeoCoordinates;
  distanceThreshold?: number; // Distancia en metros para considerar que está en la ubicación
  onLocationReached: () => void; // Callback cuando el usuario alcanza la ubicación objetivo
  onError?: (error: string) => void; // Callback opcional para manejar errores
  testUserLocation?: GeoCoordinates; // Ubicación simulada para pruebas
}

const GeoLocationChecker: React.FC<GeoLocationCheckerProps> = ({
  targetLocation,
  distanceThreshold = 25, // Por defecto, 25 metros
  onLocationReached,
  onError,
  testUserLocation
}) => {
  // Obtener la URL actual
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Para el nivel 9, necesitamos saber si ya se verificó la ubicación
  const isLevel9 = currentPath === "/game/level/9";
  const [locationVerifiedForLevel9, setLocationVerifiedForLevel9] = useState(false);
  
  const [currentLocation, setCurrentLocation] = useState<GeoCoordinates | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('prompt');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const { isDebugEnabled } = useDebug(); // Usar el contexto de depuración centralizado

  // Calcular la distancia entre dos puntos usando la fórmula de Haversine
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = lat1 * Math.PI / 180; // φ, λ en radianes
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
  };

  // Verificar el estado del permiso de geolocalización
  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' })
        .then(result => {
          setPermissionStatus(result.state);
          
          // Escuchar cambios en el estado del permiso
          result.addEventListener('change', () => {
            setPermissionStatus(result.state);
          });
        });
    }
  }, []);

  // Función especial para el nivel 9 cuando se verifica la ubicación
  const handleLevel9LocationSuccess = () => {
    console.log("Nivel 9: Ubicación verificada correctamente, mostrando video y enigma");
    setLocationVerifiedForLevel9(true);
  };

  // Obtener la ubicación actual del usuario
  const checkLocation = () => {
    setIsChecking(true);
    setError(null);

    // Si hay una ubicación de prueba definida, usarla en lugar de la geolocalización real
    if (testUserLocation) {
      setIsTesting(true);
      
      // Simular un pequeño retraso como en una solicitud de geolocalización real
      setTimeout(() => {
        const userLocation = {
          latitude: testUserLocation.latitude,
          longitude: testUserLocation.longitude
        };
        
        setCurrentLocation(userLocation);
        
        // Calcular la distancia a la ubicación objetivo
        const calculatedDistance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          targetLocation.latitude,
          targetLocation.longitude
        );
        
        setDistance(calculatedDistance);
        
        // Comprobar si el usuario está lo suficientemente cerca
        if (calculatedDistance <= distanceThreshold) {
          // Para el nivel 9, tratar diferente
          if (isLevel9) {
            handleLevel9LocationSuccess();
          } else {
            onLocationReached();
          }
        }
        
        setIsChecking(false);
      }, 1000);
      
      return;
    }
    
    setIsTesting(false);

    if (!navigator.geolocation) {
      const errorMsg = "La geolocalización no es compatible con este navegador.";
      setError(errorMsg);
      if (onError) onError(errorMsg);
      setIsChecking(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        
        setCurrentLocation(userLocation);
        
        // Calcular la distancia a la ubicación objetivo
        const calculatedDistance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          targetLocation.latitude,
          targetLocation.longitude
        );
        
        setDistance(calculatedDistance);
        
        // Comprobar si el usuario está lo suficientemente cerca
        if (calculatedDistance <= distanceThreshold) {
          // Para el nivel 9, tratar diferente
          if (isLevel9) {
            handleLevel9LocationSuccess();
          } else {
            onLocationReached();
          }
        }
        
        setIsChecking(false);
      },
      (error) => {
        let errorMsg = "Error desconocido al obtener la ubicación.";
        let isPermissionError = false;
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Permiso de geolocalización denegado.";
            isPermissionError = true;
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "La información de ubicación no está disponible.";
            break;
          case error.TIMEOUT:
            errorMsg = "La solicitud para obtener la ubicación del usuario ha caducado.";
            break;
        }
        
        setError(errorMsg);
        
        // Solo notificar errores que no sean de permisos
        if (onError && !isPermissionError) {
          onError(errorMsg);
        }
        
        setIsChecking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Función para verificar la respuesta al enigma del nivel 9
  const handleEnigmaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input') as HTMLInputElement;
    const value = input?.value || "";
    const normalizedAnswer = value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    if (normalizedAnswer === "recuerdame") {
      // Si la respuesta es correcta, continuar al siguiente nivel
      onLocationReached(); // Esto completará el nivel y avanzará
    } else {
      // Si es incorrecta, mostrar error
      const errorElement = document.getElementById('enigma-error');
      if (errorElement) {
        errorElement.style.display = 'block';
        setTimeout(() => {
          errorElement.style.display = 'none';
        }, 3000);
      }
    }
  };

  // Si es el nivel 9 y ya se verificó la ubicación, mostrar el video y formulario
  if (isLevel9 && locationVerifiedForLevel9) {
    return (
      <div className="mt-6 space-y-4">
        <div className="bg-blue-100 p-3 rounded-lg text-blue-800 font-bold mb-4">
          ¡UBICACIÓN CORRECTA! - RESUELVE EL ENIGMA
          {isDebugEnabled && (
            <span className="ml-2 text-xs font-normal text-red-600">(Modo Debug Activo)</span>
          )}
        </div>
        
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/glhK0eUxxzs"
            title="Video de YouTube"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
        {/* Información de debug para el enigma */}
        {isDebugEnabled && (
          <div className="mb-3 p-2 bg-black/10 rounded-md text-xs">
            <p className="font-bold text-amber-800 mb-1">Información de depuración:</p>
            <p className="text-amber-700">
              <span className="font-medium">Respuesta correcta:</span> recuerdame
            </p>
            <p className="text-amber-700">
              <span className="font-medium">Nivel actual:</span> 9
            </p>
            <p className="text-amber-700">
              <span className="font-medium">Ubicación verificada:</span> {locationVerifiedForLevel9 ? 'Sí' : 'No'}
            </p>
          </div>
        )}
        
        <div className="bg-amber-50 p-4 rounded-lg mt-4">
          <h3 className="text-xl font-bold text-amber-900 mb-2">Enigma</h3>
          <p className="text-amber-800 mb-4">¿Qué melodía?</p>
          
          <form onSubmit={handleEnigmaSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Escribe tu respuesta..."
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                isDebugEnabled ? 'border-green-300 focus:ring-green-500' : 'border-amber-300 focus:ring-amber-500'
              }`}
              required
            />
            
            <div id="enigma-error" className="text-red-600 text-sm" style={{ display: 'none' }}>
              Respuesta incorrecta. Inténtalo de nuevo.
            </div>
            
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
                isDebugEnabled ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-amber-600 text-white'
              }`}
            >
              Verificar {isDebugEnabled && '(recuerdame)'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Si es cualquier otro nivel o es el nivel 9 pero aún no se verificó la ubicación, mostrar el GeoLocationChecker normal
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-amber-200">
      <h3 className="text-lg font-medium text-amber-900 mb-4">
        {targetLocation.name ? `¿Has llegado al lugar correcto?` : "¿Has llegado al lugar correcto?"}
      </h3>
      
      <div className="mb-4">
        <p className="text-amber-800 mb-2">
          Para continuar con el juego, debes estar físicamente en la ubicación adecuada.
        </p>
        
        {isTesting && (
          <div className="mt-2 p-2 bg-purple-100 rounded-md text-purple-800 text-sm mb-2">
            <p>Modo de prueba activo - usando ubicación simulada</p>
          </div>
        )}
        
        {distance !== null && (
          <div className="mt-2 p-3 bg-amber-50 rounded-md">
            <p className="text-sm">
              {distance <= distanceThreshold 
                ? "¡Estás en el lugar correcto!" 
                : `Estás en (${currentLocation?.latitude.toFixed(6)}, ${currentLocation?.longitude.toFixed(6)}) aproximadamente a ${Math.round(distance)} metros del objetivo.`}
            </p>
          </div>
        )}
        
        {error && (
          <div className="mt-2 p-3 bg-red-50 rounded-md text-red-700 text-sm">
            <p>{error}</p>
            {permissionStatus === 'denied' && (
              <p className="mt-1">
                Debes habilitar los permisos de ubicación en la configuración de tu navegador para continuar.
              </p>
            )}
          </div>
        )}
      </div>
      
      <button
        onClick={checkLocation}
        disabled={isChecking}
        className="w-full bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 flex items-center justify-center"
      >
        {isChecking ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Comprobando ubicación...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Verificar mi ubicación
          </>
        )}
      </button>
      
      {isDebugEnabled && (
        <div className="mt-4 border-t pt-4 border-gray-200">
          <div className="text-sm text-gray-500 mb-2">Información de depuración:</div>
          <div className="text-xs space-y-1">
            <p>Destino: {targetLocation.latitude}, {targetLocation.longitude}</p>
            {currentLocation && (
              <p>Usuario: {currentLocation.latitude}, {currentLocation.longitude}</p>
            )}
            {distance !== null && (
              <p>Distancia: {Math.round(distance)}m (umbral: {distanceThreshold}m)</p>
            )}
            {testUserLocation && (
              <p className="text-purple-600">Usando ubicación de prueba</p>
            )}
            {isLevel9 && (
              <p className="text-blue-600">Nivel 9 - Ubicación verificada: {locationVerifiedForLevel9 ? "Sí" : "No"}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeoLocationChecker; 