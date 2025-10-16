'use client';

import React from 'react';
import { diffLines } from 'diff';

interface DiffPreviewProps {
  original: string;
  modified: string;
  fileName?: string;
}

export default function DiffPreview({ original, modified, fileName }: DiffPreviewProps) {
  const diff = diffLines(original, modified);

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg">
      {fileName && (
        <div className="mb-4 pb-2 border-b border-gray-700">
          <h3 className="text-lg font-semibold">📝 {fileName}</h3>
        </div>
      )}
      
      <div className="font-mono text-sm overflow-x-auto">
        {diff.map((part, index) => {
          const bgColor = part.added
            ? 'bg-green-900/30'
            : part.removed
            ? 'bg-red-900/30'
            : 'bg-transparent';
          
          const textColor = part.added
            ? 'text-green-300'
            : part.removed
            ? 'text-red-300'
            : 'text-gray-300';
          
          const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';

          return (
            <div key={index} className={`${bgColor} ${textColor}`}>
              {part.value.split('\n').map((line, lineIndex) => (
                line.length > 0 && (
                  <div key={lineIndex} className="px-2 py-0.5">
                    <span className="select-none opacity-50">{prefix}</span>
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
