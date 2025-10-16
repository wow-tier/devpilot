'use client';

import React, { useState } from 'react';
import { Files, Search, GitBranch, Package } from 'lucide-react';
import ImprovedFileExplorer from './ImprovedFileExplorer';
import SearchPanel from './SearchPanel';
import GitPanel from './GitPanel';

type SidebarTab = 'files' | 'search' | 'git' | 'extensions';

interface SidebarProps {
  onFileSelect?: (filePath: string) => void;
  selectedFile?: string;
  onFileCreate?: (path: string, type: 'file' | 'directory') => void;
  onFileDelete?: (path: string) => void;
  onFileRename?: (oldPath: string, newPath: string) => void;
  onSearchResult?: (file: string, line: number) => void;
  repoPath?: string;
}

export default function Sidebar({
  onFileSelect,
  selectedFile,
  onFileCreate,
  onFileDelete,
  onFileRename,
  onSearchResult
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('files');

  const tabs = [
    { id: 'files' as const, icon: Files, label: 'Files', tooltip: 'Explorer' },
    { id: 'search' as const, icon: Search, label: 'Search', tooltip: 'Search' },
    { id: 'git' as const, icon: GitBranch, label: 'Git', tooltip: 'Source Control' },
    { id: 'extensions' as const, icon: Package, label: 'Extensions', tooltip: 'Extensions' },
  ];

  return (
    <div className="flex h-full">
      {/* Icon Bar */}
      <div className="w-12 bg-slate-950 border-r border-slate-800 flex flex-col">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-3 flex items-center justify-center
                transition-all relative group
                ${activeTab === tab.id
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-300'
                }
              `}
              title={tab.tooltip}
            >
              <Icon className="w-5 h-5" />
              {activeTab === tab.id && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500" />
              )}
              
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                {tab.tooltip}
              </div>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {activeTab === 'files' && (
          <ImprovedFileExplorer
            onFileSelect={onFileSelect}
            selectedFile={selectedFile}
            onFileCreate={onFileCreate}
            onFileDelete={onFileDelete}
            onFileRename={onFileRename}
          />
        )}
        {activeTab === 'search' && (
          <SearchPanel onResultClick={onSearchResult} />
        )}
        {activeTab === 'git' && <GitPanel />}
        {activeTab === 'extensions' && (
          <div className="p-6 text-center text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <p className="text-sm">Extensions panel</p>
            <p className="text-xs text-slate-500 mt-1">Coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
