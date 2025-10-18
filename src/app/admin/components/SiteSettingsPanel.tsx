import { useState, useEffect } from 'react';
import { Save, Upload, Code2, Loader2 } from 'lucide-react';
import { GlassPanel, AccentButton } from '../../components/ui';
import Image from 'next/image';

interface SiteSettings {
  siteName: string;
  logoUrl: string | null;
  tagline: string;
  supportEmail: string;
  primaryColor: string;
  secondaryColor: string;
}

export default function SiteSettingsPanel() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'AI Code Agent',
    logoUrl: null,
    tagline: 'The AI-powered IDE for modern developers',
    supportEmail: 'support@example.com',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/admin/site-settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/admin/site-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setSettings({ ...settings, logoUrl: data.logoUrl });
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to upload logo');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      setError('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {success && (
        <div className="p-4 bg-success/10 border border-success/30 rounded-cursor-sm text-success text-sm flex items-center gap-2">
          <span>✓</span>
          Settings saved successfully!
        </div>
      )}

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/30 rounded-cursor-sm text-danger text-sm">
          {error}
        </div>
      )}

      {/* Logo Section */}
      <GlassPanel className="p-6">
        <h3 className="text-lg font-semibold text-cursor-text mb-4">Site Logo</h3>
        
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 bg-cursor-surface-hover rounded-cursor-md flex items-center justify-center border border-cursor-border">
            {settings.logoUrl ? (
              <Image 
                src={settings.logoUrl} 
                alt="Site Logo" 
                width={128}
                height={128}
                className="object-contain"
              />
            ) : (
              <Code2 className="w-12 h-12 text-accent-blue" />
            )}
          </div>
          
          <div>
            <input
              type="file"
              id="logo-upload"
              accept="image/png,image/svg+xml,image/jpeg"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <label
              htmlFor="logo-upload"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-cursor-sm border border-cursor-border bg-cursor-surface hover:bg-cursor-surface-hover text-cursor-text transition-all cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Logo
                </>
              )}
            </label>
            <p className="text-xs text-cursor-text-muted mt-2">
              PNG, SVG or JPEG. Max 1MB. Recommended: 256x256px
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* Basic Information */}
      <GlassPanel className="p-6">
        <h3 className="text-lg font-semibold text-cursor-text mb-4">Basic Information</h3>
        
        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-semibold text-cursor-text mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="input-cursor w-full"
              placeholder="AI Code Agent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-cursor-text mb-2">
              Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="input-cursor w-full"
              placeholder="The AI-powered IDE for modern developers"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-cursor-text mb-2">
              Support Email
            </label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="input-cursor w-full"
              placeholder="support@example.com"
            />
          </div>
        </div>
      </GlassPanel>

      {/* Brand Colors */}
      <GlassPanel className="p-6">
        <h3 className="text-lg font-semibold text-cursor-text mb-4">Brand Colors</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <div>
            <label className="block text-sm font-semibold text-cursor-text mb-2">
              Primary Color
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="w-16 h-10 rounded-cursor-sm border border-cursor-border cursor-pointer"
              />
              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="input-cursor flex-1"
                placeholder="#3b82f6"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-cursor-text mb-2">
              Secondary Color
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={settings.secondaryColor}
                onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                className="w-16 h-10 rounded-cursor-sm border border-cursor-border cursor-pointer"
              />
              <input
                type="text"
                value={settings.secondaryColor}
                onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                className="input-cursor flex-1"
                placeholder="#8b5cf6"
              />
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* Save Button */}
      <div className="flex gap-3">
        <AccentButton
          onClick={handleSave}
          disabled={saving}
          icon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </AccentButton>
      </div>
    </div>
  );
}
