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
  repositoryId: string;
  repoPath?: string;
}

export default function ImprovedFileExplorer({
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  selectedFile,
  repositoryId
}: ImprovedFileExplorerProps) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set(['.']));
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadFiles = useCallback(async (path: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      queryParams.append('directory', path);
      queryParams.append('repositoryId', repositoryId);
      
      const response = await fetch(`/api/files?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        setFiles(data.files);
      } else if (data.error) {
        console.error('Error loading files:', data.error);
        setFiles([]);
      }
    } catch (error) {
      console.error('Error loading files:', error);
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  }, [repositoryId]);

  useEffect(() => {
    loadFiles('.');
  }, [loadFiles]);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

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
    <div className="flex flex-col h-full bg-github-bg-secondary/30 text-github-text">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-github-border/50 bg-github-bg-secondary/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-github-accent rounded-full"></div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-github-text">Explorer</h2>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onFileCreate?.('new-file.ts', 'file')}
            className="p-2 hover:bg-github-bg-tertiary rounded-lg transition-all duration-150 group"
            title="New File"
          >
            <FilePlus className="w-4 h-4 text-github-text-muted group-hover:text-github-accent" />
          </button>
          <button
            onClick={() => onFileCreate?.('new-folder', 'directory')}
            className="p-2 hover:bg-github-bg-tertiary rounded-lg transition-all duration-150 group"
            title="New Folder"
          >
            <FolderPlus className="w-4 h-4 text-github-text-muted group-hover:text-github-success" />
          </button>
          <button
            onClick={() => loadFiles('.')}
            className="p-2 hover:bg-github-bg-tertiary rounded-lg transition-all duration-150 group"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-github-text-muted group-hover:text-purple-400" />
          </button>
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-6 text-center text-github-text-muted text-sm">
            <div className="animate-spin w-5 h-5 border-2 border-github-accent border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-github-text-secondary">Loading files...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="p-6 text-center text-github-text-muted text-sm">
            <div className="text-3xl mb-3 opacity-60">📁</div>
            <p className="text-github-text-secondary">No files found</p>
          </div>
        ) : (
          <div className="py-1">
            {files.map((file) => (
              <div
                key={file.path}
                onClick={() => handleFileClick(file)}
                onContextMenu={(e) => handleContextMenu(e, file)}
                className={`
                  flex items-center gap-3 px-4 py-2.5 cursor-pointer group relative
                  hover:bg-github-bg-tertiary/40 transition-all duration-200 text-sm
                  ${selectedFile === file.path ? 'bg-github-bg-tertiary/60 border-l-2 border-github-accent shadow-sm' : ''}
                  ${file.type === 'directory' ? 'hover:bg-github-bg-tertiary/30' : 'hover:bg-github-bg-tertiary/40'}
                `}
              >
                {getChevron(file)}
                <div className="flex-shrink-0">
                  {getFileIcon(file)}
                </div>
                <span className={`flex-1 truncate transition-colors ${
                  selectedFile === file.path 
                    ? 'text-github-text font-semibold' 
                    : file.type === 'directory' 
                      ? 'text-github-text-secondary group-hover:text-github-text' 
                      : 'text-github-text-secondary group-hover:text-github-text'
                }`}>
                  {file.name}
                </span>
                {file.type === 'directory' && (
                  <div className="text-xs text-github-text-muted group-hover:text-github-text-secondary transition-colors">
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
