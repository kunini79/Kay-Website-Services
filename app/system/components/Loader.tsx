import React from 'react';
import { Sparkles } from 'lucide-react';

export const Loader: React.FC<{ message?: string }> = ({ message = "Thinking..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 w-full">
      <div className="relative">
        <div className="w-16 h-16 bg-tb-primary rounded-2xl animate-spin flex items-center justify-center shadow-xl">
          <Sparkles className="text-white w-8 h-8 animate-pulse" />
        </div>
        <div className="absolute -inset-4 bg-tb-primary/20 rounded-full animate-ping -z-10"></div>
      </div>
      <h3 className="mt-8 text-xl font-bold text-tb-primary animate-bounce">
        {message}
      </h3>
      <p className="text-gray-500 text-sm mt-2">Connecting to the knowledge cloud...</p>
    </div>
  );
};