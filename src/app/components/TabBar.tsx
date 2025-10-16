'use client';

import React from 'react';
import { X, FileText, FileCode } from 'lucide-react';

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
    if (language === 'typescript' || language === 'javascript') {
      return <FileCode className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="flex items-center bg-slate-900 border-b border-slate-800 overflow-x-auto scrollbar-thin">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`
            flex items-center gap-2 px-4 py-2.5 cursor-pointer border-r border-slate-800
            transition-all min-w-fit group relative text-sm
            ${activeTab === tab.id 
              ? 'bg-slate-950 text-white border-t-2 border-t-blue-500' 
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }
          `}
          onClick={() => onTabClick(tab.id)}
        >
          <span className={activeTab === tab.id ? 'text-blue-400' : 'text-slate-500'}>
            {getFileIcon(tab.language)}
          </span>
          <span className="font-medium">{tab.label}</span>
          {tab.isDirty && <span className="w-2 h-2 bg-blue-400 rounded-full"></span>}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            className="ml-2 opacity-0 group-hover:opacity-100 hover:bg-slate-700 rounded p-1 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
