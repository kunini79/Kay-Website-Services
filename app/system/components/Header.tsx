import React, { useState } from 'react';
import { Search, Compass, BookOpen } from 'lucide-react';

interface HeaderProps {
  onSearch: (term: string) => void;
  onHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, onHome }) => {
  const [term, setTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      onSearch(term);
      setTerm('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-indigo-100 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <button 
          onClick={onHome}
          className="flex items-center gap-2 group"
        >
          <div className="w-10 h-10 bg-tb-primary rounded-xl flex items-center justify-center text-white shadow-md group-hover:rotate-12 transition-transform">
            <BookOpen size={24} />
          </div>
          <span className="text-2xl font-extrabold text-tb-primary tracking-tight hidden sm:block">
            ThinkBox
          </span>
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-md relative">
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="What are you curious about?"
            className="w-full pl-10 pr-4 py-2.5 rounded-full border-2 border-indigo-100 bg-indigo-50/50 focus:border-tb-primary focus:bg-white focus:outline-none transition-all placeholder-indigo-300 text-tb-text font-semibold"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 w-5 h-5" />
        </form>

        {/* Action */}
        <button 
          onClick={() => onSearch("Random")}
          className="hidden md:flex items-center gap-2 text-tb-secondary font-bold hover:text-amber-600 transition-colors"
        >
          <Compass className="w-5 h-5 animate-pulse" />
          <span>Surprise Me!</span>
        </button>
      </div>
    </header>
  );
};