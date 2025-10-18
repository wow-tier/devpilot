import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Encryption key - in production, use environment variable
const ENCRYPTION_KEY = process.env.SYSTEM_KEYS_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');

// Simple encryption/decryption functions
function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const key = Buffer.from(ENCRYPTION_KEY.slice(0, 32), 'utf-8');
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text: string): string {
  const parts = text.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];
  const key = Buffer.from(ENCRYPTION_KEY.slice(0, 32), 'utf-8');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Middleware to check if user is admin
async function checkAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    const isAdmin = session.user.email.includes('admin') || session.user.email.endsWith('@admin.com');
    
    if (!isAdmin) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

// GET - List all system API keys (without showing actual keys)
export async function GET(request: NextRequest) {
  const admin = await checkAdmin(request);
  
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Store system keys in a separate table or use a special user
    // For now, we'll use ActivityLog as a key-value store with a special pattern
    const systemKeys = await prisma.activityLog.findMany({
      where: {
        action: { startsWith: 'system_api_key_' }
      },
      orderBy: { createdAt: 'desc' }
    });

    const keys = systemKeys.map(key => {
      const provider = key.action.replace('system_api_key_', '');
      const metadata = key.metadata as Record<string, unknown>;
      
      return {
        id: key.id,
        provider,
        name: metadata?.name || `${provider} API Key`,
        isActive: metadata?.isActive !== false,
        createdAt: key.createdAt,
        lastUsed: metadata?.lastUsed || null,
        hasKey: !!key.resource // indicates if a key is set
      };
    });

    return NextResponse.json({ keys });
  } catch (error) {
    console.error('Error fetching system API keys:', error);
    return NextResponse.json({ error: 'Failed to fetch system API keys' }, { status: 500 });
  }
}

// POST - Add or update system API key
export async function POST(request: NextRequest) {
  const admin = await checkAdmin(request);
  
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { provider, apiKey, name } = await request.json();

    if (!provider || !apiKey) {
      return NextResponse.json({ error: 'Provider and API key are required' }, { status: 400 });
    }

    if (!['openai', 'claude', 'grok'].includes(provider.toLowerCase())) {
      return NextResponse.json({ error: 'Invalid provider. Must be openai, claude, or grok' }, { status: 400 });
    }

    // Encrypt the API key
    const encryptedKey = encrypt(apiKey);

    // Check if key already exists
    const existing = await prisma.activityLog.findFirst({
      where: {
        action: `system_api_key_${provider.toLowerCase()}`
      }
    });

    if (existing) {
      // Update existing key
      await prisma.activityLog.update({
        where: { id: existing.id },
        data: {
          resource: encryptedKey,
          metadata: {
            name: name || `${provider} API Key`,
            isActive: true,
            updatedAt: new Date().toISOString(),
            updatedBy: admin.email
          }
        }
      });
    } else {
      // Create new key
      await prisma.activityLog.create({
        data: {
          action: `system_api_key_${provider.toLowerCase()}`,
          resource: encryptedKey,
          metadata: {
            name: name || `${provider} API Key`,
            isActive: true,
            createdBy: admin.email
          },
          userId: admin.id
        }
      });
    }

    return NextResponse.json({ 
      success: true,
      message: `${provider} API key saved successfully`
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving system API key:', error);
    return NextResponse.json({ error: 'Failed to save system API key' }, { status: 500 });
  }
}

// DELETE - Remove system API key
export async function DELETE(request: NextRequest) {
  const admin = await checkAdmin(request);
  
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider');

    if (!provider) {
      return NextResponse.json({ error: 'Provider is required' }, { status: 400 });
    }

    await prisma.activityLog.deleteMany({
      where: {
        action: `system_api_key_${provider.toLowerCase()}`
      }
    });

    return NextResponse.json({ 
      success: true,
      message: `${provider} API key deleted successfully` 
    });
  } catch (error) {
    console.error('Error deleting system API key:', error);
    return NextResponse.json({ error: 'Failed to delete system API key' }, { status: 500 });
  }
}

// GET specific key (for internal use only)
export async function getSystemApiKey(provider: string): Promise<string | null> {
  try {
    const keyRecord = await prisma.activityLog.findFirst({
      where: {
        action: `system_api_key_${provider.toLowerCase()}`,
      }
    });

    if (!keyRecord || !keyRecord.resource) {
      return null;
    }

    const metadata = keyRecord.metadata as Record<string, unknown>;
    if (metadata?.isActive === false) {
      return null;
    }

    // Decrypt and return the key
    return decrypt(keyRecord.resource);
  } catch (error) {
    console.error('Error getting system API key:', error);
    return null;
  }
}
