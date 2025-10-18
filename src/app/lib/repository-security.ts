import { PrismaClient } from '@prisma/client';
import path from 'path';
import { promises as fs } from 'fs';

const prisma = new PrismaClient();

// Base directory for all user repositories
const REPOS_BASE_DIR = process.env.REPOS_BASE_DIR || path.join(process.cwd(), 'user-repos');

interface Repository {
  id: string;
  userId: string;
  name: string;
  url: string;
}

/**
 * Verify that a repository belongs to the authenticated user
 */
export async function verifyRepositoryOwnership(
  repositoryId: string, 
  userId: string
): Promise<{ valid: boolean; repository?: Repository; error?: string }> {
  try {
    const repository = await prisma.repository.findUnique({
      where: { id: repositoryId }
    });

    if (!repository) {
      return { valid: false, error: 'Repository not found' };
    }

    if (repository.userId !== userId) {
      return { valid: false, error: 'Access denied: You do not own this repository' };
    }

    return { valid: true, repository };
  } catch (error) {
    console.error('Error verifying repository ownership:', error);
    return { valid: false, error: 'Failed to verify repository ownership' };
  }
}

/**
 * Get the safe base path for a user's repository
 * This ensures users can ONLY access files within their own repositories
 */
export async function getRepositoryPath(repositoryId: string): Promise<string> {
  const repository = await prisma.repository.findUnique({
    where: { id: repositoryId },
    include: { user: true }
  });

  if (!repository) {
    throw new Error('Repository not found');
  }

  // Match the structure used in clone/route.ts: user-repos/{userId}/{repoName}
  const userRepoDir = path.join(REPOS_BASE_DIR, repository.userId);
  const repoName = repository.name.replace(/[^a-zA-Z0-9-_]/g, '-');
  return path.join(userRepoDir, repoName);
}

/**
 * Validate that a file path is within the allowed repository directory
 * Prevents path traversal attacks (../, absolute paths, etc.)
 */
export function validateFilePath(
  filePath: string, 
  repoBasePath: string
): { valid: boolean; fullPath?: string; error?: string } {
  try {
    // Remove any leading slashes
    const cleanPath = filePath.replace(/^\/+/, '');
    
    // Construct full path
    const fullPath = path.join(repoBasePath, cleanPath);
    const resolvedPath = path.resolve(fullPath);
    const resolvedBase = path.resolve(repoBasePath);

    // Ensure the resolved path is within the repository base
    if (!resolvedPath.startsWith(resolvedBase)) {
      return { 
        valid: false, 
        error: 'Access denied: Path traversal detected' 
      };
    }

    // Additional check: reject paths with .. or absolute paths
    if (cleanPath.includes('..') || path.isAbsolute(filePath)) {
      return { 
        valid: false, 
        error: 'Access denied: Invalid path' 
      };
    }

    return { valid: true, fullPath: resolvedPath };
  } catch {
    return { 
      valid: false, 
      error: 'Invalid file path' 
    };
  }
}

/**
 * Ensure the user repositories base directory exists
 */
export async function ensureReposDirectory(): Promise<void> {
  try {
    await fs.mkdir(REPOS_BASE_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating repos directory:', error);
  }
}

interface User {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
}

/**
 * Get user from token (helper function)
 */
export async function getUserFromToken(token: string): Promise<User | null> {
  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}
