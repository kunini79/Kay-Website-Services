import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 text-sm uppercase tracking-wide';
  
  const variants = {
    primary: 'bg-[#BBFD6A] text-black hover:bg-[#aef059] shadow-sm hover:shadow-md',
    secondary: 'bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-700',
    ghost: 'bg-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800'
  };

  const styles = \\ \ \\;

  return (
    <button className={styles} {...props}>
      {icon && <span className='w-4 h-4'>{icon}</span>}
      {children}
    </button>
  );
};
