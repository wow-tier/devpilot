# Fix Admin Access - Update Instructions

## Problem
The admin check was using email pattern matching (`email.includes('admin')`) instead of checking the actual `isAdmin` field in the database.

## Solution Implemented

### 1. Updated Prisma Schema
Added `isAdmin` field to the User model:
```prisma
model User {
  ...
  isAdmin       Boolean   @default(false)
  ...
  @@index([isAdmin])
}
```

### 2. Created Centralized Admin Check
Created `/src/app/lib/admin-auth.ts` that checks the actual `isAdmin` field from the database.

### 3. Updated All Admin Routes
All admin API routes now use the centralized `checkAdmin` function that checks `session.user.isAdmin`.

## Database Update Required

You need to run a migration to add the `isAdmin` field and set your user as admin.

### Option 1: Run the SQL Script
```bash
# Run the SQL script directly on your database
psql $DATABASE_URL -f database/add-isadmin-field.sql
```

### Option 2: Run SQL Manually
Connect to your database and run:
```sql
-- Add isAdmin field
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- Create index
CREATE INDEX IF NOT EXISTS "User_isAdmin_idx" ON "User"("isAdmin");

-- Set bob@bob.com as admin
UPDATE "User" SET "isAdmin" = true WHERE email = 'bob@bob.com';

-- Verify
SELECT id, email, "isAdmin", name FROM "User" WHERE email = 'bob@bob.com';
```

### Option 3: Create Prisma Migration
```bash
# Create a migration
npx prisma migrate dev --name add-isadmin-field

# Then update the user
npx prisma studio
# In Prisma Studio, find bob@bob.com and set isAdmin to true
```

### Option 4: Quick SQL via psql
```bash
# Direct command
psql $DATABASE_URL -c "ALTER TABLE \"User\" ADD COLUMN IF NOT EXISTS \"isAdmin\" BOOLEAN NOT NULL DEFAULT false;"
psql $DATABASE_URL -c "CREATE INDEX IF NOT EXISTS \"User_isAdmin_idx\" ON \"User\"(\"isAdmin\");"
psql $DATABASE_URL -c "UPDATE \"User\" SET \"isAdmin\" = true WHERE email = 'bob@bob.com';"
psql $DATABASE_URL -c "SELECT email, \"isAdmin\" FROM \"User\" WHERE email = 'bob@bob.com';"
```

## After Running Migration

1. **Rebuild the application:**
   ```bash
   npm run build
   ```

2. **Restart the server:**
   ```bash
   npm restart
   # or
   pm2 restart devpilot
   ```

3. **Test admin access:**
   - Login as bob@bob.com
   - Navigate to `/admin`
   - You should now have access!

## Making Other Users Admin

To make another user an admin:
```sql
UPDATE "User" SET "isAdmin" = true WHERE email = 'another@user.com';
```

Or via Prisma Studio:
```bash
npx prisma studio
# Find the user and toggle isAdmin to true
```

## Files Modified

- `prisma/schema.prisma` - Added isAdmin field
- `src/app/lib/admin-auth.ts` - New centralized admin check
- All `/src/app/api/admin/**/route.ts` - Now use checkAdmin from admin-auth.ts
- `database/add-isadmin-field.sql` - Migration SQL script

## Security Note

The admin check now properly validates against the database `isAdmin` field instead of email patterns. This is more secure and flexible.
