import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production-32b';
const ALGORITHM = 'aes-256-cbc';

function decrypt(encryptedText: string): string {
  try {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const key = Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32));
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}

export async function getSystemApiKey(provider: 'openai' | 'claude' | 'grok'): Promise<string | null> {
  try {
    const keyRecord = await prisma.activityLog.findFirst({
      where: {
        action: 'system_api_key',
        resource: provider,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!keyRecord || !keyRecord.metadata) {
      return null;
    }

    const metadata = keyRecord.metadata as { encryptedKey?: string };
    if (!metadata.encryptedKey) {
      return null;
    }

    return decrypt(metadata.encryptedKey);
  } catch (error) {
    console.error(`Error fetching ${provider} API key:`, error);
    return null;
  }
}

export async function getAllSystemApiKeys(): Promise<Record<string, string>> {
  const providers = ['openai', 'claude', 'grok'] as const;
  const keys: Record<string, string> = {};

  for (const provider of providers) {
    const key = await getSystemApiKey(provider);
    if (key) {
      keys[provider] = key;
    }
  }

  return keys;
}
