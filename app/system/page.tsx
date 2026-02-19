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
  const [searchFilter, setSearchFilter] = useState('');
  const [exploredCategories, setExploredCategories] = useState<Set<string>>(
    new Set()
  );

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

  const exploredCount = exploredCategories.size;

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Navbar */}
      <Header
        onSearch={handleTopicSelect}
        onHome={goHome}
        searchFilter={searchFilter}
        onSearchFilterChange={setSearchFilter}
        streakCount={7}
      />

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
            color: 'var(--tb-text-muted)',
            whiteSpace: 'nowrap',
          }}
        >
          You&apos;ve explored {exploredCount} of 9 topics today
        </span>
        <div className="tb-progress-track" style={{ flex: 1 }}>
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
          <ArticleView article={currentArticle} onTopicClick={handleTopicSelect} />
        )}
      </main>
    </div>
  );
}
