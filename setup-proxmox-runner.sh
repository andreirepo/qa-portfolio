#!/bin/bash

# Quick Setup Script for Proxmox GitHub Runner
# Run this on your Proxmox VM

set -e

echo "🚀 Setting up GitHub Actions Runner on Proxmox VM..."

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "❌ Please don't run as root. Run as regular user (ubuntu/your-user)"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "📦 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "⚠️  Please log out and log back in for Docker permissions to take effect"
    echo "Then run this script again"
    exit 0
fi

# Check if user is in docker group
if ! groups | grep -q docker; then
    echo "⚠️  Adding user to docker group..."
    sudo usermod -aG docker $USER
    echo "Please log out and log back in, then run this script again"
    exit 0
fi

# Test Docker
echo "🐳 Testing Docker..."
if ! docker ps &> /dev/null; then
    echo "❌ Docker is not working properly. Please check Docker installation"
    exit 1
fi

# Create runner directory
mkdir -p ~/github-runner
cd ~/github-runner

# Download smart-runner.sh (you'll need to copy-paste this manually)
echo "📝 Please copy the smart-runner.sh script to this directory"
echo "Current directory: $(pwd)"

# Check if script exists
if [ ! -f "smart-runner.sh" ]; then
    echo "❌ smart-runner.sh not found in current directory"
    echo "Please copy the script here first, then run this setup again"
    exit 1
fi

# Make executable
chmod +x smart-runner.sh

# Test the script
echo "🧪 Testing runner script..."
if ./smart-runner.sh status; then
    echo "✅ Script is working!"
else
    echo "❌ Script test failed"
    exit 1
fi

# Prompt for GitHub token
echo ""
echo "🔑 GitHub Token Setup:"
echo "1. Go to: https://github.com/settings/tokens"
echo "2. Create a new token with 'repo' and 'workflow' permissions"
echo "3. Copy the token"
echo ""
read -p "Enter your GitHub token: " GITHUB_TOKEN

# Test with token
echo "🧪 Testing with GitHub token..."
if GITHUB_TOKEN=$GITHUB_TOKEN ./smart-runner.sh start; then
    echo "✅ Runner started successfully!"
    sleep 5
    ./smart-runner.sh stop
    echo "✅ Runner stopped successfully!"
else
    echo "❌ Failed to start runner with provided token"
    exit 1
fi

# Create environment file
echo "💾 Creating environment file..."
cat > .env << EOF
GITHUB_TOKEN=$GITHUB_TOKEN
EOF

# Create start script
cat > start-auto.sh << 'EOF'
#!/bin/bash
cd ~/github-runner
source .env
nohup ./smart-runner.sh auto > runner.log 2>&1 &
echo $! > runner.pid
echo "🤖 Auto-management started in background"
echo "📊 Check status: ./smart-runner.sh status"
echo "📋 View logs: tail -f runner.log"
EOF

chmod +x start-auto.sh

# Create stop script
cat > stop-auto.sh << 'EOF'
#!/bin/bash
cd ~/github-runner
if [ -f runner.pid ]; then
    PID=$(cat runner.pid)
    if kill $PID 2>/dev/null; then
        echo "🛑 Auto-management stopped"
    else
        echo "⚠️  Process not found, cleaning up..."
    fi
    rm -f runner.pid
fi
./smart-runner.sh stop
EOF

chmod +x stop-auto.sh

echo ""
echo "🎉 Setup Complete!"
echo "==================="
echo ""
echo "📁 Runner directory: ~/github-runner"
echo ""
echo "🚀 To start auto-management:"
echo "   cd ~/github-runner && ./start-auto.sh"
echo ""
echo "🛑 To stop:"
echo "   cd ~/github-runner && ./stop-auto.sh"
echo ""
echo "📊 Check status anytime:"
echo "   cd ~/github-runner && ./smart-runner.sh status"
echo ""
echo "📋 View logs:"
echo "   cd ~/github-runner && tail -f runner.log"
echo ""
echo "🌐 Verify runner in GitHub:"
echo "   https://github.com/andreirepo/qa-portfolio/settings/actions/runners"