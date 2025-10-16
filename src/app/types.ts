// Core types for the AI Code Agent

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

export interface CodeModification {
  filePath: string;
  originalContent: string;
  modifiedContent: string;
  explanation: string;
}

export interface AgentResponse {
  message: string;
  modifications: CodeModification[];
  suggestedCommitMessage?: string;
  error?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
