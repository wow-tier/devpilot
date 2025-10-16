'use client';

import React, { useState, useEffect } from 'react';
import { GitBranch, FileText } from 'lucide-react';

interface StatusBarProps {
  currentFile?: string;
  gitBranch?: string;
}

export default function StatusBar({ currentFile, gitBranch }: StatusBarProps) {
  const [time, setTime] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => setTime(new Date().toLocaleTimeString());
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-950 border-t border-slate-800 px-4 py-1.5 flex items-center justify-between text-xs text-slate-400">
      <div className="flex items-center gap-4">
        {gitBranch && (
          <div className="flex items-center gap-1.5">
            <GitBranch className="w-3 h-3" />
            <span>{gitBranch}</span>
          </div>
        )}
        {currentFile && (
          <div className="flex items-center gap-1.5">
            <FileText className="w-3 h-3" />
            <span>{currentFile}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div>AI Code Agent v0.1.0</div>
        {mounted && <div suppressHydrationWarning>{time}</div>}
      </div>
    </div>
  );
}
