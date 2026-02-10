import React from 'react';
import { Article } from '../types';
import { DidYouKnow } from './DidYouKnow';
import { getImageUrl } from '../services/geminiService';
import { ArrowRight, Volume2 } from 'lucide-react';

interface ArticleViewProps {
  article: Article;
  onTopicClick: (topic: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({ article, onTopicClick }) => {
  // Speech synthesis handler
  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any previous
      const utterance = new SpeechSynthesisUtterance(`${article.title}. ${article.intro}`);
      utterance.rate = 0.9; // Slightly slower for kids
      utterance.pitch = 1.1; // Slightly friendlier
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-3xl shadow-lg mb-8 group">
        <img 
          src={getImageUrl(article.title, 1200, 600)} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
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
        
        {/* TTS Button floating */}
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
          {article.sections.map((section, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-tb-primary mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-tb-primary flex items-center justify-center text-sm">
                    {idx + 1}
                  </span>
                  {section.subtitle}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {section.content}
                </p>
              </div>
              {/* Decorative visual for even/odd rhythm */}
              {idx % 2 === 0 && (
                <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0 shadow-md transform rotate-2">
                   <img src={getImageUrl(section.subtitle + article.title, 400, 300)} className="w-full h-full object-cover" alt="" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Discovery Loop */}
        <div className="bg-indigo-900 rounded-3xl p-8 md:p-12 text-white text-center mt-16 shadow-xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          
          <h3 className="text-3xl font-bold mb-8 relative z-10">Where to next?</h3>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            {article.relatedTopics.map((topic, i) => (
              <button
                key={i}
                onClick={() => onTopicClick(topic)}
                className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl transition-all hover:scale-105 border border-white/10"
              >
                <span className="font-bold text-lg">{topic}</span>
                <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};