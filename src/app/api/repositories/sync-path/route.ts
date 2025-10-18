import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifySession } from '@/app/lib/auth-db';
import path from 'path';
import fs from 'fs/promises';

const prisma = new PrismaClient();
const REPOS_BASE_DIR = path.join(process.cwd(), 'user-repos');

/**
 * Sync repository paths in case of inconsistencies
 * This helps fix path mismatches between clone and file access
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await verifySession(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const { repositoryId } = await req.json();

    if (!repositoryId) {
      return NextResponse.json(
        { error: 'Repository ID is required' },
        { status: 400 }
      );
    }

    // Get repository
    const repository = await prisma.repository.findUnique({
      where: { id: repositoryId }
    });

    if (!repository) {
      return NextResponse.json(
        { error: 'Repository not found' },
        { status: 404 }
      );
    }

    if (repository.userId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Expected path structure: user-repos/{userId}/{repoName}
    const userRepoDir = path.join(REPOS_BASE_DIR, user.id);
    const repoName = repository.name.replace(/[^a-zA-Z0-9-_]/g, '-');
    const expectedPath = path.join(userRepoDir, repoName);

    // Check if directory exists
    try {
      await fs.access(expectedPath);
      
      return NextResponse.json({
        success: true,
        message: 'Repository path is valid',
        path: expectedPath,
        exists: true
      });
    } catch {
      return NextResponse.json({
        success: false,
        message: 'Repository directory not found',
        path: expectedPath,
        exists: false,
        hint: 'Please clone the repository again from the dashboard'
      }, { status: 404 });
    }

  } catch (error) {
    console.error('Error syncing repository path:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to sync path' 
      },
      { status: 500 }
    );
  }
}
