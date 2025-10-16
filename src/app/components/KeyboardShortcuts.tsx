'use client';

import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onSave?: () => void;
  onToggleDiff?: () => void;
  onFocusChat?: () => void;
}

export default function KeyboardShortcuts({
  onSave,
  onToggleDiff,
  onFocusChat,
}: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S - Save file
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        onSave?.();
      }

      // Cmd/Ctrl + D - Toggle diff
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        onToggleDiff?.();
      }

      // Cmd/Ctrl + K - Focus chat
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onFocusChat?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSave, onToggleDiff, onFocusChat]);

  return null; // This component doesn't render anything
}
