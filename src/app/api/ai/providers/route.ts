import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Get available AI providers
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

    // Check which system API keys are available
    const systemKeys = await prisma.activityLog.findMany({
      where: {
        action: { startsWith: 'system_api_key_' }
      }
    });

    const providers = systemKeys
      .filter(key => {
        const metadata = key.metadata as Record<string, unknown>;
        return key.resource && metadata?.isActive !== false;
      })
      .map(key => {
        const provider = key.action.replace('system_api_key_', '');
        return {
          id: provider,
          name: provider.charAt(0).toUpperCase() + provider.slice(1),
          available: true
        };
      });

    // Add default providers info
    const allProviders = [
      { id: 'openai', name: 'OpenAI', available: providers.some(p => p.id === 'openai') },
      { id: 'claude', name: 'Claude', available: providers.some(p => p.id === 'claude') },
      { id: 'grok', name: 'Grok', available: providers.some(p => p.id === 'grok') }
    ];

    return NextResponse.json({ 
      providers: allProviders,
      defaultProvider: providers.length > 0 ? providers[0].id : null
    });
  } catch (error) {
    console.error('Error fetching providers:', error);
    return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 });
  }
}
