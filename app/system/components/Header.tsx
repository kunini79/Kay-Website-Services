import React, { useState } from 'react';
import { Search, Compass, Sparkles } from 'lucide-react';
import { addToSearchHistory } from '../services/dailyHighlights';

interface HeaderProps {
  onSearch: (term: string) => void;
  onHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, onHome }) => {
  const [term, setTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      addToSearchHistory(term.trim());
      onSearch(term);
      setTerm('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#0066CC] to-[#FF6B35] shadow-lg px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <button 
          onClick={onHome}
          className="flex items-center gap-2 group"
        >
          <div className="bg-white rounded-xl px-4 py-2 shadow-md group-hover:shadow-xl transition-all group-hover:scale-105">
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0066CC] to-[#FF6B35]">
              EncartaKids
            </h1>
          </div>
          <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-xl relative">
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="What do you want to learn today? 🚀"
            className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-white/50 bg-white/95 focus:bg-white focus:border-yellow-300 focus:outline-none transition-all placeholder-gray-500 text-gray-800 font-medium shadow-md"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0066CC] w-5 h-5" />
        </form>

        {/* Action Button */}
        <button 
          onClick={() => onSearch("Random")}
          className="hidden md:flex items-center gap-2 bg-white text-[#0066CC] px-4 py-2 rounded-full font-bold hover:bg-yellow-300 hover:text-[#FF6B35] transition-all shadow-md hover:shadow-lg"
        >
          <Compass className="w-5 h-5" />
          <span>Surprise Me!</span>
        </button>
      </div>
    </header>
  );
};