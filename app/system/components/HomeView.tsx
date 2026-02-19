import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CATEGORY_CONFIG, STATIC_TOPICS } from '../constants';
import { Category, TopicPreview } from '../types';
import { X, ArrowRight, Lightbulb } from 'lucide-react';

interface HomeViewProps {
  onTopicClick: (topic: string) => void;
  searchFilter: string;
  exploredCategories: Set<string>;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onTopicClick,
  searchFilter,
  exploredCategories,
}) => {
  const [modalCategory, setModalCategory] = useState<Category | null>(null);
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  const rippleKey = useRef(0);

  const categories = Object.keys(CATEGORY_CONFIG) as Category[];

  /* Live-filter categories by search term */
  const filteredCategories = searchFilter.trim()
    ? categories.filter(
        (cat) =>
          cat.toLowerCase().includes(searchFilter.toLowerCase()) ||
          CATEGORY_CONFIG[cat].description
            .toLowerCase()
            .includes(searchFilter.toLowerCase())
      )
    : categories;

  /* Card click with ripple animation */
  const handleCardClick = useCallback(
    (cat: Category, e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      rippleKey.current += 1;
      setRipple({ x, y, key: rippleKey.current });

      setTimeout(() => {
        setModalCategory(cat);
        setRipple(null);
      }, 350);
    },
    []
  );

  /* Close modal */
  const closeModal = useCallback(() => setModalCategory(null), []);

  /* Keyboard: close on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeModal]);

  /* Get 3 sample stubs for the modal */
  const getStubs = (cat: Category): TopicPreview[] => {
    const all = STATIC_TOPICS[cat] || [];
    return all.slice(0, 3);
  };

  return (
    <div>
      {/* ── Hero Section ─────────────────────────────── */}
      <section className="tb-hero" aria-labelledby="hero-title">
        <div className="tb-logo-pulse" style={{ display: 'inline-block', marginBottom: '8px' }}>
          <span className="tb-glow" style={{ fontSize: '56px', display: 'inline-block' }} role="img" aria-hidden="true">
            💡
          </span>
        </div>
        <h1 id="hero-title" className="tb-hero-title">
          ThinkBox
        </h1>
        <p className="tb-hero-subtitle">What do you want to explore today?</p>
      </section>

      {/* ── Category Grid ────────────────────────────── */}
      <section aria-label="Browse categories">
        <div className="tb-grid">
          {categories.map((cat, idx) => {
            const config = CATEGORY_CONFIG[cat];
            const isDimmed =
              searchFilter.trim() !== '' && !filteredCategories.includes(cat);

            return (
              <button
                key={cat}
                onClick={(e) => handleCardClick(cat, e)}
                className={`tb-card ${config.cssClass} tb-card-enter tb-card-delay-${idx} ${
                  isDimmed ? 'tb-card--dimmed' : ''
                }`}
                style={{ padding: '28px 24px', textAlign: 'left', border: 'none' }}
                aria-label={`${cat} category. ${config.description}`}
                tabIndex={isDimmed ? -1 : 0}
              >
                {/* XP badge */}
                <span className="tb-xp-badge" aria-label="Earn 50 XP">
                  +50 XP
                </span>

                {/* Ripple */}
                {ripple && (
                  <span
                    className="tb-ripple"
                    style={{ left: ripple.x, top: ripple.y }}
                    key={ripple.key}
                  />
                )}

                <span className="tb-card-emoji" role="img" aria-hidden="true">
                  {config.icon}
                </span>
                <span className="tb-card-name">{cat}</span>
                <span className="tb-card-desc">{config.description}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Category Modal ───────────────────────────── */}
      {modalCategory && (
        <div
          className="tb-overlay"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={`${modalCategory} articles`}
        >
          <div
            className="tb-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: '32px' }}
          >
            {/* Modal header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '32px' }} role="img" aria-hidden="true">
                  {CATEGORY_CONFIG[modalCategory].icon}
                </span>
                <h2
                  style={{
                    fontFamily: 'var(--tb-font-heading)',
                    fontSize: '24px',
                    fontWeight: 700,
                    color: 'var(--tb-text)',
                    margin: 0,
                  }}
                >
                  {modalCategory}
                </h2>
              </div>
              <button
                onClick={closeModal}
                style={{
                  background: 'var(--tb-bg)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Article stubs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {getStubs(modalCategory).map((stub) => (
                <button
                  key={stub.title}
                  className="tb-stub"
                  onClick={() => {
                    closeModal();
                    onTopicClick(stub.title);
                  }}
                  style={{ border: 'none', width: '100%', textAlign: 'left' }}
                >
                  <div>
                    <div className="tb-stub-title">{stub.title}</div>
                    <div className="tb-stub-desc">{stub.description}</div>
                  </div>
                  <ArrowRight
                    size={16}
                    style={{ marginLeft: 'auto', color: 'var(--tb-primary)', flexShrink: 0 }}
                  />
                </button>
              ))}
            </div>

            {/* View all link */}
            <button
              onClick={() => {
                closeModal();
                onTopicClick(modalCategory);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                marginTop: '20px',
                padding: '14px',
                background: 'var(--tb-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--tb-radius-md)',
                fontFamily: 'var(--tb-font-heading)',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              Explore all {modalCategory}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
