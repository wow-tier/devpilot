#!/bin/bash

echo "🗄️  DevPilot Database Setup"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DB_NAME="devpilot"
DB_USER="postgres"
DB_PASSWORD=${DB_PASSWORD:-"devpilot123"}
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}

echo -e "${BLUE}Database Configuration:${NC}"
echo "  Name: $DB_NAME"
echo "  User: $DB_USER"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo ""

# Check if PostgreSQL is running
if ! pg_isready -h $DB_HOST -p $DB_PORT > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  PostgreSQL is not running!${NC}"
    echo ""
    echo "Starting PostgreSQL with Docker..."
    
    docker run --name devpilot-db \
      -e POSTGRES_PASSWORD=$DB_PASSWORD \
      -e POSTGRES_DB=$DB_NAME \
      -p $DB_PORT:5432 \
      -d postgres:15
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PostgreSQL started in Docker${NC}"
        echo "   Waiting for database to be ready..."
        sleep 5
    else
        echo -e "${RED}❌ Failed to start PostgreSQL${NC}"
        echo "   Please install PostgreSQL manually or fix Docker"
        exit 1
    fi
fi

echo -e "${GREEN}✅ PostgreSQL is running${NC}"
echo ""

# Create database if it doesn't exist
echo "Creating database '$DB_NAME'..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -c "CREATE DATABASE $DB_NAME"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database created/verified${NC}"
else
    echo -e "${YELLOW}⚠️  Database might already exist${NC}"
fi
echo ""

# Run schema
echo "Running database schema..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME < database/schema.sql > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Schema applied successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Schema might already exist (this is OK)${NC}"
fi
echo ""

# Ask about seed data
read -p "Do you want to load sample/seed data? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Loading seed data..."
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME < database/seed.sql > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Seed data loaded${NC}"
        echo ""
        echo -e "${BLUE}Test User Credentials:${NC}"
        echo "  Email: demo@aicode.dev"
        echo "  Password: demo123"
    else
        echo -e "${YELLOW}⚠️  Seed data might already exist${NC}"
    fi
fi
echo ""

# Update .env file
ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
fi

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?schema=public"
if grep -q "DATABASE_URL=" .env; then
    # Update existing
    sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"$DATABASE_URL\"|g" .env
    echo -e "${GREEN}✅ DATABASE_URL updated in .env${NC}"
else
    # Add new
    echo "DATABASE_URL=\"$DATABASE_URL\"" >> .env
    echo -e "${GREEN}✅ DATABASE_URL added to .env${NC}"
fi
echo ""

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Prisma Client generated${NC}"
else
    echo -e "${RED}❌ Failed to generate Prisma Client${NC}"
    exit 1
fi
echo ""

# Verify database
echo "Verifying database setup..."
TABLE_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';" 2>/dev/null | xargs)

echo -e "${GREEN}✅ Database setup complete!${NC}"
echo ""
echo "📊 Database Summary:"
echo "  Tables created: $TABLE_COUNT"
echo "  Database: $DB_NAME"
echo "  Connection: $DATABASE_URL"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Review .env file"
echo "  2. Run: npm run dev"
echo "  3. Visit: http://localhost:3000"
echo ""
echo -e "${GREEN}🎉 You're ready to start coding with AI!${NC}"
