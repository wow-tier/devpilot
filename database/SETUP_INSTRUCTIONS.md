# 🚀 Database Setup Instructions

## Complete PostgreSQL Setup for DevPilot

### Step 1: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the devpilot database
CREATE DATABASE devpilot;

# Connect to it
\c devpilot;

# Exit
\q
```

### Step 2: Run Schema

```bash
# Run the complete schema
psql -U postgres -d devpilot < database/schema.sql

# Or if you prefer the Prisma way:
npx prisma db push
```

### Step 3: Seed Data (Optional)

```bash
# Add sample data for testing
psql -U postgres -d devpilot < database/seed.sql
```

### Step 4: Configure Environment

```bash
# Copy example env
cp .env.example .env

# Edit .env and update:
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/devpilot?schema=public"
```

### Step 5: Generate Prisma Client

```bash
npx prisma generate
```

### Step 6: Run Migrations

```bash
npx prisma migrate dev --name initial_schema
```

---

## Quick Docker Setup

```bash
# Start PostgreSQL with Docker
docker run --name devpilot-db \
  -e POSTGRES_PASSWORD=devpilot123 \
  -e POSTGRES_DB=devpilot \
  -p 5432:5432 \
  -d postgres:15

# Wait a few seconds, then run schema
docker exec -i devpilot-db psql -U postgres -d devpilot < database/schema.sql

# Seed data (optional)
docker exec -i devpilot-db psql -U postgres -d devpilot < database/seed.sql
```

Then update `.env`:
```
DATABASE_URL="postgresql://postgres:devpilot123@localhost:5432/devpilot?schema=public"
```

---

## Database Features

### ✅ User Management
- Email/password authentication
- GitHub OAuth integration
- Session management
- Email verification

### ✅ Subscription & Billing
- Multiple plans (Free, Pro, Enterprise)
- Stripe integration ready
- Payment history
- Usage tracking

### ✅ Repository Management
- GitHub repository sync
- Branch tracking
- Commit history
- Multi-user collaboration

### ✅ AI Features
- Code modification history
- Multiple AI model support
- Token usage tracking
- API key management

### ✅ Analytics
- Daily usage statistics
- Activity logging
- User behavior tracking
- Performance metrics

### ✅ Collaboration
- Team management
- Role-based access
- Shared repositories
- Member invitations

### ✅ Notifications
- In-app notifications
- Webhook support
- Event subscriptions
- Real-time updates

---

## Verify Installation

```bash
# Check tables exist
psql -U postgres -d devpilot -c "\dt"

# View sample data
psql -U postgres -d devpilot -c "SELECT * FROM \"Plan\";"

# Check user count
psql -U postgres -d devpilot -c "SELECT COUNT(*) FROM \"User\";"

# Test connection from app
npm run dev
```

---

## Database Schema Overview

### Core Tables
- **User** - User accounts and profiles
- **Session** - Authentication sessions
- **Plan** - Subscription plans
- **Subscription** - User subscriptions
- **Payment** - Payment records

### Repository Tables
- **Repository** - Git repositories
- **Branch** - Repository branches
- **Commit** - Commit history

### AI Tables
- **ApiKey** - AI provider API keys
- **CodeModification** - AI code changes

### Analytics Tables
- **UsageStats** - Daily usage metrics
- **ActivityLog** - User activity

### Collaboration Tables
- **Team** - Team workspaces
- **TeamMember** - Team membership

### Communication Tables
- **Notification** - User notifications
- **Webhook** - External webhooks

---

## Default Plans

| Plan | Price | AI Requests | Repositories | Storage |
|------|-------|-------------|--------------|---------|
| Free | $0/mo | 100/month | 5 | 1GB |
| Pro | $29/mo | 10,000/month | 50 | 10GB |
| Enterprise | $99/mo | Unlimited | Unlimited | Unlimited |

---

## Test User

After running seed data:
- **Email**: demo@aicode.dev
- **Password**: demo123
- **Plan**: Free

---

## Troubleshooting

### Connection Issues
```bash
# Test PostgreSQL is running
pg_isready

# Check port
lsof -i :5432

# Restart PostgreSQL
brew services restart postgresql@15  # macOS
sudo systemctl restart postgresql     # Linux
```

### Schema Issues
```bash
# Reset database
psql -U postgres -c "DROP DATABASE devpilot;"
psql -U postgres -c "CREATE DATABASE devpilot;"

# Re-run schema
psql -U postgres -d devpilot < database/schema.sql
```

### Prisma Issues
```bash
# Reset Prisma
npx prisma migrate reset

# Regenerate client
npx prisma generate

# Push schema
npx prisma db push
```

---

## Production Deployment

### Recommended Providers
- **Supabase** - Free tier, managed PostgreSQL
- **Railway** - $5/month, easy deployment
- **Neon** - Serverless PostgreSQL
- **AWS RDS** - Enterprise grade
- **DigitalOcean** - Managed databases

### Production Checklist
- [ ] Use SSL connections (`?sslmode=require`)
- [ ] Set strong passwords
- [ ] Enable connection pooling
- [ ] Set up automated backups
- [ ] Configure monitoring
- [ ] Limit user permissions
- [ ] Enable audit logging

---

## Next Steps

1. ✅ Database created
2. ✅ Schema applied
3. ✅ Seed data loaded
4. ✅ .env configured
5. ✅ Prisma client generated
6. 🚀 Start building!

```bash
npm run dev
```

Visit: http://localhost:3000
