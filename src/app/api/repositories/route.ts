import { NextRequest, NextResponse } from 'next/server';
import { getUserRepositories, createRepository } from '@/app/lib/repository-db';
import { verifySession } from '@/app/lib/auth-db';
import { checkRepositoryLimit } from '@/app/lib/plan-limits';
import simpleGit from 'simple-git';
import path from 'path';
import fs from 'fs/promises';

export async function GET(req: NextRequest) {
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

    const repositories = await getUserRepositories(user.id);

    return NextResponse.json({
      success: true,
      repositories,
    });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}

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

    // Check repository limit based on user's plan
    const limitCheck = await checkRepositoryLimit(user.id);
    if (!limitCheck.allowed) {
      return NextResponse.json({ 
        error: limitCheck.message || 'Repository limit reached'
      }, { status: 403 });
    }

    const { name, url, branch, description } = await req.json();

    console.log('Creating repository with data:', { name, url, branch, description });

    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      );
    }

    const repository = await createRepository(user.id, {
      name,
      url,
      branch,
      description,
    });

    console.log('Repository created in database:', repository);

    // Clone repository immediately
    try {
      const userRepoDir = path.join(process.cwd(), 'user-repos', user.id);
      await fs.mkdir(userRepoDir, { recursive: true });

      const repoName = repository.name.replace(/[^a-zA-Z0-9-_]/g, '-');
      const clonePath = path.join(userRepoDir, repoName);

      console.log('Cloning repository to:', clonePath);

      const git = simpleGit();
      await git.clone(repository.url, clonePath, [
        '--branch',
        repository.defaultBranch || 'main',
        '--single-branch',
      ]);

      const repoGit = simpleGit(clonePath);
      
      if (user.name) {
        await repoGit.addConfig('user.name', user.name);
      }
      if (user.email) {
        await repoGit.addConfig('user.email', user.email);
      }

      const featureBranch = `ai-agent-${Date.now()}`;
      await repoGit.checkoutLocalBranch(featureBranch);

      console.log('Repository cloned and ready');
    } catch (cloneError) {
      console.error('Failed to clone during creation:', cloneError);
    }

    return NextResponse.json({
      success: true,
      repository,
    });
  } catch (error) {
    console.error('Error creating repository:', error);
    return NextResponse.json(
      { error: 'Failed to create repository' },
      { status: 500 }
    );
  }
}
