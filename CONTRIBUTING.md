# Contributing to AI Code Agent Workspace

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/ai-code-agent.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## 💻 Development Workflow

### Running Locally
```bash
npm run dev
```

### Building
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## 📝 Code Guidelines

### TypeScript
- Use TypeScript for all new code
- Avoid `any` types - use `unknown` or proper types
- Export types and interfaces when they're used across files

### React Components
- Use functional components with hooks
- Keep components focused and single-purpose
- Use proper TypeScript types for props

### API Routes
- Always validate input using the validation utilities
- Use proper error handling with try-catch
- Return consistent response formats
- Use appropriate HTTP status codes

### Git Commits
Follow conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring
- `test:` - Adding tests

Example:
```bash
git commit -m "feat: add file search functionality"
```

## 🧪 Testing

Before submitting a PR:
1. Test your changes locally
2. Ensure the build passes: `npm run build`
3. Check for linting errors: `npm run lint`
4. Test core functionality:
   - File operations (read, write, delete)
   - Git operations (status, commit, branch)
   - AI prompt processing
   - UI interactions

## 📋 Pull Request Process

1. **Update Documentation**
   - Update README.md if you add features
   - Add comments to complex code
   - Update API documentation if needed

2. **Code Review**
   - Ensure code follows project style
   - Add meaningful commit messages
   - Keep PRs focused on a single feature/fix

3. **PR Description**
   ```markdown
   ## Summary
   Brief description of changes
   
   ## Changes
   - List of specific changes
   
   ## Testing
   How to test the changes
   
   ## Screenshots (if applicable)
   Add screenshots for UI changes
   ```

## 🐛 Reporting Bugs

Use GitHub Issues with the bug template:
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots or error logs

## 💡 Feature Requests

Use GitHub Issues with the feature template:
- Clear description of the feature
- Use case / problem it solves
- Proposed implementation (optional)
- Mockups or examples (optional)

## 🏗️ Project Structure

```
/workspace
├── src/app/
│   ├── api/           # API routes
│   ├── components/    # React components
│   ├── lib/          # Utility libraries
│   └── page.tsx      # Main app page
├── scripts/          # Build and setup scripts
└── public/          # Static assets
```

## 🔒 Security

- Never commit API keys or secrets
- Use environment variables for sensitive data
- Validate all user input
- Follow security best practices

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

- Open a GitHub Discussion
- Check existing issues and PRs
- Read the README.md and documentation

## 🙏 Thank You!

Your contributions make this project better for everyone!
