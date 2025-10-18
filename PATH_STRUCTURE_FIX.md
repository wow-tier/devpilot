# Repository Path Structure Fix

## 🔴 Problem
The clone route and file API were using different path structures:
- **Clone route**: `user-repos/{userId}/{repoName}`
- **File API**: `user-repos/{repositoryId}`

This caused "ENOENT: no such file or directory" errors when trying to access repository files.

## ✅ Solution
Updated all components to use the same structure: `user-repos/{userId}/{repoName}`

---

## 📁 Path Structure

### Correct Structure
```
user-repos/
  └── {userId}/           # User's ID from database
      ├── {repo1-name}/   # First repository
      │   ├── .git/
      │   ├── src/
      │   └── package.json
      └── {repo2-name}/   # Second repository
          ├── .git/
          └── README.md
```

### Example
```
user-repos/
  └── cmgts0u5m0000p5gl3u80h0et/    # User bob@bob.com
      ├── Lisa/                      # Repository "Lisa"
      │   └── .git/
      └── my-project/                # Repository "my-project"
          └── .git/
```

---

## 🔧 What Was Fixed

### 1. `lib/repository-security.ts`
**Before:**
```typescript
const safeDirName = repositoryId.replace(/[^a-zA-Z0-9-_]/g, '');
return path.join(REPOS_BASE_DIR, safeDirName);
// Result: user-repos/cmgwkrcbo0001p5sqminnwhir
```

**After:**
```typescript
const userRepoDir = path.join(REPOS_BASE_DIR, repository.userId);
const repoName = repository.name.replace(/[^a-zA-Z0-9-_]/g, '-');
return path.join(userRepoDir, repoName);
// Result: user-repos/cmgts0u5m0000p5gl3u80h0et/Lisa
```

### 2. `api/files/route.ts`
**Added:**
- Directory existence check
- Better error messages
- Returns 404 if repository not cloned

```typescript
// Check if directory exists
try {
  await fs.access(targetPath);
} catch {
  return NextResponse.json({
    success: false,
    error: 'Repository directory not found. Please clone the repository first.',
    files: [],
    currentPath: directory
  }, { status: 404 });
}
```

### 3. `workspace/page.tsx`
**Added:**
- Handle 404 response from file API
- Show helpful error message
- Redirect to welcome screen if repo not found

```typescript
if (response.status === 404) {
  setCloneError(data.error || 'Repository directory not found. Please clone again.');
  setShowWelcome(true);
}
```

### 4. New API: `api/repositories/sync-path/route.ts`
- Verify repository path exists
- Helpful debugging endpoint
- Returns expected path structure

---

## 🚀 Setup Steps

### 1. Ensure Directory Exists
```bash
# In your application directory
mkdir -p user-repos
chmod 755 user-repos
```

### 2. Verify Structure
```bash
# Run the check script
chmod +x scripts/check-repo-structure.sh
./scripts/check-repo-structure.sh
```

### 3. Rebuild & Deploy
```bash
npm run build
pm2 restart devpilot
```

### 4. Re-clone Existing Repositories
Users will need to re-clone repositories from the dashboard if they were cloned before this fix.

---

## 🧪 Testing

### Test 1: Clone Repository
1. Go to Dashboard
2. Click "Open in Workspace" on a repository
3. Wait for clone to complete
4. Verify files load in workspace

**Expected Result:**
```
✅ Clone path: /workspace/user-repos/{userId}/{repoName}
✅ Files load successfully
✅ No "ENOENT" errors
```

### Test 2: Check Path Sync
```bash
curl -X POST http://localhost:3000/api/repositories/sync-path \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"repositoryId": "YOUR_REPO_ID"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Repository path is valid",
  "path": "/workspace/user-repos/{userId}/{repoName}",
  "exists": true
}
```

### Test 3: File Operations
1. Open workspace with repository
2. Click on files in sidebar
3. Edit a file
4. Save changes

**Expected Result:**
```
✅ Files load
✅ Can edit
✅ Can save
✅ No path errors
```

---

## 🔍 Debugging

### Check Repository Path
```bash
# Find where repositories are stored
find /path/to/app -name ".git" -type d

# Check user-repos structure
ls -la user-repos/
ls -la user-repos/*/
```

### Common Issues

#### Issue: "Repository directory not found"
**Cause:** Repository was cloned before path structure fix
**Solution:** Re-clone the repository from dashboard

#### Issue: "ENOENT: no such file or directory"
**Cause:** Path mismatch or directory doesn't exist
**Solution:**
1. Check `user-repos/` directory exists
2. Verify structure: `user-repos/{userId}/{repoName}`
3. Re-clone if necessary

#### Issue: "Access denied"
**Cause:** User doesn't own the repository
**Solution:** Verify repository belongs to logged-in user

---

## 📋 Verification Checklist

- [x] `user-repos/` directory exists
- [x] Path structure: `user-repos/{userId}/{repoName}`
- [x] Clone creates correct structure
- [x] File API uses same structure
- [x] Terminal uses correct working directory
- [x] Git operations in correct path
- [x] Build successful
- [x] No TypeScript errors

---

## 🎯 For Users

### If You See "Repository not found" Error:

1. **Go to Dashboard**
2. **Find your repository**
3. **Click "Open in Workspace"** again
4. **Wait for re-clone** (shows progress)
5. **Files should now load**

The repository will be cloned to the correct location with the proper path structure.

---

## 🔐 Security Notes

✅ **Path structure still secure:**
- Users can only access their own user directory
- Repository ownership verified on every request
- Path traversal protection in place
- Authentication required

✅ **Structure benefits:**
- Easier to manage per-user repositories
- Clear separation between users
- Consistent with clone implementation
- Easier debugging and troubleshooting

---

## 📊 Migration Summary

| Component | Old Path | New Path | Status |
|-----------|----------|----------|--------|
| Clone route | `user-repos/{userId}/{name}` | Same | ✅ No change |
| File API | `user-repos/{repoId}` | `user-repos/{userId}/{name}` | ✅ Fixed |
| Terminal | `user-repos/{repoId}` | `user-repos/{userId}/{name}` | ✅ Fixed |
| Git helper | `user-repos/{repoId}` | `user-repos/{userId}/{name}` | ✅ Fixed |

---

## ✅ Complete!

The path structure is now consistent across all components. Users can:
- ✅ Clone repositories
- ✅ View files
- ✅ Edit files
- ✅ Execute terminal commands
- ✅ Run git operations

All in the correct, secure, and consistent path structure!

**Note:** Existing cloned repositories will need to be re-cloned to use the new path structure.
