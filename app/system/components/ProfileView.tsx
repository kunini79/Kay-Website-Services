'use client';
import React, { useMemo } from 'react';
import { ArrowLeft, Trophy, Flame, BookOpen, Star, Target, Award } from 'lucide-react';
import { Achievement, ALL_ACHIEVEMENTS, Category, ReadHistoryItem, SavedArticle } from '../types';
import { CATEGORY_CONFIG } from '../constants';

interface ProfileViewProps {
  userName: string;
  userXP: number;
  userLevel: number;
  streakCount: number;
  savedArticles: SavedArticle[];
  readHistory: ReadHistoryItem[];
  achievements: Achievement[];
  quizzesCompleted: number;
  perfectQuizzes: number;
  onBack: () => void;
}

const XP_PER_LEVEL = 100;

const CATEGORY_EMOJIS: Partial<Record<string, string>> = {
  [Category.ANIMALS]:  '🐾',
  [Category.SCIENCE]:  '🔬',
  [Category.HISTORY]:  '🏛️',
  [Category.PEOPLE]:   '👤',
  [Category.WORLD]:    '🌍',
  [Category.ARTS]:     '🎨',
  [Category.SPORTS]:   '⚽',
  [Category.TECH]:     '💻',
  [Category.READING]:  '📖',
};

