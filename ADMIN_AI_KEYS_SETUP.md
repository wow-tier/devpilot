# Admin AI Keys Setup Guide

This guide explains how to configure AI providers (OpenAI, Claude, Grok) in the admin panel for use by all users.

## Overview

The AI Code Agent now supports multiple AI providers that can be configured by administrators. Users can then select which AI provider to use when working in the workspace.

## Features Added

### 1. Admin Panel - System AI Keys Tab
- New tab in admin panel for managing system-wide AI API keys
- Support for three providers:
  - **OpenAI** (GPT-4, GPT-3.5 Turbo)
  - **Claude** (Anthropic - Claude 3 Opus, Sonnet, Haiku)
  - **Grok** (xAI)

### 2. Secure Key Storage
- API keys are **encrypted** before storage
- Keys are stored in the database with AES-256-CBC encryption
- Only decrypted when needed for API calls
- Uses environment variable `SYSTEM_KEYS_ENCRYPTION_KEY` (auto-generated if not set)

### 3. User Workspace Integration
- Users see a provider selector in the AI chat panel
- Only configured providers are available for selection
- Provider selection is remembered during the session
- AI responses show which provider is being used

## How to Use

### For Administrators

1. **Access Admin Panel**
   - Login with an admin account (email containing "admin" or ending in "@admin.com")
   - Navigate to `/admin`
   - Click on "System AI Keys" tab

2. **Add an AI Provider**
   - Click "Add Key" or "Update" on the provider card
   - Enter the API key for that provider:
     - **OpenAI**: Get from https://platform.openai.com/api-keys
     - **Claude**: Get from https://console.anthropic.com/
     - **Grok**: Get from https://x.ai/ (xAI platform)
   - Optionally add a name for the key (e.g., "Production Key")
   - Click "Save API Key"

3. **Manage Keys**
   - View which providers are configured (green checkmark = active)
   - Update existing keys at any time
   - Delete keys if needed
   - Keys are automatically encrypted upon saving

### For Users

1. **Select AI Provider**
   - Open the workspace with a repository
   - In the right panel (AI Chat), you'll see an "AI Provider" dropdown
   - Select from available providers (only configured ones shown)
   - The selection applies to all subsequent AI requests

2. **Use AI Assistant**
   - Type your prompt in the AI chat
   - The selected provider will process your request
   - AI responses will indicate which provider was used

## API Endpoints

### Admin Endpoints (Authentication Required)

- `GET /api/admin/system-keys` - List all configured system keys
- `POST /api/admin/system-keys` - Add or update a system key
- `DELETE /api/admin/system-keys?provider={provider}` - Delete a system key

### User Endpoints

- `GET /api/ai/providers` - Get list of available AI providers
- `POST /api/prompt` - Submit AI prompt (now accepts `provider` parameter)

## Database Schema

System API keys are stored in the `ActivityLog` table with:
- `action`: Format `system_api_key_{provider}` (e.g., `system_api_key_openai`)
- `resource`: Encrypted API key
- `metadata`: JSON with key info (name, isActive, etc.)

## Security Features

1. **Encryption**: All API keys encrypted before storage
2. **Access Control**: Only admins can manage system keys
3. **Token Authentication**: All endpoints require valid JWT tokens
4. **No Key Exposure**: Keys never returned in API responses (only "hasKey" boolean)

## Environment Variables

```bash
# Optional: Set a custom encryption key (32+ characters recommended)
SYSTEM_KEYS_ENCRYPTION_KEY=your-secure-encryption-key-here
```

If not set, a random key will be generated (but won't persist across restarts in production).

## Example Usage

### Adding OpenAI Key (Admin)
```bash
POST /api/admin/system-keys
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "provider": "openai",
  "apiKey": "sk-proj-xxxxxxxxxxxxx",
  "name": "OpenAI Production Key"
}
```

### Getting Available Providers (User)
```bash
GET /api/ai/providers
Authorization: Bearer <user-token>

Response:
{
  "providers": [
    { "id": "openai", "name": "OpenAI", "available": true },
    { "id": "claude", "name": "Claude", "available": true },
    { "id": "grok", "name": "Grok", "available": false }
  ],
  "defaultProvider": "openai"
}
```

### Submitting AI Prompt with Provider (User)
```bash
POST /api/prompt
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "prompt": "Add error handling to this function",
  "filePaths": ["src/utils/api.ts"],
  "provider": "claude"
}
```

## Troubleshooting

### Keys Not Appearing
- Ensure you're logged in as admin
- Check that the API key was saved successfully
- Verify the key is marked as "Active" in metadata

### Provider Not Available for Users
- Admin must add the API key first
- Key must be marked as active
- User needs to refresh the workspace page

### Encryption Errors
- Set `SYSTEM_KEYS_ENCRYPTION_KEY` in environment variables
- Ensure it's at least 32 characters long
- Key must be consistent across app restarts

## Provider-Specific Notes

### OpenAI
- Supports GPT-4, GPT-3.5 Turbo, and other models
- Key format: `sk-proj-...` or `sk-...`
- Rate limits apply based on your OpenAI plan

### Claude (Anthropic)
- Supports Claude 3 Opus, Sonnet, and Haiku
- Key format: `sk-ant-...`
- Different pricing tiers available

### Grok (xAI)
- xAI's Grok model
- Key format varies
- Check xAI documentation for latest info

## Next Steps

To fully integrate the AI providers:

1. Update `src/app/lib/ai.ts` to handle multiple providers
2. Implement provider-specific API calls
3. Add error handling for provider-specific responses
4. Configure rate limiting per provider
5. Add usage tracking and analytics

---

**Security Note**: Never commit API keys to version control. Always use environment variables or the admin panel to configure keys.
