# API Documentation

Complete API reference for the AI Code Agent Workspace.

## Table of Contents
- [AI Endpoints](#ai-endpoints)
- [File System Endpoints](#file-system-endpoints)
- [Git Endpoints](#git-endpoints)
- [Status Endpoints](#status-endpoints)

---

## AI Endpoints

### POST /api/prompt
Process a natural language prompt and generate code modifications.

**Request Body:**
```json
{
  "prompt": "Add error handling to the login function",
  "filePaths": ["src/auth/login.ts"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "I'll add comprehensive error handling...",
  "modifications": [
    {
      "filePath": "src/auth/login.ts",
      "originalContent": "...",
      "modifiedContent": "...",
      "explanation": "Added try-catch blocks..."
    }
  ],
  "suggestedCommitMessage": "feat: add error handling to login function"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## File System Endpoints

### GET /api/files
List files in a directory or search for files.

**Query Parameters:**
- `directory` (optional) - Directory path to list (default: ".")
- `pattern` (optional) - Glob pattern to search

**Response:**
```json
{
  "success": true,
  "files": [
    {
      "name": "example.ts",
      "path": "example.ts",
      "type": "file",
      "size": 1234,
      "modified": "2025-10-16T12:00:00.000Z"
    }
  ]
}
```

### POST /api/files
Create or update a file.

**Request Body:**
```json
{
  "filePath": "src/newfile.ts",
  "content": "export const hello = 'world';"
}
```

**Response:**
```json
{
  "success": true,
  "message": "File src/newfile.ts created/updated successfully"
}
```

### GET /api/files/[filePath]
Read a specific file.

**Response:**
```json
{
  "success": true,
  "path": "example.ts",
  "content": "// file content here",
  "language": "typescript"
}
```

### DELETE /api/files
Delete a file.

**Query Parameters:**
- `filePath` (required) - Path to the file to delete

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

## Git Endpoints

### GET /api/git
Get git status, branches, log, or diff.

**Query Parameters:**
- `action` - One of: `status`, `branches`, `log`, `diff`
- `count` (optional) - Number of commits for log (default: 10)
- `file` (optional) - File path for diff

**Examples:**

Get status:
```
GET /api/git?action=status
```

Response:
```json
{
  "success": true,
  "status": {
    "branch": "main",
    "ahead": 0,
    "behind": 0,
    "modified": ["file1.ts"],
    "created": ["file2.ts"],
    "deleted": [],
    "staged": []
  }
}
```

Get branches:
```
GET /api/git?action=branches
```

Response:
```json
{
  "success": true,
  "branches": ["main", "feature/new-feature"]
}
```

Get commit log:
```
GET /api/git?action=log&count=5
```

Response:
```json
{
  "success": true,
  "log": [
    {
      "hash": "abc123",
      "date": "2025-10-16T12:00:00.000Z",
      "message": "feat: add new feature",
      "author_name": "Developer"
    }
  ]
}
```

### POST /api/git
Perform git operations.

**Create/Switch Branch:**
```json
{
  "action": "branch",
  "name": "feature/new-feature",
  "checkout": true
}
```

**Checkout Branch:**
```json
{
  "action": "checkout",
  "branch": "main"
}
```

**Push Changes:**
```json
{
  "action": "push",
  "remote": "origin",
  "branch": "main"
}
```

**Rollback Commit:**
```json
{
  "action": "rollback"
}
```

---

## Commit Endpoint

### POST /api/commit
Create a git commit with optional code modifications.

**Request Body:**
```json
{
  "message": "feat: add new feature",
  "files": ["src/file.ts"],
  "branch": "feature/new-feature",
  "modifications": [
    {
      "filePath": "src/file.ts",
      "modifiedContent": "new content..."
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "commit": {
    "hash": "abc123",
    "message": "feat: add new feature",
    "branch": "feature/new-feature"
  },
  "message": "Changes committed successfully"
}
```

---

## Status Endpoints

### GET /api/health
Check service health.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-16T12:00:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "features": {
    "ai": true,
    "git": true,
    "fileSystem": true
  }
}
```

### GET /api/status
Check system status.

**Response:**
```json
{
  "success": true,
  "git": {
    "available": true,
    "branch": "main",
    "changes": 2
  },
  "fileSystem": {
    "available": true,
    "fileCount": 15
  },
  "ai": {
    "available": true,
    "configured": true
  }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `GIT_ERROR` | Git operation failed |
| `FILE_NOT_FOUND` | File or directory not found |
| `PERMISSION_DENIED` | Permission denied |
| `INTERNAL_ERROR` | Internal server error |
| `UNKNOWN_ERROR` | Unknown error occurred |

---

## Rate Limiting

Currently, there are no rate limits. In production, consider:
- API key authentication
- Rate limiting per user
- Request throttling

---

## Security

All endpoints validate input to prevent:
- Directory traversal attacks
- Code injection
- Unauthorized file access

Always use HTTPS in production.
