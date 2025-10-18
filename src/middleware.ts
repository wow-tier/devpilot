import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory cache for session validation
const sessionCache = new Map<string, { valid: boolean; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute

export function middleware(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (token) {
    const cached = sessionCache.get(token);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      // Return cached result - don't hit database
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};

// Cleanup expired cache entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of sessionCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      sessionCache.delete(key);
    }
  }
}, 5 * 60 * 1000);
