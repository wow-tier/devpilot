'use client';

import React from 'react';
import { cn } from '@/app/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AppShell({ children, sidebar, header, footer, className }: AppShellProps) {
  return (
    <div className={cn('flex flex-col h-screen w-screen bg-cursor-base text-cursor-text', className)}>
      {header && (
        <header className="flex-shrink-0 border-b border-cursor-border bg-cursor-surface">
          {header}
        </header>
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {sidebar && (
          <aside className="flex-shrink-0 border-r border-cursor-border bg-cursor-surface">
            {sidebar}
          </aside>
        )}
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      
      {footer && (
        <footer className="flex-shrink-0 border-t border-cursor-border bg-cursor-surface">
          {footer}
        </footer>
      )}
    </div>
  );
}
