'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ViewState, Article, Category, UserSettings, DEFAULT_SETTINGS, SavedArticle } from './types';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ArticleView } from './components/ArticleView';
import { BackpackView } from './components/BackpackView';
import { Loader } from './components/Loader';
import { SystemErrorBoundary } from './components/SystemErrorBoundary';
import { fetchArticle } from './services/geminiService';
import { STATIC_TOPICS } from './constants';
import { AlertCircle } from 'lucide-react';
import './globals.css';

export default function SystemPage() {
  const [viewState, setViewState] = useState<ViewState>(ViewState.HOME);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [exploredCategories, setExploredCategories] = useState<Set<string>>(
    new Set()
  );
  const [homeCategory, setHomeCategory] = useState<Category>(Category.ANIMALS);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  
  // -- Backpack state --
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);

  // -- XP State --
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [xpChanged, setXpChanged] = useState(false); // To trigger save

  /* Load Backpack and XP from local storage */
  useEffect(() => {
    try {
        const saved = localStorage.getItem('tb-backpack');
        if (saved) {
            setSavedArticles(JSON.parse(saved));
        }
        
        const xp = localStorage.getItem('tb-xp');
        const level = localStorage.getItem('tb-level');
        if (xp) setUserXP(parseInt(xp, 10));
        if (level) setUserLevel(parseInt(level, 10));
    } catch (e) {
        console.error('Failed to load data', e);
    }
  }, []);

  /* Save Backpack to local storage */
  useEffect(() => {
    localStorage.setItem('tb-backpack', JSON.stringify(savedArticles));
  }, [savedArticles]);

  /* Save XP and Level */
  useEffect(() => {
    if (xpChanged) {
        localStorage.setItem('tb-xp', userXP.toString());
        localStorage.setItem('tb-level', userLevel.toString());
        setXpChanged(false);
    }
  }, [userXP, userLevel, xpChanged]);

  const handleEarnXP = useCallback((amount: number) => {
    setUserXP(prev => {
        const newXP = prev + amount;
        // Level up every 100 XP
        const newLevel = Math.floor(newXP / 100) + 1;
        if (newLevel > userLevel) {
            setUserLevel(newLevel);
            // Could add a toast or modal here
            // alert(`🎉 Level Up! You happen to be Level ${newLevel}!`); 
        }
        setXpChanged(true);
        return newXP;
    });
  }, [userLevel]);

  const toggleSaveFilter = useCallback((article: Article) => {
    setSavedArticles(prev => {
        const exists = prev.find(a => a.title === article.title);
        if (exists) {
            return prev.filter(a => a.title !== article.title);
        } else {
            return [...prev, {
                title: article.title,
                category: article.category,
                dateAdded: Date.now()
            }];
        }
    });
  }, []);

  const removeFromBackpackByName = useCallback((title: string) => {
      setSavedArticles(prev => prev.filter(a => a.title !== title));
  }, []);

  /* Force light theme for ThinkBox */
  useEffect(() => {
    const prev = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', 'light');
    return () => {
      if (prev) document.documentElement.setAttribute('data-theme', prev);
    };
  }, []);

  /* Scroll to top on view change */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viewState, currentArticle]);

  const handleTopicSelect = useCallback(
    async (topic: string) => {
      setViewState(ViewState.LOADING);
      setErrorMsg(null);
      setSearchFilter('');
      try {
        const article = await fetchArticle(topic);
        setCurrentArticle(article);
        setExploredCategories((prev) => {
          const next = new Set(prev);
          next.add(article.category);
          return next;
        });
        setViewState(ViewState.ARTICLE);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || 'Something went wrong.');
        setViewState(ViewState.ERROR);
      }
    },
    []
  );

  const goHome = useCallback(() => {
    setViewState(ViewState.HOME);
    setCurrentArticle(null);
    setSearchFilter('');
  }, []);

  const handleHomeCategoryChange = useCallback((cat: Category) => {
    setHomeCategory(cat);
  }, []);

  const handleRandomTopic = useCallback(() => {
    // Collect all available topic titles
    const allTopics: string[] = [];
    Object.values(STATIC_TOPICS).forEach((topics) => {
      topics?.forEach((t) => allTopics.push(t.title));
    });

    if (allTopics.length === 0) return;

    // Pick a random one
    const randomTopic = allTopics[Math.floor(Math.random() * allTopics.length)];
    handleTopicSelect(randomTopic);
  }, [handleTopicSelect]);

  const onBackpackClick = useCallback(() => {
      setViewState(ViewState.BACKPACK);
      setCurrentArticle(null);
  }, []);

  const getCategoryBg = (category: string) => {
    switch (category) {
      case Category.ANIMALS: return 'tb-bg-forest';
      case Category.SCIENCE: return 'tb-bg-space';
      case Category.HISTORY: return 'tb-bg-history';
      case Category.PEOPLE: return 'tb-bg-sunset';
      case Category.WORLD: return 'tb-bg-ocean';
      case Category.ARTS: return 'tb-bg-pastel';
      case Category.SPORTS: return 'tb-bg-stadium';
      case Category.TECH: return 'tb-bg-cyber';
      case Category.READING: return 'tb-bg-library';
      default: return 'tb-bg-default';
    }
  };

  const getBackgroundClass = () => {
    if (viewState === ViewState.HOME) {
      return getCategoryBg(homeCategory);
    }
    if (viewState !== ViewState.ARTICLE || !currentArticle) return 'tb-bg-default';
    
    const title = currentArticle.title.toLowerCase();
    const category = currentArticle.category;

    if (title.includes('ocean') || title.includes('sea') || title.includes('marine') || title.includes('water')) {
      return 'tb-bg-ocean';
    }
    if (title.includes('space') || title.includes('star') || title.includes('planet') || title.includes('galaxy') || title.includes('moon') || title.includes('sun')) {
      return 'tb-bg-space';
    }

    return getCategoryBg(category);
  };

  const exploredCount = exploredCategories.size;
  const bgClass = getBackgroundClass();
  const isDarkBg = bgClass === 'tb-bg-space';

  return (
    <div 
      style={{ minHeight: '100vh', position: 'relative' }} 
      data-tb-bg={bgClass.replace('tb-bg-', '')}
      data-tb-text-size={settings.textSize}
      data-tb-font={settings.dyslexicFont ? 'dyslexic' : 'default'}
    >
      {/* Dynamic Background Layer */}
      <div className={`tb-bg-layer ${bgClass}`} />

      {/* Navbar */}
      <Header
        onSearch={handleTopicSelect}
        onHome={goHome}
        onRandom={handleRandomTopic}
        onBackpack={onBackpackClick}
        searchFilter={searchFilter}
        onSearchFilterChange={setSearchFilter}
        streakCount={7}
        userXP={userXP}
        userLevel={userLevel}
        settings={settings}
        onSettingsUpdate={setSettings}
      />

      <SystemErrorBoundary>
        {/* Progress bar */}
      <div
        style={{
          padding: '8px 24px',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--tb-font-body)',
            fontSize: '12px',
            fontWeight: 700,
            color: isDarkBg ? 'rgba(255, 255, 255, 0.9)' : 'var(--tb-text-muted)',
            whiteSpace: 'nowrap',
            transition: 'color 1s ease-in-out',
          }}
        >
          You&apos;ve explored {exploredCount} of 9 topics today
        </span>
        <div className="tb-progress-track" style={{ flex: 1, background: isDarkBg ? 'rgba(255, 255, 255, 0.2)' : 'var(--tb-border)' }}>
          <div
            className="tb-progress-fill"
            style={{ width: `${(exploredCount / 9) * 100}%` }}
          />
        </div>
      </div>

      {/* Main content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '80px' }}>
        {viewState === ViewState.HOME && (
          <HomeView
            onTopicClick={handleTopicSelect}
            searchFilter={searchFilter}
            exploredCategories={exploredCategories}
            onCategoryChange={handleHomeCategoryChange}
          />
        )}

        {viewState === ViewState.LOADING && (
          <div style={{ marginTop: '80px' }}>
            <Loader message="Opening the magic book..." />
          </div>
        )}

        {viewState === ViewState.ERROR && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '80px',
              textAlign: 'center',
              maxWidth: '480px',
              marginLeft: 'auto',
              marginRight: 'auto',
              background: 'var(--tb-surface)',
              borderRadius: 'var(--tb-radius-xl)',
              padding: '48px 32px',
              boxShadow: 'var(--tb-shadow-md)',
            }}
          >
            <div
              style={{
                background: '#FEF2F2',
                padding: '20px',
                borderRadius: '50%',
                marginBottom: '24px',
              }}
            >
              <AlertCircle size={40} color="#EF4444" />
            </div>
            <h3
              style={{
                fontFamily: 'var(--tb-font-heading)',
                fontSize: '24px',
                fontWeight: 700,
                color: '#EF4444',
                marginBottom: '8px',
              }}
            >
              Oops!
            </h3>
            <p
              style={{
                color: 'var(--tb-text-muted)',
                fontSize: '15px',
                fontWeight: 600,
                marginBottom: '24px',
                lineHeight: 1.6,
              }}
            >
              {errorMsg}
            </p>
            <button
              onClick={goHome}
              style={{
                padding: '12px 32px',
                background: 'var(--tb-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--tb-radius-full)',
                fontFamily: 'var(--tb-font-heading)',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {viewState === ViewState.ARTICLE && currentArticle && (
          <ArticleView 
              article={currentArticle} 
              onTopicClick={handleTopicSelect}
              isSaved={!!savedArticles.find(a => a.title === currentArticle.title)}
              onToggleSave={() => toggleSaveFilter(currentArticle)}
              onEarnXP={handleEarnXP}
          />
        )}

        {viewState === ViewState.BACKPACK && (
            <BackpackView 
                savedArticles={savedArticles}
                onTopicClick={handleTopicSelect}
                onRemove={removeFromBackpackByName}
                onBack={goHome}
            />
        )}
      </main>
      </SystemErrorBoundary>
    </div>
  );
}
