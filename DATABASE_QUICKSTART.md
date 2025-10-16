# 🚀 Database Quick Start - DevPilot

## One-Command Setup

```bash
npm run db:setup
```

This will:
- ✅ Start PostgreSQL (Docker)
- ✅ Create `devpilot` database
- ✅ Apply schema (15 tables)
- ✅ Load seed data (optional)
- ✅ Update `.env` file
- ✅ Generate Prisma client

---

## Manual Setup

### Step 1: Start PostgreSQL

**Option A - Docker (Easiest):**
```bash
docker run --name devpilot-db \
  -e POSTGRES_PASSWORD=devpilot123 \
  -e POSTGRES_DB=devpilot \
  -p 5432:5432 \
  -d postgres:15
```

**Option B - Local PostgreSQL:**
```bash
createdb devpilot
```

### Step 2: Run Schema

```bash
psql -U postgres -d devpilot < database/schema.sql
```

### Step 3: Load Seed Data (Optional)

```bash
psql -U postgres -d devpilot < database/seed.sql
```

### Step 4: Configure Environment

```bash
# Copy .env
cp .env.example .env

# Edit .env and set:
DATABASE_URL="postgresql://postgres:devpilot123@localhost:5432/devpilot?schema=public"
```

### Step 5: Generate Prisma Client

```bash
npm run db:generate
```

---

## Database Structure

### 📊 **15 Tables Created:**

#### **Authentication (2 tables)**
- `User` - User accounts with email/password
- `Session` - Active user sessions

#### **Billing (3 tables)**
- `Plan` - Subscription plans (Free, Pro, Enterprise)
- `Subscription` - User subscriptions
- `Payment` - Payment history

#### **Repositories (3 tables)**
- `Repository` - GitHub repositories
- `Branch` - Repository branches
- `Commit` - Commit history

#### **AI Features (2 tables)**
- `ApiKey` - AI provider API keys
- `CodeModification` - AI code changes

#### **Analytics (2 tables)**
- `UsageStats` - Daily usage metrics
- `ActivityLog` - User activity tracking

#### **Collaboration (2 tables)**
- `Team` - Team workspaces
- `TeamMember` - Team members

#### **Communication (2 tables)**
- `Notification` - User notifications
- `Webhook` - External webhooks

---

## Default Plans

| Plan | ID | Price | AI Requests | Repos |
|------|-----|-------|-------------|-------|
| Free | `plan_free` | $0/mo | 100/mo | 5 |
| Pro | `plan_pro` | $29/mo | 10,000/mo | 50 |
| Enterprise | `plan_enterprise` | $99/mo | ♾️ Unlimited | ♾️ |

---

## Test Credentials (after seed)

**Email:** demo@aicode.dev  
**Password:** demo123  
**Plan:** Free  
**Repositories:** 3 sample repos

---

## Useful Commands

```bash
# Database setup
npm run db:setup          # Complete automated setup

# Prisma commands
npm run db:generate       # Generate Prisma Client
npm run db:migrate        # Run migrations
npm run db:push           # Push schema changes
npm run db:studio         # Open database browser

# Direct SQL
npm run db:seed           # Load seed data

# Verify setup
psql -U postgres -d devpilot -c "\dt"
psql -U postgres -d devpilot -c "SELECT * FROM \"Plan\";"
```

---

## Connection String

After setup, your `.env` should have:

```env
DATABASE_URL="postgresql://postgres:devpilot123@localhost:5432/devpilot?schema=public"
OPENAI_API_KEY=your_key_here
NEXTAUTH_SECRET=your_secret_here
```

---

## Verify Installation

```bash
# 1. Check tables
psql -U postgres -d devpilot -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"

# 2. Count records
psql -U postgres -d devpilot -c "SELECT 'Users: ' || COUNT(*) FROM \"User\";"
psql -U postgres -d devpilot -c "SELECT 'Plans: ' || COUNT(*) FROM \"Plan\";"
psql -U postgres -d devpilot -c "SELECT 'Repos: ' || COUNT(*) FROM \"Repository\";"

# 3. Test connection from app
npm run dev
```

---

## Troubleshooting

### PostgreSQL Not Running
```bash
# Check status
pg_isready

# Start with Docker
docker start devpilot-db

# Or system service
sudo systemctl start postgresql  # Linux
brew services start postgresql   # macOS
```

### Connection Refused
```bash
# Check PostgreSQL is listening
netstat -an | grep 5432

# Check credentials
psql -U postgres -d devpilot -c "SELECT 1;"
```

### Schema Errors
```bash
# Reset database
psql -U postgres -c "DROP DATABASE devpilot;"
psql -U postgres -c "CREATE DATABASE devpilot;"
psql -U postgres -d devpilot < database/schema.sql
```

### Prisma Issues
```bash
# Clear and regenerate
rm -rf node_modules/.prisma
npx prisma generate
```

---

## Production Deployment

### Supabase
```bash
# Get connection string from Supabase dashboard
DATABASE_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

### Railway
```bash
# Railway provides DATABASE_URL automatically
# Just run migrations:
npx prisma migrate deploy
```

### Heroku
```bash
# Heroku provides DATABASE_URL
# Add buildpack:
heroku buildpacks:add heroku/nodejs

# Run migrations
heroku run npx prisma migrate deploy
```

---

## Schema Information

- **Total Tables:** 15
- **Total Indexes:** 35+
- **Total Functions:** 1 (auto-update timestamp)
- **Total Triggers:** 8
- **Total Views:** 2

---

## Quick Test

```bash
# Run setup
npm run db:setup

# Generate client
npm run db:generate

# Start app
npm run dev

# Open browser
# Go to: http://localhost:3000/login
# Use: demo@aicode.dev / demo123
```

---

## Summary

✅ **Database:** `devpilot`  
✅ **Tables:** 15 tables with relationships  
✅ **Seed Data:** Sample user, repos, plans  
✅ **Prisma:** ORM configured  
✅ **Build:** Passing ✅  
✅ **Ready:** Production-ready!  

**Your database is ready! 🎉**
