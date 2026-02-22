'use client';
import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface LevelUpToastProps {
  level: number;
  onDone: () => void;
}

export const LevelUpToast: React.FC<LevelUpToastProps> = ({ level, onDone }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance
    const showTimer = setTimeout(() => setVisible(true), 50);
    // Auto-dismiss after 3.5 s
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400);
    }, 3500);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, [onDone]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '24px',
        zIndex: 10000,
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(120%) scale(0.8)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease',
        background: 'linear-gradient(135deg, #58CC02 0%, #46A302 100%)',
        color: 'white',
        borderRadius: '20px',
        padding: '20px 28px',
        boxShadow: '0 8px 32px rgba(88, 204, 2, 0.45)',
        minWidth: '260px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        pointerEvents: 'none',
      }}
    >
      {/* Animated ring */}
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        animation: 'tb-pulse 1.2s ease-in-out infinite',
      }}>
        <Trophy size={28} fill="white" color="white" />
      </div>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.85, marginBottom: '2px' }}>
          Level Up! 🎉
        </div>
        <div style={{ fontFamily: 'var(--tb-font-heading)', fontSize: '22px', fontWeight: 800, lineHeight: 1 }}>
          You reached Level {level}
        </div>
        <div style={{ fontSize: '13px', opacity: 0.85, marginTop: '4px' }}>
          Keep exploring to earn more XP!
        </div>
      </div>
    </div>
  );
};
