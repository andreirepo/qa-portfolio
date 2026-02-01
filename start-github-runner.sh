#!/bin/bash

# GitHub Runner Startup Script for Proxmox

set -e

echo "🚀 Starting GitHub Actions Runner..."

# Configuration
REPO_URL="https://github.com/andreirepo/qa-portfolio"
GITHUB_TOKEN="${RUNNER_TOKEN:-}"
RUNNER_NAME="proxmox-runner-$(hostname)-$(date +%s)"

# Check if token is provided
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: GITHUB_TOKEN environment variable is required"
    echo "💡 Usage: GITHUB_TOKEN=your_token ./start-github-runner.sh"
    exit 1
fi

# Stop any existing runner
echo "🛑 Stopping any existing runner..."
docker stop github-runner 2>/dev/null || echo "No existing runner to stop"
docker rm github-runner 2>/dev/null || echo "No existing runner to remove"

# Start new ephemeral runner
echo "🔄 Starting new ephemeral runner: $RUNNER_NAME"
docker run -d \
  --name github-runner \
  --restart unless-stopped \
  -e REPO_URL="$REPO_URL" \
  -e ACCESS_TOKEN="$GITHUB_TOKEN" \
  -e RUNNER_NAME="$RUNNER_NAME" \
  -e RUNNER_WORKDIR="/tmp/runner/work" \
  -e EPHEMERAL="true" \
  -e DISABLE_AUTO_UPDATE="true" \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /tmp/runner:/tmp/runner \
  myoung34/github-runner:latest

echo "⏳ Waiting for runner to start..."
sleep 10

# Check if runner is running
if docker ps | grep -q github-runner; then
    echo "✅ GitHub runner started successfully!"
    echo "📋 Runner name: $RUNNER_NAME"
    echo "🔗 Repository: $REPO_URL"
    echo ""
    echo "📊 Check runner status:"
    echo "   docker logs github-runner"
    echo ""
    echo "🌐 Verify in GitHub:"
    echo "   Go to: $REPO_URL/settings/actions/runners"
else
    echo "❌ Failed to start runner"
    echo "📋 Check logs:"
    docker logs github-runner
    exit 1
fi