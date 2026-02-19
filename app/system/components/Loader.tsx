import React from 'react';
import Image from 'next/image';

export const Loader: React.FC<{ message?: string }> = ({
  message = 'Loading...',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '300px',
        width: '100%',
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
