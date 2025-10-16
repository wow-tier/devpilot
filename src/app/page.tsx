'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import FileExplorer from './components/FileExplorer';
import AIChat from './components/AIChat';
import GitPanel from './components/GitPanel';
import DiffPreview from './components/DiffPreview';

// Dynamically import Monaco Editor to avoid SSR issues
const CodeEditor = dynamic(() => import('./components/Editor'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading editor...</div>,
});

interface Modification {
  filePath: string;
  originalContent: string;
  modifiedContent: string;
  explanation: string;
}

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [fileLanguage, setFileLanguage] = useState<string>('typescript');
  const [modifications, setModifications] = useState<Modification[]>([]);
  const [showDiff, setShowDiff] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  // Load file content when a file is selected
  useEffect(() => {
    if (selectedFile) {
      loadFile(selectedFile);
    }
  }, [selectedFile]);

  const loadFile = async (filePath: string) => {
    setIsLoadingFile(true);
    try {
      const response = await fetch(`/api/files/${encodeURIComponent(filePath)}`);
      const data = await response.json();
      
      if (data.success) {
        setFileContent(data.content);
        setFileLanguage(data.language || 'plaintext');
      }
    } catch (error) {
      console.error('Error loading file:', error);
    } finally {
      setIsLoadingFile(false);
    }
  };

  const handleFileChange = (newContent: string) => {
    setFileContent(newContent);
  };

  const handleSaveFile = async () => {
    if (!selectedFile) return;

    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: selectedFile,
          content: fileContent,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('File saved successfully!');
      }
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file');
    }
  };

  const handlePromptSubmit = async (prompt: string) => {
    try {
      // Get all relevant files for context
      const filePaths = selectedFile ? [selectedFile] : [];

      const response = await fetch('/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          filePaths,
        }),
      });

      const data = await response.json();

      if (data.success && data.modifications.length > 0) {
        setModifications(data.modifications);
        setShowDiff(true);

        // Optionally apply the first modification
        if (data.modifications[0].filePath === selectedFile) {
          setFileContent(data.modifications[0].modifiedContent);
        }
      }
    } catch (error) {
      console.error('Error processing prompt:', error);
    }
  };

  const handleApplyModifications = async () => {
    if (modifications.length === 0) return;

    try {
      const response = await fetch('/api/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `AI: Applied modifications based on user request`,
          modifications,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Modifications applied and committed!');
        setModifications([]);
        setShowDiff(false);
        
        // Reload the current file
        if (selectedFile) {
          loadFile(selectedFile);
        }
      }
    } catch (error) {
      console.error('Error applying modifications:', error);
      alert('Failed to apply modifications');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white">🤖 AI Code Agent</h1>
            {selectedFile && (
              <span className="text-sm text-gray-400">
                {selectedFile}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {selectedFile && (
              <button
                onClick={handleSaveFile}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
              >
                💾 Save
              </button>
            )}
            
            {modifications.length > 0 && (
              <>
                <button
                  onClick={() => setShowDiff(!showDiff)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm"
                >
                  {showDiff ? '📝 Hide Diff' : '🔍 Show Diff'}
                </button>
                <button
                  onClick={handleApplyModifications}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                >
                  ✅ Apply & Commit
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - File Explorer */}
        <div className="w-64 border-r border-gray-800">
          <FileExplorer
            onFileSelect={setSelectedFile}
            selectedFile={selectedFile}
          />
        </div>

        {/* Center - Code Editor */}
        <div className="flex-1 flex flex-col">
          {selectedFile ? (
            <>
              {isLoadingFile ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Loading...
                </div>
              ) : (
                <CodeEditor
                  value={fileContent}
                  onChange={handleFileChange}
                  language={fileLanguage}
                  height="100%"
                />
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p className="text-xl mb-2">👈 Select a file to start editing</p>
              <p className="text-sm">or use the AI chat to create new files</p>
            </div>
          )}

          {/* Diff Preview Overlay */}
          {showDiff && modifications.length > 0 && (
            <div className="absolute bottom-0 left-64 right-96 h-1/2 border-t border-gray-700 bg-gray-900 overflow-y-auto">
              {modifications.map((mod, index) => (
                <DiffPreview
                  key={index}
                  original={mod.originalContent}
                  modified={mod.modifiedContent}
                  fileName={mod.filePath}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar - AI Chat & Git */}
        <div className="w-96 border-l border-gray-800 flex flex-col">
          <div className="flex-1 border-b border-gray-800">
            <AIChat onPromptSubmit={handlePromptSubmit} />
          </div>
          <div className="h-80">
            <GitPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
