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

  async createBranch(branchName: string, checkout: boolean = true): Promise<string> {
    // Check if branch already exists
    const branches = await this.git.branchLocal();
    
    if (branches.all.includes(branchName)) {
      if (checkout) {
        await this.git.checkout(branchName);
      }
      return branchName;
    }

    // Create and optionally checkout new branch
    if (checkout) {
      await this.git.checkoutLocalBranch(branchName);
    } else {
      await this.git.branch([branchName]);
    }

    return branchName;
  }

  async switchBranch(branchName: string): Promise<void> {
    await this.git.checkout(branchName);
  }

  async commit(message: string, files?: string[]): Promise<CommitResult> {
    // Add files
    if (files && files.length > 0) {
      await this.git.add(files);
    } else {
      await this.git.add('.');
    }

    // Commit
    const result = await this.git.commit(message);
    const status = await this.getStatus();

    return {
      hash: result.commit,
      message: message,
      branch: status.branch,
    };
  }

  async getDiff(fileFilter?: string): Promise<string> {
    if (fileFilter) {
      return await this.git.diff(['--', fileFilter]);
    }
    return await this.git.diff();
  }

  async getStagedDiff(): Promise<string> {
    return await this.git.diff(['--staged']);
  }

  async getLog(count: number = 10): Promise<{ hash: string; date: string; message: string; author_name: string }[]> {
    const log = await this.git.log({ maxCount: count });
    return log.all.map(entry => ({
      hash: entry.hash,
      date: entry.date,
      message: entry.message,
      author_name: entry.author_name
    }));
  }

  async getBranches(): Promise<string[]> {
    const branches = await this.git.branchLocal();
    return branches.all;
  }

  async push(remote: string = 'origin', branch?: string): Promise<void> {
    const status = await this.getStatus();
    const targetBranch = branch || status.branch;
    await this.git.push(remote, targetBranch);
  }

  async rollback(): Promise<void> {
    await this.git.reset(['--hard', 'HEAD~1']);
  }
}

export const gitManager = new GitManager();
