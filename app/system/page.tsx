'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ViewState, Article } from './types';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ArticleView } from './components/ArticleView';
import { Loader } from './components/Loader';
import { ProgressDashboard } from './components/ProgressDashboard';
import { fetchArticle } from './services/geminiService';
import { AlertCircle, TrendingUp } from 'lucide-react';
import './globals.css';

export default function SystemPage() {
  const router = useRouter();
  const [viewState, setViewState] = useState<ViewState>(ViewState.HOME);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showProgress, setShowProgress] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    // Temporarily bypass auth for direct access
    setIsAuthenticated(true);
    /*
    const checkAuth = async () => {
      try {
        // Try to verify auth by checking if token exists
        const response = await fetch('/api/verify-auth', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          // Not authenticated, redirect to ThinkBox login
          router.push('/thinkbox?tab=login&redirect=/system');
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/thinkbox?tab=login&redirect=/system');
      }
    };

    checkAuth();
    */
  }, [router]);

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

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4">
            <Loader message="Verifying access..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-white selection:bg-indigo-200" style={{ colorScheme: 'light' }}>
      <Header onSearch={handleTopicSelect} onHome={goHome} />

      {/* Progress Button - Floating */}
      <button
        onClick={() => setShowProgress(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#0066CC] to-[#FF6B35] text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 print:hidden"
        title="View Progress"
      >
        <TrendingUp className="w-6 h-6" />
      </button>

      {/* Progress Dashboard Modal */}
      {showProgress && (
        <ProgressDashboard onClose={() => setShowProgress(false)} />
      )}

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
        <p className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#0066CC] to-[#FF6B35]">
          © {new Date().getFullYear()} EncartaKids - Where Learning Comes Alive! 🌟
        </p>
        <p className="text-xs mt-2 text-gray-500">Powered by AI • Safe • Fun • Educational</p>
      </footer>
    </div>
  );
}
