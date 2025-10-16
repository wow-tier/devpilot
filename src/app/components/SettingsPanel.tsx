'use client';

import React, { useState } from 'react';

export interface Settings {
  theme: 'dark' | 'light' | 'monokai' | 'dracula';
  fontSize: number;
  aiModel: 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3';
  autoSave: boolean;
  formatOnSave: boolean;
  minimap: boolean;
  lineNumbers: boolean;
  wordWrap: boolean;
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export default function SettingsPanel({ isOpen, onClose, settings, onSettingsChange }: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Theme
            </label>
            <select
              value={localSettings.theme}
              onChange={(e) => updateSetting('theme', e.target.value as Settings['theme'])}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="monokai">Monokai</option>
              <option value="dracula">Dracula</option>
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Font Size: {localSettings.fontSize}px
            </label>
            <input
              type="range"
              min="10"
              max="24"
              value={localSettings.fontSize}
              onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* AI Model */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              AI Model
            </label>
            <select
              value={localSettings.aiModel}
              onChange={(e) => updateSetting('aiModel', e.target.value as Settings['aiModel'])}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="gpt-4">GPT-4 (Most Capable)</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
              <option value="claude-3">Claude 3 (Alternative)</option>
            </select>
          </div>

          {/* Editor Options */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-300">Editor</h3>
            
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Auto Save</span>
              <input
                type="checkbox"
                checked={localSettings.autoSave}
                onChange={(e) => updateSetting('autoSave', e.target.checked)}
                className="rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Format on Save</span>
              <input
                type="checkbox"
                checked={localSettings.formatOnSave}
                onChange={(e) => updateSetting('formatOnSave', e.target.checked)}
                className="rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Show Minimap</span>
              <input
                type="checkbox"
                checked={localSettings.minimap}
                onChange={(e) => updateSetting('minimap', e.target.checked)}
                className="rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Line Numbers</span>
              <input
                type="checkbox"
                checked={localSettings.lineNumbers}
                onChange={(e) => updateSetting('lineNumbers', e.target.checked)}
                className="rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Word Wrap</span>
              <input
                type="checkbox"
                checked={localSettings.wordWrap}
                onChange={(e) => updateSetting('wordWrap', e.target.checked)}
                className="rounded"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
