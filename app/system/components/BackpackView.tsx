import React, { useMemo } from 'react';
import { Category, SavedArticle, TopicPreview } from '../types';
import { CATEGORY_CONFIG } from '../constants';
import { ArrowLeft, Trash2, BookOpen } from 'lucide-react';

interface BackpackViewProps {
  savedArticles: SavedArticle[];
  onTopicClick: (topic: string) => void;
  onRemove: (topic: string) => void;
  onBack: () => void;
}

export const BackpackView: React.FC<BackpackViewProps> = ({
  savedArticles,
  onTopicClick,
  onRemove,
  onBack,
}) => {
  const sortedArticles = useMemo(() => {
    return [...savedArticles].sort((a, b) => b.dateAdded - a.dateAdded);
  }, [savedArticles]);

  return (
    <div className="tb-backpack-enter" style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: 'var(--tb-text-muted)',
            fontWeight: 700,
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={20} />
          Back to Explore
        </button>

        <h1
          style={{
            fontFamily: 'var(--tb-font-heading)',
            fontSize: '32px',
            fontWeight: 800,
            color: 'var(--tb-text)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span role="img" aria-label="backpack">🎒</span> My Backpack
        </h1>
        
        <div style={{ width: '120px' }} /> {/* Spacer for centering */}
      </div>

      {savedArticles.length === 0 ? (
        <div 
            style={{ 
                textAlign: 'center', 
                padding: '80px 20px',
                background: 'white',
                borderRadius: 'var(--tb-radius-xl)',
                border: '2px dashed var(--tb-border)',
            }}
        >
            <div style={{ fontSize: '64px', marginBottom: '24px', opacity: 0.5 }}>🤷‍♂️</div>
            <h2 style={{ fontSize: '24px', color: 'var(--tb-text)', marginBottom: '12px' }}>
                Your backpack is empty!
            </h2>
            <p style={{ color: 'var(--tb-text-muted)', fontSize: '18px', maxWidth: '400px', margin: '0 auto 32px' }}>
                Bookmark interesting topics while you explore to save them here for later.
            </p>
            <button
                onClick={onBack}
                className="btn-primary"
                style={{
                    background: 'var(--tb-primary)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 32px',
                    borderRadius: 'var(--tb-radius-full)',
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    boxShadow: 'var(--tb-shadow-md)'
                }}
            >
                Start Exploring
            </button>
        </div>
      ) : (
        <div className="tb-grid">
          {sortedArticles.map((article) => {
            const config = CATEGORY_CONFIG[article.category as Category];
            const formattedDate = new Date(article.dateAdded).toLocaleDateString(undefined, {
                month: 'short', day: 'numeric'
            });

            return (
              <div
                key={article.title}
                className="tb-card"
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '24px',
                  borderRadius: 'var(--tb-radius-lg)',
                  background: 'white',
                  border: '2px solid var(--tb-border)',
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  cursor: 'pointer',
                  height: '100%',
                }}
                onClick={() => onTopicClick(article.title)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--tb-shadow-hover)';
                  e.currentTarget.style.borderColor = 'var(--tb-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--tb-shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--tb-border)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div 
                        style={{ 
                            width: '48px', 
                            height: '48px', 
                            borderRadius: '12px',
                            background: config ? `var(--tb-${config.cssClass.replace('tb-card--', 'bg-')})` : '#f3f4f6', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontSize: '24px'
                        }}
                    >
                        {config?.icon || '📄'}
                    </div>
                    
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(article.title);
                        }}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            padding: '8px',
                            cursor: 'pointer',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0.6,
                            transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                        aria-label="Remove from backpack"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                <h3 className="tb-card-name" style={{ fontSize: '20px', marginBottom: '8px', flex: 1 }}>
                    {article.title}
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', fontSize: '13px', color: 'var(--tb-text-muted)', fontWeight: 600 }}>
                    <span style={{ 
                        background: 'var(--tb-bg)', 
                        padding: '4px 10px', 
                        borderRadius: '12px',
                        textTransform: 'uppercase',
                        fontSize: '11px',
                        letterSpacing: '0.5px'
                    }}>
                        {article.category}
                    </span>
                    <span>Added {formattedDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
