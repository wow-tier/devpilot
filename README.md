# 🤖 AI Code Agent Workspace

> **A fully-featured, AI-powered IDE that rivals Cursor and Replit**

An intelligent, professional web-based IDE with natural language understanding. Build, modify, and manage code through conversational AI - a complete development environment where AI is your pair programmer.

![AI Code Agent](https://img.shields.io/badge/AI-Powered-blue) ![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 What Makes This Special

- **🤖 AI-First Development**: Natural language to code in seconds
- **💻 Professional IDE**: Full Monaco editor with all the features you expect
- **🔥 Modern Stack**: Next.js 15, TypeScript, Tailwind CSS
- **⚡ Lightning Fast**: Turbopack compilation, instant updates
- **🎨 Beautiful Design**: Polished UI with smooth animations
- **🔧 Git Integrated**: Built-in version control and commit automation

## ✨ Features

### 🧠 AI-Powered Development
- ✅ **Natural Language to Code**: Describe what you want, AI writes it
- ✅ **Context-Aware AI**: Understands your entire codebase
- ✅ **Smart Refactoring**: Intelligent code improvements
- ✅ **Auto Commit Messages**: AI-generated git messages
- ✅ **Multi-File Editing**: Work across your entire project
- ✅ **Multiple AI Models**: GPT-4, GPT-3.5, Claude 3

### 💻 Professional Code Editor
- ✅ **Monaco Editor**: Same as VS Code
- ✅ **Multi-Tab System**: Work on multiple files
- ✅ **Syntax Highlighting**: 20+ languages
- ✅ **IntelliSense**: Auto-completion
- ✅ **Find & Replace**: Advanced search
- ✅ **Themes**: Dark, Light, Monokai, Dracula
- ✅ **Breadcrumbs**: File navigation
- ✅ **Minimap**: Code overview

### 🔧 Git Integration
- ✅ **Full Git Support**: Status, commit, branch, diff
- ✅ **Visual Diff**: Side-by-side comparison
- ✅ **Branch Management**: Create, switch, merge
- ✅ **Commit History**: Beautiful git log
- ✅ **Auto Staging**: Smart file staging
- ✅ **Push/Pull**: Remote sync

### 🖥️ Integrated Terminal
- ✅ **Built-in Terminal**: Execute commands
- ✅ **Command History**: Arrow key navigation
- ✅ **Git Commands**: Direct git access
- ✅ **npm Scripts**: Run package scripts
- ✅ **Split View**: Terminal + Editor

### ⌨️ Keyboard Shortcuts
- ✅ **Cmd+K**: Command Palette
- ✅ **Cmd+S**: Save File
- ✅ **Cmd+,**: Settings
- ✅ **Cmd+`**: Toggle Terminal
- ✅ **Cmd+D**: Toggle Diff
- ✅ Many more...

### 🎨 Modern Design
- ✅ **Polished UI**: Professional look & feel
- ✅ **Smooth Animations**: Delightful interactions
- ✅ **Glass Morphism**: Modern effects
- ✅ **Responsive**: Works on all screens
- ✅ **Dark/Light Themes**: Your preference
- ✅ **Custom Fonts**: JetBrains Mono, Fira Code

### 📁 Advanced File Management
- ✅ **Tabbed Sidebar**: Files, Search, Git, Extensions
- ✅ **Context Menus**: Right-click operations
- ✅ **File Operations**: Create, rename, delete
- ✅ **File Icons**: Visual indicators
- ✅ **Tree View**: Hierarchical structure
- ✅ **Search Panel**: Find in files

### ⚙️ Settings & Customization
- ✅ **Theme Switcher**: Multiple themes
- ✅ **Font Size**: Adjustable 10-24px
- ✅ **AI Model**: Choose your model
- ✅ **Editor Options**: Minimap, wrap, etc.
- ✅ **Auto Save**: Optional
- ✅ **Format on Save**: Optional

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
