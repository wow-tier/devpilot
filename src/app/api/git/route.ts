import { NextRequest, NextResponse } from 'next/server';
import { gitManager } from '@/app/lib/git';

// GET - Get git status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'status':
        const status = await gitManager.getStatus();
        return NextResponse.json({ success: true, status });

      case 'branches':
        const branches = await gitManager.getBranches();
        return NextResponse.json({ success: true, branches });

      case 'log':
        const count = parseInt(searchParams.get('count') || '10');
        const log = await gitManager.getLog(count);
        return NextResponse.json({ success: true, log });

      case 'diff':
        const fileFilter = searchParams.get('file') || undefined;
        const diff = await gitManager.getDiff(fileFilter);
        return NextResponse.json({ success: true, diff });

      default:
        const defaultStatus = await gitManager.getStatus();
        return NextResponse.json({ success: true, status: defaultStatus });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// POST - Perform git operations
export async function POST(req: NextRequest) {
  try {
    const { action, ...params } = await req.json();

    switch (action) {
      case 'branch':
        const branchName = await gitManager.createBranch(
          params.name,
          params.checkout !== false
        );
        return NextResponse.json({ 
          success: true, 
          branch: branchName,
          message: `Branch '${branchName}' created` 
        });

      case 'checkout':
        await gitManager.switchBranch(params.branch);
        return NextResponse.json({ 
          success: true, 
          message: `Switched to branch '${params.branch}'` 
        });

      case 'commit':
        const result = await gitManager.commit(params.message, params.files);
        return NextResponse.json({ 
          success: true, 
          commit: result,
          message: 'Changes committed successfully' 
        });

      case 'push':
        await gitManager.push(params.remote, params.branch);
        return NextResponse.json({ 
          success: true, 
          message: 'Changes pushed successfully' 
        });

      case 'rollback':
        await gitManager.rollback();
        return NextResponse.json({ 
          success: true, 
          message: 'Last commit rolled back' 
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
