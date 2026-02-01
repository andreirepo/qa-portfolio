#!/bin/bash

# Manual deployment script - run this if GitHub Actions isn't working

echo "🚀 Manual deployment to LightSail..."

# Build the project locally first
echo "🔨 Building project locally..."
npm run build

echo "📤 Deploying to LightSail via SSH..."
echo "You'll need to run this command on your LightSail server:"
echo ""
echo "ssh your-lightsail-server"
echo "cd /home/ubuntu/apps/qa-portfolio"
echo "git pull origin main"
echo "cd /home/ubuntu/apps/todo-app"
echo "docker-compose stop portfolio"
echo "docker image rm todo-app-portfolio"
echo "docker-compose up -d portfolio"
echo ""
echo "Or run the deployment script directly:"
echo "cd /home/ubuntu/apps/qa-portfolio && chmod +x scripts/deploy.sh && ./scripts/deploy.sh"