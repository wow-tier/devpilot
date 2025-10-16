# ✅ Complete Testing Guide - Repository Management

## 🎯 What Should Happen

When you add a GitHub repository and open workspace:

1. **Add Repository** → Saves GitHub URL to PostgreSQL database
2. **Open Workspace** → Clones from that GitHub URL
3. **File Explorer** → Shows files from YOUR GitHub repository
4. **Editor** → Loads YOUR code from GitHub
5. **Git Operations** → Work on YOUR cloned repository

---

## 🧪 Step-by-Step Testing

### **Step 1: Start Everything**

```bash
# Start PostgreSQL
docker start devpilot-db
# OR if doesn't exist:
docker run --name devpilot-db \
  -e POSTGRES_PASSWORD=devpilot123 \
  -e POSTGRES_DB=devpilot \
  -p 5432:5432 \
  -d postgres:15

# Generate Prisma Client
npx prisma generate

# Start application
npm run dev
```

### **Step 2: Open Browser with Console**

1. Open: http://localhost:3000
2. Press F12 to open Developer Console
3. Go to Console tab

### **Step 3: Login/Register**

1. Click "Get Started Free" or go to /login
2. Login with: `demo@aicode.dev` / `demo123`
3. Or create a new account

### **Step 4: Add Your GitHub Repository**

1. You should be on `/dashboard`
2. Click **"Add Repository"** button
3. Fill in the form with **YOUR** repository:
   ```
   Repository Name: my-project
   GitHub URL: https://github.com/yourusername/yourrepo
   Branch: main
   Description: My project description
   ```
4. Click **"Add Repository"**

### **Step 5: Watch Console Logs**

In the browser console, you should see:

```javascript
Adding repository: {
  name: "my-project",
  url: "https://github.com/yourusername/yourrepo",
  branch: "main",
  description: "My project description"
}

Repository created: {
  id: "uuid-here",
  userId: "your-user-id",
  name: "my-project",
  url: "https://github.com/yourusername/yourrepo",  // ← Should be YOUR URL
  defaultBranch: "main",
  ...
}
```

### **Step 6: Verify Repository Card**

The card should show:
- **Name:** my-project
- **Branch:** main
- **URL:** https://github.com/yourusername/yourrepo ← YOUR ACTUAL URL

**If it shows anything else (like "local" or "cursor/ai..."), that's the bug!**

### **Step 7: Open Workspace**

1. Click **"Open Workspace"** on the repository card
2. Watch console logs - should see:

```javascript
Starting repository clone for ID: uuid-here
Sending clone request to API...
Clone API response: {
  success: true,
  path: "/workspace/user-repos/your-user-id/my-project",
  repository: { ... }
}
Repository cloned successfully to: /workspace/user-repos/your-user-id/my-project
```

3. Server logs (in terminal where npm run dev is running) should show:

```
Cloning repository: {
  id: "uuid",
  name: "my-project",
  url: "https://github.com/yourusername/yourrepo",
  branch: "main"
}
Clone path: /workspace/user-repos/your-user-id/my-project
Repository does not exist, cloning from GitHub...
Repository cloned successfully from: https://github.com/yourusername/yourrepo
```

### **Step 8: Verify Workspace Shows YOUR Files**

1. Workspace should load
2. File Explorer on the left should show:
   - YOUR repository's folders
   - YOUR repository's files
   - NOT the workspace files
   - NOT "cursor/ai-code-agent-workspace-18bd"

3. Header should show:
   - Repository name: "my-project"
   - Branch: "main"  
   - URL: "https://github.com/yourusername/yourrepo"

---

## 🐛 If It Doesn't Work

### **Check 1: Is Repository Saved to Database?**

```bash
# Check PostgreSQL
docker exec -it devpilot-db psql -U postgres -d devpilot

SELECT id, name, url, "defaultBranch" 
FROM "Repository" 
WHERE name = 'my-project';

# Should show:
# id    | name       | url                                        | defaultBranch
# ------+------------+--------------------------------------------+--------------
# uuid  | my-project | https://github.com/yourusername/yourrepo  | main
```

**If the URL is wrong here, the API is not saving correctly!**

### **Check 2: Is Clone Working?**

```bash
# Check if directory was created
ls -la user-repos/

# Should show your user ID directory
ls -la user-repos/YOUR-USER-ID/

# Should show your cloned repository
ls -la user-repos/YOUR-USER-ID/my-project/

# Should have .git directory
ls -la user-repos/YOUR-USER-ID/my-project/.git
```

**If directory doesn't exist, clone failed!**

### **Check 3: Console Errors**

Look in browser console for errors like:
- "Failed to clone repository"
- "Unauthorized"
- "Repository not found"
- Network errors

### **Check 4: Network Tab**

1. Open F12 → Network tab
2. Add repository
3. Look for `POST /api/repositories`
4. Check Request Payload (should have your URL)
5. Check Response (should return your URL)

---

## ✅ Expected Complete Flow

```
Dashboard
  ↓
[Add Repository]
  ↓
Name: my-repo
URL: https://github.com/me/myrepo
  ↓
POST /api/repositories
  ↓
Database: INSERT INTO Repository (url = 'https://github.com/me/myrepo')
  ↓
Card appears with YOUR URL
  ↓
[Open Workspace]
  ↓
POST /api/repositories/clone
  ↓
git clone https://github.com/me/myrepo user-repos/user-id/my-repo
  ↓
Workspace loads
  ↓
File Explorer shows files from YOUR GitHub repo
  ↓
✅ SUCCESS!
```

---

## 🔍 Debug Output

With all the logging I added, you should see:

**Browser Console:**
```
Adding repository: { name, url, branch }
Repository created: { ...with your URL... }
Starting repository clone...
Clone API response: { path, repository }
```

**Server Terminal:**
```
Creating repository with data: { name, url, branch }
Repository created in database: { ...with your URL... }
Cloning repository: { url: YOUR_GITHUB_URL }
Repository cloned successfully from: YOUR_GITHUB_URL
```

---

## 📊 What to Tell Me

If it's not working, please share:

1. **What URL did you enter?**
2. **What URL shows in the card?**
3. **Any console errors?** (copy paste)
4. **What do the logs show?** (the console.log outputs)
5. **Database query result:**
   ```bash
   docker exec -it devpilot-db psql -U postgres -d devpilot -c "SELECT name, url FROM \"Repository\" ORDER BY \"createdAt\" DESC LIMIT 1;"
   ```

This will help me identify exactly where the URL is being lost!
