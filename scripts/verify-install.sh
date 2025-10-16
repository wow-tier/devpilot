#!/bin/bash

echo "🔍 Verifying DevPilot Installation"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Not found"
    ERRORS=$((ERRORS+1))
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} v$NPM_VERSION"
else
    echo -e "${RED}✗${NC} Not found"
    ERRORS=$((ERRORS+1))
fi

# Check packages
echo ""
echo "Checking required packages:"

PACKAGES=(
  "react"
  "next"
  "@prisma/client"
  "lucide-react"
  "@monaco-editor/react"
  "simple-git"
  "openai"
  "bcrypt"
  "tailwindcss"
)

for package in "${PACKAGES[@]}"; do
    echo -n "  $package... "
    if npm list "$package" &> /dev/null; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
        ERRORS=$((ERRORS+1))
    fi
done

# Check .env file
echo ""
echo -n "Checking .env file... "
if [ -f .env ]; then
    echo -e "${GREEN}✓${NC} Found"
    
    # Check required env vars
    if grep -q "OPENAI_API_KEY=" .env && ! grep -q "OPENAI_API_KEY=your_openai_api_key_here" .env; then
        echo "  OPENAI_API_KEY: ${GREEN}✓${NC} Configured"
    else
        echo "  OPENAI_API_KEY: ${YELLOW}⚠${NC} Not configured"
    fi
    
    if grep -q "DATABASE_URL=" .env && ! grep -q "DATABASE_URL=\"postgresql://postgres:your_password" .env; then
        echo "  DATABASE_URL: ${GREEN}✓${NC} Configured"
    else
        echo "  DATABASE_URL: ${YELLOW}⚠${NC} Not configured"
    fi
else
    echo -e "${YELLOW}⚠${NC} Not found (will use .env.example)"
fi

# Check PostgreSQL
echo ""
echo -n "Checking PostgreSQL... "
if pg_isready &> /dev/null || pg_isready -h localhost -p 5432 &> /dev/null; then
    echo -e "${GREEN}✓${NC} Running"
else
    echo -e "${YELLOW}⚠${NC} Not running (you can use Docker)"
fi

# Check Prisma Client
echo ""
echo -n "Checking Prisma Client... "
if [ -d "node_modules/.prisma/client" ]; then
    echo -e "${GREEN}✓${NC} Generated"
else
    echo -e "${YELLOW}⚠${NC} Not generated (run: npm run db:generate)"
fi

# Check build
echo ""
echo -n "Testing build... "
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Build successful"
else
    echo -e "${RED}✗${NC} Build failed"
    ERRORS=$((ERRORS+1))
fi

# Summary
echo ""
echo "======================================"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo "Ready to start:"
    echo "  npm run dev"
else
    echo -e "${RED}❌ Found $ERRORS error(s)${NC}"
    echo ""
    echo "Run these commands:"
    echo "  npm install          # Install packages"
    echo "  npm run db:setup     # Setup database"
    echo "  cp .env.example .env # Create .env"
fi
echo ""
