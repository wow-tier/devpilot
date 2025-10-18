#!/bin/bash

# Seed Plans Script
# This script seeds the database with initial subscription plans

echo "🌱 Seeding database with initial plans..."

# Run the Prisma seed script
npx tsx prisma/seed.ts

if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully!"
else
    echo "❌ Error seeding database"
    exit 1
fi
