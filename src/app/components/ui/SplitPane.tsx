'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/app/lib/utils';

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

export function SplitPane({
  left,
  right,
  defaultSize = 50,
  minSize = 20,
  maxSize = 80,
  className,
}: SplitPaneProps) {
  const [size, setSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const newSize = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      setSize(Math.min(Math.max(newSize, minSize), maxSize));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minSize, maxSize]);

  return (
    <div
      ref={containerRef}
      className={cn('flex h-full w-full relative', className)}
      style={{ userSelect: isDragging ? 'none' : 'auto' }}
    >
      <div style={{ width: `${size}%` }} className="overflow-hidden">
        {left}
      </div>
      
      <div
        className="pane-divider w-1 flex-shrink-0 hover:w-1.5 transition-all"
        onMouseDown={() => setIsDragging(true)}
      />
      
      <div style={{ width: `${100 - size}%` }} className="overflow-hidden">
        {right}
      </div>
    </div>
  );
}
