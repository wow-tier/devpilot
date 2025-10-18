import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkAdmin } from '@/app/lib/admin-auth';

const prisma = new PrismaClient();

// GET - Get user's subscription
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const admin = await checkAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const userId = context.params.id;

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
      return NextResponse.json({
        subscription: null,
        plan: null
      });
    }

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd
      },
      plan: subscription.plan
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}

// POST - Assign plan to user
export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const admin = await checkAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { planId } = await request.json();
    const userId = context.params.id;

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
    }

    // Verify plan exists
    const plan = await prisma.plan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Cancel any existing active subscriptions
    await prisma.subscription.updateMany({
      where: {
        userId,
        status: 'active'
      },
      data: {
        status: 'canceled',
        cancelAtPeriodEnd: true
      }
    });

    // Create new subscription
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + (plan.interval === 'year' ? 12 : 1));

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId,
        status: 'active',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false
      },
      include: {
        plan: true
      }
    });

    return NextResponse.json({
      success: true,
      subscription
    });
  } catch (error) {
    console.error('Error assigning plan:', error);
    return NextResponse.json({ error: 'Failed to assign plan' }, { status: 500 });
  }
}
