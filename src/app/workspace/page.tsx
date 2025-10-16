'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Code2, GitBranch, Save, FileText, CheckCircle, Settings as SettingsIcon, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import AIChat from '../components/AIChat';
import WelcomeScreen from '../components/WelcomeScreen';
import StatusBar from '../components/StatusBar';
import KeyboardShortcuts from '../components/KeyboardShortcuts';
import ErrorBoundary from '../components/ErrorBoundary';
import TabBar, { Tab } from '../components/TabBar';
import CommandPalette from '../components/CommandPalette';
import Terminal from '../components/Terminal';
import SettingsPanel from '../components/SettingsPanel';
import type { Settings as SettingsType } from '../components/SettingsPanel';
import Breadcrumbs from '../components/Breadcrumbs';
import DiffPreview from '../components/DiffPreview';

const CodeEditor = dynamic(() => import('../components/Editor'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-gray-400">Loading editor...</div>,
});

interface Modification {
  filePath: string;
  originalContent: string;
  modifiedContent: string;
  explanation: string;
}

interface Repository {
  id: string;
  name: string;
  url: string;
  defaultBranch: string;
  description?: string;
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
  const [currentRepo, setCurrentRepo] = useState<Repository | null>(null);
  const [repoPath, setRepoPath] = useState<string>('');
  const [isCloning, setIsCloning] = useState(false);
  const [cloneError, setCloneError] = useState('');
  const [settings, setSettings] = useState<SettingsType>({
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
    // Load repository info from URL params and localStorage
    const params = new URLSearchParams(window.location.search);
    const repoId = params.get('repo');
    
    if (repoId) {
      const repoData = localStorage.getItem('currentRepo');
      if (repoData) {
        const repo: Repository = JSON.parse(repoData);
        setCurrentRepo(repo);
        setGitBranch(repo.defaultBranch || 'main');
        
        // Clone/pull repository
        cloneRepository(repo.id);
      }
    } else {
      // No repository selected, show welcome
      setShowWelcome(true);
    }
  }, []);

  const cloneRepository = async (repositoryId: string) => {
    setIsCloning(true);
    setCloneError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setCloneError('Please login to clone repositories');
        setIsCloning(false);
        return;
      }

