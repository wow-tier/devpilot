'use client';

import React, { useState, useEffect } from 'react';

interface FileInfo {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
}

interface FileExplorerProps {
  onFileSelect?: (filePath: string) => void;
  selectedFile?: string;
}

export default function FileExplorer({ onFileSelect, selectedFile }: FileExplorerProps) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [currentPath, setCurrentPath] = useState('.');
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['.']));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadFiles(currentPath);
  }, [currentPath]);

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
      setCurrentPath(file.path);
    } else {
      onFileSelect?.(file.path);
    }
  };

  const getFileIcon = (file: FileInfo) => {
    if (file.type === 'directory') {
      return expandedDirs.has(file.path) ? '📂' : '📁';
    }
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    const iconMap: Record<string, string> = {
      'ts': '📘',
      'tsx': '⚛️',
      'js': '📙',
      'jsx': '⚛️',
      'json': '📋',
      'md': '📝',
      'css': '🎨',
      'html': '🌐',
      'py': '🐍',
    };
    
    return iconMap[ext || ''] || '📄';
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Files</h2>
        <p className="text-xs text-gray-400 mt-1 truncate">{currentPath}</p>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : files.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No files found</div>
        ) : (
          <div className="divide-y divide-gray-800">
            {files.map((file) => (
              <button
                key={file.path}
                onClick={() => handleFileClick(file)}
                className={`w-full text-left p-3 hover:bg-gray-800 transition-colors ${
                  selectedFile === file.path ? 'bg-gray-800 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getFileIcon(file)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    {file.size !== undefined && (
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
