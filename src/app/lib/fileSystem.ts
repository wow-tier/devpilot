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

  private resolvePath(relativePath: string): string {
    return path.join(this.basePath, relativePath);
  }

  async listFiles(directory: string = '.'): Promise<FileInfo[]> {
    const fullPath = this.resolvePath(directory);
    
    try {
      const entries = await fs.readdir(fullPath, { withFileTypes: true });
      
      const fileInfos: FileInfo[] = await Promise.all(
        entries
          .filter(entry => !entry.name.startsWith('.') && entry.name !== 'node_modules')
          .map(async (entry) => {
            const entryPath = path.join(directory, entry.name);
            const fullEntryPath = this.resolvePath(entryPath);
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
      return [];
    }
  }

  async readFile(filePath: string): Promise<FileContent> {
    const fullPath = this.resolvePath(filePath);
    const content = await fs.readFile(fullPath, 'utf-8');
    
    return {
      path: filePath,
      content,
      language: this.detectLanguage(filePath),
    };
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    const fullPath = this.resolvePath(filePath);
    const dir = path.dirname(fullPath);
    
    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(fullPath, content, 'utf-8');
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = this.resolvePath(filePath);
    await fs.unlink(fullPath);
  }

  async createDirectory(dirPath: string): Promise<void> {
    const fullPath = this.resolvePath(dirPath);
    await fs.mkdir(fullPath, { recursive: true });
  }

  async searchFiles(pattern: string, directory: string = '.'): Promise<string[]> {
    const searchPath = path.join(this.resolvePath(directory), pattern);
    const files = await glob(searchPath, {
      ignore: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
    });
    
    return files.map(f => path.relative(this.basePath, f));
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      const fullPath = this.resolvePath(filePath);
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
    };

    return languageMap[ext] || 'plaintext';
  }
}

export const fileSystem = new FileSystemManager();
