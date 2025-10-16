'use client';

import React, { useEffect } from 'react';

export interface NotificationProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Notification({ type, message, onClose, duration = 3000 }: NotificationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-600',
  };

  return (
    <div className={`fixed bottom-6 right-6 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in z-50 max-w-md`}>
      <span className="text-2xl">{icons[type]}</span>
      <p className="flex-1">{message}</p>
      <button onClick={onClose} className="text-white hover:opacity-75">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
