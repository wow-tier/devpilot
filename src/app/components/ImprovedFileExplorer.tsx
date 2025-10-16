'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Folder, FolderOpen, FileText, FileCode, FilePlus, 
  FolderPlus, RefreshCw, Edit2, Trash2, ChevronRight, ChevronDown 
} from 'lucide-react';

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
  repoPath?: string;
}

export default function ImprovedFileExplorer({
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  selectedFile,
  repoPath
}: ImprovedFileExplorerProps) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['.']));
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadFiles('.');
  }, [loadFiles]);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const loadFiles = useCallback(async (path: string) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('directory', path);
      
      if (repoPath) {
        queryParams.append('repoPath', repoPath);
        console.log('📁 ImprovedFileExplorer using repoPath:', repoPath);
      } else {
        console.warn('⚠️ ImprovedFileExplorer: No repoPath provided, will show workspace files');
      }
      
      const response = await fetch(`/api/files?${queryParams.toString()}`);
      const data = await response.json();
      if (data.success) {
        setFiles(data.files);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setIsLoading(false);
    }
  }, [repoPath]);

  const handleFileClick = (file: FileInfo) => {
    if (file.type === 'directory') {
      const isExpanded = expandedDirs.has(file.path);
      const newExpandedDirs = new Set(expandedDirs);
      if (isExpanded) {
        newExpandedDirs.delete(file.path);
      } else {
        newExpandedDirs.add(file.path);
        // Load files for the expanded directory
        loadFiles(file.path);
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
      return expandedDirs.has(file.path) 
        ? <FolderOpen className="w-4 h-4 text-blue-400" />
        : <Folder className="w-4 h-4 text-slate-400" />;
    }
    
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'ts' || ext === 'tsx' || ext === 'js' || ext === 'jsx') {
      return <FileCode className="w-4 h-4 text-blue-400" />;
    }
    return <FileText className="w-4 h-4 text-slate-400" />;
  };

  const getChevron = (file: FileInfo) => {
    if (file.type !== 'directory') return null;
    return expandedDirs.has(file.path)
      ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
      : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-300">Explorer</h2>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onFileCreate?.('new-file.ts', 'file')}
            className="p-2 hover:bg-slate-800/50 rounded-lg transition-all duration-150 group"
            title="New File"
          >
            <FilePlus className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
          </button>
          <button
            onClick={() => onFileCreate?.('new-folder', 'directory')}
            className="p-2 hover:bg-slate-800/50 rounded-lg transition-all duration-150 group"
            title="New Folder"
          >
            <FolderPlus className="w-4 h-4 text-slate-400 group-hover:text-green-400" />
          </button>
          <button
            onClick={() => loadFiles('.')}
            className="p-2 hover:bg-slate-800/50 rounded-lg transition-all duration-150 group"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-slate-400 group-hover:text-purple-400" />
          </button>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-slate-500 text-sm">
            <div className="animate-spin w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            Loading...
          </div>
        ) : files.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-sm">
            <div className="text-2xl mb-2">📁</div>
            No files found
          </div>
        ) : (
          <div className="py-1">
            {files.map((file) => (
              <div
                key={file.path}
                onClick={() => handleFileClick(file)}
                onContextMenu={(e) => handleContextMenu(e, file)}
                className={`
                  flex items-center gap-3 px-4 py-2 cursor-pointer group relative
                  hover:bg-slate-800/40 transition-all duration-200 text-sm
                  ${selectedFile === file.path ? 'bg-slate-800/60 border-l-2 border-blue-500 shadow-sm' : ''}
                  ${file.type === 'directory' ? 'hover:bg-slate-700/20' : 'hover:bg-slate-800/30'}
                `}
              >
                {getChevron(file)}
                <div className="flex-shrink-0">
                  {getFileIcon(file)}
                </div>
                <span className={`flex-1 truncate transition-colors ${
                  selectedFile === file.path 
                    ? 'text-white font-medium' 
                    : file.type === 'directory' 
                      ? 'text-slate-200 group-hover:text-white' 
                      : 'text-slate-300 group-hover:text-slate-100'
                }`}>
                  {file.name}
                </span>
                {file.type === 'directory' && (
                  <div className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                    {expandedDirs.has(file.path) ? '📂' : '📁'}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-slate-800 border border-slate-700 rounded-lg shadow-2xl py-1 z-50 min-w-[180px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={() => {
              onFileRename?.(contextMenu.file.path, contextMenu.file.path + '_renamed');
              setContextMenu(null);
            }}
            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Rename
          </button>
          <button
            onClick={() => {
              onFileDelete?.(contextMenu.file.path);
              setContextMenu(null);
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
