# AI Code Agent - Professional IDE Platform

## Overview

AI Code Agent is a production-ready, full-stack web-based IDE platform that combines AI-powered code generation with professional development tools. Built on Next.js 15 with TypeScript, it provides a complete development environment featuring natural language code modification, real-time editing with Monaco Editor, Git integration, and comprehensive repository management. The platform supports multi-user authentication, database-backed sessions, and AI-assisted development through OpenAI's GPT models.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & UI**
- Next.js 15 with App Router and Turbopack for fast development builds
- React 19 for component architecture with client-side rendering for interactive features
- TypeScript for type safety across the entire codebase
- Tailwind CSS v4 for styling with custom GitHub-inspired dark theme
- Monaco Editor (VS Code engine) for professional code editing capabilities

**Component Structure**
- Modular component design with clear separation of concerns
- Dynamic imports for heavy components (Monaco Editor) to optimize bundle size
- Error boundaries for graceful error handling
- Client-side state management without external state libraries

**Key UI Components**
- Multi-tab editor system with file management
- Sidebar with file explorer, search, and Git panels
- AI chat interface for natural language interactions
- Terminal emulator for command execution
- Settings panel for user preferences
- Diff preview for code change visualization

### Backend Architecture

**API Layer**
- Next.js API routes for RESTful endpoints
- Route handlers organized by feature domain (auth, files, git, repositories)
- Middleware-style error handling with custom error classes
- Input validation and sanitization for security

**Core Services**
1. **AI Service** (`lib/ai.ts`)
   - OpenAI GPT integration for code generation
   - Context-aware prompting with chat history
   - Multi-file code modification support
   - Automatic commit message generation

2. **File System Service** (`lib/fileSystem.ts`)
   - Secure file operations with path validation
   - Directory traversal prevention
   - File content reading/writing with language detection
   - Glob pattern matching for file search

3. **Git Service** (`lib/git.ts`)
   - Simple-git wrapper for repository operations
   - Branch management and status tracking
   - Commit creation and history retrieval
   - Diff generation for change visualization

4. **Repository Service** (`lib/repository-db.ts`)
   - Database operations for repository management
   - User-scoped repository isolation
   - Clone operations to user-specific directories
   - Repository metadata tracking

5. **Authentication Service** (`lib/auth-db.ts`)
   - Bcrypt password hashing for secure storage
   - JWT session token generation
   - Database-backed session management
   - Session verification and user retrieval

**Data Flow**
- Client requests → API routes → Service layer → External services/Database
- Response transformation at API layer
- Consistent error response format across all endpoints

### Data Storage

**PostgreSQL Database**
- Prisma ORM for type-safe database access
- 15-table schema supporting full platform features
- Key tables: User, Session, Repository, File, Project, Commit

**Schema Design Patterns**
- UUID primary keys for distributed system compatibility
- Timestamp tracking (createdAt, updatedAt) on all entities
- Soft deletes where appropriate
- Foreign key relationships with cascade rules

**Session Management**
- Database-backed sessions (not localStorage dependent)
- Token-based authentication with expiration
- Session validation on protected routes
- Automatic cleanup of expired sessions

**Repository Storage**
- User repositories cloned to `/user-repos/{userId}/{repoName}`
- Isolated file systems per user
- Repository metadata in database
- Local clone paths tracked for file operations

### Authentication & Authorization

**Authentication Flow**
1. User signup/login → Credentials validated against database
2. Password hashed with bcrypt (10 salt rounds)
3. Session token generated and stored in database
4. Token returned to client and sent in Authorization header
5. Token verified on each protected API call
6. User context retrieved from session

**Security Measures**
- Bcrypt password hashing (never store plain text)
- JWT tokens with expiration (7 days default)
- Authorization header for API authentication
- Input validation to prevent injection attacks
- Path traversal prevention in file operations
- CORS and security headers configuration

**Protected Routes**
- Dashboard, Workspace, Settings require valid session
- API routes verify token before processing
- Client-side route guards redirect to login
- Server-side session verification for data access

### External Dependencies

**AI Integration**
- OpenAI API (GPT-4, GPT-3.5 Turbo) for code generation
- API key configured via environment variable
- Context-aware prompting with chat history
- Streaming responses supported (not currently implemented)

**Database**
- PostgreSQL 15 for data persistence
- Prisma Client for database access
- Connection pooling for performance
- Migration system for schema changes

**Version Control**
- simple-git library wrapping Git CLI
- Repository cloning from GitHub/GitLab/etc.
- Local repository operations (commit, branch, diff)
- Git status and log retrieval

**Development Tools**
- Monaco Editor from @monaco-editor/react
- lucide-react for icon system
- diff library for code comparison
- glob for file pattern matching

**Third-Party Services**
- OpenAI API for AI capabilities (requires API key)
- Git hosting platforms (GitHub, GitLab, etc.) for repository sources
- Docker recommended for PostgreSQL in development

**Environment Configuration**
Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API authentication
- `NODE_ENV`: Environment mode (development/production)

**Deployment Considerations**
- Next.js serverless deployment compatible
- PostgreSQL database required (managed or self-hosted)
- File system access needed for repository cloning
- Environment variables must be configured
- Build process excludes user-repos directory