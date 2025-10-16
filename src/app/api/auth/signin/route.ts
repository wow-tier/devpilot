import { NextRequest, NextResponse } from 'next/server';
import { verifyUser, createSession } from '@/app/lib/auth-db';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Verify user credentials
    const user = await verifyUser(email, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session token
    const token = await createSession(user.id);

    return NextResponse.json({
      success: true,
      user,
      token,
    });
  } catch {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
