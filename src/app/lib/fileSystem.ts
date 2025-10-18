import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

export interface FileInfo {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  modified?: Date;
}

export interface FileContent {
  path: string;
  content: string;
  language?: string;
}

export class FileSystemManager {
  private basePath: string;

  constructor(basePath: string = process.cwd()) {
    this.basePath = basePath;
  }

  private resolvePath(relativePath: string, repoPath?: string): string {
    // If repoPath is provided, use it as the base, otherwise use the default basePath
    const base = repoPath || this.basePath;
    return path.join(base, relativePath);
  }

  async listFiles(directory: string = '.', repoPath?: string): Promise<FileInfo[]> {
    const fullPath = this.resolvePath(directory, repoPath);
    
    try {
      const entries = await fs.readdir(fullPath, { withFileTypes: true });
      
      const fileInfos: FileInfo[] = await Promise.all(
        entries
          .filter(entry => !entry.name.startsWith('.') && entry.name !== 'node_modules')
          .map(async (entry) => {
            const entryPath = path.join(directory, entry.name);
            const fullEntryPath = this.resolvePath(entryPath, repoPath);
            const stats = await fs.stat(fullEntryPath);
            
            return {
              name: entry.name,
              path: entryPath,
              type: entry.isDirectory() ? 'directory' : 'file',
              size: entry.isFile() ? stats.size : undefined,
              modified: stats.mtime,
            };
          })
      );

      return fileInfos.sort((a, b) => {
        if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  async readFile(filePath: string, repoPath?: string): Promise<FileContent> {
    const fullPath = this.resolvePath(filePath, repoPath);
    
    try {
      const content = await fs.readFile(fullPath, 'utf-8');
      
      return {
        path: filePath,
        content,
        language: this.detectLanguage(filePath),
      };
    } catch (error) {
      console.error('Error reading file:', fullPath, error);
      throw new Error(`Failed to read file: ${filePath}`);
    }
  }

  async writeFile(filePath: string, content: string, repoPath?: string): Promise<void> {
    const fullPath = this.resolvePath(filePath, repoPath);
    const dir = path.dirname(fullPath);
    
    try {
      // Ensure directory exists
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(fullPath, content, 'utf-8');
    } catch (error) {
      console.error('Error writing file:', fullPath, error);
      throw new Error(`Failed to write file: ${filePath}`);
    }
  }

  async deleteFile(filePath: string, repoPath?: string): Promise<void> {
    const fullPath = this.resolvePath(filePath, repoPath);
    
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      console.error('Error deleting file:', fullPath, error);
      throw new Error(`Failed to delete file: ${filePath}`);
    }
  }

  async createDirectory(dirPath: string, repoPath?: string): Promise<void> {
    const fullPath = this.resolvePath(dirPath, repoPath);
    
    try {
      await fs.mkdir(fullPath, { recursive: true });
    } catch (error) {
      console.error('Error creating directory:', fullPath, error);
      throw new Error(`Failed to create directory: ${dirPath}`);
    }
  }

  async searchFiles(pattern: string, directory: string = '.', repoPath?: string): Promise<string[]> {
    const base = repoPath || this.basePath;
    const searchPath = path.join(this.resolvePath(directory, repoPath), pattern);
    
    try {
      const files = await glob(searchPath, {
        ignore: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
      });
      
      return files.map(f => path.relative(base, f));
    } catch (error) {
      console.error('Error searching files:', error);
      return [];
    }
  }

  async fileExists(filePath: string, repoPath?: string): Promise<boolean> {
    try {
      const fullPath = this.resolvePath(filePath, repoPath);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  private detectLanguage(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const languageMap: Record<string, string> = {
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.py': 'python',
      '.java': 'java',
      '.c': 'c',
      '.cpp': 'cpp',
      '.cs': 'csharp',
      '.go': 'go',
      '.rs': 'rust',
      '.rb': 'ruby',
      '.php': 'php',
      '.html': 'html',
      '.css': 'css',
      '.scss': 'scss',
      '.json': 'json',
      '.md': 'markdown',
      '.yaml': 'yaml',
      '.yml': 'yaml',
      '.xml': 'xml',
      '.sh': 'shell',
      '.lock': 'json', // For composer.lock, package-lock.json, etc.
    };
    
    return languageMap[ext] || 'plaintext';
  }
}

export const fileSystem = new FileSystemManager();