import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getUserFromToken, validateFilePath, getRepositoryPath, verifyRepositoryOwnership } from '@/app/lib/repository-security';

export async function GET(req: NextRequest) {
  try {
    // SECURITY: Require authentication and repository ID
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const directory = searchParams.get('directory') || '.';
    const repositoryId = searchParams.get('repositoryId');

    // SECURITY: Repository ID is REQUIRED - no access to app files!
    if (!repositoryId) {
      return NextResponse.json(
        { error: 'Repository ID is required' },
        { status: 400 }
      );
    }

    // SECURITY: Verify user owns this repository
    const ownership = await verifyRepositoryOwnership(repositoryId, user.id);
    if (!ownership.valid) {
      return NextResponse.json(
        { error: ownership.error || 'Access denied' },
        { status: 403 }
      );
    }

    // Get the safe repository path
    const repoBasePath = await getRepositoryPath(repositoryId);
    
    // Validate the directory path
    const validation = validateFilePath(directory, repoBasePath);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid path' },
        { status: 403 }
      );
    }

    const targetPath = validation.fullPath!;

    // Check if directory exists
    try {
      await fs.access(targetPath);
    } catch {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Repository directory not found. Please clone the repository first.',
          files: [],
          currentPath: directory
        },
        { status: 404 }
      );
    }

    const entries = await fs.readdir(targetPath, { withFileTypes: true });
    
    const files = entries
      .filter(entry => {
        // Filter out common non-essential directories
        if (entry.isDirectory()) {
          return !['node_modules', '.git', '.next', 'dist', 'build', '.cache'].includes(entry.name);
        }
        return !entry.name.startsWith('.');
      })
      .map(entry => ({
        name: entry.name,
        path: path.join(directory, entry.name),
        type: entry.isDirectory() ? 'directory' : 'file',
      }));

    return NextResponse.json({
      success: true,
      files,
      currentPath: directory,
    });
  } catch (error) {
    console.error('Error reading directory:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to read directory' 
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const { filePath, content, repositoryId } = await req.json();
    
    if (!filePath || !repositoryId) {
      return NextResponse.json(
        { error: 'File path and repository ID are required' },
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
    const validation = validateFilePath(filePath, repoBasePath);
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid path' },
        { status: 403 }
      );
    }

    const targetPath = validation.fullPath!;

    // Ensure directory exists
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    
    await fs.writeFile(targetPath, content, 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'File saved successfully',
    });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to save file' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const filePath = searchParams.get('path');
    const repositoryId = searchParams.get('repositoryId');

    if (!filePath || !repositoryId) {
      return NextResponse.json(
        { error: 'File path and repository ID are required' },
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
    const validation = validateFilePath(filePath, repoBasePath);
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Invalid path' },
        { status: 403 }
      );
    }

    const targetPath = validation.fullPath!;

    await fs.unlink(targetPath);

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete file' 
      },
      { status: 500 }
    );
  }
}
