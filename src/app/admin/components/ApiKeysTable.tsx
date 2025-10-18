import { Trash2, Key, Calendar, User, CheckCircle, XCircle } from 'lucide-react';
import { GlassPanel } from '../../components/ui';

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

interface ApiKeysTableProps {
  apiKeys: ApiKey[];
  onDelete?: (id: string) => void;
}

export default function ApiKeysTable({ apiKeys, onDelete }: ApiKeysTableProps) {
  const handleDelete = (id: string, name: string) => {
    if (onDelete && confirm(`Are you sure you want to delete API key "${name}"?`)) {
      onDelete(id);
    }
  };

  if (apiKeys.length === 0) {
    return (
      <GlassPanel className="p-8 text-center">
        <div className="text-4xl mb-3 opacity-50">🔑</div>
        <p className="text-cursor-text-secondary">No API keys found</p>
      </GlassPanel>
    );
  }

  return (
    <div className="space-y-3">
      {apiKeys.map((apiKey) => (
        <GlassPanel key={apiKey.id} className="p-5 hover:border-accent-blue/30 transition-all">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-accent-purple/20 rounded-cursor-md flex items-center justify-center">
                  <Key className="w-5 h-5 text-accent-purple" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-cursor-text">{apiKey.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-cursor-text-muted">
                    <span className="px-2 py-0.5 bg-accent-blue/10 text-accent-blue rounded text-xs font-medium">
                      {apiKey.provider.toUpperCase()}
                    </span>
                    <span className={`flex items-center gap-1 ${apiKey.isActive ? 'text-success' : 'text-cursor-text-muted'}`}>
                      {apiKey.isActive ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      {apiKey.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-cursor-text-secondary">
                  <User className="w-4 h-4" />
                  <span>{apiKey.user.name || apiKey.user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-cursor-text-secondary">
                  <Calendar className="w-4 h-4" />
                  <span>Created {new Date(apiKey.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {onDelete && (
              <button
                onClick={() => handleDelete(apiKey.id, apiKey.name)}
                className="p-2 text-cursor-text-muted hover:text-danger hover:bg-danger/10 rounded-cursor-sm transition-all"
                title="Delete API key"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </GlassPanel>
      ))}
    </div>
  );
}