      const response = await fetch('/api/repositories/clone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ repositoryId }),
      });

      const data = await response.json();

      if (response.ok) {
        setRepoPath(data.path);
        setShowWelcome(false);
        loadGitStatus(data.path);
      } else {
        setCloneError(data.error || 'Failed to clone repository');
      }
    } catch (error) {
      console.error('Error cloning repository:', error);
      setCloneError('Failed to clone repository. Please try again.');
    } finally {
      setIsCloning(false);
    }
  };

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

  const loadGitStatus = async (path?: string) => {
    try {
      const targetPath = path || repoPath;
      const response = await fetch(`/api/git?action=status&repoPath=${encodeURIComponent(targetPath)}`);
      const data = await response.json();
      
      if (data.success) {
        setGitBranch(data.status.current || 'main');
      }
    } catch (error) {
      console.error('Error loading git status:', error);
    }
  };

  const handleFileSelect = async (filePath: string) => {
    try {
      const response = await fetch(`/api/files/${encodeURIComponent(filePath)}?repoPath=${encodeURIComponent(repoPath)}`);
      const data = await response.json();

      if (data.success) {
        const newTab: Tab = {
          id: filePath,
          label: filePath.split('/').pop() || filePath,
          path: filePath,
        };

        if (!tabs.find(t => t.id === filePath)) {
          setTabs([...tabs, newTab]);
        }

        setFileContents(prev => ({
          ...prev,
          [filePath]: data.content,
        }));

        setActiveTabId(filePath);
        setShowWelcome(false);
      }
    } catch (error) {
      console.error('Error loading file:', error);
    }
  };

  const handleSaveFile = async () => {
    if (!activeTab) return;

    try {
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: activeTab.path,
          content: activeContent,
          repoPath,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('File saved successfully');
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const handlePromptSubmit = async (prompt: string) => {
    try {
      const response = await fetch('/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, repoPath }),
      });

      const data = await response.json();

      if (data.success) {
        setModifications(data.modifications || []);
        setShowDiff(true);
      }
    } catch (error) {
      console.error('Error processing prompt:', error);
    }
  };

  const handleApplyModifications = async () => {
    for (const mod of modifications) {
      await fetch('/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath: mod.filePath,
          content: mod.modifiedContent,
          repoPath,
        }),
      });

      setFileContents(prev => ({
        ...prev,
        [mod.filePath]: mod.modifiedContent,
      }));
    }

    setModifications([]);
    setShowDiff(false);
  };

  const handleTabClose = (tabId: string) => {
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[newTabs.length - 1]?.id || '');
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    if (activeTab && value !== undefined) {
      setFileContents(prev => ({
        ...prev,
        [activeTab.path]: value,
      }));
    }
  };

  if (isCloning) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Cloning Repository...
          </h2>
          <p className="text-slate-400">
            {currentRepo?.name} from {currentRepo?.url}
          </p>
        </div>
      </div>
    );
  }

  if (cloneError) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Failed to Clone Repository
          </h2>
          <p className="text-red-400 mb-4">{cloneError}</p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen bg-slate-950">
        <KeyboardShortcuts
          onSave={handleSaveFile}
          onToggleDiff={() => setShowDiff(!showDiff)}
          onFocusChat={() => {}}
        />

        {showCommandPalette && (
          <CommandPalette
            onClose={() => setShowCommandPalette(false)}
          />
        )}

        {showSettings && (
          <SettingsPanel
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            settings={settings}
            onSettingsChange={setSettings}
          />
        )}

        {/* Top Header */}
        <header className="bg-slate-900 border-b border-slate-800 px-4 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-sm font-semibold text-white">
                  {currentRepo?.name || 'AI Code Agent'}
                </h1>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <GitBranch className="w-3.5 h-3.5" />
                <span>{gitBranch}</span>
              </div>
              {currentRepo && (
                <div className="text-xs text-slate-500 truncate max-w-md">
                  {currentRepo.url}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCommandPalette(true)}
                className="px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 flex items-center gap-2 transition-all border border-slate-700"
              >
                <span className="font-mono text-slate-400">⌘K</span>
                <span>Commands</span>
              </button>
              
              {activeTab && (
                <button
                  onClick={handleSaveFile}
                  className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save
                </button>
              )}

              {modifications.length > 0 && (
                <>
                  <button
                    onClick={() => setShowDiff(!showDiff)}
                    className="px-3 py-1.5 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {showDiff ? 'Hide' : 'Show'} Diff
                  </button>
                  <button
                    onClick={handleApplyModifications}
                    className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Apply
                  </button>
                </>
              )}

              <button
                onClick={() => setShowSettings(true)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <SettingsIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-slate-800">
            <Sidebar
              onFileSelect={handleFileSelect}
              selectedFile={activeTab?.path}
              onFileCreate={() => {}}
              onFileDelete={() => {}}
              onFileRename={() => {}}
            />
          </div>

          {/* Editor Area */}
          <div className="flex-1 flex flex-col">
            {tabs.length > 0 && (
              <TabBar
                tabs={tabs}
                activeTab={activeTabId}
                onTabClick={setActiveTabId}
                onTabClose={handleTabClose}
              />
            )}

            {activeTab && (
              <Breadcrumbs path={activeTab.path} />
            )}

            <div className="flex-1 overflow-hidden">
              {showWelcome ? (
                <WelcomeScreen onGetStarted={() => setShowWelcome(false)} />
              ) : activeTab ? (
                <CodeEditor
                  value={activeContent}
                  onChange={handleCodeChange}
                  language={activeTab.language}
                  theme={settings.theme}
                  fontSize={settings.fontSize}
                  minimap={settings.minimap}
                  lineNumbers={settings.lineNumbers}
                  wordWrap={settings.wordWrap}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  Select a file to start editing
                </div>
              )}
            </div>

            {showDiff && modifications.length > 0 && (
              <div className="border-t border-slate-800 p-4 max-h-96 overflow-auto">
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

            {showTerminal && (
              <div className="border-t border-slate-800 h-64">
                <Terminal />
              </div>
            )}
          </div>

          {/* AI Chat */}
          <div className="w-80 border-l border-slate-800">
            <AIChat onPromptSubmit={handlePromptSubmit} />
          </div>
        </div>

        {/* Status Bar */}
        <StatusBar
          currentFile={activeTab?.path}
          gitBranch={gitBranch}
        />
      </div>
    </ErrorBoundary>
  );
}
    gitBranch={gitBranch}
        />
      </div>
    </ErrorBoundary>
  );
}