export const ProfileView: React.FC<ProfileViewProps> = ({
  userName,
  userXP,
  userLevel,
  streakCount,
  savedArticles,
  readHistory,
  achievements,
  quizzesCompleted,
  perfectQuizzes,
  onBack,
}) => {
  const xpIntoLevel = userXP % XP_PER_LEVEL;
  const xpPercent = (xpIntoLevel / XP_PER_LEVEL) * 100;

  const readsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    readHistory.forEach((h) => {
      counts[h.category] = (counts[h.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [readHistory]);

  const favCategory = readsByCategory[0]?.[0] || '—';

  const unlockedAchievements = achievements.filter((a) => a.unlockedAt);
  const lockedAchievements   = achievements.filter((a) => !a.unlockedAt);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--tb-text-muted)', fontWeight: 700, fontSize: '16px', cursor: 'pointer', marginBottom: '32px' }}
      >
        <ArrowLeft size={20} /> Back to Explore
      </button>

      {/* Hero card */}
      <div style={{ background: 'linear-gradient(135deg, #58CC02 0%, #46A302 100%)', borderRadius: '24px', padding: '40px', color: 'white', marginBottom: '28px', boxShadow: '0 8px 32px rgba(88,204,2,0.3)', position: 'relative', overflow: 'hidden' }}>
        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', position: 'relative', zIndex: 1 }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', fontWeight: 800, border: '3px solid rgba(255,255,255,0.5)', flexShrink: 0 }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>ThinkBox Explorer</div>
            <div style={{ fontFamily: 'var(--tb-font-heading)', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, lineHeight: 1.1 }}>{userName}</div>
          </div>
        </div>

        {/* XP bar */}
        <div style={{ position: 'relative', zIndex: 1, marginTop: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: 700 }}>
            <span>Level {userLevel}</span>
            <span>{xpIntoLevel} / {XP_PER_LEVEL} XP  →  Level {userLevel + 1}</span>
          </div>
          <div style={{ height: '10px', background: 'rgba(255,255,255,0.25)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${xpPercent}%`, background: 'white', borderRadius: '999px', transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
          </div>
          <div style={{ marginTop: '6px', fontSize: '12px', opacity: 0.8 }}>{userXP} total XP earned</div>
        </div>

        {/* Decorative */}
        <div style={{ position: 'absolute', right: '-30px', bottom: '-30px', fontSize: '160px', opacity: 0.1, pointerEvents: 'none' }}>🎓</div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { icon: <Flame size={24} color="#F97316" />, value: `${streakCount}d`, label: 'Current Streak' },
          { icon: <BookOpen size={24} color="#3B82F6" />, value: readHistory.length, label: 'Articles Read' },
          { icon: <Star size={24} color="#F59E0B" />, value: savedArticles.length, label: 'Saved Articles' },
          { icon: <Target size={24} color="#8B5CF6" />, value: quizzesCompleted, label: 'Quizzes Done' },
          { icon: <Trophy size={24} color="#58CC02" />, value: perfectQuizzes, label: 'Perfect Scores' },
          { icon: <Award size={24} color="#EC4899" />, value: unlockedAchievements.length, label: 'Badges Earned' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'var(--tb-surface)', border: '2px solid var(--tb-border)', borderRadius: '18px', padding: '20px', textAlign: 'center', boxShadow: 'var(--tb-shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>{stat.icon}</div>
            <div style={{ fontFamily: 'var(--tb-font-heading)', fontSize: '28px', fontWeight: 800, color: 'var(--tb-text)', lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--tb-text-muted)', fontWeight: 700, marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Favourite categories */}
      {readsByCategory.length > 0 && (
        <div style={{ background: 'var(--tb-surface)', border: '2px solid var(--tb-border)', borderRadius: '20px', padding: '28px', marginBottom: '28px', boxShadow: 'var(--tb-shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--tb-font-heading)', fontSize: '20px', fontWeight: 800, color: 'var(--tb-text)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            📊 My Favourite Categories
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {readsByCategory.map(([cat, count]) => {
              const maxCount = readsByCategory[0][1];
              const pct = (count / maxCount) * 100;
              return (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '32px', textAlign: 'center', fontSize: '20px' }}>{CATEGORY_EMOJIS[cat] || '📌'}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--tb-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--tb-text-muted)', flexShrink: 0, marginLeft: '8px' }}>{count} read</span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--tb-border)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'var(--tb-primary)', borderRadius: '999px', transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div style={{ background: 'var(--tb-surface)', border: '2px solid var(--tb-border)', borderRadius: '20px', padding: '28px', boxShadow: 'var(--tb-shadow-sm)' }}>
        <h2 style={{ fontFamily: 'var(--tb-font-heading)', fontSize: '20px', fontWeight: 800, color: 'var(--tb-text)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🏅 Achievements <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--tb-text-muted)' }}>({unlockedAchievements.length}/{achievements.length})</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
          {achievements.map((a) => (
            <div
              key={a.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px',
                borderRadius: '14px',
                border: `2px solid ${a.unlockedAt ? '#86EFAC' : 'var(--tb-border)'}`,
                background: a.unlockedAt ? '#F0FDF4' : 'var(--tb-bg)',
                opacity: a.unlockedAt ? 1 : 0.5,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '32px', lineHeight: 1, filter: a.unlockedAt ? 'none' : 'grayscale(1)' }}>{a.icon}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '14px', color: a.unlockedAt ? '#15803d' : 'var(--tb-text)' }}>{a.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--tb-text-muted)', marginTop: '2px', lineHeight: 1.4 }}>{a.description}</div>
                {a.unlockedAt && (
                  <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: 700, marginTop: '4px' }}>
                    ✓ Unlocked {new Date(a.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent reading history */}
      {readHistory.length > 0 && (
        <div style={{ background: 'var(--tb-surface)', border: '2px solid var(--tb-border)', borderRadius: '20px', padding: '28px', marginTop: '28px', boxShadow: 'var(--tb-shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--tb-font-heading)', fontSize: '20px', fontWeight: 800, color: 'var(--tb-text)', marginBottom: '20px' }}>
            🕐 Reading History
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[...readHistory].reverse().map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '12px', background: 'var(--tb-bg)', border: '1px solid var(--tb-border)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--tb-text)' }}>{item.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--tb-text-muted)', marginTop: '2px' }}>{item.category}</div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--tb-text-muted)', flexShrink: 0, marginLeft: '12px' }}>
                  {new Date(item.readAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
