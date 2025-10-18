import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { checkAdmin } from '@/app/lib/admin-auth';

const prisma = new PrismaClient();

// GET - Get site settings (public)
export async function GET() {
  try {
    // Get settings from ActivityLog
    const settingsRecord = await prisma.activityLog.findFirst({
      where: {
        action: 'site_settings'
      }
    });

    const settings = settingsRecord?.metadata || {
      siteName: 'AI Code Agent',
      logoUrl: null,
      faviconUrl: null,
      tagline: 'The AI-powered IDE for modern developers',
      supportEmail: 'support@example.com',
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6'
    };

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json({ error: 'Failed to fetch site settings' }, { status: 500 });
  }
}

// PUT - Update site settings
export async function PUT(request: NextRequest) {
  const admin = await checkAdmin(request);
  
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await request.json();

    // Check if settings already exist
    const existing = await prisma.activityLog.findFirst({
      where: {
        action: 'site_settings'
      }
    });

    if (existing) {
      // Update existing settings
      await prisma.activityLog.update({
        where: { id: existing.id },
        data: { 
          metadata: settings,
          userId: admin.id
        }
      });
    } else {
      // Create new settings
      await prisma.activityLog.create({
        data: {
          userId: admin.id,
          action: 'site_settings',
          metadata: settings
        }
      });
    }

    return NextResponse.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json({ error: 'Failed to update site settings' }, { status: 500 });
  }
}

