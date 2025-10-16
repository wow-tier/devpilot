# ✅ USER REPOSITORIES - COMPLETE GUIDE

## 🎉 NOW WORKING: Each User Can Add Their Own GitHub Repos!

The workspace is **NO LONGER HARDCODED**! Now it properly clones and uses YOUR actual GitHub repositories.

---

## 🚀 How It Works Now

### **1. Add Repository (Dashboard)**
- User adds GitHub URL: `https://github.com/wow-tier/expense`
- Saves to PostgreSQL database with user ID
- Repository info stored per user

### **2. Open Workspace**
- Click "Open Workspace" on any repo
- System clones from GitHub to: `/user-repos/{userId}/{repoName}`
- Each user has isolated directory
- Multiple repos supported per user

### **3. Work on Code**
- File explorer shows files from YOUR cloned repo
- Editor loads YOUR actual files
- All edits save to YOUR repository
- Git operations work on YOUR repo

### **4. Commit & Push**
- AI modifies YOUR code
- Commits to YOUR local repo
- Push back to YOUR GitHub

---

## 📂 Repository Structure

```
/workspace/
├── user-repos/                    # All user repositories
│   ├── user-id-1/                # User 1's repos
│   │   ├── expense/              # Cloned from github.com/wow-tier/expense
│   │   │   ├── src/
│   │   │   ├── package.json
│   │   │   └── ...
│   │   ├── my-app/               # Another repo
│   │   └── project-x/            # Another repo
│   │
│   ├── user-id-2/                # User 2's repos (isolated)
│   │   ├── their-repo/
│   │   └── ...
│   │
│   └── user-id-3/                # User 3's repos (isolated)
│       └── ...
```

**Each user's repos are completely isolated!**

---

## 🔄 Complete Flow

### **Step 1: Add Repository**
```
Dashboard → Add Repository Button

Name: expense
URL: https://github.com/wow-tier/expense
Branch: main

[Add Repository]
```

**Saved to Database:**
```sql
INSERT INTO Repository (
  id, userId, name, url, defaultBranch
) VALUES (
  'uuid-1', 'user-123', 'expense',
  'https://github.com/wow-tier/expense', 'main'
);
```

### **Step 2: Open Workspace**
```
Click "Open Workspace" on expense card
```

**What Happens:**
1. POST to `/api/repositories/clone`
2. Authenticates user with token
3. Gets repo from database
4. Clones to: `/user-repos/user-123/expense`
5. Loads workspace with cloned files

### **Step 3: Edit Files**
```
File Explorer → Shows files from /user-repos/user-123/expense
Click file → Loads actual content from YOUR repo
Edit → Saves to YOUR repo
```

**File Operations:**
- `GET /api/files?repoPath=/user-repos/user-123/expense`
- `POST /api/files` (with repoPath) → Saves to YOUR repo
- All operations scoped to YOUR cloned repo

### **Step 4: Git Operations**
```
Git Panel → Shows status from YOUR repo
Commit → Commits to YOUR repo
Push → Pushes to YOUR GitHub
```

**Git Commands:**
- `git status` → Runs in `/user-repos/user-123/expense`
- `git commit` → Commits YOUR changes
- `git push` → Pushes to `https://github.com/wow-tier/expense`

---

## 🎯 Example: Adding wow-tier/expense

### **Complete Walkthrough:**

**1. Start Application:**
```bash
docker start devpilot-db
npx prisma generate  
npm run dev
```

**2. Login:**
```
http://localhost:3000/login
Email: demo@aicode.dev
Password: demo123
```

**3. Add Repository:**
```
Dashboard → [Add Repository]

Repository Name: expense
GitHub URL: https://github.com/wow-tier/expense
Branch: main
Description: Expense tracking app

[Add Repository]
```

**Result:**
- ✅ Saved to database
- ✅ Card appears in dashboard
- ✅ Shows GitHub URL

**4. Open Workspace:**
```
Click "Open Workspace" on expense card
```

**What You'll See:**
```
Cloning Repository...
expense from https://github.com/wow-tier/expense

[Spinner animation]
```

**Then:**
```
┌─────────────────────────────────────────────┐
│ expense  |  main  |  github.com/wow-tier... │
├─────────────────────────────────────────────┤
│ 📁 Files          │  Editor  │  AI Chat    │
│                   │          │             │
│ ├─ src/          │          │             │
│ │  ├─ index.js   │          │             │
│ │  ├─ App.jsx    │          │             │
│ │  └─ ...        │          │             │
│ ├─ package.json  │          │             │
│ └─ README.md     │          │             │
└─────────────────────────────────────────────┘
```

**5. Work on Code:**
- Click `src/App.jsx` → Opens YOUR actual file
- Edit code → Saves to YOUR repo
- Ask AI to modify → Changes YOUR files

**6. Commit:**
```
Git Panel → Shows YOUR changes
Enter commit message: "Add new feature"
[Commit] → Commits to YOUR repo
```

