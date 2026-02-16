import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader: React.FC<{ message?: string }> = ({ message = 'Processing...' }) => {
  return (
    <div className='flex flex-col items-center justify-center p-12 w-full'>
      <div className='relative'>
        <div className='w-12 h-12 rounded-full border-4 border-zinc-200 dark:border-zinc-800 border-t-[#BBFD6A] animate-spin'></div>
      </div>
      <h3 className='mt-6 text-lg font-medium text-zinc-900 dark:text-white animate-pulse'>
        {message}
      </h3>
    </div>
  );
};
