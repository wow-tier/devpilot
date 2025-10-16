import React from 'react';
import { cn } from '@/app/lib/utils';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'blue' | 'purple' | 'accent' | 'none';
}

export function GlassPanel({ children, className, hover = false, glow = 'none' }: GlassPanelProps) {
  const glowClasses = {
    blue: 'glow-blue',
    purple: 'glow-purple',
    accent: 'glow-accent',
    none: '',
  };

  return (
    <div
      className={cn(
        'glass-panel rounded-cursor-md',
        hover && 'glass-panel-hover',
        glow !== 'none' && glowClasses[glow],
        className
      )}
    >
      {children}
    </div>
  );
}
