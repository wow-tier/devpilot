import simpleGit, { SimpleGit } from 'simple-git';
import { getRepositoryPath } from './repository-security';

/**
 * Helper functions for Git operations within user repositories
 */

interface GitCommitOptions {
  message: string;
  files?: string[];
}

interface GitPushOptions {
  remote?: string;
  branch?: string;
  force?: boolean;
}

/**
 * Get a configured git instance for a repository
 */
export async function getGitInstance(repositoryId: string): Promise<SimpleGit> {
  const repoPath = await getRepositoryPath(repositoryId);
  return simpleGit(repoPath);
}

/**
 * Get the current branch name
 */
export async function getCurrentBranch(repositoryId: string): Promise<string> {
  const git = await getGitInstance(repositoryId);
  const status = await git.status();
  return status.current || 'main';
}

/**
 * Commit changes made by the AI agent
 */
export async function commitChanges(
  repositoryId: string,
  options: GitCommitOptions
): Promise<{ success: boolean; commit?: string; error?: string }> {
  try {
    const git = await getGitInstance(repositoryId);

    // Add files (default to all if not specified)
    if (options.files && options.files.length > 0) {
      await git.add(options.files);
    } else {
      await git.add('.');
    }

    // Check if there are changes to commit
    const status = await git.status();
    if (status.files.length === 0) {
      return {
        success: false,
        error: 'No changes to commit'
      };
    }

    // Commit
    const result = await git.commit(options.message);

    return {
      success: true,
      commit: result.commit
    };
  } catch (error) {
    console.error('Git commit error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to commit'
    };
  }
}

/**
 * Push changes to remote repository
 */
export async function pushChanges(
  repositoryId: string,
  options: GitPushOptions = {}
): Promise<{ success: boolean; error?: string }> {
  try {
    const git = await getGitInstance(repositoryId);
    
    const remote = options.remote || 'origin';
    const branch = options.branch || await getCurrentBranch(repositoryId);

    // Set upstream if not already set
    const pushOptions = options.force ? ['--force'] : [];
    pushOptions.push('--set-upstream', remote, branch);

    await git.push(remote, branch, pushOptions);

    return { success: true };
  } catch (error) {
    console.error('Git push error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to push'
    };
  }
}

/**
 * Get git status
 */
export async function getGitStatus(repositoryId: string) {
  try {
    const git = await getGitInstance(repositoryId);
    const status = await git.status();
    return {
      success: true,
      status: {
        current: status.current,
        tracking: status.tracking,
        ahead: status.ahead,
        behind: status.behind,
        modified: status.modified,
        created: status.created,
        deleted: status.deleted,
        renamed: status.renamed,
        staged: status.staged,
        conflicted: status.conflicted
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get status'
    };
  }
}

/**
 * Create a new branch
 */
export async function createBranch(
  repositoryId: string,
  branchName: string,
  checkout = true
): Promise<{ success: boolean; error?: string }> {
  try {
    const git = await getGitInstance(repositoryId);
    
    if (checkout) {
      await git.checkoutLocalBranch(branchName);
    } else {
      await git.branch([branchName]);
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create branch'
    };
  }
}

/**
 * Checkout a branch
 */
export async function checkoutBranch(
  repositoryId: string,
  branchName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const git = await getGitInstance(repositoryId);
    await git.checkout(branchName);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to checkout branch'
    };
  }
}

/**
 * Get list of branches
 */
export async function getBranches(repositoryId: string) {
  try {
    const git = await getGitInstance(repositoryId);
    const branches = await git.branch();
    return {
      success: true,
      branches: {
        all: branches.all,
        current: branches.current,
        branches: branches.branches
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get branches'
    };
  }
}

/**
 * Configure git credentials for HTTPS authentication
 * Note: For production, users should use SSH keys or personal access tokens
 */
export async function configureGitCredentials(
  repositoryId: string,
  username?: string,
  token?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const git = await getGitInstance(repositoryId);
    
    // Store credentials in git config for this repo only
    await git.addConfig('credential.helper', 'store');
    
    // Note: In production, use GitHub personal access tokens
    // Users should set this up manually for security
    // username and token are optional for future OAuth implementation
    console.log('Git credentials configured', { hasUsername: !!username, hasToken: !!token });
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to configure credentials'
    };
  }
}
