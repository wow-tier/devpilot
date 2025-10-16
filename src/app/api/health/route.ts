import { NextResponse } from 'next/server';

export async function GET() {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    features: {
      ai: !!process.env.OPENAI_API_KEY,
      git: true,
      fileSystem: true,
    },
  };

  return NextResponse.json(healthCheck);
}
