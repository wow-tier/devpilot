'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, User, FolderGit2, Sparkles, Palette,
  Code2, Save, ExternalLink
} from 'lucide-react';
import { GlassPanel, AccentButton, SectionHeader } from '../components/ui';

interface User {
  id: string;
  email: string;
  name?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('account');

  useEffect(() => {
    verifyUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyUser = async () => {
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
    } catch (error) {
      console.error('Verification error:', error);
      localStorage.clear();
      router.push('/login');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-cursor-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-cursor-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'repositories', label: 'Repositories', icon: FolderGit2 },
    { id: 'ai', label: 'AI Settings', icon: Sparkles },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-cursor-base">
      {/* Header */}
      <header className="border-b border-cursor-border bg-cursor-surface sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 text-cursor-text-muted hover:text-cursor-text transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-accent-gradient rounded-cursor-md flex items-center justify-center shadow-cursor-md">
                <Code2 className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <SectionHeader
          title="Settings"
          subtitle="Manage your account and preferences"
        />

        <div className="flex gap-6 mt-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <GlassPanel className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-cursor-sm text-left transition-all ${
                        activeTab === tab.id
                          ? 'bg-accent-blue/20 text-accent-blue'
                          : 'text-cursor-text-muted hover:bg-cursor-surface-hover hover:text-cursor-text'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </GlassPanel>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'account' && (
              <GlassPanel className="p-8">
                <h2 className="text-xl font-bold text-cursor-text mb-6 flex items-center gap-3">
                  <User className="w-5 h-5 text-accent-blue" />
                  Account Settings
                </h2>
                <div className="space-y-6 max-w-xl">
                  <div>
                    <label className="block text-sm font-semibold text-cursor-text mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="input-cursor w-full opacity-60 cursor-not-allowed"
                    />
                    <p className="text-xs text-cursor-text-muted mt-1.5">
                      Email cannot be changed at this time
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-cursor-text mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="input-cursor w-full"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="pt-4">
                    <AccentButton icon={<Save className="w-4 h-4" />}>
                      Save Changes
                    </AccentButton>
                  </div>
                </div>
              </GlassPanel>
            )}

            {activeTab === 'repositories' && (
              <GlassPanel className="p-8">
                <h2 className="text-xl font-bold text-cursor-text mb-6 flex items-center gap-3">
                  <FolderGit2 className="w-5 h-5 text-accent-blue" />
                  Repository Settings
                </h2>
                <div className="max-w-xl">
                  <p className="text-cursor-text-secondary mb-6">
                    Manage your connected repositories and workspaces from the dashboard.
                  </p>
                  <Link href="/dashboard">
                    <AccentButton 
                      variant="secondary"
                      icon={<ExternalLink className="w-4 h-4" />}
                    >
                      Go to Dashboard
                    </AccentButton>
                  </Link>
                </div>
              </GlassPanel>
            )}

            {activeTab === 'ai' && (
              <GlassPanel className="p-8">
                <h2 className="text-xl font-bold text-cursor-text mb-6 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-accent-blue" />
                  AI Settings
                </h2>
                <div className="space-y-6 max-w-xl">
                  <div>
                    <label className="block text-sm font-semibold text-cursor-text mb-2">
                      AI Model
                    </label>
                    <select className="input-cursor w-full">
                      <option>GPT-4 (Most Capable)</option>
                      <option>GPT-3.5 Turbo (Faster)</option>
                      <option>Claude 3</option>
                    </select>
                    <p className="text-xs text-cursor-text-muted mt-1.5">
                      Choose the AI model for code generation
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-cursor-text mb-2">
                      OpenAI API Key
                    </label>
                    <input
                      type="password"
                      placeholder="sk-..."
                      className="input-cursor w-full"
                    />
                    <p className="text-xs text-cursor-text-muted mt-1.5">
                      Get your API key from{' '}
                      <a 
                        href="https://platform.openai.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-accent-blue hover:underline inline-flex items-center gap-1"
                      >
                        platform.openai.com
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </p>
                  </div>

                  <div className="pt-4">
                    <AccentButton icon={<Save className="w-4 h-4" />}>
                      Save AI Settings
                    </AccentButton>
                  </div>
                </div>
              </GlassPanel>
            )}

            {activeTab === 'appearance' && (
              <GlassPanel className="p-8">
                <h2 className="text-xl font-bold text-cursor-text mb-6 flex items-center gap-3">
                  <Palette className="w-5 h-5 text-accent-blue" />
                  Appearance
                </h2>
                <div className="space-y-6 max-w-xl">
                  <div>
                    <label className="block text-sm font-semibold text-cursor-text mb-2">
                      Editor Theme
                    </label>
                    <select className="input-cursor w-full">
                      <option>VS Code Dark+ (Default)</option>
                      <option>Monokai</option>
                      <option>Dracula</option>
                      <option>GitHub Dark</option>
                      <option>Solarized Dark</option>
                    </select>
                    <p className="text-xs text-cursor-text-muted mt-1.5">
                      Choose your preferred code editor theme
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-cursor-text mb-2">
                      Font Size
                    </label>
                    <select className="input-cursor w-full">
                      <option>12px (Small)</option>
                      <option>14px (Default)</option>
                      <option>16px (Large)</option>
                      <option>18px (Extra Large)</option>
                    </select>
                  </div>

                  <div className="pt-4">
                    <AccentButton icon={<Save className="w-4 h-4" />}>
                      Save Appearance
                    </AccentButton>
                  </div>
                </div>
              </GlassPanel>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
