'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { 
  Code2, GitBranch, Save, FileText, CheckCircle, Settings as SettingsIcon, 
  Loader2, Files, Search, GitPullRequest, Terminal as TerminalIcon,
  MessageSquare, PanelLeftClose, FolderGit2, ArrowLeft
} from 'lucide-react';
import { GlassPanel, AccentButton } from '../components/ui';
import Sidebar from '../components/Sidebar';
import AIChat from '../components/AIChat';
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
import Link from 'next/link';

const CodeEditor = dynamic(() => import('../components/Editor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-accent-blue" />
        <p className="text-sm text-cursor-text-secondary">Loading editor...</p>
      </div>
    </div>
  ),
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

type ActivityTab = 'files' | 'search' | 'git' | 'ai';

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
  const [showSidebar, setShowSidebar] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [activeActivity, setActiveActivity] = useState<ActivityTab>('files');
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
  
  const [availableProviders, setAvailableProviders] = useState<Array<{id: string; name: string; available: boolean}>>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('openai');

  const activeTab = tabs.find(t => t.id === activeTabId);
  const activeContent = activeTab ? fileContents[activeTab.path] || '' : '';
  const [, setFiles] = useState<{ name: string; isDirectory: boolean }[]>([]);

  // Wrap loadFiles in useCallback
  const loadFiles = useCallback(async (directory = '.') => {
    if (!currentRepo) return;

    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      queryParams.append('repositoryId', currentRepo.id);
      queryParams.append('directory', directory);
      
      const url = `/api/files?${queryParams.toString()}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setFiles(data.files || []);
        setShowWelcome(false);
      } else if (response.status === 404) {
        // Repository directory not found
        console.error('Repository directory not found:', data.error);
        setShowWelcome(true);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    }
  }, [currentRepo]);

  // Wrap loadGitStatus in useCallback
  const loadGitStatus = useCallback(async (path: string) => {
    try {
      const queryParams = new URLSearchParams();
      if (path) queryParams.append('repoPath', path);
      
      const response = await fetch(`/api/git?${queryParams.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        setGitBranch(data.currentBranch);
      }
    } catch (error) {
      console.error('Error loading Git status:', error);
    }
  }, []);


  // Load available AI providers
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/ai/providers', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setAvailableProviders(data.providers);
          if (data.defaultProvider) {
            setSelectedProvider(data.defaultProvider);
          }
        }
      } catch (error) {
        console.error('Error loading providers:', error);
      }
    };

    loadProviders();
  }, []);

  // Initial repository fetch with security enforcement
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const repoId = params.get('repo');
    
    // SECURITY: Force repository selection - no access without valid repo
    if (!repoId) {
      setShowWelcome(true);
      setCloneError('Please select a repository from your dashboard');
      return;
    }

    const fetchRepository = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setShowWelcome(true);
          setCloneError('Please login to access workspace');
          return;
        }

        const response = await fetch(`/api/repositories/${repoId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const repo = data.repository;
          setCurrentRepo(repo);
          setGitBranch(repo.defaultBranch || 'main');
          setShowWelcome(false);
          loadFiles('.');
        } else {
          setShowWelcome(true);
          setCloneError('Repository not found or access denied');
        }
      } catch (error) {
        console.error('Error fetching repository:', error);
        setShowWelcome(true);
        setCloneError('Failed to load repository');
      }
    };

    fetchRepository();
  }, [loadFiles]);

  // Wrap handleSaveFile in useCallback
  const handleSaveFile = useCallback(async () => {
    if (!activeTab || !currentRepo) return;

    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      queryParams.append('repositoryId', currentRepo.id);

      await fetch(`/api/files/${encodeURIComponent(activeTab.path)}?${queryParams.toString()}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: fileContents[activeTab.path] }),
      });

      setTabs(prevTabs => prevTabs.map(tab =>
        tab.id === activeTabId ? { ...tab, isDirty: false } : tab
      ));
    } catch (error) {
      console.error('Error saving file:', error);
    }
  }, [activeTab, activeTabId, fileContents, currentRepo]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (activeTab) {
          handleSaveFile();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '`') {
        e.preventDefault();
        setShowTerminal(!showTerminal);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setShowSidebar(!showSidebar);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, showTerminal, showSidebar, handleSaveFile]);

  const handleFileSelect = async (filePath: string) => {
    if (!currentRepo) {
      console.error('No repository selected');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      queryParams.append('repositoryId', currentRepo.id);

      const response = await fetch(`/api/files/${encodeURIComponent(filePath)}?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setFileContents(prev => ({
          ...prev,
          [filePath]: data.content
        }));

        const existingTab = tabs.find(t => t.path === filePath);
        if (!existingTab) {
          const newTab: Tab = {
            id: `tab-${Date.now()}`,
            label: filePath.split('/').pop() || filePath,
            path: filePath,
            language: data.language || 'plaintext',
            isDirty: false,
          };
          setTabs(prev => [...prev, newTab]);
          setActiveTabId(newTab.id);
        } else {
          setActiveTabId(existingTab.id);
        }
      }
    } catch (error) {
      console.error('Error loading file:', error);
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    if (activeTab && value !== undefined) {
      setFileContents(prev => ({
        ...prev,
        [activeTab.path]: value
      }));

      setTabs(prevTabs => prevTabs.map(tab =>
        tab.id === activeTabId ? { ...tab, isDirty: true } : tab
      ));

      if (settings.autoSave) {
        const timeoutId = setTimeout(() => {
          handleSaveFile();
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    }
  };

  const handleTabClose = (tabId: string) => {
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    setTabs(prevTabs => prevTabs.filter(t => t.id !== tabId));
    
    if (activeTabId === tabId && tabs.length > 1) {
      const newActiveIndex = tabIndex > 0 ? tabIndex - 1 : 0;
      setActiveTabId(tabs[newActiveIndex].id);
    } else if (tabs.length === 1) {
      setActiveTabId('');
    }
  };

  const handlePromptSubmit = async (prompt: string) => {
    if (!currentRepo || !repoPath) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt,
          repoPath,
          currentFile: activeTab?.path,
          provider: selectedProvider,
        }),
      });

      const data = await response.json();

      if (response.ok && data.modifications) {
        setModifications(data.modifications);
        setShowDiff(true);
      }
    } catch (error) {
      console.error('Error processing prompt:', error);
    }
  };

  const handleApplyModifications = async () => {
    for (const mod of modifications) {
      try {
        const queryParams = new URLSearchParams();
        if (repoPath) queryParams.append('repoPath', repoPath);

        await fetch(`/api/files/${encodeURIComponent(mod.filePath)}?${queryParams.toString()}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: mod.modifiedContent }),
        });

        setFileContents(prev => ({
          ...prev,
          [mod.filePath]: mod.modifiedContent
        }));

        const tab = tabs.find(t => t.path === mod.filePath);
        if (tab) {
          setTabs(prevTabs => prevTabs.map(t =>
            t.id === tab.id ? { ...t, isDirty: false } : t
          ));
        }
      } catch (error) {
        console.error('Error applying modification:', error);
      }
    }

    setModifications([]);
    setShowDiff(false);
  };

  return (
    <ErrorBoundary>
      <div className="h-screen w-screen bg-cursor-base text-cursor-text flex flex-col overflow-hidden">
        {/* Command Palette */}
        {showCommandPalette && (
          <CommandPalette
            isOpen={showCommandPalette}
            onClose={() => setShowCommandPalette(false)}
            commands={[
              {
                id: 'toggle-terminal',
                label: 'Toggle Terminal',
                action: () => { setShowTerminal(!showTerminal); setShowCommandPalette(false); },
                shortcut: '⌘`',
              },
              {
                id: 'toggle-sidebar',
                label: 'Toggle Sidebar',
                action: () => { setShowSidebar(!showSidebar); setShowCommandPalette(false); },
                shortcut: '⌘B',
              },
            ]}
          />
        )}

        {/* Settings Panel */}
        {showSettings && (
          <SettingsPanel
            isOpen={showSettings}
            settings={settings}
            onSettingsChange={setSettings}
            onClose={() => setShowSettings(false)}
          />
        )}

        <KeyboardShortcuts />

        {/* Loading/Error States */}
        {isCloning && (
          <div className="fixed inset-0 bg-cursor-base/95 backdrop-blur-sm flex items-center justify-center z-50">
            <GlassPanel className="p-8 max-w-md">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-accent-blue" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Cloning Repository</h3>
                  <p className="text-sm text-cursor-text-secondary">
                    {currentRepo?.name || 'Repository'}
                  </p>
                </div>
              </div>
            </GlassPanel>
          </div>
        )}

        {cloneError && (
          <div className="fixed top-4 right-4 z-50">
            <GlassPanel className="p-4 bg-danger/10 border-danger/30">
              <p className="text-sm text-danger">{cloneError}</p>
            </GlassPanel>
          </div>
        )}

        {/* Header */}
        <header className="h-12 border-b border-cursor-border bg-cursor-surface flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" title="Back to Dashboard">
            <Code2 className="w-5 h-5 text-accent-blue cursor-pointer hover:text-accent-purple transition-colors" />
            </Link>
            {currentRepo && (
              <>
                <span className="text-cursor-text-secondary">/</span>
                <div className="flex items-center gap-2 px-2 py-1 bg-cursor-surface-hover rounded-cursor-sm">
                  <FolderGit2 className="w-4 h-4 text-accent-blue" />
                  <span className="text-sm font-medium text-cursor-text">{currentRepo.name}</span>
                </div>
              </>
            )}
            {activeTab && (
              <>
                <span className="text-cursor-text-secondary">/</span>
                <Breadcrumbs path={activeTab.path} />
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeTab?.isDirty && (
              <AccentButton size="sm" onClick={handleSaveFile} icon={<Save className="w-3.5 h-3.5" />}>
                Save
              </AccentButton>
            )}

            {modifications.length > 0 && (
              <>
                <AccentButton 
                  size="sm" 
                  variant="secondary"
                  onClick={() => setShowDiff(!showDiff)} 
                  icon={<FileText className="w-3.5 h-3.5" />}
                >
                  {showDiff ? 'Hide' : 'Show'} Diff
                </AccentButton>
                <AccentButton 
                  size="sm"
                  onClick={handleApplyModifications} 
                  icon={<CheckCircle className="w-3.5 h-3.5" />}
                >
                  Apply
                </AccentButton>
              </>
            )}

            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-cursor-text-muted hover:text-cursor-text hover:bg-cursor-surface-hover rounded-cursor-sm transition-all"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Activity Bar */}
          <div className="w-12 bg-cursor-surface border-r border-cursor-border flex flex-col items-center py-2 gap-1 flex-shrink-0">
            <button
              onClick={() => { setActiveActivity('files'); setShowSidebar(true); }}
              className={`w-10 h-10 rounded-cursor-sm flex items-center justify-center transition-all ${
                activeActivity === 'files' && showSidebar
                  ? 'bg-accent-blue/20 text-accent-blue'
                  : 'text-cursor-text-muted hover:text-cursor-text hover:bg-cursor-surface-hover'
              }`}
              title="Explorer"
            >
              <Files className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => { setActiveActivity('search'); setShowSidebar(true); }}
              className={`w-10 h-10 rounded-cursor-sm flex items-center justify-center transition-all ${
                activeActivity === 'search' && showSidebar
                  ? 'bg-accent-blue/20 text-accent-blue'
                  : 'text-cursor-text-muted hover:text-cursor-text hover:bg-cursor-surface-hover'
              }`}
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => { setActiveActivity('git'); setShowSidebar(true); }}
              className={`w-10 h-10 rounded-cursor-sm flex items-center justify-center transition-all ${
                activeActivity === 'git' && showSidebar
                  ? 'bg-accent-blue/20 text-accent-blue'
                  : 'text-cursor-text-muted hover:text-cursor-text hover:bg-cursor-surface-hover'
              }`}
              title="Source Control"
            >
              <GitPullRequest className="w-5 h-5" />
            </button>

            <div className="flex-1" />

            <button
              onClick={() => setShowTerminal(!showTerminal)}
              className={`w-10 h-10 rounded-cursor-sm flex items-center justify-center transition-all ${
                showTerminal
                  ? 'bg-accent-blue/20 text-accent-blue'
                  : 'text-cursor-text-muted hover:text-cursor-text hover:bg-cursor-surface-hover'
              }`}
              title="Terminal"
            >
              <TerminalIcon className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowRightPanel(!showRightPanel)}
              className={`w-10 h-10 rounded-cursor-sm flex items-center justify-center transition-all ${
                showRightPanel
                  ? 'bg-accent-blue/20 text-accent-blue'
                  : 'text-cursor-text-muted hover:text-cursor-text hover:bg-cursor-surface-hover'
              }`}
              title="AI Assistant"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar */}
          {showSidebar && (
            <div className="w-64 border-r border-cursor-border bg-cursor-surface flex-shrink-0">
              <div className="h-full flex flex-col">
                <div className="h-10 border-b border-cursor-border flex items-center justify-between px-3 bg-cursor-surface-hover">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-cursor-text-secondary">
                    {activeActivity === 'files' && 'Explorer'}
                    {activeActivity === 'search' && 'Search'}
                    {activeActivity === 'git' && 'Source Control'}
                  </h3>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="text-cursor-text-muted hover:text-cursor-text transition-colors"
                    title="Close sidebar"
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-auto">
                  {activeActivity === 'files' && currentRepo && (
                    <Sidebar
                      onFileSelect={handleFileSelect}
                      selectedFile={activeTab?.path}
                      onFileCreate={() => {}}
                      onFileDelete={() => {}}
                      onFileRename={() => {}}
                      repositoryId={currentRepo.id}
                      repoPath={repoPath}
                    />
                  )}
                  {activeActivity === 'search' && (
                    <div className="p-4 text-cursor-text-secondary text-sm">
                      Search functionality coming soon...
                    </div>
                  )}
                  {activeActivity === 'git' && (
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-sm text-cursor-text-secondary">
                        <GitBranch className="w-4 h-4" />
                        <span>{gitBranch}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Editor Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {tabs.length > 0 && (
              <TabBar
                tabs={tabs}
                activeTab={activeTabId}
                onTabClick={setActiveTabId}
                onTabClose={handleTabClose}
              />
            )}

            <div className="flex-1 overflow-hidden">
              {showWelcome || !currentRepo ? (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <div className="w-24 h-24 bg-cursor-surface-hover rounded-cursor-lg flex items-center justify-center mb-6">
                    <FolderGit2 className="w-12 h-12 text-accent-blue opacity-50" />
                  </div>
                  <h2 className="text-2xl font-bold text-cursor-text mb-3">No Repository Selected</h2>
                  <p className="text-cursor-text-secondary text-center max-w-md mb-6">
                    For security reasons, you must select a repository from your dashboard to access the workspace.
                  </p>
                  {cloneError && (
                    <div className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-cursor-sm text-danger text-sm max-w-md">
                      {cloneError}
                    </div>
                  )}
                  <Link href="/dashboard">
                    <AccentButton icon={<ArrowLeft className="w-4 h-4" />}>
                      Go to Dashboard
                    </AccentButton>
                  </Link>
                </div>
              ) : activeTab ? (
                <div className="h-full bg-cursor-base">
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
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-cursor-text-muted p-8">
                  <div className="w-20 h-20 bg-cursor-surface-hover rounded-cursor-lg flex items-center justify-center mb-6">
                    <FileText className="w-10 h-10 text-accent-blue opacity-50" />
                  </div>
                  <h3 className="text-xl font-semibold text-cursor-text mb-3">No file selected</h3>
                  <p className="text-cursor-text-secondary text-center max-w-md mb-6">
                    Choose a file from the explorer to start editing, or use the AI assistant to generate new code
                  </p>
                  <div className="flex gap-3">
                    <AccentButton 
                      variant="secondary" 
                      size="sm"
                      onClick={() => setActiveActivity('files')}
                      icon={<Files className="w-4 h-4" />}
                    >
                      Browse Files
                    </AccentButton>
                    <AccentButton 
                      size="sm"
                      onClick={() => setShowRightPanel(true)}
                      icon={<MessageSquare className="w-4 h-4" />}
                    >
                      Open AI Chat
                    </AccentButton>
                  </div>
                </div>
              )}
            </div>

            {showDiff && modifications.length > 0 && (
              <div className="border-t border-cursor-border p-6 max-h-96 overflow-auto bg-cursor-surface">
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

            {showTerminal && currentRepo && (
              <div className="border-t border-cursor-border h-64 bg-cursor-surface">
                <Terminal repositoryId={currentRepo.id} repoPath={repoPath} />
              </div>
            )}
          </div>

          {/* Right Panel - AI Chat */}
          {showRightPanel && (
            <div className="w-80 border-l border-cursor-border bg-cursor-surface flex-shrink-0 flex flex-col">
              {/* AI Provider Selector */}
              <div className="border-b border-cursor-border p-3 bg-cursor-surface-hover">
                <label className="block text-xs font-semibold uppercase tracking-wider text-cursor-text-secondary mb-2">
                  AI Provider
                </label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="w-full px-3 py-2 bg-cursor-surface border border-cursor-border rounded-cursor-sm text-sm text-cursor-text focus:outline-none focus:ring-2 focus:ring-accent-blue"
                >
                  {availableProviders.map((provider) => (
                    <option 
                      key={provider.id} 
                      value={provider.id}
                      disabled={!provider.available}
                    >
                      {provider.name} {!provider.available && '(Not configured)'}
                    </option>
                  ))}
                </select>
                {availableProviders.length === 0 && (
                  <p className="text-xs text-cursor-text-muted mt-2">
                    No AI providers configured. Contact admin.
                  </p>
                )}
              </div>
              
              <div className="flex-1 overflow-hidden">
                <AIChat 
                  onPromptSubmit={handlePromptSubmit} 
                  selectedProvider={selectedProvider}
                  repositoryId={currentRepo?.id}
                />
              </div>
            </div>
          )}
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