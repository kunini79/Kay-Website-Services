import React from 'react';
import Image from 'next/image';

export const Loader: React.FC<{ message?: string }> = ({
  message = 'Loading...',
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(247, 247, 247, 0.8)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        gap: '24px',
      }}
    >
      {/* Animated icon */}
      <div className="tb-float">
        <div
          style={{
            width: '170px',
            height: '100px',
            borderRadius: 'var(--tb-radius-lg)',
            background: 'linear-gradient(135deg, var(--tb-primary), var(--tb-yellow))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--tb-shadow-lg)',
            padding: '14px 16px',
          }}
        >
          <Image
            src="/ThinkBox/Think Box Logo.png"
            alt="ThinkBox"
            width={140}
            height={46}
            priority
            style={{ height: '46px', width: 'auto' }}
          />
        </div>
      </div>

      {/* Spinner */}
      <div className="tb-spinner" aria-hidden="true" />

      {/* Message */}
      <p
        style={{
          fontFamily: 'var(--tb-font-heading)',
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--tb-text-muted)',
        }}
      >
        {message}
      </p>
    </div>
  );
};
