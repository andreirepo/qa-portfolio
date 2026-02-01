#!/bin/bash

# LightSail Server Setup Script
# Run this script on your LightSail instance to set up the portfolio

set -e  # Exit on any error

echo "🚀 Setting up portfolio on LightSail server..."

# Configuration
PORTFOLIO_DIR="/home/ubuntu/apps/qa-portfolio"
TODO_APP_DIR="/home/ubuntu/apps/todo-app"

# Auto-detect repository URL from GitHub (assuming this script is run from a cloned repo)
if [ -d ".git" ]; then
    REPO_URL=$(git remote get-url origin 2>/dev/null || echo "")
    echo "📍 Detected repository URL: $REPO_URL"
else
    REPO_URL=""
fi

# If we can't detect the repo URL, ask for it
if [ -z "$REPO_URL" ]; then
    echo "⚠️  Could not auto-detect repository URL"
    echo "Please enter your GitHub repository URL (e.g., https://github.com/username/qa-portfolio.git):"
    read -p "Repository URL: " REPO_URL
    
    if [ -z "$REPO_URL" ]; then
        echo "❌ Repository URL is required"
        exit 1
    fi
fi

# Create apps directory
echo "📁 Creating directory structure..."
mkdir -p /home/ubuntu/apps
cd /home/ubuntu/apps

# Clone repository if it doesn't exist
if [ ! -d "qa-portfolio" ]; then
    echo "📥 Cloning portfolio repository..."
    echo "🔗 Repository: $REPO_URL"
    
    if git clone "$REPO_URL" qa-portfolio; then
        echo "✅ Successfully cloned repository"
    else
        echo "❌ Failed to clone repository"
        echo "Please check:"
        echo "  - Repository URL is correct"
        echo "  - Repository is public or you have access"
        echo "  - Internet connection is working"
        exit 1
    fi
else
    echo "📁 Portfolio directory already exists, pulling latest changes..."
    cd qa-portfolio
    
    # Check if this is a git repository
    if [ ! -d ".git" ]; then
        echo "❌ Existing directory is not a git repository"
        echo "Removing and re-cloning..."
        cd ..
        rm -rf qa-portfolio
        git clone "$REPO_URL" qa-portfolio
    else
        # Pull latest changes
        if git pull origin main 2>/dev/null || git pull origin master 2>/dev/null; then
            echo "✅ Successfully pulled latest changes"
        else
            echo "⚠️  Could not pull changes, but repository exists"
        fi
    fi
    cd ..
fi

# Verify todo-app directory exists
if [ ! -d "todo-app" ]; then
    echo "❌ todo-app directory not found at $TODO_APP_DIR"
    echo "Please make sure your todo-app is set up first with docker-compose.yml"
    exit 1
fi

# Check if docker-compose.yml includes portfolio service
if ! grep -q "portfolio:" "$TODO_APP_DIR/docker-compose.yml"; then
    echo "❌ Portfolio service not found in docker-compose.yml"
    echo "Please add the portfolio service to your docker-compose.yml file"
    echo "See the deployment documentation for details"
    exit 1
fi

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x "$PORTFOLIO_DIR/scripts/deploy.sh"
chmod +x "$PORTFOLIO_DIR/scripts/test-ci.sh"

# Test deployment
echo "🧪 Testing deployment..."
cd "$PORTFOLIO_DIR"
./scripts/deploy.sh

echo "✅ Server setup completed successfully!"
echo "🌟 Your portfolio should now be accessible"
echo "🔗 Check: https://andreirepo.com"
echo ""
echo "Next steps:"
echo "1. Add GitHub secrets (LIGHTSAIL_HOST, LIGHTSAIL_USER, LIGHTSAIL_SSH_KEY)"
echo "2. Push code to trigger automatic deployment"
echo "3. Monitor deployment in GitHub Actions"