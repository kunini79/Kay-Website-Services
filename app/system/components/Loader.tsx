import React from 'react';

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
            width: '72px',
            height: '72px',
            borderRadius: 'var(--tb-radius-lg)',
            background: 'linear-gradient(135deg, var(--tb-primary), var(--tb-yellow))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--tb-shadow-lg)',
          }}
        >
          <span style={{ fontSize: '36px' }} role="img" aria-hidden="true">
            💡
          </span>
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
