import { NextRequest, NextResponse } from 'next/server';
import { createUser, createSession } from '@/app/lib/auth-db';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Create user in database
    const user = await createUser(email, password, name);
    
    // Create session token
    const token = await createSession(user.id);

    // Assign free plan to new user
    try {
      const freePlan = await prisma.plan.findFirst({
        where: { name: 'free', isActive: true }
      });

      if (freePlan) {
        const now = new Date();
        const periodEnd = new Date(now);
        periodEnd.setFullYear(periodEnd.getFullYear() + 100); // Free plan never expires

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
      }
    } catch (error) {
      console.error('Failed to assign free plan:', error);
      // Don't fail signup if plan assignment fails
    }

    return NextResponse.json({
      success: true,
      user,
      token,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 500 }
    );
  }
}
