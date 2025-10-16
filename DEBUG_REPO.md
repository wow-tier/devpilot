# Repository URL Debug Guide

## Test the Repository URL Storage

### 1. Add a Repository via Dashboard
- Name: test-repo
- URL: https://github.com/username/repository
- Branch: main

### 2. Check Database
```bash
docker exec -it devpilot-db psql -U postgres -d devpilot

SELECT id, name, url, "defaultBranch" FROM "Repository";
```

### 3. Check API Response
Open browser console (F12), go to Network tab, add a repository, and check:
- POST /api/repositories request body
- POST /api/repositories response

### 4. Check Dashboard Display
The repository card should show:
- Repository name
- Branch name  
- **Full GitHub URL** (not "local" or anything else)

### 5. Common Issues

**Issue: Shows "local" or workspace path**
- Check: Is the URL actually being sent to the API?
- Check: Is the database saving the URL field?
- Check: Is the dashboard displaying repo.url?

**Issue: URL not saving**
- Check the API endpoint is receiving the URL
- Check Prisma is saving to the url field
- Check the database has the url column

### 6. Test Commands

```bash
# Check database schema
docker exec -it devpilot-db psql -U postgres -d devpilot -c "\d \"Repository\""

# Check actual data
docker exec -it devpilot-db psql -U postgres -d devpilot -c "SELECT * FROM \"Repository\";"

# Check API
curl -X GET http://localhost:3000/api/repositories \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 7. What Should Happen

1. **Add Repository:**
   ```
   Name: my-project
   URL: https://github.com/myuser/myrepo
   ```

2. **Saved to Database:**
   ```sql
   INSERT INTO "Repository" (url, ...) 
   VALUES ('https://github.com/myuser/myrepo', ...)
   ```

3. **Displayed in Dashboard:**
   ```
   Card shows:
   - Name: my-project
   - Branch: main
   - URL: https://github.com/myuser/myrepo ✅
   ```

If you see anything OTHER than your actual GitHub URL, there's a bug in the display logic.
