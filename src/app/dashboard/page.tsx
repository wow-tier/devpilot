'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Code2, Plus, Settings, LogOut, FolderGit2, 
  GitBranch, ExternalLink, Trash2, Book, Users, MessageSquare 
} from 'lucide-react';

interface Repository {
  id: string;
  name: string;
  url: string;
  branch: string;
  lastAccessed?: Date;
  description?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [showAddRepo, setShowAddRepo] = useState(false);
  const [newRepo, setNewRepo] = useState({ name: '', url: '', branch: 'main' });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));

    const savedRepos = localStorage.getItem('repositories');
    if (savedRepos) {
      setRepositories(JSON.parse(savedRepos));
    }
  }, [router]);

  const handleAddRepository = () => {
    if (!newRepo.name || !newRepo.url) return;

    const repo: Repository = {
      id: Date.now().toString(),
      ...newRepo,
      lastAccessed: new Date(),
    };

    const updatedRepos = [...repositories, repo];
    setRepositories(updatedRepos);
    localStorage.setItem('repositories', JSON.stringify(updatedRepos));
    setNewRepo({ name: '', url: '', branch: 'main' });
    setShowAddRepo(false);
  };

  const handleDeleteRepo = (id: string) => {
    const updatedRepos = repositories.filter(r => r.id !== id);
    setRepositories(updatedRepos);
    localStorage.setItem('repositories', JSON.stringify(updatedRepos));
  };

  const handleOpenWorkspace = (repo: Repository) => {
    localStorage.setItem('currentRepo', JSON.stringify(repo));
    router.push(`/workspace?repo=${repo.id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AI Code Agent</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                  {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </div>
                <span className="text-slate-300 text-sm font-medium">{user.name || user.email}</span>
              </div>
              
              <Link
                href="/settings"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </Link>
              
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Workspaces</h1>
            <p className="text-slate-400">Select a repository to start coding with AI</p>
          </div>
          <button
            onClick={() => setShowAddRepo(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-glow font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Repository
          </button>
        </div>

        {/* Add Repository Modal */}
        {showAddRepo && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in">
              <h3 className="text-xl font-bold text-white mb-6">Add Repository</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Repository Name
                  </label>
                  <input
                    type="text"
                    value={newRepo.name}
                    onChange={(e) => setNewRepo({ ...newRepo, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="my-awesome-project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Git URL
                  </label>
                  <input
                    type="text"
                    value={newRepo.url}
                    onChange={(e) => setNewRepo({ ...newRepo, url: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="https://github.com/user/repo.git"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Branch
                  </label>
                  <input
                    type="text"
                    value={newRepo.branch}
                    onChange={(e) => setNewRepo({ ...newRepo, branch: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="main"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddRepo(false)}
                  className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRepository}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-lg hover:shadow-glow"
                >
                  Add Repository
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Repositories Grid */}
        {repositories.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800">
            <FolderGit2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No repositories yet</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Add your first repository to start coding with AI assistance
            </p>
            <button
              onClick={() => setShowAddRepo(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-glow font-medium"
            >
              <Plus className="w-5 h-5" />
              Add Your First Repo
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repositories.map((repo) => (
              <div
                key={repo.id}
                className="group bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all cursor-pointer hover:shadow-xl hover:shadow-blue-500/10"
                onClick={() => handleOpenWorkspace(repo)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                    <FolderGit2 className="w-6 h-6" />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRepo(repo.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-white mb-3">{repo.name}</h3>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <GitBranch className="w-4 h-4" />
                    <span className="truncate">{repo.branch}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <ExternalLink className="w-4 h-4" />
                    <span className="truncate">{repo.url}</span>
                  </div>
                </div>

                <button className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center justify-center gap-2">
                  Open Workspace
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
            <Book className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Documentation</h3>
            <p className="text-slate-400 text-sm mb-4">
              Learn how to use AI Code Agent effectively
            </p>
            <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-medium inline-flex items-center gap-1 group">
              Read Docs
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
            <Users className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Community</h3>
            <p className="text-slate-400 text-sm mb-4">
              Join our Discord community for support
            </p>
            <a href="#" className="text-purple-400 hover:text-purple-300 text-sm font-medium inline-flex items-center gap-1 group">
              Join Discord
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
            <MessageSquare className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Support</h3>
            <p className="text-slate-400 text-sm mb-4">
              Get help from our support team
            </p>
            <a href="#" className="text-green-400 hover:text-green-300 text-sm font-medium inline-flex items-center gap-1 group">
              Get Help
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
