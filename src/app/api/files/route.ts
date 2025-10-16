import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const directory = searchParams.get('directory') || '.';
    const repoPath = searchParams.get('repoPath');

    // Use repository path if provided, otherwise use current working directory
    const basePath = repoPath || process.cwd();
    const targetPath = path.join(basePath, directory);

    // Security check: ensure path is within allowed directory
    const realPath = await fs.realpath(targetPath).catch(() => targetPath);
    if (!realPath.startsWith(basePath)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
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
    const { filePath, content, repoPath } = await req.json();
    
    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    const basePath = repoPath || process.cwd();
    const targetPath = path.join(basePath, filePath);

    // Security check
    const realPath = path.resolve(targetPath);
    if (!realPath.startsWith(basePath)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

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
    const { searchParams } = new URL(req.url);
    const filePath = searchParams.get('path');
    const repoPath = searchParams.get('repoPath');

    if (!filePath) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      );
    }

    const basePath = repoPath || process.cwd();
    const targetPath = path.join(basePath, filePath);

    // Security check
    const realPath = path.resolve(targetPath);
    if (!realPath.startsWith(basePath)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

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
