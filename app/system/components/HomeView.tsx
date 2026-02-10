import React, { useState, useEffect } from 'react';
import { CATEGORY_CONFIG, INITIAL_SUGGESTIONS } from '../constants';
import { Category, TopicPreview } from '../types';
import { fetchSuggestions, fetchWikimediaImage } from '../services/geminiService';
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
          Explore the <span className="text-tb-purple">World.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-medium">
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
              style={{
                backgroundColor: isActive ? config.color : '#ffffff'
              }}
              className={`
                relative overflow-hidden p-6 rounded-3xl transition-all duration-300 text-left group shadow-lg
                ${isActive ? 'scale-105 shadow-2xl' : 'hover:scale-105 hover:shadow-xl'}
              `}
            >
              <div 
                style={{ backgroundColor: config.color }}
                className={`
                  absolute inset-0 transition-opacity
                  ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-90'}
                `}
              ></div>
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors bg-white/20">
                  {React.cloneElement(config.icon as React.ReactElement<{ className?: string }>, {
                     className: `w-6 h-6 ${isActive ? 'text-white' : 'text-gray-600'}`
                  })}
                </div>
                
                <h3 className={`font-bold text-lg mb-1 ${isActive ? 'text-white' : 'text-gray-800 group-hover:text-white'}`}>
                  {cat}
                </h3>
                <p className={`text-xs leading-tight ${isActive ? 'text-white/90' : 'text-gray-500 group-hover:text-white/90'}`}>
                  {config.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Suggestions Area */}
      {activeCategory && (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-16 animate-in slide-in-from-bottom-8">
            <div className="flex items-center gap-3 mb-6">
               <Sparkles className="text-tb-secondary w-6 h-6" />
               <h2 className="text-2xl font-bold text-tb-purple">
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
                  <TopicCard
                    key={idx}
                    topic={topic}
                    onTopicClick={onTopicClick}
                  />
                ))}
              </div>
            )}
        </div>
      )}

      {/* Featured Topics */}
      {!activeCategory && (
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-tb-purple">Jump right in</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
             {INITIAL_SUGGESTIONS.map((topic, i) => (
               <button
                 key={i}
                 onClick={() => onTopicClick(topic)}
                 className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-4 group border border-gray-100 hover:border-tb-primary"
               >
                 <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">📚</span>
                 </div>
                 <div className="text-left">
                    <p className="font-bold text-gray-800">{topic}</p>
                    <p className="text-sm text-gray-500">Learn something new</p>
                 </div>
                 <ArrowRight className="w-5 h-5 ml-auto text-gray-300 group-hover:text-tb-primary transition-colors" />
               </button>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Topic card with async image loading from Wikipedia
interface TopicCardProps {
  topic: TopicPreview;
  onTopicClick: (topic: string) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onTopicClick }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      try {
        const url = await fetchWikimediaImage(topic.title, 400, 300);
        if (isMounted) {
          setImageUrl(url);
        }
      } catch (err) {
        console.warn(`Failed to load image for ${topic.title}:`, err);
        setImageUrl('');
      } finally {
        if (isMounted) {
          setImageLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [topic.title]);

  return (
    <button
      onClick={() => onTopicClick(topic.title)}
      className="flex flex-col text-left group h-full"
    >
      <div className="h-40 rounded-2xl overflow-hidden mb-4 relative bg-gradient-to-br from-gray-200 to-gray-300 flex-shrink-0 flex items-center justify-center">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tb-purple"></div>
          </div>
        )}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={topic.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
      </div>
      <h4 className="font-bold text-lg text-gray-800 group-hover:text-tb-primary transition-colors">
        {topic.title}
      </h4>
      <p className="text-sm text-gray-500 mt-1">{topic.description}</p>
    </button>
  );
};