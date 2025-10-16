'use client';

import React from 'react';
import { diffLines } from 'diff';
import { FileText, Plus, Minus } from 'lucide-react';

interface DiffPreviewProps {
  original: string;
  modified: string;
  fileName?: string;
}

export default function DiffPreview({ original, modified, fileName }: DiffPreviewProps) {
  const diff = diffLines(original, modified);

  return (
    <div className="bg-slate-900 text-white p-4 rounded-lg border border-slate-800">
      {fileName && (
        <div className="mb-4 pb-3 border-b border-slate-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">{fileName}</h3>
        </div>
      )}
      
      <div className="font-mono text-xs overflow-x-auto">
        {diff.map((part, index) => {
          const bgColor = part.added
            ? 'bg-green-500/10'
            : part.removed
            ? 'bg-red-500/10'
            : 'bg-transparent';
          
          const textColor = part.added
            ? 'text-green-400'
            : part.removed
            ? 'text-red-400'
            : 'text-slate-300';
          
          const icon = part.added
            ? <Plus className="w-3 h-3 inline mr-1" />
            : part.removed
            ? <Minus className="w-3 h-3 inline mr-1" />
            : null;

          return (
            <div key={index} className={`${bgColor} ${textColor} border-l-2 ${part.added ? 'border-green-500' : part.removed ? 'border-red-500' : 'border-transparent'}`}>
              {part.value.split('\n').map((line, lineIndex) => (
                line.length > 0 && (
                  <div key={lineIndex} className="px-3 py-0.5 hover:bg-slate-800/30">
                    {icon}
                    {line}
                  </div>
                )
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
