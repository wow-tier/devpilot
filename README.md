# 🤖 AI Code Agent Workspace

An intelligent, AI-powered web-based IDE that understands natural language and helps you build, modify, and manage code. Think Replit meets Cursor - a full-stack development environment with an embedded AI agent that can read, write, and modify your code based on conversational prompts.

![AI Code Agent](https://img.shields.io/badge/AI-Powered-blue) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🧠 AI-Powered Development
- **Natural Language Understanding**: Describe what you want to build, and the AI writes the code
- **Context-Aware Modifications**: AI understands your codebase and makes intelligent changes
- **Automated Commit Messages**: AI suggests meaningful git commit messages
- **Multi-File Support**: Works across your entire project

### 💻 Full-Featured IDE
- **Monaco Editor**: The same editor that powers VS Code
- **File Explorer**: Navigate and manage your project files
- **Syntax Highlighting**: Support for 20+ programming languages
- **Real-time Editing**: Instant file saving and reloading

### 🔧 Git Integration
- **Branch Management**: Create, switch, and manage branches
- **Smart Commits**: Automatic staging and committing
- **Diff Preview**: Visual comparison of changes before committing
- **Commit History**: View recent commits and changes

### 🎨 Modern UI
- **Dark Theme**: Easy on the eyes for long coding sessions
- **Split Panels**: Code editor, file explorer, AI chat, and git panel
- **Responsive Design**: Works on desktop and tablet devices

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git initialized in your project
- OpenAI API key (for AI functionality)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-code-agent.git
cd ai-code-agent
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Basic Workflow

1. **Select a File**
   - Use the file explorer on the left to navigate your project
   - Click on any file to open it in the editor

2. **Chat with AI**
   - Use the AI chat panel on the right to describe what you want
   - Example: "Add error handling to the login function"
   - Example: "Create a new React component for user profiles"

3. **Review Changes**
   - The AI will suggest modifications
   - Click "Show Diff" to see what will change
   - Review the changes in the diff preview

4. **Apply & Commit**
   - Click "Apply & Commit" to apply changes
   - Changes are automatically committed to git
   - View the commit in the git panel

### Example Prompts

**Creating New Features:**
```
"Add user authentication using JWT"
"Create a REST API endpoint for user registration"
"Implement a shopping cart feature"
```

**Modifying Existing Code:**
```
"Add error handling to all API routes"
"Refactor the UserService class to use async/await"
"Add TypeScript types to the user model"
```

**Bug Fixes:**
```
"Fix the memory leak in the useEffect hook"
"Handle edge cases in the validation function"
"Fix the race condition in the data fetching logic"
```

## 🏗️ Architecture

### Backend (Next.js API Routes)
- `/api/prompt` - Process AI prompts and generate code modifications
- `/api/files` - File system operations (read, write, delete)
- `/api/git` - Git operations (status, branch, commit, diff)
- `/api/commit` - Create commits with modifications

### Core Libraries
- **AI Agent** (`lib/ai.ts`) - OpenAI integration and prompt processing
- **Git Manager** (`lib/git.ts`) - Git operations wrapper
- **File System** (`lib/fileSystem.ts`) - Safe file operations
- **Validation** (`lib/validation.ts`) - Input validation and sanitization

### Frontend Components
- **CodeEditor** - Monaco Editor wrapper
- **FileExplorer** - Project file tree
- **AIChat** - Conversational AI interface
- **GitPanel** - Git status and commit history
- **DiffPreview** - Visual diff viewer

## 🔌 API Reference

### POST /api/prompt
Process a natural language prompt and generate code modifications.

**Request:**
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

### POST /api/commit
Create a git commit with optional modifications.

**Request:**
```json
{
  "message": "feat: add error handling",
  "modifications": [...],
  "branch": "feature/error-handling"
}
```

### GET /api/files
List files in a directory or search for files.

**Query Parameters:**
- `directory` - Directory path to list
- `pattern` - Glob pattern to search

### GET /api/git
Get git status, branches, log, or diff.

**Query Parameters:**
- `action` - One of: `status`, `branches`, `log`, `diff`
- `count` - Number of commits (for log)
- `file` - File path (for diff)

## 🛡️ Security

- **Path Validation**: Prevents directory traversal attacks
- **Input Sanitization**: All user inputs are validated
- **File Type Restrictions**: Only text files can be edited
- **Git Safety**: Prevents force pushes and destructive operations

## 🔧 Configuration

### Environment Variables
- `OPENAI_API_KEY` - Required for AI functionality
- `GITHUB_TOKEN` - Optional, for pushing to remote repos
- `NODE_ENV` - development or production

### Customization
You can customize the AI behavior by modifying `src/app/lib/ai.ts`:
- Change the AI model (currently using GPT-4 Turbo)
- Adjust temperature and max tokens
- Modify system prompts

## 🧪 Development

### Project Structure
```
/workspace
├── src/
│   └── app/
│       ├── api/              # API routes
│       │   ├── prompt/       # AI prompt handling
│       │   ├── commit/       # Git commits
│       │   ├── files/        # File operations
│       │   └── git/          # Git operations
│       ├── components/       # React components
│       │   ├── Editor.tsx    # Monaco editor
│       │   ├── AIChat.tsx    # AI chat interface
│       │   ├── FileExplorer.tsx
│       │   ├── GitPanel.tsx
│       │   └── DiffPreview.tsx
│       ├── lib/              # Core utilities
│       │   ├── ai.ts         # AI agent logic
│       │   ├── git.ts        # Git operations
│       │   ├── fileSystem.ts # File operations
│       │   ├── validation.ts # Input validation
│       │   └── errorHandler.ts
│       └── page.tsx          # Main IDE page
├── package.json
└── tsconfig.json
```

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [OpenAI](https://openai.com/) - AI models
- [simple-git](https://github.com/steveukx/git-js) - Git integration
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## 🚧 Roadmap

- [ ] Multi-file AI editing in a single session
- [ ] GitHub OAuth integration
- [ ] Real-time collaboration
- [ ] Plugin system for custom commands
- [ ] Terminal integration
- [ ] Code review AI agent
- [ ] Automated testing generation
- [ ] Deployment integration

## 💬 Support

- 📧 Email: support@aicodeworkspace.com
- 💬 Discord: [Join our community](https://discord.gg/aicode)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/ai-code-agent/issues)

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

**Built with ❤️ by the AI Code Agent team**
