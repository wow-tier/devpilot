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
    
    // Get repoPath from query parameters
    const searchParams = req.nextUrl.searchParams;
    const repoPath = searchParams.get('repoPath');
    
    // Read the file with the correct path
    const fileContent = await fileSystem.readFile(decodedPath, repoPath || undefined);
    
    return NextResponse.json({ 
      success: true, 
      ...fileContent 
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error reading file:', message, error);
    
    return NextResponse.json(
      { 
        success: false,
        error: message 
      },
      { status: 500 }
    );
  }
}

// PUT - Update a file
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ filePath: string }> }
) {
  try {
    const { filePath } = await params;
    const decodedPath = decodeURIComponent(filePath);
    
    // Get repoPath from query parameters
    const searchParams = req.nextUrl.searchParams;
    const repoPath = searchParams.get('repoPath');
    
    // Get content from request body
    const body = await req.json();
    const { content } = body;
    
    if (typeof content !== 'string') {
      return NextResponse.json(
        { 
          success: false,
          error: 'Content must be a string' 
        },
        { status: 400 }
      );
    }
    
    // Write the file with the correct path
    await fileSystem.writeFile(decodedPath, content, repoPath || undefined);
    
    return NextResponse.json({ 
      success: true,
      message: 'File saved successfully'
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error writing file:', message, error);
    
    return NextResponse.json(
      { 
        success: false,
        error: message 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete a file
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ filePath: string }> }
) {
  try {
    const { filePath } = await params;
    const decodedPath = decodeURIComponent(filePath);
    
    // Get repoPath from query parameters
    const searchParams = req.nextUrl.searchParams;
    const repoPath = searchParams.get('repoPath');
    
    // Delete the file
    await fileSystem.deleteFile(decodedPath, repoPath || undefined);
    
    return NextResponse.json({ 
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error deleting file:', message, error);
    
    return NextResponse.json(
      { 
        success: false,
        error: message 
      },
      { status: 500 }
    );
  }
}