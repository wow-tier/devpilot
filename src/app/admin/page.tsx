'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, CreditCard, Key, TrendingUp, Activity, 
  UserPlus, Plus, Loader2, Settings, LogOut, Code2,
  DollarSign, Database, ArrowLeft
} from 'lucide-react';
import { GlassPanel, AccentButton, SectionHeader } from '../components/ui';
import UsersTable from './components/UsersTable';
import PlansTable from './components/PlansTable';
import ApiKeysTable from './components/ApiKeysTable';
import SystemApiKeysTable from './components/SystemApiKeysTable';

// ----------------- TYPES -----------------
interface User {
  id: string;
  name?: string;
  email: string;
  createdAt: string;
  githubUsername?: string;
  _count?: {
    repositories: number;
    subscriptions: number;
    apiKeys: number;
  };
}

interface Plan {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  price: number;
  interval: string;
  maxRepositories: number;
  maxAIRequests: number;
  isActive: boolean;
  _count?: {
    subscriptions: number;
  };
}

interface ApiKey {
  id: string;
  name: string;
  provider: string;
  isActive: boolean;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

interface SystemApiKey {
  id: string;
  provider: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  lastUsed: string | null;
  hasKey: boolean;
}

interface Stats {
  totalUsers: number;
  totalRepositories: number;
  totalSubscriptions: number;
  totalRevenue: number;
  activeUsers: number;
}

// ----------------- ADMIN PAGE -----------------
export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'plans' | 'apikeys' | 'system'>('overview');
  
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [systemKeys, setSystemKeys] = useState<SystemApiKey[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      // Load stats, users, plans, API keys, and system keys in parallel
      const [statsRes, usersRes, plansRes, keysRes, systemKeysRes] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/plans', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/apikeys', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/admin/system-keys', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
      }

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users);
      }

      if (plansRes.ok) {
        const data = await plansRes.json();
        setPlans(data.plans);
      }

      if (keysRes.ok) {
        const data = await keysRes.json();
        setApiKeys(data.apiKeys);
      }

      if (systemKeysRes.ok) {
        const data = await systemKeysRes.json();
        setSystemKeys(data.keys);
      }

      if (!statsRes.ok || !usersRes.ok) {
        setError('You do not have permission to access the admin panel');
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setUsers(users.filter(u => u.id !== id));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeletePlan = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/plans/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setPlans(plans.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`/api/admin/apikeys/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setApiKeys(apiKeys.filter(k => k.id !== id));
      }
    } catch (error) {
      console.error('Error deleting API key:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cursor-base flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
          <p className="text-sm text-cursor-text-secondary">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cursor-base flex items-center justify-center p-6">
        <GlassPanel className="p-8 max-w-md text-center">
          <div className="text-danger text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-cursor-text mb-3">Access Denied</h2>
          <p className="text-cursor-text-secondary mb-6">{error}</p>
          <Link href="/dashboard">
            <AccentButton icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Dashboard
            </AccentButton>
          </Link>
        </GlassPanel>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Activity },
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'plans' as const, label: 'Plans', icon: CreditCard },
    { id: 'apikeys' as const, label: 'User Keys', icon: Key },
    { id: 'system' as const, label: 'System AI Keys', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-cursor-base">
      {/* Header */}
      <header className="border-b border-cursor-border bg-cursor-surface sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <div className="w-9 h-9 bg-accent-gradient rounded-cursor-md flex items-center justify-center shadow-cursor-md">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-cursor-text">Admin Panel</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="px-3 py-1.5 text-cursor-text-muted hover:text-cursor-text hover:bg-cursor-surface-hover rounded-cursor-sm transition-all text-sm font-medium flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 border-b border-cursor-border">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'border-accent-blue text-accent-blue'
                      : 'border-transparent text-cursor-text-muted hover:text-cursor-text'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            <SectionHeader
              title="Dashboard Overview"
              subtitle="Key metrics and platform statistics"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-accent-blue/10 rounded-cursor-md flex items-center justify-center">
                    <Users className="w-6 h-6 text-accent-blue" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div className="text-3xl font-bold text-cursor-text mb-1">{stats.totalUsers}</div>
                <div className="text-sm text-cursor-text-secondary">Total Users</div>
                <div className="text-xs text-success mt-2">{stats.activeUsers} active now</div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-accent-purple/10 rounded-cursor-md flex items-center justify-center">
                    <Database className="w-6 h-6 text-accent-purple" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-cursor-text mb-1">{stats.totalRepositories}</div>
                <div className="text-sm text-cursor-text-secondary">Repositories</div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-success/10 rounded-cursor-md flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-success" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-cursor-text mb-1">{stats.totalSubscriptions}</div>
                <div className="text-sm text-cursor-text-secondary">Active Subscriptions</div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-cursor-md flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-yellow-500" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-cursor-text mb-1">
                  ${Number(stats.totalRevenue).toLocaleString()}
                </div>
                <div className="text-sm text-cursor-text-secondary">Total Revenue</div>
              </GlassPanel>
            </div>

            {/* Quick Actions */}
            <GlassPanel className="p-6">
              <h3 className="text-lg font-semibold text-cursor-text mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <AccentButton onClick={() => setActiveTab('users')} icon={<UserPlus className="w-4 h-4" />}>
                  Manage Users
                </AccentButton>
                <AccentButton onClick={() => setActiveTab('plans')} variant="secondary" icon={<Plus className="w-4 h-4" />}>
                  Manage Plans
                </AccentButton>
                <AccentButton onClick={() => setActiveTab('apikeys')} variant="secondary" icon={<Key className="w-4 h-4" />}>
                  Manage API Keys
                </AccentButton>
              </div>
            </GlassPanel>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <SectionHeader
              title="User Management"
              subtitle={`${users.length} total users`}
            />
            <UsersTable users={users} onDelete={handleDeleteUser} />
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <SectionHeader
              title="Subscription Plans"
              subtitle={`${plans.length} plans configured`}
            />
            <PlansTable plans={plans} onDelete={handleDeletePlan} />
          </div>
        )}

        {/* API Keys Tab */}
        {activeTab === 'apikeys' && (
          <div className="space-y-6">
            <SectionHeader
              title="User API Keys"
              subtitle={`${apiKeys.length} user-owned keys`}
            />
            <ApiKeysTable apiKeys={apiKeys} onDelete={handleDeleteApiKey} />
          </div>
        )}

        {/* System AI Keys Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <SectionHeader
              title="System AI API Keys"
              subtitle="Configure AI providers for all users"
            />
            <SystemApiKeysTable keys={systemKeys} onRefresh={loadData} />
          </div>
        )}
      </div>
    </div>
  );
}
