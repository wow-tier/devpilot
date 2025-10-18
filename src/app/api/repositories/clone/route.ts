import { NextRequest, NextResponse } from 'next/server';
import simpleGit from 'simple-git';
import { verifySession } from '@/app/lib/auth-db';
import { getRepository, updateRepository } from '@/app/lib/repository-db';
import path from 'path';
import fs from 'fs/promises';

const REPOS_BASE_DIR = path.join(process.cwd(), 'user-repos');

// Simple in-memory lock to prevent concurrent clones
const cloneLocks = new Map<string, Promise<unknown>>();

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
    
    // Clone directory path
    const repoName = repository.name.replace(/[^a-zA-Z0-9-_]/g, '-');
    const clonePath = path.join(userRepoDir, repoName);
    const lockKey = `${user.id}:${repositoryId}`;

    console.log('Clone path:', clonePath);

    // Check if clone is already in progress
    if (cloneLocks.has(lockKey)) {
      console.log('Clone already in progress, waiting...');
      try {
        await cloneLocks.get(lockKey);
        // Clone completed by another request, return success
        return NextResponse.json({
          success: true,
          message: 'Repository ready',
          path: clonePath,
          repository,
        });
      } catch (error) {
        // Previous clone failed, we'll try again
        console.log('Previous clone failed, retrying...');
      }
    }

    // Create lock promise
    const clonePromise = (async () => {
      try {
        // Ensure parent directory exists with proper permissions
        await fs.mkdir(userRepoDir, { recursive: true, mode: 0o755 });

        // Clean up any existing directory and locks completely
        try {
          await fs.rm(clonePath, { recursive: true, force: true });
          console.log('Removed existing directory');
          // Wait a bit for filesystem to sync
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch {
          // Directory doesn't exist, that's fine
        }
        
        // Clone repository
        const git = simpleGit();
        
        await git.clone(repository.url, clonePath, [
          '--branch',
          repository.defaultBranch || 'main',
          '--single-branch',
          '--depth',
          '1',
        ]);

        console.log('Repository cloned successfully from:', repository.url);

        // Configure git for this repository
        const repoGit = simpleGit(clonePath);
        
        // Set user config if available
        if (user.name) {
          await repoGit.addConfig('user.name', user.name);
        }
        if (user.email) {
          await repoGit.addConfig('user.email', user.email);
        }

        // Create a feature branch for AI agent work
        const featureBranch = `ai-agent-${Date.now()}`;
        await repoGit.checkoutLocalBranch(featureBranch);

        console.log(`Created and checked out feature branch: ${featureBranch}`);

        // Update repository with local path and feature branch
        await updateRepository(repositoryId, user.id, {
          lastAccessedAt: new Date(),
        });

        return {
          success: true,
          message: 'Repository cloned successfully',
          path: clonePath,
          repository,
          featureBranch,
        };
      } catch (cloneError) {
        console.error('Git clone error:', cloneError);
        
        // Clean up failed clone attempt thoroughly
        try {
          await fs.rm(clonePath, { recursive: true, force: true });
          // Clean up any lock files
          const lockFiles = await fs.readdir(path.join(clonePath, '.git')).catch(() => []);
          for (const file of lockFiles) {
            if (file.endsWith('.lock')) {
              await fs.unlink(path.join(clonePath, '.git', file)).catch(() => {});
            }
          }
        } catch {
          // Ignore cleanup errors
        }
        
        throw new Error(`Failed to clone repository: ${cloneError instanceof Error ? cloneError.message : 'Unknown error'}`);
      } finally {
        // Remove lock
        cloneLocks.delete(lockKey);
      }
    })();

    // Store lock
    cloneLocks.set(lockKey, clonePromise);

    try {
      const result = await clonePromise;
      return NextResponse.json(result);
    } catch (error) {
      throw error;
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
