# Quick Setup Guide

## 🚀 Getting Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure OpenAI API Key
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-api-key-here
```

**Get your API key:** https://platform.openai.com/api-keys

### 3. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## ✅ Verify Installation

Once the app is running:
1. You should see the file explorer on the left
2. Click on `example.ts` to open it
3. Use the AI chat on the right to modify the code
4. Try: "Add error handling to the UserService class"

## 🎯 First Test

1. **Open a file:** Click on `example.ts` in the file explorer
2. **Chat with AI:** In the AI chat panel, type:
   ```
   Add error handling to all methods in the UserService class
   ```
3. **Review changes:** Click "Show Diff" to see proposed changes
4. **Apply & Commit:** Click "Apply & Commit" to save changes

## 📝 Common Issues

### OpenAI API Key Not Working
- Make sure your `.env` file is in the root directory
- Restart the dev server after adding the API key
- Check that your API key starts with `sk-`

### Port Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## 🔧 Optional Configuration

### GitHub Integration (Optional)
To enable pushing to remote repositories:
```env
GITHUB_TOKEN=your_github_token_here
```

### Custom Port
```env
PORT=3001
```

## 📚 Next Steps

- Read the [README.md](README.md) for full documentation
- Try the example prompts in `example.ts`
- Explore the API routes in `src/app/api/`

## 🆘 Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review error logs in the terminal
- Ensure all dependencies are installed correctly
