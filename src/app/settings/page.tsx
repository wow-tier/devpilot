'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, User, FolderGit2, Sparkles, Palette,
  Code2, Save, ExternalLink, Loader2, CheckCircle
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

  const [savingAccount, setSavingAccount] = useState(false);
  const [savingAI, setSavingAI] = useState(false);
  const [savingAppearance, setSavingAppearance] = useState(false);
  const [accountSuccess, setAccountSuccess] = useState(false);

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'repositories', label: 'Repositories', icon: FolderGit2 },
    { id: 'ai', label: 'AI Settings', icon: Sparkles },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const handleSaveAccount = async () => {
    setSavingAccount(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSavingAccount(false);
    setAccountSuccess(true);
    setTimeout(() => setAccountSuccess(false), 3000);
  };

  const handleSaveAI = async () => {
    setSavingAI(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSavingAI(false);
  };

  const handleSaveAppearance = async () => {
    setSavingAppearance(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSavingAppearance(false);
  };

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
                
                {accountSuccess && (
                  <div className="mb-6 p-4 bg-success/10 border border-success/30 rounded-cursor-sm text-success text-sm flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" />
                    <span>Settings saved successfully!</span>
                  </div>
                )}

                <div className="space-y-6 max-w-xl">
                  {/* Profile Picture */}
                  <div>
                    <label className="block text-sm font-semibold text-cursor-text mb-3">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-accent-gradient rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <AccentButton size="sm" variant="secondary">
                          Upload Photo
                        </AccentButton>
                        <p className="text-xs text-cursor-text-muted mt-2">
                          JPG, PNG or GIF. Max 2MB.
                        </p>
                      </div>
                    </div>
                  </div>

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

                  <div>
                    <label className="block text-sm font-semibold text-cursor-text mb-2">
                      GitHub Username
                    </label>
                    <input
                      type="text"
                      className="input-cursor w-full"
                      placeholder="your-github-username"
                    />
                    <p className="text-xs text-cursor-text-muted mt-1.5">
                      Link your GitHub account for better integration
                    </p>
                  </div>

                  {/* Notification Preferences */}
                  <div className="pt-6 border-t border-cursor-border">
                    <h3 className="text-base font-semibold text-cursor-text mb-4">
                      Notification Preferences
                    </h3>
                    <div className="space-y-3">
                      {[
                        { id: 'email-updates', label: 'Email updates about new features' },
                        { id: 'repository-alerts', label: 'Repository activity alerts' },
                        { id: 'ai-suggestions', label: 'AI-generated code suggestions' },
                        { id: 'security-alerts', label: 'Security and account alerts' }
                      ].map((pref) => (
                        <label key={pref.id} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 rounded border-cursor-border bg-cursor-surface-hover text-accent-blue focus:ring-accent-blue focus:ring-2"
                          />
                          <span className="text-sm text-cursor-text-secondary group-hover:text-cursor-text transition-colors">
                            {pref.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <AccentButton 
                      icon={savingAccount ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      onClick={handleSaveAccount}
                      disabled={savingAccount}
                    >
                      {savingAccount ? 'Saving...' : 'Save Changes'}
                    </AccentButton>
                  </div>

                  {/* Danger Zone */}
                  <div className="pt-6 border-t border-cursor-border">
                    <h3 className="text-base font-semibold text-danger mb-4">
                      Danger Zone
                    </h3>
                    <div className="p-4 border border-danger/30 rounded-cursor-sm bg-danger/5">
                      <p className="text-sm text-cursor-text-secondary mb-3">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <AccentButton variant="secondary" size="sm" className="text-danger border-danger/30 hover:bg-danger/10">
                        Delete Account
                      </AccentButton>
                    </div>
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

                  {/* Advanced AI Options */}
                  <div className="pt-6 border-t border-cursor-border">
                    <h3 className="text-base font-semibold text-cursor-text mb-4">
                      Advanced Options
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-cursor-text mb-2">
                          Temperature
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="0.1"
                          defaultValue="0.7"
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-cursor-text-muted mt-1">
                          <span>Precise</span>
                          <span>Creative</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-cursor-text mb-2">
                          Max Tokens
                        </label>
                        <input
                          type="number"
                          defaultValue="2048"
                          className="input-cursor w-full"
                          min="256"
                          max="4096"
                          step="256"
                        />
                        <p className="text-xs text-cursor-text-muted mt-1.5">
                          Maximum length of generated responses
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <AccentButton 
                      icon={savingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      onClick={handleSaveAI}
                      disabled={savingAI}
                    >
                      {savingAI ? 'Saving...' : 'Save AI Settings'}
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

                  {/* Accessibility */}
                  <div className="pt-6 border-t border-cursor-border">
                    <h3 className="text-base font-semibold text-cursor-text mb-4">
                      Accessibility
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-cursor-border bg-cursor-surface-hover text-accent-blue focus:ring-accent-blue focus:ring-2"
                        />
                        <span className="text-sm text-cursor-text-secondary group-hover:text-cursor-text transition-colors">
                          Enable high contrast mode
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-cursor-border bg-cursor-surface-hover text-accent-blue focus:ring-accent-blue focus:ring-2"
                        />
                        <span className="text-sm text-cursor-text-secondary group-hover:text-cursor-text transition-colors">
                          Reduce animations
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <AccentButton 
                      icon={savingAppearance ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      onClick={handleSaveAppearance}
                      disabled={savingAppearance}
                    >
                      {savingAppearance ? 'Saving...' : 'Save Appearance'}
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
