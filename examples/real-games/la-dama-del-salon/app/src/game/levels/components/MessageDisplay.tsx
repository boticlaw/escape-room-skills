import React from 'react';

interface MessageDisplayProps {
  message: {
    text: string;
    type: string;
  };
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message }) => {
  if (!message || !message.text) return null;

  return (
    <div
      className={`p-4 my-4 rounded-md ${
        message.type === "success" 
          ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200" 
          : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200"
      }`}
    >
      {message.text}
    </div>
  );
};

export default MessageDisplay; 