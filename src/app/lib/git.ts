import simpleGit, { SimpleGit } from 'simple-git';

export interface GitStatus {
  branch: string;
  ahead: number;
  behind: number;
  modified: string[];
  created: string[];
  deleted: string[];
  staged: string[];
}

export interface CommitResult {
  hash: string;
  message: string;
  branch: string;
}

export class GitManager {
  private git: SimpleGit;
  private repoPath: string;

  constructor(repoPath: string = process.cwd()) {
    this.repoPath = repoPath;
    this.git = simpleGit(repoPath);
  }

  // Get repository status
  async getStatus(): Promise<GitStatus> {
    const status = await this.git.status();

    return {
      branch: status.current || 'main',
      ahead: status.ahead,
      behind: status.behind,
      modified: status.modified,
      created: status.created,
      deleted: status.deleted,
      staged: status.staged,
    };
  }

  // Stage & commit a single file (ideal for AI agent step-by-step workflow)
  async stageAndCommitFile(filePath: string, message: string): Promise<CommitResult> {
    await this.git.add(filePath);
    return this.commit(message, [filePath]);
  }

  // General commit method (all changes or specified files)
  async commit(message: string, files?: string[]): Promise<CommitResult> {
    if (files && files.length > 0) {
      await this.git.add(files);
    } else {
      await this.git.add('.');
    }

    const result = await this.git.commit(message);
    const status = await this.getStatus();

    return {
      hash: result.commit,
      message,
      branch: status.branch,
    };
  }

  // Create a new branch or switch if it exists
  async createBranch(branchName: string, checkout: boolean = true): Promise<string> {
    const branches = await this.git.branchLocal();

    if (branches.all.includes(branchName)) {
      if (checkout) await this.git.checkout(branchName);
      return branchName;
    }

    if (checkout) {
      await this.git.checkoutLocalBranch(branchName);
    } else {
      await this.git.branch([branchName]);
    }

    return branchName;
  }

  // Switch to an existing branch
  async switchBranch(branchName: string): Promise<void> {
    await this.git.checkout(branchName);
  }

  // Push branch to remote
  async push(remote: string = 'origin', branch?: string): Promise<void> {
    const status = await this.getStatus();
    const targetBranch = branch || status.branch;
    await this.git.push(remote, targetBranch);
  }

  // Undo last commit safely
  async rollback(): Promise<void> {
    await this.git.reset(['--hard', 'HEAD~1']);
  }

  // Get diff of all files or a single file
  async getDiff(fileFilter?: string): Promise<string> {
    return fileFilter ? this.git.diff(['--', fileFilter]) : this.git.diff();
  }

  // Get staged diff
  async getStagedDiff(): Promise<string> {
    return this.git.diff(['--staged']);
  }

  // Get commit logs
  async getLog(count: number = 10): Promise<{ hash: string; date: string; message: string; author_name: string }[]> {
    const log = await this.git.log({ maxCount: count });
    return log.all.map(entry => ({
      hash: entry.hash,
      date: entry.date,
      message: entry.message,
      author_name: entry.author_name,
    }));
  }

  // List all local branches
  async getBranches(): Promise<string[]> {
    const branches = await this.git.branchLocal();
    return branches.all;
  }

  // Check if a file is already staged
  async isStaged(filePath: string): Promise<boolean> {
    const status = await this.getStatus();
    return status.staged.includes(filePath);
  }

  // Check if a file exists in repo (tracked or untracked)
  async fileExists(filePath: string): Promise<boolean> {
    const status = await this.getStatus();
    return status.modified.includes(filePath) || status.created.includes(filePath) || status.staged.includes(filePath);
  }
}

// Export singleton instance for the agent
export const gitManager = new GitManager();