---

## 🔐 Security & Isolation

### **Per-User Isolation:**
- Each user: `/user-repos/{userId}/`
- No cross-user access
- Path traversal prevented
- Security checks on all operations

### **Database Association:**
```sql
Repository {
  id: "uuid"
  userId: "user-123"  ← Ensures ownership
  url: "https://github.com/wow-tier/expense"
  ...
}
```

### **API Security:**
- All endpoints check session token
- User can only access their repos
- Path validation prevents escaping
- Repository ownership verified

---

## 📋 API Endpoints

### **Clone Repository:**
```bash
POST /api/repositories/clone
Authorization: Bearer {token}

{
  "repositoryId": "uuid-1"
}

Response:
{
  "success": true,
  "path": "/user-repos/user-123/expense",
  "repository": { ... }
}
```

### **List Files:**
```bash
GET /api/files?directory=src&repoPath=/user-repos/user-123/expense

Response:
{
  "success": true,
  "files": [
    { "name": "index.js", "path": "src/index.js", "type": "file" },
    { "name": "App.jsx", "path": "src/App.jsx", "type": "file" }
  ]
}
```

### **Read File:**
```bash
GET /api/files/src/App.jsx?repoPath=/user-repos/user-123/expense

Response:
{
  "success": true,
  "content": "import React from 'react'..."
}
```

### **Save File:**
```bash
POST /api/files

{
  "filePath": "src/App.jsx",
  "content": "updated code...",
  "repoPath": "/user-repos/user-123/expense"
}
```

### **Git Status:**
```bash
GET /api/git?action=status&repoPath=/user-repos/user-123/expense

Response:
{
  "success": true,
  "status": {
    "current": "main",
    "modified": ["src/App.jsx"],
    ...
  }
}
```

---

## ✅ Features Working

### **Repository Management:**
- ✅ Add unlimited GitHub repos
- ✅ Each repo saved to database
- ✅ Stored with user ID (isolation)
- ✅ Clone on workspace open
- ✅ Update with git pull if exists

### **File Operations:**
- ✅ List files from cloned repo
- ✅ Read actual file content
- ✅ Save changes to user's repo
- ✅ Create/delete files in user's repo
- ✅ All operations scoped to repoPath

### **Git Integration:**
- ✅ Status from user's repo
- ✅ Commit to user's repo
- ✅ Push to user's GitHub
- ✅ Branch operations
- ✅ Diff viewer

### **AI Features:**
- ✅ AI modifies user's actual files
- ✅ Changes saved to user's repo
- ✅ Auto-commits to user's repo
- ✅ Works on user's codebase

---

## 🧪 Testing

### **Test 1: Add Multiple Repos**
```bash
# Add repo 1
Name: expense
URL: https://github.com/wow-tier/expense

# Add repo 2  
Name: my-app
URL: https://github.com/yourusername/my-app

# Add repo 3
Name: project-x
URL: https://github.com/company/project-x
```

**Expected:**
- ✅ All 3 repos in dashboard
- ✅ Can open each separately
- ✅ Each clones to different directory
- ✅ All isolated from each other

### **Test 2: Multiple Users**
```bash
# User 1 adds expense
→ Clones to /user-repos/user-1/expense

# User 2 adds expense  
→ Clones to /user-repos/user-2/expense

# Completely isolated!
```

### **Test 3: Clone, Edit, Commit**
```bash
1. Add repo → Saved to DB
2. Open workspace → Cloned from GitHub
3. Edit file → Saved to cloned repo
4. Commit → Committed to local repo
5. Push → Pushed to GitHub
```

---

## 🐛 Troubleshooting

### **Issue: Clone Fails**

**Check:**
```bash
# Is GitHub URL accessible?
curl -I https://github.com/wow-tier/expense

# Check disk space
df -h

# Check permissions
ls -la user-repos/
```

**Fix:**
```bash
# Create directory manually
mkdir -p user-repos/{userId}
chmod 755 user-repos/

# Restart
npm run dev
```

### **Issue: Can't See Files**

**Check:**
```bash
# Was repo cloned?
ls user-repos/{userId}/{repoName}/

# Check API response
# Browser console → Network tab → /api/files
```

**Fix:**
```bash
# Re-clone
rm -rf user-repos/{userId}/{repoName}
# Re-open workspace
```

### **Issue: Git Operations Fail**

**Check:**
```bash
# Is .git directory present?
ls -la user-repos/{userId}/{repoName}/.git

# Test git manually
cd user-repos/{userId}/{repoName}
git status
```

---

## 🎉 Success!

**NO MORE HARDCODED DATA!**

✅ Each user can add unlimited repos  
✅ All repos saved to database  
✅ Repos cloned from GitHub  
✅ Complete isolation per user  
✅ All operations on user's actual repos  
✅ Git operations work correctly  
✅ AI modifies user's real code  

**Your workspace now uses YOUR actual GitHub repositories!** 🚀
