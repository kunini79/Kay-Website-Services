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

  // Feedback modal state
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    const handler = () => setFeedbackOpen(true);
    window.addEventListener('tb-feedback-open', handler);
    return () => window.removeEventListener('tb-feedback-open', handler);
  }, []);

  function closeFeedback() {
    setFeedbackOpen(false);
  }

  /* Load Backpack and XP from local storage */
  useEffect(() => {
    const userId = localStorage.getItem('tb-user-id');
    if (!userId) return;
    import('./cloudSync').then(({ fetchCloudProgress }) => {
      fetchCloudProgress(userId)
        .then(cloud => {
          // Merge cloud and localStorage
          const local = {
            xp: localStorage.getItem('tb-xp'),
            streak: localStorage.getItem('tb-streak'),
            achievements: localStorage.getItem('tb-achievements'),
            history: localStorage.getItem('tb-history'),
            backpack: localStorage.getItem('tb-backpack'),
            quizzesCompleted: localStorage.getItem('tb-quizzes-completed'),
            perfectQuizzes: localStorage.getItem('tb-perfect-quizzes'),
          };
          // Prefer cloud if exists, else local
          setUserXP(cloud.xp ?? parseInt(local.xp || '0', 10));
          setStreakCount(cloud.streak ?? parseInt(local.streak || '1', 10));
          setQuizzesCompleted(cloud.quizzesCompleted ?? parseInt(local.quizzesCompleted || '0', 10));
          setPerfectQuizzes(cloud.perfectQuizzes ?? parseInt(local.perfectQuizzes || '0', 10));
          setSavedArticles(cloud.backpack ?? (local.backpack ? JSON.parse(local.backpack) : []));
          setReadHistory(cloud.history ?? (local.history ? JSON.parse(local.history) : []));
          setAchievements(
            ALL_ACHIEVEMENTS.map((a) => ({
              ...a,
              unlockedAt: (cloud.achievements && cloud.achievements[a.id]) ??
                (local.achievements ? JSON.parse(local.achievements)[a.id] : undefined),
            }))
          );
        })
        .catch((e) => {
          console.error('Cloud progress fetch failed', e);
        });
    });
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

  /* Sync progress to cloud whenever any tracked state changes */
  useEffect(() => {
    const userId = localStorage.getItem('tb-user-id');
    if (!userId) return;
    import('./cloudSync').then(({ saveCloudProgress }) => {
      saveCloudProgress(userId, {
        xp: userXP,
        streak: streakCount,
        achievements: Object.fromEntries(achievements.filter(a => a.unlockedAt).map(a => [a.id, a.unlockedAt])),
        history: readHistory,
        backpack: savedArticles,
        quizzesCompleted,
        perfectQuizzes,
      }).catch(e => {
        console.error('Cloud progress save failed', e);
      });
    });
  }, [userXP, streakCount, achievements, readHistory, savedArticles, quizzesCompleted, perfectQuizzes]);

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

      <div className="tb-system-root">
        <SystemErrorBoundary>
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
          <main className="tb-system-main">
            {/* Feedback Modal */}
            {feedbackOpen && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.18)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{ maxWidth: 420, width: '100%', background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px #0002', padding: 0, position: 'relative' }}>
                  <button
                    onClick={closeFeedback}
                    style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#777', cursor: 'pointer', zIndex: 2 }}
                    aria-label="Close feedback form"
                  >×</button>
                  <div style={{ padding: '24px 0 0 0' }}>
                    {/* FeedbackForm component */}
                    <React.Suspense fallback={<div style={{ padding: 32, textAlign: 'center' }}>Loading…</div>}>
                      {require('./components/FeedbackForm').FeedbackForm({ onClose: closeFeedback })}
                    </React.Suspense>
                  </div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="tb-error-view">
                <AlertCircle size={32} className="text-red-500 mb-2" />
                <p
                  style={{
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

            {viewState === ViewState.LOADING && <Loader />}

            {viewState === ViewState.HOME && (
              <HomeView
                onTopicClick={handleTopicSelect}
                searchFilter={searchFilter}
                exploredCategories={exploredCategories}
                onCategoryChange={handleHomeCategoryChange}
                readHistory={readHistory}
              />
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
    </div>
  );
}
