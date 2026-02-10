'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ViewState, Article } from './types';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ArticleView } from './components/ArticleView';
import { Loader } from './components/Loader';
import { fetchArticle } from './services/geminiService';
import { AlertCircle } from 'lucide-react';
import './globals.css';

export default function SystemPage() {
  const [viewState, setViewState] = useState<ViewState>(ViewState.HOME);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Force light mode for ThinkBox System
  useEffect(() => {
    const originalTheme = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', 'light');
    
    return () => {
      // Restore original theme when leaving the route
      if (originalTheme) {
        document.documentElement.setAttribute('data-theme', originalTheme);
      }
    };
  }, []);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viewState, currentArticle]);

  const handleTopicSelect = useCallback(async (topic: string) => {
    setViewState(ViewState.LOADING);
    setErrorMsg(null);
    try {
      const article = await fetchArticle(topic);
      setCurrentArticle(article);
      setViewState(ViewState.ARTICLE);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong.");
      setViewState(ViewState.ERROR);
    }
  }, []);

  const goHome = useCallback(() => {
    setViewState(ViewState.HOME);
    setCurrentArticle(null);
  }, []);

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white selection:bg-indigo-200" style={{ colorScheme: 'light' }}>
      <Header onSearch={handleTopicSelect} onHome={goHome} />

      <main className="max-w-5xl mx-auto px-4 pb-20 pt-8">
        {viewState === ViewState.HOME && (
          <HomeView onTopicClick={handleTopicSelect} />
        )}

        {viewState === ViewState.LOADING && (
          <div className="mt-20">
            <Loader message="Reading all the books..." />
          </div>
        )}

        {viewState === ViewState.ERROR && (
           <div className="flex flex-col items-center justify-center mt-20 text-center">
             <div className="bg-red-100 p-6 rounded-full mb-6">
                <AlertCircle className="w-12 h-12 text-red-500" />
             </div>
             <h2 className="text-2xl font-bold text-gray-800 mb-2">Uh oh!</h2>
             <p className="text-gray-600 max-w-md mb-8">{errorMsg}</p>
             <button 
               onClick={goHome}
               className="bg-tb-primary text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors"
             >
               Go Back Home
             </button>
           </div>
        )}

        {viewState === ViewState.ARTICLE && currentArticle && (
          <ArticleView 
            article={currentArticle} 
            onTopicClick={handleTopicSelect} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm border-t border-gray-200 mt-auto">
        <p>© {new Date().getFullYear()} ThinkBox. Built for curious minds.</p>
      </footer>
    </div>
  );
}
