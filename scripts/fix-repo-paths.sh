#!/bin/bash

# Script to help migrate old repository structures to new format
# Run this if you have repositories in the old structure

APP_DIR=$(pwd)
REPOS_DIR="$APP_DIR/user-repos"

echo "=== Repository Path Migration Tool ==="
echo ""

# Check if user-repos exists
if [ ! -d "$REPOS_DIR" ]; then
    echo "Creating user-repos directory..."
    mkdir -p "$REPOS_DIR"
    chmod 755 "$REPOS_DIR"
    echo "✓ Created $REPOS_DIR"
fi

echo ""
echo "Current structure:"
echo "  Expected: user-repos/{userId}/{repoName}"
echo ""

# Show current contents
echo "Contents of user-repos/:"
ls -la "$REPOS_DIR"

echo ""
echo "=== Action Required ==="
echo ""
echo "Users need to RE-CLONE their repositories from the dashboard."
echo "The old clones (if any) used a different path structure."
echo ""
echo "Steps:"
echo "  1. Users log in to the application"
echo "  2. Go to Dashboard"
echo "  3. Click 'Open in Workspace' on any repository"
echo "  4. Repository will be cloned to correct location"
echo ""

# Check for any old-style directories (direct repo IDs in user-repos)
echo "Checking for old-style repository directories..."
OLD_STYLE=$(find "$REPOS_DIR" -maxdepth 1 -type d ! -name "user-repos" ! -name "." | wc -l)

if [ "$OLD_STYLE" -gt 0 ]; then
    echo "⚠️  Found $OLD_STYLE potential old-style directory(ies)"
    echo ""
    echo "These may be from the old path structure:"
    find "$REPOS_DIR" -maxdepth 1 -type d ! -name "user-repos" ! -name "."
    echo ""
    echo "You can safely remove these after users re-clone:"
    echo "  rm -rf $REPOS_DIR/cmg* (or specific directory names)"
else
    echo "✓ No old-style directories found"
fi

echo ""
echo "=== New Structure Example ==="
echo "user-repos/"
echo "  ├── {userId1}/"
echo "  │   ├── repository-name-1/"
echo "  │   └── repository-name-2/"
echo "  └── {userId2}/"
echo "      └── repository-name-3/"
echo ""

echo "Done!"
