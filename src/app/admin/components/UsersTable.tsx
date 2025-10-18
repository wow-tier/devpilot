'use client';

import { useState, useEffect } from 'react';
import { Trash2, Mail, Calendar, Database, Key, FolderGit2, Crown } from 'lucide-react';
import { GlassPanel, AccentButton } from '../../components/ui';

interface User {
  id: string;
  name?: string;
  email: string;
  createdAt: string;
  githubUsername?: string;
  currentPlan?: {
    name: string;
    displayName: string;
  };
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
}

interface UsersTableProps {
  users: User[];
  onDelete: (id: string) => void;
  onPlanUpdate?: () => void;
}

export default function UsersTable({ users, onDelete, onPlanUpdate }: UsersTableProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [assigningPlan, setAssigningPlan] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Record<string, string>>({});

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/plans', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans);
      }
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const handleAssignPlan = async (userId: string) => {
    const planId = selectedPlan[userId];
    if (!planId) return;

    setAssigningPlan(userId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}/subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId })
      });

      if (response.ok) {
        alert('Plan assigned successfully!');
        if (onPlanUpdate) onPlanUpdate();
      } else {
        const data = await response.json();
        alert('Failed to assign plan: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error assigning plan:', error);
      alert('Failed to assign plan');
    } finally {
      setAssigningPlan(null);
    }
  };

  const handleDelete = (id: string, email: string) => {
    if (confirm(`Are you sure you want to delete user ${email}?`)) {
      onDelete(id);
    }
  };

  if (users.length === 0) {
    return (
      <GlassPanel className="p-8 text-center">
        <div className="text-4xl mb-3 opacity-50">👥</div>
        <p className="text-cursor-text-secondary">No users found</p>
      </GlassPanel>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <GlassPanel key={user.id} className="p-5 hover:border-accent-blue/30 transition-all">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-accent-gradient rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-cursor-text">
                      {user.name || 'Unnamed User'}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-cursor-text-muted">
                      <Mail className="w-3.5 h-3.5" />
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <div>
                      <div className="text-cursor-text-muted text-xs">Plan</div>
                      <div className="font-medium text-cursor-text">
                        {user.currentPlan?.displayName || 'No Plan'}
                      </div>
                    </div>
                  </div>

                  {user.githubUsername && (
                    <div className="flex items-center gap-2 text-cursor-text-secondary">
                      <Database className="w-4 h-4" />
                      <span>@{user.githubUsername}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-cursor-text-secondary">
                    <FolderGit2 className="w-4 h-4" />
                    <span>{user._count?.repositories || 0} repos</span>
                  </div>
                  <div className="flex items-center gap-2 text-cursor-text-secondary">
                    <Key className="w-4 h-4" />
                    <span>{user._count?.apiKeys || 0} keys</span>
                  </div>
                  <div className="flex items-center gap-2 text-cursor-text-secondary">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(user.id, user.email)}
                className="p-2 text-cursor-text-muted hover:text-danger hover:bg-danger/10 rounded-cursor-sm transition-all"
                title="Delete user"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Plan Assignment */}
            <div className="flex items-center gap-2 pt-4 border-t border-cursor-border">
              <label className="text-sm text-cursor-text-muted whitespace-nowrap">Assign Plan:</label>
              <select
                value={selectedPlan[user.id] || ''}
                onChange={(e) => setSelectedPlan({ ...selectedPlan, [user.id]: e.target.value })}
                className="input-cursor text-sm flex-1 max-w-xs"
              >
                <option value="">Select plan...</option>
                {plans.map(plan => (
                  <option key={plan.id} value={plan.id}>
                    {plan.displayName} ({plan.name})
                  </option>
                ))}
              </select>
              <AccentButton
                onClick={() => handleAssignPlan(user.id)}
                disabled={!selectedPlan[user.id] || assigningPlan === user.id}
                size="sm"
              >
                {assigningPlan === user.id ? 'Assigning...' : 'Assign'}
              </AccentButton>
            </div>
          </div>
        </GlassPanel>
      ))}
    </div>
  );
}
