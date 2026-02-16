import React, { useState, useEffect } from 'react';
import { CATEGORY_CONFIG, INITIAL_SUGGESTIONS } from '../constants';
import { Category, TopicPreview } from '../types';
import { fetchSuggestions, fetchWikimediaImage } from '../services/geminiService';
import { Compass, Sparkles, ArrowRight } from 'lucide-react';
import { getOfflineQuickPicks } from '../services/offlineTopics';

interface HomeViewProps {
  onTopicClick: (topic: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onTopicClick }) => {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [suggestions, setSuggestions] = useState<TopicPreview[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [quickTopics, setQuickTopics] = useState<string[]>(INITIAL_SUGGESTIONS);

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

  useEffect(() => {
    const hydrateOffline = async () => {
      const picks = await getOfflineQuickPicks(12);
      if (picks.length) {
        setQuickTopics(picks.map(p => p.title));
      }
    };
    hydrateOffline();
  }, []);

  return (
    <div className='animate-in fade-in duration-700 min-h-screen text-zinc-800 dark:text-zinc-200 relative overflow-hidden px-4 md:px-6 pt-8'>

      {/* Category Grid */}
      <section className='max-w-7xl mx-auto mb-12'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-5xl font-display font-bold text-zinc-900 dark:text-white flex flex-col md:flex-row items-center justify-center gap-3'>
           Explore Knowledge
          </h2>
          <p className='text-zinc-600 dark:text-zinc-400 mt-4 text-lg max-w-2xl mx-auto'>Select a category to begin your research journey.</p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8'>
          {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => {
            const config = CATEGORY_CONFIG[cat];
            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`relative overflow-hidden p-6 rounded-2xl system-card text-left group border ${
                  isActive 
                    ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-black dark:border-zinc-100' 
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-[#BBFD6A] dark:hover:border-[#BBFD6A]'
                }`}
              >
                <div className='relative z-10'>
                  <div 
                    className='w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 bg-zinc-100 dark:bg-zinc-800 group-hover:scale-110 text-2xl'
                  >
                    {config.icon}
                  </div>

                  <h3 className='font-bold text-lg mb-2'>
                    {cat}
                  </h3>
                  <p className='text-sm leading-relaxed opacity-80'>
                    {config.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Suggestions Area */}
      {activeCategory && (
        <section className='max-w-7xl mx-auto mb-12'>
          <div className='bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-6 md:p-8 border border-zinc-200 dark:border-zinc-800 animate-in slide-in-from-bottom-8 relative overflow-hidden'>
            
            <div className='flex items-center gap-3 mb-8 relative z-10'>
              <Sparkles className='w-6 h-6 text-[#BBFD6A]' />
              <h2 className='text-2xl font-bold text-zinc-900 dark:text-white'>
                Trending in {activeCategory}
              </h2>
            </div>

            {loadingSuggestions ? (
              <div className='flex gap-6 animate-pulse'>
                {[1,2,3,4].map(i => (
                  <div key={i} className='h-48 bg-zinc-200 dark:bg-zinc-800 rounded-3xl flex-1'></div>
                ))}
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
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
        </section>
      )}

      {/* Featured Topics */}
      {!activeCategory && (
        <section className='max-w-7xl mx-auto mb-20'>
          <div className='grid lg:grid-cols-3 gap-6 items-stretch'>
            <div className='lg:col-span-2 bg-zinc-100 dark:bg-zinc-900 rounded-[32px] p-8 border border-zinc-200 dark:border-zinc-800'>
              <div className='flex items-center justify-between gap-4 flex-wrap mb-6'>
                <div>
                  <h3 className='text-2xl font-bold text-zinc-900 dark:text-white'>Quick Access</h3>
                  <p className='text-zinc-600 dark:text-zinc-400 mt-2'>Jump straight into a topic.</p>
                </div>
                <button
                  onClick={handleRandomAdventure}
                  className='flex items-center gap-2 px-6 py-3 rounded-full bg-[#BBFD6A] text-black font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm'
                >
                  <Compass className='w-4 h-4' /> Random Topic
                </button>
              </div>

              <div className='flex flex-wrap gap-3'>
                {quickTopics.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => onTopicClick(topic)}
                    className='px-4 py-2 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-[#BBFD6A] hover:text-[#BBFD6A] hover:bg-black dark:hover:bg-black transition-all text-sm font-medium'
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className='bg-[#BBFD6A] rounded-[28px] p-8 flex flex-col justify-between text-black'>
              <div>
                <h4 className='text-2xl font-black mb-4'>Tips</h4>
                <ul className='space-y-4 text-sm font-medium'>
                  <li className='flex gap-3 items-start'>
                    <span className='bg-black/10 p-1 rounded'>Select</span>
                    <span>Pick a category to browse related articles.</span>
                  </li>
                  <li className='flex gap-3 items-start'>
                    <span className='bg-black/10 p-1 rounded'>Search</span>
                    <span>Directly search for any topic you need.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
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
        console.warn('Failed to load image:', err);
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
      className='flex flex-col text-left group h-full bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
    >
      <div className='h-40 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 relative'>
        {imageLoading && (
          <div className='absolute inset-0 flex items-center justify-center text-zinc-300'>
             Loading...
          </div>
        )}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={topic.title}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
            loading='lazy'
          />
        )}
        {!imageUrl && !imageLoading && (
          <div className='absolute inset-0 flex items-center justify-center text-4xl'></div>
        )}
      </div>
      <div className='p-5 flex-1 flex flex-col'>
        <h4 className='font-bold text-lg text-zinc-900 dark:text-white mb-2 group-hover:text-[#BBFD6A] transition-colors'>
          {topic.title}
        </h4>
        <p className='text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1 line-clamp-3'>{topic.description}</p>
        <div className='mt-4 flex items-center justify-between text-[#BBFD6A] opacity-0 group-hover:opacity-100 transition-opacity'>
          <span className='text-xs font-bold uppercase tracking-wider'>Read Article</span>
          <ArrowRight className='w-4 h-4' />
        </div>
      </div>
    </button>
  );
};
