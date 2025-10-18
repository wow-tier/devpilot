import { useState } from 'react';
import { Key, CheckCircle, XCircle, Plus, Save, Trash2, Eye, EyeOff } from 'lucide-react';
import { GlassPanel, AccentButton } from '../../components/ui';

interface SystemApiKey {
  id: string;
  provider: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  lastUsed: string | null;
  hasKey: boolean;
}

interface SystemApiKeysTableProps {
  keys: SystemApiKey[];
  onRefresh: () => void;
}

export default function SystemApiKeysTable({ keys, onRefresh }: SystemApiKeysTableProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [formData, setFormData] = useState({ provider: 'openai', apiKey: '', name: '' });
  const [saving, setSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  const providers = [
    { id: 'openai', name: 'OpenAI', icon: '🤖', description: 'GPT-4, GPT-3.5 Turbo' },
    { id: 'claude', name: 'Claude', icon: '🧠', description: 'Claude 3 Opus, Sonnet, Haiku' },
    { id: 'grok', name: 'Grok', icon: '⚡', description: 'xAI Grok' }
  ];

  const handleSave = async () => {
    if (!formData.apiKey) {
      setError('API key is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/system-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setFormData({ provider: 'openai', apiKey: '', name: '' });
        setShowForm(false);
        setEditingProvider(null);
        onRefresh();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save API key');
      }
    } catch (error) {
      console.error('Error saving API key:', error);
      setError('Failed to save API key');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (provider: string) => {
    if (!confirm(`Are you sure you want to delete the ${provider} API key?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/system-keys?provider=${provider}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting API key:', error);
    }
  };

  const handleEdit = (provider: string) => {
    const existingKey = keys.find(k => k.provider === provider);
    setEditingProvider(provider);
    setFormData({
      provider,
      apiKey: '',
      name: existingKey?.name || `${provider} API Key`
    });
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {providers.map((provider) => {
          const keyInfo = keys.find(k => k.provider === provider.id);
          const hasKey = keyInfo?.hasKey || false;
          const isActive = keyInfo?.isActive || false;

          return (
            <GlassPanel key={provider.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{provider.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-cursor-text">{provider.name}</h3>
                    <p className="text-xs text-cursor-text-muted">{provider.description}</p>
                  </div>
                </div>
                {hasKey && isActive ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <XCircle className="w-5 h-5 text-cursor-text-muted" />
                )}
              </div>

              <div className="flex gap-2">
                <AccentButton
                  size="sm"
                  variant={hasKey ? 'secondary' : 'primary'}
                  icon={hasKey ? <Key className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  onClick={() => handleEdit(provider.id)}
                  className="flex-1"
                >
                  {hasKey ? 'Update' : 'Add Key'}
                </AccentButton>
                {hasKey && (
                  <button
                    onClick={() => handleDelete(provider.id)}
                    className="p-2 text-cursor-text-muted hover:text-danger hover:bg-danger/10 rounded-cursor-sm transition-all"
                    title="Delete key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </GlassPanel>
          );
        })}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <GlassPanel className="p-6">
          <h3 className="text-lg font-semibold text-cursor-text mb-4">
            {editingProvider ? `Update ${editingProvider} API Key` : 'Add API Key'}
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-cursor-sm text-danger text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-semibold text-cursor-text mb-2">
                Provider
              </label>
              <select
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                className="input-cursor w-full"
                disabled={!!editingProvider}
              >
                <option value="openai">OpenAI</option>
                <option value="claude">Claude (Anthropic)</option>
                <option value="grok">Grok (xAI)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-cursor-text mb-2">
                API Key Name (Optional)
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-cursor w-full"
                placeholder={`${formData.provider} Production Key`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-cursor-text mb-2">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="input-cursor w-full pr-10"
                  placeholder="sk-..."
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cursor-text-muted hover:text-cursor-text"
                  type="button"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-cursor-text-muted mt-1.5">
                This key will be encrypted and stored securely
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <AccentButton
                icon={saving ? undefined : <Save className="w-4 h-4" />}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save API Key'}
              </AccentButton>
              <AccentButton
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingProvider(null);
                  setFormData({ provider: 'openai', apiKey: '', name: '' });
                  setError('');
                }}
              >
                Cancel
              </AccentButton>
            </div>
          </div>
        </GlassPanel>
      )}

      {/* Info Panel */}
      <GlassPanel className="p-6 bg-accent-blue/5 border-accent-blue/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-accent-blue/20 rounded-cursor-md flex items-center justify-center flex-shrink-0">
            <Key className="w-5 h-5 text-accent-blue" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-cursor-text mb-2">System API Keys</h4>
            <p className="text-sm text-cursor-text-secondary leading-relaxed">
              These API keys are used by all users when they interact with AI assistants in the workspace. 
              Keys are encrypted and stored securely. Users can select which AI provider to use from the available options.
            </p>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
