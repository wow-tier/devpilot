# 🗄️ PostgreSQL Database Setup Guide

## Quick Start

### 1. Install PostgreSQL

#### macOS (using Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Windows
Download from: https://www.postgresql.org/download/windows/

#### Docker (Recommended for Development)
```bash
docker run --name ai-code-agent-db \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=ai_code_agent \
  -p 5432:5432 \
  -d postgres:15
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ai_code_agent;

# Create user (optional)
CREATE USER aiagent WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE ai_code_agent TO aiagent;

# Exit
\q
```

### 3. Configure Environment

Update `.env` file:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/ai_code_agent?schema=public"
```

### 4. Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# Optional: Open Prisma Studio to view data
npx prisma studio
```

---

## Database Schema

### Users Table
```sql
- id: String (Primary Key)
- email: String (Unique)
- name: String (Optional)
- password: String (Hashed)
- createdAt: DateTime
- updatedAt: DateTime
```

### Sessions Table
```sql
- id: String (Primary Key)
- userId: String (Foreign Key -> Users)
- token: String (Unique)
- expiresAt: DateTime
- createdAt: DateTime
```

### Repositories Table
```sql
- id: String (Primary Key)
- userId: String (Foreign Key -> Users)
- name: String
- url: String
- branch: String (default: 'main')
- description: String (Optional)
- lastAccessed: DateTime
- createdAt: DateTime
- updatedAt: DateTime
```

### AIModel Table
```sql
- id: String (Primary Key)
- name: String
- provider: String
- apiKey: String
- isDefault: Boolean
- createdAt: DateTime
- updatedAt: DateTime
```

### CodeModification Table
```sql
- id: String (Primary Key)
- filePath: String
- original: Text
- modified: Text
- prompt: Text
- userId: String (Optional)
- createdAt: DateTime
```

---

## Prisma Commands

### Development
```bash
# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name description

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# View database in browser
npx prisma studio
```

### Production
```bash
# Deploy migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

---

## Connection String Formats

### Local PostgreSQL
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/ai_code_agent"
```

### Docker
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/ai_code_agent"
```

### Heroku
```
DATABASE_URL="postgres://user:pass@host:5432/dbname?sslmode=require"
```

### Supabase
```
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```

### Railway
```
DATABASE_URL="postgresql://postgres:pass@containers-us-west-xxx.railway.app:1234/railway"
```

### Neon
```
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb"
```

---

## Testing Database Connection

```bash
# Test connection
npx prisma db pull

# View schema
npx prisma db push --schema=./prisma/schema.prisma
```

---

## Seed Data (Optional)

Create `prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  });

  await prisma.repository.create({
    data: {
      userId: user.id,
      name: 'example-project',
      url: 'https://github.com/user/example.git',
      branch: 'main',
      description: 'Example repository',
    },
  });

  console.log('Seed data created!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
```

Run seed:
```bash
npx prisma db seed
```

---

## Troubleshooting

### Connection Refused
- Check PostgreSQL is running: `pg_isready`
- Verify port 5432 is open
- Check firewall settings

### Authentication Failed
- Verify username/password in .env
- Check pg_hba.conf for authentication method
- Ensure user has database permissions

### Migration Errors
- Reset database: `npx prisma migrate reset`
- Check schema for syntax errors
- Ensure PostgreSQL version compatibility

### Performance Issues
- Add indexes for frequently queried fields
- Use connection pooling
- Monitor with Prisma Studio

---

## Production Deployment

### Environment Variables
```env
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
NODE_ENV=production
```

### Migration Steps
1. Backup existing database
2. Run: `npx prisma migrate deploy`
3. Verify migration success
4. Restart application

### Recommended Hosting
- **Supabase** - Free tier, great for Next.js
- **Railway** - Easy PostgreSQL deployment
- **Neon** - Serverless PostgreSQL
- **AWS RDS** - Production-grade
- **DigitalOcean** - Managed databases

---

## Security Best Practices

1. **Never commit .env** - Add to .gitignore
2. **Use strong passwords** - Minimum 16 characters
3. **Enable SSL** - Add `?sslmode=require` to connection string
4. **Rotate credentials** - Change passwords regularly
5. **Backup regularly** - Use pg_dump or provider backups
6. **Limit permissions** - Use principle of least privilege
7. **Monitor access** - Review database logs

---

## Next Steps

1. ✅ Install PostgreSQL
2. ✅ Create database
3. ✅ Update .env with DATABASE_URL
4. ✅ Run `npx prisma migrate dev`
5. ✅ Test with `npx prisma studio`
6. ✅ Start application: `npm run dev`

**Database is now integrated!** 🎉
