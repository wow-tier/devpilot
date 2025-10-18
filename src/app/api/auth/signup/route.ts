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
