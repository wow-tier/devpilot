import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkAdmin } from '@/app/lib/admin-auth';

const prisma = new PrismaClient();

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
