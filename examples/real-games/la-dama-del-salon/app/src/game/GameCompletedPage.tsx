import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'wasp/client/operations';
import { getUserGameProgress } from 'wasp/client/operations';
import LoadingSpinner from '../admin/layout/LoadingSpinner';

const GameCompletedPage: React.FC = () => {
  const { data: gameProgress, isLoading, error } = useQuery(getUserGameProgress);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700">{(error as Error).message}</p>
        <Link 
          to="/"
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="relative pb-[56.25%] h-0 overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/c_BYbCud9Kw?rel=0&modestbranding=1&playsinline=1&autoplay=1"
            title="Video final de La Dama del Salón"
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          ></iframe>
        </div>
        
        <div className="text-center mt-8 space-y-4">
          <Link
            to="/game/photo"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Foto de equipo
          </Link>
          
          <Link
            to="/"
            className="block text-amber-400 hover:text-amber-300"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameCompletedPage; 