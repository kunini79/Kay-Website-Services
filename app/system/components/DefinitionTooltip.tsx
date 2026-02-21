import React, { useState, useRef } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  word: string;
}

// Simple static dictionary for common "hard" words in our demo context
// In a real app, this would query a dictionary API
const DICTIONARY: Record<string, string> = {
  photosynthesis: "How plants turn sunlight into food.",
  ecosystem: "A community of living things working together.",
  civilization: "A complex society with cities and government.",
  democracy: "A system where people vote for their leaders.",
  gravity: "The force that pulls things toward the ground.",
  atmosphere: "The layer of air surrounding our planet.",
  herbivore: "An animal that only eats plants.",
  carnivore: "An animal that eats meat.",
  endangered: "At risk of disappearing forever.",
  constellation: "A group of stars that forms a picture.",
  mammal: "Warm-blooded animal that feeds milk to its babies.",
  amphibian: "Animal that can live on both land and water.",
  hieroglyphics: "Ancient Egyptian picture writing.",
  pharaoh: "A king of ancient Egypt.",
  innovation: "A new idea or invention.",
  technology: "Tools and machines that solve problems.",
  satellite: "An object that orbits around a planet.",
  telescope: "A tool to see things far away in space.",
  volcano: "A mountain that erupts with hot lava.",
  migration: "Moving from one place to another.",
};

export const DefinitionTooltip: React.FC<TooltipProps> = ({ word }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Normalize word to check dictionary (lowercase, remove punctuation)
  const cleanWord = word.toLowerCase().replace(/[.,;!?()]/g, '');
  const definition = DICTIONARY[cleanWord];

  // If no definition, just return the word
  if (!definition) return <>{word}</>;

  return (
    <span className="relative inline-block group">
      <button
        onClick={() => setIsVisible(!isVisible)}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help text-blue-600 underline decoration-dotted underline-offset-4 hover:text-blue-800 transition-colors"
        aria-label={`Definition of ${cleanWord}`}
      >
        {word}
      </button>

      {isVisible && (
        <div 
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-white rounded-xl shadow-xl border-2 border-yellow-400 text-sm text-gray-800 text-center animate-in fade-in zoom-in-95 duration-200"
          role="tooltip"
        >
          <div className="font-bold mb-1 capitalize text-yellow-600">{cleanWord}</div>
          <div className="leading-snug">{definition}</div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-8 border-transparent border-t-white" />
        </div>
      )}
    </span>
  );
};
