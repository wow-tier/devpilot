'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from './components/Sidebar';
import AIChat from './components/AIChat';
import WelcomeScreen from './components/WelcomeScreen';
import StatusBar from './components/StatusBar';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import ErrorBoundary from './components/ErrorBoundary';
import TabBar, { Tab } from './components/TabBar';
import CommandPalette from './components/CommandPalette';
import Terminal from './components/Terminal';
import SettingsPanel, { Settings } from './components/SettingsPanel';
import Breadcrumbs from './components/Breadcrumbs';
import DiffPreview from './components/DiffPreview';

const CodeEditor = dynamic(() => import('./components/Editor'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-gray-400">Loading editor...</div>,
});

interface Modification {
  filePath: string;
  originalContent: string;
  modifiedContent: string;
  explanation: string;
}

export default function IDEWorkspace() {
  // State management
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [modifications, setModifications] = useState<Modification[]>([]);
  const [showDiff, setShowDiff] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [gitBranch, setGitBranch] = useState<string>('main');
  const [settings, setSettings] = useState<Settings>({
    theme: 'dark',
    fontSize: 14,
    aiModel: 'gpt-4',
    autoSave: true,
    formatOnSave: false,
    minimap: true,
    lineNumbers: true,
    wordWrap: false,
  });

  const activeTab = tabs.find(t => t.id === activeTabId);
  const activeContent = activeTab ? fileContents[activeTab.path] || '' : '';

  useEffect(() => {
    loadGitStatus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setShowSettings(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '`') {
        e.preventDefault();
        setShowTerminal(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadGitStatus = async () => {
    try {
      const response = await fetch('/api/git?action=status');
      const data = await response.json();
      if (data.success) {
        setGitBranch(data.status.branch);
      }
    } catch (error) {
      console.error('Error loading git status:', error);
    }
  };

  const openFile = async (filePath: string) => {
    // Check if file is already open
    const existingTab = tabs.find(t => t.path === filePath);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      return;
    }

    // Load file content
    try {
      const response = await fetch(`/api/files/${encodeURIComponent(filePath)}`);
      const data = await response.json();
      
      if (data.success) {
        const newTab: Tab = {
          id: Date.now().toString(),
          label: filePath.split('/').pop() || filePath,
          path: filePath,
          language: data.language,
          isDirty: false,
        };

        setTabs(prev => [...prev, newTab]);
        setFileContents(prev => ({ ...prev, [filePath]: data.content }));
        setActiveTabId(newTab.id);
        setShowWelcome(false);
      }
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  const closeTab = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;

    setTabs(prev => prev.filter(t => t.id !== tabId));
    
    if (activeTabId === tabId) {
      const remainingTabs = tabs.filter(t => t.id !== tabId);
      if (remainingTabs.length > 0) {
        setActiveTabId(remainingTabs[remainingTabs.length - 1].id);
      } else {
        setActiveTabId('');
        setShowWelcome(true);
      }
    }
  };

  const handleFileChange = (newContent: string) => {
    if (!activeTab) return;
    
    setFileContents(prev => ({ ...prev, [activeTab.path]: newContent }));
    setTabs(prev => prev.map(t => 
      t.id === activeTabId ? { ...t, isDirty: true } : t
    ));
  };

  const handleSaveFile = async () => {
    if (!activeTab) return;

    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: activeTab.path,
          content: fileContents[activeTab.path],
        }),
      });

      if (response.ok) {
        setTabs(prev => prev.map(t => 
          t.id === activeTabId ? { ...t, isDirty: false } : t
        ));
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const handlePromptSubmit = async (prompt: string) => {
    try {
      const filePaths = activeTab ? [activeTab.path] : [];

      const response = await fetch('/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, filePaths }),
      });

      const data = await response.json();

      if (data.success && data.modifications.length > 0) {
        setModifications(data.modifications);
        setShowDiff(true);

        if (activeTab && data.modifications[0].filePath === activeTab.path) {
          handleFileChange(data.modifications[0].modifiedContent);
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
          message: 'AI: Applied modifications based on user request',
          modifications,
        }),
      });

      if (response.ok) {
        setModifications([]);
        setShowDiff(false);
        
        // Reload active file
        if (activeTab) {
          const res = await fetch(`/api/files/${encodeURIComponent(activeTab.path)}`);
          const data = await res.json();
          if (data.success) {
            setFileContents(prev => ({ ...prev, [activeTab.path]: data.content }));
          }
        }
      }
    } catch (error) {
      console.error('Error applying modifications:', error);
    }
  };

  const commands = [
    { id: 'save', label: 'Save File', action: handleSaveFile, shortcut: 'Cmd+S', icon: '💾' },
    { id: 'settings', label: 'Open Settings', action: () => setShowSettings(true), shortcut: 'Cmd+,', icon: '⚙️' },
    { id: 'terminal', label: 'Toggle Terminal', action: () => setShowTerminal(prev => !prev), shortcut: 'Cmd+`', icon: '🖥️' },
    { id: 'diff', label: 'Toggle Diff', action: () => setShowDiff(prev => !prev), shortcut: 'Cmd+D', icon: '🔍' },
  ];

  return (
    <ErrorBoundary>
      <KeyboardShortcuts
        onSave={handleSaveFile}
        onToggleDiff={() => setShowDiff(!showDiff)}
        onFocusChat={() => (document.querySelector('input[type="text"]') as HTMLInputElement)?.focus()}
      />

      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        commands={commands}
      />

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />

      <div className="flex flex-col h-screen bg-gray-950">
        {/* Top Header */}
        <header className="bg-gray-900 border-b border-gray-800 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-bold text-white">🤖 AI Code Agent</h1>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>🌿 {gitBranch}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCommandPalette(true)}
                className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded hover:bg-gray-700 flex items-center gap-2"
              >
                <span>⌘K</span> Command Palette
              </button>
              
              {activeTab && (
                <button
                  onClick={handleSaveFile}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  💾 Save
                </button>
              )}

              {modifications.length > 0 && (
                <>
                  <button
                    onClick={() => setShowDiff(!showDiff)}
                    className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                  >
                    {showDiff ? 'Hide Diff' : 'Show Diff'}
                  </button>
                  <button
                    onClick={handleApplyModifications}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    ✅ Apply
                  </button>
                </>
              )}

              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-400 hover:text-white"
              >
                ⚙️
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-64 border-r border-gray-800">
            <Sidebar
              onFileSelect={openFile}
              selectedFile={activeTab?.path}
            />
          </div>

          {/* Center - Editor */}
          <div className="flex-1 flex flex-col">
            {tabs.length > 0 && (
              <TabBar
                tabs={tabs}
                activeTab={activeTabId}
                onTabClick={setActiveTabId}
                onTabClose={closeTab}
              />
            )}

            {activeTab && <Breadcrumbs path={activeTab.path} />}

            <div className="flex-1 relative">
              {showWelcome && tabs.length === 0 ? (
                <WelcomeScreen onGetStarted={() => setShowWelcome(false)} />
              ) : activeTab ? (
                <CodeEditor
                  value={activeContent}
                  onChange={handleFileChange}
                  language={activeTab.language}
                  height="100%"
                  theme={settings.theme === 'light' ? 'vs-light' : 'vs-dark'}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>Select a file to start editing</p>
                </div>
              )}

              {showDiff && modifications.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1/2 border-t border-gray-700 bg-gray-900 overflow-y-auto">
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

            {showTerminal && (
              <div className="h-64 border-t border-gray-800">
                <Terminal />
              </div>
            )}
          </div>

          {/* Right Sidebar - AI Chat */}
          <div className="w-96 border-l border-gray-800">
            <AIChat onPromptSubmit={handlePromptSubmit} />
          </div>
        </div>

        {/* Status Bar */}
        <StatusBar currentFile={activeTab?.path} gitBranch={gitBranch} />
      </div>
    </ErrorBoundary>
  );
}
