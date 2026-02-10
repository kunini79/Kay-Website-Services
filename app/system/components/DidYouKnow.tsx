import React from 'react';
import { Lightbulb } from 'lucide-react';

interface DidYouKnowProps {
  fact: string;
}

export const DidYouKnow: React.FC<DidYouKnowProps> = ({ fact }) => {
  return (
    <div className="bg-yellow-100 border-l-4 border-tb-secondary p-6 rounded-r-xl shadow-md my-8 relative transform hover:scale-[1.02] transition-transform">
      <div className="absolute -top-5 -left-5 bg-tb-secondary text-white p-2 rounded-full shadow-lg">
        <Lightbulb className="w-6 h-6" />
      </div>
      <h4 className="text-tb-secondary font-black uppercase tracking-wider text-sm mb-2 ml-2">
        Did You Know?
      </h4>
      <p className="text-lg text-gray-800 font-medium leading-relaxed italic">
        "{fact}"
      </p>
    </div>
  );
};