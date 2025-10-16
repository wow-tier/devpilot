import { NextRequest, NextResponse } from 'next/server';

// Simple signup - in production, use proper authentication with database
export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    // Mock signup - replace with real user creation
    if (email && password) {
      const user = {
        id: Date.now().toString(),
        email,
        name: name || email.split('@')[0],
      };

      return NextResponse.json({
        success: true,
        user,
        token: 'mock-token-' + Date.now(),
      });
    }

    return NextResponse.json(
      { error: 'Invalid input' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 500 }
    );
  }
}
