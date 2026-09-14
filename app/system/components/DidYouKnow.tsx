import React from 'react';
import { Lightbulb } from 'lucide-react';

interface DidYouKnowProps {
  fact: string;
  title?: string;
}

export const DidYouKnow: React.FC<DidYouKnowProps> = ({ fact, title = 'Did You Know?' }) => {
  return (
    <div
      style={{
        margin: '32px 0',
        padding: '28px 28px 28px 72px',
        background: '#FFFBEB',
        borderRadius: 'var(--tb-radius-lg)',
        border: '2px solid var(--tb-yellow)',
        position: 'relative',
      }}
    >
      {/* Icon */}
      <div
        style={{
          position: 'absolute',
          top: '-16px',
          left: '20px',
          background: 'var(--tb-coral)',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--tb-shadow-md)',
        }}
      >
        <Lightbulb size={24} color="white" strokeWidth={2.5} />
      </div>

      <h4
        style={{
          fontFamily: 'var(--tb-font-heading)',
          fontSize: '14px',
          fontWeight: 700,
          color: 'var(--tb-yellow-dark)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '6px',
        }}
      >
        {title}
      </h4>
      <p
        style={{
          fontSize: '17px',
          fontWeight: 600,
          color: 'var(--tb-text)',
          lineHeight: 1.6,
          fontStyle: 'italic',
          margin: 0,
        }}
      >
        &ldquo;{fact}&rdquo;
      </p>
    </div>
  );
};
