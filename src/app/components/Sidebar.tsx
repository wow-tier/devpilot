'use client';

import React from 'react';
import ImprovedFileExplorer from './ImprovedFileExplorer';

interface SidebarProps {
  onFileSelect?: (filePath: string) => void;
  selectedFile?: string;
  onFileCreate?: (path: string, type: 'file' | 'directory') => void;
  onFileDelete?: (path: string) => void;
  onFileRename?: (oldPath: string, newPath: string) => void;
  onSearchResult?: (file: string, line: number) => void;
  repositoryId: string;
}

export default function Sidebar({
  onFileSelect,
  selectedFile,
  onFileCreate,
  onFileDelete,
  onFileRename,
  repositoryId
}: SidebarProps) {
  return (
    <div className="h-full">
      <ImprovedFileExplorer 
        onFileSelect={onFileSelect}
        selectedFile={selectedFile}
        onFileCreate={onFileCreate}
        onFileDelete={onFileDelete}
        onFileRename={onFileRename}
        repositoryId={repositoryId}
      />
    </div>
  );
}
