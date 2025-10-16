'use client';

import React, { useState, useEffect } from 'react';

interface FileInfo {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
}

interface ContextMenu {
  x: number;
  y: number;
  file: FileInfo;
}

interface ImprovedFileExplorerProps {
  onFileSelect?: (filePath: string) => void;
  onFileCreate?: (path: string, type: 'file' | 'directory') => void;
  onFileDelete?: (path: string) => void;
  onFileRename?: (oldPath: string, newPath: string) => void;
  selectedFile?: string;
}

export default function ImprovedFileExplorer({
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  selectedFile
}: ImprovedFileExplorerProps) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['.']));
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadFiles('.');
  }, []);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const loadFiles = async (path: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/files?directory=${encodeURIComponent(path)}`);
      const data = await response.json();
      if (data.success) {
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileClick = (file: FileInfo) => {
    if (file.type === 'directory') {
      const isExpanded = expandedDirs.has(file.path);
      const newExpandedDirs = new Set(expandedDirs);
      if (isExpanded) {
        newExpandedDirs.delete(file.path);
      } else {
        newExpandedDirs.add(file.path);
      }
      setExpandedDirs(newExpandedDirs);
    } else {
      onFileSelect?.(file.path);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, file: FileInfo) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file });
  };

  const getFileIcon = (file: FileInfo) => {
    if (file.type === 'directory') {
      return expandedDirs.has(file.path) ? '📂' : '📁';
    }
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    const iconMap: Record<string, string> = {
      'ts': '🔷',
      'tsx': '⚛️',
      'js': '🟨',
      'jsx': '⚛️',
      'json': '📋',
      'md': '📝',
      'css': '🎨',
      'html': '🌐',
      'py': '🐍',
      'git': '🔀',
      'env': '🔐',
    };
    
    return iconMap[ext || ''] || '📄';
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header with Actions */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <h2 className="text-sm font-semibold">Explorer</h2>
        <div className="flex gap-1">
          <button
            onClick={() => onFileCreate?.('new-file.ts', 'file')}
            className="p-1 hover:bg-gray-800 rounded"
            title="New File"
          >
            📄
          </button>
          <button
            onClick={() => onFileCreate?.('new-folder', 'directory')}
            className="p-1 hover:bg-gray-800 rounded"
            title="New Folder"
          >
            📁
          </button>
          <button
            onClick={() => loadFiles('.')}
            className="p-1 hover:bg-gray-800 rounded"
            title="Refresh"
          >
            🔄
          </button>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="divide-y divide-gray-800">
            {files.map((file) => (
              <div
                key={file.path}
                onClick={() => handleFileClick(file)}
                onContextMenu={(e) => handleContextMenu(e, file)}
                className={`
                  flex items-center gap-2 px-3 py-2 cursor-pointer
                  hover:bg-gray-800 transition-colors
                  ${selectedFile === file.path ? 'bg-blue-600/20 border-l-2 border-blue-500' : ''}
                `}
              >
                <span className="text-lg">{getFileIcon(file)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{file.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-gray-800 border border-gray-700 rounded shadow-lg py-1 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={() => {
              onFileRename?.(contextMenu.file.path, contextMenu.file.path + '_renamed');
              setContextMenu(null);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 flex items-center gap-2"
          >
            ✏️ Rename
          </button>
          <button
            onClick={() => {
              onFileDelete?.(contextMenu.file.path);
              setContextMenu(null);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 flex items-center gap-2 text-red-400"
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}
