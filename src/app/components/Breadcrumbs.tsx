'use client';

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  path: string;
  onNavigate?: (path: string) => void;
}

export default function Breadcrumbs({ path, onNavigate }: BreadcrumbsProps) {
  if (!path) return null;

  const parts = path.split('/').filter(Boolean);
  
  return (
    <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
      <button
        onClick={() => onNavigate?.('.')}
        className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-800"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Root</span>
      </button>
      
      {parts.map((part, index) => {
        const partPath = parts.slice(0, index + 1).join('/');
        const isLast = index === parts.length - 1;
        
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <button
              onClick={() => !isLast && onNavigate?.(partPath)}
              className={`px-2 py-1 rounded transition-colors ${
                isLast 
                  ? 'text-white font-medium' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {part}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
