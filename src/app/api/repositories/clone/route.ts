import { NextRequest, NextResponse } from 'next/server';
import simpleGit from 'simple-git';
import { verifySession } from '@/app/lib/auth-db';
import { getRepository, updateRepository } from '@/app/lib/repository-db';
import path from 'path';
import fs from 'fs/promises';

const REPOS_BASE_DIR = path.join(process.cwd(), 'user-repos');

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

    // Get repository from database
    const repository = await getRepository(repositoryId, user.id);

    if (!repository) {
      return NextResponse.json(
        { error: 'Repository not found' },
        { status: 404 }
      );
    }

    console.log('Cloning repository:', {
      id: repository.id,
      name: repository.name,
      url: repository.url,
      branch: repository.defaultBranch,
    });

    // Create user-specific directory
    const userRepoDir = path.join(REPOS_BASE_DIR, user.id);
    await fs.mkdir(userRepoDir, { recursive: true });

    // Clone directory path
    const repoName = repository.name.replace(/[^a-zA-Z0-9-_]/g, '-');
    const clonePath = path.join(userRepoDir, repoName);

    console.log('Clone path:', clonePath);

    // Check if already cloned
    try {
      await fs.access(clonePath);
      console.log('Repository already exists, pulling latest...');
      
      // Repository already exists, pull latest changes
      const git = simpleGit(clonePath);
      await git.pull();

      // Update last accessed
      await updateRepository(repositoryId, user.id, {
        lastAccessedAt: new Date(),
      });

      console.log('Repository updated successfully');

      return NextResponse.json({
        success: true,
        message: 'Repository updated',
        path: clonePath,
        repository,
      });
    } catch {
      console.log('Repository does not exist, cloning from GitHub...');
      
      // Repository doesn't exist, clone it
      const git = simpleGit();
      
      try {
        await git.clone(repository.url, clonePath, [
          '--branch',
          repository.defaultBranch || 'main',
          '--single-branch',
          '--depth',
          '1',
        ]);

        console.log('Repository cloned successfully from:', repository.url);

        // Update repository with local path
        await updateRepository(repositoryId, user.id, {
          lastAccessedAt: new Date(),
        });

        return NextResponse.json({
          success: true,
          message: 'Repository cloned successfully',
          path: clonePath,
          repository,
        });
      } catch (cloneError) {
        console.error('Git clone error:', cloneError);
        throw new Error(`Failed to clone repository: ${cloneError instanceof Error ? cloneError.message : 'Unknown error'}`);
      }
    }
  } catch (error) {
    console.error('Error cloning repository:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to clone repository' },
      { status: 500 }
    );
  }
}
