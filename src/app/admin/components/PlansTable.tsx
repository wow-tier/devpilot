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
  );
}
