import { NextRequest, NextResponse } from 'next/server';
import { gitManager } from '@/app/lib/git';
import { fileSystem } from '@/app/lib/fileSystem';

export async function POST(req: NextRequest) {
  try {
    const { message, files, branch, modifications } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Commit message is required' },
        { status: 400 }
      );
    }

    // Create branch if specified and doesn't exist
    if (branch) {
      await gitManager.createBranch(branch, true);
    }

    // Apply modifications if provided
    if (modifications && modifications.length > 0) {
      for (const mod of modifications) {
        await fileSystem.writeFile(mod.filePath, mod.modifiedContent);
      }
    }

    // Commit changes
    const result = await gitManager.commit(message, files);

    return NextResponse.json({
      success: true,
      commit: result,
      message: 'Changes committed successfully',
    });
  } catch (error: unknown) {
    console.error('Error in commit API:', error);
    const message = error instanceof Error ? error.message : 'Failed to commit changes';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
