import { useState } from 'react';
import { Trash2, Users, CheckCircle, Plus, Edit, Save, X } from 'lucide-react';
import { GlassPanel, AccentButton } from '../../components/ui';

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

interface PlansTableProps {
  plans: Plan[];
  onDelete?: (id: string) => void;
  onRefresh: () => void;
}

export default function PlansTable({ plans, onDelete, onRefresh }: PlansTableProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    price: 0,
    interval: 'month',
    maxRepositories: 5,
    maxAIRequests: 100,
    maxStorage: 1000,
    isActive: true
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const handleDelete = (id: string, name: string) => {
    if (onDelete && confirm(`Are you sure you want to delete the ${name} plan?`)) {
      onDelete(id);
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      displayName: plan.displayName,
      description: plan.description || '',
      price: Number(plan.price),
      interval: plan.interval,
      maxRepositories: plan.maxRepositories,
      maxAIRequests: plan.maxAIRequests,
      maxStorage: 1000, // Default value
      isActive: plan.isActive
    });
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      displayName: '',
      description: '',
      price: 0,
      interval: 'month',
      maxRepositories: 5,
      maxAIRequests: 100,
      maxStorage: 1000,
      isActive: true
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.displayName || formData.price < 0) {
      setError('Please fill in all required fields');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = editingPlan 
        ? `/api/admin/plans/${editingPlan.id}`
        : '/api/admin/plans';
      
      const response = await fetch(url, {
        method: editingPlan ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowForm(false);
        setEditingPlan(null);
        onRefresh();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save plan');
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      setError('Failed to save plan');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPlan(null);
    setError('');
  };

  if (plans.length === 0 && !showForm) {
    return (
      <GlassPanel className="p-8 text-center">
        <div className="text-4xl mb-3 opacity-50">💳</div>
        <p className="text-cursor-text-secondary">No plans configured</p>
      </GlassPanel>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Plan Button */}
      {!showForm && (
        <div className="flex justify-end">
          <AccentButton onClick={handleAdd} icon={<Plus className="w-4 h-4" />}>
            Add New Plan
          </AccentButton>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <GlassPanel className="p-6">
          <h3 className="text-lg font-semibold text-cursor-text mb-4">
            {editingPlan ? 'Edit Plan' : 'Add New Plan'}
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-cursor-sm text-danger text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            <div>
              <label className="block text-sm font-semibold text-cursor-text mb-2">
                Plan ID *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="input-cursor w-full"
                placeholder="free, pro, enterprise"
                disabled={!!editingPlan}
              />
              <p className="text-xs text-cursor-text-muted mt-1">Unique identifier (lowercase, no spaces)</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-cursor-text mb-2">
                Display Name *
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="input-cursor w-full"
                placeholder="Pro Plan"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-cursor-text mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-cursor w-full resize-none"
                placeholder="Perfect for professional developers"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-cursor-text mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="input-cursor w-full"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-cursor-text mb-2">
                Billing Interval *
              </label>
              <select
                value={formData.interval}
                onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
                className="input-cursor w-full"
              >
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-cursor-text mb-2">
                Max Repositories
              </label>
              <input
                type="number"
                value={formData.maxRepositories}
                onChange={(e) => setFormData({ ...formData, maxRepositories: parseInt(e.target.value) })}
                className="input-cursor w-full"
                min="-1"
              />
              <p className="text-xs text-cursor-text-muted mt-1">Use -1 for unlimited</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-cursor-text mb-2">
                Max AI Requests/Month
              </label>
              <input
                type="number"
                value={formData.maxAIRequests}
                onChange={(e) => setFormData({ ...formData, maxAIRequests: parseInt(e.target.value) })}
                className="input-cursor w-full"
                min="-1"
              />
              <p className="text-xs text-cursor-text-muted mt-1">Use -1 for unlimited</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-cursor-text mb-2">
                Max Storage (MB)
              </label>
              <input
                type="number"
                value={formData.maxStorage}
                onChange={(e) => setFormData({ ...formData, maxStorage: parseInt(e.target.value) })}
                className="input-cursor w-full"
                min="-1"
              />
              <p className="text-xs text-cursor-text-muted mt-1">Use -1 for unlimited</p>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-cursor-border bg-cursor-surface-hover text-accent-blue focus:ring-accent-blue focus:ring-2"
                />
                <span className="text-sm font-semibold text-cursor-text">
                  Active (visible to users)
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <AccentButton
              onClick={handleSave}
              disabled={saving}
              icon={saving ? undefined : <Save className="w-4 h-4" />}
            >
              {saving ? 'Saving...' : editingPlan ? 'Update Plan' : 'Create Plan'}
            </AccentButton>
            <AccentButton
              variant="secondary"
              onClick={handleCancel}
              icon={<X className="w-4 h-4" />}
            >
              Cancel
            </AccentButton>
          </div>
        </GlassPanel>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
        <GlassPanel key={plan.id} className="p-6 hover:border-accent-blue/30 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-cursor-text mb-1">{plan.displayName}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-accent-blue">${Number(plan.price).toFixed(0)}</span>
                <span className="text-sm text-cursor-text-muted">/{plan.interval}</span>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handleEdit(plan)}
                className="p-2 text-cursor-text-muted hover:text-accent-blue hover:bg-accent-blue/10 rounded-cursor-sm transition-all"
                title="Edit plan"
              >
                <Edit className="w-4 h-4" />
              </button>
              {onDelete && (
                <button
                  onClick={() => handleDelete(plan.id, plan.displayName)}
                  className="p-2 text-cursor-text-muted hover:text-danger hover:bg-danger/10 rounded-cursor-sm transition-all"
                  title="Delete plan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {plan.description && (
            <p className="text-sm text-cursor-text-secondary mb-4 line-clamp-2">
              {plan.description}
            </p>
          )}

          <div className="space-y-2 mb-4 pb-4 border-b border-cursor-border">
            <div className="flex items-center gap-2 text-sm text-cursor-text-secondary">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>{plan.maxRepositories} repositories</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-cursor-text-secondary">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>{plan.maxAIRequests} AI requests/month</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-cursor-text-muted">
              <Users className="w-4 h-4" />
              <span>{plan._count?.subscriptions || 0} subscribers</span>
            </div>
            <div className={`px-2 py-1 rounded-cursor-sm text-xs font-medium ${
              plan.isActive 
                ? 'bg-success/10 text-success' 
                : 'bg-cursor-text-muted/10 text-cursor-text-muted'
            }`}>
              {plan.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>
        </GlassPanel>
        ))}
      </div>
    </div>
  );
}
