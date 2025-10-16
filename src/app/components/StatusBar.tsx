'use client';

import React, { useState, useEffect } from 'react';

interface StatusBarProps {
  currentFile?: string;
  gitBranch?: string;
}

export default function StatusBar({ currentFile, gitBranch }: StatusBarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-950 border-t border-gray-800 px-4 py-1 flex items-center justify-between text-xs text-gray-400">
      <div className="flex items-center gap-4">
        {gitBranch && (
          <div className="flex items-center gap-1">
            <span>🌿</span>
            <span>{gitBranch}</span>
          </div>
        )}
        {currentFile && (
          <div className="flex items-center gap-1">
            <span>📄</span>
            <span>{currentFile}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div>AI Code Agent v0.1.0</div>
        <div>{time.toLocaleTimeString()}</div>
      </div>
    </div>
  );
}
