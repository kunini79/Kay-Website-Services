import React, { useState, useEffect } from 'react';
import { CATEGORY_CONFIG, INITIAL_SUGGESTIONS } from '../constants';
import { Category, TopicPreview } from '../types';
import { fetchSuggestions, fetchWikimediaImage } from '../services/geminiService';
import { Compass } from 'lucide-react';
import { getOfflineQuickPicks } from '../services/offlineTopics';
import { TodayILearned } from './TodayILearned';
import { addToSearchHistory, getSearchHistory } from '../services/dailyHighlights';

interface HomeViewProps {
  onTopicClick: (topic: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onTopicClick }) => {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [suggestions, setSuggestions] = useState<TopicPreview[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [quickTopics, setQuickTopics] = useState<string[]>(INITIAL_SUGGESTIONS);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

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

  const handleRandomAdventure = () => {
    const pool = quickTopics.length ? quickTopics : INITIAL_SUGGESTIONS;
    const randomTopic = pool[Math.floor(Math.random() * pool.length)];
    onTopicClick(randomTopic);
  };

  const handleTopicClickWithTracking = (topic: string) => {
    addToSearchHistory(topic);
    onTopicClick(topic);
  };

  useEffect(() => {
    const hydrateOffline = async () => {
      const picks = await getOfflineQuickPicks(12);
      if (picks.length) {
        setQuickTopics(picks.map(p => p.title));
      }
    };
    hydrateOffline();

    // Load recent searches
    const history = getSearchHistory(5);
    setRecentSearches(history.map(h => h.query));
  }, []);

  return (
    <div className="animate-in fade-in duration-700 min-h-screen jungle-bg text-slate-800 relative overflow-hidden px-6 pt-8">
      
      {/* Welcome Banner */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-[#0066CC] to-[#FF6B35] rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black mb-3 flex items-center gap-3">
              Welcome to EncartaKids! 🎓
            </h1>
            <p className="text-xl md:text-2xl font-medium opacity-95">
              Your magical journey to learning starts here. Explore, discover, and have fun! ✨
            </p>
          </div>
        </div>
      </div>

      {/* Today I Learned Section */}
      <TodayILearned onTopicClick={handleTopicClickWithTracking} />

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="max-w-7xl mx-auto mb-8">
          <h3 className="text-lg font-bold text-gray-700 mb-3">🔍 Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, idx) => (
              <button
                key={idx}
                onClick={() => handleTopicClickWithTracking(search)}
                className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-700 border-2 border-gray-200 hover:border-[#0066CC] hover:text-[#0066CC] transition-all transform hover:scale-105 shadow-sm"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-[#0066CC] flex items-center justify-center gap-3">
            <Compass className="w-8 h-8" /> Choose Your Learning Adventure! 🗺️
          </h2>
          <p className="text-slate-600 mt-2 text-lg">Pick a category below and start exploring amazing topics!</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => {
            const config = CATEGORY_CONFIG[cat];
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                style={{
                  borderColor: isActive ? config.color : '#E5E7EB',
                  backgroundColor: isActive ? `${config.color}20` : 'white'
                }}
                className={`
                  relative overflow-hidden p-6 leaf-card transition-all duration-300 text-left group shadow-lg border-4
                  ${isActive ? 'scale-105 shadow-2xl ring-4 ring-yellow-300 ring-opacity-50' : 'hover:scale-105 hover:shadow-xl'}
                `}
              >
                <div className="relative z-10">
                  <div 
                    style={{ backgroundColor: `${config.color}25` }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                  >
                    <span className="text-3xl">{config.icon}</span>
                  </div>

                  <h3 className="font-bold text-xl mb-2 text-[#2B2D42]">
                    {cat}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {config.description}
                  </p>
                  {isActive && (
                    <div className="mt-3 flex justify-center">
                      <span className="text-2xl animate-bounce">✨</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Suggestions Area */}
      {activeCategory && (
        <section className="px-6 max-w-7xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-3xl p-8 shadow-xl border-4 border-[#FFD23F] animate-in slide-in-from-bottom-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 text-4xl animate-pulse">🌟</div>
            <div className="absolute bottom-4 left-4 text-3xl animate-bounce">🚀</div>

            <div className="flex items-center gap-3 mb-6 relative z-10">
              <span className="text-3xl">🔍</span>
              <h2 className="text-3xl font-bold text-[#0066CC]">
                Discover {activeCategory}! 🎉
              </h2>
            </div>

            {loadingSuggestions ? (
              <div className="flex gap-6 animate-pulse">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-48 bg-white/70 rounded-3xl flex-1 border-2 border-white shadow-lg"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {suggestions.map((topic, idx) => (
                  <TopicCard
                    key={idx}
                    topic={topic}
                    onTopicClick={handleTopicClickWithTracking}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Topics */}
      {!activeCategory && (
        <section className="px-6 max-w-7xl mx-auto mb-20">
          <div className="grid lg:grid-cols-3 gap-6 items-stretch">
            <div className="lg:col-span-2 bg-white/90 border-4 border-[#2D5A27] rounded-[32px] p-8 shadow-2xl organic-glass">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-[#6B4423]">Ready to explore?</p>
                  <h3 className="text-3xl font-black text-[#2D5A27] mt-1">Quick Start Adventures</h3>
                  <p className="text-slate-600 mt-2">Tap a chip to jump straight into a fascinating topic.</p>
                </div>
                <button
                  onClick={handleRandomAdventure}
                  className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#2D5A27] text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <Compass className="w-5 h-5" /> Surprise me
                </button>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {quickTopics.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => onTopicClick(topic)}
                    className="px-4 py-2 rounded-full bg-[#A7C957]/30 border-2 border-[#2D5A27]/20 text-[#2D5A27] font-semibold hover:-translate-y-0.5 hover:shadow-md hover:border-[#2D5A27] transition-all"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#e8f5e9] border-4 border-[#A7C957] rounded-[28px] p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h4 className="text-2xl font-black text-[#2D5A27] mb-2">Explorer Tips</h4>
                <p className="text-sm text-slate-700 mb-4">Three quick ways to make the most of ThinkBox.</p>
                <ul className="space-y-3 text-sm text-slate-800">
                  <li className="flex gap-2 items-start">
                    <span className="text-xl">🧭</span>
                    <span>Pick any category tile to get hand-picked discoveries.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-xl">🎯</span>
                    <span>Click a suggestion chip to open a ready-to-go adventure.</span>
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="text-xl">✨</span>
                    <span>Use "Surprise me" for a random curiosity spark.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 flex items-center gap-3 text-sm text-[#6B4423] font-semibold">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-[#2D5A27]">🌿</div>
                <span>New adventures added every day.</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Floating Mascot Helper */}
      <div className="fixed bottom-8 right-8 z-40 group">
        <div className="absolute bottom-full right-0 mb-6 w-72 bg-white border-4 border-[#2D5A27] p-5 rounded-[32px] shadow-2xl scale-0 group-hover:scale-100 transition-all origin-bottom-right pointer-events-none">
          <p className="text-sm font-bold text-[#2D5A27] leading-relaxed">
            "Hey there, explorer! 🌿 Click on any category to discover amazing facts, or use the search bar to find something specific!"
          </p>
          <div className="absolute -bottom-3 right-8 w-6 h-6 bg-white border-b-4 border-r-4 border-[#2D5A27] rotate-45"></div>
        </div>
        <div className="w-20 h-20 bg-[#F9DC5C] rounded-full shadow-2xl flex items-center justify-center border-4 border-[#2D5A27] cursor-help overflow-hidden relative hover:scale-110 transition-transform">
          <span className="text-4xl">🦎</span>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-[10px] text-white font-bold">!</span>
          </div>
        </div>
      </div>
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
      className="flex flex-col text-left group h-full bg-white rounded-[0px_40px_0px_40px] p-6 shadow-lg border-2 border-[#A7C957]/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-[#2D5A27]"
    >
      <div className="h-40 rounded-[40px_0px_40px_0px] overflow-hidden mb-4 relative bg-gradient-to-br from-[#A7C957]/30 to-[#2D5A27]/20 flex-shrink-0 flex items-center justify-center">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin text-4xl">🌿</div>
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
        {!imageUrl && !imageLoading && (
          <div className="text-6xl group-hover:scale-110 transition-transform">📖</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D5A27]/40 to-transparent" />
      </div>
      <h4 className="font-bold text-xl text-[#2D5A27] group-hover:text-[#4A7040] transition-colors mb-2">
        {topic.title}
      </h4>
      <p className="text-sm text-slate-600 leading-relaxed flex-1">{topic.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-bold text-[#6B4423]/60">Explore →</span>
        <span className="text-xl group-hover:animate-bounce">✨</span>
      </div>
    </button>
  );
};
