import React, { useState } from 'react';
import { Search, Compass } from 'lucide-react';

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
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <button 
          onClick={onHome}
          className="flex items-center gap-2 group outline-none"
        >
          <div className="flex items-center gap-2">
             <span className="font-display text-2xl tracking-tight font-bold text-zinc-900 dark:text-white group-hover:text-[#BBFD6A] transition-colors">THINKBOX</span>
          </div>
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-md relative group">
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search topics..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 focus:border-[#BBFD6A] focus:ring-1 focus:ring-[#BBFD6A] focus:bg-white dark:focus:bg-black focus:outline-none transition-all placeholder-zinc-500 text-zinc-900 dark:text-white shadow-sm"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#BBFD6A] transition-colors w-4 h-4" />
        </form>

        {/* Action */}
        <button 
          onClick={() => onSearch("Random")}
          className="hidden md:flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-[#BBFD6A] font-medium transition-colors text-sm"
        >
          <Compass className="w-4 h-4" />
          <span>Random</span>
        </button>
      </div>
    </header>
  );
};