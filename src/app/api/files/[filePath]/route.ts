import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { getUserFromToken, validateFilePath, getRepositoryPath, verifyRepositoryOwnership } from '@/app/lib/repository-security';

// GET - Read a specific file
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filePath: string }> }
) {
  try {
    // SECURITY: Require authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { filePath } = await params;
    const decodedPath = decodeURIComponent(filePath);
    
    const searchParams = req.nextUrl.searchParams;
    const repositoryId = searchParams.get('repositoryId');

    // SECURITY: Repository ID is REQUIRED
    if (!repositoryId) {
      return NextResponse.json(
        { error: 'Repository ID is required' },
        { status: 400 }
      );
    }

    // SECURITY: Verify ownership
    const ownership = await verifyRepositoryOwnership(repositoryId, user.id);
    if (!ownership.valid) {
      return NextResponse.json(
        { error: ownership.error || 'Access denied' },
        { status: 403 }
      );
    }

    const repoBasePath = await getRepositoryPath(repositoryId);
    const validation = validateFilePath(decodedPath, repoBasePath);
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid path' },
        { status: 403 }
      );
    }

    // Read file content
    const content = await fs.readFile(validation.fullPath!, 'utf-8');
    
    return NextResponse.json({ 
      success: true,
      content,
      path: decodedPath
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
    // SECURITY: Require authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { filePath } = await params;
    const decodedPath = decodeURIComponent(filePath);
    
    const searchParams = req.nextUrl.searchParams;
    const repositoryId = searchParams.get('repositoryId');
    
    const body = await req.json();
    const { content } = body;
    
    if (typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content must be a string' },
        { status: 400 }
      );
    }

    // SECURITY: Repository ID is REQUIRED
    if (!repositoryId) {
      return NextResponse.json(
        { error: 'Repository ID is required' },
        { status: 400 }
      );
    }

    // SECURITY: Verify ownership
    const ownership = await verifyRepositoryOwnership(repositoryId, user.id);
    if (!ownership.valid) {
      return NextResponse.json(
        { error: ownership.error || 'Access denied' },
        { status: 403 }
      );
    }

    const repoBasePath = await getRepositoryPath(repositoryId);
    const validation = validateFilePath(decodedPath, repoBasePath);
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid path' },
        { status: 403 }
      );
    }

    // Write file content
    await fs.writeFile(validation.fullPath!, content, 'utf-8');
    
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
    // SECURITY: Require authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { filePath } = await params;
    const decodedPath = decodeURIComponent(filePath);
    
    const searchParams = req.nextUrl.searchParams;
    const repositoryId = searchParams.get('repositoryId');

    // SECURITY: Repository ID is REQUIRED
    if (!repositoryId) {
      return NextResponse.json(
        { error: 'Repository ID is required' },
        { status: 400 }
      );
    }

    // SECURITY: Verify ownership
    const ownership = await verifyRepositoryOwnership(repositoryId, user.id);
    if (!ownership.valid) {
      return NextResponse.json(
        { error: ownership.error || 'Access denied' },
        { status: 403 }
      );
    }

    const repoBasePath = await getRepositoryPath(repositoryId);
    const validation = validateFilePath(decodedPath, repoBasePath);
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid path' },
        { status: 403 }
      );
    }

    // Delete the file
    await fs.unlink(validation.fullPath!);
    
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