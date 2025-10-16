'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Code2, Plus, Settings, LogOut, FolderGit2, 
  GitBranch, ExternalLink, Trash2, Loader2, Github
} from 'lucide-react';

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
      // Verify token with database
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Invalid session, clear and redirect
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
        console.error('Failed to load repositories');
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

      console.log('Adding repository:', {
        name: newRepo.name,
        url: newRepo.url,
        branch: newRepo.branch,
        description: newRepo.description,
      });

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
        console.log('Repository created:', data.repository);
        
        // Add the new repository to the list
        setRepositories([...repositories, data.repository]);
        setNewRepo({ name: '', url: '', branch: 'main', description: '' });
        setShowAddRepo(false);
      } else {
        const data = await response.json();
        console.error('Failed to add repository:', data);
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
    console.log('🚀 Opening workspace for repository:', repo.name);
    console.log('🔗 Repository ID:', repo.id);
    console.log('🔗 Repository URL:', repo.url);
    console.log('📂 Navigation URL:', `/workspace?repo=${repo.id}`);
    
    // Navigate to workspace with repo ID (workspace will fetch from database)
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

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#58a6ff] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
      {/* Header */}
      <header className="border-b border-[#30363d] bg-[#0d1117] sticky top-0 z-50 backdrop-blur-sm bg-opacity-80">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] rounded-lg flex items-center justify-center shadow-lg shadow-[#58a6ff]/20">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-[#c9d1d9]">DevPilot</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 px-4 py-2 bg-[#21262d] rounded-lg border border-[#30363d]">
                <div className="w-8 h-8 bg-gradient-to-br from-[#58a6ff] to-[#bc8cff] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </div>
                <span className="text-[#c9d1d9] text-sm font-medium">{user.name || user.email}</span>
              </div>
              
              <Link
                href="/settings"
                className="p-2.5 text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d] rounded-lg transition-all"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </Link>
              
              <button
                onClick={handleLogout}
                className="p-2.5 text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d] rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#c9d1d9] mb-2">Your Repositories</h1>
            <p className="text-[#8b949e]">Manage your GitHub repositories</p>
          </div>
          <button
            onClick={() => setShowAddRepo(true)}
            className="px-5 py-2.5 bg-[#238636] text-white rounded-lg hover:bg-[#2ea043] transition-all flex items-center gap-2 font-medium shadow-lg shadow-[#238636]/20"
          >
            <Plus className="w-5 h-5" />
            Add Repository
          </button>
        </div>

        {/* Add Repository Modal */}
        {showAddRepo && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 max-w-xl w-full shadow-2xl">
              <h3 className="text-2xl font-bold text-[#c9d1d9] mb-6">Add GitHub Repository</h3>
              
              {error && (
                <div className="mb-6 p-4 bg-[#da3633]/10 border border-[#da3633]/50 rounded-lg text-[#f85149] text-sm flex items-start gap-3">
                  <div className="mt-0.5">⚠️</div>
                  <div>{error}</div>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#c9d1d9] mb-2">
                    Repository Name
                  </label>
                  <input
                    type="text"
                    value={newRepo.name}
                    onChange={(e) => setNewRepo({ ...newRepo, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                    placeholder="expense-tracker"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#c9d1d9] mb-2">
                    GitHub Repository URL
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6e7681]" />
                    <input
                      type="text"
                      value={newRepo.url}
                      onChange={(e) => setNewRepo({ ...newRepo, url: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                      placeholder="https://github.com/wow-tier/expense"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="mt-2 text-xs text-[#6e7681]">
                    Paste the full GitHub repository URL
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#c9d1d9] mb-2">
                    Default Branch
                  </label>
                  <div className="relative">
                    <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6e7681]" />
                    <input
                      type="text"
                      value={newRepo.branch}
                      onChange={(e) => setNewRepo({ ...newRepo, branch: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                      placeholder="main"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#c9d1d9] mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={newRepo.description}
                    onChange={(e) => setNewRepo({ ...newRepo, description: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-[#c9d1d9] placeholder-[#6e7681] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all resize-none"
                    placeholder="Brief description of your project"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setShowAddRepo(false);
                    setError('');
                    setNewRepo({ name: '', url: '', branch: 'main', description: '' });
                  }}
                  className="flex-1 px-4 py-3 bg-[#21262d] text-[#c9d1d9] rounded-lg hover:bg-[#30363d] transition-all font-medium border border-[#30363d]"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRepository}
                  className="flex-1 px-4 py-3 bg-[#238636] text-white rounded-lg hover:bg-[#2ea043] transition-all font-medium shadow-lg shadow-[#238636]/20 flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add Repository
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Repositories Grid */}
        {isFetching ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#58a6ff] animate-spin" />
          </div>
        ) : repositories.length === 0 ? (
          <div className="text-center py-24 bg-[#0d1117] rounded-xl border border-[#30363d]">
            <div className="w-20 h-20 bg-[#21262d] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FolderGit2 className="w-10 h-10 text-[#58a6ff]" />
            </div>
            <h3 className="text-xl font-semibold text-[#c9d1d9] mb-3">No repositories yet</h3>
            <p className="text-[#8b949e] mb-8 max-w-md mx-auto">
              Add your first GitHub repository to start coding with AI assistance
            </p>
            <button
              onClick={() => setShowAddRepo(true)}
              className="px-6 py-3 bg-[#238636] text-white rounded-lg hover:bg-[#2ea043] transition-all inline-flex items-center gap-2 shadow-lg shadow-[#238636]/20 font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Your First Repository
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {repositories.map((repo) => (
              <div
                key={repo.id}
                className="group bg-[#0d1117] border border-[#30363d] rounded-xl p-6 hover:border-[#58a6ff]/50 transition-all cursor-pointer hover:bg-[#161b22]"
                onClick={() => handleOpenWorkspace(repo)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#21262d] rounded-xl flex items-center justify-center">
                      <FolderGit2 className="w-6 h-6 text-[#58a6ff]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#c9d1d9] group-hover:text-[#58a6ff] transition-colors">
                        {repo.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[#8b949e] mt-1">
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>{repo.defaultBranch || 'main'}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRepo(repo.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 text-[#8b949e] hover:text-[#f85149] hover:bg-[#f85149]/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {repo.description && (
                  <p className="text-sm text-[#8b949e] mb-4 line-clamp-2">
                    {repo.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs text-[#8b949e] mb-4 pb-4 border-b border-[#21262d]">
                  <Github className="w-4 h-4" />
                  <span className="truncate flex-1">{repo.url}</span>
                </div>

                <button className="w-full px-4 py-2.5 bg-[#21262d] text-[#c9d1d9] rounded-lg hover:bg-[#238636] hover:text-white transition-all font-medium flex items-center justify-center gap-2 border border-[#30363d] group-hover:border-[#58a6ff]/30">
                  Open Workspace
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
