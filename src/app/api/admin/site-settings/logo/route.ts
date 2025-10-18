import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { checkAdmin } from '@/app/lib/admin-auth';

const prisma = new PrismaClient();

// POST - Upload logo or favicon
export async function POST(request: NextRequest) {
  const admin = await checkAdmin(request);
  
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('logo') as File;
    const type = formData.get('type') as string || 'logo'; // 'logo' or 'favicon'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = type === 'favicon' 
      ? ['image/png', 'image/x-icon', 'image/vnd.microsoft.icon']
      : ['image/png', 'image/svg+xml', 'image/jpeg'];
      
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` 
      }, { status: 400 });
    }

    // Validate file size
    const maxSize = type === 'favicon' ? 100 * 1024 : 1 * 1024 * 1024; // 100KB for favicon, 1MB for logo
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is ${maxSize / 1024}KB.` 
      }, { status: 400 });
    }

    // Generate filename
    const ext = path.extname(file.name);
    const filename = type === 'favicon' ? `favicon${ext}` : `logo${ext}`;
    
    // Create uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'site');
    await mkdir(uploadsDir, { recursive: true });

    // Save file
    const filePath = path.join(uploadsDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const url = `/uploads/site/${filename}`;

    // Update site settings
    const existing = await prisma.activityLog.findFirst({
      where: { action: 'site_settings' }
    });

    const currentSettings = (existing?.metadata as Record<string, unknown>) || {};
    const updatedSettings = { 
      ...currentSettings, 
      [type === 'favicon' ? 'faviconUrl' : 'logoUrl']: url 
    };

    if (existing) {
      await prisma.activityLog.update({
        where: { id: existing.id },
        data: { metadata: updatedSettings as never }
      });
    } else {
      await prisma.activityLog.create({
        data: {
          userId: admin.id,
          action: 'site_settings',
          metadata: updatedSettings as never
        }
      });
    }

    return NextResponse.json({
      success: true,
      [type === 'favicon' ? 'faviconUrl' : 'logoUrl']: url
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
