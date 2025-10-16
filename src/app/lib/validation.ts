export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateFilePath = (filePath: string): void => {
  if (!filePath || typeof filePath !== 'string') {
    throw new ValidationError('File path is required and must be a string');
  }

  // Prevent directory traversal attacks
  if (filePath.includes('..')) {
    throw new ValidationError('Invalid file path: directory traversal not allowed');
  }

  // Prevent absolute paths
  if (filePath.startsWith('/')) {
    throw new ValidationError('Invalid file path: absolute paths not allowed');
  }
};

export const validateCommitMessage = (message: string): void => {
  if (!message || typeof message !== 'string') {
    throw new ValidationError('Commit message is required and must be a string');
  }

  if (message.trim().length < 3) {
    throw new ValidationError('Commit message must be at least 3 characters long');
  }

  if (message.length > 500) {
    throw new ValidationError('Commit message must not exceed 500 characters');
  }
};

export const validateBranchName = (branchName: string): void => {
  if (!branchName || typeof branchName !== 'string') {
    throw new ValidationError('Branch name is required and must be a string');
  }

  // Git branch naming rules
  const invalidChars = /[~^:?*\[\]\\]/;
  if (invalidChars.test(branchName)) {
    throw new ValidationError('Branch name contains invalid characters');
  }

  if (branchName.startsWith('.') || branchName.endsWith('.')) {
    throw new ValidationError('Branch name cannot start or end with a period');
  }

  if (branchName.includes('..')) {
    throw new ValidationError('Branch name cannot contain consecutive periods');
  }
};

export const validatePrompt = (prompt: string): void => {
  if (!prompt || typeof prompt !== 'string') {
    throw new ValidationError('Prompt is required and must be a string');
  }

  if (prompt.trim().length < 5) {
    throw new ValidationError('Prompt must be at least 5 characters long');
  }

  if (prompt.length > 10000) {
    throw new ValidationError('Prompt must not exceed 10000 characters');
  }
};

export const isTextFile = (filePath: string): boolean => {
  const textExtensions = [
    '.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.txt',
    '.css', '.scss', '.html', '.xml', '.yaml', '.yml',
    '.py', '.java', '.c', '.cpp', '.h', '.cs', '.go',
    '.rs', '.rb', '.php', '.sh', '.bash', '.sql',
  ];

  return textExtensions.some(ext => filePath.toLowerCase().endsWith(ext));
};

export const sanitizeFileName = (fileName: string): string => {
  // Remove any dangerous characters
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
};
