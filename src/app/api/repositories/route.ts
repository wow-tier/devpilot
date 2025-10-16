import { NextRequest, NextResponse } from 'next/server';
import { getUserRepositories, createRepository } from '@/app/lib/repository-db';
import { verifySession } from '@/app/lib/auth-db';

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
