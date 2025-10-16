import { NextRequest, NextResponse } from 'next/server';
import simpleGit from 'simple-git';

// GET - Get git status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const repoPath = searchParams.get('repoPath') || process.cwd();
    
    const git = simpleGit(repoPath);

    switch (action) {
      case 'status': {
        const status = await git.status();
        return NextResponse.json({ success: true, status });
      }

      case 'branches': {
        const branches = await git.branch();
        return NextResponse.json({ success: true, branches: branches.all });
      }

      case 'log': {
        const count = parseInt(searchParams.get('count') || '10');
        const log = await git.log({ maxCount: count });
        const formattedLog = log.all.map(entry => ({
          hash: entry.hash,
          date: entry.date,
          message: entry.message,
          author_name: entry.author_name,
        }));
        return NextResponse.json({ success: true, log: formattedLog });
      }

      case 'diff': {
        const fileFilter = searchParams.get('file') || undefined;
        const diff = await git.diff(fileFilter ? [fileFilter] : []);
        return NextResponse.json({ success: true, diff });
      }

      default: {
        const status = await git.status();
        return NextResponse.json({ success: true, status });
      }
    }
  } catch (error) {
    console.error('Error in git operation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Git operation failed' 
      },
      { status: 500 }
    );
  }
}

// POST - Perform git operations
export async function POST(req: NextRequest) {
  try {
    const { action, message, branch, remote, repoPath } = await req.json();
    const git = simpleGit(repoPath || process.cwd());

    switch (action) {
      case 'checkout': {
        if (!branch) {
          return NextResponse.json(
            { error: 'Branch name is required' },
            { status: 400 }
          );
        }
        await git.checkout(branch);
        return NextResponse.json({ 
          success: true, 
          message: `Checked out to ${branch}` 
        });
      }

      case 'commit': {
        if (!message) {
          return NextResponse.json(
            { error: 'Commit message is required' },
            { status: 400 }
          );
        }
        await git.add('.');
        const result = await git.commit(message);
        return NextResponse.json({ 
          success: true, 
          commit: result.commit,
          message: 'Changes committed successfully' 
        });
      }

      case 'push': {
        const remoteName = remote || 'origin';
        const status = await git.status();
        const currentBranch = status.current || 'main';
        await git.push(remoteName, currentBranch);
        return NextResponse.json({ 
          success: true, 
          message: `Pushed to ${remoteName}/${currentBranch}` 
        });
      }

      case 'pull': {
        const remoteName = remote || 'origin';
        const status = await git.status();
        const currentBranch = status.current || 'main';
        await git.pull(remoteName, currentBranch);
        return NextResponse.json({ 
          success: true, 
          message: `Pulled from ${remoteName}/${currentBranch}` 
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in git operation:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Git operation failed' 
      },
      { status: 500 }
    );
  }
}
