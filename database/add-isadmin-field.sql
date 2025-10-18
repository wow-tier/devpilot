-- Add isAdmin field to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- Create index on isAdmin for faster admin checks
CREATE INDEX IF NOT EXISTS "User_isAdmin_idx" ON "User"("isAdmin");

-- Set bob@bob.com as admin
UPDATE "User" SET "isAdmin" = true WHERE email = 'bob@bob.com';

-- Verify the update
SELECT id, email, "isAdmin", name, "createdAt" FROM "User" WHERE email = 'bob@bob.com';
