'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Code2, Plus, Settings, LogOut, FolderGit2, 
  GitBranch, ExternalLink, Trash2, Loader2, Github,
  Search, Clock
} from 'lucide-react';
import { GlassPanel, AccentButton, SectionHeader } from '../components/ui';

interface Repository {
  id: string;
  name: string;
  url: string;
  defaultBranch: string;
  lastAccessedAt?: Date;
  description?: string;
  isActive?: boolean;
}

interface User {
  id: string;
  email: string;
  name?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [showAddRepo, setShowAddRepo] = useState(false);
  const [newRepo, setNewRepo] = useState({ name: '', url: '', branch: 'main', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    verifyAndLoadUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyAndLoadUser = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.clear();
        router.push('/login');
        return;
      }

      const data = await response.json();
      
      if (!data.valid) {
        localStorage.clear();
        router.push('/login');
        return;
      }

      setUser(data.user);
      loadRepositories(token);
    } catch (error) {
      console.error('Verification error:', error);
      localStorage.clear();
      router.push('/login');
    }
  };

  const loadRepositories = async (token: string) => {
    setIsFetching(true);
    try {
      const response = await fetch('/api/repositories', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRepositories(data.repositories || []);
      } else {
        setRepositories([]);
      }
    } catch (error) {
      console.error('Error loading repositories:', error);
      setRepositories([]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddRepository = async () => {
    if (!newRepo.name || !newRepo.url) {
      setError('Please fill in repository name and URL');
      return;
    }

    if (!newRepo.url.includes('github.com')) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/repositories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newRepo.name,
          url: newRepo.url,
          branch: newRepo.branch || 'main',
          description: newRepo.description,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRepositories([...repositories, data.repository]);
        setNewRepo({ name: '', url: '', branch: 'main', description: '' });
        setShowAddRepo(false);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add repository');
      }
    } catch (error) {
      console.error('Error adding repository:', error);
      setError('Failed to add repository. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRepo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this repository?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/repositories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setRepositories(repositories.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Error deleting repository:', error);
    }
  };

  const handleOpenWorkspace = (repo: Repository) => {
    router.push(`/workspace?repo=${repo.id}`);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    localStorage.clear();
    router.push('/');
  };

  const filteredRepositories = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-cursor-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
          <p className="text-sm text-cursor-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cursor-base">
      {/* Header */}
      <header className="border-b border-cursor-border bg-cursor-surface sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-accent-gradient rounded-cursor-md flex items-center justify-center shadow-cursor-md">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-cursor-text">AI Code Agent</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-cursor-surface-hover rounded-cursor-sm border border-cursor-border">
              <div className="w-7 h-7 bg-accent-gradient rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm font-medium text-cursor-text">{user.name || user.email}</span>
            </div>
            
            <Link
              href="/settings"
              className="p-2 text-cursor-text-muted hover:text-cursor-text hover:bg-cursor-surface-hover rounded-cursor-sm transition-all"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
            
            <button
              onClick={handleLogout}
              className="p-2 text-cursor-text-muted hover:text-cursor-text hover:bg-cursor-surface-hover rounded-cursor-sm transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <SectionHeader
          title="Workspaces"
          subtitle="Manage your AI-powered development environments"
          action={
            <AccentButton
              onClick={() => setShowAddRepo(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              New Workspace
            </AccentButton>
          }
        />

        {/* Search Bar */}
        {repositories.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cursor-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workspaces..."
                className="input-cursor w-full pl-10"
              />
            </div>
          </div>
        )}

        {/* Add Repository Modal */}
        {showAddRepo && (
          <div className="fixed inset-0 bg-cursor-base/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <GlassPanel className="p-8 max-w-xl w-full">
              <h3 className="text-2xl font-bold text-cursor-text mb-6">Add GitHub Repository</h3>
              
              {error && (
                <div className="mb-6 p-4 bg-danger/10 border border-danger/30 rounded-cursor-sm text-danger text-sm flex items-start gap-3">
                  <div className="mt-0.5">⚠️</div>
                  <div>{error}</div>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-cursor-text mb-2">
                    Repository Name
                  </label>
                  <input
                    type="text"
                    value={newRepo.name}
                    onChange={(e) => setNewRepo({ ...newRepo, name: e.target.value })}
                    className="input-cursor w-full"
                    placeholder="my-project"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-cursor-text mb-2">
                    GitHub Repository URL
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cursor-text-muted" />
                    <input
                      type="text"
                      value={newRepo.url}
                      onChange={(e) => setNewRepo({ ...newRepo, url: e.target.value })}
                      className="input-cursor w-full pl-11"
                      placeholder="https://github.com/username/repo"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-cursor-text mb-2">
                    Default Branch
                  </label>
                  <div className="relative">
                    <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cursor-text-muted" />
                    <input
                      type="text"
                      value={newRepo.branch}
                      onChange={(e) => setNewRepo({ ...newRepo, branch: e.target.value })}
                      className="input-cursor w-full pl-11"
                      placeholder="main"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-cursor-text mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={newRepo.description}
                    onChange={(e) => setNewRepo({ ...newRepo, description: e.target.value })}
                    className="input-cursor w-full resize-none"
                    placeholder="Brief description of your project"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <AccentButton
                  variant="secondary"
                  onClick={() => {
                    setShowAddRepo(false);
                    setError('');
                    setNewRepo({ name: '', url: '', branch: 'main', description: '' });
                  }}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </AccentButton>
                <AccentButton
                  onClick={handleAddRepository}
                  disabled={isLoading}
                  icon={isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  className="flex-1"
                >
                  {isLoading ? 'Adding...' : 'Add Repository'}
                </AccentButton>
              </div>
            </GlassPanel>
          </div>
        )}

        {/* Repositories Grid */}
        {isFetching ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
              <p className="text-sm text-cursor-text-secondary">Loading workspaces...</p>
            </div>
          </div>
        ) : filteredRepositories.length === 0 && searchQuery ? (
          <GlassPanel className="text-center py-16">
            <Search className="w-12 h-12 text-cursor-text-muted mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-cursor-text mb-2">No workspaces found</h3>
            <p className="text-cursor-text-secondary">
              Try adjusting your search query
            </p>
          </GlassPanel>
        ) : repositories.length === 0 ? (
          <GlassPanel className="text-center py-20">
            <div className="w-16 h-16 bg-cursor-surface-hover rounded-cursor-lg flex items-center justify-center mx-auto mb-6">
              <FolderGit2 className="w-8 h-8 text-accent-blue" />
            </div>
            <h3 className="text-xl font-semibold text-cursor-text mb-3">No workspaces yet</h3>
            <p className="text-cursor-text-secondary mb-8 max-w-md mx-auto">
              Create your first workspace to start coding with AI assistance
            </p>
            <AccentButton
              onClick={() => setShowAddRepo(true)}
              icon={<Plus className="w-5 h-5" />}
              size="lg"
            >
              Create Workspace
            </AccentButton>
          </GlassPanel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepositories.map((repo) => (
              <div
                key={repo.id}
                onClick={() => handleOpenWorkspace(repo)}
                className="cursor-pointer group"
              >
                <GlassPanel hover className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-cursor-surface-hover rounded-cursor-md flex items-center justify-center group-hover:bg-accent-blue/20 transition-colors">
                      <FolderGit2 className="w-6 h-6 text-accent-blue" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-cursor-text group-hover:text-accent-blue transition-colors">
                        {repo.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-cursor-text-muted mt-1">
                        <GitBranch className="w-3 h-3" />
                        <span>{repo.defaultBranch || 'main'}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRepo(repo.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-cursor-text-muted hover:text-danger hover:bg-danger/10 rounded-cursor-sm transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {repo.description && (
                  <p className="text-sm text-cursor-text-secondary mb-4 line-clamp-2">
                    {repo.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs text-cursor-text-muted mb-4 pb-4 border-b border-cursor-border">
                  <Github className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{repo.url}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-cursor-text-muted">
                  {repo.lastAccessedAt && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Last opened recently</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open</span>
                  </div>
                </div>
                </GlassPanel>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
