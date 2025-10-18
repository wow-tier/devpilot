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

    // Check if already exists and is valid
    try {
      await fs.access(clonePath);
      const git = simpleGit(clonePath);
      await git.status();
      
      console.log('Repository already exists and is valid');
      
      await updateRepository(repositoryId, user.id, {
        lastAccessedAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        message: 'Repository ready',
        path: clonePath,
        repository,
      });
    } catch {
      // Doesn't exist or invalid, clone it
      console.log('Cloning repository...');
    }

    // Remove any partial/broken clone
    try {
      await fs.rm(clonePath, { recursive: true, force: true });
    } catch {
      // Ignore
    }
    
    // Clone repository
    const git = simpleGit();
    
    try {
      await git.clone(repository.url, clonePath, [
        '--branch',
        repository.defaultBranch || 'main',
        '--single-branch',
      ]);

      console.log('Repository cloned successfully');

      const repoGit = simpleGit(clonePath);
      
      if (user.name) {
        await repoGit.addConfig('user.name', user.name);
      }
      if (user.email) {
        await repoGit.addConfig('user.email', user.email);
      }

      const featureBranch = `ai-agent-${Date.now()}`;
      await repoGit.checkoutLocalBranch(featureBranch);

      await updateRepository(repositoryId, user.id, {
        lastAccessedAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        message: 'Repository cloned successfully',
        path: clonePath,
        repository,
        featureBranch,
      });
    } catch (cloneError) {
      console.error('Git clone error:', cloneError);
      
      try {
        await fs.rm(clonePath, { recursive: true, force: true });
      } catch {
        // Ignore
      }
      
      throw new Error(`Failed to clone repository: ${cloneError instanceof Error ? cloneError.message : 'Unknown error'}`);
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
