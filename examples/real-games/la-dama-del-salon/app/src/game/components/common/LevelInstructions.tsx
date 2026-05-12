import React from 'react';

interface LevelInstructionsProps {
  instructions: string | string[];
  showIcon?: boolean;
}

const LevelInstructions: React.FC<LevelInstructionsProps> = ({
  instructions,
  showIcon = true
}) => {
  const instructionsArray = Array.isArray(instructions) 
    ? instructions 
    : [instructions];

  return (
    <div 
      className="p-6 mb-6 bg-white rounded-lg shadow border-l-4 border-yellow-500 dark:bg-boxdark"
    >
      <div className="flex items-start">
        {showIcon && (
          <div className="mr-3 text-yellow-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-medium mb-2 dark:text-white">
            Instrucciones
          </h3>
          
          {instructionsArray.map((instruction, index) => (
            <p 
              key={index} 
              className={`text-gray-700 dark:text-gray-300 ${
                index < instructionsArray.length - 1 ? 'mb-4' : ''
              }`}
            >
              {instruction}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelInstructions; 