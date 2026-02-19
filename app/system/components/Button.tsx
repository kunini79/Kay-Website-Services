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
    fontWeight: 700,
    fontSize: '15px',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 200ms var(--tb-ease-bounce), box-shadow 200ms ease',
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--tb-primary)',
      color: 'white',
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

  return (
    <button
      style={{ ...baseStyle, ...variants[variant], ...style }}
      {...props}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
