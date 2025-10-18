import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PlanLimits {
  maxRepositories: number;
  maxAIRequests: number;
  maxStorage: number;
  planName: string;
}

export async function getUserPlanLimits(userId: string): Promise<PlanLimits> {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active'
      },
      include: {
        plan: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!subscription) {
      // Default free plan limits
      return {
        maxRepositories: 3,
        maxAIRequests: 100,
        maxStorage: 1000,
        planName: 'free'
      };
    }

    return {
      maxRepositories: subscription.plan.maxRepositories,
      maxAIRequests: subscription.plan.maxAIRequests,
      maxStorage: subscription.plan.maxStorage,
      planName: subscription.plan.name
    };
  } catch (error) {
    console.error('Error fetching plan limits:', error);
    // Return free plan limits on error
    return {
      maxRepositories: 3,
      maxAIRequests: 100,
      maxStorage: 1000,
      planName: 'free'
    };
  }
}

export async function checkRepositoryLimit(userId: string): Promise<{ allowed: boolean; message?: string }> {
  const limits = await getUserPlanLimits(userId);
  
  if (limits.maxRepositories === -1) {
    return { allowed: true };
  }

  const repoCount = await prisma.repository.count({
    where: { userId, isActive: true }
  });

  if (repoCount >= limits.maxRepositories) {
    return {
      allowed: false,
      message: `Repository limit reached (${limits.maxRepositories}). Upgrade your plan to add more repositories.`
    };
  }

  return { allowed: true };
}
