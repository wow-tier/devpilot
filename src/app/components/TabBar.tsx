'use client';

import React from 'react';

export interface Tab {
  id: string;
  label: string;
  path: string;
  language?: string;
  isDirty?: boolean;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

export default function TabBar({ tabs, activeTab, onTabClick, onTabClose }: TabBarProps) {
  const getFileIcon = (language?: string) => {
    const iconMap: Record<string, string> = {
      'typescript': '📘',
      'javascript': '📙',
      'python': '🐍',
      'json': '📋',
      'markdown': '📝',
      'css': '🎨',
      'html': '🌐',
    };
    return iconMap[language || ''] || '📄';
  };

  return (
    <div className="flex items-center bg-gray-900 border-b border-gray-800 overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`
            flex items-center gap-2 px-4 py-2 cursor-pointer border-r border-gray-800
            transition-colors min-w-fit group relative
            ${activeTab === tab.id 
              ? 'bg-gray-950 text-white border-b-2 border-blue-500' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }
          `}
          onClick={() => onTabClick(tab.id)}
        >
          <span className="text-sm">{getFileIcon(tab.language)}</span>
          <span className="text-sm font-medium">{tab.label}</span>
          {tab.isDirty && <span className="text-blue-400">●</span>}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-gray-700 rounded p-0.5 transition-opacity"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
