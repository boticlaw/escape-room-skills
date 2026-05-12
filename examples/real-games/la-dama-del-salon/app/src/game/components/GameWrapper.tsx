import React from 'react';
import { DebugProvider } from '../context/DebugContext';
import DebugPanel from './DebugPanel';

interface GameWrapperProps {
  children: React.ReactNode;
}

const GameWrapper: React.FC<GameWrapperProps> = ({ children }) => {
  return (
    <DebugProvider>
      <div className="relative">
        {children}
        {process.env.NODE_ENV === 'development' && <DebugPanel />}
      </div>
    </DebugProvider>
  );
};

export default GameWrapper; 