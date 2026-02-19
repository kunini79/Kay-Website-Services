import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  icon,
  style,
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 28px',
    borderRadius: 'var(--tb-radius-full)',
    fontFamily: 'var(--tb-font-heading)',
    fontWeight: 800,
    fontSize: '15px',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'transform 120ms ease, box-shadow 120ms ease, filter 120ms ease',
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--tb-primary)',
      color: 'white',
      borderColor: 'var(--tb-primary-light)',
      boxShadow: '0 4px 0 var(--tb-primary-dark)',
    },
    secondary: {
      background: 'var(--tb-surface)',
      color: 'var(--tb-primary)',
      boxShadow: '0 4px 0 var(--tb-border)',
      border: '2px solid var(--tb-primary)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--tb-primary)',
    },
  };

  const pressedShadowByVariant: Record<string, string> = {
    primary: '0 2px 0 var(--tb-primary-dark)',
    secondary: '0 2px 0 var(--tb-border)',
    ghost: 'none',
  };

  return (
    <button
      style={{ ...baseStyle, ...variants[variant], ...style }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(2px)';
        e.currentTarget.style.boxShadow = pressedShadowByVariant[variant];
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = variants[variant].boxShadow as string;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = variants[variant].boxShadow as string;
      }}
      {...props}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
