#!/bin/bash

# Portfolio Deployment Script
# This script handles the deployment process on the LightSail instance

set -e  # Exit on any error

echo "🚀 Starting portfolio deployment..."

# Configuration
PORTFOLIO_DIR="/home/ubuntu/apps/qa-portfolio"
DOCKER_COMPOSE_DIR="/home/ubuntu/apps/todo-app"
CONTAINER_NAME="portfolio"
IMAGE_NAME="todo-app-portfolio"

# Navigate to portfolio directory
echo "📁 Navigating to portfolio directory..."
cd "$PORTFOLIO_DIR"

# Pull latest changes
echo "📥 Pulling latest changes from Git..."
if git pull origin main 2>/dev/null || git pull origin master 2>/dev/null; then
    echo "✅ Successfully pulled latest changes"
else
    echo "❌ Failed to pull changes from Git"
    exit 1
fi

# Navigate to docker-compose directory
echo "📁 Navigating to docker-compose directory..."
cd "$DOCKER_COMPOSE_DIR"

# Stop current portfolio container
echo "🛑 Stopping current portfolio container..."
docker-compose stop "$CONTAINER_NAME" || echo "⚠️  Container was not running"

# Remove old image to force rebuild
echo "🗑️  Removing old Docker image..."
docker image rm "$IMAGE_NAME" 2>/dev/null || echo "⚠️  Image not found, continuing..."

# Rebuild and start portfolio
echo "🔨 Building and starting new portfolio container..."
if docker-compose up -d "$CONTAINER_NAME"; then
    echo "✅ Container started successfully"
else
    echo "❌ Failed to start container"
    exit 1
fi

# Wait for container to be ready
echo "⏳ Waiting for container to be ready..."
sleep 15

# Check if container is running
echo "🔍 Checking container status..."
if docker ps | grep -q "$CONTAINER_NAME"; then
    echo "✅ Portfolio container is running"
    
    # Test if the site is responding
    echo "🌐 Testing site availability..."
    if curl -f -s https://andreirepo.com > /dev/null; then
        echo "✅ Site is responding successfully!"
        echo "🎉 Deployment completed successfully!"
        echo "🔗 Your portfolio is live at: https://andreirepo.com"
    else
        echo "⚠️  Site deployed but not responding yet (may need a few more seconds)"
        echo "🔗 Check your portfolio at: https://andreirepo.com"
    fi
else
    echo "❌ Portfolio container is not running"
    echo "📋 Container logs:"
    docker-compose logs "$CONTAINER_NAME" --tail=20
    exit 1
fi

echo "✨ Deployment script completed!"