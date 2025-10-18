import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create default plans
  const plans = [
    {
      name: 'free',
      displayName: 'Free',
      description: 'Perfect for getting started',
      price: 0,
      interval: 'month',
      features: JSON.stringify([
        'Up to 3 repositories',
        '100 AI requests/month',
        '1GB storage',
        'Basic code editor',
        'Git integration',
        'Community support'
      ]),
      maxRepositories: 3,
      maxAIRequests: 100,
      maxStorage: 1000, // MB
      isActive: true
    },
    {
      name: 'pro',
      displayName: 'Pro',
      description: 'For professional developers',
      price: 19,
      interval: 'month',
      features: JSON.stringify([
        'Unlimited repositories',
        '1,000 AI requests/month',
        '10GB storage',
        'Advanced code editor',
        'Git integration',
        'Priority support',
        'AI code review',
        'Custom themes',
        'Team collaboration'
      ]),
      maxRepositories: -1,
      maxAIRequests: 1000,
      maxStorage: 10000,
      isActive: true
    },
    {
      name: 'enterprise',
      displayName: 'Enterprise',
      description: 'For large teams',
      price: 99,
      interval: 'month',
      features: JSON.stringify([
        'Unlimited everything',
        'Custom AI requests',
        'Unlimited storage',
        'Enterprise features',
        'Dedicated support',
        'SLA guarantee',
        'Custom integrations',
        'Advanced security',
        'Team management',
        'SSO integration'
      ]),
      maxRepositories: -1,
      maxAIRequests: -1,
      maxStorage: -1,
      isActive: true
    }
  ];

  for (const plan of plans) {
    const existing = await prisma.plan.findUnique({
      where: { name: plan.name }
    });

    if (!existing) {
      await prisma.plan.create({ data: plan });
      console.log(`Created plan: ${plan.displayName}`);
    } else {
      console.log(`Plan ${plan.displayName} already exists, skipping...`);
    }
  }

  console.log('Database seed completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
