import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

// Middleware to check if user is admin
export async function checkAdmin(request: NextRequest) {
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

    // Check the actual isAdmin field from the database
    if (!session.user.isAdmin) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}
