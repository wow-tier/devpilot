#!/bin/bash

# Check repository directory structure
echo "=== Checking Repository Structure ==="
echo ""

# Get app directory
APP_DIR=$(pwd)
echo "App directory: $APP_DIR"
echo ""

# Check if user-repos exists
if [ -d "$APP_DIR/user-repos" ]; then
    echo "✓ user-repos directory exists"
    echo "Contents:"
    ls -la "$APP_DIR/user-repos"
    echo ""
    
    # Check subdirectories
    echo "User directories:"
    find "$APP_DIR/user-repos" -maxdepth 2 -type d
else
    echo "✗ user-repos directory does NOT exist"
    echo "Creating it now..."
    mkdir -p "$APP_DIR/user-repos"
    chmod 755 "$APP_DIR/user-repos"
    echo "✓ Created user-repos directory"
fi

echo ""
echo "=== Path Structure ==="
echo "Expected structure: user-repos/{userId}/{repoName}"
echo ""

# Find any cloned repos
echo "=== Looking for cloned repositories ==="
find "$APP_DIR" -name ".git" -type d 2>/dev/null | head -10

echo ""
echo "Done!"
