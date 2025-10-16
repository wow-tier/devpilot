import { NextRequest, NextResponse } from 'next/server';
import { fileSystem } from '@/app/lib/fileSystem';

// GET - Read a specific file
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filePath: string }> }
) {
  try {
    const { filePath } = await params;
    const decodedPath = decodeURIComponent(filePath);
    const fileContent = await fileSystem.readFile(decodedPath);
    
    return NextResponse.json({ 
      success: true, 
      ...fileContent 
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
