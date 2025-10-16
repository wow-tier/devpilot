import { NextRequest, NextResponse } from 'next/server';

// Simple auth - in production, use proper authentication
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Mock authentication - replace with real auth
    if (email && password) {
      const user = {
        id: '1',
        email,
        name: email.split('@')[0],
      };

      return NextResponse.json({
        success: true,
        user,
        token: 'mock-token-' + Date.now(),
      });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
