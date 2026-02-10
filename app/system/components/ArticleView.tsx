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

  // Load hero image from Wikipedia
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

  // Speech synthesis handler
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden rounded-3xl shadow-lg mb-8 group bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="aspect-video w-full relative flex items-center justify-center">
          {heroLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tb-purple"></div>
            </div>
          )}
          {heroImage && (
            <img
              src={heroImage}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              loading="lazy"
              onLoad={() => setHeroLoading(false)}
              onError={() => setHeroLoading(false)}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase rounded-full border border-white/30">
              {article.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-md">
            {article.title}
          </h1>
        </div>
        
        {/* TTS Button */}
        <button 
          onClick={handleSpeak}
          className="absolute bottom-6 right-6 bg-white/90 hover:bg-white text-tb-primary p-3 rounded-full shadow-lg transition-transform hover:scale-110 backdrop-blur-sm"
          title="Read Aloud"
        >
          <Volume2 className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Intro */}
        <p className="text-2xl text-gray-700 font-medium leading-relaxed mb-8">
          {article.intro}
        </p>

        {/* Fun Fact */}
        <DidYouKnow fact={article.funFact} />

        {/* Chunked Sections */}
        <div className="space-y-12 my-12">
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
            <div className="text-center py-8 text-gray-500">
              <p>No detailed sections available. Try searching for a different topic.</p>
            </div>
          )}
        </div>

        {/* Discovery Loop */}
        <div className="bg-tb-purple rounded-3xl p-8 md:p-12 text-white text-center mt-16 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          
          <h3 className="text-3xl font-bold mb-8 relative z-10">Where to next?</h3>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            {article.relatedTopics && article.relatedTopics.length > 0 ? (
              article.relatedTopics.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => onTopicClick(topic)}
                  className="group flex items-center gap-2 bg-white/10 hover:bg-tb-secondary/80 hover:text-tb-purple backdrop-blur-sm px-6 py-4 rounded-2xl transition-all hover:scale-105 border border-white/10 font-semibold"
                >
                  <span className="font-bold text-lg">{topic}</span>
                  <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                </button>
              ))
            ) : (
              <p className="text-white/80">No related topics available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Section component with independent image loading
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
          // Use article title instead of section subtitle for better image matching
          const imageUrl = await fetchWikimediaImage(articleTitle, 400, 300);
          if (isMounted) {
            setSectionImage(imageUrl);
          }
        } catch (err) {
          console.warn(`Failed to load image for ${articleTitle}:`, err);
          setSectionImage('');
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
    } else {
      setImageLoading(false);
    }
  }, [articleTitle, index]);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-tb-purple mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-tb-secondary/50 text-tb-purple flex items-center justify-center text-sm font-bold">
            {index + 1}
          </span>
          {section.subtitle}
        </h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          {section.content}
        </p>
      </div>
      {/* Section image with Wikipedia data */}
      {index % 2 === 0 && (
        <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0 shadow-md bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          {imageLoading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tb-purple"></div>
          )}
          {sectionImage && (
            <img
              src={sectionImage}
              className="w-full h-full object-cover"
              alt={section.subtitle}
              loading="lazy"
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};