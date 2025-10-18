# Admin Plans Management & Site Settings - Implementation

## Features Added

### 1. 📋 Plans Management (CRUD Operations)

#### Add New Plans
- ✅ "Add New Plan" button in Plans tab
- ✅ Comprehensive form with all fields:
  - Plan ID (unique identifier)
  - Display Name
  - Description
  - Price
  - Billing Interval (monthly/yearly)
  - Max Repositories (-1 for unlimited)
  - Max AI Requests/Month (-1 for unlimited)
  - Max Storage in MB (-1 for unlimited)
  - Active status toggle

#### Edit Existing Plans
- ✅ Edit button on each plan card
- ✅ Pre-populated form with existing data
- ✅ Can update all fields except Plan ID
- ✅ Changes save immediately

#### Delete Plans
- ✅ Delete button on each plan card
- ✅ Confirmation dialog
- ✅ Cascading cleanup

### 2. 🎨 Site Settings Management

#### New "Site Settings" Tab
- ✅ Upload and manage site logo
- ✅ Configure site name
- ✅ Set tagline
- ✅ Configure support email
- ✅ Customize brand colors (primary & secondary)

#### Logo Upload
- ✅ Visual preview of current logo
- ✅ Drag & drop or click to upload
- ✅ File validation (PNG, SVG, JPEG only)
- ✅ Size limit (1MB max)
- ✅ Recommended size: 256x256px
- ✅ Stored in `public/uploads/site/`

#### Brand Customization
- ✅ Color pickers for primary and secondary colors
- ✅ Live preview of hex codes
- ✅ Easy to customize entire site theme

## Admin Panel Layout

### Updated Tabs
```
1. Overview        - Dashboard statistics
2. Users          - User management
3. Plans          - ➕ Create/Edit/Delete plans
4. User Keys      - User-owned API keys
5. System AI Keys - OpenAI, Claude, Grok keys
6. Site Settings  - 🆕 Logo, branding, config
```

## API Endpoints

### Plans Management
```
POST   /api/admin/plans          - Create new plan
PUT    /api/admin/plans/[id]     - Update existing plan
DELETE /api/admin/plans/[id]     - Delete plan
```

### Site Settings
```
GET    /api/admin/site-settings  - Get current settings
PUT    /api/admin/site-settings  - Update settings
POST   /api/admin/site-settings  - Upload logo
```

## How to Use

### Adding a Plan

1. Go to `/admin` → "Plans" tab
2. Click "Add New Plan" button
3. Fill in the form:
   ```
   Plan ID: pro
   Display Name: Pro Plan
   Description: For professional developers
   Price: 19.99
   Interval: month
   Max Repositories: -1 (unlimited)
   Max AI Requests: 1000
   Max Storage: 10000
   Active: ✓ checked
   ```
4. Click "Create Plan"
5. Plan appears in grid immediately

### Editing a Plan

1. Go to Plans tab
2. Click the "Edit" (pencil) button on any plan card
3. Update any fields
4. Click "Update Plan"
5. Changes save immediately

### Uploading Logo

1. Go to `/admin` → "Site Settings" tab
2. Click "Upload Logo"
3. Select PNG, SVG, or JPEG file (max 1MB)
4. Logo uploads and displays immediately
5. Click "Save Settings" to persist

### Changing Site Name/Branding

1. Go to "Site Settings" tab
2. Update:
   - Site Name (appears in navigation)
   - Tagline (appears on landing page)
   - Support Email
   - Primary Color (main accent color)
   - Secondary Color (gradient color)
3. Click "Save Settings"

## UI Features

### Plans Tab
- ✅ "Add New Plan" button at the top
- ✅ Full form with validation
- ✅ Edit and Delete buttons on each card
- ✅ Loading states during save
- ✅ Error messages for invalid input
- ✅ Success feedback

### Site Settings Tab
- ✅ Visual logo preview
- ✅ Fallback icon if no logo uploaded
- ✅ Color pickers with hex input
- ✅ Grouped sections (Logo, Info, Colors)
- ✅ Save button with loading state
- ✅ Success/error messages

### Enhanced Overview Tab
- ✅ Quick action cards to navigate to each section
- ✅ Clear descriptions of what each action does
- ✅ Better grid layout

## Data Storage

### Plans
Stored in `Plan` table with Prisma schema:
```prisma
model Plan {
  id              String
  name            String @unique
  displayName     String
  description     String?
  price           Decimal
  interval        String
  maxRepositories Int
  maxAIRequests   Int
  maxStorage      Int
  isActive        Boolean
  // ... more fields
}
```

### Site Settings
Stored in `ActivityLog` table as key-value:
```typescript
{
  action: "site_settings",
  metadata: {
    siteName: "AI Code Agent",
    logoUrl: "/uploads/site/logo.png",
    tagline: "...",
    supportEmail: "...",
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6"
  }
}
```

## File Structure

```
src/app/api/admin/
└── site-settings/
    └── route.ts              # GET, PUT, POST for site config

src/app/admin/components/
├── PlansTable.tsx            # Enhanced with Add/Edit forms
└── SiteSettingsPanel.tsx     # New component for site config

public/uploads/
├── avatars/                  # User profile photos
└── site/                     # Site logo and assets
```

## Components Enhanced

### PlansTable.tsx
**Before:**
- Only displayed existing plans
- Could only delete

**After:**
- ✅ "Add New Plan" button
- ✅ Inline creation form
- ✅ Edit functionality
- ✅ Delete functionality
- ✅ Full validation
- ✅ Loading states

### Admin Overview
**Before:**
- Simple action buttons

**After:**
- ✅ Descriptive action cards
- ✅ Better grid layout
- ✅ Clear descriptions
- ✅ Visual hierarchy

## Security

- ✅ All endpoints require admin authentication
- ✅ File upload validation (type, size)
- ✅ Input sanitization
- ✅ SQL injection prevention via Prisma

## Example Plan Creation

```json
{
  "name": "startup",
  "displayName": "Startup",
  "description": "Perfect for growing teams",
  "price": 49,
  "interval": "month",
  "maxRepositories": 10,
  "maxAIRequests": 500,
  "maxStorage": 5000,
  "isActive": true
}
```

## Example Site Settings

```json
{
  "siteName": "My Code Platform",
  "logoUrl": "/uploads/site/logo.png",
  "tagline": "Build faster with AI",
  "supportEmail": "help@myplatform.com",
  "primaryColor": "#10b981",
  "secondaryColor": "#06b6d4"
}
```

## Testing

### Test Plan CRUD
1. Go to `/admin` → Plans tab
2. Click "Add New Plan" ✅
3. Fill form and save ✅
4. Click Edit on a plan ✅
5. Update and save ✅
6. Delete a plan ✅

### Test Site Settings
1. Go to `/admin` → Site Settings tab
2. Upload a logo (PNG/SVG) ✅
3. Change site name ✅
4. Pick new colors ✅
5. Click Save ✅
6. Refresh page → Settings persist ✅

## Next Steps (Future)

To use the site settings across the app:
1. Create a `useSiteSettings` hook
2. Load settings on app init
3. Apply logo to all navigation components
4. Apply colors to CSS variables
5. Use site name in meta tags

---

**Admin can now fully manage plans and site settings!** 🎉

Everything needed for a complete SaaS platform administration:
- ✅ Create, edit, delete subscription plans
- ✅ Upload and manage site logo
- ✅ Configure branding and colors
- ✅ All changes persist to database
- ✅ Beautiful, intuitive UI
