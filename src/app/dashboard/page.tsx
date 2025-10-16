'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  const [user, setUser] = useState<any>(null);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [showAddRepo, setShowAddRepo] = useState(false);
  const [newRepo, setNewRepo] = useState({ name: '', url: '', branch: 'main' });

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));

    // Load repositories
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
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <span className="text-xl font-bold text-white">AI Code Agent</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-400">👋 {user.name || user.email}</span>
              <Link
                href="/settings"
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                ⚙️ Settings
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Logout
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
            <p className="text-gray-400">Select a repository to start coding with AI</p>
          </div>
          <button
            onClick={() => setShowAddRepo(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>+</span> Add Repository
          </button>
        </div>

        {/* Add Repository Modal */}
        {showAddRepo && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-white mb-4">Add Repository</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Repository Name
                  </label>
                  <input
                    type="text"
                    value={newRepo.name}
                    onChange={(e) => setNewRepo({ ...newRepo, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="my-awesome-project"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Git URL
                  </label>
                  <input
                    type="text"
                    value={newRepo.url}
                    onChange={(e) => setNewRepo({ ...newRepo, url: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://github.com/user/repo.git"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Branch
                  </label>
                  <input
                    type="text"
                    value={newRepo.branch}
                    onChange={(e) => setNewRepo({ ...newRepo, branch: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="main"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddRepo(false)}
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRepository}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Repository
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Repositories Grid */}
        {repositories.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-white mb-2">No repositories yet</h3>
            <p className="text-gray-400 mb-6">
              Add your first repository to start coding with AI
            </p>
            <button
              onClick={() => setShowAddRepo(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Repo
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repositories.map((repo) => (
              <div
                key={repo.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition-colors cursor-pointer group"
                onClick={() => handleOpenWorkspace(repo)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">📦</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRepo(repo.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{repo.name}</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <span>🔀</span>
                    <span className="truncate">{repo.branch}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span>🔗</span>
                    <span className="truncate">{repo.url}</span>
                  </div>
                  {repo.lastAccessed && (
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <span>⏰</span>
                      <span>Last accessed: {new Date(repo.lastAccessed).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Open Workspace →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-2xl mb-3">📚</div>
            <h3 className="text-lg font-semibold text-white mb-2">Documentation</h3>
            <p className="text-gray-400 text-sm mb-4">
              Learn how to use AI Code Agent effectively
            </p>
            <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              Read Docs →
            </a>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-2xl mb-3">🎓</div>
            <h3 className="text-lg font-semibold text-white mb-2">Tutorials</h3>
            <p className="text-gray-400 text-sm mb-4">
              Step-by-step guides and video tutorials
            </p>
            <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              Watch Tutorials →
            </a>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-2xl mb-3">💬</div>
            <h3 className="text-lg font-semibold text-white mb-2">Community</h3>
            <p className="text-gray-400 text-sm mb-4">
              Join our Discord community for support
            </p>
            <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              Join Discord →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
