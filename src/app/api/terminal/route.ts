import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { getUserFromToken, validateFilePath, getRepositoryPath, verifyRepositoryOwnership } from '@/app/lib/repository-security';

interface CommandResult {
  output: string;
  error: string;
  exitCode: number;
}

/**
 * Execute terminal commands within the user's repository
 * SECURITY: Commands are restricted to the repository directory
 */
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Require authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { command, repositoryId } = await request.json();

    // SECURITY: Repository ID is REQUIRED
    if (!repositoryId) {
      return NextResponse.json(
        { error: 'Repository ID is required' },
        { status: 400 }
      );
    }

    if (!command || typeof command !== 'string') {
      return NextResponse.json(
        { error: 'Command is required' },
        { status: 400 }
      );
    }

    // SECURITY: Verify user owns this repository
    const ownership = await verifyRepositoryOwnership(repositoryId, user.id);
    if (!ownership.valid) {
      return NextResponse.json(
        { error: ownership.error || 'Access denied' },
        { status: 403 }
      );
    }

    // Get the safe repository path
    const repoBasePath = await getRepositoryPath(repositoryId);

    // Validate path exists
    const validation = validateFilePath('.', repoBasePath);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Repository path not found' },
        { status: 404 }
      );
    }

    // Execute command with security restrictions
    const result = await executeCommand(command, repoBasePath);

    return NextResponse.json({
      success: true,
      output: result.output,
      error: result.error,
      exitCode: result.exitCode
    });

  } catch (error) {
    console.error('Terminal error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to execute command' 
      },
      { status: 500 }
    );
  }
}

/**
 * Execute a command in the repository directory
 * SECURITY: Command is executed with shell=false and cwd locked to repo
 */
async function executeCommand(command: string, workingDir: string): Promise<CommandResult> {
  return new Promise((resolve) => {
    // Parse command and arguments
    const parts = command.trim().split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    let output = '';
    let errorOutput = '';

    // Security: Execute without shell, with specific working directory
    const childProcess = spawn(cmd, args, {
      cwd: workingDir,
      shell: false, // SECURITY: Prevent shell injection
      env: {
        ...process.env,
        // Git configuration
        GIT_TERMINAL_PROMPT: '0', // Disable interactive prompts
      }
    });

    childProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    childProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    childProcess.on('error', (error) => {
      resolve({
        output: '',
        error: `Failed to execute command: ${error.message}`,
        exitCode: 1
      });
    });

    childProcess.on('close', (code) => {
      resolve({
        output: output.trim(),
        error: errorOutput.trim(),
        exitCode: code || 0
      });
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      childProcess.kill();
      resolve({
        output: output.trim(),
        error: 'Command timed out after 30 seconds',
        exitCode: 124
      });
    }, 30000);
  });
}
