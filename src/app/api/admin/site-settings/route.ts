import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { checkAdmin } from '@/app/lib/admin-auth';

const prisma = new PrismaClient();

// GET - Get site settings
export async function GET(request: NextRequest) {
  const admin = await checkAdmin(request);
  
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

// POST - Upload logo
export async function POST(request: NextRequest) {
  const admin = await checkAdmin(request);
  
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('logo') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/svg+xml', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only PNG, SVG, and JPEG are allowed.' }, { status: 400 });
    }

    // Validate file size (1MB max for logo)
    if (file.size > 1 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 1MB.' }, { status: 400 });
    }

    // Generate filename
    const ext = path.extname(file.name);
    const filename = `logo${ext}`;
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'site');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch {
      // Directory might already exist
    }

    // Save file
    const filePath = path.join(uploadsDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const logoUrl = `/uploads/site/${filename}`;

    // Update site settings with new logo
    const existing = await prisma.activityLog.findFirst({
      where: { action: 'site_settings' }
    });

    const currentSettings = (existing?.metadata as Record<string, unknown>) || {};
    const updatedSettings = { ...currentSettings, logoUrl };

    if (existing) {
      await prisma.activityLog.update({
        where: { id: existing.id },
        data: { metadata: updatedSettings }
      });
    } else {
      await prisma.activityLog.create({
        data: {
          userId: admin.id,
          action: 'site_settings',
          metadata: updatedSettings
        }
      });
    }

    return NextResponse.json({
      success: true,
      logoUrl
    });
  } catch (error) {
    console.error('Error uploading logo:', error);
    return NextResponse.json({ error: 'Failed to upload logo' }, { status: 500 });
  }
}
