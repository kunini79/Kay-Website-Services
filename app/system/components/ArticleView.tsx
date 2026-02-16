import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { DidYouKnow } from './DidYouKnow';
import { fetchWikimediaImage } from '../services/geminiService';
import { ArrowRight, Volume2 } from 'lucide-react';

interface ArticleViewProps {
  article: Article;
  onTopicClick: (topic: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ article, onTopicClick }) => {
  const [heroImage, setHeroImage] = useState<string>('');
  const [heroLoading, setHeroLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const loadHeroImage = async () => {
      try {
        const imageUrl = await fetchWikimediaImage(article.title, 1200, 600);
        if (isMounted) {
          setHeroImage(imageUrl);
        }
      } catch (err) {
        console.warn('Failed to load hero image:', err);
        setHeroImage('');
      } finally {
        if (isMounted) {
          setHeroLoading(false);
        }
      }
    };

    loadHeroImage();
    
    return () => {
      isMounted = false;
    };
  }, [article.title]);

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${article.title}. ${article.intro}`);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className='animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto'>
      {/* Hero Section */}
      <div className='relative w-full overflow-hidden rounded-2xl mb-8 group bg-zinc-100 dark:bg-zinc-800 aspect-video shadow-sm border border-zinc-200 dark:border-zinc-800'>
        {heroLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800'>
            <div className='animate-pulse w-full h-full bg-zinc-200 dark:bg-zinc-700'></div>
          </div>
        )}
        {heroImage && (
          <img
            src={heroImage}
            alt={article.title}
            className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105'
            loading='lazy'
            onLoad={() => setHeroLoading(false)}
            onError={() => setHeroLoading(false)}
          />
        )}
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8'>
          <div className='flex items-center gap-3 mb-4'>
            <span className='px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full border border-white/20'>
              {article.category}
            </span>
          </div>
          <h1 className='text-3xl md:text-5xl font-display font-bold text-white mb-2 drop-shadow-sm'>
            {article.title}
          </h1>
        </div>
        
        {/* TTS Button */}
        <button 
          onClick={handleSpeak}
          className='absolute top-6 right-6 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-md transition-all hover:scale-110 border border-white/10'
          title='Read Aloud'
        >
          <Volume2 className='w-5 h-5' />
        </button>
      </div>

      <div className='prose prose-zinc dark:prose-invert max-w-none'>
        <p className='text-xl md:text-2xl text-zinc-900 dark:text-zinc-100 font-medium leading-relaxed mb-8'>
          {article.intro}
        </p>

        <DidYouKnow fact={article.funFact} />

        {/* Chunked Sections */}
        <div className='space-y-12 my-12'>
          {article.sections && article.sections.length > 0 ? (
            article.sections.map((section, idx) => (
              <SectionBlock
                key={idx}
                section={section}
                index={idx}
                articleTitle={article.title}
              />
            ))
          ) : (
            <div className='text-center py-8 text-zinc-500'>
              <p>No detailed sections available.</p>
            </div>
          )}
        </div>

        {/* Discovery Loop */}
        <div className='border-t border-zinc-200 dark:border-zinc-800 pt-16 mt-16'>
          <h3 className='text-2xl font-bold mb-8 text-zinc-900 dark:text-white'>Explore Related Topics</h3>
          <div className='flex flex-wrap gap-4'>
            {article.relatedTopics && article.relatedTopics.length > 0 ? (
              article.relatedTopics.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => onTopicClick(topic)}
                  className='group flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-5 py-3 rounded-xl transition-all border border-zinc-200 dark:border-zinc-700 font-medium text-zinc-900 dark:text-zinc-100'
                >
                  <span>{topic}</span>
                  <ArrowRight className='w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity' />
                </button>
              ))
            ) : (
              <p className='text-zinc-500'>No related topics available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface SectionBlockProps {
  section: { subtitle: string; content: string };
  index: number;
  articleTitle: string;
}

const SectionBlock: React.FC<SectionBlockProps> = ({ section, index, articleTitle }) => {
  const [sectionImage, setSectionImage] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (index % 2 === 0) {
      let isMounted = true;
      const loadImage = async () => {
        try {
          const imageUrl = await fetchWikimediaImage(articleTitle, 400, 300);
          if (isMounted) setSectionImage(imageUrl);
        } catch (err) {
          console.warn('Failed to load section image', err);
          setSectionImage('');
        } finally {
          if (isMounted) setImageLoading(false);
        }
      };
      loadImage();
      return () => { isMounted = false; };
    } else {
      setImageLoading(false);
    }
  }, [articleTitle, index]);

  return (
    <div className='flex flex-col md:flex-row gap-8 items-start group'>
      <div className='flex-1'>
        <h2 className='text-2xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-3'>
          <span className='w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white flex items-center justify-center text-sm font-bold border border-zinc-200 dark:border-zinc-700'>
            {index + 1}
          </span>
          {section.subtitle}
        </h2>
        <p className='text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed'>
          {section.content}
        </p>
      </div>
      {index % 2 === 0 && (
        <div className='w-full md:w-64 aspect-video rounded-xl overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'>
          {imageLoading ? (
            <div className='w-full h-full animate-pulse bg-zinc-200 dark:bg-zinc-700'></div>
          ) : sectionImage ? (
            <img
              src={sectionImage}
              className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
              alt={section.subtitle}
              loading='lazy'
            />
          ) : null}
        </div>
      )}
    </div>
  );
};
