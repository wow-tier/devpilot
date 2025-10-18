import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const siteSettings = await prisma.activityLog.findMany({
      where: {
        action: 'site_settings',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });

    if (siteSettings.length === 0) {
      return NextResponse.json({
        siteName: 'AI Code Agent',
        tagline: 'AI-powered IDE for modern developers',
        logoUrl: null,
        faviconUrl: null,
      });
    }

    const metadata = siteSettings[0].metadata as Record<string, string>;
    
    return NextResponse.json({
      siteName: metadata.siteName || 'AI Code Agent',
      tagline: metadata.tagline || 'AI-powered IDE for modern developers',
      logoUrl: metadata.logoUrl || null,
      faviconUrl: metadata.faviconUrl || null,
    });
  } catch (error) {
    console.error('Error fetching site metadata:', error);
    return NextResponse.json({
      siteName: 'AI Code Agent',
      tagline: 'AI-powered IDE for modern developers',
      logoUrl: null,
      faviconUrl: null,
    });
  }
}
