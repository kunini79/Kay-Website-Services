import React from 'react';
import { Lightbulb } from 'lucide-react';

interface DidYouKnowProps {
  fact: string;
}

export const DidYouKnow: React.FC<DidYouKnowProps> = ({ fact }) => {
  return (
    <div className='bg-zinc-100 dark:bg-zinc-900 border-l-4 border-[#BBFD6A] p-6 rounded-r-xl my-8 relative'>
      <div className='flex items-center gap-3 mb-2'>
        <Lightbulb className='w-5 h-5 text-[#BBFD6A]' />
        <h4 className='text-[#BBFD6A] font-bold uppercase tracking-wider text-sm'>
          Did You Know?
        </h4>
      </div>
      <p className='text-lg text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed italic'>
        {fact}
      </p>
    </div>
  );
};
