'use client';

import React from 'react';

interface BreadcrumbsProps {
  path: string;
  onNavigate?: (path: string) => void;
}

export default function Breadcrumbs({ path, onNavigate }: BreadcrumbsProps) {
  if (!path) return null;

  const parts = path.split('/').filter(Boolean);
  
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800 text-sm">
      <button
        onClick={() => onNavigate?.('.')}
        className="text-gray-400 hover:text-white"
      >
        📁 Root
      </button>
      
      {parts.map((part, index) => {
        const partPath = parts.slice(0, index + 1).join('/');
        const isLast = index === parts.length - 1;
        
        return (
          <React.Fragment key={index}>
            <span className="text-gray-600">/</span>
            <button
              onClick={() => !isLast && onNavigate?.(partPath)}
              className={isLast ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}
            >
              {part}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
