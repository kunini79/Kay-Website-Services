import React, { useState } from 'react';
import { CATEGORY_CONFIG, INITIAL_SUGGESTIONS } from '../constants';
import { Category, TopicPreview } from '../types';
import { getImageUrl, fetchSuggestions } from '../services/geminiService';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HomeViewProps {
  onTopicClick: (topic: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onTopicClick }) => {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [suggestions, setSuggestions] = useState<TopicPreview[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleCategorySelect = async (cat: Category) => {
    if (activeCategory === cat) {
      setActiveCategory(null);
      setSuggestions([]);
      return;
    }
    
    setActiveCategory(cat);
    setLoadingSuggestions(true);
    const results = await fetchSuggestions(cat);
    setSuggestions(results);
    setLoadingSuggestions(false);
  };

  return (
    <div className="animate-in fade-in duration-700">
      {/* Welcome Banner */}
      <div className="text-center py-12 md:py-20">
        <h1 className="text-5xl md:text-7xl font-extrabold text-tb-text mb-6 tracking-tight">
          Explore the <span className="text-tb-primary">World.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto font-medium">
          Pick a topic, start an adventure. What will you discover today?
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
        {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          const isActive = activeCategory === cat;
          
          return (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`
                relative overflow-hidden p-6 rounded-3xl transition-all duration-300 text-left group
                ${isActive ? 'ring-4 ring-offset-4 ring-indigo-200 scale-105 shadow-xl' : 'hover:scale-105 hover:shadow-lg bg-white'}
              `}
            >
              <div className={`
                absolute inset-0 opacity-10 transition-opacity
                ${config.color}
                ${isActive ? 'opacity-20' : 'group-hover:opacity-15'}
              `}></div>
              
              <div className={`
                w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors
                ${isActive ? config.color : 'bg-gray-100 group-hover:bg-white'}
              `}>
                {React.cloneElement(config.icon as React.ReactElement<{ className?: string }>, {
                   className: `w-6 h-6 ${isActive ? 'text-white' : 'text-gray-600'}`
                })}
              </div>
              
              <h3 className="font-bold text-gray-800 text-lg mb-1">{cat}</h3>
              <p className="text-xs text-gray-500 leading-tight">{config.description}</p>
            </button>
          );
        })}
      </div>

      {/* Dynamic Suggestions Area */}
      {activeCategory && (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-indigo-50 mb-16 animate-in slide-in-from-bottom-8">
            <div className="flex items-center gap-3 mb-6">
               <Sparkles className="text-tb-secondary w-6 h-6" />
               <h2 className="text-2xl font-bold text-gray-800">
                 Cool stuff in {activeCategory}
               </h2>
            </div>
            
            {loadingSuggestions ? (
               <div className="flex gap-4 animate-pulse">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-40 bg-gray-100 rounded-2xl flex-1"></div>
                  ))}
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {suggestions.map((topic, idx) => (
                  <button
                    key={idx}
                    onClick={() => onTopicClick(topic.title)}
                    className="flex flex-col text-left group h-full"
                  >
                    <div className="h-40 rounded-2xl overflow-hidden mb-4 relative">
                       <img 
                          src={getImageUrl(topic.title)} 
                          alt={topic.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                       />
                       <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                    <h4 className="font-bold text-lg text-gray-800 group-hover:text-tb-primary transition-colors">
                      {topic.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">{topic.description}</p>
                  </button>
                ))}
              </div>
            )}
        </div>
      )}

      {/* Featured / Random Start */}
      {!activeCategory && (
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Jump right in</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
             {INITIAL_SUGGESTIONS.map((topic, i) => (
               <button
                 key={i}
                 onClick={() => onTopicClick(topic)}
                 className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-4 group border border-transparent hover:border-indigo-100"
               >
                 <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-200">
                    <img src={getImageUrl(topic, 100, 100)} alt={topic} className="w-full h-full object-cover" />
                 </div>
                 <div className="text-left">
                   <h4 className="font-bold text-gray-700 group-hover:text-tb-primary transition-colors">{topic}</h4>
                   <div className="flex items-center text-xs text-gray-400 mt-1 group-hover:text-tb-primary/70">
                     <span>Read now</span>
                     <ArrowRight className="w-3 h-3 ml-1" />
                   </div>
                 </div>
               </button>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};