import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Middleware to check if user is admin
async function checkAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    const isAdmin = session.user.email.includes('admin') || session.user.email.endsWith('@admin.com');
    
    if (!isAdmin) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

// GET - List all plans
export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      include: {
        _count: {
          select: {
            subscriptions: true
          }
        }
      },
      orderBy: { price: 'asc' }
    });

    return NextResponse.json({ plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 });
  }
}

// POST - Create new plan
export async function POST(request: NextRequest) {
  const admin = await checkAdmin(request);
  
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, displayName, description, price, interval, features, maxRepositories, maxAIRequests, maxStorage } = await request.json();

    if (!name || !displayName || price === undefined || !interval) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const plan = await prisma.plan.create({
      data: {
        name,
        displayName,
        description,
        price,
        interval,
        features: features || {},
        maxRepositories: maxRepositories || 5,
        maxAIRequests: maxAIRequests || 100,
        maxStorage: maxStorage || 1000
      }
    });

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
  }
}
