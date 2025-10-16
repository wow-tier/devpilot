'use client';

import React, { useState } from 'react';
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
    { id: 'files' as const, icon: '📁', label: 'Files' },
    { id: 'search' as const, icon: '🔍', label: 'Search' },
    { id: 'git' as const, icon: '🔀', label: 'Git' },
    { id: 'extensions' as const, icon: '🧩', label: 'Extensions' },
  ];

  return (
    <div className="flex h-full">
      {/* Tab Bar */}
      <div className="w-12 bg-gray-950 border-r border-gray-800 flex flex-col">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              py-3 flex items-center justify-center
              transition-colors relative
              ${activeTab === tab.id
                ? 'text-white bg-gray-900'
                : 'text-gray-500 hover:text-gray-300'
              }
            `}
            title={tab.label}
          >
            <span className="text-xl">{tab.icon}</span>
            {activeTab === tab.id && (
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500" />
            )}
          </button>
        ))}
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
          <div className="p-4 text-gray-400">
            <p className="text-center">Extensions panel coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
