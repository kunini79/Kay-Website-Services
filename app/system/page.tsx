'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ViewState, Article, Category, UserSettings, DEFAULT_SETTINGS, SavedArticle, ReadHistoryItem, Achievement, ALL_ACHIEVEMENTS } from './types';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ArticleView } from './components/ArticleView';
import { BackpackView } from './components/BackpackView';
import { ProfileView } from './components/ProfileView';
import { LevelUpToast } from './components/LevelUpToast';
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

  // -- Streak State --
  const [streakCount, setStreakCount] = useState(1);

  // -- Reading History --
  const [readHistory, setReadHistory] = useState<ReadHistoryItem[]>([]);

  // -- Quiz Stats --
  const [quizzesCompleted, setQuizzesCompleted] = useState(0);
  const [perfectQuizzes, setPerfectQuizzes] = useState(0);

  // -- Achievements --
  const [achievements, setAchievements] = useState<Achievement[]>(
    ALL_ACHIEVEMENTS.map((a) => ({ ...a }))
  );

  // -- Level-up toast --
  const [levelUpToast, setLevelUpToast] = useState<number | null>(null);
  const prevLevelRef = useRef(1);

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
        if (level) {
          const lvl = parseInt(level, 10);
          setUserLevel(lvl);
          prevLevelRef.current = lvl;
        }

        // -- History --
        const hist = localStorage.getItem('tb-history');
        if (hist) setReadHistory(JSON.parse(hist));

        // -- Quiz stats --
        const qc = localStorage.getItem('tb-quizzes-completed');
        const pq = localStorage.getItem('tb-perfect-quizzes');
        if (qc) setQuizzesCompleted(parseInt(qc, 10));
        if (pq) setPerfectQuizzes(parseInt(pq, 10));

        // -- Achievements --
        const ach = localStorage.getItem('tb-achievements');
        if (ach) {
          const unlocked: Record<string, number> = JSON.parse(ach);
          setAchievements(ALL_ACHIEVEMENTS.map((a) => ({
            ...a,
            unlockedAt: unlocked[a.id] ?? undefined,
          })));
        }

        // -- Streak init --
        const storedStreak = localStorage.getItem('tb-streak');
        const storedLastActive = localStorage.getItem('tb-streak-last-active');
        const now = Date.now();

        if (!storedStreak || !storedLastActive) {
          // Brand new user — start at 1
          setStreakCount(1);
          localStorage.setItem('tb-streak', '1');
          localStorage.setItem('tb-streak-last-active', now.toString());
        } else {
          const lastActive = parseInt(storedLastActive, 10);
          const diffHours = (now - lastActive) / (1000 * 60 * 60);
          let streak = parseInt(storedStreak, 10);

          if (diffHours < 24) {
            // Same active window — keep streak, refresh timestamp
            localStorage.setItem('tb-streak-last-active', now.toString());
          } else if (diffHours < 48) {
            // Returned within the next day — increment streak
            streak += 1;
            localStorage.setItem('tb-streak', streak.toString());
            localStorage.setItem('tb-streak-last-active', now.toString());
          } else {
            // Missed a day — streak broken, start fresh at 1
            streak = 1;
            localStorage.setItem('tb-streak', '1');
            localStorage.setItem('tb-streak-last-active', now.toString());
          }
          setStreakCount(streak);
        }
    } catch (e) {
        console.error('Failed to load data', e);
    }
  }, []);

  /* Save Backpack to local storage */
  useEffect(() => {
    localStorage.setItem('tb-backpack', JSON.stringify(savedArticles));
  }, [savedArticles]);

  /* Save XP and Level + trigger level-up toast */
  useEffect(() => {
    if (xpChanged) {
        localStorage.setItem('tb-xp', userXP.toString());
        localStorage.setItem('tb-level', userLevel.toString());
        if (userLevel > prevLevelRef.current) {
          setLevelUpToast(userLevel);
          prevLevelRef.current = userLevel;
        }
        setXpChanged(false);
    }
  }, [userXP, userLevel, xpChanged]);

  /* Persist reading history */
  useEffect(() => {
    if (readHistory.length > 0)
      localStorage.setItem('tb-history', JSON.stringify(readHistory));
  }, [readHistory]);

  /* Check + unlock achievements */
  const checkAchievements = useCallback(
    (opts: {
      historyLen: number;
      streak: number;
      level: number;
      backpackLen: number;
      quizzes: number;
      perfects: number;
      categoriesExplored: number;
      completedDailyChallenge: boolean;
    }) => {
      setAchievements((prev) => {
        const unlocked: Record<string, number> = {};
        prev.forEach((a) => { if (a.unlockedAt) unlocked[a.id] = a.unlockedAt; });
        const now = Date.now();
        const tryUnlock = (id: string, condition: boolean) => {
          if (condition && !unlocked[id]) unlocked[id] = now;
        };
        tryUnlock('first_read',      opts.historyLen >= 1);
        tryUnlock('read_10',         opts.historyLen >= 10);
        tryUnlock('read_25',         opts.historyLen >= 25);
        tryUnlock('read_50',         opts.historyLen >= 50);
        tryUnlock('streak_3',        opts.streak >= 3);
        tryUnlock('streak_7',        opts.streak >= 7);
        tryUnlock('streak_30',       opts.streak >= 30);
        tryUnlock('all_categories',  opts.categoriesExplored >= 9);
        tryUnlock('backpack_5',      opts.backpackLen >= 5);
        tryUnlock('backpack_20',     opts.backpackLen >= 20);
        tryUnlock('quiz_1',          opts.quizzes >= 1);
        tryUnlock('quiz_5',          opts.quizzes >= 5);
        tryUnlock('quiz_perfect',    opts.perfects >= 1);
        tryUnlock('quiz_perfect_3',  opts.perfects >= 3);
        tryUnlock('level_5',         opts.level >= 5);
        tryUnlock('level_10',        opts.level >= 10);
        tryUnlock('daily_challenge', opts.completedDailyChallenge);
        localStorage.setItem('tb-achievements', JSON.stringify(unlocked));
        return ALL_ACHIEVEMENTS.map((a) => ({ ...a, unlockedAt: unlocked[a.id] }));
      });
    },
    []
  );

  /* Fire achievement checks whenever any tracked stat changes */
  useEffect(() => {
    checkAchievements({
      historyLen:          readHistory.length,
      categoriesExplored:  exploredCategories.size,
      streak:              streakCount,
      level:               userLevel,
      backpackLen:         savedArticles.length,
      quizzes:             quizzesCompleted,
      perfects:            perfectQuizzes,
      completedDailyChallenge: false,
    });
  // checkAchievements identity is stable (useCallback [])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkAchievements, readHistory.length, exploredCategories.size, streakCount,
      userLevel, savedArticles.length, quizzesCompleted, perfectQuizzes]);

  // Touch streak on any activity (topic open, random, search)
  const touchStreak = useCallback(() => {
    const now = Date.now();
    const storedLastActive = localStorage.getItem('tb-streak-last-active');
    const storedStreak = localStorage.getItem('tb-streak');
    if (!storedLastActive || !storedStreak) return;
    const lastActive = parseInt(storedLastActive, 10);
    const diffHours = (now - lastActive) / (1000 * 60 * 60);
    if (diffHours >= 24 && diffHours < 48) {
      // New day of activity — increment
      const newStreak = parseInt(storedStreak, 10) + 1;
      setStreakCount(newStreak);
      localStorage.setItem('tb-streak', newStreak.toString());
    } else if (diffHours >= 48) {
      // Broke — reset
      setStreakCount(1);
      localStorage.setItem('tb-streak', '1');
    }
    localStorage.setItem('tb-streak-last-active', now.toString());
  }, []);

  const handleEarnXP = useCallback((amount: number, isPerfect?: boolean) => {
    setUserXP(prev => {
        const newXP = prev + amount;
        const newLevel = Math.floor(newXP / 100) + 1;
        if (newLevel > userLevel) setUserLevel(newLevel);
        setXpChanged(true);
        return newXP;
    });
    // Track quiz completion
    setQuizzesCompleted(prev => {
      const next = prev + 1;
      localStorage.setItem('tb-quizzes-completed', next.toString());
      return next;
    });
    if (isPerfect) {
      setPerfectQuizzes(prev => {
        const next = prev + 1;
        localStorage.setItem('tb-perfect-quizzes', next.toString());
        return next;
      });
    }
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
        touchStreak();
        const article = await fetchArticle(topic);
        setCurrentArticle(article);
        // Record in history (max 50, no duplicates — push to end)
        setReadHistory(prev => {
          const filtered = prev.filter(h => h.title !== article.title);
          const next = [...filtered, { title: article.title, category: article.category, readAt: Date.now() }].slice(-50);
          localStorage.setItem('tb-history', JSON.stringify(next));
          return next;
        });
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
    [touchStreak]
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

  const onProfileClick = useCallback(() => {
      setViewState(ViewState.PROFILE);
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
      {levelUpToast && (
        <LevelUpToast level={levelUpToast} onDone={() => setLevelUpToast(null)} />
      )}

      <Header
        onSearch={handleTopicSelect}
        onHome={goHome}
        onRandom={handleRandomTopic}
        onBackpack={onBackpackClick}
        onProfile={onProfileClick}
        searchFilter={searchFilter}
        onSearchFilterChange={setSearchFilter}
        streakCount={streakCount}
        userXP={userXP}
        userLevel={userLevel}
        settings={settings}
        onSettingsUpdate={setSettings}
        unlockedAchievementsCount={achievements.filter(a => a.unlockedAt).length}
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
            readHistory={readHistory}
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

        {viewState === ViewState.PROFILE && (
          <ProfileView
            userName={(() => { try { const u = localStorage.getItem('tb-username'); return u || 'Explorer'; } catch { return 'Explorer'; } })()}
            userXP={userXP}
            userLevel={userLevel}
            streakCount={streakCount}
            savedArticles={savedArticles}
            readHistory={readHistory}
            achievements={achievements}
            quizzesCompleted={quizzesCompleted}
            perfectQuizzes={perfectQuizzes}
            onBack={goHome}
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
