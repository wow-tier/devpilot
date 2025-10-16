import { NextResponse } from 'next/server';
import { gitManager } from '@/app/lib/git';
import { fileSystem } from '@/app/lib/fileSystem';

export async function GET() {
  try {
    // Check Git status
    const gitStatus = await gitManager.getStatus();
    
    // Check file system (count files in current directory)
    const files = await fileSystem.listFiles('.');
    
    // Check AI availability
    const aiAvailable = !!process.env.OPENAI_API_KEY;
    
    return NextResponse.json({
      success: true,
      git: {
        available: true,
        branch: gitStatus.branch,
        changes: gitStatus.modified.length + gitStatus.created.length + gitStatus.deleted.length,
      },
      fileSystem: {
        available: true,
        fileCount: files.length,
      },
      ai: {
        available: aiAvailable,
        configured: aiAvailable,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Status check failed';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
