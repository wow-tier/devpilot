import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/auth-db';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided', valid: false },
        { status: 401 }
      );
    }

    // Verify session exists in database
    const user = await verifySession(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired session', valid: false },
        { status: 401 }
      );
    }

    // Return user data
    return NextResponse.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
        githubUsername: user.githubUsername,
      },
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed', valid: false },
      { status: 500 }
    );
  }
}
