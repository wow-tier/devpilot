import React from 'react';
import { cn } from '@/app/lib/utils';

interface AccentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export function AccentButton({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className,
  ...props
}: AccentButtonProps) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'bg-transparent hover:bg-cursor-surface-hover text-cursor-text-secondary hover:text-cursor-text border border-transparent hover:border-cursor-border',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-cursor-sm transition-all duration-250',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </button>
  );
}
