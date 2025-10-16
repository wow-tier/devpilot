# ⚡ Quick Start Guide

Get up and running in 60 seconds!

## 🚀 Installation

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd ai-code-agent
npm install
```

### 2. Configure API Key
```bash
cp .env.example .env
# Edit .env and add: OPENAI_API_KEY=your_key_here
```

### 3. Run!
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🎯 First Steps

### 1. Welcome Screen
You'll see a beautiful welcome screen with quick examples

### 2. Open a File
- Click the 📁 Files icon in the left sidebar
- Select `example.ts` to open it
- The file opens in a new tab

### 3. Chat with AI
- Use the AI chat panel on the right
- Try: **"Add error handling to all methods"**
- Watch the AI generate code!

### 4. Review Changes
- Click "Show Diff" to see changes
- Review the modifications
- Click "Apply & Commit" to save

---

## ⌨️ Essential Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` | Open Command Palette |
| `Cmd+S` | Save Current File |
| `Cmd+,` | Open Settings |
| `Cmd+`` | Toggle Terminal |
| `Cmd+D` | Toggle Diff View |

---

## 💡 Try These AI Prompts

### Code Generation
```
"Create a React component for a user profile card"
"Add a REST API endpoint for user authentication"
"Implement a binary search algorithm"
```

### Code Improvement
```
"Add error handling to the UserService class"
"Refactor this code to use async/await"
"Add TypeScript types to all functions"
```

### Debugging
```
"Fix the memory leak in this useEffect"
"Handle edge cases in the validation function"
"Add input validation and sanitization"
```

---

## 🎨 Customize Your Workspace

### Change Theme
1. Press `Cmd+,` for Settings
2. Select your theme (Dark, Light, Monokai, Dracula)
3. Adjust font size with slider
4. Click "Save Settings"

### Choose AI Model
- **GPT-4**: Most capable, best quality
- **GPT-3.5 Turbo**: Faster, lower cost
- **Claude 3**: Alternative AI

---

## 📁 Working with Files

### Create Files
1. Click 📄 icon in file explorer
2. Or use Command Palette → "New File"

### Multiple Tabs
- Click files to open in tabs
- Close with X on tab
- Switch with mouse or `Cmd+Tab`

### Search in Files
1. Click 🔍 icon in sidebar
2. Enter search term
3. Click results to jump to file

---

## 🔧 Git Workflow

### Make Changes
1. Edit your files
2. Save with `Cmd+S`
3. Click Git icon to see changes

### Commit
1. Review changed files
2. Write commit message (or use AI suggestion)
3. Click "Commit Changes"

### View History
- See recent commits in Git panel
- Click to view commit details

---

## 🖥️ Using the Terminal

### Open Terminal
- Press `Cmd+`` or click Terminal button
- Type commands directly

### Useful Commands
```bash
help          # Show available commands
ls            # List files
git status    # Git status
git log       # Commit history
npm install   # Install dependencies
clear         # Clear terminal
```

---

## 🆘 Troubleshooting

### AI Not Working?
- Check `.env` has `OPENAI_API_KEY`
- Restart dev server: `Ctrl+C` then `npm run dev`
- Verify API key at https://platform.openai.com

### Build Errors?
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use?
```bash
npm run dev -- -p 3001
```

---

## 🎓 Learning Resources

- 📖 [Full Documentation](./README.md)
- 🎯 [Feature List](./docs/FEATURES.md)
- 🔌 [API Reference](./docs/API.md)
- 🤝 [Contributing Guide](./CONTRIBUTING.md)

---

## 🚀 Next Steps

1. ✅ Try the example prompts
2. ✅ Explore the command palette (`Cmd+K`)
3. ✅ Customize your settings
4. ✅ Create your first AI-generated code
5. ✅ Commit your changes with AI message

---

**Happy Coding! 🎉**
