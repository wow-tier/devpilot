import { Trash2, DollarSign, Users, CheckCircle, Database } from 'lucide-react';
import { GlassPanel } from '../../components/ui';

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
}

export default function PlansTable({ plans, onDelete }: PlansTableProps) {
  const handleDelete = (id: string, name: string) => {
    if (onDelete && confirm(`Are you sure you want to delete the ${name} plan?`)) {
      onDelete(id);
    }
  };

  if (plans.length === 0) {
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
