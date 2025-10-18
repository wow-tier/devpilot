import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default plans if they don't exist
  const freePlan = await prisma.plan.upsert({
    where: { name: 'free' },
    update: {},
    create: {
      name: 'free',
      displayName: 'Free',
      description: 'Perfect for getting started',
      price: 0,
      interval: 'month',
      features: JSON.stringify([
        'Up to 3 repositories',
        '100 AI requests per month',
        '1GB storage',
        'Community support',
        'Basic IDE features'
      ]),
      maxRepositories: 3,
      maxAIRequests: 100,
      maxStorage: 1000,
      isActive: true
    }
  });

  const proPlan = await prisma.plan.upsert({
    where: { name: 'pro' },
    update: {},
    create: {
      name: 'pro',
      displayName: 'Pro',
      description: 'For professional developers',
      price: 19,
      interval: 'month',
      features: JSON.stringify([
        'Unlimited repositories',
        'Unlimited AI requests',
        '50GB storage',
        'Priority support',
        'Advanced IDE features',
        'Team collaboration',
        'Custom AI models'
      ]),
      maxRepositories: -1,
      maxAIRequests: -1,
      maxStorage: 50000,
      isActive: true
    }
  });

  const enterprisePlan = await prisma.plan.upsert({
    where: { name: 'enterprise' },
    update: {},
    create: {
      name: 'enterprise',
      displayName: 'Enterprise',
      description: 'For large teams',
      price: 99,
      interval: 'month',
      features: JSON.stringify([
        'Everything in Pro',
        'Unlimited everything',
        'Dedicated support',
        'SLA guarantee',
        'Custom integrations',
        'SSO',
        'Advanced security',
        'Custom AI training'
      ]),
      maxRepositories: -1,
      maxAIRequests: -1,
      maxStorage: -1,
      isActive: true
    }
  });

  console.log('✅ Created default plans:', {
    free: freePlan.id,
    pro: proPlan.id,
    enterprise: enterprisePlan.id
  });

  // Assign free plan to any users without subscriptions
  const usersWithoutSubs = await prisma.user.findMany({
    where: {
      subscriptions: {
        none: {}
      }
    }
  });

  for (const user of usersWithoutSubs) {
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setFullYear(periodEnd.getFullYear() + 100);

    await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: freePlan.id,
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false
      }
    });

    console.log(`✅ Assigned free plan to user: ${user.email}`);
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
