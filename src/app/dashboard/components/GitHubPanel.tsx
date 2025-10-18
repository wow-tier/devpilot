'use client';

import React from 'react';

interface GitHubPanelProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GitHubPanel({ children, className = '', hover = false }: GitHubPanelProps) {
  return (
    <div 
      className={`
        bg-[#161b22] border border-[#30363d] rounded-md 
        ${hover ? 'hover:border-[#8b949e] transition-colors cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
