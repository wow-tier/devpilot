import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Store user preferences in ActivityLog table as key-value pairs
// This allows storing preferences without modifying the User table

// GET - Get user preferences
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get preferences from ActivityLog
    const prefsRecord = await prisma.activityLog.findFirst({
      where: {
        userId: session.user.id,
        action: 'user_preferences'
      }
    });

    const preferences = prefsRecord?.metadata || {
      notifications: {
        emailUpdates: true,
        repositoryAlerts: true,
        aiSuggestions: true,
        securityAlerts: true
      },
      appearance: {
        theme: 'vs-dark',
        fontSize: 14,
        highContrast: false,
        reduceAnimations: false
      },
      ai: {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2048
      }
    };

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 });
  }
}

// PUT - Update user preferences
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const preferences = await request.json();

    // Check if preferences already exist
    const existing = await prisma.activityLog.findFirst({
      where: {
        userId: session.user.id,
        action: 'user_preferences'
      }
    });

    if (existing) {
      // Update existing preferences
      await prisma.activityLog.update({
        where: { id: existing.id },
        data: { metadata: preferences }
      });
    } else {
      // Create new preferences
      await prisma.activityLog.create({
        data: {
          userId: session.user.id,
          action: 'user_preferences',
          metadata: preferences
        }
      });
    }

    return NextResponse.json({
      success: true,
      preferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 });
  }
}
