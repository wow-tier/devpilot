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

// GET - Get admin statistics
export async function GET(request: NextRequest) {
  const admin = await checkAdmin(request);
  
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [
      totalUsers,
      totalRepositories,
      totalSubscriptions,
      totalRevenue,
      activeUsers,
      recentUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.repository.count(),
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.payment.aggregate({
        where: { status: 'succeeded' },
        _sum: { amount: true }
      }),
      prisma.session.count({
        where: {
          expiresAt: { gte: new Date() }
        }
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true
        }
      })
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalRepositories,
        totalSubscriptions,
        totalRevenue: totalRevenue._sum.amount || 0,
        activeUsers,
        recentUsers
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
